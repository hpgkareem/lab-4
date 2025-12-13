// controllers/appointmentController.js
const { db } = require('../models/db.js');

// POST /api/v1/appointments  (patient books appointment)
const createAppointment = (req, res) => {
    const { doctorId, appointmentDate, reason } = req.body;

    if (!doctorId || !appointmentDate) {
        return res.status(400).json({ message: 'doctorId and appointmentDate are required.' });
    }

    const patientId = req.user.id;

    const query = `
    INSERT INTO APPOINTMENT (DOCTOR_ID, PATIENT_ID, APPOINTMENT_DATE, REASON)
    VALUES (?, ?, ?, ?)
  `;

    db.run(query, [doctorId, patientId, appointmentDate, reason || null], function(err) {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: 'Database error while creating appointment.' });
        }

        return res.status(201).json({
            status: 'success',
            message: 'Appointment booked successfully',
            appointment: {
                id: this.lastID,
                doctorId,
                patientId,
                appointmentDate,
                status: 'booked',
                reason: reason || null,
            },
        });
    });
};

// GET /api/v1/appointments  (patient/doctor/admin view own relevant appointments)
const retrieveMyAppointments = (req, res) => {
    const userId = req.user.id;
    const role = req.user.role;

    let query;
    let params;

    if (role === 'patient') {
        query = `
      SELECT A.ID, A.APPOINTMENT_DATE, A.STATUS, A.REASON,
             D.FULL_NAME AS DOCTOR_NAME
      FROM APPOINTMENT A
      JOIN USER D ON A.DOCTOR_ID = D.ID
      WHERE A.PATIENT_ID = ?
      ORDER BY A.APPOINTMENT_DATE DESC
    `;
        params = [userId];
    } else if (role === 'doctor') {
        query = `
          SELECT A.ID,
                 A.APPOINTMENT_DATE,
                 A.STATUS,
                 A.REASON,
                 P.FULL_NAME AS PATIENT_NAME,
                 P.ID AS PATIENT_ID       
          FROM APPOINTMENT A
          JOIN USER P ON A.PATIENT_ID = P.ID
          WHERE A.DOCTOR_ID = ?
          ORDER BY A.APPOINTMENT_DATE DESC
        `;
        params = [userId];
    }
     else {

        
        query = `
      SELECT A.ID, A.APPOINTMENT_DATE, A.STATUS, A.REASON,
             D.FULL_NAME AS DOCTOR_NAME,
             P.FULL_NAME AS PATIENT_NAME
      FROM APPOINTMENT A
      JOIN USER D ON A.DOCTOR_ID = D.ID
      JOIN USER P ON A.PATIENT_ID = P.ID
      ORDER BY A.APPOINTMENT_DATE DESC
    `;
        params = [];
    }

    db.all(query, params, (err, rows) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: 'Error retrieving appointments' });
        }

        return res.status(200).json({
            status: 'success',
            message: 'Appointments retrieved successfully',
            data: rows,
        });
    });
};

module.exports = {
    createAppointment,
    retrieveMyAppointments,
};