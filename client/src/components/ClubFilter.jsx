const ClubFilter = ({ clubs, selected, onSelect }) => {
  return (
    <div className="flex flex-wrap gap-2">
      <button onClick={() => onSelect('')} className={`rounded-full px-4 py-2 text-sm ${selected === '' ? 'bg-brand-primary text-white' : 'bg-slate-200 text-slate-700'}`}>
        All Clubs
      </button>
      {clubs.map((club) => (
        <button key={club} onClick={() => onSelect(club)} className={`rounded-full px-4 py-2 text-sm ${selected === club ? 'bg-brand-primary text-white' : 'bg-slate-200 text-slate-700'}`}>
          {club}
        </button>
      ))}
    </div>
  );
};

export default ClubFilter;
