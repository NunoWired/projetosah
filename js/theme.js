(() => {
  'use strict';

  function initThemeToggle() {
    const themeToggle = document.getElementById('theme-toggle');
    const root = document.documentElement;

    if (!themeToggle) {
      console.error('Botão #theme-toggle não foi encontrado.');
      return;
    }

    const savedTheme = localStorage.getItem('tema-evento');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initialTheme = savedTheme || (prefersDark ? 'dark' : 'light');

    function updateTheme(theme) {
      const isDark = theme === 'dark';
      root.setAttribute('data-theme', theme);

      themeToggle.innerHTML = isDark
        ? '<span aria-hidden="true">☾</span>'
        : '<span aria-hidden="true">☀</span>';

      themeToggle.setAttribute(
        'aria-label',
        isDark ? 'Ativar tema claro' : 'Ativar tema escuro'
      );
      themeToggle.setAttribute('title', isDark ? 'Ativar tema claro' : 'Ativar tema escuro');
      themeToggle.setAttribute('aria-pressed', String(isDark));
      localStorage.setItem('tema-evento', theme);
    }

    updateTheme(initialTheme);

    themeToggle.addEventListener('click', () => {
      const currentTheme = root.getAttribute('data-theme') || 'light';
      updateTheme(currentTheme === 'dark' ? 'light' : 'dark');
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initThemeToggle);
  } else {
    initThemeToggle();
  }
})();
