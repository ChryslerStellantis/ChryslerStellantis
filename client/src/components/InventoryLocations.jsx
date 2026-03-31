import { Link } from 'react-router-dom';

const mapImage = 'https://images.unsplash.com/photo-1524661135-423995f22d0b?w=600&q=80';

export default function InventoryLocations() {
  return (
    <section style={{ background: 'var(--blue-light)', padding: '48px 0' }}>
      <div className="container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 48, alignItems: 'center' }}>
        <div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: 16, color: 'var(--gray-900)' }}>Car Inventory Locations</h2>
          <p style={{ color: 'var(--gray-600)', marginBottom: 24, lineHeight: 1.6 }}>
            Find the most up-to-date car listings and information from our inventory located around the world.
          </p>
          <Link to="/cars?showCountries=1" className="btn btn-primary">View All Locations</Link>
        </div>
        <div>
          <img src={mapImage} alt="World map" style={{ borderRadius: 'var(--radius-lg)', width: '100%' }} />
        </div>
      </div>
    </section>
  );
}
