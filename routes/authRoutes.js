// routes/authRoutes.js
const express = require('express');
const { signUp, login } = require('../controllers/authcontroller.js');

const authRouter = express.Router();

authRouter.post('/signup', signUp);
authRouter.post('/login', login);

module.exports = authRouter;