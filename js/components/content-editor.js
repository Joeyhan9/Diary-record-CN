const MAX_IMAGES = 6;
const MAX_FILE_SIZE = 2 * 1024 * 1024;

/**
 * @param {{ content: string, images: string[], readOnly?: boolean, onContentChange: (v: string) => void, onImagesChange: (v: string[]) => void }} opts
 */
export function renderContentEditor({ content, images, readOnly = false, onContentChange, onImagesChange }) {
  const wrapper = document.createElement('div');
  wrapper.className = 'doc-content-editor';

  const textarea = document.createElement('textarea');
  textarea.className = 'doc-content-input';
  textarea.placeholder = '写下今天的记录…';
  textarea.value = content;
  if (readOnly) textarea.readOnly = true;

  const imagesRow = document.createElement('div');
  imagesRow.className = 'doc-content-images';

  const fileInput = document.createElement('input');
  fileInput.type = 'file';
  fileInput.accept = 'image/*';
  fileInput.multiple = true;
  fileInput.hidden = true;

  let currentImages = [...images];

  function renderImages() {
    imagesRow.innerHTML = '';

    currentImages.forEach((src, index) => {
      const item = document.createElement('div');
      item.className = 'doc-content-image-item';
      item.innerHTML = `
        <img src="${src}" alt="图片 ${index + 1}" />
        ${readOnly ? '' : '<button type="button" class="doc-content-image-remove" aria-label="删除图片">×</button>'}
      `;
      item.querySelector('img')?.addEventListener('click', () => showLightbox(src));
      if (!readOnly) {
        item.querySelector('.doc-content-image-remove')?.addEventListener('click', (e) => {
          e.stopPropagation();
          currentImages = currentImages.filter((_, i) => i !== index);
          onImagesChange(currentImages);
          renderImages();
        });
      }
      imagesRow.appendChild(item);
    });

    if (!readOnly && currentImages.length < MAX_IMAGES) {
      const addBtn = document.createElement('button');
      addBtn.type = 'button';
      addBtn.className = 'doc-content-add-btn';
      addBtn.setAttribute('aria-label', '添加图片');
      addBtn.textContent = '+';
      addBtn.addEventListener('click', () => fileInput.click());
      imagesRow.appendChild(addBtn);
    }
  }

  if (!readOnly) {
    fileInput.addEventListener('change', async () => {
      const files = [...(fileInput.files || [])];
      fileInput.value = '';
      if (!files.length) return;

      const remaining = MAX_IMAGES - currentImages.length;
      const toAdd = files.slice(0, remaining);
      const next = [...currentImages];

      for (const file of toAdd) {
        if (!file.type.startsWith('image/')) continue;
        if (file.size > MAX_FILE_SIZE) {
          alert(`图片「${file.name}」超过 2MB，已跳过`);
          continue;
        }
        try {
          next.push(await readFileAsDataUrl(file));
        } catch {
          alert(`无法读取图片「${file.name}」`);
        }
      }

      if (next.length !== currentImages.length) {
        currentImages = next;
        onImagesChange(currentImages);
        renderImages();
      }
    });

    textarea.addEventListener('input', () => onContentChange(textarea.value));
  }

  wrapper.appendChild(textarea);
  wrapper.appendChild(imagesRow);
  wrapper.appendChild(fileInput);
  renderImages();

  return { wrapper, textarea, setImages: (next) => { currentImages = next; renderImages(); } };
}

/** @param {File} file */
function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(/** @type {string} */ (reader.result));
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/** @param {string} src */
function showLightbox(src) {
  const overlay = document.createElement('div');
  overlay.className = 'image-lightbox';
  overlay.innerHTML = `<img src="${src}" alt="预览" /><button type="button" class="image-lightbox-close" aria-label="关闭">×</button>`;
  const close = () => overlay.remove();
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay || e.target.closest('.image-lightbox-close')) close();
  });
  document.body.appendChild(overlay);
}
