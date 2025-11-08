import React, { useState } from 'react';
import { Heart, Minus, Plus, ShoppingCart, Truck, RotateCcw, Star, Share2 } from 'lucide-react';
import RelatedProducts from './RelatedProducts';

const ProductDetailPage = () => {
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);

  const product = {
    name: "BOYS BLUE ANKARA SHORT SLEEVE SHIRT",
    brand: "ANKARA KIDS",
    model: "Latest AKS",
    sku: "LSSCBDLNCR_18 MTH",
    price: 37950,
    originalPrice: 45000,
    discount: 17,
    rating: 4,
    reviews: 42,
    stock: 6,
    images: [
      "https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?w=600&h=800&fit=crop",
      "https://images.unsplash.com/photo-1519058082700-08a0b56da9b4?w=600&h=800&fit=crop",
      "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=600&h=800&fit=crop",
      "https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?w=600&h=800&fit=crop"
    ],
    sizes: ["18 MTH", "2 YEARS", "3 YEARS", "4 YEARS"],
    colors: ["Blue", "Red", "Green"],
    description: "The Boys Blue Ankara Short Sleeve Shirt features premium quality fabric with vibrant Ankara prints, delivering comfort, style, and durability. Ideal for parties, outdoor adventures, or everyday wear. Perfect for gatherings, picnics, or casual outings."
  };

  const handleQuantityChange = (type) => {
    if (type === 'increment' && quantity < product.stock) {
      setQuantity(quantity + 1);
    } else if (type === 'decrement' && quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const features = [
    { label: "Material", value: "Premium Cotton Blend" },
    { label: "Pattern", value: "Authentic Ankara Print" },
    { label: "Care", value: "Machine Washable" },
    { label: "Fit", value: "Comfortable Regular Fit" }
  ];

  return (
    <div className=" bg-white">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Column - Images */}
          <div className="lg:sticky lg:top-6 h-fit">
            {/* Main Image */}
            <div className="bg-gray-50 border border-gray-200 mb-4">
              <img
                src={product.images[selectedImage]}
                alt={product.name}
                className="w-full h-auto object-contain"
              />
            </div>

            {/* Thumbnail Images */}
            <div className="grid grid-cols-4 gap-3">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`border-2 transition-all ${
                    selectedImage === index
                      ? 'border-pink-300'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <img
                    src={image}
                    alt={`View ${index + 1}`}
                    className="w-full h-auto object-cover"
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
                <span className="bg-green-100 text-green-700 text-xs px-2 py-1 font-medium">
                  In Stock
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
                The JBL Boombox 2 is a powerful, portable Bluetooth speaker in black, delivering booming bass, long-lasting battery life, and splashproof durability. Ideal for parties, outdoor adventures, or home use.
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
                    className="px-4 py-3 hover:bg-gray-50 transition-colors disabled:opacity-40"
                    disabled={quantity <= 1}
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
                    className="px-4 py-3 hover:bg-gray-50 transition-colors disabled:opacity-40"
                    disabled={quantity >= product.stock}
                  >
                    <Plus size={16} className="text-gray-700" />
                  </button>
                </div>

                <button
                  disabled={!selectedSize}
                  className={`flex-1 py-3 font-semibold text-sm transition-all flex items-center justify-center gap-2 ${
                    selectedSize
                      ? 'bg-pink-300 text-white hover:bg-pink-400'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  <ShoppingCart size={18} />
                  Update Cart
                </button>
              </div>

              {/* Wishlist and Share */}
              <div className="flex gap-3">
                <button
                  onClick={() => setIsWishlisted(!isWishlisted)}
                  className={`flex-1 py-3 border-2 font-medium text-sm transition-all flex items-center justify-center gap-2 ${
                    isWishlisted
                      ? 'border-pink-300 bg-pink-50 text-pink-400'
                      : 'border-gray-300 text-gray-700 hover:border-pink-300'
                  }`}
                >
                  <Heart size={18} className={isWishlisted ? 'fill-pink-400' : ''} />
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
      <RelatedProducts />
    </div>
  );
};

export default ProductDetailPage;