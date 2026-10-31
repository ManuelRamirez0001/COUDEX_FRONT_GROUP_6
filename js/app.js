/**
 * app.js — Punto de entrada (ES Module)
 *
 * Orden de arranque:
 *  1. Carga el navbar y el footer desde components/.
 *  2. Lee la página inicial desde la URL (hash o parámetro ?page=).
 *  3. Carga la página correspondiente en #main.
 *  4. Registra los listeners de navegación SPA.
 *  5. Inicializa eventos de formulario / UI.
 */

import { loadFragment, loadPage, setActiveNav } from './loadContent.js';
import { initFormContacto, initNavCollapseOnClick } from './eventos.js';

/** Páginas disponibles → archivo en pages/ */
const PAGES = {
  inicio:      'inicio',      // página principal de bienvenida con imagen de biblioteca
  nosotros:    'nosotros',    // propuesta, historia, equipo y preguntas frecuentes
  contactanos: 'contactanos', // formulario y canales de atención
};

const DEFAULT_PAGE = 'inicio';

/**
 * Devuelve el nombre de la página solicitada en la URL.
 * Soporta ?page=contactanos y el hash #contactanos.
 */
function getRequestedPage() {
  const params = new URLSearchParams(location.search);
  const fromQuery = params.get('page');
  if (fromQuery && PAGES[fromQuery]) return fromQuery;

  // También acepta el anchor hash: index.html#contactanos
  const fromHash = location.hash.replace('#', '');
  if (fromHash && PAGES[fromHash]) return fromHash;

  return DEFAULT_PAGE;
}

/**
 * Navega a una página SPA:
 *  - Carga el fragmento HTML en #main.
 *  - Actualiza la URL sin recargar.
 *  - Re-inicializa los eventos que dependen del DOM inyectado.
 */
async function navigateTo(page) {
  if (!PAGES[page]) page = DEFAULT_PAGE;
  const file = PAGES[page];
  await loadPage(file);
  history.pushState({ page }, '', `?page=${page}`);

  // Re-inicializa eventos que requieren elementos del DOM recién inyectado
  initFormContacto();
}

/** Delegación de eventos en los enlaces de navegación [data-page] */
function initNavLinks() {
  document.addEventListener('click', async (e) => {
    const link = e.target.closest('[data-page]');
    if (!link) return;
    const page = link.dataset.page;
    if (!page) return;
    e.preventDefault();
    await navigateTo(page);
  });
}

/** Manejo del botón Atrás / Adelante del navegador */
window.addEventListener('popstate', async (e) => {
  const page = e.state?.page ?? getRequestedPage();
  const file = PAGES[page] ?? DEFAULT_PAGE;
  await loadPage(file);
  initFormContacto();
});

/** ── Arranque ── */
(async () => {
  // 1. Inyectar componentes compartidos
  await Promise.all([
    loadFragment('components/nav.html',    'header#navbar'),
    loadFragment('components/footer.html', 'footer#footer'),
  ]);

  // 2. Cargar la página inicial
  const startPage = getRequestedPage();
  await loadPage(PAGES[startPage] ?? DEFAULT_PAGE);
  setActiveNav(startPage);

  // 3. Registrar listeners
  initNavLinks();
  initNavCollapseOnClick();
  initFormContacto();
})();

