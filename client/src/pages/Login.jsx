import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  async function onSubmit(e) {
    e.preventDefault();
    setError('');
    try {
      await login(form.email, form.password);
      navigate('/my-vault');
    } catch (err) {
      setError(err.response?.data?.message || 'Could not sign in.');
    }
  }

  return (
    <main className="mx-auto max-w-md px-5 py-20">
      <p className="text-[11px] uppercase tracking-[0.4em] text-gold">Members entrance</p>
      <h1 className="mt-3 font-display text-5xl text-paper">Sign in</h1>
      <form onSubmit={onSubmit} className="mt-10 space-y-5">
        <label className="block text-[11px] uppercase tracking-[0.22em] text-paper/50">
          Email
          <input
            type="email"
            required
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="mt-2 w-full border border-white/15 bg-transparent px-4 py-3 text-base tracking-normal text-paper outline-none focus:border-gold"
          />
        </label>
        <label className="block text-[11px] uppercase tracking-[0.22em] text-paper/50">
          Password
          <input
            type="password"
            required
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            className="mt-2 w-full border border-white/15 bg-transparent px-4 py-3 text-base tracking-normal text-paper outline-none focus:border-gold"
          />
        </label>
        {error && <p className="text-sm text-red-300">{error}</p>}
        <button type="submit" className="w-full bg-gold py-3 text-[11px] uppercase tracking-[0.3em] text-ink">
          Enter the club
        </button>
      </form>
      <p className="mt-8 text-sm text-paper/50">
        New here?{' '}
        <Link to="/register" className="text-gold">
          Request membership
        </Link>
      </p>
    </main>
  );
}
