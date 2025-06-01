import React, { createContext, useContext, useState, useEffect } from 'react';

// Create context
const TradingContext = createContext();

// Sample positions data
const samplePositions = [
  {
    id: 'position-1',
    symbol: 'AAPL',
    side: 'LONG',
    quantity: 10,
    entryPrice: 175.50,
    currentPrice: 178.72,
    marketValue: 1787.20,
    unrealizedPL: 32.20,
    unrealizedPLPercent: 1.83
  },
  {
    id: 'position-2',
    symbol: 'MSFT',
    side: 'LONG',
    quantity: 5,
    entryPrice: 330.25,
    currentPrice: 334.12,
    marketValue: 1670.60,
    unrealizedPL: 19.35,
    unrealizedPLPercent: 1.17
  },
  {
    id: 'position-3',
    symbol: 'TSLA',
    side: 'SHORT',
    quantity: 3,
    entryPrice: 255.75,
    currentPrice: 248.50,
    marketValue: 745.50,
    unrealizedPL: 21.75,
    unrealizedPLPercent: 2.84
  }
];

// Sample order history
const sampleOrderHistory = [
  {
    id: 'order-1',
    symbol: 'AAPL',
    side: 'BUY',
    type: 'MARKET',
    quantity: 10,
    price: 175.50,
    executionPrice: 175.50,
    totalValue: 1755.00,
    status: 'FILLED',
    createdAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
    filledAt: new Date(Date.now() - 86400000).toISOString()
  },
  {
    id: 'order-2',
    symbol: 'MSFT',
    side: 'BUY',
    type: 'LIMIT',
    quantity: 5,
    price: 330.25,
    executionPrice: 330.25,
    totalValue: 1651.25,
    status: 'FILLED',
    createdAt: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
    filledAt: new Date(Date.now() - 172800000).toISOString()
  },
  {
    id: 'order-3',
    symbol: 'TSLA',
    side: 'SELL',
    type: 'LIMIT',
    quantity: 3,
    price: 255.75,
    executionPrice: 255.75,
    totalValue: 767.25,
    status: 'FILLED',
    createdAt: new Date(Date.now() - 259200000).toISOString(), // 3 days ago
    filledAt: new Date(Date.now() - 259200000).toISOString()
  },
  {
    id: 'order-4',
    symbol: 'AMZN',
    side: 'BUY',
    type: 'LIMIT',
    quantity: 2,
    price: 140.00,
    status: 'PENDING',
    createdAt: new Date().toISOString()
  }
];

// Sample trading settings
const sampleTradingSettings = {
  defaultOrderSize: 10,
  defaultLeverage: 1,
  riskManagement: {
    stopLossDefault: 5,
    takeProfitDefault: 10,
    maxPositionSize: 100,
    maxLeverage: 5
  }
};

