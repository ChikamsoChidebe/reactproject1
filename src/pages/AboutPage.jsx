import React from 'react';

const AboutPage = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">About TradePro</h1>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-8">
        <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
        <p className="text-gray-700 dark:text-gray-300 mb-4">
          At TradePro, our mission is to democratize access to global financial markets by providing professional-grade trading tools to investors of all experience levels.
        </p>
        <p className="text-gray-700 dark:text-gray-300">
          We believe that everyone should have the opportunity to participate in the financial markets with the same level of tools and information that were once only available to institutional investors.
        </p>
      </div>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-8">
        <h2 className="text-2xl font-semibold mb-4">Our Platform</h2>
        <p className="text-gray-700 dark:text-gray-300 mb-4">
          TradePro offers a comprehensive trading platform with advanced features including:
        </p>
        <ul className="list-disc pl-6 space-y-2 text-gray-700 dark:text-gray-300">
          <li>Real-time market data across multiple asset classes</li>
          <li>Advanced charting with technical indicators</li>
          <li>Ultra-fast order execution</li>
          <li>Robust risk management tools</li>
          <li>Customizable trading dashboard</li>
          <li>Mobile trading capabilities</li>
        </ul>
      </div>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h2 className="text-2xl font-semibold mb-4">Contact Us</h2>
        <p className="text-gray-700 dark:text-gray-300 mb-4">
          Have questions or need assistance? Our support team is available 24/7.
        </p>
        <div className="space-y-2">
          <p className="text-gray-700 dark:text-gray-300">
            <span className="font-medium">Email:</span> support@tradepro.com
          </p>
          <p className="text-gray-700 dark:text-gray-300">
            <span className="font-medium">Phone:</span> +1 (555) 123-4567
          </p>
          <p className="text-gray-700 dark:text-gray-300">
            <span className="font-medium">Address:</span> 123 Trading Street, Financial District, New York, NY 10004
          </p>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;