// User monitoring service to prevent data loss
class UserMonitoringService {
  constructor() {
    this.isMonitoring = false;
    this.lastKnownUserCount = 0;
    this.monitoringInterval = null;
    this.recoveryAttempts = 0;
    this.maxRecoveryAttempts = 5;
  }

  startMonitoring() {
    if (this.isMonitoring) return;
    
    this.isMonitoring = true;
    console.log('User monitoring service started');
    
    // Initial count
    this.updateUserCount();
    
    // Monitor every 10 seconds
    this.monitoringInterval = setInterval(() => {
      this.checkUserIntegrity();
    }, 10000);
    
    // Listen for storage events
    window.addEventListener('storage', this.handleStorageChange.bind(this));
    
    // Listen for beforeunload to save state
    window.addEventListener('beforeunload', this.handleBeforeUnload.bind(this));
  }

  stopMonitoring() {
    if (!this.isMonitoring) return;
    
    this.isMonitoring = false;
    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval);
      this.monitoringInterval = null;
    }
    
    window.removeEventListener('storage', this.handleStorageChange.bind(this));
    window.removeEventListener('beforeunload', this.handleBeforeUnload.bind(this));
    
    console.log('User monitoring service stopped');
  }

  updateUserCount() {
    try {
      const users = this.getAllUsers();
      this.lastKnownUserCount = users.length;
      localStorage.setItem('last_known_user_count', this.lastKnownUserCount.toString());
    } catch (err) {
      console.error('Error updating user count:', err);
    }
  }

  getAllUsers() {
    const backupKeys = ['users', 'users_backup', 'users_backup_2', 'users_backup_3'];
    let bestUsers = [];
    
    for (const key of backupKeys) {
      try {
        const data = localStorage.getItem(key);
        if (data && data !== 'undefined' && data !== 'null') {
          const users = JSON.parse(data);
          if (Array.isArray(users) && users.length > bestUsers.length) {
            bestUsers = users;
          }
        }
      } catch (err) {
        continue;
      }
    }
    
    return bestUsers;
  }

  checkUserIntegrity() {
    try {
      const currentUsers = this.getAllUsers();
      const currentCount = currentUsers.length;
      
      // Check if user count has dropped significantly
      if (this.lastKnownUserCount > 0 && currentCount < this.lastKnownUserCount) {
        console.warn(`User count dropped from ${this.lastKnownUserCount} to ${currentCount}`);
        this.attemptRecovery();
      } else if (currentCount > this.lastKnownUserCount) {
        // Update if we have more users
        this.lastKnownUserCount = currentCount;
        localStorage.setItem('last_known_user_count', currentCount.toString());
        
        // Ensure all backups are updated
        this.createBackups(currentUsers);
      }
    } catch (err) {
      console.error('Error checking user integrity:', err);
    }
  }

  attemptRecovery() {
    if (this.recoveryAttempts >= this.maxRecoveryAttempts) {
      console.error('Max recovery attempts reached');
      return;
    }
    
    this.recoveryAttempts++;
    console.log(`Attempting user recovery (attempt ${this.recoveryAttempts})`);
    
    try {
      // Try to find the best backup
      const backupKeys = ['users_backup', 'users_backup_2', 'users_backup_3'];
      let bestBackup = [];
      let bestKey = '';
      
      for (const key of backupKeys) {
        try {
          const data = localStorage.getItem(key);
          if (data && data !== 'undefined') {
            const users = JSON.parse(data);
            if (Array.isArray(users) && users.length > bestBackup.length) {
              bestBackup = users;
              bestKey = key;
            }
          }
        } catch (err) {
          continue;
        }
      }
      
      if (bestBackup.length > 0) {
        console.log(`Recovering ${bestBackup.length} users from ${bestKey}`);
        
        // Restore to primary location
        localStorage.setItem('users', JSON.stringify(bestBackup));
        this.createBackups(bestBackup);
        
        // Update count
        this.lastKnownUserCount = bestBackup.length;
        localStorage.setItem('last_known_user_count', bestBackup.length.toString());
        
        // Notify components
        window.dispatchEvent(new CustomEvent('usersRecovered', { 
          detail: { count: bestBackup.length } 
        }));
        
        console.log('User recovery successful');
        this.recoveryAttempts = 0; // Reset on success
      } else {
        console.error('No valid backup found for recovery');
      }
    } catch (err) {
      console.error('Recovery attempt failed:', err);
    }
  }

  createBackups(users) {
    try {
      const userData = JSON.stringify(users);
      const backupKeys = ['users_backup', 'users_backup_2', 'users_backup_3'];
      
      for (const key of backupKeys) {
        localStorage.setItem(key, userData);
      }
      
      localStorage.setItem('users_timestamp', Date.now().toString());
    } catch (err) {
      console.error('Error creating backups:', err);
    }
  }

  handleStorageChange(event) {
    if (event.key && event.key.includes('user')) {
      console.log('Storage change detected for user data');
      setTimeout(() => this.checkUserIntegrity(), 1000);
    }
  }

  handleBeforeUnload() {
    try {
      const users = this.getAllUsers();
      if (users.length > 0) {
        this.createBackups(users);
        console.log('Emergency backup created before page unload');
      }
    } catch (err) {
      console.error('Error creating emergency backup:', err);
    }
  }

  // Manual recovery function
  forceRecovery() {
    console.log('Force recovery initiated');
    this.recoveryAttempts = 0; // Reset attempts
    this.attemptRecovery();
  }

  // Get monitoring status
  getStatus() {
    return {
      isMonitoring: this.isMonitoring,
      lastKnownUserCount: this.lastKnownUserCount,
      recoveryAttempts: this.recoveryAttempts,
      currentUserCount: this.getAllUsers().length
    };
  }
}

// Create singleton instance
export const userMonitor = new UserMonitoringService();

// Auto-start monitoring
if (typeof window !== 'undefined') {
  // Start monitoring after a short delay to ensure localStorage is ready
  setTimeout(() => {
    userMonitor.startMonitoring();
  }, 1000);
}