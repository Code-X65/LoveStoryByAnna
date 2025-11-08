import React from 'react';
import { Heart, Star, ShoppingCart } from 'lucide-react';

const RelatedProducts = () => {
  const relatedProducts = [
    {
      id: 1,
      name: "Boys Red Ankara Polo Shirt",
      price: 32500,
      originalPrice: 40000,
      discount: 19,
      rating: 4,
      reviews: 28,
      image: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=400&h=500&fit=crop",
      inStock: true
    },
    {
      id: 2,
      name: "Kids Green Traditional Shirt",
      price: 35000,
      originalPrice: 42000,
      discount: 17,
      rating: 5,
      reviews: 35,
      image: "https://images.unsplash.com/photo-1519058082700-08a0b56da9b4?w=400&h=500&fit=crop",
      inStock: true
    },
    {
      id: 3,
      name: "Boys Yellow Ankara Shirt",
      price: 38950,
      originalPrice: 45000,
      discount: 13,
      rating: 4,
      reviews: 22,
      image: "https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?w=400&h=500&fit=crop",
      inStock: false
    },
    {
      id: 4,
      name: "Traditional Print Kids Shirt",
      price: 33500,
      originalPrice: 39000,
      discount: 14,
      rating: 5,
      reviews: 41,
      image: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=400&h=500&fit=crop",
      inStock: true
    },
    {
      id: 5,
      name: "Boys Navy Ankara Shirt",
      price: 36000,
      originalPrice: 43000,
      discount: 16,
      rating: 4,
      reviews: 19,
      image: "https://images.unsplash.com/photo-1519058082700-08a0b56da9b4?w=400&h=500&fit=crop",
      inStock: true
    },
    {
      id: 6,
      name: "Kids Orange Traditional Top",
      price: 34500,
      originalPrice: 41000,
      discount: 16,
      rating: 5,
      reviews: 33,
      image: "https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?w=400&h=500&fit=crop",
      inStock: true
    }
  ];

  return (
    <div className="bg-white py-12">
      <div className="max-w-7xl mx-auto px-4">
        {/* Section Header */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">Related Products</h2>
          <p className="text-sm text-gray-600">You may also like these items</p>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {relatedProducts.map((product) => (
            <div
              key={product.id}
              className="group border border-gray-200 hover:border-pink-300 transition-all bg-white"
            >
              {/* Product Image */}
              <div className="relative bg-gray-50 aspect-[3/4] overflow-hidden">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                
                {/* Discount Badge */}
                {product.discount > 0 && (
                  <div className="absolute top-2 left-2 bg-green-500 text-white text-xs px-2 py-1 font-semibold">
                    -{product.discount}%
                  </div>
                )}

                {/* Stock Badge */}
                {!product.inStock && (
                  <div className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 font-semibold">
                    Out of Stock
                  </div>
                )}

                {/* Wishlist Button */}
                <button className="absolute top-2 right-2 bg-white p-2 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-pink-50">
                  <Heart size={16} className="text-gray-600 hover:text-pink-300" />
                </button>

                {/* Quick Add to Cart */}
                <button
                  disabled={!product.inStock}
                  className={`absolute bottom-0 left-0 right-0 py-2 text-sm font-medium opacity-0 group-hover:opacity-100 transition-all ${
                    product.inStock
                      ? 'bg-pink-300 text-white hover:bg-pink-400'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  <ShoppingCart size={16} className="inline mr-1" />
                  {product.inStock ? 'Add to Cart' : 'Out of Stock'}
                </button>
              </div>

              {/* Product Info */}
              <div className="p-3">
                {/* Product Name */}
                <h3 className="text-sm text-gray-900 mb-2 line-clamp-2 h-10">
                  {product.name}
                </h3>

                {/* Rating */}
                <div className="flex items-center gap-1 mb-2">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={12}
                        className={i < product.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}
                      />
                    ))}
                  </div>
                  <span className="text-xs text-gray-500">({product.reviews})</span>
                </div>

                {/* Price */}
                <div className="flex items-baseline gap-2">
                  <span className="text-base font-bold text-gray-900">
                    ₦{product.price.toLocaleString()}
                  </span>
                  {product.originalPrice && (
                    <span className="text-xs text-gray-400 line-through">
                      ₦{product.originalPrice.toLocaleString()}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center mt-8">
          <button className="px-8 py-3 border-2 border-pink-300 text-pink-300 font-semibold hover:bg-pink-300 hover:text-white transition-all">
            View All Related Products
          </button>
        </div>
      </div>
    </div>
  );
};

export default RelatedProducts;