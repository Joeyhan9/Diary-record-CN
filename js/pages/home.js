import { renderTimeline } from '../components/timeline.js';

/**
 * @param {HTMLElement} app
 * @param {(path: string) => void} navigate
 */
export function renderHome(app, navigate) {
  app.innerHTML = `
    <div class="home-layout">
      <div class="home-intro">
        <h1>生活记录</h1>
        <p>点击下方线条，进入对应单元写日记</p>
      </div>
      <section class="timeline-section">
        <div id="timeline-root"></div>
      </section>
    </div>
  `;

  const root = app.querySelector('#timeline-root');
  if (root) {
    renderTimeline(root, (category) => navigate(`/category/${category}`));
  }
}
