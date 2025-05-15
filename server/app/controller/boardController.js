const {
  createBoardService,
  updateBoardService,
  deleteBoardService,
  getAllBoardsService,
  getSingleBoardService,
  getSpecificUserBoardsService } = require('../services/boardServices');
const { getIO, getConnectedUsers } = require("../config/sockets");
const boardModel = require('../model/boardModel');

// const createBoard = async (req, res) => {
//   try {
//     const newBoard = await createBoardService(req);
//     res.status(201).json(newBoard);
//   } catch (error) {
//     res.status(400).json({ error: error.message });
//   }
// };
const createBoard = async (req, res) => {
  try {
    const newBoard = await createBoardService(req);

    const members = req.body.members || [];
    const io = getIO();
    const connectedUsers = getConnectedUsers();
    if (newBoard?.members) {
      members.forEach((userId) => {
        const socketId = connectedUsers[userId];
        if (socketId) {
          io.to(socketId).emit("newBoard", {
            message: "You were added to a new board",
            boardId: newBoard._id,
          });
        }
      });
    }


    res.status(201).json(newBoard);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
// const updateBoard = async (req, res) => {
//   try {

//     const updatedBoard = await updateBoardService(req);

//     res.status(200).json({ message: "Board updated successfully", board: updatedBoard });
//   } catch (error) {
//     console.log(error)
//     res.status(400).json({ error: error.message });
//   }
// };

// delete board 
const updateBoard = async (req, res) => {
  try {
    const boardId = req.params.id;

    const existingBoard = await boardModel.findById(boardId).lean();
    if (!existingBoard) throw new Error("Board not found");

    const oldMembers = existingBoard?.members?.map(id => id.toString()); // convert to string for comparison
    console.log("Old",oldMembers)
    const updatedBoard = await updateBoardService(req);
    const newMembers = updatedBoard?.members?.map(id => id.toString());

    const io = getIO();
    const connectedUsers = getConnectedUsers();

    // Identify added members (in new, but not in old)
    const addedMembers = newMembers?.filter(id => !oldMembers?.includes(id));
    console.log("Added",addedMembers)
    // Identify removed members (in old, but not in new)
    const removedMembers = oldMembers?.filter(id => !newMembers?.includes(id));

    // Emit to newly added members
    addedMembers?.forEach(userId => {
      const socketId = connectedUsers[userId];
      if (socketId) {
        io.to(socketId).emit("newBoard", {
          message: "You were added to a board",
          boardId: updatedBoard._id,
        });
      }
    });

    // Emit to removed members
    removedMembers?.forEach(userId => {
      const socketId = connectedUsers[userId];
      if (socketId) {
        io.to(socketId).emit("removedFromBoard", {
          message: "You were removed from a board",
          boardId: updatedBoard._id,
        });
      }
    });

    res.status(200).json({ message: "Board updated successfully", board: updatedBoard });
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }
};
const deleteBoard = async (req, res) => {
  try {
    const result = await deleteBoardService(req);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// get all board 


const getAllBoards = async (req, res) => {
  try {
    const boards = await getAllBoardsService(req);
    res.status(200).json(boards);
  } catch (error) {
    console.log("eRROR", error)
    res.status(500).json({ error: error.message });
  }
};

// get single board 
const getBoardById = async (req, res) => {
  try {
    const board = await getSingleBoardService(req.params.id);
    res.status(200).json(board);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};
const getSpecficUserBoard = async (req, res) => {
  try {
    const boards = await getSpecificUserBoardsService(req);
    res.status(200).json(boards);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};




module.exports = {
  createBoard,
  updateBoard,
  deleteBoard,
  getAllBoards,
  getBoardById,
  getSpecficUserBoard
};
