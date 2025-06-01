import React from 'react';

const AdminDashboardCharts = ({ users = [], transactions = [] }) => {
  // Calculate user growth data
  const calculateUserGrowth = () => {
    const today = new Date();
    const monthsData = [];
    
    // Create data for the last 6 months
    for (let i = 5; i >= 0; i--) {
      const month = new Date(today.getFullYear(), today.getMonth() - i, 1);
      const monthName = month.toLocaleString('default', { month: 'short' });
      
      // Count users registered before or during this month
      const userCount = users.filter(user => {
        const joinDate = new Date(user.joinDate);
        return joinDate <= new Date(month.getFullYear(), month.getMonth() + 1, 0);
      }).length;
      
      monthsData.push({ month: monthName, users: userCount });
    }
    
    return monthsData;
  };
  
  // Calculate transaction data
  const calculateTransactionData = () => {
    const transactionTypes = ['deposit', 'withdrawal'];
    const today = new Date();
    const data = [];
    
    // Create data for the last 6 months
    for (let i = 5; i >= 0; i--) {
      const month = new Date(today.getFullYear(), today.getMonth() - i, 1);
      const monthName = month.toLocaleString('default', { month: 'short' });
      const monthStart = new Date(month.getFullYear(), month.getMonth(), 1);
      const monthEnd = new Date(month.getFullYear(), month.getMonth() + 1, 0);
      
      const monthData = { month: monthName };
      
      // Calculate totals for each transaction type
      transactionTypes.forEach(type => {
        const total = transactions
          .filter(t => {
            const transDate = new Date(t.date);
            return t.type === type && 
                   t.status === 'completed' && 
                   transDate >= monthStart && 
                   transDate <= monthEnd;
          })
          .reduce((sum, t) => sum + parseFloat(t.amount), 0);
        
        monthData[type] = total;
      });
      
      data.push(monthData);
    }
    
    return data;
  };
  
  const userGrowthData = calculateUserGrowth();
  const transactionData = calculateTransactionData();
  
  // Calculate max values for scaling
  const maxUsers = Math.max(...userGrowthData.map(d => d.users), 1);
  const maxTransactionValue = Math.max(
    ...transactionData.map(d => Math.max(d.deposit || 0, d.withdrawal || 0)),
    1
  );
  
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
      {/* User Growth Chart */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-medium mb-4">User Growth</h2>
        <div className="h-64">
          <div className="flex h-full items-end">
            {userGrowthData.map((data, index) => (
              <div key={index} className="flex-1 flex flex-col items-center">
                <div 
                  className="w-full max-w-[40px] bg-blue-500 rounded-t"
                  style={{ 
                    height: `${(data.users / maxUsers) * 100}%`,
                    minHeight: data.users > 0 ? '10px' : '0'
                  }}
                ></div>
                <div className="text-xs mt-2 text-gray-600">{data.month}</div>
                <div className="text-xs font-medium">{data.users}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Transaction Volume Chart */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-medium mb-4">Transaction Volume</h2>
        <div className="h-64">
          <div className="flex h-full items-end">
            {transactionData.map((data, index) => (
              <div key={index} className="flex-1 flex flex-col items-center">
                <div className="w-full flex justify-center space-x-1">
                  {/* Deposit bar */}
                  <div 
                    className="w-1/3 max-w-[20px] bg-green-500 rounded-t"
                    style={{ 
                      height: `${((data.deposit || 0) / maxTransactionValue) * 100}%`,
                      minHeight: (data.deposit || 0) > 0 ? '10px' : '0'
                    }}
                  ></div>
                  
                  {/* Withdrawal bar */}
                  <div 
                    className="w-1/3 max-w-[20px] bg-red-500 rounded-t"
                    style={{ 
                      height: `${((data.withdrawal || 0) / maxTransactionValue) * 100}%`,
                      minHeight: (data.withdrawal || 0) > 0 ? '10px' : '0'
                    }}
                  ></div>
                </div>
                <div className="text-xs mt-2 text-gray-600">{data.month}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="flex justify-center mt-4 space-x-6">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-green-500 rounded-full mr-1"></div>
            <span className="text-xs">Deposits</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-red-500 rounded-full mr-1"></div>
            <span className="text-xs">Withdrawals</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardCharts;