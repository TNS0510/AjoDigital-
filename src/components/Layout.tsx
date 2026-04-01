import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';

const Layout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8">
        <Outlet />
      </main>
      <footer className="py-8 text-center text-sm text-gray-500 border-t border-gray-200">
        <p>© 2026 AjoDigital. Secure, Transparent, Community-Driven.</p>
      </footer>
    </div>
  );
};

export default Layout;
