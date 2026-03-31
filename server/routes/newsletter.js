const express = require('express');
const db = require('../config/db');

const router = express.Router();

router.post('/subscribe', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: 'Email required' });
    await db.query('INSERT IGNORE INTO newsletter (email) VALUES (?)', [email]);
    res.json({ message: 'Subscribed successfully' });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

module.exports = router;
