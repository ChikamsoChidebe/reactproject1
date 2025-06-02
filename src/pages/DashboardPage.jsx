import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTrading } from '../contexts/TradingContext';
import { useMarketData } from '../contexts/MarketDataContext';
import PortfolioChart from '../components/charts/PortfolioChart';

const DashboardPage = () => {
  const { currentUser } = useAuth();
  const { positions, cashBalance } = useTrading();
  const { marketData } = useMarketData();
  const [activeTab, setActiveTab] = useState('overview');
  const [transactions, setTransactions] = useState([]);
  const [refreshKey, setRefreshKey] = useState(0);
  const [localCashBalance, setLocalCashBalance] = useState(0);
  const navigate = useNavigate();
  
  // Redirect if not logged in
  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
    }
    
    // Load transactions
    const loadTransactions = () => {
      const savedTransactions = JSON.parse(localStorage.getItem('transactions') || '[]');
      const userTransactions = savedTransactions.filter(t => t.userId === currentUser?.id);
      setTransactions(userTransactions);
    };
    
    // Function to refresh all data
    const refreshData = () => {
      loadTransactions();
      
      // Get latest cash balance directly from localStorage
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const user = users.find(u => u.id === currentUser?.id);
      if (user) {
        setLocalCashBalance(parseFloat(user.cashBalance || 0));
      }
      
      setRefreshKey(prevKey => prevKey + 1);
      console.log("Dashboard data refreshed");
    };
    
    loadTransactions();
    refreshData(); // Load initial data
    
    // Listen for changes in localStorage
    const handleStorageChange = (e) => {
      if (e.key === 'users' || e.key === 'transactions' || e.key?.startsWith('positions_')) {
        refreshData();
      }
    };
    
    // Listen for custom event
    const handleUserDataChanged = () => {
      refreshData();
    };
    
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('userDataChanged', handleUserDataChanged);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('userDataChanged', handleUserDataChanged);
    };
  }, [currentUser, navigate]);
  
  // Use local cash balance if available, otherwise use the one from context
  const effectiveCashBalance = localCashBalance > 0 ? localCashBalance : cashBalance;
  
  // Calculate total portfolio value - should be 0 if no cash balance
  const totalPortfolioValue = effectiveCashBalance === 0 ? 0 : positions.reduce((total, position) => {
    return total + position.marketValue;
  }, effectiveCashBalance);
  
  // Calculate daily P&L - should be 0 if no cash balance
  const dailyPL = effectiveCashBalance === 0 ? 0 : positions.reduce((total, position) => {
    return total + (position.currentPrice - position.entryPrice) * position.quantity;
  }, 0);
  
  // Get top movers from watchlist
  const getTopMovers = () => {
    const allAssets = [
      ...marketData.stocks.slice(0, 3),
      ...marketData.crypto.slice(0, 2)
    ];
    
    return allAssets.sort((a, b) => Math.abs(b.changePercent) - Math.abs(a.changePercent));
  };

  // Handle deposit button click
  const handleDepositClick = () => {
    navigate('/deposit');
  };

  // Handle withdraw button click
  const handleWithdrawClick = () => {
    navigate('/withdraw');
  };

  // Manual refresh button
  const handleRefresh = () => {
    // Get latest cash balance directly from localStorage
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find(u => u.id === currentUser?.id);
    if (user) {
      setLocalCashBalance(parseFloat(user.cashBalance || 0));
    }
    
    setRefreshKey(prevKey => prevKey + 1);
    console.log("Manual refresh triggered");
  };

  if (!currentUser) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Welcome, {currentUser?.name || 'Trader'}</h1>
          <p className="text-gray-600">Account ID: {currentUser?.accountId || 'CR-123456'}</p>
        </div>
        <div className="flex space-x-2 mt-4 md:mt-0">
          <button 
            onClick={handleRefresh}
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded flex items-center"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
            </svg>
            Refresh
          </button>
          <button 
            onClick={handleDepositClick}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
          >
            Deposit
          </button>
          <button 
            onClick={handleWithdrawClick}
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded"
            disabled={effectiveCashBalance <= 0}
          >
            Withdraw
          </button>
        </div>
      </div>
      
      {effectiveCashBalance === 0 && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                Your account is pending funding. Please make a deposit or contact support to start trading.
              </p>
            </div>
          </div>
        </div>
      )}
      
      {/* Dashboard Tabs */}
      <div className="mb-6 border-b border-gray-200 overflow-x-auto">
        <nav className="flex space-x-8">
          <button
            onClick={() => setActiveTab('overview')}
            className={`py-4 px-1 border-b-2 font-medium whitespace-nowrap ${
              activeTab === 'overview'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('positions')}
            className={`py-4 px-1 border-b-2 font-medium whitespace-nowrap ${
              activeTab === 'positions'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Positions
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`py-4 px-1 border-b-2 font-medium whitespace-nowrap ${
              activeTab === 'orders'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Orders
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`py-4 px-1 border-b-2 font-medium whitespace-nowrap ${
              activeTab === 'history'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            History
          </button>
        </nav>
      </div>
      
      {/* Account Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500">Portfolio Value</h3>
          <p className="text-2xl font-bold">${totalPortfolioValue.toLocaleString()}</p>
          <div className={`flex items-center text-sm ${dailyPL >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            <span>{dailyPL >= 0 ? '+' : ''}{dailyPL.toFixed(2)}</span>
            <span className="ml-1">Today</span>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500">Cash Balance</h3>
          <p className="text-2xl font-bold">${effectiveCashBalance.toLocaleString()}</p>
          <div className="text-sm text-gray-500">Available for trading</div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500">Open Positions</h3>
          <p className="text-2xl font-bold">{positions.length}</p>
          <div className="text-sm text-gray-500">Across {new Set(positions.map(p => p.symbol)).size} symbols</div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500">Account Level</h3>
          <p className="text-2xl font-bold">{currentUser?.accountType || 'Standard'}</p>
          <div className="text-sm text-blue-600">
            <Link to="/account/upgrade">View benefits</Link>
          </div>
        </div>
      </div>
      
      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Portfolio Chart */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
              <h2 className="text-lg font-medium mb-2 sm:mb-0">Portfolio Performance</h2>
              <div className="flex flex-wrap gap-2">
                <button className="px-3 py-1 text-xs rounded-full bg-blue-100 text-blue-800">1D</button>
                <button className="px-3 py-1 text-xs rounded-full text-gray-600">1W</button>
                <button className="px-3 py-1 text-xs rounded-full text-gray-600">1M</button>
                <button className="px-3 py-1 text-xs rounded-full text-gray-600">3M</button>
                <button className="px-3 py-1 text-xs rounded-full text-gray-600">1Y</button>
                <button className="px-3 py-1 text-xs rounded-full text-gray-600">All</button>
              </div>
            </div>
            <div className="h-64 bg-gray-50 rounded">
              {effectiveCashBalance > 0 ? (
                <PortfolioChart timeframe="1D" key={`portfolio-${refreshKey}`} />
              ) : (
                <div className="h-full flex items-center justify-center text-gray-400">
                  No portfolio data available. Fund your account to start trading.
                </div>
              )}
            </div>
          </div>
          
          {/* Rest of the component remains the same */}
          {/* ... */}
        </div>
      )}
      
      {/* Other tabs remain the same */}
      {/* ... */}
    </div>
  );
};

export default DashboardPage;