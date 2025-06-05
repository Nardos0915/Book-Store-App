import express from 'express';
import { register, login, verifyEmail } from '../controllers/authController.js';

const router = express.Router();

// Register route
router.post('/register', register);

// Login route
router.post('/login', login);

// Verify email route
router.get('/verify-email/:token', verifyEmail);

export default router; 