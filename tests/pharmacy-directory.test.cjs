const {test}=require('node:test');
const assert=require('node:assert/strict');
const M=require('../pharmacy-model.js');
const Youth=require('../youth-audience.js');
const dataset=require('../data/pharmacies.json');
const records=M.index(dataset.records);
test('all directory records have a location, provenance, safe public fields and unique stable IDs',()=>{
 const ids=new Set(),sources=new Set(dataset.sources.map(s=>s.id));
 for(const r of records){
  assert.ok(r.id&&r.name&&r.address&&r.city&&r.department);assert.ok(!ids.has(r.id));ids.add(r.id);
  assert.ok(dataset.departments.includes(r.department));assert.ok(r.sources.length);
  r.sources.forEach(s=>assert.ok(sources.has(s)));
  assert.ok(!('nit' in r||'email' in r||'representante_legal' in r||'nom_prop' in r));
  if(r.lat!==null){assert.ok(r.lat>=-4.3&&r.lat<=13.7);assert.ok(r.lon>=-82&&r.lon<=-66);}
 }
 assert.ok(!records.some(r=>r.department==='Casanare'&&r.city.startsWith('Yopal')&&r.city!=='Yopal'));
 assert.equal(dataset.completeNationalCensus,false);assert.equal(dataset.coverage,'partial');
 for(const source of dataset.sources)assert.equal(source.records,records.filter(r=>r.sources.includes(source.id)).length);
});
test('accent-insensitive search combines with city, chain, neighborhood and coordinate filters',()=>{
 const subset=M.filter(records,{query:'CRUZ VERDE',city:'Bogotá D.C.',kind:'cruzverde'});
 assert.ok(subset.length>0);assert.ok(subset.every(r=>r.city==='Bogotá D.C.'&&r.kind==='cruzverde'));
 assert.equal(M.filter(records,{query:'bogota'}).length,M.filter(records,{query:'Bogotá'}).length);
 assert.equal(M.filter(records,{department:'Amazonas'}).length,0);
 assert.equal(M.filter(records,{query:'unestablecimientoquenopuedeexistir'}).length,0);
 const geolocated=M.filter(records,{coordinates:true});assert.ok(geolocated.length>0&&geolocated.length<records.length);assert.ok(geolocated.every(r=>Number.isFinite(r.lat)&&Number.isFinite(r.lon)));
 const values=M.neighborhoods(records);assert.equal(new Set(values.map(M.normalize)).size,values.length);
 const r=records.find(r=>r.neighborhood);assert.ok(M.filter(records,{city:r.city,neighborhood:r.neighborhood}).every(p=>p.city===r.city&&M.normalize(p.neighborhood)===M.normalize(r.neighborhood)));
});
test('city aggregation conserves filtered totals; exports all matches with attribution and partial-coverage warning',()=>{
 const filtered=M.filter(records,{kind:'cruzverde'}),cities=M.cities(filtered),stats=M.stats(filtered);
 assert.equal(cities.reduce((n,c)=>n+c.total,0),filtered.length);assert.equal(stats.cities,cities.length);
 assert.ok(filtered.length>12);
 const csv=M.csv(filtered,dataset.sources,dataset.consulted);
 assert.equal(csv.split('\r\n').length,filtered.length+1);assert.match(csv,/URLs de origen/);assert.match(csv,/Parcial; no censo completo/);assert.match(csv,/2026-10-07/);
 const malicious={...filtered[0],name:'=HYPERLINK("bad")'};assert.match(M.csv([malicious],dataset.sources,dataset.consulted),/"'=HYPERLINK/);
});
test('map links distinguish published coordinates from address search',()=>{
 const a=records.find(r=>r.lat!==null),b=records.find(r=>r.lat===null);
 assert.equal(new URL(M.mapURL(a)).searchParams.get('query'),`${a.lat},${a.lon}`);
 assert.ok(new URL(M.mapURL(b)).searchParams.get('query').includes(b.address));assert.ok(new URL(M.mapURL(b)).searchParams.get('query').includes(b.city));
});
test('young cohort supplies distinct proposed signals, both products, explicit age limits and no additive universe',()=>{
 assert.equal(Youth.persona.age,'18–25');assert.equal(Youth.signals.length,Youth.persona.count);assert.equal(new Set(Youth.signals.map(s=>s.platform+'|'+s.interest)).size,Youth.signals.length);
 assert.deepEqual([...new Set(Youth.signals.map(s=>s.age))],['18–25']);assert.ok(Youth.signals.some(s=>s.product.includes('Día')));assert.ok(Youth.signals.some(s=>s.product.includes('Noche')));
 assert.match(Youth.persona.scope,/no se suma/);assert.equal(Youth.persona.universe,undefined);
 for(const channel of ['google','youtube','tiktok']){assert.match(Youth.ageNote(channel),/18–24/);assert.match(Youth.ageNote(channel),/25–34/);assert.match(Youth.ageNote(channel),/no permite aislar/);}
 assert.match(Youth.ageNote('meta'),/controles de entrega/);
});
