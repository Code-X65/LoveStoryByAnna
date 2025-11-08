import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Male from '../../assets/male.jpg'
import female from '../../assets/females.jpg'
import baby from '../../assets/babys.jpg'


const KidsFashionShowcase = () => {
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
      title: 'SHOP LADIES GOWN',
      image: female
    },
    {
      bg: 'bg-amber-300',
      title: 'SHOP UP BOYS DOWN',
      image: Male
    },
    {
      bg: 'bg-orange-400',
      title: 'SHOP BABIS WEAR',
      image: baby
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
      <div className="relative w-full h-screen overflow-hidden">
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
              <button className="absolute bottom-20 left-1/2 transform -translate-x-1/2 bg-white text-gray-900 px-8 py-3 font-semibold text-sm tracking-wider hover:bg-gray-100 transition-colors">
                {slide.title}
              </button>
            </div>
          ))}
        </div>

        {/* Navigation Arrows */}
        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg transition-all z-10"
        >
          <ChevronLeft size={24} className="text-gray-800" />
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg transition-all z-10"
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
    <div className=" grid grid-cols-3 h-screen">
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
  );
};

export default KidsFashionShowcase;