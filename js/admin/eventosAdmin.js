import {
    guardarAjustesCatalogo,
    guardarProductos,
    obtenerAjustesCatalogo,
    obtenerProductosGuardados
} from '../productosStorage.js';

const PRODUCTOS_POR_PAGINA = 10;

// lee las tarjetas base del html para mostrarlas en el administrador
async function cargarProductosBaseCatalogo() {
    try {
        const respuesta = await fetch('./pages/catalogo.html');
        if (!respuesta.ok) throw new Error(`No se pudo cargar el catálogo (${respuesta.status})`);
        const html = await respuesta.text();
        const documento = new DOMParser().parseFromString(html, 'text/html');

        return [...documento.querySelectorAll('.catalogo-producto-card[data-id]')].map((tarjeta) => {
            const portada = tarjeta.querySelector('.catalogo-producto-portada');
            return {
                id: tarjeta.dataset.id,
                nombre: tarjeta.dataset.nombre || tarjeta.querySelector('.catalogo-producto-info h2')?.textContent.trim() || 'Libro sin título',
                autor: tarjeta.dataset.autor || '',
                categoria: (tarjeta.dataset.categorias || 'otros').split(/\s+/)[0],
                region: tarjeta.dataset.region || '',
                descripcion: tarjeta.dataset.descripcion || '',
                precio: Number(tarjeta.dataset.precio) || 0,
                stock: tarjeta.dataset.stock === 'true' ? 1 : 0,
                imagen: portada?.getAttribute('src') || ''
            };
        });
    } catch (error) {
        console.error('No se pudieron cargar los libros base del catálogo:', error);
        return [];
    }
}

// convierte la imagen elegida en datos que se pueden guardar en localstorage
function leerImagenComoDataURL(archivo) {
    return new Promise((resolve, reject) => {
        const lector = new FileReader();

        lector.addEventListener('load', () => resolve(lector.result));
        lector.addEventListener('error', () => reject(lector.error));
        lector.readAsDataURL(archivo);
    });
}

// normaliza texto para que el buscador ignore tildes y mayusculas
function normalizarTexto(texto) {
    return String(texto)
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLocaleLowerCase('es');
}

