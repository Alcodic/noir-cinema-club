const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const Film = require('./models/Film');
const films = require('./data/films');

const app = express();
const clientDist = path.join(__dirname, '../../client/dist');

const allowedOrigins = [
  process.env.CLIENT_URL,
  process.env.RENDER_EXTERNAL_URL,
  'http://localhost:5173',
  'http://127.0.0.1:5173',
].filter(Boolean);

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(null, false);
    },
  })
);
app.use(express.json());

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, club: 'Noir Cinema Club' });
});

app.use('/api/auth', require('./routes/auth'));
app.use('/api/films', require('./routes/films'));
app.use('/api/vault', require('./routes/vault'));
app.use('/api/nights', require('./routes/nights'));

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(clientDist));
  app.use((req, res, next) => {
    if (req.path.startsWith('/api')) return next();
    if (req.method !== 'GET' && req.method !== 'HEAD') return next();
    res.sendFile(path.join(clientDist, 'index.html'), (err) => {
      if (err) next(err);
    });
  });
}

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ message: 'Something went wrong backstage.' });
});

async function seedIfEmpty() {
  const count = await Film.countDocuments();
  if (count > 0) return;
  await Film.insertMany(films);
  console.log(`Seeded ${films.length} films into the vault.`);
}

async function start() {
  await connectDB();
  await seedIfEmpty();
  const port = process.env.PORT || 5001;
  app.listen(port, () => {
    console.log(`Noir Cinema Club API listening on ${port}`);
  });
}

start().catch((error) => {
  console.error(error);
  process.exit(1);
});
