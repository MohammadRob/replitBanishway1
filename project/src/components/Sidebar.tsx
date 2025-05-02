import { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAtom } from 'jotai';
import {
  LayoutDashboard,
  Calendar,
  Users,
  User,
  BarChart,
  Settings,
  Bus,
  Menu,
  X
} from 'lucide-react';
import { userAtom } from '../store/auth';

const Sidebar = () => {
  const { t } = useTranslation();
  const [user] = useAtom(userAtom);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Close sidebar on mobile when window resizes to desktop
  useEffect(() => {
    if (windowWidth >= 768) {
      setIsMobileSidebarOpen(false);
    }
  }, [windowWidth]);

  // Don't render if no user
  if (!user) return null;

  const toggleMobileSidebar = () => {
    setIsMobileSidebarOpen(!isMobileSidebarOpen);
  };

  const closeMobileSidebar = () => {
    if (windowWidth < 768) {
      setIsMobileSidebarOpen(false);
    }
  };

  const activeLinkClass = "bg-primary-700 text-white";
  const linkClass = "flex items-center px-4 py-3 text-gray-100 hover:bg-primary-700 rounded-md transition-colors";

  // Navigation links based on user role
  const getNavLinks = () => {
    switch (user.role) {
      case 'passenger':
        return (
          <>
            <NavLink
              to="/passenger/dashboard"
              onClick={closeMobileSidebar}
              className={({ isActive }) => `${linkClass} ${isActive ? activeLinkClass : ''}`}
            >
              <LayoutDashboard className="mr-3 h-5 w-5" />
              {t('navigation.dashboard')}
            </NavLink>
            <NavLink
              to="/passenger/reservations"
              onClick={closeMobileSidebar}
              className={({ isActive }) => `${linkClass} ${isActive ? activeLinkClass : ''}`}
            >
              <Calendar className="mr-3 h-5 w-5" />
              {t('navigation.reservations')}
            </NavLink>
          </>
        );
      case 'driver':
        return (
          <>
            <NavLink
              to="/driver/dashboard"
              onClick={closeMobileSidebar}
              className={({ isActive }) => `${linkClass} ${isActive ? activeLinkClass : ''}`}
            >
              <LayoutDashboard className="mr-3 h-5 w-5" />
              {t('navigation.dashboard')}
            </NavLink>
            <NavLink
              to="/driver/passengers"
              onClick={closeMobileSidebar}
              className={({ isActive }) => `${linkClass} ${isActive ? activeLinkClass : ''}`}
            >
              <Users className="mr-3 h-5 w-5" />
              {t('navigation.passengers')}
            </NavLink>
          </>
        );
      case 'manager':
        return (
          <>
            <NavLink
              to="/manager/dashboard"
              onClick={closeMobileSidebar}
              className={({ isActive }) => `${linkClass} ${isActive ? activeLinkClass : ''}`}
            >
              <LayoutDashboard className="mr-3 h-5 w-5" />
              {t('navigation.dashboard')}
            </NavLink>
            <NavLink
              to="/manager/users"
              onClick={closeMobileSidebar}
              className={({ isActive }) => `${linkClass} ${isActive ? activeLinkClass : ''}`}
            >
              <Users className="mr-3 h-5 w-5" />
              {t('navigation.users')}
            </NavLink>
            <NavLink
              to="/manager/reservations"
              onClick={closeMobileSidebar}
              className={({ isActive }) => `${linkClass} ${isActive ? activeLinkClass : ''}`}
            >
              <Calendar className="mr-3 h-5 w-5" />
              {t('navigation.reservations')}
            </NavLink>
            <NavLink
              to="/manager/reports"
              onClick={closeMobileSidebar}
              className={({ isActive }) => `${linkClass} ${isActive ? activeLinkClass : ''}`}
            >
              <BarChart className="mr-3 h-5 w-5" />
              {t('navigation.reports')}
            </NavLink>
          </>
        );
      default:
        return null;
    }
  };

  // Mobile toggle button (visible on mobile only)
  const MobileToggle = () => (
    <button
      className="fixed bottom-4 right-4 z-50 rounded-full bg-primary-600 p-3 text-white shadow-lg md:hidden"
      onClick={toggleMobileSidebar}
    >
      {isMobileSidebarOpen ? (
        <X className="h-6 w-6" />
      ) : (
        <Menu className="h-6 w-6" />
      )}
    </button>
  );

  return (
    <>
      <MobileToggle />
      
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 transform bg-primary-800 transition-transform duration-300 ease-in-out md:translate-x-0 ${
          isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex h-16 items-center justify-center border-b border-primary-700">
          <Bus className="h-8 w-8 text-white" />
          <h2 className="ml-2 text-xl font-bold text-white">{t('common.appName')}</h2>
        </div>
        
        <div className="py-4">
          <div className="mb-6 px-4 text-center">
            <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-primary-700">
              <User className="h-8 w-8 text-white" />
            </div>
            <h3 className="mt-2 text-lg font-medium text-white">{user.name}</h3>
            <p className="text-sm text-primary-300">
              {t(`auth.${user.role.toLowerCase()}`)}
            </p>
          </div>
          
          <nav className="mt-5 space-y-2 px-2">
            {getNavLinks()}
          </nav>
        </div>
      </aside>
      
      {/* Overlay to close sidebar on mobile */}
      {isMobileSidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black bg-opacity-50 md:hidden"
          onClick={closeMobileSidebar}
        />
      )}
    </>
  );
};

export default Sidebar;