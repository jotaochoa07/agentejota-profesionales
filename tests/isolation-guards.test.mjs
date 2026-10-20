import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import test from 'node:test';
import ts from 'typescript';

const verifierUrl = new URL('../scripts/verify-isolation.mjs', import.meta.url);
const original = readFileSync(verifierUrl, 'utf8').replace('import.meta.url', JSON.stringify(verifierUrl.href));
const require = createRequire(import.meta.url);
const tsxPath = 'src/components/professional-services/ProfessionalServicesLanding.tsx';
const cssPath = 'src/components/professional-services/professional-services.css';

function verifyWithMemoryMutation(path, before, after) {
  const verifier = original.replace('const read = (path) => readFileSync(join(root, path));',
    `const read = (path) => { const bytes = readFileSync(join(root, path)); return path === ${JSON.stringify(path)} ? Buffer.from(bytes.toString('utf8').replace(${JSON.stringify(before)}, ${JSON.stringify(after)})) : bytes; };`);
  const compiled = ts.transpileModule(verifier, { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText;
  const run = vm.runInThisContext('(function(require, exports, Buffer, process, console) {' + compiled + '\n})');
  run(require, {}, Buffer, { argv: [] }, { log() {} });
}

test('isolation guards accept the authorized refinement', () => {
  assert.doesNotThrow(() => verifyWithMemoryMutation('unused', '', ''));
});
test('isolation guards reject a benefit copy change outside the approved scope', () => {
  assert.throws(() => verifyWithMemoryMutation(tsxPath, 'Haz que tu trabajo valga más', 'Unauthorized change'), /outside the authorized/);
});
test('isolation guards reject any change to existing desktop geometry', () => {
  assert.throws(() => verifyWithMemoryMutation(cssPath, 'right: 16%;', 'right: 30%;'), /byte-identical/);
});
test('isolation guards reject a wrong video or reinstated portfolio escape', () => {
  assert.throws(() => verifyWithMemoryMutation(tsxPath, 'embed/xRJkmFE9w9w', 'embed/wrongVideo'));
});

test('isolation guards reject a new hero geometry override in the appended styles', () => {
  assert.throws(() => verifyWithMemoryMutation(cssPath, '--reveal-identity: .16;', 'width: 80%; --reveal-identity: .16;'), /must not override approved hero/);
});
