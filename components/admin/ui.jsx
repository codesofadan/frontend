import { FaWhatsapp } from 'react-icons/fa';

export const STATUSES = ['pending', 'confirmed', 'ready', 'dispatched', 'delivered', 'cancelled'];

const STATUS_STYLES = {
  pending: 'bg-amber-100 text-amber-800',
  confirmed: 'bg-blue-100 text-blue-800',
  ready: 'bg-purple-100 text-purple-800',
  dispatched: 'bg-indigo-100 text-indigo-800',
  delivered: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
};

export const cap = (s = '') => s.charAt(0).toUpperCase() + s.slice(1);

export function StatusBadge({ status }) {
  return (
    <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold ${STATUS_STYLES[status] || 'bg-gray-100 text-gray-700'}`}>
      {cap(status)}
    </span>
  );
}

export function PaymentBadge({ status }) {
  const style = status === 'paid' ? 'bg-green-100 text-green-800' : status === 'failed' ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-600';
  return <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold ${style}`}>{status === 'paid' ? 'Paid' : status === 'pending' ? 'Unpaid' : cap(status)}</span>;
}

export function PageHeader({ title, subtitle, children }) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">{title}</h1>
        {subtitle && <p className="mt-0.5 text-sm text-gray-500">{subtitle}</p>}
      </div>
      {children && <div className="flex items-center gap-2">{children}</div>}
    </div>
  );
}

export function Card({ className = '', children }) {
  return <div className={`rounded-2xl border border-gray-200 bg-white ${className}`}>{children}</div>;
}

export function WhatsAppButton({ href, onClick, children = 'WhatsApp', className = '' }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onClick={onClick}
      className={`inline-flex items-center justify-center gap-1.5 rounded-lg bg-green-500 px-3 py-2 text-sm font-semibold text-white transition hover:bg-green-600 ${className}`}
    >
      <FaWhatsapp className="text-base" />
      {children}
    </a>
  );
}

export function EmptyState({ icon: Icon, title, text }) {
  return (
    <div className="flex flex-col items-center px-6 py-14 text-center">
      <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-pink-50 text-pink-600">
        <Icon className="text-xl" />
      </div>
      <p className="font-semibold text-gray-900">{title}</p>
      {text && <p className="mt-1 max-w-sm text-sm text-gray-500">{text}</p>}
    </div>
  );
}

export function ErrorBanner({ message, onRetry }) {
  if (!message) return null;
  return (
    <div className="mb-4 flex items-center justify-between gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
      <span>{message}</span>
      {onRetry && <button onClick={onRetry} className="font-semibold underline">Retry</button>}
    </div>
  );
}

export const Skeleton = ({ className = '' }) => <div className={`animate-pulse rounded-xl bg-gray-200/70 ${className}`} />;

export const inputClass = 'w-full rounded-xl border border-gray-300 bg-white px-3.5 py-2.5 text-base text-gray-900 placeholder-gray-400 outline-none transition focus:border-pink-500 focus:ring-2 focus:ring-pink-200';

export const primaryBtn = 'inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-pink-600 to-purple-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:from-pink-700 hover:to-purple-700 disabled:cursor-not-allowed disabled:opacity-50';

export const ghostBtn = 'inline-flex items-center justify-center gap-2 rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 disabled:opacity-50';
