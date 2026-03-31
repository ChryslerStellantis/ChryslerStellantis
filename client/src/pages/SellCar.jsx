import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api';

export default function SellCar() {
  const navigate = useNavigate();
  const [makes, setMakes] = useState([]);
  const [models, setModels] = useState([]);
  const [conditions, setConditions] = useState([]);
  const [make, setMake] = useState('');
  const [model, setModel] = useState('');
  const [form, setForm] = useState({
    condition_id: '',
    year: new Date().getFullYear(),
    price: '',
    mileage_km: '',
    transmission: 'Automatic',
    fuel_type: 'Petrol',
    location_city: '',
    location_country: '',
    description: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const token = localStorage.getItem('token');

  useEffect(() => {
    api.makes.list().then(setMakes).catch(() => {});
    api.conditions().then((rows) => {
      setConditions(rows);
      const used = rows.find((c) => c.name === 'Used');
      if (used) setForm((f) => ({ ...f, condition_id: String(used.id) }));
    }).catch(() => {});
  }, []);

  useEffect(() => {
    if (make) api.makes.models(make).then(setModels).catch(() => setModels([]));
    else setModels([]);
  }, [make]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token) {
      setError('Please sign in to list a car.');
      return;
    }
    const makeObj = makes.find((m) => m.slug === make);
    const modelObj = models.find((m) => m.slug === model);
    if (!makeObj || !modelObj) {
      setError('Please select make and model.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await api.cars.create({
        make_id: makeObj.id,
        model_id: modelObj.id,
        condition_id: Number(form.condition_id),
        year: Number(form.year),
        price: Number(form.price),
        mileage_km: form.mileage_km ? Number(form.mileage_km) : null,
        transmission: form.transmission,
        fuel_type: form.fuel_type,
        location_city: form.location_city || null,
        location_country: form.location_country || null,
        description: form.description || null,
      });
      navigate('/cars');
    } catch (e) {
      setError(e.message);
    }
    setLoading(false);
  };

  if (!token) {
    return (
      <div className="container" style={{ padding: 48, textAlign: 'center' }}>
        <h1 style={{ marginBottom: 16 }}>Sell Your Car</h1>
        <p style={{ marginBottom: 24 }}>Please sign in to list your car for sale.</p>
        <button type="button" className="btn btn-primary" onClick={() => navigate('/login')}>Sign In</button>
      </div>
    );
  }

  return (
    <div style={{ padding: '48px 0' }}>
      <div className="container" style={{ maxWidth: 640 }}>
        <h1 style={{ marginBottom: 24 }}>List Your Car</h1>
        {error && <p style={{ color: 'crimson', marginBottom: 16 }}>{error}</p>}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div>
            <label style={{ display: 'block', marginBottom: 8, fontWeight: 500 }}>Condition</label>
            <select
              value={form.condition_id}
              onChange={(e) => setForm((f) => ({ ...f, condition_id: e.target.value }))}
              style={{ width: '100%', padding: '10px 12px', borderRadius: 6, border: '1px solid var(--gray-200)' }}
              required
            >
              {conditions.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: 8, fontWeight: 500 }}>Make</label>
            <select value={make} onChange={(e) => setMake(e.target.value)} required style={{ width: '100%', padding: '10px 12px', borderRadius: 6, border: '1px solid var(--gray-200)' }}>
              <option value="">Select make</option>
              {makes.map((m) => <option key={m.id} value={m.slug}>{m.name}</option>)}
            </select>
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: 8, fontWeight: 500 }}>Model</label>
            <select value={model} onChange={(e) => setModel(e.target.value)} required style={{ width: '100%', padding: '10px 12px', borderRadius: 6, border: '1px solid var(--gray-200)' }}>
              <option value="">Select model</option>
              {models.map((m) => <option key={m.id} value={m.slug}>{m.name}</option>)}
            </select>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div>
              <label style={{ display: 'block', marginBottom: 8, fontWeight: 500 }}>Year</label>
              <input type="number" value={form.year} onChange={(e) => setForm((f) => ({ ...f, year: e.target.value }))} required min="1990" max={new Date().getFullYear() + 1} style={{ width: '100%', padding: '10px 12px', borderRadius: 6, border: '1px solid var(--gray-200)' }} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: 8, fontWeight: 500 }}>Price ($)</label>
              <input type="number" value={form.price} onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))} required min="0" style={{ width: '100%', padding: '10px 12px', borderRadius: 6, border: '1px solid var(--gray-200)' }} />
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div>
              <label style={{ display: 'block', marginBottom: 8, fontWeight: 500 }}>Mileage (km)</label>
              <input type="number" value={form.mileage_km} onChange={(e) => setForm((f) => ({ ...f, mileage_km: e.target.value }))} min="0" style={{ width: '100%', padding: '10px 12px', borderRadius: 6, border: '1px solid var(--gray-200)' }} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: 8, fontWeight: 500 }}>Transmission</label>
              <select value={form.transmission} onChange={(e) => setForm((f) => ({ ...f, transmission: e.target.value }))} style={{ width: '100%', padding: '10px 12px', borderRadius: 6, border: '1px solid var(--gray-200)' }}>
                <option>Automatic</option>
                <option>Manual</option>
              </select>
            </div>
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: 8, fontWeight: 500 }}>Fuel Type</label>
            <select value={form.fuel_type} onChange={(e) => setForm((f) => ({ ...f, fuel_type: e.target.value }))} style={{ width: '100%', padding: '10px 12px', borderRadius: 6, border: '1px solid var(--gray-200)' }}>
              <option>Petrol</option>
              <option>Diesel</option>
              <option>Electric</option>
              <option>Hybrid</option>
            </select>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div>
              <label style={{ display: 'block', marginBottom: 8, fontWeight: 500 }}>City</label>
              <input type="text" value={form.location_city} onChange={(e) => setForm((f) => ({ ...f, location_city: e.target.value }))} style={{ width: '100%', padding: '10px 12px', borderRadius: 6, border: '1px solid var(--gray-200)' }} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: 8, fontWeight: 500 }}>Country</label>
              <input type="text" value={form.location_country} onChange={(e) => setForm((f) => ({ ...f, location_country: e.target.value }))} style={{ width: '100%', padding: '10px 12px', borderRadius: 6, border: '1px solid var(--gray-200)' }} />
            </div>
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: 8, fontWeight: 500 }}>Description</label>
            <textarea value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} rows={4} style={{ width: '100%', padding: '10px 12px', borderRadius: 6, border: '1px solid var(--gray-200)' }} />
          </div>
          <button type="submit" className="btn btn-primary" disabled={loading}>{loading ? 'Submitting...' : 'Submit Listing'}</button>
        </form>
      </div>
    </div>
  );
}
