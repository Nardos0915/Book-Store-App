import dotenv from 'dotenv';
dotenv.config();

export const PORT = process.env.PORT || 5555;

// Use MongoDB URI from environment variable in production
export const mongoDBURL = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/bookstore';

export const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key_here';

// Add CORS origin for development
export const CORS_ORIGIN = process.env.CORS_ORIGIN || ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:3000'];

// Please create a free database for yourself.
// This database will be deleted after tutorial