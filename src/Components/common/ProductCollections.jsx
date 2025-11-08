import React, { useState } from 'react';
import { Grid, List, ChevronDown, Filter, X } from 'lucide-react'; // Add Filter, X
import { Link, useNavigate, useSearchParams } from 'react-router-dom'; // Add this import


const ProductCard = ({ product }) => {

const [isHovered, setIsHovered] = useState(false)

  return (
    <Link to='/details'>
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
      </div>
      
      <div className="text-center px-2">
        <h3 className="text-sm font-medium text-gray-800 uppercase mb-1 tracking-wide">
          {product.name}
        </h3>
        <p className="text-xs text-gray-500 mb-2">({product.variants})</p>
        
        <div className="flex items-center justify-center gap-1 mb-1">
          {[...Array(5)].map((_, i) => (
            <span key={i} className="text-gray-300 text-xs">★</span>
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
const [viewMode, setViewMode] = useState('grid');
const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false); // Add this
const [sortBy, setSortBy] = useState('featured'); // Add this
const [showSortMenu, setShowSortMenu] = useState(false); // Add this
const [selectedFilters, setSelectedFilters] = useState({
  collection: [],
  price: [],
  size: [], // Add this
  color: [] // Add this
});

const navigate = useNavigate(); // Add this
const [searchParams, setSearchParams] = useSearchParams(); // Add this

  const products = [
    {
      id: 1,
      name: "Boys Blue Ankara Short Sleeve Shirt",
      variants: "0",
      reviews: 0,
      price: 37950,
      image1: "https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?w=400&h=600&fit=crop",
      image2: "https://images.unsplash.com/photo-1519058082700-08a0b56da9b4?w=400&h=600&fit=crop"
    },
    {
      id: 2,
      name: "Boys Green Short Sleeve Cuban Collar Ankara Short Set",
      variants: "0",
      reviews: 0,
      price: 57950,
      image1: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=400&h=600&fit=crop",
      image2: "https://images.unsplash.com/photo-1490578474895-699cd4e2cf59?w=400&h=600&fit=crop"
    },
    {
      id: 3,
      name: "Green Ankara Cuban Collar Short Sleeve Shirt",
      variants: "0",
      reviews: 0,
      price: 45950,
      image1: "https://images.unsplash.com/photo-1516826957135-700dedea698c?w=400&h=600&fit=crop",
      image2: "https://images.unsplash.com/photo-1544441892-794166f1e3be?w=400&h=600&fit=crop"
    },
    {
      id: 4,
      name: "Multi-Color Ankara Short Sleeve Shirt",
      variants: "0",
      reviews: 0,
      price: 47950,
      image1: "https://images.unsplash.com/photo-1581803118522-7b72a50f7e9f?w=400&h=600&fit=crop",
      image2: "https://images.unsplash.com/photo-1617127365659-c47fa864d8bc?w=400&h=600&fit=crop"
    },
    {
      id: 5,
      name: "Red Ankara Traditional Set",
      variants: "0",
      reviews: 0,
      price: 52950,
      image1: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=400&h=600&fit=crop",
      image2: "https://images.unsplash.com/photo-1564859228273-274232fdb516?w=400&h=600&fit=crop"
    },
    {
      id: 6,
      name: "Blue Ankara Jacket Set",
      variants: "0",
      reviews: 0,
      price: 64950,
      image1: "https://images.unsplash.com/photo-1504593811423-6dd665756598?w=400&h=600&fit=crop",
      image2: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=400&h=600&fit=crop"
    }
  ];



  const collections = [
    { name: "Ankara Styles For Children (TIMOTIWA)", count: 114 },
    { name: "Boys Ankara Styles", count: 48 },
    { name: "BOYS ANKARA TOPS", count: 39 },
    { name: "BOYS ANKARA BOTTOMS", count: 5 },
    { name: "BOYS ANKARA SETS", count: 10 },
    { name: "Girls Ankara Styles", count: 67 }
  ];

  const priceRanges = [
    { label: "Under ₦10,000", count: 9 },
    { label: "₦10,000 - ₦20,000", count: 15 },
    { label: "₦20,000 - ₦30,000", count: 11 },
    { label: "₦30,000 - ₦40,000", count: 8 }
  ];
  const sizeRanges = [
  { label: "0-6 Months", count: 12 },
  { label: "6-12 Months", count: 18 },
  { label: "1-2 Years", count: 24 },
  { label: "2-3 Years", count: 20 },
  { label: "3-4 Years", count: 22 },
  { label: "4-5 Years", count: 19 },
  { label: "5-6 Years", count: 15 }
];

const colorOptions = [
  { label: "Red", count: 14, hex: "#EF4444" },
  { label: "Blue", count: 18, hex: "#3B82F6" },
  { label: "Green", count: 16, hex: "#10B981" },
  { label: "Yellow", count: 10, hex: "#F59E0B" },
  { label: "Multi-Color", count: 25, hex: "linear-gradient(45deg, #EF4444, #3B82F6, #10B981)" }
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

// Update URL when filters change
React.useEffect(() => {
  const params = new URLSearchParams();
  
  Object.entries(selectedFilters).forEach(([key, values]) => {
    if (values.length > 0) {
      params.set(key, values.join(','));
    }
  });
  
  if (sortBy !== 'featured') {
    params.set('sort', sortBy);
  }
  
  const newUrl = params.toString() ? `?${params.toString()}` : '';
  navigate(newUrl, { replace: true });
}, [selectedFilters, sortBy, navigate]);

const handleSort = (option) => {
  setSortBy(option);
  setShowSortMenu(false);
};

const filteredProducts = products.filter(product => {
  // Price filter
  if (selectedFilters.price.length > 0) {
    const matchesPrice = selectedFilters.price.some(range => {
      if (range === "Under ₦10,000") return product.price < 10000;
      if (range === "₦10,000 - ₦20,000") return product.price >= 10000 && product.price < 20000;
      if (range === "₦20,000 - ₦30,000") return product.price >= 20000 && product.price < 30000;
      if (range === "₦30,000 - ₦40,000") return product.price >= 30000 && product.price < 40000;
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
  return 0;
});


  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <h1 className="text-2xl md:text-3xl font-light text-center tracking-wider text-gray-800">
            BOYS ANKARA STYLES
          </h1>
        </div>
      </header>

     {/* Toolbar */}
<div className="border-b border-gray-200">
  <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
    <div className="flex gap-2">
      {/* Mobile Filter Button */}
      <button
        onClick={() => setIsMobileFilterOpen(true)}
        className="lg:hidden p-2 text-gray-600 hover:text-gray-800"
      >
        <Filter size={20} />
      </button>
      
      <button
        onClick={() => setViewMode('grid-large')}
        className={`p-2 ${viewMode === 'grid-large' ? 'text-gray-800' : 'text-gray-400'}`}
      >
        <Grid size={20} />
      </button>
      <button
        onClick={() => setViewMode('grid')}
        className={`p-2 ${viewMode === 'grid' ? 'text-gray-800' : 'text-gray-400'}`}
      >
        <List size={20} />
      </button>
    </div>
    
    <div className="relative">
      <button 
        onClick={() => setShowSortMenu(!showSortMenu)}
        className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-800"
      >
        SORT BY: {sortBy.toUpperCase().replace('-', ' ')}
        <ChevronDown size={16} />
      </button>
      
      {showSortMenu && (
        <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded shadow-xl border border-gray-200 py-2 z-50">
          <button onClick={() => handleSort('featured')} className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50">Featured</button>
          <button onClick={() => handleSort('price-low')} className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50">Price: Low to High</button>
          <button onClick={() => handleSort('price-high')} className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50">Price: High to Low</button>
          <button onClick={() => handleSort('name')} className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50">Name: A to Z</button>
        </div>
      )}
    </div>
  </div>
</div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
        {/* Mobile Filter Overlay */}
<div className={`fixed inset-0 bg-black bg-opacity-50 z-50 lg:hidden transition-opacity duration-300 ${isMobileFilterOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} onClick={() => setIsMobileFilterOpen(false)} />

{/* Sidebar */}
<aside className={`fixed lg:relative top-0 left-0 h-full w-80 lg:w-64 bg-white z-50 transform transition-transform duration-300 overflow-y-auto ${isMobileFilterOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'} flex-shrink-0`}>
  {/* Mobile Close Button */}
  <div className="lg:hidden flex items-center justify-between p-4 border-b border-gray-200">
    <h2 className="text-lg font-semibold">Filters</h2>
    <button onClick={() => setIsMobileFilterOpen(false)}>
      <X size={24} />
    </button>
  </div>

  <div className="p-4 lg:p-0">
    {/* Collection Filter */}
    <div className="mb-8">
      <h2 className="text-sm font-semibold text-gray-800 mb-4 pb-2 border-b-2 border-gray-800">
        COLLECTION
      </h2>
      <div className="space-y-2">
        {collections.map((collection, idx) => (
          <label key={idx} className="flex items-center justify-between cursor-pointer group">
            <div className="flex items-center flex-1">
              <input
                type="checkbox"
                checked={selectedFilters.collection.includes(collection.name)}
                onChange={() => handleFilterChange('collection', collection.name)}
                className="mr-3 w-4 h-4 border-gray-300"
              />
              <span className="text-sm text-gray-700 group-hover:text-gray-900">
                {collection.name}
              </span>
            </div>
            <span className="text-sm text-gray-500">({collection.count})</span>
          </label>
        ))}
      </div>
    </div>

    {/* Price Filter */}
    <div className="mb-8">
      <h2 className="text-sm font-semibold text-gray-800 mb-4 pb-2 border-b-2 border-gray-800">
        PRICE
      </h2>
      <div className="space-y-3">
        {priceRanges.map((range, idx) => (
          <label key={idx} className="flex items-center cursor-pointer group">
            <input
              type="checkbox"
              checked={selectedFilters.price.includes(range.label)}
              onChange={() => handleFilterChange('price', range.label)}
              className="mr-3 w-4 h-4 border-gray-300"
            />
            <span className="text-sm text-gray-700 group-hover:text-gray-900 flex-1">
              {range.label}
            </span>
            <span className="text-sm text-gray-500">({range.count})</span>
          </label>
        ))}
      </div>
    </div>

    {/* Size Filter */}
    <div className="mb-8">
      <h2 className="text-sm font-semibold text-gray-800 mb-4 pb-2 border-b-2 border-gray-800">
        SIZE (AGE)
      </h2>
      <div className="space-y-3">
        {sizeRanges.map((size, idx) => (
          <label key={idx} className="flex items-center cursor-pointer group">
            <input
              type="checkbox"
              checked={selectedFilters.size.includes(size.label)}
              onChange={() => handleFilterChange('size', size.label)}
              className="mr-3 w-4 h-4 border-gray-300"
            />
            <span className="text-sm text-gray-700 group-hover:text-gray-900 flex-1">
              {size.label}
            </span>
            <span className="text-sm text-gray-500">({size.count})</span>
          </label>
        ))}
      </div>
    </div>

    {/* Color Filter */}
    <div className="mb-8">
      <h2 className="text-sm font-semibold text-gray-800 mb-4 pb-2 border-b-2 border-gray-800">
        COLOR
      </h2>
      <div className="space-y-3">
        {colorOptions.map((color, idx) => (
          <label key={idx} className="flex items-center cursor-pointer group">
            <input
              type="checkbox"
              checked={selectedFilters.color.includes(color.label)}
              onChange={() => handleFilterChange('color', color.label)}
              className="mr-3 w-4 h-4 border-gray-300"
            />
            <div 
              className="w-6 h-6 rounded-full border border-gray-300 mr-2"
              style={{ background: color.hex }}
            />
            <span className="text-sm text-gray-700 group-hover:text-gray-900 flex-1">
              {color.label}
            </span>
            <span className="text-sm text-gray-500">({color.count})</span>
          </label>
        ))}
      </div>
    </div>

    {/* Clear Filters Button */}
    <button 
      onClick={() => setSelectedFilters({ collection: [], price: [], size: [], color: [] })}
      className="w-full py-2 border border-gray-300 text-sm text-gray-700 hover:bg-gray-50 rounded"
    >
      Clear All Filters
    </button>
  </div>
</aside>

          {/* Products Grid */}
          <main className="flex-1">
            <div className={`grid gap-6 ${
              viewMode === 'grid-large' 
                ? 'grid-cols-2 md:grid-cols-3' 
                : 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4'
            }`}>
              {sortedProducts.map((product) => (
  <ProductCard key={product.id} product={product} />
))}
            </div>
          </main>
        </div>
      </div>

      {/* Wishlist Button */}
      <button className="fixed right-6 bottom-6 bg-pink-500 text-white p-4 rounded-full shadow-lg hover:bg-pink-600 transition-colors">
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
        </svg>
      </button>
    </div>
  );
};

export default ProductCollections;