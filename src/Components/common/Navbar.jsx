import React, { useState, useEffect, useRef } from 'react';
import { ShoppingCart, Search, Menu, X, User, LogOut } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';
import { useAuth } from '../../Firebase/AuthContext';
import { logout } from '../../Firebase/auth';

const Navbar = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  
  const navRef = useRef(null);
  const mobileMenuRef = useRef(null);
  const searchBarRef = useRef(null);
  const searchInputRef = useRef(null);
  const topBannerRef = useRef(null);
  const userDropdownRef = useRef(null);

  const searchData = [
    { id: 1, name: "Special Occasion Dresses", category: "Girls - Dresses", price: 45.99 },
    { id: 2, name: "Girls T-Shirts", category: "Girls - Tops", price: 19.99 },
    { id: 3, name: "Girls Blouses", category: "Girls - Tops", price: 24.99 },
    { id: 4, name: "Girls Jackets", category: "Girls - Tops", price: 52.99 },
    { id: 5, name: "Girls Denims", category: "Girls - Tops", price: 34.99 },
    { id: 6, name: "Boys T-Shirts", category: "Boys - Tops", price: 19.99 },
    { id: 7, name: "Boys Shorts", category: "Boys - Bottoms", price: 24.99 },
    { id: 8, name: "Boys Jeans", category: "Boys - Bottoms", price: 32.99 },
  ];

