# ChryslerStellantisCar Selling Platform

A full-stack car selling web application with React frontend, Node.js/Express API, MySQL database, and admin dashboard. Designed to match the ChryslerStellantisreference design and to be deployable on cPanel.

## Stack

- **Frontend**: React 18, Vite, React Router, React Icons
- **Backend**: Node.js, Express, MySQL2, JWT, bcryptjs, Multer (optional uploads)
- **Database**: MySQL (schema and seed in `server/database/`)

## Quick start

### 1. Database

Create a MySQL database and run the schema:

```bash
mysql -u user -p your_database < server/database/schema.sql
```

Then seed admin user and sample data (from project root):

```bash
cd server
cp .env.example .env
# Edit .env with your DB_HOST, DB_USER, DB_PASSWORD, DB_NAME
npm install
node scripts/seed.js
```

Default admin: **admin@chrysler-stellantis.org** / **admin123** (change after first login).

### 2. Backend

```bash
cd server
npm install
npm run dev
```

API runs at `http://localhost:5000`.

### 3. Frontend

```bash
cd client
npm install
npm run dev
```

App runs at `http://localhost:3000` and proxies `/api` to the backend.

## Project structure

```
ChryslerStellantis/
├── client/                 # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/     # Hero, Footer, CarCard, etc.
│   │   ├── pages/          # Home, Cars, SellCar, Blog, etc.
│   │   ├── admin/          # Admin dashboard (listings, users, blog, testimonials)
│   │   ├── api.js          # API client
│   │   └── App.jsx
│   └── package.json
├── server/                  # Express API
│   ├── config/db.js
│   ├── middleware/auth.js
│   ├── routes/              # auth, cars, makes, countries, blog, testimonials, newsletter, admin
│   ├── database/
│   │   └── schema.sql
│   ├── scripts/
│   │   └── seed.js
│   ├── index.js
│   └── package.json
├── DEPLOYMENT.md            # cPanel deployment guide
└── README.md
```

## Features

- **Public**: Homepage (hero, recently added, dream car banner, how it works, countries, inventory locations, popular brands, why choose us, testimonials, trending, recently sold, CTA, mobile app section, latest news), browse cars with filters, car detail, brands, sell car form, blog, contact
- **Auth**: Register, login, JWT
- **Admin** (role `admin`): Dashboard stats, manage listings (status, delete), users list, blog CRUD, testimonials CRUD

## Deployment on cPanel

See **[DEPLOYMENT.md](DEPLOYMENT.md)** for:

- MySQL setup and schema/seed
- Node.js app setup for the API
- Building and uploading the React app
- SPA rewrite and API URL configuration

## Environment

**Server (`.env`):**

- `PORT`, `NODE_ENV`
- `DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`
- `JWT_SECRET`, `JWT_EXPIRES_IN`
- Optional: `UPLOAD_PATH`

**Client (production):**

- Optional: `VITE_API_URL` (e.g. `https://api.yourdomain.com`) when API is on a different domain.

## License

MIT.
