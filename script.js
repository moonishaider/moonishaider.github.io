(() => {
  const root = document.documentElement;
  const themeToggle = document.querySelector('[data-theme-toggle]');
  const themeMeta = document.querySelector('meta[name="theme-color"]');
  const menuToggle = document.querySelector('[data-menu-toggle]');
  const mobileMenu = document.querySelector('[data-mobile-menu]');
  const header = document.querySelector('[data-header]');
  const readSavedTheme = () => {
    try { return localStorage.getItem('portfolio-theme'); } catch { return null; }
  };
  const saveTheme = (theme) => {
    try { localStorage.setItem('portfolio-theme', theme); } catch { /* Storage may be unavailable in private contexts. */ }
  };
  const savedTheme = readSavedTheme();
  const preferredTheme = window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  root.dataset.theme = savedTheme || preferredTheme;
  const syncThemeLabel = () => {
    const next = root.dataset.theme === 'dark' ? 'light' : 'dark';
    themeToggle.setAttribute('aria-label', `Switch to ${next} theme`);
    themeMeta.setAttribute('content', root.dataset.theme === 'light' ? '#f0eee8' : '#0a0a0b');
  };
  syncThemeLabel();
  themeToggle.addEventListener('click', () => {
    root.dataset.theme = root.dataset.theme === 'dark' ? 'light' : 'dark';
    saveTheme(root.dataset.theme);
    syncThemeLabel();
  });
  const closeMenu = () => {
    mobileMenu.classList.remove('open');
    menuToggle.setAttribute('aria-expanded', 'false');
  };
  menuToggle.addEventListener('click', () => {
    const isOpen = mobileMenu.classList.toggle('open');
    menuToggle.setAttribute('aria-expanded', String(isOpen));
  });
  mobileMenu.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeMenu));
  window.addEventListener('resize', () => { if (window.innerWidth > 1020) closeMenu(); });
  const syncHeader = () => header.classList.toggle('scrolled', window.scrollY > 18);
  syncHeader();
  window.addEventListener('scroll', syncHeader, { passive: true });
  const revealItems = document.querySelectorAll('[data-reveal]');
  if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) { entry.target.classList.add('revealed'); observer.unobserve(entry.target); }
      });
    }, { threshold: .08, rootMargin: '0px 0px -28px' });
    revealItems.forEach((item) => observer.observe(item));
  } else {
    revealItems.forEach((item) => item.classList.add('revealed'));
  }
})();
