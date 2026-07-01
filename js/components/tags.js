import { getTagColor, normalizeTag } from '../types.js';

/**
 * @param {string[]} tags
 * @param {{ size?: 'sm' | 'md', max?: number }} [opts]
 */
export function renderTagChips(tags, opts = {}) {
  const { size = 'md', max } = opts;
  const list = max ? tags.slice(0, max) : tags;
  const wrapper = document.createElement('div');
  wrapper.className = `tag-chips tag-chips--${size}`;

  list.forEach((tag) => {
    const chip = document.createElement('span');
    chip.className = 'tag-chip';
    const color = getTagColor(tag);
    chip.style.setProperty('--tag-color', color);
    chip.style.backgroundColor = color + '33';
    chip.style.borderColor = color + '66';
    chip.textContent = `#${normalizeTag(tag)}`;
    wrapper.appendChild(chip);
  });

  if (max && tags.length > max) {
    const more = document.createElement('span');
    more.className = 'tag-chip tag-chip--more';
    more.textContent = `+${tags.length - max}`;
    wrapper.appendChild(more);
  }

  return wrapper;
}

/**
 * @param {string[]} tags
 * @param {(tags: string[]) => void} onChange
 * @param {string[]} [suggestions]
 */
export function renderTagEditor(tags, onChange, suggestions = []) {
  const container = document.createElement('div');
  container.className = 'tag-editor';

  let currentTags = [...tags];

  function render() {
    container.innerHTML = `
      <div class="tag-editor-label">标签（如 #党建 #面试 #运动，回车添加）</div>
      <div class="tag-editor-chips" id="tag-chips"></div>
      <input class="tag-editor-input" id="tag-input" placeholder="输入标签后按回车…" list="tag-suggestions" />
      <datalist id="tag-suggestions">
        ${suggestions.map((t) => `<option value="${t}">`).join('')}
      </datalist>
    `;

    const chipsRoot = container.querySelector('#tag-chips');
    if (chipsRoot) {
      chipsRoot.appendChild(renderTagChips(currentTags));
      chipsRoot.querySelectorAll('.tag-chip:not(.tag-chip--more)').forEach((chip, i) => {
        chip.style.cursor = 'pointer';
        chip.title = '点击移除';
        chip.addEventListener('click', () => {
          currentTags = currentTags.filter((_, idx) => idx !== i);
          onChange(currentTags);
          render();
        });
      });
    }

    const input = /** @type {HTMLInputElement} */ (container.querySelector('#tag-input'));
    input?.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        const raw = input.value.trim();
        if (!raw) return;
        const tag = normalizeTag(raw);
        if (tag && !currentTags.includes(tag)) {
          currentTags = [...currentTags, tag];
          onChange(currentTags);
        }
        input.value = '';
        render();
      }
    });
  }

  render();
  return container;
}
