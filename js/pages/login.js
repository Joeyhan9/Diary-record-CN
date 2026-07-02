import { signInWithEmail } from '../auth/auth-service.js';
import { isSupabaseConfigured } from '../config/supabase-config.js';

/**
 * @param {HTMLElement} app
 * @param {(path: string) => void} navigate
 * @param {string} [redirectTo]
 */
export function renderLogin(app, navigate, redirectTo = '/') {
  const configured = isSupabaseConfigured();

  app.innerHTML = `
    <button class="back-btn" id="back-btn">← 返回首页</button>
    <div class="auth-page">
      <header class="auth-header">
        <h1>登录</h1>
        <p class="auth-subtitle">登录后即可保存和管理你的生活记录</p>
      </header>
      ${
        configured
          ? `
      <form class="auth-form" id="login-form">
        <label class="auth-field">
          <span class="auth-label">邮箱</span>
          <input class="auth-input" type="email" name="email" required autocomplete="email" placeholder="you@example.com" />
        </label>
        <label class="auth-field">
          <span class="auth-label">密码</span>
          <input class="auth-input" type="password" name="password" required autocomplete="current-password" placeholder="请输入密码" minlength="6" />
        </label>
        <p class="auth-error" id="auth-error" hidden></p>
        <button type="submit" class="auth-submit" id="submit-btn">登录</button>
      </form>
      <p class="auth-switch">还没有账号？<button type="button" class="auth-link" id="go-register">立即注册</button></p>
      `
          : `
      <div class="auth-notice">
        <p>请先在 <code>js/config/supabase-config.js</code> 或 <code>window.__SUPABASE_CONFIG__</code> 中配置 Supabase 项目。</p>
      </div>
      `
      }
    </div>
  `;

  app.querySelector('#back-btn')?.addEventListener('click', () => navigate('/'));

  app.querySelector('#go-register')?.addEventListener('click', () => {
    const q = redirectTo !== '/' ? `?redirect=${encodeURIComponent(redirectTo)}` : '';
    navigate(`/register${q}`);
  });

  const form = app.querySelector('#login-form');
  form?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const fd = new FormData(form);
    const email = String(fd.get('email') || '').trim();
    const password = String(fd.get('password') || '');

    const errorEl = app.querySelector('#auth-error');
    const submitBtn = /** @type {HTMLButtonElement | null} */ (app.querySelector('#submit-btn'));

    if (errorEl) {
      errorEl.hidden = true;
      errorEl.textContent = '';
    }
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = '登录中…';
    }

    const result = await signInWithEmail(email, password);

    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.textContent = '登录';
    }

    if (result.ok) {
      navigate(redirectTo || '/');
      return;
    }

    if (errorEl) {
      errorEl.textContent = result.error || '登录失败，请重试';
      errorEl.hidden = false;
    }
  });
}
