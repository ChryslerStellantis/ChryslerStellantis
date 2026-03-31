const API_BASE = import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/api` : '/api';

function asArray(value) {
  return Array.isArray(value) ? value : [];
}

function getToken() {
  return localStorage.getItem('token');
}

async function request(path, options = {}) {
  const url = `${API_BASE}${path}`;
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };
  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;
  const res = await fetch(url, { ...options, headers });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || res.statusText);
  return data;
}

async function requestForm(path, formData, options = {}) {
  const url = `${API_BASE}${path}`;
  const headers = { ...options.headers };
  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;
  const res = await fetch(url, {
    ...options,
    method: options.method || 'POST',
    body: formData,
    headers,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || res.statusText);
  return data;
}

export const api = {
  auth: {
    login: (email, password) => request('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }),
    register: (body) => request('/auth/register', { method: 'POST', body: JSON.stringify(body) }),
    me: () => request('/auth/me'),
  },
  cars: {
    list: (params) => request('/cars?' + new URLSearchParams(params).toString()).then((data) => ({
      listings: asArray(data?.listings),
      total: Number(data?.total) || 0,
    })),
    recent: () => request('/cars/recent').then(asArray),
    trending: () => request('/cars/trending').then(asArray),
    sold: () => request('/cars/sold').then(asArray),
    get: (id) => request(`/cars/${id}`),
    create: (body) => request('/cars', { method: 'POST', body: JSON.stringify(body) }),
    createWithImage: (formData) => requestForm('/cars', formData),
  },
  makes: {
    list: () => request('/makes').then(asArray),
    models: (slug) => request(`/makes/${slug}/models`).then(asArray),
    allModels: () => request('/makes/models/all').then(asArray),
  },
  conditions: () => request('/conditions').then(asArray),
  countries: () => request('/countries').then(asArray),
  blog: {
    list: () => request('/blog').then(asArray),
    get: (slug) => request(`/blog/${slug}`),
  },
  testimonials: () => request('/testimonials').then(asArray),
  newsletter: (email) => request('/newsletter/subscribe', { method: 'POST', body: JSON.stringify({ email }) }),
  admin: {
    stats: () => request('/admin/stats'),
    listings: () => request('/admin/listings').then(asArray),
    updateListing: (id, body) => request(`/admin/listings/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
    uploadListingImage: (id, formData) => requestForm(`/admin/listings/${id}/image`, formData, { method: 'PUT' }),
    reorderListings: (orderIds) => request('/admin/listings/reorder', { method: 'POST', body: JSON.stringify({ order: orderIds }) }),
    deleteListing: (id) => request(`/admin/listings/${id}`, { method: 'DELETE' }),
    users: () => request('/admin/users').then(asArray),
    makes: () => request('/admin/makes').then(asArray),
    createMake: (name) => request('/admin/makes', { method: 'POST', body: JSON.stringify({ name }) }),
    models: (makeId) => request(`/admin/makes/${makeId}/models`).then(asArray),
    createModel: (makeId, name) => request('/admin/models', { method: 'POST', body: JSON.stringify({ make_id: makeId, name }) }),
    blog: () => request('/admin/blog').then(asArray),
    createBlog: (body) => request('/admin/blog', { method: 'POST', body: JSON.stringify(body) }),
    createBlogWithImage: (formData) => requestForm('/admin/blog', formData),
    updateBlog: (id, body) => request(`/admin/blog/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
    updateBlogWithImage: (id, formData) => requestForm(`/admin/blog/${id}`, formData, { method: 'PUT' }),
    deleteBlog: (id) => request(`/admin/blog/${id}`, { method: 'DELETE' }),
    testimonials: () => request('/admin/testimonials').then(asArray),
    createTestimonial: (body) => request('/admin/testimonials', { method: 'POST', body: JSON.stringify(body) }),
    updateTestimonial: (id, body) => request(`/admin/testimonials/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
    createTestimonialWithImage: (formData) => requestForm('/admin/testimonials', formData),
    updateTestimonialWithImage: (id, formData) => requestForm(`/admin/testimonials/${id}`, formData, { method: 'PUT' }),
    deleteTestimonial: (id) => request(`/admin/testimonials/${id}`, { method: 'DELETE' }),
    countries: () => request('/admin/countries').then(asArray),
    createCountry: (body) => request('/admin/countries', { method: 'POST', body: JSON.stringify(body) }),
  },
};
