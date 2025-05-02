import { Outlet } from 'react-router-dom';
import { useAtom } from 'jotai';
import { userAtom } from '../store/auth';
import Navbar from './Navbar';
import Footer from './Footer';
import Sidebar from './Sidebar';

const Layout = () => {
  const [user] = useAtom(userAtom);
  
  // Only show sidebar if user is logged in
  const showSidebar = !!user;

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      
      <div className="flex flex-1">
        {showSidebar && <Sidebar />}
        
        <main className={`flex-1 px-4 py-8 md:px-8 ${showSidebar ? 'md:ml-64' : ''}`}>
          <Outlet />
        </main>
      </div>
      
      <Footer />
    </div>
  );
};

export default Layout;