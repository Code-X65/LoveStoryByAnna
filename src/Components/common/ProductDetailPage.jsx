import React, { useState, useEffect } from 'react';
import { Heart, Minus, Plus, ShoppingCart, Truck, RotateCcw, Star, Share2 } from 'lucide-react';
import RelatedProducts from './RelatedProducts';
import ReviewSection from '../ReviewSection';
import { useParams } from 'react-router-dom';
import { getProductById } from '../../Firebase/productServices';
import { addToCart, getUserCart, updateCartItem  } from '../../Firebase/cartServices';
import { auth } from '../../Firebase/Firebase';
import { addToWishlist, removeFromWishlist, isInWishlist } from '../../Firebase/wishlistServices';


const ProductDetailPage = () => {
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [wishlistItemId, setWishlistItemId] = useState(null);

  const { productId } = useParams();
const [product, setProduct] = useState(null);
const [loading, setLoading] = useState(true);


  useEffect(() => {
  const fetchProduct = async () => {
    try {
      setLoading(true);
      const data = await getProductById(productId);
      setProduct(data);
    } catch (error) {
      console.error('Error fetching product:', error);
      alert('Product not found');
    } finally {
      setLoading(false);
    }
  };

  if (productId) {
    fetchProduct();
  }
}, [productId]);

useEffect(() => {
  const checkWishlistStatus = async () => {
    const user = auth.currentUser;
    if (user && product) {
      const itemId = await isInWishlist(user.uid, product.id);
      setWishlistItemId(itemId);
      setIsWishlisted(!!itemId);
    }
  };

  checkWishlistStatus();
}, [product]);

const getStockStatus = (stock) => {
  if (stock === 0) {
    return { 
      label: 'Out of Stock', 
      color: 'bg-red-100', 
      textColor: 'text-red-700',
      borderColor: 'border-red-200'
    };
  } else if (stock <= 5) {
    return { 
      label: 'Low Stock', 
      color: 'bg-yellow-100', 
      textColor: 'text-yellow-700',
      borderColor: 'border-yellow-200'
    };
  } else {
    return { 
      label: 'In Stock', 
      color: 'bg-green-100', 
      textColor: 'text-green-700',
      borderColor: 'border-green-200'
    };
  }
};
const handleWishlist = async () => {
  const user = auth.currentUser;
  
  if (!user) {
    alert('Please login to add products to wishlist');
    return;
  }

  if (isWishlisted && wishlistItemId) {
    // Remove from wishlist
    const result = await removeFromWishlist(user.uid, wishlistItemId);
    if (result.success) {
      setIsWishlisted(false);
      setWishlistItemId(null);
      alert('Removed from wishlist');
    } else {
      alert('Failed to remove from wishlist: ' + result.error);
    }
  } else {
    // Add to wishlist
    const wishlistProduct = {
      id: product.id,
      name: product.name,
      price: product.price,
      originalPrice: product.originalPrice,
      discount: product.discount,
      images: product.images,
      brand: product.brand,
      rating: product.rating,
      stock: product.stock
    };

    const result = await addToWishlist(user.uid, wishlistProduct);
    
    if (result.success) {
      const itemId = await isInWishlist(user.uid, product.id);
      setWishlistItemId(itemId);
      setIsWishlisted(true);
      alert('Added to wishlist!');
    } else {
      alert(result.error || 'Failed to add to wishlist');
    }
  }
};



  const handleQuantityChange = (type) => {
    if (type === 'increment' && quantity < product.stock) {
      setQuantity(quantity + 1);
    } else if (type === 'decrement' && quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

const handleAddToCart = async () => {
  const user = auth.currentUser;
  
  if (!user) {
    alert('Please login to add products to cart');
    return;
  }

  if (!selectedSize) {
    alert('Please select a size');
    return;
  }

  try {
    // First, get the user's current cart
    const currentCart = await getUserCart(user.uid);
    
    // Check if product with same ID and size already exists
    const existingItem = currentCart.find(
      item => item.productId === product.id && item.size === selectedSize
    );

    if (existingItem) {
      // Product exists - update quantity instead
      const newQuantity = existingItem.quantity + quantity;
      
      // Check if new quantity exceeds stock
      if (newQuantity > product.stock) {
        alert(`Cannot add more items. Only ${product.stock} units available. You already have ${existingItem.quantity} in cart.`);
        return;
      }
      
      const result = await updateCartItem(user.uid, existingItem.cartItemId, newQuantity);
      
      if (result.success) {
        alert(`Cart updated! Total quantity: ${newQuantity}`);
      } else {
        alert('Failed to update cart: ' + result.error);
      }
    } else {
      // Product doesn't exist - add new item
      const cartProduct = {
        id: product.id,
        name: product.name,
        price: product.price,
        images: product.images,
        selectedSize: selectedSize,
        quantity: quantity
      };

      const result = await addToCart(user.uid, cartProduct);
      
      if (result.success) {
        alert('Product added to cart successfully!');
      } else {
        alert('Failed to add product to cart: ' + result.error);
      }
    }
  } catch (error) {
    console.error('Error handling cart:', error);
    alert('An error occurred. Please try again.');
  }
};

if (loading) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-pink-300 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading product...</p>
      </div>
    </div>
  );
}

if (!product) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="text-center">
        <p className="text-gray-800 text-xl mb-4">Product not found</p>
        <button 
          onClick={() => window.history.back()}
          className="px-6 py-3 bg-pink-300 text-white font-semibold hover:bg-pink-400"
        >
          Go Back
        </button>
      </div>
    </div>
  );
}



