import React from 'react';

const PortfolioChart = ({ data = [], timeframe = '1D' }) => {
  // Generate sample data if none provided
  const chartData = data.length > 0 ? data : generateSampleData(timeframe);
  
  // Find min and max values for scaling
  const values = chartData.map(point => point.value);
  const minValue = Math.min(...values);
  const maxValue = Math.max(...values);
  const valueRange = maxValue - minValue;
  
  // Calculate if portfolio is up or down
  const isPositive = chartData[chartData.length - 1].value >= chartData[0].value;
  const chartColor = isPositive ? 'text-green-500' : 'text-red-500';
  const fillColor = isPositive ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)';
  
  // Calculate points for SVG path
  const chartWidth = 100; // Use percentage for responsive scaling
  const chartHeight = 100;
  
  // Create path for the line
  const linePath = chartData.map((point, index) => {
    const x = (index / (chartData.length - 1)) * chartWidth;
    const y = chartHeight - ((point.value - minValue) / valueRange) * chartHeight;
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
          stroke={isPositive ? '#10B981' : '#EF4444'}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
};

// Helper function to generate sample data
const generateSampleData = (timeframe) => {
  let points = [];
  let pointCount;
  
  switch (timeframe) {
    case '1D':
      pointCount = 24;
      break;
    case '1W':
      pointCount = 7;
      break;
    case '1M':
      pointCount = 30;
      break;
    case '3M':
      pointCount = 90;
      break;
    case '1Y':
      pointCount = 12;
      break;
    default:
      pointCount = 24;
  }
  
  // Generate random walk data
  let value = 10000 + Math.random() * 5000;
  const volatility = timeframe === '1D' ? 50 : 200;
  
  for (let i = 0; i < pointCount; i++) {
    // Add some randomness but with a slight upward trend
    const change = (Math.random() - 0.45) * volatility;
    value += change;
    
    // Ensure value doesn't go below a reasonable amount
    value = Math.max(value, 8000);
    
    points.push({
      time: i,
      value
    });
  }
  
  return points;
};

export default PortfolioChart;