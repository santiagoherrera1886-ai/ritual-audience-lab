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
  assert.deepEqual(restored.state,{...legacy,universe:30});
  assert.deepEqual(restored.saved,[{name:'Histórico',state:legacy}]);
  assert.equal(Model.restore({version:1,state:{...legacy,universe:20}}).state.universe,20);
  assert.equal(Model.restore({version:2,state:legacy}).state.universe,14);
  assert.deepEqual(Model.restore(null),{state:Model.defaults(),saved:[]});
});
