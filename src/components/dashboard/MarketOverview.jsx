import React from 'react';
import { useMarketData } from '../../contexts/MarketDataContext';
import { Link } from 'react-router-dom';

const MarketOverview = () => {
  const { marketData } = useMarketData();
  
  // Get top movers (combined gainers and losers)
  const getTopMovers = () => {
    const allAssets = [
      ...marketData.stocks,
      ...marketData.crypto,
      ...marketData.forex,
      ...marketData.commodities,
      ...marketData.indices
    ];
    
    // Sort by absolute change percentage
    return allAssets
      .sort((a, b) => Math.abs(b.changePercent) - Math.abs(a.changePercent))
      .slice(0, 5);
  };
  
  const topMovers = getTopMovers();

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Market Overview</h2>
        <Link to="/markets" className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 text-sm">
          View All
        </Link>
      </div>
      
      {/* Major Indices */}
      <div className="mb-6">
        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">Major Indices</h3>
        <div className="space-y-3">
          {marketData.indices.slice(0, 3).map(index => (
            <div key={index.symbol} className="flex justify-between items-center">
              <div>
                <p className="font-medium">{index.symbol}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{index.name}</p>
              </div>
              <div className="text-right">
                <p className="font-medium">{index.price.toLocaleString()}</p>
                <p className={`text-xs ${
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
      </div>
      
      {/* Top Movers */}
      <div>
        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">Top Movers</h3>
        <div className="space-y-3">
          {topMovers.map(asset => (
            <div key={asset.symbol} className="flex justify-between items-center">
              <div>
                <p className="font-medium">{asset.symbol}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{asset.name}</p>
              </div>
              <div className="text-right">
                <p className="font-medium">{asset.price.toLocaleString()}</p>
                <p className={`text-xs ${
                  asset.changePercent >= 0 
                    ? 'text-green-600 dark:text-green-400' 
                    : 'text-red-600 dark:text-red-400'
                }`}>
                  {asset.changePercent >= 0 ? '+' : ''}{asset.changePercent.toFixed(2)}%
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MarketOverview;