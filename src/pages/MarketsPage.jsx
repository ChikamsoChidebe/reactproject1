import React, { useState } from 'react';
import { useMarketData } from '../contexts/MarketDataContext';
import MarketItem from '../components/market/MarketItem';

const MarketsPage = () => {
  const { marketData } = useMarketData();
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Define market categories
  const categories = [
    { id: 'all', name: 'All Markets' },
    { id: 'stocks', name: 'Stocks' },
    { id: 'crypto', name: 'Crypto' },
    { id: 'forex', name: 'Forex' },
    { id: 'commodities', name: 'Commodities' },
    { id: 'indices', name: 'Indices' }
  ];
  
  // Filter assets based on category and search query
  const getFilteredAssets = () => {
    let assets = [];
    
    if (activeCategory === 'all') {
      Object.keys(marketData).forEach(category => {
        assets = [...assets, ...marketData[category]];
      });
    } else {
      assets = marketData[activeCategory] || [];
    }
    
    // Apply search filter if query exists
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      assets = assets.filter(asset => 
        asset.symbol.toLowerCase().includes(query) || 
        asset.name.toLowerCase().includes(query)
      );
    }
    
    return assets;
  };
  
  const filteredAssets = getFilteredAssets();
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Markets</h1>
      
      {/* Search and Filter */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative flex-grow max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
            </div>
            <input
              type="text"
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Search markets..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="flex overflow-x-auto pb-2 md:pb-0 hide-scrollbar">
            {categories.map(category => (
              <button
                key={category.id}
                className={`px-4 py-2 rounded-md whitespace-nowrap mr-2 ${
                  activeCategory === category.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                }`}
                onClick={() => setActiveCategory(category.id)}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>
      </div>
      
      {/* Market Grid */}
      {filteredAssets.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredAssets.map(asset => (
            <MarketItem key={asset.symbol} asset={asset} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No markets found matching your criteria.</p>
          <button 
            className="mt-4 text-blue-600 hover:underline"
            onClick={() => {
              setSearchQuery('');
              setActiveCategory('all');
            }}
          >
            Clear filters
          </button>
        </div>
      )}
    </div>
  );
};

export default MarketsPage;