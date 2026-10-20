import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import test from 'node:test';
import ts from 'typescript';

const path = 'src/components/professional-services/ProfessionalServicesLanding.tsx';
const source = readFileSync(new URL('../' + path, import.meta.url), 'utf8')
  .replaceAll('import.meta.env.BASE_URL', "'/servicios-profesionales/'") + '\nexport { ProfessionalSpecimen, ProfessionalServicesProcess, ProfessionalServicesPresentation };';
const compiled = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.React } }).outputText;

function mount({ reduced = false, desktop = false } = {}) {
  const timers = new Map();
  const cleanups = [];
  let timerId = 0;
  let stateCursor = 0;
  const states = [];
  const React = {
    createElement: (type, props, ...children) => ({ type, props: props ?? {}, children }),
    Fragment: 'fragment',
    useRef: (value) => ({ current: value }),
    useState: (value) => { const index = stateCursor++; if (!(index in states)) states[index] = typeof value === 'function' ? value() : value; return [states[index], (next) => { states[index] = next; }]; },
    useEffect: (effect) => { const cleanup = effect(); if (cleanup) cleanups.push(cleanup); },
  };
  const context = { exports: {}, require: (name) => name === 'react' ? React : {}, window: {
    matchMedia: (query) => ({ matches: query.includes('reduced-motion') ? reduced : query.includes('min-width') ? desktop : !desktop }),
    PointerEvent: class {},
    performance: { now: () => 100 },
    setTimeout: (callback, delay) => { timers.set(++timerId, { callback, delay }); return timerId; },
    clearTimeout: (id) => timers.delete(id),
  } };
  vm.runInNewContext(compiled, context);
  const tree = context.exports.ProfessionalSpecimen();
  const values = new Map();
  const rect = { left: 50, top: 100, width: 200, height: 400, right: 250, bottom: 500 };
  const hero = { dataset: {}, style: { setProperty: (name, value) => values.set(name, value) }, querySelector: () => ({ getBoundingClientRect: () => rect }) };
  const event = (overrides = {}) => ({ currentTarget: hero, target: { closest: () => null }, pointerId: 1, pointerType: 'touch', isPrimary: true, buttons: 0, clientX: 134, clientY: 216, ...overrides });
  return { tree, values, timers, event, cleanup: () => cleanups.forEach((cleanup) => cleanup()), finish: () => { for (const [id, timer] of timers) { timers.delete(id); timer.callback(); } }, process: () => { stateCursor = 2; return context.exports.ProfessionalServicesProcess(); }, presentation: () => { stateCursor = 2; return context.exports.ProfessionalServicesPresentation(); }, landing: () => context.exports.ProfessionalServicesLanding() };
}

for (const finishEvent of ['onPointerUp', 'onPointerCancel']) {
  test(`a short touch reveals immediately and survives ${finishEvent} before settling`, () => {
    const instance = mount();
    instance.tree.props.onPointerDown(instance.event());
    assert.equal(instance.values.get('--reveal-identity'), '1');
    assert.equal(instance.values.get('--light-x'), '42.00%');
    assert.equal(instance.values.get('--light-y'), '29.00%');
    instance.tree.props[finishEvent](instance.event());
    assert.equal(instance.values.get('--reveal-identity'), '1', 'a short tap must not disappear before the opacity transition');
    assert.equal(instance.timers.size, 1);
    assert.equal([...instance.timers.values()][0].delay, 800);
    instance.finish();
    assert.equal(instance.values.get('--reveal-identity'), '0');
  });
}

test('only the primary owned touch moves the light; links do not trigger it', () => {
  const instance = mount();
  instance.tree.props.onPointerDown(instance.event({ target: { closest: () => ({ tagName: 'A' }) } }));
  assert.equal(instance.values.size, 0);
  instance.tree.props.onPointerDown(instance.event());
  instance.tree.props.onPointerMove(instance.event({ pointerId: 2, isPrimary: false, buttons: 1, clientX: 230 }));
  assert.equal(instance.values.get('--light-x'), '42.00%');
  instance.tree.props.onPointerUp(instance.event({ pointerId: 2, isPrimary: false }));
  assert.equal(instance.timers.size, 0);
  instance.tree.props.onPointerMove(instance.event({ clientX: 150 }));
  assert.equal(instance.values.get('--light-x'), '50.00%');
  instance.tree.props.onPointerMove(instance.event({ clientX: 700 }));
  assert.notEqual(instance.values.get('--light-x'), '325.00%');
});

test('mouse hover keeps the approved trail and immediately resets on leaving', () => {
  const instance = mount({ desktop: true });
  instance.tree.props.onPointerMove(instance.event({ pointerType: 'mouse' }));
  assert.equal(instance.values.get('--reveal-identity'), '1');
  assert.equal(instance.values.get('--trail-strength'), '.28');
  instance.tree.props.onPointerLeave(instance.event({ pointerType: 'mouse' }));
  assert.equal(instance.values.get('--reveal-identity'), '0');
  assert.equal(instance.timers.size, 0);
});

test('cleanup cancels touch hold timers and reduced motion exposes a static fallback', () => {
  const instance = mount({ reduced: true });
  assert.match(instance.tree.props.className, /has-static-portrait/);
  instance.tree.props.onPointerDown(instance.event());
  instance.tree.props.onPointerUp(instance.event());
  instance.cleanup();
  assert.equal(instance.timers.size, 0);
});

function find(tree, predicate) {
  if (!tree || typeof tree !== 'object') return null;
  if (predicate(tree)) return tree;
  return tree.children?.flat(Infinity).map((child) => find(child, predicate)).find(Boolean) ?? null;
}

