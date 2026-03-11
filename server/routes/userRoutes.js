const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');
const { getUsers, createClubAssociate, promoteToClubAssociate, deleteUser } = require('../controllers/userController');

router.use(authMiddleware, roleMiddleware(['admin']));

router.get('/', getUsers);
router.post('/club-associate', createClubAssociate);
router.put('/:id/promote', promoteToClubAssociate);
router.delete('/:id', deleteUser);

module.exports = router;
