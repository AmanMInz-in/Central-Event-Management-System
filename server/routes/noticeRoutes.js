const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');
const { getNotices, createNotice } = require('../controllers/noticeController');

router.get('/', getNotices);
router.post('/', authMiddleware, roleMiddleware(['admin']), createNotice);

module.exports = router;
