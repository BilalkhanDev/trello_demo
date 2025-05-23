const {
  createTicketService,
  updateTicketService,
  deleteTicketService,
  getSingleTicketService,
  getSortedTicketsService
} = require('../services/ticketServices');
const { getIO, getConnectedUsers } = require('../config/sockets');
const ticketModel = require('../model/ticketModel')

exports.createTicket = async (req, res) => {
  try {
    const ticket = await createTicketService(req); // Save ticket logic

    const io = getIO();
    const connectedUsers = getConnectedUsers();

    if (ticket?.assignedTo) {
      const assignedToId = ticket.assignedTo?._id?.toString(); // Ensure it's string
      const userSocket = connectedUsers[assignedToId];
       console.log("userSocket", userSocket)
      if (userSocket?.socketId) {
        io.to(userSocket.socketId).emit("ticketAssigned", {
          message: "A new ticket has been assigned to you",
          ticket,
        });
        console.log("📤 Emitted ticketAssigned to:", userSocket.socketId);
      } else {
        console.log("⚠️ Assigned user not connected");
      }
    }

    res.status(201).json(ticket);
  } catch (error) {
    console.error("❌ Ticket creation error:", error);
    res.status(400).json({ error: error.message });
  }
};


exports.updateTicket = async (req, res) => {
  try {
    const user = req.user;
    const ticketId = req.params.id;
    if (Array.isArray(req.body)) {
      await Promise.all(
        req.body.map(ticket =>
          ticketModel.findByIdAndUpdate(ticket._id, { order: ticket.order }, { new: true })
        )
      );

      return res.status(200).json({ message: "Order updated" });
    }


    const existingTicket = await ticketModel.findById(ticketId);
    if (!existingTicket) {
      return res.status(404).json({ error: 'Ticket not found' });
    }

    const oldAssignedTo = existingTicket.assignedTo?.toString();
    const oldStatus = existingTicket.status;

    const updated = await updateTicketService(req);
    const updatedTicket = updated?.updatedTicket;
    const newAssignedTo = updatedTicket?.assignedTo?.toString();

    const io = getIO();
    const connectedUsers = getConnectedUsers();
    if (user?.role === 1) {
       
      if (newAssignedTo !== oldAssignedTo) {
        const newSocket = connectedUsers[newAssignedTo]?.socketId;
        const oldSocket = connectedUsers[oldAssignedTo]?.socketId;

        if (newSocket) {
          console.log("Socket")
          io.to(newSocket).emit("ticketAssigned", {
            ticketId,
            message: "You have been assigned a new ticket.",
            ticket: updated
          },
            (response) => {
              console.log('Acknowledgement from client:1');
            })
        }

        if (oldSocket) {
          io.to(oldSocket).emit("ticketUnassigned", {
            ticketId,
            message: "You have been unassigned from a ticket.",
            ticket: updated
          },
            (response) => {
              console.log('Acknowledgement from client:2');
            });
        }
      }

      if (updatedTicket.status !== oldStatus) {
        const assignedSocket = connectedUsers[newAssignedTo]?.socketId;
        if (assignedSocket) {
          io.to(assignedSocket).emit("ticketStatusUpdated", {
            ticketId,
            newStatus: updatedTicket.status,
            ticket: updated
          },
            (response) => {
              console.log('Acknowledgement from client:3');
            });
        }
      }
    }

    // ✅ User logic — only emit status updates
    if (user?.role !== 1 && updatedTicket.status !== oldStatus) {
      const assignedSocket = connectedUsers[newAssignedTo]?.socketId;
         console.log("Socket****",assignedSocket)
      if (assignedSocket) {
        io.to(assignedSocket).emit("ticketStatusUpdated", {
          ticketId,
          newStatus: updatedTicket.status,
          ticket: updated
        });
      }

      // 👇 ALSO notify all admins about status change
      Object.entries(connectedUsers).forEach(([uid, userData]) => {
        if (userData.role === 1) {
          io.to(userData.socketId).emit("ticketStatusUpdated", {
            ticketId,
            newStatus: updatedTicket.status,
            ticket: updated
          });
        }
      });
    }

    res.status(200).json(updated);
  } catch (err) {
    console.error("Error", err);
    res.status(400).json({ error: err.message });
  }
};


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
