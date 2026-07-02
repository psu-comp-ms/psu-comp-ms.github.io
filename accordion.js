document.addEventListener('DOMContentLoaded', () => {
  const currentPage = (
    document.body.dataset.page ||
    window.location.pathname.split('/').pop() ||
    'index.html'
  ).toLowerCase();

  const sections = Array.from(document.querySelectorAll('.accordion-section'));
  const buttons = Array.from(document.querySelectorAll('.accordion-button'));
  const sidebarLinks = Array.from(document.querySelectorAll('.sidebar a[href]'));
  const contentAccordions = Array.from(document.querySelectorAll('.content-accordion'));

  const closeSection = (section) => {
    const button = section.querySelector('.accordion-button');
    const panel = section.querySelector('.accordion-panel');

    if (!button || !panel) {
      return;
    }

    button.setAttribute('aria-expanded', 'false');
    panel.hidden = true;
    section.classList.remove('open');
  };

  const openSection = (section) => {
    const button = section.querySelector('.accordion-button');
    const panel = section.querySelector('.accordion-panel');

    if (!button || !panel) {
      return;
    }

    button.setAttribute('aria-expanded', 'true');
    panel.hidden = false;
    section.classList.add('open');
  };

  const closeContentAccordion = (section) => {
    const button = section.querySelector('.content-accordion-button');
    const panel = section.querySelector('.content-accordion-panel');

    if (!button || !panel) {
      return;
    }

    button.setAttribute('aria-expanded', 'false');
    panel.hidden = true;
    section.classList.remove('open');
  };

  const openContentAccordion = (section) => {
    const button = section.querySelector('.content-accordion-button');
    const panel = section.querySelector('.content-accordion-panel');

    if (!button || !panel) {
      return;
    }

    button.setAttribute('aria-expanded', 'true');
    panel.hidden = false;
    section.classList.add('open');
  };

  sections.forEach(closeSection);
  contentAccordions.forEach(closeContentAccordion);

  buttons.forEach((button) => {
    button.addEventListener('click', () => {
      const section = button.closest('.accordion-section');
      const isOpen = button.getAttribute('aria-expanded') === 'true';

      sections.forEach(closeSection);

      if (!isOpen && section) {
        openSection(section);
      }
    });
  });

  contentAccordions.forEach((section) => {
    const button = section.querySelector('.content-accordion-button');

    if (!button) {
      return;
    }

    button.addEventListener('click', () => {
      const isOpen = button.getAttribute('aria-expanded') === 'true';

      contentAccordions.forEach(closeContentAccordion);

      if (!isOpen) {
        openContentAccordion(section);
	section.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  const activeLink = sidebarLinks.find((link) => {
    const href = (link.getAttribute('href') || '').toLowerCase();
    return href && !href.startsWith('http') && href === currentPage;
  });

  if (activeLink) {
    activeLink.classList.add('active');
    activeLink.setAttribute('aria-current', 'page');
    const parentSection = activeLink.closest('.accordion-section');

    if (parentSection) {
      openSection(parentSection);
    }
  }

  if (currentPage === 'index.html') {
    const welcomeSection = document.querySelector('.accordion-section[data-section="welcome"]');
    const introLink = document.querySelector('.accordion-panel a[href="index.html"]');

    if (welcomeSection) {
      openSection(welcomeSection);
    }

    if (introLink && !introLink.classList.contains('active')) {
      introLink.classList.add('active');
      introLink.setAttribute('aria-current', 'page');
    }
  }

  document.addEventListener('click', (event) => {
    const link = event.target.closest('a[href]');

    if (!link) {
      return;
    }

    const rawHref = link.getAttribute('href');

    if (!rawHref || rawHref.startsWith('#') || rawHref.startsWith('mailto:') || rawHref.startsWith('tel:')) {
      return;
    }

    const destination = new URL(rawHref, window.location.href);
    const isExternal = destination.origin !== window.location.origin;

    if (!isExternal) {
      return;
    }

    const confirmed = window.confirm(
      'You are leaving the Graduate Student Handbook website and opening an external page. Continue?'
    );

    if (!confirmed) {
      event.preventDefault();
    }
  });
});
