/**
 * @param {number} rating
 * @param {(n: number) => void} [onChange]
 * @param {boolean} [readonly]
 */
export function renderStars(rating, onChange, readonly = false) {
  const stars = [1, 2, 3, 4, 5]
    .map(
      (n) =>
        `<button type="button" class="star-btn ${n <= rating ? 'active' : ''}" data-star="${n}" ${readonly ? 'disabled' : ''} aria-label="${n} 星">★</button>`
    )
    .join('');

  const wrapper = document.createElement('div');
  wrapper.className = 'stars';
  wrapper.innerHTML = stars;

  if (!readonly && onChange) {
    wrapper.querySelectorAll('.star-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        onChange(Number(btn.dataset.star));
      });
    });
  }

  return wrapper;
}

/**
 * @param {import('../types.js').DiaryEntry} entry
 * @param {() => void} onClick
 */
export function renderDocCard(entry, onClick) {
  const card = document.createElement('article');
  card.className = 'doc-card';
  card.innerHTML = `
    <div class="doc-card-title">${escapeHtml(entry.title || '无标题')}</div>
    <div class="doc-card-meta">
      <span class="stars-inline">${'★'.repeat(entry.rating)}${'☆'.repeat(5 - entry.rating)}</span>
      <span>${formatDate(entry.date)}</span>
    </div>
    <div class="doc-card-preview">${escapeHtml(preview(entry.content))}</div>
  `;
  card.addEventListener('click', onClick);
  return card;
}

/** @param {string} text */
function preview(text) {
  if (!text) return '（暂无内容）';
  return text.split('\n').slice(0, 2).join('\n');
}

/** @param {string} dateStr */
function formatDate(dateStr) {
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' });
}

/** @param {string} s */
function escapeHtml(s) {
  const div = document.createElement('div');
  div.textContent = s;
  return div.innerHTML;
}

export { escapeHtml };
