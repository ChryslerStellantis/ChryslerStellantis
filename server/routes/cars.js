const express = require('express');
const db = require('../config/db');
const { auth } = require('../middleware/auth');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

const router = express.Router();

const uploadsDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

const storage = multer.diskStorage({
  destination: function (_req, _file, cb) {
    cb(null, uploadsDir);
  },
  filename: function (_req, file, cb) {
    const ext = path.extname(file.originalname) || '.jpg';
    const safeExt = ext.replace(/[^.\w]/g, '');
    const filename = `car_${Date.now()}_${Math.round(Math.random() * 1e9)}${safeExt}`;
    cb(null, filename);
  },
});

const upload = multer({ storage });

// Public: list cars with filters (make, model, year, price min/max)
router.get('/', async (req, res) => {
  try {
    const { make, model, year, minYear, maxYear, minPrice, maxPrice, conditionId, status, featured, limit = 20, offset = 0 } = req.query;
    let where = ' WHERE 1=1';
    const params = [];
    if (status) {
      where += ' AND l.status = ?';
      params.push(status);
    } else {
      // Treat "featured" as active for public browsing/sections.
      where += ' AND l.status IN (?, ?)';
      params.push('active', 'featured');
    }
    if (featured === '1') { where += ' AND l.is_featured = 1'; }
    if (make) { where += ' AND m.slug = ?'; params.push(make); }
    if (model) { where += ' AND mo.slug = ?'; params.push(model); }
    if (conditionId) { where += ' AND l.condition_id = ?'; params.push(Number(conditionId)); }
    if (year) { where += ' AND l.year = ?'; params.push(Number(year)); }
    if (minYear) { where += ' AND l.year >= ?'; params.push(Number(minYear)); }
    if (maxYear) { where += ' AND l.year <= ?'; params.push(Number(maxYear)); }
    if (minPrice) { where += ' AND l.price >= ?'; params.push(Number(minPrice)); }
    if (maxPrice) { where += ' AND l.price <= ?'; params.push(Number(maxPrice)); }

    const listSql = `SELECT l.*, m.name AS make_name, mo.name AS model_name, c.name AS condition_name FROM listings l JOIN makes m ON l.make_id = m.id JOIN models mo ON l.model_id = mo.id JOIN conditions c ON l.condition_id = c.id${where} ORDER BY l.created_at DESC LIMIT ? OFFSET ?`;
    const [rows] = await db.query(listSql, [...params, Number(limit), Number(offset)]);

    const countSql = `SELECT COUNT(*) AS total FROM listings l JOIN makes m ON l.make_id = m.id JOIN models mo ON l.model_id = mo.id JOIN conditions c ON l.condition_id = c.id${where}`;
    const [[countRow]] = await db.query(countSql, params);
    res.json({ listings: rows, total: countRow?.total || 0 });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Public: recently added (same as list but default limit 8)
router.get('/recent', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT l.*, m.name AS make_name, mo.name AS model_name, c.name AS condition_name
      FROM listings l
      JOIN makes m ON l.make_id = m.id
      JOIN models mo ON l.model_id = mo.id
      JOIN conditions c ON l.condition_id = c.id
      WHERE l.status IN ('active','featured')
      ORDER BY l.created_at DESC
      LIMIT 8
    `);
    res.json(rows);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Public: trending (by view_count or recent)
router.get('/trending', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT l.*, m.name AS make_name, mo.name AS model_name, c.name AS condition_name
      FROM listings l
      JOIN makes m ON l.make_id = m.id
      JOIN models mo ON l.model_id = mo.id
      JOIN conditions c ON l.condition_id = c.id
      WHERE l.status IN ('active','featured')
      ORDER BY l.created_at DESC, l.view_count DESC
      LIMIT 10
    `);
    res.json(rows);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Public: recently sold
router.get('/sold', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT l.*, m.name AS make_name, mo.name AS model_name, c.name AS condition_name
      FROM listings l
      JOIN makes m ON l.make_id = m.id
      JOIN models mo ON l.model_id = mo.id
      JOIN conditions c ON l.condition_id = c.id
      WHERE l.status = 'sold'
      ORDER BY l.created_at DESC, l.sold_at DESC
      LIMIT 12
    `);
    res.json(rows);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Public: single listing
router.get('/:id', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT l.*, m.name AS make_name, mo.name AS model_name, c.name AS condition_name
      FROM listings l
      JOIN makes m ON l.make_id = m.id
      JOIN models mo ON l.model_id = mo.id
      JOIN conditions c ON l.condition_id = c.id
      WHERE l.id = ?
    `, [req.params.id]);
    if (!rows.length) return res.status(404).json({ error: 'Listing not found' });
    await db.query('UPDATE listings SET view_count = view_count + 1 WHERE id = ?', [req.params.id]);
    res.json(rows[0]);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Protected: create listing
router.post('/', auth, upload.single('image'), async (req, res) => {
  try {
    const {
      make_id, model_id, condition_id, year, price, mileage_km, transmission, fuel_type,
      location_city, location_country, description, image_url, images_json
    } = req.body;
    if (!make_id || !model_id || !year || !price || !transmission || !fuel_type) {
      return res.status(400).json({ error: 'Required: make_id, model_id, year, price, transmission, fuel_type' });
    }
    if (!condition_id) {
      return res.status(400).json({ error: 'Required: condition_id' });
    }
    const finalImageUrl = req.file ? `/uploads/${req.file.filename}` : (image_url || null);
    const [r] = await db.query(`
      INSERT INTO listings (user_id, make_id, model_id, condition_id, year, price, mileage_km, transmission, fuel_type, location_city, location_country, description, image_url, images_json)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      req.user.id,
      make_id,
      model_id,
      condition_id,
      year,
      price,
      mileage_km || null,
      transmission,
      fuel_type,
      location_city || null,
      location_country || null,
      description || null,
      finalImageUrl,
      images_json ? JSON.stringify(images_json) : null,
    ]);
    res.status(201).json({ id: r.insertId, message: 'Listing created' });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

module.exports = router;
