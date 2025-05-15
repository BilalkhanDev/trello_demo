const { getBoardById } = require('../controller/boardController');
const {
  createTicketDAL,
  updateTicketDAL,
  deleteTicketDAL,
  getTicketByIdDAL,
  getBoardTicketsSortedDAL
} = require('../dal/ticketDal');
const ticketModel = require('../model/ticketModel');
const { getSingleBoardService } = require('./boardServices');


exports.createTicketService = async (req) => {
  const {boardId}=req.params
  const data=req.body


  const board = await getSingleBoardService(boardId);
  if (!board) {
    throw new Error('Board not found');
  }

  const ticketData = {
    ...data,
    board: boardId
  };
 
  const newTicket = await createTicketDAL(ticketData);

  return newTicket;
};

exports.updateTicketService = async (req) => {
  const id = req.params.id || null;
  const update = req.body;
  const updatedTicket = await updateTicketDAL(id, update);

  return {
     updatedTicket,
  };
};

exports.deleteTicketService = async (req) => {
  const id = req.params.id;
  return await deleteTicketDAL(id);
};

exports.getSingleTicketService = async (req) => {
  const id = req.params.id;
  return await getTicketByIdDAL(id);
};

exports.getSortedTicketsService = async (req) => {
  const boardId = req.params.boardId;
  const {role,id}=req.user
  return await getBoardTicketsSortedDAL(boardId,role,id);
};
