import { User } from '../models/index.js';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { sendVerificationEmail } from '../services/emailService.js';

// Register user
export const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    console.log('Registration attempt for:', { username, email });

    // Validate required fields
    if (!username || !email || !password) {
      console.log('Missing required fields:', { username, email, hasPassword: !!password });
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      console.log('User already exists:', { email, username });
      return res.status(400).json({ message: 'User already exists' });
    }

    // Generate verification token
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const verificationTokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    // Create new user
    const user = new User({
      username,
      email,
      password,
      verificationToken,
      verificationTokenExpires,
      isVerified: false
    });

    try {
      await user.save();
      console.log('User created successfully:', { userId: user._id });

      // Send verification email
      await sendVerificationEmail(email, verificationToken);
      console.log('Verification email sent successfully');
      
      res.status(201).json({ 
        message: 'Registration successful. Please check your email to verify your account before logging in.',
        requiresVerification: true
      });
    } catch (saveError) {
      console.error('Error saving user or sending email:', saveError);
      // If user was saved but email failed, delete the user
      if (user._id) {
        await User.findByIdAndDelete(user._id);
      }
      throw saveError;
    }
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ 
      message: 'Error registering user', 
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

// Verify email
export const verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;
    console.log('Email verification attempt for token:', token);

    if (!token) {
      console.log('No token provided');
      return res.status(400).json({ message: 'Verification token is required' });
    }

    const user = await User.findOne({
      verificationToken: token,
      verificationTokenExpires: { $gt: Date.now() }
    });

    if (!user) {
      console.log('Invalid or expired verification token');
      return res.status(400).json({ message: 'Invalid or expired verification token' });
    }

    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpires = undefined;
    await user.save();
    console.log('Email verified successfully for user:', user._id);

    // Generate JWT token after successful verification
    const authToken = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({ 
      message: 'Email verified successfully',
      token: authToken,
      user: {
        id: user._id,
        username: user.username,
        email: user.email
      }
    });
  } catch (error) {
    console.error('Email verification error:', error);
    res.status(500).json({ 
      message: 'Error verifying email', 
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

// Login user
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log('Login attempt for:', email);

    if (!email || !password) {
      console.log('Missing login credentials');
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      console.log('User not found:', email);
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check if email is verified
    if (!user.isVerified) {
      console.log('Unverified email attempt:', email);
      return res.status(401).json({ 
        message: 'Please verify your email before logging in',
        requiresVerification: true
      });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      console.log('Invalid password for user:', email);
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token
    const authToken = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    console.log('Login successful for user:', user._id);
    res.json({
      token: authToken,
      user: {
        id: user._id,
        username: user.username,
        email: user.email
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      message: 'Error logging in', 
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
}; 