/**
 * @param {HTMLElement} container
 * @param {(path: string) => void} navigate
 * @param {string} [message]
 */
export function showLoginPrompt(container, navigate, message) {
  const existing = container.querySelector('.login-prompt-banner');
  if (existing) {
    existing.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    return;
  }

  const banner = document.createElement('div');
  banner.className = 'login-prompt-banner';
  banner.innerHTML = `
    <p class="login-prompt-text">${message || '登录后即可保存记录'}</p>
    <div class="login-prompt-actions">
      <button type="button" class="auth-bar-btn auth-bar-btn--ghost" id="prompt-login">登录</button>
      <button type="button" class="auth-bar-btn auth-bar-btn--primary" id="prompt-register">注册</button>
    </div>
  `;

  banner.querySelector('#prompt-login')?.addEventListener('click', () => {
    const returnPath = window.location.hash.slice(1) || '/';
    navigate(`/login?redirect=${encodeURIComponent(returnPath)}`);
  });

  banner.querySelector('#prompt-register')?.addEventListener('click', () => {
    const returnPath = window.location.hash.slice(1) || '/';
    navigate(`/register?redirect=${encodeURIComponent(returnPath)}`);
  });

  container.prepend(banner);
  banner.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}
