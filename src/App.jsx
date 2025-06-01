import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { MarketDataProvider } from './contexts/MarketDataContext';
import { TradingProvider } from './contexts/TradingContext';
import { NotificationProvider } from './contexts/NotificationContext';

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
  const isAuthenticated = localStorage.getItem('user') !== null;
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

// Admin Route component
const AdminRoute = ({ children }) => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const isAdmin = user.email === 'admin@credox.com';
  
  if (!isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return children;
};

function App() {
  return (
    <Router>
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