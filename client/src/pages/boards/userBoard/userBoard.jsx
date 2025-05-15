// import React, { useState, useEffect } from 'react';
// import { DndProvider, useDrag, useDrop } from 'react-dnd';
// import { Card, Col, Row, Tag } from 'antd';
// import { HTML5Backend } from 'react-dnd-html5-backend';
// import styles from './Board.module.css';
// import Layout from '../../../components/layout/Layout';
// import { Constant } from '../../../constants';
// import { toast } from 'react-toastify';
// import { updateTicketByUser, updateTicketOrder } from '../../../services/ticketServices';
// import { updateTicket } from '../../../store/slices/ticketSlice';
// import { useDispatch } from 'react-redux';
// const { statusMap, colorMap } = Constant();
// const BoardPage = (props) => {
//   const [tickets, setTickets] = useState([]);
//   const dispatch = useDispatch()

//   // Sync tickets from props.Tickets when it changes
//   useEffect(() => {
//     if (props.Tickets && Array.isArray(props.Tickets)) {
//       setTickets(props.Tickets);

//     }
//   }, [props.Tickets]);

//   const moveTicket = async (id, newStatus) => {

//     const previousTickets = [...tickets];
//     setTickets((prevTickets) =>
//       prevTickets.map((ticket) =>
//         ticket._id === id ? { ...ticket, status: newStatus } : ticket
//       )
//     );

//     try {
//       const data = tickets?.find((ticket) => ticket._id == id)
//       if (!data) {
//         return
//       }
//       const updatePayload = {
//         _id: data?.id,
//         title: data?.title,
//         description: data?.description,
//         status: newStatus,
//         assignedTo: data?.assignedTo,
//         priority: data?.priority,
//       }
//       await updateTicketByUser(id, { status: newStatus, title: data?.title });
//       console.log(updatePayload)
//       dispatch(updateTicket(updatePayload))
//       toast.success('Ticket updated!');
//     } catch (error) {
//       console.error('API error:', error);
//       toast.error("Not Updated")
//       setTickets(previousTickets);
//     }
//   };

//   //  const moveTicketInGroup = async (draggedTicketId, targetTicketId, newStatus) => {
//   //   const previousTickets = [...tickets];

//   //   let updatedTickets = [...tickets];
//   //   const draggedIndex = updatedTickets.findIndex(t => t._id === draggedTicketId);
//   //   const targetIndex = updatedTickets.findIndex(t => t._id === targetTicketId);

//   //   // Move ticket in array
//   //   const [draggedTicket] = updatedTickets.splice(draggedIndex, 1);
//   //   updatedTickets.splice(targetIndex, 0, draggedTicket);

//   //   // Reassign order values within the affected status group
//   //   const reorderedTickets = updatedTickets.map((ticket, i) => {
//   //     if (Number(ticket.status) === newStatus) {
//   //       return { ...ticket, order: i };
//   //     }
//   //     return ticket;
//   //   });

//   //   // Optimistically update UI
//   //   setTickets(reorderedTickets);

//   //   try {
//   //     const updates = reorderedTickets
//   //       .filter(ticket => Number(ticket.status) === newStatus)
//   //       .map(ticket => ({
//   //         _id: ticket._id,
//   //         order: ticket.order,
//   //       }));

//   //     // Call API to persist order update
//   //     await updateTicketOrder(updates); 
//   //     toast.success('Ticket order updated!');
//   //   } catch (error) {
//   //     console.error('Order update failed:', error);
//   //     toast.error('Failed to update ticket order. Reverting.');
//   //     setTickets(previousTickets); // Revert on failure
//   //   }
//   // };
//   const handleDragMoveInGroup = (draggedTicketId, targetTicketId, newStatus) => {
//     const updatedTickets = [...tickets];
//     const draggedIndex = updatedTickets.findIndex(t => t._id === draggedTicketId);
//     const targetIndex = updatedTickets.findIndex(t => t._id === targetTicketId);

//     const [draggedTicket] = updatedTickets.splice(draggedIndex, 1);
//     updatedTickets.splice(targetIndex, 0, draggedTicket);

//     // Reassign order for affected status only
//     const reorderedTickets = updatedTickets.map((ticket, i) => {
//       if (Number(ticket.status) === newStatus) {
//         return { ...ticket, order: i };
//       }
//       return ticket;
//     });

//     setTickets(reorderedTickets);
//   };

//   const persistOrder = async (status) => {
//     const updates = tickets
//       .filter(ticket => Number(ticket.status) === status)
//       .map(ticket => ({
//         _id: ticket._id,
//         order: ticket.order,
//       }));

