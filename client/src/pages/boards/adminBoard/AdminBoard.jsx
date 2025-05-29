import React, { useEffect, useState } from "react";
import { Popconfirm, Table, Tag, Tooltip } from 'antd';
import dayjs from 'dayjs';
import styles from './AdminBoard.module.css';
import { useParams } from "react-router-dom";
import Layout from "../../../components/layout/Layout";
import { useDispatch, useSelector } from "react-redux";
import { addTicket, setTicket, updateTicket } from "../../../store/slices/ticketSlice";
import { createTicket, fetchTickets, updateTickets } from "../../../services/ticketServices";
import { toast } from "react-toastify";
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import CustomButton from "../../../common/button/Button";
import { Constant } from "../../../constants";
import CustomModal from "../../../common/modal/Modal";
import TicketForm from "../../tickets/createTicket/createTicket";
import BoardForm from "../createBoard/createBoard";
import { deleteBoard, fetchBoard, fetchboardUser, updateBoard } from "../../../services/boardServices";
import { addBoard, setBoardUser } from "../../../store/slices/boardSlice";

const AdminBoard = (props) => {

  const { status, priority } = Constant();
  const { boardId } = useParams()
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [isboardOpen, setIsBoardOpen] = useState(false);
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);
  const tickets = useSelector((state) => state.tickets?.tickets || []);
  const allUsers = useSelector((state) => state.user.allUsers || []);
  const user = useSelector((state) => state.user.user);
  const boardUsers = useSelector((state) => state.boards.boardUsers || [])
  useEffect(() => {
    const fetchUserBoard = async () => {
      setIsLoadingUsers(true);
      dispatch(setBoardUser([]));
      const resp = await fetchboardUser(boardId);
      dispatch(setBoardUser(resp));
      setIsLoadingUsers(false);
    };
    fetchUserBoard();
  }, [boardId]);

  const handleEditClick = () => {
    setIsBoardOpen(true);
  };


  const handleFormSubmit = async (data) => {
    try {
      if (data.id || data?._id) {
        const payload = {
          title: data?.title,
          description: data?.description,
          status: data?.status,
          assignedTo: data?.assignedTo,
          priority: data?.priority,
        }
        await updateTickets(data.id || data?._id, payload);
        const resp = await fetchTickets(props?.boardId || boardId)
        dispatch(setTicket(resp))

        toast.success('Ticket updated!');
      } else {
        const resp = await createTicket(props?.boardId || boardId, data);
        dispatch(addTicket(resp))
        toast.success('Ticket created!');
      }

    } catch (error) {
      toast.error(error?.message || 'Error submitting ticket');
    }
  };
