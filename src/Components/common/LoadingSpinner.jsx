import React from 'react';

const LoadingSpinner = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="flex flex-col items-center gap-4">
        {/* Spinner with logo in the center */}
        <div className="relative w-16 h-16 flex items-center justify-center">
          {/* Spinning border */}
          <div className="absolute inset-0 border-4 border-pink-300 border-t-transparent rounded-full animate-spin"></div>

          {/* Center logo */}
          <img 
            src="https://lovestorybyanna.com/wp-content/uploads/2025/02/cropped-Black-and-Yellow-Classy-and-Refined-Curved-Text-Logo-70x69.png" 
            alt="Logo" 
            className="w-8 h-8 object-contain"
          />
        </div>

        {/* Loading text */}
        <p className="text-gray-600">Loading...</p>
      </div>
    </div>
  );
};

export default LoadingSpinner;
