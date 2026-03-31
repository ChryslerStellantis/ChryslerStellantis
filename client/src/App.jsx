import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Cars from './pages/Cars';
import CarDetail from './pages/CarDetail';
import Brands from './pages/Brands';
import SellCar from './pages/SellCar';
import Blog from './pages/Blog';
import BlogPost from './pages/BlogPost';
import Contact from './pages/Contact';
import About from './pages/About';
import Login from './pages/Login';
import AdminLayout from './admin/AdminLayout';
import AdminDashboard from './admin/AdminDashboard';
import AdminListings from './admin/AdminListings';
import AdminUsers from './admin/AdminUsers';
import AdminBlog from './admin/AdminBlog';
import AdminTestimonials from './admin/AdminTestimonials';

function ProtectedAdmin({ children }) {
  const token = localStorage.getItem('token');
  let user = {};
  try {
    const parsed = JSON.parse(localStorage.getItem('user') || '{}');
    user = parsed && typeof parsed === 'object' ? parsed : {};
  } catch (e) {
    user = {};
  }
  if (!token || user?.role !== 'admin') return <Navigate to="/" replace />;
  return children;
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="cars" element={<Cars />} />
        <Route path="cars/:id" element={<CarDetail />} />
        <Route path="brands" element={<Brands />} />
        <Route path="sell-car" element={<SellCar />} />
        <Route path="blog" element={<Blog />} />
        <Route path="blog/:slug" element={<BlogPost />} />
        <Route path="contact" element={<Contact />} />
        <Route path="about" element={<About />} />
        <Route path="login" element={<Login />} />
      </Route>
      <Route path="/admin" element={<ProtectedAdmin><AdminLayout /></ProtectedAdmin>}>
        <Route index element={<AdminDashboard />} />
        <Route path="listings" element={<AdminListings />} />
        <Route path="users" element={<AdminUsers />} />
        <Route path="blog" element={<AdminBlog />} />
        <Route path="testimonials" element={<AdminTestimonials />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
