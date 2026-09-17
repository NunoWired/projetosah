const menuToggle = document.querySelector('.menu-toggle');
const mainNav = document.querySelector('.main-nav');
const currentYear = document.querySelector('#current-year');
const ticketForm = document.querySelector('#ticket-form');
const newsletterForm = document.querySelector('#newsletter-form');

currentYear.textContent = new Date().getFullYear();

menuToggle?.addEventListener('click', () => {
  const open = mainNav.classList.toggle('is-open');
  menuToggle.setAttribute('aria-expanded', String(open));
  menuToggle.setAttribute('aria-label', open ? 'Fechar menu de navegação' : 'Abrir menu de navegação');
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

  message.textContent = 'Formulário validado. A integração segura com Pix será adicionada na próxima etapa.';
});

newsletterForm?.addEventListener('submit', (event) => {
  event.preventDefault();
  const message = document.querySelector('#newsletter-message');

  if (!newsletterForm.checkValidity()) {
    newsletterForm.reportValidity();
    return;
  }

  message.textContent = 'Cadastro validado. A integração com o serviço de e-mail será adicionada em breve.';
  newsletterForm.reset();
});
