/* ==================================================
   PhysixLab — Auth logic
   --------------------------------------------------
   This file is split into two parts:

   1. AuthAPI — the ONLY place that talks to a backend.
      Right now every method is a local, fake stand-in
      that "persists" users in localStorage so you can
      demo login/register flows with no server.

      When your real backend is ready, replace the body
      of each AuthAPI method with a fetch() call. Nothing
      else in this file (or in login.html / register.html)
      needs to change, because every caller only depends
      on the { token, user } shape these methods return
      and the errors they throw.

   2. Page wiring — form validation, nav auth widget,
      session persistence. This part should not need to
      change when you swap in a real backend.
   ================================================== */

const AUTH_SESSION_KEY = 'physixlab_session';
const AUTH_USERS_KEY = 'physixlab_users_demo'; // fake user "database", demo only

const AuthAPI = {
  /**
   * @param {{email: string, password: string}} credentials
   * @returns {Promise<{token: string, user: {name: string, email: string}}>}
   */
  async login({ email, password }) {
    // ---- REAL BACKEND: replace this whole block with -----------------
    // const res = await fetch('/api/auth/login', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ email, password })
    // });
    // const data = await res.json();
    // if (!res.ok) throw new Error(data.message || 'Invalid email or password.');
    // return data; // expected: { token, user: { name, email } }
    // --------------------------------------------------------------------
    await fakeDelay();
    const users = readDemoUsers();
    const match = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (!match || match.password !== password) {
      throw new Error('Invalid email or password.');
    }
    return {
      token: 'demo-token-' + btoa(email).slice(0, 16),
      user: { name: match.name, email: match.email }
    };
  },

  /**
   * @param {{name: string, email: string, password: string}} details
   * @returns {Promise<{token: string, user: {name: string, email: string}}>}
   */
  async register({ name, email, password }) {
    // ---- REAL BACKEND: replace this whole block with -----------------
    // const res = await fetch('/api/auth/register', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ name, email, password })
    // });
    // const data = await res.json();
    // if (!res.ok) throw new Error(data.message || 'Could not create account.');
    // return data; // expected: { token, user: { name, email } }
    // --------------------------------------------------------------------
    await fakeDelay();
    const users = readDemoUsers();
    if (users.some(u => u.email.toLowerCase() === email.toLowerCase())) {
      throw new Error('An account with that email already exists.');
    }
    users.push({ name, email, password });
    writeDemoUsers(users);
    return {
      token: 'demo-token-' + btoa(email).slice(0, 16),
      user: { name, email }
    };
  },

  logout() {
    // ---- REAL BACKEND: you may also want to POST /api/auth/logout ----
    // to invalidate the token server-side before clearing local state.
    clearSession();
  }
};

function fakeDelay(ms = 550) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function readDemoUsers() {
  try {
    return JSON.parse(localStorage.getItem(AUTH_USERS_KEY)) || [];
  } catch {
    return [];
  }
}

function writeDemoUsers(users) {
  localStorage.setItem(AUTH_USERS_KEY, JSON.stringify(users));
}

/* ---------------- Session helpers (shared by all pages) ---------------- */

function saveSession({ token, user }) {
  localStorage.setItem(AUTH_SESSION_KEY, JSON.stringify({ token, user }));
}

function getSession() {
  try {
    return JSON.parse(localStorage.getItem(AUTH_SESSION_KEY));
  } catch {
    return null;
  }
}

function clearSession() {
  localStorage.removeItem(AUTH_SESSION_KEY);
}

/* ---------------- Shared validation helpers ---------------- */

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function setFieldError(fieldEl, message) {
  const input = fieldEl.querySelector('input');
  const msg = fieldEl.querySelector('.field-msg');
  input.classList.add('field-error');
  if (msg) {
    msg.textContent = message;
    msg.classList.add('show');
  }
}

function clearFieldError(fieldEl) {
  const input = fieldEl.querySelector('input');
  const msg = fieldEl.querySelector('.field-msg');
  input.classList.remove('field-error');
  if (msg) msg.classList.remove('show');
}

function showBanner(el, message, type = 'error') {
  el.textContent = message;
  el.className = 'auth-banner show ' + type;
}

function hideBanner(el) {
  el.className = 'auth-banner';
}

function setLoading(button, isLoading) {
  button.classList.toggle('loading', isLoading);
  button.disabled = isLoading;
}

function initPasswordToggles(scope) {
  scope.querySelectorAll('.field-toggle').forEach(btn => {
    btn.addEventListener('click', () => {
      const input = btn.previousElementSibling;
      const isPw = input.type === 'password';
      input.type = isPw ? 'text' : 'password';
      btn.setAttribute('aria-label', isPw ? 'Hide password' : 'Show password');
      btn.classList.toggle('is-visible', isPw);
    });
  });
}

/* ---------------- Login form ---------------- */

