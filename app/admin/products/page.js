'use client';

import { useCallback, useEffect, useState } from 'react';
import Image from 'next/image';
import { FiEdit2, FiEye, FiEyeOff, FiMinus, FiPackage, FiPlus, FiSearch, FiTrash2, FiX } from 'react-icons/fi';
import { adminAPI } from '@/lib/adminApi';
import { formatRs } from '@/lib/format';
import ProductForm from '@/components/admin/ProductForm';
import { useToast } from '@/components/admin/Toast';
import { Card, EmptyState, ErrorBanner, PageHeader, Skeleton, cap, ghostBtn, inputClass, primaryBtn } from '@/components/admin/ui';

const PAGE_SIZE = 12;
const LOW_STOCK = 5;

function StockControl({ product, onChange }) {
  const [value, setValue] = useState(String(product.stock));
  useEffect(() => setValue(String(product.stock)), [product.stock]);

  const commit = (next) => {
    const n = Math.max(0, parseInt(next, 10) || 0);
    setValue(String(n));
    if (n !== product.stock) onChange(n);
  };

  return (
    <div className="flex items-center overflow-hidden rounded-lg border border-gray-300">
      <button type="button" aria-label="Decrease stock" onClick={() => commit(product.stock - 1)} className="px-2.5 py-2 text-gray-600 hover:bg-gray-100"><FiMinus /></button>
      <input
        value={value}
        inputMode="numeric"
        aria-label="Stock"
        onChange={(e) => setValue(e.target.value.replace(/\D/g, ''))}
        onBlur={() => commit(value)}
        onKeyDown={(e) => e.key === 'Enter' && e.currentTarget.blur()}
        className="w-12 border-x border-gray-300 py-1.5 text-center text-sm font-semibold text-gray-900 outline-none"
      />
      <button type="button" aria-label="Increase stock" onClick={() => commit(product.stock + 1)} className="px-2.5 py-2 text-gray-600 hover:bg-gray-100"><FiPlus /></button>
    </div>
  );
}

