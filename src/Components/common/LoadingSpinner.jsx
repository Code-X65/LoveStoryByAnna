import React from 'react';
import Logo from '../../assets/Logo.png'
const LoadingSpinner = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="flex flex-col items-center gap-6">
        {/* Spinner with logo in the center */}
        <div className="relative w-32 h-32 flex items-center justify-center">
          {/* Spinning border - larger and more prominent */}
          <div className="absolute inset-0 border-4 border-pink-300 border-t-pink-500 rounded-full animate-spin"></div>

          {/* Center logo - larger and more visible */}
          <img
            src={Logo}
            alt="Love Story by Anna"
            className="w-20 h-20 object-contain"
          />
        </div>

        {/* Loading text */}
        <p className="text-gray-600 text-lg font-medium">Loading...</p>
      </div>
    </div>
  );
};

export default LoadingSpinner;
