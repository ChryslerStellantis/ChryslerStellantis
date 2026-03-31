import { Link } from 'react-router-dom';
import { useState } from 'react';
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from 'react-icons/fa';
import { api } from '../api';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    try {
      await api.newsletter(email);
      setSubscribed(true);
      setEmail('');
    } catch (err) {
      // ignore
    }
    setLoading(false);
  };

  return (
    <footer style={{ background: 'var(--blue-dark)', color: 'var(--white)', marginTop: 'auto' }}>
      <div className="container" style={{ paddingTop: 48, paddingBottom: 24 }}>
        <div style={{ marginBottom: 24 }}>
          <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
            <span style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--white)', color: 'var(--blue-dark)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>C</span>
            <span style={{ fontSize: '1.25rem', fontWeight: 700 }}>ChryslerStellantis</span>
          </Link>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 32, marginBottom: 40 }}>
          <div>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: 16 }}>Subscribe To Our Newsletter</h3>
            <form onSubmit={handleSubscribe} style={{ display: 'flex', gap: 8 }}>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email"
                style={{ flex: 1, padding: '10px 12px', borderRadius: 6, border: 'none', background: 'rgba(255,255,255,0.1)', color: 'white' }}
              />
              <button type="submit" className="btn btn-primary" disabled={loading || subscribed}>
                {subscribed ? 'Subscribed' : 'Subscribe'}
              </button>
            </form>
          </div>
          <div>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: 16 }}>Contact Us</h3>
            <p style={{ fontSize: '0.875rem', opacity: 0.9 }}>12-34 31st Ave., Queens</p>
            <p style={{ fontSize: '0.875rem', opacity: 0.9 }}>support@chryslerstellantis.org</p>
            <p style={{ fontSize: '0.875rem', opacity: 0.9 }}>+1 (212) 555-0198</p>
          </div>
          <div>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: 16 }}>Follow Us</h3>
            <div style={{ display: 'flex', gap: 12 }}>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook"><FaFacebookF size={20} /></a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter"><FaTwitter size={20} /></a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram"><FaInstagram size={20} /></a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"><FaLinkedinIn size={20} /></a>
            </div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 32, paddingTop: 24, borderTop: '1px solid rgba(255,255,255,0.2)', marginBottom: 32 }}>
          <div>
            <h4 style={{ fontSize: '0.9375rem', fontWeight: 700, marginBottom: 12 }}>About Us</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: '0.875rem', opacity: 0.9 }}>
              <Link to="/careers">Careers</Link>
              <Link to="/our-story">Our Story</Link>
              <Link to="/press">Press</Link>
              <Link to="/blog">Blog</Link>
              <Link to="/contact">Contact</Link>
            </div>
          </div>
          <div>
            <h4 style={{ fontSize: '0.9375rem', fontWeight: 700, marginBottom: 12 }}>Help</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: '0.875rem', opacity: 0.9 }}>
              <Link to="/faq">FAQ</Link>
              <Link to="/terms">Terms & Conditions</Link>
              <Link to="/privacy">Privacy Policy</Link>
              <Link to="/support">Help & Support</Link>
            </div>
          </div>
          <div>
            <h4 style={{ fontSize: '0.9375rem', fontWeight: 700, marginBottom: 12 }}>Our Services</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: '0.875rem', opacity: 0.9 }}>
              <Link to="/sell-car">Sell Your Car</Link>
              <Link to="/cars">Buy Your Car</Link>
              <Link to="/cars">Car Locator</Link>
              <Link to="/insurance">Insurance</Link>
              <Link to="/finance">Finance</Link>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16, paddingTop: 24, borderTop: '1px solid rgba(255,255,255,0.2)' }}>
          <p style={{ fontSize: '0.875rem', opacity: 0.9 }}>© 2026 ChryslerStellantis. All Rights Reserved.</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
            <span style={{ fontSize: '0.75rem' }}>Visa</span>
            <span style={{ fontSize: '0.75rem' }}>Mastercard</span>
            <span style={{ fontSize: '0.75rem' }}>PayPal</span>
            <span style={{ fontSize: '0.75rem' }}>Amex</span>
            <span style={{ fontSize: '0.75rem', opacity: 0.9 }}>SSL Secure</span>
            <span style={{ fontSize: '0.75rem', opacity: 0.9 }}>24/7 Support</span>
            <span style={{ fontSize: '0.75rem', opacity: 0.9 }}>Trusted by 100k+</span>
            <span style={{ fontSize: '0.75rem', opacity: 0.9 }}>Easy Returns</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
