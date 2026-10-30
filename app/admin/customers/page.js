'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { FiPhone, FiSearch, FiUsers } from 'react-icons/fi';
import { adminAPI } from '@/lib/adminApi';
import { formatRs, timeAgo } from '@/lib/format';
import { customerMessage, whatsappLink } from '@/lib/whatsapp';
import { Card, EmptyState, ErrorBanner, PageHeader, Skeleton, WhatsAppButton, inputClass } from '@/components/admin/ui';

const SORTS = [
  { value: 'recent', label: 'Latest order' },
  { value: 'spent', label: 'Top spenders' },
  { value: 'orders', label: 'Most orders' },
];

export default function CustomersPage() {
  const [customers, setCustomers] = useState([]);
  const [summary, setSummary] = useState({ total: 0, repeat: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [query, setQuery] = useState('');
  const [sort, setSort] = useState('recent');

  useEffect(() => {
    const t = setTimeout(() => setQuery(search), 350);
    return () => clearTimeout(t);
  }, [search]);

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await adminAPI.customers({ search: query, sort });
      setCustomers(res.data);
      setSummary(res.summary);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [query, sort]);

  useEffect(() => { load(); }, [load]);

  return (
    <>
      <PageHeader title="Customers" subtitle={`${summary.total} customers · ${summary.repeat} came back for more`} />

      <div className="mb-4 flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by name or phone…" className={`${inputClass} pl-10`} />
        </div>
        <select value={sort} onChange={(e) => setSort(e.target.value)} className={`${inputClass} sm:w-48`} aria-label="Sort customers">
          {SORTS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
        </select>
      </div>

      <ErrorBanner message={error} onRetry={load} />

      <Card>
        {loading ? (
          <div className="space-y-3 p-4">{[0, 1, 2, 3].map((i) => <Skeleton key={i} className="h-16" />)}</div>
        ) : customers.length === 0 ? (
          <EmptyState icon={FiUsers} title="No customers found" text={query ? 'Try a different name or number.' : 'Customers appear here after their first order.'} />
        ) : (
          <ul className="divide-y divide-gray-100">
            {customers.map((c) => (
              <li key={c.phone} className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center">
                <div className="flex min-w-0 flex-1 items-center gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-pink-500 to-purple-600 font-bold text-white">
                    {(c.name || '?').charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <p className="flex items-center gap-2 truncate font-semibold text-gray-900">
                      {c.name || 'Unknown'}
                      {c.orders > 1 && <span className="rounded-full bg-purple-100 px-2 py-0.5 text-[11px] font-bold text-purple-700">Repeat</span>}
                    </p>
                    <p className="truncate text-sm text-gray-500">+{c.phone}{c.city ? ` · ${c.city}` : ''}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-4 sm:justify-end">
                  <div className="text-sm sm:text-right">
                    <p className="font-bold text-gray-900">{formatRs(c.spent)}</p>
                    <p className="text-gray-500">{c.orders} order{c.orders === 1 ? '' : 's'} · {timeAgo(c.lastOrderAt)}</p>
                  </div>
                  <div className="flex gap-2">
                    <Link href={`/admin/orders?q=${encodeURIComponent(c.phone.slice(-10))}`} className="rounded-lg border border-gray-300 px-3 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50">Orders</Link>
                    <a href={`tel:+${c.phone}`} aria-label="Call" className="rounded-lg border border-gray-300 p-2.5 text-gray-700 hover:bg-gray-50"><FiPhone /></a>
                    <WhatsAppButton href={whatsappLink(c.phone, customerMessage(c))} className="!px-3.5" />
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </>
  );
}