// prepara el formulario, la tabla, las ediciones y la paginacion de libros
export async function inicializarFormularioLibros() {
    const tbody = document.querySelector('#tabla-libros');
    const formulario = document.querySelector('#form-libro');
    const buscador = document.querySelector('#buscar-libro');
    const paginacion = document.querySelector('#admin-paginas');

    if (!tbody || !formulario) {
        console.error('No se encontró la tabla o el formulario de libros.');
        return;
    }

    const datos = await cargarProductosBaseCatalogo();
    let productosGuardados = obtenerProductosGuardados();
    let ajustesCatalogo = obtenerAjustesCatalogo();
    let terminoBusqueda = '';
    let productoEnEdicion = null;
    let paginaActual = 1;

    const botonEnviar = formulario.querySelector('button[type="submit"]');
    const botonReset = formulario.querySelector('button[type="reset"]');
    const campoImagen = formulario.elements['imagen'];
    const campoDescripcion = formulario.elements['descripcion'];
    const campoRegion = formulario.elements['region'];
    const previewImagen = formulario.querySelector('#preview-imagen');

    // actualiza el cuadro con una portada o con el icono vacio
    function mostrarVistaPrevia(origen = '') {
        if (!previewImagen) return;
        previewImagen.replaceChildren();
        if (!origen) {
            const icono = document.createElement('i');
            icono.className = 'bi bi-image fs-1';
            previewImagen.appendChild(icono);
            return;
        }

        const imagen = document.createElement('img');
        imagen.src = origen;
        imagen.alt = 'Vista previa de la portada del libro';
        previewImagen.appendChild(imagen);
    }

    // combina libros base del html con productos y ajustes guardados
    function obtenerProductosVisibles() {
        return [
            ...datos
                .map((producto) => ({ ...producto, ...(ajustesCatalogo[producto.id] || {}), id: producto.id, origen: 'catalogo' }))
                .filter((producto) => !producto.eliminado),
            ...productosGuardados.map((producto) => ({ ...producto, origen: 'guardado' }))
        ];
    }

    // crea el boton de edicion o eliminacion de una fila
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

    // dibuja diez productos por pagina y genera controles segun el total
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

        const totalPaginas = Math.max(1, Math.ceil(productosFiltrados.length / PRODUCTOS_POR_PAGINA));
        paginaActual = Math.min(paginaActual, totalPaginas);
        paginacion?.replaceChildren();

        // agrega un control individual a la navegacion entre paginas
        function agregarBotonPagina(texto, pagina, { activo = false, deshabilitado = false, etiqueta = '' } = {}) {
            const item = document.createElement('li');
            item.className = `page-item${activo ? ' active' : ''}${deshabilitado ? ' disabled' : ''}`;
            const boton = document.createElement('button');
            boton.type = 'button';
            boton.className = 'page-link';
            boton.textContent = texto;
            boton.dataset.paginaAdmin = pagina;
            if (etiqueta) boton.setAttribute('aria-label', etiqueta);
            if (activo) boton.setAttribute('aria-current', 'page');
            boton.disabled = deshabilitado;
            item.appendChild(boton);
            paginacion?.appendChild(item);
        }

        agregarBotonPagina('‹', paginaActual - 1, { deshabilitado: paginaActual === 1, etiqueta: 'Página anterior' });
        for (let numero = 1; numero <= totalPaginas; numero += 1) {
            agregarBotonPagina(String(numero), numero, { activo: numero === paginaActual });
        }
        agregarBotonPagina('›', paginaActual + 1, { deshabilitado: paginaActual === totalPaginas, etiqueta: 'Página siguiente' });

        if (productosFiltrados.length === 0) {
            const filaVacia = document.createElement('tr');
            const celdaVacia = document.createElement('td');
            celdaVacia.colSpan = 7;
            celdaVacia.className = 'text-center text-muted py-4';
            celdaVacia.textContent = 'No se encontraron productos.';
            filaVacia.appendChild(celdaVacia);
            tbody.appendChild(filaVacia);
            return;
        }

        const inicio = (paginaActual - 1) * PRODUCTOS_POR_PAGINA;
        productosFiltrados.slice(inicio, inicio + PRODUCTOS_POR_PAGINA).forEach((producto) => {
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

            const celdaRegion = document.createElement('td');
            const nombresRegiones = {
                caribe: 'Caribe',
                andina: 'Andina',
                orinoquia: 'Orinoquía',
                amazonia: 'Amazonía'
            };
            celdaRegion.textContent = nombresRegiones[producto.region] || '—';

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
                celdaRegion,
                celdaAcciones
            );

            tbody.appendChild(fila);
        });
    }

    // restaura el formulario al modo de creacion y limpia la vista previa
    function finalizarEdicion() {
        productoEnEdicion = null;
        botonEnviar.textContent = 'Agregar libro';
        if (botonReset) botonReset.textContent = 'Limpiar';
        campoImagen.required = true;
        campoDescripcion.required = true;
        mostrarVistaPrevia();
    }

    // carga en el formulario los datos del producto seleccionado
    function iniciarEdicion(producto) {
        productoEnEdicion = { id: producto.id, origen: producto.origen };
        formulario.elements['nombreLibro'].value = producto.nombre;
        formulario.elements['categoria'].value = producto.categoria;
        campoRegion.value = producto.region || '';
        formulario.elements['descripcion'].value = producto.descripcion;
        formulario.elements['precio'].value = producto.precio;
        formulario.elements['stock'].value = producto.stock;

        // el navegador no permite rellenar un input file por código.
        // si no se elige una imagen nueva, se conserva la imagen actual.
        campoImagen.value = '';
        campoImagen.required = false;
        campoDescripcion.required = false;
        mostrarVistaPrevia(producto.imagen);
        botonEnviar.textContent = 'Actualizar libro';
        if (botonReset) botonReset.textContent = 'Cancelar edición';
        formulario.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    // elimina productos nuevos o marca como eliminados los libros base
    function eliminarProducto(producto) {
        const confirmacion = confirm(`¿Quieres eliminar "${producto.nombre}"?`);
        if (!confirmacion) return;

        if (producto.origen === 'catalogo') {
            ajustesCatalogo = {
                ...ajustesCatalogo,
                [producto.id]: { ...producto, eliminado: true }
            };
            guardarAjustesCatalogo(ajustesCatalogo);
        } else {
            const productosActualizados = productosGuardados.filter((item) => String(item.id) !== String(producto.id));
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
    console.log('Productos del catálogo y productos guardados:');
    console.log(JSON.stringify(obtenerProductosVisibles(), null, 2));

    // actualiza la tabla y reinicia la pagina al buscar
    buscador?.addEventListener('input', (evento) => {
        terminoBusqueda = evento.target.value;
        paginaActual = 1;
        renderizarTabla();
    });

    // cambia la pagina visible al usar sus controles
    paginacion?.addEventListener('click', (evento) => {
        const boton = evento.target.closest('[data-pagina-admin]');
        if (!boton || boton.disabled) return;
        paginaActual = Number(boton.dataset.paginaAdmin);
        renderizarTabla();
    });

    // atiende las acciones de cada fila mediante delegacion de eventos
    tbody.addEventListener('click', (evento) => {
        const boton = evento.target.closest('[data-accion-producto]');
        if (!boton) return;

        const id = boton.dataset.idProducto;
        const origen = boton.dataset.origenProducto;
        const producto = obtenerProductosVisibles().find(
            (item) => String(item.id) === String(id) && item.origen === origen
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

    // muestra la portada apenas se selecciona un archivo
    campoImagen.addEventListener('change', async () => {
        const archivo = campoImagen.files[0];
        if (!archivo) {
            mostrarVistaPrevia();
            return;
        }

        try {
            mostrarVistaPrevia(await leerImagenComoDataURL(archivo));
        } catch (error) {
            console.error('No se pudo mostrar la vista previa de la portada:', error);
            mostrarVistaPrevia();
        }
    });

    // valida y guarda productos nuevos o cambios de productos existentes
    formulario.addEventListener('submit', async (evento) => {
        evento.preventDefault();

        const estabaEditando = Boolean(productoEnEdicion);
        const valores = new FormData(formulario);
        const archivoImagen = campoImagen.files[0];

        try {
            const productoOriginal = productoEnEdicion
                ? obtenerProductosVisibles().find(
                    (item) => String(item.id) === String(productoEnEdicion.id)
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
                region: valores.get('region')?.toString().trim() || '',
                descripcion: valores.get('descripcion').toString().trim(),
                precio: Number(valores.get('precio')),
                stock: Number(valores.get('stock')),
                imagen: archivoImagen
                    ? await leerImagenComoDataURL(archivoImagen)
                    : productoOriginal?.imagen || '',
                autor: productoOriginal?.autor || ''
            };

            if (productoEnEdicion?.origen === 'catalogo') {
                ajustesCatalogo = { ...ajustesCatalogo, [productoOriginal.id]: { ...nuevoProducto, eliminado: false } };
                guardarAjustesCatalogo(ajustesCatalogo);
            } else if (productoEnEdicion?.origen === 'guardado') {
                const productosActualizados = productosGuardados.map((producto) => (
                    String(producto.id) === String(productoOriginal.id) ? nuevoProducto : producto
                ));
                guardarProductos(productosActualizados);
                productosGuardados = productosActualizados;
            } else {
                const productosActualizados = [...productosGuardados, nuevoProducto];
                guardarProductos(productosActualizados);
                productosGuardados = productosActualizados;
            }

            if (!estabaEditando) {
                terminoBusqueda = '';
                if (buscador) buscador.value = '';
                paginaActual = Math.ceil(obtenerProductosVisibles().length / PRODUCTOS_POR_PAGINA);
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
