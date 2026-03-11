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
    <section>
      <h1 className="text-3xl font-bold">Clubs</h1>
      <p className="mt-2 text-slate-600">Choose a club to view its upcoming events.</p>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {CLUB_OPTIONS.map((club) => (
          <div key={club} className="rounded-xl border bg-white p-5 shadow transition hover:-translate-y-1 hover:shadow-lg">
            <h2 className="text-xl font-semibold">{club}</h2>
            <p className="mt-2 text-sm text-slate-500">{clubDescriptions[club]}</p>
            <Link to={`/events?club=${encodeURIComponent(club)}`} className="mt-4 inline-block rounded-md bg-brand-primary px-4 py-2 text-sm text-white hover:bg-blue-600">
              View {club} Events
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Clubs;
