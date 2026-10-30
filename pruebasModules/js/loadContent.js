export async function loadContent(selector, path) {

    const element = document.querySelector(selector);

    if (!element) {
        throw new Error(`No existe el selector ${selector}`);
    }

    const response = await fetch(path);

    if (!response.ok) {
        throw new Error(`No se pudo cargar ${path}`);
    }

    const html = await response.text();

    element.insertAdjacentHTML("beforeend", html);
}