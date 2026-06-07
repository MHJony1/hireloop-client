import { DashboardSidebar } from '@/components/dashboard/DashboardSidebar';
import React from 'react';

const DashboardLayout = ({ children }) => {
  return (
    <div className="flex min-h-screen bg-[#0d0d0d]">
      <DashboardSidebar />
      <main
        className="flex-1 bg-[#0d0d0d] overflow-auto"
        style={{ backgroundColor: '#0d0d0d' }}
      >
        {children}
      </main>
    </div>
  );
};

export default DashboardLayout;
