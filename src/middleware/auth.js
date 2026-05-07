const jwt = require('jsonwebtoken');
const config = require('../config/constants');
const User = require('../models/User');
const AppError = require('../utils/AppError');

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return next(new AppError(401, 'No token provided, authorization denied'));
    }

    const decoded = jwt.verify(token, config.JWT_SECRET);
    req.user = decoded;

    // Fetch user from database to ensure they still exist
    const user = await User.findById(decoded.id);
    if (!user) {
      return next(new AppError(401, 'User not found'));
    }

    if (!user.active) {
      return next(new AppError(401, 'User account is inactive'));
    }

    next();
  } catch (error) {
    next(new AppError(401, 'Token is not valid', { error: error.message }));
  }
};

module.exports = authMiddleware;
