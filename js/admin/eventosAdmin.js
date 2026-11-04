export function inicializarFormularioLibros() {
    const formulario = document.querySelector("#form-libro");
    const datos = [];

    if (!formulario) return;

    formulario.addEventListener("submit", (e) => {
        e.preventDefault();

        const valores = formulario.elements;

        datos.push({
            nombre: valores["nombreLibro"].value,
            categoria: valores["categoria"].value,
            descripcion: valores["descripcion"].value,
            precio: Number(valores["precio"].value),
            stock: Number(valores["stock"].value),
            imagen: valores["imagen"].files[0]?.name ?? ""
        });

        mostrar();
        formulario.reset();
    });

    function mostrar() {
        console.log(JSON.stringify(datos, null, 2));
    }
}