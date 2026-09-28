const mongoose = require('mongoose');

const filmSchema = new mongoose.Schema({
  slug: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  year: { type: Number, required: true },
  director: { type: String, required: true },
  runtime: { type: Number, required: true },
  genres: [{ type: String }],
  collectionName: { type: String, required: true },
  logline: { type: String, required: true },
  synopsis: { type: String, required: true },
  poster: { type: String, required: true },
  backdrop: { type: String, required: true },
  rating: { type: Number, required: true },
  featured: { type: Boolean, default: false },
});

module.exports = mongoose.model('Film', filmSchema);
