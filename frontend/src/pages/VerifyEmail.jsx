import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const API_URL = 'https://book-store-app-5.onrender.com';

const VerifyEmail = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const { login } = useAuth();
  const [message, setMessage] = useState('Verifying your email...');
  const [error, setError] = useState(null);

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        console.log('Attempting to verify email with token:', token);
        const response = await axios.get(`${API_URL}/api/auth/verify-email/${token}`);
        console.log('Verification response:', response.data);
        
        if (response.data.user && response.data.token) {
          setMessage('Email verified successfully! Redirecting to home page...');
          login(response.data.token, response.data.user);
          
          // Redirect to home page after 2 seconds
          setTimeout(() => {
            navigate('/');
          }, 2000);
        } else {
          throw new Error('Invalid response from server');
        }
      } catch (error) {
        console.error('Verification error:', error.response?.data || error);
        setError(error.response?.data?.message || 'Error verifying email. Please try again.');
      }
    };

    if (token) {
      verifyEmail();
    } else {
      setError('Invalid verification link');
    }
  }, [token, navigate, login]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Email Verification
          </h2>
        </div>
        <div className="mt-8 space-y-6">
          {error ? (
            <div className="rounded-md bg-red-50 p-4">
              <div className="text-sm text-red-700">{error}</div>
              <div className="mt-2">
                <a href="/login" className="text-sm text-blue-600 hover:text-blue-500">
                  Return to Login
                </a>
              </div>
            </div>
          ) : (
            <div className="rounded-md bg-green-50 p-4">
              <div className="text-sm text-green-700">{message}</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail; 