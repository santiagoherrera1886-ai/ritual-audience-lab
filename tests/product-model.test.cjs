const test=require('node:test');
const assert=require('node:assert/strict');
const Model=require('../product-model.js');

test('reference plan reconciles product universes, overlap, unique reach and coverage',()=>{
  const p=Model.calculate({dayShare:60}),r=p.final;
  assert.equal(p.universe,14e6);
  assert(Math.abs(r.day-8.6e6)<1e-6);assert(Math.abs(r.night-7.8e6)<1e-6);
  assert(Math.abs(r.overlap-2.4e6)<1e-6);assert(Math.abs(r.reach-14e6)<1e-6);
  assert.equal(r.coverage,1);assert(Math.abs(r.frequency-r.impressions/r.reach)<1e-10);
});
test('all allocations keep reach bounded and overlap physically possible across the 12 waves',()=>{
  for(let share=0;share<=100;share++){
    const p=Model.calculate({dayShare:share});let previous=0;
    assert.equal(p.dayShare+p.nightShare,100);
    for(const r of p.waves){
      assert(r.reach>=previous-1e-6);assert(r.reach<=p.universe+1e-6);
      assert(r.overlap>=0&&r.overlap<=Math.min(r.day,r.night));
      assert(r.frequency>=1&&Number.isFinite(r.frequency));
      assert(Math.abs(r.reach-(r.day+r.night-r.overlap))<1e-6);previous=r.reach;
    }
  }
});
test('single-product plans have no intersection or impressions from the inactive product',()=>{
  const day=Model.calculate({dayShare:100}).final,night=Model.calculate({dayShare:0}).final;
  assert.equal(day.night,0);assert.equal(day.nightFrequency,0);assert.equal(day.overlap,0);assert.equal(day.reach,day.day);
  assert.equal(night.day,0);assert.equal(night.dayFrequency,0);assert.equal(night.overlap,0);assert.equal(night.reach,night.night);
});
test('invalid persisted shares fall back safely and out-of-range inputs are bounded',()=>{
  assert.deepEqual(Model.sanitize(null),{dayShare:60});assert.deepEqual(Model.sanitize({dayShare:NaN}),{dayShare:60});
  assert.equal(Model.sanitize({dayShare:140}).dayShare,100);assert.equal(Model.sanitize({dayShare:-40}).dayShare,0);
});
