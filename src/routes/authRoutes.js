const express = require('express');
const { signinUser, getMe } = require('../controllers/authController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Signin route
router.post('/signin', signinUser);

// Get current user (protected)
router.get('/me', protect, getMe);

module.exports = router;
