# Ritual · Universo de 24 millones por edad

Actualización del 8 de octubre de 2026. Sustituye el escenario activo anterior de 30 M. La base de planeación es **24.000.000 de personas de 18 años en adelante**, de todos los géneros, en toda Colombia. Es una decisión de planeación, no una medición de compradores ni de alcance disponible en una plataforma.

## Base demográfica y distribución

La proyección del DANE suma 39.721.750 adultos para 2027. Al aplicar las tasas de internet de 2025 por edad se estima un potencial digital de 33.274.171,16 adultos. Los 24 M equivalen al 72,13% de ese potencial; la diferencia es un margen de planeación elegido, no inventario medido.

| Edad | Población DANE 2027 | Digital estimado | Universo Ritual | Peso digital |
|---|---:|---:|---:|---:|
| 18–25 | 7.043.089 | 6.583.737 | 4.748.719 | 19,79% |
| 26–34 | 7.940.851 | 7.236.376 | 5.219.455 | 21,75% |
| 35–44 | 7.504.886 | 6.839.088 | 4.932.899 | 20,55% |
| 45–54 | 6.153.674 | 5.607.749 | 4.044.758 | 16,85% |
| 55+ | 11.079.250 | 7.007.221 | 5.054.169 | 21,06% |
| Total | 39.721.750 | 33.274.171 | **24.000.000** | **100%** |

Digital por franja = suma de población por edad simple × tasa de internet correspondiente. Peso por edad = digital de la franja / digital adulto total. Universo Ritual por edad = 24.000.000 × peso, redondeado mediante restos mayores. Los digitales visibles se redondean de forma independiente; el cálculo conserva la precisión original.

Las cinco edades son excluyentes. Los 25 años están incluidos en 18–25, y 26–34 comienza en 26. Los perfiles de afinidad Valeria, Carlos y Julián pueden atravesar las edades. Alex aporta señales editoriales de 18–25 dentro de la misma base, no personas adicionales. Los enfoques de comunicación son propuestas editoriales, no resultados de una encuesta.

## Fuentes y extracción reproducible

- [DANE, proyección por área, sexo y edad 2018–2070](https://www.dane.gov.co/files/censo2018/proyecciones-de-poblacion/Nacional/PPED-AreaSexoEdadNac-2018-2070.xlsx), actualización 18 de julio de 2025. Hoja `PobNacionalxÁreaSexoEdad`, fila 39: 2027, área Total. Columnas HA:KW: ambos sexos, edades 0–100+. Se volvió a descargar el archivo el 8 de octubre de 2026 y coincide con la huella registrada en `universo-fuentes.json`.
- [DANE, anexo TIC hogares 2025](https://www.dane.gov.co/files/operaciones/TICH/anex-TICH-2025.xlsx), publicación 30 de septiembre de 2026. Cuadro C.14, P16:P18: tasas nacionales 12–24, 25–54 y 55+. [Boletín, gráfico 30](https://www.dane.gov.co/files/operaciones/TICH/bol-TICH-2025.pdf).
- Tasas conservadas: 0,9381837570611629 para 18–24 (proxy de 12–24), 0,9112847255015205 para 25–54 y 0,6324634718139461 para 55+. La edad 25 utiliza la tasa 25–54 aunque se muestre en la franja 18–25. Se mantienen constantes hacia 2027. El cálculo digital es propio, no una proyección oficial del DANE para uso de internet.

## Intersección máxima del 10%

La base del porcentaje es **la menor audiencia alcanzada entre Día y Noche**. No es el universo total ni el porcentaje de presupuesto. El control admite 0–10% y su valor inicial es 10%.

Alcance único = Día + Noche − intersección. La visualización muestra tres grupos excluyentes: solo Día, ambos y solo Noche. La suma coincide con el alcance único, limitado al universo activo de 24 M.

El modelo por medios determina el alcance total T, a partir del presupuesto, CPM, mix y saturación. Se calculan también curvas individuales de cada producto. Con q = proporción de presupuesto Día, n = 1 − q, m = min(q,n) y r = máximo de intersección (0–0,10):

```
Cruce objetivo = T × r × m / (1 − r × m)
Margen Día = max(0, alcance individual Día / q − T)
Margen Noche = max(0, alcance individual Noche / n − T)
Cruce = min(cruce objetivo, margen Día, margen Noche)
Día = q × (T + cruce)
Noche = n × (T + cruce)
Frecuencia producto = impresiones del producto / alcance del producto
```

Con q=0 o n=0, el cruce y el alcance del producto sin inversión son cero. La construcción mantiene alcances acumulados no decrecientes y no supera las curvas individuales. El alcance combinado coincide con el modelo por medios. Reducir el cruce redistribuye los contactos, no inventa más alcance total. Las doce olas entregan presupuesto uniforme.

La baja duplicación es un **objetivo de planificación coordinada**, no una garantía de entrega ni una medición. Requiere exclusiones, gestión de frecuencia y validación de la entrega entre productos y plataformas. Los CPM y coberturas por medio siguen siendo supuestos del atlas.

## Persistencia y exportación

El escenario activo se abre con 24 M incluso si el navegador guardó 14 o 30 M. Conserva el presupuesto, CPM y mix. El universo queda fijo en la interfaz. Las comparaciones históricas conservan sus datos; al cargarlas se aplica su presupuesto/mix a la base actual de 24 M. El control de cruce se guarda en el mismo navegador.

Resumen y Audiencias exportan CSV con las edades, poblaciones, digitales, pesos, universo, fuentes y perfiles. Intereses mantiene la matriz exportable. El CSV del simulador incluye el denominador y el límite del cruce.

## Verificación

20 pruebas de modelos aprobadas, incluyendo 101 repartos de inversión × 5 presupuestos × 12 olas, conservación del universo, intersección <=10%, crecimiento acumulado por producto, frecuencias, casos cero, tasa a los 25 años, migración y compatibilidad del directorio de droguerías. La integración DOM verifica los cinco selectores de edad, cuatro perfiles, tres diálogos, presupuesto cero/alto, controles del cruce, base fija, migración y exportación por edad, sin errores de ejecución.
