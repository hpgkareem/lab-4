const express = require('express');
const userRouter = express.Router();

const {createUser,
    retrieveAllUsers,
    retrieveAllDoctors,
     } = require('../controllers/usercontroller.js');
     const { verifyToken } = require('../controllers/authcontroller.js');
userRouter
    .route('/')
    .get(retrieveAllUsers)
    .post(createUser);
    userRouter.get('/doctors', retrieveAllDoctors);


module.exports = userRouter;