import { Link } from 'react-router-dom';
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from 'react-icons/fa';

export default function TopBar() {
  return (
    <div
      style={{
        background: 'var(--blue-light)',
        padding: '8px 0',
        fontSize: '0.875rem',
      }}
    >
      <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
        <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
          <Link to="/about" style={{ color: 'var(--gray-700)' }}>About Us</Link>
          <Link to="/contact" style={{ color: 'var(--gray-700)' }}>Contact Us</Link>
          <Link to="/help" style={{ color: 'var(--gray-700)' }}>Help</Link>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <select
            style={{
              border: 'none',
              background: 'transparent',
              color: 'var(--gray-700)',
              fontSize: '0.875rem',
              cursor: 'pointer',
            }}
          >
            <option>English</option>
          </select>
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook" style={{ color: 'var(--blue-primary)' }}>
            <FaFacebookF size={14} />
          </a>
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter" style={{ color: 'var(--blue-primary)' }}>
            <FaTwitter size={14} />
          </a>
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram" style={{ color: 'var(--blue-primary)' }}>
            <FaInstagram size={14} />
          </a>
          <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" style={{ color: 'var(--blue-primary)' }}>
            <FaLinkedinIn size={14} />
          </a>
        </div>
      </div>
    </div>
  );
}
