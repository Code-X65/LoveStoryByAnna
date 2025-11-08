import React, { useState, useEffect } from 'react';
import { ShoppingCart, Menu, X, ChevronRight, Star, ChevronDown } from 'lucide-react';
import products from '../Data/products'
// Mock products data


export default function KidsClothingShop() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedGender, setSelectedGender] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [expandedGender, setExpandedGender] = useState(null);
  const itemsPerPage = 6;

  // Organize categories by gender
  const boysCategories = ['All', ...new Set(products.filter(p => p.gender === 'Boys').map(p => p.category))];
  const girlsCategories = ['All', ...new Set(products.filter(p => p.gender === 'Girls').map(p => p.category))];

  // Update URL when filters change
  useEffect(() => {
    const params = new URLSearchParams();
    if (selectedCategory !== 'All') params.set('category', selectedCategory);
    if (selectedGender !== 'All') params.set('gender', selectedGender);
    if (currentPage > 1) params.set('page', currentPage);
    
    const newUrl = `${window.location.pathname}${params.toString() ? '?' + params.toString() : ''}`;
    window.history.pushState({}, '', newUrl);
  }, [selectedCategory, selectedGender, currentPage]);

  // Read URL params on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const cat = params.get('category');
    const gen = params.get('gender');
    const page = params.get('page');
    
    if (cat) setSelectedCategory(cat);
    if (gen) setSelectedGender(gen);
    if (page) setCurrentPage(parseInt(page));
  }, []);

  // Filter products
  const filteredProducts = products.filter(product => {
    // Handle New Arrival filter
    if (selectedGender === 'New Arrival') {
      return product.badge === 'New Arrival';
    }
    
    // Handle Bags and Hair Accessories filters
    if (selectedGender === 'Bags' || selectedGender === 'Hair Accessories') {
      return product.gender === selectedGender;
    }
    
    // Regular category and gender filters
    const categoryMatch = selectedCategory === 'All' || product.category === selectedCategory;
    const genderMatch = selectedGender === 'All' || product.gender === selectedGender;
    return categoryMatch && genderMatch;
  });

  // Pagination
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedProducts = filteredProducts.slice(startIndex, startIndex + itemsPerPage);

const handleCategoryChange = (category, gender) => {
  setSelectedCategory(category);
  setSelectedGender(gender);
  setCurrentPage(1);
  setMobileMenuOpen(false); // Close mobile menu after selection
};

  const toggleGender = (gender) => {
    setExpandedGender(expandedGender === gender ? null : gender);
  };

