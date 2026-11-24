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

// Cursor ring that follows the mouse
(function () {
  var fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!fine || reduce) return;
  var ring = document.createElement('div'); ring.className = 'cursor-ring';
  var dot = document.createElement('div'); dot.className = 'cursor-dot';
  document.body.appendChild(ring); document.body.appendChild(dot);
  var mx = -100, my = -100, rx = -100, ry = -100;
  window.addEventListener('mousemove', function (e) {
    mx = e.clientX; my = e.clientY;
    dot.style.transform = 'translate3d(' + mx + 'px,' + my + 'px,0)';
    document.documentElement.classList.add('cursor-on');
  }, { passive: true });
  document.addEventListener('mouseleave', function () { document.documentElement.classList.remove('cursor-on'); });
  document.addEventListener('mouseover', function (e) {
    ring.classList.toggle('hover', !!e.target.closest('a,button,summary,input,select,textarea,[data-tilt]'));
  });
  (function loop() {
    rx += (mx - rx) * 0.18; ry += (my - ry) * 0.18;
    ring.style.transform = 'translate3d(' + rx + 'px,' + ry + 'px,0)';
    requestAnimationFrame(loop);
  })();
})();

// Simple chat assistant (answers common questions, hands off to WhatsApp)
(function () {
  var fab = document.querySelector('.chat-fab');
  var panel = document.querySelector('.chat-panel');
  if (!fab || !panel) return;
  var body = panel.querySelector('.chat-body');
  var form = panel.querySelector('.chat-form');
  var input = form.querySelector('input');
  var WA = 'https://wa.me/923074755518';
  var waIcon = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M17.5 14.4c-.3-.1-1.8-.9-2-1s-.5-.1-.7.1-.8 1-.9 1.2-.3.2-.6.1a8.2 8.2 0 0 1-4-3.5c-.3-.5.3-.5.9-1.6.1-.2 0-.4 0-.5l-.9-2.2c-.2-.6-.5-.5-.7-.5h-.6a1.2 1.2 0 0 0-.9.4 3.6 3.6 0 0 0-1.1 2.7 6.3 6.3 0 0 0 1.3 3.3 14.4 14.4 0 0 0 5.5 4.9c2 .9 2.8.9 3.8.8a3.3 3.3 0 0 0 2.2-1.5 2.7 2.7 0 0 0 .2-1.5c-.1-.1-.3-.2-.5-.3zM12 21.8a9.8 9.8 0 0 1-5-1.4l-.4-.2-3.7 1 1-3.6-.2-.4A9.8 9.8 0 1 1 12 21.8zM12 0a12 12 0 0 0-10.3 18L0 24l6.2-1.6A12 12 0 1 0 12 0z"/></svg>';
  function waBtn(text) {
    var href = WA + (text ? '?text=' + encodeURIComponent(text) : '');
    return '<br><a class="wa-btn" href="' + href + '" target="_blank" rel="noopener">' + waIcon + 'Chat on WhatsApp</a>';
  }
  var replies = {
    hello: 'Hi! I can answer quick questions about Bilal\'s services, timelines and how to start a project. What do you need help with?',
    services: 'Bilal offers: Shopify stores, WordPress & WooCommerce websites, full stack web apps, mobile apps, GoHighLevel funnels, graphic design & UI/UX, video editing, SEO & speed, Excel & data entry, and domains & hosting. <a href="/services.html">See all services</a>',
    price: 'Every project is quoted after a quick chat, so you only pay for what you actually need. Share a few lines about your project and you will get a clear price.' + waBtn('Hi Bilal, I would like a quote for my project.'),
    time: 'It depends on the scope. A landing page is quick, a full store or web app takes longer. You get a clear timeline before any work starts, with progress updates on WhatsApp.',
    work: 'You can see live websites Bilal has built, including Shopify stores, business sites and healthcare platforms. <a href="/portfolio.html">Open the portfolio</a>',
    shopify: 'Yes, Shopify is one of Bilal\'s main platforms: custom themes, store setup, product listings, apps, payments and speed optimisation, including large stores.' + waBtn('Hi Bilal, I need help with a Shopify store.'),
    wordpress: 'Yes. WordPress, Elementor and WooCommerce websites, plus bug fixing, speed and Rank Math or Yoast SEO setup.' + waBtn('Hi Bilal, I need a WordPress website.'),
    app: 'Yes, Bilal builds Android and iOS apps with Flutter, with Firebase or custom backends.' + waBtn('Hi Bilal, I want to build a mobile app.'),
    design: 'Yes: logos, brand identity, social media posts, banners and website or app UI in Figma.' + waBtn('Hi Bilal, I need graphic design work.'),
    video: 'Yes: reels, TikTok, YouTube videos and ads with captions, motion graphics and colour grading.' + waBtn('Hi Bilal, I need video editing.'),
    seo: 'Yes: on-page and technical SEO, Rank Math, PageSpeed fixes, Google Analytics and Search Console setup.' + waBtn('Hi Bilal, I need SEO for my website.'),
    contact: 'The fastest way is WhatsApp: +92 307 4755518. You can also email bilalrajpoot55518@gmail.com.' + waBtn(''),
    fallback: 'Good question! Bilal can answer that directly. Send a message on WhatsApp and you will get a reply soon.' + waBtn('')
  };
  var rules = [
    [/\b(hi|hello|hey|salam|assalam|aoa)\b/i, 'hello'],
    [/price|cost|quote|budget|rate|charges|kitne|paise|how much/i, 'price'],
    [/time|long|days|deadline|when|kab/i, 'time'],
    [/portfolio|work|project|example|sample/i, 'work'],
    [/shopify|store|ecommerce|e-commerce/i, 'shopify'],
    [/wordpress|woocommerce|elementor|wp\b/i, 'wordpress'],
    [/app|android|ios|flutter|mobile/i, 'app'],
    [/logo|design|graphic|figma|ui|ux|brand/i, 'design'],
    [/video|edit|reel|youtube|tiktok/i, 'video'],
    [/seo|google|rank|speed|marketing/i, 'seo'],
    [/service|offer|do you|kya/i, 'services'],
    [/contact|whatsapp|call|phone|email|number/i, 'contact']
  ];
  function scroll() { body.scrollTop = body.scrollHeight; }
  function add(html, who) {
    var d = document.createElement('div');
    d.className = 'msg ' + who;
    if (who === 'me') d.textContent = html; else d.innerHTML = html;
    body.appendChild(d); scroll();
  }
  function quick(list) {
    var q = document.createElement('div'); q.className = 'quick';
    list.forEach(function (it) {
      var b = document.createElement('button'); b.type = 'button'; b.textContent = it[0];
      b.addEventListener('click', function () { q.remove(); ask(it[0], it[1]); });
      q.appendChild(b);
    });
    body.appendChild(q); scroll();
  }
  function botSay(key) {
    var t = document.createElement('div'); t.className = 'typing'; t.innerHTML = '<i></i><i></i><i></i>';
    body.appendChild(t); scroll();
    setTimeout(function () {
      t.remove(); add(replies[key] || replies.fallback, 'bot');
      if (key !== 'contact') quick([['Services', 'services'], ['Get a quote', 'price'], ['Portfolio', 'work'], ['Talk on WhatsApp', 'contact']]);
    }, 650);
  }
  function ask(text, key) {
    add(text, 'me');
    if (!key) { key = 'fallback'; for (var i = 0; i < rules.length; i++) { if (rules[i][0].test(text)) { key = rules[i][1]; break; } } }
    botSay(key);
  }
  var started = false;
  function open(state) {
    var on = document.documentElement.classList.toggle('chat-open', state);
    fab.setAttribute('aria-expanded', on);
    if (on && !started) {
      started = true;
      add('Hi! 👋 I am Bilal\'s assistant. Ask me anything about websites, Shopify, apps, design or video, or pick an option below.', 'bot');
      quick([['What services do you offer?', 'services'], ['How much does it cost?', 'price'], ['How long does it take?', 'time'], ['Show me your work', 'work'], ['Talk on WhatsApp', 'contact']]);
    }
    if (on) setTimeout(function () { input.focus({ preventScroll: true }); }, 250);
  }
  fab.addEventListener('click', function () { open(); });
  panel.querySelector('.chat-close').addEventListener('click', function () { open(false); });
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var v = input.value.trim(); if (!v) return;
    input.value = ''; ask(v);
  });
})();

