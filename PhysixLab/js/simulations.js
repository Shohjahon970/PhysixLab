/* ============================================================
   PhysixLab — simulations.js
   All Three.js 3D simulation scenes, keyed by simulationKey and
   exposed on window.PhysixSimulations. Each function receives
   { canvas, controlsEl, readoutEl, accent } and is fully
   self-contained (physics loop, controls, resize handling).

   Currently implemented:
     - 'newtons-laws'  (Mechanics · Newton's Laws of Motion)

   Other branches will register their own keys here as they're
   built (e.g. 'projectile-motion', 'gas-particles', ...).
   ============================================================ */

(function () {
  'use strict';

  const PLAY_ICON = '<svg viewBox="0 0 24 24" fill="none"><path d="M7 5l12 7-12 7V5z" fill="currentColor"/></svg>';
  const PAUSE_ICON = '<svg viewBox="0 0 24 24" fill="none"><rect x="6" y="5" width="4" height="14" fill="currentColor"/><rect x="14" y="5" width="4" height="14" fill="currentColor"/></svg>';
  const RESET_ICON = '<svg viewBox="0 0 24 24" fill="none"><path d="M3 12a9 9 0 1 1 3 6.7" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M3 17v-5h5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';

  /* ============================================================
     NEWTON'S LAWS OF MOTION
     A block on a frictionless track. Mass and applied force are
     tunable; the block accelerates according to F = m·a, coasts
     at constant velocity when F = 0 (first law), and bounces
     elastically off invisible walls to demonstrate the equal-
     and-opposite reaction of the third law.
     ============================================================ */

  function newtonsLawsSimulation({ canvas, controlsEl, readoutEl, accent }) {
    if (typeof THREE === 'undefined' || !canvas) return;

    const accentColor = accent || '#00e5ff';
    const violet = 0x7c4dff;

    /* ---------------- Renderer / scene / camera ---------------- */

    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0x060a14, 14, 34);

    const camera = new THREE.PerspectiveCamera(45, 4 / 3, 0.1, 100);
    camera.position.set(8, 6, 11);

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    function resize() {
      const rect = canvas.parentElement.getBoundingClientRect();
      renderer.setSize(rect.width, rect.height);
      camera.aspect = rect.width / rect.height;
      camera.updateProjectionMatrix();
    }
    resize();
    window.addEventListener('resize', resize);

    const controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;
    controls.minDistance = 6;
    controls.maxDistance = 24;
    controls.maxPolarAngle = Math.PI / 2.05;
    controls.target.set(0, 0.5, 0);

    /* ---------------- Lighting ---------------- */

    scene.add(new THREE.AmbientLight(0x4455aa, 0.7));
    const key = new THREE.DirectionalLight(0xffffff, 0.9);
    key.position.set(6, 10, 6);
    scene.add(key);
    const rim = new THREE.PointLight(0x00e5ff, 0.8, 30);
    rim.position.set(-6, 4, -4);
    scene.add(rim);

    /* ---------------- Track / floor ---------------- */

    const TRACK_HALF = 8;

    const floorGeo = new THREE.PlaneGeometry(24, 10);
    const floorMat = new THREE.MeshStandardMaterial({ color: 0x0d1326, roughness: 0.9, metalness: 0.1 });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -0.5;
    scene.add(floor);

    const grid = new THREE.GridHelper(24, 24, 0x2a3358, 0x1a2140);
    grid.position.y = -0.49;
    scene.add(grid);

    /* Track rail */
    const railGeo = new THREE.BoxGeometry(TRACK_HALF * 2 + 0.6, 0.12, 0.4);
    const railMat = new THREE.MeshStandardMaterial({ color: 0x1a2140, roughness: 0.6 });
    const rail = new THREE.Mesh(railGeo, railMat);
    rail.position.y = -0.05;
    scene.add(rail);

    /* Wall markers at each end */
    [-1, 1].forEach((side) => {
      const wallGeo = new THREE.BoxGeometry(0.25, 1.4, 1.6);
      const wallMat = new THREE.MeshStandardMaterial({
        color: violet,
        emissive: violet,
        emissiveIntensity: 0.35,
        roughness: 0.4
      });
      const wall = new THREE.Mesh(wallGeo, wallMat);
      wall.position.set(side * (TRACK_HALF + 0.5), 0.2, 0);
      scene.add(wall);
    });

    /* ---------------- Block ---------------- */

    const blockGeo = new THREE.BoxGeometry(1, 1, 1);
    const blockMat = new THREE.MeshStandardMaterial({
      color: accentColor,
      emissive: accentColor,
      emissiveIntensity: 0.25,
      roughness: 0.35,
      metalness: 0.2
    });
    const block = new THREE.Mesh(blockGeo, blockMat);
    block.position.set(0, 0.1, 0);
    scene.add(block);

    const blockGlowGeo = new THREE.BoxGeometry(1.25, 1.25, 1.25);
    const blockGlowMat = new THREE.MeshBasicMaterial({ color: accentColor, transparent: true, opacity: 0.12 });
    const blockGlow = new THREE.Mesh(blockGlowGeo, blockGlowMat);
    block.add(blockGlow);

    /* ---------------- Force & velocity arrows ---------------- */

    const forceArrow = new THREE.ArrowHelper(
      new THREE.Vector3(1, 0, 0), new THREE.Vector3(0, 0.6, 0), 1, 0xffd54f, 0.35, 0.22
    );
    scene.add(forceArrow);

    const velocityArrow = new THREE.ArrowHelper(
      new THREE.Vector3(1, 0, 0), new THREE.Vector3(0, 1.3, 0), 0.001, 0x00e676, 0.3, 0.18
    );
    scene.add(velocityArrow);

    /* ---------------- Trail ---------------- */

    const MAX_TRAIL = 120;
    const trailPositions = new Float32Array(MAX_TRAIL * 3);
    const trailGeo = new THREE.BufferGeometry();
    trailGeo.setAttribute('position', new THREE.BufferAttribute(trailPositions, 3));
    const trailMat = new THREE.LineBasicMaterial({ color: accentColor, transparent: true, opacity: 0.4 });
    const trailLine = new THREE.Line(trailGeo, trailMat);
    scene.add(trailLine);
    let trailPoints = [];

    /* ---------------- Physics state ---------------- */

    const state = {
      mass: 2,
      force: 10,
      x: 0,
      v: 0,
      playing: true,
      flashTimer: 0,
      flashText: ''
    };

    function resetPhysics() {
      state.x = 0;
      state.v = 0;
      trailPoints = [];
      state.flashTimer = 0;
    }

    /* ---------------- Controls UI ---------------- */

    controlsEl.innerHTML = `
      <div class="sim-buttons">
        <button type="button" class="sim-btn primary" id="simPlayPause" aria-label="Play or pause simulation">
          ${PAUSE_ICON}<span>Pause</span>
        </button>
        <button type="button" class="sim-btn" id="simReset" aria-label="Reset simulation">
          ${RESET_ICON}<span>Reset</span>
        </button>
      </div>
      <div class="sim-sliders">
        <div class="sim-slider-row">
          <label for="simMass">Mass <span class="slider-val" id="massVal">2.0 kg</span></label>
          <input type="range" id="simMass" min="1" max="10" step="0.5" value="2">
        </div>
        <div class="sim-slider-row">
          <label for="simForce">Applied Force <span class="slider-val" id="forceVal">10 N</span></label>
          <input type="range" id="simForce" min="-30" max="30" step="1" value="10">
        </div>
      </div>
      <p class="sim-hint">Drag to orbit, scroll to zoom. Set force to 0 to see the First Law: the block keeps whatever velocity it already had. Change mass to feel the Second Law. Watch it bounce off the glowing walls for the Third Law.</p>
    `;

    const playPauseBtn = controlsEl.querySelector('#simPlayPause');
    const resetBtn = controlsEl.querySelector('#simReset');
    const massSlider = controlsEl.querySelector('#simMass');
    const forceSlider = controlsEl.querySelector('#simForce');
    const massVal = controlsEl.querySelector('#massVal');
    const forceVal = controlsEl.querySelector('#forceVal');

    playPauseBtn.addEventListener('click', () => {
      state.playing = !state.playing;
      playPauseBtn.innerHTML = state.playing
        ? `${PAUSE_ICON}<span>Pause</span>`
        : `${PLAY_ICON}<span>Play</span>`;
    });

    resetBtn.addEventListener('click', () => {
      resetPhysics();
    });

    massSlider.addEventListener('input', () => {
      state.mass = parseFloat(massSlider.value);
      massVal.textContent = `${state.mass.toFixed(1)} kg`;
    });

    forceSlider.addEventListener('input', () => {
      state.force = parseFloat(forceSlider.value);
      forceVal.textContent = `${state.force} N`;
    });

    /* ---------------- Animation loop ---------------- */

    const clock = new THREE.Clock();
    let rafId;

    function updateReadout(acceleration) {
      if (!readoutEl) return;
      let flashHTML = '';
      if (state.flashTimer > 0) {
        flashHTML = `<div class="row flash">${state.flashText}</div>`;
        state.flashTimer -= 1;
      }
      readoutEl.innerHTML = `
        <div class="row">a = <span class="val">${acceleration.toFixed(2)} m/s²</span></div>
        <div class="row">v = <span class="val">${state.v.toFixed(2)} m/s</span></div>
        <div class="row">x = <span class="val">${state.x.toFixed(2)} m</span></div>
        ${flashHTML}
      `;
    }

    function animate() {
      rafId = requestAnimationFrame(animate);
      const dt = Math.min(clock.getDelta(), 0.05);

      const acceleration = state.mass > 0 ? state.force / state.mass : 0;

      if (state.playing) {
        state.v += acceleration * dt;
        state.x += state.v * dt;

        if (state.x > TRACK_HALF) {
          state.x = TRACK_HALF;
          state.v = -state.v * 0.85;
          state.flashTimer = 45;
          state.flashText = "Wall pushes back — Newton's 3rd Law!";
        } else if (state.x < -TRACK_HALF) {
          state.x = -TRACK_HALF;
          state.v = -state.v * 0.85;
          state.flashTimer = 45;
          state.flashText = "Wall pushes back — Newton's 3rd Law!";
        }

        trailPoints.push(state.x);
        if (trailPoints.length > MAX_TRAIL) trailPoints.shift();
      }

      block.position.x = state.x;
      blockGlow.material.opacity = 0.08 + Math.abs(state.v) * 0.01;

      /* Force arrow: length/direction reflect applied force */
      const forceLen = Math.min(Math.abs(state.force) / 10, 2.4) || 0.001;
      forceArrow.setLength(forceLen, 0.3, 0.18);
      forceArrow.setDirection(new THREE.Vector3(state.force >= 0 ? 1 : -1, 0, 0));
      forceArrow.position.set(state.x, 0.6, 0);

      /* Velocity arrow */
      const velLen = Math.min(Math.abs(state.v) / 4, 2.2) || 0.001;
      velocityArrow.setLength(velLen, 0.24, 0.14);
      velocityArrow.setDirection(new THREE.Vector3(state.v >= 0 ? 1 : -1, 0, 0));
      velocityArrow.position.set(state.x, 1.3, 0);

      /* Trail update */
      const posAttr = trailGeo.getAttribute('position');
      for (let i = 0; i < MAX_TRAIL; i++) {
        const p = trailPoints[i];
        if (p === undefined) {
          posAttr.setXYZ(i, state.x, -10, 0);
        } else {
          posAttr.setXYZ(i, p, 0.1, 0);
        }
      }
      posAttr.needsUpdate = true;

      updateReadout(acceleration);

      controls.update();
      renderer.render(scene, camera);
    }

    animate();

    /* Clean up if this canvas is ever removed (SPA-style navigation) */
    window.addEventListener('beforeunload', () => cancelAnimationFrame(rafId));
  }

  /* ---------------- Registry ---------------- */

  window.PhysixSimulations = window.PhysixSimulations || {};
  window.PhysixSimulations['newtons-laws'] = newtonsLawsSimulation;
})();