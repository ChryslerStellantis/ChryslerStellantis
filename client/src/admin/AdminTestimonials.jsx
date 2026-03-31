import { useEffect, useState } from 'react';
import { api } from '../api';
import { FaPen, FaPlus, FaTrash } from 'react-icons/fa';

export default function AdminTestimonials() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showAdd, setShowAdd] = useState(false);
  const [creating, setCreating] = useState(false);
  const [addError, setAddError] = useState('');

  const [form, setForm] = useState({
    name: '',
    location: '',
    content: '',
    rating: 5,
    display_order: 0,
  });

  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreviewUrl, setAvatarPreviewUrl] = useState('');

  const [showEdit, setShowEdit] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editingError, setEditingError] = useState('');

  const [editForm, setEditForm] = useState({
    name: '',
    location: '',
    content: '',
    rating: 5,
    display_order: 0,
    avatar_url: '',
  });

  const [editingAvatarFile, setEditingAvatarFile] = useState(null);
  const [editingAvatarPreviewUrl, setEditingAvatarPreviewUrl] = useState('');

  useEffect(() => {
    api.admin.testimonials().then(setItems).catch(() => setItems([])).finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!avatarFile) {
      setAvatarPreviewUrl('');
      return undefined;
    }
    const url = URL.createObjectURL(avatarFile);
    setAvatarPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [avatarFile]);

  useEffect(() => {
    if (!editingAvatarFile) {
      setEditingAvatarPreviewUrl('');
      return undefined;
    }
    const url = URL.createObjectURL(editingAvatarFile);
    setEditingAvatarPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [editingAvatarFile]);

  const closeAdd = () => setShowAdd(false);

  const openAdd = () => {
    setAddError('');
    setCreating(false);
    setForm({
      name: '',
      location: '',
      content: '',
      rating: 5,
      display_order: 0,
    });
    setAvatarFile(null);
    setAvatarPreviewUrl('');
    setShowAdd(true);
  };

  const submitAdd = async (e) => {
    e.preventDefault();
    setAddError('');

    const name = form.name.trim();
    const content = form.content.trim();
    const rating = Number.isFinite(Number(form.rating)) ? Number(form.rating) : 5;
    const displayOrder = Number.isFinite(Number(form.display_order)) ? Number(form.display_order) : 0;
    if (!name || !content) {
      setAddError('Name and content are required.');
      return;
    }

    setCreating(true);
    try {
      const fd = new FormData();
      fd.append('name', name);
      fd.append('location', form.location || '');
      fd.append('content', content);
      fd.append('rating', String(rating));
      fd.append('display_order', String(displayOrder));

      // Always send avatar_url so the server can clear it when empty.
      fd.append('avatar_url', '');
      if (avatarFile) fd.append('avatar', avatarFile);

      await api.admin.createTestimonialWithImage(fd);
      closeAdd();
      const updated = await api.admin.testimonials();
      setItems(updated);
    } catch (err) {
      setAddError(err.message || 'Failed to add testimonial');
    } finally {
      setCreating(false);
    }
  };

  const deleteTestimonial = async (id) => {
    if (!confirm('Delete this testimonial?')) return;
    try {
      await api.admin.deleteTestimonial(id);
      setItems((prev) => prev.filter((t) => t.id !== id));
    } catch (e) {
      alert(e.message);
    }
  };

  const closeEdit = () => {
    setShowEdit(false);
    setEditingId(null);
    setEditingError('');
    setEditingAvatarFile(null);
    setEditingAvatarPreviewUrl('');
    setEditForm({
      name: '',
      location: '',
      content: '',
      rating: 5,
      display_order: 0,
      avatar_url: '',
    });
  };

  const openEdit = (t) => {
    setEditingError('');
    setEditingId(t.id);
    setEditingAvatarFile(null);
    setEditingAvatarPreviewUrl('');
    setEditForm({
      name: t.name || '',
      location: t.location || '',
      content: t.content || '',
      rating: t.rating ?? 5,
      display_order: t.display_order ?? 0,
      avatar_url: t.avatar_url || '',
    });
    setShowEdit(true);
  };

  const submitEdit = async (e) => {
    e.preventDefault();
    if (!editingId) return;
    setEditingError('');

    const name = editForm.name.trim();
    const content = editForm.content.trim();
    const rating = Number.isFinite(Number(editForm.rating)) ? Number(editForm.rating) : 5;
    const displayOrder = Number.isFinite(Number(editForm.display_order)) ? Number(editForm.display_order) : 0;
    if (!name || !content) {
      setEditingError('Name and content are required.');
      return;
    }

    try {
      const fd = new FormData();
      fd.append('name', name);
      fd.append('location', editForm.location || '');
      fd.append('content', content);
      fd.append('rating', String(rating));
      fd.append('display_order', String(displayOrder));

      // Send avatar_url to preserve/clear.
      fd.append('avatar_url', editForm.avatar_url || '');
      if (editingAvatarFile) fd.append('avatar', editingAvatarFile);

      await api.admin.updateTestimonialWithImage(editingId, fd);
      closeEdit();
      const updated = await api.admin.testimonials();
      setItems(updated);
    } catch (err) {
      setEditingError(err.message || 'Failed to update testimonial');
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 16,
          flexWrap: 'wrap',
          marginBottom: 32,
        }}
      >
        <h1 className="section-title" style={{ marginBottom: 0 }}>Testimonials</h1>
        <button type="button" className="btn btn-primary" onClick={openAdd}>
          <FaPlus style={{ marginRight: 8 }} />Add Testimonial
        </button>
      </div>

      <div style={{ overflowX: 'auto' }} className="card">
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: 'var(--gray-100)' }}>
              <th style={{ padding: 12, textAlign: 'left' }}>Avatar</th>
              <th style={{ padding: 12, textAlign: 'left' }}>Name</th>
              <th style={{ padding: 12, textAlign: 'left' }}>Location</th>
              <th style={{ padding: 12, textAlign: 'left' }}>Content</th>
              <th style={{ padding: 12, textAlign: 'left' }}>Rating</th>
              <th style={{ padding: 12, textAlign: 'left' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((t) => (
              <tr key={t.id} style={{ borderTop: '1px solid var(--gray-200)' }}>
                <td style={{ padding: 12 }}>
                  {t.avatar_url ? (
                    <img
                      src={t.avatar_url}
                      alt="Avatar preview"
                      style={{ width: 40, height: 40, borderRadius: '50%', objectFit: 'cover', border: '1px solid var(--gray-200)' }}
                    />
                  ) : (
                    <span style={{ color: 'var(--gray-500)', fontSize: '0.875rem' }}>—</span>
                  )}
                </td>
                <td style={{ padding: 12 }}>{t.name}</td>
                <td style={{ padding: 12 }}>{t.location || '—'}</td>
                <td style={{ padding: 12, maxWidth: 320 }}>{t.content?.slice(0, 80)}...</td>
                <td style={{ padding: 12 }}>{t.rating}</td>
                <td style={{ padding: 12 }}>
                  <button
                    type="button"
                    onClick={() => openEdit(t)}
                    className="btn"
                    style={{
                      padding: '6px 12px',
                      fontSize: '0.875rem',
                      background: 'var(--gray-100)',
                      color: 'var(--blue-primary)',
                      border: 'none',
                      borderRadius: 'var(--radius)',
                      marginRight: 8,
                    }}
                  >
                    <FaPen style={{ marginRight: 8 }} />
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => deleteTestimonial(t.id)}
                    className="btn"
                    style={{
                      padding: '6px 12px',
                      fontSize: '0.875rem',
                      background: 'var(--gray-100)',
                      color: 'crimson',
                      border: 'none',
                      borderRadius: 'var(--radius)',
                    }}
                  >
                    <FaTrash style={{ marginRight: 8 }} />
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showAdd && (
        <div className="modal-overlay" role="dialog" aria-modal="true">
          <div className="modal-panel" style={{ width: 'min(900px, 92vw)' }} onMouseDown={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--gray-900)' }}>Add Testimonial</h2>
                <button type="button" className="modal-close" onClick={closeAdd}>Close</button>
              </div>
              {addError && <p style={{ color: 'crimson', marginTop: 10 }}>{addError}</p>}
            </div>

            <form onSubmit={submitAdd} className="modal-body" style={{ background: 'var(--gray-50)' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div>
                  <label style={{ display: 'block', marginBottom: 8, fontWeight: 500 }}>Name *</label>
                  <input
                    value={form.name}
                    onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: 6, border: '1px solid var(--gray-200)' }}
                    required
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: 8, fontWeight: 500 }}>Location</label>
                  <input
                    value={form.location}
                    onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: 6, border: '1px solid var(--gray-200)' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: 8, fontWeight: 500 }}>Rating</label>
                  <input
                    type="number"
                    value={form.rating}
                    onChange={(e) => setForm((f) => ({ ...f, rating: Number(e.target.value) }))}
                    min={0}
                    max={5}
                    step={1}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: 6, border: '1px solid var(--gray-200)' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: 8, fontWeight: 500 }}>Display Order</label>
                  <input
                    type="number"
                    value={form.display_order}
                    onChange={(e) => setForm((f) => ({ ...f, display_order: Number(e.target.value) }))}
                    step={1}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: 6, border: '1px solid var(--gray-200)' }}
                  />
                </div>

                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={{ display: 'block', marginBottom: 8, fontWeight: 500 }}>Content *</label>
                  <textarea
                    value={form.content}
                    onChange={(e) => setForm((f) => ({ ...f, content: e.target.value }))}
                    rows={5}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: 6, border: '1px solid var(--gray-200)' }}
                    required
                  />
                </div>

                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={{ display: 'block', marginBottom: 8, fontWeight: 500 }}>Avatar Image</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setAvatarFile(e.target.files?.[0] || null)}
                    style={{ width: '100%' }}
                  />

                  {avatarPreviewUrl && (
                    <div style={{ marginTop: 12 }}>
                      <img
                        src={avatarPreviewUrl}
                        alt="Avatar preview"
                        style={{ width: '100%', borderRadius: 'var(--radius-lg)', border: '1px solid var(--gray-200)', background: 'var(--gray-50)' }}
                      />
                      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 10 }}>
                        <button
                          type="button"
                          className="btn"
                          style={{ background: 'var(--gray-100)' }}
                          onClick={() => {
                            setAvatarFile(null);
                            setAvatarPreviewUrl('');
                          }}
                        >
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
                  {creating ? 'Adding...' : 'Add Testimonial'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showEdit && (
        <div className="modal-overlay" role="dialog" aria-modal="true">
          <div className="modal-panel" style={{ width: 'min(900px, 92vw)' }} onMouseDown={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--gray-900)' }}>Edit Testimonial</h2>
                <button type="button" className="modal-close" onClick={closeEdit}>Close</button>
              </div>
              {editingError && <p style={{ color: 'crimson', marginTop: 10 }}>{editingError}</p>}
            </div>

            <form onSubmit={submitEdit} className="modal-body" style={{ background: 'var(--gray-50)' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div>
                  <label style={{ display: 'block', marginBottom: 8, fontWeight: 500 }}>Name *</label>
                  <input
                    value={editForm.name}
                    onChange={(e) => setEditForm((f) => ({ ...f, name: e.target.value }))}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: 6, border: '1px solid var(--gray-200)' }}
                    required
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: 8, fontWeight: 500 }}>Location</label>
                  <input
                    value={editForm.location}
                    onChange={(e) => setEditForm((f) => ({ ...f, location: e.target.value }))}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: 6, border: '1px solid var(--gray-200)' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: 8, fontWeight: 500 }}>Rating</label>
                  <input
                    type="number"
                    value={editForm.rating}
                    onChange={(e) => setEditForm((f) => ({ ...f, rating: Number(e.target.value) }))}
                    min={0}
                    max={5}
                    step={1}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: 6, border: '1px solid var(--gray-200)' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: 8, fontWeight: 500 }}>Display Order</label>
                  <input
                    type="number"
                    value={editForm.display_order}
                    onChange={(e) => setEditForm((f) => ({ ...f, display_order: Number(e.target.value) }))}
                    step={1}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: 6, border: '1px solid var(--gray-200)' }}
                  />
                </div>

                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={{ display: 'block', marginBottom: 8, fontWeight: 500 }}>Content *</label>
                  <textarea
                    value={editForm.content}
                    onChange={(e) => setEditForm((f) => ({ ...f, content: e.target.value }))}
                    rows={5}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: 6, border: '1px solid var(--gray-200)' }}
                    required
                  />
                </div>

                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={{ display: 'block', marginBottom: 8, fontWeight: 500 }}>Replace Avatar</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setEditingAvatarFile(e.target.files?.[0] || null)}
                    style={{ width: '100%' }}
                  />

                  <div style={{ marginTop: 12 }}>
                    {(editingAvatarPreviewUrl || editForm.avatar_url) && (
                      <img
                        src={editingAvatarPreviewUrl || editForm.avatar_url}
                        alt="Avatar preview"
                        style={{ width: '100%', borderRadius: 'var(--radius-lg)', border: '1px solid var(--gray-200)', background: 'var(--gray-50)' }}
                      />
                    )}
                  </div>

                  {(editingAvatarPreviewUrl || editForm.avatar_url) && (
                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 10 }}>
                      <button
                        type="button"
                        className="btn"
                        style={{ background: 'var(--gray-100)' }}
                        onClick={() => {
                          setEditingAvatarFile(null);
                          setEditingAvatarPreviewUrl('');
                          setEditForm((f) => ({ ...f, avatar_url: '' }));
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
