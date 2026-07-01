import { CATEGORY_LABELS } from '../types.js';
import { getEntryById, updateEntry, deleteEntry, getAllTags } from '../storage.js';
import { renderStars } from '../components/stars.js';
import { renderTagEditor } from '../components/tags.js';
import { renderImageGallery } from '../components/images.js';

/**
 * @param {HTMLElement} app
 * @param {string} id
 * @param {(path: string) => void} navigate
 */
export function renderDocument(app, id, navigate) {
  const entry = getEntryById(id);
  if (!entry) {
    app.innerHTML = `
      <button class="back-btn" id="back-btn">← 返回</button>
      <div class="empty-state">文档不存在</div>
    `;
    app.querySelector('#back-btn')?.addEventListener('click', () => navigate('/'));
    return;
  }

  const categoryLabel = CATEGORY_LABELS[entry.category];
  let saveTimer = null;
  let currentTags = [...(entry.tags || [])];
  let currentImages = [...(entry.images || [])];

  app.innerHTML = `
    <button class="back-btn" id="back-btn">← ${categoryLabel}</button>
    <div class="doc-editor">
      <input class="doc-title-input" id="title" placeholder="文档标题" value="" />
      <div id="tags-root"></div>
      <div class="rating-section">
        <div class="rating-label">评分（1-5 星）</div>
        <div id="stars-root"></div>
      </div>
      <textarea class="doc-content-input" id="content" placeholder="写下今天的记录…"></textarea>
      <div id="images-root"></div>
      <div class="doc-meta-bar">
        <span>创建于 ${formatCreated(entry.createdAt)}</span>
        <span class="save-indicator" id="save-indicator">已保存</span>
      </div>
      <button class="delete-btn" id="delete-btn">删除文档</button>
    </div>
  `;

  const titleEl = /** @type {HTMLInputElement} */ (app.querySelector('#title'));
  const contentEl = /** @type {HTMLTextAreaElement} */ (app.querySelector('#content'));
  const indicator = app.querySelector('#save-indicator');
  const starsRoot = app.querySelector('#stars-root');
  const tagsRoot = app.querySelector('#tags-root');
  const imagesRoot = app.querySelector('#images-root');

  titleEl.value = entry.title;
  contentEl.value = entry.content;

  let currentRating = entry.rating;

  if (tagsRoot) {
    tagsRoot.appendChild(
      renderTagEditor(currentTags, (tags) => {
        currentTags = tags;
        persist();
      }, getAllTags())
    );
  }

  if (imagesRoot) {
    imagesRoot.appendChild(
      renderImageGallery(currentImages, (images) => {
        currentImages = images;
        persist();
      })
    );
  }

  const starsEl = renderStars(currentRating, (n) => {
    currentRating = n;
    refreshStars();
    persist();
  });
  starsRoot?.appendChild(starsEl);

  function refreshStars() {
    if (!starsRoot) return;
    starsRoot.innerHTML = '';
    starsRoot.appendChild(
      renderStars(currentRating, (n) => {
        currentRating = n;
        refreshStars();
        persist();
      })
    );
  }

  function persist() {
    updateEntry({
      ...entry,
      title: titleEl.value,
      content: contentEl.value,
      rating: currentRating,
      tags: currentTags,
      images: currentImages,
    });
    if (indicator) {
      indicator.classList.add('visible');
      clearTimeout(saveTimer);
      saveTimer = setTimeout(() => indicator.classList.remove('visible'), 1500);
    }
  }

  titleEl.addEventListener('input', persist);
  contentEl.addEventListener('input', persist);

  app.querySelector('#back-btn')?.addEventListener('click', () => {
    navigate(`/day/${entry.date}`);
  });

  app.querySelector('#delete-btn')?.addEventListener('click', () => {
    if (confirm('确定删除这篇文档吗？')) {
      deleteEntry(entry.id);
      navigate(`/category/${entry.category}`);
    }
  });
}

/** @param {string} iso */
function formatCreated(iso) {
  const d = new Date(iso);
  return d.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}
