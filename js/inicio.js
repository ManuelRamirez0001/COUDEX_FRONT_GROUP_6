/**
 * inicio.js
 * Interactividad de la página de inicio (carrusel de testimonios).
 */

/** Conecta las flechas del carrusel de testimonios. Se llama tras inyectar inicio.html. */
export function initInicio() {
  const carrusel = document.querySelector('#carrusel-testimonios');
  const botones = document.querySelectorAll('[data-inicio-carrusel]');
  if (!carrusel || !botones.length) return;

  botones.forEach((boton) => {
    boton.addEventListener('click', () => {
      const direccion = boton.dataset.inicioCarrusel === 'siguiente' ? 1 : -1;
      const tarjeta = carrusel.querySelector('.inicio-testimonio');
      const espacio = parseFloat(getComputedStyle(carrusel).columnGap) || 0;
      const paso = (tarjeta?.getBoundingClientRect().width || 300) + espacio;
      carrusel.scrollBy({ left: direccion * paso, behavior: 'smooth' });
    });
  });
}
