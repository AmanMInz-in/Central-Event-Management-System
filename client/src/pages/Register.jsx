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
    <div className="mx-auto max-w-md rounded-xl bg-white p-8 shadow-lg">
      <h2 className="text-2xl font-semibold">Register</h2>
      {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
      <form onSubmit={handleSubmit} className="mt-4 space-y-4">
        <input className="w-full rounded-md border p-2" value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" required />
        <input className="w-full rounded-md border p-2" value={email} type="email" onChange={(e) => setEmail(e.target.value)} placeholder="Email" required />
        <input className="w-full rounded-md border p-2" value={password} type="password" onChange={(e) => setPassword(e.target.value)} placeholder="Password" required />
        <select className="w-full rounded-md border p-2" value={role} onChange={(e) => setRole(e.target.value)}>
          <option value="student">Student</option>
          <option value="club_associate">Club Associate</option>
        </select>
        <input className="w-full rounded-md border p-2" value={club} onChange={(e) => setClub(e.target.value)} placeholder="Club (optional)" />
        <button className="w-full rounded-md bg-brand-primary py-2 text-white hover:bg-blue-700" type="submit">Register</button>
      </form>
      <p className="mt-4 text-sm text-slate-600">
        Already have an account? <Link to="/login" className="text-brand-primary">Login</Link>
      </p>
    </div>
  );
};

export default Register;
