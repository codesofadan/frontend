'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FiAlertTriangle, FiArrowRight, FiClock, FiPlus, FiRefreshCw, FiShoppingCart } from 'react-icons/fi';
import { adminAPI } from '@/lib/adminApi';
import { formatRs, timeAgo } from '@/lib/format';
import { Card, ErrorBanner, PageHeader, Skeleton, StatusBadge, ghostBtn, primaryBtn } from '@/components/admin/ui';

const dayLabel = (iso) => new Date(`${iso}T00:00:00`).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' });

function RevenueChart({ days }) {
  const [range, setRange] = useState(14);
  const [hover, setHover] = useState(null);
  const data = days.slice(-range);
  const max = Math.max(...data.map((d) => d.revenue), 1);
  const total = data.reduce((a, d) => ({ revenue: a.revenue + d.revenue, orders: a.orders + d.orders }), { revenue: 0, orders: 0 });
  const day = hover != null ? data[hover] : null;

  return (
    <Card className="p-5">
      <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-gray-500">Sales</p>
          <p className="text-2xl font-bold">{formatRs(day ? day.revenue : total.revenue)}</p>
          <p className="text-sm text-gray-500">
            {day ? `${dayLabel(day.date)} · ${day.orders} order${day.orders === 1 ? '' : 's'}` : `Last ${range} days · ${total.orders} orders`}
          </p>
        </div>
        <div className="flex rounded-xl bg-gray-100 p-1 text-sm font-semibold">
          {[7, 14, 30].map((r) => (
            <button
              key={r}
              onClick={() => { setRange(r); setHover(null); }}
              className={`rounded-lg px-3 py-1 ${range === r ? 'bg-white text-pink-700 shadow-sm' : 'text-gray-500'}`}
            >
              {r}d
            </button>
          ))}
        </div>
      </div>

      <div className="flex h-44 items-end gap-1 border-b border-gray-200" onMouseLeave={() => setHover(null)}>
        {data.map((d, i) => (
          <button
            key={d.date}
            type="button"
            aria-label={`${dayLabel(d.date)}: ${formatRs(d.revenue)}, ${d.orders} orders`}
            onMouseEnter={() => setHover(i)}
            onFocus={() => setHover(i)}
            onBlur={() => setHover(null)}
            className="group flex h-full flex-1 items-end"
          >
            <span
              className={`block w-full rounded-t-md transition-colors ${d.revenue ? (i === data.length - 1 ? 'bg-pink-600' : 'bg-pink-300') + ' group-hover:bg-pink-600' : 'bg-gray-200'}`}
              style={{ height: d.revenue ? `${Math.max(4, (d.revenue / max) * 100)}%` : '2px' }}
            />
          </button>
        ))}
      </div>
      <div className="mt-2 flex justify-between text-xs text-gray-400">
        <span>{dayLabel(data[0].date)}</span>
        <span>Today</span>
      </div>
    </Card>
  );
}

function Tile({ label, revenue, orders, note }) {
  return (
    <Card className="p-5">
      <p className="text-sm font-semibold text-gray-500">{label}</p>
      <p className="mt-1 text-2xl font-bold tracking-tight">{formatRs(revenue)}</p>
      <p className="mt-0.5 text-sm text-gray-500">{note || `${orders} order${orders === 1 ? '' : 's'}`}</p>
    </Card>
  );
}

