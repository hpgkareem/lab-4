const {trips} = require('../models/Tripmodel.js');


const retrieveAllTrips = (req, res) => {
    const allTrips = getTripswithdailycost();
    res.status(200).json({
        status: 'success',
        message: 'Trips retrieved successsfully',
        results: allTrips.length,
        data: allTrips,
    });
};