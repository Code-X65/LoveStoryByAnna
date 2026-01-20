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
    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 md:p-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-black text-gray-800 tracking-tight">My Wishlist</h2>
          <p className="text-gray-500 text-sm mt-1">{wishlist.length} Item{wishlist.length !== 1 ? 's' : ''} saved</p>
        </div>
      </div>

      {wishlist.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center bg-gray-50/50 rounded-3xl border border-dashed border-gray-200">
          <div className="w-20 h-20 bg-pink-100/50 rounded-full flex items-center justify-center mb-6 animate-pulse">
            <Heart className="text-pink-400" size={32} fill="currentColor" />
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">Your wishlist is empty</h3>
          <p className="text-gray-500 mb-8 max-w-sm">
            Save items you love here to buy later! Start exploring our collection to find something special.
          </p>
          <a
            href="/collections"
            className="bg-pink-400 text-white px-8 py-3.5 rounded-full font-bold shadow-lg shadow-pink-200 hover:shadow-xl hover:bg-pink-500 hover:scale-105 active:scale-95 transition-all"
          >
            Start Shopping
          </a>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {wishlist.map((item) => (
            <div key={item.id} className="group flex flex-col bg-white border border-gray-100 rounded-3xl overflow-hidden hover:shadow-xl hover:border-pink-200 transition-all duration-300 relative">
              <div className="relative aspect-[4/5] overflow-hidden bg-gray-100">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                <button
                  onClick={() => removeFromWishlist(item.id)}
                  className="absolute top-3 right-3 p-2.5 bg-white/90 backdrop-blur-sm rounded-full text-gray-400 hover:text-red-500 hover:bg-red-50 hover:scale-110 transition-all shadow-sm z-10"
                  title="Remove from wishlist"
                >
                  <Trash2 size={18} />
                </button>

                {!item.inStock && (
                  <div className="absolute bottom-3 left-3 right-3 bg-black/70 backdrop-blur-md py-2 rounded-xl text-center">
                    <p className="text-xs font-bold text-white uppercase tracking-widest">Out of Stock</p>
                  </div>
                )}
              </div>

              <div className="p-5 flex flex-col flex-1">
                <h3 className="font-bold text-gray-800 text-lg mb-1 leading-tight group-hover:text-pink-500 transition-colors line-clamp-2">
                  {item.name}
                </h3>
                <p className="font-black text-gray-900 text-xl mb-4">
                  ₦{item.price.toLocaleString()}
                </p>

                <div className="mt-auto">
                  {item.inStock ? (
                    <button className="w-full py-3 bg-gray-900 text-white rounded-2xl font-bold text-sm tracking-wide shadow-lg group-hover:bg-pink-500 group-hover:shadow-pink-200 transition-all flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95">
                      <Package size={18} />
                      Add to Cart
                    </button>
                  ) : (
                    <button disabled className="w-full py-3 bg-gray-100 text-gray-400 rounded-2xl font-bold text-sm tracking-wide cursor-not-allowed border border-gray-200">
                      Notify Me
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Wishlist