const express = require('express');
const LeadController = require('../controllers/LeadController');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// All lead routes require authentication
router.use(authMiddleware);

// Create a new lead
router.post('/', (req, res, next) => LeadController.createLead(req, res, next));

// Get all leads with filtering
router.get('/', (req, res, next) => LeadController.getAllLeads(req, res, next));

// Get lead by ID
router.get('/:id', (req, res, next) => LeadController.getLeadById(req, res, next));

// Get lead activity timeline
router.get('/:id/activity', (req, res, next) => LeadController.getActivity(req, res, next));

// Update lead
router.put('/:id', (req, res, next) => LeadController.updateLead(req, res, next));

// Update lead status
router.patch('/:id/status', (req, res, next) => LeadController.updateLeadStatus(req, res, next));

// Delete lead
router.delete('/:id', (req, res, next) => LeadController.deleteLead(req, res, next));

module.exports = router;
