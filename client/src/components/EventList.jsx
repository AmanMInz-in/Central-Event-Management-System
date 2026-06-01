import EventCard from './EventCard';

const EventList = ({ events, onRefresh }) => {
  if (!events.length) {
    return <p className="text-center text-slate-500">No events found.</p>;
  }

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      {events.map((event) => (
        <EventCard key={event._id} event={event} onRefresh={onRefresh} />
      ))}
    </div>
  );
};

export default EventList;
