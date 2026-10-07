(() => {
  'use strict';
  const M=window.RitualPharmacyModel;
  const $=s=>document.querySelector(s);
  const esc=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const num=n=>n.toLocaleString('es-CO');
  const state={query:'',department:'',city:'',neighborhood:'',kind:'',chain:'',coordinates:false,page:1,view:'stores'};
  const size=12;
  let data,records,loading,sourceMap;
  const mark='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M8 3h8v5h5v8h-5v5H8v-5H3V8h5z"/></svg>';
  const arrow='<span aria-hidden="true">↗</span>';
  const labels={cruzverde:'Cruz Verde',local:'Local / sin cadena identificada',chain:'Otra cadena'};
  function dateText(r) {return r.year?`Renovación ${r.year}`:sourceMap.get(r.sources[0])?.dataDate||'Fecha no declarada';}
  function options(values,placeholder) {return `<option value="">${placeholder}</option>`+values.map(v=>`<option value="${esc(v)}">${esc(v)}</option>`).join('');}
  async function mount() {
    if(data)return;
    if(loading)return loading;
    $('#pharmacyApp').innerHTML='<div class="ph-loading" role="status">Preparando el directorio y sus fuentes…</div>';
    loading=(async()=>{
      try {
        const response=await fetch('data/pharmacies.json');
        if(!response.ok)throw new Error('No se pudo cargar el directorio');
        const payload=await response.json();
        if(!Array.isArray(payload.records)||!Array.isArray(payload.sources))throw new Error('Datos no válidos');
        data=payload;records=M.index(data.records);sourceMap=new Map(data.sources.map(s=>[s.id,s]));
        build();render();
      } catch {
        data=null;
        $('#pharmacyApp').innerHTML='<div class="ph-loading"><h1 id="pharmacyTitle">Directorio de droguerías</h1><p>No se pudo cargar el archivo. Comprueba tu conexión y vuelve a intentarlo.</p><button class="button button-primary" data-ph-retry>Reintentar</button></div>';
      } finally {loading=null;}
    })();return loading;
  }
  function build() {
    const total=M.stats(records);
    $('#pharmacyApp').innerHTML=`
      <div class="ph-hero"><div><div class="atlas-eyebrow">RITUAL / INTELIGENCIA COMERCIAL</div><h1 id="pharmacyTitle">Del ritual<br>al <em>territorio.</em></h1><p>Explora droguerías de Colombia por ciudad, barrio y cadena.<br>Una base documentada para planear tu siguiente paso comercial.</p><a class="ph-source-jump" href="#phCoverage">Ver cobertura y fuentes ${arrow}</a></div><div class="ph-hero-aside"><span class="ph-cross">${mark}</span><div><span class="ph-eyebrow">DIRECTORIO NACIONAL · COBERTURA PARCIAL</span><strong>${num(total.total)}</strong><span>registros con dirección</span></div><small>Consulta de fuentes · 07 oct 2026<br>Las fechas de los registros varían.</small></div></div>
      <div class="ph-metrics"><div><b>${num(total.cruzverde)}</b><span>registros Cruz Verde</span></div><div><b>${num(total.local)}</b><span>locales / sin cadena identificada</span></div><div><b>${total.cities}</b><span>municipios con registros</span></div><div><b>${total.departments}<small> / 33</small></b><span>departamentos + Bogotá D.C.</span></div></div>
      <div class="ph-coverage-note"><span class="ph-dot"></span><p><b>Esta base todavía no reúne todas las droguerías del país ni toda la red Cruz Verde.</b> Incluye registros oficiales de distintas fechas y un directorio histórico de la cadena. Verifica operación, dirección y disponibilidad de Ritual antes de activar una campaña o visitar una sede.</p></div>
      <section class="ph-explorer" aria-labelledby="phExplorerTitle"><div class="ph-section-title"><div><span class="ph-eyebrow">ENCUENTRA UN PUNTO DE CONTACTO</span><h2 id="phExplorerTitle">Droguerías por ciudad</h2></div><div class="ph-view-switch" role="group" aria-label="Vista del directorio"><button data-ph-view="stores" aria-pressed="true">Establecimientos</button><button data-ph-view="cities" aria-pressed="false">Por ciudades</button></div></div>
      <div class="ph-kind-tabs" role="group" aria-label="Tipo de droguería"><button data-ph-kind="" aria-pressed="true">Todas <b>${num(total.total)}</b></button><button data-ph-kind="cruzverde" aria-pressed="false">${mark} Cruz Verde <b>${num(total.cruzverde)}</b></button><button data-ph-kind="local" aria-pressed="false">De barrio / locales <b>${num(total.local)}</b></button><button data-ph-kind="chain" aria-pressed="false">Otras cadenas <b>${num(total.chain)}</b></button></div>
      <div class="ph-filters"><label class="ph-search"><span>Buscar establecimiento o dirección</span><input type="search" id="phQuery" placeholder="Ej. Cruz Verde, San José, Calle 80…" autocomplete="off"></label><label><span>Departamento</span><select id="phDepartment">${options(data.departments,'Todos los departamentos')}</select></label><label><span>Ciudad / municipio</span><select id="phCity"></select></label><label><span>Barrio publicado</span><select id="phNeighborhood"></select></label><label><span>Cadena identificada</span><select id="phChain">${options(M.sorted(records.map(r=>r.chain)),'Todas las cadenas')}</select></label></div>
      <div class="ph-filter-foot"><label><input type="checkbox" id="phCoordinates"> Solo con coordenadas publicadas</label><button class="text-button" data-ph-clear>Limpiar filtros ×</button></div><p class="ph-classification">“De barrio / locales” agrupa nombres sin una cadena reconocida: la independencia comercial no está verificada. Un barrio vacío significa que la fuente no lo publicó.</p>
      <div class="ph-results-head"><p id="phResultCount" role="status" aria-live="polite"></p><button class="button button-secondary" data-ph-export>Descargar resultados ↓</button></div><div id="phResults"></div><div class="ph-pagination" id="phPagination"></div></section>
      <section class="ph-coverage" id="phCoverage" aria-labelledby="phCoverageTitle"><div class="ph-section-title"><div><span class="ph-eyebrow">TRANSPARENCIA DE LA BASE</span><h2 id="phCoverageTitle">Lo que cubrimos, lo que falta.</h2></div><span class="ph-status">Cobertura parcial</span></div><p>Los conteos describen registros disponibles, no el total real de droguerías, ventas, demanda ni inversión recomendada. <b>“Sin registros” no significa “sin droguerías”.</b> La información histórica requiere validación actual.</p><div class="ph-department-grid">${data.departments.map(department=>{const group=records.filter(r=>r.department===department),count=group.length;return `<button data-ph-department="${esc(department)}" class="${count?'':'ph-missing'}"><span>${esc(department)}</span><b>${count?num(count):'—'}</b><small>${count?'Registros parciales':'Sin registros integrados'}</small></button>`;}).join('')}</div>
      <details class="ph-sources"><summary>Fuentes, fechas y metodología <span>${data.sources.length} fuentes ${arrow}</span></summary><div class="ph-source-list">${data.sources.map(s=>`<article><div><h3><a href="${esc(s.url)}" target="_blank" rel="noopener noreferrer">${esc(s.name)} ${arrow}</a></h3><p>${esc(s.publisher)}</p><p>${esc(s.note)}</p><small>${esc(s.license)} · Consulta: ${data.consulted}</small></div><div><b>${num(s.records)}</b><span>registros con esta fuente</span><small>${esc(s.dataDate)}</small></div></article>`).join('')}</div><p class="ph-method">Normalización de nombres de municipios y direcciones; unión conservadora de coincidencias por municipio, dirección y nombre/cadena. Pueden quedar duplicados cuando una dirección está escrita de forma diferente. Se excluyen depósitos, ópticas, veterinarias, naturistas y registros comerciales sin nombre farmacéutico identificable. No se publican NIT, correos personales ni representantes legales. Los teléfonos son los publicados para los establecimientos. <a href="docs/DIRECTORIO_DROGUERIAS.md" target="_blank" rel="noopener noreferrer">Consultar metodología completa ${arrow}</a></p></details></section>
      <div class="ph-activation"><span class="ph-cross">${mark}</span><div><h2>Una audiencia nacional. Una ruta comercial local.</h2><p>Alex, Valeria, Carlos y Julián mantienen sus afinidades en todo el país. Las ciudades ayudan a organizar la verificación de puntos de venta y la distribución, sin convertir los intereses en clústeres por ciudad.</p></div><button class="button button-primary" data-goto="audiences">Ver audiencias ${arrow}</button></div>
      <dialog id="phDialog" class="ph-dialog"><button class="ph-dialog-close" data-ph-close aria-label="Cerrar ficha">×</button><div id="phDetail"></div></dialog>`;
    updatePlaces();
    $('#phQuery').addEventListener('input',e=>{state.query=e.target.value;state.page=1;render();});
    $('#phDepartment').addEventListener('change',e=>{state.department=e.target.value;state.city='';state.neighborhood='';state.page=1;updatePlaces();render();});
    $('#phCity').addEventListener('change',e=>{state.city=e.target.value;state.neighborhood='';state.page=1;updatePlaces();render();});
    $('#phNeighborhood').addEventListener('change',e=>{state.neighborhood=e.target.value;state.page=1;render();});
    $('#phChain').addEventListener('change',e=>{state.chain=e.target.value;state.kind='';state.page=1;render();});
    $('#phCoordinates').addEventListener('change',e=>{state.coordinates=e.target.checked;state.page=1;render();});
    $('#phDialog').addEventListener('click',e=>{if(e.target===$('#phDialog')){const r=e.target.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)e.target.close();}});
    $('.ph-source-jump').addEventListener('click',e=>{e.preventDefault();$('#phCoverage').scrollIntoView({behavior:'smooth',block:'start'});});
  }
  function updatePlaces() {
    const base=records.filter(r=>!state.department||r.department===state.department);
    $('#phDepartment').value=state.department;
    $('#phCity').innerHTML=options(M.sorted(base.map(r=>r.city)),'Todos los municipios');$('#phCity').value=state.city;
    const neighborhoods=M.sorted(base.filter(r=>!state.city||r.city===state.city).map(r=>r.neighborhood));
    $('#phNeighborhood').innerHTML=options(neighborhoods,neighborhoods.length?'Todos los barrios publicados':'Sin barrios publicados');$('#phNeighborhood').value=state.neighborhood;$('#phNeighborhood').disabled=!neighborhoods.length;
  }
  function render() {
    if(!records)return;
    const found=M.filter(records,state),summ=M.stats(found),items=state.view==='cities'?M.cities(found):found,pages=Math.max(1,Math.ceil(items.length/size));
    state.page=Math.min(pages,Math.max(1,state.page));
    const page=items.slice((state.page-1)*size,state.page*size);
    document.querySelectorAll('[data-ph-kind]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.phKind===state.kind)));
    document.querySelectorAll('[data-ph-view]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.phView===state.view)));
    $('#phResultCount').innerHTML=`<b>${num(found.length)}</b> registros · ${num(summ.cities)} municipios${state.department?' · '+esc(state.department):''}`;
    if(!page.length)$('#phResults').innerHTML='<div class="ph-empty"><h3>No hay registros integrados para estos filtros.</h3><p>Esto no indica que no existan droguerías en la zona. Amplía la búsqueda o consulta la cobertura disponible.</p><button class="button button-secondary" data-ph-clear>Ver toda la base</button></div>';
    else if(state.view==='cities')$('#phResults').innerHTML=`<div class="ph-table-scroll"><table class="ph-city-table"><caption class="sr-only">Registros por municipio para los filtros seleccionados</caption><thead><tr><th>Municipio</th><th>Cruz Verde</th><th>Locales / sin cadena</th><th>Otras cadenas</th><th>Total</th><th></th></tr></thead><tbody>${page.map(c=>`<tr><td><strong>${esc(c.city)}</strong><small>${esc(c.department)}</small></td><td>${num(c.cruzverde)}</td><td>${num(c.local)}</td><td>${num(c.chain)}</td><td><b>${num(c.total)}</b></td><td><button class="text-button" data-ph-city="${esc(c.city)}" data-ph-city-dept="${esc(c.department)}" aria-label="Ver droguerías en ${esc(c.city)}, ${esc(c.department)}">Explorar ${arrow}</button></td></tr>`).join('')}</tbody></table></div>`;
    else $('#phResults').innerHTML=`<div class="ph-card-grid">${page.map(r=>`<article class="ph-card ${r.kind==='cruzverde'?'ph-cv-card':''}"><div class="ph-card-top"><span class="ph-store-icon">${mark}</span><span class="ph-kind">${labels[r.kind]}</span></div><h3>${esc(r.name)}</h3><p class="ph-card-city">${esc(r.city)} · ${esc(r.department)}</p><p class="ph-address">${esc(r.address)}</p><p class="ph-neighborhood">Barrio: ${esc(r.neighborhood||'no publicado')}${r.locality?' · '+esc(r.locality):''}</p><div class="ph-card-source"><span>${esc(dateText(r))}</span><small>${esc(sourceMap.get(r.sources[0]).publisher)}</small></div><div class="ph-card-actions"><button class="text-button" data-ph-detail="${r.id}" aria-label="Ver ficha de ${esc(r.name)}, ${esc(r.address)}">Ver ficha <span aria-hidden="true">→</span></button><a href="${esc(M.mapURL(r))}" target="_blank" rel="noopener noreferrer" aria-label="${r.lat===null?'Buscar dirección':'Ver coordenadas'} de ${esc(r.name)} en Google Maps">${r.lat===null?'Buscar dirección':'Ver en mapa'} ${arrow}</a></div></article>`).join('')}</div>`;
    $('#phPagination').hidden=!items.length;
    $('#phPagination').innerHTML=`<span>${state.view==='cities'?'Municipios':'Registros'} ${(state.page-1)*size+1}–${Math.min(state.page*size,items.length)} de ${num(items.length)}</span><div><button data-ph-page="${state.page-1}" ${state.page===1?'disabled':''} aria-label="Página anterior">←</button><span>${state.page} / ${pages}</span><button data-ph-page="${state.page+1}" ${state.page===pages?'disabled':''} aria-label="Página siguiente">→</button></div>`;
  }
  function clear() {
    Object.assign(state,{query:'',department:'',city:'',neighborhood:'',kind:'',chain:'',coordinates:false,page:1});
    $('#phQuery').value='';$('#phChain').value='';$('#phCoordinates').checked=false;updatePlaces();render();
  }
  function detail(id) {
    const r=records.find(r=>r.id===id);if(!r)return;
    const fields=[['Departamento',r.department],['Municipio',r.city],['Barrio',r.neighborhood||'No publicado'],['Localidad',r.locality||'No publicada'],['Dirección',r.address],['Teléfono en la fuente',r.phone||'No publicado'],['Horario en la fuente',r.hours||'No publicado'],['Cadena',r.chain||'Sin cadena identificada'],['Renovación comercial',r.year||'No aplica / no publicada'],['Coordenadas',r.lat!==null?`${r.lat}, ${r.lon}`:'No publicadas']];
    $('#phDetail').innerHTML=`<span class="ph-eyebrow">FICHA DE ESTABLECIMIENTO / ${labels[r.kind]}</span><h2>${esc(r.name)}</h2><p>${esc(r.city)} · ${esc(r.department)}</p><div class="ph-detail-grid">${fields.map(([k,v])=>`<div><span>${esc(k)}</span><b>${esc(v)}</b></div>`).join('')}</div><p class="ph-detail-note">Registro documental. Operación actual y disponibilidad de Ritual sin verificar. ${esc(r.note)}</p><h3>Trazabilidad del registro</h3>${r.sources.map(id=>{const s=sourceMap.get(id);return `<div class="ph-detail-source"><a href="${esc(s.url)}" target="_blank" rel="noopener noreferrer">${esc(s.publisher)} ${arrow}</a><p>Fecha del dato: ${esc(s.dataDate)} · Consulta: ${s.consulted}</p><small>${esc(s.note)}</small></div>`;}).join('')}<a class="button button-primary" href="${esc(M.mapURL(r))}" target="_blank" rel="noopener noreferrer">${r.lat!==null?'Abrir coordenadas publicadas':'Buscar la dirección'} ${arrow}</a><p class="ph-map-note">${r.lat!==null?'La ubicación corresponde a las coordenadas publicadas por la fuente.':'La fuente no publicó coordenadas. El enlace busca el texto de la dirección; verifica el resultado en el mapa.'}</p>`;
    $('#phDialog').showModal();$('#phDialog').scrollTop=0;$('.ph-dialog-close').focus();
  }
  function exportCSV() {
    if(!data)return;
    const content=M.csv(M.filter(records,state),data.sources,data.consulted),url=URL.createObjectURL(new Blob([content],{type:'text/csv;charset=utf-8;'}));
    const a=document.createElement('a');a.href=url;a.download='Ritual_Droguerias_Filtradas_2026-10-07.csv';document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);
    $('#phResultCount').textContent=`CSV descargado: ${num(M.filter(records,state).length)} registros con fuentes y fechas.`;
  }
  document.addEventListener('click',e=>{
    const button=e.target.closest('button');if(!button)return;const d=button.dataset;
    if(d.phRetry!==undefined){mount();return;}
    if(!data)return;
    if(d.phKind!==undefined){state.kind=d.phKind;state.chain='';$('#phChain').value='';state.page=1;render();}
    if(d.phView){state.view=d.phView;state.page=1;render();}
    if(d.phClear!==undefined)clear();
    if(d.phExport!==undefined)exportCSV();
    if(d.phPage){state.page=Number(d.phPage);render();$('#phExplorerTitle').scrollIntoView({block:'start'});}
    if(d.phDetail)detail(d.phDetail);
    if(d.phClose!==undefined)$('#phDialog').close();
    if(d.phCity){state.department=d.phCityDept;state.city=d.phCity;state.neighborhood='';state.view='stores';state.page=1;updatePlaces();render();$('#phExplorerTitle').scrollIntoView({block:'start'});}
    if(d.phDepartment){clear();state.department=d.phDepartment;state.page=1;updatePlaces();render();$('#phExplorerTitle').scrollIntoView({block:'start'});}
  });
  window.RitualPharmacies={mount,exportCSV};
})();
