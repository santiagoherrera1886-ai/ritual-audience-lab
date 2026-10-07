# Ritual · Directorio de droguerías y audiencia joven

Consulta de fuentes: **7 de octubre de 2026**. Esta versión es una **base parcial**; no es un censo de todas las droguerías colombianas ni de toda la red Cruz Verde, y no certifica operación actual, convenios de dispensación, inventario ni disponibilidad de Ritual.

## Contenido

- 7.672 registros con dirección; 302 identificados como Cruz Verde, 6.695 locales o sin cadena reconocida y 675 de otras cadenas.
- 222 municipios y 27 divisiones territoriales de las 33 del selector (32 departamentos + Bogotá D.C.). La cobertura por municipio es parcial.
- 1.546 registros con coordenadas publicadas. Los demás ofrecen búsqueda por dirección, sin inventar coordenadas.
- Filtros por tipo, departamento, municipio, barrio, cadena y nombre/dirección. Consulta por establecimientos o agregada por ciudades; fichas, enlaces a mapa y CSV de todas las coincidencias.

## Fuentes y fechas

La tabla completa, los enlaces y los conteos aparecen en la interfaz y en `data/pharmacies.json`. El CSV conserva fuentes, fechas, consulta y cobertura parcial.

| Fuente | Fecha del dato | Alcance de esta integración |
|---|---|---|
| Secretaría Distrital de Salud de Bogotá | 2024-01-09 según el catálogo | Droguerías/farmacias de la capa pública; se excluyen otras categorías |
| Instituto Departamental de Salud de Norte de Santander | Actualización de datos 2026-07-20 | Droguerías y farmacias, excluyendo depósitos y otros tipos |
| Gobernación de Risaralda | Actualización de datos 2026-05-20 | Droguerías y farmacia-droguería |
| Gobernación de Casanare | Actualización de datos 2025-07-17 | Droguerías; se excluyen servicios farmacéuticos de IPS |
| Cámara de Comercio del Oriente Antioqueño | Renovaciones 2019–2023 | Negocios con nombre farmacéutico identificable; no todo Antioquia |
| Cámara de Comercio de La Guajira | Renovaciones 2014–2023 | Subconjunto de nombres comerciales farmacéuticos identificables |
| Cámara de Comercio de Santa Marta | Sin corte operativo declarado | Nombres identificables en el registro comercial de Magdalena |
| Gobernación de Putumayo | Renovaciones 2017–2021 | Subconjunto farmacéutico identificable |
| UES Valle del Cauca | 2025-07-22, publicación del catálogo de la entidad | Direcciones; el nombre comercial no se publica en esa fuente |
| Alcaldía de Guadalajara de Buga | Sin corte operativo declarado | Directorio municipal con contactos y coordenadas |
| Buscador público de Cruz Verde | Sin fecha; directorio histórico | Puntos publicados en los XML enlazados por el buscador oficial |

Una renovación comercial antigua o una actualización del catálogo no acredita actividad comercial vigente. No se repiten teléfonos, horarios ni convenios EPS del XML histórico de Cruz Verde como si fueran actuales. Las fichas actuales de esta integración tampoco representan verificación en campo.

Datos abiertos colombianos: atribución a cada entidad, derivados bajo CC BY-SA 4.0 donde corresponda; Bogotá bajo CC BY 4.0. Cruz Verde: hechos públicos de directorio con atribución; marcas pertenecen a sus titulares. La licencia de los datos no modifica por sí misma la del código del proyecto.

## Normalización y límites

El generador conserva solo campos del establecimiento: nombre comercial/razón social publicada, ubicación, dirección, barrio, localidad, teléfono y horario de fuente, cadena inferida por nombre, coordenadas y trazabilidad. No exporta NIT, correos, representantes legales ni nombres de propietarios contenidos en campos separados.

Se excluyen categorías no farmacéuticas, depósitos, ópticas, veterinarias, naturistas y registros comerciales sin nombre farmacéutico identificable. En las cámaras de comercio, el código CIIU 4773 incluye cosméticos y otros comercios: no se toma como equivalente automático a droguería.

Se normalizan abreviaturas de dirección para detectar coincidencias por departamento, municipio, dirección y cadena/nombre. Se unieron 32 duplicados exactos normalizados. Se conservan las fuentes de cada registro unido. Todavía pueden existir duplicados con direcciones diferentes o nombres inconsistentes: los indicadores se denominan **registros**, no sedes únicas certificadas.

“De barrio / locales” significa que no se identificó una cadena por el nombre. No certifica independencia, carácter barrial ni tamaño de la empresa. “Sin registros integrados” no significa ausencia de droguerías. Los conteos no miden demanda, inversión recomendada ni universo de consumidores.

## Actualización

El script es reproducible con Python estándar:

```sh
python scripts/build-pharmacy-directory.py --cache /ruta/a/cache
# Volver a consultar las mismas fuentes públicas:
python scripts/build-pharmacy-directory.py --cache /ruta/a/cache --download
node --test tests/*.test.cjs
```

Antes de una nueva publicación, revisar fechas declaradas en fuentes, paginación, cambios de esquema, cobertura y correcciones de municipios; actualizar la fecha de consulta del generador. La capa Bogotá tenía 3.772 elementos en esta consulta (dos páginas de 2.000); se seleccionaron solo las categorías pertinentes. Las fuentes Socrata se consultaron completas, por debajo del límite de 50.000; el script falla si alcanza ese límite para exigir paginación.

Para completar el requerimiento de **todas** las sedes, hace falta un maestro vigente de Cruz Verde y un censo comercial nacional o fuentes territoriales adicionales reconciliadas. La interfaz conserva los huecos de cobertura explícitos para incorporar ese material sin inventar establecimientos.

## Alex · 18–25

Cuarto perfil ilustrativo nacional, de todos los géneros: 24 hipótesis de señales (8 Meta, 8 Google/YouTube y 8 TikTok), momentos, barreras, mensajes propuestos, intereses y guía por medio. Se conservan las 119 señales originales: total 143. Google/YouTube comparten filas, no son personas adicionales.

Alex forma parte del universo adulto y puede solaparse con los tres perfiles anteriores. No se le asigna un tamaño ficticio ni se incrementa el universo de 30 millones. Los simuladores conservan sus supuestos y su base adulta.

Google y TikTok ofrecen 18–24 y 25–34: no se puede aislar exactamente 18–25 con esos rangos. La guía explica núcleo 18–24 y ampliación explícita hasta 34. Meta requiere comprobar controles estrictos de edad y expansión del formato; una sugerencia no garantiza entrega exclusiva.

Fuentes de edad: [Google Ads](https://support.google.com/google-ads/answer/2580383?hl=es), [TikTok Ads](https://ads.tiktok.com/resources/help/article/age-and-gender-targeting?lang=es). Consultadas el 7 de octubre de 2026.

Retrato ilustrativo creado con la herramienta integrada de generación de imágenes; archivo `assets/alex-b.webp`. Prompt final: “Square editorial portrait of a fictional 22-year-old Colombian young adult named Alex, short dark curly hair, medium warm skin, gender-neutral casual styling, lilac cotton T-shirt, canvas backpack strap; relaxed friendly expression; centered chest-up, entire head and shoulders visible; softly blurred sunny campus courtyard, natural skin detail, premium lifestyle photography, soft lavender palette; no text, logos or watermark.”
