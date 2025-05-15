// socket.js
let io;
const connectedUsers = {};

const initSocket = (server) => {
  const socketIO = require("socket.io");
  io = socketIO(server, {
    cors: {
      origin: "*", // You can restrict this in production
      methods: ["GET", "POST", "PUT"]
    }
  });

  io.on("connection", (socket) => {
    console.log("New client connected");

    socket.on("register", (userId) => {
      connectedUsers[userId] = socket.id;
      console.log(`User ${userId} registered with socket ID ${socket.id}`);
    });

    socket.on("disconnect", () => {
      const userId = Object.keys(connectedUsers).find(
        (key) => connectedUsers[key] === socket.id
      );
      delete connectedUsers[userId];
      console.log(`User ${userId} disconnected`);
    });
  });
};

const getIO = () => io;
const getConnectedUsers = () => connectedUsers;

module.exports = { initSocket, getIO, getConnectedUsers };
