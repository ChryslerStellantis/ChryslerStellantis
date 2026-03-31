import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api';

const placeholder = 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=400&q=80';

export default function Brands() {
  const [makes, setMakes] = useState([]);

  useEffect(() => {
    api.makes.list().then(setMakes).catch(() => setMakes([]));
  }, []);

  return (
    <div style={{ padding: '48px 0' }}>
      <div className="container">
        <h1 className="section-title" style={{ marginBottom: 32 }}>Popular Brands</h1>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 24 }}>
          {makes.map((make) => (
            <Link key={make.id} to={`/cars?make=${make.slug}`} className="card" style={{ display: 'block' }}>
              <div style={{ aspectRatio: '4/3', background: 'var(--gray-100)', overflow: 'hidden' }}>
                <img src={make.logo_url || placeholder} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <div style={{ padding: 16 }}>
                <h3 style={{ fontSize: '1.125rem', fontWeight: 700 }}>{make.name}</h3>
                <p style={{ fontSize: '0.875rem', color: 'var(--gray-500)' }}>{make.listings_count ?? 0} Listings</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
