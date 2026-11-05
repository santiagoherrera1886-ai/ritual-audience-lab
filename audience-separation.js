/* Operational brief only. This page does not activate or monitor ad accounts. */
(function () {
  'use strict';
  const nf = (n, digits = 0) => n.toLocaleString('es-CO', {maximumFractionDigits:digits, minimumFractionDigits:digits});
  const $ = selector => document.querySelector(selector);
  function mount() {
    $('#separationPlan').innerHTML = `
      <header class="separation-heading"><div><span class="atlas-eyebrow">ACTIVACIÓN / DÍA + NOCHE</span><h2 id="separationTitle">Dos productos.<br><em>Públicos separados.</em></h2><p>La regla es 0% de cruce. Si una acción necesita ambos productos, su excepción se aísla y nunca supera el 1% en la planificación.</p></div><div class="separation-cap"><strong>≤ 1<span>%</span></strong><small>DE LA AUDIENCIA MENOR<br>Tope fijo · no ampliable</small></div></header>
      <div class="separation-pools">
        <article class="separation-pool separation-day"><img src="assets/ritual-dia.webp" alt=""><span>01 / SOLO DÍA</span><h3>HidraPro</h3><strong id="separationDay">—</strong><small>personas exclusivas · estimación</small><p>Campaña y lista propias. Excluir la base Noche y la lista de excepción.</p><code>RITUAL_DIA_BASE</code></article>
        <article class="separation-pool separation-shared"><span>02 / EXCEPCIÓN AISLADA</span><h3>Cruce controlado</h3><strong id="separationShared">—</strong><small>personas compartidas · estimación</small><p id="separationMode">Sin excepción activa.</p><code>RITUAL_CRUCE_CONTROLADO</code><span class="separation-small" id="separationQuota"></span></article>
        <article class="separation-pool separation-night"><img src="assets/ritual-noche.webp" alt=""><span>03 / SOLO NOCHE</span><h3>Noche Plena</h3><strong id="separationNight">—</strong><small>personas exclusivas · estimación</small><p>Campaña y lista propias. Excluir la base Día y la lista de excepción.</p><code>RITUAL_NOCHE_BASE</code></article>
      </div>
      <div class="separation-live-note"><span>ENTREGA REAL</span><b>No verificada</b><p>Este atlas simula y documenta. No está conectado a las cuentas publicitarias, no mide exposición ni pausa campañas.</p></div>
      <details class="separation-details" open><summary>Cómo lo vamos a implementar <span>01 → 04</span></summary><ol class="separation-steps">
        <li><b>Crear una asignación única por persona.</b><p>Con datos propios autorizados, deduplicar CRM y eventos por producto. Para quien tenga señales de ambos: priorizar compra, luego carrito y después la interacción de producto más reciente. Resolver empates con una regla estable por ID. Fijar la asignación durante las 12 olas; actualizar las exclusiones diariamente. Las ventanas de captación no deben reasignar a la persona al otro producto.</p></li>
        <li><b>Separar campañas y aplicar exclusiones recíprocas.</b><p>Día incluye su base y excluye Noche + excepción; Noche hace lo inverso. Usar conjuntos, piezas, páginas de destino y eventos diferenciados por producto. Intereses, clústeres, horarios o creativos distintos ayudan a la pertinencia, pero no certifican separación de personas.</p></li>
        <li><b>Abrir la excepción solo cuando exista una razón.</b><p>Para una secuencia de ambos productos, documentar motivo, responsable y fechas. Extraer una lista exclusiva de cruce, retirarla de las dos bases y activarla en conjuntos propios de Día y Noche, sin expansión. Reservar el cupo dentro del 1%, contando también cualquier duplicación no prevista; el tamaño de una lista no demuestra el porcentaje de personas realmente alcanzadas.</p></li>
        <li><b>Verificar antes de escalar.</b><p>Revisar que las listas estén disponibles para entrega, coincidencia de identidades, exclusiones y controles de expansión en cada plataforma. Si no existe inclusión estricta o medición suficiente, mantener la excepción apagada y reportar el cruce como no verificado. La prospección abierta queda fuera de una promesa de separación estricta.</p></li>
      </ol></details>
      <details class="separation-details"><summary>Matriz de inclusión y exclusión <span>TRÁFICO</span></summary><div class="separation-table-wrap" tabindex="0" role="region" aria-label="Matriz de activación por producto"><table><caption>Listas maestras excluyentes antes de cargar a las plataformas</caption><thead><tr><th>Conjunto</th><th>Incluir</th><th>Excluir</th><th>Entrega</th></tr></thead><tbody>
        <tr><th>Día · base</th><td>RITUAL_DIA_BASE</td><td>NOCHE_BASE + CRUCE_CONTROLADO</td><td>Solo HidraPro</td></tr>
        <tr><th>Noche · base</th><td>RITUAL_NOCHE_BASE</td><td>DIA_BASE + CRUCE_CONTROLADO</td><td>Solo Noche Plena</td></tr>
        <tr><th>Día + Noche · excepción</th><td>RITUAL_CRUCE_CONTROLADO</td><td>DIA_BASE + NOCHE_BASE</td><td>Dos conjuntos exclusivos; secuencia y presión coordinadas</td></tr>
      </tbody></table></div><p class="separation-small">Todos los nombres de lista usan el prefijo RITUAL_. Sin excepción, la lista CRUCE_CONTROLADO queda vacía y sus conjuntos apagados. No usar “todos los visitantes” en ambas bases.</p></details>
      <details class="separation-details"><summary>Configuración por plataforma <span>MEDIOS</span></summary><div class="separation-platforms">
        <article><h3>Meta</h3><p>Usar audiencias personalizadas por producto y exclusiones recíprocas en cada conjunto. Verificar que la inclusión opere como restricción en la configuración elegida; si solo es una sugerencia, no usarla para prometer separación estricta. Validar controles disponibles en la cuenta antes de publicar.</p></article>
        <article><h3>Google / YouTube</h3><p>Aplicar exclusiones de segmentos de datos propios. Para grupos de inclusión estricta, elegir una configuración que permita desactivar la segmentación optimizada o la expansión. Las señales de audiencia de Performance Max no delimitan por sí solas el público.</p></article>
        <article><h3>TikTok</h3><p>Crear listas por producto, incluir la correspondiente y excluir la contraria. Verificar elegibilidad, tamaño mínimo y configuración de expansión para el objetivo elegido. Si el grupo compartido no es elegible, mantenerlo apagado; no ampliar el 1% para darle escala.</p></article>
        <article><h3>Programmatic</h3><p>Solicitar al proveedor listas de inclusión, supresión cruzada y frecuencia coordinada para identidades reconocidas. Confirmar cobertura de identificación y método de deduplicación. La compra contextual por sí sola no certifica que las personas sean distintas.</p></article>
      </div><p class="separation-small">Referencias operativas: <a href="https://www.facebook.com/business/help/25941857932125812" target="_blank" rel="noopener noreferrer">Meta · controles de audiencias (puede requerir acceso)</a> · <a href="https://support.google.com/google-ads/answer/2549058?hl=es" target="_blank" rel="noopener noreferrer">Google · exclusiones</a> · <a href="https://support.google.com/google-ads/answer/10537509?hl=es" target="_blank" rel="noopener noreferrer">Google · segmentación optimizada</a> · <a href="https://ads.tiktok.com/help/article/engagement" target="_blank" rel="noopener noreferrer">TikTok · audiencias de interacción</a>.</p></details>
      <details class="separation-details" open><summary>Cómo controlamos ese 1% <span>MEDICIÓN</span></summary><div class="separation-measure"><div><h3>Una fórmula, el mismo periodo.</h3><p><strong>Cruce = personas alcanzadas por ambos ÷ menor alcance de producto × 100.</strong></p><p>Ejemplo: Día 9 M y Noche 6 M → máximo 60.000 personas compartidas, no 150.000. El límite no es 1% de inversión, de impresiones ni el tamaño de un lookalike.</p></div><div><h3>La medición debe respaldar la cifra.</h3><p>Revisar diariamente el acumulado de campaña y los últimos 30 días, comparando el mismo periodo e identidad. Usar medición deduplicada disponible y declarar su cobertura e incertidumbre; CRM mide pertenencia a listas, no exposición publicitaria. No sumar alcances de plataformas como si fueran personas únicas.</p></div></div><div class="separation-thresholds"><p><b>Desde 0,8%</b>Alerta operativa propuesta: detener nuevas incorporaciones al cruce y revisar duplicados.</p><p><b>Al llegar a 1%</b>Pausar los conjuntos de excepción, revisar exclusiones y corregir la entrega.</p><p><b>Si supera 1% o falta dato</b>Reportar incumplimiento o “no verificado”. Nunca recortar el dato observado a 1% para aparentar cumplimiento.</p></div><p class="separation-small">Protocolo para el equipo de pauta; no es una automatización instalada. Una pausa no elimina exposiciones previas. Coincidencia de listas, actualización, movilidad e identificación entre plataformas impiden garantizar “jamás” en entrega real.</p></details>
      <footer class="separation-footer"><span>REGLA ACTUALIZADA · 05 NOV 2026</span><a href="docs/separacion-audiencias-2026-11-05.md" download>Descargar guía de implementación ↓</a></footer>`;
  }
  function render(plan) {
    if (!$('#separationPlan')) return;
    if (!$('#separationTitle')) mount();
    const r = plan.final, people = window.RitualProductModel.toPeople(r);
    $('#separationDay').textContent = nf(people.dayOnly);
    $('#separationNight').textContent = nf(people.nightOnly);
    $('#separationShared').textContent = nf(people.overlap);
    $('#separationMode').textContent = plan.overlapPercent > 0
      ? `Excepción planificada hasta ${nf(plan.overlapPercent,1)}% de la audiencia menor. Solo se activa con motivo y control definidos.`
      : 'Sin excepción activa. Ambas audiencias permanecen separadas en la planificación.';
    $('#separationQuota').textContent = `Techo de referencia al 1%: ${nf(Math.floor(Math.min(r.day,r.night)*.01))} personas. Cifras aproximadas, no cupos de entrega garantizados.`;
  }
  document.addEventListener('click', event => {
    if (event.target.closest('[data-separation-scroll]')) {
      $('#separationPlan')?.scrollIntoView({behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth', block:'start'});
    }
  });
  window.RitualSeparation = Object.freeze({render});
})();
