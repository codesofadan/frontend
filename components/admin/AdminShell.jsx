'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FiExternalLink, FiHome, FiLogOut, FiPackage, FiShoppingBag, FiShoppingCart, FiUsers } from 'react-icons/fi';
import { adminAPI, clearToken, getToken } from '@/lib/adminApi';
import AdminLogin from './AdminLogin';
import { ToastProvider } from './Toast';

const NAV = [
  { href: '/admin', label: 'Dashboard', icon: FiHome, exact: true },
  { href: '/admin/orders', label: 'Orders', icon: FiShoppingBag },
  { href: '/admin/products', label: 'Products', icon: FiPackage },
  { href: '/admin/customers', label: 'Customers', icon: FiUsers },
  { href: '/admin/carts', label: 'Carts', icon: FiShoppingCart },
];

// Every page under /admin renders inside this gate, so a new admin page is locked by default.
// The real protection is server-side: the API rejects requests without a valid token.
export default function AdminShell({ children }) {
  const [auth, setAuth] = useState('checking');
  const pathname = usePathname();

  useEffect(() => {
    let alive = true;
    if (!getToken()) {
      setAuth('out');
    } else {
      adminAPI.me().then(() => alive && setAuth('in')).catch(() => alive && setAuth('out'));
    }
    const lock = () => setAuth('out');
    window.addEventListener('admin-unauthorized', lock);
    return () => {
      alive = false;
      window.removeEventListener('admin-unauthorized', lock);
    };
  }, []);

  const logout = () => {
    clearToken();
    setAuth('out');
  };

  if (auth === 'checking') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="h-9 w-9 animate-spin rounded-full border-4 border-pink-600 border-t-transparent" />
      </div>
    );
  }
  if (auth === 'out') return <AdminLogin onLogin={() => setAuth('in')} />;

  const isActive = (n) => (n.exact ? pathname === n.href : pathname.startsWith(n.href));

  return (
    <ToastProvider>
      <div className="min-h-screen bg-gray-50 text-gray-900" style={{ colorScheme: 'light' }}>
        {/* Desktop sidebar */}
        <aside className="fixed inset-y-0 left-0 z-30 hidden w-60 flex-col border-r border-gray-200 bg-white md:flex">
          <div className="px-6 py-6">
            <p className="bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-2xl font-extrabold text-transparent">Hudamoji</p>
            <p className="text-xs font-medium uppercase tracking-wider text-gray-400">Admin panel</p>
          </div>
          <nav className="flex-1 space-y-1 px-3">
            {NAV.map((n) => (
              <Link
                key={n.href}
                href={n.href}
                className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition ${isActive(n) ? 'bg-pink-50 text-pink-700' : 'text-gray-600 hover:bg-gray-50'}`}
              >
                <n.icon className="text-lg" />
                {n.label}
              </Link>
            ))}
          </nav>
          <div className="space-y-1 border-t border-gray-100 p-3">
            <a href="/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-gray-600 hover:bg-gray-50">
              <FiExternalLink className="text-lg" /> View store
            </a>
            <button onClick={logout} className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-gray-600 hover:bg-gray-50">
              <FiLogOut className="text-lg" /> Log out
            </button>
          </div>
        </aside>

        {/* Mobile top bar */}
        <header className="sticky top-0 z-30 flex items-center justify-between border-b border-gray-200 bg-white px-4 py-3 md:hidden">
          <p className="bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-lg font-extrabold text-transparent">Hudamoji Admin</p>
          <div className="flex items-center gap-1">
            <a href="/" target="_blank" rel="noopener noreferrer" aria-label="View store" className="rounded-lg p-2 text-gray-500 hover:bg-gray-100"><FiExternalLink /></a>
            <button onClick={logout} aria-label="Log out" className="rounded-lg p-2 text-gray-500 hover:bg-gray-100"><FiLogOut /></button>
          </div>
        </header>

        <main className="pb-24 md:pb-10 md:pl-60">
          <div className="mx-auto max-w-6xl px-4 py-6 md:px-8 md:py-8">{children}</div>
        </main>

        {/* Mobile bottom tabs */}
        <nav className="fixed inset-x-0 bottom-0 z-30 grid grid-cols-5 border-t border-gray-200 bg-white pb-[env(safe-area-inset-bottom)] md:hidden">
          {NAV.map((n) => (
            <Link key={n.href} href={n.href} className={`flex flex-col items-center gap-0.5 py-2.5 text-[11px] font-semibold ${isActive(n) ? 'text-pink-700' : 'text-gray-500'}`}>
              <n.icon className="text-xl" />
              {n.label}
            </Link>
          ))}
        </nav>
      </div>
    </ToastProvider>
  );
}
