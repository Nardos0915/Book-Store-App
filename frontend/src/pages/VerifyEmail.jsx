import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const VerifyEmail = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [message, setMessage] = useState('Verifying your email...');
  const [error, setError] = useState(null);

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/auth/verify-email/${token}`);
        setMessage('Email verified successfully! Redirecting to login...');
        // Store the token if needed
        if (response.data.token) {
          localStorage.setItem('token', response.data.token);
        }
        // Redirect to login after 2 seconds
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } catch (error) {
        setError(error.response?.data?.message || 'Error verifying email. Please try again.');
      }
    };

    if (token) {
      verifyEmail();
    } else {
      setError('Invalid verification link');
    }
  }, [token, navigate]);

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