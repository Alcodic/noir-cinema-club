import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import api from '../api';
import { useAuth } from '../context/AuthContext';
import FilmCard from '../components/FilmCard';

export default function FilmDetail() {
  const { slug } = useParams();
  const { user } = useAuth();
  const [payload, setPayload] = useState(null);
  const [vaultIds, setVaultIds] = useState([]);
  const [message, setMessage] = useState('');
  const [missing, setMissing] = useState(false);

  useEffect(() => {
    setPayload(null);
    setMissing(false);
    api
      .get(`/films/${slug}`)
      .then((res) => setPayload(res.data))
      .catch(() => setMissing(true));
  }, [slug]);

  useEffect(() => {
    if (!user) return;
    api
      .get('/vault')
      .then((res) => setVaultIds(res.data.films.map((f) => f._id)))
      .catch(() => setVaultIds([]));
  }, [user]);

  if (missing) {
    return (
      <main className="mx-auto max-w-6xl px-5 py-24 text-center">
        <p className="font-display text-4xl text-paper">This title is not in the vault.</p>
        <Link to="/films" className="mt-8 inline-block text-[11px] uppercase tracking-[0.3em] text-gold">
          Return to the collection
        </Link>
      </main>
    );
  }

  if (!payload) {
    return <p className="px-5 py-24 text-center text-[11px] uppercase tracking-[0.3em] text-gold/70">Opening dossier…</p>;
  }

  const { film, related } = payload;
  const saved = vaultIds.includes(film._id);

  async function toggleVault() {
    if (!user) {
      setMessage('Membership required to keep a private list.');
      return;
    }
    try {
      const { data } = await api.post(`/vault/${film._id}`);
      setVaultIds(data.films.map((f) => f._id));
    } catch (err) {
      setMessage(err.response?.data?.message || 'Could not update your list.');
    }
  }

  return (
    <main>
      <section className="relative min-h-[62vh] overflow-hidden">
        <img src={film.backdrop || film.poster} alt="" className="absolute inset-0 h-full w-full object-cover opacity-40" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/70 to-ink/40" />
        <div className="relative mx-auto grid max-w-6xl gap-10 px-5 pb-16 pt-20 md:grid-cols-[240px_1fr] md:items-end">
          <img src={film.poster} alt={film.title} className="hidden w-full border border-gold/30 shadow-2xl md:block" />
          <div>
            <p className="text-[11px] uppercase tracking-[0.35em] text-gold">{film.collectionName}</p>
            <h1 className="mt-3 font-display text-5xl text-paper sm:text-7xl">{film.title}</h1>
            <p className="mt-4 text-sm text-paper/70">
              {film.year} · {film.director} · {film.runtime} min · {film.rating.toFixed(1)}
            </p>
            <p className="mt-6 max-w-2xl text-base italic leading-8 text-gold-soft">{film.logline}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={toggleVault}
                className="border border-gold bg-gold px-5 py-3 text-[11px] uppercase tracking-[0.28em] text-ink"
              >
                {saved ? 'Remove from my list' : 'Save to my list'}
              </button>
              <Link
                to="/nights"
                className="border border-gold/60 px-5 py-3 text-[11px] uppercase tracking-[0.28em] text-gold"
              >
                Plan a night
              </Link>
            </div>
            {message && (
              <p className="mt-4 text-sm text-gold/80">
                {message}
                {!user && (
                  <>
                    {' '}
                    <Link to="/login" className="underline">
                      Sign in
                    </Link>
                  </>
                )}
              </p>
            )}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-12">
        <div className="flex flex-wrap gap-2">
          {film.genres.map((g) => (
            <span key={g} className="border border-white/15 px-3 py-1 text-[10px] uppercase tracking-[0.22em] text-paper/60">
              {g}
            </span>
          ))}
        </div>
        <p className="mt-8 max-w-3xl text-sm leading-8 text-paper/75">{film.synopsis}</p>

        {related.length > 0 && (
          <div className="mt-16">
            <h2 className="font-display text-3xl text-paper">Also in {film.collectionName}</h2>
            <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
              {related.map((item) => (
                <FilmCard key={item._id} film={item} />
              ))}
            </div>
          </div>
        )}
      </section>
    </main>
  );
}
