import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAtom } from 'jotai';
import { 
  Menu, X, Globe, Bus, User, LogOut, Menu as MenuIcon 
} from 'lucide-react';
import { userAtom } from '../store/auth';
import LanguageSwitcher from './LanguageSwitcher';

const Navbar = () => {
  const { t } = useTranslation();
  const [user, setUser] = useAtom(userAtom);
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    // Clear user from state
    setUser(null);
    // Navigate to home page
    navigate('/');
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className="bg-primary-700 text-white shadow-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <Bus className="h-8 w-8 text-white" />
              <span className="ml-2 text-xl font-bold">{t('common.appName')}</span>
            </Link>
          </div>

          {/* Desktop menu */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-4">
              <Link to="/" className="rounded-md px-3 py-2 text-sm font-medium hover:bg-primary-600">
                {t('navigation.home')}
              </Link>
              
              {user ? (
                <>
                  <Link 
                    to={`/${user.role}/dashboard`} 
                    className="rounded-md px-3 py-2 text-sm font-medium hover:bg-primary-600"
                  >
                    {t('navigation.dashboard')}
                  </Link>
                  
                  <div className="relative ml-3">
                    <div className="flex rounded-full">
                      <button
                        type="button"
                        className="flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-primary-600"
                      >
                        <span className="mr-2">{user.name}</span>
                        <User className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                  
                  <button
                    onClick={handleLogout}
                    className="flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-primary-600"
                  >
                    <LogOut className="mr-2 h-5 w-5" />
                    {t('common.logout')}
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="rounded-md px-3 py-2 text-sm font-medium hover:bg-primary-600">
                    {t('auth.login')}
                  </Link>
                  <Link to="/register" className="rounded-md px-3 py-2 text-sm font-medium hover:bg-primary-600">
                    {t('auth.register')}
                  </Link>
                </>
              )}
              
              <LanguageSwitcher />
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden">
            <button
              onClick={toggleMobileMenu}
              className="inline-flex items-center justify-center rounded-md p-2 hover:bg-primary-600 focus:outline-none"
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" aria-hidden="true" />
              ) : (
                <MenuIcon className="h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden">
          <div className="space-y-1 px-2 pb-3 pt-2 sm:px-3">
            <Link
              to="/"
              className="block rounded-md px-3 py-2 text-base font-medium hover:bg-primary-600"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {t('navigation.home')}
            </Link>
            
            {user ? (
              <>
                <Link
                  to={`/${user.role}/dashboard`}
                  className="block rounded-md px-3 py-2 text-base font-medium hover:bg-primary-600"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {t('navigation.dashboard')}
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    setIsMobileMenuOpen(false);
                  }}
                  className="block w-full rounded-md px-3 py-2 text-left text-base font-medium hover:bg-primary-600"
                >
                  {t('common.logout')}
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="block rounded-md px-3 py-2 text-base font-medium hover:bg-primary-600"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {t('auth.login')}
                </Link>
                <Link
                  to="/register"
                  className="block rounded-md px-3 py-2 text-base font-medium hover:bg-primary-600"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {t('auth.register')}
                </Link>
              </>
            )}
            
            <div className="pt-2">
              <LanguageSwitcher isMobile />
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;