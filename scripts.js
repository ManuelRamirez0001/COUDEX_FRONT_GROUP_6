const form = document.getElementById("form-contacto");
const aviso = document.getElementById("aviso");

if (form) {
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    // Si falta algún campo, Bootstrap marca los errores
    if (!form.checkValidity()) {
      form.classList.add("was-validated");
      return;
    }

    // Aquí más adelante se enviarán los datos al backend con fetch()
    aviso.classList.remove("d-none");
    form.reset();
    form.classList.remove("was-validated");
  });
}
