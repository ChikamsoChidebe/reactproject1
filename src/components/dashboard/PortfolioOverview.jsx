import React from 'react';
import { useTrading } from '../../contexts/TradingContext';

const PortfolioOverview = ({ detailed = false }) => {
  const { positions } = useTrading();
  
  // Group positions by asset class
  const groupedPositions = positions.reduce((groups, position) => {
    const symbol = position.symbol;
    let assetClass = 'Stocks';
    
    if (symbol.includes('/')) {
      if (symbol.includes('USD')) {
        assetClass = 'Crypto';
      } else {
        assetClass = 'Forex';
      }
    } else if (symbol.includes('^')) {
      assetClass = 'Indices';
    } else if (symbol.includes('=F')) {
      assetClass = 'Commodities';
    }
    
    if (!groups[assetClass]) {
      groups[assetClass] = [];
    }
    
    groups[assetClass].push(position);
    return groups;
  }, {});
  
  // Calculate total market value
  const totalMarketValue = positions.reduce((total, position) => {
    return total + position.marketValue;
  }, 0);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Portfolio Overview</h2>
        {!detailed && (
          <button className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 text-sm">
            View Details
          </button>
        )}
      </div>
      
      {positions.length > 0 ? (
        <>
          {/* Asset Allocation Chart */}
          {detailed && (
            <div className="mb-6">
              <h3 className="text-lg font-medium mb-2">Asset Allocation</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <div className="space-y-4">
                    {Object.entries(groupedPositions).map(([assetClass, positions]) => {
                      const totalValue = positions.reduce((sum, pos) => sum + pos.marketValue, 0);
                      const percentage = (totalValue / totalMarketValue) * 100;
                      
                      return (
                        <div key={assetClass}>
                          <div className="flex justify-between mb-1">
                            <span className="text-sm font-medium">{assetClass}</span>
                            <span className="text-sm font-medium">{percentage.toFixed(1)}%</span>
                          </div>
                          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                            <div 
                              className="bg-blue-600 h-2.5 rounded-full" 
                              style={{ width: `${percentage}%` }}
                            ></div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
                
                <div className="h-48 bg-gray-100 dark:bg-gray-700 rounded-md flex items-center justify-center">
                  <p className="text-gray-500 dark:text-gray-400">Pie chart would be displayed here</p>
                </div>
              </div>
            </div>
          )}
          
          {/* Positions Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Symbol
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Side
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Quantity
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Entry Price
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Current Price
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Market Value
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    P&L
                  </th>
                  {detailed && (
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Actions
                    </th>
                  )}
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {positions.map((position) => (
                  <tr key={position.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {position.symbol}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        position.side === 'LONG' 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                          : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                      }`}>
                        {position.side}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right">
                      {position.quantity}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right">
                      ${position.entryPrice.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right">
                      ${position.currentPrice.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right">
                      ${position.marketValue.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right">
                      <div className={position.unrealizedPL >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}>
                        {position.unrealizedPL >= 0 ? '+' : ''}{position.unrealizedPL.toFixed(2)}
                        <span className="text-xs ml-1">
                          ({position.unrealizedPLPercent >= 0 ? '+' : ''}{position.unrealizedPLPercent.toFixed(2)}%)
                        </span>
                      </div>
                    </td>
                    {detailed && (
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button className="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300 mr-3">
                          Edit
                        </button>
                        <button className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300">
                          Close
                        </button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      ) : (
        <div className="text-center py-8">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100">No positions</h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            You don't have any open positions yet.
          </p>
          <div className="mt-6">
            <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
              Start Trading
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PortfolioOverview;