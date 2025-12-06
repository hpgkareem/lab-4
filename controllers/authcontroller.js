const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { db } = require('../db.js');

const signToken = (id, role) => {
    return jwt.sign({id, role}, process.env.JWT_SECRET, {expiresIn: process.env.JWT_EXPIRES_IN});
}

const isValidEmail = (email) => /\S+@\S+\.\S+/.test(email);

// POST /signup
const signUp = (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const fullname = req.body.fullname
  const role = 'patient'; // default signup role

  if (!email || !password || !fullname) {
    return res.status(400).send('Please provide email,fullname and password.');
  }

  if (!isValidEmail(email)) {
    return res.status(400).send('Invalid email format.')
  }

  if (password.length <= 8) {
    return res.status(400).send('password must be at least 8 characters')
  }

    // Insert
    const checkQuery = 'SELECT ID FROM USER WHERE EMAIL = ?';
    db.get(checkQuery, [email], (err, existing) => {
      if (err) {
        console.error(err);
        return res.status(500).send('Database error.');
      }
      if (existing) {
        return res.status(400).send('Emai already exists.')
      }

      becrypt.hash(password, 10, (hashErr, hashedPassword) => {
        if (hashErr) {
          console.error(hashErr);
          return res.status(500).send('Error hahsing password.');
        }

        const insertQuery = `
         INSERT INTO USER (FULL_NAME, EMAIL, PPASSWORD, ROLE, PHONE)
         VALUES (?, ?, ?, ?, ?)
        `;

        db.run(
          insertQuery,[fullname, email, hashedPassword, role, phone || null],
          function (insertErr) {
            if (insertErr) {
              console.error(insertErr);
              return res.status(500).send('Database error');
            }
            const newUserId = this.lastID;
            const token = signToken(newUserId, role);

            res.cookie('jwt', token, {
              httpOnly: true,
              sameSite: 'strict',
              secure: false,
              maxAge: 60 * 60 * 1000,
            });

            return res.status(201).json({
              status: 'success',
              message: 'patient registered successfuly',
              user: { id: newUserId, fullname, email, role, phone: phone || null},
              token,
            });
          },
        );
      
      });
    });
}; 

const login = (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  if (!email || !password) {
    return res.status(400).send('Please provide email and password.');
  }

  const query = `SELECT * FROM USER WHERE EMAIL='${email}'`;

  db.get(query, (err, row) => {
    if (err) {
      console.log(err);
      return res.status(500).send('Database error');
    }

    if (!row) {
      logAuthAttempt(null, email, false, req.ip);
      return res.status(401).send('Invalid credentials');
    }

    // Compare the hashed password
    bcrypt.compare(password, row.PASSWORD, (compareErr, isMatch) => {
      if (compareErr) {
        console.error(compareErr);
        return res.status(500).send('Error verifying password.');
      }

      if (!isMatch) {
        logAuthAttempt(row.ID, email, false, req.ip);
        return res.status(401).send('Invalid credentials');
      }

      // Generate JWT token for successful login
      const token = signToken(row.ID, row.ROLE);
      logAuthAttempt(row.ID, email, true, req.ip)


      res.cookie('jwt', token, {
        httpOnly: true,
        sameSite: 'strict',
        secure: false,
        maxage: 60 * 60 * 1000,
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

// --- VERIFY TOKEN MIDDLEWARE ---
const verifyToken = (req, res, next) => {
  let token = null;
  

  if (req.cookies && req.cookies.jwt) {
    token = req.cookies.jwt;

  } else if (req.headers.authorization && req.headers.authorization.startWith('Bearer')) {
    token = req.headers.authorization.split('')[1];
  }

  if (!token) {
    return res.status(403).send('Access denied: token missing');
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).send('Invalid or expired token');
    }

    req.user = { id: decoded.id, role: decoded.role};
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
      return res.status(403).send('Access denied: doctors only');
    }
    next();
  });
};

module.exports = { signUp, login, verifyToken, verifyAdmin, verifyDoctor };