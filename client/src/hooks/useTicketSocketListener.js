import { useEffect } from "react";
import socket from "../hooks/socket";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { fetchTickets } from "../services/ticketServices";
import { setTicket } from "../store/slices/ticketSlice";
import { Constant } from "../constants";

const useTicketSocketListeners = () => {
  const {statusMap}=Constant()
  const user = useSelector((state) => state.user.user);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!user?._id) return;

    // ✅ Connect and register
    if (!socket.connected) {
      socket.connect();
    }

    const registerUser = () => {
      console.log("✅ Registering user to socket:", user._id);
      socket.emit("register", { userId: user._id, role: user.role });
    };

    registerUser();
    socket.on("connect", registerUser);

    // 🎯 New ticket assigned
    const handleTicketAssigned = async ({ ticket }) => {
      console.log("📬 Received ticketAssigned:", ticket);
      const boardId = ticket?.updatedTicket?.board || ticket?.board;
      const data = await fetchTickets(boardId);
      if (data) {
        dispatch(setTicket(data));
        // toast.info("🎫 New ticket assigned!");
      }
    };

    socket.on("ticketAssigned", handleTicketAssigned);

    const handleTicketUnassigned = async ({ message, ticket }) => {
      const resp = await fetchTickets(ticket?.updatedTicket?.board);
      if (resp) {
        dispatch(setTicket(resp));
        toast.warn("You have been unassigned from a ticket.");
      }
    };

    // 🔄 Ticket status update
    const handleTicketStatusUpdated = async ({ ticket, newStatus }) => {
      console.log("🔄 Ticket status updated:");
      const resp = await fetchTickets(ticket?.updatedTicket?.board || ticket?.board);
      if (resp) {
        dispatch(setTicket(resp));
        // toast.info(
        //   user?.role === 1
        //     ? `User updated ticket status to ${statusMap[newStatus]}`
        //     : `Ticket status updated to ${statusMap[newStatus]}`
        // );
      }
    };

    socket.on("ticketAssigned", handleTicketAssigned);
    socket.on("ticketUnassigned", handleTicketUnassigned);
    socket.on("ticketStatusUpdated", handleTicketStatusUpdated);

    return () => {
      socket.off("connect", registerUser);
      socket.off("ticketAssigned", handleTicketAssigned);
      socket.off("ticketUnassigned", handleTicketUnassigned);
      socket.off("ticketStatusUpdated", handleTicketStatusUpdated);
    };
  }, [user?._id, dispatch]);
};

export default useTicketSocketListeners;
