import React from 'react';
import { Outlet } from 'react-router-dom';
import AdminNavbar from './AdminNavbar';

const AdminLayout = () => {
  return (
    <>
      <AdminNavbar />
      <main style={{ paddingTop: '80px' }}>
        <Outlet />
      </main>
    </>
  );
};

export default AdminLayout;
