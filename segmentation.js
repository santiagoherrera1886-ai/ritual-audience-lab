// Guías editoriales. La disponibilidad se confirma en cada cuenta publicitaria.
window.RITUAL_SEGMENTATION = {
  reviewed: '01 oct 2026',
  channels: {
    meta: {
      name: 'Meta · Facebook e Instagram', short: 'Meta', kind: 'Afinidad e intereses',
      route: 'Administrador de anuncios → Conjunto de anuncios → Audiencia',
      explanation: 'Los intereses orientan la búsqueda de personas afines. Con Advantage+ pueden ser sugerencias: Meta puede ampliar la entrega. Revisa qué opciones aparecen como controles y cuáles como sugerencias en tu cuenta.',
      steps: [
        ['Define la base', 'Configura las ciudades de cobertura y revisa los controles de edad disponibles. El rango del perfil es una hipótesis de planeación.'],
        ['Busca las señales', 'En segmentación detallada o sugerencias, busca las semillas del ejemplo. Selecciona únicamente etiquetas que existan; si faltan, prueba una categoría afín disponible.'],
        ['Revisa la expansión', 'Comprueba Advantage+ y configura Facebook o Instagram en ubicaciones. Elegir Instagram no crea una audiencia distinta por sí solo.']
      ],
      exampleLabel: 'Buscar como intereses o sugerencias',
      validation: 'No todas las palabras de la matriz son intereses seleccionables. Un interés sugerido no garantiza entrega exclusiva a ese grupo.',
      measure: 'Propuesta del atlas: compara una audiencia amplia y otra con señales bajo el mismo objetivo, creatividad y presupuesto. Lee alcance, frecuencia y costo por resultado.',
      sources: [
        ['Controles y sugerencias', 'https://www.facebook.com/business/help/938372127764391'],
        ['Configurar Advantage+', 'https://www.facebook.com/business/help/25941857932125812'],
        ['Segmentación detallada', 'https://www.facebook.com/business/help/440167386536513']
      ]
    },
    google: {
      name: 'Google Ads · Búsqueda', short: 'Google Search', kind: 'Intención de búsqueda',
      route: 'Google Ads → Campaña de Búsqueda → Grupo de anuncios → Palabras clave',
      explanation: 'En Search, las palabras clave se relacionan con lo que alguien busca. Una afinidad como “Gimnasio” sirve para descubrir necesidades; no se convierte automáticamente en una palabra clave rentable para Ritual.',
      steps: [
        ['Conecta con una necesidad', 'Transforma el interés en consultas relevantes para el producto y la página de destino. Valida intención y volumen antes de invertir.'],
        ['Define las concordancias', 'Agrupa consultas por intención. Evalúa frase o exacta para una prueba controlada; exacta también admite búsquedas con el mismo significado. La amplia requiere una estrategia adecuada de Smart Bidding.'],
        ['Lee los términos reales', 'Revisa consultas y negativas. Si agregas audiencias en Observación, podrás analizarlas sin limitar la entrega a ellas; Segmentación sí restringe el público.']
      ],
      exampleLabel: 'Consultas propuestas para investigar',
      validation: 'Son hipótesis sin volumen ni CPC verificados. Los segmentos personalizados de YouTube/Display no se aplican como ese mismo tipo de audiencia en Search.',
      measure: 'Propuesta del atlas: evalúa términos de búsqueda, CTR y conversiones de la página de destino. Separa marca, categoría e intención informativa.',
      sources: [
        ['Concordancias', 'https://support.google.com/google-ads/answer/7478529?hl=en&ref_type=adv'],
        ['Observación y Segmentación', 'https://support.google.com/google-ads/answer/7365594?hl=en_'],
        ['Tipos de audiencias', 'https://support.google.com/google-ads/answer/2497941?hl=en']
      ]
    },
    tiktok: {
      name: 'TikTok Ads', short: 'TikTok', kind: 'Intereses y comportamiento',
      route: 'TikTok Ads Manager → Grupo de anuncios → Segmentación',
      explanation: 'Combina ubicación y edad con categorías de interés o comportamientos de interacción disponibles. Las opciones de una misma dimensión se unen con O; entre dimensiones se aplica Y.',
      steps: [
        ['Configura ubicación y edades', 'Elige la cobertura y los intervalos de edad de TikTok. Revisa abajo cómo se traduce el rango de este perfil.'],
        ['Encuentra categorías afines', 'Busca las semillas en Intereses y comportamientos. Según disponibilidad, explora interacción con videos o categorías de creadores; no equivale a acceder a los seguidores de una cuenta específica.'],
        ['Comprueba Smart Targeting', 'Cuando esté disponible y activo, puede ampliar intereses o audiencias. Revisa su estado para interpretar correctamente la prueba.']
      ],
      exampleLabel: 'Semillas para buscar categorías disponibles',
      validation: 'El nombre editorial de un interés o hashtag no garantiza una opción seleccionable. Confirma categoría, alcance estimado y disponibilidad en Colombia.',
      measure: 'Propuesta del atlas: compara categorías afines con un grupo amplio. Mantén creatividades equivalentes y revisa retención de video y costo por resultado.',
      sources: [
        ['Cómo combina la segmentación', 'https://ads.tiktok.com/resources/help/article/ad-targeting?lang=es'],
        ['Rangos de edad', 'https://ads.tiktok.com/resources/help/article/age-and-gender-targeting?lang=es'],
        ['Smart Targeting', 'https://ads.tiktok.com/resources/help/article/smart-targeting?lang=en'],
        ['Intereses y comportamientos', 'https://ads.tiktok.com/business/en/guides/targeting-advertising-guide']
      ]
    },
    youtube: {
      name: 'YouTube · Video y Demand Gen', short: 'YouTube / Video', kind: 'Audiencias y señales de intención',
      route: 'Google Ads → Gestor de audiencias → Segmentos personalizados',
      explanation: 'Puedes construir un segmento con términos, URLs o apps, según el tipo de campaña. Las URLs describen afinidad con sitios similares: no son una compra de sus visitantes ni ubicaciones donde aparecerá el anuncio.',
      steps: [
        ['Crea el segmento', 'Nómbralo por perfil y territorio. Usa términos que expresen intereses o intención relacionados con Ritual.'],
        ['Elige cómo interpretar los términos', 'Si la opción está disponible, distingue intereses de personas que buscaron términos en propiedades de Google. Esta última interpretación aplica a campañas en propiedades de Google.'],
        ['Asócialo a una campaña compatible', 'Añádelo a la audiencia de Video, Demand Gen o Display según disponibilidad. Revisa la expansión u optimización del formato antes de interpretar el alcance.']
      ],
      exampleLabel: 'Términos sugeridos para un segmento',
      validation: 'Audiencia y contexto son mecanismos diferentes. En Performance Max las señales de audiencia orientan al sistema; no son una restricción exclusiva.',
      measure: 'Propuesta del atlas: prueba una audiencia de afinidad frente a otra de intención. Evalúa alcance, frecuencia y visualización según el formato contratado.',
      sources: [
        ['Crear segmentos personalizados', 'https://support.google.com/google-ads/answer/9805516?hl=en'],
        ['Audiencias por tipo de campaña', 'https://support.google.com/google-ads/answer/2497941?hl=en']
      ]
    }
  }
};
