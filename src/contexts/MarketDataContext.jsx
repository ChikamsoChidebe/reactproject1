import React, { createContext, useContext, useState, useEffect } from 'react';

// Create context
const MarketDataContext = createContext();

// Sample market data
const sampleMarketData = {
  stocks: [
    { symbol: 'AAPL', name: 'Apple Inc.', price: 178.72, change: 2.45, changePercent: 1.39, volume: 68423500 },
    { symbol: 'MSFT', name: 'Microsoft Corp.', price: 334.12, change: -1.23, changePercent: -0.37, volume: 22145600 },
    { symbol: 'GOOGL', name: 'Alphabet Inc.', price: 134.99, change: 0.87, changePercent: 0.65, volume: 18234700 },
    { symbol: 'AMZN', name: 'Amazon.com Inc.', price: 145.24, change: 3.21, changePercent: 2.26, volume: 35678900 },
    { symbol: 'TSLA', name: 'Tesla Inc.', price: 248.50, change: -5.67, changePercent: -2.23, volume: 43256700 }
  ],
  forex: [
    { symbol: 'EUR/USD', name: 'Euro / US Dollar', price: 1.0876, change: 0.0023, changePercent: 0.21, volume: 98765432 },
    { symbol: 'GBP/USD', name: 'British Pound / US Dollar', price: 1.2654, change: -0.0045, changePercent: -0.35, volume: 76543210 },
    { symbol: 'USD/JPY', name: 'US Dollar / Japanese Yen', price: 149.87, change: 0.76, changePercent: 0.51, volume: 65432109 },
    { symbol: 'USD/CAD', name: 'US Dollar / Canadian Dollar', price: 1.3567, change: -0.0078, changePercent: -0.57, volume: 54321098 },
    { symbol: 'AUD/USD', name: 'Australian Dollar / US Dollar', price: 0.6543, change: 0.0034, changePercent: 0.52, volume: 43210987 }
  ],
  crypto: [
    { symbol: 'BTC/USD', name: 'Bitcoin / US Dollar', price: 43567.89, change: 1234.56, changePercent: 2.92, volume: 32109876 },
    { symbol: 'ETH/USD', name: 'Ethereum / US Dollar', price: 2345.67, change: -78.90, changePercent: -3.25, volume: 21098765 },
    { symbol: 'SOL/USD', name: 'Solana / US Dollar', price: 123.45, change: 5.67, changePercent: 4.82, volume: 10987654 },
    { symbol: 'ADA/USD', name: 'Cardano / US Dollar', price: 0.5678, change: 0.0234, changePercent: 4.30, volume: 9876543 },
    { symbol: 'XRP/USD', name: 'Ripple / US Dollar', price: 0.6789, change: -0.0345, changePercent: -4.83, volume: 8765432 }
  ],
  commodities: [
    { symbol: 'GC=F', name: 'Gold Futures', price: 2345.60, change: 12.40, changePercent: 0.53, volume: 7654321 },
    { symbol: 'SI=F', name: 'Silver Futures', price: 27.85, change: -0.42, changePercent: -1.49, volume: 6543210 },
    { symbol: 'CL=F', name: 'Crude Oil Futures', price: 76.32, change: 1.24, changePercent: 1.65, volume: 5432109 },
    { symbol: 'NG=F', name: 'Natural Gas Futures', price: 2.87, change: -0.05, changePercent: -1.71, volume: 4321098 },
    { symbol: 'HG=F', name: 'Copper Futures', price: 4.32, change: 0.08, changePercent: 1.89, volume: 3210987 }
  ],
  indices: [
    { symbol: '^GSPC', name: 'S&P 500', price: 4567.89, change: 23.45, changePercent: 0.52, volume: 2109876 },
    { symbol: '^DJI', name: 'Dow Jones Industrial Average', price: 34567.89, change: -123.45, changePercent: -0.36, volume: 1098765 },
    { symbol: '^IXIC', name: 'NASDAQ Composite', price: 14567.89, change: 78.90, changePercent: 0.54, volume: 987654 },
    { symbol: '^RUT', name: 'Russell 2000', price: 1987.65, change: -12.34, changePercent: -0.62, volume: 876543 },
    { symbol: '^VIX', name: 'CBOE Volatility Index', price: 18.76, change: 1.23, changePercent: 7.01, volume: 765432 }
  ]
};

// Sample watchlists
const sampleWatchlists = [
  {
    id: 'watchlist-1',
    name: 'My Watchlist',
    symbols: ['AAPL', 'MSFT', 'GOOGL', 'BTC/USD', 'ETH/USD']
  },
  {
    id: 'watchlist-2',
    name: 'Forex',
    symbols: ['EUR/USD', 'GBP/USD', 'USD/JPY', 'USD/CAD', 'AUD/USD']
  },
  {
    id: 'watchlist-3',
    name: 'Commodities',
    symbols: ['GC=F', 'SI=F', 'CL=F', 'NG=F', 'HG=F']
  }
];

