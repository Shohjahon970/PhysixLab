/* ============================================================
   PhysixLab — lesson-viewer.js
   Reads ?topic=&lesson= from the URL, renders the theory panel
   from PHYSIXLAB_DATA, wires up Previous/Next navigation, and
   hands off to js/simulations.js to boot the 3D scene.
   ============================================================ */

(function () {
  'use strict';

  function getParams() {
    const params = new URLSearchParams(window.location.search);
    return {
      topicKey: params.get('topic'),
      lessonNum: parseInt(params.get('lesson'), 10) || 1
    };
  }

  function renderTheory(topic, lesson) {
    const el = document.getElementById('lessonTheory');
    if (!el) return;

    const content = lesson.content;
    const difficultyClass = lesson.difficulty.toLowerCase();

    let sectionsHTML = '';
    let formulasHTML = '';
    let introHTML = `<p class="lesson-intro">${lesson.description}</p>`;

    if (content) {
      introHTML = `<p class="lesson-intro">${content.intro}</p>`;
      sectionsHTML = content.sections.map((s) => `
        <div class="theory-section">
          <h2>${s.heading}</h2>
          <p>${s.body}</p>
        </div>
      `).join('');
      formulasHTML = `
        <div class="formula-boxes">
          ${content.formulas.map((f) => `
            <div class="formula-box">
              <span class="label">${f.label}</span>
              <span class="expr">${f.expr}</span>
            </div>
          `).join('')}
        </div>
      `;
    } else {
      sectionsHTML = `
        <div class="theory-section">
          <h2>Coming soon</h2>
          <p>The full written lesson and simulation for this topic are still being built. Check back soon — for now, explore the Newton's Laws lesson in Mechanics for a fully working 3D simulation.</p>
        </div>
      `;
    }

    el.innerHTML = `
      <span class="lesson-eyebrow">
        ${topic.name} · Lesson ${lesson.number}
        <span class="difficulty-badge ${difficultyClass}">${lesson.difficulty}</span>
      </span>
      <h1>${lesson.title}</h1>
      ${introHTML}
      ${sectionsHTML}
      ${formulasHTML}
    `;

    document.title = `${lesson.title} — PhysixLab`;
  }

  function renderNav(topic, topicKey, lesson) {
    const prevBtn = document.getElementById('prevLessonBtn');
    const nextBtn = document.getElementById('nextLessonBtn');
    if (!prevBtn || !nextBtn) return;

    const total = topic.lessons.length;

    if (lesson.number > 1) {
      prevBtn.href = `lesson-viewer.html?topic=${topicKey}&lesson=${lesson.number - 1}`;
      prevBtn.classList.remove('disabled');
    } else {
      prevBtn.classList.add('disabled');
      prevBtn.removeAttribute('href');
    }

    if (lesson.number < total) {
      nextBtn.href = `lesson-viewer.html?topic=${topicKey}&lesson=${lesson.number + 1}`;
      nextBtn.classList.remove('disabled');
    } else {
      nextBtn.classList.add('disabled');
      nextBtn.removeAttribute('href');
    }
  }

  function showNotFound() {
    const layout = document.querySelector('.lesson-layout');
    if (!layout) return;
    layout.innerHTML = `
      <div class="lesson-theory" style="grid-column: 1 / -1;">
        <h1>Lesson not found</h1>
        <p class="lesson-intro">We couldn't find that lesson. Head back to the topics to pick one.</p>
        <a href="index.html#topics" class="btn btn-primary">Back to Topics</a>
      </div>
    `;
    const nav = document.getElementById('lessonNav');
    if (nav) nav.remove();
  }

  function init() {
    const { topicKey, lessonNum } = getParams();
    const data = window.PHYSIXLAB_DATA || {};
    const topic = topicKey ? data[topicKey] : null;
    const lesson = topic ? topic.lessons.find((l) => l.number === lessonNum) : null;

    if (!topic || !lesson) {
      showNotFound();
      return;
    }

    renderTheory(topic, lesson);
    renderNav(topic, topicKey, lesson);

    const backLink = document.getElementById('backLink');
    if (backLink) backLink.href = `lessons.html?topic=${topicKey}`;

    const simKey = lesson.simulationKey;
    if (simKey && window.PhysixSimulations && window.PhysixSimulations[simKey]) {
      window.PhysixSimulations[simKey]({
        canvas: document.getElementById('simCanvas'),
        controlsEl: document.getElementById('simControls'),
        readoutEl: document.getElementById('simReadout'),
        accent: topic.accent
      });
    } else {
      const controlsEl = document.getElementById('simControls');
      const wrap = document.querySelector('.sim-canvas-wrap');
      if (wrap) {
        wrap.innerHTML = `
          <div style="display:flex;align-items:center;justify-content:center;height:100%;color:var(--text-dimmer);font-size:0.9rem;padding:2rem;text-align:center;">
            The 3D simulation for this lesson is coming soon.
          </div>
        `;
      }
      if (controlsEl) controlsEl.remove();
    }
  }

  document.addEventListener('DOMContentLoaded', init);
})();
