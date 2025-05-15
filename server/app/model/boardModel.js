const mongoose = require('mongoose');

const boardSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
}, { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } });


boardSchema.virtual('tickets', {
  ref: 'Ticket',
  localField: '_id',
  foreignField: 'board',
  justOne: false,
});

module.exports = mongoose.model('Board', boardSchema);
