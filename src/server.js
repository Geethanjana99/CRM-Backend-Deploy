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

// Middleware
app.use(cors({ origin: config.CORS_ORIGIN }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to database
connectDB();

// Initialize test data
initializeTestData(User);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'CRM Backend is running',
    timestamp: new Date().toISOString(),
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/leads', leadRoutes);
app.use('/api/leads', noteRoutes);
app.use('/api/dashboard', dashboardRoutes);

// 404 handler
app.use((req, res, next) => {
  const AppError = require('./utils/AppError');
  next(new AppError(404, 'Route not found'));
});

// Global error handler
app.use(errorHandler);

// Start server
const PORT = config.PORT;
const server = app.listen(PORT, () => {
  console.log(`\n🚀 CRM Backend Server is running on port ${PORT}`);
  console.log(`Environment: ${config.NODE_ENV}`);
  console.log(`MongoDB: Connected`);
  console.log(`\n📝 Test User: admin@example.com / password123\n`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error(`Error: ${err.message}`);
  server.close(() => process.exit(1));
});
