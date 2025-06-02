import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import AdminDashboardCharts from '../components/charts/AdminDashboardCharts';
import { userService, transactionService, kycService } from '../services/api';

const AdminPage = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [amount, setAmount] = useState('');
  const [transactionType, setTransactionType] = useState('deposit');
  const [positionSymbol, setPositionSymbol] = useState('');
  const [positionQuantity, setPositionQuantity] = useState('');
  const [positionPrice, setPositionPrice] = useState('');
  const [pendingTransactions, setPendingTransactions] = useState([]);
  const [pendingKYC, setPendingKYC] = useState([]);
  const [activeTab, setActiveTab] = useState('users');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load users directly from localStorage
  const loadLocalUsers = () => {
    const localUsers = JSON.parse(localStorage.getItem('users') || '[]');
    return localUsers.filter(user => user.email !== 'admin@credox.com');
  };

  // Check if user is admin
  useEffect(() => {
    if (!currentUser || currentUser.email !== 'admin@credox.com') {
      navigate('/dashboard');
    }
    
    // Replace the fetchData function in useEffect with this:
const fetchData = async () => {
  setIsLoading(true);
  
  // Always load local users first as a fallback
  const localUsers = JSON.parse(localStorage.getItem('users') || '[]');
  const filteredLocalUsers = localUsers.filter(user => user.email !== 'admin@credox.com');
  
  // Set users from localStorage immediately
  setUsers(filteredLocalUsers);
  
  try {
    // Then try to fetch from API
    console.log("Fetching users from API:", 'https://credoxbackend.onrender.com/api/users');
    const response = await fetch('https://credoxbackend.onrender.com/api/users', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });
    
    if (response.ok) {
      const apiUsers = await response.json();
      console.log("Users from API direct fetch:", apiUsers);
      
      if (apiUsers && apiUsers.length > 0) {
        // Update with API users if available
        setUsers(apiUsers.filter(user => user.email !== 'admin@credox.com'));
      }
    } else {
      console.error("API response not OK:", response.status);
    }
  } catch (err) {
    console.error("Error fetching users:", err);
  } finally {
    setIsLoading(false);
  }
  
  // Load other data
  const localTransactions = JSON.parse(localStorage.getItem('pendingTransactions') || '[]');
  setPendingTransactions(localTransactions);
  
  const localKYC = JSON.parse(localStorage.getItem('pendingKYC') || '[]');
  setPendingKYC(localKYC);
};

    
    fetchData();
  }, [currentUser, navigate]);

  const handleUpdateBalance = async () => {
    if (!selectedUser || !amount || isNaN(parseFloat(amount))) return;
    
    const amountValue = parseFloat(amount);
    
    try {
      // Update user via API
      await userService.updateUser(selectedUser.id, {
        cashBalance: parseFloat(selectedUser.cashBalance || 0) + amountValue
      });
      
      // Also update in localStorage for immediate effect
      const localUsers = JSON.parse(localStorage.getItem('users') || '[]');
      const updatedLocalUsers = localUsers.map(user => {
        if (user.id === selectedUser.id) {
          const currentBalance = parseFloat(user.cashBalance || 0);
          const newBalance = currentBalance + amountValue;
          return {
            ...user,
            cashBalance: newBalance >= 0 ? newBalance : 0
          };
        }
        return user;
      });
      localStorage.setItem('users', JSON.stringify(updatedLocalUsers));
      
      // Update current user if it's the same user
      const currentLoggedInUser = JSON.parse(localStorage.getItem('user') || '{}');
      if (currentLoggedInUser.id === selectedUser.id) {
        currentLoggedInUser.cashBalance = parseFloat(currentLoggedInUser.cashBalance || 0) + amountValue;
        localStorage.setItem('user', JSON.stringify(currentLoggedInUser));
      }
      
      // Create transaction record
      const transaction = {
        id: `transaction-${Date.now()}`,
        userId: selectedUser.id,
        userName: selectedUser.name,
        type: amountValue >= 0 ? 'deposit' : 'withdrawal',
        amount: Math.abs(amountValue),
        status: 'completed',
        date: new Date().toISOString()
      };
      
      await transactionService.createTransaction(transaction);
      
      // Update local state
      setUsers(prevUsers => 
        prevUsers.map(user => {
          if (user.id === selectedUser.id) {
            const newBalance = parseFloat(user.cashBalance || 0) + amountValue;
            return {
              ...user,
              cashBalance: newBalance >= 0 ? newBalance : 0
            };
          }
          return user;
        })
      );
      
      setSelectedUser(prev => ({
        ...prev,
        cashBalance: parseFloat(prev.cashBalance || 0) + amountValue
      }));
      
      // Dispatch event to notify other components
      window.dispatchEvent(new Event('userDataChanged'));
      
      setAmount('');
      alert(`Successfully updated ${selectedUser.name}'s balance`);
    } catch (err) {
      console.error('Error updating balance:', err);
      alert(`Failed to update balance: ${err.message}`);
    }
  };

  const handleAddPosition = async () => {
    if (!selectedUser || !positionSymbol || !positionQuantity || !positionPrice) {
      alert('Please fill in all position fields');
      return;
    }
    
    try {
      // Create a new position
      const newPosition = {
        id: `pos-${Date.now()}`,
        symbol: positionSymbol.toUpperCase(),
        name: getStockName(positionSymbol.toUpperCase()),
        quantity: parseFloat(positionQuantity),
        entryPrice: parseFloat(positionPrice),
        currentPrice: parseFloat(positionPrice) * 1.01, // Slightly higher for demo
        marketValue: parseFloat(positionQuantity) * parseFloat(positionPrice),
        unrealizedPL: 0,
        unrealizedPLPercent: 0,
        side: 'LONG'
      };
      
      // Calculate market value and P&L
      newPosition.marketValue = newPosition.quantity * newPosition.currentPrice;
      newPosition.unrealizedPL = (newPosition.currentPrice - newPosition.entryPrice) * newPosition.quantity;
      newPosition.unrealizedPLPercent = (newPosition.currentPrice / newPosition.entryPrice - 1) * 100;
      
      // Get existing positions or initialize empty array
      const existingPositions = JSON.parse(localStorage.getItem(`positions_${selectedUser.id}`) || '[]');
      
      // Add new position
      const updatedPositions = [...existingPositions, newPosition];
      
      // Save to localStorage
      localStorage.setItem(`positions_${selectedUser.id}`, JSON.stringify(updatedPositions));
      
      // Dispatch event to notify other components
      window.dispatchEvent(new Event('userDataChanged'));
      
      // Create a transaction record
      const transaction = {
        id: `transaction-${Date.now()}`,
        userId: selectedUser.id,
        userName: selectedUser.name,
        type: 'trade',
        side: 'buy',
        symbol: positionSymbol.toUpperCase(),
        quantity: parseFloat(positionQuantity),
        price: parseFloat(positionPrice),
        amount: parseFloat(positionQuantity) * parseFloat(positionPrice),
        status: 'completed',
        date: new Date().toISOString()
      };
      
      await transactionService.createTransaction(transaction);
      
      // Reset form
      setPositionSymbol('');
      setPositionQuantity('');
      setPositionPrice('');
      
      alert(`Position added to ${selectedUser.name}'s portfolio`);
    } catch (err) {
      console.error('Error adding position:', err);
      alert(`Failed to add position: ${err.message}`);
    }
  };
  
  // Helper function to get stock name from symbol
  const getStockName = (symbol) => {
    const stockNames = {
      'AAPL': 'Apple Inc.',
      'MSFT': 'Microsoft Corporation',
      'GOOGL': 'Alphabet Inc.',
      'AMZN': 'Amazon.com Inc.',
      'TSLA': 'Tesla Inc.',
      'META': 'Meta Platforms Inc.',
      'NFLX': 'Netflix Inc.',
      'NVDA': 'NVIDIA Corporation'
    };
    
    return stockNames[symbol] || `${symbol} Stock`;
  };

  const handleApproveTransaction = async (transaction) => {
    try {
      // Approve transaction via API
      await transactionService.approveTransaction(transaction.id);
      
      // Update local state
      setPendingTransactions(prev => prev.filter(t => t.id !== transaction.id));
      
      // Update users state
      setUsers(prevUsers => 
        prevUsers.map(user => {
          if (user.id === transaction.userId) {
            const currentBalance = parseFloat(user.cashBalance || 0);
            const newBalance = transaction.type === 'deposit' 
              ? (currentBalance + parseFloat(transaction.amount))
              : (currentBalance - parseFloat(transaction.amount));
            
            return {
              ...user,
              cashBalance: newBalance >= 0 ? newBalance : 0
            };
          }
          return user;
        })
      );
      
      // Also update in localStorage
      const localUsers = JSON.parse(localStorage.getItem('users') || '[]');
      const updatedLocalUsers = localUsers.map(user => {
        if (user.id === transaction.userId) {
          const currentBalance = parseFloat(user.cashBalance || 0);
          const newBalance = transaction.type === 'deposit' 
            ? (currentBalance + parseFloat(transaction.amount))
            : (currentBalance - parseFloat(transaction.amount));
          
          return {
            ...user,
            cashBalance: newBalance >= 0 ? newBalance : 0
          };
        }
        return user;
      });
      localStorage.setItem('users', JSON.stringify(updatedLocalUsers));
      
      // Update transactions in localStorage
      const localPendingTransactions = JSON.parse(localStorage.getItem('pendingTransactions') || '[]');
      const updatedPending = localPendingTransactions.filter(t => t.id !== transaction.id);
      localStorage.setItem('pendingTransactions', JSON.stringify(updatedPending));
      
      const localTransactions = JSON.parse(localStorage.getItem('transactions') || '[]');
      const completedTransaction = {
        ...transaction,
        status: 'completed',
        completedDate: new Date().toISOString()
      };
      localStorage.setItem('transactions', JSON.stringify([completedTransaction, ...localTransactions]));
      
      // Dispatch event to notify other components
      window.dispatchEvent(new Event('userDataChanged'));
      
      alert(`Transaction for ${transaction.userName} has been approved`);
    } catch (err) {
      console.error('Error approving transaction:', err);
      alert(`Failed to approve transaction: ${err.message}`);
    }
  };

  const handleRejectTransaction = async (transaction) => {
    try {
      // Reject transaction via API
      await transactionService.rejectTransaction(transaction.id);
      
      // Update local state
      setPendingTransactions(prev => prev.filter(t => t.id !== transaction.id));
      
      // Update localStorage
      const localPendingTransactions = JSON.parse(localStorage.getItem('pendingTransactions') || '[]');
      const updatedPending = localPendingTransactions.filter(t => t.id !== transaction.id);
      localStorage.setItem('pendingTransactions', JSON.stringify(updatedPending));
      
      const localTransactions = JSON.parse(localStorage.getItem('transactions') || '[]');
      const rejectedTransaction = {
        ...transaction,
        status: 'rejected',
        completedDate: new Date().toISOString()
      };
      localStorage.setItem('transactions', JSON.stringify([rejectedTransaction, ...localTransactions]));
      
      // Dispatch event to notify other components
      window.dispatchEvent(new Event('userDataChanged'));
      
      alert(`Transaction for ${transaction.userName} has been rejected`);
    } catch (err) {
      console.error('Error rejecting transaction:', err);
      alert(`Failed to reject transaction: ${err.message}`);
    }
  };

  const handleApproveKYC = async (kycRequest) => {
    try {
      // Approve KYC via API
      await kycService.approveKYC(kycRequest.id);
      
      // Update local state
      setPendingKYC(prev => prev.filter(k => k.id !== kycRequest.id));
      
      // Update users state
      setUsers(prevUsers => 
        prevUsers.map(user => {
          if (user.id === kycRequest.userId) {
            return {
              ...user,
              kycVerified: true,
              kycLevel: kycRequest.level,
              kycApprovedDate: new Date().toISOString()
            };
          }
          return user;
        })
      );
      
      // Update in localStorage
      const localUsers = JSON.parse(localStorage.getItem('users') || '[]');
      const updatedLocalUsers = localUsers.map(user => {
        if (user.id === kycRequest.userId) {
          return {
            ...user,
            kycVerified: true,
            kycLevel: kycRequest.level,
            kycApprovedDate: new Date().toISOString()
          };
        }
        return user;
      });
      localStorage.setItem('users', JSON.stringify(updatedLocalUsers));
      
      const localPendingKYC = JSON.parse(localStorage.getItem('pendingKYC') || '[]');
      const updatedPendingKYC = localPendingKYC.filter(k => k.id !== kycRequest.id);
      localStorage.setItem('pendingKYC', JSON.stringify(updatedPendingKYC));
      
      // Dispatch event to notify other components
      window.dispatchEvent(new Event('userDataChanged'));
      
      alert(`KYC for ${kycRequest.userName} has been approved`);
    } catch (err) {
      console.error('Error approving KYC:', err);
      alert(`Failed to approve KYC: ${err.message}`);
    }
  };

  const handleRejectKYC = async (kycRequest) => {
    try {
      // Reject KYC via API
      await kycService.rejectKYC(kycRequest.id);
      
      // Update local state
      setPendingKYC(prev => prev.filter(k => k.id !== kycRequest.id));
      
      // Update localStorage
      const localPendingKYC = JSON.parse(localStorage.getItem('pendingKYC') || '[]');
      const updatedPendingKYC = localPendingKYC.filter(k => k.id !== kycRequest.id);
      localStorage.setItem('pendingKYC', JSON.stringify(updatedPendingKYC));
      
      // Dispatch event to notify other components
      window.dispatchEvent(new Event('userDataChanged'));
      
      alert(`KYC for ${kycRequest.userName} has been rejected`);
    } catch (err) {
      console.error('Error rejecting KYC:', err);
      alert(`Failed to reject KYC: ${err.message}`);
    }
  };
  
  const handleRefresh = async () => {
    setIsLoading(true);
    
    // Always load local users first as a fallback
    const localUsers = JSON.parse(localStorage.getItem('users') || '[]');
    const filteredLocalUsers = localUsers.filter(user => user.email !== 'admin@credox.com');
    
    // Set users from localStorage immediately
    setUsers(filteredLocalUsers);
    
    try {
      // Then try to fetch from API directly
      console.log("Fetching users from API (refresh):", 'https://credoxbackend.onrender.com/api/users');
      const response = await fetch('https://credoxbackend.onrender.com/api/users', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });
      
      if (response.ok) {
        const apiUsers = await response.json();
        console.log("Users from API direct fetch (refresh):", apiUsers);
        
        if (apiUsers && apiUsers.length > 0) {
          // Update with API users if available
          setUsers(apiUsers.filter(user => user.email !== 'admin@credox.com'));
        }
      } else {
        console.error("API response not OK (refresh):", response.status);
      }
    } catch (err) {
      console.error("Error refreshing users:", err);
    } finally {
      setIsLoading(false);
    }
    
    // Load other data
    const localTransactions = JSON.parse(localStorage.getItem('pendingTransactions') || '[]');
    setPendingTransactions(localTransactions);
    
    const localKYC = JSON.parse(localStorage.getItem('pendingKYC') || '[]');
    setPendingKYC(localKYC);
    
    console.log("Admin page refreshed");
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }
  // Add this to the end of your AdminPage.jsx file, right after the loading check

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <button 
          onClick={handleRefresh}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded flex items-center"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
          </svg>
          Refresh Data
        </button>
      </div>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}
      
      {/* Admin Tabs */}
      <div className="mb-6 border-b border-gray-200 overflow-x-auto">
        <nav className="flex space-x-8">
          <button
            onClick={() => setActiveTab('users')}
            className={`py-4 px-1 border-b-2 font-medium whitespace-nowrap ${
              activeTab === 'users'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            User Management
          </button>
          <button
            onClick={() => setActiveTab('transactions')}
            className={`py-4 px-1 border-b-2 font-medium whitespace-nowrap ${
              activeTab === 'transactions'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Pending Transactions
            {pendingTransactions.length > 0 && (
              <span className="ml-2 bg-red-600 text-white text-xs rounded-full px-2 py-1">
                {pendingTransactions.length}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('kyc')}
            className={`py-4 px-1 border-b-2 font-medium whitespace-nowrap ${
              activeTab === 'kyc'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            KYC Verification
            {pendingKYC.length > 0 && (
              <span className="ml-2 bg-red-600 text-white text-xs rounded-full px-2 py-1">
                {pendingKYC.length}
              </span>
            )}
          </button>
        </nav>
      </div>
      
      {activeTab === 'users' && (
        <>
          <AdminDashboardCharts users={users} transactions={[]} />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* User Management */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">User Management</h2>
              
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">Select User</label>
                <select 
                  className="w-full border border-gray-300 rounded-md p-2"
                  value={selectedUser?.id || ''}
                  onChange={(e) => {
                    const user = users.find(u => u.id === e.target.value);
                    setSelectedUser(user || null);
                  }}
                >
                  <option value="">Select a user</option>
                  {users.map(user => (
                    <option key={user.id} value={user.id}>{user.name} ({user.email})</option>
                  ))}
                </select>
              </div>
              
              {selectedUser && (
                <div className="border p-4 rounded-md mb-4">
                  <h3 className="font-medium mb-2">User Details</h3>
                  <p><span className="font-medium">Name:</span> {selectedUser.name}</p>
                  <p><span className="font-medium">Email:</span> {selectedUser.email}</p>
                  <p><span className="font-medium">Account ID:</span> {selectedUser.accountId}</p>
                  <p><span className="font-medium">Account Type:</span> {selectedUser.accountType}</p>
                  <p><span className="font-medium">Join Date:</span> {selectedUser.joinDate}</p>
                  <p><span className="font-medium">Cash Balance:</span> ${parseFloat(selectedUser.cashBalance || 0).toFixed(2)}</p>
                  <p><span className="font-medium">KYC Status:</span> {selectedUser.kycVerified ? 
                    <span className="text-green-600">Verified (Level {selectedUser.kycLevel})</span> : 
                    <span className="text-red-600">Not Verified</span>}
                  </p>
                </div>
              )}
              
              {selectedUser && (
                <div className="border p-4 rounded-md mb-4">
                  <h3 className="font-medium mb-2">Update Balance</h3>
                  
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Transaction Type</label>
                    <div className="flex space-x-4">
                      <label className="inline-flex items-center">
                        <input 
                          type="radio" 
                          className="form-radio" 
                          name="transactionType" 
                          value="deposit"
                          checked={transactionType === 'deposit'}
                          onChange={() => setTransactionType('deposit')}
                        />
                        <span className="ml-2">Deposit</span>
                      </label>
                      <label className="inline-flex items-center">
                        <input 
                          type="radio" 
                          className="form-radio" 
                          name="transactionType" 
                          value="withdraw"
                          checked={transactionType === 'withdraw'}
                          onChange={() => setTransactionType('withdraw')}
                        />
                        <span className="ml-2">Withdraw</span>
                      </label>
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
                    <div className="flex">
                      <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500">$</span>
                      <input
                        type="number"
                        className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-r-md border border-gray-300"
                        placeholder="0.00"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                      />
                    </div>
                  </div>
                  
                  <button
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded"
                    onClick={() => {
                      const amountValue = transactionType === 'deposit' 
                        ? Math.abs(parseFloat(amount)) 
                        : -Math.abs(parseFloat(amount));
                      setAmount(amountValue.toString());
                      handleUpdateBalance();
                    }}
                  >
                    Update Balance
                  </button>
                </div>
              )}
              
              {selectedUser && (
                <div className="border p-4 rounded-md">
                  <h3 className="font-medium mb-2">Add Position</h3>
                  
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Symbol</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      placeholder="AAPL"
                      value={positionSymbol || ''}
                      onChange={(e) => setPositionSymbol(e.target.value)}
                    />
                  </div>
                  
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
                    <input
                      type="number"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      placeholder="10"
                      value={positionQuantity || ''}
                      onChange={(e) => setPositionQuantity(e.target.value)}
                    />
                  </div>
                  
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Entry Price</label>
                    <div className="flex">
                      <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500">$</span>
                      <input
                        type="number"
                        className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-r-md border border-gray-300"
                        placeholder="150.00"
                        value={positionPrice || ''}
                        onChange={(e) => setPositionPrice(e.target.value)}
                      />
                    </div>
                  </div>
                  
                  <button
                    className="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded"
                    onClick={handleAddPosition}
                  >
                    Add Position
                  </button>
                </div>
              )}
            </div>
            
            {/* All Users */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">All Users ({users.length})</h2>
              
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Balance</th>
                      <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">KYC</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {users.length > 0 ? (
                      users.map((user) => (
                        <tr key={user.id} className="hover:bg-gray-50 cursor-pointer" onClick={() => setSelectedUser(user)}>
                          <td className="px-4 py-3 whitespace-nowrap">{user.name}</td>
                          <td className="px-4 py-3 whitespace-nowrap">{user.email}</td>
                          <td className="px-4 py-3 whitespace-nowrap text-right">${parseFloat(user.cashBalance || 0).toFixed(2)}</td>
                          <td className="px-4 py-3 whitespace-nowrap text-center">
                            {user.kycVerified ? (
                              <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">Verified</span>
                            ) : (
                              <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-800">Not Verified</span>
                            )}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="4" className="px-4 py-3 text-center text-gray-500">
                          No users found. Try refreshing the page.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </>
      )}
      
      {activeTab === 'transactions' && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Pending Transactions</h2>
          
          {pendingTransactions.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {pendingTransactions.map((transaction) => (
                    <tr key={transaction.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-medium">{transaction.userName}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          transaction.type === 'deposit' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        ${parseFloat(transaction.amount).toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        {new Date(transaction.date).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <button 
                          className="text-green-600 hover:text-green-900 mr-3"
                          onClick={() => handleApproveTransaction(transaction)}
                        >
                          Approve
                        </button>
                        <button 
                          className="text-red-600 hover:text-red-900"
                          onClick={() => handleRejectTransaction(transaction)}
                        >
                          Reject
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              No pending transactions
            </div>
          )}
        </div>
      )}
      
      {activeTab === 'kyc' && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">KYC Verification Requests</h2>
          
          {pendingKYC.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Level</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Documents</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {pendingKYC.map((kyc) => (
                    <tr key={kyc.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-medium">{kyc.userName}</div>
                        <div className="text-sm text-gray-500">{kyc.userEmail}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
                          Level {kyc.level}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <ul className="list-disc pl-5 text-sm">
                          {kyc.documents.map((doc, index) => (
                            <li key={index}>{doc.type}: <a href="#" className="text-blue-600 hover:underline">View</a></li>
                          ))}
                        </ul>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        {new Date(kyc.date).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <button 
                          className="text-green-600 hover:text-green-900 mr-3"
                          onClick={() => handleApproveKYC(kyc)}
                        >
                          Approve
                        </button>
                        <button 
                          className="text-red-600 hover:text-red-900"
                          onClick={() => handleRejectKYC(kyc)}
                        >
                          Reject
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              No pending KYC verification requests
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminPage;
