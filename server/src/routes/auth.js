const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { protect } = require('../middleware/auth');

const router = express.Router();

function signToken(userId) {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '7d' });
}

function publicUser(user) {
  return {
    id: user._id,
    name: user.name,
    email: user.email,
    membership: user.membership,
  };
}

router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required.' });
    }
    if (password.length < 8) {
      return res.status(400).json({ message: 'Password must be at least 8 characters.' });
    }

    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(409).json({ message: 'An account with that email already exists.' });
    }

    const user = await User.create({ name, email, password });
    res.status(201).json({ token: signToken(user._id), user: publicUser(user) });
  } catch (error) {
    res.status(500).json({ message: 'Could not create membership.', detail: error.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: 'Incorrect email or password.' });
    }
    res.json({ token: signToken(user._id), user: publicUser(user) });
  } catch (error) {
    res.status(500).json({ message: 'Could not sign in.', detail: error.message });
  }
});

router.get('/me', protect, (req, res) => {
  res.json({ user: publicUser(req.user) });
});

module.exports = router;
