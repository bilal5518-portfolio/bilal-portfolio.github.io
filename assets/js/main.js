(function () {
  var doc = document.documentElement;
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  // Header state
  var header = document.querySelector('.header');
  function onScroll() { if (header) header.classList.toggle('scrolled', window.scrollY > 30); }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Mobile menu
  var menuBtn = document.querySelector('.menu-btn');
  if (menuBtn) {
    menuBtn.addEventListener('click', function () {
      var open = doc.classList.toggle('menu-open');
      menuBtn.setAttribute('aria-expanded', open);
      document.body.style.overflow = open ? 'hidden' : '';
    });
    document.querySelectorAll('.mobile-menu a').forEach(function (a) {
      a.addEventListener('click', function () {
        doc.classList.remove('menu-open');
        menuBtn.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });
  }

  // Reveal on scroll
  var items = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && !reduce) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    items.forEach(function (el) { io.observe(el); });
  } else {
    items.forEach(function (el) { el.classList.add('in'); });
  }

  // Counters
  var counters = document.querySelectorAll('[data-count]');
  function runCounter(el) {
    var end = parseFloat(el.getAttribute('data-count'));
    var suffix = el.getAttribute('data-suffix') || '';
    if (reduce) { el.textContent = end + suffix; return; }
    var start = null, dur = 1600;
    function step(t) {
      if (!start) start = t;
      var p = Math.min((t - start) / dur, 1);
      el.textContent = Math.round(end * (1 - Math.pow(1 - p, 3))) + suffix;
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
  if ('IntersectionObserver' in window) {
    var co = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) { runCounter(e.target); co.unobserve(e.target); } });
    }, { threshold: 0.6 });
    counters.forEach(function (el) { co.observe(el); });
  }

  if (fine && !reduce) {
    // Cursor glow
    var glow = document.createElement('div');
    glow.className = 'cursor-glow';
    document.body.appendChild(glow);
    var gx = -999, gy = -999, tx = -999, ty = -999;
    window.addEventListener('mousemove', function (e) { tx = e.clientX; ty = e.clientY; }, { passive: true });
    (function loop() {
      gx += (tx - gx) * 0.12; gy += (ty - gy) * 0.12;
      glow.style.transform = 'translate3d(' + gx + 'px,' + gy + 'px,0)';
      requestAnimationFrame(loop);
    })();

    // Hero 3D parallax
    var stage = document.querySelector('.stage');
    var card = document.querySelector('.stage-card');
    if (stage && card) {
      stage.addEventListener('mousemove', function (e) {
        var r = stage.getBoundingClientRect();
        var x = (e.clientX - r.left) / r.width - 0.5;
        var y = (e.clientY - r.top) / r.height - 0.5;
        card.style.transform = 'rotateY(' + (-14 + x * 16) + 'deg) rotateX(' + (6 - y * 12) + 'deg)';
      });
      stage.addEventListener('mouseleave', function () { card.style.transform = ''; });
    }

    // Tilt cards
    document.querySelectorAll('[data-tilt]').forEach(function (el) {
      el.addEventListener('mousemove', function (e) {
        var r = el.getBoundingClientRect();
        var x = (e.clientX - r.left) / r.width - 0.5;
        var y = (e.clientY - r.top) / r.height - 0.5;
        el.style.transform = 'perspective(900px) rotateY(' + x * 8 + 'deg) rotateX(' + -y * 8 + 'deg) translateY(-4px)';
      });
      el.addEventListener('mouseleave', function () { el.style.transform = ''; });
    });
  }

  // Portfolio filters
  var filterBtns = document.querySelectorAll('.filters button');
  filterBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var f = btn.getAttribute('data-filter');
      filterBtns.forEach(function (b) { b.setAttribute('aria-pressed', b === btn); });
      document.querySelectorAll('.work-card').forEach(function (c) {
        c.hidden = !(f === 'all' || c.getAttribute('data-cat') === f);
      });
    });
  });

  // Contact form opens WhatsApp
  var form = document.getElementById('contactForm');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var v = function (id) { var el = document.getElementById(id); return el ? el.value.trim() : ''; };
      var text = 'Hi Bilal, I am ' + v('fName') + '.' +
        (v('fEmail') ? '\nEmail: ' + v('fEmail') : '') +
        '\nService: ' + v('fService') +
        (v('fBudget') ? '\nBudget: ' + v('fBudget') : '') +
        '\n\n' + v('fMsg');
      window.open('https://wa.me/923074755518?text=' + encodeURIComponent(text), '_blank', 'noopener');
    });
  }

  var y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();
})();
