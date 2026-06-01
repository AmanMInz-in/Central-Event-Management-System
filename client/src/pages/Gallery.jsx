import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const Gallery = () => {
  const { user } = useAuth();
  const [gallery, setGallery] = useState([]);
  const [poster, setPoster] = useState('');
  const [title, setTitle] = useState('');
  const [club, setClub] = useState('');
  const [uploadMessage, setUploadMessage] = useState('');

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const res = await api.get('/gallery');
        setGallery(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchGallery();
  }, []);

  const handleUpload = async (e) => {
    e.preventDefault();
    setUploadMessage('');

    if (!poster || !title || !club) {
      setUploadMessage('Please fill poster URL, title, and club.');
      return;
    }

    try {
      await api.post('/gallery/upload', { poster, title, club });
      setUploadMessage('Gallery image uploaded.');
      setPoster('');
      setTitle('');
      setClub('');
      const res = await api.get('/gallery');
      setGallery(res.data);
    } catch (err) {
      const msg = err.response?.data?.message || 'Upload failed';
      setUploadMessage(msg);
      console.error(err);
    }
  };

  return (
    <section className="space-y-8">
      <div className="space-y-3">
        <p className="text-sm uppercase tracking-[0.24em] text-brand-primary">Gallery</p>
        <h1 className="h1">Browse event highlights and club moments</h1>
        <p className="text-slate-400 max-w-2xl">A curated collection of campaign images, posters, and campus highlights.</p>
      </div>

      {(user?.role === 'admin' || user?.role === 'club_associate') && (
        <div className="card p-6">
          <div className="space-y-3">
            <p className="text-sm uppercase tracking-[0.22em] text-slate-400">Upload media</p>
            <h3 className="text-xl font-semibold text-white">Add a new gallery poster</h3>
          </div>
          <form onSubmit={handleUpload} className="grid gap-4 md:grid-cols-2 mt-6">
            <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Event title" className="input-base" required />
            <input value={poster} onChange={(e) => setPoster(e.target.value)} placeholder="Poster image URL" className="input-base" required />
            <input value={club} onChange={(e) => setClub(e.target.value)} placeholder="Club name" className="input-base" required />
            <button type="submit" className="btn btn-primary px-6 py-3">Upload</button>
          </form>
          {uploadMessage && <p className="mt-3 text-sm text-brand-primary">{uploadMessage}</p>}
        </div>
      )}

      <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {gallery.map((item) => (
          <div key={item._id} className="overflow-hidden rounded-[28px] border border-white/10 bg-slate-950/90 shadow-[0_20px_60px_rgba(15,23,42,0.22)] transition-all duration-300 hover:shadow-[0_32px_90px_rgba(15,23,42,0.28)] hover:-translate-y-1 hover:scale-[1.01]">
            <img src={item.poster || 'https://via.placeholder.com/400x250?text=Event+Photo'} alt={item.title || 'Event poster'} className="h-56 w-full object-cover transition-all duration-300 hover:scale-105" />
            <div className="p-3">
              <h3 className="font-semibold text-white">{item.title}</h3>
              <p className="text-sm text-slate-400">{item.club}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Gallery;
