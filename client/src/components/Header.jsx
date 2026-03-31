import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaSearch, FaBell, FaUser, FaBars, FaTimes } from 'react-icons/fa';

export default function Header() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  let user = {};
  try {
    const parsed = JSON.parse(localStorage.getItem('user') || '{}');
    user = parsed && typeof parsed === 'object' ? parsed : {};
  } catch (e) {
    user = {};
  }
  const token = localStorage.getItem('token');

  useEffect(() => {
    const media = window.matchMedia('(min-width: 1025px)');
    const handleChange = (e) => {
      if (e.matches) setMenuOpen(false);
    };
    media.addEventListener('change', handleChange);
    return () => media.removeEventListener('change', handleChange);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setMenuOpen(false);
    navigate('/');
    window.location.reload();
  };

  const closeMenu = () => setMenuOpen(false);

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
      <div className="container" style={{ minHeight: '72px', padding: '12px 0', position: 'relative' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
          <Link to="/" onClick={closeMenu} className="header-brand-link" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: '50%',
                background: 'var(--blue-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontWeight: 700,
                fontSize: '1.1rem',
              }}
            >
              C
            </div>
            <span style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--blue-primary)' }}>ChryslerStellantis</span>
          </Link>

          <button
            className="header-mobile-button"
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            style={{
              background: 'none',
              border: 'none',
              padding: 8,
              color: 'var(--gray-700)',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
            }}
          >
            {menuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>
        </div>

        <div className="header-desktop-only" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 24, marginTop: 10 }}>
          <nav style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
            <Link to="/" style={{ fontWeight: 500, color: 'var(--gray-700)' }}>Home</Link>
            <Link to="/cars" style={{ fontWeight: 500, color: 'var(--gray-700)' }}>Cars</Link>
            <Link to="/brands" style={{ fontWeight: 500, color: 'var(--gray-700)' }}>Brands</Link>
            <Link to="/sell-car" style={{ fontWeight: 500, color: 'var(--gray-700)' }}>Sell Car</Link>
            <Link to="/blog" style={{ fontWeight: 500, color: 'var(--gray-700)' }}>Reviews</Link>
            <Link to="/blog" style={{ fontWeight: 500, color: 'var(--gray-700)' }}>Blog</Link>
          </nav>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <button type="button" aria-label="Search" style={{ background: 'none', border: 'none', padding: 8, color: 'var(--gray-700)' }}>
              <FaSearch size={20} />
            </button>
            <button type="button" aria-label="Notifications" style={{ background: 'none', border: 'none', padding: 8, color: 'var(--gray-700)', position: 'relative' }}>
              <FaBell size={20} />
            </button>
            {token ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: '0.875rem', color: 'var(--gray-600)' }}>{user.name}</span>
                <button
                  type="button"
                  onClick={handleLogout}
                  style={{ background: 'none', border: 'none', padding: 8, color: 'var(--gray-700)' }}
                  aria-label="Account"
                >
                  <FaUser size={20} />
                </button>
                {user.role === 'admin' && (
                  <Link to="/admin" className="btn btn-primary" style={{ padding: '8px 16px', fontSize: '0.875rem' }}>Admin</Link>
                )}
              </div>
            ) : (
              <Link to="/login" style={{ background: 'none', border: 'none', padding: 8, color: 'var(--gray-700)' }} aria-label="Sign in">
                <FaUser size={20} />
              </Link>
            )}
            <Link to="/sell-car" className="btn btn-primary" style={{ whiteSpace: 'nowrap' }}>
              Sell My Car
            </Link>
          </div>
        </div>

        {menuOpen && (
          <div
            className="header-mobile-panel"
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              top: '100%',
              marginTop: 8,
              background: 'var(--white)',
              boxShadow: 'var(--shadow)',
              borderRadius: 'var(--radius-lg)',
              padding: 16,
              zIndex: 150,
            }}
          >
            <nav style={{ display: 'grid', gap: 12, marginBottom: 14 }}>
              <Link to="/" onClick={closeMenu} style={{ fontWeight: 500, color: 'var(--gray-700)' }}>Home</Link>
              <Link to="/cars" onClick={closeMenu} style={{ fontWeight: 500, color: 'var(--gray-700)' }}>Cars</Link>
              <Link to="/brands" onClick={closeMenu} style={{ fontWeight: 500, color: 'var(--gray-700)' }}>Brands</Link>
              <Link to="/sell-car" onClick={closeMenu} style={{ fontWeight: 500, color: 'var(--gray-700)' }}>Sell Car</Link>
              <Link to="/blog" onClick={closeMenu} style={{ fontWeight: 500, color: 'var(--gray-700)' }}>Reviews</Link>
              <Link to="/blog" onClick={closeMenu} style={{ fontWeight: 500, color: 'var(--gray-700)' }}>Blog</Link>
            </nav>

            <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
              <button type="button" aria-label="Search" style={{ background: 'none', border: 'none', padding: 8, color: 'var(--gray-700)' }}>
                <FaSearch size={20} />
              </button>
              <button type="button" aria-label="Notifications" style={{ background: 'none', border: 'none', padding: 8, color: 'var(--gray-700)', position: 'relative' }}>
                <FaBell size={20} />
              </button>

              {token ? (
                <>
                  <span style={{ fontSize: '0.875rem', color: 'var(--gray-600)' }}>{user.name}</span>
                  <button
                    type="button"
                    onClick={handleLogout}
                    style={{ background: 'none', border: 'none', padding: 8, color: 'var(--gray-700)' }}
                    aria-label="Account"
                  >
                    <FaUser size={20} />
                  </button>
                  {user.role === 'admin' && (
                    <Link to="/admin" onClick={closeMenu} className="btn btn-primary" style={{ padding: '8px 16px', fontSize: '0.875rem' }}>Admin</Link>
                  )}
                </>
              ) : (
                <Link to="/login" onClick={closeMenu} style={{ background: 'none', border: 'none', padding: 8, color: 'var(--gray-700)' }} aria-label="Sign in">
                  <FaUser size={20} />
                </Link>
              )}

              <Link to="/sell-car" onClick={closeMenu} className="btn btn-primary" style={{ whiteSpace: 'nowrap' }}>
                Sell My Car
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
