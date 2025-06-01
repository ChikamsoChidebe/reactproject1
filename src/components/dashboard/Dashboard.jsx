import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useTrading } from '../../contexts/TradingContext';
import { useMarketData } from '../../contexts/MarketDataContext';
import AccountSummary from './AccountSummary';
import PortfolioOverview from './PortfolioOverview';
import MarketOverview from './MarketOverview';
import RecentActivity from './RecentActivity';
import WatchList from './WatchList';
import NewsWidget from './NewsWidget';
import OrdersWidget from './OrdersWidget';
import PerformanceChart from './PerformanceChart';

const Dashboard = () => {
  const { currentUser } = useAuth();
  const { positions, cashBalance, marginAvailable, marginUsed } = useTrading();
  const { marketData, loading } = useMarketData();
  const [activeTab, setActiveTab] = useState('overview');

  // Dashboard tabs
  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'portfolio', label: 'Portfolio' },
    { id: 'orders', label: 'Orders' },
    { id: 'history', label: 'History' },
    { id: 'analytics', label: 'Analytics' },
    { id: 'settings', label: 'Settings' }
  ];

  // Calculate total portfolio value
  const totalPortfolioValue = positions.reduce((total, position) => {
    return total + position.marketValue;
  }, cashBalance);

  // Calculate total P&L
  const totalPL = positions.reduce((total, position) => {
    return total + position.unrealizedPL;
  }, 0);

  // Calculate total P&L percentage
  const totalPLPercent = totalPortfolioValue > 0 
    ? (totalPL / (totalPortfolioValue - totalPL)) * 100 
    : 0;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-bold">Welcome, {currentUser?.name || 'Trader'}</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Account: {currentUser?.accountId || 'TR12345678'} | {currentUser?.accountType || 'Standard'}
          </p>
        </div>
        <div className="mt-4 md:mt-0 flex space-x-2">
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition">
            Deposit Funds
          </button>
          <button className="bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 px-4 py-2 rounded-md transition">
            Withdraw
          </button>
        </div>
      </div>

      {/* Account Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
          <p className="text-sm text-gray-500 dark:text-gray-400">Total Portfolio Value</p>
          <p className="text-2xl font-bold">${totalPortfolioValue.toLocaleString()}</p>
          <div className={`mt-1 text-sm ${totalPLPercent >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {totalPLPercent >= 0 ? '↑' : '↓'} {Math.abs(totalPLPercent).toFixed(2)}%
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
          <p className="text-sm text-gray-500 dark:text-gray-400">Cash Balance</p>
          <p className="text-2xl font-bold">${cashBalance.toLocaleString()}</p>
          <div className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Available for trading
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
          <p className="text-sm text-gray-500 dark:text-gray-400">Margin Available</p>
          <p className="text-2xl font-bold">${marginAvailable.toLocaleString()}</p>
          <div className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {((marginUsed / marginAvailable) * 100).toFixed(1)}% used
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
          <p className="text-sm text-gray-500 dark:text-gray-400">Total P&L</p>
          <p className={`text-2xl font-bold ${totalPL >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {totalPL >= 0 ? '+' : ''}{totalPL.toLocaleString()}
          </p>
          <div className={`mt-1 text-sm ${totalPLPercent >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {totalPLPercent >= 0 ? '+' : ''}{totalPLPercent.toFixed(2)}%
          </div>
        </div>
      </div>

      {/* Dashboard Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700 mb-6">
        <nav className="flex space-x-8 overflow-x-auto">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 hover:border-gray-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Dashboard Content */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            <AccountSummary />
            
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Portfolio Performance</h2>
                <div className="flex space-x-2">
                  <button className="px-3 py-1 text-sm bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 rounded-md">1D</button>
                  <button className="px-3 py-1 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md">1W</button>
                  <button className="px-3 py-1 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md">1M</button>
                  <button className="px-3 py-1 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md">1Y</button>
                </div>
              </div>
              <PerformanceChart />
            </div>
            
            <PortfolioOverview />
            
            <RecentActivity />
          </div>
          
          {/* Right Column */}
          <div className="space-y-6">
            <MarketOverview />
            <WatchList />
            <NewsWidget />
          </div>
        </div>
      )}

      {activeTab === 'portfolio' && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
          <PortfolioOverview detailed={true} />
        </div>
      )}

      {activeTab === 'orders' && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
          <OrdersWidget />
        </div>
      )}

      {activeTab === 'history' && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Transaction History</h2>
          <p className="text-gray-500 dark:text-gray-400">Your complete trading history will appear here.</p>
        </div>
      )}

      {activeTab === 'analytics' && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Trading Analytics</h2>
          <p className="text-gray-500 dark:text-gray-400">Advanced analytics and performance metrics will appear here.</p>
        </div>
      )}

      {activeTab === 'settings' && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Account Settings</h2>
          <p className="text-gray-500 dark:text-gray-400">Configure your trading preferences and account settings here.</p>
        </div>
      )}
    </div>
  );
};

export default Dashboard;