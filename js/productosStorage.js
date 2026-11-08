// nombres de las claves usadas para guardar productos y ajustes del catalogo
const CLAVE_PRODUCTOS = 'ratonBiblioteca_productos';
const CLAVE_AJUSTES_CATALOGO = 'ratonBiblioteca_ajustesCatalogo';

// recupera los productos creados desde el administrador
export function obtenerProductosGuardados() {
    try {
        const productosGuardados = localStorage.getItem(CLAVE_PRODUCTOS);
        const productos = productosGuardados ? JSON.parse(productosGuardados) : [];

        return Array.isArray(productos) ? productos : [];
    } catch (error) {
        console.error('No se pudieron leer los productos guardados:', error);
        return [];
    }
}

// guarda la lista de productos nuevos o editados en localstorage
export function guardarProductos(productos) {
    localStorage.setItem(CLAVE_PRODUCTOS, JSON.stringify(productos));
}

// recupera los cambios aplicados a las tarjetas base del catalogo
export function obtenerAjustesCatalogo() {
    try {
        const ajustesGuardados = localStorage.getItem(CLAVE_AJUSTES_CATALOGO);
        const ajustes = ajustesGuardados ? JSON.parse(ajustesGuardados) : {};

        return ajustes && typeof ajustes === 'object' && !Array.isArray(ajustes) ? ajustes : {};
    } catch (error) {
        console.error('No se pudieron leer los ajustes del catálogo:', error);
        return {};
    }
}

// persiste los cambios hechos sobre los productos base del catalogo
export function guardarAjustesCatalogo(ajustes) {
    localStorage.setItem(CLAVE_AJUSTES_CATALOGO, JSON.stringify(ajustes));
}
