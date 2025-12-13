const bcrypt = require('bcryptjs');
const { db } = require('../models/db.js');

const retrieveAllUsers = (req, res) => {
    const query = `
     FULLNAME, EMAIL, PASSWORD, PHONE
  `;

    db.all(query, (err, rows) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ message: 'Error retrieving users' });
        }
        return res.status(200).json({
            message: 'Users retrieved successfully',
            data: rows,
        });
    });
};

const retrieveAllDoctors = (req, res) => {
    const query = `
    SELECT ID, FULL_NAME, EMAIL, SPECIALIZATION, LICENSE_NUMBER, PHONE
    FROM USER
    WHERE ROLE = 'doctor'
  `;

    db.all(query, (err, rows) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ message: 'Error retrieving doctors' });
        }
        return res.status(200).json({
            message: 'Doctors retrieved successfully',
            data: rows,
        });
    });
};



const createUser = (req, res) => {
    const { fullName, email, role, password, specialization, licenseNumber, phone } = req.body;

    if (!fullName || !email || !role || !password) {
        return res
            .status(400)
            .json({ message: 'fullName, email, role and password are required' });
    }

    if (password.length < 8) {
        return res.status(400).json({ message: 'Password must be at least 8 characters.' });
    }

    const checkQuery = 'SELECT ID FROM USER WHERE EMAIL = ?';
    db.get(checkQuery, [email], (err, existing) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: 'Database error' });
        }

        if (existing) {
            return res.status(400).json({ message: 'Email already exists' });
        }

        bcrypt.hash(password, 10, (hashErr, hashedPassword) => {
            if (hashErr) {
                console.error(hashErr);
                return res.status(500).json({ message: 'Error hashing password.' });
            }

            const insertQuery = `
        INSERT INTO USER (FULL_NAME, EMAIL, PASSWORD, ROLE, SPECIALIZATION, LICENSE_NUMBER, PHONE)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `;

            db.run(
                insertQuery, [
                    fullName,
                    email,
                    hashedPassword,
                    role,
                    specialization || null,
                    licenseNumber || null,
                    phone || null,
                ],
                function(insertErr) {
                    if (insertErr) {
                        console.error(insertErr);
                        return res.status(500).json({ message: 'Database error.' });
                    }

                    return res.status(201).json({
                        status: 'success',
                        message: 'User created successfully by admin',
                        userId: this.lastID,
                    });
                },
            );
        });
    });
};

module.exports = {
    createUser,
    retrieveAllUsers,
    retrieveAllDoctors,
    
};