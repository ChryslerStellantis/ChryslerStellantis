import { Link } from 'react-router-dom';
import { FaTachometerAlt, FaCog, FaGasPump } from 'react-icons/fa';

const placeholderCar = 'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=400&q=80';

function getConditionBadge(conditionRaw) {
  const condition = (conditionRaw || 'Used').trim();

  if (condition === 'New') {
    return {
      label: 'New',
      background: 'linear-gradient(135deg, #34d399 0%, #10b981 100%)',
    };
  }
  if (condition === 'Refurbished') {
    return {
      label: 'Refurbished',
      background: '#60a5fa',
    };
  }
  if (condition === 'Certified PO' || condition === 'Certified Pre-Owned') {
    return {
      label: 'Certified PO',
      background: 'linear-gradient(135deg, #c4b5fd 0%, #7c3aed 100%)',
    };
  }
  // Used (default)
  return {
    label: 'Used',
    background: 'linear-gradient(135deg, #ef4444 0%, #f59e0b 100%)',
  };
}

export default function CarCard({ listing, showSold }) {
  const img = listing.image_url || placeholderCar;
  const loc = [listing.location_city, listing.location_country].filter(Boolean).join(', ') || '—';
  const sold = listing.status === 'sold';
  const conditionBadge = getConditionBadge(listing.condition_name || listing.condition);

  return (
    <Link to={`/cars/${listing.id}`} className="card" style={{ display: 'block' }}>
      <div style={{ position: 'relative', aspectRatio: '4/3', background: 'var(--gray-100)', overflow: 'hidden' }}>
        <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />

        <span
          style={{
            position: 'absolute',
            top: 0,
            right: 0,
            padding: '8px 12px',
            fontSize: '0.75rem',
            fontWeight: 700,
            letterSpacing: '0.02em',
            color: 'white',
            background: conditionBadge.background,
            borderTopRightRadius: 'var(--radius-lg)',
            borderBottomLeftRadius: 'var(--radius-lg)',
            borderTopLeftRadius: 0,
            borderBottomRightRadius: 0,
          }}
        >
          {conditionBadge.label}
        </span>

        {showSold && sold && (
          <span
            style={{
              position: 'absolute',
              top: 12,
              left: 12,
              background: 'var(--gray-900)',
              color: 'white',
              padding: '4px 10px',
              borderRadius: 4,
              fontWeight: 700,
              fontSize: '0.75rem',
            }}
          >
            SOLD
          </span>
        )}
      </div>
      <div style={{ padding: 16 }}>
        <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: 8 }}>
          {listing.make_name} {listing.model_name} {listing.year}
        </h3>
        <p style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--blue-primary)', marginBottom: 12 }}>
          ${Number(listing.price).toLocaleString()}
        </p>
        <p style={{ fontSize: '0.875rem', color: 'var(--gray-500)', marginBottom: 12 }}>{loc}</p>
        <div style={{ display: 'flex', gap: 16, fontSize: '0.8125rem', color: 'var(--gray-600)' }}>
          {listing.mileage_km != null && (
            <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <FaTachometerAlt /> {listing.mileage_km.toLocaleString()} km
            </span>
          )}
          <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <FaCog /> {listing.transmission}
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <FaGasPump /> {listing.fuel_type}
          </span>
        </div>
      </div>
    </Link>
  );
}
