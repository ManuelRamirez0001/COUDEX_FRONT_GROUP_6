/**
 * loadContent.js
 * Carga dinámica de componentes (nav, footer) y páginas en #main.
 */

/**
 * Inyecta el HTML de un archivo en un elemento del DOM.
 * @param {string} url  - Ruta al archivo HTML parcial.
 * @param {string} selector - Selector CSS del contenedor destino.
 */
export async function loadFragment(url, selector) {
  const el = document.querySelector(selector);
  if (!el) return;
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`No se pudo cargar ${url} (${res.status})`);
    el.innerHTML = await res.text();
  } catch (err) {
    console.error('[loadContent]', err);
  }
}

/**
 * Carga una página parcial en #main y actualiza el estado de navegación activo.
 * @param {string} page - Nombre de la página sin extensión (ej. "nosotros", "contactanos").
 */
export async function loadPage(page) {
  await loadFragment(`pages/${page}.html`, '#main');
  setActiveNav(page);
}

/**
 * Marca el enlace de navegación correspondiente a la página actual como activo.
 * @param {string} page
 */
export function setActiveNav(page) {
  document.querySelectorAll('[data-page]').forEach(link => {
    link.classList.toggle('active', link.dataset.page === page);
  });
}

