import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaChevronRight } from 'react-icons/fa';
import { api } from '../api';
import CarCard from './CarCard';

export default function TrendingCars() {
  const [listings, setListings] = useState([]);

  useEffect(() => {
    api.cars.trending().then(setListings).catch(() => setListings([]));
  }, []);

  return (
    <section style={{ padding: '48px 0' }}>
      <div className="container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, flexWrap: 'wrap', gap: 16 }}>
          <h2 className="section-title" style={{ marginBottom: 0 }}>Trending This Month</h2>
          <Link to="/cars" style={{ display: 'flex', alignItems: 'center', gap: 8, fontWeight: 600, color: 'var(--blue-primary)' }}>
            View All <FaChevronRight />
          </Link>
        </div>
        <div style={{ display: 'flex', gap: 24, overflowX: 'auto', paddingBottom: 16 }}>
          {listings.map((listing) => (
            <div key={listing.id} style={{ minWidth: 280, flexShrink: 0 }}>
              <CarCard listing={listing} showSold={false} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
