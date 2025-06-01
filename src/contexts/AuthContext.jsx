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
    const checkAuth = async () => {
      try {
        const savedUser = localStorage.getItem('user');
        
        if (savedUser) {
          const parsedUser = JSON.parse(savedUser);
          setCurrentUser(parsedUser);
          setIsAuthenticated(true);
        }
      } catch (err) {
        console.error('Authentication check failed:', err);
        localStorage.removeItem('user');
      } finally {
        setIsLoading(false);
      }
    };
    
    checkAuth();
  }, []);

  // Login function
  const login = async (email, password) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Check if user exists in localStorage
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const user = users.find(u => u.email === email && u.password === password);
      
      if (user) {
        // Remove password from user object before storing in state
        const { password, ...userWithoutPassword } = user;
        setCurrentUser(userWithoutPassword);
        setIsAuthenticated(true);
        localStorage.setItem('user', JSON.stringify(userWithoutPassword));
        setIsLoading(false);
        return userWithoutPassword;
      } else {
        throw new Error('Invalid email or password');
      }
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
      
      // Check if email is already in use
      if (users.some(user => user.email === email)) {
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
        twoFactorEnabled: false
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
      
      setIsLoading(false);
      return userWithoutPassword;
    } catch (err) {
      setError(err.message);
      setIsLoading(false);
      throw err;
    }
  };

  // Logout function
  const logout = () => {
    setCurrentUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('user');
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