/* ============================================================
   PhysixLab — main.js
   Homepage interactions: starfield, navbar, mobile menu,
   scroll reveal, cursor glow, animated counters.
   ============================================================ */

(function () {
  'use strict';

  /* ---------------- Starfield particle background ---------------- */

  function initStarfield() {
    const canvas = document.getElementById('starfield');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let w, h, stars;

    function resize() {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    }

    function makeStars(count) {
      stars = [];
      for (let i = 0; i < count; i++) {
        stars.push({
          x: Math.random() * w,
          y: Math.random() * h,
          r: Math.random() * 1.4 + 0.3,
          speed: Math.random() * 0.15 + 0.02,
          twinkle: Math.random() * Math.PI * 2
        });
      }
    }

    resize();
    makeStars(Math.min(160, Math.floor((w * h) / 9000)));

    window.addEventListener('resize', () => {
      resize();
      makeStars(Math.min(160, Math.floor((w * h) / 9000)));
    });

    function draw() {
      ctx.clearRect(0, 0, w, h);
      for (const s of stars) {
        s.twinkle += 0.02;
        const alpha = 0.4 + Math.sin(s.twinkle) * 0.3;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(200, 225, 255, ${Math.max(0, alpha)})`;
        ctx.fill();
        s.y += s.speed;
        if (s.y > h) { s.y = 0; s.x = Math.random() * w; }
      }
      requestAnimationFrame(draw);
    }
    draw();
  }

  /* ---------------- Cursor-following glow ---------------- */

  function initCursorGlow() {
    const glow = document.getElementById('cursor-glow');
    if (!glow) return;
    if (window.matchMedia('(pointer: coarse)').matches) {
      glow.style.display = 'none';
      return;
    }
    let tx = 0, ty = 0, cx = 0, cy = 0;
    window.addEventListener('mousemove', (e) => {
      tx = e.clientX;
      ty = e.clientY;
    });
    function loop() {
      cx += (tx - cx) * 0.12;
      cy += (ty - cy) * 0.12;
      glow.style.transform = `translate(${cx}px, ${cy}px)`;
      requestAnimationFrame(loop);
    }
    loop();
  }

  /* ---------------- Navbar scroll state ---------------- */

  function initNavbar() {
    const navbar = document.getElementById('navbar');
    if (!navbar) return;
    window.addEventListener('scroll', () => {
      navbar.style.background = window.scrollY > 40
        ? 'rgba(10, 14, 26, 0.85)'
        : 'rgba(10, 14, 26, 0.55)';
    });
  }

  /* ---------------- Mobile hamburger menu ---------------- */

  function initMobileMenu() {
    const hamburger = document.getElementById('hamburger');
    const menu = document.getElementById('mobileMenu');
    if (!hamburger || !menu) return;

    hamburger.addEventListener('click', () => {
      const isOpen = menu.classList.toggle('open');
      hamburger.classList.toggle('active', isOpen);
      hamburger.setAttribute('aria-expanded', String(isOpen));
    });

    menu.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        menu.classList.remove('open');
        hamburger.classList.remove('active');
        hamburger.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ---------------- Scroll reveal via IntersectionObserver ---------------- */

  function initScrollReveal() {
    const items = document.querySelectorAll('.reveal');
    if (!items.length) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          const delay = (entry.target.dataset.delay || i * 60);
          entry.target.style.transitionDelay = `${Math.min(delay, 400)}ms`;
          entry.target.classList.add('in-view');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });

    items.forEach((item) => observer.observe(item));
  }

  /* ---------------- Animated stat counters ---------------- */

  function initCounters() {
    const nums = document.querySelectorAll('.stat-num');
    if (!nums.length) return;

    function animateCount(el) {
      const target = parseInt(el.dataset.target, 10) || 0;
      const suffix = el.dataset.suffix || '';
      const duration = 1400;
      const start = performance.now();

      function tick(now) {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.floor(eased * target) + suffix;
        if (progress < 1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCount(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.6 });

    nums.forEach((n) => observer.observe(n));
  }

  /* ---------------- Card tilt-on-hover ---------------- */

  function initCardTilt() {
    const cards = document.querySelectorAll('.topic-card, .why-card');
    if (!cards.length) return;
    if (window.matchMedia('(pointer: coarse)').matches) return;

    cards.forEach((card) => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const px = (e.clientX - rect.left) / rect.width - 0.5;
        const py = (e.clientY - rect.top) / rect.height - 0.5;
        card.style.transform = `translateY(-8px) rotateX(${py * -6}deg) rotateY(${px * 8}deg)`;
      });
      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
      });
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    initStarfield();
    initCursorGlow();
    initNavbar();
    initMobileMenu();
    initScrollReveal();
    initCounters();
    initCardTilt();
  });
})();
