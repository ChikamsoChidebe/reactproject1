import React, { createContext, useContext, useState, useEffect } from 'react';

// Create context
const NotificationContext = createContext();

// Sample notification settings
const sampleNotificationSettings = {
  orderExecutions: true,
  priceAlerts: true,
  marketNews: false,
  accountUpdates: true,
  emailNotifications: true,
  pushNotifications: true,
  smsNotifications: false
};

// Sample notifications
const sampleNotifications = [
  {
    id: 'notification-1',
    type: 'ORDER_EXECUTION',
    title: 'Order Executed',
    message: 'Your order to buy 10 shares of AAPL has been executed at $175.50.',
    timestamp: new Date().getTime() - 3600000, // 1 hour ago
    read: false
  },
  {
    id: 'notification-2',
    type: 'PRICE_ALERT',
    title: 'Price Alert',
    message: 'BTC/USD has reached your target price of $45,000.',
    timestamp: new Date().getTime() - 7200000, // 2 hours ago
    read: true
  },
  {
    id: 'notification-3',
    type: 'MARKET_NEWS',
    title: 'Breaking News',
    message: 'Federal Reserve announces interest rate decision.',
    timestamp: new Date().getTime() - 10800000, // 3 hours ago
    read: false
  },
  {
    id: 'notification-4',
    type: 'ACCOUNT_UPDATE',
    title: 'Account Update',
    message: 'Your account verification has been completed successfully.',
    timestamp: new Date().getTime() - 86400000, // 1 day ago
    read: true
  }
];

// Provider component
export const NotificationProvider = ({ children }) => {
  const [settings, setSettings] = useState(sampleNotificationSettings);
  const [notifications, setNotifications] = useState(sampleNotifications);
  const [unreadCount, setUnreadCount] = useState(0);

  // Calculate unread count
  useEffect(() => {
    const count = notifications.filter(notification => !notification.read).length;
    setUnreadCount(count);
  }, [notifications]);

  // Update notification settings
  const updateSettings = (newSettings) => {
    setSettings(prev => ({
      ...prev,
      ...newSettings
    }));
  };

  // Add a notification
  const addNotification = (notification) => {
    const newNotification = {
      id: `notification-${Date.now()}`,
      timestamp: Date.now(),
      read: false,
      ...notification
    };
    
    setNotifications(prev => [newNotification, ...prev]);
    return newNotification;
  };

  // Mark notification as read
  const markAsRead = (notificationId) => {
    setNotifications(prev => 
      prev.map(notification => {
        if (notification.id === notificationId) {
          return { ...notification, read: true };
        }
        return notification;
      })
    );
  };

  // Mark all notifications as read
  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    );
  };

  // Delete a notification
  const deleteNotification = (notificationId) => {
    setNotifications(prev => 
      prev.filter(notification => notification.id !== notificationId)
    );
  };

  // Clear all notifications
  const clearAllNotifications = () => {
    setNotifications([]);
  };

  // Context value
  const value = {
    settings,
    notifications,
    unreadCount,
    updateSettings,
    addNotification,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAllNotifications
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

// Custom hook
export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};

export default NotificationContext;