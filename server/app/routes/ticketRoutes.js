const express = require('express');
const router = express.Router();
const {
  createTicket,
  updateTicket,
  deleteTicket,
  getSingleTicket,
  getSortedTickets
} = require('../controller/ticketController');
const reqValidator = require('../midlwares/validator');
const { useAuth, adminOnly } = require('../midlwares/useAuth');

router.post('/create/:boardId', 
    reqValidator("createTicketParamSchema", 'params'),
    reqValidator("createTicketBodySchema", 'body'), 
    useAuth,
    adminOnly(1),
    createTicket);
router.put('/update-status/:id',
     reqValidator("updateTicketStatus", 'body'),
     reqValidator("singleBoardschema", 'params'),
     useAuth,
     updateTicket);

// Update Order 

router.put('/update-order',
     useAuth,
     updateTicket);

router.put('/update/:id',
     reqValidator("updateTicketsSchema", 'body'),
     reqValidator("singleBoardschema", 'params'),
     useAuth,
     adminOnly(1),
     updateTicket);
router.delete('/delete/:id', deleteTicket);
router.get('/single/:id', getSingleTicket);
router.get('/:boardId',
    reqValidator("getTicketsSchema", 'params'),
    useAuth,
    getSortedTickets);

module.exports = router;
