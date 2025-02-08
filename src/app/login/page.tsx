'use client';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import toast from 'react-hot-toast';

const LoginPage = () => {
  const router = useRouter();
  const [user, setUser] = useState({
    email: '',
    password: '',
  });
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const onLogin = async () => {
    try {
      setLoading(true);
      setErrorMessage(null); // Clear previous error
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_DOMAIN}/api/users/login`,
        user
      );
      console.log('login success: ', response.data);
      toast.success('Login successful');
      router.push('/profile');
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const errorMsg = error.response?.data?.error || 'Login failed';
        console.log('Login failed', errorMsg);
        setErrorMessage(errorMsg);
        toast.error(errorMsg);
      } else {
        console.log('Login failed', 'An unknown error occurred');
        setErrorMessage('An unknown error occurred');
        toast.error('An unknown error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setButtonDisabled(!(user.email.length > 0 && user.password.length > 0));
  }, [user]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-2xl font-semibold text-center text-gray-800 mb-6">
          {loading ? 'Processing...' : 'Login'}
        </h1>

        {errorMessage && (
          <div className="bg-red-100 text-red-700 border border-red-400 p-2 rounded-md mb-4 text-center">
            {errorMessage}
          </div>
        )}

        <label htmlFor="email" className="block text-gray-700 font-medium">
          Email
        </label>
        <input
          className="w-full p-2 mt-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-black"
          id="email"
          type="email"
          value={user.email}
          onChange={(e) => setUser({ ...user, email: e.target.value })}
          placeholder="Enter your email"
        />

        <label
          htmlFor="password"
          className="block mt-4 text-gray-700 font-medium"
        >
          Password
        </label>
        <input
          className="w-full p-2 mt-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-black"
          id="password"
          type="password"
          value={user.password}
          onChange={(e) => setUser({ ...user, password: e.target.value })}
          placeholder="Enter your password"
        />

        <button
          onClick={onLogin}
          className={`w-full mt-6 py-2 text-white font-semibold rounded-lg transition duration-300 ${
            buttonDisabled
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700'
          }`}
          disabled={buttonDisabled}
        >
          {buttonDisabled
            ? 'Cannot Login'
            : loading
            ? 'Logging in...'
            : 'Login'}
        </button>

        <p className="mt-4 text-center text-gray-600">
          Don&apos;t have an account?{' '}
          <Link href="/signup" className="text-blue-600 hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
