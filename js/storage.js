import { CATEGORIES, normalizeTag } from './types.js';

const STORAGE_KEY = 'diary-timeline-entries';

/** @param {*} entry */
function migrateEntry(entry) {
  return {
    ...entry,
    tags: Array.isArray(entry.tags) ? entry.tags.map(normalizeTag).filter(Boolean) : [],
  };
}

/** @returns {import('./types.js').DiaryEntry[]} */
export function loadEntries() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.map(migrateEntry);
  } catch {
    return [];
  }
}

/** @param {import('./types.js').DiaryEntry[]} entries */
export function saveEntries(entries) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
}

/** @param {import('./types.js').Category} category */
export function getEntriesByCategory(category) {
  return loadEntries()
    .filter((e) => e.category === category)
    .sort((a, b) => b.date.localeCompare(a.date) || b.createdAt.localeCompare(a.createdAt));
}

/** @param {string} id */
export function getEntryById(id) {
  return loadEntries().find((e) => e.id === id) ?? null;
}

/** @param {string} date @param {import('./types.js').Category} category */
export function getDailyRating(date, category) {
  const entries = loadEntries().filter(
    (e) => e.date === date && e.category === category
  );
  if (entries.length === 0) return 0;
  const sum = entries.reduce((acc, e) => acc + (e.rating || 0), 0);
  return Math.round(sum / entries.length);
}

/** @param {string} date @param {import('./types.js').Category} category */
export function getDailyTags(date, category) {
  const tags = new Set();
  loadEntries()
    .filter((e) => e.date === date && e.category === category)
    .forEach((e) => e.tags.forEach((t) => tags.add(t)));
  return [...tags];
}

/** @param {string} query */
export function searchEntries(query) {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  return loadEntries()
    .filter(
      (e) =>
        (e.title || '').toLowerCase().includes(q) ||
        (e.content || '').toLowerCase().includes(q)
    )
    .sort((a, b) => b.date.localeCompare(a.date) || b.createdAt.localeCompare(a.createdAt));
}

/** @returns {string[]} */
export function getAllTags() {
  const tags = new Set();
  loadEntries().forEach((e) => e.tags.forEach((t) => tags.add(t)));
  return [...tags].sort((a, b) => a.localeCompare(b, 'zh-CN'));
}

/** @param {number} days 从当日开始向前排期，共 days 天（含今天） */
export function getDateRange(days) {
  const dates = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    dates.push(formatDate(d));
  }
  return dates;
}

/** @param {Date} d */
export function formatDate(d) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export function todayStr() {
  return formatDate(new Date());
}

/** @param {string} dateStr */
export function formatDisplayDate(dateStr) {
  const d = new Date(dateStr + 'T00:00:00');
  const today = todayStr();
  const yesterday = formatDate(new Date(Date.now() - 86400000));
  if (dateStr === today) return '今天';
  if (dateStr === yesterday) return '昨天';
  return d.toLocaleDateString('zh-CN', {
    month: 'long',
    day: 'numeric',
    weekday: 'short',
  });
}

/** @param {import('./types.js').Category} category @param {string} [date] */
export function createEntry(category, date) {
  const entry = {
    id: crypto.randomUUID(),
    category,
    title: '',
    rating: 3,
    content: '',
    date: date || todayStr(),
    createdAt: new Date().toISOString(),
    tags: [],
  };
  const entries = loadEntries();
  entries.push(entry);
  saveEntries(entries);
  return entry;
}

/** @param {import('./types.js').DiaryEntry} entry */
export function updateEntry(entry) {
  const entries = loadEntries();
  const idx = entries.findIndex((e) => e.id === entry.id);
  if (idx >= 0) {
    entries[idx] = {
      ...entry,
      tags: (entry.tags || []).map(normalizeTag).filter(Boolean),
    };
    saveEntries(entries);
  }
}

/** @param {string} id */
export function deleteEntry(id) {
  saveEntries(loadEntries().filter((e) => e.id !== id));
}

/** @param {string} text @param {number} lines */
export function previewLines(text, lines = 2) {
  if (!text) return '（暂无内容）';
  return text.split('\n').slice(0, lines).join('\n');
}
