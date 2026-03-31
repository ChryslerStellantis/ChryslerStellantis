const express = require('express');
const db = require('../config/db');

const router = express.Router();

// Public: list allowed conditions
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT id, name FROM conditions ORDER BY id');
    res.json(rows);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

module.exports = router;

