const menuToggle = document.querySelector('.menu-toggle');
const mainNav = document.querySelector('.main-nav');
const currentYear = document.querySelector('#current-year');
const ticketForm = document.querySelector('#ticket-form');
const newsletterForm = document.querySelector('#newsletter-form');
const backToTopButton = document.querySelector('#back-to-top');

if (currentYear) {
  currentYear.textContent = new Date().getFullYear();
}

menuToggle?.addEventListener('click', () => {
  const isOpen = mainNav?.classList.toggle('is-open');

  menuToggle?.classList.toggle('is-open', isOpen);

  menuToggle.setAttribute('aria-expanded', String(isOpen));

  menuToggle.setAttribute(
    'aria-label',
    isOpen ? 'Fechar menu de navegação' : 'Abrir menu de navegação'
  );
});

document.querySelectorAll('.main-nav a').forEach((link) => {
  link.addEventListener('click', () => {
    mainNav?.classList.remove('is-open');

    /* Remove o estado visual do X e volta às 3 barras */
    menuToggle?.classList.remove('is-open');
    menuToggle?.setAttribute('aria-expanded', 'false');
    menuToggle?.setAttribute(
      'aria-label',
      'Abrir menu de navegação'
    );
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

(() => {
  const dialog = document.getElementById('ticket-purchase-dialog');
  const purchaseButton = document.getElementById('ticket-purchase-open');
  if (!dialog || !purchaseButton) return;

  const style = document.createElement('style');
  style.textContent = `
    #ingressos #ticket-purchase-open {
      background: #25d366;
      border-color: #25d366;
      color: #fff;
      box-shadow: 0 12px 26px rgba(37, 211, 102, .28);
      transition: transform .2s ease, background .2s ease, box-shadow .2s ease;
    }
    #ingressos #ticket-purchase-open:hover {
      background: #1ebe5b;
      border-color: #1ebe5b;
      transform: translateY(-2px);
      box-shadow: 0 16px 32px rgba(37, 211, 102, .34);
    }
    #ticket-purchase-dialog .ticket-stepper {
      display: grid;
      grid-template-columns: minmax(0, 1fr) 48px;
      gap: 8px;
      min-width: 0;
    }
    #ticket-purchase-dialog .ticket-stepper input {
      min-width: 0;
      height: 100%;
      text-align: center;
      font-size: 1.5rem;
      font-weight: 700;
      caret-color: transparent;
      appearance: textfield;
      -moz-appearance: textfield;
    }
    #ticket-purchase-dialog .ticket-stepper input::-webkit-inner-spin-button,
    #ticket-purchase-dialog .ticket-stepper input::-webkit-outer-spin-button {
      -webkit-appearance: none;
      margin: 0;
    }
    #ticket-purchase-dialog .ticket-stepper-arrows {
      display: grid;
      gap: 4px;
    }
    #ticket-purchase-dialog .ticket-stepper-arrows button {
      width: 48px;
      min-height: 44px;
      padding: 0;
      border: 1px solid var(--border);
      border-radius: 6px;
      color: var(--text);
      background: var(--background);
      font-size: 1.1rem;
      cursor: pointer;
      touch-action: manipulation;
    }
    #ticket-purchase-dialog .ticket-stepper-arrows button:hover:not(:disabled) {
      background: var(--terracotta);
      border-color: var(--terracotta);
    }
    #ticket-purchase-dialog .ticket-stepper-arrows button:disabled {
      opacity: .4;
      cursor: not-allowed;
    }
    @media (prefers-reduced-motion: reduce) {
      #ingressos #ticket-purchase-open { transition: none; }
      #ingressos #ticket-purchase-open:hover { transform: none; }
    }
  `;
  document.head.append(style);

  [['ticket-quantity-full', 'inteiras'], ['ticket-quantity-half', 'meias']].forEach(([id, category]) => {
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
    [[1, '▲', 'Aumentar'], [-1, '▼', 'Diminuir']].forEach(([delta, symbol, label]) => {
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
  if (!form || !full || !half || !message) return;
  const money = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });
  form.addEventListener('submit', event => {
    if (event.defaultPrevented) return;
    const inteiras = full.valueAsNumber;
    const meias = half.valueAsNumber;
    const total = inteiras * 30 + meias * 15;
    if (![inteiras, meias].every(n => Number.isSafeInteger(n) && n >= 0) || inteiras + meias === 0 || !Number.isSafeInteger(total * 100) || !message.value.trim()) {
      event.preventDefault();
      return;
    }
    const text = message.value.replace(/^Valor total[^\r\n]*(?:\r?\n|$)/gm, '').trim();
    message.value = `${text}\n\nValor total a pagar (soma de todos os ingressos): ${money.format(total)}`;
  });
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
    #ingressos > .ticket-layout {
      grid-template-columns: minmax(0, 1fr);
    }
    #ingressos > .ticket-layout .ticket-intro > .ticket-prices {
      grid-template-columns: repeat(3, minmax(0, 1fr));
      align-items: stretch;
    }
    #ingressos > .ticket-layout .ticket-purchase-action.ticket-price-card {
      align-self: stretch;
      align-items: center;
      justify-content: center;
      gap: 18px;
      padding: clamp(16px, 2vw, 28px);
      background: var(--surface);
      border-radius: 18px;
      box-shadow: var(--shadow);
      text-align: center;
    }
    #ingressos > .ticket-layout .ticket-purchase-action > .button {
      max-width: 100%;
      min-width: 0;
      padding: 14px 18px;
      font-size: 1rem;
    }
    #ingressos > .ticket-layout .ticket-purchase-action > p {
      margin: 0;
      font-size: .95rem;
      line-height: 1.6;
    }
    @media (max-width: 700px) {
      #ingressos > .ticket-layout .ticket-intro > .ticket-prices {
        grid-template-columns: minmax(0, 1fr);
      }
    }
  `;
  document.head.append(style);
})();
