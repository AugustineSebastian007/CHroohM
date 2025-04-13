import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

const Layout = () => {
  // Add effect to set initial sidebar state
  useEffect(() => {
    const mainContent = document.querySelector('main');
    if (mainContent) {
      mainContent.classList.add('sidebar-open');
    }
  }, []);

  return (
    <div className="flex h-screen bg-white overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-auto transition-all duration-300">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout; 