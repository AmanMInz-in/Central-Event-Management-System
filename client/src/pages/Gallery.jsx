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
    <section>
      <h1 className="text-3xl font-bold">Event Gallery</h1>
      <p className="mt-2 text-slate-600">Browse images from past events.</p>

      {(user?.role === 'admin' || user?.role === 'club_associate') && (
        <div className="mt-5 rounded-lg border bg-white p-4 shadow-sm">
          <h3 className="text-xl font-semibold">Upload Gallery Image</h3>
          <form onSubmit={handleUpload} className="grid gap-2 md:grid-cols-2 mt-3">
            <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Event title" className="rounded border p-2" required />
            <input value={poster} onChange={(e) => setPoster(e.target.value)} placeholder="Poster image URL" className="rounded border p-2" required />
            <input value={club} onChange={(e) => setClub(e.target.value)} placeholder="Club name" className="rounded border p-2" required />
            <button type="submit" className="rounded bg-brand-primary px-4 py-2 text-white">Upload</button>
          </form>
          {uploadMessage && <p className="mt-2 text-sm text-brand-primary">{uploadMessage}</p>}
        </div>
      )}

      <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {gallery.map((item) => (
          <div key={item._id} className="overflow-hidden rounded-xl border bg-white shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:scale-[1.01]">
            <img src={item.poster || 'https://via.placeholder.com/400x250?text=Event+Photo'} alt={item.title || 'Event poster'} className="h-56 w-full object-cover transition-all duration-300 hover:scale-105" />
            <div className="p-3">
              <h3 className="font-semibold">{item.title}</h3>
              <p className="text-sm text-slate-500">{item.club}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Gallery;
