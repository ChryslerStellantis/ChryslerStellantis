import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api';

const placeholder = 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=400&q=80';

function formatDate(d) {
  if (!d) return '';
  return new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}

export default function Blog() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    api.blog.list().then(setPosts).catch(() => setPosts([]));
  }, []);

  return (
    <div style={{ padding: '48px 0' }}>
      <div className="container">
        <h1 className="section-title" style={{ marginBottom: 32 }}>Latest News</h1>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 24 }}>
          {posts.map((post) => (
            <Link key={post.id} to={`/blog/${post.slug}`} className="card" style={{ display: 'block' }}>
              <div style={{ aspectRatio: '16/10', background: 'var(--gray-100)', overflow: 'hidden' }}>
                <img src={post.image_url || placeholder} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <div style={{ padding: 20 }}>
                <p style={{ fontSize: '0.875rem', color: 'var(--gray-500)', marginBottom: 8 }}>{formatDate(post.published_at || post.created_at)}</p>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: 8 }}>{post.title}</h2>
                <p style={{ color: 'var(--gray-600)', lineHeight: 1.5 }}>{post.excerpt || 'Read more...'}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
