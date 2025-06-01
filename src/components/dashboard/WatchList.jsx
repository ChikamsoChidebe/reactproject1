import React, { useState } from 'react';
import { useMarketData } from '../../contexts/MarketDataContext';
import { Link } from 'react-router-dom';

const WatchList = () => {
  const { watchlists, marketData } = useMarketData();
  const [activeWatchlist, setActiveWatchlist] = useState(watchlists[0]?.id || '');
  
  // Get watchlist data
  const getWatchlistData = () => {
    if (!activeWatchlist) return [];
    
    const watchlist = watchlists.find(w => w.id === activeWatchlist);
    if (!watchlist) return [];
    
    const allAssets = [
      ...marketData.stocks,
      ...marketData.crypto,
      ...marketData.forex,
      ...marketData.commodities,
      ...marketData.indices
    ];
    
    return watchlist.symbols.map(symbol => {
      return allAssets.find(asset => asset.symbol === symbol) || {
        symbol,
        name: symbol,
        price: 0,
        change: 0,
        changePercent: 0
      };
    });
  };
  
  const watchlistData = getWatchlistData();

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Watchlists</h2>
        <button className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 text-sm">
          Edit
        </button>
      </div>
      
      {watchlists.length > 0 ? (
        <>
          {/* Watchlist Selector */}
          <div className="mb-4">
            <select
              value={activeWatchlist}
              onChange={(e) => setActiveWatchlist(e.target.value)}
              className="block w-full rounded-md border-gray-300 dark:border-gray-700 dark:bg-gray-800 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            >
              {watchlists.map(watchlist => (
                <option key={watchlist.id} value={watchlist.id}>
                  {watchlist.name}
                </option>
              ))}
            </select>
          </div>
          
          {/* Watchlist Items */}
          <div className="space-y-3">
            {watchlistData.map(asset => (
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
          
          {watchlistData.length === 0 && (
            <div className="text-center py-4">
              <p className="text-gray-500 dark:text-gray-400">
                No symbols in this watchlist.
              </p>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-4">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"></path>
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100">No watchlists</h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Create a watchlist to track your favorite assets.
          </p>
          <div className="mt-6">
            <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
              Create Watchlist
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default WatchList;