/* lazy background videos */
(function () {
  var vids = document.querySelectorAll('video[data-src]');
  if (!vids.length) return;
  var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  var save = navigator.connection && navigator.connection.saveData;
  if (reduce || save) return;
  function load(v) {
    if (v.dataset.loaded) return;
    var src = (v.dataset.srcSm && innerWidth < 768) ? v.dataset.srcSm : v.dataset.src;
    v.src = src; v.dataset.loaded = 1;
  }
  function play(v) { var p = v.play(); if (p && p.catch) p.catch(function () {}); }
  var io = new IntersectionObserver(function (es) {
    es.forEach(function (e) {
      var v = e.target, box = v.closest('.reel');
      if (e.isIntersecting) {
        load(v);
        if (!(box && box.classList.contains('paused'))) play(v);
      } else if (v.dataset.loaded) { v.pause(); }
    });
  }, { rootMargin: '200px 0px' });
  function start() { vids.forEach(function (v) { io.observe(v); }); }
  if (document.readyState === 'complete') setTimeout(start, 400);
  else window.addEventListener('load', function () { setTimeout(start, 400); });
  document.querySelectorAll('.reel-toggle').forEach(function (b) {
    b.addEventListener('click', function () {
      var box = b.closest('.reel'), v = box.querySelector('video');
      if (box.classList.toggle('paused')) { v.pause(); b.setAttribute('aria-label', 'Play video'); }
      else { load(v); play(v); b.setAttribute('aria-label', 'Pause video'); }
    });
  });
})();
