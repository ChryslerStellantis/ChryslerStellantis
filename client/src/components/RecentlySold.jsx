import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaChevronRight } from 'react-icons/fa';
import { api } from '../api';
import CarCard from './CarCard';

export default function RecentlySold() {
  const [listings, setListings] = useState([]);

  useEffect(() => {
    api.cars.sold().then(setListings).catch(() => setListings([]));
  }, []);

  return (
    <section style={{ padding: '48px 0', background: 'var(--gray-50)' }}>
      <div className="container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, flexWrap: 'wrap', gap: 16 }}>
          <h2 className="section-title" style={{ marginBottom: 0 }}>Recently Sold Cars</h2>
          <Link to="/cars" style={{ display: 'flex', alignItems: 'center', gap: 8, fontWeight: 600, color: 'var(--blue-primary)' }}>
            View All <FaChevronRight />
          </Link>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 24 }}>
          {listings.slice(0, 6).map((listing) => (
            <CarCard key={listing.id} listing={listing} showSold />
          ))}
        </div>
      </div>
    </section>
  );
}
