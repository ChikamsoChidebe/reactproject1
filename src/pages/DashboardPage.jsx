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
  const [realCashBalance, setRealCashBalance] = useState(0);
  const navigate = useNavigate();
  
  // Get real-time cash balance directly from localStorage and API
  const getRealCashBalance = async () => {
    if (!currentUser) return 0;
    
    try {
      // First check localStorage which is more reliable
      const localUsers = JSON.parse(localStorage.getItem('users') || '[]');
      const localUser = localUsers.find(u => u.id === currentUser.id);
      if (localUser && parseFloat(localUser.cashBalance || 0) > 0) {
        const balance = parseFloat(localUser.cashBalance || 0);
        console.log("Got balance from localStorage:", balance);
        return balance;
      }
      
      // Then try API
      try {
        const response = await fetch(`https://credoxbackend.onrender.com/api/users`);
        if (response.ok) {
          const apiUsers = await response.json();
          console.log("All API users:", apiUsers);
          const apiUser = apiUsers.find(u => u.id === currentUser.id);
          if (apiUser) {
            console.log("Got user from API:", apiUser);
            return parseFloat(apiUser.cashBalance || 0);
          }
        }
      } catch (apiErr) {
        console.error("Error fetching user from API:", apiErr);
      }
    } catch (err) {
      console.error('Error getting cash balance:', err);
    }
    
    // Last resort - use context value
    return cashBalance;
  };
  
  // Redirect if not logged in
  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
      return;
    }
    
    // Initial load of real cash balance
    const fetchInitialData = async () => {
      // Force a direct check of localStorage first
      const localUsers = JSON.parse(localStorage.getItem('users') || '[]');
      const localUser = localUsers.find(u => u.id === currentUser.id);
      if (localUser) {
        console.log("Local user data on init:", localUser);
        const localBalance = parseFloat(localUser.cashBalance || 0);
        if (localBalance > 0) {
          console.log("Setting initial balance from localStorage:", localBalance);
          setRealCashBalance(localBalance);
          return;
        }
      }
      
      // If no valid balance in localStorage, try API
      const balance = await getRealCashBalance();
      console.log("Setting initial balance from API:", balance);
      setRealCashBalance(balance);
    };
    
    fetchInitialData();
    
    // Load transactions
    const loadTransactions = () => {
      const savedTransactions = JSON.parse(localStorage.getItem('transactions') || '[]');
      const userTransactions = savedTransactions.filter(t => t.userId === currentUser.id);
      setTransactions(userTransactions);
    };
    
    loadTransactions();
    
    // Function to refresh all data
    const refreshData = async () => {
      // Force a direct check of localStorage first for immediate updates
      const localUsers = JSON.parse(localStorage.getItem('users') || '[]');
      const localUser = localUsers.find(u => u.id === currentUser.id);
      if (localUser) {
        console.log("Local user data on refresh:", localUser);
        const localBalance = parseFloat(localUser.cashBalance || 0);
        if (localBalance > 0) {
          console.log("Setting refreshed balance from localStorage:", localBalance);
          setRealCashBalance(localBalance);
        } else {
          // If no valid balance in localStorage, try API
          const balance = await getRealCashBalance();
          console.log("Setting refreshed balance from API:", balance);
          setRealCashBalance(balance);
        }
      }
      
      loadTransactions();
      setRefreshKey(prevKey => prevKey + 1);
      console.log("Dashboard data refreshed");
    };
    
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
    
    // Set up polling for real-time updates
    const intervalId = setInterval(() => {
      refreshData();
    }, 5000); // Check every 5 seconds
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('userDataChanged', handleUserDataChanged);
      clearInterval(intervalId);
    };
  }, [currentUser, navigate, cashBalance]);
  
  // Use the real cash balance from localStorage or API
  const effectiveCashBalance = realCashBalance;
  console.log("Effective cash balance:", effectiveCashBalance);
  
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
  
  // Manual refresh button handler
  const handleRefresh = async () => {
    const balance = await getRealCashBalance();
    setRealCashBalance(balance);
    setRefreshKey(prevKey => prevKey + 1);
    console.log("Manual refresh, cash balance:", balance);
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
          
          {/* Watchlist */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-medium">Watchlist</h2>
              <Link to="/markets" className="text-sm text-blue-600 hover:underline">View All</Link>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Symbol</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Change</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {getTopMovers().map((asset) => (
                    <tr key={asset.symbol}>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="font-medium">{asset.symbol}</div>
                        <div className="text-xs text-gray-500">{asset.name}</div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-right">
                        ${asset.price.toFixed(2)}
                      </td>
                      <td className={`px-4 py-3 whitespace-nowrap text-right ${
                        asset.changePercent >= 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {asset.changePercent >= 0 ? '+' : ''}{asset.changePercent.toFixed(2)}%
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-right">
                        <Link to={`/trading/${asset.symbol}`} className="text-blue-600 hover:underline mr-3">Trade</Link>
                        <Link to={`/markets/${asset.symbol}`} className="text-blue-600 hover:underline">Chart</Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          
          {/* Recent Activity */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-medium">Recent Activity</h2>
              <button onClick={() => setActiveTab('history')} className="text-sm text-blue-600 hover:underline">View All</button>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {transactions.slice(0, 5).map((transaction) => (
                    <tr key={transaction.id}>
                      <td className="px-4 py-3 whitespace-nowrap text-sm">
                        {new Date(transaction.date).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          transaction.type === 'deposit' 
                            ? 'bg-green-100 text-green-800' 
                            : transaction.type === 'withdrawal'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-blue-100 text-blue-800'
                        }`}>
                          {transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)}
                        </span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm">
                        {transaction.type === 'deposit' 
                          ? 'Deposit to account' 
                          : transaction.type === 'withdrawal'
                            ? 'Withdrawal from account'
                            : `${transaction.side} ${transaction.symbol}`}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-right">
                        {transaction.type === 'withdrawal' ? '-' : ''}${parseFloat(transaction.amount).toFixed(2)}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-right">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          transaction.status === 'completed' 
                            ? 'bg-green-100 text-green-800' 
                            : transaction.status === 'pending'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-red-100 text-red-800'
                        }`}>
                          {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {transactions.length === 0 && (
                    <tr>
                      <td colSpan="5" className="px-4 py-3 text-center text-gray-500">
                        No recent activity
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
      
      {activeTab === 'positions' && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-medium mb-4">Open Positions</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Symbol</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Side</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Entry Price</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Current Price</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Market Value</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">P&L</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {positions.map((position) => (
                  <tr key={position.id}>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="font-medium">{position.symbol}</div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        position.side === 'LONG' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {position.side}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-right">{position.quantity}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-right">${position.entryPrice.toFixed(2)}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-right">${position.currentPrice.toFixed(2)}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-right">${position.marketValue.toFixed(2)}</td>
                    <td className={`px-4 py-3 whitespace-nowrap text-right ${
                      position.unrealizedPL >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {position.unrealizedPL >= 0 ? '+' : ''}${position.unrealizedPL.toFixed(2)}
                      <br />
                      <span className="text-xs">
                        ({position.unrealizedPLPercent >= 0 ? '+' : ''}{position.unrealizedPLPercent.toFixed(2)}%)
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-right">
                      <button className="text-red-600 hover:text-red-800">Close</button>
                    </td>
                  </tr>
                ))}
                {positions.length === 0 && (
                  <tr>
                    <td colSpan="8" className="px-4 py-3 text-center text-gray-500">
                      No open positions
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
      
      {activeTab === 'orders' && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-medium mb-4">Open Orders</h2>
          {cashBalance > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Symbol</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Side</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  <tr>
                    <td className="px-4 py-3 whitespace-nowrap text-sm">Jun 1, 2025</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm">AMZN</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm">
                      <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">Buy</span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm">Limit</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-right">2</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-right">$140.00</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-right">
                      <button className="text-red-600 hover:text-red-800">Cancel</button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              No open orders. Fund your account to start trading.
            </div>
          )}
        </div>
      )}
      
      {activeTab === 'history' && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-medium mb-4">Transaction History</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {transactions.map((transaction) => (
                  <tr key={transaction.id}>
                    <td className="px-4 py-3 whitespace-nowrap text-sm">
                      {new Date(transaction.date).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        transaction.type === 'deposit' 
                          ? 'bg-green-100 text-green-800' 
                          : transaction.type === 'withdrawal'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-blue-100 text-blue-800'
                      }`}>
                        {transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm">
                      {transaction.type === 'deposit' 
                        ? 'Deposit to account' 
                        : transaction.type === 'withdrawal'
                          ? 'Withdrawal from account'
                          : `${transaction.side} ${transaction.symbol}`}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-right">
                      {transaction.type === 'withdrawal' ? '-' : ''}${parseFloat(transaction.amount).toFixed(2)}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-right">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        transaction.status === 'completed' 
                          ? 'bg-green-100 text-green-800' 
                          : transaction.status === 'pending'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                      }`}>
                        {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                      </span>
                    </td>
                  </tr>
                ))}
                {transactions.length === 0 && (
                  <tr>
                    <td colSpan="5" className="px-4 py-3 text-center text-gray-500">
                      No transaction history
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardPage;