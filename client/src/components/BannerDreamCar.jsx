import { Link } from 'react-router-dom';

const personPhone = 'https://images.unsplash.com/photo-1660107930658-e81bd3262e6f?w=900&q=80&auto=format&fit=crop';
const redSuv = 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=600&q=80';

export default function BannerDreamCar() {
  return (
    <>
      <section style={{ background: 'var(--white)', padding: '48px 0' }}>
        <div className="container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 48, alignItems: 'center' }}>
          <div>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: 16, color: 'var(--gray-900)' }}>Find Your Dream Car</h2>
            <p style={{ color: 'var(--gray-600)', marginBottom: 24, lineHeight: 1.6 }}>
              Browse thousands of verified cars from trusted sellers. Compare prices, features, and find the best deal for you.
            </p>
            <Link to="/cars" className="btn btn-primary">Learn More</Link>
          </div>
          <div style={{ position: 'relative' }}>
            <img src={personPhone} alt="Car interior" style={{ borderRadius: 'var(--radius-lg)', width: '100%', maxWidth: 400, marginLeft: 'auto' }} />
          </div>
        </div>
      </section>
      <section style={{ background: 'var(--pink-banner)', padding: '48px 0' }}>
        <div className="container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 48, alignItems: 'center' }}>
          <div>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: 16, color: 'var(--gray-900)' }}>Best Car For You</h2>
            <p style={{ color: 'var(--gray-600)', marginBottom: 24, lineHeight: 1.6 }}>
              Discover the BMW X6 2024 and other premium SUVs. Performance, style, and reliability in one package.
            </p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <img src={redSuv} alt="BMW X6 2024" style={{ borderRadius: 'var(--radius-lg)', maxWidth: 500, marginLeft: 'auto' }} />
          </div>
        </div>
      </section>
    </>
  );
}
