'use client';

import { useCallback, useEffect, useState } from 'react';
import Image from 'next/image';
import { FiCheck, FiShoppingCart, FiTrash2 } from 'react-icons/fi';
import { adminAPI } from '@/lib/adminApi';
import { formatRs, timeAgo } from '@/lib/format';
import { cartReminderMessage, whatsappLink } from '@/lib/whatsapp';
import { useToast } from '@/components/admin/Toast';
import { Card, EmptyState, ErrorBanner, PageHeader, Skeleton, WhatsAppButton } from '@/components/admin/ui';

function CartItems({ items }) {
  return (
    <ul className="flex flex-wrap gap-2">
      {items.map((item, i) => (
        <li key={i} className="flex items-center gap-2 rounded-xl bg-gray-50 py-1.5 pl-1.5 pr-3">
          <div className="h-9 w-9 shrink-0 overflow-hidden rounded-lg bg-gray-200">
            {item.image && <Image src={item.image} alt="" width={36} height={36} className="h-full w-full object-cover" />}
          </div>
          <span className="text-sm">
            <span className="font-semibold">{item.quantity} × {item.name}</span>
            {item.selectedShade && <span className="text-gray-500"> · {item.selectedShade.name}</span>}
          </span>
        </li>
      ))}
    </ul>
  );
}

export default function CartsPage() {
  const toast = useToast();
  const [carts, setCarts] = useState([]);
  const [anonymous, setAnonymous] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await adminAPI.carts();
      setCarts(res.data);
      setAnonymous(res.anonymous || []);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const markContacted = async (cart) => {
    try {
      await adminAPI.markCartContacted(cart._id);
      setCarts((cur) => cur.map((c) => (c._id === cart._id ? { ...c, contactedAt: new Date().toISOString() } : c)));
    } catch (e) {
      toast.error(e.message);
    }
  };

  const remove = async (cart) => {
    try {
      await adminAPI.deleteCart(cart._id);
      setCarts((cur) => cur.filter((c) => c._id !== cart._id));
      toast.success('Cart removed');
    } catch (e) {
      toast.error(e.message);
    }
  };

  const value = carts.filter((c) => !c.contactedAt).reduce((sum, c) => sum + c.total, 0);

  return (
    <>
      <PageHeader
        title="Abandoned carts"
        subtitle={carts.length ? `${formatRs(value)} waiting in carts you have not messaged yet` : 'People who left items in their cart without ordering'}
      />

      <ErrorBanner message={error} onRetry={load} />

      {loading ? (
        <div className="space-y-3">{[0, 1, 2].map((i) => <Skeleton key={i} className="h-36" />)}</div>
      ) : carts.length === 0 && anonymous.length === 0 ? (
        <Card>
          <EmptyState
            icon={FiShoppingCart}
            title="No abandoned carts"
            text="When a shopper leaves items in their cart and does not order, it shows up here after 30 minutes."
          />
        </Card>
      ) : (
        <div className="space-y-3">
          {carts.map((cart) => (
            <Card key={cart._id} className="p-4">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <p className="font-bold text-gray-900">{cart.name || 'Shopper'}</p>
                  <p className="text-sm text-gray-500">+{cart.phone} · left {timeAgo(cart.updatedAt)}</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold">{formatRs(cart.total)}</p>
                  {cart.contactedAt && (
                    <p className="flex items-center justify-end gap-1 text-xs font-semibold text-green-700"><FiCheck /> Messaged {timeAgo(cart.contactedAt)}</p>
                  )}
                </div>
              </div>

              <div className="my-3"><CartItems items={cart.items} /></div>

              <div className="flex gap-2">
                <WhatsAppButton
                  href={whatsappLink(cart.phone, cartReminderMessage(cart, window.location.origin))}
                  onClick={() => markContacted(cart)}
                  className="flex-1 sm:flex-none"
                >
                  {cart.contactedAt ? 'Message again' : 'Send WhatsApp reminder'}
                </WhatsAppButton>
                <button onClick={() => remove(cart)} aria-label="Remove cart" className="rounded-lg border border-gray-300 px-3 text-gray-500 hover:bg-red-50 hover:text-red-600"><FiTrash2 /></button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {!loading && anonymous.length > 0 && (
        <section className="mt-8">
          <h2 className="font-bold text-gray-900">Left without a number · {anonymous.length}</h2>
          <p className="mb-3 text-sm text-gray-500">
            These shoppers filled a cart but never typed a phone number, so there is no one to message. Handy to see what people want.
          </p>
          <Card className="divide-y divide-gray-100">
            {anonymous.map((cart) => (
              <div key={cart._id} className="flex flex-wrap items-center justify-between gap-3 p-4">
                <CartItems items={cart.items} />
                <div className="text-right">
                  <p className="font-bold">{formatRs(cart.total)}</p>
                  <p className="text-xs text-gray-500">left {timeAgo(cart.updatedAt)}</p>
                </div>
              </div>
            ))}
          </Card>
        </section>
      )}
    </>
  );
}
