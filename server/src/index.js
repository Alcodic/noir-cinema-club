const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const app = express();

app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173' }));
app.use(express.json());

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, club: 'Noir Cinema Club' });
});

app.use('/api/auth', require('./routes/auth'));
app.use('/api/films', require('./routes/films'));
app.use('/api/vault', require('./routes/vault'));
app.use('/api/nights', require('./routes/nights'));

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ message: 'Something went wrong backstage.' });
});

async function start() {
  await connectDB();
  const port = process.env.PORT || 5001;
  app.listen(port, () => {
    console.log(`Noir Cinema Club API listening on ${port}`);
  });
}

start().catch((error) => {
  console.error(error);
  process.exit(1);
});
