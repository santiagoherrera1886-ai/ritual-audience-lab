(function (root, factory) {
  const value = factory();
  if (typeof module === 'object' && module.exports) module.exports = value;
  else root.RitualPharmacyModel = value;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';
  const normalize=value=>String(value??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();
  const sorted=values=>[...new Set(values.filter(Boolean))].sort((a,b)=>a.localeCompare(b,'es'));
  function index(records) {
    return records.map(record=>({...record,search:normalize([record.name,record.address,record.city,record.department,record.neighborhood,record.locality,record.chain].join(' '))}));
  }
  function filter(records, state={}) {
    const tokens=normalize(state.query).split(' ').filter(Boolean);
    return records.filter(r=>(!state.department||r.department===state.department)&&(!state.city||r.city===state.city)&&(!state.neighborhood||normalize(r.neighborhood)===normalize(state.neighborhood))&&(!state.kind||r.kind===state.kind)&&(!state.chain||r.chain===state.chain)&&(!state.coordinates||Number.isFinite(r.lat)&&Number.isFinite(r.lon))&&tokens.every(t=>r.search.includes(t)));
  }
  function neighborhoods(records) {
    const values=new Map();records.forEach(r=>{const key=normalize(r.neighborhood);if(key&&!values.has(key))values.set(key,r.neighborhood);});
    return sorted([...values.values()]);
  }
  function stats(records) {
    return {total:records.length,cruzverde:records.filter(r=>r.kind==='cruzverde').length,local:records.filter(r=>r.kind==='local').length,chain:records.filter(r=>r.kind==='chain').length,departments:new Set(records.map(r=>r.department)).size,cities:new Set(records.map(r=>r.department+'|'+r.city)).size,coordinates:records.filter(r=>Number.isFinite(r.lat)&&Number.isFinite(r.lon)).length};
  }
  function cities(records) {
    const groups=new Map();
    records.forEach(r=>{const key=r.department+'|'+r.city;if(!groups.has(key))groups.set(key,{department:r.department,city:r.city,total:0,cruzverde:0,local:0,chain:0});const g=groups.get(key);g.total++;g[r.kind]++;});
    return [...groups.values()].sort((a,b)=>b.total-a.total||a.city.localeCompare(b.city,'es'));
  }
  function mapURL(record) {
    const query=Number.isFinite(record.lat)&&Number.isFinite(record.lon)?`${record.lat},${record.lon}`:`${record.address}, ${record.city}, ${record.department}, Colombia`;
    return 'https://www.google.com/maps/search/?api=1&query='+encodeURIComponent(query);
  }
  function csv(records, sources, consulted) {
    const sourceMap=new Map(sources.map(s=>[s.id,s]));
    const rows=[['ID','Nombre','Departamento','Municipio','Barrio','Localidad','Dirección','Teléfono publicado','Horario publicado','Cadena identificada','Clasificación orientativa','Latitud','Longitud','Fuentes','URLs de origen','Fechas de las fuentes','Año renovación si existe','Consulta','Cobertura','Observación'],...records.map(r=>{
      const ss=r.sources.map(id=>sourceMap.get(id)).filter(Boolean);
      return [r.id,r.name,r.department,r.city,r.neighborhood,r.locality,r.address,r.phone,r.hours,r.chain,r.kind==='local'?'Local o sin cadena identificada':r.kind==='cruzverde'?'Cruz Verde':'Otra cadena',r.lat??'',r.lon??'',ss.map(s=>s.publisher).join(' | '),ss.map(s=>s.url).join(' | '),ss.map(s=>s.dataDate).join(' | '),r.year,consulted,'Parcial; no censo completo ni operación actual verificada',r.note];
    })];
    const cell=value=>{let text=String(value??'');if(typeof value==='string'&&/^[\s]*[=+@-]/.test(text))text="'"+text;return '"'+text.replaceAll('"','""')+'"';};
    return '\uFEFF'+rows.map(row=>row.map(cell).join(',')).join('\r\n');
  }
  return {normalize,sorted,index,filter,neighborhoods,stats,cities,mapURL,csv};
});
