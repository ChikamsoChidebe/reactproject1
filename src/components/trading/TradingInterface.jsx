import React, { useState, useEffect } from 'react';
import { useMarketData } from '../../contexts/MarketDataContext';
import { useTrading } from '../../contexts/TradingContext';
import TradingChart from './TradingChart';
import OrderForm from './OrderForm';
import OrderBook from './OrderBook';
import MarketDepth from './MarketDepth';
import TradeHistory from './TradeHistory';
import PositionsList from './PositionsList';
import OpenOrders from './OpenOrders';
import TechnicalIndicators from './TechnicalIndicators';
import AlertsPanel from './AlertsPanel';

const TradingInterface = () => {
  const { marketData, selectedSymbol, setSelectedSymbol, fetchHistoricalData, fetchMarketDepth, historicalData, marketDepth } = useMarketData();
  const { placeOrder, positions, orders } = useTrading();
  const [timeframe, setTimeframe] = useState('1D');
  const [orderType, setOrderType] = useState('market');
  const [layout, setLayout] = useState('standard');
  const [showIndicators, setShowIndicators] = useState(false);
  const [showAlerts, setShowAlerts] = useState(false);
  
  // Available timeframes
  const timeframes = [
    { id: '1D', label: '1D' },
    { id: '1W', label: '1W' },
    { id: '1M', label: '1M' },
    { id: '3M', label: '3M' },
    { id: '1Y', label: '1Y' },
    { id: '5Y', label: '5Y' }
  ];
  
  // Available layouts
  const layouts = [
    { id: 'standard', label: 'Standard' },
    { id: 'advanced', label: 'Advanced' },
    { id: 'compact', label: 'Compact' },
    { id: 'custom', label: 'Custom' }
  ];
  
  // Get all available symbols
  const allSymbols = [
    ...marketData.stocks.map(stock => ({ symbol: stock.symbol, name: stock.name, type: 'stock' })),
    ...marketData.forex.map(pair => ({ symbol: pair.symbol, name: pair.name, type: 'forex' })),
    ...marketData.crypto.map(crypto => ({ symbol: crypto.symbol, name: crypto.name, type: 'crypto' })),
    ...marketData.commodities.map(commodity => ({ symbol: commodity.symbol, name: commodity.name, type: 'commodity' })),
    ...marketData.indices.map(index => ({ symbol: index.symbol, name: index.name, type: 'index' }))
  ];
  
  // Get current symbol data
  const currentSymbolData = allSymbols.find(s => s.symbol === selectedSymbol);
  
  // Get current price
  const getCurrentPrice = () => {
    if (!selectedSymbol) return null;
    
    const allMarketData = [
      ...marketData.stocks,
      ...marketData.forex,
      ...marketData.crypto,
      ...marketData.commodities,
      ...marketData.indices
    ];
    
    const symbolData = allMarketData.find(item => item.symbol === selectedSymbol);
    return symbolData ? symbolData.price : null;
  };
  
  // Handle symbol change
  const handleSymbolChange = (symbol) => {
    setSelectedSymbol(symbol);
  };
  
  // Handle timeframe change
  const handleTimeframeChange = (newTimeframe) => {
    setTimeframe(newTimeframe);
  };
  
  // Handle order submission
  const handleOrderSubmit = (orderData) => {
    try {
      placeOrder({
        ...orderData,
        symbol: selectedSymbol
      });
    } catch (error) {
      console.error('Error placing order:', error);
    }
  };
  
  // Fetch data when symbol or timeframe changes
  useEffect(() => {
    if (selectedSymbol) {
      fetchHistoricalData(selectedSymbol, timeframe);
      fetchMarketDepth(selectedSymbol);
    }
  }, [selectedSymbol, timeframe]);
  
  // Set default symbol if none selected
  useEffect(() => {
    if (!selectedSymbol && marketData.stocks.length > 0) {
      setSelectedSymbol(marketData.stocks[0].symbol);
    }
  }, [marketData]);

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Trading Header */}
      <div className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-center">
        <div className="mb-4 md:mb-0">
          <div className="flex items-center">
            <select 
              className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={selectedSymbol || ''}
              onChange={(e) => handleSymbolChange(e.target.value)}
            >
              <option value="">Select Symbol</option>
              <optgroup label="Stocks">
                {marketData.stocks.map(stock => (
                  <option key={stock.symbol} value={stock.symbol}>
                    {stock.symbol} - {stock.name}
                  </option>
                ))}
              </optgroup>
              <optgroup label="Forex">
                {marketData.forex.map(pair => (
                  <option key={pair.symbol} value={pair.symbol}>
                    {pair.symbol} - {pair.name}
                  </option>
                ))}
              </optgroup>
              <optgroup label="Cryptocurrencies">
                {marketData.crypto.map(crypto => (
                  <option key={crypto.symbol} value={crypto.symbol}>
                    {crypto.symbol} - {crypto.name}
                  </option>
                ))}
              </optgroup>
              <optgroup label="Commodities">
                {marketData.commodities.map(commodity => (
                  <option key={commodity.symbol} value={commodity.symbol}>
                    {commodity.symbol} - {commodity.name}
                  </option>
                ))}
              </optgroup>
              <optgroup label="Indices">
                {marketData.indices.map(index => (
                  <option key={index.symbol} value={index.symbol}>
                    {index.symbol} - {index.name}
                  </option>
                ))}
              </optgroup>
            </select>
            
            {currentSymbolData && (
              <div className="ml-4">
                <div className="text-2xl font-bold">{getCurrentPrice()}</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {currentSymbolData.name}
                </div>
              </div>
            )}
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <div className="flex rounded-md overflow-hidden border border-gray-300 dark:border-gray-700">
            {timeframes.map(tf => (
              <button
                key={tf.id}
                onClick={() => handleTimeframeChange(tf.id)}
                className={`px-3 py-1 text-sm ${
                  timeframe === tf.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                {tf.label}
              </button>
            ))}
          </div>
          
          <select 
            className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={layout}
            onChange={(e) => setLayout(e.target.value)}
          >
            {layouts.map(l => (
              <option key={l.id} value={l.id}>{l.label} Layout</option>
            ))}
          </select>
          
          <button 
            onClick={() => setShowIndicators(!showIndicators)}
            className={`px-3 py-1 text-sm rounded-md border ${
              showIndicators
                ? 'bg-blue-600 text-white border-blue-600'
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            Indicators
          </button>
          
          <button 
            onClick={() => setShowAlerts(!showAlerts)}
            className={`px-3 py-1 text-sm rounded-md border ${
              showAlerts
                ? 'bg-blue-600 text-white border-blue-600'
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            Alerts
          </button>
        </div>
      </div>
      
      {/* Main Trading Interface */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Chart and Order Book - Takes 3/4 of the width on large screens */}
        <div className="lg:col-span-3 space-y-6">
          {/* Chart */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
            <div className="h-96">
              <TradingChart 
                symbol={selectedSymbol}
                timeframe={timeframe}
                data={selectedSymbol && historicalData[selectedSymbol] ? historicalData[selectedSymbol][timeframe] : []}
                showIndicators={showIndicators}
              />
            </div>
            
            {showIndicators && (
              <div className="mt-4 border-t border-gray-200 dark:border-gray-700 pt-4">
                <TechnicalIndicators symbol={selectedSymbol} />
              </div>
            )}
          </div>
          
          {/* Order Book and Market Depth */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
              <h3 className="text-lg font-semibold mb-4">Order Book</h3>
              <OrderBook 
                symbol={selectedSymbol}
                depth={marketDepth[selectedSymbol]}
              />
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
              <h3 className="text-lg font-semibold mb-4">Market Depth</h3>
              <MarketDepth 
                symbol={selectedSymbol}
                depth={marketDepth[selectedSymbol]}
              />
            </div>
          </div>
          
          {/* Trade History */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
            <h3 className="text-lg font-semibold mb-4">Trade History</h3>
            <TradeHistory symbol={selectedSymbol} />
          </div>
        </div>
        
        {/* Order Form and Positions - Takes 1/4 of the width on large screens */}
        <div className="space-y-6">
          {/* Order Form */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
            <div className="flex border-b border-gray-200 dark:border-gray-700 mb-4">
              <button
                onClick={() => setOrderType('market')}
                className={`py-2 px-4 font-medium text-sm ${
                  orderType === 'market'
                    ? 'border-b-2 border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                Market
              </button>
              <button
                onClick={() => setOrderType('limit')}
                className={`py-2 px-4 font-medium text-sm ${
                  orderType === 'limit'
                    ? 'border-b-2 border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                Limit
              </button>
              <button
                onClick={() => setOrderType('stop')}
                className={`py-2 px-4 font-medium text-sm ${
                  orderType === 'stop'
                    ? 'border-b-2 border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                Stop
              </button>
              <button
                onClick={() => setOrderType('advanced')}
                className={`py-2 px-4 font-medium text-sm ${
                  orderType === 'advanced'
                    ? 'border-b-2 border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                Advanced
              </button>
            </div>
            
            <OrderForm 
              symbol={selectedSymbol}
              orderType={orderType}
              currentPrice={getCurrentPrice()}
              onSubmit={handleOrderSubmit}
            />
          </div>
          
          {/* Open Positions */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
            <h3 className="text-lg font-semibold mb-4">Open Positions</h3>
            <PositionsList positions={positions} />
          </div>
          
          {/* Open Orders */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
            <h3 className="text-lg font-semibold mb-4">Open Orders</h3>
            <OpenOrders orders={orders} />
          </div>
          
          {/* Alerts Panel (conditionally rendered) */}
          {showAlerts && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
              <h3 className="text-lg font-semibold mb-4">Price Alerts</h3>
              <AlertsPanel symbol={selectedSymbol} currentPrice={getCurrentPrice()} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TradingInterface;