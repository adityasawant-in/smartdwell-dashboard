const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Get all users
router.get('/users', async (req, res) => {
  try {
    const users = await User.find({});
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete('/users/:userId', async (req, res) => {
    try {
      await User.findOneAndDelete({ userId: req.params.userId });
      res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  
module.exports = router;