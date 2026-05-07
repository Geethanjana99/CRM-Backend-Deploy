const User = require('../models/User');

class UserController {
  async getAllUsers(req, res, next) {
    try {
      const includeInactive = req.query.all === 'true' || req.query.includeInactive === 'true';
      const filter = includeInactive ? {} : { active: true };

      const users = await User.find(filter)
        .select('_id name email role active createdAt updatedAt')
        .sort({ name: 1 });

      res.status(200).json({
        success: true,
        data: users,
      });
    } catch (error) {
      next(error);
    }
  }

  async updateUser(req, res, next) {
    try {
      const { id } = req.params;
      const { role, active } = req.body;

      const allowedRoles = ['admin', 'salesperson', 'manager'];
      const updateData = {};

      if (role !== undefined) {
        if (!allowedRoles.includes(role)) {
          const AppError = require('../utils/AppError');
          return next(new AppError(400, 'Please provide a valid role'));
        }

        updateData.role = role;
      }

      if (active !== undefined) {
        updateData.active = Boolean(active);
      }

      if (Object.keys(updateData).length === 0) {
        const AppError = require('../utils/AppError');
        return next(new AppError(400, 'Please provide a role or active status to update'));
      }

      const user = await User.findByIdAndUpdate(id, updateData, {
        new: true,
        runValidators: true,
      }).select('_id name email role active createdAt updatedAt');

      if (!user) {
        const AppError = require('../utils/AppError');
        return next(new AppError(404, 'User not found'));
      }

      res.status(200).json({
        success: true,
        message: 'User updated successfully',
        data: user,
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new UserController();