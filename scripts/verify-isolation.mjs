import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { readFileSync, readdirSync, lstatSync } from 'node:fs';
import { dirname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const approvedCommit = '164b14b0941958097ab397ee1cfee6935a0d9372';
const base = '/servicios-profesionales/';
const canonical = 'https://www.agentejota.com/servicios-profesionales';
const approved = (path) => execFileSync('git', ['show', `${approvedCommit}:${path}`], { cwd: root });
const migrateTsx = (value) => value
  .replace("const OWN_CENTER_ASSET_PATH = '/agentejota-profesionales/own-center';",
    'const ASSET_BASE_PATH = `${import.meta.env.BASE_URL}agentejota-profesionales`;\nconst OWN_CENTER_ASSET_PATH = `${ASSET_BASE_PATH}/own-center`;')
  .replace(/src="\/agentejota-profesionales\/([^"]+)"/g, (_, name) => 'src={`${ASSET_BASE_PATH}/' + name + '`}')
  .replace('href="/" aria-label="Jota Growth Partner, inicio"',
    'href={import.meta.env.BASE_URL} aria-label="Jota Growth Partner, inicio"');
const migrateHtml = (value) => value
  .replaceAll('https://agentejota.com/servicios-profesionales', canonical)
  .replaceAll('content="/agentejota-profesionales/jota-ochoa-preview-card.png"',
    `content="${canonical}/agentejota-profesionales/jota-ochoa-preview-card.png"`);
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
assert.deepEqual(read('docs/phase-a-manifest.json'), approved('docs/phase-a-manifest.json'), 'Historical manifest changed');
const paths = manifest.assets.map((asset) => asset.target).sort();
assert.deepEqual(walk(join(root, 'public')).sort(), paths);
for (const asset of manifest.assets) {
  const bytes = read(asset.target);
  assert.equal(bytes.length, asset.bytes);
  assert.equal(hash(bytes), asset.sha256, asset.target);
  assert(bytes.length < 10 * 1024 * 1024, 'Oversized blob: ' + asset.target);
}
for (const file of manifest.preservedFiles) {
  if (file.target.endsWith('.tsx')) {
    const baseline = approved(file.target);
    assert.equal(hash(baseline), file.targetSha256, 'Approved source differs from historical manifest');
    assert.deepEqual(read(file.target), Buffer.from(migrateTsx(baseline.toString('utf8'))),
      'Only the approved asset-prefix and home-link migration is permitted');
  } else {
    assert.equal(hash(read(file.target)), file.targetSha256, file.target);
  }
}
assert.equal(hash(read('src/index.css')), manifest.baseline.sha256);
const approvedHtml = approved('index.html');
assert.equal(hash(approvedHtml), manifest.html.targetSha256);
assert.deepEqual(read('index.html'), Buffer.from(migrateHtml(approvedHtml.toString('utf8'))), 'Unexpected HTML change');
assert.deepEqual(read('vite.config.ts'), Buffer.from(approved('vite.config.ts').toString('utf8')
  .replace('  plugins:', `  base: '${base}',\n  plugins:`)), 'Unexpected Vite configuration change');
const tsx = text('src/components/professional-services/ProfessionalServicesLanding.tsx');
assert.deepEqual([...tsx.matchAll(/^import .*?from ['"]([^'"]+)['"];?|^import ['"]([^'"]+)['"];?/gm)]
  .map((match) => match[1] ?? match[2]), ['react', './professional-services.css']);
