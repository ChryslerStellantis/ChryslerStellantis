import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api';

const placeholder = 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=400&q=80';

function formatDate(d) {
  if (!d) return '';
  const date = new Date(d);
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}

function toTime(d) {
  const t = d ? new Date(d).getTime() : 0;
  return Number.isFinite(t) ? t : 0;
}

export default function LatestNews() {
  const [posts, setPosts] = useState([]);
  const [showAllPostsPopover, setShowAllPostsPopover] = useState(false);

  useEffect(() => {
    api.blog.list().then(setPosts).catch(() => setPosts([]));
  }, []);

  useEffect(() => {
    if (!showAllPostsPopover) return undefined;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [showAllPostsPopover]);

  const sortedPosts = [...posts].sort((a, b) => toTime(b.published_at || b.created_at) - toTime(a.published_at || a.created_at));
  const visiblePosts = sortedPosts.slice(0, 4);

  return (
    <section style={{ padding: '48px 0' }}>
      <div className="container">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, marginBottom: 32 }}>
          <h2 className="section-title" style={{ marginBottom: 0 }}>Blog</h2>
          <button
            type="button"
            onClick={() => setShowAllPostsPopover(true)}
            style={{ fontWeight: 700, color: 'var(--blue-primary)', background: 'none', border: 'none', padding: 0 }}
          >
            Read All
          </button>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 24 }}>
          {visiblePosts.map((post) => (
            <Link key={post.id} to={`/blog/${post.slug}`} className="card" style={{ display: 'block' }}>
              <div style={{ aspectRatio: '16/10', background: 'var(--gray-100)', overflow: 'hidden' }}>
                <img src={post.image_url || placeholder} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <div style={{ padding: 20 }}>
                <p style={{ fontSize: '0.875rem', color: 'var(--gray-500)', marginBottom: 8 }}>{formatDate(post.published_at || post.created_at)}</p>
                <h3 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: 8 }}>{post.title}</h3>
                <p style={{ fontSize: '0.9375rem', color: 'var(--gray-600)', marginBottom: 12, lineHeight: 1.5 }}>{post.excerpt || 'Read more...'}</p>
                <span style={{ fontWeight: 600, color: 'var(--blue-primary)' }}>Read More</span>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {showAllPostsPopover && (
        <div
          className="modal-overlay"
          role="dialog"
          aria-modal="true"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) setShowAllPostsPopover(false);
          }}
        >
          <div className="modal-panel" style={{ width: 'min(1280px, 90vw)' }} onMouseDown={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
                <h2 className="section-title" style={{ marginBottom: 0 }}>Blog</h2>
                <button type="button" className="modal-close" onClick={() => setShowAllPostsPopover(false)}>Close</button>
              </div>
            </div>
            <div className="modal-body">
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 24 }}>
                {sortedPosts.map((post) => (
                  <Link key={post.id} to={`/blog/${post.slug}`} className="card" style={{ display: 'block' }} onClick={() => setShowAllPostsPopover(false)}>
                    <div style={{ aspectRatio: '16/10', background: 'var(--gray-100)', overflow: 'hidden' }}>
                      <img src={post.image_url || placeholder} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                    <div style={{ padding: 20 }}>
                      <p style={{ fontSize: '0.875rem', color: 'var(--gray-500)', marginBottom: 8 }}>{formatDate(post.published_at || post.created_at)}</p>
                      <h3 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: 8 }}>{post.title}</h3>
                      <p style={{ fontSize: '0.9375rem', color: 'var(--gray-600)', marginBottom: 12, lineHeight: 1.5 }}>{post.excerpt || 'Read more...'}</p>
                      <span style={{ fontWeight: 600, color: 'var(--blue-primary)' }}>Read More</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
