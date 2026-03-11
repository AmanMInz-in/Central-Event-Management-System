import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import EventList from '../components/EventList';

const Dashboard = () => {
  const { user } = useAuth();
  const [events, setEvents] = useState([]);
  const [form, setForm] = useState({ title: '', description: '', club: user?.club || '', date: '', time: '', venue: '', poster: '', registrationLink: '' });
  const [message, setMessage] = useState('');

  const fetchEvents = async () => {
    try {
      const response = await api.get('/events');
      setEvents(response.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleCreateEvent = async (e) => {
    e.preventDefault();
    setMessage('');
    try {
      await api.post('/events', form);
      await fetchEvents();
      setMessage('Event created successfully');
      setForm({ ...form, title: '', description: '', date: '', time: '', venue: '', poster: '', registrationLink: '' });
    } catch (err) {
      setMessage(err.response?.data?.message || 'Failed to create event');
      console.error(err);
    }
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
      <p className="text-slate-600">Welcome back {user?.name} ({user?.role}).</p>

      {showAdminPanel && (
        <div className="mt-6 rounded-xl bg-white p-6 shadow">
          <h2 className="text-2xl font-semibold">Admin Control Center</h2>
          <p className="text-sm text-slate-500">Event management</p>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            {events.map((event) => (
              <div key={event._id} className="rounded-lg border p-3">
                <h3 className="font-semibold">{event.title}</h3>
                <p className="text-sm text-slate-500">{event.club} • {event.status}</p>
                <button onClick={() => handleDelete(event._id)} className="mt-2 rounded bg-red-500 px-3 py-1 text-white">Delete</button>
              </div>
            ))}
          </div>
        </div>
      )}

      {showClubPanel && (
        <div className="mt-6 rounded-xl bg-white p-6 shadow">
          <h2 className="text-2xl font-semibold">Club Associate Panel</h2>
          <p className="text-sm text-slate-500">Create and manage events for your club</p>

          <form onSubmit={handleCreateEvent} className="mt-4 grid gap-3 md:grid-cols-2">
            <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Title" required className="rounded border p-2" />
            <input value={form.club} onChange={(e) => setForm({ ...form, club: e.target.value })} placeholder="Club" required className="rounded border p-2" />
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
