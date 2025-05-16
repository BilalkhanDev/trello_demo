const express = require('express');
const reqValidator = require('../midlwares/validator');
const { signup, signin, refreshAccessToken } = require('../controller/authController');
const { useAuth } = require('../midlwares/useAuth');
const { authUser } = require('../controller/userController');
const router = express.Router();


router.post('/signUp',
    reqValidator("registerSchema","body"),
    signup
);
router.post('/signIn',
    reqValidator("loginSchema","body"),
    signin
);
router.get('/me',
    useAuth,
    authUser
);

router.post('/refresh-token', refreshAccessToken);



module.exports = router;
