import { obtenerAjustesCatalogo, obtenerProductosGuardados } from './productosStorage.js';

// cantidad de libros que se muestran en cada pagina del catalogo
const LIBROS_POR_PAGINA = 9;

// prepara texto para comparar busquedas sin distinguir tildes ni mayusculas
function normalizarTexto(texto = '') {
    return String(texto).normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();
}

// asigna una categoria compatible con los filtros del catalogo
function normalizarCategoria(categoria = '') {
    const valor = normalizarTexto(categoria);
    if (valor.includes('poesia')) return 'poesia';
    if (valor.includes('historia') || valor.includes('cronica')) return 'historia';
    if (valor.includes('infantil') || valor.includes('juvenil')) return 'infantil';
    if (valor.includes('clasica') || valor.includes('novela')) return 'clasica';
    if (valor.includes('realismo')) return 'realismo-magico';
    return 'contemporanea';
}

// construye la tarjeta de un producto guardado desde el administrador
function crearTarjetaProducto(producto, indice) {
    const tarjeta = document.createElement('article');
    tarjeta.className = 'catalogo-producto-card';
    tarjeta.dataset.id = producto.id ?? `guardado-${indice}`;
    tarjeta.dataset.categorias = normalizarCategoria(producto.categoria);
    tarjeta.dataset.region = normalizarTexto(producto.region ?? '');
    tarjeta.dataset.precio = String(Number(producto.precio) || 0);
    tarjeta.dataset.stock = String(Number(producto.stock) > 0);
    tarjeta.dataset.nombre = producto.nombre ?? 'Producto sin nombre';
    tarjeta.dataset.autor = producto.autor ?? '';

    const visual = document.createElement('div');
    visual.className = 'catalogo-producto-visual';
    const portada = producto.imagen ? document.createElement('img') : document.createElement('div');
    portada.className = producto.imagen ? 'catalogo-producto-portada' : 'catalogo-producto-portada-vacia';
    if (producto.imagen) {
        portada.src = producto.imagen;
        portada.alt = `Portada de ${producto.nombre}`;
        portada.loading = 'lazy';
    } else {
        portada.setAttribute('aria-label', 'Espacio reservado para la portada');
    }
    visual.appendChild(portada);
    const favorito = document.createElement('button');
    favorito.type = 'button';
    favorito.className = 'catalogo-producto-favorito';
    favorito.setAttribute('aria-label', `Guardar ${producto.nombre} en favoritos`);
    favorito.innerHTML = '<i class="bi bi-heart" aria-hidden="true"></i>';
    visual.append(favorito, Object.assign(document.createElement('div'), { className: 'catalogo-producto-base' }));

    const info = document.createElement('div');
    info.className = 'catalogo-producto-info';
    const titulo = document.createElement('h2');
    titulo.textContent = producto.nombre ?? 'Producto sin nombre';
    const autor = document.createElement('p');
    autor.className = 'catalogo-producto-autor';
    autor.textContent = producto.autor || producto.categoria || 'Ratón de Biblioteca';
    const valoracion = document.createElement('div');
    valoracion.className = 'catalogo-producto-valoracion';
    valoracion.innerHTML = '<span class="catalogo-estrellas">★★★★★</span><small>Nuevo</small>';
    const compra = document.createElement('div');
    compra.className = 'catalogo-producto-compra';
    const precio = document.createElement('strong');
    precio.textContent = `$${(Number(producto.precio) || 0).toLocaleString('es-CO')}`;
    const boton = document.createElement('button');
    boton.type = 'button';
    boton.innerHTML = '<i class="bi bi-cart3" aria-hidden="true"></i> Añadir al carrito';
    compra.append(precio, boton);
    info.append(titulo, autor, valoracion, compra);
    tarjeta.append(visual, info);
    return tarjeta;
}

