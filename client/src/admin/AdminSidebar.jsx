import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaTachometerAlt, FaCar, FaUsers, FaNewspaper, FaCommentDots, FaBuilding, FaPlus, FaTimes, FaListUl } from 'react-icons/fa';
import { api } from '../api';

const items = [
  { to: '/admin', label: 'Dashboard', icon: FaTachometerAlt },
  { to: '/admin/users', label: 'Users', icon: FaUsers },
  { to: '/admin/blog', label: 'Blog', icon: FaNewspaper },
  { to: '/admin/testimonials', label: 'Testimonials', icon: FaCommentDots },
];

export default function AdminSidebar() {
  const location = useLocation();
  const [brandsOpen, setBrandsOpen] = useState(false);
  const [brandsError, setBrandsError] = useState('');
  const [brandsLoading, setBrandsLoading] = useState(false);

  const [makes, setMakes] = useState([]);
  const [models, setModels] = useState([]);

  const [newMakeName, setNewMakeName] = useState('');
  const [selectedMakeId, setSelectedMakeId] = useState('');
  const [newModelName, setNewModelName] = useState('');

  useEffect(() => {
    if (!brandsOpen) return;
    setBrandsError('');
    api.admin.makes()
      .then(setMakes)
      .catch(() => setMakes([]));
  }, [brandsOpen]);

  useEffect(() => {
    if (!brandsOpen) return;
    if (!selectedMakeId) {
      setModels([]);
      return;
    }
    api.admin.models(selectedMakeId)
      .then(setModels)
      .catch(() => setModels([]));
  }, [selectedMakeId, brandsOpen]);

  const closeBrands = () => setBrandsOpen(false);

  const createMake = async () => {
    setBrandsError('');
    const name = newMakeName.trim();
    if (!name) {
      setBrandsError('Make name is required.');
      return;
    }

    setBrandsLoading(true);
    try {
      await api.admin.createMake(name);
      setNewMakeName('');
      const updated = await api.admin.makes();
      setMakes(updated);
      if (!selectedMakeId && updated.length) setSelectedMakeId(String(updated[0].id));
    } catch (e) {
      setBrandsError(e.message || 'Failed to create make');
    } finally {
      setBrandsLoading(false);
    }
  };

  const createModel = async () => {
    setBrandsError('');
    const name = newModelName.trim();
    if (!selectedMakeId) {
      setBrandsError('Select a make first.');
      return;
    }
    if (!name) {
      setBrandsError('Model name is required.');
      return;
    }

    setBrandsLoading(true);
    try {
      await api.admin.createModel(selectedMakeId, name);
      setNewModelName('');
      const updatedModels = await api.admin.models(selectedMakeId);
      setModels(updatedModels);
    } catch (e) {
      setBrandsError(e.message || 'Failed to create model');
    } finally {
      setBrandsLoading(false);
    }
  };

  return (
    <aside
      className="admin-sidebar-hide-on-tablet"
      style={{
        width: 260,
        background: 'var(--blue-dark)',
        color: 'white',
        padding: 20,
        position: 'sticky',
        top: 0,
        height: '100vh',
        overflowY: 'auto',
      }}
    >
      <Link to="/admin" style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
        <div
          style={{
            width: 38,
            height: 38,
            borderRadius: '50%',
            background: 'var(--white)',
            color: 'var(--blue-dark)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 800,
          }}
        >
          C
        </div>
        <div style={{ lineHeight: 1.1 }}>
          <div style={{ fontWeight: 800, fontSize: '1.05rem' }}>ChryslerStellantis</div>
          <div style={{ fontSize: '0.8125rem', opacity: 0.85 }}>Admin Dashboard</div>
        </div>
      </Link>

      <nav style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {(() => {
          const dashboard = items[0];
          const rest = items.slice(1);

          const renderLink = ({ to, label, icon: Icon }) => {
            const isActive = to === '/admin' ? location.pathname === '/admin' : location.pathname.startsWith(to);
            return (
              <Link
                key={to}
                to={to}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  padding: '10px 12px',
                  borderRadius: 10,
                  background: isActive ? 'rgba(255,255,255,0.14)' : 'transparent',
                  color: 'rgba(255,255,255,0.92)',
                  fontWeight: 600,
                }}
              >
                <Icon />
                {label}
              </Link>
            );
          };

          return (
            <>
              {renderLink(dashboard)}
              <div style={{ marginTop: 6 }}>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    padding: '10px 12px',
                    borderRadius: 10,
                    color: 'rgba(255,255,255,0.92)',
                    fontWeight: 700,
                    cursor: 'default',
                    userSelect: 'none',
                  }}
                >
                  <FaCar />
                  Cars
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginLeft: 10 }}>
                  <Link
                    to="/admin/listings"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 10,
                      padding: '10px 12px',
                      borderRadius: 10,
                      background: location.pathname === '/admin/listings' ? 'rgba(255,255,255,0.14)' : 'transparent',
                      color: 'rgba(255,255,255,0.92)',
                      fontWeight: 600,
                      fontSize: 'inherit',
                    }}
                  >
                    <FaListUl />
                    Listings
                  </Link>

                  <button
                    type="button"
                    onClick={() => setBrandsOpen(true)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 10,
                      padding: '10px 12px',
                      borderRadius: 10,
                      background: brandsOpen ? 'rgba(255,255,255,0.14)' : 'transparent',
                      color: 'rgba(255,255,255,0.92)',
                      fontWeight: 600,
                      border: 'none',
                      cursor: 'pointer',
                      textAlign: 'left',
                      fontSize: 'inherit',
                    }}
                    aria-haspopup="dialog"
                  >
                    <FaBuilding />
                    Brands
                  </button>
                </div>
              </div>
              {rest.map(renderLink)}
            </>
          );
        })()}
      </nav>

      <div style={{ marginTop: 18, borderTop: '1px solid rgba(255,255,255,0.15)', paddingTop: 16 }}>
        <Link to="/" style={{ display: 'inline-flex', padding: '10px 12px', borderRadius: 10, background: 'rgba(255,255,255,0.12)', color: 'white', fontWeight: 700 }}>
          View Site
        </Link>
      </div>

      {brandsOpen && (
        <div
          className="modal-overlay"
          role="dialog"
          aria-modal="true"
          style={{
            zIndex: 10000,
            position: 'fixed',
            inset: 0,
          }}
        >
          <div
            className="modal-panel"
            style={{ width: 'min(980px, 92vw)', zIndex: 10001, position: 'relative' }}
            onMouseDown={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--gray-900)', marginBottom: 0 }}>Brands</h2>
                <button type="button" className="modal-close" onClick={closeBrands}>
                  <FaTimes />
                </button>
              </div>
            </div>

            <div className="modal-body">
              {brandsError && <p style={{ color: 'crimson', marginBottom: 16 }}>{brandsError}</p>}

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div className="card" style={{ padding: 16, boxShadow: 'none' }}>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: 12 }}>Create Make</h3>
                  <input
                    value={newMakeName}
                    onChange={(e) => setNewMakeName(e.target.value)}
                    placeholder="e.g. Toyota"
                    style={{ width: '100%', padding: '10px 12px', borderRadius: 6, border: '1px solid var(--gray-200)' }}
                  />
                  <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 12 }}>
                    <button type="button" className="btn btn-primary" onClick={createMake} disabled={brandsLoading}>
                      <FaPlus /> Create Make
                    </button>
                  </div>
                </div>

                <div className="card" style={{ padding: 16, boxShadow: 'none' }}>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: 12 }}>Create Model</h3>
                  <select
                    value={selectedMakeId}
                    onChange={(e) => setSelectedMakeId(e.target.value)}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: 6, border: '1px solid var(--gray-200)', marginBottom: 12 }}
                  >
                    <option value="">Select a make</option>
                    {makes.map((m) => (
                      <option key={m.id} value={m.id}>{m.name}</option>
                    ))}
                  </select>

                  <input
                    value={newModelName}
                    onChange={(e) => setNewModelName(e.target.value)}
                    placeholder="e.g. Corolla"
                    style={{ width: '100%', padding: '10px 12px', borderRadius: 6, border: '1px solid var(--gray-200)' }}
                  />

                  <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 12 }}>
                    <button type="button" className="btn btn-primary" onClick={createModel} disabled={brandsLoading}>
                      <FaPlus /> Create Model
                    </button>
                  </div>

                  {models.length > 0 && (
                    <div style={{ marginTop: 16 }}>
                      <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: 8 }}>Models in this Make</h4>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                        {models.map((mo) => (
                          <span key={mo.id} style={{ padding: '6px 10px', borderRadius: 999, background: 'var(--gray-100)', color: 'var(--gray-700)', fontWeight: 600, fontSize: '0.875rem' }}>
                            {mo.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}

