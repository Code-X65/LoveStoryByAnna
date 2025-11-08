import React from 'react';
import { Heart } from 'lucide-react';

const SpecialMomentsBanner = () => {
  return (
    <div className="w-full hidden md:block bg-pink-100 py-6 px-4 md:px-8">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Left Side - CTA Button */}
        <div className="flex-shrink-0">
          <button className="bg-[#98cdb4] text-black font-semibold px-8 py-3 text-sm tracking-wider transition-all duration-300 hover:shadow-lg hover:shadow-yellow-600/50">
            SHOP NOW
          </button>
        </div>

        {/* Right Side - Brand Text */}
        <div className="text-right ml-8">
          <h2 className="text-3xl md:text-4xl font-serif italic bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 bg-clip-text text-transparent flex items-center justify-end gap-2">
           November 
            <Heart className="text-pink-500 fill-pink-500" size={28} />
            Collection  
          </h2>
          <p className="text-gray-400 text-sm mt-1 tracking-wide">
            The Perfect Outfit for Every Memory
          </p>
        </div>
      </div>
    </div>
  );
};

export default SpecialMomentsBanner;