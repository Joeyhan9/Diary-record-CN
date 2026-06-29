import { CATEGORIES } from './types.js';
import { renderHome } from './pages/home.js';
import { renderCategory } from './pages/category.js';
import { renderDocument } from './pages/document.js';

const app = document.getElementById('app');

function navigate(path) {
  window.location.hash = path;
}

function render() {
  if (!app) return;

  const hash = window.location.hash.slice(1) || '/';
  const parts = hash.split('/').filter(Boolean);

  if (parts.length === 0 || parts[0] === '') {
    renderHome(app, navigate);
    return;
  }

  if (parts[0] === 'category' && CATEGORIES.includes(/** @type {*} */ (parts[1]))) {
    renderCategory(app, /** @type {import('./types.js').Category} */ (parts[1]), navigate);
    return;
  }

  if (parts[0] === 'document' && parts[1]) {
    renderDocument(app, parts[1], navigate);
    return;
  }

  renderHome(app, navigate);
}

window.addEventListener('hashchange', render);
window.addEventListener('resize', () => {
  const hash = window.location.hash.slice(1) || '/';
  if (hash === '/' || hash === '') render();
});
render();
