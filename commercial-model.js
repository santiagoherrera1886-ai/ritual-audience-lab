/* Commercial planning, 18 October 2026. Assumptions are not measured results. */
(function (root) {
  'use strict';
  const Audience = typeof module !== 'undefined' && module.exports ? require('./audience-model.js') : root.RitualAudience;
  const Policy = typeof module !== 'undefined' && module.exports ? require('./overlap-policy.js') : root.RitualOverlapPolicy;
  const FACTS = Object.freeze({
    dayUnits:1102140, nightHouseholds:357280, nightUnits:357280,
    daySharePercent:.7, nightPenetrationPercent:3.2, householdBase:11200000,
    dayNetSalesPrinted:1545, nightNetSalesPrinted:688,
    pharmacyPercent:90, ecommercePercent:10, source:'Ritual JGB 2026 · páginas 72, 76, 82 y 84'
  });
  const PRESETS = Object.freeze({
    cautious:{dayConversion:.75,nightConversion:1},
    working:{dayConversion:1.5,nightConversion:2},
    favorable:{dayConversion:2.5,nightConversion:3}
  });
  const LIMITS = Object.freeze({
    dayUnits:[0,1e9],nightHouseholds:[0,FACTS.householdBase],
    dayUnitsPerBuyer:[1,1000],dayDigital:[0,100],nightDigital:[0,100],
    dayConversion:[.01,100],nightConversion:[.01,100],
    frequency:[1,100],cpm:[100,1e6],budget:[0,6000],
    coverage:[1,100],overlap:[0,Policy.MAX_PERCENT],universe:[.1,Audience.estimatedDigital/1e6],
    dayBudgetShare:[0,100],distribution:[0,200],
    directOnlineShare:[0,100]
  });
  function defaults() {
    return {dayUnits:FACTS.dayUnits,nightHouseholds:FACTS.nightHouseholds,
      dayUnitsPerBuyer:6,dayDigital:50,nightDigital:50,dayConversion:1.5,nightConversion:2,
      frequency:6,cpm:10000,budget:600,coverage:70,overlap:Policy.DEFAULT_PERCENT,universe:24,
      budgetAllocation:'need',dayBudgetShare:60,distribution:80,directOnlineShare:10};
  }
  function sanitize(raw) {
    const base=defaults(),s={...base};
    Object.entries(LIMITS).forEach(([key,[min,max]])=>{
      const n=raw?.[key];
      s[key]=Number.isFinite(n)?Math.min(max,Math.max(min,n)):base[key];
    });
    s.budgetAllocation=raw?.budgetAllocation==='manual'?'manual':'need';
    return s;
  }
  function union(day,night,overlapPercent) {
    const overlap=Math.min(day,night)*(Policy.sanitizePercent(overlapPercent)/100);
    return {day,night,overlap,net:day+night-overlap};
  }
  function demand(s) {
    const dayBuyers=s.dayUnits/s.dayUnitsPerBuyer;
    const nightBuyers=s.nightHouseholds;
    const dayDigitalBuyers=dayBuyers*s.dayDigital/100;
    const nightDigitalBuyers=nightBuyers*s.nightDigital/100;
    const dayReach=dayDigitalBuyers/(s.dayConversion/100);
    const nightReach=nightDigitalBuyers/(s.nightConversion/100);
    const reach=union(dayReach,nightReach,s.overlap);
    const dayImpressions=dayReach*s.frequency,nightImpressions=nightReach*s.frequency;
    const daySpend=dayImpressions*s.cpm/1000,nightSpend=nightImpressions*s.cpm/1000;
    const totalSpend=daySpend+nightSpend;
    return {dayBuyers,nightBuyers,dayDigitalBuyers,nightDigitalBuyers,dayReach,nightReach,
      reach,dayImpressions,nightImpressions,impressions:dayImpressions+nightImpressions,
      daySpend,nightSpend,totalSpend,
      dayNeedShare:dayReach+nightReach>0?dayReach/(dayReach+nightReach):.6,
      daySpendShare:totalSpend>0?daySpend/totalSpend:.6,
      minNetUniverse:reach.net/(s.coverage/100)};
  }
  function allocate(netUniverse,dayShare,overlapPercent) {
    overlapPercent=Policy.sanitizePercent(overlapPercent);
    const gross=netUniverse/(1-overlapPercent/100*Math.min(dayShare,1-dayShare));
    return union(gross*dayShare,gross*(1-dayShare),overlapPercent);
  }
  function scenario(s,d,{id,label,netUniverse,fixedPools,share}) {
    const pools=fixedPools?union(fixedPools[0],fixedPools[1],s.overlap):allocate(netUniverse,share??d.dayNeedShare,s.overlap);
    const dayShare=s.budgetAllocation==='manual'?s.dayBudgetShare/100:d.daySpendShare;
    const daySpend=s.budget*1e6*dayShare,nightSpend=s.budget*1e6*(1-dayShare);
    const dayCapacity=pools.day*s.coverage/100,nightCapacity=pools.night*s.coverage/100;
    // Optimistic arithmetic capacity: no platform saturation, auction or supply forecast.
    const dayFunded=Math.min(dayCapacity,daySpend*1000/s.cpm/s.frequency);
    const nightFunded=Math.min(nightCapacity,nightSpend*1000/s.cpm/s.frequency);
    const dayGap=Math.max(0,d.dayReach-dayCapacity),nightGap=Math.max(0,d.nightReach-nightCapacity);
    const capacityOK=dayGap<.01&&nightGap<.01;
    const fundingOK=dayFunded+.01>=d.dayReach&&nightFunded+.01>=d.nightReach;
    const net=union(dayFunded,nightFunded,s.overlap);
    const dayAttainment=d.dayDigitalBuyers>0?Math.min(1,dayFunded*s.dayConversion/100/d.dayDigitalBuyers):1;
    const nightAttainment=d.nightDigitalBuyers>0?Math.min(1,nightFunded*s.nightConversion/100/d.nightDigitalBuyers):1;
    const releaseOK=s.distribution>=80;
    return {id,label,pools,dayCapacity,nightCapacity,dayFunded,nightFunded,net,
      daySpend,nightSpend,dayGap,nightGap,capacityOK,fundingOK,releaseOK,
      budgetGap:Math.max(0,d.daySpend-daySpend)+Math.max(0,d.nightSpend-nightSpend),
      totalBudgetGap:Math.max(0,d.totalSpend-s.budget*1e6),
      dayAttainment,nightAttainment,
      status:!capacityOK?'capacity':!fundingOK?'funding':!releaseOK?'distribution':'conditional'};
  }
  function calculate(raw) {
    const state=sanitize(raw),d=demand(state);
    const specs=[
      {id:'legacy',label:'15 M nominales · 9 M / 6 M',fixedPools:[9e6,6e6]},
      {id:'base-fixed',label:'24 M netos · reparto 60 / 40',netUniverse:24e6,share:.6},
      {id:'base',label:'24 M netos · según necesidad',netUniverse:24e6},
      {id:'expanded',label:'30 M netos · según necesidad',netUniverse:30e6}
    ];
    const comparisons=specs.map(spec=>scenario(state,d,spec));
    const active=scenario(state,d,{id:'active',label:'Escenario activo',netUniverse:state.universe*1e6});
    const best= comparisons.find(x=>['base','expanded'].includes(x.id)&&x.capacityOK);
    return {state,demand:d,active,comparisons,recommended:best?.id??'beyond',
      estimatedDigital:Audience.estimatedDigital,
      exceedsDigital:d.minNetUniverse>Audience.estimatedDigital,
      reductionPercent:(1-15/24)*100,remainingPercent:15/24*100,
      hydrationNetSalesWeight:FACTS.dayNetSalesPrinted/(FACTS.dayNetSalesPrinted+FACTS.nightNetSalesPrinted)*100,
      realizedNightPenetration:state.nightHouseholds/FACTS.householdBase*100,
      sensitivity:Object.entries(PRESETS).map(([id,p])=>{
        const value=demand({...state,...p});
        return {id,...p,netReach:value.reach.net,minNetUniverse:value.minNetUniverse,budget:value.totalSpend};
      })};
  }
  const api={FACTS,PRESETS,LIMITS,defaults,sanitize,union,allocate,calculate};
  if(typeof module!=='undefined'&&module.exports)module.exports=api;
  root.RitualCommercialModel=api;
})(typeof window==='undefined'?globalThis:window);
