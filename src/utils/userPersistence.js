// User persistence utility to prevent data loss
export const userPersistenceManager = {
  // Save users with backup
  saveUsers: (users) => {
    try {
      const usersData = JSON.stringify(users);
      localStorage.setItem('users', usersData);
      localStorage.setItem('users_backup', usersData);
      localStorage.setItem('users_timestamp', Date.now().toString());
      console.log('Users saved successfully:', users.length);
    } catch (err) {
      console.error('Error saving users:', err);
    }
  },

  // Load users with fallback to backup
  loadUsers: () => {
    try {
      let users = [];
      
      // Try to load from primary storage
      const primaryData = localStorage.getItem('users');
      if (primaryData && primaryData !== 'undefined') {
        users = JSON.parse(primaryData);
      }
      
      // If primary is empty, try backup
      if (users.length === 0) {
        const backupData = localStorage.getItem('users_backup');
        if (backupData && backupData !== 'undefined') {
          users = JSON.parse(backupData);
          // Restore primary from backup
          localStorage.setItem('users', backupData);
          console.log('Restored users from backup:', users.length);
        }
      }
      
      return users;
    } catch (err) {
      console.error('Error loading users:', err);
      return [];
    }
  },

  // Get non-admin users
  getNonAdminUsers: () => {
    const users = userPersistenceManager.loadUsers();
    return users.filter(user => user.email !== 'admin@credox.com');
  },

  // Add user
  addUser: (newUser) => {
    const users = userPersistenceManager.loadUsers();
    users.push(newUser);
    userPersistenceManager.saveUsers(users);
    return users;
  },

  // Update user
  updateUser: (userId, updates) => {
    const users = userPersistenceManager.loadUsers();
    const updatedUsers = users.map(user => 
      user.id === userId ? { ...user, ...updates } : user
    );
    userPersistenceManager.saveUsers(updatedUsers);
    return updatedUsers;
  },

  // Periodic backup check
  startPeriodicBackup: () => {
    setInterval(() => {
      const users = userPersistenceManager.loadUsers();
      if (users.length > 0) {
        // Ensure backup is always up to date
        localStorage.setItem('users_backup', JSON.stringify(users));
      }
    }, 60000); // Every minute
  }
};

// Auto-start periodic backup
if (typeof window !== 'undefined') {
  userPersistenceManager.startPeriodicBackup();
}