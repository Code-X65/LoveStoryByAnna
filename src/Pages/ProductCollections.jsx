import React, { useState, useEffect } from 'react';
import { Grid, List, ChevronDown, Filter, X, Heart, Share2, ShoppingCart } from 'lucide-react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { products as allProducts, collections, priceRanges, sizeRanges, colorOptions } from '../Components/Data/productsData';
// Update ProductCard function signature:
const ProductCard = ({ product, onAddToCart, onToggleFavorite, favorite, colors }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);


  const handleShare = (e) => {
    e.preventDefault();
    setShowShareMenu(!showShareMenu);
  };

  const handleToggleFavorite = (e) => {
    e.preventDefault();
    onToggleFavorite(product.id);
  };

  const handleAddToCart = (e) => {
    e.preventDefault();
    onAddToCart(product);
  };

  return (
   <Link to="/details">
    <div className="group cursor-pointer">
      <div 
        className="relative overflow-hidden bg-gray-100 aspect-[3/4] mb-3"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <img
          src={product.image1}
          alt={product.name}
          className={`w-full h-full object-cover transition-opacity duration-300 ${
            isHovered ? 'opacity-0' : 'opacity-100'
          }`}
        />
        <img
          src={product.image2}
          alt={product.name}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${
            isHovered ? 'opacity-100' : 'opacity-0'
          }`}
        />
        
        {/* Icons Overlay */}
        <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button
            onClick={handleToggleFavorite}
            className={`p-2 bg-white hover:bg-pink-300 hover:text-white transition-colors ${
              favorite ? 'bg-pink-300 text-white' : ''
            }`}
          >
            <Heart size={18} fill={favorite ? 'currentColor' : 'none'} />
          </button>
          
          <div className="relative">
            <button
  onClick={handleShare}
  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = colors.primary}
  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}
  className="p-2 bg-white hover:text-white transition-colors"
>
  <Share2 size={18} />
</button>
            
       

            {showShareMenu && (
  <div className="absolute right-full mr-2 top-0 bg-white border border-gray-200 p-2 flex flex-col gap-1 whitespace-nowrap z-10">
    <button 
      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = colors.bg}
      className="text-xs px-3 py-1 text-left"
    >
      Facebook
    </button>
    <button 
      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = colors.bg}
      className="text-xs px-3 py-1 text-left"
    >
      Twitter
    </button>
    <button 
      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = colors.bg}
      className="text-xs px-3 py-1 text-left"
    >
      Whatsapp
    </button>
    <button 
      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = colors.bg}
      className="text-xs px-3 py-1 text-left"
    >
      CopyLink
    </button>
    {/* Repeat for other buttons */}
  </div>
)}
          </div>
        </div>


<button
  onClick={handleAddToCart}
  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = colors.hover}
  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = colors.primary}
  style={{ backgroundColor: colors.primary }}
  className="absolute bottom-0 left-0 right-0 text-white py-3 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2"
>
  <ShoppingCart size={18} />
  ADD TO CART
</button>
      </div>
      
      <div className="text-center px-2">
        <h3 className="text-sm font-medium text-gray-800 uppercase mb-1 tracking-wide">
          {product.name}
        </h3>
        <p className="text-xs text-gray-500 mb-2">({product.variants})</p>
        
        <div className="flex items-center justify-center gap-1 mb-1">
          {[...Array(5)].map((_, i) => (
           <span key={i} style={{ color: i < product.rating ? colors.primary : '#D1D5DB' }} className="text-xs">★</span>
          ))}
          <span className="text-xs text-gray-500 ml-1">{product.reviews} REVIEWS</span>
        </div>
        
        <p className="text-sm font-semibold text-gray-800">
          FROM ₦{product.price.toLocaleString()}
        </p>
      </div>
    </div>
    </Link>
  );
};

const ProductCollections = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const category = searchParams.get('category') || 'GIRLS';
const title = searchParams.get('collection') || `${category} COLLECTION`;

const navigate = useNavigate();
  const [viewMode, setViewMode] = useState('grid');
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [sortBy, setSortBy] = useState('featured');
  const [showSortMenu, setShowSortMenu] = useState(false);
  const [favorites, setFavorites] = useState([]);
  const [cart, setCart] = useState([]);
  const [expandedCategories, setExpandedCategories] = useState({
    collection: true,
    price: true,
    size: true,
    color: true
  });
  const [selectedFilters, setSelectedFilters] = useState({
    collection: [],
    subcategory: [],
    price: [],
    size: [],
    color: []
  });

// Defin Color Sheme
const colorSchemes = {
  GIRLS: {
    primary: '#EC4899', // pink-300
    hover: '#F472B6',   // pink-400
    bg: '#FCE7F3'       // pink-50
  },
  BOYS: {
    primary: '#3B82F6', // blue-500
    hover: '#60A5FA',   // blue-400
    bg: '#EFF6FF'       // blue-50
  },
  BABY: {
    primary: '#A855F7', // purple-500
    hover: '#C084FC',   // purple-400
    bg: '#FAF5FF'       // purple-50
  },
  DEFAULT: {
    primary: '#EC4899',
    hover: '#F472B6',
    bg: '#FCE7F3'
  }
};











// Update handleFilterChange function to update URL:
const handleFilterChange = (filterType, value) => {
  setSelectedFilters(prev => {
    const currentFilters = prev[filterType];
    const newFilters = currentFilters.includes(value)
      ? currentFilters.filter(item => item !== value)
      : [...currentFilters, value];
    
    const updatedFilters = { ...prev, [filterType]: newFilters };
    
    // Update URL
    const params = new URLSearchParams();
    Object.entries(updatedFilters).forEach(([key, values]) => {
      if (values.length > 0) {
        params.set(key, values.join(','));
      }
    });
    setSearchParams(params);
    
    return updatedFilters;
  });
};

  const handleSort = (option) => {
    setSortBy(option);
    setShowSortMenu(false);
  };

  const handleToggleFavorite = (productId) => {
    setFavorites(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const handleAddToCart = (product) => {
    setCart(prev => {
      const existingItem = prev.find(item => item.id === product.id);
      if (existingItem) {
        return prev.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

const filteredProducts = allProducts.filter(product => {
  // Filter by category
  if (category && product.category !== category) {
    return false;
  }
  
  // Filter by collection
  if (selectedFilters.collection.length > 0) {
    if (!selectedFilters.collection.includes(product.collection)) {
      return false;
    }
  }
  
  // Filter by subcategory
  if (selectedFilters.subcategory.length > 0) {
    if (!selectedFilters.subcategory.includes(product.subcategory)) {
      return false;
    }
  }
  
  // Filter by price
  if (selectedFilters.price.length > 0) {
    const matchesPrice = selectedFilters.price.some(range => {
      if (range === "Under ₦20,000") return product.price < 20000;
      if (range === "₦20,000 - ₦40,000") return product.price >= 20000 && product.price < 40000;
      if (range === "₦40,000 - ₦60,000") return product.price >= 40000 && product.price < 60000;
      if (range === "₦60,000 - ₦80,000") return product.price >= 60000 && product.price < 80000;
      return false;
    });
    if (!matchesPrice) return false;
  }
  
  // Filter by size
  if (selectedFilters.size.length > 0) {
    const matchesSize = selectedFilters.size.some(size => 
      product.sizes.includes(size)
    );
    if (!matchesSize) return false;
  }
  
  // Filter by color
  if (selectedFilters.color.length > 0) {
    const matchesColor = selectedFilters.color.some(color => 
      product.colors.includes(color)
    );
    if (!matchesColor) return false;
  }
  
  return true;
});

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'price-low') return a.price - b.price;
    if (sortBy === 'price-high') return b.price - a.price;
    if (sortBy === 'name') return a.name.localeCompare(b.name);
    if (sortBy === 'rating') return b.rating - a.rating;
    return 0;
  });

  const totalCartItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Update clear all filters to clear URL:
const clearAllFilters = () => {
  setSelectedFilters({ collection: [], subcategory: [], price: [], size: [], color: [] });
  setSearchParams(new URLSearchParams());
};

const colors = colorSchemes[category] || colorSchemes.DEFAULT;


  // Initialize filters from URL on mount
useEffect(() => {
  const collection = searchParams.get('collection');
  const category = searchParams.get('category');
  const subcategory = searchParams.get('subcategory');
  const priceRange = searchParams.get('price');
  const size = searchParams.get('size');
  const color = searchParams.get('color');
  
  const newFilters = {
    collection: collection ? collection.split(',') : [],
    subcategory: subcategory ? subcategory.split(',') : [],
    price: priceRange ? priceRange.split(',') : [],
    size: size ? size.split(',') : [],
    color: color ? color.split(',') : []
  };
  
  setSelectedFilters(newFilters);
}, []);

return (
  <div className="h-screen flex flex-col bg-white overflow-hidden">
    {/* Header */}
    <header className="border-b border-gray-200 bg-white flex-shrink-0">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-2xl md:text-3xl font-light text-center tracking-wider text-gray-800">
          {title.toUpperCase()}
        </h1>
        <p className="text-center text-sm text-gray-500 mt-2">
          {sortedProducts.length} Products
        </p>
      </div>
    </header>

    {/* Toolbar */}
    <div className="border-b border-gray-200 bg-white flex-shrink-0">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex gap-2">
          <button
            onClick={() => setIsMobileFilterOpen(true)}
            className="lg:hidden p-2 text-gray-600"
            style={{ color: colors.primary }}
          >
            <Filter size={20} />
          </button>
          
          <button
            onClick={() => setViewMode('grid-large')}
            style={{ color: viewMode === 'grid-large' ? colors.primary : '#9CA3AF' }}
            className="p-2 hover:opacity-80"
          >
            <Grid size={20} />
          </button>
          <button
            onClick={() => setViewMode('grid')}
            style={{ color: viewMode === 'grid' ? colors.primary : '#9CA3AF' }}
            className="p-2 hover:opacity-80"
          >
            <List size={20} />
          </button>
        </div>
        
        <div className="relative">
          <button 
            onClick={() => setShowSortMenu(!showSortMenu)}
            onMouseEnter={(e) => e.currentTarget.style.color = colors.primary}
            onMouseLeave={(e) => e.currentTarget.style.color = '#4B5563'}
            className="flex items-center gap-2 text-sm text-gray-600"
          >
            SORT BY: {sortBy.toUpperCase().replace('-', ' ')}
            <ChevronDown size={16} />
          </button>
          
          {showSortMenu && (
            <div className="absolute right-0 top-full mt-2 w-48 bg-white shadow-xl border border-gray-200 py-2 z-50">
              <button 
                onClick={() => handleSort('featured')} 
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = colors.bg}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}
                className="w-full text-left px-4 py-2 text-sm"
              >
                Featured
              </button>
              <button 
                onClick={() => handleSort('price-low')} 
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = colors.bg}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}
                className="w-full text-left px-4 py-2 text-sm"
              >
                Price: Low to High
              </button>
              <button 
                onClick={() => handleSort('price-high')} 
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = colors.bg}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}
                className="w-full text-left px-4 py-2 text-sm"
              >
                Price: High to Low
              </button>
              <button 
                onClick={() => handleSort('rating')} 
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = colors.bg}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}
                className="w-full text-left px-4 py-2 text-sm"
              >
                Top Rated
              </button>
              <button 
                onClick={() => handleSort('name')} 
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = colors.bg}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}
                className="w-full text-left px-4 py-2 text-sm"
              >
                Name: A to Z
              </button>
            </div>
          )}
        </div>
      </div>
    </div>

    {/* Main Content - Scrollable Area */}
    <div className="flex-1 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 h-full">
        <div className="flex flex-col lg:flex-row gap-8 h-full">
          {/* Mobile Filter Overlay */}
          <div className={`fixed inset-0 bg-black/[0.5] bg-opacity-50 z-50 lg:hidden transition-opacity duration-300 ${isMobileFilterOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} onClick={() => setIsMobileFilterOpen(false)} />

          {/* Sidebar */}
          <aside className={`fixed lg:relative top-0 left-0 h-full w-80 lg:w-72 bg-white max-md:z-[20000] transform transition-transform duration-300 overflow-y-auto ${isMobileFilterOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'} flex-shrink-0 border-r border-gray-200 lg:h-full`}>
            {/* Mobile Header */}
            <div className="lg:hidden flex items-center justify-between p-4 border-b border-gray-200" style={{ backgroundColor: colors.primary }}>
              <h2 className="text-lg font-semibold text-white">FILTERS</h2>
              <button onClick={() => setIsMobileFilterOpen(false)} className="text-white">
                <X size={24} />
              </button>
            </div>

            {/* Active Filters Summary */}
            {(selectedFilters.collection.length > 0 || selectedFilters.subcategory?.length > 0 || selectedFilters.price.length > 0 || selectedFilters.size.length > 0 || selectedFilters.color.length > 0) && (
              <div className="p-4 border-b border-gray-200" style={{ backgroundColor: colors.bg }}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-gray-700">ACTIVE FILTERS</span>
                  <button 
                    onClick={clearAllFilters}
                    className="text-xs hover:opacity-80 font-medium"
                    style={{ color: colors.primary }}
                  >
                    Clear All
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {[...selectedFilters.collection, ...(selectedFilters.subcategory || []), ...selectedFilters.price, ...selectedFilters.size, ...selectedFilters.color].map((filter, idx) => (
                    <span 
                      key={idx}
                      className="inline-flex items-center gap-1 px-2 py-1 bg-white text-xs border"
                      style={{ borderColor: colors.primary, color: colors.primary }}
                    >
                      {filter}
                      <button onClick={() => {
                        if (selectedFilters.collection.includes(filter)) handleFilterChange('collection', filter);
                        if (selectedFilters.subcategory?.includes(filter)) handleFilterChange('subcategory', filter);
                        if (selectedFilters.price.includes(filter)) handleFilterChange('price', filter);
                        if (selectedFilters.size.includes(filter)) handleFilterChange('size', filter);
                        if (selectedFilters.color.includes(filter)) handleFilterChange('color', filter);
                      }}>
                        <X size={12} />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="p-4">
              {/* Collection Filter */}
              <div className="mb-6 pb-6 border-b border-gray-200">
                <button 
                  className="w-full flex items-center justify-between mb-4"
                  onClick={() => setExpandedCategories(prev => ({ ...prev, collection: !prev.collection }))}
                >
                  <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wide">
                    Collections
                  </h2>
                  <ChevronDown 
                    size={18} 
                    style={{ color: colors.primary }}
                    className={`transform transition-transform ${expandedCategories.collection === false ? '-rotate-90' : ''}`}
                  />
                </button>
                {expandedCategories.collection !== false && (
                  <div className="space-y-4">
                    {collections.map((collection, idx) => (
                      <div key={idx}>
                        <label className="flex items-start cursor-pointer group mb-2">
                          <input
                            type="checkbox"
                            checked={selectedFilters.collection.includes(collection.name)}
                            onChange={() => handleFilterChange('collection', collection.name)}
                            className="mt-1 mr-3 w-4 h-4 flex-shrink-0"
                            style={{ accentColor: colors.primary }}
                          />
                          <div className="flex-1 min-w-0">
                            <span 
                              onMouseEnter={(e) => e.currentTarget.style.color = colors.primary}
                              onMouseLeave={(e) => e.currentTarget.style.color = '#1F2937'}
                              className="text-sm font-semibold text-gray-800 block"
                            >
                              {collection.name}
                            </span>
                            <span className="text-xs text-gray-400">{collection.count} items</span>
                          </div>
                        </label>
                        {/* Subcategories */}
                        <div className="ml-7 space-y-1">
                          {collection.subcategories.map((sub, subIdx) => (
                            <label key={subIdx} className="flex items-center cursor-pointer group">
                              <input
                                type="checkbox"
                                checked={selectedFilters.subcategory?.includes(sub)}
                                onChange={() => handleFilterChange('subcategory', sub)}
                                className="mr-2 w-3 h-3 flex-shrink-0"
                                style={{ accentColor: colors.primary }}
                              />
                              <span 
                                onMouseEnter={(e) => e.currentTarget.style.color = colors.primary}
                                onMouseLeave={(e) => e.currentTarget.style.color = '#4B5563'}
                                className="text-xs text-gray-600"
                              >
                                {sub}
                              </span>
                            </label>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Price Filter */}
              <div className="mb-6 pb-6 border-b border-gray-200">
                <button 
                  className="w-full flex items-center justify-between mb-4"
                  onClick={() => setExpandedCategories(prev => ({ ...prev, price: !prev.price }))}
                >
                  <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wide">
                    Price Range
                  </h2>
                  <ChevronDown 
                    size={18} 
                    style={{ color: colors.primary }}
                    className={`transform transition-transform ${expandedCategories.price === false ? '-rotate-90' : ''}`}
                  />
                </button>
                {expandedCategories.price !== false && (
                  <div className="space-y-3">
                    {priceRanges.map((range, idx) => (
                      <label key={idx} className="flex items-center cursor-pointer group">
                        <input
                          type="checkbox"
                          checked={selectedFilters.price.includes(range.label)}
                          onChange={() => handleFilterChange('price', range.label)}
                          className="mr-3 w-4 h-4 flex-shrink-0"
                          style={{ accentColor: colors.primary }}
                        />
                        <span 
                          onMouseEnter={(e) => e.currentTarget.style.color = colors.primary}
                          onMouseLeave={(e) => e.currentTarget.style.color = '#374151'}
                          className="text-sm text-gray-700 flex-1"
                        >
                          {range.label}
                        </span>
                        <span className="text-xs text-gray-400 ml-2">({range.count})</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>

              {/* Size Filter */}
              <div className="mb-6 pb-6 border-b border-gray-200">
                <button 
                  className="w-full flex items-center justify-between mb-4"
                  onClick={() => setExpandedCategories(prev => ({ ...prev, size: !prev.size }))}
                >
                  <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wide">
                    Size (Age)
                  </h2>
                  <ChevronDown 
                    size={18} 
                    style={{ color: colors.primary }}
                    className={`transform transition-transform ${expandedCategories.size === false ? '-rotate-90' : ''}`}
                  />
                </button>
                {expandedCategories.size !== false && (
                  <div className="grid grid-cols-2 gap-2">
                    {sizeRanges.map((size, idx) => (
                      <label 
                        key={idx} 
                        className={`flex items-center justify-center px-3 py-2 border cursor-pointer transition-all ${
                          selectedFilters.size.includes(size.label) 
                            ? 'text-white' 
                            : 'border-gray-200 text-gray-700'
                        }`}
                        style={selectedFilters.size.includes(size.label) 
                          ? { backgroundColor: colors.primary, borderColor: colors.primary }
                          : { borderColor: '#E5E7EB' }
                        }
                        onMouseEnter={(e) => !selectedFilters.size.includes(size.label) && (e.currentTarget.style.borderColor = colors.primary)}
                        onMouseLeave={(e) => !selectedFilters.size.includes(size.label) && (e.currentTarget.style.borderColor = '#E5E7EB')}
                      >
                        <input
                          type="checkbox"
                          checked={selectedFilters.size.includes(size.label)}
                          onChange={() => handleFilterChange('size', size.label)}
                          className="hidden"
                        />
                        <span className="text-xs font-medium text-center">
                          {size.label}
                        </span>
                      </label>
                    ))}
                  </div>
                )}
              </div>

              {/* Color Filter */}
              <div className="mb-6">
                <button 
                  className="w-full flex items-center justify-between mb-4"
                  onClick={() => setExpandedCategories(prev => ({ ...prev, color: !prev.color }))}
                >
                  <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wide">
                    Colors
                  </h2>
                  <ChevronDown 
                    size={18} 
                    style={{ color: colors.primary }}
                    className={`transform transition-transform ${expandedCategories.color === false ? '-rotate-90' : ''}`}
                  />
                </button>
                {expandedCategories.color !== false && (
                  <div className="space-y-3">
                    {colorOptions.map((color, idx) => (
                      <label key={idx} className="flex items-center cursor-pointer group">
                        <input
                          type="checkbox"
                          checked={selectedFilters.color.includes(color.label)}
                          onChange={() => handleFilterChange('color', color.label)}
                          className="hidden"
                        />
                        <div 
                          className="w-8 h-8 border-2 mr-3 flex-shrink-0 transition-all"
                          style={{ 
                            background: color.hex,
                            borderColor: selectedFilters.color.includes(color.label) ? colors.primary : '#D1D5DB',
                            boxShadow: selectedFilters.color.includes(color.label) ? `0 0 0 2px ${colors.bg}` : 'none'
                          }}
                        />
                        <span 
                          onMouseEnter={(e) => e.currentTarget.style.color = colors.primary}
                          onMouseLeave={(e) => e.currentTarget.style.color = '#374151'}
                          className="text-sm text-gray-700 flex-1"
                        >
                          {color.label}
                        </span>
                        <span className="text-xs text-gray-400 ml-2">({color.count})</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>

              {/* Apply Filters Button - Mobile */}
              <button 
                onClick={() => setIsMobileFilterOpen(false)}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = colors.hover}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = colors.primary}
                style={{ backgroundColor: colors.primary }}
                className="lg:hidden w-full py-3 text-white font-semibold transition-colors"
              >
                APPLY FILTERS
              </button>
            </div>
          </aside>

          {/* Products Grid */}
          <main className="flex-1 overflow-y-scroll scrollbar-hide h-full py-8">
            <div className={`grid gap-6 ${
              viewMode === 'grid-large' 
                ? 'grid-cols-2 md:grid-cols-3' 
                : 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4'
            }`}>
              {sortedProducts.map((product) => (
                <ProductCard 
                  key={product.id} 
                  product={product}
                  colors={colors}
                  onAddToCart={handleAddToCart}
                  onToggleFavorite={handleToggleFavorite}
                  favorite={favorites.includes(product.id)}
                />
              ))}
            </div>
          </main>
        </div>
      </div>
    </div>

    {/* Wishlist Button */}
    <button 
      onClick={() => alert(`You have ${favorites.length} items in your wishlist`)}
      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = colors.hover}
      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = colors.primary}
      style={{ backgroundColor: colors.primary }}
      className="fixed right-6 bottom-20 text-white p-4 shadow-lg transition-colors"
    >
      <Heart size={24} fill="currentColor" />
      {favorites.length > 0 && (
        <span 
          className="absolute -top-2 -right-2 bg-white text-xs w-6 h-6 flex items-center justify-center font-bold border-2"
          style={{ color: colors.primary, borderColor: colors.primary }}
        >
          {favorites.length}
        </span>
      )}
    </button>

    {/* Cart Button */}
    <button 
      onClick={() => alert(`You have ${totalCartItems} items in your cart`)}
      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = colors.hover}
      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = colors.primary}
      style={{ backgroundColor: colors.primary }}
      className="fixed right-6 bottom-6 text-white p-4 shadow-lg transition-colors"
    >
      <ShoppingCart size={24} />
      {totalCartItems > 0 && (
        <span 
          className="absolute -top-2 -right-2 bg-white text-xs w-6 h-6 flex items-center justify-center font-bold border-2"
          style={{ color: colors.primary, borderColor: colors.primary }}
        >
          {totalCartItems}
        </span>
      )}
    </button>
  </div>
);
};

export default ProductCollections;