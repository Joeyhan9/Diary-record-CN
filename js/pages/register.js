import { signUpWithEmail } from '../auth/auth-service.js';
import { isSupabaseConfigured } from '../config/supabase-config.js';

/**
 * @param {HTMLElement} app
 * @param {(path: string) => void} navigate
 * @param {string} [redirectTo]
 */
export function renderRegister(app, navigate, redirectTo = '/') {
  const configured = isSupabaseConfigured();

  app.innerHTML = `
    <button class="back-btn" id="back-btn">← 返回首页</button>
    <div class="auth-page">
      <header class="auth-header">
        <h1>注册</h1>
        <p class="auth-subtitle">使用邮箱创建账号，开始记录生活</p>
      </header>
      ${
        configured
          ? `
      <form class="auth-form" id="register-form">
        <label class="auth-field">
          <span class="auth-label">邮箱</span>
          <input class="auth-input" type="email" name="email" required autocomplete="email" placeholder="you@example.com" />
        </label>
        <label class="auth-field">
          <span class="auth-label">密码</span>
          <input class="auth-input" type="password" name="password" required autocomplete="new-password" placeholder="至少 6 位" minlength="6" />
        </label>
        <label class="auth-field">
          <span class="auth-label">确认密码</span>
          <input class="auth-input" type="password" name="confirm" required autocomplete="new-password" placeholder="再次输入密码" minlength="6" />
        </label>
        <p class="auth-error" id="auth-error" hidden></p>
        <p class="auth-success" id="auth-success" hidden></p>
        <button type="submit" class="auth-submit" id="submit-btn">注册</button>
      </form>
      <p class="auth-switch">已有账号？<button type="button" class="auth-link" id="go-login">去登录</button></p>
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

  app.querySelector('#go-login')?.addEventListener('click', () => {
    const q = redirectTo !== '/' ? `?redirect=${encodeURIComponent(redirectTo)}` : '';
    navigate(`/login${q}`);
  });

  const form = app.querySelector('#register-form');
  form?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const fd = new FormData(form);
    const email = String(fd.get('email') || '').trim();
    const password = String(fd.get('password') || '');
    const confirm = String(fd.get('confirm') || '');

    const errorEl = app.querySelector('#auth-error');
    const successEl = app.querySelector('#auth-success');
    const submitBtn = /** @type {HTMLButtonElement | null} */ (app.querySelector('#submit-btn'));

    if (errorEl) {
      errorEl.hidden = true;
      errorEl.textContent = '';
    }
    if (successEl) {
      successEl.hidden = true;
      successEl.textContent = '';
    }

    if (password !== confirm) {
      if (errorEl) {
        errorEl.textContent = '两次输入的密码不一致';
        errorEl.hidden = false;
      }
      return;
    }

    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = '注册中…';
    }

    const result = await signUpWithEmail(email, password);

    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.textContent = '注册';
    }

    if (result.ok && result.needsConfirmation) {
      if (successEl) {
        successEl.textContent = '注册成功！请查收邮箱中的确认链接，确认后即可登录。';
        successEl.hidden = false;
      }
      return;
    }

    if (result.ok) {
      navigate(redirectTo || '/');
      return;
    }

    if (errorEl) {
      errorEl.textContent = result.error || '注册失败，请重试';
      errorEl.hidden = false;
    }
  });
}
