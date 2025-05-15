// src/hooks/useBoardSocketListeners.js
import { useEffect } from "react";
import socket from "../hooks/socket";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserBoard } from "../services/boardServices";
import { setBoard } from "../store/slices/boardSlice";
import { toast } from "react-toastify";

const useBoardSocketListeners = () => {
  const user = useSelector((state) => state.user.user);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!user?._id) return;

    // ✅ Ensure socket is connected
    if (!socket.connected) {
      socket.connect();
    }

    // 🔁 Register user on first load and after reconnect
    const registerUser = () => {
      console.log("✅ Registering user to socket:", user._id);
      socket.emit("register", user._id);
    };

    registerUser();
    socket.on("connect", registerUser); // Re-register after reconnect

    // 📥 Handle new board assignment
    const handleNewBoard = async ({ boardId }) => {
      console.log("📥 New board assigned:", boardId);
      const boards = await fetchUserBoard();
      dispatch(setBoard(boards?.boards));
      toast.success("You were added to a board!");
    };

    // ❌ Handle removal from board
    const handleRemovedFromBoard = async ({ boardId, message }) => {
      console.log("❌ Removed from board:", boardId, message);
      const boards = await fetchUserBoard();
      dispatch(setBoard(boards?.boards));
      toast.warn("You were removed from a board.");
    };

    socket.on("newBoard", handleNewBoard);
    socket.on("removedFromBoard", handleRemovedFromBoard);

    // 🧹 Clean up listeners on unmount
    return () => {
      socket.off("connect", registerUser);
      socket.off("newBoard", handleNewBoard);
      socket.off("removedFromBoard", handleRemovedFromBoard);
    };
  }, [user?._id, dispatch]);
};

export default useBoardSocketListeners;
