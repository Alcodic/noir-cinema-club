const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const connectDB = require('./config/db');
const Film = require('./models/Film');
const films = require('./data/films');

async function seed() {
  await connectDB();
  await Film.deleteMany({});
  await Film.insertMany(films);
  console.log(`Seeded ${films.length} films into the vault.`);
  process.exit(0);
}

seed().catch((error) => {
  console.error(error);
  process.exit(1);
});
