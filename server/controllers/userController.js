const bcrypt = require('bcryptjs');
const User = require('../models/User');

exports.getUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message || 'Server error' });
  }
};

exports.createClubAssociate = async (req, res) => {
  try {
    const { name, email, password, club } = req.body;

    if (!name || !email || !password || !club) {
      return res.status(400).json({ message: 'Name, email, password, and club are required' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already in use' });
    }

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashed, role: 'club_associate', club });

    res.status(201).json({ id: user._id, name: user.name, email: user.email, role: user.role, club: user.club });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message || 'Server error' });
  }
};

exports.promoteToClubAssociate = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const { club } = req.body;
    if (!club) {
      return res.status(400).json({ message: 'Club is required for club associate promotion' });
    }

    user.role = 'club_associate';
    user.club = club;
    await user.save();

    res.json({ message: 'User promoted to club associate', user: { id: user._id, role: user.role, club: user.club } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message || 'Server error' });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    await user.remove();
    res.json({ message: 'User deleted' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message || 'Server error' });
  }
};
