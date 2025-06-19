import React from 'react';
import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <nav className="flex justify-between items-center px-8 py-4 bg-teal-700 text-white">
      <h2 className="text-2xl font-bold m-0">Report2Clean</h2>
      <div className="flex gap-5">
        <Link to="/" className="text-white text-base no-underline hover:underline">
          Home
        </Link>
        <Link to="/login" className="text-white text-base no-underline hover:underline">
          Login
        </Link>
        <Link to="/report" className="text-white text-base no-underline hover:underline">
          Submit Report
        </Link>
        <Link to="/reports" className="text-white text-base no-underline hover:underline">
          View Reports
        </Link>
        <Link
          to="/profile"
          className="bg-red-300 bg-opacity-20 px-4 py-2 rounded-lg font-bold text-white no-underline hover:bg-opacity-30"
        >
          Profile
        </Link>
      </div>
    </nav>
  );
}

export default Navbar;
