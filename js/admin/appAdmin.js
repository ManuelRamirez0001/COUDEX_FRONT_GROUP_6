/**
 * appAdmin.js - Punto de entrada del administrador
 *
 * Orden de arranque:
 * 1. Carga el header y el sidebar.
 * 2. Lee la pagina inicial desde la URL.
 * 3. Carga la pagina correspondiente en #main.
 * 4. Registra los eventos de navegacion SPA.
 * 5. Maneja el historial del navegador.
 */

import { loadFragmentAdmin, loadPageAdmin } from './loadContentAdmin.js';
import { inicializarFormularioLibros } from "./eventosAdmin.js";

/** paginas disponibles */
const PAGES = {
    panelAdmin: 'panelAdmin'
};

const DEFAULT_PAGE = 'panelAdmin';

/**
 * Devuelve el nombre de la pagina solicitada en la URL.
 * Soporta ?page=panelAdmin y el hash #panelAdmin.
 */
function getRequestedPage() {
    const params = new URLSearchParams(location.search);
    const fromQuery = params.get('page');
    if (fromQuery && PAGES[fromQuery]) return fromQuery;

    const fromHash = location.hash.replace('#', '');
    if (fromHash && PAGES[fromHash]) return fromHash;

    return DEFAULT_PAGE;
}

/**
 * Navega a una pagina SPA.
 */
async function navigateTo(page) {
    if (!PAGES[page]) page = DEFAULT_PAGE;

    await loadPageAdmin(PAGES[page]);
    inicializarFormularioLibros();
    history.pushState({ page }, '', `?page=${page}`);
}

/**
 * Maneja los clics en los enlaces del sidebar.
 */
function initNavLinks() {
    document.addEventListener('click', async (e) => {
        const link = e.target.closest('[data-page]');
        if (!link) return;

        const page = link.dataset.page;
        if (!page || !PAGES[page]) return;

        e.preventDefault();
        await navigateTo(page);
    });
}

/**
 * Maneja los botones atras y adelante del navegador.
 */
window.addEventListener('popstate', async (e) => {
    const page = e.state?.page ?? getRequestedPage();
    await loadPageAdmin(PAGES[page] ?? DEFAULT_PAGE);
    inicializarFormularioLibros();
});

/** inicio del administrador */
(async () => {
    // cargar componentes compartidos
    await Promise.all([
        loadFragmentAdmin('./components/admin/header.html', '#admin-header'),
        loadFragmentAdmin('./components/admin/sidebar.html', '#admin-sidebar'),
    ]);

    // cargar pagina inicial
    const startPage = getRequestedPage();
    await loadPageAdmin(PAGES[startPage] ?? DEFAULT_PAGE);
    inicializarFormularioLibros();

    // registrar eventos de navegacion
    initNavLinks();
})();