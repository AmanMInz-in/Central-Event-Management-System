import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [role, setRole] = useState('student');
  const { saveToken } = useAuth();
  const navigate = useNavigate();

  const quickFill = (selected) => {
    setRole(selected);
    if (selected === 'admin') {
      setEmail('minj6998@gmail.com');
      setPassword('adminccet12');
    } else if (selected === 'club_associate') {
      setEmail('associate@example.com');
      setPassword('assocpass');
    } else {
      setEmail('student@example.com');
      setPassword('studentpass');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const response = await api.post('/auth/login', { email, password });
      saveToken(response.data.token, response.data.user);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="mx-auto max-w-md rounded-[28px] bg-slate-950/95 p-8 shadow-[0_40px_120px_rgba(15,23,42,0.35)]">
      <p className="text-sm uppercase tracking-[0.22em] text-brand-primary">Nice to see you back</p>
      <h2 className="mt-3 h2">Login to your dashboard</h2>
      <p className="mt-3 text-sm text-slate-400">Choose your role and quick-fill credentials to continue.</p>

      <div className="mt-4 flex flex-wrap gap-3">
        <button type="button" onClick={() => quickFill('admin')} className={`pill ${role === 'admin' ? 'bg-brand-primary text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}`}>Admin Login</button>
        <button type="button" onClick={() => quickFill('club_associate')} className={`pill ${role === 'club_associate' ? 'bg-brand-primary text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}`}>Club Associate</button>
        <button type="button" onClick={() => quickFill('student')} className={`pill ${role === 'student' ? 'bg-brand-primary text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}`}>Student</button>
      </div>

      {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
      <form onSubmit={handleSubmit} className="mt-4 space-y-4">
        <input className="input-base" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" required />
        <input className="input-base" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" required />
        <button className="btn btn-primary w-full py-3" type="submit">Login</button>
      </form>
      <p className="mt-4 text-sm text-slate-400">
        New? <Link to="/register" className="text-brand-primary">Create an account</Link>
      </p>
    </div>
  );
};

export default Login;