// aplica sobre las tarjetas html los cambios guardados en localstorage
function aplicarAjustesCatalogo(grid) {
    const ajustes = obtenerAjustesCatalogo();
    grid.querySelectorAll('.catalogo-producto-card[data-id]').forEach((tarjeta) => {
        const ajuste = ajustes[tarjeta.dataset.id];
        if (!ajuste) return;
        if (ajuste.eliminado) {
            tarjeta.remove();
            return;
        }

        const nombre = ajuste.nombre ?? tarjeta.dataset.nombre;
        const precio = Number(ajuste.precio ?? tarjeta.dataset.precio) || 0;
        const categorias = ajuste.categoria
            ? normalizarCategoria(ajuste.categoria)
            : ajuste.categorias ?? tarjeta.dataset.categorias;
        const stock = ajuste.stock === undefined ? tarjeta.dataset.stock : String(Number(ajuste.stock) > 0);
        tarjeta.dataset.nombre = nombre;
        tarjeta.dataset.precio = String(precio);
        tarjeta.dataset.categorias = categorias;
        tarjeta.dataset.stock = stock;
        if (ajuste.region !== undefined) tarjeta.dataset.region = ajuste.region;

        const titulo = tarjeta.querySelector('.catalogo-producto-info h2');
        if (titulo) titulo.textContent = nombre;
        if (ajuste.autor !== undefined) {
            const autor = tarjeta.querySelector('.catalogo-producto-autor');
            if (autor) autor.textContent = ajuste.autor;
            tarjeta.dataset.autor = ajuste.autor;
        }
        const precioElemento = tarjeta.querySelector('.catalogo-producto-compra strong');
        if (precioElemento) precioElemento.textContent = `$${precio.toLocaleString('es-CO')}`;

        if (ajuste.imagen) {
            const visual = tarjeta.querySelector('.catalogo-producto-visual');
            const portadaActual = visual?.querySelector('.catalogo-producto-portada, .catalogo-producto-portada-vacia');
            if (visual && portadaActual) {
                const portada = document.createElement('img');
                portada.className = 'catalogo-producto-portada';
                portada.src = ajuste.imagen;
                portada.alt = `Portada de ${nombre}`;
                portada.loading = 'lazy';
                portadaActual.replaceWith(portada);
            }
        }
    });
}

