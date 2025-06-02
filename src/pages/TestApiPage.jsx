import React, { useState, useEffect } from 'react';

const TestApiPage = () => {
  const [apiData, setApiData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const testApi = async () => {
      try {
        setLoading(true);
        const response = await fetch('https://credoxbackend.onrender.com/api/users');
        const data = await response.json();
        console.log('API Response:', data);
        setApiData(data);
        setError(null);
      } catch (err) {
        console.error('API Error:', err);
        setError(err.toString());
      } finally {
        setLoading(false);
      }
    };

    testApi();
  }, []);

  const handleCreateTestUser = async () => {
    try {
      setLoading(true);
      const testUser = {
        id: `user-${Date.now()}`,
        name: 'Test User',
        email: `test${Date.now()}@example.com`,
        password: 'password123',
        accountId: `CR-${Math.floor(100000 + Math.random() * 900000)}`,
        accountType: 'Standard',
        joinDate: new Date().toISOString().split('T')[0],
        cashBalance: 0
      };

      const response = await fetch('https://credoxbackend.onrender.com/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(testUser)
      });

      const result = await response.json();
      console.log('User created:', result);
      
      // Refresh users list
      const usersResponse = await fetch('https://credoxbackend.onrender.com/api/users');
      const usersData = await usersResponse.json();
      setApiData(usersData);
      
    } catch (err) {
      console.error('Error creating user:', err);
      setError(err.toString());
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">API Test Page</h1>
      
      <div className="mb-6">
        <button 
          onClick={handleCreateTestUser}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
        >
          Create Test User
        </button>
      </div>
      
      {loading && <p>Loading...</p>}
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}
      
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">API Response</h2>
        <pre className="bg-gray-100 p-4 rounded overflow-auto max-h-96">
          {apiData ? JSON.stringify(apiData, null, 2) : 'No data'}
        </pre>
      </div>
    </div>
  );
};

export default TestApiPage;