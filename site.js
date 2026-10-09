(() => {
  const menu = document.querySelector('.menu-toggle');
  const navigation = document.querySelector('#main-navigation');
  if (!menu || !navigation) return;
  const headerApp = document.querySelector('.header-app');
  if (headerApp) {
    headerApp.textContent = 'Get the app';
    headerApp.href = '#get-app';
    headerApp.removeAttribute('target');
    headerApp.removeAttribute('rel');
  }
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

// Keep service copy specific to the action a visitor is considering.
(() => {
  const introTitle = document.querySelector('#intro-title');
  if (introTitle) introTitle.innerHTML = 'Local food.<br>Useful plans.';
  const introText = document.querySelector('.intro-copy p');
  if (introText) introText.innerHTML = 'Find a meal from a local kitchen,<br>pick up essentials, or make plans<br>for where you want to go next.';
  const introLink = document.querySelector('.intro-copy .text-link');
  if (introLink) introLink.firstChild.textContent = 'Check availability ';

  const availability = document.querySelector('.app-cta p');
  if (availability) availability.textContent = 'Choose the app for your role: customers, business partners, or delivery and transport partners.';
  const appAction = document.querySelector('.app-cta .button');
  if (appAction) {
    appAction.textContent = 'Get the customer app';
    appAction.href = 'https://play.google.com/store/apps/details?id=app.chumble.customer';
    appAction.target = '_blank';
    appAction.rel = 'noopener';
  }
  if (appAction && !document.querySelector('.app-download-links')) {
    const downloads = document.createElement('div');
    downloads.className = 'app-download-links';
    downloads.innerHTML = '<a class="button" href="https://play.google.com/store/apps/details?id=app.chumble.partner" target="_blank" rel="noopener">Get the partner app <span aria-hidden="true">↗</span></a><a class="button" href="https://play.google.com/store/apps/details?id=app.chumble.delivery" target="_blank" rel="noopener">Get the delivery app <span aria-hidden="true">↗</span></a>';
    appAction.classList.add('app-download-button');
    const appContent = appAction.parentElement;
    appContent.append(downloads);
    downloads.prepend(appAction);
  }

  const appFaq = [...document.querySelectorAll('.faq-list details')].find(item => item.querySelector('summary')?.textContent.includes('get the Chumble app'));
  if (appFaq) {
    const answer = appFaq.querySelector('p');
    if (answer) {
      answer.innerHTML = 'Download the <a href="https://play.google.com/store/apps/details?id=app.chumble.customer" target="_blank" rel="noopener">customer app</a> from Google Play. Partners can use the <a href="https://play.google.com/store/apps/details?id=app.chumble.partner" target="_blank" rel="noopener">partner app</a>, and delivery partners can use the <a href="https://play.google.com/store/apps/details?id=app.chumble.delivery" target="_blank" rel="noopener">delivery partner app</a>.';
    }
  }

  const partnerHeading = document.querySelector('.partner-heading h2');
  if (partnerHeading) partnerHeading.textContent = 'Build with Chumble.';
  const partnerSubheading = document.querySelector('.partner-heading > p');
  if (partnerSubheading) partnerSubheading.remove();
  const businessPanel = document.querySelector('#panel-restaurants');
  if (businessPanel) {
    const image = businessPanel.querySelector('img');
    const label = businessPanel.querySelector('.eyebrow');
    const title = businessPanel.querySelector('h3');
    const copy = businessPanel.querySelector('p');
    const action = businessPanel.querySelector('.button');
    if (label) label.textContent = 'RESTAURANT PARTNERS';
    if (title) title.textContent = 'Put your menu on Chumble.';
    if (copy) copy.textContent = 'Tell us your restaurant name, location and the food you serve. We will explain how orders, delivery and table bookings can work for your business.';
    if (action) { action.textContent = 'Get the partner app'; action.href = 'https://play.google.com/store/apps/details?id=app.chumble.partner'; action.target = '_blank'; action.rel = 'noopener'; }
  }
  const courierPanel = document.querySelector('#panel-couriers');
  const partnerSection = document.querySelector('.partners');
  const makePartnerPanel = ({id, image, alt, label, title, copy, app, appLabel = 'Get the partner app'}) => {
    const panel = document.createElement('article');
    panel.className = 'partner-panel';
    panel.id = id;
    panel.innerHTML = `<img src="${image}" alt="${alt}" loading="lazy"><div><span class="eyebrow">${label}</span><h3>${title}</h3><p>${copy}</p><a class="button" href="${app}" target="_blank" rel="noopener">${appLabel} ↗</a></div>`;
    return panel;
  };
  if (partnerSection && courierPanel && !document.querySelector('#panel-merchants')) {
    const partnerApp = 'https://play.google.com/store/apps/details?id=app.chumble.partner';
    const deliveryApp = 'https://play.google.com/store/apps/details?id=app.chumble.delivery';
    const merchantPanel = makePartnerPanel({id: 'panel-merchants', image: 'assets/shopping.jpg', alt: 'Products displayed at a local store', label: 'MERCHANT PARTNERS', title: 'Sell through Chumble.', copy: 'For shops offering groceries, household items, hardware, clothing and other local products.', app: partnerApp});
    const eventPanel = makePartnerPanel({id: 'panel-events', image: 'assets/venue.jpg', alt: 'An event hall prepared for a gathering', label: 'EVENT HALL PARTNERS', title: 'Fill your event hall.', copy: 'Help people find your venue for meetings, weddings, celebrations and other gatherings.', app: partnerApp});
    const cargoPanel = makePartnerPanel({id: 'panel-cargo', image: 'assets/transport-partner.png', alt: 'Two transport workers loading bulk orders into a cargo van', label: 'TRANSPORT PARTNERS', title: 'Move bulk orders with Chumble.', copy: 'Provide transportation for larger orders and bulk transfers between businesses, stores and customers.', app: deliveryApp, appLabel: 'Get the delivery app'});
    partnerSection.insertBefore(merchantPanel, courierPanel);
    partnerSection.insertBefore(eventPanel, courierPanel);
    partnerSection.append(cargoPanel);
  }
  if (courierPanel) {
    const action = courierPanel.querySelector('.button');
    if (action) { action.textContent = 'Get the delivery app'; action.href = 'https://play.google.com/store/apps/details?id=app.chumble.delivery'; action.target = '_blank'; action.rel = 'noopener'; }
  }

  const serviceCopy = {
    delivery: ['Order from a nearby restaurant or kitchen. Review the meal and delivery details before confirming.', 'Ask about ordering food →'],
    shopping: ['Choose a local store, browse what is available, and send your groceries, household items or other purchases to your address.', 'Ask about store orders →'],
    tables: ['Look through restaurants, choose a date and time, and keep the reservation details ready for your visit.', 'Ask about table reservations →'],
    events: ['Compare event halls for a meeting, wedding or family gathering, then contact the team with the venue and date you have in mind.', 'Ask about event halls →']
  };
  Object.entries(serviceCopy).forEach(([id, [description, link]]) => {
    const card = document.getElementById(id);
    if (!card) return;
    const paragraph = card.querySelector('.service-copy p');
    const action = card.querySelector('.service-copy .text-link');
    if (paragraph) paragraph.textContent = description;
    if (action) action.childNodes[0].textContent = link.replace(' →', ' ');
  });

  const steps = {
    'panel-food-guide': [['Browse a menu', 'See what nearby restaurants and kitchens are offering.'], ['Check the details', 'Review the items, address and order total before confirming.'], ['Follow the delivery', 'Keep an eye on the order and be ready to receive it.']],
    'panel-shopping-guide': [['Choose a store', 'Look for groceries, supplies, hardware or clothing from local stores.'], ['Check what is available', 'Select your items and confirm the delivery details.'], ['Receive your order', 'Follow the order and check your purchases when they arrive.']],
    'panel-table-guide': [['Pick a restaurant', 'Find somewhere that suits the meal and the people joining you.'], ['Choose a time', 'Select the date and time that works for your plans.'], ['Keep the booking handy', 'Review the details before you set off for the restaurant.']],
    'panel-event-guide': [['Shortlist a space', 'Explore halls that fit the occasion and the number of guests.'], ['Review the venue', 'Check the details against your date and plans.'], ['Start the conversation', 'Contact the team with the space and date you are considering.']]
  };
  Object.entries(steps).forEach(([id, items]) => {
    const panel = document.getElementById(id);
    if (!panel) return;
    panel.querySelectorAll('.journey-steps li').forEach((step, index) => {
      if (!items[index]) return;
      const heading = step.querySelector('h3');
      const text = step.querySelector('p');
      if (heading) heading.textContent = items[index][0];
      if (text) text.textContent = items[index][1];
    });
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
