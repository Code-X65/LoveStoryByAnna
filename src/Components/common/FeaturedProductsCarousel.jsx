import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Star, ShoppingCart, Heart } from 'lucide-react';
import { useWishlist } from '../../Context/WishlistContext';
import { useCart } from '../../Context/CartContext';
import { useAuth } from '../../Context/AuthContextCore';
import { useToast } from '../../Context/ToastContext';
import { getAllProducts } from '../../firebase/productServices';
import { Link } from 'react-router-dom';

const FeaturedProductsCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { addItemToCart } = useCart();
  const { currentUser } = useAuth();
  const toast = useToast();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getAllProducts();
        setProducts(data.slice(0, 8)); // Limit to 8 for carousel
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const handleToggleWishlist = async (e, product) => {
    e.preventDefault();
    if (!currentUser) {
      toast.warning('Please login to save to wishlist');
      return;
    }
    await toggleWishlist(product);
  };

  const handleAddToCart = async (e, product) => {
    e.preventDefault();
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


  const [itemsPerPage, setItemsPerPage] = useState(4);
  const maxIndex = Math.max(0, products.length - itemsPerPage);

  const nextSlide = () => {
    setCurrentIndex((prev) => Math.min(prev + 1, maxIndex));
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => Math.max(prev - 1, 0));
  };
  useEffect(() => {
    const updateItemsPerPage = () => {
      if (window.innerWidth < 640) setItemsPerPage(1);
      else if (window.innerWidth < 1024) setItemsPerPage(2);
      else setItemsPerPage(4);
    };

    updateItemsPerPage();
    window.addEventListener('resize', updateItemsPerPage);
    return () => window.removeEventListener('resize', updateItemsPerPage);
  }, []);

  return (
    <div className="min-h-screen bg-white py-16 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">Featured Products</h2>
          <p className="text-gray-600 text-base sm:text-lg">Top-selling and trending items just for you</p>
        </div>

        {/* Carousel Container */}
        <div className="relative">
          {/* Navigation Buttons */}
          <button
            onClick={prevSlide}
            disabled={currentIndex === 0}
            className={`absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 w-12 h-12 rounded-full bg-white shadow-lg flex items-center justify-center transition-all ${currentIndex === 0
              ? 'opacity-50 cursor-not-allowed'
              : 'hover:bg-pink-500 hover:text-white'
              }`}
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <button
            onClick={nextSlide}
            disabled={currentIndex === maxIndex}
            className={`absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 w-12 h-12 rounded-full bg-white shadow-lg flex items-center justify-center transition-all ${currentIndex === maxIndex
              ? 'opacity-50 cursor-not-allowed'
              : 'hover:bg-pink-500 hover:text-white'
              }`}
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Products Grid */}
          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-500 ease-out"
              style={{
                transform: `translateX(-${currentIndex * (100 / itemsPerPage)}%)`
              }}
            >
              {products.map((product) => (
                <div
                  key={product.id}
                  className="w-full sm:w-1/2 lg:w-1/4 flex-shrink-0 px-3"
                >
                  <div className="bg-white  shadow-lg overflow-hidden group hover:shadow-2xl transition-shadow duration-300">
                    <Link to={`/details/${product.id}`}>
                      {/* Image Container */}
                      <div className="relative overflow-hidden bg-gray-100">
                        <img
                          src={product.images?.[0] || product.image}
                          alt={product.name}
                          loading="lazy"
                          className="w-full h-72 object-cover group-hover:scale-110 transition-transform duration-700 ease-in-out"
                        />
                        {/* Badge */}
                        {product.badge && (
                          <div className="absolute top-4 left-4 bg-pink-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                            {product.badge}
                          </div>
                        )}
                        {/* Discount */}
                        {product.discount && (
                          <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                            {product.discount}%
                          </div>
                        )}

                        {/* Wishlist Button */}
                        <button
                          onClick={(e) => handleToggleWishlist(e, product)}
                          className={`absolute top-4 right-4 z-20 p-2 bg-white rounded-full shadow-md transition-all ${isInWishlist(product.id) ? 'text-pink-500' : 'text-gray-400 hover:text-pink-500'
                            } ${product.discount ? 'mt-10' : ''}`}
                        >
                          <Heart size={18} fill={isInWishlist(product.id) ? 'currentColor' : 'none'} />
                        </button>

                        {/* Quick Add Button */}
                        <button
                          onClick={(e) => handleAddToCart(e, product)}
                          className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-pink-500 text-white px-6 py-3 rounded-full font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center gap-2 hover:bg-pink-600"
                        >
                          <ShoppingCart className="w-5 h-5" />
                          Add to Cart
                        </button>
                      </div>
                    </Link>

                    {/* Product Info */}
                    <div className="p-5">
                      <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-1">
                        {product.name}
                      </h3>

                      {/* Rating */}
                      <div className="flex items-center gap-2 mb-3">
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${i < Math.floor(product.rating)
                                ? 'fill-pink-500 text-pink-500'
                                : 'text-gray-300'
                                }`}
                            />
                          ))}
                        </div>
                        <span className="text-sm text-gray-600">
                          {product.rating} ({product.reviews})
                        </span>
                      </div>

                      {/* Price */}
                      <div className="flex items-center gap-3">
                        <span className="text-2xl font-bold text-pink-500">
                          ₦{(product.price || 0).toLocaleString()}
                        </span>
                        {product.originalPrice && (
                          <span className="text-lg text-gray-400 line-through">
                            ₦{product.originalPrice.toLocaleString()}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Dots Indicator */}
          <div className="flex justify-center gap-2 mt-8">
            {[...Array(maxIndex + 1)].map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`h-2 rounded-full transition-all ${idx === currentIndex
                  ? 'w-8 bg-pink-500'
                  : 'w-2 bg-gray-300 hover:bg-pink-300'
                  }`}
              />
            ))}
          </div>
        </div>

        {/* View All Button */}
        <div className="text-center mt-12">
          <Link to="/collections">
            <button className="bg-pink-500 text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-pink-600 transition-colors shadow-lg hover:shadow-xl">
              View All Products
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default FeaturedProductsCarousel;