export default function ProductsPage() {
  const toast = useToast();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState('');
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('all');
  const [lowOnly, setLowOnly] = useState(false);
  const [form, setForm] = useState(null); // null = closed, {} = new, product = editing

  // Dashboard shortcuts: /admin/products?new=1 and ?stock=low
  useEffect(() => {
    const p = new URLSearchParams(window.location.search);
    if (p.get('new')) setForm({});
    if (p.get('stock') === 'low') setLowOnly(true);
  }, []);

  useEffect(() => {
    const t = setTimeout(() => setQuery(search), 350);
    return () => clearTimeout(t);
  }, [search]);

  const load = useCallback(async (nextPage = 1) => {
    nextPage === 1 ? setLoading(true) : setLoadingMore(true);
    setError('');
    try {
      const res = await adminAPI.products({ page: nextPage, limit: PAGE_SIZE, search: query, status, stock: lowOnly ? 'low' : '' });
      setProducts((cur) => (nextPage === 1 ? res.data : [...cur, ...res.data]));
      setPage(nextPage);
      setPages(res.pagination.pages);
      setTotal(res.pagination.total);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [query, status, lowOnly]);

  useEffect(() => { load(1); }, [load]);

  // Stock and visibility save instantly; the row updates first and rolls back if the save fails.
  async function quickUpdate(product, changes, message) {
    const patch = (p) => setProducts((cur) => cur.map((x) => (x._id === product._id ? { ...x, ...p } : x)));
    patch(changes);
    try {
      await adminAPI.patchProduct(product._id, changes);
      if (message) toast.success(message);
    } catch (e) {
      patch(product);
      toast.error(e.message);
    }
  }

  async function remove(product) {
    if (!window.confirm(`Delete "${product.name}"? This also removes its photos.`)) return;
    try {
      await adminAPI.deleteProduct(product._id);
      setProducts((cur) => cur.filter((x) => x._id !== product._id));
      setTotal((t) => t - 1);
      toast.success('Product deleted');
    } catch (e) {
      toast.error(e.message);
    }
  }

  const closeForm = () => setForm(null);
  const saved = () => { closeForm(); load(1); };

  return (
    <>
      <PageHeader title="Products" subtitle={`${total} product${total === 1 ? '' : 's'}`}>
        <button onClick={() => setForm({})} className={primaryBtn}><FiPlus /> Add product</button>
      </PageHeader>

      <div className="mb-4 flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search products…" className={`${inputClass} pl-10`} />
        </div>
        <div className="flex gap-2 overflow-x-auto">
          {['all', 'active', 'inactive'].map((s) => (
            <button
              key={s}
              onClick={() => setStatus(s)}
              className={`shrink-0 rounded-xl border px-4 py-2.5 text-sm font-semibold ${status === s ? 'border-pink-600 bg-pink-50 text-pink-700' : 'border-gray-300 bg-white text-gray-600'}`}
            >
              {s === 'all' ? 'All' : s === 'active' ? 'Visible' : 'Hidden'}
            </button>
          ))}
          <button
            onClick={() => setLowOnly((v) => !v)}
            className={`shrink-0 rounded-xl border px-4 py-2.5 text-sm font-semibold ${lowOnly ? 'border-red-500 bg-red-50 text-red-700' : 'border-gray-300 bg-white text-gray-600'}`}
          >
            Low stock
          </button>
        </div>
      </div>

      <ErrorBanner message={error} onRetry={() => load(1)} />

      <Card>
        {loading ? (
          <div className="space-y-3 p-4">{[0, 1, 2, 3].map((i) => <Skeleton key={i} className="h-20" />)}</div>
        ) : products.length === 0 ? (
          <EmptyState icon={FiPackage} title="No products found" text={query || lowOnly || status !== 'all' ? 'Try a different search or filter.' : 'Add your first product to start selling.'} />
        ) : (
          <ul className="divide-y divide-gray-100">
            {products.map((p) => {
              const hidden = p.status !== 'active';
              return (
                <li key={p._id} className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center">
                  <div className="flex min-w-0 flex-1 items-center gap-3">
                    <div className={`relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-gray-100 ${hidden ? 'opacity-50' : ''}`}>
                      {p.images?.[0] && <Image src={p.images[0].url} alt={p.name} fill sizes="64px" className="object-cover" />}
                    </div>
                    <div className="min-w-0">
                      <p className="truncate font-semibold text-gray-900">{p.name}</p>
                      <p className="text-sm text-gray-500">
                        {cap(p.category)} · <span className="font-semibold text-gray-800">{formatRs(p.price)}</span>
                        {p.originalPrice > p.price && <span className="ml-1 text-gray-400 line-through">{formatRs(p.originalPrice)}</span>}
                      </p>
                      <div className="mt-1 flex gap-1.5">
                        {hidden && <span className="rounded-full bg-gray-200 px-2 py-0.5 text-[11px] font-bold text-gray-600">Hidden</span>}
                        {p.stock === 0 && <span className="rounded-full bg-red-100 px-2 py-0.5 text-[11px] font-bold text-red-700">Sold out</span>}
                        {p.stock > 0 && p.stock <= LOW_STOCK && <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[11px] font-bold text-amber-800">Low stock</span>}
                        {p.featured && <span className="rounded-full bg-purple-100 px-2 py-0.5 text-[11px] font-bold text-purple-700">Featured</span>}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-2 sm:justify-end">
                    <StockControl product={p} onChange={(stock) => quickUpdate(p, { stock })} />
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => quickUpdate(p, { status: hidden ? 'active' : 'inactive' }, hidden ? 'Now visible in store' : 'Hidden from store')}
                        aria-label={hidden ? 'Show in store' : 'Hide from store'}
                        title={hidden ? 'Show in store' : 'Hide from store'}
                        className="rounded-lg p-2.5 text-gray-500 hover:bg-gray-100"
                      >
                        {hidden ? <FiEyeOff /> : <FiEye />}
                      </button>
                      <button onClick={() => setForm(p)} aria-label="Edit" title="Edit" className="rounded-lg p-2.5 text-gray-500 hover:bg-gray-100"><FiEdit2 /></button>
                      <button onClick={() => remove(p)} aria-label="Delete" title="Delete" className="rounded-lg p-2.5 text-red-500 hover:bg-red-50"><FiTrash2 /></button>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </Card>

      {page < pages && (
        <div className="mt-4 text-center">
          <button onClick={() => load(page + 1)} disabled={loadingMore} className={ghostBtn}>{loadingMore ? 'Loading…' : 'Load more'}</button>
        </div>
      )}

      {form && <ProductDrawer product={form._id ? form : null} onClose={closeForm} onSaved={saved} />}
    </>
  );
}

function ProductDrawer({ product, onClose, onSaved }) {
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, []);

  return (
    <div className="fixed inset-0 z-40">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="absolute inset-x-0 bottom-0 top-6 flex flex-col rounded-t-3xl bg-white shadow-2xl md:inset-y-0 md:left-auto md:right-0 md:w-[620px] md:rounded-none">
        <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
          <h2 className="text-lg font-bold">{product ? 'Edit product' : 'New product'}</h2>
          <button onClick={onClose} aria-label="Close" className="rounded-lg p-2 text-gray-500 hover:bg-gray-100"><FiX className="text-xl" /></button>
        </div>
        <div className="flex-1 overflow-y-auto px-5 pt-5">
          <ProductForm product={product} onSaved={onSaved} onCancel={onClose} />
        </div>
      </div>
    </div>
  );
}
