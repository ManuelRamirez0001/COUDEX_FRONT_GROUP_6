import { guardarProductos, obtenerProductosGuardados } from '../productosStorage.js';

function leerImagenComoDataURL(archivo) {
    return new Promise((resolve, reject) => {
        const lector = new FileReader();

        lector.addEventListener('load', () => resolve(lector.result));
        lector.addEventListener('error', () => reject(lector.error));
        lector.readAsDataURL(archivo);
    });
}

function normalizarTexto(texto) {
    return String(texto)
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLocaleLowerCase('es');
}

export function inicializarFormularioLibros() {
    const tbody = document.querySelector('#tabla-libros');
    const formulario = document.querySelector('#form-libro');
    const buscador = document.querySelector('#buscar-libro');

    if (!tbody || !formulario) {
        console.error('No se encontró la tabla o el formulario de libros.');
        return;
    }

    // Productos de demostración para que el admin tenga contenido desde el inicio.
    // No se guardan en localStorage ni forman parte de los productos nuevos del catálogo.
    let datos = [
        { id: 1, nombre: 'Don Quijote de la Mancha', categoria: 'novela', descripcion: 'Novela de Miguel de Cervantes', precio: 50000, stock: 8, imagen: '' },
        { id: 2, nombre: 'El principito', categoria: 'infantil', descripcion: 'Historia poética y filosófica', precio: 25000, stock: 5, imagen: '' },
        { id: 3, nombre: 'El olvido que seremos', categoria: 'otros', descripcion: 'Obra de Héctor Abad Faciolince sobre la vida y memoria de su padre', precio: 42000, stock: 3, imagen: '' },
        { id: 4, nombre: 'La Ilíada', categoria: 'historia', descripcion: 'Poema épico atribuido a Homero', precio: 34000, stock: 10, imagen: '' },
        { id: 5, nombre: 'María', categoria: 'novela', descripcion: 'Obra de Jorge Isaacs, cumbre del romanticismo colombiano', precio: 36000, stock: 6, imagen: '' },
        { id: 6, nombre: 'La vorágine', categoria: 'novela', descripcion: 'Novela de José Eustasio Rivera ambientada en la selva amazónica', precio: 67000, stock: 9, imagen: '' },
        { id: 7, nombre: 'Delirio', categoria: 'novela', descripcion: 'Novela de Laura Restrepo galardonada con el Premio Alfaguara', precio: 67000, stock: 2, imagen: '' },
        { id: 8, nombre: 'Rosario Tijeras', categoria: 'novela', descripcion: 'Novela de Jorge Franco ambientada en el Medellín de los años 80', precio: 11000, stock: 1, imagen: '' },
        { id: 9, nombre: 'Los ejércitos', categoria: 'novela', descripcion: 'Novela de Evelio Rosero sobre la memoria y el conflicto armado', precio: 55000, stock: 4, imagen: '' },
        { id: 10, nombre: 'La casa grande', categoria: 'novela', descripcion: 'Novela de Álvaro Cepeda Samudio', precio: 12500, stock: 7, imagen: '' }
    ];

    // recupera los productos creados desde el formulario, separados de los ejemplos.
    let productosGuardados = obtenerProductosGuardados();
    let terminoBusqueda = '';
    let productoEnEdicion = null;

    const botonEnviar = formulario.querySelector('button[type="submit"]');
    const botonReset = formulario.querySelector('button[type="reset"]');
    const campoImagen = formulario.elements['imagen'];

    function obtenerProductosVisibles() {
        return [
            ...datos.map((producto) => ({ ...producto, origen: 'demo' })),
            ...productosGuardados.map((producto) => ({ ...producto, origen: 'guardado' }))
        ];
    }

    function crearBotonAccion(texto, accion, producto) {
        const boton = document.createElement('button');
        boton.type = 'button';
        boton.className = accion === 'editar'
            ? 'btn btn-outline-secondary btn-sm me-2'
            : 'btn btn-outline-danger btn-sm';
        boton.textContent = texto;
        boton.dataset.accionProducto = accion;
        boton.dataset.idProducto = producto.id;
        boton.dataset.origenProducto = producto.origen;
        return boton;
    }

    function renderizarTabla() {
        tbody.innerHTML = '';

        const consulta = normalizarTexto(terminoBusqueda.trim());
        const productosFiltrados = obtenerProductosVisibles().filter((producto) => {
            const campos = [
                producto.id,
                producto.nombre,
                producto.categoria,
                producto.descripcion,
                producto.precio,
                producto.stock
            ];

            return campos.some((campo) => normalizarTexto(campo).includes(consulta));
        });

        if (productosFiltrados.length === 0) {
            const filaVacia = document.createElement('tr');
            const celdaVacia = document.createElement('td');
            celdaVacia.colSpan = 6;
            celdaVacia.className = 'text-center text-muted py-4';
            celdaVacia.textContent = 'No se encontraron productos.';
            filaVacia.appendChild(celdaVacia);
            tbody.appendChild(filaVacia);
            return;
        }

        productosFiltrados.forEach((producto) => {
            const fila = document.createElement('tr');

            const celdaId = document.createElement('td');
            celdaId.textContent = producto.id;

            const celdaImagen = document.createElement('td');
            if (producto.imagen) {
                const imagen = document.createElement('img');
                imagen.src = producto.imagen;
                imagen.alt = `Portada de ${producto.nombre}`;
                imagen.width = 50;
                imagen.height = 65;
                imagen.style.objectFit = 'cover';
                celdaImagen.appendChild(imagen);
            } else {
                const iconoImagen = document.createElement('i');
                iconoImagen.className = 'bi bi-image';
                celdaImagen.appendChild(iconoImagen);
            }

            const celdaNombre = document.createElement('td');
            celdaNombre.textContent = producto.nombre;

            const celdaPrecio = document.createElement('td');
            celdaPrecio.textContent = `$${Number(producto.precio).toLocaleString('es-CO')}`;

            const celdaStock = document.createElement('td');
            celdaStock.textContent = producto.stock;

            const celdaAcciones = document.createElement('td');
            celdaAcciones.append(
                crearBotonAccion('Editar', 'editar', producto),
                crearBotonAccion('Eliminar', 'eliminar', producto)
            );

            fila.append(
                celdaId,
                celdaImagen,
                celdaNombre,
                celdaPrecio,
                celdaStock,
                celdaAcciones
            );

            tbody.appendChild(fila);
        });
    }

    function finalizarEdicion() {
        productoEnEdicion = null;
        botonEnviar.textContent = 'Agregar libro';
        if (botonReset) botonReset.textContent = 'Limpiar';
        campoImagen.required = true;
    }

    function iniciarEdicion(producto) {
        productoEnEdicion = { id: producto.id, origen: producto.origen };
        formulario.elements['nombreLibro'].value = producto.nombre;
        formulario.elements['categoria'].value = producto.categoria;
        formulario.elements['descripcion'].value = producto.descripcion;
        formulario.elements['precio'].value = producto.precio;
        formulario.elements['stock'].value = producto.stock;

        // el navegador no permite rellenar un input file por código.
        // si no se elige una imagen nueva, se conserva la imagen actual.
        campoImagen.value = '';
        campoImagen.required = false;
        botonEnviar.textContent = 'Actualizar libro';
        if (botonReset) botonReset.textContent = 'Cancelar edición';
        formulario.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    function eliminarProducto(producto) {
        const confirmacion = confirm(`¿Quieres eliminar "${producto.nombre}"?`);
        if (!confirmacion) return;

        if (producto.origen === 'demo') {
            datos = datos.filter((item) => item.id !== producto.id);
        } else {
            const productosActualizados = productosGuardados.filter((item) => item.id !== producto.id);
            guardarProductos(productosActualizados);
            productosGuardados = productosActualizados;
        }

        if (productoEnEdicion?.id === producto.id && productoEnEdicion?.origen === producto.origen) {
            formulario.reset();
            finalizarEdicion();
        }

        renderizarTabla();
        console.log('Lista de productos actualizada:');
        console.log(JSON.stringify(obtenerProductosVisibles(), null, 2));
    }

    renderizarTabla();
    console.log('Productos de demostración y productos guardados:');
    console.log(JSON.stringify(obtenerProductosVisibles(), null, 2));

    buscador?.addEventListener('input', (evento) => {
        terminoBusqueda = evento.target.value;
        renderizarTabla();
    });

    tbody.addEventListener('click', (evento) => {
        const boton = evento.target.closest('[data-accion-producto]');
        if (!boton) return;

        const id = Number(boton.dataset.idProducto);
        const origen = boton.dataset.origenProducto;
        const producto = obtenerProductosVisibles().find(
            (item) => Number(item.id) === id && item.origen === origen
        );

        if (!producto) return;

        if (boton.dataset.accionProducto === 'editar') {
            iniciarEdicion(producto);
        } else if (boton.dataset.accionProducto === 'eliminar') {
            try {
                eliminarProducto(producto);
            } catch (error) {
                console.error('No se pudo eliminar el producto guardado:', error);
                alert('No se pudo eliminar el producto guardado. Inténtalo de nuevo.');
            }
        }
    });

    formulario.addEventListener('reset', () => {
        finalizarEdicion();
    });

    formulario.addEventListener('submit', async (evento) => {
        evento.preventDefault();

        const valores = new FormData(formulario);
        const archivoImagen = campoImagen.files[0];

        try {
            const productoOriginal = productoEnEdicion
                ? obtenerProductosVisibles().find(
                    (item) => Number(item.id) === Number(productoEnEdicion.id)
                        && item.origen === productoEnEdicion.origen
                )
                : null;

            const nuevoProducto = {
                id: productoOriginal
                    ? productoOriginal.id
                    : obtenerProductosVisibles().reduce(
                        (mayorId, producto) => Math.max(mayorId, Number(producto.id) || 0),
                        0
                    ) + 1,
                nombre: valores.get('nombreLibro').toString().trim(),
                categoria: valores.get('categoria').toString().trim(),
                descripcion: valores.get('descripcion').toString().trim(),
                precio: Number(valores.get('precio')),
                stock: Number(valores.get('stock')),
                imagen: archivoImagen
                    ? await leerImagenComoDataURL(archivoImagen)
                    : productoOriginal?.imagen || ''
            };

            if (productoEnEdicion?.origen === 'demo') {
                datos = datos.map((producto) => (
                    producto.id === productoOriginal.id ? nuevoProducto : producto
                ));
            } else if (productoEnEdicion?.origen === 'guardado') {
                const productosActualizados = productosGuardados.map((producto) => (
                    Number(producto.id) === Number(productoOriginal.id) ? nuevoProducto : producto
                ));
                guardarProductos(productosActualizados);
                productosGuardados = productosActualizados;
            } else {
                const productosActualizados = [...productosGuardados, nuevoProducto];
                guardarProductos(productosActualizados);
                productosGuardados = productosActualizados;
            }

            renderizarTabla();
            console.log('Lista de productos actualizada:');
            console.log(JSON.stringify(obtenerProductosVisibles(), null, 2));

            formulario.reset();
        } catch (error) {
            console.error('No se pudo guardar el producto:', error);
            alert('No se pudo guardar el producto. La imagen podría ser demasiado grande para el almacenamiento del navegador.');
        }
    });
}
