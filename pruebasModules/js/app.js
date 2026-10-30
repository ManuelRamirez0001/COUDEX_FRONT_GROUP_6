import { loadContent } from "./loadContent.js";

export const form = document.getElementById("form-contacto");
export const aviso = document.getElementById("aviso");


const isInsidePages = window.location.pathname.includes("/pages/");

const path = isInsidePages ? "../" : "./";

async function initApp() {

    await Promise.all([
        loadContent("#navbar", `${path}components/nav.html`),
        loadContent("#footer", `${path}components/footer.html`)
    ]);

}

window.onload=function(){initApp()}
