'use client';
import { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const handleForgotPassword = async () => {
    try {
      setLoading(true);
      await axios.post(
        `${process.env.NEXT_PUBLIC_DOMAIN}/api/users/forgotpassword`,
        { email }
      );
      toast.success('Reset link sent to your email');
    } catch (error: unknown) {
      toast.error(
        error instanceof Error ? error.message : 'Error sending reset email'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8">
        <h2 className="text-2xl font-semibold text-center mb-6">
          Forgot Password
        </h2>
        <input
          type="email"
          placeholder="Enter your email"
          className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-black"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button
          onClick={handleForgotPassword}
          className="w-full mt-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700"
          disabled={loading}
        >
          {loading ? 'Processing...' : 'Send Reset Link'}
        </button>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
