import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const DepositPage = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [amount, setAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('bank');
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
    
    setIsLoading(true);
    
    try {
      // Create a pending transaction
      const transaction = {
        id: `transaction-${Date.now()}`,
        userId: currentUser.id,
        userName: currentUser.name,
        type: 'deposit',
        amount: parseFloat(amount),
        paymentMethod,
        status: 'pending',
        date: new Date().toISOString()
      };
      
      // Save to pending transactions
      const pendingTransactions = JSON.parse(localStorage.getItem('pendingTransactions') || '[]');
      localStorage.setItem('pendingTransactions', JSON.stringify([transaction, ...pendingTransactions]));
      
      setAmount('');
      setSuccess(true);
      setIsLoading(false);
    } catch (err) {
      setError('Failed to process deposit request');
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-md mx-auto">
        <h1 className="text-3xl font-bold mb-6">Deposit Funds</h1>
        
        {success && (
          <div className="mb-6 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
            Your deposit request has been submitted successfully. It will be processed shortly.
          </div>
        )}
        
        {error && (
          <div className="mb-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}
        
        <div className="bg-white rounded-lg shadow p-6">
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
                  required
                />
              </div>
            </div>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">Payment Method</label>
              <select
                className="block w-full px-3 py-2 border border-gray-300 rounded-md"
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
              >
                <option value="bank">Bank Transfer</option>
                <option value="card">Credit/Debit Card</option>
                <option value="crypto">Cryptocurrency</option>
              </select>
            </div>
            
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded disabled:opacity-50"
            >
              {isLoading ? 'Processing...' : 'Submit Deposit Request'}
            </button>
          </form>
          
          <div className="mt-6 border-t pt-4">
            <h3 className="font-medium mb-2">Deposit Instructions:</h3>
            {paymentMethod === 'bank' && (
              <div className="text-sm text-gray-600">
                <p className="mb-2">Please transfer the funds to the following bank account:</p>
                <p>Bank Name: Credox Bank</p>
                <p>Account Name: Credox Trading Ltd</p>
                <p>Account Number: 1234567890</p>
                <p>Routing Number: 987654321</p>
                <p>Reference: {currentUser.accountId}</p>
              </div>
            )}
            
            {paymentMethod === 'card' && (
              <div className="text-sm text-gray-600">
                <p className="mb-2">You will be redirected to our secure payment processor after submission.</p>
                <p>We accept Visa, Mastercard, and American Express.</p>
              </div>
            )}
            
            {paymentMethod === 'crypto' && (
              <div className="text-sm text-gray-600">
                <p className="mb-2">Please send your cryptocurrency to the following address:</p>
                <p>Bitcoin (BTC): 3FZbgi29cpjq2GjdwV8eyHuJJnkLtktZc5</p>
                <p>Ethereum (ETH): 0x71C7656EC7ab88b098defB751B7401B5f6d8976F</p>
                <p>Include your Account ID ({currentUser.accountId}) in the transaction memo.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DepositPage;