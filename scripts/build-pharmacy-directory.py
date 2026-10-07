#!/usr/bin/env python3
"""Build a partial, attributed directory from public business establishment records.
Usage: python scripts/build-pharmacy-directory.py --cache PATH [--download]
No owners, tax IDs, personal emails or legal representatives are exported.
"""
import argparse,collections,datetime,hashlib,html,json,re,unicodedata,urllib.request,xml.etree.ElementTree as ET
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
parser=argparse.ArgumentParser();parser.add_argument('--cache',type=Path,required=True);parser.add_argument('--download',action='store_true');args=parser.parse_args();cache=args.cache;cache.mkdir(parents=True,exist_ok=True)
CONSULTED='2026-10-07'
DEPARTMENTS=['Amazonas','Antioquia','Arauca','Atlántico','Bogotá D.C.','Bolívar','Boyacá','Caldas','Caquetá','Casanare','Cauca','Cesar','Chocó','Córdoba','Cundinamarca','Guainía','Guaviare','Huila','La Guajira','Magdalena','Meta','Nariño','Norte de Santander','Putumayo','Quindío','Risaralda','San Andrés y Providencia','Santander','Sucre','Tolima','Valle del Cauca','Vaupés','Vichada']
def norm(s):return ''.join(c for c in unicodedata.normalize('NFD',str(s or '')) if not unicodedata.combining(c)).lower().strip()
def clean(s):return re.sub(r'\s+',' ',html.unescape(re.sub('<[^>]+>',' ',str(s or '')))).strip()
def title(s):return clean(s).title().replace(' De ',' de ').replace(' Del ',' del ').replace(' La ',' la ')
def getfile(fn,url):
 if args.download or not (cache/fn).exists():
  with urllib.request.urlopen(url,timeout=60)as r:(cache/fn).write_bytes(r.read())
 return (cache/fn).read_text()
SOURCES=[]
def source(id,name,publisher,url,date,note,license='CC BY-SA 4.0'):
 SOURCES.append(dict(id=id,name=name,publisher=publisher,url=url,dataDate=date,consulted=CONSULTED,note=note,license=license))
