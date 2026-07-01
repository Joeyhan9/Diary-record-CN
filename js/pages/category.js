import { CATEGORY_COLORS, CATEGORY_LABELS } from '../types.js';
import { getEntriesByCategory, createEntry, todayStr } from '../storage.js';
import { renderDocCard } from '../components/stars.js';
import { renderCategoryCalendar } from '../components/calendar.js';

/**
 * @param {HTMLElement} app
 * @param {import('../types.js').Category} category
 * @param {(path: string) => void} navigate
 */
export function renderCategory(app, category, navigate) {
  const entries = getEntriesByCategory(category);
  const color = CATEGORY_COLORS[category];
  const label = CATEGORY_LABELS[category];

  app.innerHTML = `
    <button class="back-btn" id="back-btn">← 首页</button>
    <header class="category-header">
      <div class="category-badge" style="background:${color}"></div>
      <h1>${label}</h1>
      <p class="category-label">按日期从近到远排列</p>
    </header>
    <div class="category-page-calendar" id="category-calendar"></div>
    <div class="doc-list" id="doc-list"></div>
    <button class="fab" id="fab" title="创建今日文档" aria-label="创建今日文档">
      <span class="fab-icon">+</span>
    </button>
  `;

  app.querySelector('#back-btn')?.addEventListener('click', () => navigate('/'));

  const calRoot = app.querySelector('#category-calendar');
  if (calRoot) calRoot.appendChild(renderCategoryCalendar(category));

  const list = app.querySelector('#doc-list');
  if (list) {
    if (entries.length === 0) {
      list.innerHTML = `<div class="empty-state">还没有文档，点击下方 + 创建今日记录</div>`;
    } else {
      entries.forEach((entry) => {
        list.appendChild(
          renderDocCard(entry, () => navigate(`/document/${entry.id}`))
        );
      });
    }
  }

  app.querySelector('#fab')?.addEventListener('click', () => {
    const entry = createEntry(category, todayStr());
    navigate(`/document/${entry.id}`);
  });
}
