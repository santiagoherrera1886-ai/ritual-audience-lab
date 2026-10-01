const test = require('node:test');
const assert = require('node:assert/strict');
const {defaults, rebalance, calculate, sanitize} = require('../model.js');

test('zero budget produces zero reach, frequency and impressions', () => {
  const r = calculate({...defaults(),budget:0});
  assert.equal(r.reach,0);assert.equal(r.frequency,0);assert.equal(r.impressions,0);
});
test('redistribution always keeps five integer allocations adding to 100', () => {
  let shares=defaults().shares;
  for (let i=0;i<5;i++) for(let value=0;value<=100;value++) {
    shares=rebalance(shares,i,value);
    assert.equal(shares[i],value);
    assert.equal(shares.reduce((a,b)=>a+b,0),100);
    assert.ok(shares.every(v=>Number.isInteger(v)&&v>=0&&v<=100));
  }
  assert.deepEqual(rebalance([100,0,0,0,0],0,0),[0,25,25,25,25]);
});
test('greater investment increases impressions and reach without exceeding universe', () => {
  const base=defaults();let lastReach=0,lastImp=0;
  for(const budget of [0,10,100,300,600,1200,3000,6000]) {
    const r=calculate({...base,budget});
    assert.ok(r.reach>=lastReach&&r.reach<=r.universe);
    assert.ok(r.impressions>=lastImp);
    assert.ok(Number.isFinite(r.frequency));
    assert.ok(Math.abs(r.channels.reduce((sum,c)=>sum+c.spend,0)-r.budget)<.01);
    lastReach=r.reach;lastImp=r.impressions;
  }
});
test('single-channel plan never projects more than that channel coverage cap', () => {
  const r=calculate({...defaults(),budget:6000,shares:[100,0,0,0,0]});
  assert.ok(r.reach<=r.universe*.78);
  assert.ok(Math.abs(r.reach-r.channels[0].reach)<1e-6);
  assert.equal(r.channels[1].impressions,0);
});
test('CPM increases reduce impressions and invalid stored inputs cannot corrupt the model', () => {
  const baseline=calculate(defaults());
  const expensive=calculate({...defaults(),cpms:defaults().cpms.map(n=>n*2)});
  assert.ok(expensive.impressions<baseline.impressions);
  assert.ok(expensive.reach<baseline.reach);
  for(const raw of [null,{}, {budget:-1,universe:0,shares:[100,100],cpms:[0,-1,Infinity,NaN,1]}]) {
    const r=calculate(raw);assert.ok(Number.isFinite(r.reach));assert.ok(Number.isFinite(r.frequency));assert.ok(r.reach>=0&&r.reach<=r.universe);
    assert.equal(sanitize(raw).shares.reduce((a,b)=>a+b,0),100);
  }
});
test('curve scale supports projected budgets beyond the UI maximum', () => {
  const max={...defaults(),budget:6000};
  assert.equal(calculate(max,2).budget,12000000000);
  assert.equal(calculate(max,2).impressions,2*calculate(max).impressions);
});
