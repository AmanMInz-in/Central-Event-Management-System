import { useEffect, useState } from 'react';
import api from '../services/api';
import EventList from '../components/EventList';

const groupBy = (events, state) => events.filter((e) => e.status === state);

const Home = () => {
  const [events, setEvents] = useState([]);
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const [eventsRes, noticesRes] = await Promise.all([
          api.get('/events'),
          api.get('/notices'),
        ]);
        setEvents(eventsRes.data);
        setNotices(noticesRes.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  if (loading) return <p>Loading events...</p>;

  return (
    <section>
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-700 via-purple-700 to-pink-600 px-6 py-20 text-white shadow-2xl">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_10%_20%,rgba(255,255,255,0.2),transparent_35%),radial-gradient(circle_at_80%_80%,rgba(0,0,0,0.2),transparent_45%)]" />
        <div className="relative z-10 max-w-3xl">
          <h1 className="text-4xl font-bold sm:text-5xl">Welcome to Centralized College Event Management</h1>
          <p className="mt-4 text-lg sm:text-xl text-indigo-100">Browse club events, register instantly, and make every campus moment count.</p>
          <a href="/events" className="mt-6 inline-block rounded-full bg-white px-8 py-3 font-semibold text-indigo-700 shadow-lg transition hover:bg-indigo-50">Explore Events</a>
        </div>
      </div>

      <div className="mt-10 space-y-10">
        <div className="rounded-xl border bg-white p-5 shadow-sm">
          <h2 className="text-2xl font-semibold">Notices</h2>
          <div className="mt-3" id="notice-list">
            {notices.map((note) => (
              <div key={note._id} className="mb-3 rounded-lg border p-3 shadow-sm">
                <h3 className="font-semibold">{note.title}</h3>
                <p>{note.content}</p>
                <p className="text-xs text-slate-400">Posted by {note.createdBy?.name || 'Admin'} on {new Date(note.createdAt).toLocaleDateString()}</p>
              </div>
            ))}
            {notices.length === 0 && <p className="text-slate-500">No notices yet.</p>}
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-semibold">Upcoming Events</h2>
          <EventList events={groupBy(events, 'upcoming')} />
        </div>

        <div>
          <h2 className="text-2xl font-semibold">Ongoing Events</h2>
          <EventList events={groupBy(events, 'ongoing')} />
        </div>

        <div>
          <h2 className="text-2xl font-semibold">Past Events</h2>
          <EventList events={groupBy(events, 'past')} />
        </div>
      </div>
    </section>
  );
};

export default Home;
