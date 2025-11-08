import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Star, ShoppingCart } from 'lucide-react';

const FeaturedProductsCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

const products = [
 {
    id: 1,
    name: "Boys Graphic T-Shirt",
    price: 24.99,
    originalPrice: 34.99,
    image: "https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=500&h=500&fit=crop",
    rating: 4.8,
    reviews: 210,
    badge: "Trending",
    discount: "-29%",
  },
  {
    id: 2,
    name: "Girls Floral Dress",
    price: 39.99,
    originalPrice: 59.99,
    image: "https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?w=500&h=500&fit=crop",
    rating: 4.9,
    reviews: 385,
    badge: "Best Seller",
    discount: "-33%",
  },
  {
    id: 3,
    name: "Boys Two-Piece Set",
    price: 44.99,
    originalPrice: 64.99,
    image: "https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=500&h=500&fit=crop",
    rating: 4.7,
    reviews: 156,
    badge: "Top Rated",
    discount: "-31%",
  },
  {
    id: 4,
    name: "Girls Denim Jacket",
    price: 49.99,
    originalPrice: 74.99,
    image: "https://images.unsplash.com/photo-1503342394128-c104d54dba01?w=500&h=500&fit=crop",
    rating: 4.8,
    reviews: 267,
    badge: "Trending",
    discount: "-33%",
  },
  {
    id: 5,
    name: "Boys Jeans",
    price: 34.99,
    originalPrice: 49.99,
    image: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=500&h=500&fit=crop",
    rating: 4.6,
    reviews: 182,
    badge: "Popular",
    discount: "-30%",
  },
  {
    id: 6,
    name: "Girls Cardigan Set",
    price: 42.99,
    originalPrice: 59.99,
    image: "https://images.unsplash.com/photo-1596755389378-c31d21fd1273?w=500&h=500&fit=crop",
    rating: 4.9,
    reviews: 309,
    badge: "Best Seller",
    discount: "-28%",
  },
  {
    id: 7,
    name: "Boys Hoodie & Joggers Set",
    price: 54.99,
    originalPrice: 79.99,
    image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=500&h=500&fit=crop",
    rating: 4.8,
    reviews: 245,
    badge: "Trending",
    discount: "-31%",
  },
  {
    id: 8,
    name: "Girls Hair Accessories Pack",
    price: 19.99,
    originalPrice: 29.99,
    image: "https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?w=500&h=500&fit=crop",
    rating: 4.7,
    reviews: 127,
    badge: "Top Rated",
    discount: "-33%",
  },
];


 const [itemsPerPage, setItemsPerPage] = useState(4);
 const maxIndex = Math.max(0, products.length - itemsPerPage);

  const nextSlide = () => {
    setCurrentIndex((prev) => Math.min(prev + 1, maxIndex));
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => Math.max(prev - 1, 0));
  };
   useEffect(() => {
     const updateItemsPerPage = () => {
       if (window.innerWidth < 640) setItemsPerPage(1);
       else if (window.innerWidth < 1024) setItemsPerPage(2);
       else setItemsPerPage(4);
     };
     
     updateItemsPerPage();
     window.addEventListener('resize', updateItemsPerPage);
     return () => window.removeEventListener('resize', updateItemsPerPage);
   }, []);

  return (
    <div className="min-h-screen bg-white py-16 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">Featured Products</h2>
          <p className="text-gray-600 text-base sm:text-lg">Top-selling and trending items just for you</p>
        </div>

        {/* Carousel Container */}
        <div className="relative">
          {/* Navigation Buttons */}
          <button
            onClick={prevSlide}
            disabled={currentIndex === 0}
            className={`absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 w-12 h-12 rounded-full bg-white shadow-lg flex items-center justify-center transition-all ${
              currentIndex === 0
                ? 'opacity-50 cursor-not-allowed'
                : 'hover:bg-pink-500 hover:text-white'
            }`}
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <button
            onClick={nextSlide}
            disabled={currentIndex === maxIndex}
            className={`absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 w-12 h-12 rounded-full bg-white shadow-lg flex items-center justify-center transition-all ${
              currentIndex === maxIndex
                ? 'opacity-50 cursor-not-allowed'
                : 'hover:bg-pink-500 hover:text-white'
            }`}
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Products Grid */}
          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-500 ease-out"
              style={{
                transform: `translateX(-${currentIndex * (100 / itemsPerPage)}%)`
              }}
            >
              {products.map((product) => (
                <div
                  key={product.id}
                  className="w-full sm:w-1/2 lg:w-1/4 flex-shrink-0 px-3"
                >
                  <div className="bg-white  shadow-lg overflow-hidden group hover:shadow-2xl transition-shadow duration-300">
                    {/* Image Container */}
                    <div className="relative overflow-hidden bg-gray-100">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-72 object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      {/* Badge */}
                      <div className="absolute top-4 left-4 bg-pink-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                        {product.badge}
                      </div>
                      {/* Discount */}
                      <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                        {product.discount}
                      </div>
                      {/* Quick Add Button */}
                      <button className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-pink-500 text-white px-6 py-3 rounded-full font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center gap-2 hover:bg-pink-600">
                        <ShoppingCart className="w-5 h-5" />
                        Add to Cart
                      </button>
                    </div>

                    {/* Product Info */}
                    <div className="p-5">
                      <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-1">
                        {product.name}
                      </h3>

                      {/* Rating */}
                      <div className="flex items-center gap-2 mb-3">
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${
                                i < Math.floor(product.rating)
                                  ? 'fill-pink-500 text-pink-500'
                                  : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-sm text-gray-600">
                          {product.rating} ({product.reviews})
                        </span>
                      </div>

                      {/* Price */}
                      <div className="flex items-center gap-3">
                        <span className="text-2xl font-bold text-pink-500">
                          ${product.price}
                        </span>
                        <span className="text-lg text-gray-400 line-through">
                          ${product.originalPrice}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Dots Indicator */}
          <div className="flex justify-center gap-2 mt-8">
            {[...Array(maxIndex + 1)].map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`h-2 rounded-full transition-all ${
                  idx === currentIndex
                    ? 'w-8 bg-pink-500'
                    : 'w-2 bg-gray-300 hover:bg-pink-300'
                }`}
              />
            ))}
          </div>
        </div>

        {/* View All Button */}
        <div className="text-center mt-12">
          <button className="bg-pink-500 text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-pink-600 transition-colors shadow-lg hover:shadow-xl">
            View All Products
          </button>
        </div>
      </div>
    </div>
  );
};

export default FeaturedProductsCarousel;