import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

const Layout = () => {
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