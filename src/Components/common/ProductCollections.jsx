import React, { useState } from 'react';
import { Grid, List, ChevronDown, Filter, X, Heart, Share2, ShoppingCart } from 'lucide-react';

const ProductCard = ({ product, onAddToCart, onToggleFavorite, isFavorite }) => {
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
              isFavorite ? 'bg-pink-300 text-white' : ''
            }`}
          >
            <Heart size={18} fill={isFavorite ? 'currentColor' : 'none'} />
          </button>
          
          <div className="relative">
            <button
              onClick={handleShare}
              className="p-2 bg-white hover:bg-pink-300 hover:text-white transition-colors"
            >
              <Share2 size={18} />
            </button>
            
            {showShareMenu && (
              <div className="absolute right-full mr-2 top-0 bg-white border border-gray-200 p-2 flex flex-col gap-1 whitespace-nowrap z-10">
                <button className="text-xs px-3 py-1 hover:bg-pink-50 text-left">Facebook</button>
                <button className="text-xs px-3 py-1 hover:bg-pink-50 text-left">Twitter</button>
                <button className="text-xs px-3 py-1 hover:bg-pink-50 text-left">WhatsApp</button>
                <button className="text-xs px-3 py-1 hover:bg-pink-50 text-left">Copy Link</button>
              </div>
            )}
          </div>
        </div>

        {/* Add to Cart Button */}
        <button
          onClick={handleAddToCart}
          className="absolute bottom-0 left-0 right-0 bg-pink-300 text-white py-3 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-pink-400 flex items-center justify-center gap-2"
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
            <span key={i} className={`text-xs ${i < product.rating ? 'text-pink-300' : 'text-gray-300'}`}>★</span>
          ))}
          <span className="text-xs text-gray-500 ml-1">{product.reviews} REVIEWS</span>
        </div>
        
        <p className="text-sm font-semibold text-gray-800">
          FROM ₦{product.price.toLocaleString()}
        </p>
      </div>
    </div>
  );
};

const ProductCollections = () => {
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
    price: [],
    size: [],
    color: []
  });

  const products = [
    {
      id: 1,
      name: "Girls Pink Floral Dress",
      variants: "3 colors",
      reviews: 12,
      rating: 5,
      price: 42950,
      image1: "https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?w=400&h=600&fit=crop",
      image2: "https://images.unsplash.com/photo-1545291730-faff8ca1d4b0?w=400&h=600&fit=crop"
    },
    {
      id: 2,
      name: "Girls Ankara Two-Piece Set",
      variants: "2 colors",
      reviews: 8,
      rating: 4,
      price: 54950,
      image1: "https://images.unsplash.com/photo-1547119957-637f8679db1e?w=400&h=600&fit=crop",
      image2: "https://images.unsplash.com/photo-1581783898377-1c85bf937427?w=400&h=600&fit=crop"
    },
    {
      id: 3,
      name: "Girls Casual Summer Dress",
      variants: "4 colors",
      reviews: 15,
      rating: 5,
      price: 38950,
      image1: "https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?w=400&h=600&fit=crop",
      image2: "https://images.unsplash.com/photo-1612423284934-2850a4ea6b0f?w=400&h=600&fit=crop"
    },
    {
      id: 4,
      name: "Girls Party Dress with Bow",
      variants: "2 colors",
      reviews: 20,
      rating: 5,
      price: 62950,
      image1: "https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?w=400&h=600&fit=crop",
      image2: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400&h=600&fit=crop"
    },
    {
      id: 5,
      name: "Girls Denim Jacket & Skirt Set",
      variants: "1 color",
      reviews: 6,
      rating: 4,
      price: 58950,
      image1: "https://images.unsplash.com/photo-1621452773781-0f992fd1f5cb?w=400&h=600&fit=crop",
      image2: "https://images.unsplash.com/photo-1596870230751-ebdfce98ec42?w=400&h=600&fit=crop"
    },
    {
      id: 6,
      name: "Girls Ankara Print Blouse",
      variants: "3 colors",
      reviews: 10,
      rating: 4,
      price: 35950,
      image1: "https://images.unsplash.com/photo-1596870230751-ebdfce98ec42?w=400&h=600&fit=crop",
      image2: "https://images.unsplash.com/photo-1612423284934-2850a4ea6b0f?w=400&h=600&fit=crop"
    },
    {
      id: 7,
      name: "Girls Traditional Ankara Gown",
      variants: "2 colors",
      reviews: 18,
      rating: 5,
      price: 67950,
      image1: "https://images.unsplash.com/photo-1581783898377-1c85bf937427?w=400&h=600&fit=crop",
      image2: "https://images.unsplash.com/photo-1547119957-637f8679db1e?w=400&h=600&fit=crop"
    },
    {
      id: 8,
      name: "Girls Polka Dot Dress",
      variants: "3 colors",
      reviews: 14,
      rating: 5,
      price: 44950,
      image1: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400&h=600&fit=crop",
      image2: "https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?w=400&h=600&fit=crop"
    }
  ];

  const collections = [
    { name: "Girls Ankara Styles", count: 145 },
    { name: "GIRLS DRESSES", count: 68 },
    { name: "GIRLS TWO-PIECE SETS", count: 42 },
    { name: "GIRLS TOPS", count: 35 },
    { name: "GIRLS BOTTOMS", count: 28 },
    { name: "SPECIAL OCCASION", count: 22 }
  ];

  const priceRanges = [
    { label: "Under ₦20,000", count: 15 },
    { label: "₦20,000 - ₦40,000", count: 28 },
    { label: "₦40,000 - ₦60,000", count: 32 },
    { label: "₦60,000 - ₦80,000", count: 18 }
  ];

  const sizeRanges = [
    { label: "2-3 Years", count: 18 },
    { label: "3-4 Years", count: 24 },
    { label: "4-5 Years", count: 28 },
    { label: "5-6 Years", count: 22 },
    { label: "6-7 Years", count: 20 },
    { label: "7-8 Years", count: 16 },
    { label: "8-10 Years", count: 17 }
  ];

  const colorOptions = [
    { label: "Pink", count: 32, hex: "#EC4899" },
    { label: "Purple", count: 24, hex: "#A855F7" },
    { label: "Blue", count: 28, hex: "#3B82F6" },
    { label: "Red", count: 18, hex: "#EF4444" },
    { label: "Yellow", count: 15, hex: "#F59E0B" },
    { label: "Multi-Color", count: 38, hex: "linear-gradient(45deg, #EC4899, #A855F7, #3B82F6)" }
  ];

  const handleFilterChange = (filterType, value) => {
    setSelectedFilters(prev => {
      const currentFilters = prev[filterType];
      const newFilters = currentFilters.includes(value)
        ? currentFilters.filter(item => item !== value)
        : [...currentFilters, value];
      
      return { ...prev, [filterType]: newFilters };
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

  const filteredProducts = products.filter(product => {
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

  return (
    <div className="h-screen flex flex-col bg-white overflow-hidden">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white flex-shrink-0">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <h1 className="text-2xl md:text-3xl font-light text-center tracking-wider text-gray-800">
            GIRLS ANKARA STYLES
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
              className="lg:hidden p-2 text-gray-600 hover:text-pink-300"
            >
              <Filter size={20} />
            </button>
            
            <button
              onClick={() => setViewMode('grid-large')}
              className={`p-2 hover:text-pink-300 ${viewMode === 'grid-large' ? 'text-pink-300' : 'text-gray-400'}`}
            >
              <Grid size={20} />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 hover:text-pink-300 ${viewMode === 'grid' ? 'text-pink-300' : 'text-gray-400'}`}
            >
              <List size={20} />
            </button>
          </div>
          
          <div className="relative">
            <button 
              onClick={() => setShowSortMenu(!showSortMenu)}
              className="flex items-center gap-2 text-sm text-gray-600 hover:text-pink-300"
            >
              SORT BY: {sortBy.toUpperCase().replace('-', ' ')}
              <ChevronDown size={16} />
            </button>
            
            {showSortMenu && (
              <div className="absolute right-0 top-full mt-2 w-48 bg-white shadow-xl border border-gray-200 py-2 z-50">
                <button onClick={() => handleSort('featured')} className="w-full text-left px-4 py-2 text-sm hover:bg-pink-50">Featured</button>
                <button onClick={() => handleSort('price-low')} className="w-full text-left px-4 py-2 text-sm hover:bg-pink-50">Price: Low to High</button>
                <button onClick={() => handleSort('price-high')} className="w-full text-left px-4 py-2 text-sm hover:bg-pink-50">Price: High to Low</button>
                <button onClick={() => handleSort('rating')} className="w-full text-left px-4 py-2 text-sm hover:bg-pink-50">Top Rated</button>
                <button onClick={() => handleSort('name')} className="w-full text-left px-4 py-2 text-sm hover:bg-pink-50">Name: A to Z</button>
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
          <div className={`fixed inset-0 bg-black bg-opacity-50 z-50 lg:hidden transition-opacity duration-300 ${isMobileFilterOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} onClick={() => setIsMobileFilterOpen(false)} />

          {/* Sidebar */}
          <aside className={`fixed lg:relative top-0 left-0 h-full w-80 lg:w-72 bg-white z-50 transform transition-transform duration-300 overflow-y-auto ${isMobileFilterOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'} flex-shrink-0 border-r border-gray-200 lg:h-full`}>
            {/* Mobile Header */}
            <div className="lg:hidden flex items-center justify-between p-4 border-b border-gray-200 bg-pink-300">
              <h2 className="text-lg font-semibold text-white">FILTERS</h2>
              <button onClick={() => setIsMobileFilterOpen(false)} className="text-white">
                <X size={24} />
              </button>
            </div>

            {/* Active Filters Summary */}
            {(selectedFilters.collection.length > 0 || selectedFilters.price.length > 0 || selectedFilters.size.length > 0 || selectedFilters.color.length > 0) && (
              <div className="p-4 bg-pink-50 border-b border-gray-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-gray-700">ACTIVE FILTERS</span>
                  <button 
                    onClick={() => setSelectedFilters({ collection: [], price: [], size: [], color: [] })}
                    className="text-xs text-pink-300 hover:text-pink-400 font-medium"
                  >
                    Clear All
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {[...selectedFilters.collection, ...selectedFilters.price, ...selectedFilters.size, ...selectedFilters.color].map((filter, idx) => (
                    <span key={idx} className="inline-flex items-center gap-1 px-2 py-1 bg-white border border-pink-300 text-xs text-pink-300">
                      {filter}
                      <button onClick={() => {
                        if (selectedFilters.collection.includes(filter)) handleFilterChange('collection', filter);
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
                    Collection
                  </h2>
                  <ChevronDown 
                    size={18} 
                    className={`transform transition-transform text-pink-300 ${expandedCategories.collection === false ? '-rotate-90' : ''}`}
                  />
                </button>
                {expandedCategories.collection !== false && (
                  <div className="space-y-3">
                    {collections.map((collection, idx) => (
                      <label key={idx} className="flex items-start cursor-pointer group">
                        <input
                          type="checkbox"
                          checked={selectedFilters.collection.includes(collection.name)}
                          onChange={() => handleFilterChange('collection', collection.name)}
                          className="mt-1 mr-3 w-4 h-4 accent-pink-300 flex-shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <span className="text-sm text-gray-700 group-hover:text-pink-300 block">
                            {collection.name}
                          </span>
                          <span className="text-xs text-gray-400">{collection.count} items</span>
                        </div>
                      </label>
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
                    className={`transform transition-transform text-pink-300 ${expandedCategories.price === false ? '-rotate-90' : ''}`}
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
                          className="mr-3 w-4 h-4 accent-pink-300 flex-shrink-0"
                        />
                        <span className="text-sm text-gray-700 group-hover:text-pink-300 flex-1">
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
                    className={`transform transition-transform text-pink-300 ${expandedCategories.size === false ? '-rotate-90' : ''}`}
                  />
                </button>
                {expandedCategories.size !== false && (
                  <div className="grid grid-cols-2 gap-2">
                    {sizeRanges.map((size, idx) => (
                      <label 
                        key={idx} 
                        className={`flex items-center justify-center px-3 py-2 border cursor-pointer transition-all ${
                          selectedFilters.size.includes(size.label) 
                            ? 'border-pink-300 bg-pink-300 text-white' 
                            : 'border-gray-200 hover:border-pink-300 text-gray-700'
                        }`}
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
                    className={`transform transition-transform text-pink-300 ${expandedCategories.color === false ? '-rotate-90' : ''}`}
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
                          className={`w-8 h-8 border-2 mr-3 flex-shrink-0 transition-all ${
                            selectedFilters.color.includes(color.label) 
                              ? 'border-pink-300 ring-2 ring-pink-200' 
                              : 'border-gray-300 group-hover:border-pink-300'
                          }`}
                          style={{ background: color.hex }}
                        />
                        <span className="text-sm text-gray-700 group-hover:text-pink-300 flex-1">
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
                className="lg:hidden w-full py-3 bg-pink-300 text-white font-semibold hover:bg-pink-400 transition-colors"
              >
                APPLY FILTERS
              </button>
            </div>
          </aside>

          {/* Products Grid */}
          <main className="flex-1 overflow-y-auto h-full py-8">
            <div className={`grid gap-6 ${
              viewMode === 'grid-large' 
                ? 'grid-cols-2 md:grid-cols-3' 
                : 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4'
            }`}>
              {sortedProducts.map((product) => (
                <ProductCard 
                  key={product.id} 
                  product={product}
                  onAddToCart={handleAddToCart}
                  onToggleFavorite={handleToggleFavorite}
                  isFavorite={favorites.includes(product.id)}
                />
              ))}
            </div>
          </main>
        </div>
      </div>

      {/* Wishlist Button */}
      <button 
        onClick={() => alert(`You have ${favorites.length} items in your wishlist`)}
        className="fixed right-6 bottom-20 bg-pink-300 text-white p-4 shadow-lg hover:bg-pink-400 transition-colors"
      >
        <Heart size={24} fill="currentColor" />
        {favorites.length > 0 && (
          <span className="absolute -top-2 -right-2 bg-white text-pink-300 text-xs w-6 h-6 flex items-center justify-center font-bold border-2 border-pink-300">
            {favorites.length}
          </span>
        )}
      </button>

      {/* Cart Button */}
      <button 
        onClick={() => alert(`You have ${totalCartItems} items in your cart`)}
        className="fixed right-6 bottom-6 bg-pink-300 text-white p-4 shadow-lg hover:bg-pink-400 transition-colors"
      >
        <ShoppingCart size={24} />
        {totalCartItems > 0 && (
          <span className="absolute -top-2 -right-2 bg-white text-pink-300 text-xs w-6 h-6 flex items-center justify-center font-bold border-2 border-pink-300">
            {totalCartItems}
          </span>
        )}
      </button>
    </div>
    </div>
  );
};

export default ProductCollections;