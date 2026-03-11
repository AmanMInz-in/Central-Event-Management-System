const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const { getGallery } = require('../controllers/eventController');

router.get('/', authMiddleware, getGallery);

module.exports = router;
