document.addEventListener('DOMContentLoaded', function () {
  loadComponent('components/header.html', 'site-header', initHeaderBehavior);
  loadComponent('components/footer.html', 'site-footer', initSmartWhatsappWidgetPlaceholder);
});

function loadComponent(url, placeholderId, callback) {
  var el = document.getElementById(placeholderId);
  if (!el) return;

  fetch(url)
    .then(function (res) {
      if (!res.ok) throw new Error('Impossible de charger ' + url);
      return res.text();
    })
    .then(function (html) {
      el.innerHTML = html;
      setActiveNavLinks();
      if (window.applyContactLinks) window.applyContactLinks(el);
      if (callback) callback();
    })
    .catch(function (err) {
      console.error('[components.js]', err);
    });
}

function setActiveNavLinks() {
  var current = location.pathname.split('/').pop();
  if (!current) current = 'index.html';
  document.querySelectorAll('.nav-link, .nav-overlay-link').forEach(function (link) {
    var href = link.getAttribute('href');
    if (!href) return;
    var page = href.split('/').pop();
    link.classList.toggle('active', page === current);
  });
}

function initHeaderBehavior() {
  var header = document.getElementById('mainHeader');
  var hamburgerBtn = document.getElementById('hamburgerBtn');
  var navCloseBtn = document.getElementById('navCloseBtn');
  var navOverlay = document.getElementById('navOverlay');
  var body = document.body;
  if (!header || !hamburgerBtn || !navOverlay) return;
  function openNav() {
    navOverlay.classList.add('open');
    hamburgerBtn.setAttribute('aria-expanded', 'true');
    body.classList.add('nav-locked');
  }
  function closeNav() {
    navOverlay.classList.remove('open');
    hamburgerBtn.setAttribute('aria-expanded', 'false');
    body.classList.remove('nav-locked');
  }
  hamburgerBtn.addEventListener('click', openNav);
  if (navCloseBtn) navCloseBtn.addEventListener('click', closeNav);
  navOverlay.querySelectorAll('.nav-overlay-link').forEach(function (link) {
    link.addEventListener('click', closeNav);
  });
  window.addEventListener('scroll', function () {
    header.classList.toggle('scrolled', window.scrollY > 12);
  }, { passive: true });
}

function initSmartWhatsappWidgetPlaceholder() {
  // Placeholder
}
