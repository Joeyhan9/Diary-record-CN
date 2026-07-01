import { CATEGORIES, CATEGORY_COLORS, CATEGORY_LABELS } from '../types.js';
import { getEntriesByCategory } from '../storage.js';
import { renderTimeline } from '../components/timeline.js';
import { renderCategoryCalendar } from '../components/calendar.js';
import { renderSearchBar } from '../components/search-bar.js';
import { renderExportMenu } from '../components/export.js';

/**
 * @param {HTMLElement} app
 * @param {(path: string) => void} navigate
 */
export function renderHome(app, navigate) {
  app.innerHTML = `
    <div class="home-layout">
      <header class="home-header">
        <h1>生活记录</h1>
        <div class="home-toolbar">
          <div id="search-root" class="home-search"></div>
          <div id="export-root"></div>
        </div>
      </header>

      <div class="category-sections category-sections--horizontal">
        ${CATEGORIES.map(
          (cat) => `
          <section class="category-section category-section--compact" id="section-${cat}">
            <button type="button" class="category-section-title" data-category="${cat}">
              <span class="category-section-dot" style="background:${CATEGORY_COLORS[cat]}"></span>
              <span>${CATEGORY_LABELS[cat]}</span>
              <span class="category-section-arrow">→</span>
            </button>
            <div class="category-section-calendar" id="calendar-${cat}"></div>
            <div class="category-section-summary" id="summary-${cat}"></div>
          </section>`
        ).join('')}
      </div>

      <section class="timeline-section">
        <h2 class="timeline-heading">14 日趋势</h2>
        <p class="timeline-subtitle">点击下方线条，进入对应单元</p>
        <div id="timeline-root"></div>
      </section>
    </div>
  `;

  const exportRoot = app.querySelector('#export-root');
  if (exportRoot) renderExportMenu(exportRoot);

  const searchRoot = app.querySelector('#search-root');
  if (searchRoot) {
    searchRoot.appendChild(
      renderSearchBar((q) => {
        if (q.trim()) navigate(`/search?q=${encodeURIComponent(q.trim())}`);
      })
    );
  }

  CATEGORIES.forEach((cat) => {
    const calRoot = app.querySelector(`#calendar-${cat}`);
    if (calRoot) calRoot.appendChild(renderCategoryCalendar(cat, { days: 14, compact: true }));

    const summaryRoot = app.querySelector(`#summary-${cat}`);
    const count = getEntriesByCategory(cat).length;
    if (summaryRoot) {
      summaryRoot.innerHTML =
        count === 0
          ? `<p class="category-section-empty">暂无记录</p>`
          : `<button type="button" class="view-all-btn view-all-btn--compact">${count} 篇记录 →</button>`;
      summaryRoot.querySelector('.view-all-btn')?.addEventListener('click', () => {
        navigate(`/category/${cat}`);
      });
    }
  });

  app.querySelectorAll('.category-section-title').forEach((btn) => {
    btn.addEventListener('click', () => {
      const cat = /** @type {import('../types.js').Category} */ (btn.dataset.category);
      navigate(`/category/${cat}`);
    });
  });

  const root = app.querySelector('#timeline-root');
  if (root) {
    renderTimeline(root, (category) => navigate(`/category/${category}`));
  }
}
