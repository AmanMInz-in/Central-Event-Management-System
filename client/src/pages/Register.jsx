import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [club, setClub] = useState('');
  const [role, setRole] = useState('student');
  const [error, setError] = useState('');

  const { saveToken } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!name || !email || !password) {
      setError('Please fill out all required fields');
      return;
    }

    try {
      const response = await api.post('/auth/register', { name, email, password, role, club });
      saveToken(response.data.token, response.data.user);
      navigate('/dashboard');
    } catch (err) {
      console.error('Register error:', err);
      setError(
        err.response?.data?.message || err.message || 'Registration failed (server not reachable or invalid response)'
      );
    }
  };

  return (
    <div className="mx-auto max-w-md rounded-[28px] bg-slate-950/95 p-8 shadow-[0_40px_120px_rgba(15,23,42,0.35)]">
      <p className="text-sm uppercase tracking-[0.22em] text-brand-primary">Create your account</p>
      <h2 className="mt-3 h2">Register for EventIQ</h2>
      {error && <p className="mt-3 text-sm text-red-500">{error}</p>}
      <form onSubmit={handleSubmit} className="mt-4 space-y-4">
        <input className="input-base" value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" required />
        <input className="input-base" value={email} type="email" onChange={(e) => setEmail(e.target.value)} placeholder="Email" required />
        <input className="input-base" value={password} type="password" onChange={(e) => setPassword(e.target.value)} placeholder="Password" required />
        <input className="input-base bg-slate-900/60" value="Student" disabled />
        <p className="text-xs text-slate-500">Role is fixed to Student; club associates are created by admins.</p>
        <input className="input-base" value={club} onChange={(e) => setClub(e.target.value)} placeholder="Club (optional)" />
        <button className="btn btn-primary w-full py-3" type="submit">Register</button>
      </form>
      <p className="mt-4 text-sm text-slate-400">
        Already have an account? <Link to="/login" className="text-brand-primary">Login</Link>
      </p>
    </div>
  );
};

export default Register;
