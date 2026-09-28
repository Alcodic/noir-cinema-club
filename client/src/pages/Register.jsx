import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');

  async function onSubmit(e) {
    e.preventDefault();
    setError('');
    try {
      await register(form.name, form.email, form.password);
      navigate('/films');
    } catch (err) {
      setError(err.response?.data?.message || 'Could not create membership.');
    }
  }

  return (
    <main className="mx-auto max-w-md px-5 py-20">
      <p className="text-[11px] uppercase tracking-[0.4em] text-gold">Gold membership</p>
      <h1 className="mt-3 font-display text-5xl text-paper">Join the salon</h1>
      <p className="mt-4 text-sm leading-7 text-paper/60">
        Create an account to keep a private vault and host movie nights. This is a local demo — use any email you like.
      </p>
      <form onSubmit={onSubmit} className="mt-10 space-y-5">
        <label className="block text-[11px] uppercase tracking-[0.22em] text-paper/50">
          Name
          <input
            required
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="mt-2 w-full border border-white/15 bg-transparent px-4 py-3 text-base tracking-normal text-paper outline-none focus:border-gold"
          />
        </label>
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
          Password (8+ characters)
          <input
            type="password"
            required
            minLength={8}
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            className="mt-2 w-full border border-white/15 bg-transparent px-4 py-3 text-base tracking-normal text-paper outline-none focus:border-gold"
          />
        </label>
        {error && <p className="text-sm text-red-300">{error}</p>}
        <button type="submit" className="w-full bg-gold py-3 text-[11px] uppercase tracking-[0.3em] text-ink">
          Become a member
        </button>
      </form>
      <p className="mt-8 text-sm text-paper/50">
        Already a member?{' '}
        <Link to="/login" className="text-gold">
          Sign in
        </Link>
      </p>
    </main>
  );
}
