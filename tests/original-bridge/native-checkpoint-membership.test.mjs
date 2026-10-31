import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';
import { tokens } from '../../scripts/build-original-swf.mjs';
import { methodBodyRange } from '../../scripts/lib/original-phase-profile.mjs';

const cp = readFileSync(new URL('../../tools/original-bridge/CMain.checkpoint.asinc', import.meta.url), 'utf8');
const bridge = readFileSync(new URL('../../tools/original-bridge/CMain.bridge.asinc', import.meta.url), 'utf8');
function method(source, name) {
  const range = methodBodyRange(source, name, tokens);
  return source.slice(source.lastIndexOf('function ' + name + '(', range.start), range.end + 1).replace(/^function /, '');
}
function makeMain(names, globals = {}) {
  const CMain = runInNewContext('(class CMain {' + names.map(name => method(cp, name)).join('\n') + '})',
    { _global: { boxheadNativeGraphV1: () => ({version: 1, contract: 'bh-avm1-graph-v1'}) }, ...globals });
  return { CMain, main: new CMain() };
}
const eligible = () => ({membershipVersion: 2, mode: 'DeathMatch', initialPlayers: 1, playerCount: 1,
  personalProgression: true, guestGeneration: 0});

test('capability is confined to first solo DeathMatch and retains legacy behavior', () => {
  const {main} = makeMain(['BH_CheckpointAvailable']);
  main.mBH = eligible();
  assert.equal(main.BH_CheckpointAvailable(), true);
  for (const [key, value] of [['membershipVersion', 1], ['mode', 'Coop'], ['initialPlayers', 2],
    ['playerCount', 2], ['personalProgression', false], ['guestGeneration', 1], ['guestGeneration', undefined]]) {
    main.mBH = {...eligible(), [key]: value};
    assert.equal(main.BH_CheckpointAvailable(), false, key);
  }
  main.mBH = {membershipVersion: 0};
  assert.equal(main.BH_CheckpointAvailable(), true);
  assert.match(method(bridge, 'BH_Info'), /checkpointVersion = b\.membershipVersion === 2 \? 2 : 1/);
});

test('graph v2 records exact membership while legacy graph stays v1', () => {
  const {main} = makeMain(['BH_CPBuildRoot'], {CMain: {mInput: {}}, _root: {_quality: 'HIGH'}});
  main.mcWorld = {};
  main.BH_CPStaticSpecs = () => [];
  main.BH_CPWorldFields = main.BH_CPBridgeFields = () => [];
  main.BH_CPFieldPack = () => ({});
  main.mBH = {...eligible(), snapshot: {digest: 'digest'}};
  const root = main.BH_CPBuildRoot();
  assert.equal(root.schema, 'boxhead-world-checkpoint-v2');
  assert.equal(root.membershipVersion, 2);
  assert.equal(root.guestGeneration, 0);
  main.mBH.membershipVersion = 0;
  const legacy = main.BH_CPBuildRoot();
  assert.equal(legacy.schema, 'boxhead-world-checkpoint-v1');
  assert.equal(Object.hasOwn(legacy, 'membershipVersion'), false);
  assert.equal(Object.hasOwn(legacy, 'guestGeneration'), false);
});

test('import rejects wrong schema or generation before installing any native fields', () => {
  let graph;
  const globals = {_global: {boxheadNativeGraphV1: (op) => { assert.equal(op, 'import'); return graph; }},
    CMain: {BH_Integer: Number.isInteger}};
  const {main, CMain} = makeMain(['BH_CPRequire', 'BH_CheckpointImport'], globals);
  CMain.BH_Integer = Number.isInteger;
  main.mBH = {...eligible(), tick: 0, state: 'ready', localSlot: 2, replay: true};
  main.mcWorld = {mThing_Collection: {mPlayerThings: {}}, mHud: {mcPlayers: [{}]}};
  main.BH_CPAssertQuiescent = () => {};
  main.BH_CPAnchors = () => [];
  main.BH_Fail = message => ({error: message});
  main.BH_CPInstallFields = () => { throw new Error('installed'); };
  for (const [schema, membershipVersion, guestGeneration] of [
    ['boxhead-world-checkpoint-v1', 2, 0], ['boxhead-world-checkpoint-v2', 1, 0],
    ['boxhead-world-checkpoint-v2', 2, 1], ['boxhead-world-checkpoint-v2', 2, undefined],
  ]) {
    graph = {schema, membershipVersion, guestGeneration, tick: 25, digest: 'x'.repeat(26), mode: 'DeathMatch'};
    assert.match(main.BH_CheckpointImport('payload', 25, 'x'.repeat(26)).error, /checkpoint configuration differs/);
  }
});
