import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useNotification } from '../../contexts/NotificationContext';
import { useTheme } from '../../contexts/ThemeContext';

const Header = () => {
  const { currentUser, logout } = useAuth();
  const { unreadCount } = useNotification();
  const { darkMode, toggleDarkMode } = useTheme();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const handleLogout = async () => {
    try {
      await logout();
      // Close mobile menu if open
      setMobileMenuOpen(false);
    } catch (error) {
      console.error('Failed to log out', error);
    }
  };
  
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };
  
  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <header className="bg-gradient-to-r from-blue-900 to-indigo-800 dark:from-gray-900 dark:to-gray-800 text-white shadow-lg">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="text-2xl font-bold flex items-center">
            <svg className="w-8 h-8 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M3 9L12 2L21 9V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M9 22V12H15V22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M3 9L12 2L21 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span>TradePro</span>
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-6">
            <Link 
              to="/markets" 
              className={`hover:text-blue-300 transition ${isActive('/markets') ? 'text-blue-300 font-medium' : ''}`}
            >
              Markets
            </Link>
            <Link 
              to="/trading" 
              className={`hover:text-blue-300 transition ${isActive('/trading') ? 'text-blue-300 font-medium' : ''}`}
            >
              Trading
            </Link>
            <Link 
              to="/portfolio" 
              className={`hover:text-blue-300 transition ${isActive('/portfolio') ? 'text-blue-300 font-medium' : ''}`}
            >
              Portfolio
            </Link>
            <Link 
              to="/analytics" 
              className={`hover:text-blue-300 transition ${isActive('/analytics') ? 'text-blue-300 font-medium' : ''}`}
            >
              Analytics
            </Link>
            <Link 
              to="/news" 
              className={`hover:text-blue-300 transition ${isActive('/news') ? 'text-blue-300 font-medium' : ''}`}
            >
              News
            </Link>
          </nav>
          
          {/* Right Side Actions */}
          <div className="flex items-center space-x-4">
            {/* Theme Toggle */}
            <button 
              onClick={toggleDarkMode}
              className="p-2 rounded-full hover:bg-blue-800 dark:hover:bg-gray-700 transition"
              aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {darkMode ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path>
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path>
                </svg>
              )}
            </button>
            
            {/* Notifications */}
            <Link to="/notifications" className="relative p-2 rounded-full hover:bg-blue-800 dark:hover:bg-gray-700 transition">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path>
              </svg>
              {unreadCount > 0 && (
                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </Link>
            
            {currentUser ? (
              <>
                {/* User Menu (Desktop) */}
                <div className="hidden md:flex items-center space-x-4">
                  <Link to="/account" className="flex items-center hover:text-blue-300 transition">
                    <div className="w-8 h-8 rounded-full bg-blue-700 flex items-center justify-center mr-2">
                      {currentUser.name.charAt(0)}
                    </div>
                    <span>{currentUser.name}</span>
                  </Link>
                  <Link to="/dashboard" className="bg-blue-700 hover:bg-blue-600 px-4 py-2 rounded-md transition">
                    Dashboard
                  </Link>
                  <button 
                    onClick={handleLogout}
                    className="text-white hover:text-blue-300 transition"
                  >
                    Logout
                  </button>
                </div>
                
                {/* Mobile Menu Button */}
                <button 
                  className="md:hidden p-2 rounded-md hover:bg-blue-800 dark:hover:bg-gray-700 transition"
                  onClick={toggleMobileMenu}
                  aria-label="Toggle menu"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    {mobileMenuOpen ? (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                    ) : (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
                    )}
                  </svg>
                </button>
              </>
            ) : (
              <>
                {/* Login/Register (Desktop) */}
                <div className="hidden md:flex items-center space-x-4">
                  <Link to="/login" className="hover:text-blue-300 transition">Login</Link>
                  <Link to="/register" className="bg-blue-700 hover:bg-blue-600 px-4 py-2 rounded-md transition">
                    Register
                  </Link>
                </div>
                
                {/* Mobile Menu Button */}
                <button 
                  className="md:hidden p-2 rounded-md hover:bg-blue-800 dark:hover:bg-gray-700 transition"
                  onClick={toggleMobileMenu}
                  aria-label="Toggle menu"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    {mobileMenuOpen ? (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                    ) : (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
                    )}
                  </svg>
                </button>
              </>
            )}
          </div>
        </div>
        
        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 py-4 border-t border-blue-800 dark:border-gray-700">
            <nav className="flex flex-col space-y-4">
              <Link 
                to="/markets" 
                className={`hover:text-blue-300 transition ${isActive('/markets') ? 'text-blue-300 font-medium' : ''}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                Markets
              </Link>
              <Link 
                to="/trading" 
                className={`hover:text-blue-300 transition ${isActive('/trading') ? 'text-blue-300 font-medium' : ''}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                Trading
              </Link>
              <Link 
                to="/portfolio" 
                className={`hover:text-blue-300 transition ${isActive('/portfolio') ? 'text-blue-300 font-medium' : ''}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                Portfolio
              </Link>
              <Link 
                to="/analytics" 
                className={`hover:text-blue-300 transition ${isActive('/analytics') ? 'text-blue-300 font-medium' : ''}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                Analytics
              </Link>
              <Link 
                to="/news" 
                className={`hover:text-blue-300 transition ${isActive('/news') ? 'text-blue-300 font-medium' : ''}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                News
              </Link>
              
              {currentUser ? (
                <>
                  <div className="pt-4 border-t border-blue-800 dark:border-gray-700">
                    <Link 
                      to="/account" 
                      className="flex items-center hover:text-blue-300 transition"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <div className="w-8 h-8 rounded-full bg-blue-700 flex items-center justify-center mr-2">
                        {currentUser.name.charAt(0)}
                      </div>
                      <span>{currentUser.name}</span>
                    </Link>
                  </div>
                  <Link 
                    to="/dashboard" 
                    className="bg-blue-700 hover:bg-blue-600 px-4 py-2 rounded-md transition text-center"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <button 
                    onClick={handleLogout}
                    className="text-white hover:text-blue-300 transition"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <div className="pt-4 border-t border-blue-800 dark:border-gray-700 flex flex-col space-y-4">
                  <Link 
                    to="/login" 
                    className="hover:text-blue-300 transition"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link 
                    to="/register" 
                    className="bg-blue-700 hover:bg-blue-600 px-4 py-2 rounded-md transition text-center"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Register
                  </Link>
                </div>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;