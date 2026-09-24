const menuToggle = document.querySelector('.menu-toggle');
const mainNav = document.querySelector('.main-nav');
const currentYear = document.querySelector('#current-year');
const ticketForm = document.querySelector('#ticket-form');
const newsletterForm = document.querySelector('#newsletter-form');
const backToTopButton = document.querySelector('#back-to-top');
const themeToggles = document.querySelectorAll('#theme-toggle, #theme-toggle-mobile');

function updateThemeButtons(isDark) {
  themeToggles.forEach((button) => {
    button.setAttribute('aria-pressed', String(isDark));

    button.setAttribute(
      'aria-label',
      isDark ? 'Ativar tema claro' : 'Ativar tema escuro'
    );

    button.setAttribute(
      'title',
      isDark ? 'Ativar tema claro' : 'Ativar tema escuro'
    );
  });
}

const savedTheme = localStorage.getItem('theme');
const initialIsDark = savedTheme === 'dark';

if (initialIsDark) {
  document.documentElement.setAttribute('data-theme', 'dark');
} else {
  document.documentElement.removeAttribute('data-theme');
}

updateThemeButtons(initialIsDark);

themeToggles.forEach((button) => {
  button.addEventListener('click', () => {
    const isDark =
      document.documentElement.getAttribute('data-theme') !== 'dark';

    if (isDark) {
      document.documentElement.setAttribute('data-theme', 'dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
      localStorage.setItem('theme', 'light');
    }

    updateThemeButtons(isDark);
  });
});

if (currentYear) {
  currentYear.textContent = new Date().getFullYear();
}

menuToggle?.addEventListener('click', () => {
  const isOpen = mainNav?.classList.toggle('is-open');

  menuToggle.setAttribute('aria-expanded', String(isOpen));

  menuToggle.setAttribute(
    'aria-label',
    isOpen ? 'Fechar menu de navegação' : 'Abrir menu de navegação'
  );
});

document.querySelectorAll('.main-nav a').forEach((link) => {
  link.addEventListener('click', () => {
    mainNav?.classList.remove('is-open');
    menuToggle?.setAttribute('aria-expanded', 'false');
  });
});

ticketForm?.addEventListener('submit', (event) => {
  event.preventDefault();

  const message = document.querySelector('#form-message');

  if (!ticketForm.checkValidity()) {
    ticketForm.reportValidity();
    return;
  }

  if (message) {
    message.textContent =
      'Formulário validado. A integração segura com Pix será adicionada na próxima etapa.';
  }
});

newsletterForm?.addEventListener('submit', (event) => {
  event.preventDefault();

  const message = document.querySelector('#newsletter-message');

  if (!newsletterForm.checkValidity()) {
    newsletterForm.reportValidity();
    return;
  }

  if (message) {
    message.textContent =
      'Cadastro validado. A integração com o serviço de e-mail será adicionada em breve.';
  }

  newsletterForm.reset();
});

function toggleBackToTopButton() {
  if (!backToTopButton) return;

  backToTopButton.classList.toggle(
    'is-visible',
    window.scrollY > 350
  );
}

window.addEventListener('scroll', toggleBackToTopButton, {
  passive: true
});

toggleBackToTopButton();

backToTopButton?.addEventListener('click', () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
});