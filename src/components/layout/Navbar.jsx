import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useNotification } from '../../contexts/NotificationContext';

const Navbar = () => {
  const { currentUser, isAuthenticated, logout } = useAuth();
  const { unreadCount } = useNotification();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const location = useLocation();
  
  // Check if the current route is active
  const isActive = (path) => {
    return location.pathname === path;
  };
  
  // Toggle mobile menu
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };
  
  // Toggle user menu
  const toggleUserMenu = () => {
    setUserMenuOpen(!userMenuOpen);
  };
  
  // Handle logout
  const handleLogout = () => {
    logout();
    setUserMenuOpen(false);
  };

  // Check if user is admin
  const isAdmin = currentUser?.email === 'admin@credox.com';

  return (
    <nav className="bg-gradient-to-r from-blue-900 to-indigo-800 text-white shadow-md">
      {/* Top Bar - Market Status */}
      <div className="bg-gray-900 py-1 px-4 text-xs">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-6">
            <div className="flex items-center">
              <span className="w-2 h-2 rounded-full bg-green-500 mr-2"></span>
              <span>Markets: Open</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div>{new Date().toLocaleTimeString()}</div>
            <div className="hidden md:block">{new Date().toLocaleDateString()}</div>
          </div>
        </div>
      </div>
      
      {/* Main Navigation */}
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <Link to="/" className="text-2xl font-bold flex items-center">
            <svg className="w-8 h-8 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M4 5C4 4.44772 4.44772 4 5 4H19C19.5523 4 20 4.44772 20 5V7C20 7.55228 19.5523 8 19 8H5C4.44772 8 4 7.55228 4 7V5Z" fill="currentColor"/>
              <path d="M4 11C4 10.4477 4.44772 10 5 10H11C11.5523 10 12 10.4477 12 11V19C12 19.5523 11.5523 20 11 20H5C4.44772 20 4 19.5523 4 19V11Z" fill="currentColor"/>
              <path d="M16 11C15.4477 11 15 11.4477 15 12V19C15 19.5523 15.4477 20 16 20H19C19.5523 20 20 19.5523 20 19V12C20 11.4477 19.5523 11 19 11H16Z" fill="currentColor"/>
            </svg>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500 font-extrabold">
              CREDOX
            </span>
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            <Link 
              to="/" 
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                isActive('/') 
                  ? 'bg-blue-800 text-white' 
                  : 'text-gray-300 hover:bg-blue-800 hover:text-white'
              }`}
            >
              Home
            </Link>
            <Link 
              to="/markets" 
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                isActive('/markets') 
                  ? 'bg-blue-800 text-white' 
                  : 'text-gray-300 hover:bg-blue-800 hover:text-white'
              }`}
            >
              Markets
            </Link>
            <Link 
              to="/trading" 
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                isActive('/trading') 
                  ? 'bg-blue-800 text-white' 
                  : 'text-gray-300 hover:bg-blue-800 hover:text-white'
              }`}
            >
              Trading
            </Link>
            {isAuthenticated && (
              <>
                <Link 
                  to="/dashboard" 
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    isActive('/dashboard') 
                      ? 'bg-blue-800 text-white' 
                      : 'text-gray-300 hover:bg-blue-800 hover:text-white'
                  }`}
                >
                  Dashboard
                </Link>
                <Link 
                  to="/portfolio" 
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    isActive('/portfolio') 
                      ? 'bg-blue-800 text-white' 
                      : 'text-gray-300 hover:bg-blue-800 hover:text-white'
                  }`}
                >
                  Portfolio
                </Link>
                <Link 
                  to="/analytics" 
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    isActive('/analytics') 
                      ? 'bg-blue-800 text-white' 
                      : 'text-gray-300 hover:bg-blue-800 hover:text-white'
                  }`}
                >
                  Analytics
                </Link>
                <Link 
                  to="/news" 
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    isActive('/news') 
                      ? 'bg-blue-800 text-white' 
                      : 'text-gray-300 hover:bg-blue-800 hover:text-white'
                  }`}
                >
                  News
                </Link>
                {isAdmin && (
                  <Link 
                    to="/admin" 
                    className={`px-3 py-2 rounded-md text-sm font-medium ${
                      isActive('/admin') 
                        ? 'bg-red-700 text-white' 
                        : 'bg-red-600 text-white hover:bg-red-700'
                    }`}
                  >
                    Admin
                  </Link>
                )}
              </>
            )}
          </div>
          
          {/* Right Side Menu */}
          <div className="flex items-center space-x-4">
            {/* Notifications */}
            {isAuthenticated && (
              <div className="relative">
                <Link 
                  to="/notifications"
                  className="p-1 rounded-full hover:bg-blue-800 focus:outline-none"
                  aria-label="Notifications"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path>
                  </svg>
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-white bg-red-600 rounded-full">
                      {unreadCount}
                    </span>
                  )}
                </Link>
              </div>
            )}
            
            {/* User Menu */}
            {isAuthenticated ? (
              <div className="relative">
                <button 
                  onClick={toggleUserMenu}
                  className="flex items-center focus:outline-none"
                  aria-expanded={userMenuOpen}
                  aria-haspopup="true"
                >
                  <span className="mr-2 hidden sm:block">{currentUser?.name}</span>
                  <div className="w-8 h-8 rounded-full bg-blue-700 flex items-center justify-center">
                    {currentUser?.name?.charAt(0) || 'U'}
                  </div>
                </button>
                
                {/* User Dropdown Menu */}
                {userMenuOpen && (
                  <div 
                    className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 z-10"
                    onBlur={() => setUserMenuOpen(false)}
                  >
                    <Link 
                      to="/dashboard" 
                      className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      Dashboard
                    </Link>
                    <Link 
                      to="/kyc" 
                      className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      KYC Verification
                    </Link>
                    <Link 
                      to="/account" 
                      className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      Account Settings
                    </Link>
                    <Link 
                      to="/settings" 
                      className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      Preferences
                    </Link>
                    {isAdmin && (
                      <Link 
                        to="/admin" 
                        className="block px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        Admin Panel
                      </Link>
                    )}
                    <div className="border-t border-gray-200 dark:border-gray-700"></div>
                    <button 
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="hidden md:flex items-center space-x-4">
                <Link 
                  to="/login" 
                  className="text-gray-300 hover:bg-blue-800 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                >
                  Login
                </Link>
                <Link 
                  to="/register" 
                  className="bg-blue-700 hover:bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium"
                >
                  Sign Up
                </Link>
              </div>
            )}
            
            {/* Mobile Menu Button */}
            <div className="lg:hidden">
              <button 
                onClick={toggleMobileMenu}
                className="p-1 rounded-md hover:bg-blue-800 focus:outline-none"
                aria-expanded={mobileMenuOpen}
                aria-controls="mobile-menu"
                aria-label="Main menu"
              >
                {mobileMenuOpen ? (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                ) : (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>
        
        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden py-4 border-t border-blue-800" id="mobile-menu">
            <div className="flex flex-col space-y-2 px-2">
              <Link 
                to="/" 
                className={`px-3 py-2 rounded-md text-base font-medium ${
                  isActive('/') ? 'bg-blue-800 text-white' : 'text-gray-300 hover:bg-blue-800 hover:text-white'
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                Home
              </Link>
              <Link 
                to="/markets" 
                className={`px-3 py-2 rounded-md text-base font-medium ${
                  isActive('/markets') ? 'bg-blue-800 text-white' : 'text-gray-300 hover:bg-blue-800 hover:text-white'
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                Markets
              </Link>
              <Link 
                to="/trading" 
                className={`px-3 py-2 rounded-md text-base font-medium ${
                  isActive('/trading') ? 'bg-blue-800 text-white' : 'text-gray-300 hover:bg-blue-800 hover:text-white'
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                Trading
              </Link>
              {isAuthenticated ? (
                <>
                  <Link 
                    to="/dashboard" 
                    className={`px-3 py-2 rounded-md text-base font-medium ${
                      isActive('/dashboard') ? 'bg-blue-800 text-white' : 'text-gray-300 hover:bg-blue-800 hover:text-white'
                    }`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <Link 
                    to="/portfolio" 
                    className={`px-3 py-2 rounded-md text-base font-medium ${
                      isActive('/portfolio') ? 'bg-blue-800 text-white' : 'text-gray-300 hover:bg-blue-800 hover:text-white'
                    }`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Portfolio
                  </Link>
                  <Link 
                    to="/analytics" 
                    className={`px-3 py-2 rounded-md text-base font-medium ${
                      isActive('/analytics') ? 'bg-blue-800 text-white' : 'text-gray-300 hover:bg-blue-800 hover:text-white'
                    }`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Analytics
                  </Link>
                  <Link 
                    to="/news" 
                    className={`px-3 py-2 rounded-md text-base font-medium ${
                      isActive('/news') ? 'bg-blue-800 text-white' : 'text-gray-300 hover:bg-blue-800 hover:text-white'
                    }`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    News
                  </Link>
                  <Link 
                    to="/kyc" 
                    className={`px-3 py-2 rounded-md text-base font-medium ${
                      isActive('/kyc') ? 'bg-blue-800 text-white' : 'text-gray-300 hover:bg-blue-800 hover:text-white'
                    }`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    KYC Verification
                  </Link>
                  {isAdmin && (
                    <Link 
                      to="/admin" 
                      className="px-3 py-2 rounded-md text-base font-medium bg-red-600 text-white"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Admin Panel
                    </Link>
                  )}
                  <div className="border-t border-blue-800 pt-2">
                    <button 
                      onClick={handleLogout}
                      className="w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:bg-blue-800 hover:text-white"
                    >
                      Sign Out
                    </button>
                  </div>
                </>
              ) : (
                <div className="border-t border-blue-800 pt-2 flex flex-col space-y-2">
                  <Link 
                    to="/login" 
                    className="px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:bg-blue-800 hover:text-white"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link 
                    to="/register" 
                    className="bg-blue-700 hover:bg-blue-600 text-white px-3 py-2 rounded-md text-base font-medium text-center"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;