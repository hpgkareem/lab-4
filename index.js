const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const path = require('path');

const AppointmentRouter = require('./routes/appointmentRoutes.js');
const userRouter = require('./routes/userRoutes.js');
const authRouter = require('./routes/authRoutes.js');
const visitRouter = require('./routes/visitRoutes.js');

// Load environment variables
dotenv.config();

const app = express();

// CORS (you can even remove origin restriction if frontend is same origin)
app.use(cors({
  origin: 'http://localhost:3000', 
  credentials: true,
}));

// Parse JSON
app.use(express.json());

// Cookies
app.use(cookieParser());

// 🔹 Serve static frontend files from /frontend
app.use(express.static(path.join(__dirname, 'frontend')));

// 🔹 API Routes (note: these start with /api/...)
app.use('/api/v1/Appointment', AppointmentRouter);
app.use('/api/v1/user', userRouter);
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/visit', visitRouter);

module.exports = {
  app,
};
