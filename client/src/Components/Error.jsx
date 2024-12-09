import React, { useEffect } from 'react';
import { Link, useNavigate } from "react-router-dom";

export default function Error() {
  const navigate = useNavigate();

  useEffect(() => {
    // Automatically redirect to home page after 5 seconds
    const redirectTimer = setTimeout(() => {
      navigate('/');
    }, 5000);

    // Cleanup the timer if component unmounts
    return () => clearTimeout(redirectTimer);
  }, [navigate]);

  return (
    <div className="flex text-center justify-center items-center min-h-screen bg-gray-50">
      <div className="text-center p-8 bg-white shadow-xl rounded-xl">
        <h1 className="text-4xl font-bold text-[#0B1724] mb-4">
          Oops! 404 Error
        </h1>
        <p className="text-xl text-gray-600 mb-6">
          The page you're looking for does not exist.
        </p>
        <div className="flex justify-center space-x-4">
          <Link
            to="/Home"
            className="px-6 py-3 bg-[#cae962] text-[#0B1724] font-bold rounded-lg hover:bg-[#abc653] transition"
          >
            Go to Home Page
          </Link>
          <button
            onClick={() => window.history.back()}
            className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
          >
            Go Back
          </button>
        </div>
        <p className="text-sm text-gray-500 mt-4">
          You will be automatically redirected in 5 seconds...
        </p>
      </div>
    </div>
  );
}