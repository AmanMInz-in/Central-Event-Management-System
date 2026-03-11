const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const seedAdmin = require('./config/seedAdmin');

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json({ limit: '10mb' }));

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/events', require('./routes/eventRoutes'));
app.use('/api/gallery', require('./routes/galleryRoutes'));
app.use('/api/notices', require('./routes/noticeRoutes'));

app.get('/', (req, res) => {
  res.status(200).json({ message: 'Centralized College Event Management API is running' });
});

app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDB();
  await seedAdmin();
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
};

startServer();
