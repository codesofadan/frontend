'use client';

import { useCallback, useEffect, useState } from 'react';
import Image from 'next/image';
import { FiMapPin, FiPhone, FiSearch, FiShoppingBag, FiX } from 'react-icons/fi';
import { adminAPI } from '@/lib/adminApi';
import { formatDate, formatRs, timeAgo } from '@/lib/format';
import { orderUpdateMessage, whatsappLink } from '@/lib/whatsapp';
import { useToast } from '@/components/admin/Toast';
import {
  Card, EmptyState, ErrorBanner, PageHeader, PaymentBadge, STATUSES, Skeleton, StatusBadge, WhatsAppButton, cap, ghostBtn, inputClass,
} from '@/components/admin/ui';

const PAGE_SIZE = 15;
const NEXT_STATUS = { pending: 'confirmed', confirmed: 'ready', ready: 'dispatched', dispatched: 'delivered' };

export default function OrdersPage() {
  const toast = useToast();
  const [orders, setOrders] = useState([]);
  const [counts, setCounts] = useState({});
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [status, setStatus] = useState('all');
  const [search, setSearch] = useState('');
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState(null);

  // Dashboard shortcuts: ?status=pending and ?q=HUD-123
  useEffect(() => {
    const p = new URLSearchParams(window.location.search);
    if (p.get('status') && STATUSES.includes(p.get('status'))) setStatus(p.get('status'));
    if (p.get('q')) { setSearch(p.get('q')); setQuery(p.get('q')); }
  }, []);

  useEffect(() => {
    const t = setTimeout(() => setQuery(search), 350);
    return () => clearTimeout(t);
  }, [search]);

  const load = useCallback(async (nextPage = 1) => {
    nextPage === 1 ? setLoading(true) : setLoadingMore(true);
    setError('');
    try {
      const res = await adminAPI.orders({ page: nextPage, limit: PAGE_SIZE, status, search: query });
      setOrders((cur) => (nextPage === 1 ? res.data : [...cur, ...res.data]));
      setCounts(res.counts);
      setPage(nextPage);
      setPages(res.pagination.pages);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [status, query]);

  useEffect(() => { load(1); }, [load]);

  async function update(order, changes) {
    try {
      const { data } = await adminAPI.updateOrder(order._id, changes);
      const merged = { ...order, ...changes, status: data.status, paymentStatus: data.paymentStatus };
      setOrders((cur) => {
        const next = cur.map((o) => (o._id === order._id ? merged : o));
        return status !== 'all' && data.status !== status ? next.filter((o) => o._id !== order._id) : next;
      });
      setSelected((s) => (s && s._id === order._id ? merged : s));
      if (data.status !== order.status) {
        setCounts((c) => ({ ...c, [order.status]: Math.max(0, (c[order.status] || 0) - 1), [data.status]: (c[data.status] || 0) + 1 }));
      }
      toast.success(changes.status ? `Order ${data.status}` : changes.paymentStatus === 'paid' ? 'Marked as paid' : 'Marked as unpaid');
    } catch (e) {
      toast.error(e.message);
    }
  }

  const totalCount = Object.values(counts).reduce((a, b) => a + b, 0);

  return (
    <>
      <PageHeader title="Orders" subtitle={`${totalCount} order${totalCount === 1 ? '' : 's'} in total`} />

      <div className="relative mb-4">
        <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by order number, name or phone…" className={`${inputClass} pl-10`} />
      </div>

      <div className="-mx-4 mb-4 flex gap-2 overflow-x-auto px-4 pb-1 md:mx-0 md:px-0">
        {['all', ...STATUSES].map((s) => (
          <button
            key={s}
            onClick={() => setStatus(s)}
            className={`flex shrink-0 items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold ${status === s ? 'border-pink-600 bg-pink-600 text-white' : 'border-gray-300 bg-white text-gray-700'}`}
          >
            {s === 'all' ? 'All' : cap(s)}
            <span className={`rounded-full px-1.5 text-xs ${status === s ? 'bg-white/25' : 'bg-gray-100 text-gray-600'}`}>{s === 'all' ? totalCount : counts[s] || 0}</span>
          </button>
        ))}
      </div>

      <ErrorBanner message={error} onRetry={() => load(1)} />

      <Card>
        {loading ? (
          <div className="space-y-3 p-4">{[0, 1, 2, 3].map((i) => <Skeleton key={i} className="h-16" />)}</div>
        ) : orders.length === 0 ? (
          <EmptyState icon={FiShoppingBag} title="No orders found" text={query || status !== 'all' ? 'Try a different search or status.' : 'New orders will show up here.'} />
        ) : (
          <ul className="divide-y divide-gray-100">
            {orders.map((o) => (
              <li key={o._id} className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center">
                <button onClick={() => setSelected(o)} className="flex min-w-0 flex-1 items-center gap-4 text-left">
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-semibold text-gray-900">{o.customerInfo?.firstName} {o.customerInfo?.lastName}</p>
                    <p className="truncate text-sm text-gray-500">{o.orderNumber} · {timeAgo(o.createdAt)} · {o.items?.length} item{o.items?.length === 1 ? '' : 's'}</p>
                    <div className="mt-1.5 flex gap-1.5"><StatusBadge status={o.status} /><PaymentBadge status={o.paymentStatus} /></div>
                  </div>
                  <p className="shrink-0 text-right font-bold text-gray-900">{formatRs(o.total)}</p>
                </button>
                <div className="flex gap-2">
                  {NEXT_STATUS[o.status] && (
                    <button onClick={() => update(o, { status: NEXT_STATUS[o.status] })} className={`${ghostBtn} !px-3 !py-2 flex-1 sm:flex-none`}>
                      Mark {NEXT_STATUS[o.status]}
                    </button>
                  )}
                  <WhatsAppButton href={whatsappLink(o.customerInfo?.phone, orderUpdateMessage(o))} className="!px-3.5" />
                </div>
              </li>
            ))}
          </ul>
        )}
      </Card>

      {page < pages && (
        <div className="mt-4 text-center">
          <button onClick={() => load(page + 1)} disabled={loadingMore} className={ghostBtn}>{loadingMore ? 'Loading…' : 'Load more'}</button>
        </div>
      )}

      {selected && <OrderDetail order={selected} onClose={() => setSelected(null)} onUpdate={update} />}
    </>
  );
}

function OrderDetail({ order, onClose, onUpdate }) {
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const esc = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', esc);
    return () => { document.body.style.overflow = prev; window.removeEventListener('keydown', esc); };
  }, [onClose]);

  const c = order.customerInfo || {};
  const a = order.shippingAddress || {};
  const paid = order.paymentStatus === 'paid';

  return (
    <div className="fixed inset-0 z-40">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="absolute inset-x-0 bottom-0 top-6 flex flex-col rounded-t-3xl bg-white shadow-2xl md:inset-y-0 md:left-auto md:right-0 md:w-[560px] md:rounded-none">
        <div className="flex items-start justify-between border-b border-gray-100 px-5 py-4">
          <div>
            <p className="font-mono text-sm font-bold">{order.orderNumber}</p>
            <p className="text-xs text-gray-500">{formatDate(order.createdAt)} · {timeAgo(order.createdAt)}</p>
          </div>
          <button onClick={onClose} aria-label="Close" className="rounded-lg p-2 text-gray-500 hover:bg-gray-100"><FiX className="text-xl" /></button>
        </div>

        <div className="flex-1 space-y-5 overflow-y-auto px-5 py-5">
          {/* Customer */}
          <section className="rounded-2xl bg-gray-50 p-4">
            <p className="font-bold">{c.firstName} {c.lastName}</p>
            <p className="mt-0.5 flex items-center gap-1.5 text-sm text-gray-600"><FiPhone /> {c.phone}</p>
            <p className="mt-0.5 flex items-start gap-1.5 text-sm text-gray-600"><FiMapPin className="mt-0.5 shrink-0" /> {a.street}, {a.city}, {a.state} {a.zipCode}, {a.country}</p>
            <div className="mt-3 flex gap-2">
              <WhatsAppButton href={whatsappLink(c.phone, orderUpdateMessage(order))} className="flex-1">Send {order.status} update</WhatsAppButton>
              <a href={`tel:${c.phone}`} className={ghostBtn}>Call</a>
            </div>
          </section>

          {/* Items */}
          <section>
            <p className="mb-2 text-sm font-bold">Items</p>
            <ul className="divide-y divide-gray-100 rounded-2xl border border-gray-200">
              {order.items?.map((item, i) => (
                <li key={i} className="flex items-center gap-3 p-3">
                  <div className="h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-gray-100">
                    {item.image && <Image src={item.image} alt="" width={48} height={48} className="h-full w-full object-cover" />}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold">{item.name}</p>
                    <p className="flex items-center gap-1.5 text-xs text-gray-500">
                      {item.quantity} × {formatRs(item.price)}
                      {item.selectedShade && (
                        <>
                          <span className="ml-1 inline-block h-3.5 w-3.5 rounded-full border border-gray-300" style={{ backgroundColor: item.selectedShade.code }} />
                          {item.selectedShade.name}
                        </>
                      )}
                    </p>
                  </div>
                  <p className="text-sm font-bold">{formatRs(item.price * item.quantity)}</p>
                </li>
              ))}
            </ul>
          </section>

          {/* Totals */}
          <section className="space-y-1.5 text-sm">
            <div className="flex justify-between text-gray-600"><span>Subtotal</span><span>{formatRs(order.subtotal)}</span></div>
            <div className="flex justify-between text-gray-600"><span>Shipping</span><span>{formatRs(order.shipping)}</span></div>
            <div className="flex justify-between text-gray-600"><span>Tax</span><span>{formatRs(order.tax)}</span></div>
            <div className="flex justify-between border-t border-gray-200 pt-2 text-base font-bold"><span>Total</span><span>{formatRs(order.total)}</span></div>
          </section>

          {/* Payment */}
          <section className="flex items-center justify-between rounded-2xl border border-gray-200 p-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">Payment · {order.paymentMethod}</p>
              <div className="mt-1"><PaymentBadge status={order.paymentStatus} /></div>
            </div>
            <button onClick={() => onUpdate(order, { paymentStatus: paid ? 'pending' : 'paid' })} className={ghostBtn}>
              {paid ? 'Mark unpaid' : 'Mark as paid'}
            </button>
          </section>

          {order.notes && (
            <section className="rounded-2xl border border-amber-200 bg-amber-50 p-4">
              <p className="text-xs font-bold uppercase tracking-wide text-amber-800">Customer note</p>
              <p className="mt-1 text-sm text-amber-900">{order.notes}</p>
            </section>
          )}

          {/* Status */}
          <section>
            <p className="mb-2 text-sm font-bold">Order status</p>
            <div className="grid grid-cols-3 gap-2">
              {STATUSES.map((s) => (
                <button
                  key={s}
                  onClick={() => s !== order.status && onUpdate(order, { status: s })}
                  className={`rounded-xl border px-2 py-2.5 text-sm font-semibold ${order.status === s ? 'border-pink-600 bg-pink-600 text-white' : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'} ${s === 'cancelled' && order.status !== s ? '!text-red-600' : ''}`}
                >
                  {cap(s)}
                </button>
              ))}
            </div>
            <p className="mt-2 text-xs text-gray-500">Cancelling puts the items back in stock.</p>
          </section>
        </div>
      </div>
    </div>
  );
}
