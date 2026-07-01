import { CATEGORIES } from './types.js';
import { renderHome } from './pages/home.js';
import { renderCategory } from './pages/category.js';
import { renderDocument } from './pages/document.js';
import { renderSearch } from './pages/search.js';
import { mountBottomNav } from './components/bottom-nav.js';
import { getEntryById } from './storage.js';

const app = document.getElementById('app');

function navigate(path) {
  window.location.hash = path;
}

function getRoute() {
  return window.location.hash.slice(1) || '/';
}

function render() {
  if (!app) return;

  const hash = getRoute();
  const [pathPart, queryPart] = hash.split('?');
  const parts = pathPart.split('/').filter(Boolean);
  const params = new URLSearchParams(queryPart || '');

  document.body.classList.add('has-bottom-nav');

  if (parts.length === 0) {
    renderHome(app, navigate);
    mountBottomNav('/', navigate);
    return;
  }

  if (parts[0] === 'search') {
    renderSearch(app, params.get('q') || '', navigate);
    mountBottomNav('/search', navigate);
    return;
  }

  if (parts[0] === 'category' && CATEGORIES.includes(/** @type {*} */ (parts[1]))) {
    const cat = /** @type {import('./types.js').Category} */ (parts[1]);
    renderCategory(app, cat, navigate);
    mountBottomNav(`/category/${cat}`, navigate);
    return;
  }

  if (parts[0] === 'document' && parts[1]) {
    renderDocument(app, parts[1], navigate);
    const doc = getEntryById(parts[1]);
    mountBottomNav(doc ? `/category/${doc.category}` : '/', navigate);
    return;
  }

  renderHome(app, navigate);
  mountBottomNav('/', navigate);
}

window.addEventListener('hashchange', render);
window.addEventListener('resize', () => {
  const hash = getRoute();
  const parts = hash.split('/').filter(Boolean);
  if (parts.length === 0) render();
});
render();
