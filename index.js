const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const AppointmentRouter = require('./routes/TripRoutes.js');
const userRouter = require('./routes/userRoutes.js');
const authRouter = require('./routes/authRoutes.js');
const visitRouter = require('./routes/visitRoutes.js');

// Load environment variables from .env file
dotenv.config();

// Create an instance of the Express application
const app = express();

app.use(cors({
    origin: 'http://localhost:5173',
}));

// Use middleware to parse JSON data from request bodies
app.use(express.json());
app.use(cookieParser());


app.use('/api/v1/trips', AppointmentRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/visits', visitRouter)

module.exports = {
  app,
};