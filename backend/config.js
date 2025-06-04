import dotenv from 'dotenv';
dotenv.config();

export const PORT = process.env.PORT || 5555;

// Use local MongoDB instance
export const mongoDBURL = 'mongodb://127.0.0.1:27017/bookstore';

export const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key_here';

// Please create a free database for yourself.
// This database will be deleted after tutorial