source('bogota','Establecimientos farmacéuticos · Bogotá','Secretaría Distrital de Salud','https://datosabiertos.bogota.gov.co/dataset/establecimiento-farmaceutico','2024-01-09','Se filtran exclusivamente droguerías/farmacias; se excluyen ópticas, cosméticos, depósitos, operadores y tiendas naturistas. Fecha del dato declarada por el catálogo.','CC BY 4.0')
# Do not equate Socrata metadata refresh with renewal / current operating status.
configs=[
 ('2btt-9z2g','Norte de Santander','Instituto Departamental de Salud de Norte de Santander','2026-07-20','Registro sanitario departamental; se excluyen depósitos, naturistas y veterinarias.'),
 ('x62z-xik8','Risaralda','Gobernación de Risaralda','2026-05-20','Registro departamental; solo droguerías y farmacia-droguería.'),
 ('25qg-4vq6','Casanare','Gobernación de Casanare','2025-07-17','Solo droguerías; se excluyen servicios farmacéuticos de IPS y tiendas naturistas.'),
 ('acdj-kesr','Antioquia','Cámara de Comercio del Oriente Antioqueño','2019–2023','Renovaciones comerciales hasta 2023, solo nombres reconocibles como droguería/farmacia. No es censo de todo Antioquia.'),
 ('fzjs-yn9p','La Guajira','Cámara de Comercio de La Guajira','2014–2023','Renovaciones comerciales hasta 2023; se excluyen nombres personales y categorías no farmacéuticas.'),
 ('y6ye-6gwu','Magdalena','Cámara de Comercio de Santa Marta','Sin corte operativo declarado','Registro comercial; la fecha de matrícula no acredita funcionamiento actual. Solo nombres de establecimientos identificables.'),
 ('uvsm-qn7u','Putumayo','Gobernación de Putumayo','2017–2021','Renovaciones comerciales hasta 2021. Requiere confirmación comercial actual.'),
 ('fu4r-irvu','Valle del Cauca','UES Valle del Cauca','2025-07-22','Direcciones registradas; el campo razón social describe el servicio y no publica el nombre del negocio.'),
 ('jqyq-37cq','Valle del Cauca','Alcaldía de Guadalajara de Buga','Sin corte operativo declarado','Registro municipal; teléfonos y horarios corresponden a la fuente y requieren confirmación.')
]
for id,dept,pub,date,note in configs:source(id,'Droguerías · '+('Oriente antioqueño' if id=='acdj-kesr' else 'Buga' if id=='jqyq-37cq' else dept),pub,'https://www.datos.gov.co/d/'+id,date,note)
source('cv-blog','Directorio público Cruz Verde · ciudades','Cruz Verde Colombia','https://blog.cruzverde.com.co/seccion/nuestros-servicios/droguerias.html','Sin fecha · directorio histórico','XML público enlazado por el buscador oficial. No representa toda la red actual. Se omiten convenios EPS, horarios y servicios históricos para evitar presentarlos como vigentes.','Hechos de directorio público; derechos de la fuente')
ROWS=[];excluded=collections.Counter()
chains=[('Cruz Verde',r'cruz\s*verd|farmasanitas'),('La Rebaja',r'la rebaja|copservir'),('Colsubsidio',r'colsubsidio|caja colombiana de subsidio'),('Cafam',r'cafam'),('Farmatodo',r'farmatodo'),('Locatel',r'locatel'),('Audifarma',r'audifarma'),('Olímpica',r'olimpica'),('Pasteur',r'pasteur'),('Drogas La Economía',r'drogas la economia|drogueria la economia'),('Unidrogas',r'unidrogas'),('Farmacenter',r'farmacenter'),('Droguerías Alemana',r'drogueria[s]? alemana'),('Comfandi',r'comfandi'),('Éticos',r'eticos|eticos serrano'),('Medipiel',r'medipiel'),('Disfarma',r'disfarma'),('Dromayor',r'dromayor'),('Comfenalco',r'comfenalco')]
def chain_for(name):return next((brand for brand,pattern in chains if re.search(pattern,norm(name))),'')
city_fixes={'bogota':'Bogotá D.C.','bogota d.c.':'Bogotá D.C.','bogota d c':'Bogotá D.C.','buga':'Guadalajara de Buga','guadalajara de buga':'Guadalajara de Buga','cucuta':'Cúcuta','ocana':'Ocaña','riohacha':'Riohacha','pi j':'Pijiño del Carmen','el piяn':'El Piñón','pijiя del carmen':'Pijiño del Carmen','nariя':'Nariño','san sebastian b':'San Sebastián de Buenavista','ariguani (el dificil)':'Ariguaní','carmen de viboral':'El Carmen de Viboral','medellin':'Medellín','ibague':'Ibagué','popayan':'Popayán','chia':'Chía','zipaquira':'Zipaquirá','monteria':'Montería','quibdo':'Quibdó','san andres':'San Andrés','tulua':'Tuluá','facatativa':'Facatativá','fusagasuga':'Fusagasugá','el retiro':'Retiro'}
def city_name(city):
 city=clean(re.sub(r'^\d+\s*-\s*','',city)).replace('-',' ')
 accents=['Alejandría','Apía','Belén de Umbría','Chámeza','Chiquinquirá','Ciénaga','Cocorná','Colón','Concepción','El Peñol','El Retén','Fundación','Guátape','Guática','La Unión','Maní','Mistrató','Nunchía','Orocué','Puerto Asís','Puerto Guzmán','Puerto Leguízamo','Quinchía','Sabanas de San Ángel','Sácama','San Zenón','Santa Bárbara de Pinto','Sonsón','Támara','Villagarzón','Zapayán']
 city=next((a for a in accents if norm(a)==norm(city)),city)
 return city_fixes.get(norm(city),title(city))
def add(source_id,name,dept,city,address,neighborhood='',locality='',phone='',hours='',lat=None,lon=None,note='',year='',force_chain=''):
 name,address=clean(name),clean(address)
 if not name or not address or norm(address)in['n/a','na','no tiene','sin direccion','0']:excluded['missing_name_or_address']+=1;return
 original_city=clean(city)
 city=city_name(city)
 if dept=='Casanare' and norm(city).startswith('yopal') and norm(city)!='yopal':
  locality=locality or original_city;city='Yopal';note=(note+' Municipio normalizado desde: '+original_city+'.').strip()
 if dept=='Casanare' and norm(city)=='villenueva':city='Villanueva'
 if dept=='Antioquia' and norm(city)=='santuario':city='El Santuario'
 if not city:excluded['missing_city']+=1;return
 brand=force_chain or chain_for(name)
 if lat is not None:
  try:lat,lon=float(lat),float(lon)
  except (ValueError,TypeError):lat=lon=None
  if lat is not None and not(-4.3<=lat<=13.7 and -82<=lon<=-66):lat=lon=None
 phone=clean(phone)
 if norm(phone)in['n/a','na','no','0','sin informacion']:phone=''
 ROWS.append(dict(name=name,department=dept,city=city,address=address,neighborhood=clean(neighborhood),locality=clean(locality),phone=phone,hours=clean(hours),chain=brand,kind='cruzverde' if brand=='Cruz Verde' else 'chain' if brand else 'local',sources=[source_id],lat=round(lat,6) if lat is not None else None,lon=round(lon,6) if lon is not None else None,note=note,year=year))
