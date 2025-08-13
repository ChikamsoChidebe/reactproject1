// Enhanced user persistence utility to prevent data loss
export const userPersistenceManager = {
  // Multiple backup keys for redundancy
  STORAGE_KEYS: {
    PRIMARY: 'users',
    BACKUP_1: 'users_backup',
    BACKUP_2: 'users_backup_2',
    BACKUP_3: 'users_backup_3',
    TIMESTAMP: 'users_timestamp',
    COUNT: 'users_count'
  },

  // Save users with multiple backups
  saveUsers: (users) => {
    try {
      const usersData = JSON.stringify(users);
      const timestamp = Date.now().toString();
      
      // Save to all storage locations
      localStorage.setItem(userPersistenceManager.STORAGE_KEYS.PRIMARY, usersData);
      localStorage.setItem(userPersistenceManager.STORAGE_KEYS.BACKUP_1, usersData);
      localStorage.setItem(userPersistenceManager.STORAGE_KEYS.BACKUP_2, usersData);
      localStorage.setItem(userPersistenceManager.STORAGE_KEYS.BACKUP_3, usersData);
      localStorage.setItem(userPersistenceManager.STORAGE_KEYS.TIMESTAMP, timestamp);
      localStorage.setItem(userPersistenceManager.STORAGE_KEYS.COUNT, users.length.toString());
      
      console.log('Users saved successfully with backups:', users.length);
    } catch (err) {
      console.error('Error saving users:', err);
    }
  },

  // Load users with multiple fallback options
  loadUsers: () => {
    try {
      let users = [];
      const storageKeys = [
        userPersistenceManager.STORAGE_KEYS.PRIMARY,
        userPersistenceManager.STORAGE_KEYS.BACKUP_1,
        userPersistenceManager.STORAGE_KEYS.BACKUP_2,
        userPersistenceManager.STORAGE_KEYS.BACKUP_3
      ];
      
      // Try each storage location until we find valid data
      for (const key of storageKeys) {
        try {
          const data = localStorage.getItem(key);
          if (data && data !== 'undefined' && data !== 'null') {
            const parsedUsers = JSON.parse(data);
            if (Array.isArray(parsedUsers) && parsedUsers.length > 0) {
              users = parsedUsers;
              console.log(`Users loaded from ${key}:`, users.length);
              
              // If we loaded from backup, restore primary
              if (key !== userPersistenceManager.STORAGE_KEYS.PRIMARY) {
                localStorage.setItem(userPersistenceManager.STORAGE_KEYS.PRIMARY, data);
                console.log('Primary storage restored from backup');
              }
              break;
            }
          }
        } catch (parseErr) {
          console.error(`Error parsing ${key}:`, parseErr);
          continue;
        }
      }
      
      return users;
    } catch (err) {
      console.error('Error loading users:', err);
      return [];
    }
  },

  // Get non-admin users with safety check
  getNonAdminUsers: () => {
    const users = userPersistenceManager.loadUsers();
    return users.filter(user => user && user.email && user.email !== 'admin@credox.com');
  },

  // Add user with enhanced safety
  addUser: (newUser) => {
    const users = userPersistenceManager.loadUsers();
    
    // Check if user already exists
    const existingUser = users.find(u => u.email === newUser.email);
    if (existingUser) {
      console.log('User already exists, updating instead of adding');
      return userPersistenceManager.updateUser(existingUser.id, newUser);
    }
    
    users.push(newUser);
    userPersistenceManager.saveUsers(users);
    return users;
  },

  // Update user with safety checks
  updateUser: (userId, updates) => {
    const users = userPersistenceManager.loadUsers();
    const userIndex = users.findIndex(user => user.id === userId);
    
    if (userIndex === -1) {
      console.error('User not found for update:', userId);
      return users;
    }
    
    users[userIndex] = { ...users[userIndex], ...updates };
    userPersistenceManager.saveUsers(users);
    return users;
  },

  // Enhanced periodic backup with recovery
  startPeriodicBackup: () => {
    setInterval(() => {
      try {
        const users = userPersistenceManager.loadUsers();
        if (users.length > 0) {
          // Ensure all backups are up to date
          userPersistenceManager.saveUsers(users);
        }
      } catch (err) {
        console.error('Periodic backup failed:', err);
      }
    }, 30000); // Every 30 seconds
  }
};

// Auto-start enhanced periodic backup
if (typeof window !== 'undefined') {
  userPersistenceManager.startPeriodicBackup();
  
  // Add window event listener for backup on page unload
  window.addEventListener('beforeunload', () => {
    const users = userPersistenceManager.loadUsers();
    if (users.length > 0) {
      userPersistenceManager.saveUsers(users);
    }
  });
}