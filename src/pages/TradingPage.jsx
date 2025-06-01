import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useMarketData } from '../contexts/MarketDataContext';
import { useTrading } from '../contexts/TradingContext';
import { useAuth } from '../contexts/AuthContext';
import MarketChart from '../components/charts/MarketChart';

const TradingPage = () => {
  const { symbol } = useParams();
  const { marketData } = useMarketData();
  const { cashBalance, positions } = useTrading();
  const { currentUser } = useAuth();
  
  // Find the selected asset or default to the first stock
  const allAssets = [
    ...marketData.stocks,
    ...marketData.crypto,
    ...marketData.forex,
    ...marketData.commodities,
    ...marketData.indices
  ];
  
  const [selectedAsset, setSelectedAsset] = useState(
    allAssets.find(asset => asset.symbol === symbol) || marketData.stocks[0]
  );
  
  const [orderType, setOrderType] = useState('market');
  const [orderSide, setOrderSide] = useState('buy');
  const [quantity, setQuantity] = useState('');
  const [limitPrice, setLimitPrice] = useState('');
  const [timeframe, setTimeframe] = useState('1D');
  
  // Check if the asset is in the user's positions
  const currentPosition = positions.find(p => p.symbol === selectedAsset.symbol);
  const isPositive = selectedAsset.changePercent >= 0;
  
  // Handle asset selection
  const handleAssetChange = (e) => {
    const newAsset = allAssets.find(asset => asset.symbol === e.target.value);
    if (newAsset) {
      setSelectedAsset(newAsset);
    }
  };
  
  // Handle order submission
  const handleSubmitOrder = (e) => {
    e.preventDefault();
    // Order submission logic would go here
    alert(`Order placed: ${orderSide} ${quantity} ${selectedAsset.symbol} at ${orderType === 'market' ? 'market price' : '$' + limitPrice}`);
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart Section */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
              <div>
                <select
                  className="border border-gray-300 rounded-md p-2"
                  value={selectedAsset.symbol}
                  onChange={handleAssetChange}
                >
                  {allAssets.map(asset => (
                    <option key={asset.symbol} value={asset.symbol}>
                      {asset.symbol} - {asset.name}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="mt-4 sm:mt-0">
                <div className="text-2xl font-bold">${selectedAsset.price.toFixed(2)}</div>
                <div className={`text-sm ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                  {isPositive ? '+' : ''}{selectedAsset.changePercent.toFixed(2)}% Today
                </div>
              </div>
            </div>
            
            {/* Timeframe Selector */}
            <div className="flex space-x-2 mb-4">
              {['1D', '1W', '1M', '3M', '1Y', 'All'].map(tf => (
                <button
                  key={tf}
                  className={`px-3 py-1 text-xs rounded-full ${
                    timeframe === tf 
                      ? 'bg-blue-100 text-blue-800' 
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                  onClick={() => setTimeframe(tf)}
                >
                  {tf}
                </button>
              ))}
            </div>
            
            {/* Chart */}
            <div className="h-96">
              <MarketChart symbol={selectedAsset.symbol} isPositive={isPositive} />
            </div>
          </div>
          
          {/* Market Information */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-medium mb-4">Market Information</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <div className="text-sm text-gray-500">Open</div>
                <div className="font-medium">${(selectedAsset.price * 0.995).toFixed(2)}</div>
              </div>
              <div>
                <div className="text-sm text-gray-500">High</div>
                <div className="font-medium">${(selectedAsset.price * 1.01).toFixed(2)}</div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Low</div>
                <div className="font-medium">${(selectedAsset.price * 0.99).toFixed(2)}</div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Volume</div>
                <div className="font-medium">{Math.floor(Math.random() * 10000000).toLocaleString()}</div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Order Form */}
        <div>
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h2 className="text-lg font-medium mb-4">Place Order</h2>
            
            {/* Order Type Tabs */}
            <div className="flex mb-4">
              <button
                className={`flex-1 py-2 text-center ${
                  orderType === 'market'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                } rounded-l-md`}
                onClick={() => setOrderType('market')}
              >
                Market
              </button>
              <button
                className={`flex-1 py-2 text-center ${
                  orderType === 'limit'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                } rounded-r-md`}
                onClick={() => setOrderType('limit')}
              >
                Limit
              </button>
            </div>
            
            {/* Order Side */}
            <div className="flex mb-4">
              <button
                className={`flex-1 py-2 text-center ${
                  orderSide === 'buy'
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                } rounded-l-md`}
                onClick={() => setOrderSide('buy')}
              >
                Buy
              </button>
              <button
                className={`flex-1 py-2 text-center ${
                  orderSide === 'sell'
                    ? 'bg-red-600 text-white'
                    : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                } rounded-r-md`}
                onClick={() => setOrderSide('sell')}
              >
                Sell
              </button>
            </div>
            
            <form onSubmit={handleSubmitOrder}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
                <input
                  type="number"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="Enter quantity"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  required
                />
              </div>
              
              {orderType === 'limit' && (
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Limit Price</label>
                  <div className="flex">
                    <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500">$</span>
                    <input
                      type="number"
                      className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-r-md border border-gray-300"
                      placeholder="0.00"
                      value={limitPrice}
                      onChange={(e) => setLimitPrice(e.target.value)}
                      required
                    />
                  </div>
                </div>
              )}
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Order Summary</label>
                <div className="bg-gray-50 p-3 rounded-md">
                  <div className="flex justify-between mb-1">
                    <span>Symbol:</span>
                    <span className="font-medium">{selectedAsset.symbol}</span>
                  </div>
                  <div className="flex justify-between mb-1">
                    <span>Type:</span>
                    <span className="font-medium">{orderType.charAt(0).toUpperCase() + orderType.slice(1)}</span>
                  </div>
                  <div className="flex justify-between mb-1">
                    <span>Side:</span>
                    <span className={`font-medium ${orderSide === 'buy' ? 'text-green-600' : 'text-red-600'}`}>
                      {orderSide.charAt(0).toUpperCase() + orderSide.slice(1)}
                    </span>
                  </div>
                  <div className="flex justify-between mb-1">
                    <span>Quantity:</span>
                    <span className="font-medium">{quantity || '0'}</span>
                  </div>
                  <div className="flex justify-between mb-1">
                    <span>Estimated Total:</span>
                    <span className="font-medium">
                      ${((quantity || 0) * selectedAsset.price).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
              
              <button
                type="submit"
                className={`w-full py-2 px-4 rounded-md ${
                  orderSide === 'buy'
                    ? 'bg-green-600 hover:bg-green-700 text-white'
                    : 'bg-red-600 hover:bg-red-700 text-white'
                }`}
              >
                {orderSide === 'buy' ? 'Buy' : 'Sell'} {selectedAsset.symbol}
              </button>
            </form>
          </div>
          
          {/* Account Information */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-medium mb-4">Account Information</h2>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Cash Balance:</span>
                <span className="font-medium">${cashBalance.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Current Position:</span>
                <span className="font-medium">
                  {currentPosition ? `${currentPosition.quantity} shares` : 'None'}
                </span>
              </div>
              {currentPosition && (
                <>
                  <div className="flex justify-between">
                    <span>Average Entry:</span>
                    <span className="font-medium">${currentPosition.entryPrice.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Unrealized P&L:</span>
                    <span className={`font-medium ${currentPosition.unrealizedPL >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      ${currentPosition.unrealizedPL.toFixed(2)} ({currentPosition.unrealizedPLPercent.toFixed(2)}%)
                    </span>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TradingPage;