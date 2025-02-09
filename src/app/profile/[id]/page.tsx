import React from 'react';

interface UserProfileProps {
  params: { id: string };
}

const UserProfile = async ({ params }: UserProfileProps) => {
  const data = await params; // No need to await here
  const id = data.id;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      <div className="w-full max-w-md bg-white shadow-lg rounded-2xl p-6 text-center">
        <h1 className="text-3xl font-bold text-gray-800">User Profile</h1>
        <p className="text-gray-600 mt-2">Welcome to your profile page</p>
        <hr className="my-4 border-gray-300" />

        <p className="text-xl font-semibold text-black">
          Profile ID:
          <span className="p-2 ml-2 bg-orange-500 text-white rounded-lg">
            {id}
          </span>
        </p>
      </div>
    </div>
  );
};

export default UserProfile;
