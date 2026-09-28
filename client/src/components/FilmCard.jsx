import { Link } from 'react-router-dom';

export default function FilmCard({ film }) {
  return (
    <Link to={`/films/${film.slug}`} className="group block">
      <div className="relative overflow-hidden border border-white/10 bg-ink-soft transition duration-500 group-hover:border-gold/70">
        <div className="aspect-[2/3] overflow-hidden">
          <img
            src={film.poster}
            alt={film.title}
            className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
              e.currentTarget.parentElement.classList.add('bg-gradient-to-br', 'from-zinc-800', 'to-black');
            }}
          />
        </div>
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black via-black/10 to-transparent opacity-70" />
        <div className="absolute inset-x-0 bottom-0 p-4">
          <p className="text-[10px] uppercase tracking-[0.28em] text-gold">{film.collectionName}</p>
          <h3 className="font-display text-2xl leading-tight text-paper">{film.title}</h3>
          <p className="mt-1 text-xs text-paper/60">{film.year} · {film.director}</p>
        </div>
      </div>
    </Link>
  );
}
