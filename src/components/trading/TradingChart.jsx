import React, { useState, useEffect, useRef } from 'react';

const TradingChart = ({ symbol, timeframe, data, showIndicators }) => {
  const chartRef = useRef(null);
  const [chartType, setChartType] = useState('candle');
  const [indicators, setIndicators] = useState({
    sma: true,
    ema: false,
    bollinger: false,
    rsi: false,
    macd: false,
    volume: true
  });
  
  // Chart types
  const chartTypes = [
    { id: 'candle', label: 'Candlestick' },
    { id: 'line', label: 'Line' },
    { id: 'bar', label: 'OHLC' },
    { id: 'area', label: 'Area' }
  ];
  
  // Available indicators
  const availableIndicators = [
    { id: 'sma', label: 'SMA', color: '#3B82F6' },
    { id: 'ema', label: 'EMA', color: '#10B981' },
    { id: 'bollinger', label: 'Bollinger Bands', color: '#8B5CF6' },
    { id: 'rsi', label: 'RSI', color: '#F59E0B' },
    { id: 'macd', label: 'MACD', color: '#EF4444' },
    { id: 'volume', label: 'Volume', color: '#6B7280' }
  ];
  
  // Toggle indicator
  const toggleIndicator = (indicator) => {
    setIndicators({
      ...indicators,
      [indicator]: !indicators[indicator]
    });
  };
  
  // Calculate SMA (Simple Moving Average)
  const calculateSMA = (data, period = 20) => {
    const sma = [];
    
    for (let i = 0; i < data.length; i++) {
      if (i < period - 1) {
        sma.push(null);
        continue;
      }
      
      let sum = 0;
      for (let j = 0; j < period; j++) {
        sum += data[i - j].close;
      }
      
      sma.push(sum / period);
    }
    
    return sma;
  };
  
  // Calculate EMA (Exponential Moving Average)
  const calculateEMA = (data, period = 20) => {
    const ema = [];
    const multiplier = 2 / (period + 1);
    
    // First EMA is SMA
    let sum = 0;
    for (let i = 0; i < period; i++) {
      sum += data[i].close;
    }
    
    ema.push(sum / period);
    
    // Calculate EMA for the rest
    for (let i = period; i < data.length; i++) {
      ema.push(
        (data[i].close - ema[ema.length - 1]) * multiplier + ema[ema.length - 1]
      );
    }
    
    // Pad with nulls for the initial period
    const result = Array(period - 1).fill(null).concat(ema);
    
    return result;
  };
  
  // Calculate Bollinger Bands
  const calculateBollingerBands = (data, period = 20, stdDev = 2) => {
    const sma = calculateSMA(data, period);
    const upperBand = [];
    const lowerBand = [];
    
    for (let i = 0; i < data.length; i++) {
      if (i < period - 1) {
        upperBand.push(null);
        lowerBand.push(null);
        continue;
      }
      
      let sum = 0;
      for (let j = 0; j < period; j++) {
        sum += Math.pow(data[i - j].close - sma[i], 2);
      }
      
      const std = Math.sqrt(sum / period);
      upperBand.push(sma[i] + stdDev * std);
      lowerBand.push(sma[i] - stdDev * std);
    }
    
    return { upperBand, lowerBand };
  };
  
  // Draw chart
  const drawChart = () => {
    if (!chartRef.current || !data || data.length === 0) return;
    
    const canvas = chartRef.current;
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    
    // Clear canvas
    ctx.clearRect(0, 0, width, height);
    
    // Set background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, width, height);
    
    // Calculate price range
    const prices = data.map(d => [d.high, d.low]).flat();
    const maxPrice = Math.max(...prices);
    const minPrice = Math.min(...prices);
    const priceRange = maxPrice - minPrice;
    const padding = priceRange * 0.1; // Add 10% padding
    
    // Calculate time range
    const timestamps = data.map(d => new Date(d.timestamp).getTime());
    const startTime = Math.min(...timestamps);
    const endTime = Math.max(...timestamps);
    const timeRange = endTime - startTime;
    
    // Calculate scales
    const xScale = (time) => {
      return ((time - startTime) / timeRange) * width;
    };
    
    const yScale = (price) => {
      return height - ((price - (minPrice - padding)) / (priceRange + 2 * padding)) * height;
    };
    
    // Draw grid
    ctx.strokeStyle = '#f3f4f6';
    ctx.lineWidth = 1;
    
    // Horizontal grid lines
    const priceStep = priceRange / 5;
    for (let i = 0; i <= 5; i++) {
      const price = minPrice + i * priceStep;
      const y = yScale(price);
      
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
      
      // Price labels
      ctx.fillStyle = '#6b7280';
      ctx.font = '10px Arial';
      ctx.textAlign = 'left';
      ctx.fillText(price.toFixed(2), 5, y - 5);
    }
    
    // Vertical grid lines
    const timeStep = timeRange / 6;
    for (let i = 0; i <= 6; i++) {
      const time = startTime + i * timeStep;
      const x = xScale(time);
      
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
      
      // Time labels
      const date = new Date(time);
      const label = date.toLocaleDateString();
      ctx.fillStyle = '#6b7280';
      ctx.font = '10px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(label, x, height - 5);
    }
    
    // Draw candlesticks
    if (chartType === 'candle') {
      data.forEach((d, i) => {
        const x = xScale(new Date(d.timestamp).getTime());
        const open = yScale(d.open);
        const close = yScale(d.close);
        const high = yScale(d.high);
        const low = yScale(d.low);
        const candleWidth = Math.max(2, width / data.length / 2);
        
        // Draw wick
        ctx.strokeStyle = d.close >= d.open ? '#10b981' : '#ef4444';
        ctx.beginPath();
        ctx.moveTo(x, high);
        ctx.lineTo(x, low);
        ctx.stroke();
        
        // Draw candle body
        ctx.fillStyle = d.close >= d.open ? '#10b981' : '#ef4444';
        ctx.fillRect(
          x - candleWidth / 2,
          close,
          candleWidth,
          open - close
        );
      });
    }
    
    // Draw line chart
    if (chartType === 'line') {
      ctx.strokeStyle = '#3b82f6';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(xScale(new Date(data[0].timestamp).getTime()), yScale(data[0].close));
      
      for (let i = 1; i < data.length; i++) {
        const x = xScale(new Date(data[i].timestamp).getTime());
        const y = yScale(data[i].close);
        ctx.lineTo(x, y);
      }
      
      ctx.stroke();
    }
    
    // Draw area chart
    if (chartType === 'area') {
      ctx.strokeStyle = '#3b82f6';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(xScale(new Date(data[0].timestamp).getTime()), yScale(data[0].close));
      
      for (let i = 1; i < data.length; i++) {
        const x = xScale(new Date(data[i].timestamp).getTime());
        const y = yScale(data[i].close);
        ctx.lineTo(x, y);
      }
      
      // Complete the area
      ctx.lineTo(xScale(new Date(data[data.length - 1].timestamp).getTime()), height);
      ctx.lineTo(xScale(new Date(data[0].timestamp).getTime()), height);
      ctx.closePath();
      
      // Fill with gradient
      const gradient = ctx.createLinearGradient(0, 0, 0, height);
      gradient.addColorStop(0, 'rgba(59, 130, 246, 0.5)');
      gradient.addColorStop(1, 'rgba(59, 130, 246, 0.0)');
      ctx.fillStyle = gradient;
      ctx.fill();
      
      // Redraw the line
      ctx.strokeStyle = '#3b82f6';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(xScale(new Date(data[0].timestamp).getTime()), yScale(data[0].close));
      
      for (let i = 1; i < data.length; i++) {
        const x = xScale(new Date(data[i].timestamp).getTime());
        const y = yScale(data[i].close);
        ctx.lineTo(x, y);
      }
      
      ctx.stroke();
    }
    
    // Draw OHLC bars
    if (chartType === 'bar') {
      data.forEach((d, i) => {
        const x = xScale(new Date(d.timestamp).getTime());
        const open = yScale(d.open);
        const close = yScale(d.close);
        const high = yScale(d.high);
        const low = yScale(d.low);
        const barWidth = Math.max(2, width / data.length / 3);
        
        ctx.strokeStyle = d.close >= d.open ? '#10b981' : '#ef4444';
        ctx.lineWidth = 1;
        
        // Draw high-low line
        ctx.beginPath();
        ctx.moveTo(x, high);
        ctx.lineTo(x, low);
        ctx.stroke();
        
        // Draw open tick
        ctx.beginPath();
        ctx.moveTo(x - barWidth / 2, open);
        ctx.lineTo(x, open);
        ctx.stroke();
        
        // Draw close tick
        ctx.beginPath();
        ctx.moveTo(x, close);
        ctx.lineTo(x + barWidth / 2, close);
        ctx.stroke();
      });
    }
    
    // Draw indicators
    if (showIndicators) {
      // Draw SMA
      if (indicators.sma) {
        const sma = calculateSMA(data);
        
        ctx.strokeStyle = '#3b82f6';
        ctx.lineWidth = 2;
        ctx.beginPath();
        
        let started = false;
        for (let i = 0; i < data.length; i++) {
          if (sma[i] === null) continue;
          
          const x = xScale(new Date(data[i].timestamp).getTime());
          const y = yScale(sma[i]);
          
          if (!started) {
            ctx.moveTo(x, y);
            started = true;
          } else {
            ctx.lineTo(x, y);
          }
        }
        
        ctx.stroke();
      }
      
      // Draw EMA
      if (indicators.ema) {
        const ema = calculateEMA(data);
        
        ctx.strokeStyle = '#10b981';
        ctx.lineWidth = 2;
        ctx.beginPath();
        
        let started = false;
        for (let i = 0; i < data.length; i++) {
          if (ema[i] === null) continue;
          
          const x = xScale(new Date(data[i].timestamp).getTime());
          const y = yScale(ema[i]);
          
          if (!started) {
            ctx.moveTo(x, y);
            started = true;
          } else {
            ctx.lineTo(x, y);
          }
        }
        
        ctx.stroke();
      }
      
      // Draw Bollinger Bands
      if (indicators.bollinger) {
        const { upperBand, lowerBand } = calculateBollingerBands(data);
        
        // Upper band
        ctx.strokeStyle = '#8b5cf6';
        ctx.lineWidth = 1;
        ctx.beginPath();
        
        let started = false;
        for (let i = 0; i < data.length; i++) {
          if (upperBand[i] === null) continue;
          
          const x = xScale(new Date(data[i].timestamp).getTime());
          const y = yScale(upperBand[i]);
          
          if (!started) {
            ctx.moveTo(x, y);
            started = true;
          } else {
            ctx.lineTo(x, y);
          }
        }
        
        ctx.stroke();
        
        // Lower band
        ctx.beginPath();
        
        started = false;
        for (let i = 0; i < data.length; i++) {
          if (lowerBand[i] === null) continue;
          
          const x = xScale(new Date(data[i].timestamp).getTime());
          const y = yScale(lowerBand[i]);
          
          if (!started) {
            ctx.moveTo(x, y);
            started = true;
          } else {
            ctx.lineTo(x, y);
          }
        }
        
        ctx.stroke();
      }
      
      // Draw Volume
      if (indicators.volume) {
        const volumes = data.map(d => d.volume);
        const maxVolume = Math.max(...volumes);
        
        const volumeHeight = height * 0.2;
        const volumeBottom = height;
        
        data.forEach((d, i) => {
          const x = xScale(new Date(d.timestamp).getTime());
          const volumeScale = (volume) => {
            return volumeBottom - (volume / maxVolume) * volumeHeight;
          };
          
          const barWidth = Math.max(1, width / data.length / 1.5);
          const y = volumeScale(d.volume);
          
          ctx.fillStyle = d.close >= d.open ? 'rgba(16, 185, 129, 0.5)' : 'rgba(239, 68, 68, 0.5)';
          ctx.fillRect(
            x - barWidth / 2,
            y,
            barWidth,
            volumeBottom - y
          );
        });
      }
    }
    
    // Draw symbol and timeframe
    ctx.fillStyle = '#111827';
    ctx.font = 'bold 14px Arial';
    ctx.textAlign = 'left';
    ctx.fillText(`${symbol} - ${timeframe}`, 10, 20);
  };
  
  // Draw chart when data changes
  useEffect(() => {
    if (data && data.length > 0) {
      drawChart();
    }
  }, [data, chartType, indicators, showIndicators]);
  
  // Resize handler
  useEffect(() => {
    const handleResize = () => {
      if (chartRef.current) {
        const container = chartRef.current.parentElement;
        chartRef.current.width = container.clientWidth;
        chartRef.current.height = container.clientHeight;
        drawChart();
      }
    };
    
    window.addEventListener('resize', handleResize);
    handleResize();
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-between items-center mb-4">
        <div className="flex space-x-2">
          {chartTypes.map(type => (
            <button
              key={type.id}
              onClick={() => setChartType(type.id)}
              className={`px-3 py-1 text-sm rounded-md ${
                chartType === type.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              {type.label}
            </button>
          ))}
        </div>
        
        {showIndicators && (
          <div className="flex flex-wrap gap-2">
            {availableIndicators.map(indicator => (
              <button
                key={indicator.id}
                onClick={() => toggleIndicator(indicator.id)}
                className={`px-2 py-1 text-xs rounded-md flex items-center ${
                  indicators[indicator.id]
                    ? 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400'
                }`}
              >
                <span 
                  className="w-2 h-2 rounded-full mr-1"
                  style={{ backgroundColor: indicator.color }}
                ></span>
                {indicator.label}
              </button>
            ))}
          </div>
        )}
      </div>
      
      <div className="flex-grow relative">
        <canvas 
          ref={chartRef} 
          className="absolute inset-0 w-full h-full"
        ></canvas>
      </div>
    </div>
  );
};

export default TradingChart;