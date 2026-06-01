import { useEffect, useMemo, useState } from 'react';
import api from '../services/api';
import EventList from '../components/EventList';
import ClubFilter from '../components/ClubFilter';
import { CLUB_OPTIONS } from '../data/clubs';

const statusOptions = [
  { value: '', label: 'Any status' },
  { value: 'upcoming', label: 'Upcoming' },
  { value: 'ongoing', label: 'Ongoing' },
  { value: 'past', label: 'Past' },
];

const Events = () => {
  const [events, setEvents] = useState([]);
  const [selectedClub, setSelectedClub] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

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
  const displayClubs = useMemo(() => clubs.filter((club) => club), [clubs]);

  const filtered = useMemo(() => {
    const fromDate = dateFrom ? new Date(dateFrom) : null;
    const toDate = dateTo ? new Date(dateTo) : null;

    return events.filter((event) => {
      const eventTitle = event.title?.toLowerCase() || '';
      const eventClub = event.club?.toLowerCase() || '';
      const query = searchQuery.toLowerCase();
      const matchesSearch = !query || eventTitle.includes(query) || eventClub.includes(query) || event.venue?.toLowerCase().includes(query);
      const matchesClub = !selectedClub || event.club === selectedClub;
      const matchesStatus = !statusFilter || event.status === statusFilter;
      const eventDate = event.date ? new Date(event.date) : null;
      const matchesFrom = !fromDate || (eventDate && eventDate >= fromDate);
      const matchesTo = !toDate || (eventDate && eventDate <= toDate);
      return matchesSearch && matchesClub && matchesStatus && matchesFrom && matchesTo;
    });
  }, [dateFrom, dateTo, events, searchQuery, selectedClub, statusFilter]);

  const totalCount = events.length;
  const resultCount = filtered.length;
  const countsByStatus = {
    upcoming: events.filter((event) => event.status === 'upcoming').length,
    ongoing: events.filter((event) => event.status === 'ongoing').length,
    past: events.filter((event) => event.status === 'past').length,
  };

  return (
    <section className="mx-auto max-w-7xl px-4 py-10">
      <div className="mb-8 grid gap-6 xl:grid-cols-[1.5fr_0.8fr]">
        <div className="space-y-4">
          <p className="text-sm uppercase tracking-[0.24em] text-brand-primary">Event discovery</p>
          <h1 className="h1 max-w-3xl">Find your next campus experience in seconds</h1>
          <p className="text-slate-400 max-w-2xl">Search across clubs, event types, and dates with a premium filter panel built for event operations.</p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="card-dashboard p-6">
            <p className="text-sm uppercase tracking-[0.22em] text-slate-400">Total events</p>
            <p className="mt-4 text-3xl font-semibold text-white">{totalCount}</p>
          </div>
          <div className="card-dashboard p-6">
            <p className="text-sm uppercase tracking-[0.22em] text-slate-400">Results</p>
            <p className="mt-4 text-3xl font-semibold text-white">{resultCount}</p>
          </div>
        </div>
      </div>

      <div className="glass-panel mb-8 grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-5">
          <div>
            <label className="mb-3 block text-sm font-semibold text-slate-300">Search events, clubs, or venues</label>
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search keywords..."
              className="input-base"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-3 block text-sm font-semibold text-slate-300">Category</label>
              <div className="rounded-3xl border border-white/10 bg-slate-950/95 p-4">
                <ClubFilter clubs={displayClubs} selected={selectedClub} onSelect={setSelectedClub} />
              </div>
            </div>
            <div>
              <label className="mb-3 block text-sm font-semibold text-slate-300">Status</label>
              <div className="flex flex-wrap gap-2">
                {statusOptions.slice(1).map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setStatusFilter(option.value)}
                    className={`pill ${statusFilter === option.value ? 'bg-brand-primary text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-5">
          <div>
            <label className="mb-3 block text-sm font-semibold text-slate-300">Date range</label>
            <div className="grid gap-4 sm:grid-cols-2">
              <input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} className="input-base" />
              <input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} className="input-base" />
            </div>
          </div>

          <div className="rounded-[28px] border border-white/10 bg-slate-950/95 p-5">
            <p className="text-sm uppercase tracking-[0.22em] text-slate-400">Status overview</p>
            <div className="mt-5 space-y-4">
              {Object.entries(countsByStatus).map(([status, count]) => (
                <div key={status} className="space-y-2">
                  <div className="flex items-center justify-between text-sm text-slate-300">
                    <span>{status.charAt(0).toUpperCase() + status.slice(1)}</span>
                    <span className="text-white">{count}</span>
                  </div>
                  <div className="h-2 rounded-full bg-white/10">
                    <div
                      className={`h-2 rounded-full ${status === 'upcoming' ? 'bg-brand-primary' : status === 'ongoing' ? 'bg-emerald-400' : 'bg-slate-500'}`}
                      style={{ width: `${Math.min((count / Math.max(totalCount, 1)) * 100, 100)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-6">
        <EventList events={filtered} />
      </div>
    </section>
  );
};

export default Events;
