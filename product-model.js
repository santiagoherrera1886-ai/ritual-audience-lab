/* Both products use the same national pool, media mix, CPMs and channel caps.
   Product overlap is modelled, not measured. Total reach matches the media view. */
(function(root){
  'use strict';
  const Media = typeof module !== 'undefined' && module.exports ? require('./model.js') : root.RitualModel;
  const ASSUMPTIONS = Object.freeze({ waves: 12 });
  const clamp = (value,min,max) => Math.max(min,Math.min(max,value));
  function sanitize(value){return {dayShare:Number.isFinite(value?.dayShare)?clamp(Math.round(value.dayShare),0,100):60};}
  function calculate(input, mediaInput){
    const {dayShare}=sanitize(input), state=Media.sanitize(mediaInput);
    const waves=Array.from({length:ASSUMPTIONS.waves},(_,index)=>{
      const wave=index+1, delivery=wave/ASSUMPTIONS.waves;
      const total=Media.calculate(state,delivery);
      const day=Media.calculate({...state,budget:state.budget*dayShare/100},delivery);
      const night=Media.calculate({...state,budget:state.budget*(100-dayShare)/100},delivery);
      const overlap=clamp(day.reach+night.reach-total.reach,0,Math.min(day.reach,night.reach));
      return {wave,budget:total.budget,day:day.reach,night:night.reach,overlap,
        reach:total.reach,dayFrequency:day.frequency,nightFrequency:night.frequency,
        dayImpressions:day.impressions,nightImpressions:night.impressions,
        impressions:total.impressions,frequency:total.frequency,coverage:total.coverage};
    });
    return {dayShare,nightShare:100-dayShare,universe:state.universe*1e6,state,
      assumptions:ASSUMPTIONS,waves,final:waves[waves.length-1]};
  }
  const api={ASSUMPTIONS,sanitize,calculate};
  if(typeof module!=='undefined'&&module.exports)module.exports=api;
  root.RitualProductModel=api;
})(typeof window==='undefined'?globalThis:window);
