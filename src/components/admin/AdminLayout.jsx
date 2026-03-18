import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

const AdminLayout = () => {
  return (
    <div className="flex h-screen bg-[#F8F9FA] font-inter overflow-hidden">
      <Sidebar />
      <main className="flex-1 p-4 pt-20 sm:p-8 lg:p-12 overflow-y-auto w-full relative">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
