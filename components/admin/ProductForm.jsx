'use client';

import { useState } from 'react';
import { FiX } from 'react-icons/fi';
import { adminAPI } from '@/lib/adminApi';
import ImageUploader from './ImageUploader';
import { useToast } from './Toast';
import { cap, ErrorBanner, ghostBtn, inputClass, primaryBtn } from './ui';

const CATEGORIES = ['nails', 'hudamoji', 'mix brands'];

const Field = ({ label, children, className = '' }) => (
  <label className={`block ${className}`}>
    <span className="mb-1 block text-sm font-semibold text-gray-800">{label}</span>
    {children}
  </label>
);

export default function ProductForm({ product, onSaved, onCancel }) {
  const toast = useToast();
  const [form, setForm] = useState({
    name: product?.name || '',
    price: product?.price ?? '',
    originalPrice: product?.originalPrice ?? '',
    category: product?.category || '',
    stock: product?.stock ?? '',
    description: product?.description || '',
    featured: product?.featured || false,
    status: product?.status === 'inactive' ? 'inactive' : 'active',
  });
  const [shades, setShades] = useState(product?.shades || []);
  const [shadeName, setShadeName] = useState('');
  const [shadeCode, setShadeCode] = useState('#d946a8');
  const [items, setItems] = useState(
    (product?.images || []).map((img) => ({ id: img.public_id, kind: 'existing', public_id: img.public_id, url: img.url, status: 'ready' }))
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.type === 'checkbox' ? e.target.checked : e.target.value }));
  const compressing = items.some((i) => i.status === 'compressing');

  function addShade() {
    if (!shadeName.trim()) return toast.error('Give the shade a name first');
    setShades((s) => [...s, { name: shadeName.trim(), code: shadeCode }]);
    setShadeName('');
  }

  async function submit(e) {
    e.preventDefault();
    if (items.length === 0) return setError('Add at least one photo');
    setSaving(true);
    setError('');
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      fd.append('shades', JSON.stringify(shades));
      items.filter((i) => i.kind === 'new').forEach((i) => fd.append('images', i.file));
      if (product) {
        fd.append('existingImages', JSON.stringify(items.filter((i) => i.kind === 'existing').map((i) => i.public_id)));
      }
      const res = product ? await adminAPI.updateProduct(product._id, fd) : await adminAPI.createProduct(fd);
      toast.success(product ? 'Product updated' : 'Product added');
      onSaved(res.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={submit} className="space-y-5">
      <ImageUploader items={items} setItems={setItems} />

      <Field label="Product name">
        <input required maxLength={100} value={form.name} onChange={set('name')} placeholder="e.g. Ruby Red Nail Polish" className={inputClass} />
      </Field>

      <div className="grid grid-cols-2 gap-3">
        <Field label="Price (Rs)">
          <input required type="number" inputMode="decimal" min="0" value={form.price} onChange={set('price')} className={inputClass} />
        </Field>
        <Field label="Original price (Rs)">
          <input type="number" inputMode="decimal" min="0" value={form.originalPrice} onChange={set('originalPrice')} placeholder="For sale price" className={inputClass} />
        </Field>
        <Field label="Category">
          <select required value={form.category} onChange={set('category')} className={inputClass}>
            <option value="">Select…</option>
            {CATEGORIES.map((c) => <option key={c} value={c}>{cap(c)}</option>)}
          </select>
        </Field>
        <Field label="Stock">
          <input required type="number" inputMode="numeric" min="0" value={form.stock} onChange={set('stock')} className={inputClass} />
        </Field>
      </div>

      <Field label="Description">
        <textarea required maxLength={2000} rows={4} value={form.description} onChange={set('description')} className={inputClass} />
      </Field>

      <div className="grid gap-2 sm:grid-cols-2">
        <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-gray-200 px-4 py-3">
          <input type="checkbox" checked={form.status === 'active'} onChange={(e) => setForm((f) => ({ ...f, status: e.target.checked ? 'active' : 'inactive' }))} className="h-5 w-5 accent-pink-600" />
          <span><span className="block text-sm font-semibold">Visible in store</span><span className="text-xs text-gray-500">Untick to hide it</span></span>
        </label>
        <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-gray-200 px-4 py-3">
          <input type="checkbox" checked={form.featured} onChange={set('featured')} className="h-5 w-5 accent-pink-600" />
          <span><span className="block text-sm font-semibold">Featured</span><span className="text-xs text-gray-500">Shows a badge</span></span>
        </label>
      </div>

      <div className="rounded-xl border border-gray-200 p-4">
        <p className="mb-2 text-sm font-semibold text-gray-800">Shades <span className="font-normal text-gray-400">(optional)</span></p>
        <div className="flex gap-2">
          <input value={shadeName} onChange={(e) => setShadeName(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addShade())} placeholder="Shade name" className={inputClass} />
          <input type="color" value={shadeCode} onChange={(e) => setShadeCode(e.target.value)} aria-label="Shade colour" className="h-[46px] w-14 shrink-0 cursor-pointer rounded-xl border border-gray-300 bg-white p-1" />
          <button type="button" onClick={addShade} className={ghostBtn}>Add</button>
        </div>
        {shades.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {shades.map((s, i) => (
              <span key={i} className="flex items-center gap-2 rounded-full border border-gray-200 py-1 pl-1.5 pr-2 text-sm">
                <span className="h-5 w-5 rounded-full border border-gray-300" style={{ backgroundColor: s.code }} />
                {s.name}
                <button type="button" aria-label={`Remove ${s.name}`} onClick={() => setShades((cur) => cur.filter((_, j) => j !== i))} className="text-gray-400 hover:text-red-600"><FiX /></button>
              </span>
            ))}
          </div>
        )}
      </div>

      <ErrorBanner message={error} />

      <div className="sticky bottom-0 -mx-1 flex gap-3 bg-white px-1 py-3">
        <button type="button" onClick={onCancel} className={`${ghostBtn} flex-1`}>Cancel</button>
        <button type="submit" disabled={saving || compressing} className={`${primaryBtn} flex-[2]`}>
          {saving ? 'Saving…' : compressing ? 'Optimizing photos…' : product ? 'Save changes' : 'Add product'}
        </button>
      </div>
    </form>
  );
}
