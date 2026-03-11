const EventCard = ({ event }) => {
  const { poster, title, club, date, venue, registrationLink, status } = event;

  return (
    <article className="group overflow-hidden rounded-xl border bg-white p-4 shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:scale-[1.01]">
      <img src={poster || 'https://via.placeholder.com/400x220?text=No+Poster'} alt={title} className="h-44 w-full object-cover rounded-lg transition-all duration-300 group-hover:scale-105" />
      <div className="mt-4">
        <p className="text-xs uppercase tracking-widest text-slate-500">{club}</p>
        <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
        <p className="text-sm text-slate-600">{date} · {venue}</p>
        <p className="mt-2 inline-block rounded-full px-2 py-1 text-xs font-semibold text-white" style={{ backgroundColor: status === 'upcoming' ? '#1D4ED8' : status === 'ongoing' ? '#059669' : '#6B7280' }}>
          {status}
        </p>
      </div>
      {registrationLink ? (
        <a href={registrationLink} target="_blank" rel="noreferrer" className="mt-4 inline-block w-full rounded-lg bg-brand-primary px-3 py-2 text-center text-sm text-white hover:bg-blue-600">Join Event</a>
      ) : (
        <button className="mt-4 inline-block w-full rounded-lg bg-slate-400 px-3 py-2 text-sm text-white cursor-not-allowed">Registration link unavailable</button>
      )}
    </article>
  );
};

export default EventCard;
