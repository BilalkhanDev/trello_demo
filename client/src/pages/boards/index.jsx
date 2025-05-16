import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import BoardPage from "./userBoard/userBoard";
import AdminBoard from "./adminBoard/AdminBoard";
import { useNavigate, useParams } from "react-router-dom";
import { fetchTickets } from "../../services/ticketServices";
import { toast } from "react-toastify";
import { setTicket } from "../../store/slices/ticketSlice";
import { fetchBoard, fetchUserBoard } from "../../services/boardServices";
import { setBoard } from "../../store/slices/boardSlice";
import { useRef } from "react";

const Board = () => {
  const { boardId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.user.user);
  const boards = useSelector((state) => state.boards?.boards || []);
  const tickets = useSelector((state) => state.tickets?.tickets || []);
  const [BoardData, setBoardData] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const board = boards.find((b) => b?._id === boardId);
    if (!board) {
      navigate("/dashboard");
    } else {
      setBoardData(board);
      setLoading(false);
    }
  }, [boardId, boards, navigate]);

  //   const fetchTicket = async () => {
  //     try {
  //       const tickets = await fetchTickets(boardId);
  //       if (tickets) {
  //         dispatch(setTicket(tickets));
  //       }
  //     } catch (error) {
  //       console.error(error, "ERROR on PAGE");
  //       toast.error(error?.message || 'Internal Server Error');
  //     }
  //   };

  //   const fetchAndSetBoards = async () => {
  //     try {
  //       let resp;
  //       if (user?.role === 1) {
  //         resp = await fetchBoard();
  //       } else {
  //         resp = await fetchUserBoard();
  //       }

  //       if (resp?.boards) {
  //         dispatch(setBoard(resp.boards));
  //         const singleBoard = resp.boards.find((item) => item?._id === boardId);
  //         setBoardData(singleBoard || {});
  //       }
  //     } catch (error) {
  //       toast.error("Failed to fetch boards");
  //     }
  //   };
  //  const fetchBoardRef=useRef(true)
  //   useEffect(() => {
  //     if (!user?._id) return;

  //      const fetchData = async () => {
  //       fetchBoardRef.current=false
  //       setLoading(true);
  //       await fetchAndSetBoards();
  //       await fetchTicket();
  //       setLoading(false);
  //     }
  //       if(fetchBoardRef.current===true){
  //         fetchData()
  //       }

  //   }, []);

  const fetchTicket = async () => {
    console.log("🎯 fetchTicket called");
    try {
      const tickets = await fetchTickets(boardId);
      if (tickets) {
        console.log("✅ Tickets fetched:", tickets.length);
        dispatch(setTicket(tickets));
      }
    } catch (error) {
      console.error("❌ Error in fetchTicket:", error);
      toast.error(error?.message || "Internal Server Error");
    }
  };

  const fetchAndSetBoards = async () => {
    console.log("📦 fetchAndSetBoards called");
    try {
      let resp;
      if (user?.role === 1) {
        resp = await fetchBoard();
      } else {
        resp = await fetchUserBoard();
      }

      if (resp?.boards) {
        console.log("✅ Boards fetched:", resp.boards.length);
        dispatch(setBoard(resp.boards));
        const singleBoard = resp.boards.find((item) => item?._id === boardId);
        setBoardData(singleBoard || {});
      }
    } catch (error) {
      console.error("❌ Failed to fetch boards:", error);
      toast.error("Failed to fetch boards");
    }
  };

  const fetchBoardRef = useRef(true);

  useEffect(() => {

    if (!user?._id) {
      console.log("🚫 No user ID yet. Exiting effect.");
      return;
    }

    const fetchData = async () => {
      fetchBoardRef.current = false;
      setLoading(true);
      await fetchAndSetBoards();
      await fetchTicket();
      setLoading(false);
    };

    if (fetchBoardRef.current === true) {
      fetchData();
    } else {
      console.log("🛑 fetchBoardRef.current is false, skipping fetch");
    }
  }, []); // Only runs once on mount



  return (
    <>
      {user?.role === 1 ? (
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
