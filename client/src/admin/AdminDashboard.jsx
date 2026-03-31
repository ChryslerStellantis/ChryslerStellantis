import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    api.admin.stats().then(setStats).catch(() => setStats(null));
  }, []);

  if (!stats) return <p>Loading...</p>;

  const cards = [
    { label: 'Users', value: stats.users, to: '/admin/users' },
    { label: 'Listings', value: stats.listings, to: '/admin/listings' },
    { label: 'Sold', value: stats.sold, to: '/admin/listings' },
    { label: 'Blog Posts', value: stats.blogPosts, to: '/admin/blog' },
    { label: 'Brands', value: stats.brands, to: '/admin' },
    { label: 'Testimonials', value: stats.testimonials, to: '/admin/testimonials' },
  ];

  return (
    <div>
      <h1 className="section-title" style={{ marginBottom: 32 }}>Dashboard</h1>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 24, justifyContent: 'start', alignItems: 'start' }}>
        {cards.map(({ label, value, to }) => (
          <Link key={label} to={to} className="card" style={{ padding: 24, display: 'block' }}>
            <p style={{ fontSize: '0.875rem', color: 'var(--gray-500)', marginBottom: 8 }}>{label}</p>
            <p style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--blue-primary)' }}>{value}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
