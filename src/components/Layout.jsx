import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';

const Layout = () => {
  return (
    <>
      <Navbar />
      <main style={{ paddingTop: '80px' }}>
        <Outlet />
      </main>
    </>
  );
};

export default Layout;
