import { CATEGORY_COLORS, CATEGORY_LABELS } from '../types.js';
import { getEntriesByDate, formatDisplayDate } from '../storage.js';
import { renderTagChips } from '../components/tags.js';
import { escapeHtml } from '../components/stars.js';

/**
 * @param {HTMLElement} app
 * @param {string} date
 * @param {(path: string) => void} navigate
 */
export function renderDay(app, date, navigate) {
  const entries = getEntriesByDate(date);

  app.innerHTML = `
    <button class="back-btn" id="back-btn">← 首页</button>
    <header class="day-header">
      <h1>${formatDisplayDate(date)}</h1>
      <p class="day-subtitle">${date} · 共 ${entries.length} 篇记录</p>
    </header>
    <div class="day-entries" id="day-entries"></div>
  `;

  app.querySelector('#back-btn')?.addEventListener('click', () => navigate('/'));

  const root = app.querySelector('#day-entries');
  if (!root) return;

  if (entries.length === 0) {
    root.innerHTML = `<div class="empty-state">这一天还没有记录</div>`;
    return;
  }

  entries.forEach((entry) => {
    const card = document.createElement('article');
    card.className = 'day-entry-card';
    const color = CATEGORY_COLORS[entry.category];
    const label = CATEGORY_LABELS[entry.category];

    card.innerHTML = `
      <div class="day-entry-header">
        <span class="day-entry-cat" style="background:${color}">${label}</span>
        <span class="day-entry-stars">${'★'.repeat(entry.rating)}${'☆'.repeat(5 - entry.rating)}</span>
      </div>
      <h3 class="day-entry-title">${escapeHtml(entry.title || '无标题')}</h3>
      <div class="day-entry-tags" id="tags-${entry.id}"></div>
      <div class="day-entry-content">${escapeHtml(entry.content || '（暂无文字内容）')}</div>
      <div class="day-entry-images" id="images-${entry.id}"></div>
      <button type="button" class="day-entry-edit">编辑 →</button>
    `;

    const tagsRoot = card.querySelector(`#tags-${entry.id}`);
    if (tagsRoot && entry.tags?.length) {
      tagsRoot.appendChild(renderTagChips(entry.tags, { size: 'sm' }));
    } else if (tagsRoot) {
      tagsRoot.remove();
    }

    const imagesRoot = card.querySelector(`#images-${entry.id}`);
    if (imagesRoot && entry.images?.length) {
      entry.images.forEach((src, i) => {
        const img = document.createElement('img');
        img.className = 'day-entry-image';
        img.src = src;
        img.alt = `图片 ${i + 1}`;
        img.loading = 'lazy';
        img.addEventListener('click', (e) => {
          e.stopPropagation();
          showImageLightbox(src);
        });
        imagesRoot.appendChild(img);
      });
    } else if (imagesRoot) {
      imagesRoot.remove();
    }

    card.querySelector('.day-entry-edit')?.addEventListener('click', () => {
      navigate(`/document/${entry.id}`);
    });

    card.addEventListener('click', (e) => {
      if (e.target instanceof HTMLImageElement) return;
      navigate(`/document/${entry.id}`);
    });

    root.appendChild(card);
  });
}

/** @param {string} src */
function showImageLightbox(src) {
  const overlay = document.createElement('div');
  overlay.className = 'image-lightbox';
  overlay.innerHTML = `<img src="${src}" alt="预览" /><button type="button" class="image-lightbox-close" aria-label="关闭">×</button>`;
  const close = () => overlay.remove();
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay || e.target.closest('.image-lightbox-close')) close();
  });
  document.body.appendChild(overlay);
}
