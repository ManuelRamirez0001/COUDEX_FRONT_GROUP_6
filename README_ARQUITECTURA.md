# Guía de Arquitectura y Nueva Estructuración

Este documento explica en detalle el funcionamiento técnico de la nueva arquitectura modular del proyecto **Ratón de Biblioteca / Coudex**.

---

## Objetivo de la Reestructuración

Anteriormente, el proyecto tenía una **estructura plana y monolítica**, donde cada página (`index.html`, `contactanos.html`) repetía código idéntico del Navbar, Footer, estilos y scripts. 

Con la **nueva estructura modular**:
1. **DRY (Don't Repeat Yourself):** El menú de navegación y el footer se editan en un solo lugar (`components/`).
2. **Arquitectura SPA (Single Page Application):** La navegación entre páginas no recarga el navegador completo; solo se reemplaza el contenido del `<main id="main">`.
3. **Separación de responsabilidades:** Separación clara entre vista (`pages/`, `components/`), diseño (`css/`) y lógica (`js/`).
4. **Módulos nativos (ES Modules):** Código JavaScript ordenado por funciones específicas, sin variables globales en conflicto.

---

## Mapa del Proyecto y Responsabilidades

```text
COUDEX_FRONT_GROUP_6/
│
├── index.html                 # 1. Shell Principal (marco general)
├── admin.html                 # Shell independiente del panel administrativo
├── readme.md                  # Documentación general del repositorio
├── README_ARQUITECTURA.md     # Esta guía técnica de arquitectura
│
├── css/
│   ├── styles.css              # Estilos globales del sitio
│   ├── responsive.css          # Adaptaciones responsivas del sitio
│   └── admin/
│       ├── stylesAdmin.css     # Estilos del panel administrativo
│       └── responsiveAdmin.css # Adaptaciones responsivas del panel
│
├── components/                 # Fragmentos reutilizables
│   ├── nav.html                # Barra de navegación del sitio
│   ├── footer.html             # Pie de página del sitio
│   └── admin/
│       ├── header.html         # Encabezado del panel
│       └── sidebar.html        # Navegación lateral del panel
│
├── pages/                      # Vistas parciales del sitio y el panel
│   ├── inicio.html             # Vista principal
│   ├── catalogo.html           # Catálogo, filtros, diez libros base y suscripción
│   ├── nosotros.html           # Presentación, equipo y FAQ
│   ├── contactanos.html        # Formulario y canales de atención
│   └── admin/
│       └── panelAdmin.html     # Formulario y listado de libros
│
├── js/                         # Lógica en JavaScript ES Modules
│   ├── app.js                  # Arranque y navegación SPA del sitio
│   ├── catalogo.js             # Filtros, paginación, carrusel y ajustes del catálogo
│   ├── carrito.js              # Carrito persistente y conexión de botones de compra
│   ├── inicio.js               # Interacción del carrusel de testimonios de Inicio
│   ├── loadContent.js          # Carga de fragmentos y páginas del sitio
│   ├── eventos.js              # Formulario de contacto y eventos del sitio
│   ├── productosStorage.js     # Productos nuevos y ajustes de productos base en localStorage
│   └── admin/
│       ├── appAdmin.js         # Arranque y navegación del panel
│       ├── loadContentAdmin.js # Carga de fragmentos y vistas del panel
│       └── eventosAdmin.js     # Gestión de productos, vista previa y salida JSON
│
└── img/
    ├── ...                    # Recursos visuales generales
    └── vistaCatalogo/
        ├── heroCatalogo.svg   # Hero visual del catálogo
        ├── parche/            # Imágenes de categorías
        ├── libros/            # Portadas SVG de los productos base
        ├── Mariposa1.svg      # Mariposa decorativa inferior de la suscripción
        └── Mariposa2.svg      # Mariposa decorativa superior de la suscripción
```

El sitio público y el panel tienen entradas independientes: `index.html` carga `js/app.js`, mientras que `admin.html` carga `js/admin/appAdmin.js`. Los componentes, estilos, eventos y vistas propios del panel están agrupados en sus respectivas carpetas `admin/`.

La vista `pages/inicio.html` presenta el hero de la biblioteca con texto y botones superpuestos. “Explorar catálogo” navega al catálogo; “Ver los más vendidos” navega al catálogo y desplaza la vista hasta `#catalogo-mas-pedidos`. La sección de portadas conserva sus grupos decorativos de mariposas y la cita incluye el nombre de Gabriel García Márquez bajo su retrato.

La vista `pages/catalogo.html` contiene diez productos base en su HTML, sus portadas SVG, filtros por texto, categoría, región y precio, paginación, carrusel semanal y formulario de suscripción. `js/catalogo.js` aplica los filtros, muestra productos nuevos guardados y aplica los ajustes persistidos para las tarjetas base. El formulario de suscripción envía el correo a Formspree con `fetch()`, mantiene al lector en la página y limpia el campo después de un envío exitoso. El navbar y el footer se cargan desde `components/` en el shell público.

---

## ¿Cómo Funciona Cada Parte?

### 1. Shells (`index.html` y `admin.html`)
Son los documentos HTML completos que carga el navegador. El sitio público usa `index.html`; el panel usa `admin.html`. El shell público contiene:
- Las etiquetas estructurales `<head>` (metadatos, fuentes tipográficas, Bootstrap 5 y estilos locales).
- Tres contenedores vacíos con identificador:
  ```html
  <header id="navbar"></header>
  <main id="main"></main>
  <footer id="footer"></footer>
  ```
- La carga del script principal como módulo:
  ```html
  <script type="module" src="./js/app.js"></script>
  ```

---

### 2. Componentes Reutilizables (`components/`)
Archivos HTML parciales (sin `<html>`, `<head>` ni `<body>`):
- **`nav.html`**: Contiene la etiqueta `<header>` interna con el logo, enlaces y botones de sesión. Cada enlace que apunta a una página interna lleva un atributo identificador:
  ```html
  <a class="nav-link" href="index.html" data-page="contactanos">Contáctanos</a>
  ```
- **`footer.html`**: Contiene la sección con columnas de navegación, información legal, enlaces a redes sociales y derechos reservados.

---

### 3. Vistas Parciales (`pages/`)
Son fragmentos HTML puros que contienen únicamente las secciones que van dentro de `<main>`:
- **`inicio.html`**: Portada principal (Home) con la imagen de la biblioteca histórica.
- **`nosotros.html`**: Hero, ¿Quiénes somos?, ¿Qué ofrecemos?, ¿Cómo funciona?, Misión y Visión, FAQ (acordeón Bootstrap) y sección del Equipo Coudex.
- **`contactanos.html`**: Formulario integrado con Formspree y tarjetas de canales de contacto directo.

> **Regla clave:** Ningún archivo dentro de `pages/` debe incluir `<head>`, `navbar`, `footer` ni etiquetas `<script>`. Solo contienen las secciones (`<section>`, `<div>`, etc.) de su contenido visual.

---

### 4. Capa Lógica (`js/`)

Organizada en tres módulos conectados mediante `import` y `export`:

#### A. `loadContent.js` (Carga dinámica e inyección)
- `loadFragment(url, selector)`: Realiza una petición `fetch(url)` al archivo HTML y asigna el texto resultante a `document.querySelector(selector).innerHTML`.
- `loadPage(page)`: Invoca a `loadFragment` para insertar la vista solicitada dentro de `#main` y actualiza la clase `.active` en el menú.
- `setActiveNav(page)`: Enciende la clase `.active` en el enlace del menú correspondiente a la página activa.

#### B. `eventos.js` (Interactividad y formularios)
- `initFormContacto()`: Detecta si existe el formulario `#form-contacto` en el DOM actual, aplica la validación visual de Bootstrap y gestiona el envío asíncrono hacia la API de Formspree con respuesta de éxito o error.
- `initNavCollapseOnClick()`: En pantallas móviles, cierra automáticamente el menú desplegable de Bootstrap cuando el usuario hace clic en cualquiera de los enlaces de navegación.

#### C. `app.js` (Orquestador y enrutador SPA)
Es el punto de entrada que ejecuta el siguiente ciclo de vida:

1. **Carga inicial:** En paralelo, inyecta el `nav.html` en `#navbar` y el `footer.html` en `#footer`.
2. **Detección de ruta inicial:** Revisa si la URL trae un parámetro `?page=contactanos` o un hash `#contactanos`. Si no hay ninguno, carga la página por defecto (`inicio`).
3. **Interceptación de enlaces (Navegación SPA):** Escucha clics en elementos con `[data-page]`. Al hacer clic, cancela la recarga de página tradicional (`e.preventDefault()`), inyecta el nuevo contenido en `#main`, actualiza la URL con `history.pushState()` y vuelve a inicializar los eventos necesarios, incluidos `initFormContacto()` e `initCatalogo()`.
4. **Soporte de botones Atrás/Adelante:** Escucha el evento `window.addEventListener('popstate')` para que el usuario pueda volver o avanzar en el navegador sin perder el estado.

#### D. `carrito.js` y conexión de productos
- `agregarAlCarrito(producto)`: agrega un producto o aumenta su cantidad, guarda el estado en `localStorage` y actualiza el panel.
- `initCarrito()`: registra una sola delegación de clics en el documento para los botones del catálogo (`.catalogo-producto-compra button`) y de Inicio (`.inicio-btn-carrito`). Así los botones siguen conectados aunque la vista cambie mediante navegación SPA.
- Las tarjetas de Inicio declaran los mismos identificadores y metadatos de producto que el catálogo. Un libro agregado desde cualquiera de las dos vistas se reconoce como el mismo producto.
- `catalogo.js` se ocupa de los filtros, la paginación y los carruseles del catálogo; la lógica compartida para añadir al carrito reside en `carrito.js`.

#### E. `inicio.js` y estilos responsivos
- `inicio.js` conecta las flechas del carrusel de testimonios cuando existe en la vista actual.
- `styles.css` define el hero, sus controles, las secciones de Inicio y el panel lateral del carrito.
- `responsive.css` adapta el hero a una altura suficiente en móvil y reserva espacio para los encabezados de Inicio y Catálogo bajo la navegación fija.

---

## Diagrama del Flujo de Ejecución

```text
[El usuario abre index.html en Live Server]
                 │
                 ▼
         Se ejecuta js/app.js
                 │
                 ├──▶ Inyecta components/nav.html   ──▶ <header id="navbar">
                 ├──▶ Inyecta components/footer.html──▶ <footer id="footer">
                 │
                 ▼
     ¿Qué página solicita la URL?
    (ej: ?page=contactanos o por defecto 'inicio')
                 │
                 ▼
     loadPage('pages/nombre.html')
                 │
                 ├──▶ Inyecta contenido HTML ──▶ <main id="main">
                 ├──▶ Actualiza botón .active en el Navbar
                 └──▶ Ejecuta initFormContacto(), initCatalogo() y otros eventos
```

---

## Guía para el Equipo: ¿Cómo Agregar una Nueva Página?

Si el equipo desea crear una nueva sección:

1. **Crear la vista parcial:**
   - Crear el archivo `pages/nueva.html`.
   - Escribir únicamente el contenido de la vista (por ejemplo, `<section>...</section>`).

2. **Registrar la página en `js/app.js`:**
   - Abrir `js/app.js` y agregar la ruta al diccionario `PAGES`:
     ```javascript
     const PAGES = {
       inicio:      'inicio',
       catalogo:    'catalogo',
       nosotros:    'nosotros',
       contactanos: 'contactanos',
       nueva:       'nueva',
     };
     ```

3. **Vincular el enlace en el Navbar (`components/nav.html`):**
   - Agregar o actualizar un enlace en `components/nav.html` con el atributo `data-page`:
     ```html
     <li class="nav-item">
         <a class="nav-link" href="index.html" data-page="nueva">
             Nueva pagina
         </a>
     </li>
     ```

¡Listo! La navegación del sitio público cargará la nueva vista mediante su enrutador SPA.

---

## Panel de administración

El panel se abre desde `admin.html?page=panelAdmin` y tiene su propio shell, carga de vistas y estilos:

- **`admin.html`**: documento HTML principal del panel. Define los contenedores `#admin-header`, `#admin-sidebar` y `#main`.
- **`components/admin/`**: contiene el header y el sidebar que se inyectan en el shell.
- **`pages/admin/panelAdmin.html`**: vista con el formulario y el listado de libros.
- **`js/admin/appAdmin.js`**: carga los componentes, la página inicial y registra navegación e historial.
- **`js/admin/loadContentAdmin.js`**: carga fragmentos y páginas parciales mediante `fetch()`.
- **`js/admin/eventosAdmin.js`**: lee los productos base del HTML del catálogo, combina sus ajustes con los productos nuevos, gestiona búsquedas, paginación, regiones, vista previa, altas, ediciones y eliminaciones, y conserva la salida JSON en consola.
- **`js/productosStorage.js`**: comparte las funciones de lectura y escritura de productos nuevos y de ajustes para productos base.
- **`css/admin/`**: contiene los estilos base y responsivos del panel.

El HTML del catálogo es la fuente de los diez productos base. Al abrirse, el panel los lee con `fetch()` y `DOMParser`; los cambios y eliminaciones se guardan en `localStorage` como ajustes sin reescribir las tarjetas del HTML. Los productos nuevos se guardan por separado. El catálogo aplica esos ajustes cuando carga, y la consola del navegador muestra el JSON combinado de productos base y guardados. La tabla administra diez productos por página y permite editar categoría, región, descripción, precio, stock e imagen. Las imágenes cargadas desde el panel se almacenan como Data URL. Esta persistencia es local al navegador y no usa una base de datos.

Las claves compartidas son `ratonBiblioteca_productos` para productos creados desde el panel y `ratonBiblioteca_ajustesCatalogo` para cambios y eliminaciones de los productos base.

Para verlo en local, inicia Live Server desde la raíz del proyecto y abre `admin.html?page=panelAdmin`.

---

## ¿Por qué se debe usar Live Server para ver el proyecto?

Los navegadores modernos aplican una política de seguridad que **bloquea las peticiones `fetch()` locales** y los **módulos de JavaScript (`type="module"`)** si el archivo se abre directamente con doble clic (es decir, bajo el protocolo `file:///C:/...`).

Al usar **Live Server** en VS Code, los archivos se transmiten a través de un protocolo HTTP local (`http://127.0.0.1:5500`), permitiendo que `fetch()` lea los archivos `.html` de las carpetas `components/` y `pages/` de forma segura y correcta.

