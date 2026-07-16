/* ============================================================
   PhysixLab — lessons.js
   Reads ?topic= from the URL, pulls data from PHYSIXLAB_DATA
   (js/data.js), and renders the topic header + lesson cards.
   ============================================================ */

(function () {
  'use strict';

  const CLOCK_ICON = '<svg viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.6"/><path d="M12 7v5l3.5 2" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>';

  function getTopicKeyFromURL() {
    const params = new URLSearchParams(window.location.search);
    return params.get('topic');
  }

  function renderTopicHeader(topic, topicKey) {
    const header = document.getElementById('topicHeader');
    if (!header) return;

    header.style.setProperty('--accent', topic.accent);
    header.innerHTML = `
      <div class="topic-header-inner">
        <div class="topic-header-icon" aria-hidden="true">${topic.icon}</div>
        <div class="topic-header-text">
          <span class="topic-header-eyebrow">Physics Branch</span>
          <h1>${topic.name}</h1>
          <p>${topic.description}</p>
        </div>
        <div class="topic-header-count">
          <span class="num">${topic.lessons.length}</span>
          <span class="label">Lessons</span>
        </div>
      </div>
    `;

    document.title = `${topic.name} Lessons — PhysixLab`;
  }

  function renderLessonCards(topic, topicKey) {
    const grid = document.getElementById('lessonsGrid');
    if (!grid) return;

    grid.innerHTML = topic.lessons.map((lesson) => {
      const difficultyClass = lesson.difficulty.toLowerCase();
      const href = `lesson-viewer.html?topic=${encodeURIComponent(topicKey)}&lesson=${lesson.number}`;

      return `
        <a class="lesson-card" style="--accent:${topic.accent}" href="${href}" data-lesson="${lesson.number}">
          <div class="lesson-card-top">
            <span class="lesson-number">${String(lesson.number).padStart(2, '0')}</span>
            <span class="badge-3d">3D</span>
          </div>
          <h3>${lesson.title}</h3>
          <p>${lesson.description}</p>
          <div class="lesson-meta">
            <span class="difficulty-badge ${difficultyClass}">${lesson.difficulty}</span>
            <span class="duration-tag">${CLOCK_ICON} ${lesson.duration}</span>
          </div>
        </a>
      `;
    }).join('');

    /* Staggered entrance animation via IntersectionObserver */
    const cards = grid.querySelectorAll('.lesson-card');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const idx = Array.from(cards).indexOf(entry.target);
          entry.target.style.transitionDelay = `${Math.min(idx * 60, 480)}ms`;
          entry.target.classList.add('in-view');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    cards.forEach((card) => observer.observe(card));
  }

  function showEmptyState() {
    const header = document.getElementById('topicHeader');
    const grid = document.getElementById('lessonsGrid');
    const empty = document.getElementById('emptyState');
    const backLink = document.getElementById('backLink');

    if (header) header.remove();
    if (grid) grid.hidden = true;
    if (empty) empty.hidden = false;
    if (backLink) backLink.classList.add('in-view');

    document.title = 'Topic not found — PhysixLab';
  }

  function init() {
    const topicKey = getTopicKeyFromURL();
    const data = window.PHYSIXLAB_DATA || {};
    const topic = topicKey ? data[topicKey] : null;

    if (!topic) {
      showEmptyState();
      return;
    }

    renderTopicHeader(topic, topicKey);
    renderLessonCards(topic, topicKey);

    const backLink = document.getElementById('backLink');
    if (backLink) backLink.classList.add('in-view');
  }

  document.addEventListener('DOMContentLoaded', init);
})();
