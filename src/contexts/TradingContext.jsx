import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

// Create context
const TradingContext = createContext();

// Provider component
export const TradingProvider = ({ children }) => {
  const { currentUser } = useAuth();
  const [positions, setPositions] = useState([]);
  const [cashBalance, setCashBalance] = useState(0);
  const [orders, setOrders] = useState([]);
  const [watchlist, setWatchlist] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load user data when currentUser changes or localStorage updates
  useEffect(() => {
    const loadUserData = () => {
      if (currentUser) {
        try {
          // Get all users
          const users = JSON.parse(localStorage.getItem('users') || '[]');
          
          // Find current user
          const user = users.find(u => u.id === currentUser.id);
          
          if (user) {
            // Set cash balance from user data
            setCashBalance(parseFloat(user.cashBalance || 0));
          } else {
            setCashBalance(0);
          }
          
          // Load positions from localStorage
          const userPositions = JSON.parse(localStorage.getItem(`positions_${currentUser.id}`) || '[]');
          if (userPositions && userPositions.length > 0) {
            setPositions(userPositions);
          } else if (parseFloat(user?.cashBalance || 0) > 0) {
            // Only load sample positions for users with positive balance
            setPositions([
              {
                id: 'pos-1',
                symbol: 'AAPL',
                name: 'Apple Inc.',
                quantity: 10,
                entryPrice: 175.50,
                currentPrice: 180.25,
                marketValue: 1802.50,
                unrealizedPL: 47.50,
                unrealizedPLPercent: 2.71,
                side: 'LONG'
              },
              {
                id: 'pos-2',
                symbol: 'MSFT',
                name: 'Microsoft Corporation',
                quantity: 5,
                entryPrice: 334.12,
                currentPrice: 340.50,
                marketValue: 1702.50,
                unrealizedPL: 31.90,
                unrealizedPLPercent: 1.91,
                side: 'LONG'
              }
            ]);
          } else {
            setPositions([]);
          }
          
          // Load orders
          setOrders([]);
          
          // Load watchlist
          setWatchlist(['AAPL', 'MSFT', 'GOOGL', 'AMZN', 'TSLA']);
        } catch (err) {
          console.error('Error loading trading data:', err);
          setCashBalance(0);
          setPositions([]);
        }
      } else {
        setCashBalance(0);
        setPositions([]);
      }
      
      setIsLoading(false);
    };
    
    loadUserData();
    
    // Add event listener for storage changes
    const handleStorageChange = (e) => {
      if (e.key === 'users' || e.key === 'transactions' || e.key?.startsWith('positions_')) {
        loadUserData();
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    // Listen for custom event
    const handleUserDataChanged = () => {
      loadUserData();
    };
    
    window.addEventListener('userDataChanged', handleUserDataChanged);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('userDataChanged', handleUserDataChanged);
    };
  }, [currentUser]);

  // Context value
  const value = {
    positions,
    cashBalance,
    orders,
    watchlist,
    isLoading
  };

  return (
    <TradingContext.Provider value={value}>
      {children}
    </TradingContext.Provider>
  );
};

// Custom hook
export const useTrading = () => {
  const context = useContext(TradingContext);
  if (context === undefined) {
    throw new Error('useTrading must be used within a TradingProvider');
  }
  return context;
};

export default TradingContext;