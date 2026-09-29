/* ═══════════════════════════════════════════════════════
   JAVASCRIPT — Portafolio Elena Nava
   -------------------------------------------------------
   Este archivo le da "vida" a la página. Está dividido
   en 6 partes independientes, cada una con su función:

   1. Menú hamburguesa (móvil)
   2. Efecto del header al hacer scroll
   3. Scrollspy (resaltar la sección actual en el menú)
   4. Animación "reveal" (elementos que aparecen al bajar)
   5. Botón "Ver CV" y formulario de contacto (Gmail)
   6. DESPLEGAR proyectos por temática ← aquí estaba el bug

   CONCEPTO CLAVE: usamos "addEventListener" para decirle
   al navegador: "cuando pase X, ejecuta esta función".
   ═══════════════════════════════════════════════════════ */

   
/* ─────────────────────────────────────────────
   1. MENÚ HAMBURGUESA (MÓVIL)
   ───────────────────────────────────────────── */

// Primero "atrapamos" los elementos del HTML por su id/clase
const menuToggle = document.getElementById('menuToggle');
const navMenu = document.getElementById('navMenu');
const navLinks = document.querySelectorAll('.nav-link');

// Al hacer clic en el botón ☰: alternamos la clase 'open'
// en el botón (para animar la X) y en el menú (para deslizarlo)
if (menuToggle && navMenu) {
  menuToggle.addEventListener('click', () => {
    const estaAbierto = navMenu.classList.toggle('open');
    menuToggle.classList.toggle('open', estaAbierto);
    menuToggle.setAttribute('aria-expanded', estaAbierto);
  });
}

// Si el usuario toca un enlace del menú, lo cerramos
// automáticamente (buena experiencia en móvil)
navLinks.forEach(link => {
  link.addEventListener('click', () => {
    if (menuToggle && navMenu) {
      menuToggle.classList.remove('open');
      navMenu.classList.remove('open');
      menuToggle.setAttribute('aria-expanded', 'false');
    }
  });
});


/* ─────────────────────────────────────────────
   2. EFECTO DEL HEADER AL HACER SCROLL
   Cuando bajas más de 50 píxeles, el header gana
   fondo sólido + sombra (la clase .scrolled está
   definida en el CSS).
   ───────────────────────────────────────────── */

const header = document.querySelector('.header');

window.addEventListener('scroll', () => {
  if (!header) return;

  if (window.scrollY > 50) {
    header.classList.add('scrolled');
  } else {
    header.classList.remove('scrolled');
  }
}, { passive: true }); // "passive" mejora el rendimiento del scroll


/* ─────────────────────────────────────────────
   3. SCROLLSPY — RESALTAR LA SECCIÓN ACTUAL
   ───────────────────────────────────────────── */

const sections = document.querySelectorAll('section');

window.addEventListener('scroll', () => {
  let currentSection = '';

  sections.forEach(section => {
    const sectionTop = section.offsetTop;

    // -200 es un pequeño "margen": cambia un poco
    // antes de llegar exactamente a la sección
    if (window.scrollY >= sectionTop - 200) {
      currentSection = section.getAttribute('id');
    }
  });

  navLinks.forEach(link => {
    link.classList.remove('active');
    const href = link.getAttribute('href');
    if (currentSection && href === '#' + currentSection) {
      link.classList.add('active');
    }
  });
}, { passive: true });


/* ─────────────────────────────────────────────
   4. ANIMACIÓN "REVEAL"
   Los elementos con clase .reveal empiezan
   invisibles (CSS). Aquí observamos cuáles entran
   a la pantalla y les agregamos .visible para
   que aparezcan con suavidad, uno por uno.
   ───────────────────────────────────────────── */

// "IntersectionObserver" vigila qué elementos son visibles
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, index) => {
    if (entry.isIntersecting) {
      // Un pequeño retraso escalonado: si hay varios juntos,
      // aparecen en cascada en vez de todos a la vez
      setTimeout(() => {
        entry.target.classList.add('visible');
      }, index * 120);
      revealObserver.unobserve(entry.target); // Dejamos de vigilarlo
    }
  });
}, { threshold: 0.15 }); // Se activa cuando el 15% del elemento es visible

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));


/* ─────────────────────────────────────────────
   5a. BOTÓN "VER CV" — desplaza suavemente hasta
   la sección del visor de PDF
   ───────────────────────────────────────────── */

const btnVerCV = document.getElementById('btnVerCV');
const cvSection = document.getElementById('cv');

if (btnVerCV && cvSection) {
  btnVerCV.addEventListener('click', () => {
    cvSection.scrollIntoView({ behavior: 'smooth' });
  });
}


