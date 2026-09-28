import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../api';
import FilmCard from '../components/FilmCard';

export default function Home() {
  const [data, setData] = useState(null);

  useEffect(() => {
    api.get('/films').then((res) => setData(res.data)).catch(() => setData({ films: [], featured: null }));
  }, []);

  const featured = data?.featured;
  const byCollection = (name) => data?.films.filter((f) => f.collectionName === name).slice(0, 4) || [];

  return (
    <main>
      <section className="relative min-h-[88vh] overflow-hidden">
        {featured && (
          <img
            src={featured.backdrop || featured.poster}
            alt=""
            className="absolute inset-0 h-full w-full object-cover opacity-35"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/80 to-ink/30" />
        <div className="relative mx-auto flex min-h-[88vh] max-w-6xl flex-col justify-end px-5 pb-20 pt-24">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-[11px] uppercase tracking-[0.45em] text-gold"
          >
            Invitation only · Dark luxury screenings
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mt-5 max-w-3xl font-display text-6xl leading-[0.92] text-paper sm:text-8xl"
          >
            Dress for the dark.
            <span className="italic text-gold"> Stay for the film.</span>
          </motion.h1>
          <p className="mt-8 max-w-xl text-sm leading-7 text-paper/70">
            A private vault of noir, prestige, and auteur cinema. Save titles to your list, then host a night
            that feels like a salon — not a queue at a multiplex.
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <Link
              to="/films"
              className="bg-gold px-6 py-3 text-[11px] uppercase tracking-[0.3em] text-ink hover:bg-gold-soft"
            >
              Enter the vault
            </Link>
            <Link
              to="/register"
              className="border border-gold/60 px-6 py-3 text-[11px] uppercase tracking-[0.3em] text-gold hover:bg-gold/10"
            >
              Request membership
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-20">
        <div className="gold-rule mb-10" />
        <div className="grid gap-10 md:grid-cols-3">
          {[
            ['01', 'The vault', 'Sixteen curated titles spanning midnight noir, prestige, and auteurs. Each dossier is written like a program note.'],
            ['02', 'Your list', 'Pin films to a private vault. Membership is local to you — this is a club, not a public feed.'],
            ['03', 'The night', 'Pick a date, a film, and a note for the room. Host screenings the way hotels host dinners.'],
          ].map(([n, title, copy]) => (
            <div key={n}>
              <p className="text-[11px] tracking-[0.3em] text-gold">{n}</p>
              <h2 className="mt-3 font-display text-3xl text-paper">{title}</h2>
              <p className="mt-3 text-sm leading-7 text-paper/60">{copy}</p>
            </div>
          ))}
        </div>
      </section>

      {['Midnight Noir', 'Prestige', 'Auteurs'].map((name) => (
        <section key={name} className="mx-auto max-w-6xl px-5 pb-16">
          <div className="mb-6 flex items-end justify-between">
            <h2 className="font-display text-4xl text-paper">{name}</h2>
            <Link to="/films" className="text-[11px] uppercase tracking-[0.3em] text-gold">
              View collection
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {byCollection(name).map((film) => (
              <FilmCard key={film._id} film={film} />
            ))}
          </div>
        </section>
      ))}
    </main>
  );
}
