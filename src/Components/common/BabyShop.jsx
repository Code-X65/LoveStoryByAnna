import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const BabyShop = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const slides = [
    {
      bg: 'bg-cyan-400',
      title: 'SHOP SPECIAL OCCASION',
      image: 'https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?w=600&h=800&fit=crop'
    },
    {
      bg: 'bg-amber-300',
      title: 'SHOP SUITS',
      image: 'https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=600&h=800&fit=crop'
    }
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  useEffect(() => {
    if (isMobile) {
      const timer = setInterval(nextSlide, 4000);
      return () => clearInterval(timer);
    }
  }, [isMobile, currentSlide]);

  if (isMobile) {
    return (
      <div className="relative w-full max-h-[600px] overflow-hidden">
        <h1 className='uppercase text-center font-bold text-4xl py-6'>Baby Shop</h1>
        <div 
          className="flex transition-transform duration-500 ease-out h-full"
          style={{ transform: `translateX(-${currentSlide * 100}%)` }}
        >
          {slides.map((slide, index) => (
            <div
              key={index}
              className={`min-w-full h-full ${slide.bg} flex items-center justify-center relative`}
            >
              <img
                src={slide.image}
                alt={slide.title}
                className="w-full h-full object-cover"
              />
              <button className="absolute bottom-30 left-1/2 transform -translate-x-1/2 bg-white text-gray-900 px-8 py-3 font-semibold text-sm tracking-wider hover:bg-gray-100 transition-colors">
                {slide.title}
              </button>
            </div>
          ))}
        </div>

        {/* Navigation Arrows */}
        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg transition-all z-10 hidden"
        >
          <ChevronLeft size={24} className="text-gray-800" />
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg transition-all z-10 hidden"
        >
          <ChevronRight size={24} className="text-gray-800" />
        </button>

        {/* Dots Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-2 z-10">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-2 h-2 rounded-full transition-all ${
                currentSlide === index ? 'bg-white w-8' : 'bg-white/50'
              }`}
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
            <h1 className='text-center font-semibold py-8 text-3xl'>BABY SHOP</h1>
    <div className="grid grid-cols-2 max-w-7xl mx-auto h-">
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`${slide.bg} flex items-center justify-center relative overflow-hidden group cursor-pointer`}
        >
          <img
            src={slide.image}
            alt={slide.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300" />
          <button className="absolute bottom-20 left-1/2 transform -translate-x-1/2 bg-white text-gray-900 px-8 py-3 font-semibold text-sm tracking-wider hover:bg-gray-100 transition-all hover:scale-105 shadow-lg">
            {slide.title}
          </button>
        </div>
      ))}
    </div>

    </div>
  );
};

export default BabyShop;