const express = require('express');
const DashboardController = require('../controllers/DashboardController');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// All dashboard routes require authentication
router.use(authMiddleware);

// Get dashboard statistics
router.get('/stats', (req, res, next) => DashboardController.getDashboardStats(req, res, next));

module.exports = router;
