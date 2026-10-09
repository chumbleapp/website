(() => {
  const key = 'chumble-theme';
  const toggle = document.querySelector('.theme-toggle');
  const preference = window.matchMedia('(prefers-color-scheme: dark)');
  let savedTheme;
  try { savedTheme = localStorage.getItem(key); } catch { /* Theme still works when storage is unavailable. */ }
  const setTheme = theme => {
    document.documentElement.dataset.theme = theme;
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', theme === 'dark' ? '#200d12' : '#d21c30');
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

// Keep each tab group independent, including partner and service guides.
(() => {
  document.querySelectorAll('[role="tablist"]').forEach(list => {
    const tabs = [...list.querySelectorAll('[role="tab"]')];
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
        if (event.key === 'ArrowRight') next = (index + 1) % tabs.length;
        if (event.key === 'ArrowLeft') next = (index - 1 + tabs.length) % tabs.length;
        if (event.key === 'Home') next = 0;
        if (event.key === 'End') next = tabs.length - 1;
        if (next === undefined) return;
        event.preventDefault();
        select(tabs[next]);
        tabs[next].focus();
      });
    });
  });
})();

// Run each service story once on arrival and replay only on a deliberate interaction.
(() => {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const targets = [...document.querySelectorAll('.service-card, .journey-panel')];
  if (!targets.length || !('IntersectionObserver' in window)) return;
  const active = new Set();
  const timers = new Map();
  const play = element => {
    if (reducedMotion.matches || document.hidden || !active.has(element)) return;
    if (element.getAnimations({ subtree: true }).some(animation => animation.playState === 'running')) return;
    element.classList.remove('is-in-view');
    // A fresh style calculation starts the same short sequence without layout changes.
    void element.offsetWidth;
    element.classList.add('is-in-view');
  };
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        active.add(entry.target);
        play(entry.target);
      } else {
        active.delete(entry.target);
        entry.target.classList.remove('is-in-view');
      }
    });
  }, { threshold: .25 });
  targets.forEach(element => {
    observer.observe(element);
    const replay = () => {
      clearTimeout(timers.get(element));
      timers.set(element, setTimeout(() => { timers.delete(element); play(element); }, 120));
    };
    element.addEventListener('pointerenter', replay);
    element.addEventListener('focusin', replay);
  });
  reducedMotion.addEventListener('change', () => {
    targets.forEach(element => element.classList.remove('is-in-view'));
    if (!reducedMotion.matches) active.forEach(play);
  });
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) targets.forEach(element => element.classList.remove('is-in-view'));
    else active.forEach(play);
  });
})();

// Account for the wrapped mobile navigation when scrolling to a section.
(() => {
  const header = document.querySelector('.brand-header');
  if (!header) return;
  const updateHeight = () => document.documentElement.style.setProperty('--header-height', `${header.getBoundingClientRect().height}px`);
  updateHeight();
  if ('ResizeObserver' in window) new ResizeObserver(updateHeight).observe(header);
  else window.addEventListener('resize', updateHeight);
})();

// Let the compact navigation follow the visitor's journey through the page.
(() => {
  const header = document.querySelector('.brand-header');
  const links = [...document.querySelectorAll('[data-nav-target]')];
  if (!header || !links.length || !('IntersectionObserver' in window)) return;
  const byTarget = new Map(links.map(link => [link.dataset.navTarget, link]));
  const setCurrent = id => links.forEach(link => link.classList.toggle('is-current', link === byTarget.get(id)));
  const observer = new IntersectionObserver(entries => {
    const visible = entries.filter(entry => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
    if (visible) setCurrent(visible.target.id);
  }, { rootMargin: '-25% 0px -58% 0px', threshold: [0, .25, .5] });
  byTarget.forEach((link, id) => {
    const target = document.getElementById(id);
    if (target) observer.observe(target);
  });
  header.classList.add('is-ready');
})();
