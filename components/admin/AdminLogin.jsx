'use client';

import { useState } from 'react';
import { FiEye, FiEyeOff, FiLock } from 'react-icons/fi';
import { adminAPI, setToken } from '@/lib/adminApi';
import { inputClass, primaryBtn } from './ui';

export default function AdminLogin({ onLogin }) {
  const [password, setPassword] = useState('');
  const [show, setShow] = useState(false);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError('');
    try {
      const { token } = await adminAPI.login(password);
      setToken(token);
      onLogin();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-pink-50 via-white to-purple-50 px-4 text-gray-900" style={{ colorScheme: 'light' }}>
      <form onSubmit={submit} className="w-full max-w-sm rounded-3xl border border-gray-200 bg-white p-8 shadow-xl">
        <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-pink-600 to-purple-600 text-white">
          <FiLock className="text-xl" />
        </div>
        <h1 className="text-center text-2xl font-bold">Hudamoji Admin</h1>
        <p className="mb-6 mt-1 text-center text-sm text-gray-500">Enter your password to manage the store</p>

        <div className="relative">
          <input
            type={show ? 'text' : 'password'}
            autoFocus
            autoComplete="current-password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={`${inputClass} pr-11`}
          />
          <button
            type="button"
            onClick={() => setShow((s) => !s)}
            aria-label={show ? 'Hide password' : 'Show password'}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
          >
            {show ? <FiEyeOff /> : <FiEye />}
          </button>
        </div>

        {error && <p role="alert" className="mt-3 text-center text-sm font-medium text-red-600">{error}</p>}

        <button type="submit" disabled={busy || !password} className={`${primaryBtn} mt-5 w-full`}>
          {busy ? 'Signing in…' : 'Sign in'}
        </button>
      </form>
    </div>
  );
}
