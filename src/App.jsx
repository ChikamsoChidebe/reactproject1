import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { MarketDataProvider } from './contexts/MarketDataContext';
import { TradingProvider } from './contexts/TradingContext';
import { NotificationProvider } from './contexts/NotificationContext';
import TestApiPage from './pages/TestApiPage';

// Import pages
import HomePage from './pages/HomePage';
import DashboardPage from './pages/DashboardPage';
import TradingPage from './pages/TradingPage';
import MarketsPage from './pages/MarketsPage';
import PortfolioPage from './pages/PortfolioPage';
import AnalyticsPage from './pages/AnalyticsPage';
import NewsPage from './pages/NewsPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AccountPage from './pages/AccountPage';
import SettingsPage from './pages/SettingsPage';
import AdminPage from './pages/AdminPage';
import DepositPage from './pages/DepositPage';
import WithdrawPage from './pages/WithdrawPage';
import KYCPage from './pages/KYCPage';

// Layout components
import Layout from './components/layout/Layout';

// Protected Route component
const ProtectedRoute = ({ children }) => {
  try {
    const userStr = localStorage.getItem('user');
    
    // Check if user data exists and is valid
    if (!userStr || userStr === 'undefined') {
      console.log('No user data found, redirecting to login');
      return <Navigate to="/login" replace />;
    }
    
    // Try to parse the user data
    try {
      JSON.parse(userStr);
    } catch (e) {
      console.error('Invalid user data in localStorage:', e);
      localStorage.removeItem('user');
      return <Navigate to="/login" replace />;
    }
    
    return children;
  } catch (error) {
    console.error('Error in ProtectedRoute:', error);
    return <Navigate to="/login" replace />;
  }
};

// Admin Route component
const AdminRoute = ({ children }) => {
  try {
    const userStr = localStorage.getItem('user');
    
    // Check if user data exists
    if (!userStr || userStr === 'undefined') {
      console.log('No user data found, redirecting to login');
      return <Navigate to="/login" replace />;
    }
    
    // Try to parse the user data
    let user;
    try {
      user = JSON.parse(userStr);
    } catch (e) {
      console.error('Invalid user data in localStorage:', e);
      localStorage.removeItem('user');
      return <Navigate to="/login" replace />;
    }
    
    // Check if user is admin
    if (!user || user.email !== 'admin@credox.com') {
      console.log('User is not admin, redirecting to dashboard');
      return <Navigate to="/dashboard" replace />;
    }
    
    return children;
  } catch (error) {
    console.error('Error in AdminRoute:', error);
    return <Navigate to="/login" replace />;
  }
};

function App() {
  return (
    <Router basename={import.meta.env.BASE_URL || '/'}>
      <AuthProvider>
        <NotificationProvider>
          <MarketDataProvider>
            <TradingProvider>
              <Routes>
                <Route path="/" element={<Layout />}>
                  <Route index element={<HomePage />} />
                  <Route path="dashboard" element={
                    <ProtectedRoute>
                      <DashboardPage />
                    </ProtectedRoute>
                  } />
                  <Route path="trading" element={
                    <ProtectedRoute>
                      <TradingPage />
                    </ProtectedRoute>
                  } />
                  <Route path="markets" element={<MarketsPage />} />
                  <Route path="portfolio" element={
                    <ProtectedRoute>
                      <PortfolioPage />
                    </ProtectedRoute>
                  } />
                  <Route path="analytics" element={
                    <ProtectedRoute>
                      <AnalyticsPage />
                    </ProtectedRoute>
                  } />
                  <Route path="news" element={<NewsPage />} />
                  <Route path="login" element={<LoginPage />} />
                  <Route path="register" element={<RegisterPage />} />
                  <Route path="account" element={
                    <ProtectedRoute>
                      <AccountPage />
                    </ProtectedRoute>
                  } />
                  <Route path="settings" element={
                    <ProtectedRoute>
                      <SettingsPage />
                    </ProtectedRoute>
                  } />
                  <Route path="admin" element={
                    <AdminRoute>
                      <AdminPage />
                    </AdminRoute>
                  } />
                  <Route path="deposit" element={
                    <ProtectedRoute>
                      <DepositPage />
                    </ProtectedRoute>
                  } />
                  <Route path="withdraw" element={
                    <ProtectedRoute>
                      <WithdrawPage />
                    </ProtectedRoute>
                  } />
                  <Route path="kyc" element={
                    <ProtectedRoute>
                      <KYCPage />
                    </ProtectedRoute>
                  } />
                  <Route path="/test-api" element={<TestApiPage />} />
  <Route path="*" element={<Navigate to="/" replace />} />
                </Route>
              </Routes>
            </TradingProvider>
          </MarketDataProvider>
        </NotificationProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;