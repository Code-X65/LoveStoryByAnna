import React, { useState, useEffect } from 'react';
import { Heart, Star, ShoppingCart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getAllProducts, getProductsByCategory } from '../../firebase/productServices';
import { useCart } from '../../Context/CartContext';
import { useWishlist } from '../../Context/WishlistContext';
import { useToast } from '../../Context/ToastContext';
import { useAuth } from '../../Context/AuthContextCore';
import InlineLoader from './InlineLoader';

/**
 * RelatedProducts Component
 * Displays random products from the database, prioritizing products from the same category
 * @param {string} currentProductId - ID of the current product to exclude from related products
 * @param {string} currentCategory - Category of the current product to show similar items
 */
const RelatedProducts = ({ currentProductId, currentCategory }) => {
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addItemToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const toast = useToast();
  const { currentUser } = useAuth();

  useEffect(() => {
    const fetchRelatedProducts = async () => {
      setLoading(true);
      try {
        let products = [];

        // Try to fetch products from the same category first
        if (currentCategory) {
          products = await getProductsByCategory(currentCategory);
        }

        // If we don't have enough products from the same category, fetch all products
        if (products.length < 6) {
          const allProducts = await getAllProducts();
          // Merge and deduplicate
          const productMap = new Map();
          [...products, ...allProducts].forEach(p => productMap.set(p.id, p));
          products = Array.from(productMap.values());
        }

        // Filter out the current product
        products = products.filter(p => p.id !== currentProductId);

        // Shuffle the array to get random products
        const shuffled = products.sort(() => 0.5 - Math.random());

        // Take the first 6 products
        const selected = shuffled.slice(0, 6);

        setRelatedProducts(selected);
      } catch (error) {
        console.error('Error fetching related products:', error);
        toast.error('Failed to load related products');
      } finally {
        setLoading(false);
      }
    };

    fetchRelatedProducts();
  }, [currentProductId, currentCategory]);

  const handleWishlist = async (product) => {
    if (!currentUser) {
      toast.warning('Please login to save items to wishlist');
      return;
    }

    try {
      const result = await toggleWishlist({ id: product.id, ...product });
      if (result.success) {
        if (isInWishlist(product.id)) {
          toast.info('Removed from wishlist');
        } else {
          toast.success('Added to wishlist!');
        }
      }
    } catch (error) {
      toast.error('Failed to update wishlist');
    }
  };

  const handleQuickAdd = async (product) => {
    if (product.stock === 0) {
      toast.error('This product is out of stock');
      return;
    }

    // For quick add, we'll use the first available size if sizes exist
    const selectedSize = product.sizes && product.sizes.length > 0 ? product.sizes[0] : null;

    if (!selectedSize) {
      toast.warning('Please visit product page to select size');
      return;
    }

    try {
      await addItemToCart({
        ...product,
        selectedSize,
        quantity: 1
      });
      toast.success(`${product.name} added to cart!`);
    } catch (error) {
      toast.error('Failed to add item to cart');
    }
  };

  if (loading) {
    return (
      <div className="bg-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">Related Products</h2>
            <p className="text-sm text-gray-600">You may also like these items</p>
          </div>
          <div className="flex justify-center py-12">
            <InlineLoader size="md" text="Loading related products..." />
          </div>
        </div>
      </div>
    );
  }

  if (relatedProducts.length === 0) {
    return null; // Don't show the section if there are no related products
  }

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
          {relatedProducts.map((product) => {
            const inWishlist = isInWishlist(product.id);
            const discount = product.originalPrice
              ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
              : 0;

            return (
              <Link
                to={`/details/${product.id}`}
                key={product.id}
                className="group border border-gray-200 hover:border-pink-300 transition-all bg-white"
              >
                {/* Product Image */}
                <div className="relative bg-gray-50 aspect-[3/4] overflow-hidden">
                  <img
                    src={product.images?.[0] || product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />

                  {/* Discount Badge */}
                  {discount > 0 && (
                    <div className="absolute top-2 left-2 bg-green-500 text-white text-xs px-2 py-1 font-semibold">
                      -{discount}%
                    </div>
                  )}

                  {/* Stock Badge */}
                  {product.stock === 0 && (
                    <div className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 font-semibold">
                      Out of Stock
                    </div>
                  )}

                  {/* Wishlist Button */}
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      handleWishlist(product);
                    }}
                    className={`absolute top-2 right-2 bg-white p-2 opacity-0 group-hover:opacity-100 transition-opacity ${inWishlist ? 'bg-pink-50' : 'hover:bg-pink-50'
                      }`}
                  >
                    <Heart
                      size={16}
                      className={inWishlist ? 'text-pink-400 fill-pink-400' : 'text-gray-600 hover:text-pink-300'}
                    />
                  </button>

                  {/* Quick Add to Cart */}
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      handleQuickAdd(product);
                    }}
                    disabled={product.stock === 0}
                    className={`absolute bottom-0 left-0 right-0 py-2 text-sm font-medium opacity-0 group-hover:opacity-100 transition-all ${product.stock > 0
                        ? 'bg-pink-300 text-white hover:bg-pink-400'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      }`}
                  >
                    <ShoppingCart size={16} className="inline mr-1" />
                    {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
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
                          className={i < (product.rating || 0) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}
                        />
                      ))}
                    </div>
                    <span className="text-xs text-gray-500">({product.reviews || 0})</span>
                  </div>

                  {/* Price */}
                  <div className="flex items-baseline gap-2">
                    <span className="text-base font-bold text-gray-900">
                      ₦{(product.price || 0).toLocaleString()}
                    </span>
                    {product.originalPrice && (
                      <span className="text-xs text-gray-400 line-through">
                        ₦{product.originalPrice.toLocaleString()}
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* View All Button */}
        <div className="text-center mt-8">
          <Link to="/collections?category=GIRLS">
            <button className="px-8 py-3 border-2 border-pink-300 text-pink-300 font-semibold hover:bg-pink-300 hover:text-white transition-all">
              View All Products
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RelatedProducts;
