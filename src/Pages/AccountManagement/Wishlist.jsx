import React, { useState } from 'react';
import { User, Package, MapPin, Heart, Settings, LogOut, ChevronRight, Edit2, Trash2, Plus, Eye } from 'lucide-react';
// Wishlist Component
const Wishlist = () => {
  const [wishlist, setWishlist] = useState([
    {
      id: 1,
      name: 'Boys Blue Ankara Shirt',
      image: 'https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?w=200&h=250&fit=crop',
      price: 37950,
      inStock: true
    },
    {
      id: 2,
      name: 'Girls Red Ankara Dress',
      image: 'https://images.unsplash.com/photo-1519058082700-08a0b56da9b4?w=200&h=250&fit=crop',
      price: 45000,
      inStock: true
    },
    {
      id: 3,
      name: 'Kids Traditional Shirt',
      image: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=200&h=250&fit=crop',
      price: 33500,
      inStock: false
    }
  ]);

  const removeFromWishlist = (id) => {
    setWishlist(wishlist.filter(item => item.id !== id));
  };

  return (
    <div className="bg-white border border-gray-200 p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">
        My Wishlist ({wishlist.length})
      </h2>

      {wishlist.length === 0 ? (
        <div className="text-center py-12">
          <Heart className="mx-auto text-gray-300 mb-4" size={60} />
          <p className="text-gray-600 mb-4">Your wishlist is empty</p>
          <button className="bg-pink-300 text-white px-6 py-2 font-medium hover:bg-pink-400 transition-colors">
            Start Shopping
          </button>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {wishlist.map((item) => (
            <div key={item.id} className="border border-gray-200 p-4 group hover:border-pink-300 transition-colors">
              <div className="relative mb-3">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-48 object-cover"
                />
                <button
                  onClick={() => removeFromWishlist(item.id)}
                  className="absolute top-2 right-2 p-2 bg-white hover:bg-red-50 transition-colors"
                >
                  <Trash2 size={16} className="text-red-600" />
                </button>
              </div>
              
              <h3 className="font-medium text-gray-900 mb-2 text-sm">
                {item.name}
              </h3>
              <p className="font-bold text-gray-900 mb-3">
                ₦{item.price.toLocaleString()}
              </p>
              
              {item.inStock ? (
                <button className="w-full bg-pink-300 text-white py-2 text-sm font-medium hover:bg-pink-400 transition-colors">
                  Add to Cart
                </button>
              ) : (
                <button className="w-full bg-gray-200 text-gray-500 py-2 text-sm font-medium cursor-not-allowed">
                  Out of Stock
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Wishlist