import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api';
import { FaChevronDown } from 'react-icons/fa';

const heroImage = 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1600&q=80';

export default function Hero() {
  const navigate = useNavigate();
  const [conditions, setConditions] = useState([]);
  const [conditionId, setConditionId] = useState('');
  const [make, setMake] = useState('');
  const [model, setModel] = useState('');
  const [minYear, setMinYear] = useState('');
  const [maxYear, setMaxYear] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [makes, setMakes] = useState([]);
  const [models, setModels] = useState([]);

  useEffect(() => {
    api.makes.list().then(setMakes).catch(() => {});
    api.conditions().then((rows) => {
      setConditions(rows);
      setConditionId('');
    }).catch(() => {});
    api.makes.allModels().then(setModels).catch(() => setModels([]));
  }, []);

  const handleMakeChange = (e) => {
    const val = e.target.value;
    setMake(val);
    setModel('');
    if (val) api.makes.models(val).then(setModels).catch(() => setModels([]));
    else api.makes.allModels().then(setModels).catch(() => setModels([]));
  };

  const years = [];
  for (let y = new Date().getFullYear(); y >= 1990; y--) years.push(y);

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (conditionId) params.set('conditionId', conditionId);
    if (make) params.set('make', make);
    if (model) params.set('model', model);
    if (minYear) params.set('minYear', minYear);
    if (maxYear) params.set('maxYear', maxYear);
    if (maxPrice) params.set('maxPrice', maxPrice);
    navigate('/cars?' + params.toString());
  };

  const formStyle = {
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'stretch',
    background: 'var(--white)',
    borderRadius: 'var(--radius-lg)',
    maxWidth: 1200,
    width: '100%',
    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
    border: '1px solid var(--gray-200)',
    overflow: 'hidden',
  };

  const fieldStyle = {
    flex: '1 1 0',
    minWidth: 150,
    padding: '16px 20px',
    borderRight: '1px solid var(--gray-200)',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    gap: 4,
  };

  const labelStyle = {
    fontSize: '0.75rem',
    color: 'var(--gray-500)',
    fontWeight: 500,
  };

  const selectStyle = {
    width: '100%',
    border: 'none',
    background: 'transparent',
    fontSize: '0.9375rem',
    fontWeight: 600,
    color: 'var(--blue-primary)',
    cursor: 'pointer',
    appearance: 'none',
    paddingRight: 20,
  };

  return (
    <section
      style={{
        position: 'relative',
        minHeight: 480,
        background: `linear-gradient(rgba(15,41,66,0.5), rgba(15,41,66,0.4)), url(${heroImage}) center/cover no-repeat`,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-end',
        color: 'white',
        padding: '120px 24px 24px',
      }}
    >
      <h1 className="hero-headline" style={{ fontSize: '2.5rem', fontWeight: 700, marginBottom: 24, textAlign: 'center', maxWidth: 700 }}>
        We make it simple to buy & sell cars.
      </h1>
      <form onSubmit={handleSearch} style={formStyle} className="hero-search">
        <div style={{ ...fieldStyle }} className="hero-field">
          <span style={labelStyle}>Condition</span>
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            <select value={conditionId} onChange={(e) => setConditionId(e.target.value)} style={selectStyle} aria-label="Condition">
              <option value="">All Conditions</option>
              {conditions.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
            <FaChevronDown size={14} style={{ position: 'absolute', right: 0, color: 'var(--gray-500)', pointerEvents: 'none' }} />
          </div>
        </div>
        <div style={{ ...fieldStyle }} className="hero-field">
          <span style={labelStyle}>Brand</span>
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            <select value={make} onChange={handleMakeChange} style={selectStyle} aria-label="Brand">
              <option value="">All Brands</option>
              {makes.map((m) => (
                <option key={m.id} value={m.slug}>{m.name}</option>
              ))}
            </select>
            <FaChevronDown size={14} style={{ position: 'absolute', right: 0, color: 'var(--gray-500)', pointerEvents: 'none' }} />
          </div>
        </div>
        <div style={{ ...fieldStyle }} className="hero-field">
          <span style={labelStyle}>Model</span>
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            <select value={model} onChange={(e) => setModel(e.target.value)} style={selectStyle} aria-label="Model">
              <option value="">All Models</option>
              {models.map((m) => (
                <option key={m.id} value={m.slug}>{m.name}</option>
              ))}
            </select>
            <FaChevronDown size={14} style={{ position: 'absolute', right: 0, color: 'var(--gray-500)', pointerEvents: 'none' }} />
          </div>
        </div>
        <div style={{ ...fieldStyle }} className="hero-field">
          <span style={labelStyle}>Min Year</span>
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            <select value={minYear} onChange={(e) => setMinYear(e.target.value)} style={selectStyle} aria-label="Min Year">
              <option value="">All Min Years</option>
              {years.map((y) => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
            <FaChevronDown size={14} style={{ position: 'absolute', right: 0, color: 'var(--gray-500)', pointerEvents: 'none' }} />
          </div>
        </div>
        <div style={{ ...fieldStyle }} className="hero-field">
          <span style={labelStyle}>Max Year</span>
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            <select value={maxYear} onChange={(e) => setMaxYear(e.target.value)} style={selectStyle} aria-label="Max Year">
              <option value="">All Max Years</option>
              {years.map((y) => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
            <FaChevronDown size={14} style={{ position: 'absolute', right: 0, color: 'var(--gray-500)', pointerEvents: 'none' }} />
          </div>
        </div>
        <div style={{ ...fieldStyle, borderRight: 'none', minWidth: 180 }} className="hero-field hero-max-price">
          <span style={labelStyle}>Max Price</span>
          <input
            type="number"
            inputMode="numeric"
            placeholder="Max price"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            aria-label="Max Price"
            style={{
              width: '100%',
              border: '1px solid var(--gray-200)',
              background: 'var(--white)',
              borderRadius: 8,
              padding: '10px 12px',
              fontSize: '0.9375rem',
              fontWeight: 600,
              color: 'var(--blue-primary)',
              outline: 'none',
            }}
          />
        </div>
        <div style={{ display: 'flex', alignItems: 'stretch' }} className="hero-actions">
          <button type="submit" className="btn btn-primary hero-search-btn" style={{ borderRadius: 0, padding: '0 32px', whiteSpace: 'nowrap' }}>
            Search
          </button>
        </div>
      </form>
    </section>
  );
}
