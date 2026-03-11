import { useEffect, useState } from 'react';
import api from '../services/api';
import EventList from '../components/EventList';

const groupBy = (events, state) => events.filter((e) => e.status === state);

const Home = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await api.get('/events');
        setEvents(res.data);
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
      <div className="rounded-3xl bg-gradient-to-r from-brand-primary via-indigo-600 to-brand-secondary px-6 py-16 text-white shadow-2xl">
        <h1 className="text-4xl font-bold">Centralized College Event Management</h1>
        <p className="mt-4 max-w-2xl text-lg">Discover events, join clubs, and participate in campus life from one modern platform.</p>
      </div>

      <div className="mt-10 space-y-10">
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
