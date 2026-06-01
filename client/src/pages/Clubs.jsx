import { CLUB_OPTIONS } from '../data/clubs';
import { Link } from 'react-router-dom';

const clubDescriptions = {
  'Cultural Club': 'Promotes cultural, music, dance, and performing arts events.',
  'Literary Club': 'Focuses on writing competitions, debates, and book discussions.',
  'Sports Club': 'Organizes student sports tournaments and exercise activities.',
  'NSS Club': 'Community service, social responsibility, and volunteer programs.',
  'CSE Association': 'Tech workshops, hackathons, and coding contests for CSE students.',
};

const Clubs = () => {
  return (
    <section className="space-y-8">
      <div className="space-y-3">
        <p className="text-sm uppercase tracking-[0.24em] text-brand-primary">Clubs</p>
        <h1 className="h1">Explore campus communities and club activities</h1>
        <p className="text-slate-400 max-w-2xl">Select a club to browse events, announcements, and member initiatives.</p>
      </div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {CLUB_OPTIONS.map((club) => (
          <div key={club} className="card p-6 transition hover:-translate-y-1 hover:shadow-[0_30px_90px_rgba(15,23,42,0.28)]">
            <h2 className="text-xl font-semibold text-white">{club}</h2>
            <p className="mt-3 text-sm text-slate-400">{clubDescriptions[club]}</p>
            <Link to={`/events?club=${encodeURIComponent(club)}`} className="mt-6 inline-flex rounded-full bg-brand-primary px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-primary/90">
              View {club} Events
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Clubs;
