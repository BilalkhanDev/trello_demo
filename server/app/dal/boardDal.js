const Board = require('../model/boardModel');
const Ticket =require("../model/ticketModel")
const mongoose=require("mongoose");
const User = require('../model/userModel');
const createBoardDAL = async (data) => {
  const newBoard = new Board(data);
  return await newBoard.save();
};
const updateBoardDAL = async (boardId, updateData) => {
  return await Board.findByIdAndUpdate(boardId, updateData, { new: true });
};
// delete bpard 


const deleteBoardWithTicketsDAL = async (boardId, session) => {
  const board = await Board.findById(boardId).session(session);
  if (!board) throw new Error("Board not found");

  // Delete related tickets
  await Ticket.deleteMany({ _id: { $in: board.tickets } }).session(session);

  // Delete the board
  await Board.findByIdAndDelete(boardId).session(session);
};

// get all board 

const getAllBoardsDAL = async (page, limit) => {
  const skip = (page - 1) * limit;
  // Use new mongoose.Types.ObjectId for proper ObjectId creation
//   const filter = role === 1 ? {} : { members:userId };

  const boards = await Board.find()
    .populate('createdBy', 'username email')
    .populate('members', '_id username email')
    .populate({
      path: 'tickets',
      options: { sort: { order: 1 } },
      populate: [
        { path: 'assignedTo', select: 'username email' },
        { path: 'comments.commentedBy', select: 'username email' }
      ]
    })
    .skip(skip)
    .limit(limit)
    .sort({ createdAt: -1 });

  const total = await Board.countDocuments();

  console.log('Boards:', boards);

  return {
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
    boards,
  };
};

const getSpecificUserBoardDAL = async (page, limit, userId) => {
  const skip = (page - 1) * limit;
  const filter = {
    members: userId,
  };

  const boards = await Board.find(filter)
    .populate('createdBy', 'username email')
    .populate({
      path: 'tickets',
      match: { assignedTo: userId}, 
      options: { sort: { order: 1 } },
      populate: [
        { path: 'comments.commentedBy', select: 'username email' },
      ],
      
    })
    .skip(skip)
    .limit(limit)
    .sort({ createdAt: -1 });

  const total = await Board.countDocuments(filter);


  return {
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
    boards,
  };
};


const getUsersByBoardIdDAL = async (boardId) => {
  const board = await Board.findById(boardId).lean();

  if (!board) {
    throw new Error('Board not found');
  }

  if (!board.members || board.members.length === 0) {
    return []; // or return false if you prefer
  }

  const memberIds = board?.members?.map(m => new mongoose.Types.ObjectId(m));

  const users = await User.find({
    _id: { $in: memberIds },
    role: 2,
  }).select('_id username email');

  return users;
}


const getSingleBoardDAL = async (id) => {
  const board = await Board.findById(id)
    .populate('createdBy', 'name email')
    .populate('members', 'name email');

  if (!board) throw new Error('Board not found');

  const tickets = await Ticket.find({ _id: { $in: board.tickets } })
    .populate('assignedTo', 'name email')
    .populate('comments.commentedBy', 'name email');

  return {
    ...board.toObject(),
    tickets,
  };
};
module.exports = {
  createBoardDAL,
  updateBoardDAL,
  deleteBoardWithTicketsDAL,
  getAllBoardsDAL,
  getSingleBoardDAL,
  getSpecificUserBoardDAL,
  getUsersByBoardIdDAL
};
