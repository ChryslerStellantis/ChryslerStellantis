const express = require('express');
const db = require('../config/db');
const { auth, adminOnly } = require('../middleware/auth');
const fs = require('fs');
const path = require('path');
const multer = require('multer');

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

const router = express.Router();
router.use(auth);
router.use(adminOnly);

// Dashboard stats
router.get('/stats', async (req, res) => {
  try {
    const [[users]] = await db.query('SELECT COUNT(*) AS count FROM users');
    const [[listings]] = await db.query('SELECT COUNT(*) AS count FROM listings');
    const [[sold]] = await db.query("SELECT COUNT(*) AS count FROM listings WHERE status = 'sold'");
    const [[blog]] = await db.query('SELECT COUNT(*) AS count FROM blog_posts');
    const [[brands]] = await db.query('SELECT COUNT(*) AS count FROM makes');
    const [[testimonials]] = await db.query('SELECT COUNT(*) AS count FROM testimonials');
    res.json({
      users: users.count,
      listings: listings.count,
      sold: sold.count,
      blogPosts: blog.count,
      brands: brands.count,
      testimonials: testimonials.count,
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Listings CRUD
router.get('/listings', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT l.*, m.name AS make_name, mo.name AS model_name, c.name AS condition_name
      FROM listings l
      JOIN makes m ON l.make_id = m.id
      JOIN models mo ON l.model_id = mo.id
      JOIN conditions c ON l.condition_id = c.id
      ORDER BY l.created_at DESC
    `);
    res.json(rows);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.put('/listings/:id', async (req, res) => {
  try {
    const { status, is_featured, condition_id, price, year, mileage_km, transmission, fuel_type, location_city, location_country, description, image_url } = req.body;
    const updates = [];
    const values = [];

    const hasStatus = status !== undefined;
    const hasIsFeatured = is_featured !== undefined;
    const wantsImageUpdate = image_url !== undefined;

    const extractFilename = (maybeUrl) => {
      if (!maybeUrl) return null;
      const s = String(maybeUrl);
      const match = s.match(/\/uploads\/(.+)$/);
      if (match?.[1]) return match[1];
      // Fallback: if someone passes just a filename
      const parts = s.split('/');
      return parts[parts.length - 1] || null;
    };

    let oldImageFilename = null;
    let newImageFilename = null;
    if (wantsImageUpdate) {
      const [currentRows] = await db.query('SELECT image_url FROM listings WHERE id = ?', [req.params.id]);
      if (currentRows?.length) {
        oldImageFilename = extractFilename(currentRows[0].image_url);
      }
      newImageFilename = extractFilename(image_url);
    }

    // New rule: featured is a separate flag (listings.is_featured),
    // and it can only be enabled when status is active.
    let derivedStatus = status;
    let derivedIsFeatured = is_featured;

    // Backward compatibility: if an admin still sends status="featured",
    // interpret it as active.
    if (hasStatus && derivedStatus === 'featured') {
      derivedStatus = 'active';
      if (!hasIsFeatured) derivedIsFeatured = 1;
    }

    // If status is not active, featured must be off.
    if (hasStatus && derivedStatus !== 'active') {
      derivedIsFeatured = 0;
    }

    // If featured is being toggled without status, enforce the rule
    // by checking current DB status.
    if (!hasStatus && hasIsFeatured && derivedIsFeatured) {
      const [currentRows] = await db.query('SELECT status FROM listings WHERE id = ?', [req.params.id]);
      if (!currentRows.length) return res.status(404).json({ error: 'Listing not found' });
      const currentStatus = currentRows[0].status;
      const isAllowed = currentStatus === 'active' || currentStatus === 'featured'; // legacy treat as active
      if (!isAllowed) derivedIsFeatured = 0;
    }

    if (derivedStatus !== undefined) {
      updates.push('status = ?');
      values.push(derivedStatus);
    }
    if (derivedIsFeatured !== undefined) {
      updates.push('is_featured = ?');
      values.push(derivedIsFeatured ? 1 : 0);
    }
    if (condition_id !== undefined) { updates.push('condition_id = ?'); values.push(condition_id); }
    if (price !== undefined) { updates.push('price = ?'); values.push(price); }
    if (year !== undefined) { updates.push('year = ?'); values.push(year); }
    if (mileage_km !== undefined) { updates.push('mileage_km = ?'); values.push(mileage_km); }
    if (transmission !== undefined) { updates.push('transmission = ?'); values.push(transmission); }
    if (fuel_type !== undefined) { updates.push('fuel_type = ?'); values.push(fuel_type); }
    if (location_city !== undefined) { updates.push('location_city = ?'); values.push(location_city); }
    if (location_country !== undefined) { updates.push('location_country = ?'); values.push(location_country); }
    if (description !== undefined) { updates.push('description = ?'); values.push(description); }
    if (image_url !== undefined) { updates.push('image_url = ?'); values.push(image_url); }

    // If image is being cleared or replaced, delete old file from disk.
    // This only runs when admin is explicitly updating `image_url`.
    if (wantsImageUpdate && oldImageFilename && (!newImageFilename || newImageFilename !== oldImageFilename)) {
      try {
        const oldPath = path.join(uploadsDir, oldImageFilename);
        if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
      } catch (err) {
        // Don't block listing update if file deletion fails.
        console.error('Failed to delete old listing image:', err?.message || err);
      }
    }
    if (derivedStatus === 'sold') { updates.push('sold_at = NOW()'); }
    if (!updates.length) return res.status(400).json({ error: 'No fields to update' });
    values.push(req.params.id);
    await db.query(`UPDATE listings SET ${updates.join(', ')} WHERE id = ?`, values);
    res.json({ message: 'Updated' });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Admin: upload/replace listing image (used for Edit modal)
router.put('/listings/:id/image', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'image file is required' });

    const newImageUrl = `/uploads/${req.file.filename}`;
    const [currentRows] = await db.query('SELECT image_url FROM listings WHERE id = ?', [req.params.id]);
    if (!currentRows?.length) return res.status(404).json({ error: 'Listing not found' });

    const extractFilename = (maybeUrl) => {
      if (!maybeUrl) return null;
      const s = String(maybeUrl);
      const match = s.match(/\/uploads\/(.+)$/);
      if (match?.[1]) return match[1];
      const parts = s.split('/');
      return parts[parts.length - 1] || null;
    };

    const oldFilename = extractFilename(currentRows[0].image_url);
    const newFilename = extractFilename(newImageUrl) || req.file.filename;

    // Delete old file if different
    if (oldFilename && oldFilename !== newFilename) {
      try {
        const oldPath = path.join(uploadsDir, oldFilename);
        if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
      } catch (err) {
        console.error('Failed to delete old listing image:', err?.message || err);
      }
    }

    await db.query('UPDATE listings SET image_url = ? WHERE id = ?', [newImageUrl, req.params.id]);
    res.json({ image_url: newImageUrl, message: 'Image updated' });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Admin: reorder listings (drag-and-drop)
// Expects: { order: [id1, id2, ...] }
// We persist ordering by updating `created_at` so public queries (ordered by created_at DESC)
// reflect the new "top first" sequence.
router.post('/listings/reorder', async (req, res) => {
  try {
    const { order } = req.body;
    if (!Array.isArray(order) || order.length === 0) {
      return res.status(400).json({ error: 'order must be a non-empty array of listing ids' });
    }

    const ids = order.map((x) => Number(x)).filter((n) => Number.isFinite(n));
    if (ids.length === 0) return res.status(400).json({ error: 'order contains no valid ids' });

    for (let i = 0; i < ids.length; i += 1) {
      // i=0 becomes newest, so ordering-by-created_at DESC shows it first.
      await db.query('UPDATE listings SET created_at = NOW() - INTERVAL ? SECOND WHERE id = ?', [i, ids[i]]);
    }

    res.json({ message: 'Reordered' });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.delete('/listings/:id', async (req, res) => {
  try {
    await db.query('DELETE FROM listings WHERE id = ?', [req.params.id]);
    res.json({ message: 'Deleted' });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Users list
router.get('/users', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT id, email, name, role, phone, created_at FROM users ORDER BY created_at DESC');
    res.json(rows);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Makes CRUD (for admin adding brands)
router.get('/makes', async (req, res) => {
  const [rows] = await db.query('SELECT * FROM makes ORDER BY name');
  res.json(rows);
});

router.post('/makes', async (req, res) => {
  const { name } = req.body;
  if (!name) return res.status(400).json({ error: 'Name required' });
  const slug = name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
  await db.query('INSERT INTO makes (name, slug) VALUES (?, ?)', [name, slug]);
  res.status(201).json({ message: 'Created' });
});

// Models by make
router.get('/makes/:id/models', async (req, res) => {
  const [rows] = await db.query('SELECT * FROM models WHERE make_id = ?', [req.params.id]);
  res.json(rows);
});

router.post('/models', async (req, res) => {
  const { make_id, name } = req.body;
  if (!make_id || !name) return res.status(400).json({ error: 'make_id and name required' });
  const slug = name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
  await db.query('INSERT INTO models (make_id, name, slug) VALUES (?, ?, ?)', [make_id, name, slug]);
  res.status(201).json({ message: 'Created' });
});

// Blog CRUD
router.get('/blog', async (req, res) => {
  const [rows] = await db.query('SELECT * FROM blog_posts ORDER BY created_at DESC');
  res.json(rows);
});

router.post('/blog', upload.single('image'), async (req, res) => {
  const { title, excerpt, content, image_url, published } = req.body;
  if (!title) return res.status(400).json({ error: 'Title required' });

  const slug = title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

  const publishedBool =
    published === true ||
    published === 'true' ||
    published === '1' ||
    published === 1 ||
    published === 'on';

  const finalImageUrl = req.file ? `/uploads/${req.file.filename}` : (image_url || null);
  const published_at = publishedBool ? new Date() : null;

  await db.query(
    'INSERT INTO blog_posts (title, slug, excerpt, content, image_url, author_id, published_at) VALUES (?, ?, ?, ?, ?, ?, ?)',
    [title, slug, excerpt || null, content || null, finalImageUrl, req.user.id, published_at]
  );

  res.status(201).json({ message: 'Created' });
});

router.put('/blog/:id', upload.single('image'), async (req, res) => {
  const { title, excerpt, content, image_url, published, published_at } = req.body;
  const updates = [];
  const values = [];
  if (title !== undefined) { updates.push('title = ?'); values.push(title); }
  if (excerpt !== undefined) { updates.push('excerpt = ?'); values.push(excerpt); }
  if (content !== undefined) { updates.push('content = ?'); values.push(content); }

  const publishedBool =
    published === true ||
    published === 'true' ||
    published === '1' ||
    published === 1 ||
    published === 'on';

  const finalImageUrl = req.file ? `/uploads/${req.file.filename}` : (image_url ? image_url : null);

  if (image_url !== undefined || req.file) {
    updates.push('image_url = ?');
    values.push(finalImageUrl);
  }

  if (published !== undefined) {
    updates.push('published_at = ?');
    values.push(publishedBool ? new Date() : null);
  }
  if (published_at !== undefined) { updates.push('published_at = ?'); values.push(published_at); }
  if (!updates.length) return res.status(400).json({ error: 'No fields to update' });
  values.push(req.params.id);
  await db.query(`UPDATE blog_posts SET ${updates.join(', ')} WHERE id = ?`, values);
  res.json({ message: 'Updated' });
});

router.delete('/blog/:id', async (req, res) => {
  await db.query('DELETE FROM blog_posts WHERE id = ?', [req.params.id]);
  res.json({ message: 'Deleted' });
});

// Testimonials CRUD
router.get('/testimonials', async (req, res) => {
  const [rows] = await db.query('SELECT * FROM testimonials ORDER BY display_order, id');
  res.json(rows);
});

router.post('/testimonials', upload.single('avatar'), async (req, res) => {
  const { name, location, content, rating, avatar_url, display_order } = req.body;
  if (!name || !content) return res.status(400).json({ error: 'Name and content required' });

  // If a file was uploaded, use that URL. Otherwise, allow clearing via avatar_url="".
  const finalAvatarUrl = req.file ? `/uploads/${req.file.filename}` : (avatar_url ? avatar_url : null);

  await db.query(
    'INSERT INTO testimonials (name, location, content, rating, avatar_url, display_order) VALUES (?, ?, ?, ?, ?, ?)',
    [name || null, location || null, content, rating || 5, finalAvatarUrl, display_order || 0]
  );
  res.status(201).json({ message: 'Created' });
});

router.put('/testimonials/:id', upload.single('avatar'), async (req, res) => {
  const { name, location, content, rating, avatar_url, display_order } = req.body;
  const updates = [];
  const values = [];

  if (name !== undefined) { updates.push('name = ?'); values.push(name); }
  if (location !== undefined) { updates.push('location = ?'); values.push(location); }
  if (content !== undefined) { updates.push('content = ?'); values.push(content); }
  if (rating !== undefined) { updates.push('rating = ?'); values.push(rating); }

  // If a file was uploaded, it takes precedence. Otherwise, allow clearing via avatar_url="".
  const finalAvatarUrl = req.file ? `/uploads/${req.file.filename}` : (avatar_url ? avatar_url : null);
  if (avatar_url !== undefined || req.file) {
    updates.push('avatar_url = ?');
    values.push(finalAvatarUrl);
  }

  if (display_order !== undefined) {
    updates.push('display_order = ?');
    values.push(display_order);
  }

  if (!updates.length) return res.status(400).json({ error: 'No fields to update' });
  values.push(req.params.id);
  await db.query(`UPDATE testimonials SET ${updates.join(', ')} WHERE id = ?`, values);
  res.json({ message: 'Updated' });
});

router.delete('/testimonials/:id', async (req, res) => {
  await db.query('DELETE FROM testimonials WHERE id = ?', [req.params.id]);
  res.json({ message: 'Deleted' });
});

// Countries
router.get('/countries', async (req, res) => {
  const [rows] = await db.query('SELECT * FROM countries ORDER BY name');
  res.json(rows);
});

router.post('/countries', async (req, res) => {
  const { name, code, flag_url } = req.body;
  if (!name || !code) return res.status(400).json({ error: 'Name and code required' });
  await db.query('INSERT INTO countries (name, code, flag_url) VALUES (?, ?, ?)', [name, code, flag_url || null]);
  res.status(201).json({ message: 'Created' });
});

module.exports = router;
