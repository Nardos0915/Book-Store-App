import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// Create reusable transporter object using SMTP transport
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

// Verify transporter configuration
transporter.verify(function(error, success) {
  if (error) {
    console.error('Email service configuration error:', error);
  } else {
    console.log('Email service is ready to send messages');
  }
});

export const sendVerificationEmail = async (email, token) => {
  try {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
      throw new Error('Email configuration is missing. Please check your .env file.');
    }

    if (!process.env.FRONTEND_URL) {
      throw new Error('Frontend URL is not configured. Please check your .env file.');
    }

    const verificationUrl = `${process.env.FRONTEND_URL}/verify-email/${token}`;
    console.log('Sending verification email to:', email);
    console.log('Verification URL:', verificationUrl);

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Verify Your Email',
      html: `
        <h1>Email Verification</h1>
        <p>Please click the link below to verify your email address:</p>
        <a href="${verificationUrl}">${verificationUrl}</a>
        <p>This link will expire in 24 hours.</p>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Verification email sent successfully:', info.messageId);
    return info;
  } catch (error) {
    console.error('Error sending verification email:', error);
    throw new Error(`Failed to send verification email: ${error.message}`);
  }
}; 