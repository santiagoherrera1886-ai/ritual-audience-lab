/* Colombia 18+, all genders, urban and rural. See docs/universo-2027.md. */
(function (root) {
  'use strict';
  const cohorts = Object.freeze([
    { age: '18–24', population: 6151801, internetRate: .9381837570611629, observedAge: '12–24' },
    { age: '25–54', population: 22490699, internetRate: .9112847255015205, observedAge: '25–54' },
    { age: '55+', population: 11079250, internetRate: .6324634718139461, observedAge: '55+' }
  ].map(Object.freeze));
  const adults = cohorts.reduce((sum, c) => sum + c.population, 0);
  const estimatedDigital = cohorts.reduce((sum, c) => sum + c.population * c.internetRate, 0);
  const planningUniverse = 24e6;
  // DANE 2027, national total, both sexes, single ages. Age 25 uses the 25–54 rate.
  const ageBands = Object.freeze([
    {id:'18-25',age:'18–25',minAge:18,maxAge:25,population:7043089,estimatedDigital:6583736.915295418,label:'Nuevos ritmos',color:'#9a7cff'},
    {id:'26-34',age:'26–34',minAge:26,maxAge:34,population:7940851,estimatedDigital:7236376.223783474,label:'Rutinas propias',color:'#608dfb'},
    {id:'35-44',age:'35–44',minAge:35,maxAge:44,population:7504886,estimatedDigital:6839087.978430204,label:'Balance cotidiano',color:'#20b8bc'},
    {id:'45-54',age:'45–54',minAge:45,maxAge:54,population:6153674,estimatedDigital:5607749.121915843,label:'Continuidad y bienestar',color:'#ee91b3'},
    {id:'55-plus',age:'55+',minAge:55,maxAge:null,population:11079250,estimatedDigital:7007220.920094662,label:'Bienestar a tu ritmo',color:'#e4ad58'}
  ].map(Object.freeze));
  function ageDistribution(universe=planningUniverse) {
    const total=Number.isFinite(universe)&&universe>=0?Math.round(universe):planningUniverse;
    const result=ageBands.map(b=>{
      const share=b.estimatedDigital/estimatedDigital,exact=total*share;
      return {...b,share,planning:Math.floor(exact),remainder:exact%1};
    });
    const ranked=[...result].sort((a,b)=>b.remainder-a.remainder);
    for(let n=total-result.reduce((s,b)=>s+b.planning,0),i=0;i<n;i++)ranked[i].planning++;
    return result.map(({remainder,...band})=>band);
  }
  const api = Object.freeze({
    year: 2027, internetYear: 2025, reviewed: '2026-10-08',
    totalPopulation: 53712233, adults, cohorts, estimatedDigital,
    planningUniverse, ageBands, ageDistribution,
    sources: Object.freeze({
      population: 'https://www.dane.gov.co/files/censo2018/proyecciones-de-poblacion/Nacional/PPED-AreaSexoEdadNac-2018-2070.xlsx',
      internet: 'https://www.dane.gov.co/files/operaciones/TICH/anex-TICH-2025.xlsx',
      bulletin: 'https://www.dane.gov.co/files/operaciones/TICH/bol-TICH-2025.pdf'
    })
  });
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  root.RitualAudience = api;
})(typeof window === 'undefined' ? globalThis : window);
