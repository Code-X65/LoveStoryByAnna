import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingCart } from 'lucide-react';
import { useWishlist } from '../../Context/WishlistContext';
import { useCart } from '../../Context/CartContext';
import { useAuth } from '../../Context/AuthContextCore';
import { useToast } from '../../Context/ToastContext';
import { getAllProducts } from '../../firebase/productServices';

function ProductCard({ product }) {
  const [isHovered, setIsHovered] = useState(false);
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { addItemToCart } = useCart();
  const { currentUser } = useAuth();
  const toast = useToast();

  const isFavorite = isInWishlist(product.id);

  const handleToggleFavorite = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!currentUser) {
      toast.warning('Please login to save to wishlist');
      return;
    }
    await toggleWishlist(product);
  };

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await addItemToCart({
        ...product,
        quantity: 1,
        selectedSize: product.sizes?.[0] || 'One Size'
      });
      toast.success('Added to cart!');
    } catch (err) {
      toast.error('Failed to add to cart');
    }
  };

  return (
    <div className="group cursor-pointer">
      <Link to={`/details/${product.id}`}>
        <div
          className="relative overflow-hidden bg-gray-100 mb-3 aspect-[4/5]"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <img
            src={product.images?.[0] || ''}
            alt={product.name}
            loading="lazy"
            className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 ease-in-out ${isHovered ? 'opacity-0 scale-105' : 'opacity-100 scale-100'
              }`}
          />
          <img
            src={product.images?.[1] || product.images?.[0] || ''}
            alt={product.name}
            loading="lazy"
            className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 ease-in-out ${isHovered ? 'opacity-100 scale-100' : 'opacity-0 scale-95 blur-sm'
              }`}
          />

          {/* Quick Actions */}
          <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <button
              onClick={handleToggleFavorite}
              className={`p-2 bg-white rounded-full hover:bg-pink-500 hover:text-white transition-all shadow-md ${isFavorite ? 'text-pink-500' : 'text-gray-400'
                }`}
            >
              <Heart size={16} fill={isFavorite ? 'currentColor' : 'none'} />
            </button>
          </div>

          <button
            onClick={handleAddToCart}
            className="absolute bottom-0 left-0 right-0 bg-black/80 text-white py-3 text-[10px] font-bold tracking-widest opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-pink-500 flex items-center justify-center gap-2"
          >
            <ShoppingCart size={14} />
            ADD TO CART
          </button>
        </div>
      </Link>
      <div className="text-center space-y-1">
        <h3 className="text-xs font-medium text-gray-900 uppercase tracking-wide px-2">
          {product.name}
        </h3>
        <p className="text-xs text-gray-600">FROM ₦{product.price?.toLocaleString()}</p>
      </div>
    </div>
  );
}

export default function ProductGrid() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getAllProducts();
        setProducts(data);
      } catch (err) {
        console.error('Error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return (
      <div className="bg-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-widest">
              NEW COLLECTION
            </h2>
          </div>
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-pink-500 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading products...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-10">
          <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-widest">
            NEW COLLECTION
          </h2>
          <p className="text-xs text-gray-500 mt-2">Discover our latest arrivals for kids</p>
        </div>

        {/* Product Grid */}
        {products.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-500">No products available at the moment.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-8 sm:gap-x-6 sm:gap-y-10 lg:gap-x-8 lg:gap-y-12">
            {products.slice(0, 8).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

        {/* View All Button */}
        <div className='text-center mt-12'>
          <Link to='/collection'>
            <button className='inline-flex items-center font-semibold px-8 py-4 bg-black text-white cursor-pointer justify-center hover:bg-gray-800 transition-colors text-sm uppercase tracking-wide'>
              View All Collections
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}