const features = [
  { label: "Material", value: product.material || "Premium Cotton Blend" },
  { label: "Pattern", value: product.pattern || "Authentic Ankara Print" },
  { label: "Care", value: product.care || "Machine Washable" },
  { label: "Fit", value: product.fit || "Comfortable Regular Fit" }
];


const stockStatus = getStockStatus(product.stock);



  return (
    <div className=" bg-white">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Column - Images */}
          <div className="lg:sticky lg:top-6 h-fit">
            {/* Main Image */}
            <div className="bg-gray-50 border border-gray-200 mb-4 h-[500px] w-full">
              <img
                src={product.images[selectedImage]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Thumbnail Images */}
            <div className="grid grid-cols-4 gap-3">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`border-2 transition-all h-[150px] ${
                    selectedImage === index
                      ? 'border-pink-300'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <img
                    src={image}
                    alt={`View ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>

            {/* Product Description */}
            <div className="mt-6 pt-6 border-t border-gray-200 hidden md:block">
              <p className="text-sm text-gray-700 leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Key Features Table */}
            <div className="mt-6 hidden md:block">
              <div className="bg-pink-300 text-white px-4 py-2 font-semibold text-sm">
                Key Features
              </div>
              <table className="w-full text-sm border-x border-b border-gray-200">
                <tbody>
                  {features.map((feature, index) => (
                    <tr key={index} className="border-b border-gray-200 last:border-0">
                      <td className="px-4 py-3 text-gray-600 bg-gray-50 w-1/3">{feature.label}</td>
                      <td className="px-4 py-3 text-gray-900">{feature.value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Right Column - Product Details */}
          <div className="space-y-6">
            {/* Title and Brand */}
            <div>
              <h1 className="text-2xl lg:text-3xl font-semibold text-gray-900 mb-2">
                {product.name}
              </h1>
              <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                <span>Brand: <span className="text-pink-300 font-medium">{product.brand}</span></span>
                <span className="text-gray-300">|</span>
                <span>Model: <span className="font-medium text-gray-900">{product.model}</span></span>
              </div>

              {/* Rating and Stock */}
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-2">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={16}
                        className={i < product.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-gray-600">(Reviews: {product.reviews})</span>
                </div>
              <span className={`${stockStatus.color} ${stockStatus.textColor} text-xs px-2 py-1 font-medium`}>
  {stockStatus.label}
</span>
              </div>
            </div>

            {/* Price */}
            <div className="bg-gray-50 p-4 border border-gray-200">
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-bold text-gray-900">
                  ₦{product.price.toLocaleString()}
                </span>
                <span className="text-lg text-gray-400 line-through">
                  ₦{product.originalPrice.toLocaleString()}
                </span>
                <span className="bg-green-500 text-white text-sm px-2 py-1 font-medium">
                  Save {product.discount}%
                </span>
              </div>
              <p className="text-sm text-gray-600 mt-2">
                {product.description}
              </p>
            </div>

            {/* Available Colors */}
            <div>
              <div className="text-sm font-semibold text-gray-900 mb-3">
                Available Colors:
              </div>
              <div className="flex gap-3">
                {product.colors.map((color) => (
                  <button
                    key={color}
                    className="px-4 py-2 border-2 border-gray-300 text-sm text-gray-700 hover:border-pink-300 transition-all"
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>
            
{product.stock === 0 && (
  <div className="bg-red-50 border border-red-200 px-4 py-3">
    <p className="text-sm text-red-700 font-medium">
      ⚠️ This product is currently out of stock
    </p>
  </div>
)}

{product.stock > 0 && product.stock <= 5 && (
  <div className="bg-yellow-50 border border-yellow-200 px-4 py-3">
    <p className="text-sm text-yellow-700 font-medium">
      ⚠️ Only {product.stock} units left in stock - Order soon!
    </p>
  </div>
)}

{!selectedSize && product.stock > 0 && (
  <p className="text-sm text-red-500">
    ⚠ Please select a size
  </p>
)}

            {/* Size Selection */}
            <div>
              <div className="text-sm font-semibold text-gray-900 mb-3">
                Sizes:
              </div>
              <div className="grid grid-cols-4 gap-3">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`py-2.5 text-sm font-medium border-2 transition-all ${
                      selectedSize === size
                        ? 'border-pink-300 bg-pink-50 text-pink-400'
                        : 'border-gray-300 text-gray-700 hover:border-pink-300'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Stock Info */}
            <div className="text-sm">
              <span className="text-gray-600">Available: </span>
              <span className="font-semibold text-gray-900">{product.stock} units</span>
            </div>

            {/* Quantity and Actions */}
            <div className="space-y-4">
              {/* Quantity */}
            <div className="flex items-center gap-4">
  <div className="flex items-center border border-gray-300">
    <button
      onClick={() => handleQuantityChange('decrement')}
      className="px-4 py-3 hover:bg-gray-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
      disabled={quantity <= 1 || product.stock === 0}
    >
      <Minus size={16} className="text-gray-700" />
    </button>
    <input
      type="text"
      value={quantity}
      readOnly
      className="w-16 text-center border-x border-gray-300 py-3 text-sm font-semibold"
    />
    <button
      onClick={() => handleQuantityChange('increment')}
      className="px-4 py-3 hover:bg-gray-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
      disabled={quantity >= product.stock || product.stock === 0}
    >
      <Plus size={16} className="text-gray-700" />
    </button>
  </div>
<button
  onClick={handleAddToCart}
  disabled={!selectedSize || product.stock === 0}
  className={`flex-1 py-3 font-semibold text-sm transition-all flex items-center justify-center gap-2 ${
    selectedSize && product.stock > 0
      ? 'bg-pink-300 text-white hover:bg-pink-400'
      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
  }`}
>
  <ShoppingCart size={18} />
  {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
</button>
  </div>

              {/* Wishlist and Share */}
              <div className="flex gap-3">
              <button
  onClick={handleWishlist}
  className={`flex-1 py-3 border-2 font-medium text-sm transition-all flex items-center justify-center gap-2 ${
    isWishlisted
      ? 'border-pink-300 bg-pink-50 text-pink-400'
      : 'border-gray-300 text-gray-700 hover:border-pink-300'
  }`}
>
  <Heart size={18} className={isWishlisted ? 'fill-pink-400' : ''} />
  {isWishlisted ? 'Wishlisted' : 'Add to Wishlist'}
</button>
                <button className="flex-1 py-3 border-2 border-gray-300 font-medium text-sm text-gray-700 hover:border-pink-300 transition-all flex items-center justify-center gap-2">
                  <Share2 size={18} />
                </button>
              </div>
            </div>

            {/* Warranty */}
            <div className="bg-green-50 border border-green-200 px-4 py-3">
              <p className="text-sm text-green-700">
                ✓ Warranty: No warranty
              </p>
            </div>

            {/* Delivery Info */}
            <div className="space-y-3 border-t border-gray-200 pt-6">
              <div className="flex gap-4">
                <Truck className="text-gray-600 flex-shrink-0 mt-1" size={20} />
                <div>
                  <p className="font-semibold text-sm text-gray-900">Free Delivery</p>
                  <p className="text-sm text-gray-600">Enter your postal code for delivery availability</p>
                </div>
              </div>
              <div className="flex gap-4">
                <RotateCcw className="text-gray-600 flex-shrink-0 mt-1" size={20} />
                <div>
                  <p className="font-semibold text-sm text-gray-900">Return Delivery</p>
                  <p className="text-sm text-gray-600">Free 30 days delivery returns. Details</p>
                </div>
              </div>
            </div>

            {!selectedSize && (
              <p className="text-sm text-red-500">
                ⚠ Please select a size
              </p>
            )}

             {/* Product Description */}
            <div className="mt-6 pt-6 border-t border-gray-200 md:hidden">
              <p className="text-sm text-gray-700 leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Key Features Table */}
            <div className="mt-6 md:hidden">
              <div className="bg-pink-300 text-white px-4 py-2 font-semibold text-sm">
                Key Features
              </div>
              <table className="w-full text-sm border-x border-b border-gray-200">
                <tbody>
                  {features.map((feature, index) => (
                    <tr key={index} className="border-b border-gray-200 last:border-0">
                      <td className="px-4 py-3 text-gray-600 bg-gray-50 w-1/3">{feature.label}</td>
                      <td className="px-4 py-3 text-gray-900">{feature.value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      <ReviewSection/>
      <RelatedProducts />
    </div>
  );
};

export default ProductDetailPage;