import React, { createContext, useContext, useState, useEffect } from 'react';

// Create context
const ThemeContext = createContext();

// Available themes
const themes = ['default', 'dark', 'contrast', 'calm', 'vibrant'];

// Provider component
export const ThemeProvider = ({ children }) => {
  const [darkMode, setDarkMode] = useState(false);
  const [theme, setTheme] = useState('default');
  const [customization, setCustomization] = useState({
    primaryColor: '#1E40AF', // Default blue-800
    secondaryColor: '#4F46E5', // Default indigo-600
    accentColor: '#10B981' // Default emerald-500
  });

  // Initialize theme from localStorage
  useEffect(() => {
    // Check for saved theme preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      setTheme(savedTheme);
    }
    
    // Check for saved dark mode preference
    const savedDarkMode = localStorage.getItem('darkMode');
    if (savedDarkMode) {
      setDarkMode(savedDarkMode === 'true');
    } else {
      // Check for system preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setDarkMode(prefersDark);
    }
    
    // Check for saved customization
    const savedCustomization = localStorage.getItem('customization');
    if (savedCustomization) {
      setCustomization(JSON.parse(savedCustomization));
    }
  }, []);

  // Update document when dark mode changes
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    
    localStorage.setItem('darkMode', darkMode);
  }, [darkMode]);

  // Update localStorage when theme changes
  useEffect(() => {
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Update localStorage when customization changes
  useEffect(() => {
    localStorage.setItem('customization', JSON.stringify(customization));
    
    // Apply custom colors to CSS variables
    document.documentElement.style.setProperty('--color-primary', customization.primaryColor);
    document.documentElement.style.setProperty('--color-secondary', customization.secondaryColor);
    document.documentElement.style.setProperty('--color-accent', customization.accentColor);
  }, [customization]);

  // Toggle dark mode
  const toggleDarkMode = () => {
    setDarkMode(prev => !prev);
  };

  // Change theme
  const changeTheme = (newTheme) => {
    if (themes.includes(newTheme)) {
      setTheme(newTheme);
    }
  };

  // Update customization
  const updateCustomization = (updates) => {
    setCustomization(prev => ({
      ...prev,
      ...updates
    }));
  };

  // Reset customization to defaults
  const resetCustomization = () => {
    setCustomization({
      primaryColor: '#1E40AF',
      secondaryColor: '#4F46E5',
      accentColor: '#10B981'
    });
  };

  // Context value
  const value = {
    darkMode,
    theme,
    availableThemes: themes,
    customization,
    toggleDarkMode,
    changeTheme,
    updateCustomization,
    resetCustomization
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

// Custom hook
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export default ThemeContext;