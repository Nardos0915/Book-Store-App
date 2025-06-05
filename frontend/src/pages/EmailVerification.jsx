import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/axios';

const EmailVerification = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const { login } = useAuth();
  const [verificationStatus, setVerificationStatus] = useState('verifying');
  const [error, setError] = useState('');

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const response = await api.get(`/auth/verify-email/${token}`);
        setVerificationStatus('success');
        
        // Log the user in with the returned token
        if (response.data.token) {
          login(response.data.token, response.data.user);
        }
        
        // Redirect to home page after 3 seconds
        setTimeout(() => {
          navigate('/');
        }, 3000);
      } catch (error) {
        console.error('Verification error:', error);
        setVerificationStatus('error');
        setError(error.response?.data?.message || 'Failed to verify email. Please try again.');
      }
    };

    if (token) {
      verifyEmail();
    }
  }, [token, navigate, login]);

  if (verificationStatus === 'verifying') {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
          <p className="text-lg">Verifying your email...</p>
        </div>
      </div>
    );
  }

  if (verificationStatus === 'success') {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="rounded-lg bg-white p-8 text-center shadow-md">
          <h2 className="mb-4 text-2xl font-bold text-green-600">Email Verified Successfully!</h2>
          <p className="mb-4">You will be redirected to the home page shortly...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="rounded-lg bg-white p-8 text-center shadow-md">
        <h2 className="mb-4 text-2xl font-bold text-red-600">Verification Failed</h2>
        <p className="mb-4 text-red-500">{error}</p>
        <div className="space-y-4">
          <button
            onClick={() => navigate('/login')}
            className="w-full rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
          >
            Return to Login
          </button>
          <button
            onClick={() => navigate('/register')}
            className="w-full rounded bg-gray-500 px-4 py-2 text-white hover:bg-gray-600"
          >
            Register Again
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmailVerification; 