import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto flex flex-wrap items-center justify-between p-4">
        <Link to="/" className="font-bold text-xl text-brand-primary">
          CCET Events
        </Link>
        <div className="flex flex-wrap items-center gap-3">
          <NavLink to="/" className={({ isActive }) => isActive ? 'text-brand-primary font-semibold' : 'hover:text-brand-primary'}>Home</NavLink>
          <NavLink to="/events" className={({ isActive }) => isActive ? 'text-brand-primary font-semibold' : 'hover:text-brand-primary'}>Events</NavLink>
          <NavLink to="/clubs" className={({ isActive }) => isActive ? 'text-brand-primary font-semibold' : 'hover:text-brand-primary'}>Clubs</NavLink>
          <NavLink to="/gallery" className={({ isActive }) => isActive ? 'text-brand-primary font-semibold' : 'hover:text-brand-primary'}>Gallery</NavLink>
          <a href="https://ccetbhilai.ac.in/" target="_blank" rel="noreferrer" className="rounded-md bg-brand-secondary px-3 py-1 text-white hover:opacity-90">Visit CCET Official Website</a>
          {user ? (
            <>
              <NavLink to="/dashboard" className="hover:text-brand-primary">Dashboard</NavLink>
              <button onClick={logout} className="px-3 py-1 rounded bg-brand-secondary text-white hover:opacity-90">Logout</button>
            </>
          ) : (
            <>
              <NavLink to="/login" className="hover:text-brand-primary">Login</NavLink>
              <NavLink to="/register" className="px-3 py-1 rounded bg-brand-primary text-white hover:opacity-90">Register</NavLink>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
