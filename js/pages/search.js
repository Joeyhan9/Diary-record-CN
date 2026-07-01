import { CATEGORY_COLORS, CATEGORY_LABELS } from '../types.js';
import { searchEntries } from '../storage.js';
import { renderDocCard } from '../components/stars.js';
import { renderSearchBar } from '../components/search-bar.js';
import { renderExportMenu } from '../components/export.js';

/**
 * @param {HTMLElement} app
 * @param {string} query
 * @param {(path: string) => void} navigate
 */
export function renderSearch(app, query, navigate) {
  const results = searchEntries(query);

  app.innerHTML = `
    <div class="page-top-bar">
      <button class="back-btn" id="back-btn">← 返回</button>
      <div id="export-root"></div>
    </div>
    <header class="page-header">
      <h1>全局搜索</h1>
      <p class="subtitle">搜索全部历史记录的标题与内容</p>
    </header>
    <div id="search-root"></div>
    <div class="search-results-meta">${query ? `找到 ${results.length} 条结果` : '输入关键词开始搜索'}</div>
    <div class="doc-list" id="search-results"></div>
  `;

  app.querySelector('#back-btn')?.addEventListener('click', () => navigate('/'));

  const exportRoot = app.querySelector('#export-root');
  if (exportRoot) renderExportMenu(exportRoot);

  const searchRoot = app.querySelector('#search-root');
  if (searchRoot) {
    searchRoot.appendChild(
      renderSearchBar((q) => {
        if (q.trim()) {
          navigate(`/search?q=${encodeURIComponent(q.trim())}`);
        }
      }, query)
    );
  }

  const list = app.querySelector('#search-results');
  if (list) {
    if (!query.trim()) {
      list.innerHTML = `<div class="empty-state">在上方输入关键词，搜索所有分类下的记录</div>`;
    } else if (results.length === 0) {
      list.innerHTML = `<div class="empty-state">未找到匹配「${escapeHtml(query)}」的记录</div>`;
    } else {
      results.forEach((entry) => {
        const card = renderDocCard(entry, () => navigate(`/document/${entry.id}`));
        const badge = document.createElement('span');
        badge.className = 'search-result-cat';
        badge.style.background = CATEGORY_COLORS[entry.category];
        badge.textContent = CATEGORY_LABELS[entry.category];
        card.querySelector('.doc-card-meta')?.prepend(badge);
        list.appendChild(card);
      });
    }
  }
}

/** @param {string} s */
function escapeHtml(s) {
  const div = document.createElement('div');
  div.textContent = s;
  return div.innerHTML;
}
