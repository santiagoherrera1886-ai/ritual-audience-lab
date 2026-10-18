const test=require('node:test');
const assert=require('node:assert/strict');
const M=require('../commercial-model.js');
const A=require('../audience-model.js');
const Media=require('../model.js');
const close=(a,b)=>assert.ok(Math.abs(a-b)<.01,`${a} != ${b}`);

test('source units are converted to buyers; unique night households are never divided by repeat purchase',()=>{
 const r=M.calculate(M.defaults()),d=r.demand;
 close(d.dayBuyers,183690);close(d.nightBuyers,357280);
 close(d.dayDigitalBuyers,91845);close(d.nightDigitalBuyers,178640);
 close(d.dayReach,6123000);close(d.nightReach,8932000);
 close(d.reach.net,14442700);close(d.impressions,90330000);close(d.totalSpend,903300000);
 close(d.minNetUniverse,20632428.57142857);
 assert.equal(r.recommended,'base');assert.equal(r.active.status,'funding');
});
test('15M nominal audiences are not passed off as 15M unique; allocation conserves net audience',()=>{
 for(const overlap of [0,5,10]) {
  const r=M.calculate({...M.defaults(),overlap});
  close(r.comparisons[0].pools.net,15000000-6000000*overlap/100);
  for(const x of r.comparisons){close(x.pools.day+x.pools.night-x.pools.overlap,x.pools.net);assert(x.pools.overlap<=Math.min(x.pools.day,x.pools.night)*.1+.01);}
 }
});
test('fixed 60/40 can fail while demand allocation within the same net universe passes',()=>{
 const r=M.calculate({...M.defaults(),budget:1000});
 assert.equal(r.comparisons[1].capacityOK,false);
 close(r.comparisons[1].nightGap,1932000);
 assert.equal(r.comparisons[2].status,'conditional');
 assert.equal(r.comparisons[3].status,'conditional');
});
test('larger universes do not manufacture impressions or remove a budget gap',()=>{
 const r=M.calculate(M.defaults()),b=r.comparisons[2],e=r.comparisons[3];
 close(b.daySpend,e.daySpend);close(b.nightSpend,e.nightSpend);
 close(b.dayFunded,e.dayFunded);close(b.nightFunded,e.nightFunded);
 assert.equal(b.fundingOK,false);assert.equal(e.fundingOK,false);
 const zero=M.calculate({...M.defaults(),budget:0});
 assert.equal(zero.active.dayFunded,0);assert.equal(zero.active.nightFunded,0);assert.equal(zero.active.net.net,0);
});
test('repeat purchase, conversion and digital contribution affect the correct denominators',()=>{
 const a=M.calculate(M.defaults()),b=M.calculate({...M.defaults(),dayUnitsPerBuyer:12});
 close(b.demand.dayReach,a.demand.dayReach/2);close(b.demand.nightReach,a.demand.nightReach);
 const c=M.calculate({...M.defaults(),directOnlineShare:80});
 assert.deepEqual(c.demand,a.demand);
 const d=M.calculate({...M.defaults(),dayDigital:0,nightDigital:0});
 assert.equal(d.demand.reach.net,0);assert.equal(d.demand.totalSpend,0);assert(Number.isFinite(d.active.dayAttainment));
});
test('a single-product requirement and asymmetric budget allocation never create funded reach for the inactive product',()=>{
 const r=M.calculate({...M.defaults(),nightDigital:0});
 assert.equal(r.demand.nightReach,0);assert.equal(r.active.pools.night,0);assert.equal(r.active.net.overlap,0);
 const manual=M.calculate({...M.defaults(),budget:1500,budgetAllocation:'manual',dayBudgetShare:100});
 assert.equal(manual.active.nightFunded,0);assert.equal(manual.active.fundingOK,false);
});
test('stress scenario can exceed the digital estimate without silently clipping demand',()=>{
 const r=M.calculate({...M.defaults(),...M.PRESETS.cautious});
 assert.equal(r.exceedsDigital,true);assert.equal(r.recommended,'beyond');
 assert(r.demand.minNetUniverse>A.estimatedDigital);
 const neededExpansion=M.calculate({...M.defaults(),coverage:55});
 assert.equal(neededExpansion.recommended,'expanded');
});
test('distribution gate and invalid inputs produce explicit states and finite outputs',()=>{
 assert.equal(M.calculate({...M.defaults(),budget:1000,distribution:79}).active.status,'distribution');
 for(const input of [null,{}, {universe:1e9,dayConversion:0,nightConversion:NaN,dayUnitsPerBuyer:0,overlap:90,budget:-1}]){
  const r=M.calculate(input);
  assert(r.state.universe<=A.estimatedDigital/1e6);assert(r.state.overlap<=10);assert(r.state.dayUnitsPerBuyer>=1);
  for(const v of Object.values(r.demand))if(typeof v==='number')assert(Number.isFinite(v));
 }
});
test('new saved scenarios preserve explicitly applied universe and demographics reconcile',()=>{
 const state={...Media.defaults(),universe:30,budget:903.3};
 assert.equal(Media.restore({version:4,state}).state.universe,30);
 assert.equal(Media.restore({version:3,state}).state.universe,24);
 close(A.ageDistribution(30e6).reduce((sum,x)=>sum+x.planning,0),30e6);
});
