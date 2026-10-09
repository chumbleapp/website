(() => {
  const key = 'chumble-theme';
  const toggle = document.querySelector('.theme-toggle');
  const preference = window.matchMedia('(prefers-color-scheme: dark)');
  let savedTheme;
  try { savedTheme = localStorage.getItem(key); } catch { /* Theme still works when storage is unavailable. */ }
  const setTheme = theme => {
    document.documentElement.dataset.theme = theme;
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', theme === 'dark' ? '#141d17' : '#fffdf5');
    if (!toggle) return;
    toggle.textContent = theme === 'dark' ? '☀' : '☾';
    toggle.setAttribute('aria-label', `Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`);
    toggle.setAttribute('aria-pressed', String(theme === 'dark'));
  };
  setTheme(['light', 'dark'].includes(savedTheme) ? savedTheme : (preference.matches ? 'dark' : 'light'));
  toggle?.addEventListener('click', () => {
    savedTheme = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
    setTheme(savedTheme);
    try { localStorage.setItem(key, savedTheme); } catch { /* Preserve the choice for this page visit. */ }
  });
  preference.addEventListener('change', event => {
    if (!savedTheme) setTheme(event.matches ? 'dark' : 'light');
  });
})();

// Service details are navigable by pointer, keyboard, and assistive technology.
(() => {
  const tabs = [...document.querySelectorAll('.plan-tab')];
  const select = tab => {
    tabs.forEach(item => {
      const active = item === tab;
      item.setAttribute('aria-selected', String(active));
      item.tabIndex = active ? 0 : -1;
      document.getElementById(item.getAttribute('aria-controls')).hidden = !active;
    });
  };
  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => select(tab));
    tab.addEventListener('keydown', event => {
      let next;
      if (event.key === 'ArrowDown') next = (index + 1) % tabs.length;
      if (event.key === 'ArrowUp') next = (index - 1 + tabs.length) % tabs.length;
      if (event.key === 'Home') next = 0;
      if (event.key === 'End') next = tabs.length - 1;
      if (next === undefined) return;
      event.preventDefault();
      select(tabs[next]);
      tabs[next].focus();
    });
  });
})();
