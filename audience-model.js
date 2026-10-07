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
  const api = Object.freeze({
    year: 2027, internetYear: 2025, reviewed: '2026-10-07',
    totalPopulation: 53712233, adults, cohorts, estimatedDigital,
    planningUniverse: 30e6,
    sources: Object.freeze({
      population: 'https://www.dane.gov.co/files/censo2018/proyecciones-de-poblacion/Nacional/PPED-AreaSexoEdadNac-2018-2070.xlsx',
      internet: 'https://www.dane.gov.co/files/operaciones/TICH/anex-TICH-2025.xlsx',
      bulletin: 'https://www.dane.gov.co/files/operaciones/TICH/bol-TICH-2025.pdf'
    })
  });
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  root.RitualAudience = api;
})(typeof window === 'undefined' ? globalThis : window);
