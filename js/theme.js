const themeToggle = document.querySelector('#theme-toggle');
const root = document.documentElement;

function applyTheme(theme) {
  root.dataset.theme = theme;
  const isDark = theme === 'dark';
  themeToggle?.setAttribute('aria-pressed', String(isDark));
  themeToggle?.setAttribute('aria-label', isDark ? 'Ativar tema claro' : 'Ativar tema escuro');
}

const storedTheme = localStorage.getItem('tema-evento');
const preferredTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
applyTheme(storedTheme || preferredTheme);

themeToggle?.addEventListener('click', () => {
  const nextTheme = root.dataset.theme === 'dark' ? 'light' : 'dark';
  applyTheme(nextTheme);
  localStorage.setItem('tema-evento', nextTheme);
});
