/** @typedef {'work' | 'study' | 'life' | 'healthy'} Category */

/** @typedef {{ id: string, category: Category, title: string, rating: number, content: string, date: string, createdAt: string, tags: string[] }} DiaryEntry */

export const CATEGORIES = /** @type {const} */ ([
  'work',
  'study',
  'life',
  'healthy',
]);

export const CATEGORY_COLORS = {
  work: '#e07a5f',
  study: '#3d85c6',
  life: '#81b29a',
  healthy: '#f2cc8f',
};

export const CATEGORY_LABELS = {
  work: 'Work',
  study: 'Study',
  life: 'Life',
  healthy: 'Healthy',
};

/** 预设标签颜色，日历与主页标签 chip 共用 */
export const TAG_COLORS = {
  党建: '#e74c3c',
  面试: '#9b59b6',
  运动: '#ffb6c1',
  阅读: '#3498db',
  学习: '#2ecc71',
  健身: '#ff9ff3',
  会议: '#f39c12',
  旅行: '#1abc9c',
  饮食: '#e67e22',
  睡眠: '#a29bfe',
};

const FALLBACK_PALETTE = [
  '#e07a5f',
  '#3d85c6',
  '#81b29a',
  '#f2cc8f',
  '#9b59b6',
  '#3498db',
  '#e74c3c',
  '#1abc9c',
  '#ffb6c1',
  '#a29bfe',
];

/** @param {string} tag */
export function normalizeTag(tag) {
  const t = tag.trim().replace(/^#+/, '');
  return t;
}

/** @param {string} tag */
export function getTagColor(tag) {
  const name = normalizeTag(tag);
  if (TAG_COLORS[/** @type {keyof typeof TAG_COLORS} */ (name)]) {
    return TAG_COLORS[/** @type {keyof typeof TAG_COLORS} */ (name)];
  }
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return FALLBACK_PALETTE[Math.abs(hash) % FALLBACK_PALETTE.length];
}

/** @param {string} tag @param {number} [alpha] */
export function getTagBgColor(tag, alpha = 0.35) {
  const hex = getTagColor(tag);
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}
