/* Planning allocation with controlled Day/Night intersection, not measured reach.
   Total unique reach comes from the media model; the product allocation is
   reconciled to it with overlap <= 1% of the smaller product reach. */
(function(root){
  'use strict';
  const Media=typeof module!=='undefined'&&module.exports?require('./model.js'):root.RitualModel;
  const Policy=typeof module!=='undefined'&&module.exports?require('./overlap-policy.js'):root.RitualOverlapPolicy;
  const ASSUMPTIONS=Object.freeze({waves:12,maxOverlapPercent:Policy.MAX_PERCENT,overlapDenominator:'smaller-product-reach'});
  const clamp=(v,min,max)=>Math.max(min,Math.min(max,v));
  function sanitize(value){return {
    dayShare:Number.isFinite(value?.dayShare)?clamp(Math.round(value.dayShare),0,100):60,
    overlapPercent:Policy.sanitizePercent(value?.overlapPercent)
  };}
  function calculate(input,mediaInput){
    const {dayShare,overlapPercent}=sanitize(input),state=Media.sanitize(mediaInput);
    const waves=Array.from({length:ASSUMPTIONS.waves},(_,index)=>{
      const wave=index+1,delivery=wave/ASSUMPTIONS.waves;
      const total=Media.calculate(state,delivery);
      const dayRaw=Media.calculate({...state,budget:state.budget*dayShare/100},delivery);
      const nightRaw=Media.calculate({...state,budget:state.budget*(100-dayShare)/100},delivery);
      // Allocate unique contacts proportionally to the investment split. Limit
      // the intersection both by the 1% rule and each standalone reach curve.
      // Unlike rescaling raw product reaches on each wave, this preserves
      // cumulative (non-decreasing) reach for BOTH products at high budgets.
      const q=dayShare/100,n=1-q,m=Math.min(q,n),r=overlapPercent/100;
      // Stay just inside the bound even with floating-point division.
      const desired=total.reach*r*m/(1-r*m)*(1-Number.EPSILON*4);
      const dayHeadroom=q>0?Math.max(0,dayRaw.reach/q-total.reach):0;
      const nightHeadroom=n>0?Math.max(0,nightRaw.reach/n-total.reach):0;
      const overlap=Math.min(desired,dayHeadroom,nightHeadroom);
      const day=q*(total.reach+overlap),night=n*(total.reach+overlap);
      const reach=total.reach;
      return {wave,budget:total.budget,day,night,overlap,reach,
        dayOnly:day-overlap,nightOnly:night-overlap,
        overlapPercent:Math.min(day,night)>0?Math.min(overlapPercent,overlap/Math.min(day,night)*100):0,
        dayFrequency:day>0?dayRaw.impressions/day:0,
        nightFrequency:night>0?nightRaw.impressions/night:0,
        dayImpressions:dayRaw.impressions,nightImpressions:nightRaw.impressions,
        impressions:total.impressions,frequency:reach>0?total.impressions/reach:0,
        coverage:reach/total.universe};
    });
    return {dayShare,nightShare:100-dayShare,overlapPercent,universe:state.universe*1e6,state,
      assumptions:ASSUMPTIONS,waves,final:waves[waves.length-1]};
  }
  // Integer CSV counts preserve both the union identity and the percentage cap.
  // Rounding the shared count up could otherwise exceed 1% by one person.
  function toPeople(row) {
    const reach=Math.floor(row.reach),day=Math.min(reach,Math.floor(row.day));
    const rate=Policy.sanitizePercent(row.overlapPercent)/100;
    let overlap=Math.min(Math.floor(row.overlap),Math.floor(day*rate),Math.floor((reach-day)*rate/(1-rate)));
    let night=reach+overlap-day;
    while(overlap>Math.min(day,night)*rate){overlap--;night--;}
    return {day,night,overlap,reach,dayOnly:day-overlap,nightOnly:night-overlap};
  }
  const api={ASSUMPTIONS,sanitize,calculate,toPeople};
  if(typeof module!=='undefined'&&module.exports)module.exports=api;
  root.RitualProductModel=api;
})(typeof window==='undefined'?globalThis:window);
