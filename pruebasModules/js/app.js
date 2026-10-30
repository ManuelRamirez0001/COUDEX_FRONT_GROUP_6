import { loadContent } from "./loadContent.js";

async function initApp() {

    await Promise.all([
        loadContent("#navbar", "/components/nav.html"),
        loadContent("#footer", "/components/footer.html")
    ]);

}
window.onload=function(){initApp()}
