# Ritual: separación de audiencias Día / Noche

Actualizado: 5 de noviembre de 2026. Guía propuesta de implementación para el equipo de pauta. El atlas no está conectado a cuentas publicitarias y no ejecuta exclusiones, pausas ni monitoreo.

## Regla de planificación

- Base: 0% de intersección entre HidraPro y Noche Plena.
- Excepción: de 0% a 1% de la audiencia menor, únicamente cuando una acción justifique ambos productos. Tope no ampliable.
- Fórmula: personas alcanzadas por ambos / mínimo(alcance Día, alcance Noche) × 100, con el mismo periodo y método de identificación.
- Ejemplo: Día 9.000.000 y Noche 6.000.000 permiten como máximo 60.000 personas compartidas. La unión sería 14.940.000 al tope, o 15.000.000 con cruce cero.
- El 1% no representa presupuesto, impresiones, porcentaje del universo total ni un lookalike del 1%.

## Asignación y listas

1. Construir bases con datos propios autorizados, CRM y eventos de producto. Deduplicar por identidad estable. Mantener las señales de HidraPro y Noche Plena separadas.
2. Si una persona tiene señales de ambos, asignar una sola base: compra > carrito > interacción de producto más reciente. Resolver empates con una regla determinista. Mantener la asignación durante las 12 olas de campaña; no rotarla entre productos al renovar una ventana de captación.
3. Sin excepción, la lista de cruce está vacía. Con excepción, documentar motivo, responsable, fechas y secuencia; seleccionar un grupo acotado y retirarlo de ambas bases. El cupo planificado no prueba el porcentaje real de exposición: el denominador real puede ser menor.
4. Sincronizar listas y exclusiones diariamente y registrar la fecha de actualización. Revisar su disponibilidad para entrega y coincidencia antes de activar.

| Conjunto | Incluir | Excluir | Mensaje |
| --- | --- | --- | --- |
| Día base | RITUAL_DIA_BASE | RITUAL_NOCHE_BASE + RITUAL_CRUCE_CONTROLADO | HidraPro |
| Noche base | RITUAL_NOCHE_BASE | RITUAL_DIA_BASE + RITUAL_CRUCE_CONTROLADO | Noche Plena |
| Día excepción | RITUAL_CRUCE_CONTROLADO | RITUAL_DIA_BASE + RITUAL_NOCHE_BASE | HidraPro, secuencia definida |
| Noche excepción | RITUAL_CRUCE_CONTROLADO | RITUAL_DIA_BASE + RITUAL_NOCHE_BASE | Noche Plena, secuencia definida |

Las tres listas maestras deben ser mutuamente excluyentes. Las dos campañas de excepción usan el mismo grupo compartido. No excluir ese grupo de sus propios conjuntos. Mantener ambas excepciones apagadas cuando el cruce planeado sea cero.

## Activación por medio

- **Meta:** configurar audiencias personalizadas y exclusiones recíprocas. Confirmar que la inclusión sea una restricción en la configuración seleccionada. Si opera como sugerencia, no presentarla como separación estricta. Verificar los controles reales de la cuenta.
- **Google / YouTube:** utilizar exclusiones de datos propios; elegir una configuración que permita limitar la entrega y desactivar segmentación optimizada/expansión cuando se necesite inclusión estricta. Las señales de Performance Max no equivalen a una lista cerrada.
- **TikTok:** listas de producto con inclusión y exclusión cruzada. Validar elegibilidad, tamaño mínimo, objetivo y expansión antes de activar. Si la excepción no alcanza el mínimo, dejarla apagada; no aumentar el 1%.
- **Programmatic:** solicitar al proveedor inclusión, supresión recíproca y frecuencia coordinada sobre identidades reconocidas; confirmar cobertura de identidad y deduplicación.

Las campañas de cada producto necesitan conjuntos, piezas, páginas y eventos diferenciados. Intereses, perfiles, creativos, horarios o inventarios distintos no garantizan personas distintas. La prospección abierta no permite prometer el mismo control que una lista cerrada.

## Medición y respuesta operativa

Revisar diariamente tanto el acumulado de campaña como los últimos 30 días, usando siempre la misma ventana para ambos productos. La deduplicación debe incluir la exposición a ambos productos entre plataformas, cuando la medición disponible lo permita. No sumar alcances de plataformas como personas únicas. CRM acredita pertenencia a listas; no acredita impresiones recibidas.

| Estado observado | Acción propuesta |
| --- | --- |
| Desde 0,8% | Detener nuevas incorporaciones a la excepción, auditar listas y exclusiones |
| Al llegar a 1% | Pausar conjuntos de excepción y corregir la entrega |
| Más de 1% | Registrar incumplimiento; conservar la cifra observada y revisar duplicación fuera de la excepción |
| Sin medición suficiente o con incertidumbre que cruza el límite | Mantener excepción apagada; reportar «no verificado», nunca 0% |

El 1% engloba todo el cruce, incluida la duplicación involuntaria. No reservar un 1% completo para una excepción si ya existe duplicación fuera de ella. Toda pausa es una acción del equipo; esta guía no instala reglas automáticas. Pausar no borra exposiciones anteriores. La coincidencia incompleta de listas, su latencia y la identificación entre plataformas impiden garantizar «jamás» en entrega real.

## Qué cambió en el atlas

El simulador y la validación comercial comparten una política con base 0% y techo 1%. Al cargar valores antiguos se limita cualquier cruce superior a 1%. El límite se aplica también a funciones del modelo, escenarios, importación y CSV. Los resultados siguen siendo supuestos de planificación; el estado de entrega real se mantiene como no verificado. Los documentos de octubre conservan contexto histórico y su regla anterior queda sustituida por esta guía.

## Referencias operativas

- [Meta: controles de audiencias; puede requerir acceso](https://www.facebook.com/business/help/25941857932125812).
- [Google: exclusiones de audiencia](https://support.google.com/google-ads/answer/2549058?hl=es).
- [Google: segmentación optimizada](https://support.google.com/google-ads/answer/10537509?hl=es).
- [TikTok: audiencias de interacción](https://ads.tiktok.com/help/article/engagement).

Las reglas de asignación, el umbral de alerta de 0,8% y la frecuencia de revisión son propuestas operativas para Ritual, no promesas de entrega de las plataformas.