const handleBoardSubmit = async (data) => {
  try {
    // Get current member IDs from props
    const currentMemberIds = props?.boardData?.members?.map(item => item?._id) || [];
    
    // Get new member IDs from form data
    const newMemberIds = data?.members?.map(item => item) || [];
    
    // Helper function to compare arrays
    const arraysEqual = (a, b) => {
      if (a.length !== b.length) return false;
      const sortedA = [...a].sort();
      const sortedB = [...b].sort();
      return sortedA.every((val, index) => val === sortedB[index]);
    };
    
    // Check if members changed
    const membersChanged = !arraysEqual(currentMemberIds, newMemberIds);
    
   
    
    // Update the board
    const resp = await updateBoard(props?.boardId || boardId, data);
    await props.fetchBoards();
    dispatch(addBoard(resp));
     if (membersChanged) {
      const userResp = await fetchboardUser(props?.boardId || boardId);
      dispatch(setBoardUser(userResp));
    }

    toast.success('Board updated!');

  } catch (error) {
    toast.error(error?.message || 'Error updating board');
  }
};

  const handleEdit = (ticket) => {
    setSelectedTicket(ticket);
    setOpen(true);
  };
  const columns = [
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
      responsive: ['xs', 'sm', 'md', 'lg'],
      render: (text) => <strong>{text}</strong>,
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      responsive: ['xs', 'sm', 'md', 'lg'],
      ellipsis: true,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      responsive: ['xs', 'sm', 'md', 'lg'],
      render: (item) => {
        const colorMap = {
          0: 'green',
          1: 'blue',
          2: 'red',
        };
        return <Tag color={colorMap[item] || 'default'}>{status[item]}</Tag>;
      },
    },
    {
      title: 'Priority',
      dataIndex: 'priority',
      key: 'priority',
      responsive: ['xs', 'sm', 'md', 'lg'],
      render: (item) => {
        const colorMap = {
          2: 'red',
          1: 'orange',
          0: 'gold',
        };
        return <Tag color={colorMap[item] || 'default'}>{priority[item]}</Tag>;
      },
    },
    {
      title: 'Assigned To',
      dataIndex: 'assignedTo',
      key: 'assignedTo',
      responsive: ['xs', 'sm', 'md', 'lg'],
      render: (value) => value?.email || '--',
    },
    {
      title: 'Due Date',
      dataIndex: 'dueDate',
      key: 'dueDate',
      responsive: ['xs', 'sm', 'md', 'lg'],
      render: (date) => dayjs(date).format('YYYY-MM-DD'),
    },
    {
      title: 'Actions',
      dataIndex: 'actions',
      key: 'actions',
      responsive: ['xs', 'sm', 'md', 'lg'],
      render: (_, item) => (
        <CustomButton htmlType="button" variant="primary" block onClick={() => handleEdit(item)}>
          Edit
        </CustomButton>
      ),
    },
  ];
  const handleDeleteBoard = async () => {
    try {
      const resp = await deleteBoard(boardId)
      if (resp) {
        const updatedData = await props.fetchBoards()
        dispatch(addBoard(updatedData?.boards))
        toast.success("Board Deleted")
      }
    }
    catch (err) {
      toast.error(err?.message || "Failed to delete")
    }

  }
  return (
    <Layout>
      <div className={styles.header}>
        <h2 className={styles.headerTitle}>
          {props?.BoardData?.title || ""}
          {user?.role === 1 && (
            <Tooltip title="Edit board">
              <EditOutlined
                className={styles.editIcon}
                onClick={handleEditClick}
              />
            </Tooltip>
          )}
        </h2>

        <CustomButton
          htmlType="button"
          variant="secondary"
          onClick={() => setOpen(true)}
        >
          Create Ticket
        </CustomButton>
      </div>

      <Table
        columns={columns}
        dataSource={tickets}
        rowKey="id"
        pagination={{ pageSize: 5 }}
        scroll={{ x: true }}
        className={styles.custom_table}
      />

      {/* Ticket Modal */}
      <CustomModal
        visible={open && !isLoadingUsers}
        onClose={() => {
          setOpen(false);
          setSelectedTicket(null);
        }}
        title={selectedTicket ? "Update Ticket" : "Create Ticket"}
      >
        <TicketForm
          initialData={selectedTicket}
          userOptions={boardUsers}
          onClose={() => {
            setOpen(false);
            setSelectedTicket(null);
          }}
          onSubmit={handleFormSubmit}
        />
      </CustomModal>

      {/* Board Edit Modal */}
      <CustomModal
        visible={isboardOpen}
        onClose={() => setIsBoardOpen(false)}
        title="Update Board"
      >
        <BoardForm
          initialData={props?.BoardData || {}}
          onClose={() => setIsBoardOpen(false)}
          onSubmit={handleBoardSubmit}
        />
      </CustomModal>

      {/* Floating Delete Button */}
      {user?.role === 1 && (
        <Popconfirm
          title="Are you sure you want to delete this board?"
          description="This action cannot be undone."
          onConfirm={handleDeleteBoard}
          okText="Yes, Delete"
          cancelText="Cancel"
          placement="top"
        >

          <button className={styles.floatingDeleteButton}>
            <DeleteOutlined />
          </button>

        </Popconfirm>
      )}

    </Layout>
  );
};

export default AdminBoard;
