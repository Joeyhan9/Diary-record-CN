import { getAuthUser, isAuthenticated } from '../auth/auth-state.js';
import { signOut } from '../auth/auth-service.js';

/**
 * @param {(path: string) => void} navigate
 * @returns {HTMLElement}
 */
export function renderAuthBar(navigate) {
  const bar = document.createElement('div');
  bar.className = 'auth-bar';

  if (isAuthenticated()) {
    const user = getAuthUser();
    const email = user?.email ?? '已登录';

    bar.innerHTML = `
      <span class="auth-bar-email" title="${escapeHtml(email)}">${escapeHtml(truncateEmail(email))}</span>
      <button type="button" class="auth-bar-btn auth-bar-btn--ghost" id="auth-logout">退出</button>
    `;

    bar.querySelector('#auth-logout')?.addEventListener('click', async () => {
      const btn = bar.querySelector('#auth-logout');
      if (btn) btn.textContent = '退出中…';
      await signOut();
      navigate('/');
    });
  } else {
    bar.innerHTML = `
      <button type="button" class="auth-bar-btn auth-bar-btn--ghost" id="auth-login">登录</button>
      <button type="button" class="auth-bar-btn auth-bar-btn--primary" id="auth-register">注册</button>
    `;

    bar.querySelector('#auth-login')?.addEventListener('click', () => navigate('/login'));
    bar.querySelector('#auth-register')?.addEventListener('click', () => navigate('/register'));
  }

  return bar;
}

/** @param {string} email */
function truncateEmail(email) {
  if (email.length <= 20) return email;
  const [local, domain] = email.split('@');
  if (!domain) return email.slice(0, 17) + '…';
  return `${local.slice(0, 8)}…@${domain}`;
}

/** @param {string} str */
function escapeHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
