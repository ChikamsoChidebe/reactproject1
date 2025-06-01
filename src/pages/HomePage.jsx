import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useMarketData } from '../contexts/MarketDataContext';

const HomePage = () => {
  const { currentUser, isAuthenticated } = useAuth();
  const { marketData } = useMarketData();
  
  // Get top gainers and losers
  const getTopGainers = () => {
    const allAssets = [
      ...marketData.stocks,
      ...marketData.crypto,
      ...marketData.forex,
      ...marketData.commodities,
      ...marketData.indices
    ];
    
    return allAssets
      .sort((a, b) => b.changePercent - a.changePercent)
      .slice(0, 5);
  };
  
  const getTopLosers = () => {
    const allAssets = [
      ...marketData.stocks,
      ...marketData.crypto,
      ...marketData.forex,
      ...marketData.commodities,
      ...marketData.indices
    ];
    
    return allAssets
      .sort((a, b) => a.changePercent - b.changePercent)
      .slice(0, 5);
  };
  
  const topGainers = getTopGainers();
  const topLosers = getTopLosers();

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-900 to-indigo-800 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-10 md:mb-0">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Professional Trading Platform for Modern Investors
              </h1>
              <p className="text-xl mb-8 text-blue-100">
                Access global markets with advanced tools, real-time data, and institutional-grade execution.
              </p>
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                {isAuthenticated ? (
                  <Link to="/dashboard" className="bg-white text-blue-900 hover:bg-blue-100 px-8 py-3 rounded-md font-medium text-center">
                    Go to Dashboard
                  </Link>
                ) : (
                  <>
                    <Link to="/register" className="bg-white text-blue-900 hover:bg-blue-100 px-8 py-3 rounded-md font-medium text-center">
                      Create Account
                    </Link>
                    <Link to="/login" className="border border-white text-white hover:bg-white hover:text-blue-900 px-8 py-3 rounded-md font-medium transition-colors text-center">
                      Log In
                    </Link>
                  </>
                )}
              </div>
            </div>
            <div className="md:w-1/2">
              <img 
                src="/trading-platform.png" 
                alt="Trading Platform" 
                className="rounded-lg shadow-xl"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "https://th.bing.com/th/id/OIP.nQbgblokORY7DRPrQCPlDwHaDP?w=855&h=375&rs=1&pid=ImgDetMain";
                }}
              />
            </div>
          </div>
        </div>
      </section>
      
      {/* Market Overview */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center">Market Overview</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Major Indices */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h3 className="text-xl font-semibold mb-4">Major Indices</h3>
              <div className="space-y-4">
                {marketData.indices.slice(0, 3).map(index => (
                  <div key={index.symbol} className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">{index.name}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{index.symbol}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{index.price.toLocaleString()}</p>
                      <p className={`text-sm ${
                        index.changePercent >= 0 
                          ? 'text-green-600 dark:text-green-400' 
                          : 'text-red-600 dark:text-red-400'
                      }`}>
                        {index.changePercent >= 0 ? '+' : ''}{index.changePercent.toFixed(2)}%
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 text-center">
                <Link to="/markets/indices" className="text-blue-600 dark:text-blue-400 hover:underline text-sm">
                  View All Indices
                </Link>
              </div>
            </div>
            
            {/* Top Gainers */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h3 className="text-xl font-semibold mb-4">Top Gainers</h3>
              <div className="space-y-4">
                {topGainers.map(asset => (
                  <div key={asset.symbol} className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">{asset.symbol}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{asset.name}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{asset.price.toLocaleString()}</p>
                      <p className="text-sm text-green-600 dark:text-green-400">
                        +{asset.changePercent.toFixed(2)}%
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 text-center">
                <Link to="/markets" className="text-blue-600 dark:text-blue-400 hover:underline text-sm">
                  View All Markets
                </Link>
              </div>
            </div>
            
            {/* Top Losers */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h3 className="text-xl font-semibold mb-4">Top Losers</h3>
              <div className="space-y-4">
                {topLosers.map(asset => (
                  <div key={asset.symbol} className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">{asset.symbol}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{asset.name}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{asset.price.toLocaleString()}</p>
                      <p className="text-sm text-red-600 dark:text-red-400">
                        {asset.changePercent.toFixed(2)}%
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 text-center">
                <Link to="/markets" className="text-blue-600 dark:text-blue-400 hover:underline text-sm">
                  View All Markets
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-2 text-center">Trading Platform Features</h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-12 text-center max-w-3xl mx-auto">
            Experience the power of professional-grade trading tools designed for both novice and experienced traders.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Advanced Charting</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Access powerful technical analysis tools with multiple chart types, timeframes, and over 100 technical indicators.
              </p>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Ultra-Fast Execution</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Experience lightning-fast order execution with our low-latency infrastructure designed for high-frequency trading.
              </p>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Multi-Asset Trading</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Trade stocks, forex, cryptocurrencies, commodities, and indices all from a single unified platform.
              </p>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Advanced Security</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Rest easy with bank-level encryption, two-factor authentication, and real-time fraud monitoring systems.
              </p>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z"></path>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Comprehensive Analytics</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Track your performance with detailed analytics, risk metrics, and customizable reports to optimize your strategy.
              </p>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122"></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">API Access</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Build custom trading solutions with our comprehensive API for algorithmic trading and third-party integrations.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-16 bg-blue-900 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Start Trading?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join thousands of traders worldwide who trust Credox for their investment needs.
          </p>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            {isAuthenticated ? (
              <Link to="/dashboard" className="bg-white text-blue-900 hover:bg-blue-100 px-8 py-3 rounded-md font-medium">
                Go to Dashboard
              </Link>
            ) : (
              <>
                <Link to="/register" className="bg-white text-blue-900 hover:bg-blue-100 px-8 py-3 rounded-md font-medium">
                  Create Free Account
                </Link>
                <Link to="/demo" className="border border-white text-white hover:bg-white hover:text-blue-900 px-8 py-3 rounded-md font-medium transition-colors">
                  Try Demo Account
                </Link>
              </>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;