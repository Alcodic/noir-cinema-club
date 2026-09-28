import { useEffect, useState } from 'react';
import api from '../api';
import FilmCard from '../components/FilmCard';

export default function Films() {
  const [collection, setCollection] = useState('all');
  const [q, setQ] = useState('');
  const [data, setData] = useState({ films: [], collections: [] });

  useEffect(() => {
    const params = {};
    if (collection !== 'all') params.collection = collection;
    if (q) params.q = q;
    api
      .get('/films', { params })
      .then((res) => setData(res.data))
      .catch(() => setData((prev) => ({ films: [], collections: prev.collections || [] })));
  }, [collection, q]);

  return (
    <main className="mx-auto max-w-6xl px-5 py-14">
      <p className="text-[11px] uppercase tracking-[0.4em] text-gold">The vault</p>
      <h1 className="mt-3 font-display text-5xl text-paper sm:text-6xl">Titles we keep in the dark.</h1>
      <p className="mt-4 max-w-2xl text-sm leading-7 text-paper/60">
        Filter by collection or search a director. This is not an infinite catalog — it is a short list with taste.
      </p>

      <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2">
          {['all', ...(data.collections || [])].map((name) => (
            <button
              key={name}
              type="button"
              onClick={() => setCollection(name)}
              className={`border px-4 py-2 text-[11px] uppercase tracking-[0.22em] ${
                collection === name
                  ? 'border-gold bg-gold text-ink'
                  : 'border-white/15 text-paper/70 hover:border-gold/50'
              }`}
            >
              {name === 'all' ? 'All titles' : name}
            </button>
          ))}
        </div>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search title or director"
          className="border border-white/15 bg-transparent px-4 py-2 text-sm text-paper outline-none placeholder:text-paper/30 focus:border-gold"
        />
      </div>

      {data.films.length === 0 ? (
        <div className="mt-16 border border-dashed border-gold/30 px-8 py-16 text-center">
          <p className="font-display text-3xl text-paper">No titles in this cut.</p>
          <p className="mt-3 text-sm text-paper/50">Try another collection, or search a director instead of a mood.</p>
        </div>
      ) : (
        <div className="mt-10 grid grid-cols-2 gap-5 md:grid-cols-4">
          {data.films.map((film) => (
            <FilmCard key={film._id} film={film} />
          ))}
        </div>
      )}
    </main>
  );
}
