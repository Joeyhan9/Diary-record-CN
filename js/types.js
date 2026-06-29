/** @typedef {'work' | 'study' | 'life' | 'healthy'} Category */

/** @typedef {{ id: string, category: Category, title: string, rating: number, content: string, date: string, createdAt: string }} DiaryEntry */

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
