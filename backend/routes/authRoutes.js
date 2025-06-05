const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Register route
router.post('/register', authController.register);

// Login route
router.post('/login', authController.login);

// Verify email route
router.get('/verify-email/:token', authController.verifyEmail);

module.exports = router; 