import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { api } from '../api';
import { FaTachometerAlt, FaCog, FaGasPump } from 'react-icons/fa';

const placeholder = 'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=800&q=80';

export default function CarDetail() {
  const { id } = useParams();
  const [listing, setListing] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    api.cars.get(id).then(setListing).catch((e) => setError(e.message));
  }, [id]);

  if (error) return <div className="container" style={{ padding: 48 }}><p>Car not found.</p></div>;
  if (!listing) return <div className="container" style={{ padding: 48 }}><p>Loading...</p></div>;

  const img = listing.image_url || placeholder;
  const loc = [listing.location_city, listing.location_country].filter(Boolean).join(', ') || '—';

  return (
    <div style={{ padding: '48px 0' }}>
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 48 }}>
          <div>
            <img src={img} alt="" style={{ width: '100%', borderRadius: 'var(--radius-lg)' }} />
          </div>
          <div>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: 16 }}>{listing.make_name} {listing.model_name} {listing.year}</h1>
            <p style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--blue-primary)', marginBottom: 24 }}>${Number(listing.price).toLocaleString()}</p>
            <p style={{ color: 'var(--gray-600)', marginBottom: 24 }}>{loc}</p>
            <div style={{ display: 'flex', gap: 24, marginBottom: 24, flexWrap: 'wrap' }}>
              {listing.mileage_km != null && (
                <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}><FaTachometerAlt /> {listing.mileage_km.toLocaleString()} km</span>
              )}
              <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}><FaCog /> {listing.transmission}</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}><FaGasPump /> {listing.fuel_type}</span>
            </div>
            {listing.description && <p style={{ lineHeight: 1.6, color: 'var(--gray-700)' }}>{listing.description}</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
