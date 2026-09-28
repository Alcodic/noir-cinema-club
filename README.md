# Noir Cinema Club

A dark-luxury MERN app: a private cinema salon. Browse a curated vault, save a personal list, and host movie nights.

This is a learning project built to look like a finished product — not a generic CRUD tutorial.

## What you are learning

| Piece | What it does here |
| --- | --- |
| **MongoDB** | Stores members, films, saved titles, and movie nights |
| **Express** | JSON API: auth, films, vault, nights |
| **React** | Pages, routing, and the gold-on-black UI |
| **Node** | Runs the API |

## Run it

You need **Node.js** and **MongoDB** running locally (you already have Mongo via Homebrew).

```bash
cd "~/Developer/Personal Work/noir-cinema-club"
npm install
npm run seed
npm run dev
```

- Site: http://localhost:5173
- API: http://localhost:5001/api/health

Create an account on **Request membership**, then save films and host a night.

## Project map

```
client/   React (Vite + Tailwind)
server/   Express + Mongoose
  src/data/films.js   curated catalog
  src/seed.js         loads films into Mongo
```

## Deploy (live on the internet)

Local MongoDB cannot be used in the cloud. You need a free **MongoDB Atlas** cluster, then one **Render** web service that serves both the API and the built React app.

1. Create a free cluster at [mongodb.com/atlas](https://www.mongodb.com/atlas) → Database Access (user + password) → Network Access (`0.0.0.0/0`) → Connect → Drivers → copy the `mongodb+srv://...` URI. Add the database name: `...mongodb.net/noir-cinema-club`.
2. Open Render’s blueprint for this repo: [Deploy to Render](https://render.com/deploy?repo=https://github.com/Alcodic/noir-cinema-club).
3. Paste `MONGO_URI` when Render asks. `JWT_SECRET` is generated for you.
4. After the first deploy, open the Render URL. The vault seeds itself if the database is empty.

## Mentor notes

- We store the login token in `localStorage`. That is simple for a first app. Production apps usually put tokens in **httpOnly cookies** so JavaScript cannot steal them.
- The poster images come from TMDB’s public image CDN. If a poster fails, the card still holds layout.
- The catalog is short on purpose. Taste reads as curation, not as “we imported 10,000 movies.”
