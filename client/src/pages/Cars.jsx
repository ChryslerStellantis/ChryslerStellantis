import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { api } from '../api';
import CarCard from '../components/CarCard';
import CountriesSection from '../components/CountriesSection';

export default function Cars() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [listings, setListings] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [makes, setMakes] = useState([]);
  const [models, setModels] = useState([]);
  const [conditions, setConditions] = useState([]);
  const [conditionId, setConditionId] = useState(searchParams.get('conditionId') || '');
  const [make, setMake] = useState(searchParams.get('make') || '');
  const [model, setModel] = useState(searchParams.get('model') || '');
  const [minYear, setMinYear] = useState(searchParams.get('minYear') || '');
  const [maxYear, setMaxYear] = useState(searchParams.get('maxYear') || '');
  const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || '');

  const showCountriesOnly = searchParams.get('showCountries') === '1';
  const [showCountriesPopover, setShowCountriesPopover] = useState(showCountriesOnly);

  useEffect(() => {
    api.makes.list().then(setMakes).catch(() => {});
    api.conditions().then(setConditions).catch(() => setConditions([]));
    api.makes.allModels().then(setModels).catch(() => setModels([]));
  }, []);

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  useEffect(() => {
    if (make) api.makes.models(make).then(setModels).catch(() => setModels([]));
    else api.makes.allModels().then(setModels).catch(() => setModels([]));
  }, [make]);

  useEffect(() => {
    setLoading(true);
    if (showCountriesOnly) return;
    const params = { limit: 20, offset: 0 };
    if (make) params.make = make;
    if (model) params.model = model;
    if (conditionId) params.conditionId = conditionId;
    if (minYear) params.minYear = minYear;
    if (maxYear) params.maxYear = maxYear;
    if (maxPrice) params.maxPrice = maxPrice;
    api.cars.list(params).then((r) => {
      setListings(r.listings);
      setTotal(r.total);
    }).catch(() => setListings([])).finally(() => setLoading(false));
  }, [make, model, conditionId, minYear, maxYear, maxPrice, showCountriesOnly]);

  useEffect(() => {
    if (showCountriesOnly) setShowCountriesPopover(true);
  }, [showCountriesOnly]);

  const close = () => {
    if (window.history.length > 1) navigate(-1);
    else navigate('/');
  };

  const closeCountriesPopover = () => {
    setShowCountriesPopover(false);
    if (window.history.length > 1) navigate(-1);
    else navigate('/');
  };

  const years = Array.from({ length: new Date().getFullYear() - 1990 + 1 }, (_, i) => new Date().getFullYear() - i);

  return (
    showCountriesPopover ? (
      <div
        className="modal-overlay"
        role="dialog"
        aria-modal="true"
        onMouseDown={(e) => {
          if (e.target === e.currentTarget) closeCountriesPopover();
        }}
      >
        <div
          className="modal-panel"
          style={{ width: 'min(1100px, 90vw)', height: 'auto' }}
          onMouseDown={(e) => e.stopPropagation()}
        >
          <div className="modal-body" style={{ padding: 0, background: 'var(--white)' }}>
            <div style={{ transform: 'scale(0.9)', transformOrigin: 'top center', display: 'inline-block', width: '100%' }}>
              <CountriesSection />
            </div>
          </div>
        </div>
      </div>
    ) : (
      <div
        className="modal-overlay"
        role="dialog"
        aria-modal="true"
        onMouseDown={(e) => {
          if (e.target === e.currentTarget) close();
        }}
      >
        <div className="modal-panel" onMouseDown={(e) => e.stopPropagation()}>
          <div className="modal-header">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
              <h1 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--gray-900)' }}>Browse Cars</h1>
              <button type="button" className="modal-close" onClick={close}>Close</button>
            </div>

            <div style={{ display: 'flex', gap: 12, marginTop: 12, flexWrap: 'wrap' }}>
              <select value={conditionId} onChange={(e) => setConditionId(e.target.value)} style={{ padding: '8px 12px', borderRadius: 'var(--radius)', border: '1px solid var(--gray-200)' }}>
                <option value="">All Conditions</option>
                {conditions.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
              <select value={make} onChange={(e) => setMake(e.target.value)} style={{ padding: '8px 12px', borderRadius: 'var(--radius)', border: '1px solid var(--gray-200)' }} aria-label="Brand">
                <option value="">All Brands</option>
                {makes.map((m) => <option key={m.id} value={m.slug}>{m.name}</option>)}
              </select>
              <select value={model} onChange={(e) => setModel(e.target.value)} style={{ padding: '8px 12px', borderRadius: 'var(--radius)', border: '1px solid var(--gray-200)' }}>
                <option value="">All Models</option>
                {models.map((m) => <option key={m.id} value={m.slug}>{m.name}</option>)}
              </select>
              <select value={minYear} onChange={(e) => setMinYear(e.target.value)} style={{ padding: '8px 12px', borderRadius: 'var(--radius)', border: '1px solid var(--gray-200)', minWidth: 110 }}>
                <option value="">All Min Years</option>
                {years.map((y) => <option key={y} value={y}>{y}</option>)}
              </select>
              <select value={maxYear} onChange={(e) => setMaxYear(e.target.value)} style={{ padding: '8px 12px', borderRadius: 'var(--radius)', border: '1px solid var(--gray-200)', minWidth: 110 }}>
                <option value="">All Max Years</option>
                {years.map((y) => <option key={y} value={y}>{y}</option>)}
              </select>
              <input type="number" placeholder="Max Price" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} style={{ padding: '8px 12px', borderRadius: 'var(--radius)', border: '1px solid var(--gray-200)', width: 140 }} />
            </div>
          </div>

          <div className="modal-body">
            {loading ? (
              <p>Loading...</p>
            ) : (
              <>
                <p style={{ marginBottom: 16, color: 'var(--gray-600)' }}>{total} car(s) found</p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 24 }}>
                  {listings.map((listing) => (
                    <CarCard key={listing.id} listing={listing} showSold />
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    )
  );
}
