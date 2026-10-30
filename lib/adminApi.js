const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
const TOKEN_KEY = 'hudamoji-admin-token';

export const getToken = () => {
  try { return localStorage.getItem(TOKEN_KEY); } catch { return null; }
};
export const setToken = (token) => {
  try { localStorage.setItem(TOKEN_KEY, token); } catch {}
};
export const clearToken = () => {
  try { localStorage.removeItem(TOKEN_KEY); } catch {}
};

const qs = (params = {}) => {
  const clean = Object.fromEntries(Object.entries(params).filter(([, v]) => v !== '' && v != null && v !== 'all'));
  const s = new URLSearchParams(clean).toString();
  return s ? `?${s}` : '';
};

// `form` sends multipart (images), `body` sends JSON. A 401 anywhere logs the admin out.
async function request(path, { method = 'GET', body, form } = {}) {
  const headers = {};
  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;
  if (body !== undefined) headers['Content-Type'] = 'application/json';

  const res = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers,
    body: form ?? (body !== undefined ? JSON.stringify(body) : undefined),
  });
  const data = await res.json().catch(() => ({}));

  if (res.status === 401 && path !== '/admin/login') {
    clearToken();
    window.dispatchEvent(new Event('admin-unauthorized'));
  }
  if (!res.ok) throw new Error(data.error || `Request failed (${res.status})`);
  return data;
}

export const adminAPI = {
  login: (password) => request('/admin/login', { method: 'POST', body: { password } }),
  me: () => request('/admin/me'),
  stats: () => request('/admin/stats'),

  orders: (params) => request(`/orders${qs(params)}`),
  updateOrder: (id, changes) => request(`/orders/${id}/status`, { method: 'PUT', body: changes }),

  products: (params) => request(`/admin/products${qs(params)}`),
  createProduct: (form) => request('/products', { method: 'POST', form }),
  updateProduct: (id, form) => request(`/products/${id}`, { method: 'PUT', form }),
  patchProduct: (id, changes) => request(`/products/${id}`, { method: 'PUT', body: changes }),
  deleteProduct: (id) => request(`/products/${id}`, { method: 'DELETE' }),

  customers: (params) => request(`/admin/customers${qs(params)}`),

  carts: () => request('/admin/carts'),
  markCartContacted: (id) => request(`/admin/carts/${id}/contacted`, { method: 'PATCH' }),
  deleteCart: (id) => request(`/admin/carts/${id}`, { method: 'DELETE' }),
};
