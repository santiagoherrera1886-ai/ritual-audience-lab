(() => {
  'use strict';
  const $ = s => document.querySelector(s);
  const $$ = s => [...document.querySelectorAll(s)];
  const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[c]));
  const norm = value => String(value).normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  const number = (n, digits = 0) => n.toLocaleString('es-CO', { maximumFractionDigits: digits, minimumFractionDigits: digits });
  const money = n => '$' + number(n / 1e6, n > 0 && n < 1e6 ? 2 : 0) + ' M';
  const millions = n => number(n / 1e6, 1) + ' M';
  const DATA = window.RITUAL_SIGNALS;
  const Model = window.RitualModel;
  const CHANNELS = Model.CHANNELS;
  const ICONS = {
    overview:'<rect x="3" y="3" width="7" height="7" rx="2"/><rect x="14" y="3" width="7" height="7" rx="2"/><rect x="3" y="14" width="7" height="7" rx="2"/><rect x="14" y="14" width="7" height="7" rx="2"/>',
    people:'<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/><circle cx="9" cy="7" r="4"/>',
    media:'<rect x="3" y="4" width="18" height="13" rx="2"/><path d="M8 21h8M12 17v4m-1-13 4 2.5-4 2.5z"/>',
    grid:'<rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/>',
    sliders:'<path d="M4 7h9m4 0h3M4 17h3m4 0h9"/><circle cx="15" cy="7" r="2"/><circle cx="9" cy="17" r="2"/>',
    sun:'<circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.5 1.5m11 11L19 19M5 19l1.5-1.5m11-11L19 5"/>',
    moon:'<path d="M20.5 13.1A9 9 0 0 1 10.9 3.5 9 9 0 1 0 20.5 13.1Z"/>',
    info:'<circle cx="12" cy="12" r="9"/><path d="M12 11v6m0-10v.1"/>',
    'arrow-up':'<path d="M6 18 18 6M6 6h12v12"/>',
    'arrow-right':'<path d="M4 12h16m-6-6 6 6-6 6"/>',
    'arrow-left':'<path d="M20 12H4m6-6-6 6 6 6"/>',
    check:'<path d="m5 12 4 4L19 6"/>',
    download:'<path d="M12 3v12m-5-5 5 5 5-5M4 16v4h16v-4"/>',
    globe:'<circle cx="12" cy="12" r="9"/><ellipse cx="12" cy="12" rx="4" ry="9"/><path d="M3 12h18M5 6h14M5 18h14"/>',
    menu:'<path d="M4 6h16M4 12h16M4 18h16"/>',
    sparkles:'<path d="m12 3 2.5 6.5L21 12l-6.5 2.5L12 21l-2.5-6.5L3 12l6.5-2.5L12 3ZM20 2v4m-2-2h4"/>',
    search:'<circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 5 5"/>',
    layers:'<path d="m12 3 10 6-10 6L2 9l10-6Zm-9 11 9 5 9-5M3 18l9 5 9-5"/>',
    list:'<path d="M8 6h13M8 12h13M8 18h13M3 6h.1M3 12h.1M3 18h.1"/>',
    close:'<path d="m6 6 12 12M6 18 18 6"/>',
    reset:'<path d="M3 10a9 9 0 1 1 1 7M3 3v7h7"/>',
    plus:'<path d="M12 4v16M4 12h16"/>',
    heart:'<path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8Z"/>',
    activity:'<path d="M2 12h5l3-8 4 16 3-8h5"/>',
    leaf:'<path d="M20 3C8 2 2 8 5 16s16 7 15-13ZM5 20 16 9"/>',
    coffee:'<path d="M4 8h13v8a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5V8Zm13 1h2a3 3 0 0 1 0 6h-2M8 2v2m5-2v2"/>',
    laptop:'<rect x="4" y="3" width="16" height="13" rx="2"/><path d="m4 16-2 5h20l-2-5"/>',
    pin:'<path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="2.5"/>',
    target:'<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/>',
    chart:'<path d="M3 3v18h18M6 15l5-5 4 3 6-8"/>'
  };
  const icon = name => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONS[name] || ICONS.sparkles}</svg>`;
  const i = name => `<i data-icon="${name}">${icon(name)}</i>`;
  function hydrateIcons(root = document) { root.querySelectorAll('i[data-icon]:empty').forEach(el => { el.innerHTML = icon(el.dataset.icon); }); }
const LOGOS={meta:`<svg viewBox="0 0 76 48" aria-hidden="true"><path d="M8 34c0-17 7-28 17-28 8 0 13 8 21 20 5 8 9 15 14 15 5 0 8-6 8-13 0-10-6-18-15-18-11 0-18 15-26 28-3 5-6 7-10 7-5 0-9-4-9-11z" fill="none" stroke="#4f83ff" stroke-width="7" stroke-linecap="round"/></svg>`,google:`<svg viewBox="0 0 56 56" aria-hidden="true"><path d="M20 8c3-5 10-5 13 0l16 28c3 5 1 11-4 14s-11 1-14-4L15 18c-2-4-1-8 5-10z" fill="#4285F4"/><path d="M18 9c3-5 10-6 14-3 5 3 6 9 3 14L18 49c-3 5-9 7-14 4-5-3-6-9-3-14z" fill="#FBBC05"/><circle cx="11" cy="43" r="10" fill="#34A853"/></svg>`,tiktok:`<svg viewBox="0 0 56 56" aria-hidden="true"><path d="M34 6v28c0 13-11 19-21 13-8-5-8-18 0-23 4-3 8-4 13-3v10c-6-1-9 2-9 6 0 3 3 6 6 6 5 0 7-4 7-10V6z" fill="#fff"/><path d="M34 6c2 9 7 13 17 13v10c-12 0-20-6-24-17V6z" fill="#25F4EE"/></svg>`,youtube:`<svg viewBox="0 0 64 48" aria-hidden="true"><rect x="3" y="8" width="58" height="32" rx="10" fill="#FF0033"/><path d="M27 16l15 8-15 9z" fill="#fff"/></svg>`,programmatic:`<svg viewBox="0 0 56 56" aria-hidden="true"><rect x="7" y="7" width="42" height="42" rx="13" fill="#7d4dff"/><path d="M16 35l8-15 7 9 7-11" fill="none" stroke="#fff" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/><circle cx="40" cy="17" r="4" fill="#6ee7ff"/></svg>`};
  // The inherited TikTok mark was white; use a dark mark on the editorial canvas.
  LOGOS.tiktok = LOGOS.tiktok.replace('fill="#fff"', 'fill="#17132e"');
  const PERSONAS = [
    { name:'Valeria', image:'valeria', age:'25–34', subtitle:'Wellness y autocuidado', description:'Convierte el cuidado personal en pequeños hábitos que le permiten sentirse bien todos los días.', tags:['Yoga','Pilates','Skincare','Rutinas','Descanso'], story:'Busca bienestar que se sienta cercano, práctico y fácil de incorporar a su rutina.', moment:'HACER ESPACIO PARA SÍ MISMA', icon:'heart', tint:'#eadcf8', count:34 },
    { name:'Carlos', image:'carlos', age:'30–44', subtitle:'Vida activa y recuperación', description:'Se mueve, entrena y busca un balance entre sus metas personales y el ritmo de la semana.', tags:['Running','Gimnasio','Hidratación','Deporte','Energía'], story:'Valora la constancia: del entrenamiento a la pausa, quiere acompañar cada momento.', moment:'ENCONTRAR SU PROPIO RITMO', icon:'activity', tint:'#e1eef9', count:43 },
    { name:'Julián', image:'julian', age:'35–54', subtitle:'Equilibrio y descanso', description:'Integra bienestar, familia y trabajo. Le interesan los hábitos que puede sostener en el tiempo.', tags:['Sueño','Familia','Hábitos','Bienestar','Meditación'], story:'Quiere cerrar el día con una pausa y construir una rutina de descanso más consciente.', moment:'DARLE VALOR A LA PAUSA', icon:'moon', tint:'#f1e3e6', count:42 }
  ];
  const ROLES = {
    meta:['Afinidad y cobertura','Conecta los intereses con historias de bienestar, rutinas y momentos cotidianos.'],
    google:['Intención y demanda','Acompaña búsquedas de marca y categoría. Las señales compartidas con YouTube se validan por formato.'],
    tiktok:['Descubrimiento y cercanía','Entra en la conversación a través de creadores, tendencias y hábitos reales.'],
    youtube:['Video y consideración','Construye presencia con contenidos que explican, inspiran y generan recordación.'],
    programmatic:['Contexto incremental','Explora entornos de bienestar y lifestyle. Requiere validar inventario y disponibilidad.']
  };
  const CATEGORIES = [
    {id:'all',name:'Todos los intereses',icon:'grid'},
    {id:'wellness',name:'Bienestar',icon:'heart',image:'yoga'},
    {id:'active',name:'Vida activa',icon:'activity',image:'running'},
    {id:'nutrition',name:'Alimentación',icon:'leaf',image:'nutrition'},
    {id:'beauty',name:'Cuidado personal',icon:'sparkles',image:'skincare'},
    {id:'rest',name:'Sueño y descanso',icon:'moon',image:'rest'},
    {id:'family',name:'Familia y hogar',icon:'people',image:'family'},
    {id:'technology',name:'Tecnología',icon:'laptop',image:'technology'},
    {id:'lifestyle',name:'Estilo de vida',icon:'coffee',image:'yoga'}
  ];
  function categoryFor(row) {
    const text = norm(row.interest);
    if (/dorm|suen|descans|noche|insom|sleep|melaton|relaj/.test(text)) return 'rest';
    if (/skincare|belleza|piel|maquilla|cuidado personal|beauty/.test(text)) return 'beauty';
    if (/nutri|alimenta|comida|cocina|dieta|receta|proteina|vitamina|suplement|magnesio|hidrat|electrolito/.test(text)) return 'nutrition';
    if (/familia|padre|madre|hogar|patern|matern/.test(text)) return 'family';
    if (/tecnolog|app|wearable|smartwatch|dispositiv/.test(text)) return 'technology';
    if (/running|run |correr|carrera|deport|gimnas|fitness|entrena|crossfit|cicl|bici|futbol|natacion|maraton|sender|trail|outdoor|workout|triathlon/.test(text)) return 'active';
    if (/yoga|pilates|bienestar|wellness|mindful|medita|salud|autocuida|habito|autoconoc/.test(text)) return 'wellness';
    return 'lifestyle';
  }
  const rows = DATA.map((d, id) => ({...d, id, category:categoryFor(d)}));
  const persona = name => PERSONAS.find(p => p.name === name) || PERSONAS[0];
  function platformMatch(d, id) {
    if (id === 'meta') return /Meta/.test(d.platform);
    if (id === 'google' || id === 'youtube') return /Google|YouTube/.test(d.platform);
    if (id === 'tiktok') return /TikTok/.test(d.platform);
    return false; // The original matrix does not contain Programmatic platform rows.
  }
  const platformId = d => /Meta/.test(d.platform) ? 'meta' : /TikTok/.test(d.platform) ? 'tiktok' : 'youtube';
  function imageFor(row) {
    const text = norm(row.interest);
    if (/gimnas|gym|crossfit|entrenamiento/.test(text)) return 'gym';
    return CATEGORIES.find(c => c.id === row.category)?.image || 'yoga';
  }
  let state = Model.defaults();
  let saved = [];
  let storageAvailable = true;
  const STORAGE_KEY = 'ritual-editorial-v1';
  try {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null');
    if (stored?.version === 1) {
      state = Model.sanitize(stored.state);
      if (Array.isArray(stored.saved)) saved = stored.saved.slice(0, 3).filter(x => x && typeof x.name === 'string' && x.state).map(x => ({name:x.name.slice(0,40), state:Model.sanitize(x.state)}));
    }
  } catch { storageAvailable = false; }
  function persist() {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify({version:1,state,saved})); }
    catch { storageAvailable = false; }
    $('.saved-locally').innerHTML = `${i(storageAvailable ? 'check':'info')}${storageAvailable ? 'Guardado automático en este navegador':'Cambios activos en esta sesión'}`;
  }
  let currentView = 'summary';
  const TITLES = {summary:'Resumen',audiences:'Audiencias',media:'Medios',library:'Intereses',sim:'Simulador'};
  const filters = { query:'', category:'all', person:'all', platform:'all', page:1, view:'grid' };
  let toastTimeout;
  function toast(message) { clearTimeout(toastTimeout); $('#toast').textContent = message; $('#toast').classList.add('visible'); toastTimeout = setTimeout(() => $('#toast').classList.remove('visible'), 3200); }
  function closeMenu() { $('#sidebar').classList.remove('open'); $('#mobileScrim').classList.remove('visible'); $('#menuButton').setAttribute('aria-expanded','false'); }
  function renderRoute() {
    const next = location.hash.slice(1);
    currentView = Object.hasOwn(TITLES, next) ? next : 'summary';
    $$('.view').forEach(v => { const active = v.id === currentView; v.hidden = !active; v.classList.toggle('active',active); });
    $$('[data-nav]').forEach(a => { const active = a.dataset.nav === currentView; a.classList.toggle('active',active); if(active) a.setAttribute('aria-current','page'); else a.removeAttribute('aria-current'); });
    $('#breadcrumbName').textContent = TITLES[currentView];
    document.title = `${TITLES[currentView]} · Ritual Audience Atlas 2027`;
    $('#exportBtn').title = currentView === 'library' ? 'Exportar todas las señales que coinciden con los filtros' : currentView === 'sim' ? 'Exportar el escenario y su distribución de inversión' : 'Exportar datos de esta vista';
    if(currentView === 'library') renderLibrary();
    if(currentView === 'media') renderMedia();
    if(currentView === 'sim') renderSimulator();
    closeMenu();
  }
  function navigate(view) {
    if(!Object.hasOwn(TITLES,view)) return;
    if($('#detailDialog').open) $('#detailDialog').close();
    if(location.hash === '#'+view) renderRoute(); else location.hash = view;
    window.scrollTo({top:0,behavior:'instant'});
    $('#main').focus({preventScroll:true});
  }
  function openLibrary({person:who='all', platform='all'} = {}) {
    Object.assign(filters,{query:'',category:'all',person:who,platform,page:1});
    $('#libSearch').value = ''; $('#platformFilter').value = platform;
    navigate('library'); renderLibrary();
  }
  function renderSummary() {
    const kpis = [['grid','119','Señales de afinidad'],['globe','14,0 M','Universo de planeación'],['people','3','Personas estratégicas'],['media','5','Canales complementarios']];
    $('#summaryKpis').innerHTML = kpis.map(([name,value,label]) => `<div class="kpi-card"><span class="kpi-icon">${i(name)}</span><div><b>${value}</b><p>${label}</p></div></div>`).join('');
    const territories = [['Bogotá',31],['Medellín',17],['Cali',12],['Caribe, Santander y Eje',21],['Otros territorios',19]];
    $('#territoryRows').innerHTML = territories.map(([name,pct]) => `<div class="territory-row"><span>${name}</span><div class="territory-track"><span style="width:${pct/31*100}%"></span></div><b>${pct}%</b></div>`).join('');
    $('#summaryPeople').innerHTML = PERSONAS.map(p => `<button class="summary-person" data-profile="${p.name}"><img src="assets/${p.image}.jpg" alt="Retrato ilustrativo de ${p.name}"><div><div class="summary-person-name">${p.name}<span>${p.age} años</span></div><p>${p.subtitle}</p></div><span>${p.count}</span>${i('arrow-up')}</button>`).join('');
    $('#summaryMedia').innerHTML = CHANNELS.map(c => `<div class="media-ribbon-item">${LOGOS[c.id]}<span>${c.name}</span></div>`).join('');
  }
  function renderPersonas() {
    $('#personaCards').innerHTML = PERSONAS.map((p,idx) => `<article class="persona-card" style="--tint:${p.tint}"><div class="persona-photo"><img src="assets/${p.image}.jpg" alt="Retrato ilustrativo del perfil ${p.name}"><span class="persona-number">PERSONA / 0${idx+1}</span><span class="persona-moment">${i(p.icon)}${p.moment}</span></div><div class="persona-info"><div class="persona-title"><h2>${p.name}</h2><span class="persona-age">${p.age} años</span></div><h3>${p.subtitle}</h3><p class="persona-description">${p.description}</p><div class="signal-count"><strong>${p.count}</strong><span>señales de afinidad</span></div><div class="chip-list">${p.tags.map(t=>`<span class="chip">${t}</span>`).join('')}</div><div class="persona-story"><span>SU FORMA DE VIVIR RITUAL</span><p>${p.story}</p></div><button class="button button-primary" data-person-signals="${p.name}">Explorar sus señales${i('arrow-right')}</button><button class="text-button" data-profile="${p.name}">Ver perfil completo${i('arrow-up')}</button></div></article>`).join('');
  }
  function renderMedia() {
    const result = Model.calculate(state);
    let cursor=0;
    $('#mixDonut').style.background = 'conic-gradient('+CHANNELS.map((c,idx)=>{ const start=cursor; cursor+=state.shares[idx]; return `${c.accent} ${start}% ${cursor}%`; }).join(',')+')';
    $('#mixLegend').innerHTML = CHANNELS.map((c,idx)=>`<div><i style="background:${c.accent}"></i><span>${c.name}</span><b>${state.shares[idx]}%</b></div>`).join('');
    $('#mediaBudget').textContent = money(result.budget)+' COP';
    $('#mediaRows').innerHTML = result.channels.map(c => {
      const count = rows.filter(d=>platformMatch(d,c.id)).length;
      return `<tr><td><div class="platform-brand">${LOGOS[c.id]}<b>${c.name}</b></div></td><td><div class="platform-role"><b>${ROLES[c.id][0]}</b><p>${ROLES[c.id][1]}</p></div></td><td><div class="mix-percent" style="--accent:${c.accent}"><strong>${c.share}%</strong><div><i style="width:${c.share}%"></i></div></div></td><td class="media-money">${money(c.spend)}</td><td><span class="signal-badge">${count || '—'}${c.id==='google'||c.id==='youtube' ? '<small> compartidas</small>' : ''}</span></td><td><button class="icon-button" data-media="${c.id}" aria-label="${c.id==='programmatic'?'Ver contexto de Programmatic':'Explorar señales de '+c.name}">${i('arrow-up')}</button></td></tr>`;
    }).join('');
  }
  function filteredRows() {
    return rows.filter(d => (filters.person==='all'||d.cluster===filters.person) && (filters.category==='all'||d.category===filters.category) && (filters.platform==='all'||platformMatch(d,filters.platform)) && (!filters.query||norm(`${d.interest} ${d.platform} ${d.territory} ${d.cluster} ${d.product}`).includes(norm(filters.query))));
  }
  function clearFilters() {
    Object.assign(filters,{query:'',category:'all',person:'all',platform:'all',page:1});
    $('#libSearch').value=''; $('#platformFilter').value='all'; renderLibrary();
  }
  function renderLibrary() {
    const found=filteredRows(), size=filters.view==='grid'?12:18, pages=Math.max(1,Math.ceil(found.length/size));
    filters.page=Math.min(pages,Math.max(1,filters.page));
    const pageRows=found.slice((filters.page-1)*size,filters.page*size);
    $('#libCount').textContent=`${found.length} de 119 señales`;
    $('#categoryNav').innerHTML=CATEGORIES.map(c=>`<button class="category-nav-button ${filters.category===c.id?'active':''}" data-category="${c.id}" aria-pressed="${filters.category===c.id}">${i(c.icon)}${c.name}<span>${c.id==='all'?rows.length:rows.filter(d=>d.category===c.id).length}</span></button>`).join('');
    $$('[data-person-filter]').forEach(b=>{const active=b.dataset.personFilter===filters.person;b.classList.toggle('active',active);b.setAttribute('aria-pressed',String(active));});
    $$('[data-library-view]').forEach(b=>{const active=b.dataset.libraryView===filters.view;b.classList.toggle('active',active);b.setAttribute('aria-pressed',String(active));});
    $('#clearFilters').hidden = filters.person==='all'&&filters.category==='all'&&filters.platform==='all'&&!filters.query;
    if(!found.length) {
      $('#libraryResults').innerHTML=`<div class="empty-state">${i('search')}<h3>No encontramos esa conexión.</h3><p>Prueba otro interés o amplía los filtros para seguir explorando.</p><button class="button button-secondary" data-action="clear-filters">Ver todas las señales</button></div>`;
    } else if(filters.view==='grid') {
      $('#libraryResults').innerHTML=`<div class="interests-grid">${pageRows.map(d=>{const p=persona(d.cluster),c=CATEGORIES.find(c=>c.id===d.category);return `<button class="interest-card" data-signal="${d.id}" aria-label="Explorar ${esc(d.interest)} · ${esc(d.cluster)} · ${esc(d.platform)}"><div class="interest-photo"><img loading="lazy" src="assets/${imageFor(d)}.jpg" alt=""><span class="interest-category">${c.name}</span><span class="interest-platform" title="${esc(d.platform)}">${LOGOS[platformId(d)]}</span></div><div class="interest-body"><h3>${esc(d.interest)}</h3><div class="interest-meta"><img src="assets/${p.image}.jpg" alt="">${p.name}<span class="priority">Prioridad ${esc(d.priority).toLowerCase()}</span></div></div></button>`;}).join('')}</div>`;
    } else {
      $('#libraryResults').innerHTML=`<div class="table-scroll"><table class="interest-table"><thead><tr><th>Interés</th><th>Persona</th><th>Plataforma</th><th>Prioridad</th></tr></thead><tbody>${pageRows.map(d=>`<tr><td><button data-signal="${d.id}"><img src="assets/${imageFor(d)}.jpg" alt="">${esc(d.interest)}</button></td><td>${esc(d.cluster)}</td><td>${LOGOS[platformId(d)]}${esc(d.platform)}</td><td>${esc(d.priority)}</td></tr>`).join('')}</tbody></table></div>`;
    }
    $('#pagination').hidden=!found.length;
    $('#pagination').innerHTML=`<span>Mostrando ${(filters.page-1)*size+1}–${Math.min(filters.page*size,found.length)} de ${found.length}</span><div><button data-page="${filters.page-1}" ${filters.page===1?'disabled':''} aria-label="Página anterior">${i('arrow-left')}</button><span>Página ${filters.page} de ${pages}</span><button data-page="${filters.page+1}" ${filters.page===pages?'disabled':''} aria-label="Página siguiente">${i('arrow-right')}</button></div>`;
  }
  function showDialog(eyebrow, html) {
    $('#dialogEyebrow').textContent=eyebrow;
    $('#dialogContent').innerHTML=html;
    if(!$('#detailDialog').open) $('#detailDialog').showModal();
    $('#detailDialog').scrollTop=0;
    $('#closeDialog').focus();
  }
  function showProfile(name) {
    const p=persona(name), signals=rows.filter(d=>d.cluster===name);
    const counts=[['meta','Meta'],['google','Google / YouTube'],['tiktok','TikTok']];
    showDialog('PERSONA ESTRATÉGICA · PERFIL ILUSTRATIVO',`<img class="dialog-portrait" src="assets/${p.image}.jpg" alt="Retrato ilustrativo de ${p.name}"><h2>${p.name} <span class="purple">${p.age}</span></h2><p class="dialog-description">${p.description}</p><div class="detail-grid"><div class="detail-box"><span>Territorio</span><b>${p.subtitle}</b></div><div class="detail-box"><span>Señales originales</span><b>${p.count} señales de afinidad</b></div></div><div class="detail-section"><h3>Momento Ritual</h3><p>${p.story}</p></div><div class="detail-section"><h3>Presencia por plataforma</h3><div class="detail-grid">${counts.map(([id,title])=>`<div class="detail-box"><span>${title}</span><b>${signals.filter(d=>platformMatch(d,id)).length} señales</b></div>`).join('')}</div></div><div class="detail-section"><h3>Intereses destacados</h3><div class="related-signals">${signals.slice(0,7).map(d=>`<button data-signal="${d.id}">${esc(d.interest)}</button>`).join('')}</div></div><div class="dialog-actions"><button class="button button-primary" data-person-signals="${p.name}">Explorar las ${p.count} señales${i('arrow-right')}</button></div>`);
  }
  function showSignal(id) {
    const d=rows[id];if(!d)return;
    const related=rows.filter(x=>x.id!==d.id&&x.cluster===d.cluster&&x.category===d.category).slice(0,6);
    const details=[['Persona',d.cluster],['Plataforma',d.platform],['Territorio',d.territory],['Prioridad',d.priority],['Producto',d.product],['Tipo de señal',d.type]];
    showDialog(`SEÑAL ${String(id+1).padStart(3,'0')} / 119`,`<h2>${esc(d.interest)}</h2><p class="dialog-description">Una puerta de entrada al universo de ${esc(d.cluster)}.</p><div class="detail-grid">${details.map(([label,value])=>`<div class="detail-box"><span>${label}</span><b>${esc(value)}</b></div>`).join('')}</div><div class="detail-section"><h3>Rol táctico</h3><p>${esc(d.tactic)}</p></div><div class="detail-section"><h3>Validación en plataforma</h3><p>${esc(d.validation)}</p></div>${related.length?`<div class="detail-section"><h3>Conexiones relacionadas</h3><div class="related-signals">${related.map(x=>`<button data-signal="${x.id}">${esc(x.interest)}</button>`).join('')}</div></div>`:''}<div class="dialog-actions"><button class="button button-secondary" data-person-signals="${esc(d.cluster)}">Ver todas las señales de ${esc(d.cluster)}${i('arrow-right')}</button></div>`);
  }
  function showMethod() {
    showDialog('CÓMO LEER EL ATLAS',`<h2>Una base para <span class="purple">tomar decisiones.</span></h2><p class="dialog-description">Este atlas organiza hipótesis de audiencias y simula escenarios. No está conectado a cuentas publicitarias ni contiene resultados de campañas.</p><div class="detail-section"><h3>01 · La matriz de afinidades</h3><p>Se conservan las 119 filas originales: 34 de Valeria, 43 de Carlos y 42 de Julián. Una señal puede aparecer en varias plataformas. Los perfiles y las fotografías son ilustrativos; las categorías de la biblioteca son una agrupación editorial.</p><p>Google y YouTube comparten 34 señales de la matriz y no constituyen filas adicionales. Programmatic es un canal propuesto; no tiene señales propias en la base original.</p></div><div class="detail-section"><h3>02 · Universo y territorio</h3><p>Los 53,7 M de contexto nacional, 22,5 M de adultos y 14,0 M de base de planeación son supuestos heredados del proyecto sin fuente demográfica verificada adjunta. El simulador permite cambiar el universo. Las participaciones territoriales son una propuesta estratégica, no alcance medido.</p></div><div class="detail-section"><h3>03 · Modelo de alcance</h3><code>Impresionesᵢ = inversiónᵢ / CPMᵢ × 1.000<br>Rᵢ = U × capᵢ × (1 − e^(−impresionesᵢ / (U × capᵢ × kᵢ)))<br>Alcance ≈ U × [1 − ∏(1 − Rᵢ / U)]<br>Frecuencia = impresiones totales / alcance</code><p>El alcance se limita al universo y cada canal tiene una curva de saturación. La combinación supone independencia entre medios: es una aproximación para planeación, no una deduplicación medida.</p><p>CPM iniciales (COP): Meta 9.200; Google 12.500; TikTok 8.200; YouTube 10.500; Programmatic 9.800. Límites de cobertura: 78%, 62%, 58%, 66% y 46%, respectivamente. kᵢ = 1,85 + (1 − capᵢ) × 1,6. Estos valores son supuestos editables o heredados, no cotizaciones.</p></div><div class="detail-section"><h3>04 · Qué exportas</h3><p>En Intereses, el CSV incluye todas las filas filtradas, no solo la página visible. En Medios, exporta la mezcla activa. En el Simulador, incluye el escenario actual, sus canales y los escenarios comparados. Resumen y Audiencias exportan la matriz completa con táctica y validación.</p></div><div class="detail-section"><h3>05 · Guardado</h3><p>El escenario se guarda únicamente en este navegador. La comparación admite hasta tres escenarios. Restablecer devuelve los valores iniciales del simulador; borrar comparación elimina los escenarios guardados.</p></div>`);
  }
  function setupSimulator() {
    $('#mixRows').innerHTML=CHANNELS.map((c,idx)=>`<div class="mix-row"><span class="mix-brand">${LOGOS[c.id]}${c.name}</span><div class="mix-slider"><input type="range" min="0" max="100" step="1" id="share-${c.id}" data-share="${idx}" aria-label="Porcentaje de inversión en ${c.name}" value="${state.shares[idx]}"><output id="shareValue-${c.id}" for="share-${c.id}">${state.shares[idx]}%</output></div><input id="cpm-${c.id}" class="cpm-input" data-cpm="${idx}" aria-label="CPM de ${c.name} en pesos colombianos" type="number" min="100" max="1000000" step="100" value="${state.cpms[idx]}"><span class="mix-spend" id="spend-${c.id}"></span></div>`).join('');
    syncInputs();
  }
  function syncInputs() {
    $('#budget').value=state.budget;$('#budgetValue').value=state.budget;$('#universeValue').value=state.universe;
    CHANNELS.forEach((c,idx)=>{$('#share-'+c.id).value=state.shares[idx];$('#cpm-'+c.id).value=state.cpms[idx];});
  }
  function renderSimulator() {
    const result=Model.calculate(state);
    const metrics=[['globe',millions(result.universe),'Universo de planeación','Base editable para el escenario'],['people',millions(result.reach),'Alcance estimado',number(result.coverage*100,1)+'% del universo'],['activity',number(result.frequency,1),'Frecuencia media','Impactos por persona alcanzada'],['media',millions(result.impressions),'Impresiones estimadas','Total proyectado de impactos']];
    $('#simKpis').innerHTML=metrics.map(([name,value,label,detail])=>`<div class="sim-kpi"><span>${i(name)}${label}</span><strong>${value}</strong><small>${detail}</small></div>`).join('');
    result.channels.forEach((c,idx)=>{$('#share-'+c.id).value=state.shares[idx];$('#shareValue-'+c.id).textContent=state.shares[idx]+'%';$('#spend-'+c.id).textContent=money(c.spend);$('#spend-'+c.id).title='$'+number(c.spend)+' COP';});
    const isDefaultMix=JSON.stringify(state.shares)===JSON.stringify(Model.defaults().shares) && JSON.stringify(state.cpms)===JSON.stringify(Model.defaults().cpms) && state.universe===14;
    $$('[data-preset]').forEach(b=>{const active=isDefaultMix&&state.budget==={conservative:300,balanced:600,growth:1200}[b.dataset.preset];b.classList.toggle('active',active);b.setAttribute('aria-pressed',String(active));});
    drawChart(result);
    $('#simInsight').textContent=result.budget===0?'Sin inversión, el modelo proyecta cero alcance e impresiones.':result.frequency>6?`Frecuencia estimada de ${number(result.frequency,1)}. Revisa la mezcla y los límites de repetición antes de ampliar la inversión.`:`Con ${money(result.budget)}, el escenario proyecta ${number(result.coverage*100,1)}% de cobertura y ${number(result.frequency,1)} impactos por persona.`;
    renderComparison();
  }
  function drawChart(current) {
    const w=780,h=300,left=49,right=43,top=29,bottom=47,plotW=w-left-right,plotH=h-top-bottom;
    const maxBudget=Math.max(100,state.budget)*2;
    const points=Array.from({length:9},(_,idx)=>Model.calculate({...state,budget:maxBudget/2},idx/4));
    const maxFreq=Math.max(4,Math.ceil(Math.max(...points.map(v=>v.frequency))/2)*2);
    const at=(idx,value,max)=>[left+plotW*idx/8,top+plotH*(1-value/max)];
    const reach=points.map((v,idx)=>at(idx,v.reach,current.universe));
    const freq=points.map((v,idx)=>at(idx,v.frequency,maxFreq));
    let html='<title>Alcance estimado en millones y frecuencia según inversión en millones de pesos</title><defs><linearGradient id="reachFill" x1="0" y1="0" x2="0" y2="1"><stop stop-color="#9f79eb" stop-opacity=".15"/><stop offset="1" stop-color="#9f79eb" stop-opacity="0"/></linearGradient></defs>';
    for(let row=0;row<=4;row++){
      const y=top+plotH*row/4;
      html+=`<line class="chart-grid" x1="${left}" y1="${y}" x2="${w-right}" y2="${y}"/><text class="chart-axis" text-anchor="end" x="${left-12}" y="${y+4}">${number(state.universe*(1-row/4),1)}</text><text class="chart-axis" x="${w-right+13}" y="${y+4}">${number(maxFreq*(1-row/4),1)}</text>`;
    }
    html+=`<text class="chart-axis" x="${left}" y="12">Alcance · M</text><text class="chart-axis" text-anchor="end" x="${w-right}" y="12">Frecuencia</text><polygon fill="url(#reachFill)" points="${left},${top+plotH} ${reach.map(p=>p.join(',')).join(' ')} ${w-right},${top+plotH}"/><polyline class="reach-line" points="${reach.map(p=>p.join(',')).join(' ')}"/><polyline class="freq-line" points="${freq.map(p=>p.join(',')).join(' ')}"/>`;
    reach.forEach((p,idx)=>{html+=`<circle cx="${p[0]}" cy="${p[1]}" r="3.2" fill="#7849ec"><title>${money(points[idx].budget)}: alcance ${millions(points[idx].reach)}</title></circle><circle cx="${freq[idx][0]}" cy="${freq[idx][1]}" r="3.2" fill="#4d9cf7"><title>Frecuencia ${number(points[idx].frequency,1)}</title></circle>`;if(idx%2===0)html+=`<text class="chart-axis" text-anchor="middle" x="${p[0]}" y="${h-24}">${number(maxBudget*idx/8)}</text>`;});
    const currentX=left+plotW*state.budget/maxBudget;
    html+=`<line x1="${currentX}" y1="${top}" x2="${currentX}" y2="${top+plotH}" stroke="#baa2df" stroke-dasharray="4 5"/><text class="chart-axis" text-anchor="middle" x="${left+plotW/2}" y="${h-3}">Inversión total · millones COP</text>`;
    $('#curveSvg').innerHTML=html;
  }
  function renderComparison() {
    $('#comparisonPanel').hidden=saved.length===0;
    $('#comparisonRows').innerHTML=saved.map((entry,idx)=>{const r=Model.calculate(entry.state);return `<tr><td>${esc(entry.name)}</td><td>${money(r.budget)}</td><td>${millions(r.reach)}</td><td>${number(r.frequency,1)}</td><td>${millions(r.impressions)}</td><td><button class="text-button" data-load-scenario="${idx}">Cargar${i('arrow-up')}</button><button class="icon-button" data-delete-scenario="${idx}" aria-label="Eliminar ${esc(entry.name)}">${i('close')}</button></td></tr>`;}).join('');
  }
  function exportCSV() {
    let csvRows, filename;
    if(currentView==='sim'){
      const result=Model.calculate(state);
      csvRows=[['Escenario','Metrica','Valor','Unidad'],['Actual','Inversión',result.budget,'COP'],['Actual','Universo de planeación',result.universe,'personas'],['Actual','Alcance estimado',Math.round(result.reach),'personas'],['Actual','Frecuencia estimada',result.frequency.toFixed(3),'impactos/persona'],['Actual','Impresiones estimadas',Math.round(result.impressions),'impresiones'],[],['Canal','Participación (%)','CPM COP','Inversión COP','Impresiones estimadas','Alcance estimado del canal (no sumable)'],...result.channels.map(c=>[c.name,c.share,c.cpm,c.spend,Math.round(c.impressions),Math.round(c.reach)]),[],['Escenario guardado','Inversión COP','Universo','Alcance estimado','Frecuencia','Impresiones estimadas'],...saved.map(e=>{const r=Model.calculate(e.state);return[e.name,r.budget,r.universe,Math.round(r.reach),r.frequency.toFixed(3),Math.round(r.impressions)];}),[],['Metodología','Supuestos de planeación, independencia entre canales; no es alcance medido.']];filename='Ritual_Escenario_2027.csv';
    }else if(currentView==='media'){
      csvRows=[['Canal','Rol','Inversión (%)','Inversión COP','CPM COP','Observación'],...Model.calculate(state).channels.map(c=>[c.name,ROLES[c.id][0],c.share,c.spend,c.cpm,'Proyección de planeación, no cotización'])];filename='Ritual_Mix_Medios_2027.csv';
    }else{
      const selected=currentView==='library'?filteredRows():rows;
      csvRows=[['ID','Persona','Plataforma','Territorio','Interés','Tipo','Prioridad','Producto','Táctica','Validación'],...selected.map(d=>[d.id+1,d.cluster,d.platform,d.territory,d.interest,d.type,d.priority,d.product,d.tactic,d.validation])];filename=currentView==='library'?'Ritual_Intereses_Filtrados_2027.csv':'Ritual_Audience_Atlas_2027.csv';
    }
    const cell=value=>{let text=String(value??'');if(typeof value==='string'&&/^[=+@-]/.test(text))text="'"+text;return '"'+text.replaceAll('"','""')+'"';};
    const csv='\uFEFF'+csvRows.map(row=>row.map(cell).join(',')).join('\r\n');
    const url=URL.createObjectURL(new Blob([csv],{type:'text/csv;charset=utf-8;'}));const a=document.createElement('a');a.href=url;a.download=filename;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);toast('CSV exportado con los datos de esta vista.');
  }
  document.addEventListener('click',event=>{
    const button=event.target.closest('button');if(!button)return;
    const d=button.dataset;
    if(d.goto)navigate(d.goto);
    if(d.profile)showProfile(d.profile);
    if(d.personSignals)openLibrary({person:d.personSignals});
    if(d.signal!==undefined)showSignal(Number(d.signal));
    if(d.category){filters.category=d.category;filters.page=1;renderLibrary();}
    if(d.personFilter){filters.person=d.personFilter;filters.page=1;renderLibrary();}
    if(d.libraryView){filters.view=d.libraryView;filters.page=1;renderLibrary();}
    if(d.page){filters.page=Number(d.page);renderLibrary();$('#libraryTitle').scrollIntoView({block:'start'});}
    if(d.action==='method')showMethod();
    if(d.action==='clear-filters')clearFilters();
    if(d.media){if(d.media==='programmatic')showDialog('CONTEXTO INCREMENTAL','<h2>Programmatic</h2><p class="dialog-description">Canal propuesto para ampliar la presencia en entornos contextuales de bienestar, lifestyle y retail. No tiene filas propias en la matriz original de 119 señales.</p><div class="detail-section"><h3>Antes de activar</h3><p>Validar inventario, categorías contextuales, CPM y alcance incremental con el proveedor.</p></div><div class="dialog-actions"><button class="button button-primary" data-goto="sim">Ajustar inversión</button></div>');else openLibrary({platform:d.media==='youtube'?'google':d.media});}
    if(d.preset){state={...Model.defaults(),budget:{conservative:300,balanced:600,growth:1200}[d.preset]};syncInputs();renderSimulator();persist();}
    if(d.loadScenario!==undefined){state=Model.sanitize(saved[Number(d.loadScenario)].state);syncInputs();renderSimulator();persist();toast('Escenario cargado en el simulador.');}
    if(d.deleteScenario!==undefined){saved.splice(Number(d.deleteScenario),1);renderComparison();persist();}
  });
  $('#libSearch').addEventListener('input',event=>{filters.query=event.target.value.trim();filters.page=1;renderLibrary();});
  $('#platformFilter').addEventListener('change',event=>{filters.platform=event.target.value;filters.page=1;renderLibrary();});
  $('#clearFilters').addEventListener('click',clearFilters);
  $('#exportBtn').addEventListener('click',exportCSV);
  $('#menuButton').addEventListener('click',()=>{const open=$('#sidebar').classList.toggle('open');$('#mobileScrim').classList.toggle('visible',open);$('#menuButton').setAttribute('aria-expanded',String(open));});
  $('#mobileScrim').addEventListener('click',closeMenu);
  document.addEventListener('keydown',event=>{if(event.key==='Escape')closeMenu();});
  $('#closeDialog').addEventListener('click',()=>$('#detailDialog').close());
  $('#detailDialog').addEventListener('click',event=>{if(event.target===$('#detailDialog')){const rect=event.target.getBoundingClientRect();if(event.clientX<rect.left||event.clientX>rect.right||event.clientY<rect.top||event.clientY>rect.bottom)event.target.close();}});
  $('#budget').addEventListener('input',event=>{state.budget=Number(event.target.value);$('#budgetValue').value=state.budget;renderSimulator();persist();});
  function bindNumber(selector, key, min, max) {
    const input=$(selector);
    input.addEventListener('input',()=>{
      const value=input.valueAsNumber;
      const valid=Number.isFinite(value)&&value>=min&&value<=max;
      input.setAttribute('aria-invalid',String(!valid));
      input.setCustomValidity(valid?'':`Introduce un valor entre ${min} y ${max}.`);
      if(!valid)return;
      state[key]=value;if(key==='budget')$('#budget').value=value;renderSimulator();persist();
    });
    input.addEventListener('change',()=>{if(input.getAttribute('aria-invalid')==='true'){input.value=state[key];input.setAttribute('aria-invalid','false');input.setCustomValidity('');toast(`Usa un valor entre ${number(min,1)} y ${number(max)}.`);}});
  }
  bindNumber('#budgetValue','budget',0,6000);bindNumber('#universeValue','universe',.1,100);
  $('#mixRows').addEventListener('input',event=>{
    const input=event.target;
    if(input.dataset.share!==undefined){state.shares=Model.rebalance(state.shares,Number(input.dataset.share),input.value);renderSimulator();persist();}
    if(input.dataset.cpm!==undefined){const value=input.valueAsNumber,valid=Number.isFinite(value)&&value>=100&&value<=1000000;input.setAttribute('aria-invalid',String(!valid));input.setCustomValidity(valid?'':'El CPM debe estar entre 100 y 1.000.000 COP.');if(valid){state.cpms[Number(input.dataset.cpm)]=value;renderSimulator();persist();}}
  });
  $('#mixRows').addEventListener('change',event=>{const input=event.target;if(input.dataset.cpm!==undefined&&input.getAttribute('aria-invalid')==='true'){input.value=state.cpms[Number(input.dataset.cpm)];input.setCustomValidity('');input.setAttribute('aria-invalid','false');toast('CPM válido: entre $100 y $1.000.000 COP.');}});
  $('#resetSim').addEventListener('click',()=>{state=Model.defaults();syncInputs();renderSimulator();persist();toast('Escenario inicial restablecido.');});
  $('#saveScenario').addEventListener('click',()=>{
    if(saved.length>=3){toast('Puedes comparar hasta 3 escenarios. Elimina uno para guardar otro.');return;}
    const labels=['Escenario 01','Escenario 02','Escenario 03'];const name=labels.find(label=>!saved.some(x=>x.name===label))||'Escenario';
    saved.push({name,state:Model.sanitize(state)});renderComparison();persist();toast('Escenario guardado. Compáralo al final de la página.');
    $('#comparisonPanel').scrollIntoView({behavior:'smooth',block:'nearest'});
  });
  $('#clearScenarios').addEventListener('click',()=>{saved=[];renderComparison();persist();toast('Comparación vaciada.');});
  window.addEventListener('hashchange',()=>{renderRoute();window.scrollTo({top:0,behavior:'instant'});});
  renderSummary();renderPersonas();renderMedia();renderLibrary();setupSimulator();renderSimulator();hydrateIcons();renderRoute();persist();
  $('#colombiaMap').innerHTML = `<svg viewBox="20 0 580 650" role="img" aria-label="Mapa de Colombia con ciudades prioritarias"><path class="colombia" d="M 179.7,476.4 L 164.3,467.9 L 146.8,456.0 L 136.6,461.7 L 106.1,456.7 L 97.4,441.3 L 90.7,441.9 L 54.9,421.4 L 50.0,410.3 L 63.4,407.6 L 61.8,389.6 L 70.2,376.6 L 88.0,374.2 L 103.1,351.7 L 116.8,332.9 L 103.6,324.4 L 110.4,303.5 L 102.3,270.7 L 109.9,261.3 L 104.3,231.0 L 89.8,211.9 L 94.4,194.5 L 105.9,197.1 L 112.7,186.4 L 104.4,165.3 L 108.7,160.0 L 127.2,161.2 L 154.1,136.2 L 168.9,132.3 L 169.3,120.5 L 175.9,90.2 L 196.4,73.6 L 219.0,72.9 L 221.9,65.4 L 249.9,68.4 L 278.1,50.3 L 292.1,42.3 L 309.5,25.0 L 322.2,27.2 L 331.6,36.6 L 324.6,48.7 L 301.6,54.7 L 292.5,72.6 L 278.6,82.9 L 268.2,96.2 L 263.8,121.8 L 253.9,142.8 L 272.4,145.2 L 277.0,161.7 L 284.9,169.6 L 287.7,184.0 L 283.4,197.3 L 284.7,204.7 L 293.5,207.7 L 302.1,220.2 L 348.2,216.8 L 369.0,221.4 L 394.2,252.2 L 408.7,248.4 L 434.5,250.3 L 455.0,246.2 L 467.7,252.4 L 461.2,271.7 L 453.2,283.7 L 450.4,309.4 L 457.6,333.2 L 467.8,343.9 L 469.0,351.9 L 450.9,369.8 L 463.9,377.7 L 473.4,390.2 L 484.3,426.0 L 477.6,430.4 L 470.6,409.2 L 460.6,397.9 L 448.8,410.2 L 378.9,409.4 L 379.3,431.9 L 400.4,435.6 L 399.1,449.3 L 392.0,445.6 L 371.8,451.5 L 371.6,477.5 L 387.5,490.6 L 393.1,511.1 L 392.3,526.7 L 376.2,625.0 L 358.2,605.9 L 347.5,605.1 L 370.6,568.6 L 343.2,551.8 L 321.7,554.9 L 308.7,548.7 L 289.0,558.2 L 262.3,553.7 L 241.1,516.1 L 224.5,506.9 L 213.1,489.9 L 189.3,473.0 L 179.7,476.4 Z"/><circle class="city-halo" cx="226.3" cy="302.0" r="21"/><circle class="city-dot" cx="226.3" cy="302.0" r="7"/><text class="city-label" x="240.3" y="293.0">Bogotá</text><circle class="city-halo" cx="172.2" cy="247.0" r="21"/><circle class="city-dot" cx="172.2" cy="247.0" r="7"/><text class="city-label" x="186.2" y="238.0">Medellín</text><circle class="city-halo" cx="138.2" cy="347.2" r="21"/><circle class="city-dot" cx="138.2" cy="347.2" r="7"/><text class="city-label" x="152.2" y="338.2">Cali</text><circle class="city-halo" cx="200.9" cy="77.7" r="21"/><circle class="city-dot" cx="200.9" cy="77.7" r="7"/><text class="city-label" x="214.9" y="68.7">Barranquilla</text></svg>`;
})();