/* ─────────────────────────────────────────────
   5b. FORMULARIO DE CONTACTO
   Sin servidor, la forma más sencilla es abrir
   Gmail en una pestaña nueva con el mensaje ya
   redactado (así no depende del correo instalado).
   ───────────────────────────────────────────── */

const contactForm = document.getElementById('contactForm');
const formSuccess = document.getElementById('formSuccess');

if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault(); // Evita que la página se recargue

    // 1. Leemos lo que escribió la persona
    const nombre = document.getElementById('nombre').value.trim();
    const email = document.getElementById('email').value.trim();
    const mensaje = document.getElementById('mensaje').value.trim();

    // 2. Construimos el correo: asunto + cuerpo codificados
    const asunto = encodeURIComponent(`Contacto desde tu portafolio — ${nombre}`);
    const cuerpo = encodeURIComponent(
      `Hola Elena:\n\n${mensaje}\n\n— ${nombre}\n(${email})`
    );

    // 3. Abrimos Gmail en una pestaña nueva con todo listo
    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=navanegreteelenamonserrat@gmail.com&su=${asunto}&body=${cuerpo}`;
    window.open(gmailUrl, '_blank');

    // 4. Mostramos confirmación y limpiamos el formulario
    if (formSuccess) formSuccess.style.display = 'block';
    contactForm.reset();

    setTimeout(() => {
      if (formSuccess) formSuccess.style.display = 'none';
    }, 6000);
  });
}


/* ─────────────────────────────────────────────
   6. DESPLEGAR PROYECTOS POR TEMÁTICA
   Cada botón .btn-theme guarda en data-target
   el id del contenedor que debe abrir/cerrar.
   El CSS hace el resto: oculta .theme-projects
   hasta que tiene la clase .show.
   ───────────────────────────────────────────── */

const themeButtons = document.querySelectorAll('.btn-theme');

themeButtons.forEach(button => {
  button.addEventListener('click', () => {
    // Obtenemos el ID del contenedor que este botón debe abrir
    const targetId = button.getAttribute('data-target');
    const targetProjects = document.getElementById(targetId);

    if (!targetProjects) return;

    // Alternamos la visibilidad (agregando o quitando la clase 'show')
    const estaAbierto = targetProjects.classList.toggle('show');

    // Actualizamos el texto del botón y su accesibilidad
    button.innerHTML = estaAbierto ? 'Ocultar proyectos ▲' : 'Ver proyectos ▼';
    button.setAttribute('aria-expanded', estaAbierto);

    // Si acabamos de ABRIR este tablero y está medio fuera
    // de la pantalla, lo acomodamos suavemente (opcional).
    // Si no te gusta el salto, comenta las siguientes líneas:
    if (estaAbierto) {
      const rect = targetProjects.getBoundingClientRect();
      if (rect.bottom > window.innerHeight) {
        targetProjects.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }
  });
});


/* ─────────────────────────────────────────────
   7. GALERÍAS DE DISEÑO Y MARKETING
   Las rutas de las imágenes viven en el atributo
   data-images de cada tarjeta.
   ───────────────────────────────────────────── */

const imageModal = document.getElementById('imageModal');
const modalClose = document.getElementById('modalClose');
const modalTitle = document.getElementById('modalTitle');
const modalGalleryGrid = document.getElementById('modalGalleryGrid');
const galleryTriggers = document.querySelectorAll('.project-gallery-trigger');

const closeImageModal = () => {
  if (!imageModal) return;

  imageModal.classList.remove('is-open');
  imageModal.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('modal-open');
};

const openImageModal = (card) => {
  if (!imageModal || !modalGalleryGrid) return;

  let imagePaths;
  try {
    imagePaths = JSON.parse(card.dataset.images || '[]');
  } catch {
    imagePaths = [];
  }

  modalGalleryGrid.innerHTML = '';
  imagePaths.forEach((imagePath, index) => {
    const image = document.createElement('img');
    image.src = imagePath;
    image.alt = `${card.querySelector('h3')?.textContent || 'Proyecto'} - imagen ${index + 1}`;
    image.loading = 'lazy';
    modalGalleryGrid.appendChild(image);
  });

  if (modalTitle) {
    modalTitle.textContent = card.querySelector('h3')?.textContent || 'Galería del proyecto';
  }

  imageModal.classList.add('is-open');
  imageModal.setAttribute('aria-hidden', 'false');
  document.body.classList.add('modal-open');
  modalClose?.focus();
};

galleryTriggers.forEach(card => {
  card.addEventListener('click', () => openImageModal(card));
  card.addEventListener('keydown', event => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      openImageModal(card);
    }
  });
});

modalClose?.addEventListener('click', closeImageModal);

imageModal?.addEventListener('click', event => {
  if (event.target === imageModal) closeImageModal();
});

document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && imageModal?.classList.contains('is-open')) {
    closeImageModal();
  }
});
