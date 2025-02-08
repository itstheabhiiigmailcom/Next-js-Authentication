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
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <h1>Profile</h1>
      <hr />
      <p>Profile page</p>
      <h2 className="p-1 rounded bg-green-500">
        {data === 'nothing' ? (
          'nothing'
        ) : (
          <Link href={`/profile/${data}`}>{data}</Link>
        )}
      </h2>
      <hr />
      <button
        onClick={logout}
        className="bg-blue-500 mt-4 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        Logout
      </button>
      <button
        onClick={getUserDetails}
        className="bg-green-700 mt-4 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        Get Details
      </button>
    </div>
  );
};

export default ProfilePage;
