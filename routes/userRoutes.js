const express = require('express');
const userRouter = express.Router();

const {createUser,
    retrieveAllUsers,
    retrieveAllDoctors,
    getMyProfile } = require('../controllers/usercontroller.js');

userRouter
    .route('/')
    .get(retrieveAllDoctors)
    .get(getMyProfile)
    .get(retrieveAllUsers)
    .post(createUser);
    

module.exports = userRouter;