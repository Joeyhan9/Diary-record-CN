import { CATEGORIES, CATEGORY_COLORS, CATEGORY_LABELS } from '../types.js';

/**
 * @param {string} activeRoute - current hash path e.g. '/' or '/category/work'
 * @param {(path: string) => void} navigate
 */
export function renderBottomNav(activeRoute, navigate) {
  const nav = document.createElement('nav');
  nav.className = 'bottom-nav';
  nav.setAttribute('aria-label', '分类导航');

  const homeBtn = document.createElement('button');
  homeBtn.type = 'button';
  homeBtn.className = `bottom-nav-item bottom-nav-item--home${activeRoute === '/' ? ' bottom-nav-item--active' : ''}`;
  homeBtn.innerHTML = `
    <span class="bottom-nav-icon">⌂</span>
    <span class="bottom-nav-label">首页</span>
  `;
  homeBtn.addEventListener('click', () => navigate('/'));
  nav.appendChild(homeBtn);

  CATEGORIES.forEach((cat) => {
    const path = `/category/${cat}`;
    const isActive = activeRoute === path || activeRoute.startsWith(path + '/');
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = `bottom-nav-item${isActive ? ' bottom-nav-item--active' : ''}`;
    btn.style.setProperty('--cat-color', CATEGORY_COLORS[cat]);
    btn.innerHTML = `
      <span class="bottom-nav-dot" style="background:${CATEGORY_COLORS[cat]}"></span>
      <span class="bottom-nav-label">${CATEGORY_LABELS[cat]}</span>
    `;
    btn.addEventListener('click', () => navigate(path));
    nav.appendChild(btn);
  });

  return nav;
}

/** @param {string} route @param {(path: string) => void} navigate */
export function mountBottomNav(route, navigate) {
  document.querySelector('.bottom-nav')?.remove();
  const nav = renderBottomNav(route, navigate);
  document.body.appendChild(nav);
}
