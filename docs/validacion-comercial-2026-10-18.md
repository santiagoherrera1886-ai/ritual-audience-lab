> Nota del 5 de noviembre de 2026: este documento conserva contexto de octubre. La regla de cruce vigente es 0% por defecto y máximo 1%; sustituye cualquier referencia anterior a 10%. Ver [guía actual](separacion-audiencias-2026-11-05.md).

# Validación comercial de Ritual — 18 de octubre de 2026

## Alcance de la actualización

Se agregan las rutas `#commercial` (Validación) y `#requests` (Solicitudes), con acceso desde el resumen y ambas navegaciones. Se conserva la identidad del atlas, los cuatro perfiles, las 143 señales, los datos demográficos y el directorio.

La sección Solicitudes registra ocho requerimientos del resumen compartido: suficiencia comercial, desglose por producto, compradores/recompra, contribución digital, alcance/frecuencia/inversión, desduplicación, ampliación y conservación de la metodología. “Incorporado” indica una función implementada, no aprobación de supuestos.

## Fuente comercial

Documento proporcionado: Ritual JGB 2026, 85 páginas.

- P. 84: HidraPro 1.102.140 sachets año 1 y SOM reportado 0,7% en valor; Noche Plena 357.280 hogares, 357.280 unidades y penetración reportada 3,2%, sobre 11.200.000 hogares.
- P. 76: 90% droguerías y 10% e-commerce/marketplaces. Es canal de transacción, no atribución digital.
- P. 72 y 82: pauta condicionada a 80% de distribución ponderada frente a PADS.
- Venta neta impresa: 1.545 HidraPro / 688 Noche Plena. La misma escala implica 69,19% de peso para Hidratación; escala monetaria no explícita en la lámina, por confirmar. No se usa para convertir ingresos a unidades.
- La cifra verbal “2.500–3.000” no se interpreta como unidades ni como millones sin confirmación.
- 357.280 / 11.200.000 = 3,19%; el 3,2% de la presentación es redondeado.

## Hipótesis iniciales, todas editables

6 sachets por comprador de HidraPro por año; 50% de contribución digital en ambos productos; conversión de persona alcanzada a comprador de 1,5% Día y 2% Noche; una persona compradora de referencia por hogar Noche; frecuencia de 6 por producto durante el año; CPM promedio 10.000 COP; inversión 600 M COP; cobertura planificable 70%; cruce 10% de la audiencia menor; universo neto 24 M; distribución supuesta 80% vs. PADS.

No son benchmarks, tasas observadas ni decisiones comerciales aprobadas. La meta de Noche Plena ya está en hogares únicos: no se vuelve a dividir por la recompra.

## Cálculo y escenarios

Compradores Día = unidades / unidades por comprador/año. Compradores apoyados por digital = compradores * contribución. Alcance por producto = compradores apoyados / conversión. Alcance neto = Día + Noche - cruce * menor alcance. Impresiones = suma de alcance por producto * frecuencia por producto. Inversión aritmética = impresiones * CPM / 1000. Universo neto mínimo = alcance neto requerido / cobertura.

Se comparan 15 M nominales (9 M / 6 M), 24 M netos con reparto 60/40, 24 M según necesidad y 30 M según necesidad. Las bases netas se convierten a bases brutas por producto resolviendo `neto = bruto * (1 - cruce * menor participación)`.

Capacidad financiada por producto = mínimo(base del producto * cobertura, inversión del producto * 1000 / CPM / frecuencia). Este es un techo aritmético orientativo; no incorpora saturación ni inventario y no garantiza entrega. El simulador de medios conserva sus curvas separadas. El cruce de universos y el cruce de alcance usan el mismo porcentaje como hipótesis explícita; no son mediciones.

Con los supuestos iniciales: alcance requerido Día 6.123.000, Noche 8.932.000; cruce 612.300; neto 14.442.700; universo mínimo 20.632.429; 90.330.000 impresiones; inversión aritmética 903.300.000 COP. El reparto por necesidad es aproximadamente 40,67% Día / 59,33% Noche. No se recomienda ampliar automáticamente la base de 24 M: primero se revisan reparto e inversión. En el escenario prudente, la necesidad supera incluso el potencial digital heredado del atlas.

## Integración

Aplicar escenario actualiza universo neto, presupuesto, CPM medio (escalando proporcionalmente los CPM por canal) y reparto Día/Noche del atlas. La edad y los textos visibles se recalculan con la base activa. El simulador Día/Noche redondea el reparto a porcentajes enteros, como antes. Los escenarios se guardan localmente; almacenamiento del atlas versión 4 conserva universos elegidos. Versiones antiguas migran a la referencia de 24 M.

Se exportan los supuestos, necesidades, escenarios y límites en CSV. Solicitudes exporta un registro independiente. Los datos de la fuente no se confunden con las hipótesis.

## Verificación

Pruebas Node del cálculo comercial, conservación de uniones, casos con cero presupuesto/contribución, reparto asimétrico, recompra, sensibilidad, distribución y persistencia. Se mantienen las pruebas anteriores del atlas. Validación de DOM e interacciones con happy-dom, sin sustituir una revisión visual en navegador.