function initLoginForm() {
  const form = document.getElementById('loginForm');
  if (!form) return;

  const banner = document.getElementById('loginBanner');
  const emailField = form.querySelector('#loginEmailField');
  const passwordField = form.querySelector('#loginPasswordField');
  const submitBtn = form.querySelector('.auth-submit');

  form.addEventListener('submit', async e => {
    e.preventDefault();
    hideBanner(banner);
    clearFieldError(emailField);
    clearFieldError(passwordField);

    const email = form.email.value.trim();
    const password = form.password.value;

    let hasError = false;
    if (!EMAIL_RE.test(email)) {
      setFieldError(emailField, 'Enter a valid email address.');
      hasError = true;
    }
    if (password.length < 1) {
      setFieldError(passwordField, 'Enter your password.');
      hasError = true;
    }
    if (hasError) return;

    setLoading(submitBtn, true);
    try {
      const result = await AuthAPI.login({ email, password });
      saveSession(result);
      showBanner(banner, `Welcome back, ${result.user.name}! Redirecting…`, 'success');
      const params = new URLSearchParams(window.location.search);
      const redirectTo = params.get('redirect') || 'index.html';
      setTimeout(() => { window.location.href = redirectTo; }, 700);
    } catch (err) {
      showBanner(banner, err.message || 'Something went wrong. Please try again.', 'error');
      setLoading(submitBtn, false);
    }
  });
}

/* ---------------- Register form ---------------- */

function initRegisterForm() {
  const form = document.getElementById('registerForm');
  if (!form) return;

  const banner = document.getElementById('registerBanner');
  const nameField = form.querySelector('#registerNameField');
  const emailField = form.querySelector('#registerEmailField');
  const passwordField = form.querySelector('#registerPasswordField');
  const confirmField = form.querySelector('#registerConfirmField');
  const termsField = form.querySelector('#registerTermsField');
  const submitBtn = form.querySelector('.auth-submit');

  form.addEventListener('submit', async e => {
    e.preventDefault();
    hideBanner(banner);
    [nameField, emailField, passwordField, confirmField].forEach(clearFieldError);
    termsField.classList.remove('field-error');

    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const password = form.password.value;
    const confirm = form.confirm.value;
    const agreed = form.terms.checked;

    let hasError = false;
    if (name.length < 2) {
      setFieldError(nameField, 'Enter your full name.');
      hasError = true;
    }
    if (!EMAIL_RE.test(email)) {
      setFieldError(emailField, 'Enter a valid email address.');
      hasError = true;
    }
    if (password.length < 8) {
      setFieldError(passwordField, 'Use at least 8 characters.');
      hasError = true;
    }
    if (confirm !== password || confirm.length === 0) {
      setFieldError(confirmField, 'Passwords do not match.');
      hasError = true;
    }
    if (!agreed) {
      showBanner(banner, 'Please agree to the Terms to create an account.', 'error');
      hasError = true;
    }
    if (hasError) return;

    setLoading(submitBtn, true);
    try {
      const result = await AuthAPI.register({ name, email, password });
      saveSession(result);
      showBanner(banner, `Account created! Welcome to PhysixLab, ${result.user.name}.`, 'success');
      setTimeout(() => { window.location.href = 'index.html'; }, 800);
    } catch (err) {
      showBanner(banner, err.message || 'Something went wrong. Please try again.', 'error');
      setLoading(submitBtn, false);
    }
  });
}

/* ---------------- Nav auth widget (runs on every page) ---------------- */

function initNavAuth() {
  const session = getSession();
  const loggedOutEls = document.querySelectorAll('[data-auth="loggedOut"]');
  const loggedInEls = document.querySelectorAll('[data-auth="loggedIn"]');

  loggedOutEls.forEach(el => { el.hidden = !!session; });
  loggedInEls.forEach(el => { el.hidden = !session; });

  if (session && session.user) {
    document.querySelectorAll('.user-name').forEach(el => { el.textContent = session.user.name; });
    document.querySelectorAll('.user-avatar').forEach(el => {
      el.textContent = session.user.name.trim().charAt(0).toUpperCase();
    });
  }

  const chip = document.getElementById('userChip');
  const dropdown = document.getElementById('userDropdown');
  if (chip && dropdown) {
    chip.addEventListener('click', e => {
      e.stopPropagation();
      dropdown.classList.toggle('open');
    });
    document.addEventListener('click', () => dropdown.classList.remove('open'));
  }

  document.querySelectorAll('#logoutBtn, #logoutBtnMobile').forEach(btn => {
    btn.addEventListener('click', e => {
      e.preventDefault();
      AuthAPI.logout();
      window.location.href = 'index.html';
    });
  });
}

document.addEventListener('DOMContentLoaded', () => {
  initNavAuth();
  initPasswordToggles(document);
  initLoginForm();
  initRegisterForm();
});
