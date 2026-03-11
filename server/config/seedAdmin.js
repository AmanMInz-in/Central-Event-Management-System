const bcrypt = require('bcryptjs');
const User = require('../models/User');

const seedAdmin = async () => {
  try {
    const existing = await User.findOne({ email: 'minj6998@gmail.com' });
    const hashedPassword = await bcrypt.hash('adminccet12', 10);

    if (existing) {
      existing.password = hashedPassword;
      existing.role = 'admin';
      existing.name = 'Default Admin';
      existing.club = '';
      await existing.save();
      console.log('Admin user reset to default credentials');
      return;
    }

    await User.create({
      name: 'Default Admin',
      email: 'minj6998@gmail.com',
      password: hashedPassword,
      role: 'admin',
      club: '',
    });
    console.log('Default admin user created');
  } catch (error) {
    console.error('Error seeding admin:', error?.message || error);
    throw error;
  }
};

module.exports = seedAdmin;
