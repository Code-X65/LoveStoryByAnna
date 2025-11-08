import React, { useState, useEffect } from 'react';
import { Home, Search, ArrowLeft } from 'lucide-react';

const NotFoundPage = () => {
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          // Redirect to homepage
          window.location.href = '/';
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleGoHome = () => {
    window.location.href = '/';
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="max-w-2xl w-full text-center">
        {/* 404 Number */}
        <div className="mb-8">
          <h1 className="text-9xl md:text-[200px] font-bold text-pink-300 leading-none">
            404
          </h1>
        </div>

        {/* Main Message */}
        <div className="mb-8">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Oops! Page Not Found
          </h2>
          <p className="text-lg text-gray-600 mb-2">
            The page you're looking for doesn't exist or has been moved.
          </p>
          <p className="text-md text-gray-500">
            Don't worry, we'll help you find your way back!
          </p>
        </div>

        {/* Countdown Timer */}
        <div className="mb-8 p-6 bg-pink-50 border-2 border-pink-300 rounded-lg inline-block">
          <p className="text-gray-700 mb-2">
            Redirecting to homepage in
          </p>
          <div className="text-5xl font-bold text-pink-300">
            {countdown}
          </div>
          <p className="text-sm text-gray-600 mt-2">
            seconds
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
          <button
            onClick={handleGoHome}
            className="px-8 py-3 bg-pink-300 text-white font-semibold hover:bg-pink-400 transition-colors flex items-center justify-center gap-2"
          >
            <Home size={20} />
            Go to Homepage
          </button>
          <button
            onClick={() => window.history.back()}
            className="px-8 py-3 border-2 border-pink-300 text-pink-300 font-semibold hover:bg-pink-50 transition-colors flex items-center justify-center gap-2"
          >
            <ArrowLeft size={20} />
            Go Back
          </button>
        </div>

        {/* Search Suggestion */}
        <div className="text-gray-500 flex items-center justify-center gap-2">
          <Search size={18} />
          <span className="text-sm">
            Try searching for what you need from our homepage
          </span>
        </div>

        {/* Decorative Elements */}
        <div className="mt-12 flex justify-center gap-4">
          <div className="w-3 h-3 bg-pink-300 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
          <div className="w-3 h-3 bg-pink-300 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
          <div className="w-3 h-3 bg-pink-300 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;