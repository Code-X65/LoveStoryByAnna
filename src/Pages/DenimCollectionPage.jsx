import React, { useState } from 'react';
import { Heart, ShoppingCart, Filter, X, ChevronDown, Sparkles, Crown, Star, TrendingUp, Zap } from 'lucide-react';
import man from '../assets/man.png'

import woman from '../assets/woman.png'

import {girlsProducts, boysProducts} from '../Components/Data/productsData'

const allProducts = [...girlsProducts, ...boysProducts];

function ProductCard({ product }) {
  const [isHovered, setIsHovered] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);

  return (
    <div className="group cursor-pointer relative">
      {/* Premium Badge */}
      <div className="absolute top-3 left-3 z-10 bg-gradient-to-r from-amber-400 to-yellow-500 text-black px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-lg">
        <Crown className="w-3 h-3" />
        PREMIUM
      </div>
   
      <div 
        className="relative overflow-hidden bg-gradient-to-br from-gray-900 to-gray-800 mb-4 aspect-[3/4] rounded-lg shadow-xl transition-all duration-500 group-hover:shadow-2xl group-hover:scale-[1.02]"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <img
          src={product.image1}
          alt={product.name}
          className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 ${
            isHovered ? 'opacity-0 scale-110' : 'opacity-100 scale-100'
          }`}
        />
        <img
          src={product.image2}
          alt={product.name}
          className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 ${
            isHovered ? 'opacity-100 scale-110' : 'opacity-0 scale-100'
          }`}
        />

        {/* Gradient Overlay */}
        <div className={`absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent transition-opacity duration-500 ${
          isHovered ? 'opacity-100' : 'opacity-0'
        }`} />

        <div className={`absolute inset-0 transition-opacity duration-500 ${
          isHovered ? 'opacity-100' : 'opacity-0'
        }`}>
          <div className="absolute top-4 right-4 flex flex-col gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsWishlisted(!isWishlisted);
              }}
              className={`p-3 rounded-full backdrop-blur-md transition-all duration-300 transform hover:scale-110 ${
                isWishlisted 
                  ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-lg shadow-pink-500/50' 
                  : 'bg-white/90 text-gray-700 hover:bg-gradient-to-r hover:from-pink-500 hover:to-rose-500 hover:text-white'
              }`}
            >
              <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-current' : ''}`} />
            </button>
            <button className="p-3 rounded-full bg-white/90 backdrop-blur-md text-gray-700 hover:bg-gradient-to-r hover:from-amber-400 hover:to-yellow-500 hover:text-black transition-all duration-300 transform hover:scale-110">
              <Sparkles className="w-5 h-5" />
            </button>
          </div>

          <div className="absolute bottom-4 left-4 right-4">
            <button className="w-full bg-gradient-to-r from-pink-500 via-purple-500 to-pink-500 bg-size-200 bg-pos-0 hover:bg-pos-100 text-white py-4 px-4 rounded-xl font-bold text-sm transition-all duration-500 transform hover:scale-105 flex items-center justify-center gap-2 shadow-2xl shadow-pink-500/50 border border-white/20">
              <ShoppingCart className="w-5 h-5" />
              ADD TO CART
              <Zap className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="text-center space-y-3 px-2">
        <div className="flex items-center justify-center gap-1 mb-1">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />
          ))}
        </div>
        <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-pink-500 hover:to-purple-500 transition-all duration-300">
          {product.name}
        </h3>
        <div className="flex items-center justify-center gap-2">
          <p className="text-lg font-black bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
            ₦{product.price.toLocaleString()}
          </p>
          <span className="px-2 py-0.5 bg-gradient-to-r from-green-400 to-emerald-500 text-white text-xs font-bold rounded-full">
            -20%
          </span>
        </div>
      </div>

      <style jsx>{`
        .bg-size-200 {
          background-size: 200% 100%;
        }
        .bg-pos-0 {
          background-position: 0% 0%;
        }
        .bg-pos-100 {
          background-position: 100% 0%;
        }
      `}</style>
    </div>
  );
}

