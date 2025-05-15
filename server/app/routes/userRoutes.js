const express = require('express');
const reqValidator = require('../midlwares/validator');
const { useAuth, adminOnly, adminOrSelf } = require('../midlwares/useAuth');
const { users, IdenticalUser } = require('../controller/userController');
const router = express.Router();

//Get all Users 
router.get('/',
    useAuth,
    adminOnly(1),
    // reqValidator("userSchema","query"),
    users
);

// Get User By Id 
router.get('/:id',
    useAuth,
    adminOrSelf,
    reqValidator("singleUserSchema","params"),
    IdenticalUser
);





module.exports = router;
