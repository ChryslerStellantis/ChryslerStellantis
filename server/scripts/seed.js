require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const bcrypt = require('bcryptjs');
const db = require('../config/db');

async function seed() {
  const adminHash = await bcrypt.hash('admin123', 10);
  await db.query(
    'INSERT INTO users (email, password, name, role) VALUES (?, ?, ?, ?) ON DUPLICATE KEY UPDATE password = VALUES(password)',
    ['admin@chrysler-stellantis.org', adminHash, 'Admin', 'admin']
  );
  console.log('Admin user ready: admin@chrysler-stellantis.org / admin123');

  const [makesRows] = await db.query('SELECT COUNT(*) AS c FROM makes');
  if (makesRows[0].c > 0) {
    console.log('Sample data already present.');
    process.exit(0);
    return;
  }

  await db.query(
    "INSERT IGNORE INTO conditions (name) VALUES ('New'), ('Used'), ('Refurbished'), ('Certified Pre-Owned')"
  );
  const [condRows] = await db.query('SELECT id, name FROM conditions');
  const conditionIds = Object.fromEntries(condRows.map((c) => [c.name, c.id]));

  const [m] = await db.query('INSERT INTO makes (name, slug) VALUES (?, ?)', ['Toyota', 'toyota']);
  const toyotaId = m.insertId;
  await db.query('INSERT INTO models (make_id, name, slug) VALUES (?, ?, ?), (?, ?, ?)', [toyotaId, 'Corolla', 'corolla', toyotaId, 'Camry', 'camry']);
  const [[corolla]] = await db.query('SELECT id FROM models WHERE make_id = ? AND slug = ?', [toyotaId, 'corolla']);

  await db.query('INSERT INTO makes (name, slug) VALUES (?, ?), (?, ?), (?, ?), (?, ?), (?, ?)',
    ['BMW', 'bmw', 'Mercedes Benz', 'mercedes-benz', 'Audi', 'audi', 'Honda', 'honda', 'Ford', 'ford']);
  const [allMakes] = await db.query('SELECT id, slug FROM makes');
  const makeIds = Object.fromEntries(allMakes.map(r => [r.slug, r.id]));

  for (const [slug, id] of Object.entries(makeIds)) {
    if (slug === 'toyota') continue;
    const mod = slug === 'bmw' ? 'M2' : slug === 'mercedes-benz' ? 'C-Class' : slug === 'audi' ? 'A4' : slug === 'honda' ? 'Civic' : 'Focus';
    const s = mod.toLowerCase().replace(/\s+/g, '-');
    await db.query('INSERT INTO models (make_id, name, slug) VALUES (?, ?, ?)', [id, mod, s]);
  }

  const [userRows] = await db.query('SELECT id FROM users WHERE role = ?', ['admin']);
  const userId = userRows[0].id;
  const placeholders = [
    [userId, makeIds.toyota, corolla.id, conditionIds['Used'], 2024, 25000, 15000, 'Automatic', 'Petrol', 'Lagos', 'Nigeria', 'Great condition', null, 'active', 1],
    [userId, makeIds.bmw, (await db.query('SELECT id FROM models WHERE make_id = ? LIMIT 1', [makeIds.bmw]))[0][0].id, conditionIds['New'], 2023, 45000, 8000, 'Automatic', 'Petrol', 'Lagos', 'Nigeria', 'BMW M2', null, 'active', 1],
    [userId, makeIds['mercedes-benz'], (await db.query('SELECT id FROM models WHERE make_id = ? LIMIT 1', [makeIds['mercedes-benz']]))[0][0].id, conditionIds['Certified Pre-Owned'], 2022, 38000, 12000, 'Automatic', 'Petrol', 'Nairobi', 'Kenya', 'Mercedes C-Class', null, 'sold', 0],
  ];
  for (const p of placeholders) {
    await db.query(
      'INSERT INTO listings (user_id, make_id, model_id, condition_id, year, price, mileage_km, transmission, fuel_type, location_city, location_country, description, image_url, status, is_featured) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      p
    );
  }
  await db.query("UPDATE listings SET sold_at = NOW() WHERE status = 'sold'");

  await db.query(
    'INSERT INTO countries (name, code) VALUES (?, ?), (?, ?), (?, ?), (?, ?), (?, ?)',
    ['Nigeria', 'NG', 'Kenya', 'KE', 'Tanzania', 'TZ', 'Ghana', 'GH', 'Rwanda', 'RW']
  );

  await db.query(
    `INSERT INTO testimonials (name, location, content, rating, display_order) VALUES
    (?, ?, ?, 5, 1), (?, ?, ?, 5, 2), (?, ?, ?, 5, 3)`,
    ['John Doe', 'Lagos, Nigeria', 'Excellent platform! Found my dream car in days. Highly recommend ChryslerStellantisfor buying and selling.', 'Sarah M.', 'Nairobi, Kenya', 'Smooth process from listing to sale. The team was very professional.', 'David K.', 'Accra, Ghana', 'Best car marketplace in the region. Transparent and reliable.']
  );

  await db.query(
    `INSERT INTO blog_posts (title, slug, excerpt, content, published_at) VALUES
    (?, ?, ?, ?, NOW()), (?, ?, ?, ?, NOW()), (?, ?, ?, ?, NOW())`,
    ['Tips for First-Time Car Buyers', 'tips-first-time-car-buyers', 'What you need to know before your first purchase.', 'Content here...', 'How to Get the Best Price for Your Used Car', 'how-to-get-best-price-used-car', 'Maximize your car\'s value when selling.', 'Content here...', 'Electric Cars: What to Expect in 2026', 'electric-cars-2026', 'The future of mobility.', 'Content here...']
  );

  console.log('Seed completed: makes, models, listings, countries, testimonials, blog.');
  process.exit(0);
}

seed().catch(e => {
  console.error(e);
  process.exit(1);
});
