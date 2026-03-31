import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api';

const placeholder = 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=400&q=80';

export default function PopularBrands() {
  const [makes, setMakes] = useState([]);

  useEffect(() => {
    api.makes.list().then(setMakes).catch(() => setMakes([]));
  }, []);

  return (
    <section style={{ padding: '48px 0' }}>
      <div className="container">
        <h2 className="section-title" style={{ marginBottom: 24, textAlign: 'center' }}>Brands</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 24 }}>
          {makes.slice(0, 6).map((make) => (
            <Link key={make.id} to={`/cars?make=${make.slug}`} className="card" style={{ display: 'block' }}>
              <div style={{ aspectRatio: '4/3', background: 'var(--gray-100)', overflow: 'hidden' }}>
                <img src={make.logo_url || placeholder} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <div style={{ padding: 16 }}>
                <h3 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: 4 }}>{make.name}</h3>
                <p style={{ fontSize: '0.875rem', color: 'var(--gray-500)' }}>{make.listings_count ?? 0} Listings</p>
              </div>
            </Link>
          ))}
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 24 }}>
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--blue-primary)' }} />
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--gray-200)' }} />
        </div>
      </div>
    </section>
  );
}
