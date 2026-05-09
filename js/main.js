    document.addEventListener('DOMContentLoaded', () => {

    /* DARK MODE */
    const html = document.documentElement;
    const themeToggle = document.getElementById('themeToggle');
    const STORAGE_KEY = 'nr-theme';

    // Load saved or system preference
    const saved = localStorage.getItem(STORAGE_KEY);
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    let isDark = saved ? saved === 'dark' : prefersDark;

    function applyTheme(dark) {
        html.setAttribute('data-theme', dark ? 'dark' : 'light');
        const icon = themeToggle?.querySelector('.theme-icon');
        if (icon) icon.textContent = dark ? '☀' : '☾';
        isDark = dark;
        localStorage.setItem(STORAGE_KEY, dark ? 'dark' : 'light');
    }

    applyTheme(isDark);

    themeToggle?.addEventListener('click', () => applyTheme(!isDark));

    /* NAVBAR SCROLL EFFECT */
    const navbar = document.getElementById('navbar');

    function handleScroll() {
        if (!navbar) return;
        navbar.classList.toggle('scrolled', window.scrollY > 20);
    }

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // run once on load

    /* HAMBURGER MENU */
    const hamburger = document.getElementById('hamburger');
    const navLinks  = document.getElementById('navLinks');

    function closeMenu() {
        navLinks?.classList.remove('open');
        hamburger?.classList.remove('open');
        hamburger?.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
    }

    hamburger?.addEventListener('click', () => {
        const isOpen = navLinks.classList.toggle('open');
        hamburger.classList.toggle('open', isOpen);
        hamburger.setAttribute('aria-expanded', String(isOpen));
        document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    // Close on any nav-link click
    navLinks?.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', closeMenu);
    });

    // Close on outside click
    document.addEventListener('click', e => {
        if (
        navLinks?.classList.contains('open') &&
        !navLinks.contains(e.target) &&
        !hamburger?.contains(e.target)
        ) {
        closeMenu();
        }
    });

    // Close on Escape key
    document.addEventListener('keydown', e => {
        if (e.key === 'Escape') closeMenu();
    });

    /* SCROLL REVEAL */
    const revealEls = document.querySelectorAll('.reveal');

    if (revealEls.length) {
        if ('IntersectionObserver' in window) {
        const obs = new IntersectionObserver(entries => {
            entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                obs.unobserve(entry.target);
            }
            });
        }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

        revealEls.forEach(el => obs.observe(el));
        } else {
        // Fallback for older browsers
        revealEls.forEach(el => el.classList.add('visible'));
        }
    }

    /* TYPING ANIMATION  (index.html) */
    const typingTarget = document.querySelector('.typing-target');
    if (typingTarget) {
        const phrases = ['Software Engineer.', 'Backend Developer.', 'AI Enthusiast.'];
        let pi = 0, ci = 0, deleting = false;

        function typeLoop() {
        const phrase = phrases[pi];
        typingTarget.textContent = deleting
            ? phrase.substring(0, ci - 1)
            : phrase.substring(0, ci + 1);

        deleting ? ci-- : ci++;

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

    /* GALLERY FILTER */
    const filterBtns = document.querySelectorAll('.filter-btn');
    const masonryItems = document.querySelectorAll('.masonry-item');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', function () {
        filterBtns.forEach(b => b.classList.remove('active'));
        this.classList.add('active');

        const filter = this.dataset.filter;

        masonryItems.forEach(item => {
            const cat = item.dataset.category;
            const show = filter === 'all' || cat === filter;
            item.style.opacity    = show ? '1' : '0';
            item.style.transform  = show ? 'scale(1)' : 'scale(0.92)';

            // Delay hiding so transition plays
            if (show) {
            item.classList.remove('hidden');
            } else {
            setTimeout(() => item.classList.add('hidden'), 280);
            }
        });
        });
    });

    /* LIGHTBOX */
    let currentIdx   = 0;
    let visibleItems = [];

    const lightbox        = document.getElementById('lightbox');
    const lightboxImgWrap = document.getElementById('lightboxImgWrap');
    const lightboxBackdrop= document.getElementById('lightboxBackdrop');
    const lightboxClose   = document.getElementById('lightboxClose');
    const lightboxTitle   = document.getElementById('lightboxTitle');
    const lightboxDesc    = document.getElementById('lightboxDesc');
    const lightboxNext    = document.getElementById('lightboxNext');
    const lightboxPrev    = document.getElementById('lightboxPrev');

    function showLightbox(idx) {
        const item = visibleItems[idx];
        if (!item) return;

        const src   = item.dataset.src  || '';
        const title = item.querySelector('h3')?.textContent || '';
        const desc  = item.dataset.desc || '';

        lightboxImgWrap.innerHTML = src
        ? `<img src="${src}" alt="${title}">`
        : `<div style="padding:3rem;color:#fff;font-style:italic">Tidak ada gambar</div>`;

        if (lightboxTitle) lightboxTitle.textContent = title;
        if (lightboxDesc)  lightboxDesc.textContent  = desc;
        currentIdx = idx;
    }

    function openLightbox(idx) {
        visibleItems = Array.from(document.querySelectorAll('.masonry-item:not(.hidden)'));
        showLightbox(idx);
        lightbox?.classList.add('open');
        lightboxBackdrop?.classList.add('open');
        document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
        lightbox?.classList.remove('open');
        lightboxBackdrop?.classList.remove('open');
        document.body.style.overflow = '';
    }

    const grid = document.getElementById('masonryGrid');
    grid?.addEventListener('click', e => {
        const item = e.target.closest('.masonry-item');
        if (!item) return;
        visibleItems = Array.from(document.querySelectorAll('.masonry-item:not(.hidden)'));
        openLightbox(visibleItems.indexOf(item));
    });

    lightboxClose?.addEventListener('click', closeLightbox);
    lightboxBackdrop?.addEventListener('click', closeLightbox);

    lightboxNext?.addEventListener('click', e => {
        e.stopPropagation();
        showLightbox((currentIdx + 1) % visibleItems.length);
    });
    lightboxPrev?.addEventListener('click', e => {
        e.stopPropagation();
        showLightbox((currentIdx - 1 + visibleItems.length) % visibleItems.length);
    });

    document.addEventListener('keydown', e => {
        if (!lightbox?.classList.contains('open')) return;
        if (e.key === 'ArrowRight') lightboxNext?.click();
        if (e.key === 'ArrowLeft')  lightboxPrev?.click();
        if (e.key === 'Escape')     closeLightbox();
    });

    // Touch swipe for lightbox
    let touchStartX = 0;
    lightbox?.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
    lightbox?.addEventListener('touchend',   e => {
        const dx = e.changedTouches[0].clientX - touchStartX;
        if (Math.abs(dx) > 60) dx < 0 ? lightboxNext?.click() : lightboxPrev?.click();
    }, { passive: true });

    /* WEATHER (AJAX)  */
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

    /* RANDOM QUOTE (AJAX) */
    const quoteText   = document.getElementById('quote-text');
    const quoteAuthor = document.getElementById('quote-author');

    async function fetchQuote() {
        try {
        const proxy = 'https://api.allorigins.win/get?url=' +
            encodeURIComponent('https://zenquotes.io/api/random');
        const res  = await fetch(proxy);
        const data = await res.json();
        const q    = JSON.parse(data.contents)[0];
        if (quoteText)   quoteText.textContent   = `"${q.q}"`;
        if (quoteAuthor) quoteAuthor.textContent = `— ${q.a}`;
        } catch {
        if (quoteText)   quoteText.textContent   = '"Teruslah melangkah, apa pun tantangannya."';
        if (quoteAuthor) quoteAuthor.textContent = '— Anonim';
        }
    }

    if (quoteText) fetchQuote();

    const quoteBtn = document.getElementById('new-quote-btn');
    quoteBtn?.addEventListener('click', fetchQuote);

    });