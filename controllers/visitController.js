// controllers/visitController.js
const { db } = require('../models/db.js');

// POST /api/v1/visits  (doctor adds visit record for appointment)
const createVisit = (req, res) => {
    const { appointmentId, complaints, diagnosis, prescription, followUpRequired } = req.body;

    if (!appointmentId) {
        return res.status(400).json({ message: 'appointmentId is required.' });
    }

    const query = `
    INSERT INTO VISIT (APPOINTMENT_ID, COMPLAINTS, DIAGNOSIS, PRESCRIPTION, FOLLOW_UP_REQUIRED)
    VALUES (?, ?, ?, ?, ?)
  `;

    db.run(
        query, [
            appointmentId,
            complaints || null,
            diagnosis || null,
            prescription || null,
            followUpRequired ? 1 : 0,
        ],
        function(err) {
            if (err) {
                console.error(err);
                return res.status(500).json({ message: 'Error creating visit record.' });
            }

            return res.status(201).json({
                status: 'success',
                message: 'Visit record created successfully',
                visitId: this.lastID,
            });
        },
    );
};

// GET /api/v1/visits/patient/:patientId  (doctor/admin view visit history of a patient)
const getPatientVisits = (req, res) => {
    const { patientId } = req.params;

    const query = `
    SELECT V.ID, V.APPOINTMENT_ID, V.COMPLAINTS, V.DIAGNOSIS, V.PRESCRIPTION,
           V.FOLLOW_UP_REQUIRED, V.CREATED_AT,
           A.APPOINTMENT_DATE,
           D.FULL_NAME AS DOCTOR_NAME,
           P.FULL_NAME AS PATIENT_NAME
    FROM VISIT V
    JOIN APPOINTMENT A ON V.APPOINTMENT_ID = A.ID
    JOIN USER D ON A.DOCTOR_ID = D.ID
    JOIN USER P ON A.PATIENT_ID = P.ID
    WHERE P.ID = ?
    ORDER BY A.APPOINTMENT_DATE DESC
  `;

    db.all(query, [patientId], (err, rows) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: 'Error retrieving visits.' });
        }

        return res.status(200).json({
            status: 'success',
            message: 'Patient visit history retrieved successfully',
            data: rows,
        });
    });
};

module.exports = {
    createVisit,
    getPatientVisits,
};