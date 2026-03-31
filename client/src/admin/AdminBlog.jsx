import { useState, useEffect } from 'react';
import { api } from '../api';
import { FaEye, FaPen, FaTrash, FaToggleOn, FaToggleOff } from 'react-icons/fa';

export default function AdminBlog() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showAdd, setShowAdd] = useState(false);
  const [creating, setCreating] = useState(false);
  const [addError, setAddError] = useState('');

  const [form, setForm] = useState({
    title: '',
    excerpt: '',
    content: '',
    published: false,
  });

  const [imageFile, setImageFile] = useState(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState('');

  const [showEdit, setShowEdit] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editingError, setEditingError] = useState('');
  const [editingImageFile, setEditingImageFile] = useState(null);
  const [editingImagePreviewUrl, setEditingImagePreviewUrl] = useState('');
  const [editForm, setEditForm] = useState({
    title: '',
    excerpt: '',
    content: '',
    published: false,
    image_url: '',
  });

  useEffect(() => {
    api.admin.blog().then(setPosts).catch(() => setPosts([])).finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!imageFile) {
      setImagePreviewUrl('');
      return undefined;
    }
    const url = URL.createObjectURL(imageFile);
    setImagePreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [imageFile]);

  useEffect(() => {
    if (!editingImageFile) {
      setEditingImagePreviewUrl('');
      return undefined;
    }
    const url = URL.createObjectURL(editingImageFile);
    setEditingImagePreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [editingImageFile]);

  const closeAdd = () => setShowAdd(false);

  const openAdd = () => {
    setAddError('');
    setCreating(false);
    setForm({ title: '', excerpt: '', content: '', published: false });
    setImageFile(null);
    setShowAdd(true);
  };

  const submitAdd = async (e) => {
    e.preventDefault();
    setAddError('');

    const title = form.title.trim();
    if (!title) {
      setAddError('Title is required.');
      return;
    }

    setCreating(true);
    try {
      const fd = new FormData();
      fd.append('title', title);
      if (form.excerpt) fd.append('excerpt', form.excerpt);
      if (form.content) fd.append('content', form.content);
      fd.append('published', form.published ? '1' : '0');
      if (imageFile) fd.append('image', imageFile);

      await api.admin.createBlogWithImage(fd);
      closeAdd();
      const updated = await api.admin.blog();
      setPosts(updated);
    } catch (err) {
      setAddError(err.message || 'Failed to add post');
    } finally {
      setCreating(false);
    }
  };

  const deletePost = async (id) => {
    if (!confirm('Delete this post?')) return;
    try {
      await api.admin.deleteBlog(id);
      setPosts((prev) => prev.filter((p) => p.id !== id));
    } catch (e) {
      alert(e.message);
    }
  };

  const togglePublished = async (post, nextValue) => {
    try {
      await api.admin.updateBlog(post.id, { published: nextValue });
      setPosts((prev) =>
        prev.map((p) => {
          if (p.id !== post.id) return p;
          return { ...p, published_at: nextValue ? new Date().toISOString() : null };
        })
      );
    } catch (e) {
      alert(e.message);
    }
  };

  const closeEdit = () => {
    setShowEdit(false);
    setEditingId(null);
    setEditingError('');
    setEditingImageFile(null);
    setEditingImagePreviewUrl('');
    setEditForm({ title: '', excerpt: '', content: '', published: false, image_url: '' });
  };

  const openEdit = async (post) => {
    setEditingError('');
    setEditingId(post.id);
    setEditingImageFile(null);
    setEditingImagePreviewUrl('');
    setEditForm({
      title: post.title || '',
      excerpt: post.excerpt || '',
      content: post.content || '',
      published: Boolean(post.published_at),
      image_url: post.image_url || '',
    });

    // Fetch from DB to ensure image_url is up-to-date.
    try {
      const fresh = await api.admin.blog();
      const row = fresh.find((x) => x.id === post.id);
      if (row) {
        setEditForm({
          title: row.title || '',
          excerpt: row.excerpt || '',
          content: row.content || '',
          published: Boolean(row.published_at),
          image_url: row.image_url || '',
        });
      }
    } catch {
      // If refetch fails, keep the initial payload.
    }

    setShowEdit(true);
  };

  const submitEdit = async (e) => {
    e.preventDefault();
    if (!editingId) return;
    setEditingError('');
    const title = editForm.title.trim();
    if (!title) {
      setEditingError('Title is required.');
      return;
    }

    try {
      const fd = new FormData();
      fd.append('title', title);
      if (editForm.excerpt) fd.append('excerpt', editForm.excerpt);
      if (editForm.content) fd.append('content', editForm.content);
      fd.append('published', editForm.published ? '1' : '0');
      // Always send image_url to preserve/clear.
      fd.append('image_url', editForm.image_url || '');
      if (editingImageFile) fd.append('image', editingImageFile);

      await api.admin.updateBlogWithImage(editingId, fd);
      closeEdit();
      const updated = await api.admin.blog();
      setPosts(updated);
    } catch (err) {
      setEditingError(err.message || 'Failed to update post');
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap', marginBottom: 32 }}>
        <h1 className="section-title" style={{ marginBottom: 0 }}>Blog Posts</h1>
        <button type="button" className="btn btn-primary" onClick={openAdd}>Add Post</button>
      </div>
      <div style={{ overflowX: 'auto' }} className="card">
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: 'var(--gray-100)' }}>
              <th style={{ padding: 12, textAlign: 'left' }}>Title</th>
              <th style={{ padding: 12, textAlign: 'left' }}>Published</th>
              <th style={{ padding: 12, textAlign: 'left' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {posts.map((p) => (
              <tr key={p.id} style={{ borderTop: '1px solid var(--gray-200)' }}>
                <td style={{ padding: 12 }}>{p.title}</td>
                <td style={{ padding: 12 }}>{p.published_at ? new Date(p.published_at).toLocaleDateString() : 'Draft'}</td>
                <td style={{ padding: 12 }}>
                  <a
                    href={`/blog/${p.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    title="View"
                    aria-label="View"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: 34,
                      height: 34,
                      borderRadius: 'var(--radius)',
                      color: 'var(--blue-primary)',
                      background: 'var(--gray-100)',
                      marginRight: 8,
                      textDecoration: 'none',
                    }}
                  >
                    <FaEye />
                  </a>

                  <button
                    type="button"
                    onClick={() => togglePublished(p, !p.published_at)}
                    title={p.published_at ? 'Unpublish' : 'Publish'}
                    aria-label={p.published_at ? 'Unpublish' : 'Publish'}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: 34,
                      height: 34,
                      borderRadius: 'var(--radius)',
                      border: 'none',
                      background: 'var(--gray-100)',
                      color: p.published_at ? 'var(--green)' : 'var(--gray-500)',
                      marginRight: 8,
                    }}
                  >
                    {p.published_at ? <FaToggleOn /> : <FaToggleOff />}
                  </button>

                  <button
                    type="button"
                    onClick={() => openEdit(p)}
                    title="Edit"
                    aria-label="Edit"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: 34,
                      height: 34,
                      borderRadius: 'var(--radius)',
                      border: 'none',
                      background: 'var(--gray-100)',
                      color: 'var(--blue-primary)',
                      marginRight: 8,
                    }}
                  >
                    <FaPen />
                  </button>

                  <button
                    type="button"
                    onClick={() => deletePost(p.id)}
                    title="Delete"
                    aria-label="Delete"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: 34,
                      height: 34,
                      borderRadius: 'var(--radius)',
                      border: 'none',
                      background: 'var(--gray-100)',
                      color: 'crimson',
                    }}
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showAdd && (
        <div className="modal-overlay" role="dialog" aria-modal="true">
          <div className="modal-panel" style={{ width: 'min(1100px, 92vw)' }} onMouseDown={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--gray-900)' }}>Add Post</h2>
                <button type="button" className="modal-close" onClick={closeAdd}>Close</button>
              </div>
              {addError && <p style={{ color: 'crimson', marginTop: 10 }}>{addError}</p>}
            </div>

            <form onSubmit={submitAdd} className="modal-body" style={{ background: 'var(--gray-50)' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={{ display: 'block', marginBottom: 8, fontWeight: 500 }}>Title *</label>
                  <input
                    value={form.title}
                    onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: 6, border: '1px solid var(--gray-200)' }}
                    required
                  />
                </div>

                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={{ display: 'block', marginBottom: 8, fontWeight: 500 }}>Excerpt</label>
                  <textarea
                    value={form.excerpt}
                    onChange={(e) => setForm((f) => ({ ...f, excerpt: e.target.value }))}
                    rows={3}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: 6, border: '1px solid var(--gray-200)' }}
                  />
                </div>

                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={{ display: 'block', marginBottom: 8, fontWeight: 500 }}>Content</label>
                  <textarea
                    value={form.content}
                    onChange={(e) => setForm((f) => ({ ...f, content: e.target.value }))}
                    rows={5}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: 6, border: '1px solid var(--gray-200)' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: 8, fontWeight: 500 }}>Published</label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, paddingTop: 12 }}>
                    <input
                      type="checkbox"
                      checked={form.published}
                      onChange={(e) => setForm((f) => ({ ...f, published: e.target.checked }))}
                      style={{ width: 18, height: 18 }}
                    />
                    <span style={{ color: 'var(--gray-700)' }}>{form.published ? 'Yes' : 'No'}</span>
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: 8, fontWeight: 500 }}>Post Image</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                    style={{ width: '100%' }}
                  />
                  {imagePreviewUrl && (
                    <div style={{ marginTop: 12 }}>
                      <img
                        src={imagePreviewUrl}
                        alt="Post preview"
                        style={{ width: '100%', borderRadius: 'var(--radius-lg)', border: '1px solid var(--gray-200)', background: 'var(--gray-50)' }}
                      />
                      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 10 }}>
                        <button type="button" className="btn" style={{ background: 'var(--gray-100)' }} onClick={() => setImageFile(null)}>
                          Remove
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 20 }}>
                <button type="button" className="btn" style={{ background: 'var(--gray-100)' }} onClick={closeAdd} disabled={creating}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={creating}>
                  {creating ? 'Adding...' : 'Add Post'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showEdit && (
        <div className="modal-overlay" role="dialog" aria-modal="true">
          <div className="modal-panel" style={{ width: 'min(1100px, 92vw)' }} onMouseDown={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--gray-900)' }}>Edit Post</h2>
                <button type="button" className="modal-close" onClick={closeEdit}>Close</button>
              </div>
              {editingError && <p style={{ color: 'crimson', marginTop: 10 }}>{editingError}</p>}
            </div>

            <form onSubmit={submitEdit} className="modal-body" style={{ background: 'var(--gray-50)' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={{ display: 'block', marginBottom: 8, fontWeight: 500 }}>Title *</label>
                  <input
                    value={editForm.title}
                    onChange={(e) => setEditForm((f) => ({ ...f, title: e.target.value }))}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: 6, border: '1px solid var(--gray-200)' }}
                    required
                  />
                </div>

                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={{ display: 'block', marginBottom: 8, fontWeight: 500 }}>Excerpt</label>
                  <textarea
                    value={editForm.excerpt}
                    onChange={(e) => setEditForm((f) => ({ ...f, excerpt: e.target.value }))}
                    rows={3}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: 6, border: '1px solid var(--gray-200)' }}
                  />
                </div>

                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={{ display: 'block', marginBottom: 8, fontWeight: 500 }}>Content</label>
                  <textarea
                    value={editForm.content}
                    onChange={(e) => setEditForm((f) => ({ ...f, content: e.target.value }))}
                    rows={5}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: 6, border: '1px solid var(--gray-200)' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: 8, fontWeight: 500 }}>Published</label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, paddingTop: 12 }}>
                    <input
                      type="checkbox"
                      checked={editForm.published}
                      onChange={(e) => setEditForm((f) => ({ ...f, published: e.target.checked }))}
                      style={{ width: 18, height: 18 }}
                    />
                    <span style={{ color: 'var(--gray-700)' }}>{editForm.published ? 'Yes' : 'No'}</span>
                  </div>
                </div>

                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={{ display: 'block', marginBottom: 8, fontWeight: 500 }}>Replace Post Image</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setEditingImageFile(e.target.files?.[0] || null)}
                    style={{ width: '100%' }}
                  />
                  <div style={{ marginTop: 12 }}>
                    {(editingImagePreviewUrl || editForm.image_url) && (
                      <img
                        src={editingImagePreviewUrl || editForm.image_url}
                        alt="Post preview"
                        style={{ width: '100%', borderRadius: 'var(--radius-lg)', border: '1px solid var(--gray-200)', background: 'var(--gray-50)' }}
                      />
                    )}
                  </div>
                  {(editingImagePreviewUrl || editForm.image_url) && (
                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 10 }}>
                      <button
                        type="button"
                        className="btn"
                        style={{ background: 'var(--gray-100)' }}
                        onClick={() => {
                          setEditingImageFile(null);
                          setEditingImagePreviewUrl('');
                          setEditForm((f) => ({ ...f, image_url: '' }));
                        }}
                      >
                        Remove
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 20 }}>
                <button type="button" className="btn" style={{ background: 'var(--gray-100)' }} onClick={closeEdit}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
