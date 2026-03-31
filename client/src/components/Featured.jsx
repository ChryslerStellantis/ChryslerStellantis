import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api';
import CarCard from './CarCard';

export default function Featured() {
  const [listings, setListings] = useState([]);

  useEffect(() => {
    api.cars.list({ featured: '1', limit: 8, offset: 0 }).then((r) => setListings(r.listings)).catch(() => setListings([]));
  }, []);

  return (
    <section style={{ padding: '48px 0' }}>
      <div className="container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, flexWrap: 'wrap', gap: 16 }}>
          <h2 className="section-title" style={{ marginBottom: 0 }}>Featured</h2>
          <Link to="/cars" style={{ fontWeight: 600, color: 'var(--blue-primary)' }}>View All</Link>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 24 }}>
          {listings.map((listing) => (
            <CarCard key={listing.id} listing={listing} showSold={false} />
          ))}
        </div>
        {listings.length > 0 && (
          <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 24 }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--blue-primary)' }} />
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--gray-200)' }} />
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--gray-200)' }} />
          </div>
        )}
      </div>
    </section>
  );
}

