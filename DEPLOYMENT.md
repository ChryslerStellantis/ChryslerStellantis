# ChryslerStellantisCar Selling Platform – cPanel Deployment

This guide covers deploying the React frontend, Node.js API, and MySQL database on cPanel.

## Prerequisites

- cPanel hosting with **Node.js** support (e.g. "Setup Node.js App" in Software section)
- MySQL database created in cPanel
- Domain or subdomain for the app

## 1. Database setup

1. In cPanel, open **MySQL® Databases**.
2. Create a new database (e.g. `youruser_chrysler_stellantis` or `chrysler_stellantis`).
3. Create a MySQL user and assign it **All Privileges** on that database.
4. Note: **database name**, **username**, **password**, and **host** (usually `localhost`).

5. In **phpMyAdmin**, select the new database and run the contents of:
   - `server/database/schema.sql`
   (Copy-paste the full SQL and execute.)

6. Seed admin user and sample data (from your machine or via SSH):
   - Upload the project, then from the **server** folder run:
   ```bash
   cp .env.example .env
   # Edit .env with your DB_HOST, DB_USER, DB_PASSWORD, DB_NAME
   node scripts/seed.js
   ```
   - Default admin: **admin@chrysler-stellantis.org** / **admin123** (change after first login).

## 2. Backend (Node.js API) on cPanel

1. In cPanel, go to **Setup Node.js App** (or **Application Manager**).
2. Create a new application:
   - **Node.js version**: 18 or 20
   - **Application root**: e.g. `gat-api` (or the folder where you will put the backend)
   - **Application URL**: e.g. `api.yourdomain.com` or `yourdomain.com/api`
   - **Application startup file**: `index.js`

3. Upload the **server** folder contents into the application root:
   - All files from `server/` (e.g. `index.js`, `config/`, `routes/`, `middleware/`, `package.json`, etc.).

4. Create **`.env`** in the application root (same place as `index.js`):
   ```env
   PORT=5000
   NODE_ENV=production
   DB_HOST=localhost
   DB_USER=your_cpanel_db_user
   DB_PASSWORD=your_cpanel_db_password
   DB_NAME=your_cpanel_db_name
   JWT_SECRET=choose-a-long-random-secret
   JWT_EXPIRES_IN=7d
   ```

5. In the Node.js App interface, run:
   - **Run NPM Install** (so `node_modules` is created).
   - **Start** or **Restart** the application.

6. Create `uploads` folder in the application root if you use file uploads:
   ```bash
   mkdir uploads
   ```

7. Optional: if the app must run on a different port, set **PORT** in `.env` to the value cPanel expects (often shown in the Node.js App summary).

## 3. Frontend (React) build and static hosting

1. On your **local machine**, from the project root:
   ```bash
   cd client
   npm install
   npm run build
   ```
   This creates `client/dist/` with static files.

2. Point your API in production:
   - Either set **Vite proxy only for dev** and use **absolute API URL** in production, or
   - Build with the production API URL:
   - Create `client/.env.production`:
     ```env
     VITE_API_URL=https://api.yourdomain.com
     ```
   - In `client/src/api.js`, set:
     ```js
     const API_BASE = import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL + '/api' : '/api';
     ```
   - Rebuild: `npm run build`.

3. Upload the **contents** of `client/dist/` to the **document root** of your domain (e.g. `public_html/` or `yourdomain.com`’s root) via cPanel File Manager or FTP.
   - So that `index.html` is at the document root and assets (JS/CSS) are in the paths referenced by `index.html`.

4. Configure the domain so that all routes serve `index.html` (SPA):
   - If using **Apache**, add a `.htaccess` in the same document root:
   ```apache
   <IfModule mod_rewrite.c>
     RewriteEngine On
     RewriteBase /
     RewriteRule ^index\.html$ - [L]
     RewriteCond %{REQUEST_FILENAME} !-f
     RewriteCond %{REQUEST_FILENAME} !-d
     RewriteRule . /index.html [L]
   </IfModule>
   ```

## 4. Connect frontend to API

- If the React app is at `https://yourdomain.com` and the API at `https://api.yourdomain.com`:
  - Use `VITE_API_URL=https://api.yourdomain.com` and the `API_BASE` in `api.js` as above.
- If the API is under the same domain (e.g. `https://yourdomain.com/api`):
  - Configure your web server or cPanel to **proxy** `/api` to the Node.js app (port shown in Setup Node.js App).
  - Then you can keep `API_BASE = '/api'` and no `VITE_API_URL` needed.

## 5. Security checklist

- Use **HTTPS** (SSL) for the site and API.
- Set a strong **JWT_SECRET** in `.env`.
- Change the default admin password after first login.
- Do not commit `.env` or upload it to public repos.

## 6. Troubleshooting

- **502 Bad Gateway**: Node app not running or wrong port. Check cPanel Node.js App status and PORT in `.env`.
- **DB connection error**: Confirm DB name, user, password, and host in `.env` (often `localhost`).
- **CORS errors**: In `server/index.js`, ensure `cors({ origin: true })` or your frontend origin is allowed.
- **Routes 404 on refresh**: Ensure SPA rewrite rules (e.g. `.htaccess`) are in place so all requests fall back to `index.html`.

## Summary

| Component   | Location on server        | URL example                |
|-----------|----------------------------|----------------------------|
| React app | Document root (e.g. `public_html/`) | https://yourdomain.com     |
| Node API  | Node.js app root (e.g. `gat-api/`)   | https://api.yourdomain.com |
| MySQL     | cPanel MySQL database      | localhost                  |

After deployment, open the site, log in as admin, and change the default password.
