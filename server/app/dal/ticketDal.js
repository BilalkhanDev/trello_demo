const Ticket = require('../model/ticketModel');
const mongoose = require('mongoose');
exports.createTicketDAL = async (data) => {
  const createdTicket = await Ticket.create(data);
  const populatedTicket = await Ticket.findById(createdTicket._id)
    .populate('assignedTo')
    .populate('comments.commentedBy');

  return populatedTicket;
};

exports.updateTicketDAL = async (id, update) => {
  if (id || update._id) {
    // Single ticket update (either via URL param or in body)
    const ticketId = id || update._id;
    const data = { ...update };
    delete data._id; // prevent _id overwrite error
    return await Ticket.findByIdAndUpdate(ticketId, data, { new: true });
  }

  if (Array.isArray(update)) {
    // Bulk update expects raw array of ticket objects
    const bulkOps = update.map(ticket => ({
      updateOne: {
        filter: { _id: ticket._id },
        update: { $set: { order: ticket.order } },
      },
    }));

    return await Ticket.bulkWrite(bulkOps);
  }

  throw new Error('Invalid update payload: must provide id or array of tickets');
};



exports.deleteTicketDAL = async (id) => {
  return await Ticket.findByIdAndDelete(id);
};

exports.getTicketByIdDAL = async (id) => {
  return await Ticket.findById(id).populate('assignedTo').populate('comments.commentedBy');
};

exports.getBoardTicketsSortedDAL = async (boardId, role, userId) => {
  const filter = {
    board: new mongoose.Types.ObjectId(boardId),
  };
  if (role !== 1) {
    filter.assignedTo = new mongoose.Types.ObjectId(userId);
  }

  const tickets = await Ticket.find(filter)
    .sort({ order: 1 })
    .populate('assignedTo', 'username email')
    .populate('comments.commentedBy', 'username email');

  return tickets;
};