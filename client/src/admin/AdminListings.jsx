import { useState, useEffect } from 'react';
import { api } from '../api';
import { FaEye, FaEdit, FaTrash, FaGripVertical, FaToggleOn, FaToggleOff } from 'react-icons/fa';

export default function AdminListings() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [adding, setAdding] = useState(false);
  const [addError, setAddError] = useState('');

  const [conditions, setConditions] = useState([]);
  const [makes, setMakes] = useState([]);
  const [models, setModels] = useState([]);

  const [form, setForm] = useState({
    condition_id: '',
    make_id: '',
    model_id: '',
    year: new Date().getFullYear(),
    price: '',
    mileage_km: '',
    transmission: 'Automatic',
    fuel_type: 'Petrol',
    location_city: '',
    location_country: '',
    description: '',
  });

  const [imageFile, setImageFile] = useState(null);
  const [addImagePreviewUrl, setAddImagePreviewUrl] = useState('');
  const [editImageFile, setEditImageFile] = useState(null);
  const [editImagePreviewUrl, setEditImagePreviewUrl] = useState('');
  const [draggingId, setDraggingId] = useState(null);
  const [dragOverId, setDragOverId] = useState(null);
  const [reordering, setReordering] = useState(false);

  const [showEdit, setShowEdit] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editError, setEditError] = useState('');
  const [editing, setEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    status: 'active',
    is_featured: false,
    condition_id: '',
    year: '',
    price: '',
    mileage_km: '',
    transmission: 'Automatic',
    fuel_type: 'Petrol',
    location_city: '',
    location_country: '',
    description: '',
    image_url: '',
  });

  useEffect(() => {
    api.admin.listings().then(setListings).catch(() => setListings([])).finally(() => setLoading(false));
  }, []);

  // Create/revoke a local preview URL for the Add Listing image upload.
  useEffect(() => {
    if (!imageFile) {
      setAddImagePreviewUrl('');
      return undefined;
    }
    const url = URL.createObjectURL(imageFile);
    setAddImagePreviewUrl(url);
    return () => {
      URL.revokeObjectURL(url);
    };
  }, [imageFile]);

  useEffect(() => {
    if (!editImageFile) {
      setEditImagePreviewUrl('');
      return undefined;
    }
    const url = URL.createObjectURL(editImageFile);
    setEditImagePreviewUrl(url);
    return () => {
      URL.revokeObjectURL(url);
    };
  }, [editImageFile]);

  useEffect(() => {
    if (!showAdd && !showEdit) return;
    api.conditions().then(setConditions).catch(() => setConditions([]));
    api.makes.list().then(setMakes).catch(() => setMakes([]));
  }, [showAdd, showEdit]);

  useEffect(() => {
    const make = makes.find((m) => String(m.id) === String(form.make_id));
    if (!make) {
      setModels([]);
      return;
    }
    api.makes.models(make.slug).then(setModels).catch(() => setModels([]));
  }, [form.make_id, makes]);

  useEffect(() => {
    if (!showAdd && !showEdit) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [showAdd, showEdit]);

  const updateStatus = async (id, status) => {
    try {
      await api.admin.updateListing(id, { status });
      setListings((prev) =>
        prev.map((l) => {
          if (l.id !== id) return l;
          return {
            ...l,
            status,
            is_featured: status === 'active' ? l.is_featured : 0,
          };
        })
      );
    } catch (e) {
      alert(e.message);
    }
  };

  const deleteListing = async (id) => {
    if (!confirm('Delete this listing?')) return;
    try {
      await api.admin.deleteListing(id);
      setListings((prev) => prev.filter((l) => l.id !== id));
    } catch (e) {
      alert(e.message);
    }
  };

  const reorderLocalList = (arr, fromIndex, toIndex) => {
    const next = [...arr];
    const [moved] = next.splice(fromIndex, 1);
    next.splice(toIndex, 0, moved);
    return next;
  };

  const onDragDropRow = async (targetId) => {
    if (!draggingId) return;
    if (reordering) return;

    const fromIndex = listings.findIndex((l) => l.id === draggingId);
    const toIndex = listings.findIndex((l) => l.id === targetId);
    if (fromIndex < 0 || toIndex < 0 || fromIndex === toIndex) return;

    const next = reorderLocalList(listings, fromIndex, toIndex);
    setListings(next);

    // Persist ordering so "top" appears first across public lists.
    setReordering(true);
    try {
      await api.admin.reorderListings(next.map((l) => l.id));
    } catch (e) {
      alert(e.message);
      await refresh();
    } finally {
      setReordering(false);
      setDragOverId(null);
      setDraggingId(null);
    }
  };

  if (loading) return <p>Loading...</p>;

  const refresh = async () => {
    setLoading(true);
    try {
      const rows = await api.admin.listings();
      setListings(rows);
    } finally {
      setLoading(false);
    }
  };

  const openAdd = () => {
    setAddError('');
    setImageFile(null);
    setModels([]);
    setForm({
      condition_id: '',
      make_id: '',
      model_id: '',
      year: new Date().getFullYear(),
      price: '',
      mileage_km: '',
      transmission: 'Automatic',
      fuel_type: 'Petrol',
      location_city: '',
      location_country: '',
      description: '',
    });
    setShowAdd(true);
  };

  const closeAdd = () => setShowAdd(false);

  const openEdit = (listing) => {
    setEditError('');
    setEditing(true);
    setEditingId(listing.id);
    setEditImageFile(null);
    const normalizedStatus = listing.status === 'featured' ? 'active' : (listing.status || 'active');
    setEditForm({
      status: normalizedStatus,
      is_featured: normalizedStatus === 'active' ? Boolean(listing.is_featured) : 0,
      condition_id: listing.condition_id != null ? String(listing.condition_id) : '',
      year: listing.year != null ? String(listing.year) : '',
      price: listing.price != null ? String(listing.price) : '',
      mileage_km: listing.mileage_km != null ? String(listing.mileage_km) : '',
      transmission: listing.transmission || 'Automatic',
      fuel_type: listing.fuel_type || 'Petrol',
      location_city: listing.location_city || '',
      location_country: listing.location_country || '',
      description: listing.description || '',
      image_url: listing.image_url || '',
    });
    setShowEdit(true);

    // Ensure image preview is sourced from the database.
    // (Admin listing rows sometimes lag or omit fields; this re-fetches the latest.)
    api.cars
      .get(listing.id)
      .then((car) => {
        const img = car?.image_url || '';
        setEditForm((f) => ({ ...f, image_url: img }));
      })
      .catch(() => {
        // Keep whatever we already have from the listings payload.
      });
  };

  const closeEdit = () => {
    setShowEdit(false);
    setEditing(false);
    setEditingId(null);
    setEditImageFile(null);
  };

  const toggleFeatured = async (listing, nextValue) => {
    // Featured is only allowed when status is active (legacy status "featured" treated as active)
    const normalizedStatus = listing.status === 'featured' ? 'active' : listing.status;
    if (normalizedStatus !== 'active') return;

    try {
      await api.admin.updateListing(listing.id, { status: 'active', is_featured: nextValue ? 1 : 0 });
      setListings((prev) =>
        prev.map((l) => (l.id === listing.id ? { ...l, status: 'active', is_featured: nextValue ? 1 : 0 } : l))
      );
    } catch (e) {
      alert(e.message);
    }
  };

  const submitEdit = async (e) => {
    e.preventDefault();
    if (!editingId) return;
    setEditError('');

    const requiredOk =
      editForm.condition_id &&
      editForm.year &&
      editForm.price &&
      editForm.transmission &&
      editForm.fuel_type;

    if (!requiredOk) {
      setEditError('Please fill all required fields (Condition, Year, Price, Transmission, Fuel Type).');
      return;
    }

    try {
      let finalImageUrl = editForm.image_url || null;
      if (editImageFile) {
        const fd = new FormData();
        fd.append('image', editImageFile);
        const up = await api.admin.uploadListingImage(editingId, fd);
        finalImageUrl = up.image_url || null;
      }

      const payload = {
        status: editForm.status,
        // Enforce rule: only active listings can be featured.
        is_featured: editForm.status === 'active' ? editForm.is_featured : 0,
        condition_id: Number(editForm.condition_id),
        year: Number(editForm.year),
        price: Number(editForm.price),
        mileage_km: editForm.mileage_km ? Number(editForm.mileage_km) : null,
        transmission: editForm.transmission,
        fuel_type: editForm.fuel_type,
        location_city: editForm.location_city || null,
        location_country: editForm.location_country || null,
        description: editForm.description || null,
        image_url: finalImageUrl,
      };

      await api.admin.updateListing(editingId, payload);
      closeEdit();
      await refresh();
    } catch (err) {
      setEditError(err.message || 'Failed to edit listing');
    }
  };

  const submitAdd = async (e) => {
    e.preventDefault();
    setAddError('');

    const requiredOk =
      form.condition_id &&
      form.make_id &&
      form.model_id &&
      form.year &&
      form.price &&
      form.transmission &&
      form.fuel_type;

    if (!requiredOk) {
      setAddError('Please fill all required fields (Condition, Make, Model, Year, Price, Transmission, Fuel Type).');
      return;
    }

    setAdding(true);
    try {
      const fd = new FormData();
      fd.append('condition_id', form.condition_id);
      fd.append('make_id', form.make_id);
      fd.append('model_id', form.model_id);
      fd.append('year', String(form.year));
      fd.append('price', String(form.price));
      if (form.mileage_km) fd.append('mileage_km', String(form.mileage_km));
      fd.append('transmission', form.transmission);
      fd.append('fuel_type', form.fuel_type);
      if (form.location_city) fd.append('location_city', form.location_city);
      if (form.location_country) fd.append('location_country', form.location_country);
      if (form.description) fd.append('description', form.description);
      if (imageFile) fd.append('image', imageFile);

      await api.cars.createWithImage(fd);
      closeAdd();
      await refresh();
    } catch (err) {
      setAddError(err.message || 'Failed to add listing');
    } finally {
      setAdding(false);
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, marginBottom: 32, flexWrap: 'wrap' }}>
        <h1 className="section-title" style={{ marginBottom: 0 }}>Listings</h1>
        <button type="button" className="btn btn-primary" onClick={openAdd}>Add New</button>
      </div>
      <div style={{ overflowX: 'auto' }} className="card">
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: 'var(--gray-100)' }}>
              <th style={{ padding: 12, textAlign: 'left', width: 48 }} aria-label="Reorder" />
              <th style={{ padding: 12, textAlign: 'left' }}>ID</th>
              <th style={{ padding: 12, textAlign: 'left' }}>Car</th>
              <th style={{ padding: 12, textAlign: 'left' }}>Price</th>
              <th style={{ padding: 12, textAlign: 'left' }}>Status</th>
              <th style={{ padding: 12, textAlign: 'left' }}>Featured</th>
              <th style={{ padding: 12, textAlign: 'left' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {listings.map((l) => (
              <tr
                key={l.id}
                style={{
                  borderTop: '1px solid var(--gray-200)',
                  background: dragOverId === l.id ? 'var(--gray-50)' : 'transparent',
                }}
                onDragOver={(e) => {
                  if (!draggingId || reordering) return;
                  e.preventDefault();
                  setDragOverId(l.id);
                }}
                onDrop={(e) => {
                  e.preventDefault();
                  void onDragDropRow(l.id);
                }}
              >
                <td style={{ padding: 12, width: 48 }}>
                  <span
                    draggable={!showAdd && !showEdit && !reordering}
                    onDragStart={(e) => {
                      if (showAdd || showEdit || reordering) return;
                      setDraggingId(l.id);
                      setDragOverId(l.id);
                      e.dataTransfer.effectAllowed = 'move';
                      e.dataTransfer.setData('text/plain', String(l.id));
                    }}
                    onDragEnd={() => {
                      setDraggingId(null);
                      setDragOverId(null);
                    }}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: 28,
                      height: 28,
                      borderRadius: 'var(--radius)',
                      cursor: 'grab',
                      background: 'var(--gray-100)',
                      color: 'var(--gray-700)',
                    }}
                    aria-label={`Drag listing ${l.id} to reorder`}
                    title="Drag to reorder"
                  >
                    <FaGripVertical />
                  </span>
                </td>
                <td style={{ padding: 12 }}>{l.id}</td>
                <td style={{ padding: 12 }}>{l.make_name} {l.model_name} {l.year}</td>
                <td style={{ padding: 12 }}>${Number(l.price).toLocaleString()}</td>
                <td style={{ padding: 12 }}>
                  <select
                    value={l.status === 'featured' ? 'active' : l.status}
                    onChange={(e) => updateStatus(l.id, e.target.value)}
                    style={{ padding: '6px 10px', borderRadius: 'var(--radius)', border: '1px solid var(--gray-200)', color: 'var(--gray-900)' }}
                  >
                    <option value="active">Active</option>
                    <option value="sold">Sold</option>
                    <option value="pending">Pending</option>
                  </select>
                </td>

                <td style={{ padding: 12 }}>
                  {(() => {
                    const canToggle = l.status === 'active' || l.status === 'featured';
                    const enabled = canToggle && Boolean(l.is_featured);
                    return (
                      <button
                        type="button"
                        onClick={() => toggleFeatured(l, !enabled)}
                        disabled={!canToggle}
                        title={canToggle ? 'Toggle featured' : 'Featured only when status is Active'}
                        style={{
                          width: 34,
                          height: 34,
                          borderRadius: 'var(--radius)',
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          border: 'none',
                          background: 'var(--gray-100)',
                          color: enabled ? 'var(--green)' : 'var(--gray-500)',
                          cursor: canToggle ? 'pointer' : 'not-allowed',
                          opacity: canToggle ? 1 : 0.7,
                        }}
                      >
                        {enabled ? <FaToggleOn /> : <FaToggleOff />}
                      </button>
                    );
                  })()}
                </td>

                <td style={{ padding: 12 }}>
                  <a
                    href={`/cars/${l.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    title="View"
                    aria-label="View"
                    style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 34, height: 34, borderRadius: 'var(--radius)', color: 'var(--blue-primary)', background: 'var(--gray-100)', marginRight: 8, textDecoration: 'none' }}
                  >
                    <FaEye />
                  </a>
                  <button
                    type="button"
                    onClick={() => openEdit(l)}
                    title="Edit"
                    aria-label="Edit"
                    style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 34, height: 34, borderRadius: 'var(--radius)', color: 'var(--blue-primary)', background: 'var(--gray-100)', border: 'none', marginRight: 8 }}
                  >
                    <FaEdit />
                  </button>
                  <button
                    type="button"
                    onClick={() => deleteListing(l.id)}
                    title="Delete"
                    aria-label="Delete"
                    style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 34, height: 34, borderRadius: 'var(--radius)', color: 'crimson', background: 'var(--gray-100)', border: 'none' }}
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
        <div
          className="modal-overlay"
          role="dialog"
          aria-modal="true"
        >
          <div className="modal-panel" style={{ width: 'min(1100px, 90vw)' }} onMouseDown={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--gray-900)' }}>Add New Listing</h2>
                <button type="button" className="modal-close" onClick={closeAdd}>Close</button>
              </div>
              {addError && <p style={{ color: 'crimson', marginTop: 10 }}>{addError}</p>}
            </div>

            <form onSubmit={submitAdd} className="modal-body" style={{ background: 'var(--gray-50)' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div>
                  <label style={{ display: 'block', marginBottom: 8, fontWeight: 500 }}>Condition *</label>
                  <select
                    value={form.condition_id}
                    onChange={(e) => setForm((f) => ({ ...f, condition_id: e.target.value }))}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: 6, border: '1px solid var(--gray-200)' }}
                    required
                  >
                    <option value="">Select condition</option>
                    {conditions.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: 8, fontWeight: 500 }}>Make *</label>
                  <select
                    value={form.make_id}
                    onChange={(e) => {
                      setForm((f) => ({ ...f, make_id: e.target.value, model_id: '' }));
                    }}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: 6, border: '1px solid var(--gray-200)' }}
                    required
                  >
                    <option value="">Select make</option>
                    {makes.map((m) => (
                      <option key={m.id} value={m.id}>{m.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: 8, fontWeight: 500 }}>Model *</label>
                  <select
                    value={form.model_id}
                    onChange={(e) => setForm((f) => ({ ...f, model_id: e.target.value }))}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: 6, border: '1px solid var(--gray-200)' }}
                    required
                  >
                    <option value="">Select model</option>
                    {models.map((m) => (
                      <option key={m.id} value={m.id}>{m.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: 8, fontWeight: 500 }}>Year *</label>
                  <input
                    type="number"
                    value={form.year}
                    onChange={(e) => setForm((f) => ({ ...f, year: e.target.value }))}
                    min={1990}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: 6, border: '1px solid var(--gray-200)' }}
                    required
                  />
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: 8, fontWeight: 500 }}>Price ($) *</label>
                  <input
                    type="number"
                    value={form.price}
                    onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
                    min={0}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: 6, border: '1px solid var(--gray-200)' }}
                    required
                  />
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: 8, fontWeight: 500 }}>Mileage (km)</label>
                  <input
                    type="number"
                    value={form.mileage_km}
                    onChange={(e) => setForm((f) => ({ ...f, mileage_km: e.target.value }))}
                    min={0}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: 6, border: '1px solid var(--gray-200)' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: 8, fontWeight: 500 }}>Transmission *</label>
                  <select
                    value={form.transmission}
                    onChange={(e) => setForm((f) => ({ ...f, transmission: e.target.value }))}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: 6, border: '1px solid var(--gray-200)' }}
                    required
                  >
                    <option>Automatic</option>
                    <option>Manual</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: 8, fontWeight: 500 }}>Fuel Type *</label>
                  <select
                    value={form.fuel_type}
                    onChange={(e) => setForm((f) => ({ ...f, fuel_type: e.target.value }))}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: 6, border: '1px solid var(--gray-200)' }}
                    required
                  >
                    <option>Petrol</option>
                    <option>Diesel</option>
                    <option>Electric</option>
                    <option>Hybrid</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: 8, fontWeight: 500 }}>City</label>
                  <input
                    type="text"
                    value={form.location_city}
                    onChange={(e) => setForm((f) => ({ ...f, location_city: e.target.value }))}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: 6, border: '1px solid var(--gray-200)' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: 8, fontWeight: 500 }}>Country</label>
                  <input
                    type="text"
                    value={form.location_country}
                    onChange={(e) => setForm((f) => ({ ...f, location_country: e.target.value }))}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: 6, border: '1px solid var(--gray-200)' }}
                  />
                </div>

                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={{ display: 'block', marginBottom: 8, fontWeight: 500 }}>Description</label>
                  <textarea
                    value={form.description}
                    onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                    rows={3}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: 6, border: '1px solid var(--gray-200)' }}
                  />
                </div>

                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={{ display: 'block', marginBottom: 8, fontWeight: 500 }}>Image Upload</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                    style={{ width: '100%' }}
                  />
                </div>

                {addImagePreviewUrl && (
                  <div style={{ gridColumn: '1 / -1', marginTop: 10 }}>
                    <div style={{ fontWeight: 700, color: 'var(--gray-700)', marginBottom: 8 }}>Preview</div>
                    <img
                      src={addImagePreviewUrl}
                      alt="New listing preview"
                      style={{ width: '100%', borderRadius: 'var(--radius-lg)', border: '1px solid var(--gray-200)', background: 'var(--gray-50)' }}
                    />
                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 10 }}>
                      <button
                        type="button"
                        className="btn"
                        style={{ background: 'var(--gray-100)' }}
                        onClick={() => {
                          setImageFile(null);
                        }}
                      >
                        Remove Image
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 20 }}>
                <button type="button" className="btn" style={{ background: 'var(--gray-100)' }} onClick={closeAdd} disabled={adding}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={adding}>
                  {adding ? 'Adding...' : 'Add Listing'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showEdit && (
        <div
          className="modal-overlay"
          role="dialog"
          aria-modal="true"
        >
          <div className="modal-panel" style={{ width: 'min(1100px, 90vw)' }} onMouseDown={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--gray-900)' }}>Edit Listing</h2>
                <button type="button" className="modal-close" onClick={closeEdit}>Close</button>
              </div>
              {editError && <p style={{ color: 'crimson', marginTop: 10 }}>{editError}</p>}
            </div>

            <form onSubmit={submitEdit} className="modal-body" style={{ background: 'var(--gray-50)' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div>
                  <label style={{ display: 'block', marginBottom: 8, fontWeight: 500 }}>Status *</label>
                  <select
                    value={editForm.status}
                    onChange={(e) => {
                      const next = e.target.value;
                      setEditForm((f) => ({
                        ...f,
                        status: next,
                        is_featured: next === 'active' ? f.is_featured : 0,
                      }));
                    }}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: 6, border: '1px solid var(--gray-200)' }}
                    required
                  >
                    <option value="active">Active</option>
                    <option value="sold">Sold</option>
                    <option value="pending">Pending</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: 8, fontWeight: 500 }}>Featured</label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, paddingTop: 12 }}>
                    <input
                      type="checkbox"
                      checked={editForm.is_featured}
                      disabled={editForm.status !== 'active'}
                      onChange={(e) => setEditForm((f) => ({ ...f, is_featured: e.target.checked }))}
                      style={{ width: 18, height: 18 }}
                    />
                    <span style={{ color: 'var(--gray-700)' }}>{editForm.is_featured ? 'Yes' : 'No'}</span>
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: 8, fontWeight: 500 }}>Condition *</label>
                  <select
                    value={editForm.condition_id}
                    onChange={(e) => setEditForm((f) => ({ ...f, condition_id: e.target.value }))}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: 6, border: '1px solid var(--gray-200)' }}
                    required
                  >
                    <option value="">Select condition</option>
                    {conditions.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: 8, fontWeight: 500 }}>Year *</label>
                  <input
                    type="number"
                    value={editForm.year}
                    onChange={(e) => setEditForm((f) => ({ ...f, year: e.target.value }))}
                    min={1990}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: 6, border: '1px solid var(--gray-200)' }}
                    required
                  />
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: 8, fontWeight: 500 }}>Price ($) *</label>
                  <input
                    type="number"
                    value={editForm.price}
                    onChange={(e) => setEditForm((f) => ({ ...f, price: e.target.value }))}
                    min={0}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: 6, border: '1px solid var(--gray-200)' }}
                    required
                  />
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: 8, fontWeight: 500 }}>Mileage (km)</label>
                  <input
                    type="number"
                    value={editForm.mileage_km}
                    onChange={(e) => setEditForm((f) => ({ ...f, mileage_km: e.target.value }))}
                    min={0}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: 6, border: '1px solid var(--gray-200)' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: 8, fontWeight: 500 }}>Transmission *</label>
                  <select
                    value={editForm.transmission}
                    onChange={(e) => setEditForm((f) => ({ ...f, transmission: e.target.value }))}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: 6, border: '1px solid var(--gray-200)' }}
                    required
                  >
                    <option>Automatic</option>
                    <option>Manual</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: 8, fontWeight: 500 }}>Fuel Type *</label>
                  <select
                    value={editForm.fuel_type}
                    onChange={(e) => setEditForm((f) => ({ ...f, fuel_type: e.target.value }))}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: 6, border: '1px solid var(--gray-200)' }}
                    required
                  >
                    <option>Petrol</option>
                    <option>Diesel</option>
                    <option>Electric</option>
                    <option>Hybrid</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: 8, fontWeight: 500 }}>City</label>
                  <input
                    type="text"
                    value={editForm.location_city}
                    onChange={(e) => setEditForm((f) => ({ ...f, location_city: e.target.value }))}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: 6, border: '1px solid var(--gray-200)' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: 8, fontWeight: 500 }}>Country</label>
                  <input
                    type="text"
                    value={editForm.location_country}
                    onChange={(e) => setEditForm((f) => ({ ...f, location_country: e.target.value }))}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: 6, border: '1px solid var(--gray-200)' }}
                  />
                </div>

                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={{ display: 'block', marginBottom: 8, fontWeight: 500 }}>Description</label>
                  <textarea
                    value={editForm.description}
                    onChange={(e) => setEditForm((f) => ({ ...f, description: e.target.value }))}
                    rows={3}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: 6, border: '1px solid var(--gray-200)' }}
                  />
                </div>

                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={{ display: 'block', marginBottom: 8, fontWeight: 500 }}>Replace Image (upload)</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setEditImageFile(e.target.files?.[0] || null)}
                    style={{ width: '100%' }}
                  />
                </div>

                {(editImagePreviewUrl || editForm.image_url) && (
                  <div style={{ gridColumn: '1 / -1' }}>
                    <div style={{ fontWeight: 700, color: 'var(--gray-700)', marginBottom: 8 }}>Image Preview</div>
                    <img
                      src={editImagePreviewUrl || editForm.image_url}
                      alt="Listing preview"
                      style={{ width: '100%', borderRadius: 'var(--radius-lg)', border: '1px solid var(--gray-200)', background: 'var(--gray-50)' }}
                    />
                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 10 }}>
                      <button
                        type="button"
                        className="btn"
                        style={{ background: 'var(--gray-100)' }}
                        onClick={() => {
                          setEditImageFile(null);
                          setEditForm((f) => ({ ...f, image_url: '' }));
                        }}
                      >
                        Remove Image
                      </button>
                    </div>
                  </div>
                )}
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
