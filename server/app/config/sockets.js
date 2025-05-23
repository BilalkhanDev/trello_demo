
let io;
const connectedUsers = {}; // { userId: { socketId, role } }

const initSocket = (server) => {
  const socketIO = require("socket.io");


  io = socketIO(server, {
  cors: {
    origin: "*", // Adjust for production
    // origin: "http://localhost:4200", // 👈 Angular's dev server
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
  },
  transports: ['polling', 'websocket'] // 👈 Explicit transport fallback
});

  io.on("connection", (socket) => {
    console.log("✅ Client connected:", socket.id);

    socket.on("register", ({ userId, role }) => {
      console.log("userId",userId)
      if (userId) {
        connectedUsers[userId.toString()] = {
          socketId: socket.id,
          role,
        };
        console.log(`📌 Registered user ${userId} with socket ${socket.id}`);
      }
    });

    socket.on("disconnect", () => {
      const userId = Object.keys(connectedUsers).find(
        (id) => connectedUsers[id].socketId === socket.id
      );
      if (userId) {
        delete connectedUsers[userId];
        console.log(`❌ User ${userId} disconnected`);
      }
    });
  });
};

const getIO = () => io;
const getConnectedUsers = () => connectedUsers;

module.exports = {
  initSocket,
  getIO,
  getConnectedUsers,
};
