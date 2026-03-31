import { useState, useEffect } from 'react';
import { api } from '../api';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.admin.users().then(setUsers).catch(() => setUsers([])).finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <h1 className="section-title" style={{ marginBottom: 32 }}>Users</h1>
      <div style={{ overflowX: 'auto' }} className="card">
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: 'var(--gray-100)' }}>
              <th style={{ padding: 12, textAlign: 'left' }}>ID</th>
              <th style={{ padding: 12, textAlign: 'left' }}>Name</th>
              <th style={{ padding: 12, textAlign: 'left' }}>Email</th>
              <th style={{ padding: 12, textAlign: 'left' }}>Role</th>
              <th style={{ padding: 12, textAlign: 'left' }}>Joined</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} style={{ borderTop: '1px solid var(--gray-200)' }}>
                <td style={{ padding: 12 }}>{u.id}</td>
                <td style={{ padding: 12 }}>{u.name}</td>
                <td style={{ padding: 12 }}>{u.email}</td>
                <td style={{ padding: 12 }}>{u.role}</td>
                <td style={{ padding: 12 }}>{new Date(u.created_at).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