//     try {
//       await updateTicketOrder(updates);
//       toast.success('Ticket order updated!');
//     } catch (err) {
//       console.error('Order update failed:', err);
//       toast.error('Failed to update ticket order.');
//     }
//   };

//   const getTicketsByStatus = (status) => {
//     return tickets
//       ?.filter((ticket) => Number(ticket?.status) == status)
//       ?.sort((a, b) => a?.order - b?.order); // Sort by order
//   };

//   const statusKeys = Object.keys(statusMap).map(Number);

//   return (
//     <Layout>
//       <div className={styles.header}>
//         <h2 className={styles.headerTitle}>Board Name</h2>
//       </div>

//       <DndProvider backend={HTML5Backend}>
//         <div className={styles.boardContainer}>
//           <Row gutter={[16, 16]}>
//             {statusKeys.map((status) => (
//               <Col xs={24} md={8} key={status}>
//                 <Panel
//                   status={status}
//                   tickets={getTicketsByStatus(status)}
//                   moveTicket={moveTicket}
//                   moveTicketInGroup={handleDragMoveInGroup}
//                   persistOrderInGroup={persistOrder}
//                 />
//               </Col>
//             ))}
//           </Row>
//         </div>
//       </DndProvider>
//     </Layout>
//   );
// };

// const Panel = ({ status, tickets, moveTicket, moveTicketInGroup, persistOrderInGroup }) => {
//   const [, drop] = useDrop({
//     accept: 'TICKET',
//     drop: (item) => moveTicket(item.id, status),
//   });

//   return (
//     <div ref={drop} className={styles.panel}>
//       <h2 className={styles.panelTitle}>{statusMap[status]}</h2>
//       <div className={styles.cardContainer}>
//         {tickets?.map((ticket, index) => (
//           <DraggableTicket
//             key={ticket._id}
//             ticket={ticket}
//             moveTicketInGroup={moveTicketInGroup}
//             persistOrderInGroup={persistOrderInGroup}
//             index={index}
//             status={status}
//           />
//         ))}
//       </div>
//     </div>
//   );
// };

// const DraggableTicket = ({ ticket, index, status, moveTicketInGroup, persistOrderInGroup }) => {
//   const [, drag] = useDrag({
//     type: 'TICKET',
//     item: { id: ticket._id, index, status },
//   });

//   const [, drop] = useDrop({
//     accept: 'TICKET',
//     hover: (item) => {
//       if (item.index !== index) {
//         moveTicketInGroup(item.id, ticket._id, status);
//         item.index = index;
//       }
//     },
//     drop: (item) => {
//       persistOrderInGroup(status);
//     },
//   });

//   return (
//     <div ref={(node) => drag(drop(node))}>
//       <Card className={styles.ticketCard} style={{ marginBottom: '10px' }}>
//         <h5>{ticket?.title}</h5>
//         <p>{ticket?.description}</p>
//         <Tag color={colorMap[ticket?.status] || 'default'}>{statusMap[ticket.status]}</Tag>
//       </Card>
//     </div>
//   );
// };


// export default BoardPage;
import React, { useState, useEffect } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { Card, Col, Row, Tag } from 'antd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import styles from './Board.module.css';
import Layout from '../../../components/layout/Layout';
import { Constant } from '../../../constants';
import { toast } from 'react-toastify';
import { updateTicketByUser, updateTicketOrder } from '../../../services/ticketServices';
import { updateTicket } from '../../../store/slices/ticketSlice';
import { useDispatch } from 'react-redux';
import useTicketSocketListeners from '../../../hooks/useTicketSocketListener';

const { statusMap, colorMap } = Constant();

