    const CLAVE_CARRITO = 'carritoBiblioteca';
    let carrito = cargarCarrito();
    let manejadorBotonesCarritoConectado = false;

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

    export function pintarCarrito(pintar = true) {

    const iconos = document.querySelectorAll('.resumen-carrito');

        iconos.forEach(icono => {

            icono.classList.toggle('pintar', pintar);
            icono.classList.toggle('despintar', !pintar);

        });
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

        pintarCarrito(true);

        actualizarVistaCarrito();
    }


    export function obtenerCarrito() {
        return carrito;
    }


   export function eliminarDelCarrito(id) {

        carrito = carrito.filter(
            producto => producto.id !== id
        );

        guardarCarrito();

        if (carrito.length === 0) {
            pintarCarrito(false);
        }

        actualizarVistaCarrito();
    }
    export function vaciarCarrito() {

        carrito = [];

        guardarCarrito();

        pintarCarrito(false);

        actualizarVistaCarrito();
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

        actualizarVistaCarrito();
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

            pintarCarrito(false);

            return;
        }

        carrito.forEach(producto => {

            const elemento = document.createElement('li');

            elemento.className =
                'd-flex gap-3 align-items-center border-bottom py-3';

            // Imagen
            const imagen = document.createElement('img');

            imagen.src = producto.imagen || '';
            imagen.alt = producto.nombre;
            imagen.width = 65;
            imagen.height = 85;
            imagen.style.objectFit = 'contain';

            // Información
            const informacion = document.createElement('div');

            informacion.className = 'flex-grow-1';

            // Nombre
            const nombre = document.createElement('h3');

            nombre.className = 'h6 mb-1';
            nombre.textContent = producto.nombre;

            // Autor
            const autor = document.createElement('p');

            autor.className = 'small text-muted mb-1';
            autor.textContent = producto.autor || '';

            // Precio
            const precio = document.createElement('p');

            precio.className = 'mb-1 fw-bold';

            precio.textContent =
                `$${producto.precio.toLocaleString('es-CO')}`;

            // Contenedor de botones
            const controles = document.createElement('div');

            controles.className =
                'd-flex align-items-center gap-2 mt-2';

            // Botón restar
            const restar = document.createElement('button');

            restar.type = 'button';
            restar.className = 'btn btn-sm btn-outline-secondary';
            restar.textContent = '-';

            restar.addEventListener('click', () => {

                actualizarCantidad(
                    producto.id,
                    producto.cantidad - 1
                );

            });

            // Cantidad
            const cantidad = document.createElement('span');

            cantidad.className = 'fw-bold';

            cantidad.textContent = producto.cantidad;

            // Botón sumar
            const sumar = document.createElement('button');

            sumar.type = 'button';
            sumar.className = 'btn btn-sm btn-outline-secondary';
            sumar.textContent = '+';

            sumar.addEventListener('click', () => {

                actualizarCantidad(
                    producto.id,
                    producto.cantidad + 1
                );

            });

            // Botón eliminar
            const eliminar = document.createElement('button');

            eliminar.type = 'button';
            eliminar.className = 'btn btn-sm btn-outline-danger';

            eliminar.textContent = 'Eliminar';

            eliminar.addEventListener('click', () => {

                eliminarDelCarrito(producto.id);

            });

            controles.append(
                restar,
                cantidad,
                sumar,
                eliminar
            );

            informacion.append(
                nombre,
                autor,
                precio,
                controles
            );

            elemento.append(
                imagen,
                informacion
            );

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

        // Botón comprar
        const contenedorCompra = document.createElement('li');

        contenedorCompra.className = 'list-unstyled mt-3';

        const comprar = document.createElement('button');

        comprar.type = 'button';
        comprar.className = 'btn btn-success w-100';

        comprar.textContent = 'Comprar';

        comprar.addEventListener('click', () => {

            alert('Compra realizada.');

            vaciarCarrito();

        });

        contenedorCompra.appendChild(comprar);

        lista.appendChild(contenedorCompra);
    }

    export function initCarrito() {
        if (!manejadorBotonesCarritoConectado) {
            document.addEventListener('click', (evento) => {
                const boton = evento.target.closest(
                    '.catalogo-producto-compra button, .inicio-btn-carrito'
                );
                if (!boton) return;

                const tarjeta = boton.closest(
                    '.catalogo-producto-card[data-id], .inicio-popular[data-id]'
                );
                if (!tarjeta) return;

                agregarAlCarrito({
                    id: tarjeta.dataset.id,
                    nombre: tarjeta.dataset.nombre,
                    autor: tarjeta.dataset.autor,
                    precio: Number(tarjeta.dataset.precio),
                    categoria: tarjeta.dataset.categorias,
                    region: tarjeta.dataset.region,
                    imagen: tarjeta.querySelector('img')?.getAttribute('src') || ''
                });
            });
            manejadorBotonesCarritoConectado = true;
        }

        const botonVaciar = document.getElementById("btn-vaciar");

        botonVaciar.addEventListener("click",()=>{vaciarCarrito()})

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