const clearFilters = () => {
  setSelectedCategory('All');
  setSelectedGender('All');
  setCurrentPage(1);
  setExpandedGender(null);
  setMobileMenuOpen(false); // Close mobile menu after clearing
};

  return (
    <div className="min-h-screen bg-white">


   {/* Breadcrumb Navigation */}
<div className="bg-gray-50 border-b border-gray-200">
  <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
    <div className="flex items-center gap-2 text-sm text-gray-600">
      <span className="cursor-pointer hover:text-pink-600 transition-colors">Home</span>
      <ChevronRight className="w-4 h-4" />
      <span className="cursor-pointer hover:text-pink-600 transition-colors">Products</span>
      {selectedGender !== 'All' && (
        <>
          <ChevronRight className="w-4 h-4" />
          <span className="text-pink-600 font-medium">{selectedGender}</span>
        </>
      )}
      {selectedCategory !== 'All' && (
        <>
          <ChevronRight className="w-4 h-4" />
          <span className="text-pink-600 font-medium">{selectedCategory}</span>
        </>
      )}
    </div>
    
    {/* Mobile Menu Toggle */}
    <button
      onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
      className="md:hidden p-2 hover:bg-gray-100 rounded transition-colors"
    >
      <Menu className="w-6 h-6 text-gray-700" />
    </button>
  </div>
</div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Sidebar Filters */}
      <aside className={`fixed md:sticky md:top-4 top-0 left-0 h-full md:h-[calc(100vh-2rem)] w-80 md:w-72 bg-white md:bg-transparent z-40 transform transition-transform duration-300 ${
  mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
} md:translate-x-0 flex-shrink-0 overflow-y-auto shadow-2xl md:shadow-none`}>
          <div className="bg-gradient-to-br from-pink-50 to-purple-50 p-6 h-full md:border border-pink-100 md:shadow-md relative">
              {/* Mobile Close Button */}
  <button
    onClick={() => setMobileMenuOpen(false)}
    className="md:hidden absolute top-4 right-4 p-2 hover:bg-white rounded-full transition-colors"
  >
    <X className="w-5 h-5 text-gray-700" />
  </button>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-800">Filters</h2>
                {(selectedCategory !== 'All' || selectedGender !== 'All') && (
                  <button 
                    onClick={clearFilters}
                    className="text-sm text-pink-600 hover:text-pink-700 font-medium"
                  >
                    Clear All
                  </button>
                )}
              </div>
              
              {/* All Products Option */}
              <div 
                onClick={() => handleCategoryChange('All', 'All')}
                className={`mb-4 p-4 cursor-pointer transition-all ${
                  selectedGender === 'All' && selectedCategory === 'All'
                    ? 'bg-pink-600 text-white shadow-md'
                    : 'bg-white hover:bg-pink-50 border border-gray-200'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold">All Products</span>
                  <span className={`text-sm ${selectedGender === 'All' ? 'text-white' : 'text-gray-500'}`}>
                    ({products.length})
                  </span>
                </div>
              </div>

              {/* Boys Dropdown */}
              <div className="mb-4">
                <div 
                  onClick={() => toggleGender('Boys')}
                  className={`p-4 cursor-pointer transition-all ${
                    expandedGender === 'Boys'
                      ? 'bg-blue-500 text-white shadow-md'
                      : 'bg-white hover:bg-blue-50 border border-gray-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">👦</span>
                      <span className="font-semibold">Boys</span>
                    </div>
                    <ChevronDown className={`w-5 h-5 transition-transform ${expandedGender === 'Boys' ? 'rotate-180' : ''}`} />
                  </div>
                </div>
                
                {expandedGender === 'Boys' && (
                  <div className="bg-white border-x border-b border-gray-200 shadow-inner">
                    {boysCategories.map(category => (
                      <div
                        key={category}
                        onClick={() => handleCategoryChange(category, 'Boys')}
                        className={`p-3 pl-6 cursor-pointer transition-all border-b border-gray-100 last:border-b-0 ${
                          selectedGender === 'Boys' && selectedCategory === category
                            ? 'bg-blue-100 text-blue-700 font-medium'
                            : 'hover:bg-gray-50 text-gray-700'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-sm">{category}</span>
                          <span className="text-xs text-gray-500">
                            ({products.filter(p => p.gender === 'Boys' && (category === 'All' || p.category === category)).length})
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Girls Dropdown */}
              <div className="mb-4">
                <div 
                  onClick={() => toggleGender('Girls')}
                  className={`p-4 cursor-pointer transition-all ${
                    expandedGender === 'Girls'
                      ? 'bg-pink-500 text-white shadow-md'
                      : 'bg-white hover:bg-pink-50 border border-gray-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">👧</span>
                      <span className="font-semibold">Girls</span>
                    </div>
                    <ChevronDown className={`w-5 h-5 transition-transform ${expandedGender === 'Girls' ? 'rotate-180' : ''}`} />
                  </div>
                </div>
                
                {expandedGender === 'Girls' && (
                  <div className="bg-white border-x border-b border-gray-200 shadow-inner">
                    {girlsCategories.map(category => (
                      <div
                        key={category}
                        onClick={() => handleCategoryChange(category, 'Girls')}
                        className={`p-3 pl-6 cursor-pointer transition-all border-b border-gray-100 last:border-b-0 ${
                          selectedGender === 'Girls' && selectedCategory === category
                            ? 'bg-pink-100 text-pink-700 font-medium'
                            : 'hover:bg-gray-50 text-gray-700'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-sm">{category}</span>
                          <span className="text-xs text-gray-500">
                            ({products.filter(p => p.gender === 'Girls' && (category === 'All' || p.category === category)).length})
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Bags */}
              <div 
                onClick={() => handleCategoryChange('All', 'Bags')}
                className={`mb-4 p-4 cursor-pointer transition-all ${
                  selectedGender === 'Bags'
                    ? 'bg-purple-500 text-white shadow-md'
                    : 'bg-white hover:bg-purple-50 border border-gray-200'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">🎒</span>
                    <span className="font-semibold">Bags</span>
                  </div>
                  <span className={`text-sm ${selectedGender === 'Bags' ? 'text-white' : 'text-gray-500'}`}>
                    ({products.filter(p => p.gender === 'Bags').length})
                  </span>
                </div>
              </div>

              {/* Hair Accessories */}
              <div 
                onClick={() => handleCategoryChange('All', 'Hair Accessories')}
                className={`mb-4 p-4 cursor-pointer transition-all ${
                  selectedGender === 'Hair Accessories'
                    ? 'bg-rose-500 text-white shadow-md'
                    : 'bg-white hover:bg-rose-50 border border-gray-200'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">🎀</span>
                    <span className="font-semibold">Hair Accessories</span>
                  </div>
                  <span className={`text-sm ${selectedGender === 'Hair Accessories' ? 'text-white' : 'text-gray-500'}`}>
                    ({products.filter(p => p.gender === 'Hair Accessories').length})
                  </span>
                </div>
              </div>

              {/* New Arrivals */}
              <div 
                onClick={() => handleCategoryChange('All', 'New Arrival')}
                className={`mb-4 p-4 cursor-pointer transition-all ${
                  selectedGender === 'New Arrival'
                    ? 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white shadow-md'
                    : 'bg-white hover:bg-gradient-to-r hover:from-yellow-50 hover:to-orange-50 border border-gray-200'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">✨</span>
                    <span className="font-semibold">New Arrivals</span>
                  </div>
                  <span className={`text-sm ${selectedGender === 'New Arrival' ? 'text-white' : 'text-gray-500'}`}>
                    ({products.filter(p => p.badge === 'New Arrival').length})
                  </span>
                </div>
              </div>

              {/* Active Filters Display */}
              {(selectedCategory !== 'All' || selectedGender !== 'All') && (
                <div className="mt-6 p-4 bg-white border border-pink-200">
                  <h3 className="text-sm font-semibold text-gray-700 mb-2">Active Filters:</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedGender !== 'All' && (
                      <span className="inline-flex items-center gap-1 bg-pink-100 text-pink-700 text-xs px-3 py-1 font-medium">
                        {selectedGender}
                        <X className="w-3 h-3 cursor-pointer" onClick={() => setSelectedGender('All')} />
                      </span>
                    )}
                    {selectedCategory !== 'All' && (
                      <span className="inline-flex items-center gap-1 bg-pink-100 text-pink-700 text-xs px-3 py-1 font-medium">
                        {selectedCategory}
                        <X className="w-3 h-3 cursor-pointer" onClick={() => setSelectedCategory('All')} />
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>

          </aside>

          {/* Main Content */}
          <main className="flex-1">
            {/* Results Info */}
            <div className="mb-6 flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-1">
                  {selectedGender !== 'All' ? selectedGender : 'All Products'}
                  {selectedCategory !== 'All' && ` - ${selectedCategory}`}
                </h2>
                <p className="text-sm text-gray-600">
                  Showing {startIndex + 1}-{Math.min(startIndex + itemsPerPage, filteredProducts.length)} of {filteredProducts.length} products
                </p>
              </div>
            </div>

            {/* Product Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {paginatedProducts.map(product => (
                <div key={product.id} className="bg-white border border-gray-200 overflow-hidden hover:shadow-xl transition-all hover:-translate-y-1">
                  <div className="relative group">
                    <img 
                      src={product.image} 
                      alt={product.name}
                      className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {product.badge && (
                      <span className="absolute top-3 left-3 bg-pink-600 text-white text-xs px-3 py-1 font-semibold shadow-md">
                        {product.badge}
                      </span>
                    )}
                    {product.discount && (
                      <span className="absolute top-3 right-3 bg-red-500 text-white text-xs px-3 py-1 font-semibold shadow-md">
                        {product.discount}
                      </span>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-800 mb-1 line-clamp-1">{product.name}</h3>
                    <p className="text-xs text-gray-500 mb-2">{product.category}</p>
                    <div className="flex items-center gap-1 mb-3">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-medium">{product.rating}</span>
                      <span className="text-xs text-gray-500">({product.reviews})</span>
                    </div>
                    <div className="flex items-center gap-2 mb-4">
                      <span className="text-xl font-bold text-pink-600">${product.price}</span>
                      <span className="text-sm text-gray-400 line-through">${product.originalPrice}</span>
                    </div>
                    <button className="w-full bg-gradient-to-r from-pink-500 to-pink-600 text-white py-2 font-medium hover:from-pink-600 hover:to-pink-700 transition-all shadow-md hover:shadow-lg">
                      Add to Cart
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-pink-50 hover:border-pink-300 transition-colors font-medium"
                >
                  Previous
                </button>
                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i + 1}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`px-4 py-2 border font-medium transition-all ${
                      currentPage === i + 1
                        ? 'bg-pink-600 text-white border-pink-600 shadow-md'
                        : 'border-gray-300 hover:bg-pink-50 hover:border-pink-300'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
                <button
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-pink-50 hover:border-pink-300 transition-colors font-medium"
                >
                  Next
                </button>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}