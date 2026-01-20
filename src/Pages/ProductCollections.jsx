import React, { useState, useEffect } from 'react';
import { Grid, List, ChevronDown, Filter, X, Heart, Share2, ShoppingCart } from 'lucide-react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import HeroSection from '../Components/HeroSection';
import { getAllProducts, getProductsByCategory } from '../firebase/productServices';
import { db } from '../firebase/firebaseConfig';
import { collection, getDocs } from 'firebase/firestore';
import { useCart } from '../Context/CartContext';
import { useWishlist } from '../Context/WishlistContext';
import { useAuth } from '../Context/AuthContextCore';
import { useToast } from '../Context/ToastContext';
import InlineLoader from '../Components/common/InlineLoader';

// ProductCard component
const ProductCard = ({ product, colors }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const { addItemToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { currentUser } = useAuth();
  const toast = useToast();
  const [isAdding, setIsAdding] = useState(false);

  const favorite = isInWishlist(product.id);

  const getStockStatus = (stock) => {
    if (stock === 0 || !stock) {
      return {
        label: 'Out of Stock',
        bgColor: '#fee2e2', // red-100
        textColor: '#ef4444' // red-500
      };
    } else if (stock <= 5) {
      return {
        label: 'Low Stock',
        bgColor: '#fef3c7', // amber-100
        textColor: '#d97706' // amber-600
      };
    } else {
      return {
        label: 'In Stock',
        bgColor: '#d1fae5', // emerald-100
        textColor: '#059669' // emerald-600
      };
    }
  };

  const stockStatus = getStockStatus(product.stock);

  const handleShare = (e) => {
    e.preventDefault();
    setShowShareMenu(!showShareMenu);
  };

  const handleToggleFavorite = async (e) => {
    e.preventDefault();
    if (!currentUser) {
      toast.warning('Please login to save items to wishlist');
      return;
    }
    await toggleWishlist(product);
  };

  const handleAddToCart = async (e) => {
    e.preventDefault();
    if (product.stock === 0) return;

    setIsAdding(true);
    try {
      const defaultSize = product.sizes?.[0] || 'One Size';
      await addItemToCart({
        ...product,
        selectedSize: defaultSize,
        quantity: 1
      });
      toast.success(`${product.name} (Size: ${defaultSize}) added to cart!`);
    } catch (err) {
      toast.error('Failed to add to cart');
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <Link to={`/details/${product.id}`} className="block h-full">
      <div
        className="group relative h-full flex flex-col bg-white rounded-3xl overflow-hidden transition-all duration-300 hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-gray-100"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Image Container */}
        <div className="relative aspect-[4/5] overflow-hidden bg-gray-50 m-2 rounded-2xl">
          {/* Badge */}
          <div
            className="absolute top-3 left-3 px-3 py-1 text-xs font-bold rounded-full z-10 shadow-sm transaction-colors duration-300"
            style={{
              backgroundColor: stockStatus.bgColor,
              color: stockStatus.textColor
            }}
          >
            {stockStatus.label}
          </div>

          {/* Action Buttons */}
          <div className="absolute top-3 right-3 flex flex-col gap-2 z-10 translate-x-12 group-hover:translate-x-0 transition-transform duration-300">
            <button
              onClick={handleToggleFavorite}
              className={`p-2.5 rounded-full shadow-sm hover:shadow-md transition-all duration-300 ${favorite ? 'bg-pink-100 text-pink-500' : 'bg-white text-gray-500 hover:bg-pink-50 hover:text-pink-500'}`}
            >
              <Heart size={18} fill={favorite ? 'currentColor' : 'none'} strokeWidth={2.5} />
            </button>

            <div className="relative">
              <button
                onClick={handleShare}
                className="p-2.5 bg-white rounded-full shadow-sm text-gray-500 hover:bg-blue-50 hover:text-blue-500 hover:shadow-md transition-all duration-300"
              >
                <Share2 size={18} strokeWidth={2.5} />
              </button>

              {showShareMenu && (
                <div className="absolute right-full mr-3 top-0 bg-white rounded-xl shadow-xl border border-gray-100 p-2 flex flex-col gap-1 z-20 min-w-[120px] animate-in slide-in-from-right-2 fade-in duration-200">
                  {['Facebook', 'Twitter', 'Whatsapp', 'Copy Link'].map((item) => (
                    <button
                      key={item}
                      className="text-xs px-3 py-2 text-left text-gray-600 hover:bg-gray-50 rounded-lg transition-colors font-medium"
                    >
                      {item}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <img
            src={product.images?.[0] || ''}
            alt={product.name}
            className={`w-full h-full object-cover transition-all duration-700 ease-in-out ${isHovered ? 'scale-110 opacity-0' : 'scale-100 opacity-100'}`}
          />
          <img
            src={product.images?.[1] || product.images?.[0] || ''}
            alt={product.name}
            className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 ease-in-out ${isHovered ? 'scale-110 opacity-100' : 'scale-100 opacity-0'}`}
          />

          {/* Quick Add Button */}
          <div className="absolute inset-x-3 bottom-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out z-10">
            <button
              onClick={handleAddToCart}
              disabled={product.stock === 0 || isAdding}
              className="w-full py-3 rounded-xl text-sm font-bold shadow-lg flex items-center justify-center gap-2 transform active:scale-95 transition-all"
              style={{
                backgroundColor: product.stock === 0 ? '#9CA3AF' : colors.primary,
                color: 'white'
              }}
            >
              <ShoppingCart size={18} strokeWidth={2.5} />
              {product.stock === 0 ? 'OUT OF STOCK' : isAdding ? 'ADDING...' : 'ADD TO CART'}
            </button>
          </div>
        </div>

        {/* Product Details */}
        <div className="px-4 pb-4 pt-1 flex flex-col flex-1">
          <div className="text-xs font-bold tracking-wider mb-1 opacity-60" style={{ color: colors.primary }}>
            {product.collection}
          </div>

          <h3 className="text-base font-bold text-gray-800 leading-tight mb-2 line-clamp-2">
            {product.name}
          </h3>

          <div className="mt-auto">
            <div className="flex items-center gap-1 mb-2">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className={`w-3.5 h-3.5 ${i < product.rating ? 'fill-current' : 'text-gray-200 fill-current'}`}
                    viewBox="0 0 20 20"
                    style={{ color: i < product.rating ? '#FBBF24' : undefined }}
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <span className="text-xs text-gray-400 font-medium ml-1">({product.reviews})</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-lg font-black text-gray-900">
                ₦{product.price.toLocaleString()}
              </span>
              {product.stock <= 5 && product.stock > 0 && (
                <span className="text-[10px] font-bold px-2 py-1 bg-red-50 text-red-500 rounded-full">
                  Only {product.stock} left
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

const ProductCollections = () => {
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const category = searchParams.get('category') || 'GIRLS';
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState('grid');
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [sortBy, setSortBy] = useState('featured');
  const [showSortMenu, setShowSortMenu] = useState(false);
  const { cartCount } = useCart();
  const { wishlistCount } = useWishlist();
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
    color: [],
    search: searchParams.get('q') || ''
  });
  const [fetchError, setFetchError] = useState(null);

  // Filter options
  // Dynamic Filter Counts
  const getFilterCounts = (filterType, option) => {
    return allProducts.filter(p => {
      if (filterType === 'price') {
        if (option === "Under ₦20,000") return p.price < 20000;
        if (option === "₦20,000 - ₦40,000") return p.price >= 20000 && p.price < 40000;
        if (option === "₦40,000 - ₦60,000") return p.price >= 40000 && p.price < 60000;
        if (option === "₦60,000 - ₦80,000") return p.price >= 60000 && p.price < 80000;
        if (option === "Over ₦80,000") return p.price >= 80000;
      }
      if (filterType === 'size') return p.sizes?.includes(option);
      if (filterType === 'color') return p.colors?.includes(option);
      return false;
    }).length;
  };

  const priceRanges = [
    { label: "Under ₦20,000" },
    { label: "₦20,000 - ₦40,000" },
    { label: "₦40,000 - ₦60,000" },
    { label: "₦60,000 - ₦80,000" },
    { label: "Over ₦80,000" }
  ].map(r => ({ ...r, count: getFilterCounts('price', r.label) }));

  const sizeRanges = [
    "0-6 MTH", "6-12 MTH", "1-2 YEARS", "2-4 YEARS", "4-6 YEARS", "6-8 YEARS", "8-10 YEARS", "10-12 YEARS"
  ].map(s => ({ label: s, count: getFilterCounts('size', s) }));

  const colorOptions = [
    { label: "Pink", hex: "#EC4899" },
    { label: "Purple", hex: "#A855F7" },
    { label: "Blue", hex: "#3B82F6" },
    { label: "Red", hex: "#EF4444" },
    { label: "Yellow", hex: "#F59E0B" },
    { label: "Green", hex: "#10B981" },
    { label: "White", hex: "#FFFFFF" },
    { label: "Black", hex: "#000000" }
  ].map(c => ({ ...c, count: getFilterCounts('color', c.label) }));

  // Define Color Scheme
  const colorSchemes = {
    GIRLS: {
      primary: '#EC4899',
      hover: '#F472B6',
      bg: '#FCE7F3'
    },
    BOYS: {
      primary: '#3B82F6',
      hover: '#60A5FA',
      bg: '#EFF6FF'
    },
    BABY: {
      primary: '#A855F7',
      hover: '#C084FC',
      bg: '#FAF5FF'
    },
    DEFAULT: {
      primary: '#EC4899',
      hover: '#F472B6',
      bg: '#FCE7F3'
    }
  };

  // Get collections by category
  const getCollectionsByCategoryInternal = (cat, products = []) => {
    const collectionsMap = {
      'GIRLS': [
        { name: 'TWO-PIECE SETS', subcategories: ['CORD SETS', 'MATCHING TOP & BOTTOM'] },
        { name: 'DRESSES', subcategories: ['CASUAL DRESSES', 'SPECIAL OCCASION DRESSES'] },
        { name: 'TOPS', subcategories: ['T-SHIRTS', 'BLOUSES', 'JACKETS'] },
        { name: 'BOTTOMS', subcategories: ['SHORTS', 'JEANS', 'TROUSERS'] },
        { name: 'FOOTWEAR', subcategories: [] },
        { name: 'OTHERS', subcategories: [] }
      ],
      'BOYS': [
        { name: 'TWO-PIECE SETS', subcategories: ['CORD SETS', 'MATCHING TOP & BOTTOM'] },
        { name: 'TOPS', subcategories: ['T-SHIRTS', 'SHIRTS', 'JACKETS'] },
        { name: 'BOTTOMS', subcategories: ['SHORTS', 'JEANS', 'TROUSERS'] },
        { name: 'FOOTWEAR', subcategories: [] },
        { name: 'OTHERS', subcategories: [] }
      ],
      'BABY': [
        { name: 'BABY GIRL', subcategories: ['TWO-PIECE SETS', 'DRESSES'] },
        { name: 'BABY BOY', subcategories: ['TWO-PIECE SETS'] },
        { name: 'FOOTWEAR', subcategories: [] }
      ],
      'NEW ARRIVALS': [
        { name: 'LATEST COLLECTION', subcategories: [] },
        { name: 'BEST SELLERS', subcategories: [] }
      ],
      'ACCESSORIES': [
        { name: 'HAIR ACCESSORIES', subcategories: [] },
        { name: 'FASHION ACCESSORIES', subcategories: [] }
      ],
      'FOOTWEAR': [
        { name: 'BABY SHOES', subcategories: [] },
        { name: 'KIDS SHOES', subcategories: [] }
      ]
    };

    const collections = collectionsMap[cat] || [];

    return collections.map(collection => ({
      ...collection,
      count: products.filter(p => p.collection === collection.name).length
    }));
  };

  const getCategoryTitle = () => {
    const categoryTitles = {
      'GIRLS': 'Girls Collection',
      'BOYS': 'Boys Collection',
      'BABY': 'Baby Collection',
      'NEW ARRIVALS': 'New Arrivals',
      'ACCESSORIES': 'Accessories',
      'FOOTWEAR': 'Footwear'
    };
    return categoryTitles[category] || 'Girls Collection';
  };

  const title = getCategoryTitle();

  const handleFilterChange = (filterType, value) => {
    setSelectedFilters(prev => {
      const currentFilters = prev[filterType];
      const newFilters = currentFilters.includes(value)
        ? currentFilters.filter(item => item !== value)
        : [...currentFilters, value];

      const updatedFilters = { ...prev, [filterType]: newFilters };

      const params = new URLSearchParams(searchParams);
      if (category) params.set('category', category);
      Object.entries(updatedFilters).forEach(([key, values]) => {
        if (values.length > 0) {
          params.set(key, values.join(','));
        } else {
          params.delete(key);
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

  const filteredProducts = allProducts.filter(product => {
    // Search Filter - Add null/undefined check
    if (selectedFilters.search && selectedFilters.search.trim() !== '') {
      const searchLower = selectedFilters.search.toLowerCase();
      const matchesSearch =
        product.name?.toLowerCase().includes(searchLower) ||
        product.collection?.toLowerCase().includes(searchLower) ||
        (product.description && product.description.toLowerCase().includes(searchLower));

      if (!matchesSearch) return false;
    }

    if (selectedFilters.collection.length > 0) {
      if (!selectedFilters.collection.includes(product.collection)) {
        return false;
      }
    }

    if (selectedFilters.subcategory.length > 0) {
      if (!selectedFilters.subcategory.includes(product.subcategory)) {
        return false;
      }
    }

    if (selectedFilters.price.length > 0) {
      const matchesPrice = selectedFilters.price.some(range => {
        if (range === "Under ₦20,000") return product.price < 20000;
        if (range === "₦20,000 - ₦40,000") return product.price >= 20000 && product.price < 40000;
        if (range === "₦40,000 - ₦60,000") return product.price >= 40000 && product.price < 60000;
        if (range === "₦60,000 - ₦80,000") return product.price >= 60000 && product.price < 80000;
        if (range === "Over ₦80,000") return product.price >= 80000;
        return false;
      });
      if (!matchesPrice) return false;
    }

    if (selectedFilters.size.length > 0) {
      const matchesSize = selectedFilters.size.some(size =>
        product.sizes?.includes(size)
      );
      if (!matchesSize) return false;
    }

    if (selectedFilters.color.length > 0) {
      const matchesColor = selectedFilters.color.some(color =>
        product.colors?.includes(color)
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

  const clearAllFilters = () => {
    setSelectedFilters({ collection: [], subcategory: [], price: [], size: [], color: [] });
    const params = new URLSearchParams();
    if (category) {
      params.set('category', category);
    }
    setSearchParams(params);
  };

  const colors = colorSchemes[category] || colorSchemes.DEFAULT;
  const collections = getCollectionsByCategoryInternal(category, allProducts);

  // Initialize filters from URL on mount
  useEffect(() => {
    const coll = searchParams.get('collection');
    const sub = searchParams.get('subcategory');
    const price = searchParams.get('price');
    const sz = searchParams.get('size');
    const clr = searchParams.get('color');
    const q = searchParams.get('q');

    const newFilters = {
      collection: coll ? coll.split(',') : [],
      subcategory: sub ? sub.split(',') : [],
      price: price ? price.split(',') : [],
      size: sz ? sz.split(',') : [],
      color: clr ? clr.split(',') : [],
      search: q || ''
    };

    setSelectedFilters(newFilters);
  }, [searchParams]);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setFetchError(null);

      try {
        console.log(`🔍 Fetching products for category: ${category || 'ALL'}`);

        let products = [];

        // Fetch without timeout race - let Firebase handle its own timeouts
        if (category && category !== 'ALL') {
          products = await getProductsByCategory(category);
        } else {
          products = await getAllProducts();
        }

        console.log(`✅ Successfully fetched ${products?.length || 0} products`);

        if (products && products.length > 0) {
          setAllProducts(products);
        } else {
          console.log('ℹ️ Database returned empty list');
          setAllProducts([]);
        }
      } catch (error) {
        console.error('❌ Error fetching products:', error);

        // Provide more specific error messages
        let errorMessage = 'Failed to load products. ';

        if (error.message?.includes('timeout') || error.message?.includes('timed out')) {
          errorMessage += 'The request took too long. Please check your internet connection and try again.';
        } else if (error.message?.includes('network') || error.message?.includes('fetch')) {
          errorMessage += 'Unable to connect to the server. Please check your internet connection.';
        } else if (error.code === 'PGRST116') {
          errorMessage = 'No products found in the database.';
        } else {
          errorMessage += error.message || 'An unexpected error occurred.';
        }

        setFetchError(errorMessage);
        setAllProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [category]);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-white">
        <InlineLoader size="lg" text="Loading products..." />
      </div>
    );
  }

  // Error state
  if (fetchError) {
    const testConnection = async () => {
      try {
        console.log('🔍 Testing Firebase connection...');
        const productsRef = collection(db, 'products');
        const snapshot = await getDocs(productsRef);
        alert(`✅ Connection successful! Found ${snapshot.size} products in database.`);
      } catch (err) {
        alert(`❌ Connection test failed: ${err.message}`);
      }
    };

    return (
      <div className="h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 p-4">
        <div className="text-center max-w-lg mx-auto p-8 bg-white rounded-3xl shadow-xl">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <X size={40} className="text-red-500" />
          </div>
          <h2 className="text-2xl font-black text-gray-800 mb-3">Failed to Load Products</h2>
          <p className="text-gray-600 mb-6">{fetchError}</p>

          <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 mb-6 text-left">
            <p className="text-sm font-bold text-blue-900 mb-2">💡 Troubleshooting Tips:</p>
            <ul className="text-xs text-blue-800 space-y-1 list-disc list-inside">
              <li>Check your internet connection</li>
              <li>Verify Firebase credentials in .env file</li>
              <li>Ensure the 'products' collection exists in Firestore</li>
              <li>Check browser console for detailed errors</li>
            </ul>
          </div>

          <div className="flex gap-3 justify-center">
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-gradient-to-r from-pink-400 to-purple-400 text-white font-bold rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all"
            >
              Try Again
            </button>
            <button
              onClick={testConnection}
              className="px-6 py-3 bg-white border-2 border-gray-200 text-gray-700 font-bold rounded-full hover:border-gray-300 hover:bg-gray-50 transition-all"
            >
              Test Connection
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-[#F9FAFB] overflow-hidden">
      <HeroSection category={category} colors={colors} />

      {/* Header */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <p className="text-sm font-medium text-gray-500">
            Showing <span className="font-bold text-gray-900">{sortedProducts.length}</span> Results for <span style={{ color: colors.primary }} className="font-bold">{title}</span>
          </p>

          <div className="flex items-center space-x-4">
            <div className="hidden lg:flex items-center bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode('grid-large')}
                className={`p-2 rounded-md transition-all ${viewMode === 'grid-large' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-400 hover:text-gray-600'}`}
              >
                <Grid size={18} />
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-md transition-all ${viewMode === 'grid' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-400 hover:text-gray-600'}`}
              >
                <List size={18} />
              </button>
            </div>

            <div className="relative">
              <button
                onClick={() => setShowSortMenu(!showSortMenu)}
                className="flex items-center gap-2 text-sm font-semibold text-gray-700 bg-white border border-gray-200 px-4 py-2 rounded-full hover:border-gray-300 transition-colors"
              >
                <span className="text-gray-400 font-normal">Sort:</span> {sortBy.toUpperCase().replace('-', ' ')}
                <ChevronDown size={16} />
              </button>

              {showSortMenu && (
                <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-50 overflow-hidden animate-in slide-in-from-top-2 fade-in duration-200">
                  {[
                    { label: 'Featured', value: 'featured' },
                    { label: 'Price: Low to High', value: 'price-low' },
                    { label: 'Price: High to Low', value: 'price-high' },
                    { label: 'Top Rated', value: 'rating' },
                    { label: 'Name: A to Z', value: 'name' }
                  ].map((option) => (
                    <button
                      key={option.value}
                      onClick={() => handleSort(option.value)}
                      className="w-full text-left px-5 py-3 text-sm font-medium transition-colors hover:bg-gray-50 flex items-center justify-between group"
                    >
                      <span className={sortBy === option.value ? 'text-gray-900' : 'text-gray-500'}>{option.label}</span>
                      {sortBy === option.value && <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: colors.primary }} />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button
              onClick={() => setIsMobileFilterOpen(true)}
              className="lg:hidden p-2 text-gray-600 bg-white border border-gray-200 rounded-full"
            >
              <Filter size={20} />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 ">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex flex-col lg:flex-row gap-8">

            {/* Sidebar */}
            <>
              {/* Mobile Overlay */}
              <div
                className={`fixed inset-0 bg-black/30 backdrop-blur-sm z-[10000] lg:hidden transition-opacity duration-300 ${isMobileFilterOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                onClick={() => setIsMobileFilterOpen(false)}
              />

              <aside
                className={`fixed lg:relative top-0 left-0 h-full w-[300px] lg:w-72 bg-white lg:bg-transparent lg:h-auto z-[10001] lg:z-0 transform transition-transform duration-300 overflow-y-auto lg:overflow-visible flex-shrink-0 ${isMobileFilterOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
              >
                <div className="bg-white rounded-3xl lg:shadow-sm lg:border lg:border-gray-100 p-5 min-h-full">

                  {/* Mobile Header */}
                  <div className="flex lg:hidden items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-gray-900">Filters</h2>
                    <button onClick={() => setIsMobileFilterOpen(false)} className="p-2 bg-gray-100 rounded-full text-gray-500">
                      <X size={20} />
                    </button>
                  </div>

                  {/* Active Filters */}
                  {(selectedFilters.collection.length > 0 || selectedFilters.subcategory?.length > 0 || selectedFilters.price.length > 0 || selectedFilters.size.length > 0 || selectedFilters.color.length > 0) && (
                    <div className="mb-8">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Active Filters</span>
                        <button onClick={clearAllFilters} className="text-xs font-bold hover:underline" style={{ color: colors.primary }}>
                          Clear All
                        </button>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {[...selectedFilters.collection, ...(selectedFilters.subcategory || []), ...selectedFilters.price, ...selectedFilters.size, ...selectedFilters.color].map((filter, idx) => (
                          <div
                            key={idx}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-gray-50 text-gray-700 border border-gray-100"
                          >
                            {filter}
                            <button
                              onClick={() => {
                                if (selectedFilters.collection.includes(filter)) handleFilterChange('collection', filter);
                                if (selectedFilters.subcategory?.includes(filter)) handleFilterChange('subcategory', filter);
                                if (selectedFilters.price.includes(filter)) handleFilterChange('price', filter);
                                if (selectedFilters.size.includes(filter)) handleFilterChange('size', filter);
                                if (selectedFilters.color.includes(filter)) handleFilterChange('color', filter);
                              }}
                              className="text-gray-400 hover:text-red-500"
                            >
                              <X size={12} strokeWidth={3} />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Collections */}
                  <div className="mb-6">
                    <button
                      className="w-full flex items-center justify-between py-2 group"
                      onClick={() => setExpandedCategories(prev => ({ ...prev, collection: !prev.collection }))}
                    >
                      <span className="text-sm font-bold text-gray-900">Collections</span>
                      <ChevronDown size={16} className={`text-gray-400 transition-transform duration-200 ${expandedCategories.collection ? 'rotate-180' : ''}`} />
                    </button>

                    {expandedCategories.collection && (
                      <div className="mt-3 space-y-3">
                        {collections.map((collection, idx) => (
                          <div key={idx}>
                            <label className="flex items-start gap-3 cursor-pointer group/item">
                              <div className="relative flex items-center">
                                <input
                                  type="checkbox"
                                  checked={selectedFilters.collection.includes(collection.name)}
                                  onChange={() => handleFilterChange('collection', collection.name)}
                                  className="peer h-4 w-4 rounded border-gray-300 text-pink-500 focus:ring-pink-500"
                                  style={{ accentColor: colors.primary }}
                                />
                              </div>
                              <div className="flex-1">
                                <span className="text-sm font-medium text-gray-700 group-hover/item:text-gray-900 transition-colors">
                                  {collection.name}
                                </span>
                                {/* Subcategories */}
                                {collection.subcategories.length > 0 && (
                                  <div className="ml-1 mt-2 space-y-1.5 pl-2 border-l-2 border-gray-100">
                                    {collection.subcategories.map((sub, subIdx) => (
                                      <label key={subIdx} className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-1 rounded-md -ml-1">
                                        <input
                                          type="checkbox"
                                          checked={selectedFilters.subcategory?.includes(sub)}
                                          onChange={() => handleFilterChange('subcategory', sub)}
                                          className="h-3 w-3 rounded border-gray-300"
                                          style={{ accentColor: colors.primary }}
                                        />
                                        <span className="text-xs text-gray-500 font-medium">{sub}</span>
                                      </label>
                                    ))}
                                  </div>
                                )}
                              </div>
                            </label>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="w-full h-px bg-gray-100 my-6" />

                  {/* Price */}
                  <div className="mb-6">
                    <button
                      className="w-full flex items-center justify-between py-2"
                      onClick={() => setExpandedCategories(prev => ({ ...prev, price: !prev.price }))}
                    >
                      <span className="text-sm font-bold text-gray-900">Price Range</span>
                      <ChevronDown size={16} className={`text-gray-400 transition-transform duration-200 ${expandedCategories.price ? 'rotate-180' : ''}`} />
                    </button>
                    {expandedCategories.price && (
                      <div className="mt-3 space-y-2">
                        {priceRanges.map((range, idx) => (
                          <label key={idx} className="flex items-center gap-3 cursor-pointer group">
                            <input type="checkbox" checked={selectedFilters.price.includes(range.label)} onChange={() => handleFilterChange('price', range.label)} style={{ accentColor: colors.primary }} className="h-4 w-4 rounded border-gray-300" />
                            <span className="text-sm text-gray-600 group-hover:text-gray-900">{range.label}</span>
                          </label>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="w-full h-px bg-gray-100 my-6" />

                  {/* Size */}
                  <div className="mb-6">
                    <button
                      className="w-full flex items-center justify-between py-2"
                      onClick={() => setExpandedCategories(prev => ({ ...prev, size: !prev.size }))}
                    >
                      <span className="text-sm font-bold text-gray-900">Size (Age)</span>
                      <ChevronDown size={16} className={`text-gray-400 transition-transform duration-200 ${expandedCategories.size ? 'rotate-180' : ''}`} />
                    </button>
                    {expandedCategories.size && (
                      <div className="mt-3 grid grid-cols-2 gap-2">
                        {sizeRanges.map((sz, idx) => (
                          <label
                            key={idx}
                            className={`flex items-center justify-center px-2 py-2 border rounded-xl text-xs font-bold cursor-pointer transition-all duration-200 ${selectedFilters.size.includes(sz.label) ? 'text-white shadow-md transform scale-105' : 'border-gray-100 text-gray-600 hover:border-gray-300'}`}
                            style={selectedFilters.size.includes(sz.label) ? { backgroundColor: colors.primary, borderColor: colors.primary } : {}}
                          >
                            <input type="checkbox" checked={selectedFilters.size.includes(sz.label)} onChange={() => handleFilterChange('size', sz.label)} className="hidden" />
                            {sz.label}
                          </label>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="w-full h-px bg-gray-100 my-6" />

                  {/* Color */}
                  <div>
                    <button
                      className="w-full flex items-center justify-between py-2"
                      onClick={() => setExpandedCategories(prev => ({ ...prev, color: !prev.color }))}
                    >
                      <span className="text-sm font-bold text-gray-900">Colors</span>
                      <ChevronDown size={16} className={`text-gray-400 transition-transform duration-200 ${expandedCategories.color ? 'rotate-180' : ''}`} />
                    </button>
                    {expandedCategories.color && (
                      <div className="mt-3 flex flex-wrap gap-3">
                        {colorOptions.map((clr, idx) => (
                          <label key={idx} className="cursor-pointer group relative">
                            <input type="checkbox" checked={selectedFilters.color.includes(clr.label)} onChange={() => handleFilterChange('color', clr.label)} className="hidden" />
                            <div
                              className={`w-8 h-8 rounded-full border-2 transition-all duration-200 ${selectedFilters.color.includes(clr.label) ? 'scale-110 shadow-md ring-2 ring-offset-2' : 'hover:scale-105'}`}
                              style={{
                                background: clr.hex,
                                borderColor: clr.label === 'White' ? '#E5E7EB' : 'transparent',
                                ringColor: colors.primary
                              }}
                            />
                            <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] bg-gray-800 text-white px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                              {clr.label}
                            </span>
                          </label>
                        ))}
                      </div>
                    )}
                  </div>

                </div>
              </aside>
            </>


            {/* Products Grid */}
            <main className="flex-1">
              {sortedProducts.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-dashed border-gray-200">
                  <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                    <Filter size={40} className="text-gray-300" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">No Matches Found</h3>
                  <p className="text-gray-500 mb-6 text-center max-w-sm">
                    We couldn't find any products matching those filters. maybe try exploring other collections?
                  </p>
                  <button
                    onClick={clearAllFilters}
                    style={{ backgroundColor: colors.primary }}
                    className="px-8 py-3 text-white font-bold rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all flex items-center gap-2"
                  >
                    Clear All Filters
                  </button>
                </div>
              ) : (
                <div className={`grid gap-6 ${viewMode === 'grid-large' ? 'grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3' : 'grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4'}`}>
                  {sortedProducts.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      colors={colors}
                    />
                  ))}
                </div>
              )}
            </main>
          </div>
        </div>
      </div>

      {/* Floating Action Buttons */}
      <div className="fixed right-6 bottom-6 flex flex-col gap-4 z-[50]">
        <Link
          to="/wishlist"
          style={{ backgroundColor: colors.primary }}
          className="w-14 h-14 rounded-full shadow-lg shadow-pink-500/20 text-white flex items-center justify-center hover:scale-110 transition-transform duration-300 relative group"
        >
          <Heart size={24} fill="currentColor" />
          <span className="absolute right-full mr-3 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">Wishlist</span>
          {wishlistCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-white text-pink-500 text-[10px] w-5 h-5 flex items-center justify-center font-bold rounded-full border-2 border-pink-500">
              {wishlistCount}
            </span>
          )}
        </Link>

        <Link
          to="/cart"
          style={{ backgroundColor: colors.primary }}
          className="w-14 h-14 rounded-full shadow-lg shadow-pink-500/20 text-white flex items-center justify-center hover:scale-110 transition-transform duration-300 relative group"
        >
          <ShoppingCart size={24} />
          <span className="absolute right-full mr-3 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">Cart</span>
          {cartCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-white text-pink-500 text-[10px] w-5 h-5 flex items-center justify-center font-bold rounded-full border-2 border-pink-500">
              {cartCount}
            </span>
          )}
        </Link>
      </div>

    </div>
  );
};

export default ProductCollections;