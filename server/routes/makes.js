const express = require('express');
const db = require('../config/db');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT m.*, (SELECT COUNT(*) FROM listings l WHERE l.make_id = m.id AND l.status = 'active') AS listings_count
      FROM makes m
      ORDER BY m.name
    `);
    res.json(rows);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.get('/:slug/models', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT id, name, slug FROM models WHERE make_id = (SELECT id FROM makes WHERE slug = ?)
    `, [req.params.slug]);
    res.json(rows);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Public: all models (across all makes) in alphabetical order
router.get('/models/all', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT mo.id, mo.name, mo.slug, m.slug AS make_slug, m.name AS make_name
      FROM models mo
      JOIN makes m ON mo.make_id = m.id
      ORDER BY mo.name ASC
    `);
    res.json(rows);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

module.exports = router;
