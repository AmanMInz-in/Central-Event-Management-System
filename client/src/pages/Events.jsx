import { useEffect, useMemo, useState } from 'react';
import api from '../services/api';
import EventList from '../components/EventList';
import ClubFilter from '../components/ClubFilter';

const Events = () => {
  const [events, setEvents] = useState([]);
  const [selectedClub, setSelectedClub] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await api.get('/events');
        setEvents(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchEvents();
  }, []);

  const clubs = useMemo(() => [...new Set(events.map((e) => e.club).filter(Boolean))], [events]);
  const filtered = events.filter((event) => {
    if (selectedClub && event.club !== selectedClub) return false;
    if (statusFilter && event.status !== statusFilter) return false;
    return true;
  });

  return (
    <section>
      <h1 className="text-3xl font-bold">All Events</h1>
      <div className="mt-4 flex flex-wrap items-center gap-3">
        <ClubFilter clubs={clubs} selected={selectedClub} onSelect={setSelectedClub} />
        <select className="rounded-lg border px-3 py-2" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="">All statuses</option>
          <option value="upcoming">Upcoming</option>
          <option value="ongoing">Ongoing</option>
          <option value="past">Past</option>
        </select>
      </div>

      <div className="mt-6">
        <EventList events={filtered} />
      </div>
    </section>
  );
};

export default Events;
