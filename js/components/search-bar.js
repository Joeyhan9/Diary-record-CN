/**
 * @param {(query: string) => void} onSearch
 * @param {string} [initialQuery]
 */
export function renderSearchBar(onSearch, initialQuery = '') {
  const wrapper = document.createElement('div');
  wrapper.className = 'search-bar';
  wrapper.innerHTML = `
    <span class="search-icon" aria-hidden="true">🔍</span>
    <input
      type="search"
      class="search-input"
      id="global-search"
      placeholder="搜索标题或内容…"
      value="${escapeAttr(initialQuery)}"
      autocomplete="off"
    />
    ${initialQuery ? '<button type="button" class="search-clear" id="search-clear" aria-label="清除搜索">×</button>' : ''}
  `;

  const input = /** @type {HTMLInputElement} */ (wrapper.querySelector('#global-search'));
  let debounce = null;

  input?.addEventListener('input', () => {
    clearTimeout(debounce);
    debounce = setTimeout(() => onSearch(input.value), 250);
  });

  input?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      clearTimeout(debounce);
      onSearch(input.value);
    }
  });

  wrapper.querySelector('#search-clear')?.addEventListener('click', () => {
    input.value = '';
    onSearch('');
  });

  return wrapper;
}

/** @param {string} s */
function escapeAttr(s) {
  return s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
}
