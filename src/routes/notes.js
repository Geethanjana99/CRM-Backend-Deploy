const express = require('express');
const NoteController = require('../controllers/NoteController');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// All note routes require authentication
router.use(authMiddleware);

// Add a note to a lead
router.post('/:leadId/notes', (req, res, next) => NoteController.addNote(req, res, next));

// Get notes for a lead
router.get('/:leadId/notes', (req, res, next) => NoteController.getNotesByLeadId(req, res, next));

// Get a specific note
router.get('/:leadId/notes/:noteId', (req, res, next) => NoteController.getNoteById(req, res, next));

// Update a note
router.put('/:leadId/notes/:noteId', (req, res, next) => NoteController.updateNote(req, res, next));

// Delete a note
router.delete('/:leadId/notes/:noteId', (req, res, next) => NoteController.deleteNote(req, res, next));

module.exports = router;
