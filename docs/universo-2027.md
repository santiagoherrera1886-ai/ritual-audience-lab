# Universo nacional de planeación · 7 de octubre de 2026

El escenario inicial pasa de 14 a **30 millones** de personas: +16 millones, +114,3%. Toda Colombia, 18 años en adelante, sin límite superior, todos los géneros, zonas urbanas y rurales. Los intereses y clústeres siguen siendo nacionales.

## Base y cálculo

| Grupo adulto | Población 2027 | Uso de internet observado en 2025 | Digital estimado 2027 |
|---|---:|---:|---:|
| 18–24 | 6.151.801 | 93,8184%* | 5.771.520 |
| 25–54 | 22.490.699 | 91,1285% | 20.495.430 |
| 55+ | 11.079.250 | 63,2463% | 7.007.221 |
| Total | **39.721.750** | Ponderado por edad | **33.274.171** |

*Se usa la tasa publicada de 12–24 como aproximación para 18–24. Los cálculos usan las tasas completas, no las redondeadas de esta tabla.*

1. [DANE, proyección nacional por edad simple 2018–2070](https://www.dane.gov.co/files/censo2018/proyecciones-de-poblacion/Nacional/PPED-AreaSexoEdadNac-2018-2070.xlsx), actualización 18 de julio de 2025. Hoja `PobNacionalxÁreaSexoEdad`, fila 39: 2027, área Total. Columnas HA:KW: ambos sexos, edades 0–100+. Suma de edades 18–100+: 39.721.750. La suma de todas las edades reconcilia con el total nacional de 53.712.233.
2. [DANE, anexo TIC hogares 2025](https://www.dane.gov.co/files/operaciones/TICH/anex-TICH-2025.xlsx), publicación 30 de septiembre de 2026. Cuadro C.14, celdas P16:P18: porcentajes nacionales de uso de internet para 12–24, 25–54 y 55+. [Boletín, gráfico 30](https://www.dane.gov.co/files/operaciones/TICH/bol-TICH-2025.pdf).
3. Cálculo propio: sumatoria de población adulta 2027 por grupo × tasa de internet 2025 correspondiente, manteniendo las tasas constantes. Resultado sin redondear: 33.274.171,1595196. No es una proyección oficial del DANE sobre usuarios de internet de 2027.
4. Base de planeación: 30.000.000, equivalente a 90,16% de ese potencial estimado; margen de 9,84% elegido para planeación. No es una medición de inventario disponible, compradores, intención de compra ni afinidad certificada. Debe contrastarse con los planificadores de las cuentas publicitarias.

La población adulta es el marco demográfico; el potencial digital es una aproximación; los 30 M son una decisión de planeación. No se suman usuarios de plataformas ni se convierten identidades sociales en personas únicas. Los datos y su precisión están centralizados en `audience-model.js`. Extracción de auditoría y huellas de los archivos: `universo-fuentes.json`.

## Un simulador compartido

Día y Noche usan la misma base nacional, mix, CPM y límites de cobertura por canal. Las 12 olas distribuyen el presupuesto uniformemente. Cada producto recibe su porcentaje de inversión y aplica la misma curva de saturación del modelo por medios. La intersección es alcance Día + alcance Noche − alcance combinado; la frecuencia es impresiones / alcance. Se asume independencia entre canales y entrega dentro de la misma base por producto. La intersección es modelada, no medida.

El reparto por producto cambia el alcance de cada producto y su intersección. Con igual presupuesto, mix y CPM, el alcance combinado permanece igual, porque no se dispone de evidencia que justifique eficiencias distintas. Cambiar presupuesto, mix, CPM o universo sí modifica la proyección. Con 600 M COP y los supuestos iniciales: 16,7 M de alcance, 55,7% de cobertura y frecuencia 3,6. Con presupuesto cero: alcance, impresiones y frecuencia cero.

La migración del guardado local actualiza el antiguo universo activo de 14 M a 30 M, preservando presupuesto, CPM y mix. Conserva escenarios comparativos históricos y universos personalizados. Los CSV incluyen presupuesto, universo, método y fuentes.

## Verificación

13 pruebas de modelos aprobadas, incluidas 101 asignaciones de producto × 5 presupuestos × 12 olas; límites de alcance e intersección, coherencia entre vistas, cero inversión, CPM, cambio de universo y migración de estados. Integración DOM aprobada: fuentes, sincronización de presupuesto y universo, restablecimiento, 119 señales, tres clústeres, cuatro guías, cuatro exportaciones y compatibilidad de Carlos. Sin errores de ejecución. La verificación visual se realiza en el despliegue público.

## Resultado publicado

Verificado en https://ritual-audience-lab.vercel.app/#sim, commit `89ca590`: universo 30 M, población adulta 39,7 M y potencial digital 33,3 M; controles de presupuesto 600 → 0 → 600 M COP, con cero alcance e impactos al invertir cero. El diálogo muestra tabla, límites y tres enlaces oficiales. Captura de escritorio a 1363 px; sin errores de aplicación en la consola del dominio. No se realizó inspección visual móvil.

![Simulador publicado con universo de 30 M](Ritual_Universo_30M.jpg)
