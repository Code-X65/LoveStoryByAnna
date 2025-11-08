import React from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import baby from '../../assets/baby.png'
export default function BabyBanner() {
  return (
    <div className="bg-white py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="relative overflow-hidden bg-gradient-to-r from-pink-50 to-pink-100 rounded shadow-xl">
          <div className="grid md:grid-cols-2 gap-0">
            {/* Left Side - Image */}
            <div className="relative h-64 md:h-full min-h-[400px] order-2 md:order-1">
              <img
                src={baby}
                alt="Baby crawling"
                className="absolute inset-0 w-full h-full object-cover"
              />
              {/* Decorative Elements */}
              <div className="absolute top-6 left-6 w-16 h-16 bg-pink-400/20 rounded-full blur-2xl"></div>
              <div className="absolute bottom-10 right-10 w-20 h-20 bg-pink-500/20 rounded-full blur-2xl"></div>
            </div>

            {/* Right Side - Content */}
            <div className="relative flex items-center justify-center p-8 md:p-12 lg:p-16 order-1 md:order-2">
              <div className="space-y-6 max-w-lg">
                {/* Badge */}
                <div className="inline-flex items-center gap-2 bg-pink-500 text-white px-4 py-2 rounded-sm">
                  <Sparkles className="w-4 h-4" />
                  <span className="text-xs font-bold uppercase tracking-wider">
                    New Collection
                  </span>
                </div>

                {/* Heading */}
                <div className="space-y-3">
                  <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 leading-tight">
                    BABY
                    <span className="block text-pink-600">ESSENTIALS</span>
                  </h2>
                  <p className="text-lg text-gray-600 leading-relaxed">
                    Soft, comfortable & adorable clothing designed for your little one's first adventures
                  </p>
                </div>

                {/* Features */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-pink-500 rounded-full mt-2"></div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">100% Cotton</p>
                      <p className="text-xs text-gray-500">Gentle on skin</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-pink-500 rounded-full mt-2"></div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">Easy Care</p>
                      <p className="text-xs text-gray-500">Machine washable</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-pink-500 rounded-full mt-2"></div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">Age 0-24M</p>
                      <p className="text-xs text-gray-500">Perfect fit</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-pink-500 rounded-full mt-2"></div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">Certified Safe</p>
                      <p className="text-xs text-gray-500">Non-toxic materials</p>
                    </div>
                  </div>
                </div>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                  <button className="bg-pink-600 hover:bg-pink-700 text-white px-8 py-4 rounded font-bold text-base shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center justify-center gap-3 group">
                    SHOP BABY COLLECTION
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </button>
                  <button className="bg-white hover:bg-gray-50 text-pink-600 border-2 border-pink-600 px-8 py-4 rounded font-bold text-base shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-300">
                    VIEW LOOKBOOK
                  </button>
                </div>

                {/* Price Tag */}
                <div className="inline-flex items-baseline gap-2 bg-white px-4 py-2 rounded shadow-md">
                  <span className="text-xs text-gray-500 uppercase tracking-wide">Starting from</span>
                  <span className="text-2xl font-bold text-pink-600">₦15,950</span>
                </div>
              </div>

              {/* Background Decorations */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-pink-200/30 rounded-full blur-3xl"></div>
              <div className="absolute bottom-0 left-0 w-40 h-40 bg-pink-300/20 rounded-full blur-3xl"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}