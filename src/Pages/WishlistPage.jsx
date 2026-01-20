import React, { useState, useEffect } from 'react';
import { Heart, ShoppingCart, Trash2, Star, Share2 } from 'lucide-react';
import { useAuth } from '../Context/AuthContextCore';
import { useCart } from '../Context/CartContext';
import { useWishlist } from '../Context/WishlistContext';
import { useToast } from '../Context/ToastContext';

const WishlistPage = () => {
  const [selectedItems, setSelectedItems] = useState([]);
  const { currentUser } = useAuth();
  const { addItemToCart } = useCart();
  const { wishlistItems, loading, removeFromWishlist } = useWishlist();
  const toast = useToast();

  const removeItem = async (wishlistItemId) => {
    const result = await removeFromWishlist(wishlistItemId);
    if (result.success) {
      setSelectedItems(selectedItems.filter(id => id !== wishlistItemId));
      toast.success('Item removed from wishlist!');
    } else {
      toast.error(result.error || 'Failed to remove item');
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
    if (selectedItems.length === 0) {
      alert('Please select items to add to cart');
      return;
    }

    const inStockSelected = selectedItems.filter(id => {
      const item = wishlistItems.find(i => i.wishlistItemId === id);
      return item && item.stock > 0;
    });

    if (inStockSelected.length === 0) {
      toast.warning('No in-stock items selected');
      return;
    }

    // Add to cart logic
    for (const id of inStockSelected) {
      const item = wishlistItems.find(i => i.wishlistItemId === id);
      if (item) {
        const productData = {
          id: item.productId,
          name: item.name,
          price: item.price,
          images: [item.image],
          selectedSize: item.variants ? item.variants.split(',')[0] : 'One Size', // Naive assumption, ideally prompt user
          quantity: 1
        };
        await addItemToCart(productData);
        // Remove from wishlist
        await removeItem(id);
      }
    }

    // Refresh local state is handled in removeItem calls mostly, but let's clear selection
    setSelectedItems([]);

    toast.success(`${inStockSelected.length} item(s) added to cart!`);
  };

  const shareWishlist = () => {
    toast.info('Wishlist sharing feature coming soon!');
  };

  const addSingleToCart = async (item) => {
    if (item.stock === 0) {
      toast.warning('This item is out of stock');
      return;
    }

    const productData = {
      id: item.productId,
      name: item.name,
      price: item.price,
      images: [item.image],
      selectedSize: item.variants ? item.variants.split(',')[0] : 'One Size',
      quantity: 1
    };
    await addItemToCart(productData);
    await removeItem(item.wishlistItemId);

    alert(`${item.name} added to cart!`);
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
                    checked={selectedItems.length === wishlistItems.length && wishlistItems.length > 0}
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
                        const remainingItems = wishlistItems.filter(item => !selectedItems.includes(item.wishlistItemId));
                        setWishlistItems(remainingItems);
                        setSelectedItems([]);
                        alert('Selected items removed from wishlist!');
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
                      onClick={() => addSingleToCart(item)}
                      className={`absolute bottom-0 left-0 right-0 py-2 text-sm font-medium opacity-0 group-hover:opacity-100 transition-all ${item.stock > 0
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
                      <span className="text-xs text-gray-500">({item.rating})</span>
                    </div>

                    {/* Stock Info */}
                    <div className="mb-2">
                      <p className={`text-xs ${item.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
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

                    {/* Variants */}
                    {item.variants && (
                      <p className="text-xs text-gray-500 mt-1">{item.variants}</p>
                    )}
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