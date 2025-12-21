import React from 'react';
import { Outlet } from 'react-router-dom';
import InstructorNavbar from './InstructorNavbar';

const InstructorLayout = () => {
  return (
    <>
      <InstructorNavbar />
      <main style={{ paddingTop: '80px' }}>
        <Outlet />
      </main>
    </>
  );
};

export default InstructorLayout;
