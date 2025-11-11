import React, { useState, useEffect } from 'react';
import { ArrowRight, ChevronRight, ChevronLeft } from 'lucide-react';
import { Shirt, ShoppingBag, Baby, Heart, Sparkles, Users, GraduationCap, Gift } from "lucide-react";

import photo1 from '../assets/phot1.jpg'
import photo2 from '../assets/phot2.jpg'
import photo3 from '../assets/phot3.jpg'
import photo4 from '../assets/phot4.jpg'
import { Link } from 'react-router-dom';

const banners = [
  {
    id: 1,
    title: 'New Collections',
    subtitle: 'New Arrivals',
    description: 'Discover the latest trends for your little ones',
    buttonText: 'CHECKOUT COLLECTION',
    image:photo1
    ,
  },
  {
    id: 2,
    title: 'Ladies',
    subtitle: 'GRILS COLLECTION',
    description: 'Adorable outfits for every occasion',
    buttonText: 'EXPLORE COLLECTIONS',
    image: photo2,
  },
  {
    id: 3,
    title: 'Active Boys',
    subtitle: 'BOYS COLLECTION',
    description: 'Adorable outfits for every occasion',
    buttonText: 'DISCOVER NOW',
    image: photo3,
  },
  {
    id: 4,
    title: "COZY BABY'S",
    subtitle: 'BABYS COLLECTIONS',
    description: 'Gentle and cozy for your baby',
    buttonText: 'EXPLORE COLLECTION',
    image: photo4,
  },
];
const collections = [
  {
    id: 1,
    title: 'NEW ARRIVALS',
    description: 'Discover the latest trends for your little ones',
    image: photo1,
    itemCount: '250+ Items',
    href: '/collections?category=NEW+ARRIVALS'
  },
  {
    id: 2,
    title: 'GIRLS COLLECTION',
    description: 'Adorable outfits for every occasion',
    image: 'https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?w=800&h=600&fit=crop',
    itemCount: '180+ Items',
    href: '/collections?category=GIRLS'
  },
  {
    id: 3,
    title: 'BOYS COLLECTION',
    description: 'Stylish and comfortable for active boys',
    image: 'https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=800&h=600&fit=crop',
    itemCount: '160+ Items',
    href: '/collections?category=BOYS'
  },
  {
    id: 4,
    title: 'BABY COLLECTION',
    description: 'Gentle and cozy for your baby',
    image: 'https://images.unsplash.com/photo-1522771930-78848d9293e8?w=800&h=600&fit=crop',
    itemCount: '120+ Items',
    href: '/collections?category=BABY'
  },
  {
    id: 5,
    title: 'ACCESSORIES',
    description: 'Complete the look with perfect accessories',
    image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800&h=600&fit=crop',
    itemCount: '90+ Items',
    href: '/collections?category=ACCESSORIES'
  },
  {
    id: 6,
    title: 'FOOTWEAR',
    description: 'Shoes for every step of their journey',
    image: 'https://images.unsplash.com/photo-1514989940723-e8e51635b782?w=800&h=600&fit=crop',
    itemCount: '75+ Items',
    href: '/collections?category=FOOTWEAR'
  }
];

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
 

export default function CollectionPage() {
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
    <div className="bg-white min-h-screen">
      {/* Hero Section */}
   <div className="flex gap-6 min-h-[400px] lg:h-[600px]">
 
  
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
                    className="absolute inset-0 w-full h-full object-cover bg-fixed "
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

      {/* Collections Grid */}
      <main className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {collections.map(collection => (
            <div 
              key={collection.id} 
              className="bg-white border border-gray-200 overflow-hidden group cursor-pointer hover:shadow-lg transition-shadow"
            >
              <div className="relative overflow-hidden aspect-[4/3]">
                <img 
                  src={collection.image} 
                  alt={collection.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-pink-100/[0.3]  group-hover:bg-black/[0.2] transition-normal animation-all duration-300"></div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2">{collection.title}</h3>
                <p className="text-gray-600 text-sm mb-4">{collection.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-pink-300 text-sm font-medium">{collection.itemCount}</span>
                  <Link to={collection.href}>
                  <button className="bg-pink-300 text-white px-6 py-2 text-sm font-medium hover:bg-pink-400 transition-colors">
                    Explore
                  </button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Footer Banner */}
      <section className="bg-pink-50 py-12 mt-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h3 className="text-2xl font-bold mb-4">Can't find what you're looking for?</h3>
          <p className="text-gray-600 mb-6">Browse all our products or contact our customer service</p>
          <div className="flex gap-4 justify-center flex-wrap">
            <button className="bg-pink-300 text-white px-8 py-3 font-medium hover:bg-pink-400 transition-colors">
              View All Products
            </button>
            <button className="border-2 border-pink-300 text-pink-300 px-8 py-3 font-medium hover:bg-pink-50 transition-colors">
              Contact Us
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}