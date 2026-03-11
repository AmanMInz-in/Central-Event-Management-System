import { useEffect, useState } from 'react';
import api from '../services/api';

const Gallery = () => {
  const [gallery, setGallery] = useState([]);

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

  return (
    <section>
      <h1 className="text-3xl font-bold">Event Gallery</h1>
      <p className="mt-2 text-slate-600">Browse images from past events.</p>

      <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {gallery.map((item) => (
          <div key={item._id} className="overflow-hidden rounded-xl border bg-white shadow-sm">
            <img src={item.poster || 'https://via.placeholder.com/400x250?text=Event+Photo'} alt={item.title || 'Event poster'} className="h-56 w-full object-cover" />
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