// Sample market news
const sampleMarketNews = [
  {
    id: 'news-1',
    title: 'Federal Reserve Holds Interest Rates Steady',
    summary: 'The Federal Reserve announced today that it will maintain current interest rates, citing stable inflation and strong employment data.',
    source: 'Financial Times',
    timestamp: new Date().getTime() - 3600000, // 1 hour ago
    url: '#',
    relatedSymbols: ['^GSPC', '^DJI', 'USD/JPY']
  },
  {
    id: 'news-2',
    title: 'Apple Announces New iPhone Launch Date',
    summary: 'Apple Inc. has scheduled its annual product launch event for next month, where it is expected to unveil the latest iPhone models.',
    source: 'Tech Today',
    timestamp: new Date().getTime() - 7200000, // 2 hours ago
    url: '#',
    relatedSymbols: ['AAPL']
  },
  {
    id: 'news-3',
    title: 'Oil Prices Surge Amid Middle East Tensions',
    summary: 'Crude oil prices jumped 3% today as geopolitical tensions in the Middle East raised concerns about potential supply disruptions.',
    source: 'Energy Report',
    timestamp: new Date().getTime() - 10800000, // 3 hours ago
    url: '#',
    relatedSymbols: ['CL=F']
  },
  {
    id: 'news-4',
    title: 'Bitcoin Breaks $45,000 Resistance Level',
    summary: 'Bitcoin surged past $45,000 today, reaching its highest level in three months as institutional adoption continues to grow.',
    source: 'Crypto News',
    timestamp: new Date().getTime() - 14400000, // 4 hours ago
    url: '#',
    relatedSymbols: ['BTC/USD']
  },
  {
    id: 'news-5',
    title: 'Tesla Exceeds Quarterly Delivery Expectations',
    summary: 'Tesla reported vehicle deliveries that exceeded analyst expectations, despite ongoing supply chain challenges in the automotive industry.',
    source: 'Auto Insider',
    timestamp: new Date().getTime() - 18000000, // 5 hours ago
    url: '#',
    relatedSymbols: ['TSLA']
  }
];

// Provider component
export const MarketDataProvider = ({ children }) => {
  const [marketData, setMarketData] = useState(sampleMarketData);
  const [watchlists, setWatchlists] = useState(sampleWatchlists);
  const [marketNews, setMarketNews] = useState(sampleMarketNews);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setMarketData(prevData => {
        // Create a deep copy of the previous data
        const newData = JSON.parse(JSON.stringify(prevData));
        
        // Update each asset category with small random changes
        Object.keys(newData).forEach(category => {
          newData[category] = newData[category].map(asset => {
            const randomChange = (Math.random() - 0.5) * 0.5; // Random change between -0.25% and 0.25%
            const newPrice = asset.price * (1 + randomChange / 100);
            const newChangePercent = asset.changePercent + randomChange;
            const newChange = asset.price * (newChangePercent / 100);
            
            return {
              ...asset,
              price: newPrice,
              change: newChange,
              changePercent: newChangePercent
            };
          });
        });
        
        return newData;
      });
    }, 5000); // Update every 5 seconds
    
    return () => clearInterval(interval);
  }, []);

  // Add a watchlist
  const addWatchlist = (name, symbols = []) => {
    const newWatchlist = {
      id: `watchlist-${Date.now()}`,
      name,
      symbols
    };
    
    setWatchlists(prev => [...prev, newWatchlist]);
    return newWatchlist;
  };

  // Update a watchlist
  const updateWatchlist = (id, updates) => {
    setWatchlists(prev => 
      prev.map(watchlist => 
        watchlist.id === id ? { ...watchlist, ...updates } : watchlist
      )
    );
  };

  // Delete a watchlist
  const deleteWatchlist = (id) => {
    setWatchlists(prev => prev.filter(watchlist => watchlist.id !== id));
  };

  // Add symbol to watchlist
  const addSymbolToWatchlist = (watchlistId, symbol) => {
    setWatchlists(prev => 
      prev.map(watchlist => {
        if (watchlist.id === watchlistId && !watchlist.symbols.includes(symbol)) {
          return {
            ...watchlist,
            symbols: [...watchlist.symbols, symbol]
          };
        }
        return watchlist;
      })
    );
  };

  // Remove symbol from watchlist
  const removeSymbolFromWatchlist = (watchlistId, symbol) => {
    setWatchlists(prev => 
      prev.map(watchlist => {
        if (watchlist.id === watchlistId) {
          return {
            ...watchlist,
            symbols: watchlist.symbols.filter(s => s !== symbol)
          };
        }
        return watchlist;
      })
    );
  };

  // Search for assets
  const searchAssets = (query) => {
    if (!query) return [];
    
    query = query.toLowerCase();
    
    const results = [];
    
    Object.keys(marketData).forEach(category => {
      marketData[category].forEach(asset => {
        if (
          asset.symbol.toLowerCase().includes(query) ||
          asset.name.toLowerCase().includes(query)
        ) {
          results.push({
            ...asset,
            category
          });
        }
      });
    });
    
    return results;
  };

  // Context value
  const value = {
    marketData,
    watchlists,
    marketNews,
    isLoading,
    error,
    addWatchlist,
    updateWatchlist,
    deleteWatchlist,
    addSymbolToWatchlist,
    removeSymbolFromWatchlist,
    searchAssets
  };

  return (
    <MarketDataContext.Provider value={value}>
      {children}
    </MarketDataContext.Provider>
  );
};

// Custom hook
export const useMarketData = () => {
  const context = useContext(MarketDataContext);
  if (context === undefined) {
    throw new Error('useMarketData must be used within a MarketDataProvider');
  }
  return context;
};

export default MarketDataContext;