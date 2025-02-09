'use client';
import axios from 'axios';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Loader2, CheckCircle, XCircle } from 'lucide-react';

export default function VerifyEmailPage() {
  const [token, setToken] = useState<string>('');
  const [verified, setVerified] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const verifyUserEmail = async () => {
    try {
      setLoading(true);
      await axios.post(
        `${process.env.NEXT_PUBLIC_DOMAIN}/api/users/verifyemail`,
        { token }
      );
      setVerified(true);
    } catch (err: unknown) {
      setError(true);
      if (axios.isAxiosError(err)) {
        console.error(err.response?.data || 'Unknown error occurred');
      } else {
        console.error('An unexpected error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const urlToken = urlParams.get('token') || '';
    setToken(urlToken);
  }, []);

  useEffect(() => {
    if (token && !verified && !error) {
      verifyUserEmail();
    }
  }, [token, verified, error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 px-4">
      <div className="bg-white shadow-lg rounded-xl p-8 max-w-lg text-center">
        <h1 className="text-3xl font-bold text-gray-800">Verify Your Email</h1>
        <p className="text-gray-600 mt-2">
          Please wait while we verify your email...
        </p>

        <div className="mt-4 p-3 bg-orange-100 text-orange-700 rounded-md text-sm">
          {token ? `Token: ${token}` : 'No token provided'}
        </div>

        {loading && (
          <div className="mt-4 flex items-center justify-center">
            <Loader2 className="w-6 h-6 text-blue-500 animate-spin" />
          </div>
        )}

        {verified && (
          <div className="mt-6 flex flex-col items-center">
            <CheckCircle className="w-12 h-12 text-green-500" />
            <h2 className="text-xl font-semibold text-green-600 mt-2">
              Email Verified!
            </h2>
            <Link href="/login">
              <button className="mt-4 px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition duration-300">
                Proceed to Login
              </button>
            </Link>
          </div>
        )}

        {error && (
          <div className="mt-6 flex flex-col items-center">
            <XCircle className="w-12 h-12 text-red-500" />
            <h2 className="text-xl font-semibold text-red-600 mt-2">
              Verification Failed
            </h2>
            <p className="text-gray-500">
              Please try again later or contact support.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
