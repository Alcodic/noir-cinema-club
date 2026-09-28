import { Link, NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const linkClass = ({ isActive }) =>
  `text-[11px] uppercase tracking-[0.28em] transition ${
    isActive ? 'text-gold' : 'text-paper/70 hover:text-gold-soft'
  }`;

export default function Layout() {
  const { user, logout } = useAuth();

  return (
    <div className="grain min-h-screen">
      <header className="sticky top-0 z-40 border-b border-white/10 bg-ink/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-6 px-5 py-4">
          <Link to="/" className="flex items-center gap-3">
            <span className="grid h-9 w-9 place-items-center border border-gold/70 font-display text-xl text-gold">
              N
            </span>
            <div>
              <p className="font-display text-xl leading-none tracking-wide text-paper">Noir Cinema Club</p>
              <p className="mt-1 text-[10px] uppercase tracking-[0.35em] text-gold/80">Private screenings</p>
            </div>
          </Link>
          <nav className="hidden items-center gap-8 md:flex">
            <NavLink to="/films" className={linkClass}>
              Vault
            </NavLink>
            <NavLink to="/nights" className={linkClass}>
              Nights
            </NavLink>
            <NavLink to="/my-vault" className={linkClass}>
              My list
            </NavLink>
          </nav>
          <div className="flex items-center gap-4">
            {user ? (
              <>
                <span className="hidden text-[11px] uppercase tracking-[0.2em] text-paper/50 sm:block">
                  {user.name} · {user.membership}
                </span>
                <button
                  type="button"
                  onClick={logout}
                  className="text-[11px] uppercase tracking-[0.28em] text-gold hover:text-gold-soft"
                >
                  Sign out
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="border border-gold/80 px-4 py-2 text-[11px] uppercase tracking-[0.28em] text-gold hover:bg-gold hover:text-ink"
              >
                Become a member
              </Link>
            )}
          </div>
        </div>
        <nav className="flex items-center justify-between border-t border-white/5 px-5 py-3 md:hidden">
          <NavLink to="/films" className={linkClass}>
            Vault
          </NavLink>
          <NavLink to="/nights" className={linkClass}>
            Nights
          </NavLink>
          <NavLink to="/my-vault" className={linkClass}>
            My list
          </NavLink>
        </nav>
      </header>
      <Outlet />
      <footer className="mt-20 border-t border-white/10">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-5 py-10 text-[11px] uppercase tracking-[0.25em] text-paper/40 sm:flex-row sm:justify-between">
          <p>Noir Cinema Club · Est. 2026</p>
          <p>A members salon for people who still dress for the movie</p>
        </div>
      </footer>
    </div>
  );
}
