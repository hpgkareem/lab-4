const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const AppointmentRouter = require('./routes/appointmentRoutes.js');
const userRouter = require('./routes/userRoutes.js');
const authRouter = require('./routes/authRoutes.js');
const visitRouter = require('./routes/visitRoutes.js');

// Load environment variables
dotenv.config();

const app = express();

// 1. CORS Middleware
app.use(cors({
    origin: 'http://localhost:5173',
}));

// 2. IMPORTANT: Parse JSON Body (ده السطر اللي كان عامل المشكلة)
app.use(express.json());

// 3. Cookie Parser
app.use(cookieParser());

// Routes
app.use('/api/v1/Appointment', AppointmentRouter);
app.use('/api/v1/user', userRouter);
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/visit', visitRouter);

module.exports = {
    app,
};