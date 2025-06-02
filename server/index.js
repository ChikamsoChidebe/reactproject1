import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Data storage paths
const DATA_DIR = path.join(__dirname, 'data');
const USERS_FILE = path.join(DATA_DIR, 'users.json');
const TRANSACTIONS_FILE = path.join(DATA_DIR, 'transactions.json');
const PENDING_TRANSACTIONS_FILE = path.join(DATA_DIR, 'pendingTransactions.json');
const PENDING_KYC_FILE = path.join(DATA_DIR, 'pendingKYC.json');

// Create data directory if it doesn't exist
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Initialize data files if they don't exist
const initDataFile = (filePath, defaultData = []) => {
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, JSON.stringify(defaultData), 'utf8');
  }
};

initDataFile(USERS_FILE, [
  {
    id: 'admin-user',
    name: 'Admin',
    email: 'admin@credox.com',
    password: 'admin123',
    accountId: 'CR-ADMIN',
    accountType: 'Admin',
    joinDate: new Date().toISOString().split('T')[0],
    isAdmin: true,
    cashBalance: 1000000
  }
]);
initDataFile(TRANSACTIONS_FILE);
initDataFile(PENDING_TRANSACTIONS_FILE);
initDataFile(PENDING_KYC_FILE);

// Helper functions
const readData = (filePath) => {
  try {
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error(`Error reading ${filePath}:`, error);
    return [];
  }
};

const writeData = (filePath, data) => {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data), 'utf8');
    return true;
  } catch (error) {
    console.error(`Error writing to ${filePath}:`, error);
    return false;
  }
};

// Routes

// Users
app.get('/api/users', (req, res) => {
  const users = readData(USERS_FILE);
  // Remove passwords before sending
  const safeUsers = users.map(({ password, ...user }) => user);
  res.json(safeUsers);
});

app.post('/api/users', (req, res) => {
  const users = readData(USERS_FILE);
  const newUser = req.body;
  
  // Check if email already exists
  if (users.some(user => user.email.toLowerCase() === newUser.email.toLowerCase())) {
    return res.status(400).json({ error: 'Email already in use' });
  }
  
  users.push(newUser);
  if (writeData(USERS_FILE, users)) {
    // Remove password before sending response
    const { password, ...safeUser } = newUser;
    res.status(201).json(safeUser);
  } else {
    res.status(500).json({ error: 'Failed to create user' });
  }
});

app.put('/api/users/:id', (req, res) => {
  const users = readData(USERS_FILE);
  const { id } = req.params;
  const updatedUser = req.body;
  
  const index = users.findIndex(user => user.id === id);
  if (index === -1) {
    return res.status(404).json({ error: 'User not found' });
  }
  
  users[index] = { ...users[index], ...updatedUser };
  if (writeData(USERS_FILE, users)) {
    // Remove password before sending response
    const { password, ...safeUser } = users[index];
    res.json(safeUser);
  } else {
    res.status(500).json({ error: 'Failed to update user' });
  }
});

// Authentication
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  const users = readData(USERS_FILE);
  
  const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
  if (!user) {
    return res.status(401).json({ error: 'Invalid email or password' });
  }
  
  if (user.password !== password) {
    return res.status(401).json({ error: 'Invalid email or password' });
  }
  
  // Remove password before sending response
  const { password: _, ...safeUser } = user;
  res.json(safeUser);
});

app.post('/api/auth/register', (req, res) => {
  const users = readData(USERS_FILE);
  const newUser = req.body;
  
  // Check if email already exists
  if (users.some(user => user.email.toLowerCase() === newUser.email.toLowerCase())) {
    return res.status(400).json({ error: 'Email already in use' });
  }
  
  users.push(newUser);
  if (writeData(USERS_FILE, users)) {
    // Remove password before sending response
    const { password, ...safeUser } = newUser;
    res.status(201).json(safeUser);
  } else {
    res.status(500).json({ error: 'Failed to register user' });
  }
});

// Transactions
app.get('/api/transactions', (req, res) => {
  const transactions = readData(TRANSACTIONS_FILE);
  res.json(transactions);
});

app.get('/api/transactions/user/:userId', (req, res) => {
  const { userId } = req.params;
  const transactions = readData(TRANSACTIONS_FILE);
  const userTransactions = transactions.filter(t => t.userId === userId);
  res.json(userTransactions);
});

app.post('/api/transactions', (req, res) => {
  const transactions = readData(TRANSACTIONS_FILE);
  const newTransaction = req.body;
  
  transactions.push(newTransaction);
  if (writeData(TRANSACTIONS_FILE, transactions)) {
    res.status(201).json(newTransaction);
  } else {
    res.status(500).json({ error: 'Failed to create transaction' });
  }
});

// Pending Transactions
app.get('/api/pending-transactions', (req, res) => {
  const pendingTransactions = readData(PENDING_TRANSACTIONS_FILE);
  res.json(pendingTransactions);
});

