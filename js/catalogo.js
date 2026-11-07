import { obtenerProductosGuardados } from './productosStorage.js';

function crearTarjetaProducto(producto) {
    const tarjeta = document.createElement('article');
    tarjeta.className = 'catalogo-libro-card';

    if (producto.imagen) {
        const imagen = document.createElement('img');
        imagen.className = 'catalogo-libro-portada';
        imagen.src = producto.imagen;
        imagen.alt = `Portada de ${producto.nombre}`;
        imagen.loading = 'lazy';
        tarjeta.appendChild(imagen);
    } else {
        const portadaVacia = document.createElement('div');
        portadaVacia.className = 'catalogo-libro-portada catalogo-libro-portada-placeholder';

        const icono = document.createElement('i');
        icono.className = 'bi bi-book-half';
        icono.setAttribute('aria-hidden', 'true');
        portadaVacia.appendChild(icono);
        tarjeta.appendChild(portadaVacia);
    }

    const informacion = document.createElement('div');
    informacion.className = 'catalogo-libro-info';

    const categoria = document.createElement('span');
    categoria.textContent = producto.categoria;

    const titulo = document.createElement('h3');
    titulo.textContent = producto.nombre;

    const descripcion = document.createElement('p');
    descripcion.textContent = producto.descripcion;

    const detalles = document.createElement('div');

    const precio = document.createElement('strong');
    precio.textContent = `$${Number(producto.precio).toLocaleString('es-CO')}`;

    const stock = document.createElement('small');
    stock.textContent = `Stock: ${producto.stock}`;

    detalles.append(precio, stock);
    informacion.append(categoria, titulo, descripcion, detalles);
    tarjeta.appendChild(informacion);

    return tarjeta;
}

function inicializarFiltros() {
    const panel = document.querySelector('.catalogo-filtros');
    if (!panel) return;

    const precioMinimo = panel.querySelector('#precio-minimo');
    const precioMaximo = panel.querySelector('#precio-maximo');
    const valorMinimo = panel.querySelector('#precio-minimo-valor');
    const valorMaximo = panel.querySelector('#precio-maximo-valor');
    const botonLimpiar = panel.querySelector('#limpiar-filtros');

    function actualizarValoresPrecio() {
        const minimo = Number(precioMinimo.value);
        const maximo = Number(precioMaximo.value);
        valorMinimo.value = `$${minimo.toLocaleString('es-CO')}`;
        valorMinimo.textContent = valorMinimo.value;
        valorMaximo.value = `$${maximo.toLocaleString('es-CO')}`;
        valorMaximo.textContent = valorMaximo.value;
    }

    precioMinimo.addEventListener('input', () => {
        if (Number(precioMinimo.value) >= Number(precioMaximo.value)) {
            precioMinimo.value = Number(precioMaximo.value) - Number(precioMinimo.step);
        }
        actualizarValoresPrecio();
    });

    precioMaximo.addEventListener('input', () => {
        if (Number(precioMaximo.value) <= Number(precioMinimo.value)) {
            precioMaximo.value = Number(precioMinimo.value) + Number(precioMaximo.step);
        }
        actualizarValoresPrecio();
    });

    botonLimpiar.addEventListener('click', () => {
        panel.querySelectorAll('input[type="checkbox"]').forEach((checkbox) => {
            checkbox.checked = false;
        });
        precioMinimo.value = precioMinimo.min;
        precioMaximo.value = precioMaximo.max;

        document.querySelector('#busqueda-catalogo').value = '';
        document.querySelector('#categoria-catalogo').value = '';
        actualizarValoresPrecio();
    });

    actualizarValoresPrecio();
}

export function initCatalogo() {
    const contenedor = document.querySelector('#productos-guardados');
    const seccion = document.querySelector('#seccion-productos-admin');
    if (!contenedor || !seccion) return;

    inicializarFiltros();

    const productos = obtenerProductosGuardados();
    contenedor.innerHTML = '';

    if (productos.length === 0) {
        seccion.classList.add('d-none');
        return;
    }

    productos.forEach((producto) => {
        contenedor.appendChild(crearTarjetaProducto(producto));
    });

    seccion.classList.remove('d-none');
}
