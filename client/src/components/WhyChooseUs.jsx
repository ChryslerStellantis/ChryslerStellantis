const features = [
  {
    title: 'Verified Quality',
    text: 'Every listed vehicle is carefully inspected and validated, so you can buy with confidence.',
    bg: '#f0f7ff',
    border: '#cfe3fb',
    titleColor: '#1e3a5f',
  },
  {
    title: 'Transparent Pricing',
    text: 'No hidden charges. You get clear pricing details and fair market value from the start.',
    bg: '#f2fbf5',
    border: '#cfeeda',
    titleColor: '#1b5e3c',
  },
  {
    title: 'Trusted Guidance',
    text: 'Our specialists support you through discovery, comparison, and final decision making.',
    bg: '#fff8ef',
    border: '#f5dfbf',
    titleColor: '#7a4b11',
  },
  {
    title: 'Fast, Secure Process',
    text: 'From inquiry to paperwork, we streamline every step for a safe and stress-free experience.',
    bg: '#f8f2ff',
    border: '#e5d5f8',
    titleColor: '#50307a',
  },
];

export default function WhyChooseUs() {
  return (
    <section style={{ padding: '48px 0' }}>
      <div className="container">
        <div style={{ maxWidth: 760, margin: '0 auto 32px', textAlign: 'center' }}>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: 12, color: 'var(--gray-900)' }}>Why Choose Us?</h2>
          <p style={{ color: 'var(--gray-600)', lineHeight: 1.6 }}>
            We help customers make smarter car decisions with trusted listings, transparent details, and dedicated support.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: 24 }}>
          {features.map(({ title, text, bg, border, titleColor }) => (
            <div
              key={title}
              style={{
                background: bg,
                border: `1px solid ${border}`,
                borderRadius: 'var(--radius-lg)',
                boxShadow: '0 8px 20px rgba(30, 58, 95, 0.08)',
                padding: '24px 18px',
                textAlign: 'center',
              }}
            >
              <h3 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: 10, color: titleColor }}>{title}</h3>
              <p style={{ fontSize: '0.9375rem', color: 'var(--gray-600)', lineHeight: 1.6 }}>{text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
