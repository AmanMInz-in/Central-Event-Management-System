import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto flex flex-wrap items-center justify-between p-4">
        <Link to="/" className="font-bold text-xl text-brand-primary">
          CCEMS
        </Link>
        <div className="flex items-center gap-2">
          <NavLink to="/events" className={({ isActive }) => isActive ? 'text-brand-primary font-semibold' : 'hover:text-brand-primary'}>Events</NavLink>
          <NavLink to="/gallery" className={({ isActive }) => isActive ? 'text-brand-primary font-semibold' : 'hover:text-brand-primary'}>Gallery</NavLink>
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
