// routes/authRoutes.js
const express = require('express');
const { signUp, login, getMyProfile } = require('../controllers/authcontroller.js');

const authRouter = express.Router();

authRouter.post('/signup', signUp);
authRouter.post('/login', login);
authRouter.get('/me', getMyProfile);
module.exports = authRouter;