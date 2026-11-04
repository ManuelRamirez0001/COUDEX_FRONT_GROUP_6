/**
 * loadContentAdmin.js
 * Carga dinamica de componentes (header, sidebar) y paginas del administrador.
 */

/**
 * Inyecta el HTML de un archivo en un elemento del DOM.
 * @param {string} url - Ruta al archivo HTML parcial.
 * @param {string} selector - Selector CSS del contenedor destino.
 */
export async function loadFragmentAdmin(url, selector) {
    const el = document.querySelector(selector);
    if (!el) return;

    try {
        const res = await fetch(url);
        if (!res.ok) throw new Error(`No se pudo cargar ${url} (${res.status})`);
        el.innerHTML = await res.text();
    } catch (err) {
        console.error('[loadContentAdmin]', err);
    }
}

/**
 * Carga una pagina parcial en #main y actualiza el estado de navegacion activo.
 * @param {string} page - Nombre de la pagina sin extension (ej. "panelAdmin").
 */
export async function loadPageAdmin(page) {
    await loadFragmentAdmin(`./pages/admin/${page}.html`, '#main');
    setActiveNavAdmin(page);
}

/**
 * Marca el enlace de navegacion correspondiente a la pagina actual como activo.
 * @param {string} page
 */
export function setActiveNavAdmin(page) {
    document.querySelectorAll('[data-page]').forEach(link => {
        link.classList.toggle('active', link.dataset.page === page);
    });
}