/* ============================================================
   PhysixLab — chat.js
   Floating "PhysixLab AI Tutor" chat widget.
   Renders itself into #chatRoot on every page.
   ============================================================ */

(function () {
  'use strict';

  const SESSION_KEY = 'physixlab_chat_history';

  const CHAT_ICON = `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4 5a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H9l-4 4v-4H6a2 2 0 0 1-2-2V5Z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/></svg>`;
  const CLOSE_ICON = `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6 6l12 12M18 6L6 18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>`;
  const SEND_ICON = `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3 11.5L20 4l-7.5 17-2.5-7L3 11.5Z" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round" stroke-linecap="round"/></svg>`;

  /* ---------------- Local knowledge base (fallback demo mode) ---------------- */

  const KNOWLEDGE_BASE = [
    {
      keys: ['gravity', 'gravitational', 'weight', 'fall'],
      answer: "Gravity is the attractive force between any two masses. Near Earth's surface it accelerates objects at about 9.8 m/s². It's why an apple falls and why planets orbit the Sun — check out the Mechanics branch for the Gravity & Orbits lesson with a live simulation!"
    },
    {
      keys: ['newton', "newton's law", 'newtons law', 'first law', 'second law', 'third law', 'f=ma', 'force'],
      answer: "Newton's Three Laws describe motion: (1) objects keep their state of motion unless a force acts on them, (2) F = ma — force equals mass times acceleration, (3) every action has an equal and opposite reaction. The Mechanics branch has a full interactive lesson on this."
    },
    {
      keys: ['energy', 'kinetic', 'potential', 'work'],
      answer: "Energy is the capacity to do work. Kinetic energy (½mv²) comes from motion, potential energy comes from position (like height in a gravity field). Energy is always conserved — it just changes form. See Work & Energy in the Mechanics lessons."
    },
    {
      keys: ['light', 'refraction', 'reflection', 'lens', 'prism', 'optics'],
      answer: "Light bends (refracts) when it passes between materials of different density, like air to glass, because its speed changes. That's how lenses focus light and prisms split it into colors. Try the Optics branch — the lesson simulation lets you tune the refractive index live."
    },
    {
      keys: ['atom', 'atomic', 'electron', 'nucleus', 'quantum', 'bohr'],
      answer: "In the Bohr model, electrons orbit the nucleus only at specific energy levels. When an electron jumps down a level it emits a photon of light — that's the basis of atomic spectra. The Modern Physics branch has a Bohr atom simulation you can play with."
    },
    {
      keys: ['wave', 'frequency', 'amplitude', 'sound', 'oscillation'],
      answer: "A wave transfers energy without transferring matter. Frequency is how many cycles happen per second, amplitude is how big each cycle is. Sound, light and water ripples are all waves with different frequencies. Check the Waves & Oscillations branch."
    },
    {
      keys: ['thermodynamics', 'heat', 'entropy', 'temperature'],
      answer: "Thermodynamics studies heat and energy transfer. Temperature measures average particle motion energy, and entropy measures disorder — the second law says entropy of an isolated system never decreases. The Thermodynamics branch has a gas-particle simulation you can heat up."
    },
    {
      keys: ['electromagnetism', 'circuit', 'electric', 'magnetic', 'charge', 'field'],
      answer: "Electromagnetism covers electric charges, magnetic fields, and how they interact — moving charges create magnetic fields, and changing magnetic fields create electric currents. See the Electromagnetism branch for a charged-particle field simulation."
    }
  ];

  function findAnswer(message) {
    const lower = message.toLowerCase();
    for (const entry of KNOWLEDGE_BASE) {
      if (entry.keys.some((k) => lower.includes(k))) {
        return entry.answer;
      }
    }
    return "That's a great question! I'm running in offline demo mode right now, so my answers are limited to core topics like gravity, Newton's laws, energy, light, waves, atoms, thermodynamics and electromagnetism. Try picking one of those, or explore the topic branches above for full lessons.";
  }

  /* ---------------- AI response function ---------------- */
  /*
    Real API mode example (swap in your endpoint + key handling):

    async function getAIResponse(userMessage) {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-6',
          max_tokens: 300,
          messages: [{ role: 'user', content: userMessage }]
        })
      });
      const data = await response.json();
      return data.content.map((c) => c.text || '').join('\n');
    }

    Below is the offline fallback used so the widget works with zero setup.
  */
  async function getAIResponse(userMessage) {
    await new Promise((resolve) => setTimeout(resolve, 700 + Math.random() * 700));
    return findAnswer(userMessage);
  }

  /* ---------------- Session storage ---------------- */

  function loadHistory() {
    try {
      const raw = sessionStorage.getItem(SESSION_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      return [];
    }
  }

  function saveHistory(history) {
    try {
      sessionStorage.setItem(SESSION_KEY, JSON.stringify(history));
    } catch (e) { /* storage unavailable, ignore */ }
  }

  /* ---------------- Build widget DOM ---------------- */

  function buildWidget() {
    const root = document.getElementById('chatRoot');
    if (!root) return;

    root.innerHTML = `
      <button class="chat-toggle" id="chatToggle" aria-expanded="false" aria-controls="chatPanel" aria-label="Open AI tutor chat">
        <span class="icon-chat">${CHAT_ICON}</span>
        <span class="icon-close">${CLOSE_ICON}</span>
        <span class="chat-badge" aria-hidden="true"></span>
      </button>

      <section class="chat-panel" id="chatPanel" role="dialog" aria-label="PhysixLab AI Tutor chat" aria-hidden="true">
        <header class="chat-header">
          <div class="chat-header-icon" aria-hidden="true">${CHAT_ICON}</div>
          <div class="chat-header-text">
            <span class="title">PhysixLab AI Tutor</span>
            <span class="status">Online</span>
          </div>
        </header>

        <div class="chat-messages" id="chatMessages" aria-live="polite"></div>

        <form class="chat-input-row" id="chatForm">
          <input type="text" id="chatInput" placeholder="Ask about gravity, waves, atoms…" aria-label="Type your physics question" autocomplete="off">
          <button type="submit" class="chat-send" aria-label="Send message">${SEND_ICON}</button>
        </form>
      </section>
    `;

    const toggle = document.getElementById('chatToggle');
    const panel = document.getElementById('chatPanel');
    const messagesEl = document.getElementById('chatMessages');
    const form = document.getElementById('chatForm');
    const input = document.getElementById('chatInput');

    let history = loadHistory();

    if (history.length === 0) {
      history.push({
        role: 'bot',
        text: "Hi! I'm your PhysixLab AI Tutor. Ask me about gravity, Newton's laws, energy, light, waves, atoms or thermodynamics."
      });
      saveHistory(history);
    }

    function renderMessages() {
      messagesEl.innerHTML = '';
      history.forEach((msg) => {
        const div = document.createElement('div');
        div.className = `chat-msg ${msg.role === 'user' ? 'user' : 'bot'}`;
        div.textContent = msg.text;
        messagesEl.appendChild(div);
      });
      messagesEl.scrollTop = messagesEl.scrollHeight;
    }

    function showTyping() {
      const typing = document.createElement('div');
      typing.className = 'chat-typing';
      typing.id = 'chatTyping';
      typing.innerHTML = '<span></span><span></span><span></span>';
      messagesEl.appendChild(typing);
      messagesEl.scrollTop = messagesEl.scrollHeight;
    }

    function hideTyping() {
      const typing = document.getElementById('chatTyping');
      if (typing) typing.remove();
    }

    renderMessages();

    toggle.addEventListener('click', () => {
      const isOpen = panel.classList.toggle('open');
      toggle.classList.toggle('open', isOpen);
      toggle.setAttribute('aria-expanded', String(isOpen));
      panel.setAttribute('aria-hidden', String(!isOpen));
      if (isOpen) setTimeout(() => input.focus(), 350);
    });

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const text = input.value.trim();
      if (!text) return;

      history.push({ role: 'user', text });
      saveHistory(history);
      renderMessages();
      input.value = '';
      input.disabled = true;

      showTyping();
      const reply = await getAIResponse(text);
      hideTyping();

      history.push({ role: 'bot', text: reply });
      saveHistory(history);
      renderMessages();
      input.disabled = false;
      input.focus();
    });
  }

  document.addEventListener('DOMContentLoaded', buildWidget);
})();
