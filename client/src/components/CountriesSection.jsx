import { useState, useEffect } from 'react';
import { api } from '../api';

const flagBase = 'https://flagcdn.com/w80/';
const targetCountries = [
  { name: 'Japan', code: 'JP' },
  { name: 'Vietnam', code: 'VN' },
  { name: 'Thailand', code: 'TH' },
  { name: 'Canada', code: 'CA' },
  { name: 'USA', code: 'US' },
  { name: 'China', code: 'CN' },
  { name: 'Korea', code: 'KR' },
  { name: 'Taiwan', code: 'TW' },
  { name: 'Germany', code: 'DE' },
  { name: 'Russia', code: 'RU' },
  { name: 'Brazil', code: 'BR' },
  { name: 'Kenya', code: 'KE' },
  { name: 'Ghana', code: 'GH' },
  { name: 'Rwanda', code: 'RW' },
];

export default function CountriesSection() {
  const [countries, setCountries] = useState([]);

  useEffect(() => {
    api.countries().then(setCountries).catch(() => setCountries([]));
  }, []);

  const countriesByCode = new Map(
    countries
      .filter((c) => c?.code)
      .map((c) => [String(c.code).toUpperCase(), c])
  );

  const countriesByName = new Map(
    countries
      .filter((c) => c?.name)
      .map((c) => [String(c.name).trim().toLowerCase(), c])
  );

  const visibleCountries = targetCountries.map((target, idx) => {
    const fromCode = countriesByCode.get(target.code);
    const fromName = countriesByName.get(target.name.toLowerCase());
    const fromDb = fromCode || fromName;
    return {
      id: fromDb?.id || `target-${idx}`,
      name: target.name,
      code: target.code,
      flag_url: fromDb?.flag_url || '',
    };
  });

  return (
    <section style={{ padding: '48px 0' }}>
      <div className="container">
        <h2 className="section-title" style={{ textAlign: 'center', marginBottom: 32 }}>Cars In Any Country</h2>
        <div style={{ display: 'flex', gap: 24, overflowX: 'auto', paddingBottom: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
          {visibleCountries.map((c) => (
            <div key={c.id} style={{ textAlign: 'center', minWidth: 100 }}>
              <img
                src={c.flag_url || `${flagBase}${c.code.toLowerCase().slice(0, 2)}.png`}
                alt=""
                style={{ width: 64, height: 48, objectFit: 'cover', borderRadius: 4, margin: '0 auto 8px' }}
              />
              <span style={{ fontSize: '0.875rem', fontWeight: 500 }}>{c.name}</span>
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 16 }}>
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--blue-primary)' }} />
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--gray-200)' }} />
        </div>
      </div>
    </section>
  );
}
