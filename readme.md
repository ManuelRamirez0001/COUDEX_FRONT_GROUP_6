# 📚 Ratón de Biblioteca

> **Las historias de Colombia, más cerca de quienes quieren leerlas.**

Ratón de Biblioteca es una propuesta de plataforma digital para descubrir y acercarse a la literatura colombiana. El proyecto busca dar visibilidad a autores nacionales y crear un punto de encuentro entre lectores, librerías independientes y vendedores de libros.

[🌐 Ver demo en GitHub Pages](https://manuelramirez0001.github.io/COUDEX_FRONT_GROUP_6/) · [🗂️ Tablero del proyecto](https://trello.com/invite/b/6ad28a525dfde1bd84766eec/ATTI06130e6fe041b420939a95eed1fbc315E6FB0ECD/coudex-proyecto)

---

## ✨ ¿Qué encontrarás?

- **Una presentación del proyecto:** propósito, historia, misión y visión.
- **Un diseño adaptable:** páginas maquetadas para distintos tamaños de pantalla.
- **Una identidad visual cálida:** tonos café y crema, tipografías editoriales e ilustraciones propias.
- **Una página de contacto:** formulario con validación y envío mediante Formspree.
- **Una experiencia interactiva:** navegación adaptable, acordeón de preguntas frecuentes y componentes de Bootstrap.
- **Una mirada al equipo:** presentación de Coudex y del proyecto integrador de Generation.

> **Alcance de esta entrega:** este repositorio contiene el sitio frontend. El catálogo, el carrito, el registro, el inicio de sesión y el panel administrativo aparecen como parte de la propuesta, pero no tienen una implementación funcional en estos archivos.

## 🖥️ Tecnologías

| Tecnología | Uso en el proyecto |
| --- | --- |
| HTML5 | Estructura del shell y fragmentos de página |
| CSS3 | Estilos, paleta visual y ajustes responsivos |
| JavaScript (ES Modules) | Navegación SPA, carga dinámica y formulario |
| Bootstrap 5.3.3 | Sistema de diseño, navegación y componentes |
| Bootstrap Icons | Iconografía |
| Formspree | Recepción de mensajes del formulario |

Bootstrap, Bootstrap Icons y las fuentes tipográficas se cargan desde servicios externos; se requiere conexión a internet para verlos correctamente.

## 📁 Estructura

```text
COUDEX_FRONT_GROUP_6/
├── index.html                 # Shell principal (header, main, footer vacíos + scripts)
├── readme.md                  # Descripción general del proyecto
├── README_ARQUITECTURA.md     # Guía detallada de la nueva arquitectura modular SPA
├── css/
│   └── styles.css             # Estilos globales
├── js/
│   ├── app.js                 # Punto de entrada ES Module — orquesta todo el arranque
│   ├── loadContent.js         # fetch + inyección de components/ y pages/ en el DOM
│   └── eventos.js             # Formulario de contacto, cierre del menú móvil, listeners
├── components/
│   ├── nav.html               # Navbar reutilizable (sin <html>/<head>)
│   └── footer.html            # Footer reutilizable (sin <html>/<head>)
├── pages/
│   ├── nosotros.html          # Hero, ¿Quiénes somos?, FAQ, Equipo (sin nav/footer)
│   └── contactanos.html       # Formulario y canales de contacto (sin nav/footer)
└── img/                       # Imágenes, íconos y fotografías
```

## 🚀 Cómo verlo localmente

1. Descarga o clona este repositorio.
2. Abre `index.html` en un navegador.
3. Para consultar el formulario, navega a **Contáctanos** o abre `contactanos.html`.

No se requiere instalar dependencias ni ejecutar un proceso de compilación para esta versión estática.

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
