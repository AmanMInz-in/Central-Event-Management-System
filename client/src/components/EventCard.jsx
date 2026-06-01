const statusStyles = {
  upcoming: 'bg-brand-primary/10 text-brand-primary',
  ongoing: 'bg-emerald-500/10 text-emerald-300',
  past: 'bg-slate-500/10 text-slate-300',
};

import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import Modal from './Modal';

const EventCard = ({ event, onRefresh }) => {
  const { poster, title, club, date, venue, registrationLink, status, _id } = event;
  const statusClass = statusStyles[status] || 'bg-slate-500/10 text-slate-300';
  const { user } = useAuth();
  const [showEdit, setShowEdit] = useState(false);
  const [editForm, setEditForm] = useState({ title, description: event.description || '', club, date, time: event.time || '', venue, poster: poster || '', registrationLink: registrationLink || '' });

  useEffect(() => {
    setEditForm({ title, description: event.description || '', club, date, time: event.time || '', venue, poster: poster || '', registrationLink: registrationLink || '' });
  }, [event]);

  const canManage = user?.role === 'admin' || (user?.role === 'club_associate' && user.club === club);

  const handleDelete = async () => {
    if (!confirm('Delete this event permanently?')) return;
    try {
      await api.delete(`/events/${_id}`);
      if (typeof onRefresh === 'function') onRefresh();
      else window.location.reload();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Delete failed');
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/events/${_id}`, editForm);
      setShowEdit(false);
      if (typeof onRefresh === 'function') onRefresh();
      else window.location.reload();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Update failed');
    }
  };

  return (
    <>
      <article className="group card overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_30px_80px_rgba(15,23,42,0.24)]">
        <img
          src={poster || 'https://via.placeholder.com/400x220?text=No+Poster'}
          alt={title}
          className="h-44 w-full object-cover transition duration-500 group-hover:scale-105"
        />
        <div className="p-5 space-y-4">
          <div className="flex items-center justify-between gap-4">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-400">{club}</p>
            <span className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] ${statusClass}`}>{status}</span>
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-white">{title}</h3>
            <p className="text-sm text-slate-400">{date} · {venue}</p>
          </div>
          <div className="flex flex-col gap-3">
            {registrationLink ? (
              <a
                href={registrationLink}
                target="_blank"
                rel="noreferrer"
                className="btn btn-primary w-full py-3 text-sm"
              >
                Join Event
              </a>
            ) : (
              <button className="btn w-full bg-slate-700 text-slate-200 py-3 text-sm cursor-not-allowed" disabled>
                Registration link unavailable
              </button>
            )}

            {canManage && (
              <div className="flex gap-3">
                <button onClick={() => setShowEdit(true)} className="btn btn-secondary w-full py-2">Edit</button>
                <button onClick={handleDelete} className="btn bg-red-500 text-white w-full py-2">Delete</button>
              </div>
            )}
          </div>
        </div>
      </article>

      <Modal open={showEdit} title="Edit Event" onClose={() => setShowEdit(false)} footer={(
        <div className="flex justify-end gap-3">
          <button onClick={() => setShowEdit(false)} className="btn btn-secondary">Cancel</button>
          <button form={`edit-event-${_id}`} className="btn btn-primary">Save</button>
        </div>
      )}>
        <form id={`edit-event-${_id}`} onSubmit={handleUpdate} className="grid gap-3">
          <input value={editForm.title} onChange={(e) => setEditForm({ ...editForm, title: e.target.value })} className="input-base" required />
          <select value={editForm.club} onChange={(e) => setEditForm({ ...editForm, club: e.target.value })} className="input-base" required>
            <option value="">Select club</option>
            <option value={club}>{club}</option>
          </select>
          <div className="grid md:grid-cols-2 gap-3">
            <input value={editForm.date} onChange={(e) => setEditForm({ ...editForm, date: e.target.value })} type="date" className="input-base" required />
            <input value={editForm.time} onChange={(e) => setEditForm({ ...editForm, time: e.target.value })} type="time" className="input-base" required />
          </div>
          <input value={editForm.venue} onChange={(e) => setEditForm({ ...editForm, venue: e.target.value })} className="input-base" required />
          <input value={editForm.poster} onChange={(e) => setEditForm({ ...editForm, poster: e.target.value })} className="input-base" />
          <input value={editForm.registrationLink} onChange={(e) => setEditForm({ ...editForm, registrationLink: e.target.value })} className="input-base" />
          <textarea value={editForm.description} onChange={(e) => setEditForm({ ...editForm, description: e.target.value })} className="input-base min-h-[120px]" />
        </form>
      </Modal>
    </>
  );
};

export default EventCard;
