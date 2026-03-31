const express = require('express');
const db = require('../config/db');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT id, title, slug, excerpt, image_url, published_at, created_at
      FROM blog_posts
      WHERE published_at IS NOT NULL
      ORDER BY published_at DESC
      LIMIT 20
    `);
    res.json(rows);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.get('/:slug', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM blog_posts WHERE slug = ? AND published_at IS NOT NULL', [req.params.slug]);
    if (!rows.length) return res.status(404).json({ error: 'Post not found' });
    res.json(rows[0]);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

module.exports = router;
