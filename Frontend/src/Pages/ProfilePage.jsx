import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import {
  FaSignOutAlt,
  FaEnvelope,
  FaUser,
  FaPhoneAlt,
  FaMapMarkerAlt,
} from 'react-icons/fa';

const fetchUserProfile = async () => {
  const res = await axios.get('http://localhost:8000/user/profile', {
    withCredentials: true,
  });
  return res.data.data;
};

const ProfilePage = () => {
  const navigate = useNavigate();

  const { data, isLoading, isError } = useQuery({
    queryKey: ['userProfile'],
    queryFn: fetchUserProfile,
  });

  const handleLogout = async () => {
    try {
      await axios.get('http://localhost:8000/user/logout', {
        withCredentials: true,
      });
      navigate('/login');
    } catch (err) {
      console.error('Logout failed:', err.response?.data?.message || err.message);
    }
  };

  if (isLoading) {
    return <div className="text-center text-gray-600 text-lg mt-10">Loading profile...</div>;
  }

  if (isError) {
    return <div className="text-center text-red-500 text-lg mt-10">Error loading profile.</div>;
  }

  const user = data;

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 font-sans">
      <div className="bg-white shadow-lg rounded-2xl p-8 max-w-md w-full">
        <h2 className="text-2xl font-semibold text-gray-800 flex items-center mb-4">
          <FaUser className="mr-2 text-blue-600" /> {user.fullname}
        </h2>
        <div className="space-y-3 text-gray-700">
          <p className="flex items-center"><FaEnvelope className="mr-2 text-gray-500" /> {user.email}</p>
          <p className="flex items-center"><FaPhoneAlt className="mr-2 text-gray-500" /> {user.phone_no}</p>
          <p className="flex items-center"><FaMapMarkerAlt className="mr-2 text-gray-500" /> {user.city}, {user.province}</p>
          <p className="ml-1">Address: {user.address}</p>
        </div>

        <button
          onClick={handleLogout}
          className="mt-6 w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-md font-semibold transition duration-200"
        >
          <FaSignOutAlt /> Logout
        </button>
      </div>
    </div>
  );
};

export default ProfilePage;
