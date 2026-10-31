# 🏗️ Guía de Arquitectura y Nueva Estructuración

Este documento explica en detalle el funcionamiento técnico de la nueva arquitectura modular del proyecto **Ratón de Biblioteca / Coudex**.

---

## 🎯 Objetivo de la Reestructuración

Anteriormente, el proyecto tenía una **estructura plana y monolítica**, donde cada página (`index.html`, `contactanos.html`) repetía código idéntico del Navbar, Footer, estilos y scripts. 

Con la **nueva estructura modular**:
1. **DRY (Don't Repeat Yourself):** El menú de navegación y el footer se editan en un solo lugar (`components/`).
2. **Arquitectura SPA (Single Page Application):** La navegación entre páginas no recarga el navegador completo; solo se reemplaza el contenido del `<main id="main">`.
3. **Separación de responsabilidades:** Separación clara entre vista (`pages/`, `components/`), diseño (`css/`) y lógica (`js/`).
4. **Módulos nativos (ES Modules):** Código JavaScript ordenado por funciones específicas, sin variables globales en conflicto.

---

## 📁 Mapa del Proyecto y Responsabilidades

```text
COUDEX_FRONT_GROUP_6/
│
├── index.html                 # 1. Shell Principal (marco general)
├── readme.md                  # Documentación general del repositorio
├── README_ARQUITECTURA.md     # Esta guía técnica de arquitectura
│
├── css/
│   ├── styles.css             # 2. Estilos globales centralizados y diseño base
│   └── responsive.css         # Media queries ordenados por breakpoints (móvil, tablet, escritorio)
│
├── components/                # 3. Fragmentos reutilizables
│   ├── nav.html               # Barra de navegación compartida
│   └── footer.html            # Pie de página compartido
│
├── pages/                     # 4. Vistas/Páginas internas (solo <section>)
│   ├── inicio.html            # Vista principal (Home con imagen de biblioteca)
│   ├── nosotros.html          # Vista de presentación/propuesta/equipo/FAQ
│   └── contactanos.html       # Vista del formulario y canales de atención
│
├── js/                        # 5. Capa lógica en JavaScript ES Modules
│   ├── app.js                 # Orquestador principal y enrutador SPA
│   ├── loadContent.js         # Funciones fetch() para inyectar HTML en el DOM
│   └── eventos.js             # Validaciones (Formspree) y eventos de UI
│
└── img/                       # Recursos visuales (imágenes, SVGs, íconos)
```

---

## ⚙️ ¿Cómo Funciona Cada Parte?

### 1. El Shell (`index.html`)
Es el único archivo HTML completo que carga el navegador. Solo contiene:
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

> 💡 **Regla clave:** Ningún archivo dentro de `pages/` debe incluir `<head>`, `navbar`, `footer` ni etiquetas `<script>`. Solo contienen las secciones (`<section>`, `<div>`, etc.) de su contenido visual.

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
2. **Detección de ruta inicial:** Revisa si la URL trae un parámetro `?page=contactanos` o un hash `#contactanos`. Si no hay ninguno, carga la página por defecto (`nosotros`).
3. **Interceptación de enlaces (Navegación SPA):** Escucha clics en elementos con `[data-page]`. Al hacer clic, cancela la recarga de página tradicional (`e.preventDefault()`), inyecta el nuevo contenido en `#main`, actualiza la URL con `history.pushState()` y vuelve a inicializar los eventos necesarios (`initFormContacto()`).
4. **Soporte de botones Atrás/Adelante:** Escucha el evento `window.addEventListener('popstate')` para que el usuario pueda volver o avanzar en el navegador sin perder el estado.

---

## 🔄 Diagrama del Flujo de Ejecución

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
    (ej: ?page=contactanos o por defecto 'nosotros')
                 │
                 ▼
     loadPage('pages/nombre.html')
                 │
                 ├──▶ Inyecta contenido HTML ──▶ <main id="main">
                 ├──▶ Actualiza botón .active en el Navbar
                 └──▶ Ejecuta initFormContacto() / eventos necesarios
```

---

## 🛠️ Guía para el Equipo: ¿Cómo Agregar una Nueva Página?

Si el equipo desea crear una nueva sección (por ejemplo, el **Catálogo** de libros):

1. **Crear la vista parcial:**
   - Crear el archivo `pages/catalogo.html`.
   - Escribir únicamente las secciones del catálogo (ej. `<section class="container-xxl py-5">...</section>`).

2. **Registrar la página en `js/app.js`:**
   - Abrir `js/app.js` y agregar el nombre al diccionario `PAGES`:
     ```javascript
     const PAGES = {
       inicio:      'nosotros',
       nosotros:    'nosotros',
       contactanos: 'contactanos',
       catalogo:    'catalogo', // 👈 Nueva entrada
     };
     ```

3. **Vincular el enlace en el Navbar (`components/nav.html`):**
   - Actualizar el enlace del catálogo para incluir el atributo `data-page="catalogo"`:
     ```html
     <li class="nav-item">
         <a class="nav-link" href="index.html" data-page="catalogo">
             <i class="bi bi-book me-1"></i>Catálogo
         </a>
     </li>
     ```

¡Listo! No se requiere tocar ningún otro archivo; la navegación funcionará automáticamente.

---

## ⚠️ ¿Por qué se debe usar Live Server para ver el proyecto?

Los navegadores modernos aplican una política de seguridad que **bloquea las peticiones `fetch()` locales** y los **módulos de JavaScript (`type="module"`)** si el archivo se abre directamente con doble clic (es decir, bajo el protocolo `file:///C:/...`).

Al usar **Live Server** en VS Code, los archivos se transmiten a través de un protocolo HTTP local (`http://127.0.0.1:5500`), permitiendo que `fetch()` lea los archivos `.html` de las carpetas `components/` y `pages/` de forma segura y correcta.

