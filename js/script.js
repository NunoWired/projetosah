const menuToggle = document.querySelector('.menu-toggle');
const mainNav = document.querySelector('.main-nav');
const currentYear = document.querySelector('#current-year');
const ticketForm = document.querySelector('#ticket-form');
const newsletterForm = document.querySelector('#newsletter-form');
const backToTopButton = document.querySelector('#back-to-top');
if (currentYear) currentYear.textContent = new Date().getFullYear();
menuToggle?.addEventListener('click', () => {
  const isOpen = mainNav?.classList.toggle('is-open');
  menuToggle?.classList.toggle('is-open', isOpen);
  menuToggle.setAttribute('aria-expanded', String(isOpen));
  menuToggle.setAttribute('aria-label', isOpen ? 'Fechar menu de navegação' : 'Abrir menu de navegação');
});
document.querySelectorAll('.main-nav a').forEach(link => {
  link.addEventListener('click', () => {
    mainNav?.classList.remove('is-open');
    menuToggle?.classList.remove('is-open');
    menuToggle?.setAttribute('aria-expanded', 'false');
    menuToggle?.setAttribute('aria-label', 'Abrir menu de navegação');
  });
});
ticketForm?.addEventListener('submit', event => {
  event.preventDefault();
  const message = document.querySelector('#form-message');
  if (!ticketForm.checkValidity()) { ticketForm.reportValidity(); return; }
  if (message) message.textContent = 'Formulário validado. A integração segura com Pix será adicionada na próxima etapa.';
});
newsletterForm?.addEventListener('submit', event => {
  event.preventDefault();
  const message = document.querySelector('#newsletter-message');
  if (!newsletterForm.checkValidity()) { newsletterForm.reportValidity(); return; }
  if (message) message.textContent = 'Cadastro validado. A integração com o serviço de e-mail será adicionada em breve.';
  newsletterForm.reset();
});
function toggleBackToTopButton() {
  if (!backToTopButton) return;
  backToTopButton.classList.toggle('is-visible', window.scrollY > 350);
}
window.addEventListener('scroll', toggleBackToTopButton, { passive: true });
toggleBackToTopButton();
backToTopButton?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

(() => {
  const dialog = document.getElementById('ticket-purchase-dialog');
  const purchaseButton = document.getElementById('ticket-purchase-open');
  if (!dialog || !purchaseButton) return;
  const style = document.createElement('style');
  style.textContent = `
    #ingressos #ticket-purchase-open { background: #25d366; border-color: #25d366; color: #fff; box-shadow: 0 12px 26px rgba(37,211,102,.28); transition: transform .2s ease, background .2s ease, box-shadow .2s ease; }
    #ingressos #ticket-purchase-open:hover { background: #1ebe5b; border-color: #1ebe5b; transform: translateY(-2px); box-shadow: 0 16px 32px rgba(37,211,102,.34); }
    #ticket-purchase-dialog .ticket-stepper { display: grid; grid-template-columns: minmax(0,1fr) 48px; gap: 8px; min-width: 0; }
    #ticket-purchase-dialog .ticket-stepper input { min-width: 0; height: 100%; text-align: center; font-size: 1.5rem; font-weight: 700; caret-color: transparent; appearance: textfield; -moz-appearance: textfield; }
    #ticket-purchase-dialog .ticket-stepper input::-webkit-inner-spin-button, #ticket-purchase-dialog .ticket-stepper input::-webkit-outer-spin-button { -webkit-appearance: none; margin: 0; }
    #ticket-purchase-dialog .ticket-stepper-arrows { display: grid; gap: 4px; }
    #ticket-purchase-dialog .ticket-stepper-arrows button { width: 48px; min-height: 44px; padding: 0; border: 1px solid var(--border); border-radius: 6px; color: var(--text); background: var(--background); font-size: 1.1rem; cursor: pointer; touch-action: manipulation; }
    #ticket-purchase-dialog .ticket-stepper-arrows button:hover:not(:disabled) { background: var(--terracotta); border-color: var(--terracotta); }
    #ticket-purchase-dialog .ticket-stepper-arrows button:disabled { opacity: .4; cursor: not-allowed; }
    @media (prefers-reduced-motion: reduce) {
      #ingressos #ticket-purchase-open { transition: none; }
      #ingressos #ticket-purchase-open:hover { transform: none; }
    }
  `;
  document.head.append(style);
  [['ticket-quantity-full','inteiras'], ['ticket-quantity-half','meias']].forEach(([id, category]) => {
    const input = document.getElementById(id);
    if (!input || input.closest('.ticket-stepper')) return;
    input.defaultValue = '0';
    input.value = '0';
    input.readOnly = true;
    input.setAttribute('inputmode', 'none');
    const wrapper = document.createElement('div');
    wrapper.className = 'ticket-stepper';
    const arrows = document.createElement('div');
    arrows.className = 'ticket-stepper-arrows';
    input.before(wrapper);
    wrapper.append(input, arrows);
    const buttons = [];
    [[1,'▲','Aumentar'], [-1,'▼','Diminuir']].forEach(([delta, symbol, label]) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.textContent = symbol;
      button.setAttribute('aria-label', `${label} quantidade de ${category}`);
      button.setAttribute('aria-controls', id);
      arrows.append(button);
      buttons.push(button);
      button.addEventListener('click', () => {
        const next = input.valueAsNumber + delta;
        if (!Number.isSafeInteger(next) || next < 0) return;
        input.value = String(next);
        input.dispatchEvent(new Event('input', { bubbles: true }));
      });
    });
    const syncButtons = () => {
      buttons[0].disabled = !Number.isSafeInteger(input.valueAsNumber + 1);
      buttons[1].disabled = input.valueAsNumber <= 0;
    };
    input.addEventListener('input', syncButtons);
    syncButtons();
    input.dispatchEvent(new Event('input', { bubbles: true }));
  });
})();

