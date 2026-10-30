// Shrinks a photo in the browser before upload: camera shots (5-10MB) become ~300KB,
// which keeps the Vercel body limit and the Cloudinary free plan comfortable.
const MAX_SIDE = 1280;
const TARGET_BYTES = 350 * 1024;

async function decode(file) {
  if ('createImageBitmap' in window) {
    try {
      return await createImageBitmap(file, { imageOrientation: 'from-image' });
    } catch {}
  }
  // Fallback for browsers that cannot decode through createImageBitmap
  const url = URL.createObjectURL(file);
  try {
    const img = new Image();
    img.src = url;
    await img.decode();
    return img;
  } finally {
    URL.revokeObjectURL(url);
  }
}

export async function compressImage(file) {
  if (!file.type.startsWith('image/')) throw new Error('Not an image file');

  const img = await decode(file);
  const w = img.width || img.naturalWidth;
  const h = img.height || img.naturalHeight;
  let scale = Math.min(1, MAX_SIDE / Math.max(w, h));

  // Already small: re-encoding would only lose quality.
  if (scale === 1 && file.type === 'image/jpeg' && file.size <= TARGET_BYTES) {
    img.close?.();
    return file;
  }

  let quality = 0.85;
  let blob = null;
  for (let attempt = 0; attempt < 8; attempt++) {
    const canvas = document.createElement('canvas');
    canvas.width = Math.max(1, Math.round(w * scale));
    canvas.height = Math.max(1, Math.round(h * scale));
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#fff'; // JPEG has no transparency
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

    blob = await new Promise((resolve) => canvas.toBlob(resolve, 'image/jpeg', quality));
    if (!blob) throw new Error('Could not process this image');
    if (blob.size <= TARGET_BYTES) break;

    // Lower quality first (down to 0.6), then shrink the pixels.
    if (quality > 0.6) quality -= 0.1;
    else scale *= 0.85;
  }
  img.close?.();

  const base = file.name.replace(/\.[^.]+$/, '') || 'photo';
  return new File([blob], `${base}.jpg`, { type: 'image/jpeg' });
}
