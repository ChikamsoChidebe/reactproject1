import React, { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { useNotification } from '../contexts/NotificationContext';
import { useTrading } from '../contexts/TradingContext';

const SettingsPage = () => {
  const { darkMode, theme, availableThemes, changeTheme, toggleDarkMode, customization, updateCustomization } = useTheme();
  const { settings: notificationSettings, updateSettings: updateNotificationSettings } = useNotification();
  const { tradingSettings, updateTradingSettings } = useTrading();
  const [activeTab, setActiveTab] = useState('appearance');

  // Tabs for settings
  const tabs = [
    { id: 'appearance', label: 'Appearance' },
    { id: 'trading', label: 'Trading' },
    { id: 'notifications', label: 'Notifications' },
    { id: 'api', label: 'API Access' },
  ];

  // Handle theme change
  const handleThemeChange = (themeName) => {
    changeTheme(themeName);
  };

  // Handle customization change
  const handleCustomizationChange = (property, value) => {
    updateCustomization({ [property]: value });
  };

  // Handle notification settings change
  const handleNotificationSettingChange = (setting) => {
    updateNotificationSettings({
      ...notificationSettings,
      [setting]: !notificationSettings[setting]
    });
  };

  // Handle trading settings change
  const handleTradingSettingChange = (setting, value) => {
    updateTradingSettings({
      ...tradingSettings,
      [setting]: value
    });
  };

  // Handle risk management settings change
  const handleRiskSettingChange = (setting, value) => {
    updateTradingSettings({
      ...tradingSettings,
      riskManagement: {
        ...tradingSettings.riskManagement,
        [setting]: value
      }
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Settings</h1>
      
      {/* Settings Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700 mb-6">
        <nav className="flex space-x-8">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>
      
      {/* Appearance Tab */}
      {activeTab === 'appearance' && (
        <div className="space-y-8">
          {/* Dark Mode Toggle */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-lg font-medium">Dark Mode</h2>
                <p className="text-gray-500 dark:text-gray-400 mt-1">
                  Toggle between light and dark mode for the application.
                </p>
              </div>
              <div className="relative inline-block w-12 mr-2 align-middle select-none">
                <input
                  type="checkbox"
                  id="toggle-dark-mode"
                  checked={darkMode}
                  onChange={toggleDarkMode}
                  className="sr-only"
                />
                <label
                  htmlFor="toggle-dark-mode"
                  className={`block overflow-hidden h-6 rounded-full cursor-pointer ${
                    darkMode ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'
                  }`}
                >
                  <span
                    className={`block h-6 w-6 rounded-full bg-white shadow transform transition-transform ${
                      darkMode ? 'translate-x-6' : 'translate-x-0'
                    }`}
                  ></span>
                </label>
              </div>
            </div>
          </div>
          
          {/* Theme Selection */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h2 className="text-lg font-medium mb-4">Theme</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {availableThemes.map(themeName => (
                <button
                  key={themeName}
                  onClick={() => handleThemeChange(themeName)}
                  className={`p-4 rounded-lg border ${
                    theme === themeName
                      ? 'border-blue-500 ring-2 ring-blue-500'
                      : 'border-gray-300 dark:border-gray-700'
                  }`}
                >
                  <div className="h-20 rounded-md mb-2" style={{ 
                    background: themeName === 'default' ? '#1E40AF' : 
                              themeName === 'dark' ? '#1E3A8A' : 
                              themeName === 'contrast' ? '#000000' : 
                              themeName === 'calm' ? '#1F2937' : 
                              themeName === 'vibrant' ? '#4F46E5' : '#1E40AF'
                  }}></div>
                  <p className="text-center text-sm capitalize">{themeName}</p>
                </button>
              ))}
            </div>
          </div>
          
          {/* Custom Colors */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h2 className="text-lg font-medium mb-4">Custom Colors</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Primary Color
                </label>
                <div className="flex items-center">
                  <input
                    type="color"
                    value={customization.primaryColor}
                    onChange={(e) => handleCustomizationChange('primaryColor', e.target.value)}
                    className="h-10 w-10 rounded-md border border-gray-300 dark:border-gray-700"
                  />
                  <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">
                    {customization.primaryColor}
                  </span>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Secondary Color
                </label>
                <div className="flex items-center">
                  <input
                    type="color"
                    value={customization.secondaryColor}
                    onChange={(e) => handleCustomizationChange('secondaryColor', e.target.value)}
                    className="h-10 w-10 rounded-md border border-gray-300 dark:border-gray-700"
                  />
                  <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">
                    {customization.secondaryColor}
                  </span>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Accent Color
                </label>
                <div className="flex items-center">
                  <input
                    type="color"
                    value={customization.accentColor}
                    onChange={(e) => handleCustomizationChange('accentColor', e.target.value)}
                    className="h-10 w-10 rounded-md border border-gray-300 dark:border-gray-700"
                  />
                  <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">
                    {customization.accentColor}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Trading Tab */}
      {activeTab === 'trading' && (
        <div className="space-y-8">
          {/* Default Order Settings */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h2 className="text-lg font-medium mb-4">Default Order Settings</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Default Order Size
                </label>
                <input
                  type="number"
                  value={tradingSettings.defaultOrderSize}
                  onChange={(e) => handleTradingSettingChange('defaultOrderSize', parseInt(e.target.value))}
                  className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 dark:bg-gray-800 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Default Leverage
                </label>
                <div className="flex items-center">
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={tradingSettings.defaultLeverage}
                    onChange={(e) => handleTradingSettingChange('defaultLeverage', parseInt(e.target.value))}
                    className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
                  />
                  <span className="ml-2 text-sm font-medium">{tradingSettings.defaultLeverage}x</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Risk Management */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h2 className="text-lg font-medium mb-4">Risk Management</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Default Stop Loss (%)
                </label>
                <input
                  type="number"
                  value={tradingSettings.riskManagement.stopLossDefault}
                  onChange={(e) => handleRiskSettingChange('stopLossDefault', parseFloat(e.target.value))}
                  className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 dark:bg-gray-800 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Default Take Profit (%)
                </label>
                <input
                  type="number"
                  value={tradingSettings.riskManagement.takeProfitDefault}
                  onChange={(e) => handleRiskSettingChange('takeProfitDefault', parseFloat(e.target.value))}
                  className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 dark:bg-gray-800 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Maximum Position Size
                </label>
                <input
                  type="number"
                  value={tradingSettings.riskManagement.maxPositionSize}
                  onChange={(e) => handleRiskSettingChange('maxPositionSize', parseInt(e.target.value))}
                  className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 dark:bg-gray-800 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Maximum Leverage
                </label>
                <div className="flex items-center">
                  <input
                    type="range"
                    min="1"
                    max="20"
                    value={tradingSettings.riskManagement.maxLeverage}
                    onChange={(e) => handleRiskSettingChange('maxLeverage', parseInt(e.target.value))}
                    className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
                  />
                  <span className="ml-2 text-sm font-medium">{tradingSettings.riskManagement.maxLeverage}x</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Notifications Tab */}
      {activeTab === 'notifications' && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-lg font-medium mb-4">Notification Settings</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Order Executions</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Receive notifications when your orders are executed.
                </p>
              </div>
              <div className="relative inline-block w-12 mr-2 align-middle select-none">
                <input
                  type="checkbox"
                  id="toggle-order-executions"
                  checked={notificationSettings.orderExecutions}
                  onChange={() => handleNotificationSettingChange('orderExecutions')}
                  className="sr-only"
                />
                <label
                  htmlFor="toggle-order-executions"
                  className={`block overflow-hidden h-6 rounded-full cursor-pointer ${
                    notificationSettings.orderExecutions ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'
                  }`}
                >
                  <span
                    className={`block h-6 w-6 rounded-full bg-white shadow transform transition-transform ${
                      notificationSettings.orderExecutions ? 'translate-x-6' : 'translate-x-0'
                    }`}
                  ></span>
                </label>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Price Alerts</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Receive notifications for price alerts you've set.
                </p>
              </div>
              <div className="relative inline-block w-12 mr-2 align-middle select-none">
                <input
                  type="checkbox"
                  id="toggle-price-alerts"
                  checked={notificationSettings.priceAlerts}
                  onChange={() => handleNotificationSettingChange('priceAlerts')}
                  className="sr-only"
                />
                <label
                  htmlFor="toggle-price-alerts"
                  className={`block overflow-hidden h-6 rounded-full cursor-pointer ${
                    notificationSettings.priceAlerts ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'
                  }`}
                >
                  <span
                    className={`block h-6 w-6 rounded-full bg-white shadow transform transition-transform ${
                      notificationSettings.priceAlerts ? 'translate-x-6' : 'translate-x-0'
                    }`}
                  ></span>
                </label>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Market News</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Receive notifications for important market news.
                </p>
              </div>
              <div className="relative inline-block w-12 mr-2 align-middle select-none">
                <input
                  type="checkbox"
                  id="toggle-market-news"
                  checked={notificationSettings.marketNews}
                  onChange={() => handleNotificationSettingChange('marketNews')}
                  className="sr-only"
                />
                <label
                  htmlFor="toggle-market-news"
                  className={`block overflow-hidden h-6 rounded-full cursor-pointer ${
                    notificationSettings.marketNews ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'
                  }`}
                >
                  <span
                    className={`block h-6 w-6 rounded-full bg-white shadow transform transition-transform ${
                      notificationSettings.marketNews ? 'translate-x-6' : 'translate-x-0'
                    }`}
                  ></span>
                </label>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Account Updates</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Receive notifications for account-related updates.
                </p>
              </div>
              <div className="relative inline-block w-12 mr-2 align-middle select-none">
                <input
                  type="checkbox"
                  id="toggle-account-updates"
                  checked={notificationSettings.accountUpdates}
                  onChange={() => handleNotificationSettingChange('accountUpdates')}
                  className="sr-only"
                />
                <label
                  htmlFor="toggle-account-updates"
                  className={`block overflow-hidden h-6 rounded-full cursor-pointer ${
                    notificationSettings.accountUpdates ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'
                  }`}
                >
                  <span
                    className={`block h-6 w-6 rounded-full bg-white shadow transform transition-transform ${
                      notificationSettings.accountUpdates ? 'translate-x-6' : 'translate-x-0'
                    }`}
                  ></span>
                </label>
              </div>
            </div>
            
            <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
              <h3 className="font-medium mb-2">Notification Methods</h3>
              
              <div className="space-y-2">
                <div className="flex items-center">
                  <input
                    id="email-notifications"
                    type="checkbox"
                    checked={notificationSettings.emailNotifications}
                    onChange={() => handleNotificationSettingChange('emailNotifications')}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="email-notifications" className="ml-2 block text-sm text-gray-900 dark:text-gray-300">
                    Email Notifications
                  </label>
                </div>
                
                <div className="flex items-center">
                  <input
                    id="push-notifications"
                    type="checkbox"
                    checked={notificationSettings.pushNotifications}
                    onChange={() => handleNotificationSettingChange('pushNotifications')}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="push-notifications" className="ml-2 block text-sm text-gray-900 dark:text-gray-300">
                    Push Notifications
                  </label>
                </div>
                
                <div className="flex items-center">
                  <input
                    id="sms-notifications"
                    type="checkbox"
                    checked={notificationSettings.smsNotifications}
                    onChange={() => handleNotificationSettingChange('smsNotifications')}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="sms-notifications" className="ml-2 block text-sm text-gray-900 dark:text-gray-300">
                    SMS Notifications
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* API Access Tab */}
      {activeTab === 'api' && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-lg font-medium">API Access</h2>
              <p className="text-gray-500 dark:text-gray-400 mt-1">
                Manage API keys for programmatic access to your account.
              </p>
            </div>
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md">
              Generate New API Key
            </button>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Key Name
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Created
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Last Used
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    Trading Bot
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    2023-05-15
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    2023-06-10
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                      Active
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300">
                      Revoke
                    </button>
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    Data Analysis
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    2023-04-22
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    2023-06-12
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                      Active
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300">
                      Revoke
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          
          <div className="mt-6">
            <h3 className="text-md font-medium mb-2">API Documentation</h3>
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              Learn how to use our API to build custom trading solutions.
            </p>
            <a 
              href="#" 
              className="text-blue-600 dark:text-blue-400 hover:underline flex items-center"
            >
              View API Documentation
              <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
              </svg>
            </a>
          </div>
        </div>
      )}
    </div>
  );
};

export default SettingsPage;