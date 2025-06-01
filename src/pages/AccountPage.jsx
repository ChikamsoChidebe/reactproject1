import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

const AccountPage = () => {
  const { currentUser, updateProfile, enableTwoFactor, error } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: currentUser?.name || '',
    email: currentUser?.email || '',
    phone: currentUser?.phone || '',
  });

  // Tabs for account settings
  const tabs = [
    { id: 'profile', label: 'Profile' },
    { id: 'security', label: 'Security' },
    { id: 'preferences', label: 'Preferences' },
    { id: 'documents', label: 'Documents' },
    { id: 'billing', label: 'Billing' },
  ];

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateProfile(formData);
      setIsEditing(false);
    } catch (err) {
      console.error('Failed to update profile:', err);
    }
  };

  // Enable two-factor authentication
  const handleEnableTwoFactor = async () => {
    try {
      const result = await enableTwoFactor();
      // In a real app, this would show QR code and backup codes
      console.log('2FA enabled:', result);
    } catch (err) {
      console.error('Failed to enable 2FA:', err);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Account Settings</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}
      
      {/* Account Tabs */}
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
      
      {/* Profile Tab */}
      {activeTab === 'profile' && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Profile Information</h2>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
            >
              {isEditing ? 'Cancel' : 'Edit'}
            </button>
          </div>
          
          {isEditing ? (
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 dark:bg-gray-800 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 dark:bg-gray-800 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 dark:bg-gray-800 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                
                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </form>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Full Name</h3>
                  <p className="mt-1">{currentUser?.name}</p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Email Address</h3>
                  <p className="mt-1">{currentUser?.email}</p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Phone Number</h3>
                  <p className="mt-1">{currentUser?.phone || 'Not provided'}</p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Account ID</h3>
                  <p className="mt-1">{currentUser?.accountId}</p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Account Type</h3>
                  <p className="mt-1">{currentUser?.accountType}</p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Join Date</h3>
                  <p className="mt-1">{currentUser?.joinDate}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
      
      {/* Security Tab */}
      {activeTab === 'security' && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-6">Security Settings</h2>
          
          <div className="space-y-6">
            {/* Password Change */}
            <div className="border-b border-gray-200 dark:border-gray-700 pb-6">
              <h3 className="text-lg font-medium mb-2">Password</h3>
              <p className="text-gray-500 dark:text-gray-400 mb-4">
                Change your password to keep your account secure.
              </p>
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md">
                Change Password
              </button>
            </div>
            
            {/* Two-Factor Authentication */}
            <div className="border-b border-gray-200 dark:border-gray-700 pb-6">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-medium mb-2">Two-Factor Authentication</h3>
                  <p className="text-gray-500 dark:text-gray-400 mb-4">
                    Add an extra layer of security to your account by enabling two-factor authentication.
                  </p>
                </div>
                <div className="flex items-center">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    currentUser?.twoFactorEnabled 
                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                      : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                  }`}>
                    {currentUser?.twoFactorEnabled ? 'Enabled' : 'Disabled'}
                  </span>
                </div>
              </div>
              
              {!currentUser?.twoFactorEnabled && (
                <button 
                  onClick={handleEnableTwoFactor}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
                >
                  Enable 2FA
                </button>
              )}
            </div>
            
            {/* Login History */}
            <div>
              <h3 className="text-lg font-medium mb-2">Login History</h3>
              <p className="text-gray-500 dark:text-gray-400 mb-4">
                Review your recent login activity.
              </p>
              <div className="bg-gray-50 dark:bg-gray-700 rounded-md p-4">
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <div>
                      <p className="font-medium">Current Session</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Windows • Chrome • New York, USA
                      </p>
                    </div>
                    <span className="text-green-600 dark:text-green-400">Active</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <div>
                      <p className="font-medium">Yesterday, 15:42</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Windows • Firefox • New York, USA
                      </p>
                    </div>
                    <span className="text-gray-500 dark:text-gray-400">Expired</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Preferences Tab */}
      {activeTab === 'preferences' && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-6">Preferences</h2>
          <p className="text-gray-500 dark:text-gray-400">
            Configure your trading preferences and notification settings.
          </p>
        </div>
      )}
      
      {/* Documents Tab */}
      {activeTab === 'documents' && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-6">Documents</h2>
          <p className="text-gray-500 dark:text-gray-400">
            Upload and manage your verification documents.
          </p>
        </div>
      )}
      
      {/* Billing Tab */}
      {activeTab === 'billing' && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-6">Billing</h2>
          <p className="text-gray-500 dark:text-gray-400">
            Manage your payment methods and billing history.
          </p>
        </div>
      )}
    </div>
  );
};

export default AccountPage;