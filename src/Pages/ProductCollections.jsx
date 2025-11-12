import React, { useState, useEffect } from 'react';
import { Grid, List, ChevronDown, Filter, X, Heart, Share2, ShoppingCart } from 'lucide-react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { getAllProducts, getProductsByCategory } from '../Firebase/productServices';
import HeroSection from '../Components/HeroSection';
import { addToCart, getUserCart, updateCartItem } from '../Firebase/cartServices';
import { auth } from '../Firebase/Firebase';

// ProductCard component (keep as is)
const ProductCard = ({ product, onAddToCart, onToggleFavorite, favorite, colors }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [selectedColor, setSelectedColor] = useState({});

  const getStockStatus = (stock) => {
    if (stock === 0 || !stock) {
      return { 
        label: 'Out of Stock', 
        bgColor: '#EF4444',
        textColor: '#FFFFFF'
      };
    } else if (stock <= 5) {
      return { 
        label: 'Low Stock', 
        bgColor: '#F59E0B',
        textColor: '#FFFFFF'
      };
    } else {
      return { 
        label: 'In Stock', 
        bgColor: '#10B981',
        textColor: '#FFFFFF'
      };
    }
  };

  const stockStatus = getStockStatus(product.stock);

  const handleShare = (e) => {
    e.preventDefault();
    setShowShareMenu(!showShareMenu);
  };

  const handleToggleFavorite = (e) => {
    e.preventDefault();
    onToggleFavorite(product.id);
  };

const handleAddToCart = async (product) => {
  const user = auth.currentUser;
  
  if (!user) {
    alert('Please login to add products to cart');
    // navigate('/login'); // Uncomment if you have login page
    return;
  }

  // Check stock
  if (product.stock === 0) {
    alert('This product is out of stock');
    return;
  }

  // Get selected size and color from product (first available as default)
  const selectedSize = product.sizes?.[0];
  const selectedColor = product.colors?.[0];

  if (!selectedSize) {
    alert('No size available for this product');
    return;
  }

  try {
    // First, get the user's current cart
    const currentCart = await getUserCart(user.uid);
    
    // Check if product with same ID and size already exists
    const existingItem = currentCart.find(
      item => item.productId === product.id && item.size === selectedSize
    );

    if (existingItem) {
      // Product exists - update quantity instead
      const newQuantity = existingItem.quantity + 1;
      
      // Check if new quantity exceeds stock
      if (newQuantity > product.stock) {
        alert(`Cannot add more items. Only ${product.stock} units available. You already have ${existingItem.quantity} in cart.`);
        return;
      }
      
      const result = await updateCartItem(user.uid, existingItem.cartItemId, newQuantity);
      
      if (result.success) {
        // Update local cart state
        setCart(prev => prev.map(item =>
          item.cartItemId === existingItem.cartItemId
            ? { ...item, quantity: newQuantity }
            : item
        ));
        alert(`Cart updated! Total quantity: ${newQuantity}`);
      } else {
        alert('Failed to update cart: ' + result.error);
      }
    } else {
      // Product doesn't exist - add new item
      const cartProduct = {
        id: product.id,
        name: product.name,
        price: product.price,
        images: product.images,
        stock: product.stock,
        category: product.category,
        collection: product.collection,
        brand: product.brand || '',
        rating: product.rating || 0
      };

      const result = await addToCart(user.uid, cartProduct, selectedSize, selectedColor, 1);
      
      if (result.success) {
        // Update local cart state
        setCart(prev => [...prev, {
          ...cartProduct,
          size: selectedSize,
          color: selectedColor,
          quantity: 1,
          cartItemId: result.cartItemId
        }]);
        alert('Product added to cart successfully!');
      } else {
        alert('Failed to add product to cart: ' + result.error);
      }
    }
  } catch (error) {
    console.error('Error handling cart:', error);
    alert('An error occurred. Please try again.');
  }
};

  return (
    <Link to={`/details/${product.id}`}>
      <div className="group cursor-pointer">
        <div 
          className="relative overflow-hidden bg-gray-100 aspect-[3/4] mb-3"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div 
            className="absolute top-3 left-3 px-2 py-1 text-xs font-semibold z-10"
            style={{ 
              backgroundColor: stockStatus.bgColor,
              color: stockStatus.textColor
            }}
          >
            {stockStatus.label}
          </div>

        

          <img
            src={product.images?.[0] || ''}
            alt={product.name}
            className={`w-full h-full object-cover transition-opacity duration-300 ${
              isHovered ? 'opacity-0' : 'opacity-100'
            }`}
          />
          <img
            src={product.images?.[1] || product.images?.[0] || ''}
            alt={product.name}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${
              isHovered ? 'opacity-100' : 'opacity-0'
            }`}
          />
          
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
                </div>
              )}
            </div>
          </div>

          <button
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            onMouseEnter={(e) => !e.currentTarget.disabled && (e.currentTarget.style.backgroundColor = colors.hover)}
            onMouseLeave={(e) => !e.currentTarget.disabled && (e.currentTarget.style.backgroundColor = colors.primary)}
            style={{ backgroundColor: product.stock === 0 ? '#9CA3AF' : colors.primary }}
            className={`absolute bottom-0 left-0 right-0 text-white py-3 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2 ${
              product.stock === 0 ? 'cursor-not-allowed' : ''
            }`}
          >
            <ShoppingCart size={18} />
            {product.stock === 0 ? 'OUT OF STOCK' : 'ADD TO CART'}
          </button>
        </div>
        
        <div className="text-center px-2">
          <h3 className="text-lg font-semibold text-gray-800 uppercase mb-1 tracking-wide">
            {product.name}
          </h3>
          <p className="text-xs text-gray-500 mb-2">({product.variants})</p>
          
          <div className="flex items-center justify-center gap-1 mb-1">
            {[...Array(5)].map((_, i) => (
              <span key={i} style={{ color: i < product.rating ? colors.primary : '#D1D5DB' }} className="text-xs">★</span>
            ))}
            <span className="text-xs text-gray-500 ml-1">{product.reviews} REVIEWS</span>
          </div>
          
          <p className="text-md font-semibold text-gray-800">
            ₦{product.price.toLocaleString()}
          </p>

          <p className="text-xs text-gray-500 mt-1">
            {product.stock > 0 && product.stock <= 5 
              ? `Only ${product.stock} left!` 
              : product.stock === 0 
                ? 'Out of stock' 
                : `${product.stock} available`
            }
          </p>
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

  // ADD THESE CONSTANT ARRAYS HERE:
  const priceRanges = [
    { label: "Under ₦20,000" },
    { label: "₦20,000 - ₦40,000" },
    { label: "₦40,000 - ₦60,000" },
    { label: "₦60,000 - ₦80,000" },
    { label: "Over ₦80,000" }
  ];

  const sizeRanges = [
    { label: "0-6 MTH" },
    { label: "6-12 MTH" },
    { label: "1-2 YEARS" },
    { label: "2-4 YEARS" },
    { label: "4-6 YEARS" },
    { label: "6-8 YEARS" },
    { label: "8-10 YEARS" },
    { label: "10-12 YEARS" }
  ];

  const colorOptions = [
    { label: "Pink", hex: "#EC4899" },
    { label: "Purple", hex: "#A855F7" },
    { label: "Blue", hex: "#3B82F6" },
    { label: "Red", hex: "#EF4444" },
    { label: "Yellow", hex: "#F59E0B" },
    { label: "Green", hex: "#10B981" },
    { label: "White", hex: "#FFFFFF" },
    { label: "Black", hex: "#000000" },
    { label: "Multi-Color", hex: "linear-gradient(45deg, #EC4899, #3B82F6, #10B981, #F59E0B)" }
  ];

  // Define Color Scheme
  const colorSchemes = {
    GIRLS: {
      primary: '#EC4899',
      hover: '#F472B6',
      bg: '#FCE7F3'
    },
    // ... rest of your code
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
  const getCollectionsByCategory = (category, products = []) => {
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

    const collections = collectionsMap[category] || [];
    
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

  const totalCartItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  const clearAllFilters = () => {
    setSelectedFilters({ collection: [], subcategory: [], price: [], size: [], color: [] });
    const params = new URLSearchParams();
    if (category) {
      params.set('category', category);
    }
    setSearchParams(params);
  };

  const colors = colorSchemes[category] || colorSchemes.DEFAULT;
  const collections = getCollectionsByCategory(category, allProducts);

  // Calculate filter counts
  const calculateFilterCounts = () => {
    const priceRanges = [
      { label: "Under ₦20,000", count: 0 },
      { label: "₦20,000 - ₦40,000", count: 0 },
      { label: "₦40,000 - ₦60,000", count: 0 },
      { label: "₦60,000 - ₦80,000", count: 0 },
      { label: "Over ₦80,000", count: 0 }
    ];

    const sizeRanges = [
      { label: "0-6 MTH", count: 0 },
      { label: "6-12 MTH", count: 0 },
      { label: "1-2 YEARS", count: 0 },
      { label: "2-4 YEARS", count: 0 },
      { label: "4-6 YEARS", count: 0 },
      { label: "6-8 YEARS", count: 0 },
      { label: "8-10 YEARS", count: 0 },
      { label: "10-12 YEARS", count: 0 }
    ];

    const colorOptions = [
      { label: "Pink", hex: "#EC4899", count: 0 },
      { label: "Purple", hex: "#A855F7", count: 0 },
      { label: "Blue", hex: "#3B82F6", count: 0 },
      { label: "Red", hex: "#EF4444", count: 0 },
      { label: "Yellow", hex: "#F59E0B", count: 0 },
      { label: "Green", hex: "#10B981", count: 0 },
      { label: "White", hex: "#FFFFFF", count: 0 },
      { label: "Black", hex: "#000000", count: 0 },
      { label: "Multi-Color", hex: "linear-gradient(45deg, #EC4899, #3B82F6, #10B981, #F59E0B)", count: 0 }
    ];

    const updatedPriceRanges = priceRanges.map(range => ({
      ...range,
      count: allProducts.filter(p => {
        if (range.label === "Under ₦20,000") return p.price < 20000;
        if (range.label === "₦20,000 - ₦40,000") return p.price >= 20000 && p.price < 40000;
        if (range.label === "₦40,000 - ₦60,000") return p.price >= 40000 && p.price < 60000;
        if (range.label === "₦60,000 - ₦80,000") return p.price >= 60000 && p.price < 80000;
        if (range.label === "Over ₦80,000") return p.price >= 80000;
        return false;
      }).length
    }));

    const updatedSizeRanges = sizeRanges.map(size => ({
      ...size,
      count: allProducts.filter(p => p.sizes?.includes(size.label)).length
    }));

    const updatedColorOptions = colorOptions.map(color => ({
      ...color,
      count: allProducts.filter(p => p.colors?.includes(color.label)).length
    }));

    return { updatedPriceRanges, updatedSizeRanges, updatedColorOptions };
  };

  const { updatedPriceRanges, updatedSizeRanges, updatedColorOptions } = calculateFilterCounts();

  // Initialize filters from URL on mount
  useEffect(() => {
    const collection = searchParams.get('collection');
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
  }, [searchParams]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const data = category 
          ? await getProductsByCategory(category)
          : await getAllProducts();
        setAllProducts(data);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [category]);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 mx-auto mb-4" style={{ borderColor: colors.primary }}></div>
          <p className="text-gray-600">Loading products...</p>
        </div>
      </div>
    );
  }
return (
  <div className="h-screen flex flex-col bg-white overflow-hidden">
     <HeroSection category={category} colors={colors} />
    {/* Header */}
  {/* You can reduce header size or remove it entirely since hero has the title */}
<header className="border-b border-gray-200 bg-white flex-shrink-0">
  <div className="max-w-7xl mx-auto px-4 py-4">
    <p className="text-center text-sm text-gray-500">
      {sortedProducts.length} Products Available
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
    <div className="flex-1 ">
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
              <div className="p-4  border-b border-gray-200" style={{ backgroundColor: colors.bg }}>
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

            <div className="p-4 overflow-y-auto h-96">
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
<main className="flex-1 h-full py-8">
  {sortedProducts.length === 0 ? (
    <div className="flex flex-col items-center justify-center h-full py-20">
      <div className="text-center">
        <svg 
          className="mx-auto h-24 w-24 text-gray-300 mb-4" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={1.5} 
            d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
          />
        </svg>
        <h3 className="text-xl font-semibold text-gray-700 mb-2">
          No Products Found
        </h3>
        <p className="text-gray-500 mb-6 max-w-md">
          We couldn't find any products matching your filters. Try adjusting your search criteria.
        </p>
        <button
          onClick={clearAllFilters}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = colors.hover}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = colors.primary}
          style={{ backgroundColor: colors.primary }}
          className="px-6 py-3 text-white font-semibold rounded-lg transition-colors inline-flex items-center gap-2"
        >
          <X size={18} />
          Clear All Filters
        </button>
      </div>
    </div>
  ) : (
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
  )}
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