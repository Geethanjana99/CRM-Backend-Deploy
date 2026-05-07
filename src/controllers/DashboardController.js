const LeadService = require('../services/LeadService');

class DashboardController {
  // Get dashboard statistics
  async getDashboardStats(req, res, next) {
    try {
      const stats = await LeadService.getLeadStatistics();

      res.status(200).json({
        success: true,
        data: stats,
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new DashboardController();
