import React, { useState } from 'react';
import { useTrading } from '../contexts/TradingContext';

const AnalyticsPage = () => {
  const { positions, orderHistory } = useTrading();
  const [timeframe, setTimeframe] = useState('1M');
  
  // Timeframe options
  const timeframes = [
    { id: '1W', label: '1 Week' },
    { id: '1M', label: '1 Month' },
    { id: '3M', label: '3 Months' },
    { id: '6M', label: '6 Months' },
    { id: '1Y', label: '1 Year' },
    { id: 'ALL', label: 'All Time' }
  ];
  
  // Mock performance data
  const performanceData = {
    totalTrades: 124,
    winningTrades: 78,
    losingTrades: 46,
    winRate: 62.9,
    averageWin: 320.45,
    averageLoss: 175.32,
    profitFactor: 2.87,
    largestWin: 1250.75,
    largestLoss: 680.25,
    averageHoldingTime: '2.3 days',
    sharpeRatio: 1.85,
    maxDrawdown: 12.4
  };
  
  // Mock monthly returns
  const monthlyReturns = [
    { month: 'Jan', return: 3.2 },
    { month: 'Feb', return: -1.5 },
    { month: 'Mar', return: 4.7 },
    { month: 'Apr', return: 2.1 },
    { month: 'May', return: -0.8 },
    { month: 'Jun', return: 5.3 }
  ];
  
  // Mock asset allocation
  const assetAllocation = [
    { asset: 'Stocks', percentage: 45 },
    { asset: 'Crypto', percentage: 25 },
    { asset: 'Forex', percentage: 15 },
    { asset: 'Commodities', percentage: 10 },
    { asset: 'Cash', percentage: 5 }
  ];
  
  // Mock sector allocation
  const sectorAllocation = [
    { sector: 'Technology', percentage: 35 },
    { sector: 'Financial', percentage: 20 },
    { sector: 'Healthcare', percentage: 15 },
    { sector: 'Consumer', percentage: 12 },
    { sector: 'Energy', percentage: 10 },
    { sector: 'Other', percentage: 8 }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Analytics</h1>
      
      {/* Timeframe Selector */}
      <div className="mb-6">
        <div className="flex flex-wrap gap-2">
          {timeframes.map(tf => (
            <button
              key={tf.id}
              onClick={() => setTimeframe(tf.id)}
              className={`px-4 py-2 rounded-md text-sm font-medium ${
                timeframe === tf.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-300 dark:border-gray-700'
              }`}
            >
              {tf.label}
            </button>
          ))}
        </div>
      </div>
      
      {/* Performance Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Total P&L</h3>
          <p className="text-2xl font-bold text-green-600 dark:text-green-400">+$12,450.67</p>
          <p className="text-sm text-green-600 dark:text-green-400">+18.7%</p>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Win Rate</h3>
          <p className="text-2xl font-bold">{performanceData.winRate}%</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {performanceData.winningTrades} / {performanceData.totalTrades} trades
          </p>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Profit Factor</h3>
          <p className="text-2xl font-bold">{performanceData.profitFactor}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Gross profit / Gross loss
          </p>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Max Drawdown</h3>
          <p className="text-2xl font-bold text-red-600 dark:text-red-400">{performanceData.maxDrawdown}%</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Largest peak-to-trough decline
          </p>
        </div>
      </div>
      
      {/* Performance Chart */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Performance Chart</h2>
        <div className="h-80 bg-gray-100 dark:bg-gray-700 rounded-md flex items-center justify-center">
          <p className="text-gray-500 dark:text-gray-400">Performance chart would be displayed here</p>
        </div>
      </div>
      
      {/* Monthly Returns and Asset Allocation */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Monthly Returns */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Monthly Returns</h2>
          <div className="space-y-4">
            {monthlyReturns.map(month => (
              <div key={month.month} className="flex items-center">
                <div className="w-16 text-sm font-medium">{month.month}</div>
                <div className="flex-grow">
                  <div className="relative h-8 flex items-center">
                    {month.return >= 0 ? (
                      <div 
                        className="absolute h-6 bg-green-500 rounded-sm" 
                        style={{ width: `${Math.min(Math.abs(month.return) * 5, 100)}%`, left: '50%' }}
                      ></div>
                    ) : (
                      <div 
                        className="absolute h-6 bg-red-500 rounded-sm" 
                        style={{ width: `${Math.min(Math.abs(month.return) * 5, 100)}%`, right: '50%' }}
                      ></div>
                    )}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className={`text-sm font-medium ${Math.abs(month.return) > 3 ? 'text-white' : ''}`}>
                        {month.return >= 0 ? '+' : ''}{month.return}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Asset Allocation */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Asset Allocation</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="space-y-4">
                {assetAllocation.map(asset => (
                  <div key={asset.asset}>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">{asset.asset}</span>
                      <span className="text-sm font-medium">{asset.percentage}%</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                      <div 
                        className="bg-blue-600 h-2.5 rounded-full" 
                        style={{ width: `${asset.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="h-48 bg-gray-100 dark:bg-gray-700 rounded-md flex items-center justify-center">
              <p className="text-gray-500 dark:text-gray-400">Pie chart would be displayed here</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Sector Allocation and Trading Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Sector Allocation */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Sector Allocation</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="space-y-4">
                {sectorAllocation.map(sector => (
                  <div key={sector.sector}>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">{sector.sector}</span>
                      <span className="text-sm font-medium">{sector.percentage}%</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                      <div 
                        className="bg-purple-600 h-2.5 rounded-full" 
                        style={{ width: `${sector.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="h-48 bg-gray-100 dark:bg-gray-700 rounded-md flex items-center justify-center">
              <p className="text-gray-500 dark:text-gray-400">Pie chart would be displayed here</p>
            </div>
          </div>
        </div>
        
        {/* Trading Metrics */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Trading Metrics</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Trades</h3>
              <p className="text-lg font-semibold">{performanceData.totalTrades}</p>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Winning Trades</h3>
              <p className="text-lg font-semibold text-green-600 dark:text-green-400">{performanceData.winningTrades}</p>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Losing Trades</h3>
              <p className="text-lg font-semibold text-red-600 dark:text-red-400">{performanceData.losingTrades}</p>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Average Win</h3>
              <p className="text-lg font-semibold text-green-600 dark:text-green-400">${performanceData.averageWin}</p>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Average Loss</h3>
              <p className="text-lg font-semibold text-red-600 dark:text-red-400">${performanceData.averageLoss}</p>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Largest Win</h3>
              <p className="text-lg font-semibold text-green-600 dark:text-green-400">${performanceData.largestWin}</p>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Largest Loss</h3>
              <p className="text-lg font-semibold text-red-600 dark:text-red-400">${performanceData.largestLoss}</p>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Avg Holding Time</h3>
              <p className="text-lg font-semibold">{performanceData.averageHoldingTime}</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Trade History */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-4">Trade History</h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Date
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Symbol
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Type
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Side
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Quantity
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Price
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Total
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  P&L
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {orderHistory.length > 0 ? (
                orderHistory.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {new Date(order.filledAt || order.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {order.symbol}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {order.type}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        order.side === 'BUY' 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                          : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                      }`}>
                        {order.side}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right">
                      {order.quantity}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right">
                      ${order.executionPrice?.toFixed(2) || order.price?.toFixed(2) || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right">
                      ${order.totalValue?.toFixed(2) || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right">
                      <span className={order.status === 'FILLED' ? (Math.random() > 0.5 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400') : ''}>
                        {order.status === 'FILLED' ? (Math.random() > 0.5 ? '+' : '-') + '$' + (Math.random() * 500).toFixed(2) : '-'}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
                    No trade history available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;