# Bogotá: maxRecordCount=2000; source count=3772 as consulted. The two pages are complete.
from urllib.parse import urlencode
base='https://serviciosgis.catastrobogota.gov.co/arcgis/rest/services/salud/instituciones/MapServer/5/query'
for offset in [0,2000]:
 q=urlencode(dict(where='1=1',outFields='OBJECTID,LOCALIDAD,RAZONSOCIA,DIRECCIONC,BARRIO,TELEFONOS,HORARIO24H,TIPOESTABL',outSR=4326,orderByFields='OBJECTID',resultOffset=offset,resultRecordCount=2000,f='json'))
 for row in json.loads(getfile(f'bogota-{offset}.json',base+'?'+q))['features']:
  a=row['attributes'];typ=norm(a.get('TIPOESTABL'))
  if not('drogueria' in typ or typ=='farmacia'):excluded['non_retail_bogota']+=1;continue
  g=row.get('geometry',{});add('bogota',a['RAZONSOCIA'],'Bogotá D.C.','Bogotá D.C.',a['DIRECCIONC'],a.get('BARRIO'),a.get('LOCALIDAD'),a.get('TELEFONOS'),'24 horas (según registro)' if norm(a.get('HORARIO24H'))=='si' else '',g.get('y'),g.get('x'),note='Tipo en fuente: '+a['TIPOESTABL'])
for id,dept,pub,date,note in configs:
 raw=json.loads(getfile('data-'+id+'.json','https://www.datos.gov.co/resource/'+id+'.json?$limit=50000'))
 assert len(raw)<50000,'Fetch pagination required'
 for r in raw:
  if id=='2btt-9z2g':
   if norm(r.get('clase'))not in['drogueria','farmacia']:excluded['non_retail_regional']+=1;continue
   add(id,r.get('nombre'),dept,r.get('municipio',''),r.get('direccion'),r.get('barrio',''))
  elif id=='x62z-xik8':
   if norm(r.get('subcategoria'))not in['drogueria','farmacia - drogueria']:excluded['non_retail_regional']+=1;continue
   add(id,r.get('nombre_del_establecimiento'),dept,r.get('municipio',''),r.get('direccion'),r.get('barrio',''),phone=r.get('telefono',''))
  elif id=='25qg-4vq6':
   if norm(r.get('actividad_de_establecimiento'))!='drogueria':excluded['non_retail_regional']+=1;continue
   add(id,r.get('establecimiento'),dept,r.get('municipio',''),r.get('direccion'),phone=r.get('telefono',''))
  elif id=='fu4r-irvu':add(id,'Droguería · nombre no publicado',dept,r.get('ciudad',''),r.get('direccion'),note=r.get('razon_social','')+'. La fuente no identifica la razón social del establecimiento.')
  elif id=='jqyq-37cq':
   g=r.get('georeferenciaci_n_georeferencing',{})
   add(id,r.get('nombre_del_establecimiento_establishment_name'),dept,'Guadalajara de Buga',r.get('direcci_n_address'),phone=r.get('tel_fono_1_phone_1',''),hours='Lun–sáb: '+r.get('horario_de_atenci_n_de_lunes_a_sabado_office_hours_from_monday_to_saturday','')+' · Dom/festivos: '+r.get('horario_de_atenci_n_domingos_y_festivos_office_hours_from_sundays_and_holidays',''),lat=g.get('latitude'),lon=g.get('longitude'))
  else:
   name=r.get('razon_social','')
   if not re.search(r'drog|farma|farmacia',norm(name)) or re.search(r'veterin|naturista|cosmet|deposito|distribuidora',norm(name)):excluded['unidentified_or_non_pharmacy_business']+=1;continue
   add(id,name,dept,r.get('mun_comercial',r.get('municipio','')),r.get('dir_comercial'),year=r.get('ult_ano_ren',''))
