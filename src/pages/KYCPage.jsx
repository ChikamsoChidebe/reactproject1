import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const KYCPage = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [level, setLevel] = useState('1');
  const [idType, setIdType] = useState('passport');
  const [idNumber, setIdNumber] = useState('');
  const [addressProofType, setAddressProofType] = useState('utility_bill');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [kycStatus, setKycStatus] = useState('not_submitted');

  // Redirect if not logged in
  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
      return;
    }
    
    // Check if user already has KYC
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find(u => u.id === currentUser.id);
    
    if (user?.kycVerified) {
      setKycStatus('verified');
    } else {
      // Check if there's a pending KYC request
      const pendingKYC = JSON.parse(localStorage.getItem('pendingKYC') || '[]');
      const userKYC = pendingKYC.find(k => k.userId === currentUser.id);
      
      if (userKYC) {
        setKycStatus('pending');
      }
    }
  }, [currentUser, navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    
    if (!idNumber) {
      return setError('Please enter your ID number');
    }
    
    setIsLoading(true);
    
    try {
      // Create KYC request
      const kycRequest = {
        id: `kyc-${Date.now()}`,
        userId: currentUser.id,
        userName: currentUser.name,
        userEmail: currentUser.email,
        level,
        documents: [
          {
            type: idType === 'passport' ? 'Passport' : idType === 'drivers_license' ? 'Driver\'s License' : 'National ID',
            number: idNumber
          },
          {
            type: addressProofType === 'utility_bill' ? 'Utility Bill' : addressProofType === 'bank_statement' ? 'Bank Statement' : 'Rental Agreement'
          }
        ],
        status: 'pending',
        date: new Date().toISOString()
      };
      
      // Save to pending KYC
      const pendingKYC = JSON.parse(localStorage.getItem('pendingKYC') || '[]');
      localStorage.setItem('pendingKYC', JSON.stringify([kycRequest, ...pendingKYC]));
      
      setSuccess(true);
      setKycStatus('pending');
      setIsLoading(false);
    } catch (err) {
      setError('Failed to submit KYC request');
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">KYC Verification</h1>
        
        {kycStatus === 'verified' ? (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">
            <p className="font-bold">Your account is verified!</p>
            <p>You have full access to all platform features.</p>
          </div>
        ) : kycStatus === 'pending' ? (
          <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-6">
            <p className="font-bold">Your verification is in progress</p>
            <p>We are reviewing your submitted documents. This process typically takes 1-3 business days.</p>
          </div>
        ) : (
          <>
            <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded mb-6">
              <p className="font-bold">Why verify your identity?</p>
              <p>KYC verification is required to deposit, withdraw, and trade with higher limits.</p>
            </div>
            
            {success && (
              <div className="mb-6 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
                Your KYC verification request has been submitted successfully. We will review your information shortly.
              </div>
            )}
            
            {error && (
              <div className="mb-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            )}
            
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Verification Form</h2>
              
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Verification Level</label>
                  <select
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md"
                    value={level}
                    onChange={(e) => setLevel(e.target.value)}
                  >
                    <option value="1">Level 1 - Basic (Deposit/Withdraw up to $2,000)</option>
                    <option value="2">Level 2 - Intermediate (Deposit/Withdraw up to $10,000)</option>
                    <option value="3">Level 3 - Advanced (Unlimited transactions)</option>
                  </select>
                </div>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">ID Document Type</label>
                  <select
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md"
                    value={idType}
                    onChange={(e) => setIdType(e.target.value)}
                  >
                    <option value="passport">Passport</option>
                    <option value="drivers_license">Driver's License</option>
                    <option value="national_id">National ID</option>
                  </select>
                </div>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">ID Number</label>
                  <input
                    type="text"
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md"
                    value={idNumber}
                    onChange={(e) => setIdNumber(e.target.value)}
                    required
                  />
                </div>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">ID Document Upload</label>
                  <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                    <div className="space-y-1 text-center">
                      <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                        <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      <div className="flex text-sm text-gray-600">
                        <label htmlFor="file-upload-1" className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500">
                          <span>Upload a file</span>
                          <input id="file-upload-1" name="file-upload-1" type="file" className="sr-only" />
                        </label>
                        <p className="pl-1">or drag and drop</p>
                      </div>
                      <p className="text-xs text-gray-500">PNG, JPG, PDF up to 10MB</p>
                    </div>
                  </div>
                </div>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Address Proof Type</label>
                  <select
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md"
                    value={addressProofType}
                    onChange={(e) => setAddressProofType(e.target.value)}
                  >
                    <option value="utility_bill">Utility Bill</option>
                    <option value="bank_statement">Bank Statement</option>
                    <option value="rental_agreement">Rental Agreement</option>
                  </select>
                </div>
                
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Address Proof Upload</label>
                  <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                    <div className="space-y-1 text-center">
                      <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                        <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      <div className="flex text-sm text-gray-600">
                        <label htmlFor="file-upload-2" className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500">
                          <span>Upload a file</span>
                          <input id="file-upload-2" name="file-upload-2" type="file" className="sr-only" />
                        </label>
                        <p className="pl-1">or drag and drop</p>
                      </div>
                      <p className="text-xs text-gray-500">PNG, JPG, PDF up to 10MB</p>
                    </div>
                  </div>
                </div>
                
                <div className="mb-4">
                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id="terms"
                        name="terms"
                        type="checkbox"
                        className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                        required
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor="terms" className="font-medium text-gray-700">
                        I confirm that all information provided is accurate and authentic
                      </label>
                    </div>
                  </div>
                </div>
                
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded disabled:opacity-50"
                >
                  {isLoading ? 'Submitting...' : 'Submit Verification'}
                </button>
              </form>
            </div>
          </>
        )}
        
        <div className="mt-8 bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Verification Levels</h2>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Level</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Requirements</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Limits</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800">Level 1</span>
                  </td>
                  <td className="px-6 py-4">
                    <ul className="list-disc pl-5 text-sm">
                      <li>Basic personal information</li>
                      <li>Email verification</li>
                    </ul>
                  </td>
                  <td className="px-6 py-4">
                    <ul className="list-disc pl-5 text-sm">
                      <li>Deposit up to $2,000</li>
                      <li>Withdraw up to $2,000</li>
                    </ul>
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">Level 2</span>
                  </td>
                  <td className="px-6 py-4">
                    <ul className="list-disc pl-5 text-sm">
                      <li>Government-issued ID</li>
                      <li>Proof of address</li>
                    </ul>
                  </td>
                  <td className="px-6 py-4">
                    <ul className="list-disc pl-5 text-sm">
                      <li>Deposit up to $10,000</li>
                      <li>Withdraw up to $10,000</li>
                    </ul>
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">Level 3</span>
                  </td>
                  <td className="px-6 py-4">
                    <ul className="list-disc pl-5 text-sm">
                      <li>Enhanced due diligence</li>
                      <li>Proof of income</li>
                      <li>Video verification</li>
                    </ul>
                  </td>
                  <td className="px-6 py-4">
                    <ul className="list-disc pl-5 text-sm">
                      <li>Unlimited deposits</li>
                      <li>Unlimited withdrawals</li>
                      <li>Access to premium features</li>
                    </ul>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KYCPage;