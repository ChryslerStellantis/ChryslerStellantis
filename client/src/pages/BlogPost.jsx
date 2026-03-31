import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { api } from '../api';

function formatDate(d) {
  if (!d) return '';
  return new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}

export default function BlogPost() {
  const { slug } = useParams();
  const [post, setPost] = useState(null);

  useEffect(() => {
    api.blog.get(slug).then(setPost).catch(() => setPost(null));
  }, [slug]);

  if (!post) return <div className="container" style={{ padding: 48 }}><p>Loading...</p></div>;

  return (
    <article style={{ padding: '48px 0' }}>
      <div className="container" style={{ maxWidth: 720 }}>
        {post.image_url && <img src={post.image_url} alt="" style={{ width: '100%', borderRadius: 'var(--radius-lg)', marginBottom: 24 }} />}
        <p style={{ color: 'var(--gray-500)', marginBottom: 8 }}>{formatDate(post.published_at || post.created_at)}</p>
        <h1 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: 16 }}>{post.title}</h1>
        <div style={{ lineHeight: 1.7, color: 'var(--gray-700)', whiteSpace: 'pre-wrap' }}>{post.content || post.excerpt || 'No content.'}</div>
      </div>
    </article>
  );
}
