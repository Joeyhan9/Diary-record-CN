import { loadEntries } from '../storage.js';
import { CATEGORY_LABELS, normalizeTag } from '../types.js';

export function exportCSV() {
  const entries = loadEntries();
  const header = ['id', 'category', 'title', 'rating', 'content', 'date', 'tags', 'createdAt'];
  const rows = entries.map((e) =>
    [
      e.id,
      e.category,
      csvCell(e.title),
      e.rating,
      csvCell(e.content),
      e.date,
      csvCell(e.tags.map((t) => `#${normalizeTag(t)}`).join(' ')),
      e.createdAt,
    ].join(',')
  );
  const bom = '\uFEFF';
  const csv = bom + [header.join(','), ...rows].join('\n');
  downloadBlob(csv, 'diary-export.csv', 'text/csv;charset=utf-8');
}

export function exportPDF() {
  const entries = loadEntries().sort(
    (a, b) => b.date.localeCompare(a.date) || b.createdAt.localeCompare(a.createdAt)
  );

  const html = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8" />
  <title>生活记录导出</title>
  <style>
    body { font-family: "PingFang SC", "Microsoft YaHei", sans-serif; padding: 24px; color: #3d3a32; }
    h1 { font-size: 20px; margin-bottom: 4px; }
    .meta { color: #8a8578; font-size: 12px; margin-bottom: 24px; }
    .entry { border-bottom: 1px solid #e8dfc8; padding: 16px 0; page-break-inside: avoid; }
    .entry-title { font-size: 16px; font-weight: 600; margin-bottom: 4px; }
    .entry-meta { font-size: 12px; color: #8a8578; margin-bottom: 8px; }
    .entry-tags { margin-bottom: 8px; }
    .tag { display: inline-block; background: #f5f0e0; padding: 2px 8px; border-radius: 4px; font-size: 11px; margin-right: 4px; }
    .entry-content { font-size: 14px; line-height: 1.7; white-space: pre-wrap; }
    @media print { body { padding: 0; } }
  </style>
</head>
<body>
  <h1>生活记录</h1>
  <div class="meta">导出时间：${new Date().toLocaleString('zh-CN')} · 共 ${entries.length} 条</div>
  ${entries
    .map(
      (e) => `
    <article class="entry">
      <div class="entry-title">${escapeHtml(e.title || '无标题')}</div>
      <div class="entry-meta">${CATEGORY_LABELS[e.category]} · ${e.date} · ${'★'.repeat(e.rating)}${'☆'.repeat(5 - e.rating)}</div>
      ${e.tags.length ? `<div class="entry-tags">${e.tags.map((t) => `<span class="tag">#${escapeHtml(t)}</span>`).join('')}</div>` : ''}
      <div class="entry-content">${escapeHtml(e.content || '（暂无内容）')}</div>
    </article>`
    )
    .join('')}
  <script>window.onload = () => { window.print(); }<\/script>
</body>
</html>`;

  const win = window.open('', '_blank');
  if (win) {
    win.document.write(html);
    win.document.close();
  }
}

/**
 * @param {HTMLElement} container
 */
export function renderExportMenu(container) {
  const menu = document.createElement('div');
  menu.className = 'export-menu';
  menu.innerHTML = `
    <button type="button" class="export-btn" id="export-toggle" aria-label="导出" title="导出">⬇</button>
    <div class="export-dropdown" id="export-dropdown" hidden>
      <button type="button" class="export-option" id="export-csv">导出 CSV</button>
      <button type="button" class="export-option" id="export-pdf">导出 PDF</button>
    </div>
  `;

  const toggle = menu.querySelector('#export-toggle');
  const dropdown = menu.querySelector('#export-dropdown');

  toggle?.addEventListener('click', (e) => {
    e.stopPropagation();
    dropdown?.toggleAttribute('hidden');
  });

  document.addEventListener('click', () => dropdown?.setAttribute('hidden', ''));

  menu.querySelector('#export-csv')?.addEventListener('click', () => {
    exportCSV();
    dropdown?.setAttribute('hidden', '');
  });

  menu.querySelector('#export-pdf')?.addEventListener('click', () => {
    exportPDF();
    dropdown?.setAttribute('hidden', '');
  });

  container.appendChild(menu);
  return menu;
}

/** @param {string} content @param {string} filename @param {string} mime */
function downloadBlob(content, filename, mime) {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

/** @param {string} s */
function csvCell(s) {
  const v = String(s ?? '').replace(/"/g, '""');
  return `"${v}"`;
}

/** @param {string} s */
function escapeHtml(s) {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
