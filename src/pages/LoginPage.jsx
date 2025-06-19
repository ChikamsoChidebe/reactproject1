import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { authService } from '../services/api';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login, setCurrentUser, setIsAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  // Clear any corrupted localStorage data on component mount
  useEffect(() => {
    try {
      // Check if user data is valid JSON
      const userData = localStorage.getItem('user');
      if (userData) {
        try {
          JSON.parse(userData);
        } catch (e) {
          console.log("Clearing corrupted user data from localStorage");
          localStorage.removeItem('user');
        }
      }
    } catch (e) {
      console.error("Error checking localStorage:", e);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Reset error
    setError('');
    
    // Validate form
    if (!email || !password) {
      return setError('Email and password are required');
    }
    
    setIsLoading(true);
    
    try {
      console.log("Attempting login with API:", email);
      
      // Special handling for admin login
      if (email === 'admin@credox.com' && password === 'admin123') {
        // Create admin user object
        const adminUser = {
          id: 'admin-user',
          name: 'Admin',
          email: 'admin@credox.com',
          accountId: 'CR-ADMIN',
          accountType: 'Admin',
          isAdmin: true,
          cashBalance: 0
        };
        
        // Set in auth context directly
        setCurrentUser(adminUser);
        setIsAuthenticated(true);
        
        // Store in localStorage
        localStorage.setItem('user', JSON.stringify(adminUser));
        
        console.log("Admin login successful, redirecting to admin page");
        setIsLoading(false);
        navigate('/admin');
        return;
      }
      
      // For non-admin users, use the regular login flow
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      console.error('Login error:', err);
      setError(err.message || 'Invalid email or password');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Sign in to your account</h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Or{' '}
            <Link to="/register" className="font-medium text-blue-600 hover:text-blue-500">
              create a new account
            </Link>
          </p>
        </div>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <span className="block sm:inline">{error}</span>
          </div>
        )}
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email-address" className="sr-only">Email address</label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                Remember me
              </label>
            </div>

            <div className="text-sm">
              <a href="#" className="font-medium text-blue-600 hover:text-blue-500">
                Forgot your password?
              </a>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {isLoading ? 'Signing in...' : 'Sign in'}
            </button>
          </div>
          
          {/* <div className="text-center">
            <p className="text-xs text-gray-500">Admin login: admin@credox.com / admin123</p>
          </div> */}
        </form>
      </div>
    </div>
  );
};

export default LoginPage;