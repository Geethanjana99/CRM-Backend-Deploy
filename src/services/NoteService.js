const Note = require('../models/Note');

class NoteService {
  // Add a note to a lead
  async addNote(leadId, content, userId) {
    const note = new Note({
      lead: leadId,
      content,
      createdBy: userId,
    });

    await note.save();
    await note.populate('createdBy', 'name email');

    return note;
  }

  // Get notes for a lead
  async getNotesByLeadId(leadId, page = 1, limit = 10) {
    const skip = (page - 1) * limit;

    const total = await Note.countDocuments({ lead: leadId });

    const notes = await Note.find({ lead: leadId })
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    return {
      notes,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    };
  }

  // Get a single note by ID
  async getNoteById(noteId) {
    const note = await Note.findById(noteId).populate('createdBy', 'name email');

    if (!note) {
      throw new Error('Note not found');
    }

    return note;
  }

  // Update a note
  async updateNote(noteId, content) {
    const note = await Note.findByIdAndUpdate(
      noteId,
      { content },
      {
        new: true,
        runValidators: true,
      }
    ).populate('createdBy', 'name email');

    if (!note) {
      throw new Error('Note not found');
    }

    return note;
  }

  // Delete a note
  async deleteNote(noteId) {
    const note = await Note.findByIdAndDelete(noteId);

    if (!note) {
      throw new Error('Note not found');
    }

    return note;
  }
}

module.exports = new NoteService();
