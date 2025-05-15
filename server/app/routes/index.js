const express = require('express');
const authRoutes = require('./authRoutes');
const userRoutes=require("./userRoutes")
const boardRoutes=require("./boardRoutes")
const ticketRoutes=require("./ticketRoutes")



const router = express.Router();

// Register the routes
router.use('/auth',  authRoutes);
router.use('/users', userRoutes);
router.use('/board', boardRoutes)
router.use('/ticket', ticketRoutes)


module.exports = router;

