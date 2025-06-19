import React, { createContext, useContext, useState, useEffect } from 'react';

// Create context
const AuthContext = createContext();

// Provider component
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check if user is already logged in (from localStorage)
  useEffect(() => {
    const checkAuth = () => {
      try {
        const savedUser = localStorage.getItem('user');
        
        if (savedUser && savedUser !== 'undefined') {
          // Just use the saved user without verification
          const parsedUser = JSON.parse(savedUser);
          if (parsedUser && typeof parsedUser === 'object') {
            setCurrentUser(parsedUser);
            setIsAuthenticated(true);
            console.log("User authenticated from localStorage:", parsedUser);
          } else {
            // Invalid user object
            console.error('Invalid user object in localStorage');
            localStorage.removeItem('user');
          }
        }
      } catch (err) {
        console.error('Authentication check failed:', err);
        localStorage.removeItem('user');
      } finally {
        setIsLoading(false);
      }
    };
    
    // Run immediately without async
    checkAuth();
  }, []);

  // Login function
  const login = async (email, password) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Try to login with backend API
      try {
        const response = await fetch('https://credoxbackend.onrender.com/api/auth/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ email, password })
        });
        
        if (response.ok) {
          const data = await response.json();
          
          // Set current user - backend returns user directly, not nested in data.user
          setCurrentUser(data);
          setIsAuthenticated(true);
          
          // Save to localStorage - store the entire user object
          localStorage.setItem('authToken', data.id); // Use ID as token if no token provided
          localStorage.setItem('user', JSON.stringify(data));
          
          setIsLoading(false);
          return data;
        }
      } catch (apiErr) {
        console.error('API login failed, falling back to local:', apiErr);
      }
      
      // Fallback to localStorage if API fails
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      
      // Find user by email (case insensitive)
      const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
      
      if (!user) {
        throw new Error('User not found');
      }
      
      // Check password
      if (user.password !== password) {
        throw new Error('Invalid password');
      }
      
      // Remove password from user object before storing in state
      const { password: _, ...userWithoutPassword } = user;
      
      // Set current user
      setCurrentUser(userWithoutPassword);
      setIsAuthenticated(true);
      
      // Save to localStorage
      localStorage.setItem('user', JSON.stringify(userWithoutPassword));
      
      setIsLoading(false);
      return userWithoutPassword;
    } catch (err) {
      setError(err.message);
      setIsLoading(false);
      throw err;
    }
  };

  // Register function
  const register = async (userData) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const { name, email, password } = userData;
      
      if (!name || !email || !password) {
        throw new Error('All fields are required');
      }
      
      // Get existing users
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      
      // Check if email is already in use (case insensitive)
      if (users.some(user => user.email.toLowerCase() === email.toLowerCase())) {
        throw new Error('Email is already in use');
      }
      
      // Create new user
      const newUser = {
        id: `user-${Date.now()}`,
        name,
        email,
        password,
        accountId: `CR-${Math.floor(100000 + Math.random() * 900000)}`,
        accountType: 'Standard',
        joinDate: new Date().toISOString().split('T')[0],
        twoFactorEnabled: false,
        cashBalance: 0 // Initial balance is zero until admin approves
      };
      
      // Save to users array
      users.push(newUser);
      localStorage.setItem('users', JSON.stringify(users));
      
      // Remove password from user object before storing in state
      const { password: _, ...userWithoutPassword } = newUser;
      
      // Set as current user
      setCurrentUser(userWithoutPassword);
      setIsAuthenticated(true);
      localStorage.setItem('user', JSON.stringify(userWithoutPassword));
      
      // Dispatch a custom event to notify other components
      window.dispatchEvent(new Event('userDataChanged'));
      
      setIsLoading(false);
      return userWithoutPassword;
    } catch (err) {
      setError(err.message);
      setIsLoading(false);
      throw err;
    }
  };

  // Logout function
  const logout = async () => {
    try {
      // Try to logout with backend API
      const authToken = localStorage.getItem('authToken');
      if (authToken) {
        await fetch('https://credoxbackend.onrender.com/api/auth/logout', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${authToken}`,
            'Content-Type': 'application/json'
          }
        });
      }
    } catch (err) {
      console.error('Logout API call failed:', err);
    } finally {
      // Always clear local state regardless of API success
      setCurrentUser(null);
      setIsAuthenticated(false);
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
    }
  };

  // Context value
  const value = {
    currentUser,
    isAuthenticated,
    isLoading,
    error,
    login,
    register,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;