// // routes/userRoutes.js
// const express = require('express');
// const {
//   createUser,
//   retrieveAllUsers,
//   retrieveAllDoctors,
//   getMyProfile,
// } = require('../controllers/usercontroller.js');

// const { verifyAdmin, verifyToken } = require('../controllers/authcontroller.js');

// const userRouter = express.Router();

// // current user profile
// userRouter.get('/profile', verifyToken, getMyProfile);

// // list doctors (any logged-in user)
// userRouter.get('/doctors', verifyToken, retrieveAllDoctors);

// // admin-only management routes
// userRouter.use(verifyAdmin);

// userRouter
//   .route('/')
//   .get(retrieveAllUsers)   // admin: get all users
//   .post(createUser);       // admin: create patient/doctor/admin

// module.exports = userRouter;
// routes/userRoutes.js
// routes/userRoutes.js
// routes/userRoutes.js
// routes/userRoutes.js
const express = require('express');
const userRouter = express.Router();

const userController = require('../controllers/usercontroller.js');
const authController = require('../controllers/authcontroller.js');

// =========================
// PUBLIC TEST ROUTE (OPTIONAL)
// =========================
// You can hit GET /api/v1/users/test to see router is working
userRouter.get('/test', (req, res) => {
    res.json({ message: 'User routes working' });
});

// =========================
// PROFILE (LOGGED-IN USER)
// GET /api/v1/users/profile
// =========================
userRouter.get(
    '/profile',
    authController.verifyToken,
    userController.getMyProfile
);

// =========================
// LIST DOCTORS (LOGGED-IN USER)
// GET /api/v1/users/doctors
// =========================
userRouter.get(
    '/doctors',
    authController.verifyToken,
    userController.retrieveAllDoctors
);

// =========================
// ADMIN-ONLY ROUTES BELOW
// =========================
userRouter.use(authController.verifyAdmin);

// GET /api/v1/users   (admin: list all users)
// POST /api/v1/users  (admin: create user)
userRouter
    .route('/')
    .get(userController.retrieveAllUsers)
    .post(userController.createUser);

module.exports = userRouter;