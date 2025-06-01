import React from 'react';
import { Link } from 'react-router-dom';
import MarketChart from '../charts/MarketChart';

const MarketItem = ({ asset }) => {
  const isPositive = asset.changePercent >= 0;
  
  return (
    <div className="bg-white rounded-lg shadow p-4 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-2">
        <div>
          <h3 className="font-medium">{asset.symbol}</h3>
          <p className="text-sm text-gray-500">{asset.name}</p>
        </div>
        <div className="text-right">
          <p className="font-medium">${asset.price.toFixed(2)}</p>
          <p className={`text-sm ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
            {isPositive ? '+' : ''}{asset.changePercent.toFixed(2)}%
          </p>
        </div>
      </div>
      
      <div className="h-20 mb-3">
        <MarketChart symbol={asset.symbol} isPositive={isPositive} />
      </div>
      
      <div className="flex justify-between">
        <Link to={`/markets/${asset.symbol}`} className="text-blue-600 hover:underline text-sm">
          View Chart
        </Link>
        <Link to={`/trading/${asset.symbol}`} className="text-blue-600 hover:underline text-sm">
          Trade
        </Link>
      </div>
    </div>
  );
};

export default MarketItem;