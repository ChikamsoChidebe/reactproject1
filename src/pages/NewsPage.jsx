import React, { useState, useEffect } from 'react';
import { useMarketData } from '../contexts/MarketDataContext';

const NewsPage = () => {
  const { marketNews } = useMarketData();
  const [filteredNews, setFilteredNews] = useState([]);
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState('newest');
  const [expandedNewsId, setExpandedNewsId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Categories for filtering
  const categories = [
    { id: 'all', label: 'All News' },
    { id: 'stocks', label: 'Stocks' },
    { id: 'crypto', label: 'Crypto' },
    { id: 'forex', label: 'Forex' },
    { id: 'economy', label: 'Economy' },
    { id: 'earnings', label: 'Earnings' }
  ];

  // Filter and sort news based on active filter, search query, and sort order
  useEffect(() => {
    setIsLoading(true);
    
    // Simulate API delay
    const timer = setTimeout(() => {
      let filtered = [...marketNews];
      
      // Apply category filter
      if (activeFilter !== 'all') {
        filtered = filtered.filter(news => {
          // This is a simplified example - in a real app, news items would have categories
          if (activeFilter === 'stocks') {
            return news.relatedSymbols?.some(symbol => !symbol.includes('/') && !symbol.includes('^'));
          } else if (activeFilter === 'crypto') {
            return news.relatedSymbols?.some(symbol => symbol.includes('/USD'));
          } else if (activeFilter === 'forex') {
            return news.relatedSymbols?.some(symbol => symbol.includes('/') && !symbol.includes('USD'));
          } else if (activeFilter === 'economy') {
            return news.title.toLowerCase().includes('fed') || 
                   news.title.toLowerCase().includes('interest rate') || 
                   news.title.toLowerCase().includes('economy');
          } else if (activeFilter === 'earnings') {
            return news.title.toLowerCase().includes('earnings') || 
                   news.title.toLowerCase().includes('revenue') || 
                   news.title.toLowerCase().includes('quarterly');
          }
          return true;
        });
      }
      
      // Apply search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        filtered = filtered.filter(news => 
          news.title.toLowerCase().includes(query) || 
          news.summary.toLowerCase().includes(query) ||
          news.source.toLowerCase().includes(query) ||
          news.relatedSymbols?.some(symbol => symbol.toLowerCase().includes(query))
        );
      }
      
      // Apply sorting
      if (sortOrder === 'newest') {
        filtered.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
      } else if (sortOrder === 'oldest') {
        filtered.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
      } else if (sortOrder === 'relevance') {
        // In a real app, this would use a relevance algorithm
        // Here we're just using a simple proxy for relevance
        filtered.sort((a, b) => (b.relatedSymbols?.length || 0) - (a.relatedSymbols?.length || 0));
      }
      
      setFilteredNews(filtered);
      setIsLoading(false);
    }, 500);
    
    return () => clearTimeout(timer);
  }, [marketNews, activeFilter, searchQuery, sortOrder]);

  // Format date for display
  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      // Today - show time
      return `Today, ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    } else if (diffDays === 1) {
      // Yesterday
      return `Yesterday, ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    } else if (diffDays < 7) {
      // Within a week
      const options = { weekday: 'long', hour: '2-digit', minute: '2-digit' };
      return date.toLocaleDateString(undefined, options);
    } else {
      // Older than a week
      const options = { year: 'numeric', month: 'short', day: 'numeric' };
      return date.toLocaleDateString(undefined, options);
    }
  };

  // Toggle expanded news item
  const toggleExpandNews = (newsId) => {
    if (expandedNewsId === newsId) {
      setExpandedNewsId(null);
    } else {
      setExpandedNewsId(newsId);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Market News</h1>
      
      {/* Search and Filter Controls */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          {/* Search Bar */}
          <div className="relative w-full md:w-1/3">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
            </div>
            <input
              type="text"
              className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md w-full bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Search news..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          {/* Sort Order */}
          <div className="flex items-center space-x-2">
            <label className="text-sm text-gray-600 dark:text-gray-400">Sort by:</label>
            <select
              className="border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 py-1 px-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
            >
              <option value="newest">Newest</option>
              <option value="oldest">Oldest</option>
              <option value="relevance">Relevance</option>
            </select>
          </div>
        </div>
        
        {/* Category Filters */}
        <div className="mt-4 flex flex-wrap gap-2">
          {categories.map(category => (
            <button
              key={category.id}
              className={`px-3 py-1 rounded-full text-sm ${
                activeFilter === category.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
              onClick={() => setActiveFilter(category.id)}
            >
              {category.label}
            </button>
          ))}
        </div>
      </div>
      
      {/* News List */}
      <div className="space-y-6">
        {isLoading ? (
          // Loading skeleton
          Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 animate-pulse">
              <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-4"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-32"></div>
              </div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
              </div>
            </div>
          ))
        ) : filteredNews.length > 0 ? (
          filteredNews.map(news => (
            <div key={news.id} className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-2">{news.title}</h2>
                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-4">
                  <span className="font-medium">{news.source}</span>
                  <span className="mx-2">•</span>
                  <span>{formatDate(news.timestamp)}</span>
                </div>
                
                <div className={`text-gray-700 dark:text-gray-300 ${expandedNewsId === news.id ? '' : 'line-clamp-3'}`}>
                  <p>{news.summary}</p>
                </div>
                
                <div className="mt-4 flex justify-between items-center">
                  <div className="flex flex-wrap gap-2">
                    {news.relatedSymbols?.map(symbol => (
                      <span key={symbol} className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-xs">
                        {symbol}
                      </span>
                    ))}
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={() => toggleExpandNews(news.id)}
                      className="text-blue-600 dark:text-blue-400 hover:underline text-sm flex items-center"
                    >
                      {expandedNewsId === news.id ? (
                        <>
                          <span>Show less</span>
                          <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7"></path>
                          </svg>
                        </>
                      ) : (
                        <>
                          <span>Read more</span>
                          <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                          </svg>
                        </>
                      )}
                    </button>
                    
                    {news.url && (
                      <a 
                        href={news.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 dark:text-blue-400 hover:underline text-sm flex items-center"
                      >
                        <span>Source</span>
                        <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
                        </svg>
                      </a>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Related news - would be implemented in a real app */}
              {expandedNewsId === news.id && (
                <div className="bg-gray-50 dark:bg-gray-750 p-4 border-t border-gray-200 dark:border-gray-700">
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Related News</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Related news would appear here in a real application.
                  </p>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 text-center">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100">No news found</h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Try changing your search query or filters.
            </p>
            <div className="mt-6">
              <button
                onClick={() => {
                  setActiveFilter('all');
                  setSearchQuery('');
                }}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Clear filters
              </button>
            </div>
          </div>
        )}
      </div>
      
      {/* Pagination - would be implemented in a real app */}
      {filteredNews.length > 0 && (
        <div className="mt-8 flex justify-center">
          <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
            <a
              href="#"
              className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              <span className="sr-only">Previous</span>
              <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </a>
            <a
              href="#"
              aria-current="page"
              className="z-10 bg-blue-50 dark:bg-blue-900 border-blue-500 dark:border-blue-500 text-blue-600 dark:text-blue-200 relative inline-flex items-center px-4 py-2 border text-sm font-medium"
            >
              1
            </a>
            <a
              href="#"
              className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 relative inline-flex items-center px-4 py-2 border text-sm font-medium"
            >
              2
            </a>
            <a
              href="#"
              className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 relative inline-flex items-center px-4 py-2 border text-sm font-medium"
            >
              3
            </a>
            <span className="relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm font-medium text-gray-700 dark:text-gray-400">
              ...
            </span>
            <a
              href="#"
              className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 relative inline-flex items-center px-4 py-2 border text-sm font-medium"
            >
              10
            </a>
            <a
              href="#"
              className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              <span className="sr-only">Next</span>
              <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            </a>
          </nav>
        </div>
      )}
    </div>
  );
};

export default NewsPage;