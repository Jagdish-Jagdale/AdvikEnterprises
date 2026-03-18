import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import ScrollToTop from './ScrollToTop';
import FloatingContactButtons from './FloatingContactButtons';

const UserLayout = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <Outlet />
      <Footer />
      <ScrollToTop />
      <FloatingContactButtons />
    </div>
  );
};

export default UserLayout;
