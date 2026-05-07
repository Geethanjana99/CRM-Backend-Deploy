require('dotenv').config();

const express = require('express');
const cors = require('cors');

const connectDB = require('./config/database');
const config = require('./config/constants');
const errorHandler = require('./middleware/errorHandler');
const { initializeTestData } = require('./utils/seedData');
const User = require('./models/User');

// Import routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const leadRoutes = require('./routes/leads');
const noteRoutes = require('./routes/notes');
const dashboardRoutes = require('./routes/dashboard');

const app = express();


// =============================
// CORS Configuration
// =============================
app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://crm-frontend-deploy.vercel.app'
  ],
  credentials: true
}));


// =============================
// Middleware
// =============================
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// =============================
// Connect Database
// =============================
connectDB();


// =============================
// Initialize Test Data
// =============================
initializeTestData(User);


// =============================
// Health Check Routes
// =============================
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'CRM Backend API is running',
    health: '/api/health'
  });
});

app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'CRM Backend is running',
    timestamp: new Date().toISOString()
  });
});

app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'CRM Backend is running',
    timestamp: new Date().toISOString()
  });
});


// =============================
// API Routes
// =============================
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/leads', leadRoutes);

// Better route separation
app.use('/api/notes', noteRoutes);

app.use('/api/dashboard', dashboardRoutes);


// =============================
// 404 Route Handler
// =============================
app.use((req, res) => {
  console.log(`404 Route: ${req.method} ${req.originalUrl}`);

  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});


// =============================
// Global Error Handler
// =============================
app.use(errorHandler);


// =============================
// Start Server
// =============================
const PORT = process.env.PORT || config.PORT;

const server = app.listen(PORT, () => {
  console.log(`\n🚀 CRM Backend Server is running on port ${PORT}`);
  console.log(`Environment: ${config.NODE_ENV}`);
  console.log(`MongoDB: Connected`);
  console.log(`Frontend Allowed: https://crm-frontend-deploy.vercel.app`);
  console.log(`\n📝 Test User: admin@example.com / password123\n`);
});


// =============================
// Handle Unhandled Rejections
// =============================
process.on('unhandledRejection', (err) => {
  console.error(`Error: ${err.message}`);

  server.close(() => {
    process.exit(1);
  });
});