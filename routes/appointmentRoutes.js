// routes/appointmentRoutes.js
const express = require('express');
const {
    createAppointment,
    retrieveMyAppointments,
} = require('../controllers/appointmentController.js');

const { verifyToken } = require('../controllers/authcontroller.js');

const appointmentRouter = express.Router();

// all appointment endpoints require login
appointmentRouter.use(verifyToken);

appointmentRouter
    .route('/')
    .post(createAppointment) // patient books appointment
    .get(retrieveMyAppointments); // patient/doctor/admin see appointments

module.exports = appointmentRouter;