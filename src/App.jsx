import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import LandingPage from './pages/user/LandingPage';
import ProductPage from './pages/user/ProductPage';
import ContactUsPage from './pages/user/ContactUsPage';
import AboutUsPage from './pages/user/AboutUsPage';
import AdminLogin from './pages/admin/AdminLogin';
import Dashboard from './pages/admin/Dashboard';
import Category from './pages/admin/Category';
import Products from './pages/admin/Products';
import Messages from './pages/admin/Messages';
import NavigationScroll from './components/NavigationScroll';
import UserLayout from './components/UserLayout';
import NotFoundPage from './pages/user/NotFoundPage';
import ProtectedRoute from './components/admin/ProtectedRoute';
import AdminLayout from './components/admin/AdminLayout';
import OtherProductsPage from './pages/user/OtherProductsPage';
import ReviewsPage from './pages/user/ReviewsPage';

function App() {
  return (
    <BrowserRouter>
      <NavigationScroll />
      <Toaster
        position="top-right"
        reverseOrder={false}
        toastOptions={{
          duration: 2000,
          style: {
            background: 'rgba(255, 255, 255, 0.85)',
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(0, 31, 63, 0.1)',
            color: '#001F3F',
            padding: '16px',
            borderRadius: '16px',
            fontSize: '14px',
            fontWeight: '600',
            letterSpacing: '0.025em',
            boxShadow: '0 20px 40px -10px rgba(0, 0, 0, 0.2)',
            maxWidth: '400px',
            fontFamily: 'Montserrat, sans-serif'
          },
          success: {
            style: {
              background: 'rgba(255, 255, 255, 0.9)',
              color: '#001F3F',
              border: '1px solid rgba(0, 31, 63, 0.1)',
            },
            iconTheme: {
              primary: '#F7B500',
              secondary: '#fff',
            },
          },
          error: {
            style: {
              background: 'rgba(255, 255, 255, 0.95)',
              color: '#001F3F',
              border: '1px solid rgba(0, 31, 63, 0.1)',
            },
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
          },
        }}
      />
      <Routes>
        {/* User Routes inside UserLayout */}
        <Route element={<UserLayout />}>
          <Route path="/" element={<LandingPage />} />
          <Route path="/about" element={<AboutUsPage />} />
          <Route path="/contact" element={<ContactUsPage />} />
          <Route path="/products" element={<ProductPage />} />
          <Route path="/other-products" element={<OtherProductsPage />} />
          <Route path="/reviews" element={<ReviewsPage />} />
          {/* Catch all for user routes */}
          <Route path="*" element={<NotFoundPage />} />
        </Route>

        {/* Admin Routes grouped to avoid UserLayout and User 404 */}
        <Route path="/admin">
          <Route path="login" element={<AdminLogin />} />
          
          {/* Protected Area */}
          <Route element={<ProtectedRoute />}>
            <Route element={<AdminLayout />}>
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="category" element={<Category />} />
              <Route path="products" element={<Products />} />
              <Route path="messages" element={<Messages />} />
            </Route>
          </Route>

          {/* Admin wildcard - redirect to dashboard or login if typing wrong /admin/xxx */}
          <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
