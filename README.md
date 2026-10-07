# Portafolio profesional · Fredy Gustavo Chambi Canahuire

Sitio estático en español con experiencia, competencias, formación y descarga separada de un CV ATS. El contenido procede del CV compartido; los detalles están en `data.js` para facilitar futuras actualizaciones.

## Abrir el sitio

Abre `index.html` en un navegador moderno. Para probarlo desde un servidor local, desde esta carpeta ejecuta:

```powershell
python -m http.server 8000
```

Luego abre `http://localhost:8000`.

La fuente de datos está en `data.js`, los estilos en `styles.css`, la interactividad en `app.js` y el retrato extraído del PDF en `assets/fredy-chambi.jpg`. El generador jsPDF y las tipografías Google Fonts se cargan desde Internet. Si jsPDF no está disponible, el botón de CV ofrece una vista imprimible para guardar como PDF desde el navegador.

## Contenido y fidelidad

- Se incluyeron los seis puestos, sus fechas y las funciones descritas en el CV.
- Los logros aparecen separados de las responsabilidades y conservan únicamente cifras que figuran en el documento: reducción del 80 % de expedientes de denuncias hídricas y duplicación de inspecciones de piscinas públicas.
- Se incluyeron las 23 capacitaciones listadas, competencias, equipos de laboratorio, software, idiomas y educación.
- Se extrajo el retrato profesional incluido en el CV. No se encontraron fotos de proyectos; las galerías de cada puesto muestran espacios vacíos claramente rotulados y explican cómo agregar imágenes verificables en `data.js`.
- El DNI y la edad no se muestran en el sitio. El teléfono y el correo sí aparecen porque el CV los ofrece como datos de contacto.
- No se añadió LinkedIn ni un botón de WhatsApp porque esos enlaces no aparecen en el CV.
- Las contribuciones que no tienen métricas se describen como actividades documentadas, sin atribuirles resultados cuantificados.

## Revisión del perfil

**Fortalezas sustentadas:** trayectoria en sector público, consultoría, industria y laboratorio; combinación de inspección de campo, calidad del agua, análisis instrumental, cumplimiento normativo y sistemas ISO; reducción cuantificada de expedientes; capacitación y métodos de ensayo.

**Puntos a confirmar antes de publicar:** el CV no indica el periodo de la maestría. Las duraciones impresas para GERESA y Corporación Pesquera Inca no coinciden claramente con sus fechas de inicio y fin; el sitio muestra los rangos de fecha y omite las duraciones declaradas. El resumen indica más de 12 años, que se conserva como declaración del propio CV.

## Galerías

Para agregar imágenes a una experiencia, edita su arreglo `images` en `data.js`:

```js
images: [
  { src: 'assets/ana-inspeccion.jpg', alt: 'Inspección en campo', caption: 'Actividad realizada durante el puesto' }
]
```

Usa solo imágenes auténticas y confirma que pueden publicarse. Las imágenes añadidas a este arreglo aparecen en una galería y se abren en un modal accesible con Escape.

## CV ATS

El botón genera un PDF independiente con una sola columna, encabezados estándar, texto seleccionable y sin fotografía, iconos ni tablas. No convierte la página visual en PDF. La puntuación de compatibilidad no está simulada porque no existe una evaluación real contra un ATS o una oferta laboral.

## Evaluación de reclutamiento

Las palabras clave más fuertes derivadas del CV incluyen: gestión ambiental, recursos hídricos, calidad del agua, fiscalización ambiental, vigilancia sanitaria, ISO 14001, ISO 50001, ISO/IEC 17025, gestión de residuos, aguas residuales, análisis físico-químico, NIOSH 7602, APHA y QGIS. Como oportunidad, agregar un perfil de LinkedIn y aclarar el periodo de maestría en una próxima actualización del CV, si existe esa información.

