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

    // 📥 New board assignment
    const handleNewBoard = async ({ boardId }) => {
      const boards =fetchUserBoard();
      dispatch(setBoard(boards?.boards));
      toast.success("You were added to a board!");
    };

    // ❌ Removed from board
    const handleRemovedFromBoard = async ({ boardId, message }) => {
      const boards =  fetchUserBoard();
      dispatch(setBoard(boards?.boards));
      toast.warn(message || "You were removed from a board.");
    };

    // 🗑️ Board deleted
    const handleBoardDeleted = async ({ boardId, message }) => {
      const boards =  fetchUserBoard();
      dispatch(setBoard(boards?.boards));
      toast.error(message || "A board you were assigned to has been deleted.");
    };

    // 🧠 Set up listeners
    socket.on("newBoard", handleNewBoard);
    socket.on("removedFromBoard", handleRemovedFromBoard);
    socket.on("boardDeleted", handleBoardDeleted);

    // 🧹 Clean up
    return () => {
      socket.off("connect", registerUser);
      socket.off("newBoard", handleNewBoard);
      socket.off("removedFromBoard", handleRemovedFromBoard);
      socket.off("boardDeleted", handleBoardDeleted);
    };
  }, [user?._id, dispatch]);

  return null; // Since this is a hook, it doesn't render anything
};

export default useBoardSocketListeners;
