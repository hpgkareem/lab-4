const express = require('express');
const {
    createVisit,
    getPatientVisits,
} = require('../controllers/visitController.js');

const { verifyDoctor, verifyAdmin, verifyToken } = require('../controllers/authcontroller.js');

const visitRouter = express.Router();

// doctor creates visit records
visitRouter.post('/', verifyDoctor, createVisit);

const allowDoctorOrAdmin = (req, res, next) => {
    verifyToken(req, res, () => {
        if (req.user.role === 'doctor' || req.user.role === 'admin') {
            return next();
        }
        return res.status(403).send('Access denied: Doctors or Admins only');
    });
};

// doctor or admin can view patient visit history
visitRouter.get('/patient/:patientId', allowDoctorOrAdmin, getPatientVisits);

module.exports = visitRouter;
