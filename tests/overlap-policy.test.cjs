const test = require('node:test');
const assert = require('node:assert/strict');
const Policy = require('../overlap-policy.js');
const Product = require('../product-model.js');
const Commercial = require('../commercial-model.js');
const Media = require('../model.js');

test('default is zero and legacy or invalid values never restore the previous 10% cap', () => {
  for (const value of [undefined, null, NaN, Infinity, -Infinity, '10', {}, -1, 0, .1, .5, 1, 1.01, 10, 100]) {
    const expected = Number.isFinite(value) ? Math.max(0, Math.min(1, value)) : 0;
    assert.equal(Policy.sanitizePercent(value), expected);
    assert.equal(Product.sanitize({dayShare:70, overlapPercent:value}).overlapPercent, expected);
    assert.equal(Commercial.sanitize({overlap:value}).overlap, expected);
  }
  assert.equal(Product.ASSUMPTIONS.maxOverlapPercent, 1);
  assert.equal(Commercial.defaults().overlap, 0);
});

test('commercial public helpers cannot bypass the 1% bound', () => {
  for (const cap of [undefined, NaN, Infinity, -5, 0, .1, .5, 1, 10, 100]) {
    const u = Commercial.union(9e6, 6e6, cap);
    assert(u.overlap >= 0 && u.overlap <= 60000);
    assert.equal(u.net, 15e6-u.overlap);
    for (const share of [0,.01,.4,.5,.99,1]) {
      const a = Commercial.allocate(24e6, share, cap);
      assert(a.overlap >= 0 && a.overlap <= Math.min(a.day,a.night)*.01);
      assert(Math.abs(a.net-24e6)<1e-7);
    }
  }
  assert.equal(Commercial.union(9e6,6e6,1).net,14940000);
});

test('every wave respects 1% at small and large universes, extreme CPMs and unequal product shares', () => {
  for (const universe of [.1,15,24,33.274]) for (const cpm of [100,10000,1000000]) {
    const state = {...Media.defaults(), universe, budget:6000, cpms:[cpm,cpm,cpm,cpm,cpm]};
    for (const dayShare of [0,1,10,50,70,99,100]) {
      const p = Product.calculate({dayShare,overlapPercent:100},state);
      for (const r of p.waves) {
        const smaller = Math.min(r.day,r.night);
        assert(r.overlap <= smaller*.01, `cap exceeded: ${r.overlap} / ${smaller}`);
        assert(r.overlapPercent <= 1);
        assert(r.dayOnly>=0 && r.nightOnly>=0);
        assert(Math.abs(r.day+r.night-r.overlap-r.reach)<1e-7);
      }
    }
  }
});

test('all commercial scenarios and required reach honor the same cap after importing legacy values', () => {
  const r = Commercial.calculate({...Commercial.defaults(), overlap:10});
  assert.equal(r.state.overlap,1);
  for (const {day,night,overlap} of [r.demand.reach,r.active.pools,r.active.net,...r.comparisons.flatMap(s=>[s.pools,s.net])]) {
    assert(overlap<=Math.min(day,night)*.01);
  }
});


test('CSV integer counts never round the overlap above the limit and still reconcile', () => {
  for (const universe of [.1,15,24,33.274]) for (const budget of [0,.01,.1,300,6000]) {
    for (const overlapPercent of [0,.1,.5,1]) for (const dayShare of [0,1,30,50,99,100]) {
      const p=Product.calculate({dayShare,overlapPercent},{...Media.defaults(),universe,budget});
      for (const wave of p.waves) {
        const r=Product.toPeople(wave);
        assert(r.overlap<=Math.min(r.day,r.night)*overlapPercent/100);
        assert.equal(r.day+r.night-r.overlap,r.reach);
        assert.equal(r.dayOnly+r.nightOnly+r.overlap,r.reach);
        assert(r.dayOnly>=0 && r.nightOnly>=0 && r.overlap>=0);
      }
    }
  }
});
