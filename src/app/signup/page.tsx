'use client';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios, { AxiosError } from 'axios';
import toast from 'react-hot-toast';

interface User {
  email: string;
  password: string;
  username: string;
}

const SignupPage: React.FC = () => {
  const router = useRouter();
  const [user, setUser] = useState<User>({
    email: '',
    password: '',
    username: '',
  });
  const [buttonDisabled, setButtonDisabled] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const onSignup = async () => {
    try {
      setLoading(true);
      setErrorMessage(null); // Clear previous errors
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_DOMAIN}/api/users/signup`,
        user
      );
      console.log('Signup success:', response.data);
      toast.success('Signup successful');
      router.push('/login');
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<{ error?: string }>;
        const errorMsg = axiosError.response?.data?.error || 'Signup failed';
        console.error('Signup failed:', errorMsg);
        setErrorMessage(errorMsg);
        toast.error(errorMsg);
      } else {
        console.error('Signup failed: An unknown error occurred');
        setErrorMessage('An unknown error occurred');
        toast.error('An unknown error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setButtonDisabled(
      !(
        user.email.length > 0 &&
        user.password.length > 0 &&
        user.username.length > 0
      )
    );
  }, [user]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-2xl font-semibold text-center text-gray-800 mb-6">
          {loading ? 'Processing...' : 'Signup'}
        </h1>

        {errorMessage && (
          <div className="bg-red-100 text-red-700 border border-red-400 p-2 rounded-md mb-4 text-center">
            {errorMessage}
          </div>
        )}

        <label htmlFor="username" className="block text-gray-700 font-medium">
          Username
        </label>
        <input
          className="w-full p-2 mt-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-black"
          id="username"
          type="text"
          value={user.username}
          onChange={(e) => setUser({ ...user, username: e.target.value })}
          placeholder="Enter your username"
        />

        <label htmlFor="email" className="block mt-4 text-gray-700 font-medium">
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
          onClick={onSignup}
          className={`w-full mt-6 py-2 text-white font-semibold rounded-lg transition duration-300 ${
            buttonDisabled
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700'
          }`}
          disabled={buttonDisabled}
        >
          {buttonDisabled
            ? 'Cannot Signup'
            : loading
            ? 'Signing up...'
            : 'Signup'}
        </button>

        <p className="mt-4 text-center text-gray-600">
          Already have an account?{' '}
          <Link href="/login" className="text-blue-600 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignupPage;
