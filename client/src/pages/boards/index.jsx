import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import BoardPage from "./userBoard/userBoard";
import AdminBoard from "./adminBoard/AdminBoard";
import { useParams } from "react-router-dom";
import { fetchTickets } from "../../services/ticketServices";
import { toast } from "react-toastify";
import { setTicket } from "../../store/slices/ticketSlice";
import { fetchBoard, fetchUserBoard } from "../../services/boardServices";
import { setBoard } from "../../store/slices/boardSlice";

const Board = () => {
  const { boardId } = useParams();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.user);
  const tickets = useSelector((state) => state.tickets?.tickets || []);
  const [BoardData, setBoardData] = useState({});
  const [loading, setLoading] = useState(true);

  const fetchTicket = async () => {
    try {
      const tickets = await fetchTickets(boardId);
      if (tickets) {
        dispatch(setTicket(tickets));
      }
    } catch (error) {
      console.error(error, "ERROR on PAGE");
      toast.error(error?.message || 'Internal Server Error');
    }
  };

  const fetchAndSetBoards = async () => {
    try {
      let resp;
      if (user?.role === 1) {
        resp = await fetchBoard();
      } else {
        resp = await fetchUserBoard();
      }

      if (resp?.boards) {
        dispatch(setBoard(resp.boards));
        const singleBoard = resp.boards.find((item) => item?._id === boardId);
        setBoardData(singleBoard || {});
      }
    } catch (error) {
      toast.error("Failed to fetch boards");
    }
  };

  useEffect(() => {
    if (!user?._id) return;

    const fetchData = async () => {
      setLoading(true);
      await fetchAndSetBoards();
      await fetchTicket();
      setLoading(false);
    };

    fetchData();
  }, [user?._id, boardId]);

  if (loading || !user) {
    return <div>Loading...</div>;
  }

  return (
    <>
      {user.role === 1 ? (
        <AdminBoard
          boardId={boardId}
          BoardData={BoardData}
          fetchBoards={fetchAndSetBoards}
        />
      ) : (
        <BoardPage
          boardId={boardId}
          Tickets={tickets}
          BoardData={BoardData}
        />
      )}
    </>
  );
};

export default Board;
