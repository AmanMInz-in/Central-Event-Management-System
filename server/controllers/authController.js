const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const createToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

exports.register = async (req, res) => {
  try {
    let { name, email, password, role, club } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required' });
    }

    if (role && (role === 'club_associate' || role === 'admin')) {
      return res.status(403).json({ message: 'Cannot assign admin or club associate during registration' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already in use' });
    }

    role = 'student';

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashed, role, club: club || '' });

    const token = createToken(user._id);

    res.status(201).json({
      user: { id: user._id, name: user.name, email: user.email, role: user.role, club: user.club },
      token,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message || 'Server error' });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = createToken(user._id);

    res.status(200).json({
      user: { id: user._id, name: user.name, email: user.email, role: user.role, club: user.club },
      token,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.seedAdmin = async (req, res) => {
  try {
    const existing = await User.findOne({ email: 'minj6998@gmail.com' });
    const hashedPassword = await bcrypt.hash('adminccet12', 10);

    if (existing) {
      existing.password = hashedPassword;
      existing.role = 'admin';
      existing.name = 'Default Admin';
      existing.club = '';
      await existing.save();
      return res.status(200).json({ message: 'Admin user reset with default credentials' });
    }

    await User.create({
      name: 'Default Admin',
      email: 'minj6998@gmail.com',
      password: hashedPassword,
      role: 'admin',
      club: '',
    });

    res.status(201).json({ message: 'Default admin user created' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};
