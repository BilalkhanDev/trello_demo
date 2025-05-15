const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  status: {
    type: Number,
    enum: [0, 1, 2], // 0: Todo, 1: In Progress, 2: Done
    default: 0
  },
  board: { type: mongoose.Schema.Types.ObjectId, ref: 'Board' },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  dueDate: Date,
  priority: {
    type: Number,
    enum: [0, 1, 2], // 0: Low, 1: Medium, 2: High
    default: 0
  },
  comments: [{
    text: String,
    commentedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    commentedAt: { type: Date, default: Date.now }
  }],
  order: { type: Number, default: 0 } 
}, { timestamps: true });

module.exports = mongoose.model('Ticket', ticketSchema);
