const Event = require('../models/Event');

const CLUB_OPTIONS = ['Cultural Club', 'Literary Club', 'Sports Club', 'NSS Club', 'CSE Association'];

const computeStatus = (dateString, timeString) => {
  const eventDate = new Date(`${dateString}T${timeString}`);
  const now = new Date();
  if (eventDate > now) return 'upcoming';
  if (eventDate.toDateString() === now.toDateString()) return 'ongoing';
  return 'past';
};

exports.getEvents = async (req, res) => {
  try {
    const query = {};

    if (req.query.club) query.club = req.query.club;
    if (req.query.status) query.status = req.query.status;

    const events = await Event.find(query).sort({ date: 1, time: 1 });
    res.json(events);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.createEvent = async (req, res) => {
  try {
    const { title, description, club, date, time, venue, poster, registrationLink } = req.body;

    if (!title || !description || !club || !date || !time || !venue) {
      return res.status(400).json({ message: 'Missing required event fields' });
    }

    if (!CLUB_OPTIONS.includes(club)) {
      return res.status(400).json({ message: 'Invalid club selection' });
    }

    const status = computeStatus(date, time);

    const newEvent = await Event.create({
      title,
      description,
      club,
      date,
      time,
      venue,
      poster: poster || '',
      registrationLink: registrationLink || '',
      status,
      createdBy: req.user._id,
    });

    res.status(201).json(newEvent);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: 'Event not found' });

    if (req.user.role === 'club_associate' && !event.createdBy.equals(req.user._id)) {
      return res.status(403).json({ message: 'Not allowed to modify this event' });
    }

    if (req.user.role === 'student') {
      return res.status(403).json({ message: 'Students cannot modify events' });
    }

    const updates = req.body;

    if (updates.club && !CLUB_OPTIONS.includes(updates.club)) {
      return res.status(400).json({ message: 'Invalid club selection' });
    }

    Object.assign(event, updates);
    if (updates.date || updates.time) {
      event.status = computeStatus(event.date, event.time);
    }

    await event.save();
    res.json(event);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.deleteEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: 'Event not found' });

    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Only admin can delete events' });
    }

    await event.remove();
    res.json({ message: 'Event deleted' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.uploadGalleryImage = async (req, res) => {
  try {
    const { eventId, poster, title, club } = req.body;

    if (!poster) {
      return res.status(400).json({ message: 'Poster image URL is required' });
    }

    if (eventId) {
      const event = await Event.findById(eventId);
      if (!event) return res.status(404).json({ message: 'Event not found' });

      if (req.user.role === 'club_associate' && event.club !== req.user.club) {
        return res.status(403).json({ message: 'Cannot upload gallery image for non-club event' });
      }

      event.poster = poster;
      event.status = 'past';
      await event.save();
      return res.json({ message: 'Gallery image updated', event });
    }

    if (!title || !club) {
      return res.status(400).json({ message: 'Title and club are required for new gallery entry' });
    }

    const galleryEvent = await Event.create({
      title,
      description: 'Gallery upload by ' + req.user.name,
      club,
      date: new Date().toISOString().slice(0, 10),
      time: '00:00',
      venue: 'Gallery',
      poster,
      registrationLink: '',
      status: 'past',
      createdBy: req.user._id,
    });

    res.status(201).json({ message: 'Gallery image created', galleryEvent });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getGallery = async (req, res) => {
  try {
    const events = await Event.find({ status: 'past', poster: { $ne: '' } }).select('poster title club');
    res.json(events);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};
