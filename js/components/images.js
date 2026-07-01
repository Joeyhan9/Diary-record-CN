const MAX_IMAGES = 6;
const MAX_FILE_SIZE = 2 * 1024 * 1024;

/**
 * @param {string[]} images
 * @param {(images: string[]) => void} onChange
 */
export function renderImageGallery(images, onChange) {
  const section = document.createElement('div');
  section.className = 'image-gallery';

  const label = document.createElement('div');
  label.className = 'image-gallery-label';
  label.textContent = '图片';

  const grid = document.createElement('div');
  grid.className = 'image-gallery-grid';

  const fileInput = document.createElement('input');
  fileInput.type = 'file';
  fileInput.accept = 'image/*';
  fileInput.multiple = true;
  fileInput.hidden = true;

  function render() {
    grid.innerHTML = '';

    images.forEach((src, index) => {
      const item = document.createElement('div');
      item.className = 'image-gallery-item';
      item.innerHTML = `
        <img src="${src}" alt="图片 ${index + 1}" />
        <button type="button" class="image-gallery-remove" data-index="${index}" aria-label="删除图片">×</button>
      `;
      item.querySelector('img')?.addEventListener('click', () => showLightbox(src));
      item.querySelector('.image-gallery-remove')?.addEventListener('click', (e) => {
        e.stopPropagation();
        const next = images.filter((_, i) => i !== index);
        onChange(next);
      });
      grid.appendChild(item);
    });

    if (images.length < MAX_IMAGES) {
      const addBtn = document.createElement('button');
      addBtn.type = 'button';
      addBtn.className = 'image-gallery-add';
      addBtn.innerHTML = '<span>+</span><span>添加图片</span>';
      addBtn.addEventListener('click', () => fileInput.click());
      grid.appendChild(addBtn);
    }
  }

  fileInput.addEventListener('change', async () => {
    const files = [...(fileInput.files || [])];
    fileInput.value = '';
    if (!files.length) return;

    const remaining = MAX_IMAGES - images.length;
    const toAdd = files.slice(0, remaining);
    const newImages = [...images];

    for (const file of toAdd) {
      if (!file.type.startsWith('image/')) continue;
      if (file.size > MAX_FILE_SIZE) {
        alert(`图片「${file.name}」超过 2MB，已跳过`);
        continue;
      }
      try {
        const dataUrl = await readFileAsDataUrl(file);
        newImages.push(dataUrl);
      } catch {
        alert(`无法读取图片「${file.name}」`);
      }
    }

    if (newImages.length !== images.length) onChange(newImages);
  });

  section.appendChild(label);
  section.appendChild(grid);
  section.appendChild(fileInput);

  const originalOnChange = onChange;
  onChange = (next) => {
    images = next;
    render();
    originalOnChange(next);
  };

  render();
  return section;
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
