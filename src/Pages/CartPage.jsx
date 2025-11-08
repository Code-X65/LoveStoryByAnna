import React, { useState } from 'react';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, Heart, Tag } from 'lucide-react';
import { Link } from 'react-router-dom';

const CartPage = () => {
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: "Boys Blue Ankara Short Sleeve Shirt",
      image: "https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?w=400&h=500&fit=crop",
      price: 37950,
      quantity: 1,
      size: "2 YEARS",
      color: "Blue",
      inStock: true
    },
    {
      id: 2,
      name: "Girls Red Ankara Dress",
      image: "https://images.unsplash.com/photo-1519058082700-08a0b56da9b4?w=400&h=500&fit=crop",
      price: 45000,
      quantity: 2,
      size: "3 YEARS",
      color: "Red",
      inStock: true
    },
    {
      id: 3,
      name: "Kids Traditional Print Shirt",
      image: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=400&h=500&fit=crop",
      price: 33500,
      quantity: 1,
      size: "4 YEARS",
      color: "Green",
      inStock: false
    }
  ]);

  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);

  const updateQuantity = (id, action) => {
    setCartItems(cartItems.map(item => {
      if (item.id === id) {
        const newQuantity = action === 'increment' ? item.quantity + 1 : Math.max(1, item.quantity - 1);
        return { ...item, quantity: newQuantity };
      }
      return item;
    }));
  };

  const removeItem = (id) => {
    setCartItems(cartItems.filter(item => item.id !== id));
  };

  const moveToWishlist = (id) => {
    // Handle move to wishlist logic
    removeItem(id);
  };

  const applyCoupon = () => {
    if (couponCode.toUpperCase() === 'SAVE10') {
      setAppliedCoupon({ code: 'SAVE10', discount: 10 });
    } else if (couponCode.toUpperCase() === 'WELCOME15') {
      setAppliedCoupon({ code: 'WELCOME15', discount: 15 });
    } else {
      alert('Invalid coupon code');
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode('');
  };

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const discount = appliedCoupon ? (subtotal * appliedCoupon.discount / 100) : 0;
  const shipping = subtotal > 50000 ? 0 : 2500;
  const total = subtotal - discount + shipping;

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="text-sm text-gray-500 mb-6">
          Home / <span className="text-pink-300">Shopping Cart</span>
        </div>

        {/* Page Title */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-semibold text-gray-900">Shopping Cart</h1>
          <div className="text-sm text-gray-600">
            {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'}
          </div>
        </div>

        {cartItems.length === 0 ? (
          // Empty Cart
          <div className="text-center py-16">
            <ShoppingBag className="mx-auto text-gray-300 mb-4" size={80} />
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">Your cart is empty</h2>
            <p className="text-gray-600 mb-6">Add items to get started</p>
            <button className="bg-pink-300 text-white px-8 py-3 font-semibold hover:bg-pink-400 transition-colors">
              Continue Shopping
            </button>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map((item) => (
                <div key={item.id} className="border border-gray-200 p-4 bg-white">
                  <div className="flex gap-4">
                    {/* Product Image */}
                    <div className="flex-shrink-0">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-28 h-36 object-cover border border-gray-200"
                      />
                    </div>

                    {/* Product Details */}
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <div>
                          <h3 className="font-semibold text-gray-900 mb-2">
                            {item.name}
                          </h3>
                          <div className="text-sm text-gray-600 space-y-1">
                            <p>Size: <span className="text-gray-900 font-medium">{item.size}</span></p>
                            <p>Color: <span className="text-gray-900 font-medium">{item.color}</span></p>
                          </div>
                          
                          {!item.inStock && (
                            <div className="mt-2">
                              <span className="text-xs bg-red-100 text-red-600 px-2 py-1 font-medium">
                                Out of Stock
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Price */}
                        <div className="text-right">
                          <p className="text-xl font-bold text-gray-900">
                            ₦{item.price.toLocaleString()}
                          </p>
                        </div>
                      </div>

                      {/* Quantity and Actions */}
                      <div className="flex items-center justify-between mt-4">
                        {/* Quantity Selector */}
                        <div className="flex items-center border border-gray-300">
                          <button
                            onClick={() => updateQuantity(item.id, 'decrement')}
                            className="p-2 hover:bg-gray-50 transition-colors"
                            disabled={item.quantity <= 1}
                          >
                            <Minus size={16} className="text-gray-700" />
                          </button>
                          <input
                            type="text"
                            value={item.quantity}
                            readOnly
                            className="w-12 text-center border-x border-gray-300 py-2 text-sm font-semibold"
                          />
                          <button
                            onClick={() => updateQuantity(item.id, 'increment')}
                            className="p-2 hover:bg-gray-50 transition-colors"
                          >
                            <Plus size={16} className="text-gray-700" />
                          </button>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center gap-4">
                          <button
                            onClick={() => moveToWishlist(item.id)}
                            className="flex items-center gap-1 text-sm text-gray-600 hover:text-pink-300 transition-colors"
                          >
                            <Heart size={16} />
                            <span className="hidden sm:inline">Move to Wishlist</span>
                          </button>
                          <button
                            onClick={() => removeItem(item.id)}
                            className="flex items-center gap-1 text-sm text-red-600 hover:text-red-700 transition-colors"
                          >
                            <Trash2 size={16} />
                            <span className="hidden sm:inline">Remove</span>
                          </button>
                        </div>
                      </div>

                      {/* Subtotal */}
                      <div className="mt-3 pt-3 border-t border-gray-200">
                        <p className="text-sm text-gray-600">
                          Subtotal: <span className="font-bold text-gray-900">₦{(item.price * item.quantity).toLocaleString()}</span>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {/* Continue Shopping Button */}
              <button className="w-full py-3 border-2 border-pink-300 text-pink-300 font-semibold hover:bg-pink-300 hover:text-white transition-all">
                Continue Shopping
              </button>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="border border-gray-200 p-6 sticky top-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Order Summary</h2>

                {/* Coupon Code */}
                <div className="mb-6">
                  <label className="text-sm font-medium text-gray-900 mb-2 block">
                    Have a coupon code?
                  </label>
                  <div className="flex gap-2">
                    <div className="flex-1 relative">
                      <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                      <input
                        type="text"
                        placeholder="Enter code"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                        className="w-full pl-10 pr-3 py-2 border border-gray-300 focus:outline-none focus:border-pink-300 text-sm"
                        disabled={appliedCoupon}
                      />
                    </div>
                    {appliedCoupon ? (
                      <button
                        onClick={removeCoupon}
                        className="px-4 py-2 bg-red-500 text-white text-sm font-medium hover:bg-red-600 transition-colors"
                      >
                        Remove
                      </button>
                    ) : (
                      <button
                        onClick={applyCoupon}
                        className="px-4 py-2 bg-pink-300 text-white text-sm font-medium hover:bg-pink-400 transition-colors"
                      >
                        Apply
                      </button>
                    )}
                  </div>
                  {appliedCoupon && (
                    <p className="text-xs text-green-600 mt-2">
                      ✓ Coupon "{appliedCoupon.code}" applied! {appliedCoupon.discount}% off
                    </p>
                  )}
                </div>

                {/* Price Breakdown */}
                <div className="space-y-3 mb-6 pb-6 border-b border-gray-200">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-medium text-gray-900">₦{subtotal.toLocaleString()}</span>
                  </div>
                  
                  {appliedCoupon && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Discount ({appliedCoupon.discount}%)</span>
                      <span className="font-medium text-green-600">-₦{discount.toLocaleString()}</span>
                    </div>
                  )}
                  
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Shipping</span>
                    <span className="font-medium text-gray-900">
                      {shipping === 0 ? (
                        <span className="text-green-600">FREE</span>
                      ) : (
                        `₦${shipping.toLocaleString()}`
                      )}
                    </span>
                  </div>
                  
                  {subtotal < 50000 && (
                    <p className="text-xs text-gray-500 italic">
                      Add ₦{(50000 - subtotal).toLocaleString()} more for free shipping
                    </p>
                  )}
                </div>

                {/* Total */}
                <div className="flex justify-between mb-6">
                  <span className="text-lg font-semibold text-gray-900">Total</span>
                  <span className="text-2xl font-bold text-gray-900">₦{total.toLocaleString()}</span>
                </div>

                {/* Checkout Button */}
           <Link to='/checkout'>     <button className="w-full bg-pink-300 text-white py-3 font-semibold hover:bg-pink-400 transition-colors flex items-center justify-center gap-2 mb-3">
                  Proceed to Checkout
                  <ArrowRight size={20} />
                </button>
                </Link>

                {/* Security Badge */}
                <div className="bg-gray-50 p-3 text-center border border-gray-200">
                  <p className="text-xs text-gray-600">
                    🔒 Secure Checkout - SSL Encrypted
                  </p>
                </div>

                {/* Additional Info */}
                <div className="mt-6 space-y-2 text-xs text-gray-600">
                  <p>✓ Free delivery on orders over ₦50,000</p>
                  <p>✓ 30-day return policy</p>
                  <p>✓ Quality guaranteed</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;