const BoardPage = (props) => {
  useTicketSocketListeners()
  const [tickets, setTickets] = useState([]);
  const dispatch = useDispatch();

  useEffect(() => {
    if (props.Tickets && Array.isArray(props.Tickets)) {
      setTickets(props.Tickets);
    }
  }, [props.Tickets]);

  const moveTicket = async (id, newStatus) => {
    const previousTickets = [...tickets];
    const ticketToMove = tickets.find(t => t._id === id);

    if (!ticketToMove || ticketToMove.status === newStatus) return;

    // Optimistically update
    const updatedTickets = tickets.map(ticket =>
      ticket._id === id ? { ...ticket, status: newStatus } : ticket
    );

    const newStatusTickets = updatedTickets
      .filter(t => t.status === newStatus)
      .sort((a, b) => a.order - b.order);

    const updatedWithOrder = updatedTickets.map(ticket => {
      if (ticket.status === newStatus) {
        const index = newStatusTickets.findIndex(t => t._id === ticket._id);
        return { ...ticket, order: index };
      }
      return ticket;
    });

    setTickets(updatedWithOrder);

    try {
      await updateTicketByUser(id, { status: newStatus });
      await updateTicketOrder(
        updatedWithOrder.filter(t => t.status === newStatus).map(t => ({
          _id: t._id,
          order: t.order,
        }))
      );
      dispatch(updateTicket({ ...ticketToMove, status: newStatus }));
      toast.success('Ticket moved & updated!');
    } catch (error) {
      console.error('Move error:', error);
      toast.error('Failed to move ticket.');
      setTickets(previousTickets);
    }
  };

  const moveTicketInGroup = (draggedTicketId, targetTicketId, status) => {
    const updatedTickets = [...tickets];
    const draggedIndex = updatedTickets.findIndex(t => t._id === draggedTicketId);
    const targetIndex = updatedTickets.findIndex(t => t._id === targetTicketId);

    const [draggedTicket] = updatedTickets.splice(draggedIndex, 1);
    updatedTickets.splice(targetIndex, 0, draggedTicket);

    const reordered = updatedTickets.map((ticket, i) => {
      if (ticket.status === status) {
        return { ...ticket, order: i };
      }
      return ticket;
    });

    setTickets(reordered);
  };

  const persistOrderInGroup = async (status) => {
    const updates = tickets
      .filter(t => t.status === status)
      .map(t => ({ _id: t._id, order: t.order }));

    try {
      await updateTicketOrder(updates);
      toast.success('Order saved!');
    } catch (error) {
      console.error('Order save error:', error);
      toast.error('Failed to save order.');
    }
  };

  const getTicketsByStatus = (status) =>
    tickets
      .filter(ticket => Number(ticket.status) === status)
      .sort((a, b) => a.order - b.order);

  const statusKeys = Object.keys(statusMap).map(Number);

  return (
    <Layout>
      <div className={styles.header}>
        <h2 className={styles.headerTitle}>{props?.BoardData?.title || ""}</h2>
      </div>

      <DndProvider backend={HTML5Backend}>
        <div className={styles.boardContainer}>
          <Row gutter={[16, 16]}>
            {statusKeys.map((status) => (
              <Col xs={24} md={8} key={status}>
                <Panel
                  status={status}
                  tickets={getTicketsByStatus(status)}
                  moveTicket={moveTicket}
                  moveTicketInGroup={moveTicketInGroup}
                  persistOrderInGroup={persistOrderInGroup}
                />
              </Col>
            ))}
          </Row>
        </div>
      </DndProvider>
    </Layout>
  );
};

const Panel = ({ status, tickets, moveTicket, moveTicketInGroup, persistOrderInGroup }) => {
  const [, drop] = useDrop({
    accept: 'TICKET',
    drop: (item) => moveTicket(item.id, status),
  });

  return (
    <div ref={drop} className={styles.panel}>
      <h2 className={styles.panelTitle}>{statusMap[status]}</h2>
      <div className={styles.cardContainer}>
        {tickets.map((ticket, index) => (
          <DraggableTicket
            key={ticket._id}
            ticket={ticket}
            index={index}
            status={status}
            moveTicketInGroup={moveTicketInGroup}
            persistOrderInGroup={persistOrderInGroup}
          />
        ))}
      </div>
    </div>
  );
};

const DraggableTicket = ({ ticket, index, status, moveTicketInGroup, persistOrderInGroup }) => {
  const [, drag] = useDrag({
    type: 'TICKET',
    item: { id: ticket._id, index, status },
  });

  const [, drop] = useDrop({
    accept: 'TICKET',
    hover: (item) => {
      if (item.index !== index && item.status === status) {
        moveTicketInGroup(item.id, ticket._id, status);
        item.index = index;
      }
    },
    drop: (item) => {
      if (item.status === status) {
        persistOrderInGroup(status);
      }
    },
  });

  return (
    <div ref={(node) => drag(drop(node))}>
      <Card className={styles.ticketCard} style={{ marginBottom: '10px' }}>
        <h5>{ticket?.title}</h5>
        <p>{ticket?.description}</p>
        <Tag color={colorMap[ticket.status] || 'default'}>
          {statusMap[ticket.status]}
        </Tag>
      </Card>
    </div>
  );
};

export default BoardPage;

