/* ============================================================
   PhysixLab — data.js
   Single source of truth for topic and lesson data.
   Shared by lessons.js and lesson-viewer.js.
   ============================================================ */

const PHYSIXLAB_DATA = {

  mechanics: {
    name: 'Mechanics',
    tagline: 'Motion, forces, energy',
    description: "The branch of physics that explains why things move the way they do — from a thrown ball to a planet in orbit.",
    accent: '#00e5ff',
    icon: '<svg viewBox="0 0 48 48"><path d="M6 40 L24 8 L42 40" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linejoin="round"/><circle cx="24" cy="8" r="3" fill="currentColor"/></svg>',
    lessons: [
      {
        title: "Newton's Laws of Motion",
        description: "The three rules that govern every push and pull in the universe.",
        difficulty: 'Beginner',
        duration: '14 min',
        simulationKey: 'newtons-laws',
        content: {
          intro: "Sir Isaac Newton's three laws of motion, published in 1687, describe the relationship between a body and the forces acting on it. They still explain almost every everyday motion you'll ever see — from a rolling ball to a launching rocket.",
          sections: [
            {
              heading: '1. The Law of Inertia',
              body: "An object at rest stays at rest, and an object in motion stays in motion at a constant velocity, unless acted on by a net external force. Set the applied force to zero in the simulation and watch the block simply stay put — or keep drifting at whatever speed it already had."
            },
            {
              heading: '2. Force, Mass & Acceleration',
              body: "The acceleration of an object is directly proportional to the net force acting on it, and inversely proportional to its mass. Push a light block and it leaps forward; push a heavy one with the same force and it barely budges. Try changing the mass and force sliders to feel this trade-off live."
            },
            {
              heading: '3. Action & Reaction',
              body: "For every action, there is an equal and opposite reaction. When the block hits the wall in the simulation, the wall pushes back on the block just as hard as the block pushed on it — that's why it bounces."
            }
          ],
          formulas: [
            { label: 'Second Law', expr: 'F = m·a' },
            { label: 'First Law', expr: 'ΣF = 0  ⇒  v = constant' },
            { label: 'Third Law', expr: 'F(A on B) = −F(B on A)' }
          ]
        }
      },
      { title: 'Projectile Motion', description: 'Break down curved flight into simple horizontal and vertical motion.', difficulty: 'Beginner', duration: '16 min' },
      { title: 'Circular Motion', description: 'Why objects moving in a circle are always accelerating.', difficulty: 'Intermediate', duration: '15 min' },
      { title: 'Work & Energy', description: 'How force over distance transforms into kinetic and potential energy.', difficulty: 'Intermediate', duration: '18 min' },
      { title: 'Momentum & Collisions', description: 'What stays conserved when two objects crash into each other.', difficulty: 'Intermediate', duration: '17 min' },
      { title: 'Simple Harmonic Motion', description: 'The rhythmic back-and-forth behind springs and pendulums.', difficulty: 'Intermediate', duration: '16 min' },
      { title: 'Gravity & Orbits', description: 'From falling apples to satellites that never come down.', difficulty: 'Advanced', duration: '20 min' },
      { title: 'Friction & Inclined Planes', description: 'The hidden force that resists every sliding surface.', difficulty: 'Beginner', duration: '13 min' },
      { title: 'Rotational Dynamics', description: 'Torque, angular momentum, and spinning bodies.', difficulty: 'Advanced', duration: '19 min' },
      { title: 'Center of Mass & Equilibrium', description: 'Why some objects balance and others tip over.', difficulty: 'Intermediate', duration: '15 min' }
    ]
  },

  thermodynamics: {
    name: 'Thermodynamics',
    tagline: 'Heat, temperature, entropy',
    description: 'The physics of heat, energy flow, and why time seems to move in one direction.',
    accent: '#ff7043',
    icon: '<svg viewBox="0 0 48 48"><path d="M20 6 v22 a8 8 0 1 0 8 0 V6 Z" fill="none" stroke="currentColor" stroke-width="2.5"/><circle cx="24" cy="34" r="3" fill="currentColor"/></svg>',
    lessons: [
      { title: 'Temperature & Thermal Equilibrium', description: 'What a thermometer is really measuring.', difficulty: 'Beginner', duration: '12 min' },
      { title: 'Heat Transfer', description: 'Conduction, convection and radiation compared side by side.', difficulty: 'Beginner', duration: '14 min' },
      { title: 'The Ideal Gas Law', description: 'Linking pressure, volume and temperature in one equation.', difficulty: 'Intermediate', duration: '16 min' },
      { title: 'Kinetic Theory of Gases', description: 'Zoom into the box of bouncing particles that is a gas.', difficulty: 'Intermediate', duration: '17 min' },
      { title: 'The First Law of Thermodynamics', description: 'Energy is never created or destroyed, only moved.', difficulty: 'Intermediate', duration: '18 min' },
      { title: 'Entropy & the Second Law', description: 'Why a broken cup never puts itself back together.', difficulty: 'Advanced', duration: '19 min' },
      { title: 'Heat Engines', description: 'How engines turn a temperature difference into motion.', difficulty: 'Advanced', duration: '20 min' },
      { title: 'Phase Changes', description: 'The energy hidden in melting ice and boiling water.', difficulty: 'Beginner', duration: '13 min' },
      { title: 'Thermal Expansion', description: 'Why bridges have gaps and thermometers have bulbs.', difficulty: 'Beginner', duration: '11 min' }
    ]
  },

  electromagnetism: {
    name: 'Electromagnetism',
    tagline: 'Electricity, magnetism, circuits',
    description: 'How charges, currents and magnetic fields interact to power almost everything electronic.',
    accent: '#7c4dff',
    icon: '<svg viewBox="0 0 48 48"><path d="M26 6 L10 28 h10 l-4 14 20-24 H26 Z" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linejoin="round"/></svg>',
    lessons: [
      { title: "Electric Charge & Coulomb's Law", description: 'The force between two charges, and why like repels like.', difficulty: 'Beginner', duration: '14 min' },
      { title: 'Electric Fields', description: 'Mapping the invisible influence around every charge.', difficulty: 'Intermediate', duration: '16 min' },
      { title: 'Electric Potential & Voltage', description: 'What "voltage" actually means, physically.', difficulty: 'Intermediate', duration: '15 min' },
      { title: 'Capacitance', description: 'How devices store electric charge for later use.', difficulty: 'Intermediate', duration: '16 min' },
      { title: 'Current & Resistance', description: "Ohm's law and the flow of charge through a wire.", difficulty: 'Beginner', duration: '13 min' },
      { title: "Circuits & Kirchhoff's Laws", description: 'Solving networks of resistors, step by step.', difficulty: 'Intermediate', duration: '18 min' },
      { title: 'Magnetic Fields', description: 'The force that moving charges feel and create.', difficulty: 'Intermediate', duration: '17 min' },
      { title: 'Electromagnetic Induction', description: 'How a changing magnetic field generates electricity.', difficulty: 'Advanced', duration: '19 min' },
      { title: "Maxwell's Equations", description: 'The four equations that unify electricity and magnetism.', difficulty: 'Advanced', duration: '22 min' },
      { title: 'AC Circuits', description: 'Why the power grid runs on alternating current.', difficulty: 'Advanced', duration: '18 min' }
    ]
  },

  optics: {
    name: 'Optics',
    tagline: 'Light, lenses, reflection, refraction',
    description: 'The behavior of light as it bounces, bends and splits its way through the world.',
    accent: '#ffd54f',
    icon: '<svg viewBox="0 0 48 48"><ellipse cx="24" cy="24" rx="9" ry="16" fill="none" stroke="currentColor" stroke-width="2.5"/><path d="M2 24 h14 M32 24 h14" stroke="currentColor" stroke-width="2.5"/></svg>',
    lessons: [
      { title: 'Reflection of Light', description: 'The simple law behind mirrors and shiny surfaces.', difficulty: 'Beginner', duration: '11 min' },
      { title: "Refraction & Snell's Law", description: 'Why a straw looks bent in a glass of water.', difficulty: 'Beginner', duration: '14 min' },
      { title: 'Lenses & Image Formation', description: 'How curved glass bends light into sharp images.', difficulty: 'Intermediate', duration: '17 min' },
      { title: 'Mirrors', description: 'Concave, convex and flat — how each shapes reflections.', difficulty: 'Intermediate', duration: '15 min' },
      { title: 'Total Internal Reflection', description: 'The trick that keeps light trapped inside fiber optics.', difficulty: 'Intermediate', duration: '15 min' },
      { title: 'Dispersion & Prisms', description: 'Why white light splits into a rainbow.', difficulty: 'Beginner', duration: '13 min' },
      { title: 'Diffraction', description: 'How light bends around edges and through narrow gaps.', difficulty: 'Advanced', duration: '18 min' },
      { title: 'Polarization', description: 'Filtering light waves by their direction of vibration.', difficulty: 'Advanced', duration: '16 min' }
    ]
  },

  waves: {
    name: 'Waves & Oscillations',
    tagline: 'Sound, vibration, wave motion',
    description: 'The shared mathematics behind sound, ripples, springs, and every rhythmic motion.',
    accent: '#00e5ff',
    icon: '<svg viewBox="0 0 48 48"><path d="M4 28 q6 -14 12 0 t12 0 t12 0 t12 0" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/></svg>',
    lessons: [
      { title: 'Wave Properties', description: 'Wavelength, frequency, amplitude and how they relate.', difficulty: 'Beginner', duration: '13 min' },
      { title: 'Transverse & Longitudinal Waves', description: 'The two ways energy can ripple through a medium.', difficulty: 'Beginner', duration: '12 min' },
      { title: 'Superposition & Interference', description: 'What happens when two waves meet.', difficulty: 'Intermediate', duration: '16 min' },
      { title: 'Standing Waves', description: 'Why a guitar string only rings at certain notes.', difficulty: 'Intermediate', duration: '15 min' },
      { title: 'The Doppler Effect', description: 'Why a siren changes pitch as it passes you.', difficulty: 'Intermediate', duration: '14 min' },
      { title: 'Sound Waves', description: 'How pressure vibrations in air become the sounds you hear.', difficulty: 'Beginner', duration: '14 min' },
      { title: 'Resonance', description: 'Why a small push at the right moment can build huge motion.', difficulty: 'Advanced', duration: '17 min' },
      { title: 'Simple Pendulum Oscillation', description: 'The physics of the simplest timekeeping device ever built.', difficulty: 'Beginner', duration: '13 min' },
      { title: 'Wave Energy & Intensity', description: 'How the energy a wave carries depends on its amplitude.', difficulty: 'Advanced', duration: '16 min' }
    ]
  },

  modern: {
    name: 'Modern Physics',
    tagline: 'Relativity, quantum, atomic physics',
    description: 'The strange rules that take over at extreme speeds and impossibly small scales.',
    accent: '#7c4dff',
    icon: '<svg viewBox="0 0 48 48"><circle cx="24" cy="24" r="4" fill="currentColor"/><ellipse cx="24" cy="24" rx="18" ry="7" fill="none" stroke="currentColor" stroke-width="2"/><ellipse cx="24" cy="24" rx="18" ry="7" fill="none" stroke="currentColor" stroke-width="2" transform="rotate(60 24 24)"/><ellipse cx="24" cy="24" rx="18" ry="7" fill="none" stroke="currentColor" stroke-width="2" transform="rotate(120 24 24)"/></svg>',
    lessons: [
      { title: 'Special Relativity', description: 'Why time and space bend once you approach light speed.', difficulty: 'Advanced', duration: '22 min' },
      { title: 'Photoelectric Effect', description: 'The experiment that proved light comes in packets.', difficulty: 'Intermediate', duration: '16 min' },
      { title: 'Wave-Particle Duality', description: 'How light and matter are both waves and particles.', difficulty: 'Advanced', duration: '19 min' },
      { title: 'Bohr Model of the Atom', description: 'Electrons confined to fixed, quantized energy levels.', difficulty: 'Intermediate', duration: '17 min' },
      { title: 'Quantum Tunneling', description: 'How particles pass through barriers they "shouldn\'t" cross.', difficulty: 'Advanced', duration: '20 min' },
      { title: 'Nuclear Decay & Half-Life', description: 'Why radioactive atoms disappear at a predictable rate.', difficulty: 'Intermediate', duration: '15 min' },
      { title: 'Atomic Spectra', description: 'The fingerprint of light that reveals what atoms are made of.', difficulty: 'Intermediate', duration: '16 min' },
      { title: 'Particle Physics Basics', description: 'A first look at the building blocks smaller than atoms.', difficulty: 'Advanced', duration: '21 min' }
    ]
  }

};

/* Attach lesson numbers automatically so ids stay in sync with array order */
Object.keys(PHYSIXLAB_DATA).forEach((key) => {
  PHYSIXLAB_DATA[key].lessons.forEach((lesson, i) => {
    lesson.number = i + 1;
    lesson.topicKey = key;
  });
});

if (typeof window !== 'undefined') {
  window.PHYSIXLAB_DATA = PHYSIXLAB_DATA;
}
