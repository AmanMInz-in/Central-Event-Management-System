const Notice = require('../models/Notice');

exports.getNotices = async (req, res) => {
  try {
    const notices = await Notice.find().sort({ createdAt: -1 }).populate('createdBy', 'name email role');
    res.json(notices);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.createNotice = async (req, res) => {
  try {
    const { title, content } = req.body;
    if (!title || !content) {
      return res.status(400).json({ message: 'Title and content are required' });
    }

    const notice = await Notice.create({
      title,
      content,
      createdBy: req.user._id,
    });

    res.status(201).json(notice);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};
