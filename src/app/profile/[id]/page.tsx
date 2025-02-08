import React from 'react';

async function UserProfile({ params }: any) {
  const id = await params.id;
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <h1>Profile</h1>
      <hr />
      <p className="text-4xl">
        Profile page
        <span className="p-2 rounded ml-2 text-black bg-orange-500 ">{id}</span>
      </p>
    </div>
  );
}

export default UserProfile;
