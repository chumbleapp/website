(() => {
  const menu = document.querySelector('.menu-toggle');
  const navigation = document.querySelector('#main-navigation');
  if (!menu || !navigation) return;
  const close = () => {
    menu.setAttribute('aria-expanded', 'false');
    menu.setAttribute('aria-label', 'Open navigation');
    navigation.classList.remove('is-open');
  };
  menu.addEventListener('click', () => {
    const open = menu.getAttribute('aria-expanded') === 'true';
    menu.setAttribute('aria-expanded', String(!open));
    menu.setAttribute('aria-label', open ? 'Open navigation' : 'Close navigation');
    navigation.classList.toggle('is-open', !open);
  });
  navigation.querySelectorAll('a').forEach(link => link.addEventListener('click', close));
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') close();
  });
})();

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

// Keep the current navigation item aligned with the section below the sticky header.
(() => {
  const header = document.querySelector('.brand-header');
  const links = [...document.querySelectorAll('[data-nav-target]')];
  if (!header || !links.length) return;
  const sections = links.map(link => ({
    link,
    target: document.getElementById(link.dataset.navTarget)
  })).filter(section => section.target);
  let scheduled = false;
  const update = () => {
    scheduled = false;
    const position = header.getBoundingClientRect().bottom + 24;
    sections.forEach(({ link, target }) => {
      const bounds = target.getBoundingClientRect();
      const current = bounds.top <= position && bounds.bottom > position;
      link.classList.toggle('is-current', current);
      if (current) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
  };
  const schedule = () => {
    if (scheduled) return;
    scheduled = true;
    window.requestAnimationFrame(update);
  };
  window.addEventListener('scroll', schedule, { passive: true });
  window.addEventListener('resize', schedule);
  window.addEventListener('load', schedule);
  if ('ResizeObserver' in window) {
    const observer = new ResizeObserver(schedule);
    observer.observe(header);
    document.querySelector('main') && observer.observe(document.querySelector('main'));
  }
  update();
  header.classList.add('is-ready');
})();
