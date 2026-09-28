import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import FilmCard from '../components/FilmCard';

export default function MyVault() {
  const [films, setFilms] = useState([]);

  useEffect(() => {
    api
      .get('/vault')
      .then((res) => setFilms(res.data.films))
      .catch(() => setFilms([]));
  }, []);

  return (
    <main className="mx-auto max-w-6xl px-5 py-14">
      <p className="text-[11px] uppercase tracking-[0.4em] text-gold">Private list</p>
      <h1 className="mt-3 font-display text-5xl text-paper">Your vault</h1>
      {films.length === 0 ? (
        <div className="mt-16 border border-dashed border-gold/30 px-8 py-16 text-center">
          <p className="font-display text-3xl text-paper">Nothing pinned yet.</p>
          <p className="mt-3 text-sm text-paper/50">Open a dossier and save a title. Taste starts with a short list.</p>
          <Link to="/films" className="mt-8 inline-block bg-gold px-6 py-3 text-[11px] uppercase tracking-[0.28em] text-ink">
            Browse the vault
          </Link>
        </div>
      ) : (
        <div className="mt-10 grid grid-cols-2 gap-5 md:grid-cols-4">
          {films.map((film) => (
            <FilmCard key={film._id} film={film} />
          ))}
        </div>
      )}
    </main>
  );
}
