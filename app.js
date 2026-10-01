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
  const ProductModel = window.RitualProductModel;
  const Segmentation = window.RITUAL_SEGMENTATION;
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
    'arrow-down':'<path d="M12 4v16m-6-6 6 6 6-6"/>',
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
    { name:'Valeria', image:'valeria-b', age:'25–34', subtitle:'Wellness y autocuidado', description:'Convierte el cuidado personal en pequeños hábitos que le permiten sentirse bien todos los días.', tags:['Yoga','Pilates','Skincare','Rutinas','Descanso'], story:'Busca bienestar que se sienta cercano, práctico y fácil de incorporar a su rutina.', moment:'HACER ESPACIO PARA SÍ MISMA', icon:'heart', tint:'#eadcf8', count:34 },
    { name:'Carlos', image:'carlos-b', age:'30–44', subtitle:'Vida activa y recuperación', description:'Se mueve, entrena y busca un balance entre sus metas personales y el ritmo de la semana.', tags:['Running','Gimnasio','Hidratación','Deporte','Energía'], story:'Valora la constancia: del entrenamiento a la pausa, quiere acompañar cada momento.', moment:'ENCONTRAR SU PROPIO RITMO', icon:'activity', tint:'#e1eef9', count:43 },
    { name:'Julián', image:'julian-b', age:'35–54', subtitle:'Equilibrio y descanso', description:'Integra bienestar, familia y trabajo. Le interesan los hábitos que puede sostener en el tiempo.', tags:['Sueño','Familia','Hábitos','Bienestar','Meditación'], story:'Quiere cerrar el día con una pausa y construir una rutina de descanso más consciente.', moment:'DARLE VALOR A LA PAUSA', icon:'moon', tint:'#f1e3e6', count:42 }
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
    {id:'active',name:'Vida activa',icon:'activity',image:'cycling-b'},
    {id:'nutrition',name:'Alimentación',icon:'leaf',image:'nutrition'},
    {id:'beauty',name:'Belleza',icon:'sparkles',image:'beauty-b'},
    {id:'mental',name:'Salud mental',icon:'heart',image:'yoga'},
    {id:'rest',name:'Sueño',icon:'moon',image:'rest-b'},
    {id:'family',name:'Familia',icon:'people',image:'family'},
    {id:'technology',name:'Tecnología',icon:'laptop',image:'technology-b'},
    {id:'lifestyle',name:'Rutinas',icon:'coffee',image:'yoga'}
  ];
  function categoryFor(row) {
    const text = norm(row.interest);
    if (/dorm|suen|descans|noche|nocturn|circadian|insom|sleep|melaton|relaj/.test(text)) return 'rest';
    if (/familia|padre|madre|hogar|patern|matern/.test(text)) return 'family';
    if (/medita|mindful|salud mental/.test(text)) return 'mental';
    if (/skincare|belleza|piel|maquilla|cuidado personal|beauty/.test(text)) return 'beauty';
    if (/nutri|alimenta|comida|cocina|dieta|receta|proteina|vitamina|suplement|magnesio|hidrat|electrolito/.test(text)) return 'nutrition';
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
  const imageSrc = name => `assets/${name}${name.endsWith('-b') ? '.webp' : '.jpg'}`;
  function imageFor(row) {
    const text = norm(row.interest);
    if (/cicl|bici/.test(text)) return 'cycling-b';
    if (/running|correr/.test(text)) return 'running';
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
  const filters = { query:'', category:'all', person:'all', platform:'all', product:'all', page:1, view:'grid' };
  let productState={dayShare:60};
  let simMode='products';
  const waveModes={reach:'all',frequency:'all'};
  let libraryGuideChannel='meta';
  let dialogGuide={channel:'meta',signalId:null};
  try { productState=ProductModel.sanitize(JSON.parse(localStorage.getItem('ritual-product-plan-v1')||'null')); } catch {}
  let toastTimeout;
  function toast(message) { clearTimeout(toastTimeout); $('#toast').textContent = message; $('#toast').classList.add('visible'); toastTimeout = setTimeout(() => $('#toast').classList.remove('visible'), 3200); }
  function closeMenu() { $('#sidebar').classList.remove('open'); $('#mobileScrim').classList.remove('visible'); $('#menuButton').setAttribute('aria-expanded','false'); }
  function renderRoute() {
    const next = location.hash.slice(1);
    currentView = Object.hasOwn(TITLES, next) ? next : 'summary';
    $$('.view').forEach(v => { const active = v.id === currentView; v.hidden = !active; v.classList.toggle('active',active); });
    $$('[data-nav]').forEach(a => { const active = a.dataset.nav === currentView; a.classList.toggle('active',active); if(active) a.setAttribute('aria-current','page'); else a.removeAttribute('aria-current'); });
    document.body.dataset.view = currentView;
    $('#breadcrumbName').textContent = TITLES[currentView];
    document.title = `${TITLES[currentView]} · Ritual Audience Atlas 2027`;
    $('#exportBtn').title = currentView === 'library' ? 'Exportar todas las señales que coinciden con los filtros' : currentView === 'sim' ? 'Exportar el escenario y su distribución de inversión' : 'Exportar datos de esta vista';
    renderSidebar();
    if(currentView === 'summary') renderSummary();
    if(currentView === 'library') renderLibrary();
    if(currentView === 'media') renderMedia();
    if(currentView === 'sim') {renderSimulator();renderProductSimulator();}
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
    Object.assign(filters,{query:'',category:'all',platform,page:1});
    selectPerson(who);
    if(Segmentation.channels[platform])libraryGuideChannel=platform;
    $('#libSearch').value = ''; $('#platformFilter').value = platform;
    $('#libraryFilters').hidden = false; $('#filterToggle').setAttribute('aria-expanded','true');
    navigate('library'); renderLibrary();
  }
  const PERSONA_COLORS=['#b266ff','#43b7ff','#ff80b2'];
  const MEDIA_ENVIRONMENTS=[
    {id:'meta',name:'Meta Ads',short:'META ADS',color:'#578bff',summary:'Alcance y afinidad en los hábitos cotidianos.',description:'Bienestar y lifestyle<br>en cada momento del día.',tags:['Bienestar','Mindfulness','Nutrición','Autocuidado']},
    {id:'google',name:'Google Ads',short:'GOOGLE ADS',color:'#41d69f',summary:'Intención y demanda en búsquedas de categoría.',description:'Intención y descubrimiento.<br>De interés a compra.',tags:['Vida saludable','Suplementos','Rendimiento','Rutinas diarias']},
    {id:'tiktok',name:'TikTok Ads',short:'TIKTOK ADS',color:'#fc76b6',summary:'Descubrimiento y comunidad en movimiento.',description:'Inspiración, rutinas y<br>comunidad en movimiento.',tags:['Rutinas nocturnas','Mindfulness','Lifestyle','Contenido educativo']},
    {id:'youtube',name:'YouTube / Google',short:'YOUTUBE',color:'#f15f80',summary:'Contenido para la consideración y educación.',description:'Contenido profundo para<br>una vida más equilibrada.',tags:['Meditación','Sueño y descanso','Salud mental','Equilibrio']}
  ];
  const CITIES=[
    {id:'bogota',name:'Bogotá',potential:3.1e6,x:45.5,y:46.4,dx:18,dy:5,color:'#ff5bd9'},
    {id:'medellin',name:'Medellín',potential:1.9e6,x:35.6,y:38.1,dx:-111,dy:-28,color:'#c252ff'},
    {id:'cali',name:'Cali',potential:1.4e6,x:29.3,y:53.3,dx:-77,dy:16,color:'#ef63fc'},
    {id:'barranquilla',name:'Barranquilla',potential:.72e6,x:40.7,y:12.4,dx:18,dy:-38,color:'#40c9ff'},
    {id:'cartagena',name:'Cartagena',potential:.52e6,x:36.2,y:15.5,dx:-119,dy:7,color:'#b158ff'},
    {id:'bucaramanga',name:'Bucaramanga',potential:.48e6,x:51.8,y:33.3,dx:17,dy:-23,color:'#3eacff'},
    {id:'pereira',name:'Pereira',potential:.64e6,x:34.8,y:45.9,dx:-126,dy:3,color:'#68e4ff'}
  ];
  let selectedCity='bogota';
  let territoryMode='cities';
  const darkLogo=id=>id==='tiktok'?LOGOS[id].replace('fill="#17132e"','fill="#fff"'):LOGOS[id];
  function productMatch(row,id) { return id==='all'||(id==='day'?norm(row.product).includes('dia'):norm(row.product).includes('noche')); }
  const PRODUCT_LABELS={all:'Ambos productos',day:'Hidrapro · Día',night:'Noche Plena'};
  // Give the latest selection priority when a product and profile have no shared signals.
  // Keep the original matrix intact and explain the filter that was released.
  function selectPerson(name) {
    filters.person=name;filters.page=1;
    if(name==='all'||filters.product==='all'||rows.some(d=>d.cluster===name&&productMatch(d,filters.product)))return;
    const previousProduct=PRODUCT_LABELS[filters.product];
    filters.product='all';
    toast(`Se quitó el filtro ${previousProduct} para mostrar las señales de ${name}.`);
  }
  function selectProduct(product) {
    filters.product=product;filters.page=1;
    if(product==='all'||filters.person==='all'||rows.some(d=>d.cluster===filters.person&&productMatch(d,product)))return;
    const previousPerson=filters.person;
    filters.person='all';
    toast(`${previousPerson} no tiene señales de ${PRODUCT_LABELS[product]}. Mostrando todos los clústeres.`);
  }
  function mediaBaseRows() { return rows.filter(d=>productMatch(d,filters.product)&&(filters.person==='all'||d.cluster===filters.person)); }
  function guideContext(channel, signalId=null) {
    const signal=Number.isInteger(signalId)?rows[signalId]:null;
    const name=signal?.cluster||filters.person;
    const profile=PERSONAS.find(p=>p.name===name);
    const candidates=rows.filter(d=>(!profile||d.cluster===name)&&productMatch(d,filters.product)&&platformMatch(d,channel));
    const focus=signal?.interest||filters.query;
    const seedValues=[focus,...candidates.map(d=>d.interest),...(profile?.tags||['Bienestar','Rutinas diarias'])].filter(Boolean);
    const seen=new Set();
    let seeds=seedValues.filter(value=>{const key=norm(value);if(seen.has(key))return false;seen.add(key);return true;}).slice(0,3);
    if(channel==='google') {
      const topic=signal?.category||filters.category;
      const night=filters.product==='night'||topic==='rest'||(name==='Julián'&&filters.product!=='day'&&!signal);
      seeds=night?['ritual noche plena','rutina de descanso nocturno','hábitos antes de dormir']:(name==='Carlos'||topic==='active'||filters.product==='day')?['hidratación para entrenar','electrolitos para ejercicio','ritual hidrapro']:['ritual jgb','rutina de bienestar','ritual hidrapro'];
    }
    const age=profile?.age||'25–54';
    const buckets=name==='Valeria'?'25–34':name==='Carlos'?'25–34 y 35–44':name==='Julián'?'35–44 y 45–54':'25–34, 35–44 y 45–54';
    const ageNote=channel==='tiktok'?`TikTok: ${buckets}.${name==='Carlos'?' Esto cubre 25–44 e incluye 25–29; no replica exactamente 30–44.':''}`:'El rango del perfil orienta la planeación; revisa los controles de edad del formato elegido.';
    return {signal,name:profile?.name||'Audiencias Ritual',image:profile?.image,age,ageNote,seeds,focus:signal?.interest||filters.query||'Afinidades del perfil'};
  }
  function guideTabs(channel, scope, signalId=null) {
    return `<div class="guide-tabs" role="group" aria-label="Medio de la guía">${Object.entries(Segmentation.channels).map(([id,g])=>`<button class="${id===channel?'active':''}" data-guide-tab="${id}" data-guide-scope="${scope}" ${signalId!==null?`data-guide-signal="${signalId}"`:''} aria-pressed="${id===channel}"><span>${scope==='library'?darkLogo(id):LOGOS[id]}</span>${g.short}</button>`).join('')}</div>`;
  }
  function guideContent(channel, context, scope) {
    const g=Segmentation.channels[channel];
    return `<div class="guide-intro"><span class="guide-kicker">${g.kind}</span><h3>${g.name}</h3><p>${g.explanation}</p><div class="guide-route">${i('target')}<span>${g.route}</span></div></div><div class="guide-columns"><ol class="guide-steps">${g.steps.map(([title,body],idx)=>`<li><span>${idx+1}</span><div><h4>${title}</h4><p>${body}</p></div></li>`).join('')}</ol><aside class="guide-example"><div class="guide-example-person">${context.image?`<img src="assets/${context.image}.webp" alt="">`:i('people')}<div><small>EJEMPLO PROPUESTO</small><strong>${esc(context.name)}</strong><span>Colombia · perfil ${context.age}</span></div></div><p class="guide-focus">Señal de partida: <b>${esc(context.focus)}</b></p><h4>${g.exampleLabel}</h4><div class="guide-seeds">${context.seeds.map(s=>`<span>${esc(s)}</span>`).join('')}</div><p>${esc(context.ageNote)}</p><div class="guide-validation">${i('info')}<span>${g.validation}</span></div></aside></div><div class="guide-test">${i('chart')}<p>${g.measure}</p></div><div class="guide-footer"><div><span>Documentación oficial · consultada ${Segmentation.reviewed}</span><div class="guide-sources">${g.sources.map(([name,url])=>`<a href="${url}" target="_blank" rel="noopener noreferrer">${name}${i('arrow-up')}</a>`).join('')}</div></div><button class="button button-primary" data-copy-guide="${channel}" data-guide-scope="${scope}">${i('list')}Copiar guía</button></div><p class="guide-footnote">Guía de planeación. Los ejemplos no certifican disponibilidad, volumen ni resultados; revisa las opciones del objetivo y la cuenta antes de activar.</p>`;
  }
  function renderLibraryGuide() {
    $('#librarySegmentationGuide').innerHTML=guideTabs(libraryGuideChannel,'library')+guideContent(libraryGuideChannel,guideContext(libraryGuideChannel),'library');
  }
  function showSegmentationGuide(channel, signalId=null) {
    if(!Segmentation.channels[channel])return;
    dialogGuide={channel,signalId};
    const context=guideContext(channel,signalId);
    showDialog('GUÍA DE ACTIVACIÓN POR MEDIO',`<h2>Cómo segmentar<span class="purple">.</span></h2><p class="dialog-description">${esc(context.signal?`${context.signal.interest} · ${context.name}`:`Ejemplo para ${context.name}`)}</p>${guideTabs(channel,'dialog',signalId)}${guideContent(channel,context,'dialog')}`,true);
  }
  async function copySegmentationGuide(channel,scope) {
    const context=guideContext(channel,scope==='dialog'?dialogGuide.signalId:null),g=Segmentation.channels[channel];
    const text=[`RITUAL · ${g.name}`,`Ejemplo propuesto para ${context.name} · perfil ${context.age} · Colombia`,`Señal: ${context.focus}`,g.explanation,g.route,...g.steps.map(([title,body],idx)=>`${idx+1}. ${title}: ${body}`),`${g.exampleLabel}: ${context.seeds.join('; ')}`,context.ageNote,g.validation,g.measure,`Fuentes (${Segmentation.reviewed}):`,...g.sources.map(([title,url])=>`${title}: ${url}`),'Ejemplos sin disponibilidad ni volumen certificados.'].join('\n\n');
    try {
      await navigator.clipboard.writeText(text);
      const copyButton=$(`[data-copy-guide="${channel}"][data-guide-scope="${scope}"]`);
      if(copyButton){copyButton.textContent='Guía copiada ✓';copyButton.setAttribute('aria-label','Guía copiada con pasos, ejemplo y fuentes');}
      toast('Guía copiada con pasos, ejemplo y fuentes.');
    }
    catch {showDialog('COPIAR GUÍA',`<h2>Tu guía de <span class="purple">${g.short}.</span></h2><p class="dialog-description">Selecciona y copia el texto para llevarlo a tu plan de medios.</p><textarea id="guideCopyText" class="guide-copy-text" readonly aria-label="Guía lista para copiar">${esc(text)}</textarea>`);$('#guideCopyText').focus();$('#guideCopyText').select();}
  }
  function renderSidebar() {
    $$('[data-product]').forEach(b=>{const active=b.dataset.product===filters.product;b.classList.toggle('active',active);b.setAttribute('aria-pressed',String(active));});
    $('#sidebarPersonas').innerHTML=PERSONAS.map((p,idx)=>`<button class="sidebar-person ${filters.person===p.name?'active':''}" data-focus-person="${p.name}" aria-pressed="${filters.person===p.name}"><img src="assets/${p.image}.webp" alt=""><span><b><i style="background:${PERSONA_COLORS[idx]}"></i>${p.name}</b><small>${['Wellness','Vida activa','Equilibrio'][idx]} · ${p.age}</small></span><strong>${p.count}</strong></button>`).join('');
  }
  function showProductMethod() {
    showDialog('MODELO DÍA + NOCHE',`<h2>Una intersección <span class="purple">estimada.</span></h2><p class="dialog-description">Los universos de 8,6 M para Día y 7,8 M para Noche, y la intersección de 2,4 M, son supuestos tomados de la referencia visual. No son estimaciones verificadas de plataformas ni datos de campañas.</p><div class="detail-section"><h3>Una sola persona, una sola vez</h3><code>Universo único = 8,6 M + 7,8 M − 2,4 M = 14,0 M<br>Alcance combinado = alcance Día + alcance Noche − intersección estimada<br>Frecuencia combinada = impresiones totales / alcance único<br>Cobertura = alcance único / 14,0 M</code><p>La intersección de cada ola se escala por la fracción de ambos universos que ya se alcanzó. El alcance único nunca supera los 14,0 M. La frecuencia combinada se calcula con las impresiones de ambos productos; no es el promedio simple de las dos frecuencias.</p></div><div class="detail-section"><h3>Qué cambia al mover la inversión</h3><p>Los porcentajes siempre suman 100%. Modifican el ritmo de cobertura en las 12 olas. El escenario 60/40 alcanza los universos de referencia al cierre; un producto con 0% no genera alcance, frecuencia ni intersección. Se usan curvas exponenciales de saturación con coeficientes de 3 para Día y 2,1 para Noche, normalizadas al escenario base.</p><p>Frecuencias finales del escenario base: Día 2,2; Noche 4,1. La frecuencia combinada resultante es aproximadamente 3,6. Alcanzar 14,0 M sobre 14,0 M equivale a 100% de cobertura.</p></div><div class="detail-section"><h3>Editor de inversión por medio</h3><p>La pestaña «Inversión por medio» conserva el modelo de presupuesto y CPM del atlas. Es un ejercicio diferente al modelo por producto: no son dos vistas del mismo cálculo.</p></div>`);
  }
  function renderProductSimulator() {
    const plan=ProductModel.calculate(productState),r=plan.final;
    $('#productDayShare').value=plan.dayShare;$('#productNightShare').value=plan.nightShare;
    $('#productDayShareValue').textContent=plan.dayShare+'%';$('#productNightShareValue').textContent=plan.nightShare+'%';
    $('#productDayShare').style.setProperty('--value',plan.dayShare+'%');$('#productNightShare').style.setProperty('--value',plan.nightShare+'%');
    $('#productUniqueReach').textContent=millions(r.reach);
    $('#productVenn').innerHTML=`<title>Alcance estimado: Día ${millions(r.day)}, Noche ${millions(r.night)}, intersección ${millions(r.overlap)}</title><defs><linearGradient id="vennDay" x2=".6" y2="1"><stop stop-color="#88bdff"/><stop offset="1" stop-color="#1559e8"/></linearGradient><linearGradient id="vennNight" x2=".3" y2="1"><stop stop-color="#ce8eff"/><stop offset="1" stop-color="#7414e4"/></linearGradient><clipPath id="vennClip"><circle cx="119" cy="105" r="93"/></clipPath></defs><circle cx="119" cy="105" r="93" fill="url(#vennDay)" stroke="white" stroke-width="1.5"/><circle cx="222" cy="105" r="93" fill="url(#vennNight)" stroke="white" stroke-width="1.5"/><circle cx="222" cy="105" r="93" fill="#32129d" fill-opacity=".78" clip-path="url(#vennClip)" stroke="#ffffff88"/><g fill="white" text-anchor="middle" font-family="Inter,Arial,sans-serif"><text x="83" y="103" font-weight="850" font-size="22">${millions(r.day)}</text><text x="83" y="125" font-size="11" font-weight="650">Ritual Día</text><text x="171" y="104" font-weight="850" font-size="16">${millions(r.overlap)}</text><text x="171" y="122" font-size="8" font-weight="600">intersección</text><text x="259" y="103" font-weight="850" font-size="22">${millions(r.night)}</text><text x="259" y="125" font-size="11" font-weight="650">Ritual Noche</text></g>`;
    const metrics=[['people',millions(r.reach),'Audiencia única proyectada<br>en 2027'],['layers',millions(r.overlap),'Intersección estimada<br>entre Día y Noche'],['arrow-up',number(r.coverage*100,0)+'%','Cobertura del universo<br>planeable de 14,0 M'],['target',number(r.frequency,1),'Frecuencia promedio<br>total de Día + Noche']];
    $('#productResults').innerHTML=metrics.map(([ic,value,label])=>`<div>${i(ic)}<span><b>${value}</b><small>${label}</small></span></div>`).join('');
    drawWaveChart('reach',plan);drawWaveChart('frequency',plan);
  }
  function drawWaveChart(kind,plan) {
    const svg=$(kind==='reach'?'#productReachChart':'#productFrequencyChart');
    const w=Math.max(360,svg.clientWidth||580),h=Math.max(210,svg.clientHeight||224),left=47,right=70,top=17,bottom=46,pw=w-left-right,ph=h-top-bottom;
    svg.setAttribute('viewBox',`0 0 ${w} ${h}`);
    const reach=kind==='reach',mode=waveModes[kind];
    const series=[{id:'all',key:reach?'reach':'frequency',color:'#211069',name:'Día + Noche'},{id:'day',key:reach?'day':'dayFrequency',color:'#2387ff',name:'Día'},{id:'night',key:reach?'night':'nightFrequency',color:'#ab28ff',name:'Noche'}].filter(x=>mode==='all'||x.id===mode);
    const max=reach?16:Math.max(5,Math.ceil(Math.max(...plan.waves.flatMap(r=>series.map(s=>r[s.key])))));
    const val=r=>reach?r/1e6:r;
    const xy=(idx,v)=>[left+pw*idx/11,top+ph*(1-val(v)/max)];
    let html=`<title>${reach?'Alcance acumulado estimado':'Frecuencia estimada'} en 12 olas de campaña</title>`;
    for(let j=0;j<=4;j++){const y=top+ph*j/4;html+=`<line class="wave-grid" x1="${left}" y1="${y}" x2="${w-right}" y2="${y}"/><text class="wave-axis" x="${left-10}" y="${y+4}" text-anchor="end">${number(max*(1-j/4),reach?0:1)}${reach?' M':''}</text>`;}
    plan.waves.forEach((r,idx)=>{const x=left+pw*idx/11;html+=`<line class="wave-grid wave-vertical" x1="${x}" y1="${top}" x2="${x}" y2="${top+ph}"/><text class="wave-axis" x="${x}" y="${h-25}" text-anchor="middle">${r.wave}</text>`;});
    const labelPositions=series.map(line=>({id:line.id,y:xy(11,plan.final[line.key])[1]})).sort((a,b)=>a.y-b.y);
    labelPositions.forEach((label,idx)=>{label.y=Math.max(top+11,label.y,idx?labelPositions[idx-1].y+25:0);});
    const overflow=Math.max(0,labelPositions[labelPositions.length-1].y-(h-bottom));
    labelPositions.forEach(label=>{label.y-=overflow;});
    series.forEach(line=>{const pts=plan.waves.map((r,idx)=>xy(idx,r[line.key]));html+=`<polyline fill="none" stroke="${line.color}" stroke-width="2.8" stroke-linejoin="round" points="${pts.map(p=>p.join(',')).join(' ')}"/>`;pts.forEach((p,idx)=>{html+=`<circle cx="${p[0]}" cy="${p[1]}" r="3.1" fill="white" stroke="${line.color}" stroke-width="2"><title>${line.name}, ola ${idx+1}: ${reach?millions(plan.waves[idx][line.key]):number(plan.waves[idx][line.key],1)}</title></circle>`;});const [x,endY]=pts[11],y=labelPositions.find(label=>label.id===line.id).y;html+=`<line x1="${x}" y1="${endY}" x2="${x+11}" y2="${y}" stroke="${line.color}" stroke-width="1"/><rect x="${x+10}" y="${y-11}" width="53" height="22" rx="11" fill="${line.color}"/><text x="${x+36.5}" y="${y+4}" text-anchor="middle" font-family="Inter,Arial,sans-serif" font-size="11" font-weight="750" fill="white">${reach?millions(plan.final[line.key]):number(plan.final[line.key],1)}</text>`;});
    html+=`<text class="wave-axis" x="${left+pw/2}" y="${h-4}" text-anchor="middle">Olas de campaña 2027</text>`;svg.innerHTML=html;
    $$(`[data-wave-chart="${kind}"]`).forEach(b=>{const active=b.dataset.series===mode;b.classList.toggle('active',active);b.setAttribute('aria-pressed',String(active));});
  }
  function changeProductShare(value,night=false) {
    productState=ProductModel.sanitize({dayShare:night?100-Number(value):Number(value)});renderProductSimulator();
    try{localStorage.setItem('ritual-product-plan-v1',JSON.stringify(productState));}catch{}
  }
  function renderTerritoryExplorer() {
    const city=CITIES.find(c=>c.id===selectedCity)||CITIES[0];
    const cityIndex=CITIES.indexOf(city),universe=filters.product==='day'?8.6e6:filters.product==='night'?7.8e6:14e6;
    const labels={bogota:[18,4],medellin:[-100,-14],cali:[-69,7],barranquilla:[17,-29],cartagena:[-112,1],bucaramanga:[16,-17],pereira:[-88,-5]};
    $$('[data-map-mode]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.mapMode===territoryMode)));
    const navigation=$('#territoryNavigation');
    navigation.setAttribute('aria-label',territoryMode==='cities'?'Seleccionar ciudad':'Seleccionar clúster');
    navigation.innerHTML=territoryMode==='cities'
      ? `<span class="territory-nav-label">7 CIUDADES</span>${CITIES.map(c=>`<button class="territory-city" data-map-city="${c.id}" data-map-source="list" aria-pressed="${c.id===city.id}"><span class="territory-city-dot" style="--city-color:${c.color}"></span><span>${c.name}</span>${i('arrow-right')}</button>`).join('')}`
      : `<span class="territory-nav-label">PERFILES DEL ATLAS</span>${PERSONAS.map((p,idx)=>`<button class="territory-person" data-map-person="${p.name}" aria-pressed="${filters.person===p.name}"><img src="assets/${p.image}.webp" alt=""><span><b>${p.name}</b><small>${p.age} · ${p.count} señales</small></span><span class="territory-city-dot" style="--city-color:${PERSONA_COLORS[idx]}"></span></button>`).join('')}<button class="territory-all" data-map-person="all" aria-pressed="${filters.person==='all'}">Todos los perfiles${i('arrow-right')}</button><p class="territory-nav-note">El perfil cambia los intereses que explorarás. Las ciudades son referencias de planeación.</p>`;
    $('#cityPins').innerHTML=CITIES.map(c=>`<button class="territory-pin ${labels[c.id][0]<0?'label-left':''} ${c.id===city.id?'selected':''}" style="left:${c.x}%;top:${(c.y*.92).toFixed(3)}%;--city-color:${c.color};--label-x:${labels[c.id][0]}px;--label-y:${labels[c.id][1]}px" data-map-city="${c.id}" data-map-source="pin" aria-label="Seleccionar ${c.name} en el mapa" aria-pressed="${c.id===city.id}"><span class="territory-pin-dot"></span><span class="territory-pin-label">${c.name}</span></button>`).join('');
    $('#cityDetailPanel').innerHTML=`<div class="city-scene" style="--scene-x:${cityIndex%2*100}%;--scene-y:${Math.floor(cityIndex/2)*100/3}%" role="img" aria-label="Vista ilustrativa de ${city.name}"><span>Vista ilustrativa</span></div><div class="territory-detail-heading"><span class="territory-detail-eyebrow">CIUDAD SELECCIONADA</span><h3>${city.name}</h3><p>Conecta con sus audiencias.</p></div><button class="city-potential" data-city="${city.id}" aria-label="Consultar el potencial ilustrativo de ${city.name}"><span>Potencial de referencia</span><b>${millions(city.potential*universe/14e6)}</b>${i('info')}</button><div class="territory-section-label">PERFILES PARA EXPLORAR</div><div class="territory-profiles">${PERSONAS.map((p,idx)=>`<button data-profile="${p.name}" aria-label="Ver perfil de ${p.name}" class="${filters.person===p.name?'active':''}"><img src="assets/${p.image}.webp" alt=""><b><span style="--city-color:${PERSONA_COLORS[idx]}"></span>${p.name}</b><small>${['Wellness','Vida activa','Equilibrio'][idx]}</small></button>`).join('')}</div><div class="territory-section-label">MOMENTOS RITUAL</div><div class="territory-products"><button data-product="day" aria-pressed="${filters.product==='day'}" class="territory-day">${i('sun')}<span><b>Hidrapro</b><small>Bienestar para tus días</small></span></button><button data-product="night" aria-pressed="${filters.product==='night'}" class="territory-night">${i('moon')}<span><b>Noche Plena</b><small>Momento de calma</small></span></button></div><button class="button button-primary territory-explore" data-map-explore>Explorar intereses${i('arrow-up')}</button><p class="territory-detail-note">${filters.person==='all'?'Todos los perfiles':esc(filters.person)} · ${PRODUCT_LABELS[filters.product]}</p>`;
    $('#territoryMapCaption').textContent=territoryMode==='clusters'&&filters.person!=='all'?`${filters.person} · selecciona una ciudad para planear`:'7 ciudades · selecciona un punto en el mapa';
  }
  function selectTerritoryCity(id,source='list') {
    if(!CITIES.some(c=>c.id===id))return;
    selectedCity=id;renderTerritoryExplorer();
    $('#territoryAnnouncement').textContent=`${CITIES.find(c=>c.id===id).name} seleccionada. Panel de ciudad actualizado.`;
    $(`[data-map-city="${id}"][data-map-source="${source}"]`)?.focus({preventScroll:true});
  }
  function renderSummary() {
    const universe=filters.product==='day'?8.6e6:filters.product==='night'?7.8e6:14e6;
    $('#atlasUniverse').textContent=millions(universe);
    renderTerritoryExplorer();
    $('#summaryMedia').innerHTML=MEDIA_ENVIRONMENTS.map(c=>`<button data-media="${c.id}"><span>${darkLogo(c.id)}</span><b>${c.short}</b><i style="--media-color:${c.color};--media-width:${c.id==='meta'?75:c.id==='google'?66:c.id==='tiktok'?57:45}%"></i><p>${c.summary}</p></button>`).join('');
  }
  function renderPersonas() {
    $('#personaCards').innerHTML = PERSONAS.map(p => `<article class="persona-card" style="--tint:${p.tint}"><div class="persona-photo"><img src="assets/${p.image}.webp" alt="Retrato ilustrativo del perfil ${p.name}"></div><div class="persona-info"><div class="persona-title"><h2>${p.name}</h2><span class="persona-age">${p.age}</span></div><h3>${p.subtitle}</h3><p class="persona-description">${p.description}</p><div class="signal-count">${i(p.icon)}<strong>${p.count}</strong><span>señales</span></div><div class="chip-list">${p.tags.map(t=>`<span class="chip">${t}</span>`).join('')}</div><p class="persona-story">${p.story}</p><button class="button button-primary" data-profile="${p.name}">Ver perfil completo${i('arrow-right')}</button><button class="text-button persona-signals-link" data-person-signals="${p.name}">Explorar sus ${p.count} señales${i('arrow-up')}</button></div></article>`).join('');
  }
  function renderMedia() {
    const base=mediaBaseRows();
    $('#mediaSignalCount').textContent=base.length;
    $('#mediaPersonaCount').textContent=new Set(base.map(d=>d.cluster)).size;
    $('#platformCards').innerHTML=MEDIA_ENVIRONMENTS.map(c=>{
      const signals=base.filter(d=>platformMatch(d,c.id));
      return `<article class="platform-card" style="--platform-color:${c.color}"><div class="platform-card-hero" style="background-image:url('assets/media-${c.id}.webp')"><div class="platform-title"><span class="platform-logo">${darkLogo(c.id)}</span><h2>${c.name}</h2></div><p>${c.description}</p>${c.id==='meta'?'<span class="floating-social social-instagram">◎</span><span class="floating-social social-facebook">f</span>':''}${c.id==='google'?'<span class="floating-search">Ritual bienestar '+i('search')+'</span>':''}${c.id==='tiktok'?'<span class="floating-tiktok">'+darkLogo('tiktok')+'</span>':''}${c.id==='youtube'?'<span class="decorative-player" aria-hidden="true"><b>▶</b><i></i><span>⛶</span></span>':''}</div><div class="platform-details"><div class="platform-details-grid"><div><h3>PRESENCIA DE CLÚSTERES</h3><div class="cluster-presence">${PERSONAS.map((p,idx)=>{const pct=signals.length?Math.round(signals.filter(d=>d.cluster===p.name).length/signals.length*100):0;return `<button data-profile="${p.name}" aria-label="${p.name}: ${pct}% de las señales del canal"><img src="assets/${p.image}.webp" alt=""><b style="color:${PERSONA_COLORS[idx]}">${pct}%</b></button>`;}).join('')}</div></div><div class="platform-interests"><h3>PRINCIPALES INTERESES</h3><div>${c.tags.map(t=>`<span>${t}</span>`).join('')}</div></div></div><div class="platform-card-actions"><button class="text-button" data-guide-open="${c.id}">Cómo segmentar${i('target')}</button><button class="text-button" ${signals.length?`data-signal="${signals[0].id}"`:'disabled'}>Ver señal de ejemplo${i('arrow-right')}</button><button class="button button-primary" data-media="${c.id}" ${!signals.length?'disabled':''}>Explorar ${signals.length} señales${i('arrow-up')}</button></div></div></article>`;
    }).join('');
  }
  function filteredRows() {
    return rows.filter(d => productMatch(d,filters.product) && (filters.person==='all'||d.cluster===filters.person) && (filters.category==='all'||d.category===filters.category) && (filters.platform==='all'||platformMatch(d,filters.platform)) && (!filters.query||norm(`${d.interest} ${d.platform} ${d.territory} ${d.cluster} ${d.product}`).includes(norm(filters.query))));
  }
  function clearFilters() {
    Object.assign(filters,{query:'',category:'all',person:'all',platform:'all',product:'all',page:1});
    $('#libSearch').value=''; $('#platformFilter').value='all'; renderLibrary();
  }
  function renderLibrary() {
    const found=filteredRows(), size=filters.view==='grid'?12:18, pages=Math.max(1,Math.ceil(found.length/size));
    filters.page=Math.min(pages,Math.max(1,filters.page));
    const pageRows=found.slice((filters.page-1)*size,filters.page*size);
    renderSidebar();
    renderLibraryGuide();
    const hasFilters=filters.product!=='all'||filters.person!=='all'||filters.category!=='all'||filters.platform!=='all'||!!filters.query;
    const browsing=!hasFilters&&filters.view==='grid';
    $('#libCount').textContent=`${found.length} de 119 señales · ${filters.person==='all'?'Todos los clústeres':filters.person} · ${PRODUCT_LABELS[filters.product]}`;
    $('#categoryNav').innerHTML=CATEGORIES.map(c=>`<button class="category-nav-button ${filters.category===c.id?'active':''}" data-category="${c.id}" aria-pressed="${filters.category===c.id}">${i(c.icon)}<span>${c.name}</span></button>`).join('');
    $$('[data-person-filter]').forEach(b=>{const active=b.dataset.personFilter===filters.person;b.classList.toggle('active',active);b.setAttribute('aria-pressed',String(active));});
    $$('[data-library-view]').forEach(b=>{const active=b.dataset.libraryView===filters.view;b.classList.toggle('active',active);b.setAttribute('aria-pressed',String(active));});
    const count=[filters.product!=='all',filters.person!=='all',filters.category!=='all',filters.platform!=='all'].filter(Boolean).length;
    $('#activeFilterCount').hidden=!count;$('#activeFilterCount').textContent=count;
    $('#clearFilters').hidden=!hasFilters;
    $('#filterStatus').hidden=browsing;
    if(browsing) {
      const tiles=[
        {name:'Bienestar',category:'wellness',image:'yoga',icon:'heart'},
        {name:'Vida activa',category:'active',image:'cycling-b',icon:'activity'},
        {name:'Alimentación',category:'nutrition',image:'nutrition',icon:'leaf'},
        {name:'Belleza',category:'beauty',image:'beauty-b',icon:'sparkles'},
        {name:'Running',query:'running',image:'running',icon:'activity'},
        {name:'Gimnasio',query:'gimnasio',image:'gym',icon:'target'},
        {name:'Tecnología',category:'technology',image:'technology-b',icon:'laptop'},
        {name:'Sueño',category:'rest',image:'rest-b',icon:'moon'},
        {name:'Meditación',category:'mental',image:'yoga',icon:'sun'},
        {name:'Familia',category:'family',image:'family',icon:'people'},
        {name:'Rutinas',category:'lifestyle',image:'beauty-b',icon:'coffee'},
        {name:'Ciclismo',query:'ciclismo',image:'cycling-b',icon:'activity'}
      ];
      $('#libraryResults').innerHTML=`<div class="category-grid">${tiles.map(t=>{const count=rows.filter(d=>t.category?d.category===t.category:norm(d.interest).includes(t.query)).length;return `<button class="category-tile" ${t.category?`data-category="${t.category}"`:`data-topic="${t.query}"`} aria-label="Explorar ${t.name}, ${count} señales"><img src="${imageSrc(t.image)}" alt=""><span class="category-tile-caption"><strong>${t.name}</strong><span>${i(t.icon)}${count} señales</span></span></button>`;}).join('')}</div>`;
      $('#pagination').hidden=true;return;
    }
    if(!found.length) {
      $('#libraryResults').innerHTML=`<div class="empty-state">${i('search')}<h3>No encontramos esa conexión.</h3><p>Prueba otro interés o amplía los filtros para seguir explorando.</p><button class="button button-secondary" data-action="clear-filters">Ver todas las señales</button></div>`;
    } else if(filters.view==='grid') {
      $('#libraryResults').innerHTML=`<div class="interests-grid">${pageRows.map(d=>{const c=CATEGORIES.find(c=>c.id===d.category);return `<button class="interest-card" data-signal="${d.id}" aria-label="Explorar ${esc(d.interest)} · ${esc(d.cluster)} · ${esc(d.platform)}"><img loading="lazy" src="${imageSrc(imageFor(d))}" alt=""><span class="interest-platform" title="${esc(d.platform)}">${LOGOS[platformId(d)]}</span><span class="interest-body"><small>${c.name}</small><strong>${esc(d.interest)}</strong><span>${esc(d.cluster)} · ${esc(d.platform)}</span><small class="interest-guide-hint">Cómo segmentar${i('arrow-up')}</small></span></button>`;}).join('')}</div>`;
    } else {
      $('#libraryResults').innerHTML=`<div class="table-scroll"><table class="interest-table"><thead><tr><th>Interés</th><th>Persona</th><th>Plataforma</th><th>Prioridad</th></tr></thead><tbody>${pageRows.map(d=>`<tr><td><button data-signal="${d.id}"><img src="${imageSrc(imageFor(d))}" alt="">${esc(d.interest)}</button></td><td>${esc(d.cluster)}</td><td>${LOGOS[platformId(d)]}${esc(d.platform)}</td><td>${esc(d.priority)}</td></tr>`).join('')}</tbody></table></div>`;
    }
    $('#pagination').hidden=!found.length;
    $('#pagination').innerHTML=`<span>Mostrando ${(filters.page-1)*size+1}–${Math.min(filters.page*size,found.length)} de ${found.length}</span><div><button data-page="${filters.page-1}" ${filters.page===1?'disabled':''} aria-label="Página anterior">${i('arrow-left')}</button><span>Página ${filters.page} de ${pages}</span><button data-page="${filters.page+1}" ${filters.page===pages?'disabled':''} aria-label="Página siguiente">${i('arrow-right')}</button></div>`;
  }
  function showDialog(eyebrow, html, wide=false) {
    $('#detailDialog').classList.toggle('segmentation-dialog',wide);
    $('#dialogEyebrow').textContent=eyebrow;
    $('#dialogContent').innerHTML=html;
    if(!$('#detailDialog').open) $('#detailDialog').showModal();
    $('#detailDialog').scrollTop=0;
    $('#closeDialog').focus();
  }
  function showProfile(name) {
    const p=persona(name), signals=rows.filter(d=>d.cluster===name);
    const counts=[['meta','Meta'],['google','Google / YouTube'],['tiktok','TikTok']];
    showDialog('PERSONA ESTRATÉGICA · PERFIL ILUSTRATIVO',`<img class="dialog-portrait" src="assets/${p.image}.webp" alt="Retrato ilustrativo de ${p.name}"><h2>${p.name} <span class="purple">${p.age}</span></h2><p class="dialog-description">${p.description}</p><div class="detail-grid"><div class="detail-box"><span>Territorio</span><b>${p.subtitle}</b></div><div class="detail-box"><span>Señales originales</span><b>${p.count} señales de afinidad</b></div></div><div class="detail-section"><h3>Momento Ritual</h3><p>${p.story}</p></div><div class="detail-section"><h3>Presencia por plataforma</h3><div class="detail-grid">${counts.map(([id,title])=>`<div class="detail-box"><span>${title}</span><b>${signals.filter(d=>platformMatch(d,id)).length} señales</b></div>`).join('')}</div></div><div class="detail-section"><h3>Intereses destacados</h3><div class="related-signals">${signals.slice(0,7).map(d=>`<button data-signal="${d.id}">${esc(d.interest)}</button>`).join('')}</div></div><div class="dialog-actions"><button class="button button-primary" data-person-signals="${p.name}">Explorar las ${p.count} señales${i('arrow-right')}</button></div>`);
  }
  function showSignal(id) {
    const d=rows[id];if(!d)return;
    const related=rows.filter(x=>x.id!==d.id&&x.cluster===d.cluster&&x.category===d.category).slice(0,6);
    const guideChannel=platformId(d),guide=Segmentation.channels[guideChannel];
    const details=[['Persona',d.cluster],['Plataforma',d.platform],['Territorio',d.territory],['Prioridad',d.priority],['Producto',d.product],['Tipo de señal',d.type]];
    showDialog(`SEÑAL ${String(id+1).padStart(3,'0')} / 119`,`<h2>${esc(d.interest)}</h2><p class="dialog-description">Una puerta de entrada al universo de ${esc(d.cluster)}.</p><section class="signal-guide-preview"><div><span class="guide-kicker">DE LA SEÑAL A LA CAMPAÑA</span><h3>Cómo segmentar en ${guide.short}</h3><p>${guide.explanation}</p></div><button class="button button-primary" data-guide-open="${guideChannel}" data-guide-signal="${d.id}">Ver pasos y ejemplo${i('arrow-right')}</button></section><div class="detail-grid">${details.map(([label,value])=>`<div class="detail-box"><span>${label}</span><b>${esc(value)}</b></div>`).join('')}</div><div class="detail-section"><h3>Rol táctico</h3><p>${esc(d.tactic)}</p></div><div class="detail-section"><h3>Validación en plataforma</h3><p>${esc(d.validation)}</p></div>${related.length?`<div class="detail-section"><h3>Conexiones relacionadas</h3><div class="related-signals">${related.map(x=>`<button data-signal="${x.id}">${esc(x.interest)}</button>`).join('')}</div></div>`:''}<div class="dialog-actions"><button class="button button-secondary" data-person-signals="${esc(d.cluster)}">Ver todas las señales de ${esc(d.cluster)}${i('arrow-right')}</button></div>`);
  }
  function showMethod() {
    showDialog('CÓMO LEER EL ATLAS',`<h2>Una base para <span class="purple">tomar decisiones.</span></h2><p class="dialog-description">Este atlas organiza hipótesis de audiencias y simula escenarios. No está conectado a cuentas publicitarias ni contiene resultados de campañas.</p><div class="detail-section"><h3>01 · La matriz de afinidades</h3><p>Se conservan las 119 filas originales: 34 de Valeria, 43 de Carlos y 42 de Julián. Una señal puede aparecer en varias plataformas. Los perfiles y las fotografías son ilustrativos; los retratos y el paisaje urbano se generaron a partir de la referencia visual B; las categorías de la biblioteca son una agrupación editorial.</p><p>Google y YouTube comparten 34 señales de la matriz y no constituyen filas adicionales. Programmatic es un canal propuesto; no tiene señales propias en la base original.</p></div><div class="detail-section"><h3>02 · Universo y territorio</h3><p>Los 53,7 M de contexto nacional, 22,5 M de adultos y 14,0 M de base de planeación son supuestos heredados del proyecto sin fuente demográfica verificada adjunta. La base urbana de 8,9 M y los potenciales por ciudad proceden de la referencia visual proporcionada; son ilustrativos y no tienen fuente demográfica verificada. El editor de medios permite cambiar el universo. La distribución territorial es una propuesta estratégica, no alcance medido.</p></div><div class="detail-section"><h3>03 · Modelo de alcance</h3><code>Impresionesᵢ = inversiónᵢ / CPMᵢ × 1.000<br>Rᵢ = U × capᵢ × (1 − e^(−impresionesᵢ / (U × capᵢ × kᵢ)))<br>Alcance ≈ U × [1 − ∏(1 − Rᵢ / U)]<br>Frecuencia = impresiones totales / alcance</code><p>El alcance se limita al universo y cada canal tiene una curva de saturación. La combinación supone independencia entre medios: es una aproximación para planeación, no una deduplicación medida.</p><p>CPM iniciales (COP): Meta 9.200; Google 12.500; TikTok 8.200; YouTube 10.500; Programmatic 9.800. Límites de cobertura: 78%, 62%, 58%, 66% y 46%, respectivamente. kᵢ = 1,85 + (1 − capᵢ) × 1,6. Estos valores son supuestos editables o heredados, no cotizaciones.</p></div><div class="detail-section"><h3>04 · Qué exportas</h3><p>En Intereses, el CSV incluye todas las filas filtradas, no solo la página visible. En Medios, exporta la distribución de registros por entorno y perfil. En el Simulador, exporta las 12 olas de Día + Noche o el escenario de inversión por medios, según la pestaña activa. Resumen y Audiencias exportan la matriz completa con táctica y validación.</p></div><div class="detail-section"><h3>05 · Guardado</h3><p>El escenario se guarda únicamente en este navegador. La comparación admite hasta tres escenarios. Restablecer devuelve los valores iniciales del simulador; borrar comparación elimina los escenarios guardados.</p></div>`);
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
    $('#simKpis').innerHTML=metrics.map(([name,value,label,detail])=>`<div class="sim-kpi" title="${detail}"><strong>${value}</strong><span>${label}</span></div>`).join('');
    result.channels.forEach((c,idx)=>{$('#share-'+c.id).value=state.shares[idx];$('#share-'+c.id).style.setProperty('--value',state.shares[idx]+'%');$('#shareValue-'+c.id).textContent=state.shares[idx]+'%';$('#spend-'+c.id).textContent=money(c.spend);$('#spend-'+c.id).title='$'+number(c.spend)+' COP';});
    $('#budget').style.setProperty('--value',(state.budget/6000*100)+'%');
    const isDefaultMix=JSON.stringify(state.shares)===JSON.stringify(Model.defaults().shares) && JSON.stringify(state.cpms)===JSON.stringify(Model.defaults().cpms) && state.universe===14;
    $$('[data-preset]').forEach(b=>{const active=isDefaultMix&&state.budget==={conservative:300,balanced:600,growth:1200}[b.dataset.preset];b.classList.toggle('active',active);b.setAttribute('aria-pressed',String(active));});
    drawChart(result);
    $('#simInsight').textContent=result.budget===0?'Sin inversión, el modelo proyecta cero alcance e impresiones.':result.frequency>6?`Frecuencia estimada de ${number(result.frequency,1)}. Revisa la mezcla y los límites de repetición antes de ampliar la inversión.`:`Con ${money(result.budget)}, el escenario proyecta ${number(result.coverage*100,1)}% de cobertura y ${number(result.frequency,1)} impactos por persona.`;
    renderComparison();
  }
  function drawChart(current) {
    const box=$('#curveSvg').parentElement;
    const w=Math.max(320,box.clientWidth),h=Math.max(180,box.clientHeight),left=49,right=43,top=29,bottom=47,plotW=w-left-right,plotH=h-top-bottom;
    $('#curveSvg').setAttribute('viewBox',`0 0 ${w} ${h}`);
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
    if(currentView==='sim'&&simMode==='products'){
      const p=ProductModel.calculate(productState);
      csvRows=[['Modelo','Día + Noche · proyección ilustrativa, no medición'],['Inversión Día (%)',p.dayShare],['Inversión Noche (%)',p.nightShare],['Universo Día',p.assumptions.day],['Universo Noche',p.assumptions.night],['Intersección supuesta',p.assumptions.overlap],['Universo único',p.universe],[],['Ola','Alcance Día','Alcance Noche','Intersección estimada','Alcance único','Frecuencia Día','Frecuencia Noche','Frecuencia combinada','Impresiones','Cobertura (%)'],...p.waves.map(r=>[r.wave,Math.round(r.day),Math.round(r.night),Math.round(r.overlap),Math.round(r.reach),r.dayFrequency.toFixed(3),r.nightFrequency.toFixed(3),r.frequency.toFixed(3),Math.round(r.impressions),(r.coverage*100).toFixed(2)])];filename='Ritual_Plan_Dia_Noche_2027.csv';
    }else if(currentView==='sim'){
      const result=Model.calculate(state);
      csvRows=[['Escenario','Metrica','Valor','Unidad'],['Actual','Inversión',result.budget,'COP'],['Actual','Universo de planeación',result.universe,'personas'],['Actual','Alcance estimado',Math.round(result.reach),'personas'],['Actual','Frecuencia estimada',result.frequency.toFixed(3),'impactos/persona'],['Actual','Impresiones estimadas',Math.round(result.impressions),'impresiones'],[],['Canal','Participación (%)','CPM COP','Inversión COP','Impresiones estimadas','Alcance estimado del canal (no sumable)'],...result.channels.map(c=>[c.name,c.share,c.cpm,c.spend,Math.round(c.impressions),Math.round(c.reach)]),[],['Escenario guardado','Inversión COP','Universo','Alcance estimado','Frecuencia','Impresiones estimadas'],...saved.map(e=>{const r=Model.calculate(e.state);return[e.name,r.budget,r.universe,Math.round(r.reach),r.frequency.toFixed(3),Math.round(r.impressions)];}),[],['Metodología','Supuestos de planeación, independencia entre canales; no es alcance medido.']];filename='Ritual_Escenario_2027.csv';
    }else if(currentView==='media'){
      const base=mediaBaseRows();csvRows=[['Entorno','Persona','Señales','Participación de registros (%)'],...MEDIA_ENVIRONMENTS.flatMap(c=>{const selected=base.filter(d=>platformMatch(d,c.id));return PERSONAS.map(p=>{const count=selected.filter(d=>d.cluster===p.name).length;return [c.name,p.name,count,selected.length?(count/selected.length*100).toFixed(2):0];});}),[],['Nota','Google y YouTube comparten filas; los porcentajes describen la matriz, no alcance medido.']];filename='Ritual_Medios_Afinidades_2027.csv';
    }else{
      const selected=currentView==='library'?filteredRows():mediaBaseRows();
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
    if(d.mapCity)selectTerritoryCity(d.mapCity,d.mapSource);
    if(d.mapMode&&['cities','clusters'].includes(d.mapMode)){territoryMode=d.mapMode;renderTerritoryExplorer();$(`[data-map-mode="${d.mapMode}"]`).focus({preventScroll:true});}
    if(d.mapPerson&&(d.mapPerson==='all'||PERSONAS.some(p=>p.name===d.mapPerson))){selectPerson(d.mapPerson);renderSidebar();renderSummary();$(`[data-map-person="${d.mapPerson}"]`).focus({preventScroll:true});}
    if(d.mapExplore!==undefined)openLibrary({person:filters.person});
    if(d.mapJump!==undefined){$('#territoryExplorer').scrollIntoView({block:'start',behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'});$('#territoryTitle').focus({preventScroll:true});}

    if(d.guideOpen)showSegmentationGuide(d.guideOpen,d.guideSignal!==undefined?Number(d.guideSignal):null);
    if(d.guideTab&&Segmentation.channels[d.guideTab]){
      if(d.guideScope==='library'){libraryGuideChannel=d.guideTab;renderLibraryGuide();}
      else showSegmentationGuide(d.guideTab,dialogGuide.signalId);
      $(`[data-guide-tab="${d.guideTab}"][data-guide-scope="${d.guideScope}"]`).focus({preventScroll:true});
    }
    if(d.copyGuide&&Segmentation.channels[d.copyGuide])copySegmentationGuide(d.copyGuide,d.guideScope);
    if(d.product){const inMap=!!button.closest('#territoryExplorer');selectProduct(d.product);renderSidebar();renderSummary();renderMedia();renderLibrary();if(inMap)$(`#cityDetailPanel [data-product="${d.product}"]`)?.focus({preventScroll:true});}
    if(d.focusPerson){if(currentView==='media'){selectPerson(d.focusPerson);renderSidebar();renderMedia();}else openLibrary({person:d.focusPerson});}
    if(d.allPersonas!==undefined){filters.person='all';renderSidebar();if(currentView==='media')renderMedia();else if(currentView==='library')renderLibrary();else navigate('audiences');}
    if(d.city){const c=CITIES.find(x=>x.id===d.city);showDialog('GEOGRAFÍA DE OPORTUNIDAD',`<h2>${c.name}</h2><p class="dialog-description">${millions(c.potential*(filters.product==='day'?8.6:filters.product==='night'?7.8:14)/14)} de potencial ilustrativo en la referencia de planeación.</p><div class="detail-section"><h3>Cómo leer esta cifra</h3><p>Es un supuesto visual propuesto para priorizar la exploración territorial. No representa población censada ni alcance medido. Debe validarse con datos demográficos e inventarios de medios antes de activar una campaña.</p></div><div class="dialog-actions"><button class="button button-primary" data-goto="library">Explorar intereses</button></div>`);}
    if(d.simMode){simMode=d.simMode;$('#productsSimulator').hidden=simMode!=='products';$('#channelsSimulator').hidden=simMode!=='channels';$$('[data-sim-mode]').forEach(b=>{const active=b.dataset.simMode===simMode;b.classList.toggle('active',active);b.setAttribute('aria-pressed',String(active));});if(simMode==='products')renderProductSimulator();else renderSimulator();}
    if(d.waveChart){waveModes[d.waveChart]=d.series;drawWaveChart(d.waveChart,ProductModel.calculate(productState));}
    if(d.profile)showProfile(d.profile);
    if(d.personSignals)openLibrary({person:d.personSignals});
    if(d.signal!==undefined)showSignal(Number(d.signal));
    if(d.category){filters.category=d.category;filters.page=1;renderLibrary();}
    if(d.topic){Object.assign(filters,{query:d.topic,category:'all',platform:'all',page:1,view:'grid'});selectPerson(d.personTopic||'all');$('#libSearch').value=d.topic;$('#platformFilter').value='all';if(d.personTopic)navigate('library');renderLibrary();}
    if(d.personFilter){selectPerson(d.personFilter);renderLibrary();}
    if(d.libraryView){filters.view=d.libraryView;filters.page=1;renderLibrary();}
    if(d.page){filters.page=Number(d.page);renderLibrary();$('#libraryTitle').scrollIntoView({block:'start'});}
    if(d.action==='method')showMethod();
    if(d.action==='product-method')showProductMethod();
    if(d.action==='clear-filters')clearFilters();
    if(d.media){if(d.media==='programmatic')showDialog('CONTEXTO INCREMENTAL','<h2>Programmatic</h2><p class="dialog-description">Canal propuesto para ampliar la presencia en entornos contextuales de bienestar, lifestyle y retail. No tiene filas propias en la matriz original de 119 señales.</p><div class="detail-section"><h3>Antes de activar</h3><p>Validar inventario, categorías contextuales, CPM y alcance incremental con el proveedor.</p></div><div class="dialog-actions"><button class="button button-primary" data-goto="sim">Ajustar inversión</button></div>');else openLibrary({person:filters.person,platform:d.media==='youtube'?'google':d.media});}
    if(d.preset){state={...Model.defaults(),budget:{conservative:300,balanced:600,growth:1200}[d.preset]};syncInputs();renderSimulator();persist();}
    if(d.loadScenario!==undefined){state=Model.sanitize(saved[Number(d.loadScenario)].state);syncInputs();renderSimulator();persist();toast('Escenario cargado en el simulador.');}
    if(d.deleteScenario!==undefined){saved.splice(Number(d.deleteScenario),1);renderComparison();persist();}
  });
  $('#productDayShare').addEventListener('input',e=>changeProductShare(e.target.value));
  $('#productNightShare').addEventListener('input',e=>changeProductShare(e.target.value,true));
  $('#libSearch').addEventListener('input',event=>{filters.query=event.target.value.trim();filters.page=1;renderLibrary();});
  $('#platformFilter').addEventListener('change',event=>{filters.platform=event.target.value;filters.page=1;if(Segmentation.channels[filters.platform])libraryGuideChannel=filters.platform;renderLibrary();});
  $('#filterToggle').addEventListener('click',()=>{const panel=$('#libraryFilters');panel.hidden=!panel.hidden;$('#filterToggle').setAttribute('aria-expanded',String(!panel.hidden));});
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
    saved.push({name,state:Model.sanitize(state)});renderComparison();persist();toast('Escenario aplicado y añadido a la comparación.');
    $('#comparisonPanel').scrollIntoView({behavior:'smooth',block:'nearest'});
  });
  $('#clearScenarios').addEventListener('click',()=>{saved=[];renderComparison();persist();toast('Comparación vaciada.');});
  window.addEventListener('resize',()=>{if(currentView==='sim'){if(simMode==='products')renderProductSimulator();else drawChart(Model.calculate(state));}});
  window.addEventListener('hashchange',()=>{renderRoute();window.scrollTo({top:0,behavior:'instant'});});
  renderSidebar();renderSummary();renderPersonas();renderMedia();renderLibrary();renderProductSimulator();setupSimulator();renderSimulator();hydrateIcons();renderRoute();persist();
})();
