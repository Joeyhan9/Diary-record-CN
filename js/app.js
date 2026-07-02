import { CATEGORIES } from './types.js';
import { renderHome } from './pages/home.js';
import { renderCategory } from './pages/category.js';
import { renderDocument } from './pages/document.js';
import { renderSearch } from './pages/search.js';
import { renderDay } from './pages/day.js';
import { renderLogin } from './pages/login.js';
import { renderRegister } from './pages/register.js';
import { mountBottomNav } from './components/bottom-nav.js';
import { mountSidebar, unmountSidebar } from './components/sidebar.js';
import { getEntryById } from './storage.js';
import { initAuth } from './auth/auth-service.js';
import { subscribeAuth } from './auth/auth-state.js';

const app = document.getElementById('app');

/** @type {boolean} */
let authReady = false;

function navigate(path) {
  window.location.hash = path;
}

function getRoute() {
  return window.location.hash.slice(1) || '/';
}

/** @param {boolean} show */
function setSidebarVisible(show) {
  if (show) {
    document.body.classList.add('has-sidebar');
    mountSidebar('/', navigate);
  } else {
    document.body.classList.remove('has-sidebar');
    unmountSidebar();
  }
}

function render() {
  if (!app || !authReady) return;

  const hash = getRoute();
  const [pathPart, queryPart] = hash.split('?');
  const parts = pathPart.split('/').filter(Boolean);
  const params = new URLSearchParams(queryPart || '');
  const redirectTo = params.get('redirect') || '/';

  document.body.classList.add('has-bottom-nav');

  if (parts[0] === 'login') {
    setSidebarVisible(false);
    renderLogin(app, navigate, redirectTo);
    mountBottomNav('/', navigate);
    return;
  }

  if (parts[0] === 'register') {
    setSidebarVisible(false);
    renderRegister(app, navigate, redirectTo);
    mountBottomNav('/', navigate);
    return;
  }

  if (parts.length === 0) {
    renderHome(app, navigate);
    setSidebarVisible(true);
    mountBottomNav('/', navigate);
    return;
  }

  setSidebarVisible(false);

  if (parts[0] === 'search') {
    renderSearch(app, params.get('q') || '', navigate);
    mountBottomNav('/search', navigate);
    return;
  }

  if (parts[0] === 'day' && parts[1]) {
    renderDay(app, parts[1], navigate);
    mountBottomNav('/', navigate);
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
  setSidebarVisible(true);
  mountBottomNav('/', navigate);
}

async function bootstrap() {
  if (app) {
    app.innerHTML = '<div class="app-loading">加载中…</div>';
  }
  await initAuth();
  authReady = true;
  subscribeAuth(() => render());
  render();
}

window.addEventListener('hashchange', render);
window.addEventListener('resize', () => {
  const hash = getRoute();
  const parts = hash.split('/').filter(Boolean);
  if (parts.length === 0) render();
});

if (window.matchMedia('(max-width: 640px)').matches) {
  document.body.classList.add('sidebar-collapsed');
}

bootstrap();
