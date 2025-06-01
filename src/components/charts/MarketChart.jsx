import React from 'react';

const MarketChart = ({ data = [], symbol = '', isPositive = null }) => {
  // Generate sample data if none provided
  const chartData = data.length > 0 ? data : generateSampleData(symbol);
  
  // Find min and max values for scaling
  const values = chartData.map(point => point.price);
  const minValue = Math.min(...values);
  const maxValue = Math.max(...values);
  const valueRange = maxValue - minValue;
  
  // Calculate if market is up or down
  const marketIsPositive = isPositive !== null ? isPositive : 
    chartData[chartData.length - 1].price >= chartData[0].price;
  
  const chartColor = marketIsPositive ? '#10B981' : '#EF4444';
  const fillColor = marketIsPositive ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)';
  
  // Calculate points for SVG path
  const chartWidth = 100; // Use percentage for responsive scaling
  const chartHeight = 100;
  
  // Create path for the line
  const linePath = chartData.map((point, index) => {
    const x = (index / (chartData.length - 1)) * chartWidth;
    const y = chartHeight - ((point.price - minValue) / valueRange) * chartHeight;
    return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
  }).join(' ');
  
  // Create path for the area fill
  const areaPath = `${linePath} L ${chartWidth} ${chartHeight} L 0 ${chartHeight} Z`;
  
  return (
    <div className="w-full h-full">
      <svg
        viewBox={`0 0 ${chartWidth} ${chartHeight}`}
        preserveAspectRatio="none"
        className="w-full h-full"
      >
        {/* Area fill */}
        <path
          d={areaPath}
          fill={fillColor}
        />
        
        {/* Line */}
        <path
          d={linePath}
          fill="none"
          stroke={chartColor}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
};

// Helper function to generate sample data
const generateSampleData = (symbol) => {
  let points = [];
  const pointCount = 24;
  
  // Use symbol to generate consistent but different charts for different symbols
  const symbolSeed = symbol.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const seedRandom = (seed) => {
    return () => {
      seed = (seed * 9301 + 49297) % 233280;
      return seed / 233280;
    };
  };
  
  const random = seedRandom(symbolSeed);
  
  // Generate starting price based on symbol
  let basePrice;
  if (symbol.includes('BTC')) basePrice = 30000 + random() * 5000;
  else if (symbol.includes('ETH')) basePrice = 2000 + random() * 300;
  else if (symbol.includes('AAPL')) basePrice = 150 + random() * 30;
  else if (symbol.includes('MSFT')) basePrice = 300 + random() * 50;
  else basePrice = 50 + random() * 150;
  
  let price = basePrice;
  const volatility = basePrice * 0.01; // 1% volatility
  
  for (let i = 0; i < pointCount; i++) {
    // Add some randomness
    const change = (random() - 0.5) * volatility * 2;
    price += change;
    
    // Ensure price doesn't go below a reasonable amount
    price = Math.max(price, basePrice * 0.8);
    
    points.push({
      time: i,
      price
    });
  }
  
  return points;
};

export default MarketChart;