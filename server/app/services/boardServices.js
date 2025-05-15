const { 
    createBoardDAL,
    updateBoardDAL,
    deleteBoardWithTicketsDAL, 
    getSingleBoardDAL,
    getAllBoardsDAL, 
    getSpecificUserBoardDAL} = require('../dal/boardDal');
const Board = require('../model/boardModel');
const Ticket = require('../model/ticketModel');
const User =require('../model/userModel')
const createBoardService = async (req) => {
     const userId = req.user?._id; 
     const boardData = req.body;
     return await createBoardDAL({ ...boardData, createdBy: userId });
};
// uopdate board 
const updateBoardService = async (req) => {
  const boardId = req.params.id;
  const data = req.body;

  const existingBoard = await Board.findById(boardId);
  if (!existingBoard) throw new Error("Board not found");


  let validMemberIds = existingBoard.members;
  if (data.hasOwnProperty('members')) {
    if (Array.isArray(data.members) && data.members.length > 0) {
        console.log("exist", data.members)
      const existingUsers = await User.find({ _id: { $in: data.members } }).select('_id');
      console.log("exist", existingUsers)
      validMemberIds = existingUsers.map(user => user._id);
    } else {
      // If explicitly empty array, replace with empty array
      validMemberIds = null;
    }
  }

  // ✅ Validate and filter valid ticket IDs
  let validTicketIds = existingBoard.tickets;
  if (data.hasOwnProperty('tickets')) {
    if (Array.isArray(data.tickets) && data.tickets.length > 0) {
      const existingTickets = await Ticket.find({ _id: { $in: data.tickets } }).select('_id');
      validTicketIds = existingTickets.map(ticket => ticket._id);
    } else {
      // If explicitly empty array, replace with empty array
      validTicketIds = null;
    }
  }

  // 🔧 Construct update payload
  const updatePayload = {
    title: data.title ?? existingBoard.title,
    description: data.description ?? existingBoard.description,
    members: validMemberIds,
    tickets: validTicketIds
  };

  
  const updatedBoard = await updateBoardDAL(boardId, updatePayload);
  if (Array.isArray(data.ticketComments)) {
    for (const { ticketId, commentText, commentedBy } of data.ticketComments) {
      if (!ticketId || !commentText || !commentedBy) continue;

      const ticketExists = await Ticket.findById(ticketId);
      if (!ticketExists) continue;

      await Ticket.findByIdAndUpdate(ticketId, {
        $push: {
          comments: {
            text: commentText,
            commentedBy
          }
        }
      });
    }
  }

  return updatedBoard;
};

// delete the board 


const deleteBoardService = async (req) => {
  const boardId = req.params.id;

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    await deleteBoardWithTicketsDAL(boardId, session);
    await session.commitTransaction();
    session.endSession();
    return { message: 'Board and related tickets deleted successfully' };
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw new Error(error.message || 'Transaction failed');
  }
};

// get all boards 



const getAllBoardsService = async (req) => {
  const { page = 1, limit = 10 } = req.query;
  return await getAllBoardsDAL(page, limit, req?.user?.id, req?.user?.role);
};
const getSpecificUserBoardsService = async (req) => {
  const { page = 1, limit = 10 } = req.query;
  return await getSpecificUserBoardDAL(page, limit, req?.user?.id);
};
// get single board 

const getSingleBoardService = async (id) => {
  return await getSingleBoardDAL(id);
};

module.exports = {
  createBoardService,
  updateBoardService,
  deleteBoardService,
  getAllBoardsService,
  getSingleBoardService,
  getSpecificUserBoardsService
};
