import { Link, useNavigate, useLocation } from 'react-router-dom';

const adminNav = [
  { to: '/admin', label: 'Dashboard' },
  { to: '/admin/listings', label: 'Listings' },
  { to: '/admin/users', label: 'Users' },
  { to: '/admin/blog', label: 'Blog' },
  { to: '/admin/testimonials', label: 'Testimonials' },
];

export default function AdminHeader({ onLogout }) {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    if (onLogout) return onLogout();
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
    window.location.reload();
  };

  let user = {};
  try {
    const parsed = JSON.parse(localStorage.getItem('user') || '{}');
    user = parsed && typeof parsed === 'object' ? parsed : {};
  } catch (e) {
    user = {};
  }

  return (
    <header
      style={{
        background: 'var(--white)',
        boxShadow: 'var(--shadow)',
        position: 'sticky',
        top: 0,
        zIndex: 100,
      }}
    >
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', minHeight: '72px', gap: 24, flexWrap: 'wrap', padding: '12px 0' }}>
        <Link to="/admin" aria-label="Admin home" style={{ display: 'flex', alignItems: 'center', gap: 10 }} />

        <nav style={{ display: 'none' }}>
          {adminNav.map(({ to, label }) => {
            const isActive = to === '/admin' ? location.pathname === '/admin' : location.pathname.startsWith(to);
            return (
              <Link
                key={to}
                to={to}
                style={{
                  fontWeight: 500,
                  padding: '8px 12px',
                  borderRadius: 'var(--radius)',
                  color: isActive ? 'var(--white)' : 'var(--gray-700)',
                  background: isActive ? 'var(--blue-primary)' : 'transparent',
                }}
              >
                {label}
              </Link>
            );
          })}
        </nav>

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <span style={{ fontSize: '0.875rem', color: 'var(--gray-600)' }}>{user.name}</span>
          <button
            type="button"
            onClick={handleLogout}
            style={{
              padding: '8px 16px',
              fontSize: '0.875rem',
              fontWeight: 600,
              color: 'var(--gray-700)',
              background: 'var(--gray-100)',
              border: 'none',
              borderRadius: 'var(--radius)',
              cursor: 'pointer',
            }}
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}
