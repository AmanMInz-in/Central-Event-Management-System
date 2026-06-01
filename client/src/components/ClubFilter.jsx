const ClubFilter = ({ clubs, selected, onSelect }) => {
  return (
    <div className="flex flex-wrap gap-2">
      <button
        type="button"
        onClick={() => onSelect('')}
        className={`pill ${selected === '' ? 'bg-brand-primary text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}`}
      >
        All Clubs
      </button>
      {clubs.map((club) => (
        <button
          key={club}
          type="button"
          onClick={() => onSelect(club)}
          className={`pill ${selected === club ? 'bg-brand-primary text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}`}
        >
          {club}
        </button>
      ))}
    </div>
  );
};

export default ClubFilter;
