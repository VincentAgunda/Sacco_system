import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/ui/Navbar';
import Sidebar from '../components/ui/Sidebar';
import { useAuth } from '../context/AuthContext';

export default function Dashboard() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { currentUser } = useAuth();

  if (!currentUser) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex h-screen bg-gray-900 text-white">
      <Sidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar setMobileOpen={setMobileOpen} />
        
        {/* Mobile overlay */}
        {mobileOpen && (
          <div className="fixed inset-0 z-20 bg-black bg-opacity-50 md:hidden"
               onClick={() => setMobileOpen(false)}></div>
        )}
        
        <main className="flex-1 overflow-y-auto p-4 bg-gray-900">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}