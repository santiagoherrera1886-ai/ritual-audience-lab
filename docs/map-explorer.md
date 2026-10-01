# Explorador territorial · opción C

Implementación de la opción C seleccionada por Santiago el 1 de octubre de 2026.

## Diseño y recorridos

El mapa ocupa una fila completa del resumen: ciudades a la izquierda, contorno al centro y panel contextual a la derecha. El ecosistema de medios acompaña al hero en la columna superior izquierda para conservar un bloque superior equilibrado. «Explorar ciudades» desplaza la página hasta el mapa.

La lista y los siete puntos comparten selección, estado accesible y foco de teclado. La selección actualiza el nombre, imagen y referencia de potencial. El modo Clústeres permite elegir Valeria, Carlos, Julián o todos sin salir del mapa. Los retratos abren la ficha original; los momentos Día / Noche reutilizan los filtros compatibles del atlas. «Explorar intereses» abre la biblioteca para el perfil y producto elegidos.

Las ciudades orientan la planeación. La matriz original no contiene desglose geográfico: el mapa lo indica y no presenta las 119 señales como datos medidos por ciudad. Se mantienen las cifras ilustrativas anteriores y su explicación.

## Implementación

`assets/colombia-explorer.svg` usa el contorno existente con proporciones fijas, sin la deformación horizontal anterior. SVG y puntos comparten el mismo plano. No hay librerías de mapas, servicios externos, nuevas dependencias o datos publicitarios adicionales.

Los estilos se adaptan a tres columnas en escritorio, navegación horizontal con dos columnas en pantallas intermedias y una columna en móvil. En móvil, el mapa muestra el nombre del punto seleccionado para evitar colisiones de etiquetas. Se respeta movimiento reducido para el desplazamiento.

## Imágenes

Recurso: `assets/city-scenes.webp`. Generado con la herramienta integrada image_gen y convertido a WebP conservando la composición. Fuente: creación ilustrativa, no fotografía documental.

Prompt de producción: mosaico único de ocho imágenes sin texto, cuadrícula exacta de dos columnas por cuatro filas, sin separadores. Panorámicas ilustrativas de ciudades colombianas al atardecer azul y violeta, luces cálidas y estilo fotográfico coherente. Orden: Bogotá (capital andina y cerros orientales), Medellín (valle de montañas), Cali (ciudad y colinas), Barranquilla (río Magdalena y ciudad caribeña), Cartagena (murallas, costa y skyline), Bucaramanga (meseta y paisaje verde), Pereira (ciudad del eje cafetero) y paisaje andino. Sin logos, rótulos ni arquitectura futurista.

## Verificación local

Prueba DOM superada: siete ciudades desde lista y mapa, sincronización con detalle e imagen, foco/ARIA, cambio de modo, ficha de Carlos, navegación a sus 43 señales, compatibilidad con Noche, cambio del potencial según producto y conservación de las 119 filas. Las pruebas de las guías por medio también continúan pasando. Sintaxis y diff comprobados.

## Verificación publicada

Vercel desplegó correctamente el explorador. Se comprobó en navegador de escritorio la composición completa, el salto desde «Explorar ciudades», Cartagena desde la lista, Medellín desde el mapa, modo Clústeres, selección de Carlos, apertura de su ficha y acceso a las 43 señales originales. Las imágenes, perfiles y módulos del resumen se muestran correctamente. Se acercaron las etiquetas occidentales a sus puntos y el salto al mapa transfiere el foco al encabezado. La adaptación móvil está implementada; este entorno no permitió inspección con viewport móvil.
