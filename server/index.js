require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const authRoutes = require('./routes/auth');
const carsRoutes = require('./routes/cars');
const makesRoutes = require('./routes/makes');
const conditionsRoutes = require('./routes/conditions');
const countriesRoutes = require('./routes/countries');
const blogRoutes = require('./routes/blog');
const testimonialsRoutes = require('./routes/testimonials');
const newsletterRoutes = require('./routes/newsletter');
const adminRoutes = require('./routes/admin');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api/auth', authRoutes);
app.use('/api/cars', carsRoutes);
app.use('/api/makes', makesRoutes);
app.use('/api/conditions', conditionsRoutes);
app.use('/api/countries', countriesRoutes);
app.use('/api/blog', blogRoutes);
app.use('/api/testimonials', testimonialsRoutes);
app.use('/api/newsletter', newsletterRoutes);
app.use('/api/admin', adminRoutes);

app.get('/api/health', (req, res) => res.json({ ok: true }));

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: err.message || 'Server error' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
