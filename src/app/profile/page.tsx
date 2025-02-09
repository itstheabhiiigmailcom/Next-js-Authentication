'use client';
import React, { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const ProfilePage: React.FC = () => {
  const router = useRouter();
  const [data, setData] = useState('nothing');

  const logout = async () => {
    try {
      await axios.get(`${process.env.NEXT_PUBLIC_DOMAIN}/api/users/logout`);
      toast.success('Logout successfully');
      router.push('/login');
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.log(error.message);
        toast.error(error.message);
      } else {
        console.log('An unknown error occurred');
        toast.error('An unknown error occurred');
      }
    }
  };

  const getUserDetails = async () => {
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_DOMAIN}/api/users/me`
    );
    console.log('response data in profile page : ', res.data);
    setData(res.data.data._id);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      <div className="w-full max-w-md bg-white shadow-lg rounded-2xl p-6 text-center">
        <h1 className="text-3xl font-bold text-gray-800">Profile</h1>
        <p className="text-gray-600 mt-2">Welcome to your profile page</p>
        <hr className="my-4 border-gray-300" />

        <h2 className="p-2 text-lg font-semibold bg-green-500 text-white rounded-lg">
          {data === 'nothing' ? (
            'Nothing to display'
          ) : (
            <Link href={`/profile/${data}`} className="hover:underline">
              {data}
            </Link>
          )}
        </h2>

        <div className="mt-6 flex flex-col space-y-4">
          <button
            onClick={logout}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition-all duration-300"
          >
            Logout
          </button>
          <button
            onClick={getUserDetails}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition-all duration-300"
          >
            Get Details
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