const main = text('src/main.tsx');
assert(main.includes('<StrictMode>') && main.includes('<ProfessionalServicesLanding />'));
assert(!/App|LanguageProvider|Router/.test(main));
for (const path of [...walk(join(root, 'src')), 'index.html', 'vite.config.ts']) {
  const value = text(path);
  assert(!/['"\x60]\/(?:professional-services|local-services|agents|images|videos)\/|jotaochoa\.web/.test(value), path);
  assert(!/process\.env|import\.meta\.env|analytics|vercel\.json/i.test(
    value.replaceAll('import.meta.env.BASE_URL', '')), path);
  for (const match of value.matchAll(/['"](\/agentejota-profesionales\/[^'"]+\.(?:png|svg|mp4))['"]/g)) {
    assert(paths.includes('public' + match[1]), 'Missing asset: ' + match[1]);
  }
}
assert(tsx.includes('const OWN_CENTER_ASSET_PATH = `${ASSET_BASE_PATH}/own-center`;'));
assert.equal((tsx.match(/import\.meta\.env\.BASE_URL/g) ?? []).length, 2);
assert(!/src="\/agentejota-profesionales\//.test(tsx));
for (const name of ['desktop.mp4', 'mobile.mp4', 'desktop-7.30.png', 'mobile-7.30.png']) {
  assert(paths.includes('public/agentejota-profesionales/own-center/' + name));
}
const html = text('index.html');
assert.equal([...html.matchAll(/<script[^>]+src="([^"]+)"/g)].map((match) => match[1]).join(), '/src/main.tsx');
assert.deepEqual([...html.matchAll(/https?:\/\/[^"']+\.(?:png|jpg|svg|mp4)/g)].map((match) => match[0]),
  Array(2).fill(`${canonical}/agentejota-profesionales/jota-ochoa-preview-card.png`));
assert(!/professional-services-eyebrow">\s*\d{2}[\s·—-]/.test(tsx));
assert.deepEqual([...text('vite.config.ts').matchAll(/from ['"]([^'"]+)['"]/g)].map((match) => match[1]),
  ['vite', '@vitejs/plugin-react', '@tailwindcss/vite']);
const packageJson = JSON.parse(text('package.json'));
for (const version of Object.values({ ...packageJson.dependencies, ...packageJson.devDependencies })) {
  assert(/^\d+\.\d+\.\d+$/.test(version), 'Dependency not pinned: ' + version);
}
assert(!readdirSync(root).some((name) => ['.vercel', '.github', '.env'].includes(name)));
const routing = JSON.parse(text('vercel.json'));
assert.deepEqual(routing, { rewrites: [
  { source: '/servicios-profesionales', destination: '/index.html' },
  { source: base, destination: '/index.html' },
  { source: `${base}assets/:path*`, destination: '/assets/:path*' },
  { source: `${base}agentejota-profesionales/:path*`, destination: '/agentejota-profesionales/:path*' },
] }, 'Child routing must remain scoped to the professional prefix');
if (process.argv.includes('--build')) {
  const builtHtml = text('dist/index.html');
  const refs = [...builtHtml.matchAll(/(?:src|href)="([^"]+)"/g)]
    .map((match) => match[1]).filter((url) => url.startsWith('/'));
  assert(refs.length >= 3, 'Expected built JS, CSS and favicon');
  for (const url of refs) {
    assert(url.startsWith(base), 'Unprefixed built resource: ' + url);
    assert(!url.slice(base.length).includes(base), 'Double asset prefix: ' + url);
    const relativePath = url.slice(base.length);
    assert(/^(assets|agentejota-profesionales)\//.test(relativePath), 'Unexpected built resource scope');
    assert(lstatSync(join(root, 'dist', relativePath)).isFile(), 'Missing built resource: ' + url);
  }
  for (const asset of manifest.assets) {
    assert.equal(hash(read('dist/' + asset.target.slice('public/'.length))), asset.sha256, 'Built asset changed');
  }
  const builtJs = walk(join(root, 'dist/assets')).filter((path) => path.endsWith('.js')).map(text).join('\n');
  assert(builtJs.includes(`${base}agentejota-profesionales`), 'Runtime base missing from built JS');
  assert(!builtJs.includes(`${base}${base.slice(1)}`), 'Double prefix in built JS');
}
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
    if (file.target.endsWith('.tsx')) bytes = Buffer.from(migrateTsx(bytes.toString('utf8')));
    assert.deepEqual(read(file.target), bytes, file.target + ' exact source parity plus authorized prefix migration');
  }
  const lines = readFileSync(join(sourceRoot, 'src/index.css'), 'utf8').match(/[^\r\n]*(?:\r\n|\n|$)/g);
  const baseline = manifest.baseline.ranges.map(([start, end]) => lines.slice(start - 1, end).join('')).join('\n');
  assert.deepEqual(read('src/index.css'), Buffer.from(baseline));
  const sourceHtml = readFileSync(join(sourceRoot, 'servicios-profesionales.html'), 'utf8')
    .replaceAll('/favicon.svg', '/agentejota-profesionales/favicon.svg')
    .replaceAll('https://agentejota.com/agents/jota-ochoa-preview-card.png', '/agentejota-profesionales/jota-ochoa-preview-card.png');
  assert.deepEqual(read('index.html'), Buffer.from(migrateHtml(sourceHtml)));
}
console.log('PASS: isolated imports, 9 unchanged namespaced assets, pinned dependencies, historical hashes, exact prefix migration, scoped child routing' +
  (sourceFlag !== -1 ? '; source inputs unchanged and byte comparisons verified.' : '.'));
