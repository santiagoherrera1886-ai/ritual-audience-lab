(function (root, factory) {
  const value = factory();
  if (typeof module === 'object' && module.exports) module.exports = value;
  else root.RitualYouth = value;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';
  const persona = {
    name:'Alex', image:'alex-b', age:'18–25', subtitle:'Nuevos ritmos, nuevos rituales',
    description:'Entre el estudio, el primer trabajo y los planes con amigos, busca hábitos de bienestar que quepan en su día y en su presupuesto.',
    tags:['Vida universitaria','Primer empleo','Deporte social','Rutinas','Descanso'],
    story:'Quiere encontrar su propio ritmo: una rutina sencilla para acompañar sus días y una pausa consciente al cerrar la jornada.',
    moment:'CONSTRUIR SU PROPIO RITUAL', icon:'sparkles', tint:'#ddf3ed', count:24,
    scope:'Toda Colombia · 18 a 25 años · todos los géneros. Cohorte adicional por edad, sin distinción entre ciudades. Puede compartir afinidades con Valeria, Carlos y Julián; forma parte del universo adulto existente y no se suma a él.',
    sections:[
      ['Momentos que abren la conversación','Antes de salir a estudiar o trabajar; después de una actividad física; al preparar el día siguiente; durante una pausa sin pantallas. Son hipótesis creativas para investigar, no comportamientos medidos.'],
      ['Necesidades y barreras','Busca facilidad de uso, claridad sobre el producto y una compra que pueda justificar. Explorar precio por porción, formatos y lugar de compra. La edad por sí sola no prueba capacidad de pago ni intención de compra.'],
      ['Ritual Día · propuesta de contenido','Mostrar cómo integrar Hidrapro en una rutina activa y explicar su preparación con información aprobada por la marca. Mensaje propuesto: “Un pequeño ritual para acompañar tu día”.'],
      ['Ritual Noche · propuesta de contenido','Conectar con hábitos de cierre de jornada y una pausa cotidiana. Mensaje propuesto: “Dale un momento a tu pausa”. Sin prometer curar insomnio, ansiedad o mejorar el rendimiento académico.'],
      ['Creatividad y medios','Probar videos breves de rutinas reales en Meta y TikTok; búsquedas de marca y categoría en Google; explicaciones de producto en YouTube. Comparar costo por visita cualificada, interacción y conversión con creatividades equivalentes.'],
      ['Del contenido al punto de venta','Usar el directorio para planear verificación comercial y disponibilidad. Confirmar existencia de Ritual y condiciones de compra con cada establecimiento antes de anunciar “disponible aquí”. La ciudad organiza las droguerías; no redefine los intereses del perfil.'],
      ['Tamaño de la audiencia','Sin un alcance propio asignado. El universo de planeación de 30 millones es nacional y adulto; no es el tamaño de Alex. Se requiere un cálculo específico 18–25 y validación en cada plataforma antes de presupuestar esta cohorte.']
    ]
  };
  const ageNote = channel => channel === 'meta'
    ? 'Cohorte objetivo: 18–25, Colombia y todos los géneros. Configura mínimo 18 y máximo 25 solo si el formato permite ambos como controles de entrega. Si la edad máxima es una sugerencia de Advantage+, no presentes la campaña como exclusiva para 18–25.'
    : 'Cohorte objetivo: 18–25, Colombia y todos los géneros. La plataforma ofrece grupos 18–24 y 25–34; no permite aislar los 25 años con esos grupos. Usa 18–24 como núcleo; si agregas 25–34, informa que amplías hasta 34. Revisa la edad desconocida y cualquier expansión antes de activar.';
  const groups = [
    ['Meta / Instagram', 'meta', [
      ['Rutinas de autocuidado','Día / Noche','Reels con hábitos simples y demostración de uso del producto.'],
      ['Vida universitaria','Día','Explorar contenidos de organización del día; no asumir matrícula ni ingresos por afinidad.'],
      ['Primer empleo y organización personal','Día / Noche','Historias de transiciones de rutina y pausas sostenibles.'],
      ['Deporte recreativo','Día','Probar creatividad de actividad física cotidiana y consumo responsable.'],
      ['Running y clubes deportivos','Día','Explorar afinidades deportivas disponibles y contenidos de comunidad.'],
      ['Cocina práctica','Día','Probar contenidos educativos sobre preparación y facilidad de uso.'],
      ['Rutina antes de dormir','Noche','Conectar con momentos de cierre del día, sin inferir problemas de salud.'],
      ['Pausa digital y bienestar','Noche','Contenido de pausa sin pantallas como contexto creativo.']
    ]],
    ['Google / YouTube', 'google', [
      ['Ritual JGB: cómo se usa','Día / Noche','Investigar consultas de marca, preparación y uso aprobado.'],
      ['Hidratación para actividad física','Día','Validar búsquedas de categoría y relevancia para la página de destino.'],
      ['Ritual Hidrapro precio','Día','Explorar intención comercial; validar precio e inventario antes de anunciar.'],
      ['Ritual Noche Plena precio','Noche','Separar búsquedas de marca de intención informativa.'],
      ['Rutinas de estudio y descanso','Noche','En YouTube, probar contexto de organización; no prometer mejor desempeño.'],
      ['Hábitos de bienestar para jóvenes adultos','Día / Noche','Investigar contenidos educativos y segmentos disponibles en YouTube.'],
      ['Preparación de electrolitos','Día','Explicar uso autorizado; revisar términos y negativas en Search.'],
      ['Rituales para cerrar el día','Noche','Probar contenidos de hábitos y cuidado personal en YouTube.']
    ]],
    ['TikTok', 'tiktok', [
      ['Rutinas de mañana','Día','Video breve de preparación y un hábito fácil de repetir.'],
      ['Un día conmigo: estudio y trabajo','Día / Noche','Contenido de creadores adultos mostrando situaciones cotidianas.'],
      ['Gimnasio para principiantes','Día','Contexto de actividad física recreativa, sin promesas de rendimiento.'],
      ['Deporte con amigos','Día','Explorar categorías de deporte y creatividad de comunidad.'],
      ['Recetas fáciles y hábitos','Día','Demostración de producto con instrucciones y mensajes aprobados.'],
      ['Rutina nocturna sin pantallas','Noche','Pieza de cierre de jornada con una pausa consciente.'],
      ['Organización de la semana','Día / Noche','Probar un ritual cotidiano entre estudio, trabajo y tiempo personal.'],
      ['Creadores de bienestar cotidiano','Día / Noche','Buscar categorías disponibles; no equivale a segmentar seguidores de una cuenta.']
    ]]
  ];
  const signals = groups.flatMap(([platform,channel,items]) => items.map(([interest,product,tactic]) => ({
    cluster:'Alex',platform,territory:'Jóvenes adultos · nuevos ritmos',interest,
    type:channel==='google'?'Consulta o contexto propuesto':'Afinidad editorial por validar',
    priority:'Exploración',product,tactic,age:'18–25',
    validation:`Hipótesis editorial; no certifica interés seleccionable, volumen ni comportamiento real. ${ageNote(channel)}`
  })));
  return {persona, signals, ageNote};
});
