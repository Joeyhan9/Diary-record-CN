import { CATEGORIES, CATEGORY_COLORS, CATEGORY_LABELS } from '../types.js';
import { getDateRange, getDailyRating, formatDisplayDate } from '../storage.js';

const DAYS = 14;
const CHART_HEIGHT = 160;
const PADDING = { top: 12, right: 8, bottom: 4, left: 8 };

/**
 * @param {HTMLElement} container
 * @param {(category: import('./types.js').Category) => void} onLineClick
 */
export function renderTimeline(container, onLineClick) {
  const dates = getDateRange(DAYS);
  const width = container.clientWidth || 640;
  const innerW = width - PADDING.left - PADDING.right;
  const innerH = CHART_HEIGHT - PADDING.top - PADDING.bottom;
  const stepX = innerW / Math.max(dates.length - 1, 1);

  const pointsFor = (category) =>
    dates.map((date, i) => {
      const rating = getDailyRating(date, category);
      const x = PADDING.left + i * stepX;
      const y = PADDING.top + innerH - (rating / 5) * innerH;
      return { x, y, rating, date };
    });

  const pathD = (pts) =>
    pts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(' ');

  const gridLines = [1, 2, 3, 4, 5]
    .map((level) => {
      const y = PADDING.top + innerH - (level / 5) * innerH;
      return `<line x1="${PADDING.left}" y1="${y}" x2="${width - PADDING.right}" y2="${y}" stroke="#e8dfc8" stroke-width="1" stroke-dasharray="4 4" opacity="0.6"/>`;
    })
    .join('');

  const lines = CATEGORIES.map((cat) => {
    const pts = pointsFor(cat);
    const color = CATEGORY_COLORS[cat];
    return `
      <path
        class="timeline-line"
        data-category="${cat}"
        d="${pathD(pts)}"
        stroke="${color}"
      />
      ${pts
        .filter((p) => p.rating > 0)
        .map(
          (p) =>
            `<circle cx="${p.x}" cy="${p.y}" r="3.5" fill="${color}" pointer-events="none"/>`
        )
        .join('')}
    `;
  }).join('');

  const labelStart = formatDisplayDate(dates[0]);
  const labelEnd = formatDisplayDate(dates[dates.length - 1]);

  container.innerHTML = `
    <div class="timeline-legend">
      ${CATEGORIES.map(
        (cat) => `
        <div class="legend-item">
          <span class="legend-dot" style="background:${CATEGORY_COLORS[cat]}"></span>
          <span>${CATEGORY_LABELS[cat]}</span>
        </div>`
      ).join('')}
    </div>
    <div class="timeline-chart">
      <svg viewBox="0 0 ${width} ${CHART_HEIGHT}" preserveAspectRatio="none">
        ${gridLines}
        ${lines}
      </svg>
      <div class="timeline-labels">
        <span>${labelStart}</span>
        <span>${labelEnd}</span>
      </div>
    </div>
  `;

  container.querySelectorAll('.timeline-line').forEach((el) => {
    el.addEventListener('click', () => {
      const cat = /** @type {import('./types.js').Category} */ (el.dataset.category);
      onLineClick(cat);
    });
  });
}