(() => {
  const form = document.getElementById('ticket-purchase-form');
  const full = document.getElementById('ticket-quantity-full');
  const half = document.getElementById('ticket-quantity-half');
  const message = document.getElementById('ticket-whatsapp-message');
  const summary = document.getElementById('ticket-order-summary');
  const openButton = document.getElementById('ticket-purchase-open');
  if (!form || !full || !half || !message || !summary || !openButton) return;
  const money = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });
  const notes = form.querySelectorAll('.ticket-purchase-note');
  notes[0]?.remove();
  if (notes[1]) notes[1].textContent = 'A compra será confirmada pela equipe no WhatsApp.';
  const explanation = form.querySelector('#ticket-order-error + p');
  if (explanation) explanation.textContent = 'Confira o total e continue pelo WhatsApp da Ressoa Produções.';
  const simplify = () => {
    const inteiras = full.valueAsNumber;
    const meias = half.valueAsNumber;
    const fullTotal = inteiras * 30;
    const halfTotal = meias * 15;
    const total = fullTotal + halfTotal;
    const valid = [inteiras, meias].every(n => Number.isSafeInteger(n) && n >= 0) && Number.isSafeInteger((inteiras + meias)) && Number.isSafeInteger(total * 100);
    summary.replaceChildren();
    if (!valid) { message.value = ''; return false; }
    [`Inteiras: ${money.format(fullTotal)}`, `Meias: ${money.format(halfTotal)}`, `Total a pagar: ${money.format(total)}`].forEach((text, index) => {
      const p = document.createElement('p');
      if (index === 2) {
        const strong = document.createElement('strong');
        strong.textContent = text;
        p.append(strong);
      } else { p.textContent = text; }
      summary.append(p);
    });
    if (inteiras + meias === 0) { message.value = ''; return false; }
    const lines = [
      `Olá. Gostaria de adquirir ${inteiras + meias} ingresso(s) para o evento Nada Pode Parar o Poder de Deus. Quero confirmar a compra e efetuar o pagamento.`,
      ''
    ];
    if (inteiras > 0) lines.push(`Inteiras (${inteiras}): ${money.format(fullTotal)}`);
    if (meias > 0) lines.push(`Meias (${meias}): ${money.format(halfTotal)}`, 'Meia-entrada: + 1 chamequinho de papel sulfite A4.');
    lines.push('', `Total a pagar: ${money.format(total)}`);
    message.value = lines.join('\n');
    return true;
  };
  [full, half].forEach(input => input.addEventListener('input', simplify));
  openButton.addEventListener('click', simplify);
  form.addEventListener('submit', event => {
    const valid = simplify();
    if (event.defaultPrevented || !valid || !form.checkValidity()) event.preventDefault();
  });
  simplify();
})();

(() => {
  const layout = document.querySelector('#ingressos > .ticket-layout');
  const prices = layout?.querySelector('.ticket-intro > .ticket-prices');
  const purchase = layout?.querySelector('.ticket-purchase-action');
  if (!layout || !prices || !purchase) return;
  purchase.classList.add('ticket-price-card');
  prices.append(purchase);
  const style = document.createElement('style');
  style.textContent = `
    #ingressos > .ticket-layout { grid-template-columns: minmax(0,1fr); }
    #ingressos > .ticket-layout .ticket-intro > .ticket-prices { grid-template-columns: repeat(3,minmax(0,1fr)); align-items: stretch; }
    #ingressos > .ticket-layout .ticket-purchase-action.ticket-price-card { align-self: stretch; align-items: center; justify-content: center; gap: 18px; padding: clamp(16px,2vw,28px); background: var(--surface); border-radius: 18px; box-shadow: var(--shadow); text-align: center; }
    #ingressos > .ticket-layout .ticket-purchase-action > .button { max-width: 100%; min-width: 0; padding: 14px 18px; font-size: 1rem; }
    #ingressos > .ticket-layout .ticket-purchase-action > p { margin: 0; font-size: .95rem; line-height: 1.6; }
    @media (max-width: 700px) {
      #ingressos > .ticket-layout .ticket-intro > .ticket-prices { grid-template-columns: minmax(0,1fr); }
    }
  `;
  document.head.append(style);
})();
