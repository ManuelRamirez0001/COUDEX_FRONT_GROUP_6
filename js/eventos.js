/**
 * eventos.js
 * Validaciones, formulario de contacto y listeners de UI.
 */

/**
 * Inicializa el formulario de contacto con Formspree y validación de Bootstrap.
 * Se llama después de que la página Contáctanos se inyecte en #main.
 */
export function initFormContacto() {
  const form = document.getElementById('form-contacto');
  const aviso = document.getElementById('aviso');
  if (!form) return; // La página puede no estar cargada todavía

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Si falta algún campo, Bootstrap marca los errores
    if (!form.checkValidity()) {
      form.classList.add('was-validated');
      return;
    }

    const boton = form.querySelector('button[type="submit"]');
    boton.disabled = true;

    try {
      const respuesta = await fetch(form.action, {
        method: form.method || 'POST',
        body: new FormData(form),
        headers: { Accept: 'application/json' }
      });

      if (!respuesta.ok) {
        throw new Error(`Formspree respondió con el estado ${respuesta.status}`);
      }

      aviso.textContent = '¡Gracias! Recibimos tu mensaje y te responderemos pronto.';
      aviso.classList.remove('d-none', 'alert-danger');
      aviso.classList.add('alert-success');
      form.reset();
      form.classList.remove('was-validated');
    } catch (error) {
      aviso.textContent = 'No se pudo enviar el mensaje. Inténtalo de nuevo.';
      aviso.classList.remove('d-none', 'alert-success');
      aviso.classList.add('alert-danger');
      console.error('Error al enviar el formulario:', error);
    } finally {
      boton.disabled = false;
    }
  });
}

/**
 * Cierra el menú móvil de Bootstrap al hacer clic en un enlace de navegación.
 * Evita que el colapso quede abierto tras la navegación SPA.
 */
export function initNavCollapseOnClick() {
  document.addEventListener('click', (e) => {
    const link = e.target.closest('#menu .nav-link[data-page]');
    if (!link) return;
    const collapse = document.querySelector('#menu');
    if (collapse && collapse.classList.contains('show')) {
      const bsCollapse = bootstrap.Collapse.getInstance(collapse);
      bsCollapse?.hide();
    }
  });
}

