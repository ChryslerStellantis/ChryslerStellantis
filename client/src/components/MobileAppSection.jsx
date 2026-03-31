const phoneImg = 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=300&q=80';

export default function MobileAppSection() {
  return (
    <section style={{ background: 'var(--blue-dark)', padding: '48px 0', color: 'var(--white)' }}>
      <div className="container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 48, alignItems: 'center' }}>
        <div>
          <img src={phoneImg} alt="App on phone" style={{ maxWidth: 220, margin: '0 auto' }} />
        </div>
        <div style={{ textAlign: 'center' }}>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: 16 }}>Get Mobile App For Carlist</h2>
          <p style={{ opacity: 0.9, marginBottom: 24 }}>Download our app for free on the App Store and Google Play. List and browse cars on the go.</p>
          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href="#" style={{ display: 'inline-block', background: 'var(--white)', color: 'var(--blue-dark)', padding: '12px 24px', borderRadius: 8, fontWeight: 600 }}>Download on the App Store</a>
            <a href="#" style={{ display: 'inline-block', background: 'var(--white)', color: 'var(--blue-dark)', padding: '12px 24px', borderRadius: 8, fontWeight: 600 }}>Get it on Google Play</a>
          </div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: 120, height: 120, background: 'var(--white)', margin: '0 auto', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--gray-700)', fontSize: '0.75rem' }}>
            QR Code
          </div>
          <p style={{ marginTop: 8, fontSize: '0.875rem', opacity: 0.9 }}>Scan to download</p>
        </div>
      </div>
    </section>
  );
}
