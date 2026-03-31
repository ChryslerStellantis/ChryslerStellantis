import { Outlet, useNavigate } from 'react-router-dom';
import AdminHeader from './AdminHeader';
import AdminSidebar from './AdminSidebar';

export default function AdminLayout() {
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
    window.location.reload();
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--white)' }}>
      <div style={{ display: 'flex', alignItems: 'stretch' }}>
        <AdminSidebar />
        <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
          <AdminHeader onLogout={handleLogout} />
          <main style={{ flex: 1, padding: '32px 0', background: 'var(--gray-50)' }}>
            <div className="container">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
