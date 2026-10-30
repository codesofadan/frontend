/* eslint-disable @next/next/no-img-element */
'use client';

import { useRef } from 'react';
import { FiCamera, FiImage, FiX } from 'react-icons/fi';
import { compressImage } from '@/lib/imageCompress';
import { formatBytes } from '@/lib/format';
import { useToast } from './Toast';

export const MAX_IMAGES = 6;
let nextId = 0;

// `items` is owned by the form: { id, kind: 'existing' | 'new', url, status, file?, originalSize?, size? }.
// Picked photos are compressed in the browser right away, so the form only ever uploads small files.
export default function ImageUploader({ items, setItems }) {
  const galleryRef = useRef(null);
  const cameraRef = useRef(null);
  const toast = useToast();

  async function addFiles(fileList) {
    const files = Array.from(fileList);
    if (files.length === 0) return;

    const room = Math.max(0, MAX_IMAGES - items.length);
    if (files.length > room) toast.error(`Maximum ${MAX_IMAGES} photos per product. Extra photos were skipped.`);
    const picked = files.slice(0, room);

    const fresh = picked.map((file) => ({
      id: `new-${++nextId}`,
      kind: 'new',
      url: URL.createObjectURL(file),
      status: 'compressing',
      originalSize: file.size,
    }));
    setItems((cur) => [...cur, ...fresh]);

    await Promise.all(picked.map(async (file, i) => {
      const { id, url } = fresh[i];
      try {
        const out = await compressImage(file);
        setItems((cur) => cur.map((it) => (it.id === id ? { ...it, status: 'ready', file: out, size: out.size } : it)));
      } catch (e) {
        URL.revokeObjectURL(url);
        setItems((cur) => cur.filter((it) => it.id !== id));
        toast.error(`${file.name || 'Photo'}: ${e.message}`);
      }
    }));
  }

  function onPick(e) {
    addFiles(e.target.files);
    e.target.value = ''; // lets the same photo be picked again
  }

  function remove(item) {
    if (item.kind === 'new') URL.revokeObjectURL(item.url);
    setItems((cur) => cur.filter((it) => it.id !== item.id));
  }

  const full = items.length >= MAX_IMAGES;

  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <p className="text-sm font-semibold text-gray-800">Photos <span className="font-normal text-gray-400">({items.length}/{MAX_IMAGES})</span></p>
        <p className="text-xs text-gray-500">First photo is the main one</p>
      </div>

      <div className="grid grid-cols-3 gap-2.5 sm:grid-cols-4">
        {items.map((item, i) => (
          <div key={item.id} className="group relative aspect-square overflow-hidden rounded-xl border border-gray-200 bg-gray-100">
            <img src={item.url} alt={`Product photo ${i + 1}`} className="h-full w-full object-cover" />
            {item.status === 'compressing' && (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 bg-white/80 text-xs font-semibold text-gray-700">
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-pink-600 border-t-transparent" />
                Optimizing…
              </div>
            )}
            {i === 0 && <span className="absolute bottom-1.5 left-1.5 rounded-md bg-pink-600 px-1.5 py-0.5 text-[10px] font-bold uppercase text-white">Main</span>}
            {item.kind === 'new' && item.status === 'ready' && (
              <span className="absolute bottom-1.5 right-1.5 rounded-md bg-black/65 px-1.5 py-0.5 text-[10px] font-semibold text-white">
                {formatBytes(item.size)}
              </span>
            )}
            <button
              type="button"
              onClick={() => remove(item)}
              aria-label="Remove photo"
              className="absolute right-1.5 top-1.5 flex h-7 w-7 items-center justify-center rounded-full bg-white/95 text-gray-700 shadow hover:bg-red-600 hover:text-white"
            >
              <FiX />
            </button>
          </div>
        ))}
      </div>

      <div className="mt-3 grid grid-cols-2 gap-2.5">
        <button
          type="button"
          disabled={full}
          onClick={() => cameraRef.current.click()}
          className="flex items-center justify-center gap-2 rounded-xl border-2 border-dashed border-pink-300 bg-pink-50 px-3 py-3.5 text-sm font-semibold text-pink-700 transition hover:bg-pink-100 disabled:opacity-40"
        >
          <FiCamera className="text-lg" /> Take photo
        </button>
        <button
          type="button"
          disabled={full}
          onClick={() => galleryRef.current.click()}
          className="flex items-center justify-center gap-2 rounded-xl border-2 border-dashed border-purple-300 bg-purple-50 px-3 py-3.5 text-sm font-semibold text-purple-700 transition hover:bg-purple-100 disabled:opacity-40"
        >
          <FiImage className="text-lg" /> From gallery
        </button>
      </div>
      <p className="mt-2 text-xs text-gray-500">Any size works. Photos are compressed automatically before upload.</p>

      <input ref={cameraRef} type="file" accept="image/*" capture="environment" onChange={onPick} className="hidden" />
      <input ref={galleryRef} type="file" accept="image/*" multiple onChange={onPick} className="hidden" />
    </div>
  );
}
