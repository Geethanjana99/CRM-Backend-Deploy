const NoteService = require('../services/NoteService');

class NoteController {
  // Add a note
  async addNote(req, res, next) {
    try {
      const { leadId } = req.params;
      const { content } = req.body;

      if (!content) {
        const AppError = require('../utils/AppError');
        return next(new AppError(400, 'Please provide note content'));
      }

      const note = await NoteService.addNote(leadId, content, req.user.id);

      res.status(201).json({
        success: true,
        message: 'Note added successfully',
        data: note,
      });
    } catch (error) {
      next(error);
    }
  }

  // Get notes for a lead
  async getNotesByLeadId(req, res, next) {
    try {
      const { leadId } = req.params;
      const { page = 1, limit = 10 } = req.query;

      const result = await NoteService.getNotesByLeadId(leadId, parseInt(page), parseInt(limit));

      res.status(200).json({
        success: true,
        data: result.notes,
        pagination: result.pagination,
      });
    } catch (error) {
      next(error);
    }
  }

  // Get note by ID
  async getNoteById(req, res, next) {
    try {
      const { noteId } = req.params;

      const note = await NoteService.getNoteById(noteId);

      res.status(200).json({
        success: true,
        data: note,
      });
    } catch (error) {
      next(error);
    }
  }

  // Update note
  async updateNote(req, res, next) {
    try {
      const { noteId } = req.params;
      const { content } = req.body;

      if (!content) {
        const AppError = require('../utils/AppError');
        return next(new AppError(400, 'Please provide note content'));
      }

      const note = await NoteService.updateNote(noteId, content);

      res.status(200).json({
        success: true,
        message: 'Note updated successfully',
        data: note,
      });
    } catch (error) {
      next(error);
    }
  }

  // Delete note
  async deleteNote(req, res, next) {
    try {
      const { noteId } = req.params;

      await NoteService.deleteNote(noteId);

      res.status(200).json({
        success: true,
        message: 'Note deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new NoteController();
