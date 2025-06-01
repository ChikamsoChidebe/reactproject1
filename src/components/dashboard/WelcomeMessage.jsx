import React from 'react';
import { Link } from 'react-router-dom';

const WelcomeMessage = ({ userName, cashBalance }) => {
  return (
    <div className="bg-white rounded-lg shadow p-6 mb-6">
      <h2 className="text-xl font-medium mb-4">Welcome to Credox, {userName}!</h2>
      
      {cashBalance === 0 ? (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                Your account is pending funding. Please make a deposit to start trading.
              </p>
            </div>
          </div>
        </div>
      ) : null}
      
      <p className="mb-4">
        Get started with your trading journey by exploring our platform features:
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <Link to="/deposit" className="bg-blue-50 hover:bg-blue-100 p-4 rounded-lg text-center">
          <svg className="w-8 h-8 mx-auto mb-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
          </svg>
          <h3 className="font-medium">Deposit Funds</h3>
          <p className="text-sm text-gray-600">Add money to your account</p>
        </Link>
        
        <Link to="/markets" className="bg-green-50 hover:bg-green-100 p-4 rounded-lg text-center">
          <svg className="w-8 h-8 mx-auto mb-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"></path>
          </svg>
          <h3 className="font-medium">Explore Markets</h3>
          <p className="text-sm text-gray-600">Browse available assets</p>
        </Link>
        
        <Link to="/kyc" className="bg-purple-50 hover:bg-purple-100 p-4 rounded-lg text-center">
          <svg className="w-8 h-8 mx-auto mb-2 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
          </svg>
          <h3 className="font-medium">Complete KYC</h3>
          <p className="text-sm text-gray-600">Verify your identity</p>
        </Link>
      </div>
      
      <p className="text-sm text-gray-600">
        Need help? Contact our support team at <a href="mailto:support@credox.com" className="text-blue-600 hover:underline">support@credox.com</a>
      </p>
    </div>
  );
};

export default WelcomeMessage;