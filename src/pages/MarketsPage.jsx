import React from 'react';

const MarketsPage = () => {
  // Sample market data
  const marketData = [
    { symbol: 'AAPL', name: 'Apple Inc.', price: 178.72, change: 2.45, changePercent: 1.39 },
    { symbol: 'MSFT', name: 'Microsoft Corp.', price: 334.12, change: -1.23, changePercent: -0.37 },
    { symbol: 'GOOGL', name: 'Alphabet Inc.', price: 134.99, change: 0.87, changePercent: 0.65 },
    { symbol: 'AMZN', name: 'Amazon.com Inc.', price: 145.24, change: 3.21, changePercent: 2.26 },
    { symbol: 'TSLA', name: 'Tesla Inc.', price: 248.50, change: -5.67, changePercent: -2.23 }
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Markets</h1>
      
      <div className="mb-6">
        <div className="flex space-x-4 border-b">
          <button className="py-2 px-4 border-b-2 border-blue-500 text-blue-600 font-medium">Stocks</button>
          <button className="py-2 px-4 text-gray-500 hover:text-gray-700">Forex</button>
          <button className="py-2 px-4 text-gray-500 hover:text-gray-700">Crypto</button>
          <button className="py-2 px-4 text-gray-500 hover:text-gray-700">Commodities</button>
          <button className="py-2 px-4 text-gray-500 hover:text-gray-700">Indices</button>
        </div>
      </div>
      
      <div className="bg-white rounded shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Symbol</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Change</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">% Change</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {marketData.map((item) => (
              <tr key={item.symbol} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">{item.symbol}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">{item.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-right">${item.price.toFixed(2)}</td>
                <td className={`px-6 py-4 whitespace-nowrap text-sm text-right ${
                  item.change >= 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {item.change >= 0 ? '+' : ''}{item.change.toFixed(2)}
                </td>
                <td className={`px-6 py-4 whitespace-nowrap text-sm text-right ${
                  item.changePercent >= 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {item.changePercent >= 0 ? '+' : ''}{item.changePercent.toFixed(2)}%
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button className="text-blue-600 hover:text-blue-900 mr-4">Chart</button>
                  <button className="text-green-600 hover:text-green-900">Trade</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MarketsPage;