import { Link } from 'react-router-dom';

const personApp = 'https://images.unsplash.com/photo-1660107930658-e81bd3262e6f?w=900&q=80&auto=format&fit=crop';

export default function CtaBanner() {
  return (
    <section style={{ padding: '48px 0' }}>
      <div className="container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 48, alignItems: 'center' }}>
        <div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: 16, color: 'var(--gray-900)' }}>10,000+ Cars in Just a Few Clicks</h2>
          <p style={{ color: 'var(--gray-600)', marginBottom: 24, lineHeight: 1.6 }}>
            Start exploring thousands of cars for sale today. Find your perfect ride now.
          </p>
          <Link to="/cars" className="btn btn-primary">Find Your Car</Link>
        </div>
        <div style={{ textAlign: 'right' }}>
          <img src={personApp} alt="Car interior" style={{ borderRadius: 'var(--radius-lg)', maxWidth: 400, marginLeft: 'auto' }} />
        </div>
      </div>
    </section>
  );
}
