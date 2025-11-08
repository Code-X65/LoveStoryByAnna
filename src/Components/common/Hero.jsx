import React, { useState, useEffect } from 'react';
import { ArrowRight, ChevronRight, ChevronLeft } from 'lucide-react';
import { Shirt, ShoppingBag, Baby, Heart, Sparkles, Users, GraduationCap, Gift } from "lucide-react";
import photo1 from '../../assets/phot1.jpg'
import photo2 from '../../assets/phot2.jpg'
import photo3 from '../../assets/phot3.jpg'
import photo4 from '../../assets/phot4.jpg'

const categories = [
  { name: 'New Arrivals', icon: Sparkles },
  { name: 'Girls Fashion', icon: Shirt },
  { name: 'Boys Fashion', icon: Users },
  { name: 'Baby Collection', icon: Baby },
  { name: 'Ankara Styles', icon: Heart },
  { name: 'School Uniforms', icon: GraduationCap },
  { name: 'Back-To-School', icon: ShoppingBag },
  { name: 'Christmas Collection', icon: Gift },
];

const banners = [
  {
    id: 1,
    title: 'Best Choice For Kids',
    subtitle: 'CLOTHING',
    description: 'Discover premium quality fashion for your little ones',
    buttonText: 'CHECKOUT COLLECTIONS',
    image:photo1
    ,
  },
  {
    id: 2,
    title: 'Festive Season',
    subtitle: 'CHRISTMAS COLLECTION',
    description: 'Special outfits for the holiday season',
    buttonText: 'SHOP NOW',
    image: photo2,
  },
  {
    id: 3,
    title: 'Fresh & Trendy',
    subtitle: 'NEW ARRIVALS',
    description: 'Latest styles just landed for your kids',
    buttonText: 'DISCOVER NOW',
    image: photo3,
  },
  {
    id: 4,
    title: 'Ladies Bags',
    subtitle: 'Bag',
    description: 'Beautiful ladies bag built fr kids',
    buttonText: 'EXPLORE COLLECTION',
    image: photo4,
  },
];

export default function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentSlide((prev) => (prev + 1) % banners.length);
        setIsTransitioning(false);
      }, 300);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const handleDotClick = (index) => {
    if (index !== currentSlide) {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentSlide(index);
        setIsTransitioning(false);
      }, 300);
    }
  };

  const goToPrevious = () => {
    handleDotClick((currentSlide - 1 + banners.length) % banners.length);
  };

  const goToNext = () => {
    handleDotClick((currentSlide + 1) % banners.length);
  };

  return (
    <div className="bg-gray-50 ">
      <div className=" ">
        <div className="flex gap-6 min-h-[400px] lg:h-[600px]">
          {/* Categories Section - Desktop Only */}
          <div className="hidden  w-72 bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
            <div className="p-5 bg-gradient-to-r from-pink-500 to-pink-400">
              <h2 className="font-bold text-xl text-white">Shop by Category</h2>
              <p className="text-pink-50 text-sm mt-1">Find what you're looking for</p>
            </div>
            <div className="divide-y divide-gray-100">
              {categories.map((category, index) => {
                const Icon = category.icon;
                return (
                  <button
                    key={index}
                    className="w-full px-5 py-4 flex items-center justify-between hover:bg-pink-50 transition-all duration-300 group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-pink-50 rounded-full flex items-center justify-center group-hover:bg-pink-100 transition-colors">
                        <Icon className="w-5 h-5 text-pink-500 group-hover:scale-110 transition-transform" />
                      </div>
                      <span className="text-gray-700 text-sm font-medium group-hover:text-pink-500 transition-colors">
                        {category.name}
                      </span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-pink-500 group-hover:translate-x-1 transition-all" />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Banner Slider Section */}
          <div className="flex-1 relative overflow-hidden  shadow-2xl">
            {banners.map((banner, index) => (
              <div
                key={banner.id}
                className={`absolute inset-0 transition-all duration-700 ${
                  index === currentSlide && !isTransitioning
                    ? 'opacity-100 scale-100'
                    : 'opacity-0 scale-105'
                }`}
              >
                <img
                  src={banner.image}
                  alt={`${banner.title} ${banner.subtitle}`}
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent" />
                
                {/* Content Overlay */}
                <div className="relative h-full flex flex-col justify-center px-8 md:px-16 lg:px-20">
                  <div className="space-y-6 max-w-2xl">
                    {/* Small Title */}
                    <div className="inline-block">
                      <span className="bg-pink-500 text-white px-4 py-2 rounded-full text-sm font-semibold uppercase tracking-wider">
                        {banner.title}
                      </span>
                    </div>
                    
                    {/* Large Subtitle */}
                    <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-white leading-tight drop-shadow-2xl">
                      {banner.subtitle}
                    </h1>
                    
                    {/* Description */}
                    <p className="text-lg md:text-xl text-white/90 font-light drop-shadow-lg max-w-md">
                      {banner.description}
                    </p>
                    
                    {/* Shop Now Button */}
                    <button className="bg-pink-500 hover:bg-pink-600 text-white px-8 py-4 rounded-lg font-bold text-base shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 flex items-center gap-3 group w-fit">
                      {banner.buttonText}
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {/* Dots Indicator */}
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-3 z-10">
              {banners.map((_, index) => (
                <button
                  key={index}
                  onClick={() => handleDotClick(index)}
                  className={`rounded-full transition-all duration-300 ${
                    index === currentSlide
                      ? 'bg-pink-500 w-12 h-3 shadow-lg'
                      : 'bg-white/60 hover:bg-white/90 w-3 h-3'
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>

            {/* Navigation Arrows */}
            <button
              onClick={goToPrevious}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-pink-500 hover:text-white p-3 rounded-full shadow-xl transition-all duration-300 hover:scale-110 z-10 group hidden"
              aria-label="Previous slide"
            >
              <ChevronLeft className="w-6 h-6 text-gray-800 group-hover:text-white" />
            </button>
            <button
              onClick={goToNext}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-pink-500 hover:text-white p-3 rounded-full shadow-xl transition-all duration-300 hover:scale-110 z-10 group hidden"
              aria-label="Next slide"
            >
              <ChevronRight className="w-6 h-6 text-gray-800 group-hover:text-white" />
            </button>
          </div>
        </div>

        {/* Mobile Categories - Horizontal Scroll */}
        <div className="lg:hidden mt-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4 px-2">Shop by Category</h3>
          <div className="overflow-x-auto pb-4 scrollbar-hide">
            <div className="flex gap-4 px-2">
              {categories.map((category, index) => {
                const Icon = category.icon;
                return (
                  <button
                    key={index}
                    className="flex-shrink-0 flex flex-col items-center gap-3 p-4 bg-white rounded-xl shadow-md border border-gray-100 hover:border-pink-500 hover:shadow-lg transition-all duration-300 min-w-[110px] group"
                  >
                    <div className="w-12 h-12 bg-pink-50 rounded-full flex items-center justify-center group-hover:bg-pink-100 transition-colors">
                      <Icon className="w-6 h-6 text-pink-500 group-hover:scale-110 transition-transform" />
                    </div>
                    <span className="text-xs font-semibold text-gray-700 text-center group-hover:text-pink-500 transition-colors">
                      {category.name}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
      
      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}