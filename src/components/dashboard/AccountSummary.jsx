import React from 'react';
import { useTrading } from '../../contexts/TradingContext';

const AccountSummary = () => {
  const { cashBalance, marginAvailable, marginUsed } = useTrading();
  
  // Calculate equity (cash + positions value)
  const equity = cashBalance + marginUsed;
  
  // Calculate today's P&L (mock data)
  const todayPL = 2450.25;
  const todayPLPercent = 1.89;
  
  // Calculate overall P&L (mock data)
  const overallPL = 12105.67;
  const overallPLPercent = 10.08;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Account Summary</h2>
        <button className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 text-sm">
          View Details
        </button>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-md">
          <p className="text-sm text-gray-500 dark:text-gray-400">Account Balance</p>
          <p className="text-lg font-semibold">${cashBalance.toLocaleString()}</p>
        </div>
        
        <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-md">
          <p className="text-sm text-gray-500 dark:text-gray-400">Available Funds</p>
          <p className="text-lg font-semibold">${marginAvailable.toLocaleString()}</p>
        </div>
        
        <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-md">
          <p className="text-sm text-gray-500 dark:text-gray-400">Margin Used</p>
          <p className="text-lg font-semibold">${marginUsed.toLocaleString()}</p>
        </div>
        
        <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-md">
          <p className="text-sm text-gray-500 dark:text-gray-400">Equity</p>
          <p className="text-lg font-semibold">${equity.toLocaleString()}</p>
        </div>
      </div>
      
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-md">
          <div className="flex justify-between items-center">
            <p className="text-sm font-medium">Today's P/L</p>
            <span className={`px-2 py-1 rounded-full text-xs ${
              todayPL >= 0 
                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
            }`}>
              {todayPLPercent >= 0 ? '+' : ''}{todayPLPercent}%
            </span>
          </div>
          <p className={`text-xl font-bold ${
            todayPL >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
          }`}>
            {todayPL >= 0 ? '+' : ''}{todayPL.toLocaleString()}
          </p>
        </div>
        
        <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-md">
          <div className="flex justify-between items-center">
            <p className="text-sm font-medium">Overall P/L</p>
            <span className={`px-2 py-1 rounded-full text-xs ${
              overallPL >= 0 
                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
            }`}>
              {overallPLPercent >= 0 ? '+' : ''}{overallPLPercent}%
            </span>
          </div>
          <p className={`text-xl font-bold ${
            overallPL >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
          }`}>
            {overallPL >= 0 ? '+' : ''}{overallPL.toLocaleString()}
          </p>
        </div>
      </div>
      
      <div className="mt-4">
        <div className="flex justify-between items-center mb-2">
          <p className="text-sm text-gray-500 dark:text-gray-400">Margin Utilization</p>
          <p className="text-sm font-medium">
            {((marginUsed / marginAvailable) * 100).toFixed(1)}%
          </p>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
          <div 
            className="bg-blue-600 h-2.5 rounded-full" 
            style={{ width: `${Math.min(100, (marginUsed / marginAvailable) * 100)}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default AccountSummary;