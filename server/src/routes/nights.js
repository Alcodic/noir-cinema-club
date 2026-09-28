const express = require('express');
const Night = require('../models/Night');
const Film = require('../models/Film');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router.get('/', async (req, res) => {
  const nights = await Night.find({ host: req.user._id })
    .populate('film')
    .sort({ scheduledAt: 1 });
  res.json({ nights });
});

router.post('/', async (req, res) => {
  const { title, scheduledAt, filmId, note } = req.body;
  if (!title || !scheduledAt || !filmId) {
    return res.status(400).json({ message: 'Title, date, and film are required.' });
  }

  const film = await Film.findById(filmId);
  if (!film) {
    return res.status(404).json({ message: 'Film not found.' });
  }

  const night = await Night.create({
    host: req.user._id,
    title,
    scheduledAt,
    film: film._id,
    note: note || '',
  });
  await night.populate('film');
  res.status(201).json({ night });
});

router.delete('/:id', async (req, res) => {
  const night = await Night.findOneAndDelete({ _id: req.params.id, host: req.user._id });
  if (!night) {
    return res.status(404).json({ message: 'Screening not found.' });
  }
  res.json({ ok: true });
});

module.exports = router;
