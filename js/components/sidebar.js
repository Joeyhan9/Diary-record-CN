import { CATEGORY_COLORS, CATEGORY_LABELS } from '../types.js';
import { getEntriesGroupedByDate, formatDisplayDate, previewLines } from '../storage.js';

/**
 * @param {string} activeRoute
 * @param {(path: string) => void} navigate
 */
export function renderSidebar(activeRoute, navigate) {
  const aside = document.createElement('aside');
  aside.className = 'sidebar';
  aside.setAttribute('aria-label', '内容指引');

  const groups = getEntriesGroupedByDate();

  aside.innerHTML = `
    <div class="sidebar-header">
      <h2 class="sidebar-title">内容指引</h2>
      <button type="button" class="sidebar-toggle" id="sidebar-toggle" aria-label="收起侧栏">‹</button>
    </div>
    <div class="sidebar-list" id="sidebar-list">
      ${
        groups.length === 0
          ? '<p class="sidebar-empty">暂无记录，创建第一篇日记后这里会显示日期索引</p>'
          : groups
              .map(({ date, entries }) => {
                const isActive = activeRoute === `/day/${date}`;
                const categories = [...new Set(entries.map((e) => e.category))];
                const preview = entries
                  .map((e) => e.title || previewLines(e.content, 1))
                  .filter(Boolean)
                  .slice(0, 2)
                  .join(' · ');
                const hasImages = entries.some((e) => e.images?.length > 0);
                return `
                  <button type="button" class="sidebar-item${isActive ? ' sidebar-item--active' : ''}" data-date="${date}">
                    <div class="sidebar-item-date">${formatDisplayDate(date)}</div>
                    <div class="sidebar-item-meta">
                      <span class="sidebar-item-dots">
                        ${categories
                          .map(
                            (cat) =>
                              `<span class="sidebar-item-dot" style="background:${CATEGORY_COLORS[cat]}" title="${CATEGORY_LABELS[cat]}"></span>`
                          )
                          .join('')}
                      </span>
                      <span class="sidebar-item-count">${entries.length} 篇</span>
                      ${hasImages ? '<span class="sidebar-item-image-icon" title="含图片">🖼</span>' : ''}
                    </div>
                    <div class="sidebar-item-preview">${escapeHtml(preview || '（暂无内容）')}</div>
                  </button>`;
              })
              .join('')
      }
    </div>
  `;

  aside.querySelectorAll('.sidebar-item').forEach((btn) => {
    btn.addEventListener('click', () => {
      const date = btn.dataset.date;
      if (date) navigate(`/day/${date}`);
    });
  });

  aside.querySelector('#sidebar-toggle')?.addEventListener('click', () => {
    document.body.classList.toggle('sidebar-collapsed');
    const collapsed = document.body.classList.contains('sidebar-collapsed');
    const toggle = aside.querySelector('#sidebar-toggle');
    if (toggle) {
      toggle.textContent = collapsed ? '›' : '‹';
      toggle.setAttribute('aria-label', collapsed ? '展开侧栏' : '收起侧栏');
    }
  });

  return aside;
}

/** @param {string} route @param {(path: string) => void} navigate */
export function mountSidebar(route, navigate) {
  document.querySelector('.sidebar')?.remove();
  const sidebar = renderSidebar(route, navigate);
  document.body.insertBefore(sidebar, document.getElementById('app'));
}

/** @param {string} s */
function escapeHtml(s) {
  const div = document.createElement('div');
  div.textContent = s;
  return div.innerHTML;
}
