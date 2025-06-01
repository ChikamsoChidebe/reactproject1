import React, { useState, useEffect } from 'react';
import { useTrading } from '../../contexts/TradingContext';

const OrderForm = ({ symbol, orderType, currentPrice, onSubmit }) => {
  const { cashBalance, marginAvailable, tradingSettings } = useTrading();
  
  const [side, setSide] = useState('BUY');
  const [quantity, setQuantity] = useState('');
  const [price, setPrice] = useState('');
  const [stopPrice, setStopPrice] = useState('');
  const [takeProfit, setTakeProfit] = useState('');
  const [stopLoss, setStopLoss] = useState('');
  const [timeInForce, setTimeInForce] = useState('GTC');
  const [leverage, setLeverage] = useState(1);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [error, setError] = useState('');
  const [estimatedCost, setEstimatedCost] = useState(0);
  const [estimatedFee, setEstimatedFee] = useState(0);
  
  // Time in force options
  const timeInForceOptions = [
    { value: 'GTC', label: 'Good Till Canceled' },
    { value: 'IOC', label: 'Immediate or Cancel' },
    { value: 'FOK', label: 'Fill or Kill' },
    { value: 'DAY', label: 'Day Order' }
  ];
  
  // Reset form when symbol or order type changes
  useEffect(() => {
    if (currentPrice) {
      setPrice(currentPrice.toFixed(2));
      setStopPrice(currentPrice.toFixed(2));
      
      // Set default stop loss and take profit based on settings
      if (tradingSettings) {
        const stopLossPercent = tradingSettings.riskManagement.stopLossDefault;
        const takeProfitPercent = tradingSettings.riskManagement.takeProfitDefault;
        
        if (side === 'BUY') {
          setStopLoss((currentPrice * (1 - stopLossPercent / 100)).toFixed(2));
          setTakeProfit((currentPrice * (1 + takeProfitPercent / 100)).toFixed(2));
        } else {
          setStopLoss((currentPrice * (1 + stopLossPercent / 100)).toFixed(2));
          setTakeProfit((currentPrice * (1 - takeProfitPercent / 100)).toFixed(2));
        }
      }
    }
  }, [symbol, orderType, currentPrice, side]);
  
  // Calculate estimated cost and fee
  useEffect(() => {
    if (quantity && currentPrice) {
      const qty = parseFloat(quantity);
      const cost = qty * currentPrice;
      setEstimatedCost(cost);
      setEstimatedFee(cost * 0.002); // 0.2% fee
    } else {
      setEstimatedCost(0);
      setEstimatedFee(0);
    }
  }, [quantity, currentPrice]);
  
  // Handle side change
  const handleSideChange = (newSide) => {
    setSide(newSide);
    
    // Update stop loss and take profit
    if (currentPrice && tradingSettings) {
      const stopLossPercent = tradingSettings.riskManagement.stopLossDefault;
      const takeProfitPercent = tradingSettings.riskManagement.takeProfitDefault;
      
      if (newSide === 'BUY') {
        setStopLoss((currentPrice * (1 - stopLossPercent / 100)).toFixed(2));
        setTakeProfit((currentPrice * (1 + takeProfitPercent / 100)).toFixed(2));
      } else {
        setStopLoss((currentPrice * (1 + stopLossPercent / 100)).toFixed(2));
        setTakeProfit((currentPrice * (1 - takeProfitPercent / 100)).toFixed(2));
      }
    }
  };
  
  // Handle quantity change
  const handleQuantityChange = (e) => {
    const value = e.target.value;
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      setQuantity(value);
    }
  };
  
  // Handle price change
  const handlePriceChange = (e) => {
    const value = e.target.value;
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      setPrice(value);
    }
  };
  
  // Handle stop price change
  const handleStopPriceChange = (e) => {
    const value = e.target.value;
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      setStopPrice(value);
    }
  };
  
  // Handle take profit change
  const handleTakeProfitChange = (e) => {
    const value = e.target.value;
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      setTakeProfit(value);
    }
  };
  
  // Handle stop loss change
  const handleStopLossChange = (e) => {
    const value = e.target.value;
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      setStopLoss(value);
    }
  };
  
  // Handle leverage change
  const handleLeverageChange = (e) => {
    const value = parseInt(e.target.value);
    setLeverage(value);
  };
  
  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    
    try {
      // Validate inputs
      if (!symbol) {
        throw new Error('Please select a symbol');
      }
      
      if (!quantity || parseFloat(quantity) <= 0) {
        throw new Error('Please enter a valid quantity');
      }
      
      if ((orderType === 'limit' || orderType === 'advanced') && (!price || parseFloat(price) <= 0)) {
        throw new Error('Please enter a valid price');
      }
      
      if ((orderType === 'stop' || orderType === 'advanced') && (!stopPrice || parseFloat(stopPrice) <= 0)) {
        throw new Error('Please enter a valid stop price');
      }
      
      // Create order object
      const order = {
        symbol,
        side,
        quantity: parseFloat(quantity),
        type: getOrderTypeForSubmission(),
      };
      
      // Add price for limit orders
      if (orderType === 'limit' || orderType === 'advanced') {
        order.price = parseFloat(price);
      }
      
      // Add stop price for stop orders
      if (orderType === 'stop' || orderType === 'advanced') {
        order.stopPrice = parseFloat(stopPrice);
      }
      
      // Add take profit and stop loss if provided
      if (takeProfit && parseFloat(takeProfit) > 0) {
        order.takeProfit = parseFloat(takeProfit);
      }
      
      if (stopLoss && parseFloat(stopLoss) > 0) {
        order.stopLoss = parseFloat(stopLoss);
      }
      
      // Add time in force
      order.timeInForce = timeInForce;
      
      // Add leverage
      if (leverage > 1) {
        order.leverage = leverage;
      }
      
      // Submit order
      onSubmit(order);
      
      // Reset form
      setQuantity('');
      setError('');
    } catch (err) {
      setError(err.message);
    }
  };
  
  // Get order type for submission
  const getOrderTypeForSubmission = () => {
    switch (orderType) {
      case 'market':
        return 'MARKET';
      case 'limit':
        return 'LIMIT';
      case 'stop':
        return 'STOP';
      case 'advanced':
        if (stopPrice && price) {
          return 'STOP_LIMIT';
        } else if (stopPrice) {
          return 'STOP';
        } else {
          return 'LIMIT';
        }
      default:
        return 'MARKET';
    }
  };
  
  // Calculate max quantity based on available funds
  const calculateMaxQuantity = () => {
    if (!currentPrice) return 0;
    
    const availableFunds = side === 'BUY' ? cashBalance : marginAvailable;
    const maxQty = Math.floor(availableFunds / currentPrice * 100) / 100;
    
    return maxQty;
  };
  
  // Set max quantity
  const setMaxQuantity = () => {
    const maxQty = calculateMaxQuantity();
    setQuantity(maxQty.toString());
  };
  
  // Set percentage of max quantity
  const setPercentageQuantity = (percentage) => {
    const maxQty = calculateMaxQuantity();
    const qty = (maxQty * percentage / 100).toFixed(2);
    setQuantity(qty);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Buy/Sell Selector */}
      <div className="grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={() => handleSideChange('BUY')}
          className={`py-2 rounded-md font-medium ${
            side === 'BUY'
              ? 'bg-green-600 text-white'
              : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
          }`}
        >
          Buy
        </button>
        <button
          type="button"
          onClick={() => handleSideChange('SELL')}
          className={`py-2 rounded-md font-medium ${
            side === 'SELL'
              ? 'bg-red-600 text-white'
              : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
          }`}
        >
          Sell
        </button>
      </div>
      
      {/* Quantity */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Quantity
        </label>
        <div className="flex">
          <input
            type="text"
            value={quantity}
            onChange={handleQuantityChange}
            className="flex-grow rounded-l-md border-gray-300 dark:border-gray-700 dark:bg-gray-800 focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm"
            placeholder="Enter quantity"
          />
          <button
            type="button"
            onClick={setMaxQuantity}
            className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 rounded-r-md border border-l-0 border-gray-300 dark:border-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600"
          >
            Max
          </button>
        </div>
        <div className="flex justify-between mt-1">
          <button
            type="button"
            onClick={() => setPercentageQuantity(25)}
            className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-1 rounded hover:bg-gray-200 dark:hover:bg-gray-600"
          >
            25%
          </button>
          <button
            type="button"
            onClick={() => setPercentageQuantity(50)}
            className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-1 rounded hover:bg-gray-200 dark:hover:bg-gray-600"
          >
            50%
          </button>
          <button
            type="button"
            onClick={() => setPercentageQuantity(75)}
            className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-1 rounded hover:bg-gray-200 dark:hover:bg-gray-600"
          >
            75%
          </button>
          <button
            type="button"
            onClick={() => setPercentageQuantity(100)}
            className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-1 rounded hover:bg-gray-200 dark:hover:bg-gray-600"
          >
            100%
          </button>
        </div>
      </div>
      
      {/* Price (for limit orders) */}
      {(orderType === 'limit' || orderType === 'advanced') && (
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Limit Price
          </label>
          <input
            type="text"
            value={price}
            onChange={handlePriceChange}
            className="rounded-md border-gray-300 dark:border-gray-700 dark:bg-gray-800 focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm"
            placeholder="Enter price"
          />
        </div>
      )}
      
      {/* Stop Price (for stop orders) */}
      {(orderType === 'stop' || orderType === 'advanced') && (
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Stop Price
          </label>
          <input
            type="text"
            value={stopPrice}
            onChange={handleStopPriceChange}
            className="rounded-md border-gray-300 dark:border-gray-700 dark:bg-gray-800 focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm"
            placeholder="Enter stop price"
          />
        </div>
      )}
      
      {/* Advanced Options Toggle */}
      <div>
        <button
          type="button"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 flex items-center"
        >
          {showAdvanced ? 'Hide' : 'Show'} Advanced Options
          <svg 
            className={`ml-1 h-4 w-4 transform ${showAdvanced ? 'rotate-180' : ''}`} 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
          </svg>
        </button>
      </div>
      
      {/* Advanced Options */}
      {showAdvanced && (
        <div className="space-y-4 border-t border-gray-200 dark:border-gray-700 pt-4 mt-4">
          {/* Take Profit */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Take Profit
            </label>
            <input
              type="text"
              value={takeProfit}
              onChange={handleTakeProfitChange}
              className="rounded-md border-gray-300 dark:border-gray-700 dark:bg-gray-800 focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm"
              placeholder="Enter take profit price"
            />
          </div>
          
          {/* Stop Loss */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Stop Loss
            </label>
            <input
              type="text"
              value={stopLoss}
              onChange={handleStopLossChange}
              className="rounded-md border-gray-300 dark:border-gray-700 dark:bg-gray-800 focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm"
              placeholder="Enter stop loss price"
            />
          </div>
          
          {/* Time in Force */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Time in Force
            </label>
            <select
              value={timeInForce}
              onChange={(e) => setTimeInForce(e.target.value)}
              className="rounded-md border-gray-300 dark:border-gray-700 dark:bg-gray-800 focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm"
            >
              {timeInForceOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          
          {/* Leverage */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Leverage: {leverage}x
            </label>
            <input
              type="range"
              min="1"
              max={tradingSettings?.riskManagement?.maxLeverage || 10}
              value={leverage}
              onChange={handleLeverageChange}
              className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
              <span>1x</span>
              <span>{tradingSettings?.riskManagement?.maxLeverage || 10}x</span>
            </div>
          </div>
        </div>
      )}
      
      {/* Order Summary */}
      <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-md">
        <h4 className="text-sm font-medium mb-2">Order Summary</h4>
        <div className="space-y-1 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-500 dark:text-gray-400">Symbol:</span>
            <span>{symbol || '-'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500 dark:text-gray-400">Type:</span>
            <span>{getOrderTypeForSubmission()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500 dark:text-gray-400">Side:</span>
            <span className={side === 'BUY' ? 'text-green-600' : 'text-red-600'}>
              {side}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500 dark:text-gray-400">Quantity:</span>
            <span>{quantity || '-'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500 dark:text-gray-400">Estimated Cost:</span>
            <span>${estimatedCost.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500 dark:text-gray-400">Estimated Fee:</span>
            <span>${estimatedFee.toFixed(2)}</span>
          </div>
          {leverage > 1 && (
            <div className="flex justify-between">
              <span className="text-gray-500 dark:text-gray-400">Leverage:</span>
              <span>{leverage}x</span>
            </div>
          )}
        </div>
      </div>
      
      {/* Error Message */}
      {error && (
        <div className="text-red-600 text-sm">
          {error}
        </div>
      )}
      
      {/* Submit Button */}
      <button
        type="submit"
        className={`w-full py-2 px-4 rounded-md font-medium ${
          side === 'BUY'
            ? 'bg-green-600 hover:bg-green-700 text-white'
            : 'bg-red-600 hover:bg-red-700 text-white'
        }`}
      >
        {side === 'BUY' ? 'Buy' : 'Sell'} {symbol}
      </button>
    </form>
  );
};

export default OrderForm;