function Attention({ href, icon: Icon, tone, title, detail, show = true }) {
  if (!show) return null;
  return (
    <Link href={href} className={`group flex items-center gap-4 rounded-2xl border p-4 transition hover:shadow-md ${tone}`}>
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/70 text-xl"><Icon /></div>
      <div className="min-w-0 flex-1">
        <p className="font-bold">{title}</p>
        <p className="truncate text-sm opacity-80">{detail}</p>
      </div>
      <FiArrowRight className="shrink-0 transition group-hover:translate-x-1" />
    </Link>
  );
}

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      setStats((await adminAPI.stats()).data);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const refresh = (
    <button onClick={load} disabled={loading} className={ghostBtn}>
      <FiRefreshCw className={loading ? 'animate-spin' : ''} /> Refresh
    </button>
  );

  if (!stats) {
    return (
      <>
        <PageHeader title="Dashboard" subtitle="How the store is doing">{refresh}</PageHeader>
        <ErrorBanner message={error} onRetry={load} />
        {!error && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">{[0, 1, 2, 3].map((i) => <Skeleton key={i} className="h-28" />)}</div>
            <Skeleton className="h-72" />
          </div>
        )}
      </>
    );
  }

  const { today, week, month, lifetime } = stats;
  const { abandonedCarts: carts, anonymousCarts: anon } = stats;
  const needsAttention = stats.pendingOrders > 0 || carts.count > 0 || anon.count > 0 || stats.lowStock.length > 0;

  return (
    <>
      <PageHeader title="Dashboard" subtitle={new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' })}>
        {refresh}
        <Link href="/admin/products?new=1" className={primaryBtn}><FiPlus /> Add product</Link>
      </PageHeader>
      <ErrorBanner message={error} onRetry={load} />

      {needsAttention && (
        <div className="mb-6 grid grid-cols-1 gap-3 md:grid-cols-3">
          <Attention
            show={stats.pendingOrders > 0}
            href="/admin/orders?status=pending"
            icon={FiClock}
            tone="border-amber-200 bg-amber-50 text-amber-900"
            title={`${stats.pendingOrders} pending order${stats.pendingOrders === 1 ? '' : 's'}`}
            detail="Waiting for you to confirm"
          />
          <Attention
            show={carts.count > 0 || anon.count > 0}
            href="/admin/carts"
            icon={FiShoppingCart}
            tone="border-green-200 bg-green-50 text-green-900"
            title={`${carts.count + anon.count} abandoned cart${carts.count + anon.count === 1 ? '' : 's'}`}
            detail={[
              carts.count > 0 && `${formatRs(carts.value)} to message on WhatsApp`,
              anon.count > 0 && `${anon.count} without a number`
            ].filter(Boolean).join(' · ')}
          />
          <Attention
            show={stats.lowStock.length > 0}
            href="/admin/products?stock=low"
            icon={FiAlertTriangle}
            tone="border-red-200 bg-red-50 text-red-900"
            title={`${stats.lowStock.length} low on stock`}
            detail={`${stats.lowStock[0]?.name}${stats.lowStock.length > 1 ? ' and more' : ''}`}
          />
        </div>
      )}

      <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Tile label="Today" revenue={today.revenue} orders={today.orders} />
        <Tile label="Last 7 days" revenue={week.revenue} orders={week.orders} />
        <Tile label="Last 30 days" revenue={month.revenue} orders={month.orders} />
        <Tile label="All time" revenue={lifetime.revenue} note={`${lifetime.orders} orders · ${stats.customerCount} customers`} />
      </div>

      <div className="mb-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2"><RevenueChart days={stats.days} /></div>
        <Card className="p-5">
          <p className="mb-3 text-sm font-semibold text-gray-500">Best sellers · 30 days</p>
          {stats.topProducts.length === 0 ? (
            <p className="py-8 text-center text-sm text-gray-400">No sales yet</p>
          ) : (
            <ol className="space-y-3">
              {stats.topProducts.map((p, i) => (
                <li key={p._id} className="flex items-center gap-3">
                  <span className="w-4 text-sm font-bold text-gray-400">{i + 1}</span>
                  <div className="h-10 w-10 shrink-0 overflow-hidden rounded-lg bg-gray-100">
                    {p.image && <Image src={p.image} alt="" width={40} height={40} className="h-full w-full object-cover" />}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold">{p.name}</p>
                    <p className="text-xs text-gray-500">{p.quantity} sold · {formatRs(p.revenue)}</p>
                  </div>
                </li>
              ))}
            </ol>
          )}
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
            <p className="font-bold">Recent orders</p>
            <Link href="/admin/orders" className="text-sm font-semibold text-pink-600 hover:underline">View all</Link>
          </div>
          {stats.recentOrders.length === 0 ? (
            <p className="py-10 text-center text-sm text-gray-400">No orders yet</p>
          ) : (
            <ul className="divide-y divide-gray-100">
              {stats.recentOrders.map((o) => (
                <li key={o._id}>
                  <Link href={`/admin/orders?q=${encodeURIComponent(o.orderNumber)}`} className="flex items-center gap-3 px-5 py-3 hover:bg-gray-50">
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold">{o.customerInfo?.firstName} {o.customerInfo?.lastName}</p>
                      <p className="text-xs text-gray-500">{o.orderNumber} · {timeAgo(o.createdAt)}</p>
                    </div>
                    <StatusBadge status={o.status} />
                    <p className="w-24 text-right text-sm font-bold">{formatRs(o.total)}</p>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </Card>

        <Card>
          <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
            <p className="font-bold">Low stock</p>
            <p className="text-xs text-gray-400">{stats.lowStockLimit} or fewer</p>
          </div>
          {stats.lowStock.length === 0 ? (
            <p className="py-10 text-center text-sm text-gray-400">Everything is well stocked 🎉</p>
          ) : (
            <ul className="divide-y divide-gray-100">
              {stats.lowStock.map((p) => (
                <li key={p._id} className="flex items-center gap-3 px-5 py-3">
                  <div className="h-9 w-9 shrink-0 overflow-hidden rounded-lg bg-gray-100">
                    {p.images?.[0] && <Image src={p.images[0].url} alt="" width={36} height={36} className="h-full w-full object-cover" />}
                  </div>
                  <p className="min-w-0 flex-1 truncate text-sm font-semibold">{p.name}</p>
                  <span className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${p.stock === 0 ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-800'}`}>
                    {p.stock === 0 ? 'Sold out' : `${p.stock} left`}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>
    </>
  );
}
