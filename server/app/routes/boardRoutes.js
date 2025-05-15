const express = require('express');
const reqValidator = require('../midlwares/validator');
const { useAuth, adminOnly, adminOrSelf } = require('../midlwares/useAuth');
const { createBoard, updateBoard, deleteBoard, getAllBoards, getBoardById, getSpecficUserBoard } = require('../controller/boardController');


const router = express.Router();

//Craete a board 
router.post('/create',
    useAuth,
    adminOnly(1),
    reqValidator("boardValidationSchema","body"),
    createBoard
    
);

router.put('/update/:id',
    useAuth,
    adminOnly(1),
    reqValidator("singleBoardschema","params"),
    updateBoard
    
);
// delete board 
router.put('/delete/:id',
    useAuth,
    adminOnly(1),
    reqValidator("singleBoardschema","params"),
    deleteBoard
    
);
router.get('/all',
     useAuth,  
     reqValidator("userSchema", "query"),
     getAllBoards);
router.get('/specific-user',
     useAuth,  
     reqValidator("userSchema", "query"),
     getSpecficUserBoard)

router.get('/:id', useAuth, getBoardById)




module.exports = router;
