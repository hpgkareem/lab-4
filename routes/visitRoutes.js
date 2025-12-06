// routes/visitRoutes.js
const express = require('express');
const {
    createVisit,
    getPatientVisits,
} = require('../controllers/visitController.js');

const { verifyDoctor, verifyAdmin } = require('../controllers/authcontroller.js');

const visitRouter = express.Router();

// doctor creates visit records
visitRouter.post('/', verifyDoctor, createVisit);

// doctor or admin can view patient visit history
visitRouter.get('/patient/:patientId', (req, res, next) => {
    // allow doctor or admin
    verifyDoctor(req, res, (err) => {
        if (!err) return getPatientVisits(req, res);
    });

    verifyAdmin(req, res, (err) => {
        if (!err) return getPatientVisits(req, res);
    });
});

module.exports = visitRouter;