// Provider component
export const TradingProvider = ({ children }) => {
  const [positions, setPositions] = useState(samplePositions);
  const [orderHistory, setOrderHistory] = useState(sampleOrderHistory);
  const [pendingOrders, setPendingOrders] = useState(
    sampleOrderHistory.filter(order => order.status === 'PENDING')
  );
  const [cashBalance, setCashBalance] = useState(10000);
  const [tradingSettings, setTradingSettings] = useState(sampleTradingSettings);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Update positions with current market prices
  useEffect(() => {
    const interval = setInterval(() => {
      setPositions(prevPositions => {
        return prevPositions.map(position => {
          // Simulate small price changes
          const priceChange = (Math.random() - 0.5) * 0.5; // Random change between -0.25% and 0.25%
          const newPrice = position.currentPrice * (1 + priceChange / 100);
          const newMarketValue = newPrice * position.quantity;
          const newUnrealizedPL = position.side === 'LONG'
            ? newMarketValue - (position.entryPrice * position.quantity)
            : (position.entryPrice * position.quantity) - newMarketValue;
          const newUnrealizedPLPercent = (newUnrealizedPL / (position.entryPrice * position.quantity)) * 100;
          
          return {
            ...position,
            currentPrice: newPrice,
            marketValue: newMarketValue,
            unrealizedPL: newUnrealizedPL,
            unrealizedPLPercent: newUnrealizedPLPercent
          };
        });
      });
    }, 5000); // Update every 5 seconds
    
    return () => clearInterval(interval);
  }, []);

  // Place a new order
  const placeOrder = (orderData) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const { symbol, side, type, quantity, price } = orderData;
      
      // Validate order
      if (!symbol || !side || !type || !quantity) {
        throw new Error('Invalid order data');
      }
      
      // Create new order
      const newOrder = {
        id: `order-${Date.now()}`,
        symbol,
        side,
        type,
        quantity,
        price,
        status: 'PENDING',
        createdAt: new Date().toISOString()
      };
      
      // For market orders, execute immediately
      if (type === 'MARKET') {
        const executionPrice = price; // In a real app, this would be the current market price
        const totalValue = executionPrice * quantity;
        
        // Update order with execution details
        newOrder.executionPrice = executionPrice;
        newOrder.totalValue = totalValue;
        newOrder.status = 'FILLED';
        newOrder.filledAt = new Date().toISOString();
        
        // Update cash balance
        if (side === 'BUY') {
          setCashBalance(prev => prev - totalValue);
        } else {
          setCashBalance(prev => prev + totalValue);
        }
        
        // Update positions
        if (side === 'BUY') {
          // Check if position already exists
          const existingPosition = positions.find(p => p.symbol === symbol && p.side === 'LONG');
          
          if (existingPosition) {
            // Update existing position
            setPositions(prev => 
              prev.map(p => {
                if (p.id === existingPosition.id) {
                  const newQuantity = p.quantity + quantity;
                  const newEntryPrice = ((p.entryPrice * p.quantity) + (executionPrice * quantity)) / newQuantity;
                  const newMarketValue = newQuantity * executionPrice;
                  const newUnrealizedPL = newMarketValue - (newEntryPrice * newQuantity);
                  const newUnrealizedPLPercent = (newUnrealizedPL / (newEntryPrice * newQuantity)) * 100;
                  
                  return {
                    ...p,
                    quantity: newQuantity,
                    entryPrice: newEntryPrice,
                    marketValue: newMarketValue,
                    unrealizedPL: newUnrealizedPL,
                    unrealizedPLPercent: newUnrealizedPLPercent
                  };
                }
                return p;
              })
            );
          } else {
            // Create new position
            const newPosition = {
              id: `position-${Date.now()}`,
              symbol,
              side: 'LONG',
              quantity,
              entryPrice: executionPrice,
              currentPrice: executionPrice,
              marketValue: executionPrice * quantity,
              unrealizedPL: 0,
              unrealizedPLPercent: 0
            };
            
            setPositions(prev => [...prev, newPosition]);
          }
        } else {
          // SELL order
          // Check if position already exists
          const existingPosition = positions.find(p => p.symbol === symbol && p.side === 'LONG');
          
          if (existingPosition) {
            // If selling existing long position
            if (quantity < existingPosition.quantity) {
              // Partial sell
              setPositions(prev => 
                prev.map(p => {
                  if (p.id === existingPosition.id) {
                    const newQuantity = p.quantity - quantity;
                    const newMarketValue = newQuantity * p.currentPrice;
                    const newUnrealizedPL = newMarketValue - (p.entryPrice * newQuantity);
                    const newUnrealizedPLPercent = (newUnrealizedPL / (p.entryPrice * newQuantity)) * 100;
                    
                    return {
                      ...p,
                      quantity: newQuantity,
                      marketValue: newMarketValue,
                      unrealizedPL: newUnrealizedPL,
                      unrealizedPLPercent: newUnrealizedPLPercent
                    };
                  }
                  return p;
                })
              );
            } else if (quantity === existingPosition.quantity) {
              // Full sell - remove position
              setPositions(prev => prev.filter(p => p.id !== existingPosition.id));
            } else {
              // Selling more than owned - create short position
              const remainingQuantity = quantity - existingPosition.quantity;
              
              // Remove existing long position
              setPositions(prev => prev.filter(p => p.id !== existingPosition.id));
              
              // Create new short position
              const newPosition = {
                id: `position-${Date.now()}`,
                symbol,
                side: 'SHORT',
                quantity: remainingQuantity,
                entryPrice: executionPrice,
                currentPrice: executionPrice,
                marketValue: executionPrice * remainingQuantity,
                unrealizedPL: 0,
                unrealizedPLPercent: 0
              };
              
              setPositions(prev => [...prev, newPosition]);
            }
          } else {
            // Create new short position
            const newPosition = {
              id: `position-${Date.now()}`,
              symbol,
              side: 'SHORT',
              quantity,
              entryPrice: executionPrice,
              currentPrice: executionPrice,
              marketValue: executionPrice * quantity,
              unrealizedPL: 0,
              unrealizedPLPercent: 0
            };
            
            setPositions(prev => [...prev, newPosition]);
          }
        }
      } else {
        // For limit/stop orders, add to pending orders
        setPendingOrders(prev => [...prev, newOrder]);
      }
      
      // Add to order history
      setOrderHistory(prev => [newOrder, ...prev]);
      
      setIsLoading(false);
      return newOrder;
    } catch (err) {
      setError(err.message);
      setIsLoading(false);
      throw err;
    }
  };

  // Cancel an order
  const cancelOrder = (orderId) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Find the order
      const order = orderHistory.find(o => o.id === orderId);
      
      if (!order) {
        throw new Error('Order not found');
      }
      
      if (order.status !== 'PENDING') {
        throw new Error('Only pending orders can be cancelled');
      }
      
      // Update order status
      const updatedOrder = {
        ...order,
        status: 'CANCELLED',
        cancelledAt: new Date().toISOString()
      };
      
      // Update order history
      setOrderHistory(prev => 
        prev.map(o => o.id === orderId ? updatedOrder : o)
      );
      
      // Remove from pending orders
      setPendingOrders(prev => prev.filter(o => o.id !== orderId));
      
      setIsLoading(false);
      return updatedOrder;
    } catch (err) {
      setError(err.message);
      setIsLoading(false);
      throw err;
    }
  };

  // Close a position
  const closePosition = (positionId) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Find the position
      const position = positions.find(p => p.id === positionId);
      
      if (!position) {
        throw new Error('Position not found');
      }
      
      // Create market order to close position
      const orderSide = position.side === 'LONG' ? 'SELL' : 'BUY';
      
      const orderData = {
        symbol: position.symbol,
        side: orderSide,
        type: 'MARKET',
        quantity: position.quantity,
        price: position.currentPrice
      };
      
      // Place the order
      placeOrder(orderData);
      
      setIsLoading(false);
      return true;
    } catch (err) {
      setError(err.message);
      setIsLoading(false);
      throw err;
    }
  };

  // Update trading settings
  const updateTradingSettings = (newSettings) => {
    setTradingSettings(prev => ({
      ...prev,
      ...newSettings
    }));
  };

  // Context value
  const value = {
    positions,
    orderHistory,
    pendingOrders,
    cashBalance,
    tradingSettings,
    isLoading,
    error,
    placeOrder,
    cancelOrder,
    closePosition,
    updateTradingSettings
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