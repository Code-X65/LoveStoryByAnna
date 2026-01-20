import React, { useState, useEffect, useRef } from 'react';
import { ShoppingCart, Search, Menu, X, User, LogOut, ShoppingBag } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';
import Logo from '../../assets/Logo.png'

import { useAuth } from '../../Context/AuthContextCore';
import { useCart } from '../../Context/CartContext';
import { useToast } from '../../Context/ToastContext';

const Navbar = () => {
  const navigate = useNavigate();
  const { currentUser, userProfile, logout } = useAuth();
  const { cartCount } = useCart();
  const toast = useToast();

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
    // Add confirmation dialog
    const confirmLogout = window.confirm('Are you sure you want to log out?');

    if (!confirmLogout) {
      return; // User cancelled
    }

    setIsUserDropdownOpen(false);
    setIsMobileMenuOpen(false);

    try {
      console.log('🔴 Logging out...');
      await logout();

      console.log('✅ Logout successful');
      toast.success('You have been logged out successfully');

      // Navigate to login page
      navigate('/login');
    } catch (error) {
      console.error('❌ Logout failed:', error);
      toast.error('Logout failed. Please try again.');
    }
  };

  const handleSearch = async (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (query.trim() === '') {
      setSearchResults([]);
      setShowResults(false);
      return;
    }

    // Search products from database
    try {
      const { searchProducts } = await import('../../firebase/productServices');
      const results = await searchProducts(query);

      // Map to expected format
      const formattedResults = results.slice(0, 5).map(product => ({
        id: product.id,
        name: product.name,
        images: product.images || [],
        category: product.category,
        collection: product.collection,
        price: product.price
      }));

      setSearchResults(formattedResults);
      setShowResults(true);
    } catch (error) {
      console.error('Search error:', error);
      setSearchResults([]);
      setShowResults(false);
    }
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
    if (userProfile?.firstName) return userProfile.firstName;
    if (currentUser?.email) return currentUser.email.split('@')[0];
    return 'User';
  };

  return (
    <nav ref={navRef} className="sticky top-0 z-[9999] font-sans">
      {/* Top Banner */}
      <div ref={topBannerRef} className="bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 text-white text-center py-2.5 text-xs font-bold tracking-widest relative overflow-hidden">
        <div className="absolute inset-0 bg-white/10 opacity-50 patterned-bg"></div>
        <div className="animate-pulse flex justify-center gap-2 items-center relative z-10">
          <span className="drop-shadow-md">✨ FREE SHIPPING ON ORDERS OVER ₦50,000 ✨</span>
        </div>
      </div>

      {/* Main Navbar Container */}
      <div className="bg-white/95 backdrop-blur-xl border-b border-gray-100 shadow-sm transition-all duration-300 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20 md:h-24">

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-gray-400 hover:text-pink-500 hover:bg-pink-50 rounded-full transition-all duration-300"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            {/* Logo area */}
            <Link to="/" className="flex-shrink-0 flex items-center gap-3 group">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-pink-50 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300 border-2 border-pink-100">
                <img src={Logo} alt="Logo" className="w-6 md:w-8 h-auto" />
              </div>
              <div className="flex flex-col">
                <h1 className="text-xl md:text-2xl font-black text-gray-800 tracking-tight group-hover:text-pink-500 transition-colors leading-none">
                  LoveStory
                </h1>
                <span className="text-[10px] md:text-xs font-bold text-gray-400 tracking-widest uppercase">By Anna</span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            {!isSearchOpen && (
              <div className="hidden md:flex items-center justify-center gap-1 lg:gap-2">
                {Object.keys(menuStructure).map((menuItem) => {
                  const hasDropdown = typeof menuStructure[menuItem] === 'object' && Object.keys(menuStructure[menuItem]).length > 0;
                  return (
                    <div key={menuItem} className="relative group px-1">
                      <button className="px-3 py-2 rounded-full text-sm font-bold text-gray-500 hover:text-gray-900 hover:bg-gray-50 transition-all duration-300 flex items-center gap-1 group-hover:ring-2 ring-gray-100">
                        {menuItem}
                        {hasDropdown && <span className="text-[10px] opacity-50 mt-0.5">▼</span>}
                      </button>

                      {hasDropdown && (
                        <div className="absolute left-1/2 -translate-x-1/2 top-full mt-4 w-[600px] bg-white rounded-3xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform translate-y-2 group-hover:translate-y-0 z-50 overflow-hidden">
                          <div className="absolute inset-0 bg-gradient-to-b from-gray-50/50 to-transparent pointer-events-none" />
                          <div className="relative p-8 grid grid-cols-3 gap-8">
                            {Array.isArray(menuStructure[menuItem]) ? (
                              <div className="col-span-3 grid grid-cols-2 gap-4">
                                {menuStructure[menuItem].map(item => (
                                  <Link key={item} to={`/collections?collection=${encodeURIComponent(item)}&category=${encodeURIComponent(menuItem)}`} className="block p-3 rounded-xl hover:bg-pink-50 transition-colors">
                                    <span className="font-bold text-gray-700">{item}</span>
                                  </Link>
                                ))}
                              </div>
                            ) : (
                              Object.entries(menuStructure[menuItem]).map(([category, items]) => (
                                <div key={category} className="space-y-3">
                                  <h3 className="text-xs font-black text-pink-400 uppercase tracking-widest border-b border-gray-100 pb-2">
                                    {category}
                                  </h3>
                                  <div className="space-y-1">
                                    {items.map((item) => (
                                      <Link
                                        key={item}
                                        to={`/collections?collection=${encodeURIComponent(category)}&subcategory=${encodeURIComponent(item)}&category=${encodeURIComponent(menuItem)}`}
                                        className="block text-sm text-gray-500 hover:text-gray-900 hover:translate-x-1 transition-all duration-200 py-0.5 font-medium"
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

            {/* Search Bar Container */}
            <div ref={searchBarRef} className={`hidden md:flex items-center absolute left-1/2 transform -translate-x-1/2 transition-all duration-300 ${isSearchOpen ? 'w-full max-w-2xl opacity-100 pointer-events-auto' : 'w-0 opacity-0 pointer-events-none'}`}>
              <div className="relative w-full">
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Search for clothes, toys, accessories..."
                  value={searchQuery}
                  onChange={handleSearch}
                  className="w-full pl-6 pr-12 py-3 bg-gray-50 border-2 border-transparent focus:border-pink-200 focus:bg-white rounded-full outline-none transition-all placeholder-gray-400 font-medium text-gray-700 shadow-inner"
                />
                <button onClick={() => { setIsSearchOpen(false); setSearchQuery(''); }} className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 bg-gray-200 rounded-full text-gray-500 hover:bg-gray-300">
                  <X size={14} />
                </button>

                {/* Search Results */}
                {showResults && (
                  <div className="absolute top-full left-0 right-0 mt-4 bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden max-h-[400px] overflow-y-auto z-50 animate-in fade-in slide-in-from-top-2">
                    {searchResults.length > 0 ? searchResults.map(item => (
                      <Link to={`/details/${item.id}`} key={item.id} className="flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-0" onClick={() => setIsSearchOpen(false)}>
                        <img src={item.images?.[0]} alt={item.name} className="w-12 h-12 rounded-lg object-cover bg-gray-100" />
                        <div>
                          <h4 className="font-bold text-gray-800 text-sm">{item.name}</h4>
                          <div className="text-xs text-gray-500 font-medium mt-0.5">{item.category} • {item.collection}</div>
                        </div>
                        <div className="ml-auto font-black text-pink-500 text-sm">₦{item.price.toLocaleString()}</div>
                      </Link>
                    )) : (
                      <div className="p-8 text-center text-gray-400 text-sm font-medium">No matches found 😔</div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-2 md:gap-4">
              {/* Search Toggle */}
              <button
                onClick={handleSearchToggle}
                className={`p-2.5 rounded-full text-gray-400 hover:bg-blue-50 hover:text-blue-500 transition-all duration-300 ${isSearchOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
              >
                <Search size={22} strokeWidth={2.5} />
              </button>

              {/* User Profile */}
              <div className="relative" ref={userDropdownRef}>
                <button
                  onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                  className="flex items-center gap-2 p-1.5 pr-3 rounded-full hover:bg-gray-50 border border-transparent hover:border-gray-100 transition-all duration-300 group"
                >
                  <div className="w-8 h-8 rounded-full overflow-hidden bg-gradient-to-tr from-purple-100 to-pink-100 flex items-center justify-center text-purple-600 font-bold text-xs ring-2 ring-transparent group-hover:ring-purple-200 transition-all">
                    {userProfile?.photoURL ? (
                      <img src={userProfile.photoURL} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      (() => {
                        if (userProfile?.firstName && userProfile?.lastName) {
                          return `${userProfile.firstName[0]}${userProfile.lastName[0]}`.toUpperCase();
                        } else if (userProfile?.displayName) {
                          const names = userProfile.displayName.split(' ');
                          if (names.length >= 2) {
                            return `${names[0][0]}${names[1][0]}`.toUpperCase();
                          }
                          return userProfile.displayName.substring(0, 2).toUpperCase();
                        } else if (currentUser?.email) {
                          return currentUser.email[0].toUpperCase();
                        }
                        return <User size={16} />;
                      })()
                    )}
                  </div>
                </button>

                {isUserDropdownOpen && (
                  <div className="absolute right-0 top-full mt-3 w-64 bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-200 origin-top-right">
                    <div className="p-4 bg-gray-50 border-b border-gray-100">
                      {currentUser ? (
                        <>
                          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Signed In</p>
                          <p className="text-sm font-black text-gray-800 truncate">{currentUser.email}</p>
                        </>
                      ) : (
                        <p className="text-sm font-bold text-gray-600 text-center">Welcome! 👋</p>
                      )}
                    </div>
                    <div className="p-2 space-y-1">
                      {currentUser ? (
                        <>
                          <Link to="/profile" className="flex items-center gap-3 px-4 py-3 text-sm font-semibold text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-xl transition-colors" onClick={() => setIsUserDropdownOpen(false)}>
                            <User size={18} /> Profile
                          </Link>
                          <Link to="/order" className="flex items-center gap-3 px-4 py-3 text-sm font-semibold text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-xl transition-colors" onClick={() => setIsUserDropdownOpen(false)}>
                            <ShoppingBag size={18} /> Orders
                          </Link>
                          <Link to="/wishlist" className="flex items-center gap-3 px-4 py-3 text-sm font-semibold text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-xl transition-colors" onClick={() => setIsUserDropdownOpen(false)}>
                            {/* Heart Icon manually since not imported in context but good to have */}
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
                            Wishlist
                          </Link>
                          <div className="h-px bg-gray-100 my-1" />
                          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-red-500 hover:bg-red-50 rounded-xl transition-colors">
                            <LogOut size={18} /> Log Out
                          </button>
                        </>
                      ) : (
                        <div className="grid grid-cols-2 gap-2 p-2">
                          <Link to="/login" className="flex justify-center py-2.5 rounded-xl bg-gray-100 text-gray-700 text-sm font-bold hover:bg-gray-200 transition-colors" onClick={() => setIsUserDropdownOpen(false)}>
                            Log In
                          </Link>
                          <Link to="/signup" className="flex justify-center py-2.5 rounded-xl bg-gray-900 text-white text-sm font-bold hover:bg-gray-800 transition-colors" onClick={() => setIsUserDropdownOpen(false)}>
                            Sign Up
                          </Link>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Cart */}
              <Link to="/cart" className="relative p-2.5 rounded-full text-gray-600 hover:bg-pink-50 hover:text-pink-500 transition-all duration-300 group">
                <ShoppingCart size={22} strokeWidth={2.5} />
                {cartCount > 0 && (
                  <span className="absolute top-0 right-0 w-5 h-5 bg-pink-500 text-white text-[10px] font-bold flex items-center justify-center rounded-full ring-2 ring-white transform group-hover:scale-110 transition-transform">
                    {cartCount}
                  </span>
                )}
              </Link>

            </div>

          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <div className={`fixed inset-0 bg-black/20 backdrop-blur-sm z-40 transition-opacity duration-300 md:hidden ${isMobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} onClick={() => setIsMobileMenuOpen(false)} />

      {/* Mobile Menu Sidebar */}
      <div
        ref={mobileMenuRef}
        className={`fixed top-0 left-0 bottom-0 w-[300px] bg-white z-50 shadow-2xl transform transition-transform duration-300 ease-out md:hidden flex flex-col ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        {/* Mobile Header */}
        <div className="p-5 flex items-center justify-between border-b border-gray-100">
          <div className="font-black text-xl text-gray-800 tracking-tight">Menu</div>
          <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 bg-gray-50 rounded-full text-gray-500 hover:bg-gray-100">
            <X size={20} />
          </button>
        </div>

        {/* Mobile Content */}
        <div className="flex-1 overflow-y-auto p-5 scrollbar-hide">
          {/* Mobile Search */}
          <div className="relative mb-8">
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={handleSearch}
              className="w-full bg-gray-50 border-none rounded-xl py-3 pl-4 pr-10 text-sm font-medium focus:ring-2 ring-pink-100 transition-all"
            />
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />

            {/* Mobile Search Results */}
            {showResults && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-lg border border-gray-100 z-50 overflow-hidden">
                {searchResults.length > 0 ? searchResults.map(item => (
                  <Link key={item.id} to={`/details/${item.id}`} className="block p-3 border-b border-gray-50 last:border-0 hover:bg-gray-50" onClick={() => setIsMobileMenuOpen(false)}>
                    <div className="text-sm font-bold text-gray-800">{item.name}</div>
                    <div className="text-xs text-pink-500 font-bold">₦{item.price.toLocaleString()}</div>
                  </Link>
                )) : <div className="p-4 text-center text-xs text-gray-400">No results</div>}
              </div>
            )}
          </div>

          {/* Mobile Links */}
          <div className="space-y-1">
            {Object.keys(menuStructure).map((menuItem) => {
              const hasDropdown = typeof menuStructure[menuItem] === 'object';
              return (
                <div key={menuItem} className="border-b border-gray-50 last:border-0">
                  {hasDropdown ? (
                    <div className="py-2">
                      <button onClick={() => toggleDropdown(menuItem)} className="flex items-center justify-between w-full py-2 text-left">
                        <span className={`font-bold text-gray-700 ${activeDropdown === menuItem ? 'text-pink-500' : ''}`}>{menuItem}</span>
                        <span className={`transition-transform duration-300 ${activeDropdown === menuItem ? 'rotate-180 text-pink-500' : 'text-gray-300'}`}>▼</span>
                      </button>

                      {/* Accordion Content */}
                      <div className={`grid transition-all duration-300 ease-in-out ${activeDropdown === menuItem ? 'grid-rows-[1fr] opacity-100 mb-2' : 'grid-rows-[0fr] opacity-0'}`}>
                        <div className="overflow-hidden">
                          <div className="pl-4 pt-2 space-y-4">
                            {Array.isArray(menuStructure[menuItem]) ? (
                              menuStructure[menuItem].map(item => (
                                <Link key={item} to={`/collections?collection=${encodeURIComponent(item)}`} className="block text-sm text-gray-500 font-medium hover:text-pink-500" onClick={() => setIsMobileMenuOpen(false)}>
                                  {item}
                                </Link>
                              ))
                            ) : (
                              Object.entries(menuStructure[menuItem]).map(([categoryLine, items]) => (
                                <div key={categoryLine}>
                                  <div className="text-[10px] font-black uppercase tracking-widest text-pink-300 mb-2">{categoryLine}</div>
                                  <div className="space-y-2 border-l-2 border-gray-100 pl-3">
                                    {items.map(item => (
                                      <Link key={item} to={`/collections?collection=${encodeURIComponent(categoryLine)}&subcategory=${encodeURIComponent(item)}`} className="block text-sm text-gray-500 hover:text-gray-900" onClick={() => setIsMobileMenuOpen(false)}>
                                        {item}
                                      </Link>
                                    ))}
                                  </div>
                                </div>
                              ))
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <Link to={`/collections?category=${menuItem}`} className="block py-4 font-bold text-gray-700" onClick={() => setIsMobileMenuOpen(false)}>{menuItem}</Link>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* Mobile Footer Area */}
        <div className="p-5 bg-gray-50">
          {!currentUser && (
            <div className="grid grid-cols-2 gap-3 mb-4">
              <Link to="/login" className="py-3 rounded-xl bg-white border border-gray-200 text-center text-sm font-bold shadow-sm" onClick={() => setIsMobileMenuOpen(false)}>Log In</Link>
              <Link to="/signup" className="py-3 rounded-xl bg-gray-900 text-white text-center text-sm font-bold shadow-sm" onClick={() => setIsMobileMenuOpen(false)}>Sign Up</Link>
            </div>
          )}
          {currentUser && (
            <button onClick={handleLogout} className="w-full py-3 rounded-xl bg-red-50 text-red-500 text-sm font-bold flex items-center justify-center gap-2">
              <LogOut size={16} /> Log Out
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;