const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true, trim: true },
  club: { type: String, required: true, trim: true },
  date: { type: String, required: true },
  time: { type: String, required: true },
  venue: { type: String, required: true, trim: true },
  poster: { type: String, default: '' },
  registrationLink: { type: String, default: '' },
  status: {
    type: String,
    enum: ['upcoming', 'ongoing', 'past'],
    default: 'upcoming',
  },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });

module.exports = mongoose.model('Event', eventSchema);
