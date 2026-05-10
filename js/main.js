document.addEventListener('DOMContentLoaded', () => {

  /* 1. HAMBURGER MENU */
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('navLinks');

  function openMenu() {
    navLinks.classList.add('open');
    hamburger.classList.add('open');
    hamburger.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden'; 
  }

  function closeMenu() {
    navLinks.classList.remove('open');
    hamburger.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  if (hamburger && navLinks) {
    hamburger.addEventListener('click', (e) => {
      e.stopPropagation();
      if (navLinks.classList.contains('open')) {
        closeMenu();
      } else {
        openMenu();
      }
    });

    navLinks.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', closeMenu);
    });

    document.addEventListener('click', (e) => {
      const navbar = document.getElementById('navbar');
      if (navLinks.classList.contains('open') && navbar && !navbar.contains(e.target)) {
        closeMenu();
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && navLinks.classList.contains('open')) {
        closeMenu();
      }
    });
  }

  /* 2. NAVBAR SCROLL EFFECT */
  const navbar = document.getElementById('navbar');

  function handleScroll() {
    if (!navbar) return;
    if (window.scrollY > 20) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll(); 

  /* 3. DARK MODE */
  const html = document.documentElement;
  const themeToggle = document.getElementById('themeToggle');
  const STORAGE_KEY = 'nr-theme';

  const saved      = localStorage.getItem(STORAGE_KEY);
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  let isDark = saved ? (saved === 'dark') : prefersDark;

  function applyTheme(dark) {
    html.setAttribute('data-theme', dark ? 'dark' : 'light');
    const icon = themeToggle ? themeToggle.querySelector('.theme-icon') : null;
    if (icon) icon.textContent = dark ? '☀' : '☾';
    isDark = dark;
    localStorage.setItem(STORAGE_KEY, dark ? 'dark' : 'light');
  }

  applyTheme(isDark);

  if (themeToggle) {
    themeToggle.addEventListener('click', () => applyTheme(!isDark));
  }

  /* 4. SCROLL REVEAL */
  const revealEls = document.querySelectorAll('.reveal');

  if (revealEls.length) {
    if ('IntersectionObserver' in window) {
      const obs = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            obs.unobserve(entry.target);
          }
        });
      }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

      revealEls.forEach(el => obs.observe(el));
    } else {

      function revealFallback() {
        revealEls.forEach(el => {
          const top = el.getBoundingClientRect().top;
          if (top < window.innerHeight - 80) {
            el.classList.add('visible');
          }
        });
      }
      window.addEventListener('scroll', revealFallback, { passive: true });
      revealFallback();
    }
  }

  /* 5. TYPING ANIMATION (index.html) */
  const typingTarget = document.querySelector('.typing-target');
  if (typingTarget) {
    const phrases = ['Software Engineer.', 'BackEnd Developer.', 'AI Enthusiast.'];
    let pi = 0, ci = 0, deleting = false;

    function typeLoop() {
      const phrase = phrases[pi];

      if (deleting) {
        typingTarget.textContent = phrase.substring(0, ci - 1);
        ci--;
      } else {
        typingTarget.textContent = phrase.substring(0, ci + 1);
        ci++;
      }

      let speed = deleting ? 50 : 100;

      if (!deleting && ci === phrase.length) {
        deleting = true;
        speed = 2000;
      } else if (deleting && ci === 0) {
        deleting = false;
        pi = (pi + 1) % phrases.length;
        speed = 500;
      }

      setTimeout(typeLoop, speed);
    }

    setTimeout(typeLoop, 600);
  }

  /* 6. GALLERY FILTER (gallery.html) */
  const filterBtns   = document.querySelectorAll('.filter-btn');
  const masonryItems = document.querySelectorAll('.masonry-item');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', function () {
      filterBtns.forEach(b => b.classList.remove('active'));
      this.classList.add('active');

      const filter = this.dataset.filter;

      masonryItems.forEach(item => {
        const cat  = item.dataset.category;
        const show = filter === 'all' || cat === filter;

        if (show) {
          item.style.opacity   = '1';
          item.style.transform = 'scale(1)';
          item.classList.remove('hidden');
        } else {
          item.style.opacity   = '0';
          item.style.transform = 'scale(0.92)';
          setTimeout(() => item.classList.add('hidden'), 280);
        }
      });
    });
  });

  /* 7. LIGHTBOX (gallery.html) */
  let currentIdx   = 0;
  let visibleItems = [];

  const lightbox         = document.getElementById('lightbox');
  const lightboxImgWrap  = document.getElementById('lightboxImgWrap');
  const lightboxBackdrop = document.getElementById('lightboxBackdrop');
  const lightboxClose    = document.getElementById('lightboxClose');
  const lightboxTitle    = document.getElementById('lightboxTitle');
  const lightboxDesc     = document.getElementById('lightboxDesc');
  const lightboxNext     = document.getElementById('lightboxNext');
  const lightboxPrev     = document.getElementById('lightboxPrev');

  function showInLightbox(idx) {
    const item = visibleItems[idx];
    if (!item) return;

    const src   = item.dataset.src  || '';
    const title = item.dataset.title || item.querySelector('h3')?.textContent || '';
    const desc  = item.dataset.desc  || '';

    if (lightboxImgWrap) {
      lightboxImgWrap.innerHTML = src
        ? `<img src="${src}" alt="${title}" style="width:100%;height:auto;max-height:70vh;object-fit:contain;">`
        : `<div style="padding:3rem;color:#fff;text-align:center;font-style:italic">Gambar tidak tersedia</div>`;
    }

    if (lightboxTitle) lightboxTitle.textContent = title;
    if (lightboxDesc)  lightboxDesc.textContent  = desc;
    currentIdx = idx;
  }

  function openLightbox(idx) {
    visibleItems = Array.from(document.querySelectorAll('.masonry-item:not(.hidden)'));
    showInLightbox(idx);
    lightbox?.classList.add('open');
    lightboxBackdrop?.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightbox?.classList.remove('open');
    lightboxBackdrop?.classList.remove('open');
    document.body.style.overflow = '';
  }

  const masonryGrid = document.getElementById('masonryGrid');
  masonryGrid?.addEventListener('click', (e) => {
    const item = e.target.closest('.masonry-item');
    if (!item) return;
    visibleItems = Array.from(document.querySelectorAll('.masonry-item:not(.hidden)'));
    openLightbox(visibleItems.indexOf(item));
  });

  lightboxClose?.addEventListener('click', closeLightbox);
  lightboxBackdrop?.addEventListener('click', closeLightbox);

  lightboxNext?.addEventListener('click', (e) => {
    e.stopPropagation();
    if (visibleItems.length > 1) showInLightbox((currentIdx + 1) % visibleItems.length);
  });

  lightboxPrev?.addEventListener('click', (e) => {
    e.stopPropagation();
    if (visibleItems.length > 1) showInLightbox((currentIdx - 1 + visibleItems.length) % visibleItems.length);
  });

  document.addEventListener('keydown', (e) => {
    if (!lightbox?.classList.contains('open')) return;
    if (e.key === 'ArrowRight') lightboxNext?.click();
    if (e.key === 'ArrowLeft')  lightboxPrev?.click();
    if (e.key === 'Escape')     closeLightbox();
  });

  // Swipe touch untuk lightbox
  let touchStartX = 0;
  lightbox?.addEventListener('touchstart', e => {
    touchStartX = e.touches[0].clientX;
  }, { passive: true });
  lightbox?.addEventListener('touchend', e => {
    const dx = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(dx) > 60) {
      dx < 0 ? lightboxNext?.click() : lightboxPrev?.click();
    }
  }, { passive: true });

  /* 8. WEATHER (AJAX) index.html */
  const tempEl = document.getElementById('weather-temp');
  if (tempEl) {
    const API_KEY = '457b71f4611fb73fcd91272cc2b1b654';
    const url = `https://api.openweathermap.org/data/2.5/weather?q=Manado&appid=${API_KEY}&units=metric`;

    fetch(url)
      .then(r => {
        if (!r.ok) throw new Error('Weather fetch failed');
        return r.json();
      })
      .then(data => {
        tempEl.textContent = `${Math.round(data.main.temp)}°C`;
        tempEl.title = `${data.name}: ${data.weather[0].description}`;
      })
      .catch(() => {
        tempEl.textContent = '--°C';
      });
  }

  /* 9. RANDOM QUOTE (AJAX) index.html */
  const quoteTextEl   = document.getElementById('quote-text');
  const quoteAuthorEl = document.getElementById('quote-author');

  async function fetchQuote() {
    try {
      const proxy = 'https://api.allorigins.win/get?url=' +
        encodeURIComponent('https://zenquotes.io/api/random');
      const res  = await fetch(proxy);
      const data = await res.json();
      const q    = JSON.parse(data.contents)[0];
      if (quoteTextEl)   quoteTextEl.textContent   = `"${q.q}"`;
      if (quoteAuthorEl) quoteAuthorEl.textContent = `— ${q.a}`;
    } catch {
      if (quoteTextEl)   quoteTextEl.textContent   = '"Teruslah melangkah, apa pun tantangannya."';
      if (quoteAuthorEl) quoteAuthorEl.textContent = '— Anonim';
    }
  }

  if (quoteTextEl) fetchQuote();

  const quoteBtn = document.getElementById('new-quote-btn');
  quoteBtn?.addEventListener('click', fetchQuote);

/* 10. CUSTOM CURSOR */
const cursor = document.getElementById('custom-cursor');
if (cursor) {
  document.addEventListener('mousemove', (e) => {
    cursor.style.left = e.clientX + 'px';
    cursor.style.top  = e.clientY + 'px';
  });

  const clickables = document.querySelectorAll('a, button, [role="button"]');
  clickables.forEach(el => {
    el.addEventListener('mouseenter', () => cursor.style.transform = 'translate(-50%, -50%) scale(1.3)');
    el.addEventListener('mouseleave', () => cursor.style.transform = 'translate(-50%, -50%) scale(1)');
  });

  document.addEventListener('mouseleave', () => cursor.style.opacity = '0');
  document.addEventListener('mouseenter', () => cursor.style.opacity = '1');
}
  
}); 