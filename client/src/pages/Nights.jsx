import { useEffect, useState } from 'react';
import api from '../api';

export default function Nights() {
  const [nights, setNights] = useState([]);
  const [films, setFilms] = useState([]);
  const [form, setForm] = useState({ title: '', scheduledAt: '', filmId: '', note: '' });
  const [error, setError] = useState('');

  async function load() {
    try {
      const [n, f] = await Promise.all([api.get('/nights'), api.get('/films')]);
      setNights(n.data.nights);
      setFilms(f.data.films);
      if (!form.filmId && f.data.films[0]) {
        setForm((prev) => ({ ...prev, filmId: f.data.films[0]._id }));
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Could not load the salon calendar.');
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function onSubmit(e) {
    e.preventDefault();
    setError('');
    try {
      await api.post('/nights', form);
      setForm((prev) => ({ ...prev, title: '', note: '' }));
      await load();
    } catch (err) {
      setError(err.response?.data?.message || 'Could not host this night.');
    }
  }

  async function remove(id) {
    try {
      await api.delete(`/nights/${id}`);
      await load();
    } catch (err) {
      setError(err.response?.data?.message || 'Could not cancel this night.');
    }
  }

  return (
    <main className="mx-auto max-w-6xl px-5 py-14">
      <p className="text-[11px] uppercase tracking-[0.4em] text-gold">Salon calendar</p>
      <h1 className="mt-3 font-display text-5xl text-paper">Movie nights</h1>
      <p className="mt-4 max-w-2xl text-sm leading-7 text-paper/60">
        Host a screening: a title, a time, and a note for the room. This is your private calendar — invite friends in person.
      </p>

      <div className="mt-12 grid gap-12 lg:grid-cols-[1fr_1.1fr]">
        <form onSubmit={onSubmit} className="border border-white/10 bg-ink-soft/60 p-6">
          <h2 className="font-display text-3xl text-paper">Host a night</h2>
          <div className="mt-6 space-y-4">
            <input
              required
              placeholder="Evening title — e.g. Midnight Noir at home"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-full border border-white/15 bg-transparent px-4 py-3 text-sm outline-none focus:border-gold"
            />
            <input
              required
              type="datetime-local"
              value={form.scheduledAt}
              onChange={(e) => setForm({ ...form, scheduledAt: e.target.value })}
              className="w-full border border-white/15 bg-transparent px-4 py-3 text-sm outline-none focus:border-gold"
            />
            <select
              required
              value={form.filmId}
              onChange={(e) => setForm({ ...form, filmId: e.target.value })}
              className="w-full border border-white/15 bg-ink px-4 py-3 text-sm outline-none focus:border-gold"
            >
              {films.map((film) => (
                <option key={film._id} value={film._id}>
                  {film.title} ({film.year})
                </option>
              ))}
            </select>
            <textarea
              rows={4}
              placeholder="A note for the room — wine, silence, discussion after the credits."
              value={form.note}
              onChange={(e) => setForm({ ...form, note: e.target.value })}
              className="w-full border border-white/15 bg-transparent px-4 py-3 text-sm outline-none focus:border-gold"
            />
            {error && <p className="text-sm text-red-300">{error}</p>}
            <button type="submit" className="w-full bg-gold py-3 text-[11px] uppercase tracking-[0.28em] text-ink">
              Add to calendar
            </button>
          </div>
        </form>

        <div className="space-y-4">
          {nights.length === 0 && (
            <div className="border border-dashed border-gold/30 px-6 py-14 text-center text-paper/50">
              No nights booked. The first one sets the tone.
            </div>
          )}
          {nights.map((night) => (
            <article key={night._id} className="flex gap-4 border border-white/10 p-4">
              {night.film?.poster && (
                <img src={night.film.poster} alt="" className="h-28 w-20 object-cover" />
              )}
              <div className="flex-1">
                <p className="text-[10px] uppercase tracking-[0.28em] text-gold">
                  {new Date(night.scheduledAt).toLocaleString()}
                </p>
                <h3 className="mt-1 font-display text-2xl text-paper">{night.title}</h3>
                <p className="text-sm text-paper/60">{night.film?.title}</p>
                {night.note && <p className="mt-2 text-sm italic text-paper/50">{night.note}</p>}
              </div>
              <button
                type="button"
                onClick={() => remove(night._id)}
                className="self-start text-[10px] uppercase tracking-[0.2em] text-paper/40 hover:text-gold"
              >
                Cancel
              </button>
            </article>
          ))}
        </div>
      </div>
    </main>
  );
}
