const form = document.getElementById("form-contacto");
const aviso = document.getElementById("aviso");

if (form) {
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    // Si falta algún campo, Bootstrap marca los errores
    if (!form.checkValidity()) {
      form.classList.add("was-validated");
      return;
    }

    // Aquí más adelante se enviarán los datos al backend con fetch()
    const boton = form.querySelector('button[type="submit"]');
    boton.disabled = true;

    try {
      const respuesta = await fetch(form.action, {
        method: form.method || "POST",
        body: new FormData(form),
        headers: {
          Accept: "application/json"
        }
      });

      if (!respuesta.ok) {
        throw new Error(`Formspree respondió con el estado ${respuesta.status}`);
      }

      aviso.textContent = "¡Gracias! Recibimos tu mensaje y te responderemos pronto.";
      aviso.classList.remove("d-none", "alert-danger");
      aviso.classList.add("alert-success");
      form.reset();
      form.classList.remove("was-validated");
    } catch (error) {
      aviso.textContent = "No se pudo enviar el mensaje. Inténtalo de nuevo.";
      aviso.classList.remove("d-none", "alert-success");
      aviso.classList.add("alert-danger");
      console.error("Error al enviar el formulario:", error);
    } finally {
      boton.disabled = false;
    }
  });
}
