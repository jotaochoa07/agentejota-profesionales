import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync, readdirSync, lstatSync } from 'node:fs';
import { dirname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const manifest = JSON.parse(readFileSync(join(root, 'docs/phase-a-manifest.json'), 'utf8'));
const hash = (bytes) => createHash('sha256').update(bytes).digest('hex');
const read = (path) => readFileSync(join(root, path));
const text = (path) => read(path).toString('utf8');
const walk = (directory) => readdirSync(directory).flatMap((name) => {
  const path = join(directory, name);
  const stat = lstatSync(path);
  assert(!stat.isSymbolicLink(), 'Shared/symlinked file: ' + relative(root, path));
  return stat.isDirectory() ? walk(path) : [relative(root, path).replaceAll('\\', '/')];
});
const paths = manifest.assets.map((asset) => asset.target).sort();
assert.deepEqual(walk(join(root, 'public')).sort(), paths);
for (const asset of manifest.assets) {
  const bytes = read(asset.target);
  assert.equal(bytes.length, asset.bytes);
  assert.equal(hash(bytes), asset.sha256, asset.target);
  assert(bytes.length < 10 * 1024 * 1024, 'Oversized blob: ' + asset.target);
}
for (const file of manifest.preservedFiles) assert.equal(hash(read(file.target)), file.targetSha256, file.target);
assert.equal(hash(read('src/index.css')), manifest.baseline.sha256);
assert.equal(hash(read('index.html')), manifest.html.targetSha256);
const tsx = text('src/components/professional-services/ProfessionalServicesLanding.tsx');
assert.deepEqual([...tsx.matchAll(/^import .*?from ['"]([^'"]+)['"];?|^import ['"]([^'"]+)['"];?/gm)]
  .map((match) => match[1] ?? match[2]), ['react', './professional-services.css']);
const main = text('src/main.tsx');
assert(main.includes('<StrictMode>') && main.includes('<ProfessionalServicesLanding />'));
assert(!/App|LanguageProvider|Router/.test(main));
for (const path of [...walk(join(root, 'src')), 'index.html', 'vite.config.ts']) {
  const value = text(path);
  assert(!/['"\x60]\/(?:professional-services|local-services|agents|images|videos)\/|jotaochoa\.web/.test(value), path);
  assert(!/process\.env|import\.meta\.env|analytics|vercel\.json/i.test(value), path);
  for (const match of value.matchAll(/['"](\/agentejota-profesionales\/[^'"]+\.(?:png|svg|mp4))['"]/g)) {
    assert(paths.includes('public' + match[1]), 'Missing asset: ' + match[1]);
  }
}
assert(tsx.includes("const OWN_CENTER_ASSET_PATH = '/agentejota-profesionales/own-center';"));
for (const name of ['desktop.mp4', 'mobile.mp4', 'desktop-7.30.png', 'mobile-7.30.png']) {
  assert(paths.includes('public/agentejota-profesionales/own-center/' + name));
}
const html = text('index.html');
assert.equal([...html.matchAll(/<script[^>]+src="([^"]+)"/g)].map((match) => match[1]).join(), '/src/main.tsx');
assert(!/https?:\/\/[^"']+\.(?:png|jpg|svg|mp4)/.test(html));
assert(!/professional-services-eyebrow">\s*\d{2}[\s·—-]/.test(tsx));
assert.deepEqual([...text('vite.config.ts').matchAll(/from ['"]([^'"]+)['"]/g)].map((match) => match[1]),
  ['vite', '@vitejs/plugin-react', '@tailwindcss/vite']);
const packageJson = JSON.parse(text('package.json'));
for (const version of Object.values({ ...packageJson.dependencies, ...packageJson.devDependencies })) {
  assert(/^\d+\.\d+\.\d+$/.test(version), 'Dependency not pinned: ' + version);
}
assert(!readdirSync(root).some((name) => ['.vercel', 'vercel.json', '.github', '.env'].includes(name)));
const sourceFlag = process.argv.indexOf('--source');
if (sourceFlag !== -1) {
  assert(process.argv[sourceFlag + 1]);
  const sourceRoot = resolve(process.argv[sourceFlag + 1]);
  assert.notEqual(sourceRoot, root);
  for (const input of manifest.sourceInputs) {
    assert.equal(hash(readFileSync(join(sourceRoot, input.path))), input.sha256, 'Source changed: ' + input.path);
  }
  for (const file of manifest.preservedFiles) {
    let bytes = readFileSync(join(sourceRoot, file.source));
    if (file.transform === 'asset-namespace-only') {
      bytes = Buffer.from(bytes.toString('utf8').replaceAll('/professional-services/', '/agentejota-profesionales/'));
    }
    assert.deepEqual(read(file.target), bytes, file.target + ' exact source parity');
  }
  const lines = readFileSync(join(sourceRoot, 'src/index.css'), 'utf8').match(/[^\r\n]*(?:\r\n|\n|$)/g);
  const baseline = manifest.baseline.ranges.map(([start, end]) => lines.slice(start - 1, end).join('')).join('\n');
  assert.deepEqual(read('src/index.css'), Buffer.from(baseline));
  const sourceHtml = readFileSync(join(sourceRoot, 'servicios-profesionales.html'), 'utf8')
    .replaceAll('/favicon.svg', '/agentejota-profesionales/favicon.svg')
    .replaceAll('https://agentejota.com/agents/jota-ochoa-preview-card.png', '/agentejota-profesionales/jota-ochoa-preview-card.png');
  assert.deepEqual(read('index.html'), Buffer.from(sourceHtml));
}
console.log('PASS: isolated imports, direct root, 9 namespaced assets, pinned dependencies, preserved hashes, no shared media or production config' +
  (sourceFlag !== -1 ? '; source inputs unchanged and byte comparisons verified.' : '.'));
