// src/hooks/useBoardSocketListeners.js
import { useEffect } from "react";
import socket from "../hooks/socket";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { fetchTickets } from "../services/ticketServices";
import { addTicket, setTicket } from "../store/slices/ticketSlice";

const useTicketSocketListeners = () => {
  const user = useSelector((state) => state.user.user);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!user?._id) return;

    // ✅ Ensure socket is connected
    if (!socket.connected) {
      socket.connect();
    }

    // 🔁 Register user
    const registerUser = () => {
      console.log("✅ Registering user to socket:", user._id);
      socket.emit("register", user._id);
    };

    registerUser();
    socket.on("connect", registerUser);


    const handleTicketAssigned =async({ message, ticket }) => {
      console.log("🎫 New ticket assigned:", ticket);
      const resp=await fetchTickets(ticket?.board)
      if(resp){
      dispatch(setTicket(resp))
      toast.info(message || "A ticket has been assigned to you.");
      }
    };

 
    socket.on("ticketAssigned", handleTicketAssigned);


    return () => {
      socket.off("connect", registerUser);
      socket.off("ticketAssigned", handleTicketAssigned);
    };
  }, [user?._id, dispatch]);
};

export default useTicketSocketListeners;
