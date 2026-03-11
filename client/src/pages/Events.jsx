import { useEffect, useMemo, useState } from 'react';
import api from '../services/api';
import EventList from '../components/EventList';
import ClubFilter from '../components/ClubFilter';
import { CLUB_OPTIONS } from '../data/clubs';

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

  const clubs = CLUB_OPTIONS;
  // retains those with events and standard options
  const displayClubs = useMemo(() => clubs.filter((club) => club), [clubs]);
  const filtered = events.filter((event) => {
    if (selectedClub && event.club !== selectedClub) return false;
    if (statusFilter && event.status !== statusFilter) return false;
    return true;
  });

  return (
    <section>
      <h1 className="text-3xl font-bold">All Events</h1>
      <div className="mt-4 flex flex-wrap items-center gap-3">
        <ClubFilter clubs={displayClubs} selected={selectedClub} onSelect={setSelectedClub} />
        <select className="rounded-lg border px-3 py-2" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="">All statuses</option>
          <option value="upcoming">Upcoming</option>
          <option value="ongoing">Ongoing</option>
          <option value="past">Past</option>
        </select>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <EventList events={filtered} />
      </div>
    </section>
  );
};

export default Events;
