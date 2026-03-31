import { useState, useEffect } from 'react';
import { api } from '../api';
import { FaStar } from 'react-icons/fa';

export default function Testimonials() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    api.testimonials().then(setItems).catch(() => setItems([]));
  }, []);

  return (
    <section style={{ padding: '48px 0', background: 'var(--gray-50)' }}>
      <div className="container">
        <h2 className="section-title" style={{ textAlign: 'center', marginBottom: 40 }}>Our Happy Clients</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 24 }}>
          {items.slice(0, 3).map((t) => (
            <div key={t.id} className="card" style={{ padding: 24 }}>
              <div style={{ display: 'flex', gap: 4, marginBottom: 16, color: 'var(--gold)' }}>
                {Array.from({ length: t.rating || 5 }).map((_, i) => (
                  <FaStar key={i} size={18} />
                ))}
              </div>
              <p style={{ color: 'var(--gray-700)', marginBottom: 16, lineHeight: 1.6 }}>{t.content}</p>
              <p style={{ fontWeight: 600, fontSize: '0.9375rem' }}>{t.name}</p>
              {t.location && <p style={{ fontSize: '0.875rem', color: 'var(--gray-500)' }}>{t.location}</p>}
            </div>
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
