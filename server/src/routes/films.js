const express = require('express');
const Film = require('../models/Film');

const router = express.Router();

router.get('/', async (req, res) => {
  const { collection: collectionName, q } = req.query;
  const filter = {};
  if (collectionName && collectionName !== 'all') {
    filter.collectionName = collectionName;
  }
  if (q) {
    filter.$or = [
      { title: new RegExp(q, 'i') },
      { director: new RegExp(q, 'i') },
      { genres: new RegExp(q, 'i') },
    ];
  }

  const films = await Film.find(filter).sort({ year: 1 });
  const featured = await Film.findOne({ featured: true }) || films[0];
  const collections = await Film.distinct('collectionName');

  res.json({ films, featured, collections });
});

router.get('/:slug', async (req, res) => {
  const film = await Film.findOne({ slug: req.params.slug });
  if (!film) {
    return res.status(404).json({ message: 'This title is not in the club vault.' });
  }
  const related = await Film.find({
    collectionName: film.collectionName,
    _id: { $ne: film._id },
  }).limit(6);
  res.json({ film, related });
});

module.exports = router;
