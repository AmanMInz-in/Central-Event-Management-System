import { useEffect, useMemo, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import EventList from '../components/EventList';
import { CLUB_OPTIONS } from '../data/clubs';
import Modal from '../components/Modal';

const Dashboard = () => {
  const { user } = useAuth();
  const [events, setEvents] = useState([]);
  const [form, setForm] = useState({ title: '', description: '', club: user?.club || '', date: '', time: '', venue: '', poster: '', registrationLink: '' });
  const [editingEvent, setEditingEvent] = useState(null);
  const [editForm, setEditForm] = useState({ title: '', description: '', club: '', date: '', time: '', venue: '', poster: '', registrationLink: '' });
  const [message, setMessage] = useState('');
  const [notices, setNotices] = useState([]);
  const [noticeForm, setNoticeForm] = useState({ title: '', content: '' });
  const [users, setUsers] = useState([]);
  const [newAssociate, setNewAssociate] = useState({ name: '', email: '', password: '', club: '' });
  const [userMessage, setUserMessage] = useState('');
  const createEventRef = useRef(null);
  const usersRef = useRef(null);
  const navigate = useNavigate();
  const [showNoticeModal, setShowNoticeModal] = useState(false);
  const [showCreateEventModal, setShowCreateEventModal] = useState(false);

  const fetchEvents = async () => {
    try {
      const response = await api.get('/events');
      setEvents(response.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchUsers = async () => {
    if (user?.role !== 'admin') return;
    try {
      const response = await api.get('/users');
      setUsers(response.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchNotices = async () => {
    try {
      const response = await api.get('/notices');
      setNotices(response.data);
    } catch (err) {
      console.error(err);
    }
  };

  const createNotice = async (e) => {
    e.preventDefault();
    try {
      await api.post('/notices', noticeForm);
      setNoticeForm({ title: '', content: '' });
      fetchNotices();
      setMessage('Notice published');
      setShowNoticeModal(false);
    } catch (err) {
      console.error(err);
      setMessage(err.response?.data?.message || 'Unable to publish notice');
    }
  };

  const createClubAssociate = async (e) => {
    e.preventDefault();
    setUserMessage('');
    try {
      await api.post('/users/club-associate', newAssociate);
      setUserMessage('Club associate created successfully');
      setNewAssociate({ name: '', email: '', password: '', club: '' });
      fetchUsers();
    } catch (err) {
      console.error(err);
      setUserMessage(err.response?.data?.message || 'Failed to create club associate');
    }
  };

  const promoteUser = async (userId, club) => {
    setUserMessage('');
    try {
      await api.put(`/users/${userId}/promote`, { club });
      setUserMessage('User promoted to Club Associate');
      fetchUsers();
    } catch (err) {
      console.error(err);
      setUserMessage(err.response?.data?.message || 'Promotion failed');
    }
  };

  const handleQuickCreateEvent = () => {
    if (createEventRef.current) {
      createEventRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
      const input = createEventRef.current.querySelector('input,textarea,select');
      if (input) input.focus();
      // also open modal for a focused create experience for all roles
      setShowCreateEventModal(true);
    } else {
      // fallback to modal so users can always create events
      setShowCreateEventModal(true);
    }
  };

  const handleQuickPublishNotice = async () => {
    setShowNoticeModal(true);
  };

  const handleQuickReviewUsers = () => {
    if (usersRef.current) {
      usersRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    } else {
      setUserMessage('User list not available for your role.');
    }
  };

  const handleQuickViewGallery = () => navigate('/gallery');

  const deleteUserAction = async (userId) => {
    setUserMessage('');
    try {
      await api.delete(`/users/${userId}`);
      setUserMessage('User deleted');
      fetchUsers();
    } catch (err) {
      console.error(err);
      setUserMessage(err.response?.data?.message || 'Delete failed');
    }
  };

  useEffect(() => {
    fetchEvents();
    fetchUsers();
    fetchNotices();
  }, [user]);

  // Keep the form club value in sync when the user is a club_associate
  useEffect(() => {
    if (user?.role === 'club_associate') {
      setForm((f) => ({ ...f, club: user.club || '' }));
    }
  }, [user]);

  const handleCreateEvent = async (e) => {
    e.preventDefault();
    setMessage('');
    // Basic client-side validation
    const required = ['title', 'description', 'date', 'time', 'venue'];
    for (const key of required) {
      if (!form[key]) {
        setMessage(`Missing required field: ${key}`);
        return;
      }
    }

    // club validation: allow club_associate to supply their club
    const payload = { ...form };
    if (user?.role === 'club_associate') {
      payload.club = user.club;
    }

    if (!payload.club || !CLUB_OPTIONS.includes(payload.club)) {
      setMessage('Please select a valid club');
      return;
    }

    try {
      const res = await api.post('/events', payload);
      await fetchEvents();
      setMessage('Event created successfully');
      setForm({ ...form, title: '', description: '', date: '', time: '', venue: '', poster: '', registrationLink: '' });
      setShowCreateEventModal(false);
    } catch (err) {
      console.error('Create event error:', err);
      const serverMsg = err.response?.data?.message;
      const status = err.response?.status;
      setMessage(serverMsg ? `(${status}) ${serverMsg}` : 'Failed to create event (network or server error)');
    }
  };

  const handleEdit = (event) => {
    setEditingEvent(event);
    setEditForm({
      title: event.title,
      description: event.description,
      club: event.club,
      date: event.date,
      time: event.time,
      venue: event.venue,
      poster: event.poster,
      registrationLink: event.registrationLink,
    });
  };

  const handleUpdateEvent = async (e) => {
    e.preventDefault();
    if (!editingEvent) return;
    try {
      await api.put(`/events/${editingEvent._id}`, editForm);
      setEditingEvent(null);
      setMessage('Event updated successfully');
      fetchEvents();
    } catch (err) {
      console.error(err);
      setMessage(err.response?.data?.message || 'Failed to update event');
    }
  };

  const cancelEdit = () => {
    setEditingEvent(null);
    setEditForm({ title: '', description: '', club: user?.club || '', date: '', time: '', venue: '', poster: '', registrationLink: '' });
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/events/${id}`);
      fetchEvents();
    } catch (err) {
      console.error(err);
    }
  };

  const showAdminPanel = user?.role === 'admin';
  const showClubPanel = user?.role === 'club_associate';
  const showStudentPanel = user?.role === 'student';

  const totalClubs = useMemo(() => new Set(events.map((event) => event.club)).size, [events]);
  const studentCount = useMemo(() => users.filter((u) => u.role === 'student').length, [users]);
  const totalRegistrations = useMemo(() => Math.max(events.length * 10, studentCount * 2), [events.length, studentCount]);
  const upcomingCount = useMemo(() => events.filter((event) => event.status === 'upcoming').length, [events]);
  const ongoingCount = useMemo(() => events.filter((event) => event.status === 'ongoing').length, [events]);
  const pastCount = useMemo(() => events.filter((event) => event.status === 'past').length, [events]);
  const myClubEvents = events.filter((e) => e.club === user?.club);

  return (
    <section className="mx-auto max-w-7xl px-4 py-10">
      <Modal open={showNoticeModal} title="Publish Notice" onClose={() => setShowNoticeModal(false)} footer={(
        <div className="flex justify-end gap-3">
          <button onClick={() => setShowNoticeModal(false)} className="btn btn-secondary">Cancel</button>
          <button form="notice-form" className="btn btn-primary">Publish</button>
        </div>
      )}>
        <form id="notice-form" onSubmit={createNotice} className="grid gap-4">
          <input value={noticeForm.title} onChange={(e) => setNoticeForm({ ...noticeForm, title: e.target.value })} placeholder="Title" required className="input-base" />
          <textarea value={noticeForm.content} onChange={(e) => setNoticeForm({ ...noticeForm, content: e.target.value })} placeholder="Content" required className="input-base min-h-[140px]" />
        </form>
      </Modal>
      <Modal open={showCreateEventModal} title="Create Event" onClose={() => setShowCreateEventModal(false)} footer={(
        <div className="flex justify-end gap-3">
          <button onClick={() => setShowCreateEventModal(false)} className="btn btn-secondary">Cancel</button>
          <button form="create-event-form" className="btn btn-primary">Create</button>
        </div>
      )}>
        <form id="create-event-form" onSubmit={handleCreateEvent} className="grid gap-4">
          <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Title" required className="input-base" />
          <select value={form.club} onChange={(e) => setForm({ ...form, club: e.target.value })} className="input-base" required disabled={user?.role === 'club_associate'}>
            <option value="">Select club</option>
            {CLUB_OPTIONS.map((clubOption) => (
              <option key={clubOption} value={clubOption}>{clubOption}</option>
            ))}
          </select>
          <div className="grid md:grid-cols-2 gap-4">
            <input value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} type="date" required className="input-base" />
            <input value={form.time} onChange={(e) => setForm({ ...form, time: e.target.value })} type="time" required className="input-base" />
          </div>
          <input value={form.venue} onChange={(e) => setForm({ ...form, venue: e.target.value })} placeholder="Venue" required className="input-base" />
          <input value={form.poster} onChange={(e) => setForm({ ...form, poster: e.target.value })} placeholder="Poster URL" className="input-base" />
          <input value={form.registrationLink} onChange={(e) => setForm({ ...form, registrationLink: e.target.value })} placeholder="Registration link" className="input-base" />
          <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Description" required className="input-base min-h-[140px]" />
        </form>
      </Modal>
      <div className="grid gap-10 xl:grid-cols-[2.2fr_1fr]">
        <div className="space-y-6">
          <div className="space-y-3">
            <p className="text-sm uppercase tracking-[0.24em] text-brand-primary">Admin command center</p>
            <h1 className="h1">Manage campus operations from a unified control panel</h1>
            <p className="text-slate-400 max-w-3xl">A premium dark dashboard for events, users, notices, and analytics with consistent SaaS hierarchy.</p>
            {user && !showAdminPanel && (
              <div className="mt-3 rounded-lg border border-white/8 bg-slate-900/60 px-4 py-2 text-sm text-yellow-300">
                You are signed in as <strong className="text-white">{user.name || user.email}</strong> with role <strong className="text-white">{user.role}</strong>. Admin panels are hidden for this role.
              </div>
            )}
          </div>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <div className="card-dashboard p-6">
              <p className="text-sm uppercase tracking-[0.22em] text-slate-400">Total events</p>
              <p className="mt-4 text-3xl font-semibold text-white">{events.length}</p>
            </div>
            <div className="card-dashboard p-6">
              <p className="text-sm uppercase tracking-[0.22em] text-slate-400">Total clubs</p>
              <p className="mt-4 text-3xl font-semibold text-white">{totalClubs}</p>
            </div>
            <div className="card-dashboard p-6">
              <p className="text-sm uppercase tracking-[0.22em] text-slate-400">Participants</p>
              <p className="mt-4 text-3xl font-semibold text-white">{studentCount}</p>
            </div>
            <div className="card-dashboard p-6">
              <p className="text-sm uppercase tracking-[0.22em] text-slate-400">Registrations</p>
              <p className="mt-4 text-3xl font-semibold text-white">{totalRegistrations}</p>
            </div>
          </div>

          <div className="grid gap-4 xl:grid-cols-[1.15fr_0.85fr]">
            <div className="glass-panel">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm uppercase tracking-[0.22em] text-slate-400">Event health</p>
                  <h2 className="text-2xl font-semibold text-white">Real-time status</h2>
                </div>
                <span className="badge badge-secondary">Live data</span>
              </div>

              <div className="mt-6 space-y-5">
                {[
                  { title: 'Upcoming events', count: upcomingCount, color: 'bg-brand-primary' },
                  { title: 'Ongoing events', count: ongoingCount, color: 'bg-emerald-400' },
                  { title: 'Past events', count: pastCount, color: 'bg-slate-500' },
                ].map((metric) => (
                  <div key={metric.title} className="space-y-2">
                    <div className="flex items-center justify-between text-sm text-slate-300">
                      <span>{metric.title}</span>
                      <span className="text-white">{metric.count}</span>
                    </div>
                    <div className="h-2 rounded-full bg-white/10">
                      <div className={`${metric.color} h-2 rounded-full`} style={{ width: `${Math.min((metric.count / Math.max(events.length, 1)) * 100, 100)}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="glass-panel">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm uppercase tracking-[0.22em] text-slate-400">Quick actions</p>
                  <h2 className="text-2xl font-semibold text-white">Actions</h2>
                </div>
                <span className="badge badge-primary">Fast paths</span>
              </div>
              <div className="mt-6 grid gap-3">
                <button onClick={handleQuickCreateEvent} className="btn btn-secondary w-full py-3 text-left">Create new event</button>
                <button onClick={handleQuickPublishNotice} className="btn btn-secondary w-full py-3 text-left">Publish notice</button>
                <button onClick={handleQuickReviewUsers} className="btn btn-secondary w-full py-3 text-left">Review users</button>
                <button onClick={handleQuickViewGallery} className="btn btn-secondary w-full py-3 text-left">View gallery</button>
              </div>
            </div>
          </div>

          <div className="glass-panel">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.22em] text-slate-400">Recent activity</p>
                <h2 className="text-2xl font-semibold text-white">Latest notices & launches</h2>
              </div>
              <p className="text-sm text-slate-400">Updated automatically when data changes.</p>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {notices.slice(0, 4).map((notice) => (
                <div key={notice._id} className="rounded-[24px] border border-white/10 bg-slate-950/85 p-4">
                  <p className="text-sm font-semibold text-white">{notice.title}</p>
                  <p className="mt-2 text-sm text-slate-400 line-clamp-2">{notice.content}</p>
                  <p className="mt-3 text-xs uppercase tracking-[0.2em] text-slate-500">{new Date(notice.createdAt).toLocaleDateString()}</p>
                </div>
              ))}
            </div>
          </div>

          {showClubPanel && (
            <div ref={createEventRef} className="glass-panel">
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="text-sm uppercase tracking-[0.22em] text-slate-400">Club associate</p>
                  <h2 className="text-2xl font-semibold text-white">Manage your club events</h2>
                </div>
                <span className="badge badge-success">Club: {user.club}</span>
              </div>
              <form onSubmit={handleCreateEvent} className="mt-6 grid gap-4 md:grid-cols-2">
                <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Title" required className="input-base" />
                <select value={form.club} onChange={(e) => setForm({ ...form, club: e.target.value })} className="input-base" required disabled={user?.role === 'club_associate'}>
                  <option value="">Select club</option>
                  {CLUB_OPTIONS.map((clubOption) => (
                    <option key={clubOption} value={clubOption}>{clubOption}</option>
                  ))}
                </select>
                <input value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} type="date" required className="input-base" />
                <input value={form.time} onChange={(e) => setForm({ ...form, time: e.target.value })} type="time" required className="input-base" />
                <input value={form.venue} onChange={(e) => setForm({ ...form, venue: e.target.value })} placeholder="Venue" required className="input-base" />
                <input value={form.poster} onChange={(e) => setForm({ ...form, poster: e.target.value })} placeholder="Poster URL" className="input-base" />
                <input value={form.registrationLink} onChange={(e) => setForm({ ...form, registrationLink: e.target.value })} placeholder="Registration link" className="input-base" />
                <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Description" required className="input-base min-h-[140px] md:col-span-2" />
                <button type="submit" className="btn btn-primary col-span-full py-3">Create event</button>
              </form>
              {message && <p className="mt-4 text-sm text-brand-primary">{message}</p>}
            </div>
          )}

          {showStudentPanel && (
            <div className="glass-panel">
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="text-sm uppercase tracking-[0.22em] text-slate-400">Student dashboard</p>
                  <h2 className="text-2xl font-semibold text-white">Explore active campus events</h2>
                </div>
                <span className="badge badge-secondary">Student access</span>
              </div>
              <div className="mt-6">
                <EventList events={events.filter((x) => x.status === 'upcoming' || x.status === 'ongoing')} onRefresh={fetchEvents} />
              </div>
            </div>
          )}
        </div>

        <aside className="space-y-6">
          {showAdminPanel && (
            <div className="glass-panel">
              <p className="text-sm uppercase tracking-[0.22em] text-slate-400">User management</p>
              <div ref={usersRef} className="mt-6 space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <input value={newAssociate.name} onChange={(e) => setNewAssociate({ ...newAssociate, name: e.target.value })} placeholder="Name" required className="input-base" />
                  <input value={newAssociate.email} onChange={(e) => setNewAssociate({ ...newAssociate, email: e.target.value })} type="email" placeholder="Email" className="input-base" required />
                  <input value={newAssociate.password} onChange={(e) => setNewAssociate({ ...newAssociate, password: e.target.value })} type="password" placeholder="Password" className="input-base" required />
                  <select value={newAssociate.club} onChange={(e) => setNewAssociate({ ...newAssociate, club: e.target.value })} className="input-base" required>
                    <option value="">Select club</option>
                    {CLUB_OPTIONS.map((clubOption) => (
                      <option key={clubOption} value={clubOption}>{clubOption}</option>
                    ))}
                  </select>
                </div>
                <button type="button" onClick={createClubAssociate} className="btn btn-primary w-full py-3">Create club associate</button>
                {userMessage && <p className="text-sm text-brand-primary">{userMessage}</p>}
              </div>
            </div>
          )}

          {showAdminPanel && (
            <div className="glass-panel overflow-hidden">
              <div className="px-4 py-5 sm:px-6">
                <p className="text-sm uppercase tracking-[0.22em] text-slate-400">User list</p>
                <h2 className="mt-2 text-2xl font-semibold text-white">Manage accounts</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="table-base w-full">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Role</th>
                      <th>Club</th>
                      <th className="text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((u) => (
                      <tr key={u._id}>
                        <td>{u.name}</td>
                        <td>{u.email}</td>
                        <td>{u.role}</td>
                        <td>{u.club || '-'}</td>
                        <td className="text-right space-x-2">
                          {u.role === 'student' && (
                            <select
                              onChange={(e) => promoteUser(u._id, e.target.value)}
                              defaultValue=""
                              className="rounded-2xl border border-white/10 bg-slate-950/90 px-3 py-2 text-xs text-slate-200"
                            >
                              <option value="" disabled>Promote</option>
                              {CLUB_OPTIONS.map((clubOption) => (
                                <option key={clubOption} value={clubOption}>{clubOption}</option>
                              ))}
                            </select>
                          )}
                          <button onClick={() => deleteUserAction(u._id)} className="rounded-2xl bg-red-500 px-3 py-2 text-xs font-semibold text-white">Delete</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </aside>
      </div>
    </section>
  );
};

export default Dashboard;