export default function DenimCollectionPage() {
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [selectedType, setSelectedType] = useState('ALL');
  const [sortBy, setSortBy] = useState('featured');
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [priceRange, setPriceRange] = useState([0, 100000]);

  const types = ['ALL', ...new Set(allProducts.map(p => p.type))];
  
  let filteredProducts = allProducts.filter(product => {
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
    <div className="bg-gradient-to-br from-gray-50 via-pink-50 to-purple-50 min-h-screen">
      {/* Luxury Header Banner */}
      <div className="relative bg-gradient-to-r from-gray-900 via-purple-900 to-pink-900 text-white py-20 px-4 overflow-hidden">
             
        {/* Animated Background Elements */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-10 left-10 w-32 h-32 bg-pink-500 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-10 right-10 w-40 h-40 bg-purple-500 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 w-36 h-36 bg-yellow-500 rounded-full blur-3xl animate-pulse delay-500"></div>
        </div>
        <div className=" max-w-7xl mx-auto flex justify-between items-center">
<img src={man} alt="" className="max-h-[600px]" />
        <div className=" text-center relative z-10">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-400 to-yellow-500 text-black px-4 py-2 rounded-full text-sm font-bold mb-6 shadow-lg">
            <Crown className="w-4 h-4" />
            EXCLUSIVE VIP COLLECTION
            <Sparkles className="w-4 h-4" />
          </div>
          <h1 className="text-5xl md:text-7xl font-black uppercase tracking-wider mb-4 bg-gradient-to-r from-white via-pink-200 to-purple-200 bg-clip-text text-transparent drop-shadow-2xl">
            DENIM COLLECTION
          </h1>
          <p className="text-xl md:text-2xl font-light mb-2 text-pink-100">Premium Luxury Denim Wear for Kids</p>
          <div className="flex items-center justify-center gap-6 mt-6">
            <div className="flex items-center gap-2">
              <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
              <span className="text-sm font-semibold">5.0 Rating</span>
            </div>
            <div className="w-px h-6 bg-white/30"></div>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-green-400" />
              <span className="text-sm font-semibold">{sortedProducts.length} Premium Items</span>
            </div>
            <div className="w-px h-6 bg-white/30"></div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-yellow-400" />
              <span className="text-sm font-semibold">Handcrafted Quality</span>
            </div>
          </div>
        </div>
        <img src={woman} alt="" className="max-h-[600px]" />
        </div>

      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Luxury Sidebar Filters */}
          <div className="hidden lg:block w-72 flex-shrink-0">
            <div className="sticky top-4 space-y-6">
              {/* VIP Benefits Card */}
              <div className="bg-gradient-to-br from-amber-50 to-yellow-50 border-2 border-amber-300 rounded-2xl p-6 shadow-xl">
                <div className="flex items-center gap-2 mb-4">
                  <Crown className="w-6 h-6 text-amber-600" />
                  <h3 className="font-black text-amber-900 uppercase">VIP Benefits</h3>
                </div>
                <ul className="space-y-2 text-sm text-amber-800">
                  <li className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4" />
                    Free Express Shipping
                  </li>
                  <li className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4" />
                    30-Day Premium Returns
                  </li>
                  <li className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4" />
                    Exclusive Member Pricing
                  </li>
                </ul>
              </div>

              {/* Category Filter */}
              <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-gray-200">
                <h3 className="font-black text-gray-900 mb-4 uppercase tracking-wide flex items-center gap-2">
                  <Filter className="w-5 h-5 text-pink-500" />
                  Category
                </h3>
                <div className="space-y-2">
                  {['ALL', 'GIRLS', 'BOYS'].map((category) => (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={`w-full text-left px-4 py-3 rounded-xl transition-all duration-300 font-semibold ${
                        selectedCategory === category
                          ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-lg shadow-pink-500/50 scale-105'
                          : 'bg-gray-50 text-gray-700 hover:bg-gradient-to-r hover:from-pink-100 hover:to-purple-100'
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
                      className={`w-full text-left px-4 py-3 rounded-xl transition-all duration-300 text-sm font-semibold ${
                        selectedType === type
                          ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-lg shadow-pink-500/50'
                          : 'bg-gray-50 text-gray-700 hover:bg-gradient-to-r hover:from-pink-100 hover:to-purple-100'
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
                    <span className="text-pink-600">₦{priceRange[0].toLocaleString()}</span>
                    <span className="text-purple-600">₦{priceRange[1].toLocaleString()}</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100000"
                    step="5000"
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([0, parseInt(e.target.value)])}
                    className="w-full accent-pink-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Premium Toolbar */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
              <button
                onClick={() => setShowMobileFilters(!showMobileFilters)}
                className="lg:hidden flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-xl hover:shadow-lg hover:shadow-pink-500/50 transition-all duration-300 font-bold"
              >
                <Filter className="w-5 h-5" />
                Filters
              </button>

              <div className="flex items-center gap-4 ml-auto">
                <label className="text-sm text-gray-700 font-bold">Sort by:</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-6 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent font-semibold bg-white shadow-lg transition-all duration-300"
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
              <div className="flex flex-wrap gap-3 mb-8">
                {selectedCategory !== 'ALL' && (
                  <span className="inline-flex items-center gap-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                    {selectedCategory}
                    <button onClick={() => setSelectedCategory('ALL')} className="hover:scale-110 transition-transform">
                      <X className="w-4 h-4" />
                    </button>
                  </span>
                )}
                {selectedType !== 'ALL' && (
                  <span className="inline-flex items-center gap-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                    {selectedType}
                    <button onClick={() => setSelectedType('ALL')} className="hover:scale-110 transition-transform">
                      <X className="w-4 h-4" />
                    </button>
                  </span>
                )}
              </div>
            )}

            {/* Premium Products Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
              {sortedProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            {/* No Results */}
            {sortedProducts.length === 0 && (
              <div className="text-center py-20 bg-white/50 backdrop-blur-lg rounded-3xl shadow-xl">
                <Sparkles className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-600 text-xl font-bold mb-2">No premium items found</p>
                <p className="text-gray-500 mb-6">Try adjusting your filters to discover more luxury pieces</p>
                <button
                  onClick={() => {
                    setSelectedCategory('ALL');
                    setSelectedType('ALL');
                    setPriceRange([0, 100000]);
                  }}
                  className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-8 py-3 rounded-xl font-bold hover:shadow-lg hover:shadow-pink-500/50 transition-all duration-300"
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
          <div className="absolute right-0 top-0 bottom-0 w-80 bg-gradient-to-br from-white to-pink-50 p-6 overflow-y-auto shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-black bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">Filters</h2>
              <button onClick={() => setShowMobileFilters(false)} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="font-black mb-3 text-gray-900">Category</h3>
                <div className="space-y-2">
                  {['ALL', 'GIRLS', 'BOYS'].map((category) => (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={`w-full text-left px-4 py-3 rounded-xl font-semibold transition-all ${
                        selectedCategory === category
                          ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-lg'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-black mb-3 text-gray-900">Type</h3>
                <div className="space-y-2 max-h-48 overflow-y-auto custom-scrollbar">
                  {types.map((type) => (
                    <button
                      key={type}
                      onClick={() => setSelectedType(type)}
                      className={`w-full text-left px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                        selectedType === type
                          ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-lg'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-black mb-3 text-gray-900">Price Range</h3>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm font-bold">
                    <span className="text-pink-600">₦{priceRange[0].toLocaleString()}</span>
                    <span className="text-purple-600">₦{priceRange[1].toLocaleString()}</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100000"
                    step="5000"
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([0, parseInt(e.target.value)])}
                    className="w-full accent-pink-500"
                  />
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowMobileFilters(false)}
              className="w-full mt-8 bg-gradient-to-r from-pink-500 to-purple-500 text-white py-4 rounded-xl font-black shadow-lg hover:shadow-xl transition-all duration-300"
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
          background: linear-gradient(to bottom, #ec4899, #a855f7);
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