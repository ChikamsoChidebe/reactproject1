import React from 'react';

const TradingPage = () => {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Trading</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Chart Area - Takes 3/4 of the width on large screens */}
        <div className="lg:col-span-3 bg-white p-4 rounded shadow">
          <div className="flex justify-between items-center mb-4">
            <div>
              <select className="border rounded p-2">
                <option>AAPL - Apple Inc.</option>
                <option>MSFT - Microsoft Corp.</option>
                <option>GOOGL - Alphabet Inc.</option>
                <option>AMZN - Amazon.com Inc.</option>
              </select>
            </div>
            <div className="flex space-x-2">
              <button className="px-3 py-1 bg-blue-100 text-blue-800 rounded">1D</button>
              <button className="px-3 py-1 text-gray-600 hover:bg-gray-100 rounded">1W</button>
              <button className="px-3 py-1 text-gray-600 hover:bg-gray-100 rounded">1M</button>
              <button className="px-3 py-1 text-gray-600 hover:bg-gray-100 rounded">1Y</button>
            </div>
          </div>
          <div className="h-96 bg-gray-100 flex items-center justify-center">
            <p className="text-gray-500">Price chart will be displayed here</p>
          </div>
        </div>
        
        {/* Order Form - Takes 1/4 of the width on large screens */}
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-xl font-semibold mb-4">Place Order</h2>
          
          <div className="mb-4">
            <div className="grid grid-cols-2 gap-2 mb-4">
              <button className="py-2 bg-green-600 text-white rounded font-medium">Buy</button>
              <button className="py-2 bg-gray-200 text-gray-800 rounded font-medium">Sell</button>
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
              <input type="text" className="w-full border rounded p-2" placeholder="Enter quantity" />
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
              <input type="text" className="w-full border rounded p-2" placeholder="Market" />
            </div>
            
            <button className="w-full py-2 bg-green-600 text-white rounded font-medium">
              Buy AAPL
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TradingPage;