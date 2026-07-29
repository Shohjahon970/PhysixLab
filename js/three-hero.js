/* ============================================================
   PhysixLab — three-hero.js
   Rotating 3D atom model for the homepage hero.
   Glowing nucleus with three electrons on elliptical orbits,
   gently reacting to mouse movement.
   ============================================================ */

(function () {
  'use strict';

  function initHeroAtom() {
    const container = document.getElementById('heroScene');
    const canvas = document.getElementById('atomCanvas');
    if (!container || !canvas || typeof THREE === 'undefined') return;

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
    camera.position.set(0, 0.6, 9);

    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    function resize() {
      const rect = container.getBoundingClientRect();
      const size = Math.min(rect.width, rect.height) || rect.width;
      renderer.setSize(rect.width, rect.height);
      camera.aspect = rect.width / rect.height;
      camera.updateProjectionMatrix();
    }
    resize();
    window.addEventListener('resize', resize);

    /* ---- Nucleus ---- */

    const nucleusGroup = new THREE.Group();
    scene.add(nucleusGroup);

    const nucleusGeo = new THREE.SphereGeometry(0.85, 32, 32);
    const nucleusMat = new THREE.MeshBasicMaterial({ color: 0x7c4dff });
    const nucleus = new THREE.Mesh(nucleusGeo, nucleusMat);
    nucleusGroup.add(nucleus);

    const glowGeo = new THREE.SphereGeometry(1.3, 32, 32);
    const glowMat = new THREE.MeshBasicMaterial({
      color: 0x00e5ff,
      transparent: true,
      opacity: 0.14
    });
    const glow = new THREE.Mesh(glowGeo, glowMat);
    nucleusGroup.add(glow);

    const glowGeo2 = new THREE.SphereGeometry(1.8, 32, 32);
    const glowMat2 = new THREE.MeshBasicMaterial({
      color: 0x7c4dff,
      transparent: true,
      opacity: 0.06
    });
    const glow2 = new THREE.Mesh(glowGeo2, glowMat2);
    nucleusGroup.add(glow2);

    /* ---- Orbit rings + electrons ---- */

    const orbitColors = [0x00e5ff, 0x7c4dff, 0x00e5ff];
    const orbitTilts = [
      { x: 0.35, y: 0, z: 0.1 },
      { x: -0.3, y: 1.05, z: 0.2 },
      { x: 0.2, y: -1.05, z: -0.15 }
    ];

    const orbitGroup = new THREE.Group();
    scene.add(orbitGroup);

    const electrons = [];
    const orbitRadiusX = 3.4;
    const orbitRadiusZ = 1.5;

    orbitTilts.forEach((tilt, i) => {
      const ringPoints = [];
      const segments = 96;
      for (let s = 0; s <= segments; s++) {
        const a = (s / segments) * Math.PI * 2;
        ringPoints.push(new THREE.Vector3(
          Math.cos(a) * orbitRadiusX,
          0,
          Math.sin(a) * orbitRadiusZ
        ));
      }
      const ringGeo = new THREE.BufferGeometry().setFromPoints(ringPoints);
      const ringMat = new THREE.LineBasicMaterial({
        color: orbitColors[i],
        transparent: true,
        opacity: 0.35
      });
      const ring = new THREE.LineLoop(ringGeo, ringMat);

      const pivot = new THREE.Group();
      pivot.rotation.set(tilt.x, tilt.y, tilt.z);
      pivot.add(ring);

      const electronGeo = new THREE.SphereGeometry(0.16, 16, 16);
      const electronMat = new THREE.MeshBasicMaterial({ color: orbitColors[i] });
      const electron = new THREE.Mesh(electronGeo, electronMat);
      pivot.add(electron);

      const eGlowGeo = new THREE.SphereGeometry(0.32, 16, 16);
      const eGlowMat = new THREE.MeshBasicMaterial({
        color: orbitColors[i],
        transparent: true,
        opacity: 0.25
      });
      const eGlow = new THREE.Mesh(eGlowGeo, eGlowMat);
      electron.add(eGlow);

      orbitGroup.add(pivot);
      electrons.push({
        electron,
        speed: 0.5 + i * 0.18,
        offset: i * 2.1
      });
    });

    /* ---- Mouse reactivity ---- */

    let targetRotX = 0, targetRotY = 0;
    let currentRotX = 0, currentRotY = 0;

    container.addEventListener('mousemove', (e) => {
      const rect = container.getBoundingClientRect();
      const nx = (e.clientX - rect.left) / rect.width - 0.5;
      const ny = (e.clientY - rect.top) / rect.height - 0.5;
      targetRotY = nx * 0.6;
      targetRotX = -ny * 0.4;
    });

    container.addEventListener('mouseleave', () => {
      targetRotX = 0;
      targetRotY = 0;
    });

    /* ---- Animation loop ---- */

    const clock = new THREE.Clock();

    function animate() {
      requestAnimationFrame(animate);
      const t = clock.getElapsedTime();

      orbitGroup.rotation.y += 0.0025;

      currentRotX += (targetRotX - currentRotX) * 0.04;
      currentRotY += (targetRotY - currentRotY) * 0.04;
      scene.rotation.x = currentRotX;
      scene.rotation.y = currentRotY + t * 0.05;

      electrons.forEach(({ electron, speed, offset }) => {
        const a = t * speed + offset;
        electron.position.set(
          Math.cos(a) * orbitRadiusX,
          0,
          Math.sin(a) * orbitRadiusZ
        );
      });

      nucleusGroup.scale.setScalar(1 + Math.sin(t * 1.4) * 0.04);

      renderer.render(scene, camera);
    }

    animate();
  }

  document.addEventListener('DOMContentLoaded', initHeroAtom);
})();
