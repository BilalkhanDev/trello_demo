const {
  createBoardService,
  updateBoardService,
  deleteBoardService,
  getAllBoardsService,
  getSingleBoardService,
  getSpecificUserBoardsService } = require('../services/boardServices');
const { getIO, getConnectedUsers } = require("../config/sockets");
const boardModel = require('../model/boardModel');
const createBoard = async (req, res) => {
  try {
    const newBoard = await createBoardService(req);

    const members = req.body.members || [];
    const io = getIO();
    const connectedUsers = getConnectedUsers();

    if (newBoard?.members) {
      members.forEach((userId) => {
        const userSocket = connectedUsers[userId];
        if (userSocket && userSocket.socketId) {
          io.to(userSocket.socketId).emit("newBoard", {
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

const updateBoard = async (req, res) => {
  try {
    const boardId = req.params.id;

    const existingBoard = await boardModel.findById(boardId).lean();
    if (!existingBoard) throw new Error("Board not found");

    const oldMembers = existingBoard?.members?.map(id => id.toString());
    const updatedBoard = await updateBoardService(req);
    const newMembers = updatedBoard?.members?.map(id => id.toString());

    const io = getIO();
    const connectedUsers = getConnectedUsers();

    // Identify added members
    const addedMembers = newMembers?.filter(id => !oldMembers?.includes(id));
    // Identify removed members
    const removedMembers = oldMembers?.filter(id => !newMembers?.includes(id));

    // Emit to newly added members
    addedMembers?.forEach(userId => {
      const userSocket = connectedUsers[userId];
      if (userSocket && userSocket.socketId) {
        io.to(userSocket.socketId).emit("newBoard", {
          message: "You were added to a board",
          boardId: updatedBoard._id,
        });
      }
    });

    // Emit to removed members
    removedMembers?.forEach(userId => {
      const userSocket = connectedUsers[userId];
      if (userSocket && userSocket.socketId) {
        io.to(userSocket.socketId).emit("removedFromBoard", {
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

 // Make sure this is the correct path
const deleteBoard = async (req, res) => {
  try {
    const boardId = req.params.id;
    const board = await boardModel.findOne({ _id: boardId });

    if (!board) {
      return res.status(404).json({ error: "Board not found" });
    }

    const members = board.members || [];
    const io = getIO();
    const connectedUsers = getConnectedUsers();

    // ✅ Emit to all connected members
    members.forEach((memberId) => {
      const memberStr = memberId.toString(); // convert ObjectId to string
      const socketInfo = connectedUsers[memberStr];

      if (socketInfo?.socketId) {
        console.log(`📤 Emitting boardDeleted to ${memberStr}`);
        io.to(socketInfo.socketId).emit("boardDeleted", {
          boardId,
          message: "A board you were assigned to has been deleted.",
        });
      } else {
        console.log(`❌ Member ${memberStr} is not connected`);
      }
    });

    const result = await deleteBoardService(req);
    res.status(200).json(result);
  } catch (error) {
    console.error("Delete board error:", error);
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
