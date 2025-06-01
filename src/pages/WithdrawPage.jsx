import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useTrading } from '../contexts/TradingContext';
import { useNavigate } from 'react-router-dom';

const WithdrawPage = () => {
  const { currentUser } = useAuth();
  const { cashBalance } = useTrading();
  const navigate = useNavigate();
  const [amount, setAmount] = useState('');
  const [withdrawalMethod, setWithdrawalMethod] = useState('bank');
  const [accountDetails, setAccountDetails] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // Redirect if not logged in
  if (!currentUser) {
    navigate('/login');
    return null;
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    
    if (!amount || parseFloat(amount) <= 0) {
      return setError('Please enter a valid amount');
    }
    
    if (parseFloat(amount) > cashBalance) {
      return setError('Insufficient funds');
    }
    
    if (!accountDetails) {
      return setError('Please enter your withdrawal account details');
    }
    
    setIsLoading(true);
    
    try {
      // Create a pending transaction
      const transaction = {
        id: `transaction-${Date.now()}`,
        userId: currentUser.id,
        userName: currentUser.name,
        type: 'withdrawal',
        amount: parseFloat(amount),
        withdrawalMethod,
        accountDetails,
        status: 'pending',
        date: new Date().toISOString()
      };
      
      // Save to pending transactions
      const pendingTransactions = JSON.parse(localStorage.getItem('pendingTransactions') || '[]');
      localStorage.setItem('pendingTransactions', JSON.stringify([transaction, ...pendingTransactions]));
      
      setAmount('');
      setAccountDetails('');
      setSuccess(true);
      setIsLoading(false);
    } catch (err) {
      setError('Failed to process withdrawal request');
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-md mx-auto">
        <h1 className="text-3xl font-bold mb-6">Withdraw Funds</h1>
        
        {success && (
          <div className="mb-6 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
            Your withdrawal request has been submitted successfully. It will be processed shortly.
          </div>
        )}
        
        {error && (
          <div className="mb-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="mb-4 p-4 bg-blue-50 rounded">
            <p className="font-medium">Available Balance: ${cashBalance.toFixed(2)}</p>
          </div>
          
          <form onSubmit={handleSubmit}>
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
                  max={cashBalance}
                  required
                />
              </div>
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Withdrawal Method</label>
              <select
                className="block w-full px-3 py-2 border border-gray-300 rounded-md"
                value={withdrawalMethod}
                onChange={(e) => setWithdrawalMethod(e.target.value)}
              >
                <option value="bank">Bank Transfer</option>
                <option value="card">Credit/Debit Card</option>
                <option value="crypto">Cryptocurrency</option>
              </select>
            </div>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {withdrawalMethod === 'bank' ? 'Bank Account Details' : 
                 withdrawalMethod === 'card' ? 'Card Details' : 
                 'Wallet Address'}
              </label>
              <textarea
                className="block w-full px-3 py-2 border border-gray-300 rounded-md"
                rows="3"
                placeholder={
                  withdrawalMethod === 'bank' ? 'Bank Name, Account Number, Account Name, etc.' : 
                  withdrawalMethod === 'card' ? 'Card Number, Name on Card, etc.' : 
                  'Your cryptocurrency wallet address'
                }
                value={accountDetails}
                onChange={(e) => setAccountDetails(e.target.value)}
                required
              ></textarea>
            </div>
            
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded disabled:opacity-50"
            >
              {isLoading ? 'Processing...' : 'Submit Withdrawal Request'}
            </button>
          </form>
          
          <div className="mt-6 border-t pt-4">
            <h3 className="font-medium mb-2">Withdrawal Information:</h3>
            <ul className="list-disc pl-5 text-sm text-gray-600 space-y-1">
              <li>Withdrawal requests are processed within 1-3 business days.</li>
              <li>A fee of 1% applies to all withdrawals (minimum $5).</li>
              <li>For security reasons, withdrawals are only sent to verified accounts.</li>
              <li>Please ensure your account details are correct to avoid delays.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WithdrawPage;