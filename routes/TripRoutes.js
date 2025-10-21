const express = require('express');
const {
    retrieveAllTrips
} = require('../controllers/Tripcontroller.js');

const tripRouter = express.Router();

tripRouter
    .route('/')
    .get(retrieveAllTrips)
module.exports = tripRouter;