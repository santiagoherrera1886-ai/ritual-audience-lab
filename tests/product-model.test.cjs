const test=require('node:test');
const assert=require('node:assert/strict');
const Model=require('../product-model.js');
const Media=require('../model.js');
const close=(a,b)=>assert(Math.abs(a-b)<1e-5,`${a} ≠ ${b}`);

test('both views use the same 24M universe and budget-driven reach',()=>{
  const p=Model.calculate({dayShare:60}),r=p.final,m=Media.calculate(Media.defaults());
  assert.equal(p.universe,24e6);assert.equal(r.budget,600e6);
  close(r.reach,m.reach);assert.equal(r.impressions,m.impressions);
  assert(r.coverage>0&&r.coverage<1);
  close(r.frequency,r.impressions/r.reach);
  close(r.impressions,r.dayImpressions+r.nightImpressions);
});
test('all product allocations reconcile and stay physically possible across budgets and 12 waves',()=>{
  for(const budget of [0,300,600,1200,6000]) for(let share=0;share<=100;share++){
    const state={...Media.defaults(),budget};
    const p=Model.calculate({dayShare:share},state);let previous=0,previousDay=0,previousNight=0;
    assert.equal(p.dayShare+p.nightShare,100);
    for(const r of p.waves){
      assert(r.reach>=previous-1e-6&&r.reach<=p.universe+1e-6);
      assert(r.overlap>=0&&r.overlap<=Math.min(r.day,r.night)*.1+1e-6);
      assert(Number.isFinite(r.frequency)&&r.frequency>=(budget?1:0));
      close(r.reach,r.day+r.night-r.overlap);
      close(r.impressions,r.dayImpressions+r.nightImpressions);
      close(r.reach,Media.calculate(state,r.wave/12).reach);
      assert(r.day>=previousDay-1e-6&&r.night>=previousNight-1e-6);
      previous=r.reach;previousDay=r.day;previousNight=r.night;
    }
  }
});
test('single-product plans have no intersection or impacts from the inactive product',()=>{
  const day=Model.calculate({dayShare:100}).final,night=Model.calculate({dayShare:0}).final;
  assert.equal(day.night,0);assert.equal(day.nightFrequency,0);assert.equal(day.nightImpressions,0);assert.equal(day.overlap,0);assert.equal(day.reach,day.day);
  assert.equal(night.day,0);assert.equal(night.dayFrequency,0);assert.equal(night.dayImpressions,0);assert.equal(night.overlap,0);assert.equal(night.reach,night.night);
});
test('budget, CPM, media allocation and a custom universe feed the product plan',()=>{
  const base=Media.defaults(),p=Model.calculate({dayShare:60},base).final;
  const zero=Model.calculate({dayShare:60},{...base,budget:0}).final;
  for(const key of ['reach','day','night','overlap','impressions','frequency','dayFrequency','nightFrequency'])assert.equal(zero[key],0);
  assert(Model.calculate({dayShare:60},{...base,budget:1200}).final.reach>p.reach);
  assert(Model.calculate({dayShare:60},{...base,cpms:base.cpms.map(x=>x*2)}).final.reach<p.reach);
  const custom={...base,universe:20,shares:[100,0,0,0,0]};
  assert.equal(Model.calculate({dayShare:60},custom).universe,20e6);
  close(Model.calculate({dayShare:60},custom).final.reach,Media.calculate(custom).reach);
});
test('invalid persisted shares fall back safely and out-of-range inputs are bounded',()=>{
  assert.deepEqual(Model.sanitize(null),{dayShare:60,overlapPercent:10});assert.deepEqual(Model.sanitize({dayShare:NaN}),{dayShare:60,overlapPercent:10});
  assert.equal(Model.sanitize({dayShare:140}).dayShare,100);assert.equal(Model.sanitize({dayShare:-40}).dayShare,0);
});

 test('overlap controls stay within 0–10% and conserve reach without inventing impressions',()=>{
  for(const cap of [0,3,5,10,35,-5])for(const dayShare of [0,1,20,50,80,99,100]){
    const p=Model.calculate({dayShare,overlapPercent:cap},{...Media.defaults(),budget:6000});
    assert(p.overlapPercent>=0&&p.overlapPercent<=10);
    for(const r of p.waves){
      assert(r.overlap<=Math.min(r.day,r.night)*p.overlapPercent/100+1e-6);
      close(r.reach,r.dayOnly+r.overlap+r.nightOnly);
      assert(r.day<=r.dayImpressions+1e-6&&r.night<=r.nightImpressions+1e-6);
      close(r.reach,Media.calculate(p.state,r.wave/12).reach);
    }
  }
 });
