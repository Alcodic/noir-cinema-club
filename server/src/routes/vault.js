const express = require('express');
const User = require('../models/User');
const Film = require('../models/Film');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router.get('/', async (req, res) => {
  const user = await User.findById(req.user._id).populate('vault');
  res.json({ films: user.vault || [] });
});

router.post('/:filmId', async (req, res) => {
  const film = await Film.findById(req.params.filmId);
  if (!film) {
    return res.status(404).json({ message: 'Film not found.' });
  }

  const user = await User.findById(req.user._id);
  const exists = user.vault.some((id) => id.toString() === film._id.toString());
  if (exists) {
    user.vault = user.vault.filter((id) => id.toString() !== film._id.toString());
  } else {
    user.vault.push(film._id);
  }
  await user.save();
  await user.populate('vault');
  res.json({ films: user.vault, saved: !exists });
});

module.exports = router;
