# Ritual Audience Atlas 2027

Aplicación estática de planeación de audiencias de Ritual Día (Hidrapro) y Ritual Noche (Noche Plena). Diseño **Editorial Moderno — opción B**: navegación azul oscuro, paneles claros, acentos violetas y adaptación a móvil.

## Abrir

Abre `index.html` directamente, o inicia un servidor local:

```sh
python -m http.server 4173
```

Visita `http://localhost:4173`. No requiere compilación, instalación de dependencias ni servicios externos. Todas las fotografías y marcas se sirven desde `assets/`.

## Vistas y funciones

- **Resumen:** propuesta Ritual, universo de planeación, distribución territorial y accesos a las personas.
- **Audiencias:** Valeria, Carlos y Julián, con perfiles y acceso a sus señales.
- **Medios:** roles, inversión por canal y señales asociadas, sincronizados con el simulador.
- **Intereses:** las 119 filas originales, búsqueda sin sensibilidad a tildes, filtros por persona/plataforma/categoría, tarjetas o tabla, paginación y detalle de táctica/validación.
- **Simulador:** presupuesto y universo editables, asignación por canal que suma 100%, CPM editables, curvas de alcance y frecuencia, tres presets y comparación de hasta tres escenarios.
- **CSV:** matriz completa desde Resumen/Audiencias; todas las filas filtradas desde Intereses; mezcla activa desde Medios; escenario y comparación desde Simulador. Incluye BOM UTF-8 para Excel.
- Navegación por URL (`#summary`, `#audiences`, `#media`, `#library`, `#sim`), menú móvil, navegación con teclado y diálogos con cierre mediante Escape.
- Persistencia local del simulador y escenarios mediante `localStorage`; si no está disponible, la aplicación sigue funcionando durante la sesión.

## Datos y límites

Se conservan íntegramente las **119 señales originales** y sus nueve campos: 34 de Valeria, 43 de Carlos y 42 de Julián. `data.js` contiene la matriz original. Las categorías de la biblioteca y los textos de los perfiles son organización editorial; las personas y fotografías son ilustrativas.

Google y YouTube comparten 34 filas de la matriz: no son 68 señales diferentes. Programmatic es un canal propuesto sin filas propias en la matriz original. La disponibilidad de cada señal debe validarse en la plataforma correspondiente.

Los 53,7 M, 22,5 M y 14,0 M del resumen son **supuestos heredados sin fuente demográfica verificada adjunta**. La distribución territorial es una propuesta estratégica. No representan alcance medido ni ventas.

El simulador conserva los supuestos del modelo anterior: CPM iniciales, límites de cobertura por canal y una curva exponencial de saturación. Combina los alcances bajo un supuesto de independencia entre canales. Es una proyección de planeación, no deduplicación medida. Los supuestos y fórmulas pueden consultarse en «Sobre este atlas». No hay conexión con cuentas publicitarias ni un backend de reportes.

## Archivos

- `index.html`: estructura de las cinco vistas.
- `styles.css`: sistema visual y estilos responsive.
- `data.js`: datos originales de afinidad.
- `model.js`: cálculos y redistribución del presupuesto.
- `app.js`: navegación, filtros, diálogos, exportación y persistencia.
- `assets/`: marcas heredadas y fotografías ilustrativas; procedencia en `assets/SOURCES.md`.
- `tests/model.test.cjs`: invariantes del simulador.

## Verificar los cálculos

```sh
node --test tests/model.test.cjs
```

Verifica conservación de presupuesto, suma exacta del mix, cero inversión, cobertura máxima, monotonicidad de alcance y protección frente a datos almacenados inválidos.

## Publicación

Es un sitio estático compatible con la configuración existente de Vercel y con GitHub Pages. No necesita variables de entorno. URL declarada por el repositorio: https://ritual-audience-lab.vercel.app