// conecta carrusel, formulario de suscripcion, filtros y paginacion
function inicializarCatalogo() {
    const grid = document.querySelector('#catalogo-libros-grid');
    if (!grid) return;

    aplicarAjustesCatalogo(grid);

    // desplaza el carrusel una tarjeta por cada clic en sus flechas
    const carruselMasPedidos = document.querySelector('#carrusel-mas-pedidos');
    document.querySelectorAll('[data-carrusel-direccion]').forEach((boton) => {
        boton.addEventListener('click', () => {
            if (!carruselMasPedidos) return;
            const direccion = boton.dataset.carruselDireccion === 'siguiente' ? 1 : -1;
            const tarjeta = carruselMasPedidos.querySelector('.catalogo-mas-pedidos-libro');
            const espacio = parseFloat(getComputedStyle(carruselMasPedidos).columnGap) || 0;
            carruselMasPedidos.scrollBy({ left: direccion * ((tarjeta?.getBoundingClientRect().width || 240) + espacio), behavior: 'smooth' });
        });
    });

    // envia el correo de suscripcion sin salir de la pagina
    const formularioParche = document.querySelector('.catalogo-unirse-formulario');
    if (formularioParche) {
        const campoCorreo = formularioParche.querySelector('#correo-parche');
        const avisoParche = formularioParche.querySelector('#aviso-parche');
        const botonEnvio = formularioParche.querySelector('[type="submit"]');
        let temporizadorAviso;
        formularioParche.addEventListener('submit', async (evento) => {
            evento.preventDefault();
            campoCorreo.value = campoCorreo.value.trim();
            if (!formularioParche.reportValidity()) return;

            botonEnvio.disabled = true;
            avisoParche.classList.add('d-none');
            try {
                const respuesta = await fetch(formularioParche.action, {
                    method: formularioParche.method || 'POST',
                    body: new FormData(formularioParche),
                    headers: { Accept: 'application/json' }
                });
                if (!respuesta.ok) throw new Error(`Formspree respondió con el estado ${respuesta.status}`);
                formularioParche.reset();
                avisoParche.textContent = '¡Gracias por unirte al parche lector!';
                avisoParche.classList.remove('d-none', 'text-danger');
                avisoParche.classList.add('text-success');
                clearTimeout(temporizadorAviso);
                temporizadorAviso = setTimeout(() => avisoParche.classList.add('d-none'), 5000);
            } catch (error) {
                avisoParche.textContent = 'No se pudo enviar el correo. Inténtalo de nuevo.';
                avisoParche.classList.remove('d-none', 'text-success');
                avisoParche.classList.add('text-danger');
                console.error('Error al enviar la suscripción:', error);
            } finally {
                botonEnvio.disabled = false;
            }
        });
    }

    // agrega al listado los productos nuevos guardados por el administrador
    obtenerProductosGuardados().forEach((producto, indice) => {
        grid.appendChild(crearTarjetaProducto(producto, indice));
    });

    const tarjetas = [...grid.querySelectorAll('.catalogo-producto-card')];
    const conteo = document.querySelector('#conteo-libros');
    const paginas = document.querySelector('#catalogo-paginas');
    const estadoPagina = document.querySelector('#catalogo-pagina-estado');
    const paginacion = document.querySelector('.catalogo-paginacion');
    const buscar = document.querySelector('#busqueda-catalogo');
    const categoriaSelect = document.querySelector('#categoria-catalogo');
    const botonBuscar = document.querySelector('.catalogo-busqueda-boton');
    const panel = document.querySelector('.catalogo-filtros');
    const minimo = document.querySelector('#precio-minimo');
    const maximo = document.querySelector('#precio-maximo');
    const minimoTexto = document.querySelector('#precio-minimo-valor');
    const maximoTexto = document.querySelector('#precio-maximo-valor');
    let paginaActual = 1;

    // cuenta libros por region para mostrar cantidades reales en los filtros
    function actualizarConteosRegiones() {
        panel.querySelectorAll('input[name="region"]').forEach((control) => {
            const region = control.value;
            const cantidad = tarjetas.filter((tarjeta) => (
                tarjeta.dataset.region.split(/\s+/).filter(Boolean).includes(region)
            )).length;
            const contador = control.closest('.catalogo-filtro-opcion')?.querySelector('small');
            if (contador) contador.textContent = String(cantidad);
        });
    }

    // refleja los limites actuales del rango de precios
    function actualizarTextoPrecio() {
        minimoTexto.textContent = `$${Number(minimo.value).toLocaleString('es-CO')}`;
        maximoTexto.textContent = `$${Number(maximo.value).toLocaleString('es-CO')}`;
    }

    // combina busqueda, categoria, region y precio para filtrar libros
    function obtenerFiltradas() {
        const consulta = normalizarTexto(buscar.value);
        const categoriasMarcadas = [...panel.querySelectorAll('input[name="categoria"]:checked')].map((input) => input.value);
        const categoriaSuperior = categoriaSelect.value;
        const categorias = categoriaSuperior ? [categoriaSuperior] : categoriasMarcadas;
        const regiones = [...panel.querySelectorAll('input[name="region"]:checked')].map((input) => input.value);
        const precioMinimo = Number(minimo.value);
        const precioMaximo = Number(maximo.value);

        return tarjetas.filter((tarjeta) => {
            const texto = normalizarTexto(`${tarjeta.dataset.nombre} ${tarjeta.dataset.autor}`);
            const categoriasLibro = tarjeta.dataset.categorias.split(/\s+/).filter(Boolean);
            const regionesLibro = tarjeta.dataset.region.split(/\s+/).filter(Boolean);
            const precio = Number(tarjeta.dataset.precio);
            return (!consulta || texto.includes(consulta))
                && (!categorias.length || categorias.some((categoria) => categoriasLibro.includes(categoria)))
                && (!regiones.length || regiones.some((region) => regionesLibro.includes(region)))
                && precio >= precioMinimo && precio <= precioMaximo;
        });
    }

    // crea los botones de navegacion segun el total de paginas
    function dibujarPaginacion(totalPaginas) {
        paginas.replaceChildren();
        for (let numero = 1; numero <= totalPaginas; numero += 1) {
            const boton = document.createElement('button');
            boton.type = 'button';
            boton.className = `catalogo-pagina-numero${numero === paginaActual ? ' activa' : ''}`;
            boton.textContent = numero;
            boton.dataset.numeroPagina = numero;
            if (numero === paginaActual) boton.setAttribute('aria-current', 'page');
            paginas.appendChild(boton);
        }
        paginacion.querySelector('[data-pagina="anterior"]').disabled = paginaActual <= 1;
        paginacion.querySelector('[data-pagina="siguiente"]').disabled = paginaActual >= totalPaginas;
        estadoPagina.textContent = `Página ${paginaActual} de ${totalPaginas}`;
        paginacion.classList.remove('d-none');
    }

    // actualiza tarjetas visibles, conteo de resultados y paginacion
    function renderizar() {
        actualizarConteosRegiones();
        const filtradas = obtenerFiltradas();
        const totalPaginas = Math.max(1, Math.ceil(filtradas.length / LIBROS_POR_PAGINA));
        paginaActual = Math.min(paginaActual, totalPaginas);
        grid.querySelector('.catalogo-sin-resultados')?.remove();
        tarjetas.forEach((tarjeta) => tarjeta.classList.add('d-none'));
        const inicio = (paginaActual - 1) * LIBROS_POR_PAGINA;
        filtradas.slice(inicio, inicio + LIBROS_POR_PAGINA).forEach((tarjeta) => tarjeta.classList.remove('d-none'));
        const desde = filtradas.length ? inicio + 1 : 0;
        const hasta = Math.min(inicio + LIBROS_POR_PAGINA, filtradas.length);
        conteo.textContent = `Mostrando ${desde}–${hasta} de ${filtradas.length} libros`;
        if (filtradas.length === 0) {
            const mensaje = document.createElement('p');
            mensaje.className = 'catalogo-sin-resultados';
            mensaje.textContent = 'No se encontraron libros con esos filtros.';
            grid.appendChild(mensaje);
        }
        dibujarPaginacion(totalPaginas);
    }

    // vuelve a la primera pagina despues de cambiar un filtro
    function aplicarFiltros() {
        paginaActual = 1;
        renderizar();
    }

    [minimo, maximo].forEach((control) => control.addEventListener('input', () => {
        if (Number(minimo.value) >= Number(maximo.value)) {
            if (control === minimo) minimo.value = Number(maximo.value) - Number(minimo.step);
            else maximo.value = Number(minimo.value) + Number(maximo.step);
        }
        actualizarTextoPrecio();
        aplicarFiltros();
    }));
    panel.addEventListener('change', aplicarFiltros);
    categoriaSelect.addEventListener('change', aplicarFiltros);
    buscar.addEventListener('input', aplicarFiltros);
    botonBuscar.addEventListener('click', aplicarFiltros);
    document.querySelector('#limpiar-filtros').addEventListener('click', () => {
        panel.querySelectorAll('input[type="checkbox"]').forEach((input) => { input.checked = false; });
        minimo.value = minimo.min;
        maximo.value = maximo.max;
        buscar.value = '';
        categoriaSelect.value = '';
        actualizarTextoPrecio();
        aplicarFiltros();
    });
    paginacion.addEventListener('click', (evento) => {
        const numero = evento.target.closest('[data-numero-pagina]');
        if (numero) paginaActual = Number(numero.dataset.numeroPagina);
        const flecha = evento.target.closest('[data-pagina]');
        if (flecha?.dataset.pagina === 'anterior') paginaActual -= 1;
        if (flecha?.dataset.pagina === 'siguiente') paginaActual += 1;
        renderizar();
        document.querySelector('.catalogo-resultados').scrollIntoView({ behavior: 'smooth', block: 'start' });
    });

    actualizarTextoPrecio();
    renderizar();
}

// inicializa el catalogo despues de cargar su fragmento html
export function initCatalogo() {
    inicializarCatalogo();
}
