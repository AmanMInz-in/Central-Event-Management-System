import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import EventList from '../components/EventList';
import { CLUB_OPTIONS } from '../data/clubs';

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
      setUserMessage('Club Associate created successfully');
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

  const handleCreateEvent = async (e) => {
    e.preventDefault();
    setMessage('');
    try {
      const payload = { ...form };
      if (user?.role === 'club_associate') {
        payload.club = user.club;
      }
      await api.post('/events', payload);
      await fetchEvents();
      setMessage('Event created successfully');
      setForm({ ...form, title: '', description: '', date: '', time: '', venue: '', poster: '', registrationLink: '' });
    } catch (err) {
      setMessage(err.response?.data?.message || 'Failed to create event');
      console.error(err);
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

  const myClubEvents = events.filter((e) => e.club === user?.club);

  return (
    <section>
      <h1 className="text-3xl font-bold">Dashboard</h1>
      <p className="text-slate-600">Welcome to admin dashboard.</p>

      {showAdminPanel && (
        <div className="mt-6 rounded-xl bg-white p-6 shadow">
          <h2 className="text-2xl font-semibold">Admin Control Center</h2>
          <p className="text-sm text-slate-500">Manage users and events</p>

          <div className="mt-6 grid gap-6 md:grid-cols-2">
            <div className="rounded-lg border p-4">
              <h3 className="text-lg font-semibold">Create Club Associate</h3>
              <form className="mt-3 space-y-3" onSubmit={createClubAssociate}>
                <input value={newAssociate.name} onChange={(e) => setNewAssociate({ ...newAssociate, name: e.target.value })} placeholder="Name" className="w-full rounded border p-2" required />
                <input value={newAssociate.email} onChange={(e) => setNewAssociate({ ...newAssociate, email: e.target.value })} type="email" placeholder="Email" className="w-full rounded border p-2" required />
                <input value={newAssociate.password} onChange={(e) => setNewAssociate({ ...newAssociate, password: e.target.value })} type="password" placeholder="Password" className="w-full rounded border p-2" required />
                <select value={newAssociate.club} onChange={(e) => setNewAssociate({ ...newAssociate, club: e.target.value })} className="w-full rounded border p-2" required>
                  <option value="">Select club</option>
                  {CLUB_OPTIONS.map((club) => <option key={club} value={club}>{club}</option>)}
                </select>
                <button type="submit" className="rounded bg-brand-secondary px-4 py-2 text-white">Create</button>
              </form>
            </div>

            <div className="rounded-lg border p-4">
              <h3 className="text-lg font-semibold">User List</h3>
              {userMessage && <p className="text-sm text-brand-primary">{userMessage}</p>}
              <div className="mt-3 max-h-96 overflow-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr>
                      <th className="p-2 text-left">Name</th>
                      <th className="p-2 text-left">Email</th>
                      <th className="p-2 text-left">Role</th>
                      <th className="p-2 text-left">Club</th>
                      <th className="p-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((u) => (
                      <tr key={u._id} className="border-t">
                        <td className="p-2">{u.name}</td>
                        <td className="p-2">{u.email}</td>
                        <td className="p-2">{u.role}</td>
                        <td className="p-2">{u.club || '-'}</td>
                        <td className="p-2 space-x-2">
                          {u.role === 'student' && (
                            <select
                              onChange={(e) => promoteUser(u._id, e.target.value)}
                              defaultValue=""
                              className="rounded border p-1 text-xs"
                            >
                              <option value="" disabled>Promote to...</option>
                              {CLUB_OPTIONS.map((clubValue) => (
                                <option key={clubValue} value={clubValue}>{clubValue}</option>
                              ))}
                            </select>
                          )}
                          <button onClick={() => deleteUserAction(u._id)} className="rounded bg-red-500 px-2 py-1 text-white">Delete</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <h3 className="text-xl font-semibold">Notices</h3>
            {user?.role === 'admin' && (
              <form onSubmit={createNotice} className="mt-4 space-y-3 rounded-lg border p-4">
                <input
                  value={noticeForm.title}
                  onChange={(e) => setNoticeForm({ ...noticeForm, title: e.target.value })}
                  placeholder="Notice title"
                  className="w-full rounded border p-2"
                  required
                />
                <textarea
                  value={noticeForm.content}
                  onChange={(e) => setNoticeForm({ ...noticeForm, content: e.target.value })}
                  placeholder="Notice content"
                  className="w-full rounded border p-2"
                  required
                />
                <button type="submit" className="rounded bg-brand-primary px-4 py-2 text-white">Publish Notice</button>
              </form>
            )}

            {message && <p className="mt-2 text-sm text-brand-primary">{message}</p>}

            <div className="mt-4 grid gap-3">
              {notices.map((notice) => (
                <div key={notice._id} className="rounded-lg border bg-white p-3 shadow-sm">
                  <h4 className="font-semibold">{notice.title}</h4>
                  <p className="text-sm text-slate-700">{notice.content}</p>
                  <p className="text-xs text-slate-500">By: {notice.createdBy?.name || 'Admin'} · {new Date(notice.createdAt).toLocaleString()}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6">
            <h3 className="text-xl font-semibold">Manage Events</h3>
            {message && <p className="text-sm text-brand-primary mt-2">{message}</p>}
            {editingEvent && (
              <form onSubmit={handleUpdateEvent} className="mt-4 rounded border p-4 bg-slate-50">
                <h4 className="font-semibold">Editing {editingEvent.title}</h4>
                <div className="grid gap-2 md:grid-cols-2">
                  <input className="rounded border p-2" value={editForm.title} onChange={(e) => setEditForm({ ...editForm, title: e.target.value })} required />
                  <select className="rounded border p-2" value={editForm.club} onChange={(e) => setEditForm({ ...editForm, club: e.target.value })} required>
                    <option value="">Select club</option>
                    {CLUB_OPTIONS.map((club) => <option key={club} value={club}>{club}</option>)}
                  </select>
                  <input className="rounded border p-2" type="date" value={editForm.date} onChange={(e) => setEditForm({ ...editForm, date: e.target.value })} required />
                  <input className="rounded border p-2" type="time" value={editForm.time} onChange={(e) => setEditForm({ ...editForm, time: e.target.value })} required />
                  <input className="rounded border p-2" value={editForm.venue} onChange={(e) => setEditForm({ ...editForm, venue: e.target.value })} placeholder="Venue" required />
                  <input className="rounded border p-2" value={editForm.poster} onChange={(e) => setEditForm({ ...editForm, poster: e.target.value })} placeholder="Poster URL" />
                  <input className="rounded border p-2" value={editForm.registrationLink} onChange={(e) => setEditForm({ ...editForm, registrationLink: e.target.value })} placeholder="Google Form link" />
                </div>
                <textarea className="mt-2 rounded border p-2 w-full" value={editForm.description} onChange={(e) => setEditForm({ ...editForm, description: e.target.value })} placeholder="Description" required />
                <div className="mt-2 flex gap-2">
                  <button type="submit" className="rounded bg-brand-secondary px-4 py-2 text-white">Update Event</button>
                  <button type="button" onClick={cancelEdit} className="rounded border px-4 py-2">Cancel</button>
                </div>
              </form>
            )}

            <div className="mt-4 grid gap-4 md:grid-cols-2">
              {events.map((event) => (
                <div key={event._id} className="rounded-lg border p-3">
                  <h3 className="font-semibold">{event.title}</h3>
                  <p className="text-sm text-slate-500">{event.club} • {event.status}</p>
                  <p className="text-sm">{event.date} @ {event.time}</p>
                  <p className="text-sm">{event.venue}</p>
                  <div className="mt-2 flex gap-2">
                    <button onClick={() => handleEdit(event)} className="rounded bg-blue-500 px-3 py-1 text-white">Edit</button>
                    <button onClick={() => handleDelete(event._id)} className="rounded bg-red-500 px-3 py-1 text-white">Delete</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {showClubPanel && (
        <div className="mt-6 rounded-xl bg-white p-6 shadow">
          <h2 className="text-2xl font-semibold">Club Associate Panel</h2>
          <p className="text-sm text-slate-500">Create and manage events for your club</p>

          <form onSubmit={handleCreateEvent} className="mt-4 grid gap-3 md:grid-cols-2">
            <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Title" required className="rounded border p-2" />
            <select
              value={form.club}
              onChange={(e) => setForm({ ...form, club: e.target.value })}
              className="rounded border p-2"
              required
              disabled={user?.role === 'club_associate'}
            >
              <option value="">Select club</option>
              {CLUB_OPTIONS.map((club) => (
                <option key={club} value={club}>{club}</option>
              ))}
            </select>
            {user?.role === 'club_associate' && (
              <p className="text-sm text-slate-500">Assigned club: {user.club}</p>
            )}
            <input value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} type="date" required className="rounded border p-2" />
            <input value={form.time} onChange={(e) => setForm({ ...form, time: e.target.value })} type="time" required className="rounded border p-2" />
            <input value={form.venue} onChange={(e) => setForm({ ...form, venue: e.target.value })} placeholder="Venue" required className="rounded border p-2" />
            <input value={form.poster} onChange={(e) => setForm({ ...form, poster: e.target.value })} placeholder="Poster URL" className="rounded border p-2" />
            <input value={form.registrationLink} onChange={(e) => setForm({ ...form, registrationLink: e.target.value })} placeholder="Google Form link" className="rounded border p-2" />
            <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Description" required className="col-span-full rounded border p-2" />
            <button type="submit" className="col-span-full rounded bg-brand-secondary py-2 text-white">Create Event</button>
          </form>
          {message && <p className="mt-2 text-sm text-brand-primary">{message}</p>}

          <div className="mt-6">
            <h3 className="text-lg font-semibold">Your Club Events</h3>
            <EventList events={myClubEvents} />
          </div>
        </div>
      )}

      {showStudentPanel && (
        <div className="mt-6 rounded-xl bg-white p-6 shadow">
          <h2 className="text-2xl font-semibold">Student Dashboard</h2>
          <p className="text-sm text-slate-500">Explore and join events via Google Form</p>
          <EventList events={events.filter((x) => x.status === 'upcoming' || x.status === 'ongoing')} />
        </div>
      )}
    </section>
  );
};

export default Dashboard;
