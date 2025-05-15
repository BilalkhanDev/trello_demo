const {
  createTicketService,
  updateTicketService,
  deleteTicketService,
  getSingleTicketService,
  getSortedTicketsService
} = require('../services/ticketServices');
const { getIO, getConnectedUsers } = require('../config/sockets');
exports.createTicket = async (req, res) => {
  try {
    const ticket = await createTicketService(req);

    const io = getIO();
    const connectedUsers = getConnectedUsers();

    if (ticket?.assignedTo) {
      const assignedToId = ticket.assignedTo?._id; // ensure it's a string

      const socketId = connectedUsers[assignedToId];
      if (socketId) {
        io.to(socketId).emit("ticketAssigned", {
          message: "A new ticket has been assigned to you",
          ticket,
        });
      }
    }

    res.status(201).json(ticket);
  } catch (err) {
    console.log("Error creating ticket:", err);
    res.status(400).json({ error: err.message });
  }
};


exports.updateTicket = async (req, res) => {
  try {
    const updated = await updateTicketService(req);
    res.status(200).json(updated);
  } catch (err) {
    console.log("Error",err)
    res.status(400).json({ error: err.message });
  }
};

// exports.updateTicket = async (req, res) => {
//   try {
//     const { ticket, oldMembers } = await updateTicketService(req);
//     const newMembers = req.body.members;

//     const io = getIO();
//     const connectedUsers = getConnectedUsers();

//     if (Array.isArray(newMembers)) {
//       // Compare sets
//       const removedMembers = oldMembers.filter(id => !newMembers.includes(id));
//       const addedMembers = newMembers.filter(id => !oldMembers.includes(id));

//       // Emit to removed users
//       removedMembers.forEach(userId => {
//         const socketId = connectedUsers[userId];
//         if (socketId) {
//           io.to(socketId).emit("ticketUnassigned", {
//             message: "You were unassigned from a ticket",
//             ticketId: ticket._id,
//           });
//         }
//       });

//       // Emit to added users
//       addedMembers.forEach(userId => {
//         const socketId = connectedUsers[userId];
//         if (socketId) {
//           io.to(socketId).emit("ticketAssigned", {
//             message: "You were assigned to a ticket",
//             ticket,
//           });
//         }
//       });
//     }

//     res.status(200).json(ticket);
//   } catch (err) {
//     console.log("Error", err);
//     res.status(400).json({ error: err.message });
//   }
// };
exports.deleteTicket = async (req, res) => {
  try {
    await deleteTicketService(req);
    res.status(204).send();
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getSingleTicket = async (req, res) => {
  try {
    const ticket = await getSingleTicketService(req);
    res.status(200).json(ticket);
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
};

exports.getSortedTickets = async (req, res) => {
  try {
    const tickets = await getSortedTicketsService(req);
    res.status(200).json(tickets);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
