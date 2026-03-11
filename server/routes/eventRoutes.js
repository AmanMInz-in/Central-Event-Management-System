const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');
const {
  getEvents,
  createEvent,
  updateEvent,
  deleteEvent,
} = require('../controllers/eventController');

router.get('/', authMiddleware, getEvents);
router.post('/', authMiddleware, roleMiddleware(['admin', 'club_associate']), createEvent);
router.put('/:id', authMiddleware, roleMiddleware(['admin', 'club_associate']), updateEvent);
router.delete('/:id', authMiddleware, roleMiddleware(['admin']), deleteEvent);

module.exports = router;
