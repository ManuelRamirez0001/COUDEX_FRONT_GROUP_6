# 📚 Ratón de Biblioteca

> **Las historias de Colombia, más cerca de quienes quieren leerlas.**

Ratón de Biblioteca es una propuesta de plataforma digital para descubrir y acercarse a la literatura colombiana. El proyecto busca dar visibilidad a autores nacionales y crear un punto de encuentro entre lectores, librerías independientes y vendedores de libros.

[🌐 Ver demo en GitHub Pages](https://manuelramirez0001.github.io/COUDEX_FRONT_GROUP_6/) · [🗂️ Tablero del proyecto](https://trello.com/invite/b/6ad28a525dfde1bd84766eec/ATTI06130e6fe041b420939a95eed1fbc315E6FB0ECD/coudex-proyecto)

[🛠️ Abrir panel de administración](https://manuelramirez0001.github.io/COUDEX_FRONT_GROUP_6/admin.html?page=panelAdmin)

---

## ✨ ¿Qué encontrarás?

- **Una presentación del proyecto:** propósito, historia, misión y visión.
- **Un diseño adaptable:** páginas maquetadas para distintos tamaños de pantalla.
- **Una identidad visual cálida:** tonos café y crema, tipografías editoriales e ilustraciones propias.
- **Una página de contacto:** formulario con validación y envío mediante Formspree.
- **Un catálogo interactivo:** diez libros base con portadas, búsqueda, filtros por categoría, región y precio, paginación y carrusel de más pedidos.
- **Un panel conectado al catálogo:** permite crear productos, editar y eliminar los libros base del HTML, asignar regiones y ver una vista previa de las portadas.
- **Una experiencia interactiva:** navegación adaptable, acordeón de preguntas frecuentes y componentes de Bootstrap.
- **Una mirada al equipo:** presentación de Coudex y del proyecto integrador de Generation.

> **Alcance de esta entrega:** este repositorio contiene el frontend. El catálogo mantiene diez productos base en su HTML. El panel los carga al abrirse y permite editar o eliminar sus datos mediante ajustes en `localStorage`, sin reescribir el HTML. Los productos nuevos también se guardan en `localStorage`. El panel imprime en consola el JSON combinado, y las imágenes cargadas desde el formulario se guardan como Data URL. La información persiste solo en ese navegador y no se envía a una base de datos.

## 🖥️ Tecnologías

| Tecnología | Uso en el proyecto |
| --- | --- |
| HTML5 | Estructura del shell y fragmentos de página |
| CSS3 | Estilos, paleta visual y ajustes responsivos |
| JavaScript (ES Modules) | Navegación SPA, carga dinámica y formulario |
| Bootstrap 5.3.3 | Sistema de diseño, navegación y componentes |
| Bootstrap Icons | Iconografía |
| Formspree | Recepción de mensajes de contacto y suscripciones al parche lector |

Bootstrap, Bootstrap Icons y las fuentes tipográficas se cargan desde servicios externos; se requiere conexión a internet para verlos correctamente.

## 📁 Estructura

```text
COUDEX_FRONT_GROUP_6/
├── index.html                 # Shell principal (header, main, footer vacíos + scripts)
├── admin.html                 # Shell independiente del panel administrativo
├── readme.md                  # Descripción general del proyecto
├── README_ARQUITECTURA.md     # Guía detallada de la nueva arquitectura modular SPA
├── css/
│   ├── styles.css              # Estilos globales y diseño base
│   ├── responsive.css          # Adaptaciones responsivas del sitio
│   └── admin/
│       ├── stylesAdmin.css    # Estilos del panel administrativo
│       └── responsiveAdmin.css # Adaptaciones responsivas del panel
├── js/
│   ├── app.js                 # Punto de entrada ES Module — orquesta todo el arranque
│   ├── catalogo.js            # Filtros, paginación, carrusel y ajustes de productos
│   ├── loadContent.js         # fetch + inyección de components/ y pages/ en el DOM
│   ├── eventos.js             # Formulario de contacto y eventos del sitio
│   ├── productosStorage.js    # Productos nuevos y ajustes del catálogo en localStorage
│   └── admin/
│       ├── appAdmin.js         # Arranque y navegación del panel
│       ├── loadContentAdmin.js # Carga de fragmentos y vistas del administrador
│       └── eventosAdmin.js     # Alta, edición, baja, vista previa, paginación y JSON
├── components/
│   ├── nav.html               # Navbar del sitio
│   ├── footer.html            # Footer del sitio
│   └── admin/
│       ├── header.html         # Header del panel
│       └── sidebar.html        # Navegación lateral del panel
├── pages/
│   ├── inicio.html            # Portada principal (Home) con imagen de la biblioteca
│   ├── catalogo.html          # Catálogo, filtros, diez libros base y suscripción
│   ├── nosotros.html          # Hero, ¿Quiénes somos?, FAQ, Equipo (sin nav/footer)
│   ├── contactanos.html       # Formulario y canales de contacto (sin nav/footer)
│   └── admin/
│       └── panelAdmin.html    # Formulario y tabla de gestión de libros
└── img/
    ├── ...                     # Imágenes, íconos y fotografías del sitio
    └── vistaCatalogo/
        ├── heroCatalogo.svg    # Hero gráfico del catálogo
        ├── parche/             # Ilustraciones de categorías
        ├── libros/             # Portadas SVG del catálogo
        ├── Mariposa1.svg       # Mariposa inferior de la tarjeta de suscripción
        └── Mariposa2.svg       # Mariposa superior de la tarjeta de suscripción
```

El catálogo muestra nueve libros por página y actualiza los conteos regionales según los productos disponibles. El panel muestra diez libros por página; al agregar un producto abre la página donde queda listado. Los cambios hechos a libros base se guardan en `ratonBiblioteca_ajustesCatalogo`; los productos nuevos se guardan en `ratonBiblioteca_productos`.

## 📖 Documentación técnica

Para conocer en detalle la arquitectura del proyecto, la organización de los módulos, el funcionamiento de la navegación SPA y la carga dinámica de componentes, consulta la siguiente guía:

➡️ [**README_ARQUITECTURA.md – Guía de arquitectura**](README_ARQUITECTURA.md)

## 🚀 Cómo verlo localmente

1. Descarga o clona este repositorio.
2. Abre el proyecto con un servidor local, por ejemplo Live Server en VS Code.
3. Visita `index.html` para el sitio principal o `admin.html?page=panelAdmin` para el panel.
4. Para consultar el formulario de contacto, navega a **Contáctanos**.

Se necesita un servidor local porque el proyecto usa módulos JavaScript y `fetch()` para cargar las vistas parciales. No se requiere instalar dependencias ni ejecutar un proceso de compilación.

## 👥 Equipo Coudex

Proyecto colaborativo del **Grupo 6**, desarrollado como proyecto integrador del bootcamp intensivo de Desarrollo Web Full-Stack Java de Generation.

- Felipe Flórez
- Santiago López
- Felipe Ortiz Gamboa
- Jenssen Quintero
- Manuel Ramírez

## 🎯 Propósito

Acercar la literatura colombiana a más lectores y apoyar la visibilidad de autores nacionales, librerías pequeñas y vendedores independientes mediante una experiencia digital sencilla.

---

<p align="center"><strong>Hecho con ☕, código y amor por los libros en Colombia.</strong></p>
