// controllers/authcontroller.js
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { db } = require('../models/db.js');

// Helper to get Secret Key (use env or fallback)
const getSecretKey = () => {
    return process.env.JWT_SECRET || 'my-secret-key-12345';
};

const signToken = (id, role) => {
    return jwt.sign({ id, role }, getSecretKey(), {
        expiresIn: process.env.JWT_EXPIRES_IN || '90d',
    });
};

const isValidEmail = (email) => /\S+@\S+\.\S+/.test(email);

// Helper function to log attempts (placeholder to prevent crash)
const logAuthAttempt = (userId, email, success, ip) => {
    console.log(`Auth Attempt -> Email: ${email}, Success: ${success}, IP: ${ip}`);
   
};


const signUp = (req, res) => {
    const { fullname, email, password, phone } = req.body;
    console.log(req.body)
    const role = 'patient'; 


    if (!email || !password || !fullname) {
        return res.status(400).send('Please provide email, fullname, and password.');
    }

    if (!isValidEmail(email)) {
        return res.status(400).send('Invalid email format.');
    }

    if (password.length < 8) {
        return res.status(400).send('Password must be at least 8 characters');
    }

    
    const checkQuery = 'SELECT ID FROM USER WHERE EMAIL = ?';
    db.get(checkQuery, [email], (err, existing) => {
        if (err) {
            console.error('Database Check Error:', err);
            return res.status(500).send('Database error.');
        }

        if (existing) {
            return res.status(400).send('Email already exists.');
        }

        
        bcrypt.hash(password, 10, (hashErr, hashedPassword) => {
            if (hashErr) {
                console.error('Hashing Error:', hashErr);
                return res.status(500).send('Error hashing password.');
            }

            const insertQuery = `
        INSERT INTO USER (FULL_NAME, EMAIL, PASSWORD, ROLE, PHONE)
        VALUES (?, ?, ?, ?, ?)
      `;

            db.run(
                insertQuery, [fullname, email, hashedPassword, role, phone || null],
                function(insertErr) {
                    if (insertErr) {
                        console.error('Insert Error:', XHinsertErr);
                        return res.status(500).send('Database error during registration');
                    }

                    const newUserId = this.lastID;
                    const token = signToken(newUserId, role);

                    
                    res.cookie('jwt', token, {
                        httpOnly: true,
                        secure: false, 
                        maxAge: 90 * 24 * 60 * 60 * 1000,
                    });

                    return res.status(201).json({
                        status: 'success',
                        message: 'Patient registered successfully',
                        user: { id: newUserId, fullname, email, role, phone: phone || null },
                        token,
                    });
                }
            );
        });
    });
};

// POST /login
const login = (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).send('Please provide email and password.');
    }

    const query = `SELECT * FROM USER WHERE EMAIL = ?`;

    db.get(query, [email], (err, row) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Database error');
        }

        if (!row) {
            logAuthAttempt(null, email, false, req.ip);
            return res.status(401).send('Invalid credentials');
        }

        bcrypt.compare(password, row.PASSWORD, (compareErr, isMatch) => {
            if (compareErr) {
                console.error(compareErr);
                return res.status(500).send('Error verifying password.');
            }

            if (!isMatch) {
                logAuthAttempt(row.ID, email, false, req.ip);
                return res.status(401).send('Invalid credentials');
            }

            const token = signToken(row.ID, row.ROLE);
            logAuthAttempt(row.ID, email, true, req.ip);

            res.cookie('jwt', token, {
                httpOnly: true,
                secure: false,
                maxAge: 90 * 24 * 60 * 60 * 1000,
            });

            return res.status(200).json({
                message: 'Login successful',
                user: {
                    id: row.ID,
                    email: row.EMAIL,
                    role: row.ROLE,
                },
                token,
            });
        });
    });
};

const getMyProfile = (req, res) => {
    const token = req.cookies.jwt;
   

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        db.get(
            "SELECT * FROM USER WHERE ID = ?",
            [decoded.id],
            (err, user) => {
                if(err || !user) return res.json({ user: null });
                res.json({ user });
            }
        );
    } catch {
        res.json({ user: null});
    }
};

// --- VERIFY TOKEN MIDDLEWARE ---
const verifyToken = (req, res, next) => {
    let token = null;

    if (req.cookies && req.cookies.jwt) {
        token = req.cookies.jwt;
    } else if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
        return res.status(403).send('Access denied: token missing');
    }

    jwt.verify(token, getSecretKey(), (err, decoded) => {
        if (err) {
            return res.status(403).send('Invalid or expired token');
        }

        req.user = { id: decoded.id, role: decoded.role };
        next();
    });
};

const verifyAdmin = (req, res, next) => {
    verifyToken(req, res, () => {
        if (req.user.role !== 'admin') {
            return res.status(403).send('Access denied: Admins only');
        }
        next();
    });
};

const verifyDoctor = (req, res, next) => {
    verifyToken(req, res, () => {
        if (req.user.role !== 'doctor') {
            return res.status(403).send('Access denied: Doctors only');
        }
        next();
    });
};

module.exports = { signUp, login, verifyToken, verifyAdmin, verifyDoctor, getMyProfile };