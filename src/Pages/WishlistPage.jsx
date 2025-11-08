import React, { useState } from 'react';
import { Heart, ShoppingCart, Trash2, Star, Share2 } from 'lucide-react';

const WishlistPage = () => {
  const [wishlistItems, setWishlistItems] = useState([
    {
      id: 1,
      name: "Boys Blue Ankara Short Sleeve Shirt",
      image: "https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?w=400&h=500&fit=crop",
      price: 37950,
      originalPrice: 45000,
      discount: 17,
      rating: 4,
      reviews: 42,
      inStock: true,
      sizes: ["18 MTH", "2 YEARS", "3 YEARS", "4 YEARS"]
    },
    {
      id: 2,
      name: "Girls Red Ankara Dress",
      image: "https://images.unsplash.com/photo-1519058082700-08a0b56da9b4?w=400&h=500&fit=crop",
      price: 45000,
      originalPrice: 52000,
      discount: 13,
      rating: 5,
      reviews: 38,
      inStock: true,
      sizes: ["2 YEARS", "3 YEARS", "4 YEARS", "5 YEARS"]
    },
    {
      id: 3,
      name: "Kids Traditional Print Shirt",
      image: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=400&h=500&fit=crop",
      price: 33500,
      originalPrice: 39000,
      discount: 14,
      rating: 4,
      reviews: 25,
      inStock: false,
      sizes: ["18 MTH", "2 YEARS", "3 YEARS"]
    },
    {
      id: 4,
      name: "Boys Green Ankara Shirt",
      image: "https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?w=400&h=500&fit=crop",
      price: 35000,
      originalPrice: 41000,
      discount: 15,
      rating: 5,
      reviews: 31,
      inStock: true,
      sizes: ["2 YEARS", "3 YEARS", "4 YEARS"]
    },
    {
      id: 5,
      name: "Girls Yellow Traditional Dress",
      image: "https://images.unsplash.com/photo-1519058082700-08a0b56da9b4?w=400&h=500&fit=crop",
      price: 42000,
      originalPrice: 49000,
      discount: 14,
      rating: 4,
      reviews: 29,
      inStock: true,
      sizes: ["3 YEARS", "4 YEARS", "5 YEARS"]
    },
    {
      id: 6,
      name: "Boys Navy Ankara Polo",
      image: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=400&h=500&fit=crop",
      price: 36500,
      originalPrice: 43000,
      discount: 15,
      rating: 5,
      reviews: 44,
      inStock: true,
      sizes: ["18 MTH", "2 YEARS", "3 YEARS", "4 YEARS"]
    }
  ]);

  const [selectedItems, setSelectedItems] = useState([]);

  const removeItem = (id) => {
    setWishlistItems(wishlistItems.filter(item => item.id !== id));
    setSelectedItems(selectedItems.filter(itemId => itemId !== id));
  };

  const toggleSelectItem = (id) => {
    if (selectedItems.includes(id)) {
      setSelectedItems(selectedItems.filter(itemId => itemId !== id));
    } else {
      setSelectedItems([...selectedItems, id]);
    }
  };

  const selectAll = () => {
    if (selectedItems.length === wishlistItems.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(wishlistItems.map(item => item.id));
    }
  };

  const addSelectedToCart = () => {
    const inStockSelected = selectedItems.filter(id => {
      const item = wishlistItems.find(i => i.id === id);
      return item && item.inStock;
    });
    
    if (inStockSelected.length > 0) {
      alert(`${inStockSelected.length} item(s) added to cart!`);
      // Remove added items from wishlist
      setWishlistItems(wishlistItems.filter(item => !inStockSelected.includes(item.id)));
      setSelectedItems([]);
    }
  };

  const shareWishlist = () => {
    alert('Wishlist sharing link copied to clipboard!');
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="text-sm text-gray-500 mb-6">
          Home / <span className="text-pink-300">Wishlist</span>
        </div>

        {/* Page Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-semibold text-gray-900 mb-2">My Wishlist</h1>
            <p className="text-sm text-gray-600">
              {wishlistItems.length} {wishlistItems.length === 1 ? 'item' : 'items'} saved for later
            </p>
          </div>
          <button
            onClick={shareWishlist}
            className="flex items-center gap-2 px-4 py-2 border-2 border-pink-300 text-pink-300 font-medium hover:bg-pink-300 hover:text-white transition-all"
          >
            <Share2 size={18} />
            Share Wishlist
          </button>
        </div>

        {wishlistItems.length === 0 ? (
          // Empty Wishlist
          <div className="text-center py-16">
            <Heart className="mx-auto text-gray-300 mb-4" size={80} />
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">Your wishlist is empty</h2>
            <p className="text-gray-600 mb-6">Save items you love for later</p>
            <button className="bg-pink-300 text-white px-8 py-3 font-semibold hover:bg-pink-400 transition-colors">
              Start Shopping
            </button>
          </div>
        ) : (
          <>
            {/* Action Bar */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-4 border-b border-gray-200">
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedItems.length === wishlistItems.length}
                    onChange={selectAll}
                    className="w-4 h-4 text-pink-300 border-gray-300 focus:ring-pink-300"
                  />
                  <span className="text-sm font-medium text-gray-700">
                    Select All ({wishlistItems.length})
                  </span>
                </label>
                {selectedItems.length > 0 && (
                  <span className="text-sm text-pink-300 font-medium">
                    {selectedItems.length} selected
                  </span>
                )}
              </div>
              
              <div className="flex gap-3">
                {selectedItems.length > 0 && (
                  <>
                    <button
                      onClick={addSelectedToCart}
                      className="px-6 py-2 bg-pink-300 text-white font-medium hover:bg-pink-400 transition-colors flex items-center gap-2"
                    >
                      <ShoppingCart size={18} />
                      Add to Cart ({selectedItems.length})
                    </button>
                    <button
                      onClick={() => {
                        selectedItems.forEach(id => removeItem(id));
                      }}
                      className="px-4 py-2 border-2 border-red-500 text-red-500 font-medium hover:bg-red-500 hover:text-white transition-colors"
                    >
                      Remove Selected
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Wishlist Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {wishlistItems.map((item) => (
                <div
                  key={item.id}
                  className="group border border-gray-200 hover:border-pink-300 transition-all bg-white relative"
                >
                  {/* Checkbox */}
                  <div className="absolute top-3 left-3 z-10">
                    <input
                      type="checkbox"
                      checked={selectedItems.includes(item.id)}
                      onChange={() => toggleSelectItem(item.id)}
                      className="w-5 h-5 text-pink-300 border-gray-300 focus:ring-pink-300"
                    />
                  </div>

                  {/* Remove Button */}
                  <button
                    onClick={() => removeItem(item.id)}
                    className="absolute top-3 right-3 z-10 bg-white p-2 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50"
                  >
                    <Trash2 size={16} className="text-red-500" />
                  </button>

                  {/* Product Image */}
                  <div className="relative bg-gray-50 aspect-[3/4] overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    
                    {/* Discount Badge */}
                    {item.discount > 0 && (
                      <div className="absolute top-12 left-3 bg-green-500 text-white text-xs px-2 py-1 font-semibold">
                        -{item.discount}%
                      </div>
                    )}

                    {/* Stock Badge */}
                    {!item.inStock && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <span className="bg-red-500 text-white text-sm px-4 py-2 font-semibold">
                          Out of Stock
                        </span>
                      </div>
                    )}

                    {/* Quick Add to Cart */}
                    <button
                      disabled={!item.inStock}
                      className={`absolute bottom-0 left-0 right-0 py-2 text-sm font-medium opacity-0 group-hover:opacity-100 transition-all ${
                        item.inStock
                          ? 'bg-pink-300 text-white hover:bg-pink-400'
                          : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      }`}
                    >
                      <ShoppingCart size={16} className="inline mr-1" />
                      {item.inStock ? 'Add to Cart' : 'Out of Stock'}
                    </button>
                  </div>

                  {/* Product Info */}
                  <div className="p-3">
                    {/* Product Name */}
                    <h3 className="text-sm text-gray-900 mb-2 line-clamp-2 h-10">
                      {item.name}
                    </h3>

                    {/* Rating */}
                    <div className="flex items-center gap-1 mb-2">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            size={12}
                            className={i < item.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}
                          />
                        ))}
                      </div>
                      <span className="text-xs text-gray-500">({item.reviews})</span>
                    </div>

                    {/* Sizes */}
                    <div className="mb-2">
                      <p className="text-xs text-gray-500 mb-1">Available sizes:</p>
                      <div className="flex flex-wrap gap-1">
                        {item.sizes.slice(0, 3).map((size, index) => (
                          <span key={index} className="text-xs border border-gray-300 px-1.5 py-0.5">
                            {size}
                          </span>
                        ))}
                        {item.sizes.length > 3 && (
                          <span className="text-xs text-gray-500">+{item.sizes.length - 3}</span>
                        )}
                      </div>
                    </div>

                    {/* Price */}
                    <div className="flex items-baseline gap-2">
                      <span className="text-base font-bold text-gray-900">
                        ₦{item.price.toLocaleString()}
                      </span>
                      {item.originalPrice && (
                        <span className="text-xs text-gray-400 line-through">
                          ₦{item.originalPrice.toLocaleString()}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Bottom Action */}
            <div className="mt-8 text-center">
              <button className="px-8 py-3 border-2 border-pink-300 text-pink-300 font-semibold hover:bg-pink-300 hover:text-white transition-all">
                Continue Shopping
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default WishlistPage;