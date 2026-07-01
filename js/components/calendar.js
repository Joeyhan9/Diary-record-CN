import { getTagBgColor, getTagColor } from '../types.js';
import { getDailyTags, formatDate } from '../storage.js';

/**
 * @param {import('../types.js').Category} category
 * @param {number} [days]
 */
export function renderCategoryCalendar(category, days = 28) {
  const container = document.createElement('div');
  container.className = 'mini-calendar';

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const dates = [];
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    dates.push(formatDate(d));
  }

  const weekDays = ['日', '一', '二', '三', '四', '五', '六'];

  const grid = document.createElement('div');
  grid.className = 'mini-calendar-grid';

  weekDays.forEach((wd) => {
    const label = document.createElement('div');
    label.className = 'mini-calendar-weekday';
    label.textContent = wd;
    grid.appendChild(label);
  });

  const firstDate = new Date(dates[0] + 'T00:00:00');
  const startPad = firstDate.getDay();
  for (let i = 0; i < startPad; i++) {
    const pad = document.createElement('div');
    pad.className = 'mini-calendar-day mini-calendar-day--empty';
    grid.appendChild(pad);
  }

  dates.forEach((dateStr) => {
    const dayTags = getDailyTags(dateStr, category);
    const cell = document.createElement('div');
    cell.className = 'mini-calendar-day';
    if (dateStr === formatDate(today)) cell.classList.add('mini-calendar-day--today');

    const dayNum = new Date(dateStr + 'T00:00:00').getDate();
    cell.textContent = String(dayNum);

    if (dayTags.length > 0) {
      cell.classList.add('mini-calendar-day--has-record');
      const primaryTag = dayTags[0];
      cell.style.backgroundColor = getTagBgColor(primaryTag, 0.45);
      cell.style.borderColor = getTagColor(primaryTag) + '88';
      cell.title = dayTags.map((t) => `#${t}`).join(' ');
      if (dayTags.length > 1) {
        cell.dataset.multi = 'true';
        cell.style.background = `linear-gradient(135deg, ${dayTags
          .slice(0, 3)
          .map((t) => getTagBgColor(t, 0.5))
          .join(', ')})`;
      }
    }

    grid.appendChild(cell);
  });

  container.appendChild(grid);
  return container;
}
