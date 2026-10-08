const test=require('node:test');
const assert=require('node:assert/strict');
const Audience=require('../audience-model.js');
const Model=require('../model.js');

test('adult cohorts reconcile to the DANE 2027 adult total; digital estimate remains within that base',()=>{
  assert.equal(Audience.adults,39721750);
  assert.equal(Audience.cohorts.reduce((sum,c)=>sum+c.population,0),Audience.adults);
  assert(Math.abs(Audience.estimatedDigital-33274171.1595196)<.01);
  assert(Audience.planningUniverse<Audience.estimatedDigital&&Audience.estimatedDigital<Audience.adults);
  assert.equal(Model.defaults().universe*1e6,Audience.planningUniverse);
  assert.equal(Audience.cohorts[0].observedAge,'12–24');
});
test('legacy active default upgrades without losing budget, CPMs, mix or historical comparisons',()=>{
  const legacy={...Model.defaults(),universe:14,budget:1200,cpms:[8000,9000,10000,11000,12000],shares:[20,20,20,20,20]};
  const restored=Model.restore({version:1,state:legacy,saved:[{name:'Histórico',state:legacy}]});
  assert.deepEqual(restored.state,{...legacy,universe:24});
  assert.deepEqual(restored.saved,[{name:'Histórico',state:legacy}]);
  assert.equal(Model.restore({version:1,state:{...legacy,universe:20}}).state.universe,24);
  assert.equal(Model.restore({version:2,state:legacy}).state.universe,24);
  assert.deepEqual(Model.restore(null),{state:Model.defaults(),saved:[]});
});

 test('five non-overlapping age bands reconcile to exactly 24 million',()=>{
  const bands=Audience.ageDistribution();
  assert.equal(bands.length,5);
  assert.equal(bands.reduce((s,c)=>s+c.planning,0),24000000);
  assert.equal(bands.reduce((s,c)=>s+c.population,0),Audience.adults);
  assert(Math.abs(bands.reduce((s,c)=>s+c.estimatedDigital,0)-Audience.estimatedDigital)<.01);
  assert.equal(bands[0].maxAge,25);assert.equal(bands[1].minAge,26);assert.equal(bands[4].maxAge,null);
  for(let i=1;i<bands.length;i++)assert.equal(bands[i].minAge,bands[i-1].maxAge+1);
  for(const n of [0,1,14e6,24e6,30e6])assert.equal(Audience.ageDistribution(n).reduce((s,c)=>s+c.planning,0),n);
 });
