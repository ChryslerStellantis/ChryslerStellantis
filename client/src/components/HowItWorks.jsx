import { FaSearch, FaBalanceScale, FaMoneyBillWave, FaCar } from 'react-icons/fa';

const steps = [
  { icon: FaSearch, title: 'Research', text: 'Find your car from our wide selection.' },
  { icon: FaBalanceScale, title: 'Compare', text: 'Compare prices and features easily.' },
  { icon: FaMoneyBillWave, title: 'Deal', text: 'Negotiate and close the deal securely.' },
  { icon: FaCar, title: 'Drive', text: 'Get your car and start driving.' },
];

export default function HowItWorks() {
  return (
    <section style={{ padding: '48px 0', background: 'var(--gray-50)' }}>
      <div className="container">
        <h2 className="section-title" style={{ textAlign: 'center', marginBottom: 40 }}>How it works</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 32 }}>
          {steps.map(({ icon: Icon, title, text }) => (
            <div key={title} style={{ textAlign: 'center' }}>
              <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'var(--blue-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', color: 'var(--blue-primary)' }}>
                <Icon size={32} />
              </div>
              <h3 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: 8 }}>{title}</h3>
              <p style={{ fontSize: '0.9375rem', color: 'var(--gray-600)' }}>{text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