# Historic official chain lookup. Place ambiguities are corrected only when the branch name identifies the municipality.
cv_cities={'armenia':'Quindío','cali':'Valle del Cauca','bucaramanga':'Santander','medellin':'Antioquia','barranquilla':'Atlántico','cartagena':'Bolívar','girardot':'Cundinamarca','ibague':'Tolima','popayan':'Cauca','chia':'Cundinamarca','neiva':'Huila','pasto':'Nariño','pereira':'Risaralda','santa marta':'Magdalena','tunja':'Boyacá','valledupar':'Cesar','zipaquira':'Cundinamarca','chiquinquira':'Boyacá','cucuta':'Norte de Santander','duitama':'Boyacá','facatativa':'Cundinamarca','florencia':'Caquetá','fusagasuga':'Cundinamarca','honda':'Tolima','manizales':'Caldas','monteria':'Córdoba','ocana':'Norte de Santander','quibdo':'Chocó','san andres':'San Andrés y Providencia','sincelejo':'Sucre','sogamoso':'Boyacá','tulua':'Valle del Cauca','villavicencio':'Meta','villeta':'Cundinamarca','yopal':'Casanare','soacha':'Cundinamarca','bogota':'Bogotá D.C.'}
for fn in ['puntos.xml','puntosbogota.xml']:
 for r in ET.fromstring(getfile(fn,'https://blog.cruzverde.com.co/xml/'+fn)).findall('.//punto'):
  city=norm(r.findtext('ciudad')).replace('-',' ');name=clean(r.findtext('nombre'));key=norm(name)
  if city=='guajira':city='riohacha' if 'riohacha'in key else 'dibulla' if 'mingueo'in key else '';dept='La Guajira'
  elif city=='narino':city='ipiales' if 'ipiales'in key else '';dept='Nariño'
  elif city=='bogota' and ('zipaquira'in key or 'chia'in key):city='zipaquira' if 'zipaquira'in key else 'chia';dept='Cundinamarca'
  else:dept=cv_cities.get(city)
  if not dept or not city:excluded['ambiguous_city']+=1;continue
  if not re.search('cruz verd',key):name='Cruz Verde · '+name
  add('cv-blog',name,dept,city,r.findtext('direccion'),note='Registro histórico del buscador oficial; confirmar sede, dirección y operación actual.',force_chain='Cruz Verde')
# Canonical address + municipality + chain/name: merge same-location records only.
def address_key(a):
 a=norm(a)
 for pattern,value in [(r'\b(carrera|cra|cr|kr)\b','kr'),(r'\b(calle|cll|cl)\b','cl'),(r'\b(avenida|avda|av)\b','av'),(r'\b(local|lc)\b','lc'),(r'\b(numero|no|nro|n)\b','')]:a=re.sub(pattern,value,a)
 return re.sub('[^a-z0-9]','',a)
merged={}
for r in ROWS:
 key=(norm(r['department']),norm(r['city']),address_key(r['address']),norm(r['chain'] or r['name']))
 if key in merged:
  old=merged[key];old['sources']=list(dict.fromkeys(old['sources']+r['sources']))
  for field in ['neighborhood','locality','phone','hours','lat','lon']:
   if not old[field] and r[field]:old[field]=r[field]
  excluded['duplicates_merged']+=1
 else:merged[key]=r
records=list(merged.values())
for r in records:
 r['id']='ph-'+hashlib.sha256((r['department']+'|'+r['city']+'|'+r['name']+'|'+address_key(r['address'])).encode()).hexdigest()[:14]
records.sort(key=lambda r:(norm(r['department']),norm(r['city']),norm(r['name']),norm(r['address'])))
counts=collections.Counter(s for r in records for s in r['sources'])
for s in SOURCES:s['records']=counts[s['id']]
report={'consulted':CONSULTED,'coverage':'partial','completeNationalCensus':False,'departments':DEPARTMENTS,'sources':SOURCES,'records':records,'quality':dict(excluded),'notes':['No es un censo nacional completo ni un registro de sedes activas verificado en campo.','Local o sin cadena identificada es una clasificación por nombre; no acredita independencia comercial.','Los establecimientos no implican disponibilidad de Ritual ni convenios vigentes.','Conteos de registros disponibles, no demanda, inversión ni tamaño de audiencia.']}
(ROOT/'data').mkdir(exist_ok=True)
(ROOT/'data/pharmacies.json').write_text(json.dumps(report,ensure_ascii=False,separators=(',',':'))+'\n')
print(json.dumps({'records':len(records),'cruzverde':sum(r['kind']=='cruzverde' for r in records),'local':sum(r['kind']=='local' for r in records),'cities':len({(r['department'],r['city'])for r in records}),'departments':len({r['department']for r in records}),'excluded':dict(excluded),'sources':counts},ensure_ascii=False,indent=2))