test('keyboard users can reveal without a pointer, then dismiss', () => {
  const instance = mount();
  const button = find(instance.tree, (node) => node.type === 'button' && node.props.className === 'ps-reveal-keyboard');
  assert(button, 'a real keyboard button is required');
  button.props.onClick({ currentTarget: { closest: () => instance.event().currentTarget } });
  assert.equal(instance.values.get('--reveal-identity'), '1');
  button.props.onKeyDown({ key: 'Escape', currentTarget: { closest: () => instance.event().currentTarget } });
  assert.equal(instance.values.get('--reveal-identity'), '0');
});

test('the presentation uses consent-friendly video activation and process removes the portfolio escape', () => {
  const instance = mount();
  const process = instance.presentation();
  assert.equal(find(process, (node) => node.type === 'iframe'), null, 'no third-party request before activation');
  const play = find(process, (node) => node.type === 'button' && node.props['aria-label']?.includes('Reproducir'));
  assert(play);
  assert(!JSON.stringify(instance.process()).includes('Conoce nuestro portafolio'));
});
test('native touch leaving the hit area does not black out or take pointer capture', () => {
  const instance = mount();
  instance.tree.props.onPointerDown(instance.event());
  instance.tree.props.onPointerLeave(instance.event());
  assert.equal(instance.values.get('--reveal-identity'), '1');
  assert.equal(instance.timers.size, 0);
  instance.tree.props.onPointerDown(instance.event({ pointerId: 2, clientX: 230 }));
  assert.equal(instance.values.get('--light-x'), '42.00%');
  instance.tree.props.onPointerCancel(instance.event());
  instance.tree.props.onPointerDown(instance.event());
  assert.equal(instance.timers.size, 0, 'a fresh touch cancels the previous delayed fade');
});

test('reduced-motion cascade suppresses both active and settling touch transitions', () => {
  const css = readFileSync(new URL('../src/components/professional-services/professional-services.css', import.meta.url), 'utf8');
  const delta = css.slice(css.indexOf('/* Authorized final touch reveal'));
  const reducedRules = delta.slice(delta.lastIndexOf('@media (prefers-reduced-motion: reduce)'));
  // Evaluate the competing declarations with their real importance and selector specificity.
  const rules = [...delta.matchAll(/([^{}]+)\{([^{}]+)\}/g)];
  for (const active of [true, false]) {
    for (const layer of ['identity', 'gaze']) {
      const candidates = [];
      for (const [order, match] of rules.entries()) {
        if (!match[1].includes(`.ps-portrait-${layer}`)) continue;
        if (!active && match[1].includes('[data-reveal-active="true"]')) continue;
        const declaration = match[2].match(/transition(?:-duration)?\s*:\s*([^;]+)/);
        if (!declaration) continue;
        const important = declaration[1].includes('!important');
        const selector = match[1].split(',').find((value) => value.includes(`.ps-portrait-${layer}`));
        const specificity = (selector.match(/\.[\w-]+|\[[^\]]+\]/g) ?? []).length;
        candidates.push({ important, specificity, order, value: declaration[1].replace(/\s*!important/, '').trim() });
      }
      candidates.sort((a, b) => Number(a.important) - Number(b.important) || a.specificity - b.specificity || a.order - b.order);
      assert.equal(candidates.at(-1).value, 'none', `${layer}, active=${active}: reduced motion must win the touch cascade`);
    }
  }
  assert.match(reducedRules, /\.ps-reveal-hint\s*\{ transition: none !important;/);
});

test('the video shows its original YouTube thumbnail and clear CTA, then loads only the approved iframe', () => {
  const instance = mount();
  const initial = instance.presentation();
  const image = find(initial, (node) => node.type === 'img' && node.props.className === 'ps-presentation-thumbnail');
  assert.equal(image.props.src, 'https://i.ytimg.com/vi/xRJkmFE9w9w/maxresdefault.jpg');
  const label = find(initial, (node) => node.props.className === 'ps-presentation-play-label');
  assert(label.children.includes(' Ver video'));
  assert.equal(find(initial, (node) => node.type === 'iframe'), null);
  assert.equal(find(initial, (node) => node.props.className === 'professional-services-video-caption'), null);
  assert(!JSON.stringify(initial).includes('¿Qué encuentra'));
  const play = find(initial, (node) => node.type === 'button' && node.props['aria-label']?.includes('Reproducir'));
  play.props.onClick();
  const activated = instance.presentation();
  const iframe = find(activated, (node) => node.type === 'iframe');
  assert.equal(iframe.props.src, 'https://www.youtube.com/embed/xRJkmFE9w9w');
  assert.equal(iframe.props.referrerPolicy, 'strict-origin-when-cross-origin');
  assert.equal(find(activated, (node) => node.type === 'button'), null);
});

test('the independent presentation occurs exactly once immediately before benefits', () => {
  const instance = mount();
  const landing = instance.landing();
  const main = find(landing, (node) => node.type === 'main');
  const components = main.children.flat(Infinity).filter((node) => typeof node?.type === 'function').map((node) => node.type.name);
  assert.deepEqual(components, ['ProfessionalSpecimen', 'ProfessionalServicesPresentation', 'ProfessionalServicesBenefits', 'ProfessionalServicesProcess']);
  const process = instance.process();
  assert.equal(find(process, (node) => node.props.className?.includes('ps-presentation-video')), null);
  assert(find(process, (node) => node.props.className === 'ps-process-story'));
  const presentation = instance.presentation();
  assert.equal(presentation.type, 'section');
  assert.equal(presentation.props.className, 'ps-presentation-section');
  assert.equal(presentation.props.id, 'professional-services-presentation');
  assert(find(presentation, (node) => node.props.className?.includes('ps-presentation-video')));
});
