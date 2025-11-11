import React, { useState, useEffect } from 'react';
import { Heart, ShoppingCart, Trash2, Star, Share2 } from 'lucide-react';
import { auth } from '../Firebase/Firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { getUserWishlist, removeFromWishlist } from '../Firebase/wishlistServices';
import { addToCart, getUserCart, updateCartItem } from '../Firebase/cartServices';

const WishlistPage = () => {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true);

  // Track authentication
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserId(user.uid);
      } else {
        setUserId(null);
        setWishlistItems([]);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  // Fetch wishlist when user is authenticated
  useEffect(() => {
    const fetchWishlist = async () => {
      if (userId) {
        setLoading(true);
        const items = await getUserWishlist(userId);
        setWishlistItems(items);
        setLoading(false);
      }
    };

    fetchWishlist();
  }, [userId]);

  const removeItem = async (wishlistItemId) => {
    if (!userId) {
      alert('Please login to manage wishlist');
      return;
    }

    const result = await removeFromWishlist(userId, wishlistItemId);
    
    if (result.success) {
      setWishlistItems(wishlistItems.filter(item => item.wishlistItemId !== wishlistItemId));
      setSelectedItems(selectedItems.filter(id => id !== wishlistItemId));
    } else {
      alert('Failed to remove item: ' + result.error);
    }
  };

  const toggleSelectItem = (wishlistItemId) => {
    if (selectedItems.includes(wishlistItemId)) {
      setSelectedItems(selectedItems.filter(id => id !== wishlistItemId));
    } else {
      setSelectedItems([...selectedItems, wishlistItemId]);
    }
  };

  const selectAll = () => {
    if (selectedItems.length === wishlistItems.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(wishlistItems.map(item => item.wishlistItemId));
    }
  };

  const addSelectedToCart = async () => {
    if (!userId) {
      alert('Please login to add items to cart');
      return;
    }

    const inStockSelected = selectedItems.filter(id => {
      const item = wishlistItems.find(i => i.wishlistItemId === id);
      return item && item.stock > 0;
    });
    
    if (inStockSelected.length === 0) {
      alert('No in-stock items selected');
      return;
    }

    try {
      let successCount = 0;
      const currentCart = await getUserCart(userId);

      for (const wishlistItemId of inStockSelected) {
        const item = wishlistItems.find(i => i.wishlistItemId === wishlistItemId);
        if (!item) continue;

        // Default size and color (you may want to prompt user for these)
        const defaultSize = 'One Size';
        const defaultColor = 'Default';

        // Check if item already exists in cart
        const existingCartItem = currentCart.find(
          cartItem => cartItem.productId === item.productId
        );

        if (existingCartItem) {
          // Update existing cart item
          const newQuantity = existingCartItem.quantity + 1;
          
          if (newQuantity <= item.stock) {
            const result = await updateCartItem(userId, existingCartItem.cartItemId, newQuantity);
            if (result.success) {
              successCount++;
              // Remove from wishlist after adding to cart
              await removeFromWishlist(userId, wishlistItemId);
            }
          }
        } else {
          // Add new item to cart
          const cartProduct = {
            id: item.productId,
            name: item.name,
            price: item.price,
            images: [item.image],
            stock: item.stock,
            brand: item.brand || '',
            rating: item.rating || 0
          };

          const result = await addToCart(userId, cartProduct, defaultSize, defaultColor, 1);
          
          if (result.success) {
            successCount++;
            // Remove from wishlist after adding to cart
            await removeFromWishlist(userId, wishlistItemId);
          }
        }
      }

      if (successCount > 0) {
        alert(`${successCount} item(s) added to cart!`);
        // Refresh wishlist
        const updatedWishlist = await getUserWishlist(userId);
        setWishlistItems(updatedWishlist);
        setSelectedItems([]);
      } else {
        alert('Failed to add items to cart');
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert('An error occurred. Please try again.');
    }
  };

  const shareWishlist = () => {
    alert('Wishlist sharing link copied to clipboard!');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-pink-300 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading wishlist...</p>
        </div>
      </div>
    );
  }

  if (!userId) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <Heart className="mx-auto text-gray-300 mb-4" size={80} />
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">Please login to view wishlist</h2>
          <p className="text-gray-600 mb-6">Sign in to save your favorite items</p>
          <button 
            onClick={() => window.location.href = '/login'}
            className="bg-pink-300 text-white px-8 py-3 font-semibold hover:bg-pink-400 transition-colors"
          >
            Login
          </button>
        </div>
      </div>
    );
  }

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
            <button 
              onClick={() => window.location.href = '/'}
              className="bg-pink-300 text-white px-8 py-3 font-semibold hover:bg-pink-400 transition-colors"
            >
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
                      onClick={async () => {
                        for (const id of selectedItems) {
                          await removeItem(id);
                        }
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
                  key={item.wishlistItemId}
                  className="group border border-gray-200 hover:border-pink-300 transition-all bg-white relative"
                >
                  {/* Checkbox */}
                  <div className="absolute top-3 left-3 z-10">
                    <input
                      type="checkbox"
                      checked={selectedItems.includes(item.wishlistItemId)}
                      onChange={() => toggleSelectItem(item.wishlistItemId)}
                      className="w-5 h-5 text-pink-300 border-gray-300 focus:ring-pink-300"
                    />
                  </div>

                  {/* Remove Button */}
                  <button
                    onClick={() => removeItem(item.wishlistItemId)}
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
                    {item.stock === 0 && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <span className="bg-red-500 text-white text-sm px-4 py-2 font-semibold">
                          Out of Stock
                        </span>
                      </div>
                    )}

                    {/* Quick Add to Cart */}
                    <button
                      disabled={item.stock === 0}
                      onClick={async () => {
                        if (userId) {
                          const currentCart = await getUserCart(userId);
                          const existingItem = currentCart.find(
                            cartItem => cartItem.productId === item.productId
                          );

                          if (existingItem) {
                            const newQuantity = existingItem.quantity + 1;
                            if (newQuantity <= item.stock) {
                              await updateCartItem(userId, existingItem.cartItemId, newQuantity);
                              alert('Cart updated!');
                              await removeFromWishlist(userId, item.wishlistItemId);
                              const updatedWishlist = await getUserWishlist(userId);
                              setWishlistItems(updatedWishlist);
                            } else {
                              alert('Cannot add more. Stock limit reached.');
                            }
                          } else {
                            const cartProduct = {
                              id: item.productId,
                              name: item.name,
                              price: item.price,
                              images: [item.image],
                              stock: item.stock,
                              brand: item.brand || '',
                              rating: item.rating || 0
                            };
                            const result = await addToCart(userId, cartProduct, 'One Size', 'Default', 1);
                            if (result.success) {
                              alert('Added to cart!');
                              await removeFromWishlist(userId, item.wishlistItemId);
                              const updatedWishlist = await getUserWishlist(userId);
                              setWishlistItems(updatedWishlist);
                            }
                          }
                        }
                      }}
                      className={`absolute bottom-0 left-0 right-0 py-2 text-sm font-medium opacity-0 group-hover:opacity-100 transition-all ${
                        item.stock > 0
                          ? 'bg-pink-300 text-white hover:bg-pink-400'
                          : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      }`}
                    >
                      <ShoppingCart size={16} className="inline mr-1" />
                      {item.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
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
                    </div>

                    {/* Stock Info */}
                    <div className="mb-2">
                      <p className="text-xs text-gray-500">
                        {item.stock > 0 ? `${item.stock} in stock` : 'Out of stock'}
                      </p>
                    </div>

                    {/* Price */}
                    <div className="flex items-baseline gap-2">
                      <span className="text-base font-bold text-gray-900">
                        ₦{item.price.toLocaleString()}
                      </span>
                      {item.originalPrice && item.originalPrice > item.price && (
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
              <button 
                onClick={() => window.location.href = '/'}
                className="px-8 py-3 border-2 border-pink-300 text-pink-300 font-semibold hover:bg-pink-300 hover:text-white transition-all"
              >
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