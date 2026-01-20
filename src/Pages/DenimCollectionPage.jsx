import React, { useState } from 'react';
import { Heart, ShoppingCart, Filter, X, ChevronDown, Sparkles, Crown, Star, TrendingUp, Zap, Award, Gift } from 'lucide-react';
import { useWishlist } from '../Context/WishlistContext';
import { useCart } from '../Context/CartContext';
import { useAuth } from '../Context/AuthContextCore';
import { useToast } from '../Context/ToastContext';
import Logo from '../assets/Logo.png';

import { girlsProducts, boysProducts } from '../Components/Data/productsData';

const allProducts = [...girlsProducts, ...boysProducts];

function ProductCard({ product }) {
  const [isHovered, setIsHovered] = useState(false);
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { addItemToCart } = useCart();
  const { currentUser } = useAuth();
  const toast = useToast();

  const isFavorite = isInWishlist(product.id);

  const handleToggleFavorite = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!currentUser) {
      toast.warning('Please login to save to wishlist');
      return;
    }
    await toggleWishlist(product);
  };

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await addItemToCart({
        ...product,
        quantity: 1,
        selectedSize: product.sizes?.[0] || 'One Size'
      });
      toast.success('Added to cart!');
    } catch (err) {
      toast.error('Failed to add to cart');
    }
  };

  return (
    <div className="group cursor-pointer relative">
      {/* Premium Badge */}
      <div className="absolute top-2 sm:top-3 left-2 sm:left-3 z-10 bg-gradient-to-r from-[#F9E08C] to-[#F5A9B8] text-gray-900 px-2 sm:px-3 py-1 rounded-full text-[10px] sm:text-xs font-bold flex items-center gap-1 shadow-lg">
        <Crown className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
        <span className="hidden sm:inline">PREMIUM</span>
        <span className="sm:hidden">VIP</span>
      </div>

      <div
        className="relative overflow-hidden bg-gradient-to-br from-[#9DD9D2]/20 to-[#F5A9B8]/20 mb-3 sm:mb-4 aspect-[3/4] rounded-lg sm:rounded-xl shadow-lg transition-all duration-500 group-hover:shadow-2xl group-hover:scale-[1.02]"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <img
          src={product.image1}
          alt={product.name}
          className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 ${isHovered ? 'opacity-0 scale-110' : 'opacity-100 scale-100'
            }`}
        />
        <img
          src={product.image2}
          alt={product.name}
          className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 ${isHovered ? 'opacity-100 scale-110' : 'opacity-0 scale-100'
            }`}
        />

        {/* Gradient Overlay */}
        <div
          className={`absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent transition-opacity duration-500 ${isHovered ? 'opacity-100' : 'opacity-0'
            }`}
        />

        <div className={`absolute inset-0 transition-opacity duration-500 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
          <div className="absolute top-2 sm:top-4 right-2 sm:right-4 flex flex-col gap-1.5 sm:gap-2">
            <button
              onClick={handleToggleFavorite}
              className={`p-2 sm:p-3 rounded-full backdrop-blur-md transition-all duration-300 transform hover:scale-110 ${isFavorite
                  ? 'bg-gradient-to-r from-[#F5A9B8] to-[#F9E08C] text-white shadow-lg'
                  : 'bg-white/90 text-gray-700 hover:bg-gradient-to-r hover:from-[#F5A9B8] hover:to-[#F9E08C] hover:text-white'
                }`}
            >
              <Heart className={`w-3.5 h-3.5 sm:w-5 sm:h-5 ${isFavorite ? 'fill-current' : ''}`} />
            </button>
          </div>

          <div className="absolute bottom-2 sm:bottom-4 left-2 sm:left-4 right-2 sm:right-4">
            <button
              onClick={handleAddToCart}
              className="w-full bg-gradient-to-r from-[#9DD9D2] via-[#F5A9B8] to-[#F9E08C] text-gray-900 py-2 sm:py-3 px-3 sm:px-4 rounded-lg sm:rounded-xl font-bold text-xs sm:text-sm transition-all duration-500 transform hover:scale-105 flex items-center justify-center gap-1.5 sm:gap-2 shadow-xl border border-white/20"
            >
              <ShoppingCart className="w-3.5 h-3.5 sm:w-5 sm:h-5" />
              <span className="hidden sm:inline">ADD TO CART</span>
              <span className="sm:hidden">ADD</span>
              <Zap className="w-3 h-3 sm:w-4 sm:h-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="text-center space-y-1.5 sm:space-y-3 px-1 sm:px-2">
        <div className="flex items-center justify-center gap-0.5 sm:gap-1 mb-1">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className="w-2.5 h-2.5 sm:w-3 sm:h-3 fill-[#F9E08C] text-[#F9E08C]" />
          ))}
        </div>
        <h3 className="text-[10px] sm:text-xs font-bold text-gray-900 uppercase tracking-wider hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-[#9DD9D2] hover:to-[#F5A9B8] transition-all duration-300 line-clamp-2">
          {product.name}
        </h3>
        <div className="flex items-center justify-center gap-1.5 sm:gap-2">
          <p className="text-sm sm:text-lg font-black bg-gradient-to-r from-[#F5A9B8] to-[#9DD9D2] bg-clip-text text-transparent">
            ₦{product.price.toLocaleString()}
          </p>
          <span className="px-1.5 sm:px-2 py-0.5 bg-gradient-to-r from-[#9DD9D2] to-[#F9E08C] text-gray-900 text-[10px] sm:text-xs font-bold rounded-full">
            -20%
          </span>
        </div>
      </div>
    </div>
  );
}

export default function DenimCollectionPage() {
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [selectedType, setSelectedType] = useState('ALL');
  const [sortBy, setSortBy] = useState('featured');
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [priceRange, setPriceRange] = useState([0, 100000]);

  const types = ['ALL', ...new Set(allProducts.map((p) => p.type))];

  let filteredProducts = allProducts.filter((product) => {
    const categoryMatch = selectedCategory === 'ALL' || product.category === selectedCategory;
    const typeMatch = selectedType === 'ALL' || product.type === selectedType;
    const priceMatch = product.price >= priceRange[0] && product.price <= priceRange[1];
    return categoryMatch && typeMatch && priceMatch;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      case 'name':
        return a.name.localeCompare(b.name);
      default:
        return 0;
    }
  });

  return (
    <div className="bg-gradient-to-br from-[#9DD9D2]/10 via-white to-[#F5A9B8]/10 min-h-screen">
      {/* Mobile-First Hero Section */}
      <div className="relative bg-gradient-to-br from-[#9DD9D2] via-[#F5A9B8] to-[#F9E08C] text-gray-900 overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-10 left-10 w-20 sm:w-32 h-20 sm:h-32 bg-white rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-10 right-10 w-24 sm:w-40 h-24 sm:h-40 bg-white rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 w-28 sm:w-36 h-28 sm:h-36 bg-white rounded-full blur-3xl animate-pulse delay-500"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 md:py-20 relative z-10">
          {/* Logo */}
          <div className="flex justify-center mb-6 sm:mb-8">
            <img src={Logo} alt="Love Story by Anna" className="h-16 sm:h-20 md:h-24 w-auto drop-shadow-2xl" />
          </div>

          {/* VIP Badge */}
          <div className="flex justify-center mb-4 sm:mb-6">
            <div className="inline-flex items-center gap-1.5 sm:gap-2 bg-white/90 backdrop-blur-sm text-gray-900 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-bold shadow-xl">
              <Crown className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              EXCLUSIVE VIP COLLECTION
              <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>
          </div>

          {/* Main Title */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black uppercase tracking-wider mb-3 sm:mb-4 text-center text-white drop-shadow-2xl">
            DENIM COLLECTION
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-xl md:text-2xl font-light mb-6 sm:mb-8 text-center text-white/90 max-w-2xl mx-auto px-4">
            Premium Luxury Denim Wear for Kids
          </p>

          {/* Stats */}
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 md:gap-8 max-w-3xl mx-auto">
            <div className="flex items-center gap-1.5 sm:gap-2 bg-white/20 backdrop-blur-md px-3 sm:px-4 py-2 sm:py-2.5 rounded-full">
              <Star className="w-4 h-4 sm:w-5 sm:h-5 fill-white text-white" />
              <span className="text-xs sm:text-sm font-semibold text-white">5.0 Rating</span>
            </div>
            <div className="hidden sm:block w-px h-6 bg-white/30"></div>
            <div className="flex items-center gap-1.5 sm:gap-2 bg-white/20 backdrop-blur-md px-3 sm:px-4 py-2 sm:py-2.5 rounded-full">
              <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              <span className="text-xs sm:text-sm font-semibold text-white">{sortedProducts.length} Items</span>
            </div>
            <div className="hidden sm:block w-px h-6 bg-white/30"></div>
            <div className="flex items-center gap-1.5 sm:gap-2 bg-white/20 backdrop-blur-md px-3 sm:px-4 py-2 sm:py-2.5 rounded-full">
              <Award className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              <span className="text-xs sm:text-sm font-semibold text-white">Premium Quality</span>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center mt-8 sm:mt-10 max-w-md mx-auto">
            <button className="flex-1 bg-white text-gray-900 px-6 sm:px-8 py-3 sm:py-4 rounded-full font-bold text-sm sm:text-base shadow-2xl hover:scale-105 transition-transform duration-300 flex items-center justify-center gap-2">
              <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5" />
              Shop Now
            </button>
            <button className="flex-1 bg-gray-900 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-full font-bold text-sm sm:text-base shadow-2xl hover:scale-105 transition-transform duration-300 flex items-center justify-center gap-2">
              <Gift className="w-4 h-4 sm:w-5 sm:h-5" />
              Gift Guide
            </button>
          </div>
        </div>

        {/* Decorative Wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
            <path
              d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z"
              fill="white"
              fillOpacity="0.1"
            />
          </svg>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="flex flex-col lg:flex-row gap-6 sm:gap-8">
          {/* Desktop Sidebar Filters */}
          <div className="hidden lg:block w-72 flex-shrink-0">
            <div className="sticky top-4 space-y-6">
              {/* VIP Benefits Card */}
              <div className="bg-gradient-to-br from-[#F9E08C]/20 to-[#F5A9B8]/20 border-2 border-[#F9E08C] rounded-2xl p-6 shadow-xl">
                <div className="flex items-center gap-2 mb-4">
                  <Crown className="w-6 h-6 text-[#F5A9B8]" />
                  <h3 className="font-black text-gray-900 uppercase">VIP Benefits</h3>
                </div>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#9DD9D2]" />
                    Free Express Shipping
                  </li>
                  <li className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#9DD9D2]" />
                    30-Day Premium Returns
                  </li>
                  <li className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#9DD9D2]" />
                    Exclusive Member Pricing
                  </li>
                </ul>
              </div>

              {/* Category Filter */}
              <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-gray-200">
                <h3 className="font-black text-gray-900 mb-4 uppercase tracking-wide flex items-center gap-2">
                  <Filter className="w-5 h-5 text-[#F5A9B8]" />
                  Category
                </h3>
                <div className="space-y-2">
                  {['ALL', 'GIRLS', 'BOYS'].map((category) => (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={`w-full text-left px-4 py-3 rounded-xl transition-all duration-300 font-semibold ${selectedCategory === category
                          ? 'bg-gradient-to-r from-[#9DD9D2] to-[#F5A9B8] text-white shadow-lg scale-105'
                          : 'bg-gray-50 text-gray-700 hover:bg-gradient-to-r hover:from-[#9DD9D2]/20 hover:to-[#F5A9B8]/20'
                        }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>

              {/* Type Filter */}
              <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-gray-200">
                <h3 className="font-black text-gray-900 mb-4 uppercase tracking-wide">Type</h3>
                <div className="space-y-2 max-h-64 overflow-y-auto custom-scrollbar">
                  {types.map((type) => (
                    <button
                      key={type}
                      onClick={() => setSelectedType(type)}
                      className={`w-full text-left px-4 py-3 rounded-xl transition-all duration-300 text-sm font-semibold ${selectedType === type
                          ? 'bg-gradient-to-r from-[#9DD9D2] to-[#F5A9B8] text-white shadow-lg'
                          : 'bg-gray-50 text-gray-700 hover:bg-gradient-to-r hover:from-[#9DD9D2]/20 hover:to-[#F5A9B8]/20'
                        }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-gray-200">
                <h3 className="font-black text-gray-900 mb-4 uppercase tracking-wide">Price Range</h3>
                <div className="space-y-4">
                  <div className="flex justify-between text-sm font-bold">
                    <span className="text-[#9DD9D2]">₦{priceRange[0].toLocaleString()}</span>
                    <span className="text-[#F5A9B8]">₦{priceRange[1].toLocaleString()}</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100000"
                    step="5000"
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([0, parseInt(e.target.value)])}
                    className="w-full accent-[#F5A9B8]"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4 mb-6 sm:mb-8">
              <button
                onClick={() => setShowMobileFilters(!showMobileFilters)}
                className="lg:hidden flex items-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-[#9DD9D2] to-[#F5A9B8] text-white rounded-xl hover:shadow-lg transition-all duration-300 font-bold text-sm w-full sm:w-auto justify-center"
              >
                <Filter className="w-4 h-4 sm:w-5 sm:h-5" />
                Filters
              </button>

              <div className="flex items-center gap-3 sm:gap-4 ml-auto w-full sm:w-auto">
                <label className="text-xs sm:text-sm text-gray-700 font-bold whitespace-nowrap">Sort by:</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="flex-1 sm:flex-none px-3 sm:px-6 py-2 sm:py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#F5A9B8] focus:border-transparent font-semibold bg-white shadow-lg transition-all duration-300 text-xs sm:text-sm"
                >
                  <option value="featured">✨ Featured</option>
                  <option value="price-low">💰 Price: Low to High</option>
                  <option value="price-high">💎 Price: High to Low</option>
                  <option value="name">🔤 Name: A-Z</option>
                </select>
              </div>
            </div>

            {/* Active Filters */}
            {(selectedCategory !== 'ALL' || selectedType !== 'ALL') && (
              <div className="flex flex-wrap gap-2 sm:gap-3 mb-6 sm:mb-8">
                {selectedCategory !== 'ALL' && (
                  <span className="inline-flex items-center gap-1.5 sm:gap-2 bg-gradient-to-r from-[#9DD9D2] to-[#F5A9B8] text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-bold shadow-lg">
                    {selectedCategory}
                    <button onClick={() => setSelectedCategory('ALL')} className="hover:scale-110 transition-transform">
                      <X className="w-3 h-3 sm:w-4 sm:h-4" />
                    </button>
                  </span>
                )}
                {selectedType !== 'ALL' && (
                  <span className="inline-flex items-center gap-1.5 sm:gap-2 bg-gradient-to-r from-[#9DD9D2] to-[#F5A9B8] text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-bold shadow-lg">
                    {selectedType}
                    <button onClick={() => setSelectedType('ALL')} className="hover:scale-110 transition-transform">
                      <X className="w-3 h-3 sm:w-4 sm:h-4" />
                    </button>
                  </span>
                )}
              </div>
            )}

            {/* Products Grid - Mobile Optimized */}
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 md:gap-6 lg:gap-8">
              {sortedProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            {/* No Results */}
            {sortedProducts.length === 0 && (
              <div className="text-center py-12 sm:py-20 bg-white/50 backdrop-blur-lg rounded-2xl sm:rounded-3xl shadow-xl">
                <Sparkles className="w-12 h-12 sm:w-16 sm:h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-600 text-lg sm:text-xl font-bold mb-2">No premium items found</p>
                <p className="text-gray-500 mb-4 sm:mb-6 text-sm sm:text-base px-4">
                  Try adjusting your filters to discover more luxury pieces
                </p>
                <button
                  onClick={() => {
                    setSelectedCategory('ALL');
                    setSelectedType('ALL');
                    setPriceRange([0, 100000]);
                  }}
                  className="bg-gradient-to-r from-[#9DD9D2] to-[#F5A9B8] text-white px-6 sm:px-8 py-2.5 sm:py-3 rounded-xl font-bold hover:shadow-lg transition-all duration-300 text-sm sm:text-base"
                >
                  Clear all filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filters Overlay */}
      {showMobileFilters && (
        <div className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-50" onClick={() => setShowMobileFilters(false)}>
          <div
            className="absolute right-0 top-0 bottom-0 w-full sm:w-80 bg-gradient-to-br from-white to-[#F5A9B8]/10 p-4 sm:p-6 overflow-y-auto shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-6 sm:mb-8">
              <h2 className="text-xl sm:text-2xl font-black bg-gradient-to-r from-[#9DD9D2] to-[#F5A9B8] bg-clip-text text-transparent">
                Filters
              </h2>
              <button onClick={() => setShowMobileFilters(false)} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <X className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="font-black mb-3 text-gray-900 text-sm sm:text-base">Category</h3>
                <div className="space-y-2">
                  {['ALL', 'GIRLS', 'BOYS'].map((category) => (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={`w-full text-left px-4 py-3 rounded-xl font-semibold transition-all text-sm ${selectedCategory === category
                          ? 'bg-gradient-to-r from-[#9DD9D2] to-[#F5A9B8] text-white shadow-lg'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-black mb-3 text-gray-900 text-sm sm:text-base">Type</h3>
                <div className="space-y-2 max-h-48 overflow-y-auto custom-scrollbar">
                  {types.map((type) => (
                    <button
                      key={type}
                      onClick={() => setSelectedType(type)}
                      className={`w-full text-left px-4 py-3 rounded-xl text-sm font-semibold transition-all ${selectedType === type
                          ? 'bg-gradient-to-r from-[#9DD9D2] to-[#F5A9B8] text-white shadow-lg'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-black mb-3 text-gray-900 text-sm sm:text-base">Price Range</h3>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm font-bold">
                    <span className="text-[#9DD9D2]">₦{priceRange[0].toLocaleString()}</span>
                    <span className="text-[#F5A9B8]">₦{priceRange[1].toLocaleString()}</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100000"
                    step="5000"
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([0, parseInt(e.target.value)])}
                    className="w-full accent-[#F5A9B8]"
                  />
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowMobileFilters(false)}
              className="w-full mt-6 sm:mt-8 bg-gradient-to-r from-[#9DD9D2] to-[#F5A9B8] text-white py-3 sm:py-4 rounded-xl font-black shadow-lg hover:shadow-xl transition-all duration-300 text-sm sm:text-base"
            >
              Apply Filters
            </button>
          </div>
        </div>
      )}

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: linear-gradient(to bottom, #9dd9d2, #f5a9b8);
          border-radius: 10px;
        }
        .delay-500 {
          animation-delay: 0.5s;
        }
        .delay-1000 {
          animation-delay: 1s;
        }
      `}</style>
    </div>
  );
}