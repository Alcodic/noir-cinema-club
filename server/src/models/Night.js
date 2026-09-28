const mongoose = require('mongoose');

const nightSchema = new mongoose.Schema(
  {
    host: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true, trim: true },
    scheduledAt: { type: Date, required: true },
    film: { type: mongoose.Schema.Types.ObjectId, ref: 'Film', required: true },
    note: { type: String, default: '', trim: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Night', nightSchema);
