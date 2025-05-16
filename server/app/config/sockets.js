// let io;
// const connectedUsers = {}; // userId => { socketId, role }

// const initSocket = (server) => {
//   const socketIO = require("socket.io");
//   io = socketIO(server, {
//     cors: {
//       origin: "*", // Restrict this in production
//       methods: ["GET", "POST", "PUT","DELETE"]
//     }
//   });

//   io.on("connection", (socket) => {
//     console.log("✅ New client connected:", socket.id);

//     // Enhanced registration with role
//     socket.on("register", ({ userId, role }) => {
//       connectedUsers[userId] = {
//         socketId: socket.id,
//         role
//       };
//       console.log(`📌 Registered user ${userId} (role: ${role}) with socket ID ${socket.id}`);
//     });

//     socket.on("disconnect", () => {
//       const userId = Object.keys(connectedUsers).find(
//         (key) => connectedUsers[key].socketId === socket.id
//       );
//       if (userId) {
//         delete connectedUsers[userId];
//         console.log(`❌ User ${userId} disconnected`);
//       }
//     });
//   });
// };

// const getIO = () => io;
// const getConnectedUsers = () => connectedUsers;

// module.exports = {
//   initSocket,
//   getIO,
//   getConnectedUsers
// };
// socket.js
let io;
const connectedUsers = {}; // { userId: { socketId, role } }

const initSocket = (server) => {
  const socketIO = require("socket.io");

  io = socketIO(server, {
    cors: {
      origin: "*", // Adjust for production
      methods: ["GET", "POST", "PUT", "DELETE"]
    }
  });

  io.on("connection", (socket) => {
    console.log("✅ Client connected:", socket.id);

    socket.on("register", ({ userId, role }) => {
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
