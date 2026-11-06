export function inicializarFormularioLibros() {
    const datos = [
        {id: 1, nombre: "Don Quijote de la Mancha", categoria: "Clasico", descripcion: "Novela de miguel de cervantes", precio: 50000, stock: 8, imagen: "" },
        {id: 2, nombre: "El principito", categoria: "Infantil", descripcion: "Historia poetica y filosofica", precio: 25000, stock: 5, imagen: ""},
        {id: 3, nombre: "El olvido que seremos", categoria: "Biografia", descripcion: "Obra de Héctor Abad Faciolince sobre la vida y memoria de su padre", precio: 42000, stock: 3, imagen: ""},
        {id: 4, nombre: "La Ilíada", categoria: "Clásico", descripcion: "Poema épico atribuido a Homero", precio: 34000, stock: 10, imagen: ""},
        {id: 5, nombre: "Maria", categoria: "Romance clasico", descripcion: "Obra cumbre del romanticismo colombiano escrita por Jorge Isaacs", precio: 36000, stock: 6, imagen: ""},
        {id: 6, nombre: "La voragine", categoria: "Clasico colombiano", descripcion: "Novela de José Eustasio Rivera ambientada en la selva amazónica", precio: 67000, stock: 9, imagen: ""},
        {id: 7, nombre: "Delirio", categoria: "Ficcion", descripcion: "Novela de Laura Restrepo galardonada con el Premio Alfaguara", precio: 67000, stock: 2, imagen: ""},
        {id: 8, nombre: "Rosario Tijeras", categoria: "Ficcion", descripcion: "Famosa novela de Jorge Franco ambientada en el Medellín de los 80", precio: 11000, stock: 1, imagen: ""},
        {id: 9, nombre: "Los ejercitos", categoria: "Ficcion", descripcion: "Novela de Evelio Rosero sobre la memoria y el conflicto armado", precio: 55000, stock: 4, imagen: ""},
        {id: 10, nombre: "La casa grande", categoria: "Novela", descripcion: "Novela de Álvaro Cepeda Samudio", precio: 12500, stock: 7, imagen: ""},
    ];

    const tbody = document.querySelector("#tabla-libros tbody") || document.querySelector("#tabla-libros");
    const formulario = document.querySelector("#form-libro") || document.querySelector("form");


    function renderizarTabla() {
    tbody.innerHTML = "";

    datos.forEach((producto) => {
        const fila = document.createElement("tr");

        const celdaId = document.createElement("td");
        celdaId.textContent = producto.id;

        const celdaImagen = document.createElement("td");
        const iconoImagen = document.createElement("i");
        iconoImagen.className = "bi bi-image";
        celdaImagen.appendChild(iconoImagen);

        const celdaNombre = document.createElement("td");
        celdaNombre.textContent = producto.nombre;

        const celdaPrecio = document.createElement("td");
        celdaPrecio.textContent = `$${producto.precio.toLocaleString("es-CO")}`;

        const celdaStock = document.createElement("td");
        celdaStock.textContent = producto.stock;

        const celdaAcciones = document.createElement("td");
        celdaAcciones.innerHTML = `
        <button type="button" class="btn btn-outline-secondary btn-sm me-2">
            Editar
        </button>
        <button type="button" class="btn btn-outline-danger btn-sm">
            Eliminar
        </button>
        `

        fila.append(
            celdaId,
            celdaImagen,
            celdaNombre,
            celdaPrecio,
            celdaStock,
            celdaAcciones
        );
        tbody.appendChild(fila)
    });
    }

    renderizarTabla();
    console.log("Lista de productos actualizada:");
    console.log(JSON.stringify(datos, null, 2));
    formulario.addEventListener("submit", (e) => {
        e.preventDefault();

        const valores = new FormData(formulario);
        const archivoImagen = formulario.elements["imagen"].files[0];

        const nuevoProducto = {
            id: datos.length > 0 ? datos[datos.length - 1].id + 1 : 1,
            nombre: valores.get("nombreLibro")?.toString().trim(),
            categoria: valores.get("categoria")?.toString().trim(),
            descripcion: valores.get("descripcion")?.toString().trim(),
            precio: parseFloat(valores.get("precio")),
            stock: parseInt(valores.get("stock"), 10),
            imagen: archivoImagen ? archivoImagen.name : ""
        };
        datos.push(nuevoProducto);
        renderizarTabla();
        console.log("Lista de productos actualizada:");
        console.log(JSON.stringify(datos, null, 2));

        formulario.reset();
    })
};
