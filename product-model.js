/* Illustrative product planning assumptions from the supplied visual reference.
   The 12-wave projection is not measured campaign reach or audience deduplication. */
(function(root){
  'use strict';
  const ASSUMPTIONS=Object.freeze({day:8.6e6,night:7.8e6,overlap:2.4e6,waves:12,dayFrequency:2.2,nightFrequency:4.1});
  const clamp=(value,min,max)=>Math.max(min,Math.min(max,value));
  function sanitize(value){return {dayShare:Number.isFinite(value?.dayShare)?clamp(Math.round(value.dayShare),0,100):60};}
  function calculate(input){
    const {dayShare}=sanitize(input),dayWeight=dayShare/100,nightWeight=1-dayWeight;
    const a=ASSUMPTIONS,universe=a.day+a.night-a.overlap;
    const delivery=(weight,base,k,wave)=>Math.min(1,-Math.expm1(-k*weight/base*wave/a.waves)/-Math.expm1(-k));
    const waves=Array.from({length:a.waves},(_,index)=>{
      const wave=index+1;
      const day=a.day*delivery(dayWeight,.6,3,wave),night=a.night*delivery(nightWeight,.4,2.1,wave);
      const overlap=a.overlap*(day/a.day)*(night/a.night);
      const reach=day+night-overlap;
      const dayFrequency=day>0?1+(a.dayFrequency-1)*(wave/a.waves)*Math.sqrt(dayWeight/.6):0;
      const nightFrequency=night>0?1+(a.nightFrequency-1)*(wave/a.waves)*Math.sqrt(nightWeight/.4):0;
      const impressions=day*dayFrequency+night*nightFrequency;
      return {wave,day,night,overlap,reach,dayFrequency,nightFrequency,impressions,frequency:reach>0?impressions/reach:0,coverage:reach/universe};
    });
    return {dayShare,nightShare:100-dayShare,universe,assumptions:a,waves,final:waves[waves.length-1]};
  }
  const api={ASSUMPTIONS,sanitize,calculate};
  if(typeof module!=='undefined'&&module.exports)module.exports=api;
  root.RitualProductModel=api;
})(typeof window==='undefined'?globalThis:window);
