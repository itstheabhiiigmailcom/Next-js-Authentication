'use client';
import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import axios from 'axios';
import toast from 'react-hot-toast';

const ResetPasswordPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token') || '';

  const [newPassword, setNewPassword] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const handleResetPassword = async () => {
    try {
      setLoading(true);
      await axios.post(
        `${process.env.NEXT_PUBLIC_DOMAIN}/api/users/resetpassword`,
        { token, newPassword }
      );
      toast.success('Password reset successful');
      router.push('/login');
    } catch (error: unknown) {
      toast.error(
        error instanceof Error ? error.message : 'Error resetting password'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8">
        <h2 className="text-2xl font-semibold text-center mb-6">
          Reset Password
        </h2>
        <input
          type="password"
          placeholder="Enter new password"
          className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-black"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
        <button
          onClick={handleResetPassword}
          className="w-full mt-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700"
          disabled={loading}
        >
          {loading ? 'Processing...' : 'Reset Password'}
        </button>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