app.post('/api/pending-transactions', (req, res) => {
  const pendingTransactions = readData(PENDING_TRANSACTIONS_FILE);
  const newTransaction = req.body;
  
  pendingTransactions.push(newTransaction);
  if (writeData(PENDING_TRANSACTIONS_FILE, pendingTransactions)) {
    res.status(201).json(newTransaction);
  } else {
    res.status(500).json({ error: 'Failed to create pending transaction' });
  }
});

app.put('/api/pending-transactions/:id/approve', (req, res) => {
  const pendingTransactions = readData(PENDING_TRANSACTIONS_FILE);
  const transactions = readData(TRANSACTIONS_FILE);
  const users = readData(USERS_FILE);
  const { id } = req.params;
  
  const transactionIndex = pendingTransactions.findIndex(t => t.id === id);
  if (transactionIndex === -1) {
    return res.status(404).json({ error: 'Transaction not found' });
  }
  
  const transaction = pendingTransactions[transactionIndex];
  
  // Update user balance
  const userIndex = users.findIndex(u => u.id === transaction.userId);
  if (userIndex !== -1) {
    const user = users[userIndex];
    const currentBalance = parseFloat(user.cashBalance || 0);
    const newBalance = transaction.type === 'deposit' 
      ? (currentBalance + parseFloat(transaction.amount))
      : (currentBalance - parseFloat(transaction.amount));
    
    users[userIndex].cashBalance = newBalance >= 0 ? newBalance : 0;
    writeData(USERS_FILE, users);
  }
  
  // Add to completed transactions
  const completedTransaction = {
    ...transaction,
    status: 'completed',
    completedDate: new Date().toISOString()
  };
  transactions.push(completedTransaction);
  writeData(TRANSACTIONS_FILE, transactions);
  
  // Remove from pending transactions
  pendingTransactions.splice(transactionIndex, 1);
  writeData(PENDING_TRANSACTIONS_FILE, pendingTransactions);
  
  res.json(completedTransaction);
});

app.put('/api/pending-transactions/:id/reject', (req, res) => {
  const pendingTransactions = readData(PENDING_TRANSACTIONS_FILE);
  const transactions = readData(TRANSACTIONS_FILE);
  const { id } = req.params;
  
  const transactionIndex = pendingTransactions.findIndex(t => t.id === id);
  if (transactionIndex === -1) {
    return res.status(404).json({ error: 'Transaction not found' });
  }
  
  const transaction = pendingTransactions[transactionIndex];
  
  // Add to rejected transactions
  const rejectedTransaction = {
    ...transaction,
    status: 'rejected',
    completedDate: new Date().toISOString()
  };
  transactions.push(rejectedTransaction);
  writeData(TRANSACTIONS_FILE, transactions);
  
  // Remove from pending transactions
  pendingTransactions.splice(transactionIndex, 1);
  writeData(PENDING_TRANSACTIONS_FILE, pendingTransactions);
  
  res.json(rejectedTransaction);
});

// KYC
app.get('/api/pending-kyc', (req, res) => {
  const pendingKYC = readData(PENDING_KYC_FILE);
  res.json(pendingKYC);
});

app.post('/api/pending-kyc', (req, res) => {
  const pendingKYC = readData(PENDING_KYC_FILE);
  const newKYC = req.body;
  
  pendingKYC.push(newKYC);
  if (writeData(PENDING_KYC_FILE, pendingKYC)) {
    res.status(201).json(newKYC);
  } else {
    res.status(500).json({ error: 'Failed to create KYC request' });
  }
});

app.put('/api/pending-kyc/:id/approve', (req, res) => {
  const pendingKYC = readData(PENDING_KYC_FILE);
  const users = readData(USERS_FILE);
  const { id } = req.params;
  
  const kycIndex = pendingKYC.findIndex(k => k.id === id);
  if (kycIndex === -1) {
    return res.status(404).json({ error: 'KYC request not found' });
  }
  
  const kyc = pendingKYC[kycIndex];
  
  // Update user KYC status
  const userIndex = users.findIndex(u => u.id === kyc.userId);
  if (userIndex !== -1) {
    users[userIndex].kycVerified = true;
    users[userIndex].kycLevel = kyc.level;
    users[userIndex].kycApprovedDate = new Date().toISOString();
    writeData(USERS_FILE, users);
  }
  
  // Remove from pending KYC
  pendingKYC.splice(kycIndex, 1);
  writeData(PENDING_KYC_FILE, pendingKYC);
  
  res.json({ success: true, message: 'KYC approved' });
});

app.put('/api/pending-kyc/:id/reject', (req, res) => {
  const pendingKYC = readData(PENDING_KYC_FILE);
  const { id } = req.params;
  
  const kycIndex = pendingKYC.findIndex(k => k.id === id);
  if (kycIndex === -1) {
    return res.status(404).json({ error: 'KYC request not found' });
  }
  
  // Remove from pending KYC
  pendingKYC.splice(kycIndex, 1);
  writeData(PENDING_KYC_FILE, pendingKYC);
  
  res.json({ success: true, message: 'KYC rejected' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;