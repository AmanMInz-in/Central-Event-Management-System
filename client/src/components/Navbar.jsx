import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-slate-950/80 backdrop-blur-xl shadow-[0_30px_80px_rgba(15,23,42,0.2)]">
      <div className="container mx-auto flex flex-wrap items-center justify-between px-4 py-4 xl:px-6">
        <Link to="/" className="text-lg font-semibold uppercase tracking-[0.26em] text-white">
          EventIQ
        </Link>
        <div className="hidden items-center gap-6 md:flex">
          <a href="/" className="text-sm font-medium text-slate-300 transition hover:text-white">Home</a>
          <a href="#features" className="text-sm font-medium text-slate-300 transition hover:text-white">Features</a>
          <NavLink to="/events" className={({ isActive }) => isActive ? 'text-white font-semibold' : 'text-slate-300 hover:text-white'}>Events</NavLink>
          <NavLink to="/gallery" className={({ isActive }) => isActive ? 'text-white font-semibold' : 'text-slate-300 hover:text-white'}>Gallery</NavLink>
        </div>
        <div className="flex items-center gap-3">
          {user ? (
            <>
              <NavLink to="/dashboard" className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/10">Dashboard</NavLink>
              <button onClick={logout} className="rounded-full bg-brand-primary px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-primary/90">Logout</button>
            </>
          ) : (
            <>
              <NavLink to="/login" className="text-sm font-semibold text-slate-200 transition hover:text-white">Login</NavLink>
              <NavLink to="/register" className="rounded-full bg-brand-primary px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-primary/90">Get Started</NavLink>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
