const CLAVE_CARRITO = 'carritoBiblioteca';
let carrito = cargarCarrito();

function cargarCarrito() {
    try {
        const datos = JSON.parse(
            localStorage.getItem(CLAVE_CARRITO)
        );

        return Array.isArray(datos) ? datos : [];

    } catch (error) {
        console.error('Error recuperando carrito:', error);
        return [];
    }
}

function guardarCarrito() {
    localStorage.setItem(
        CLAVE_CARRITO,
        JSON.stringify(carrito)
    );
}


export function actualizarVistaCarrito() {

    // Actualizar productos del Offcanvas
    renderizarCarrito();

    // Actualizar contador del carrito (si existe)
    const contador = document.querySelector('#contador-carrito');

    if (contador) {

        const cantidadTotal = carrito.reduce(
            (total, producto) => total + producto.cantidad,
            0
        );

        contador.textContent = cantidadTotal;

        contador.classList.toggle(
            'd-none',
            cantidadTotal === 0
        );
    }
}


export function agregarAlCarrito(producto) {

    if (!producto || !producto.id) return;

    const existente = carrito.find(
        item => item.id === producto.id
    );

    if (existente) {

        existente.cantidad++;

    } else {

        carrito.push({
            ...producto,
            cantidad: 1
        });
    }

    guardarCarrito();
    renderizarCarrito();
}


export function obtenerCarrito() {
    return carrito;
}


export function eliminarDelCarrito(id) {

    carrito = carrito.filter(
        producto => producto.id !== id
    );

    guardarCarrito();
    renderizarCarrito();
}


export function vaciarCarrito() {

    carrito = [];

    guardarCarrito();
    renderizarCarrito();
}

export function actualizarCantidad(id, cantidad) {

    const producto = carrito.find(
        item => item.id === id
    );

    if (!producto) return;

    if (cantidad <= 0) {
        eliminarDelCarrito(id);
        return;
    }

    producto.cantidad = cantidad;

    guardarCarrito();
    renderizarCarrito();
}


export function renderizarCarrito() {

    const lista = document.querySelector('#lista-carrito');

    if (!lista) return;

    lista.replaceChildren();

    if (carrito.length === 0) {

        const mensaje = document.createElement('li');

        mensaje.textContent = 'Tu carrito está vacío.';

        mensaje.className = 'text-center text-muted py-4';

        lista.appendChild(mensaje);

        return;
    }

    carrito.forEach(producto => {

        const elemento = document.createElement('li');

        elemento.className = 'd-flex gap-3 align-items-center border-bottom py-3';

        const imagen = document.createElement('img');

        imagen.src = producto.imagen || '';
        imagen.alt = producto.nombre;
        imagen.width = 65;
        imagen.height = 85;
        imagen.style.objectFit = 'contain';

        const informacion = document.createElement('div');

        informacion.className = 'flex-grow-1';

        const nombre = document.createElement('h3');

        nombre.className = 'h6 mb-1';
        nombre.textContent = producto.nombre;

        const autor = document.createElement('p');

        autor.className = 'small text-muted mb-1';
        autor.textContent = producto.autor || '';

        const precio = document.createElement('p');

        precio.className = 'mb-1 fw-bold';

        precio.textContent =
            `$${producto.precio.toLocaleString('es-CO')}`;

        const cantidad = document.createElement('p');

        cantidad.className = 'small mb-1';

        cantidad.textContent =
            `Cantidad: ${producto.cantidad}`;

        const eliminar = document.createElement('button');

        eliminar.type = 'button';
        eliminar.className = 'btn btn-sm btn-outline-danger';
        eliminar.textContent = 'Eliminar';

        eliminar.addEventListener('click', () => {
            eliminarDelCarrito(producto.id);
        });

        informacion.append(
            nombre,
            autor,
            precio,
            cantidad,
            eliminar
        );

        elemento.append(imagen, informacion);

        lista.appendChild(elemento);

    });

    // Total de la compra
    const total = carrito.reduce(
        (suma, producto) =>
            suma + producto.precio * producto.cantidad,
        0
    );

    const resumen = document.createElement('li');

    resumen.className = 'border-top pt-3 mt-3 fw-bold';

    resumen.textContent =
        `Total: $${total.toLocaleString('es-CO')}`;

    lista.appendChild(resumen);
}

export function initCarrito() {

    const botonVaciar = document.querySelector('#btn-vaciar');

    if (botonVaciar) {
        botonVaciar.addEventListener('click', vaciarCarrito);
    }

    renderizarCarrito();
}


export function mostrarModal(){
    const panelCarrito = document.getElementById("panelCarrito");
    
    const botonesAbrirCarrito = document.querySelectorAll(".carrito-icono, .resumen-carrito");
    botonesAbrirCarrito.forEach((elemento) => {
        elemento.addEventListener("click", () => {
            if (panelCarrito) {
                bootstrap.Offcanvas.getOrCreateInstance(panelCarrito).show();
            }
        });
    });
}

//se volvera a clase esta sección
// export class Carro{
//     productos;
//     constructor(productos){
//         this.productos=productos;
//     }
//     agregarProductos(){
//         return productos
//     }
    
//     editarProductos(){
//         return productos
//     }

//     elimarProductos(){
//         return productos
//     }
//     guardarProductos(){
//         //en esta parte cargamos al localStorage 
//     }
//     cargarProductos(){
//         //aqui llamamos los productos para que carguen nuevamente 
//     }
// }