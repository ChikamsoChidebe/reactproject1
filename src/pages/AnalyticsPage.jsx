import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useTrading } from '../contexts/TradingContext';
import { useNavigate } from 'react-router-dom';

const AnalyticsPage = () => {
  const { currentUser } = useAuth();
  const { positions, cashBalance } = useTrading();
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState([]);
  const [activeTab, setActiveTab] = useState('performance');
  const [timeframe, setTimeframe] = useState('1M');
  
  // Redirect if not logged in
  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
    }
    
    // Load transactions
    const savedTransactions = JSON.parse(localStorage.getItem('transactions') || '[]');
    const userTransactions = savedTransactions.filter(t => t.userId === currentUser?.id) || [];
    setTransactions(userTransactions);
  }, [currentUser, navigate]);
  
  // Generate performance data
  const generatePerformanceData = () => {
    const data = [];
    const today = new Date();
    
    // Generate data based on timeframe
    let days;
    switch (timeframe) {
      case '1W': days = 7; break;
      case '1M': days = 30; break;
      case '3M': days = 90; break;
      case '1Y': days = 365; break;
      case 'All': days = 730; break;
      default: days = 30;
    }
    
    let value = 10000;
    for (let i = days; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      
      // Add some randomness but with a slight upward trend
      const change = (Math.random() - 0.45) * 100;
      value += change;
      
      // Ensure value doesn't go below a reasonable amount
      value = Math.max(value, 8000);
      
      data.push({
        date: date.toISOString().split('T')[0],
        value
      });
    }
    
    return data;
  };
  
  // Generate asset allocation data
  const generateAssetAllocation = () => {
    // Use positions if available, otherwise generate sample data
    if (positions && positions.length > 0) {
      const totalValue = positions.reduce((sum, pos) => sum + pos.marketValue, 0);
      
      return positions.map(pos => ({
        symbol: pos.symbol,
        name: pos.name,
        value: pos.marketValue,
        percentage: (pos.marketValue / totalValue) * 100
      }));
    }
    
    // Sample data
    return [
      { symbol: 'AAPL', name: 'Apple Inc.', value: 3500, percentage: 35 },
      { symbol: 'MSFT', name: 'Microsoft Corp.', value: 2500, percentage: 25 },
      { symbol: 'GOOGL', name: 'Alphabet Inc.', value: 1500, percentage: 15 },
      { symbol: 'AMZN', name: 'Amazon.com Inc.', value: 1000, percentage: 10 },
      { symbol: 'TSLA', name: 'Tesla Inc.', value: 1500, percentage: 15 }
    ];
  };
  
  // Generate trade statistics
  const generateTradeStats = () => {
    // Filter for completed trade transactions
    const tradeTransactions = transactions.filter(t => 
      t.status === 'completed' && (t.type === 'buy' || t.type === 'sell')
    );
    
    // If no real trades, generate sample data
    if (!tradeTransactions || tradeTransactions.length === 0) {
      return {
        totalTrades: 24,
        winningTrades: 14,
        losingTrades: 10,
        winRate: 58.33,
        avgWin: 320.45,
        avgLoss: 175.20,
        largestWin: 1250.75,
        largestLoss: 450.30,
        profitFactor: 2.56
      };
    }
    
    // Calculate real stats
    const winningTrades = tradeTransactions.filter(t => t.profit > 0);
    const losingTrades = tradeTransactions.filter(t => t.profit < 0);
    
    const totalWinAmount = winningTrades.reduce((sum, t) => sum + t.profit, 0);
    const totalLossAmount = Math.abs(losingTrades.reduce((sum, t) => sum + t.profit, 0));
    
    return {
      totalTrades: tradeTransactions.length,
      winningTrades: winningTrades.length,
      losingTrades: losingTrades.length,
      winRate: (winningTrades.length / tradeTransactions.length) * 100,
      avgWin: winningTrades.length > 0 ? totalWinAmount / winningTrades.length : 0,
      avgLoss: losingTrades.length > 0 ? totalLossAmount / losingTrades.length : 0,
      largestWin: winningTrades.length > 0 ? Math.max(...winningTrades.map(t => t.profit)) : 0,
      largestLoss: losingTrades.length > 0 ? Math.max(...losingTrades.map(t => Math.abs(t.profit))) : 0,
      profitFactor: totalLossAmount > 0 ? totalWinAmount / totalLossAmount : 0
    };
  };
  
  const performanceData = generatePerformanceData();
  const assetAllocation = generateAssetAllocation();
  const tradeStats = generateTradeStats();
  
  // Calculate portfolio metrics
  const portfolioValue = cashBalance + (positions ? positions.reduce((sum, pos) => sum + pos.marketValue, 0) : 0);
  const dailyChange = performanceData.length >= 2 
    ? performanceData[performanceData.length - 1].value - performanceData[performanceData.length - 2].value 
    : 0;
  const dailyChangePercent = performanceData.length >= 2
    ? (dailyChange / performanceData[performanceData.length - 2].value) * 100
    : 0;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Analytics</h1>
      
      {/* Portfolio Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500">Portfolio Value</h3>
          <p className="text-2xl font-bold">${portfolioValue.toLocaleString()}</p>
          <div className={`flex items-center text-sm ${dailyChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            <span>{dailyChange >= 0 ? '+' : ''}{dailyChange.toFixed(2)}</span>
            <span className="ml-1">({dailyChangePercent.toFixed(2)}%) Today</span>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500">Win Rate</h3>
          <p className="text-2xl font-bold">{tradeStats.winRate.toFixed(1)}%</p>
          <div className="text-sm text-gray-500">
            {tradeStats.winningTrades} wins / {tradeStats.losingTrades} losses
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500">Profit Factor</h3>
          <p className="text-2xl font-bold">{tradeStats.profitFactor.toFixed(2)}</p>
          <div className="text-sm text-gray-500">
            Avg Win: ${tradeStats.avgWin.toFixed(2)} / Avg Loss: ${tradeStats.avgLoss.toFixed(2)}
          </div>
        </div>
      </div>
      
      {/* Analytics Tabs */}
      <div className="mb-6 border-b border-gray-200 overflow-x-auto">
        <nav className="flex space-x-8">
          <button
            onClick={() => setActiveTab('performance')}
            className={`py-4 px-1 border-b-2 font-medium whitespace-nowrap ${
              activeTab === 'performance'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Performance
          </button>
          <button
            onClick={() => setActiveTab('allocation')}
            className={`py-4 px-1 border-b-2 font-medium whitespace-nowrap ${
              activeTab === 'allocation'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Asset Allocation
          </button>
          <button
            onClick={() => setActiveTab('trades')}
            className={`py-4 px-1 border-b-2 font-medium whitespace-nowrap ${
              activeTab === 'trades'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Trade Analysis
          </button>
        </nav>
      </div>
      
      {/* Tab Content */}
      {activeTab === 'performance' && (
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
            <h2 className="text-lg font-medium mb-2 sm:mb-0">Portfolio Performance</h2>
            <div className="flex flex-wrap gap-2">
              <button 
                onClick={() => setTimeframe('1W')}
                className={`px-3 py-1 text-xs rounded-full ${
                  timeframe === '1W' ? 'bg-blue-100 text-blue-800' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                1W
              </button>
              <button 
                onClick={() => setTimeframe('1M')}
                className={`px-3 py-1 text-xs rounded-full ${
                  timeframe === '1M' ? 'bg-blue-100 text-blue-800' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                1M
              </button>
              <button 
                onClick={() => setTimeframe('3M')}
                className={`px-3 py-1 text-xs rounded-full ${
                  timeframe === '3M' ? 'bg-blue-100 text-blue-800' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                3M
              </button>
              <button 
                onClick={() => setTimeframe('1Y')}
                className={`px-3 py-1 text-xs rounded-full ${
                  timeframe === '1Y' ? 'bg-blue-100 text-blue-800' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                1Y
              </button>
              <button 
                onClick={() => setTimeframe('All')}
                className={`px-3 py-1 text-xs rounded-full ${
                  timeframe === 'All' ? 'bg-blue-100 text-blue-800' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                All
              </button>
            </div>
          </div>
          
          {/* Performance Chart */}
          <div className="h-80 bg-gray-50 rounded mb-4">
            <div className="h-full flex items-center justify-center text-gray-400">
              Performance chart will be displayed here
            </div>
          </div>
          
          {/* Performance Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-gray-50 p-4 rounded">
              <div className="text-sm text-gray-500">Total Return</div>
              <div className="text-lg font-medium">+24.5%</div>
            </div>
            <div className="bg-gray-50 p-4 rounded">
              <div className="text-sm text-gray-500">Annualized Return</div>
              <div className="text-lg font-medium">+18.2%</div>
            </div>
            <div className="bg-gray-50 p-4 rounded">
              <div className="text-sm text-gray-500">Sharpe Ratio</div>
              <div className="text-lg font-medium">1.45</div>
            </div>
            <div className="bg-gray-50 p-4 rounded">
              <div className="text-sm text-gray-500">Max Drawdown</div>
              <div className="text-lg font-medium">-12.3%</div>
            </div>
          </div>
        </div>
      )}
      
      {activeTab === 'allocation' && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-medium mb-4">Asset Allocation</h2>
          
          {/* Asset Allocation Chart */}
          <div className="h-80 bg-gray-50 rounded mb-6">
            <div className="h-full flex items-center justify-center text-gray-400">
              Asset allocation chart will be displayed here
            </div>
          </div>
          
          {/* Asset Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Asset</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Value</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Allocation</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {assetAllocation && assetAllocation.map((asset) => (
                  <tr key={asset.symbol}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium">{asset.symbol}</div>
                      <div className="text-sm text-gray-500">{asset.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      ${asset.value.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end">
                        <span className="mr-2">{asset.percentage.toFixed(1)}%</span>
                        <div className="w-24 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full" 
                            style={{ width: `${asset.percentage}%` }}
                          ></div>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      
      {activeTab === 'trades' && (
        <div className="space-y-6">
          {/* Trade Statistics */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-medium mb-4">Trade Statistics</h2>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-gray-50 p-4 rounded">
                <div className="text-sm text-gray-500">Total Trades</div>
                <div className="text-lg font-medium">{tradeStats.totalTrades}</div>
              </div>
              <div className="bg-gray-50 p-4 rounded">
                <div className="text-sm text-gray-500">Win Rate</div>
                <div className="text-lg font-medium">{tradeStats.winRate.toFixed(1)}%</div>
              </div>
              <div className="bg-gray-50 p-4 rounded">
                <div className="text-sm text-gray-500">Profit Factor</div>
                <div className="text-lg font-medium">{tradeStats.profitFactor.toFixed(2)}</div>
              </div>
              <div className="bg-gray-50 p-4 rounded">
                <div className="text-sm text-gray-500">Avg. Trade</div>
                <div className="text-lg font-medium">
                  ${((tradeStats.avgWin * tradeStats.winningTrades - tradeStats.avgLoss * tradeStats.losingTrades) / tradeStats.totalTrades).toFixed(2)}
                </div>
              </div>
              <div className="bg-gray-50 p-4 rounded">
                <div className="text-sm text-gray-500">Winning Trades</div>
                <div className="text-lg font-medium">{tradeStats.winningTrades}</div>
              </div>
              <div className="bg-gray-50 p-4 rounded">
                <div className="text-sm text-gray-500">Losing Trades</div>
                <div className="text-lg font-medium">{tradeStats.losingTrades}</div>
              </div>
              <div className="bg-gray-50 p-4 rounded">
                <div className="text-sm text-gray-500">Avg. Win</div>
                <div className="text-lg font-medium text-green-600">${tradeStats.avgWin.toFixed(2)}</div>
              </div>
              <div className="bg-gray-50 p-4 rounded">
                <div className="text-sm text-gray-500">Avg. Loss</div>
                <div className="text-lg font-medium text-red-600">${tradeStats.avgLoss.toFixed(2)}</div>
              </div>
            </div>
          </div>
          
          {/* Recent Trades */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-medium mb-4">Recent Trades</h2>
            
            {transactions && transactions.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Symbol</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {transactions.slice(0, 5).map((transaction) => (
                      <tr key={transaction.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {new Date(transaction.date).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {transaction.symbol || 'N/A'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            transaction.type === 'buy' 
                              ? 'bg-green-100 text-green-800' 
                              : transaction.type === 'sell'
                                ? 'bg-red-100 text-red-800'
                                : 'bg-blue-100 text-blue-800'
                          }`}>
                            {transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          {transaction.quantity || 'N/A'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          ${transaction.price ? transaction.price.toFixed(2) : 'N/A'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          ${parseFloat(transaction.amount).toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                No trade history available
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AnalyticsPage;