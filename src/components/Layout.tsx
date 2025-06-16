
import { Outlet } from 'react-router-dom';
import RoleBasedNavbar from './RoleBasedNavbar';

const Layout = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <RoleBasedNavbar />
      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
