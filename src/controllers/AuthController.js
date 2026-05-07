const AuthService = require('../services/AuthService');

class AuthController {
  // Register user
  async register(req, res, next) {
    try {
      const { name, email, password, role } = req.body;

      // Validation
      if (!name || !email || !password) {
        const AppError = require('../utils/AppError');
        return next(new AppError(400, 'Please provide name, email, and password'));
      }

      const result = await AuthService.registerUser({
        name,
        email,
        password,
        role,
      });

      res.status(201).json({
        success: true,
        message: 'User registered successfully',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  // Login user
  async login(req, res, next) {
    try {
      const { email, password } = req.body;

      // Validation
      if (!email || !password) {
        const AppError = require('../utils/AppError');
        return next(new AppError(400, 'Please provide email and password'));
      }

      const result = await AuthService.loginUser(email, password);

      res.status(200).json({
        success: true,
        message: 'User logged in successfully',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  // Get current user
  async getCurrentUser(req, res, next) {
    try {
      const user = await AuthService.getCurrentUser(req.user.id);

      res.status(200).json({
        success: true,
        data: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          active: user.active,
        },
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new AuthController();
