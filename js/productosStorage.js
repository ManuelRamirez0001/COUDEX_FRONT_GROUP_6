const CLAVE_PRODUCTOS = 'ratonBiblioteca_productos';

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

export function guardarProductos(productos) {
    localStorage.setItem(CLAVE_PRODUCTOS, JSON.stringify(productos));
}
