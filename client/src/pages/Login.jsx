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
    <div className="mx-auto max-w-md rounded-xl bg-white p-8 shadow-lg">
      <h2 className="text-2xl font-semibold">Login</h2>
      <p className="mt-3 text-sm text-slate-500">Choose your role and credentials</p>

      <div className="mt-4 flex gap-2">
        <button type="button" onClick={() => quickFill('admin')} className={`rounded px-3 py-1 text-sm ${role === 'admin' ? 'bg-brand-primary text-white' : 'bg-slate-200'}`}>Admin Login</button>
        <button type="button" onClick={() => quickFill('club_associate')} className={`rounded px-3 py-1 text-sm ${role === 'club_associate' ? 'bg-brand-primary text-white' : 'bg-slate-200'}`}>Club Associate</button>
        <button type="button" onClick={() => quickFill('student')} className={`rounded px-3 py-1 text-sm ${role === 'student' ? 'bg-brand-primary text-white' : 'bg-slate-200'}`}>Student</button>
      </div>

      {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
      <form onSubmit={handleSubmit} className="mt-4 space-y-4">
        <input className="w-full rounded-md border p-2" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" required />
        <input className="w-full rounded-md border p-2" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" required />
        <button className="w-full rounded-md bg-brand-primary py-2 text-white hover:bg-blue-700" type="submit">Login</button>
      </form>
      <p className="mt-4 text-sm text-slate-600">
        New? <Link to="/register" className="text-brand-primary">Create an account</Link>
      </p>
    </div>
  );
};

export default Login;