const menuStructure = {
  'NEW ARRIVALS': [
    'LATEST COLLECTION',
    'BEST SELLERS'
  ],

  'GIRLS': {
    'TWO-PIECE SETS': [
      'CORD SETS',
      'MATCHING TOP & BOTTOM'
    ],
    'DRESSES': [
      'CASUAL DRESSES',
      'SPECIAL OCCASION DRESSES'
    ],
    'TOPS': [
      'T-SHIRTS',
      'BLOUSES',
      'JACKETS'
    ],
    'BOTTOMS': [
      'SHORTS',
      'JEANS',
      'TROUSERS'
    ],
    'FOOTWEAR': [
      'SHOES',
      'SANDALS'
    ],
    'OTHERS': [
      'GIFT CARDS'
    ]
  },

  'BOYS': {
    'TWO-PIECE SETS': [
      'CORD SETS',
      'MATCHING TOP & BOTTOM'
    ],
    'TOPS': [
      'T-SHIRTS',
      'SHIRTS',
      'JACKETS'
    ],
    'BOTTOMS': [
      'SHORTS',
      'JEANS',
      'TROUSERS'
    ],
    'FOOTWEAR': [
      'SHOES',
      'SNEAKERS'
    ],
    'OTHERS': [
      'GIFT CARDS'
    ]
  },

  'BABY': {
    'BABY GIRL': [
      'TWO-PIECE SETS',
      'DRESSES'
    ],
    'BABY BOY': [
      'TWO-PIECE SETS'
    ],
    'FOOTWEAR': [
      'SOFT SHOES'
    ]
  },

  'ACCESSORIES': [
    'HAIR BOWS',
    'HATS',
    'BAGS',
    'SOCKS'
  ],

  'FOOTWEAR': [
    'BABY SHOES',
    'KIDS SHOES'
  ]
};

  const handleLogout = async () => {
    const result = await logout();
    if (result.success) {
      setIsUserDropdownOpen(false);
      navigate('/');
      alert('Logged out successfully!');
    } else {
      alert('Failed to logout. Please try again.');
    }
  };

  const handleSearch = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    
    if (query.trim() === '') {
      setSearchResults([]);
      setShowResults(false);
      return;
    }
    
    const filtered = searchData.filter(item =>
      item.name.toLowerCase().includes(query.toLowerCase()) ||
      item.category.toLowerCase().includes(query.toLowerCase())
    );
    
    setSearchResults(filtered);
    setShowResults(true);
  };

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(topBannerRef.current, {
        y: -50,
        opacity: 0,
        duration: 0.6,
        ease: 'power3.out'
      });
    }, navRef);

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    if (isSearchOpen && searchBarRef.current) {
      gsap.to(searchBarRef.current, {
        width: '100%',
        opacity: 1,
        duration: 0.5,
        ease: 'power3.out',
        onComplete: () => {
          searchInputRef.current?.focus();
        }
      });
    } else if (searchBarRef.current) {
      gsap.to(searchBarRef.current, {
        width: 0,
        opacity: 0,
        duration: 0.4,
        ease: 'power3.in'
      });
    }
  }, [isSearchOpen]);

  useEffect(() => {
    if (mobileMenuRef.current) {
      if (isMobileMenuOpen) {
        gsap.fromTo(mobileMenuRef.current,
          { height: 0, opacity: 0 },
          { height: 'auto', opacity: 1, duration: 0.4, ease: 'power2.out' }
        );
      } else {
        gsap.to(mobileMenuRef.current,
          { height: 0, opacity: 0, duration: 0.3, ease: 'power2.in' }
        );
      }
    }
  }, [isMobileMenuOpen]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userDropdownRef.current && !userDropdownRef.current.contains(event.target)) {
        setIsUserDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleDropdown = (dropdown) => {
    setActiveDropdown(activeDropdown === dropdown ? null : dropdown);
  };

  const handleSearchToggle = () => {
    setIsSearchOpen(!isSearchOpen);
  };

  useEffect(() => {
    if (!isMobileMenuOpen) {
      setSearchQuery('');
      setSearchResults([]);
      setShowResults(false);
    }
  }, [isMobileMenuOpen]);

  const getUserDisplayName = () => {
    if (currentUser?.displayName) {
      return currentUser.displayName.split(' ')[0];
    }
    if (currentUser?.email) {
      return currentUser.email.split('@')[0];
    }
    return 'User';
  };

  return (
    <nav ref={navRef} className="bg-white shadow-sm sticky top-0 z-[100]">
      {/* Top Banner */}
      <div ref={topBannerRef} className="bg-pink-50 text-gray-950 text-center py-2 text-sm font-medium">
        <div className="animate-pulse flex justify-center gap-2 items-center">
          We Deliver any and everywhere in Nigeria 
          <img src="https://s.w.org/images/core/emoji/15.0.3/svg/1f1f3-1f1ec.svg" alt="" className='w-3 h-3' />
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 relative">
          {/* Logo */}
          <Link to="/" className="flex-shrink-0 cursor-pointer hover:scale-105 transition-transform duration-300">
            <div className="px-4 py-2 rounded-lg">
              <img src="https://lovestorybyanna.com/wp-content/uploads/2025/02/cropped-Black-and-Yellow-Classy-and-Refined-Curved-Text-Logo-70x69.png" alt="Love Story by Anna" />
              <p className="text-xs text-white font-medium">Making Kids Happy</p>
            </div>
          </Link>

          {/* Desktop Navigation Menu */}
          {!isSearchOpen && (
            <div className="hidden md:flex items-center justify-center space-x-8 pb-4 border-gray-200 ">
              {Object.keys(menuStructure).map((menuItem) => {
                const hasDropdown = typeof menuStructure[menuItem] === 'object' && Object.keys(menuStructure[menuItem]).length > 0;
                
                return (
                  <div key={menuItem} className="relative group ">
                    <button className="text-sm font-semibold text-gray-700 hover:text-pink-300 transition-colors duration-300 py-2">
                      {menuItem}
                    </button>
                    
                {hasDropdown && (
  <div className="absolute left-0 top-full mt-0 bg-white shadow-xl rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 z-[110] w-full min-w-[500px]">
    <div className="grid grid-cols-4 gap-6 p-6">
      {Array.isArray(menuStructure[menuItem]) ? (
        // Handle simple arrays (NEW ARRIVALS, ACCESSORIES, FOOTWEAR)
        <div>
          <div className="space-y-2">
            {menuStructure[menuItem].map((item) => (
              <Link 
                key={item}
                to="/collections"
                className="block text-sm text-gray-600 hover:text-pink-300 hover:translate-x-1 transition-all duration-200"
              >
                {item}
              </Link>
            ))}
          </div>
        </div>
      ) : (
        // Handle nested objects (GIRLS, BOYS, BABY)
        Object.entries(menuStructure[menuItem]).map(([category, items]) => (
          <div key={category}>
            <h3 className="font-bold text-red-600 mb-3 text-sm">{category}</h3>
            <div className="space-y-2">
              {items.map((item) => (
                <Link 
                  key={item}
                  to="/collections"
                  className="block text-sm text-gray-600 hover:text-pink-300 hover:translate-x-1 transition-all duration-200"
                >
                  {item}
                </Link>
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  </div>
)}
                  </div>
                );
              })}
            </div>
          )}

          {/* Desktop Search Bar */}
          {isSearchOpen && (
            <div
              ref={searchBarRef}
              className="hidden md:block absolute left-1/2 transform -translate-x-1/2 w-0 opacity-0"
              style={{ maxWidth: '500px' }}
            >
              <div className="relative">
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Search for products..."
                  value={searchQuery}
                  onChange={handleSearch}
                  className="w-full px-4 py-2 pr-10 border-2 border-gray-300 rounded-full focus:outline-none focus:border-pink-300 transition-colors"
                />
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                
                {showResults && searchResults.length > 0 && (
                  <div className="absolute top-full mt-2 w-full bg-white rounded-lg shadow-xl max-h-96 overflow-y-auto z-[110] border border-gray-200">
                    {searchResults.map((item) => (
                      <div
                        key={item.id}
                        className="px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0 transition-colors"
                      >
                        <div className="font-medium text-gray-800">{item.name}</div>
                        <div className="text-sm text-gray-500">{item.category}</div>
                        <div className="text-pink-300 font-semibold mt-1">₦{item.price}</div>
                      </div>
                    ))}
                  </div>
                )}
                
                {showResults && searchResults.length === 0 && searchQuery.trim() !== '' && (
                  <div className="absolute top-full mt-2 w-full bg-white rounded-lg shadow-xl p-4 z-[110] border border-gray-200">
                    <p className="text-gray-500 text-center">No products found</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Right Side Icons */}
          <div className="hidden md:flex items-center space-x-6">
            <button 
              onClick={handleSearchToggle}
              className="text-gray-600 hover:text-pink-300 transition-all duration-300 hover:scale-110"
            >
              {isSearchOpen ? <X className="w-6 h-6" /> : <Search className="w-6 h-6" />}
            </button>

            {/* User Dropdown */}
            <div className="relative" ref={userDropdownRef}>
              <button 
                onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                className="flex items-center gap-2 text-gray-600 hover:text-pink-300 transition-all duration-300 hover:scale-110"
              >
                <User className="w-6 h-6" />
                {currentUser && (
                  <span className="text-sm font-medium hidden lg:block">
                    {getUserDisplayName()}
                  </span>
                )}
              </button>
              
              {/* User Dropdown Menu */}
              {isUserDropdownOpen && (
                <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded shadow-xl border border-gray-200 py-2 z-[120]">
                  {currentUser ? (
                    <>
                      {/* Logged In Menu */}
                      <div className="px-4 py-2 border-b border-gray-200">
                        <p className="text-sm font-semibold text-gray-800">
                          {currentUser.displayName || 'User'}
                        </p>
                        <p className="text-xs text-gray-500 truncate">
                          {currentUser.email}
                        </p>
                      </div>
                      <Link 
                        to="/profile/account" 
                        onClick={() => setIsUserDropdownOpen(false)}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-pink-50 hover:text-pink-300 transition-colors"
                      >
                        Manage Account
                      </Link>
                      <Link 
                        to="/profile/orders"
                        onClick={() => setIsUserDropdownOpen(false)}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-pink-50 hover:text-pink-300 transition-colors"
                      >
                        My Orders
                      </Link>
                      <Link 
                        to="/profile/wishlist"
                        onClick={() => setIsUserDropdownOpen(false)}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-pink-50 hover:text-pink-300 transition-colors"
                      >
                        Wishlist
                      </Link>
                      <Link 
                        to="/profile/addresses"
                        onClick={() => setIsUserDropdownOpen(false)}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-pink-50 hover:text-pink-300 transition-colors"
                      >
                        Address Book
                      </Link>
                      <div className="border-t border-gray-200 my-2"></div>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors flex items-center gap-2"
                      >
                        <LogOut className="w-4 h-4" />
                        Logout
                      </button>
                    </>
                  ) : (
                    <>
                      {/* Not Logged In Menu */}
                      <Link 
                        to="/login"
                        onClick={() => setIsUserDropdownOpen(false)}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-pink-50 hover:text-pink-300 transition-colors"
                      >
                        Login
                      </Link>
                      <Link 
                        to="/signup"
                        onClick={() => setIsUserDropdownOpen(false)}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-pink-50 hover:text-pink-300 transition-colors"
                      >
                        Sign Up
                      </Link>
                    </>
                  )}
                </div>
              )}
            </div>

            <Link to="/cart" className="relative text-gray-600 hover:text-pink-300 transition-all duration-300 hover:scale-110 group">
              <ShoppingCart className="w-6 h-6" />
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center group-hover:scale-125 transition-transform duration-300">
                4
              </span>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden text-gray-700 hover:text-pink-300 transition-transform duration-300 hover:scale-110"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div ref={mobileMenuRef} className="md:hidden bg-white border-t border-gray-200 absolute top-full left-0 right-0 shadow-lg overflow-hidden max-h-[80vh] overflow-y-auto z-[110]">
          <div className="px-4 py-4 space-y-3">
            {/* Mobile Search */}
            <div className="mb-4 relative">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search for products..."
                  value={searchQuery}
                  onChange={handleSearch}
                  className="w-full px-4 py-2 pr-10 border-2 border-gray-300 rounded-full focus:outline-none focus:border-pink-300 transition-colors"
                />
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              </div>
              
              {showResults && searchResults.length > 0 && (
                <div className="absolute top-full mt-2 w-full bg-white rounded-lg shadow-xl max-h-64 overflow-y-auto z-[120] border border-gray-200">
                  {searchResults.map((item) => (
                    <div
                      key={item.id}
                      className="px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0 transition-colors"
                    >
                      <div className="font-medium text-gray-800">{item.name}</div>
                      <div className="text-sm text-gray-500">{item.category}</div>
                      <div className="text-pink-300 font-semibold mt-1">₦{item.price}</div>
                    </div>
                  ))}
                </div>
              )}
              
              {showResults && searchResults.length === 0 && searchQuery.trim() !== '' && (
                <div className="absolute top-full mt-2 w-full bg-white rounded-lg shadow-xl p-4 border border-gray-200 z-[120]">
                  <p className="text-gray-500 text-center">No products found</p>
                </div>
              )}
            </div>

            {/* Navigation items */}
            <div className={showResults && searchQuery.trim() !== '' ? 'hidden' : 'space-y-3'}>
              {Object.keys(menuStructure).map((menuItem) => {
                const hasDropdown = typeof menuStructure[menuItem] === 'object' && Object.keys(menuStructure[menuItem]).length > 0;
                
                return (
                  <div key={menuItem}>
                    {hasDropdown ? (
                      <>
                        <button
                          onClick={() => toggleDropdown(menuItem)}
                          className="flex items-center justify-between w-full text-gray-700 font-semibold py-2 hover:text-pink-300 transition-colors text-sm"
                        >
                          <span>{menuItem}</span>
                          <span className={`transform transition-transform duration-300 ${activeDropdown === menuItem ? 'rotate-180' : ''}`}>▼</span>
                        </button>
                     {activeDropdown === menuItem && (
  <div className="pl-4 space-y-3 mt-2 pb-2">
    {Array.isArray(menuStructure[menuItem]) ? (
      // Handle simple arrays
      <div className="space-y-1 pl-2">
        {menuStructure[menuItem].map((item) => (
          <Link 
            key={item}
            to="/collections"
            className="block text-xs text-gray-600 hover:text-pink-300 py-1 hover:translate-x-2 transition-all duration-200"
          >
            {item}
          </Link>
        ))}
      </div>
    ) : (
      // Handle nested objects
      Object.entries(menuStructure[menuItem]).map(([category, items]) => (
        <div key={category}>
          <h4 className="font-bold text-red-600 text-xs mb-2">{category}</h4>
          <div className="space-y-1 pl-2">
            {items.map((item) => (
              <Link 
                key={item}
                to="/collections"
                className="block text-xs text-gray-600 hover:text-pink-300 py-1 hover:translate-x-2 transition-all duration-200"
              >
                {item}
              </Link>
            ))}
          </div>
        </div>
      ))
    )}
  </div>
)}
                      </>
                    ) : (
                      <Link 
                        to="/collections"
                        className="block text-gray-700 font-semibold py-2 hover:text-pink-300 hover:translate-x-2 transition-all duration-200 text-sm"
                      >
                        {menuItem}
                      </Link>
                    )}
                  </div>
                );
              })}

              {/* Mobile Icons */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                {currentUser ? (
                  <>
                    <Link 
                      to="/profile"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center space-x-2 text-gray-700 hover:text-pink-300 transition-colors"
                    >
                      <User className="w-5 h-5" />
                      <span className="text-sm">{getUserDisplayName()}</span>
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex items-center space-x-2 text-red-600 hover:text-red-700 transition-colors"
                    >
                      <LogOut className="w-5 h-5" />
                      <span className="text-sm">Logout</span>
                    </button>
                  </>
                ) : (
                  <>
                    <Link 
                      to="/login"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center space-x-2 text-gray-700 hover:text-pink-300 transition-colors"
                    >
                      <User className="w-5 h-5" />
                      <span className="text-sm">Login</span>
                    </Link>
                    <Link 
                      to="/signup"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="text-sm text-pink-500 font-semibold hover:underline"
                    >
                      Sign Up
                    </Link>
                  </>
                )}
                <Link 
                  to="/cart"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center space-x-2 text-gray-700 hover:text-pink-300 transition-colors"
                >
                  <ShoppingCart className="w-5 h-5" />
                  <span className="text-sm">Cart (0)</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;