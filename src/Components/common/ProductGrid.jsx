import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const products = [
  {
    id: 1,
    name: 'NOELLA BUBBLE DRESS',
    price: 'FROM ₦25,000.00',
    image1: 'https://www.ruffntumblekids.com/cdn/shop/files/DRE_400x.png?v=1760459842',
    image2: 'https://lh3.googleusercontent.com/gg-dl/ABS2GSnXWriW45gkkzwZIpQ0pUlB7CNZZFHs1qcwnYQLcpR0y0CqWEMOcbuwjYB0UHh4_prcZmdyHNbx0E2FQGCAXe7bEBSAuqkp0SFBWkbeAVdobG7ripygwa4_Hwzszimk2OWzzz7fLUV0UdiMnCTkBhvEd_D0doiSzDLV-NkQZqmxiQUF3Q=s1024-rj'
  },
  {
    id: 2,
    name: 'DOTTED BLACK RASPBERRY FLORAL BALL DRESS',
    price: 'FROM ₦41,000.00',
    image1: 'https://www.ruffntumblekids.com/cdn/shop/files/23_df5146bc-fa23-40b3-9714-2d58443a8c39_400x.png?v=1759744930',
    image2: 'https://images.unsplash.com/photo-1612423284934-2850a4ea6b0f?w=400&h=500&fit=crop'
  },
  {
    id: 3,
    name: 'AURORA DRESS',
    price: 'FROM ₦25,000.00',
    image1: 'https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?w=400&h=500&fit=crop',
    image2: 'https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=400&h=500&fit=crop'
  },
  {
    id: 4,
    name: 'RASPBERRY AND BLACK FLORAL BALL DRESS',
    price: 'FROM ₦47,000.00',
    image1: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400&h=500&fit=crop',
    image2: 'https://images.unsplash.com/photo-1612423284934-2850a4ea6b0f?w=400&h=500&fit=crop'
  },
  {
    id: 5,
    name: 'FUCHSIA PINK CAP SLEEVE A-LINE DRESS',
    price: 'FROM ₦25,000.00',
    image1: 'https://images.unsplash.com/photo-1612423284934-2850a4ea6b0f?w=400&h=500&fit=crop',
    image2: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400&h=500&fit=crop'
  },
  {
    id: 6,
    name: 'ANNABABI SET',
    price: 'FROM ₦111,000.00',
    image1: 'https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=400&h=500&fit=crop',
    image2: 'https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?w=400&h=500&fit=crop'
  },
  {
    id: 7,
    name: 'YELLOW GREEN AND BLUE FLORAL CHICANKA A-LINE DRESS',
    price: 'FROM ₦48,000.00',
    image1: 'https://images.unsplash.com/photo-1596783074918-c84cb06531ca?w=400&h=500&fit=crop',
    image2: 'https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?w=400&h=500&fit=crop'
  },
  {
    id: 8,
    name: 'GREEN, OFF-WHITE AND PINK ABSTRACT CHIFFON A-LINE DRESS',
    price: 'FROM ₦45,000.00',
    image1: 'https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=400&h=500&fit=crop',
    image2: 'https://images.unsplash.com/photo-1612423284934-2850a4ea6b0f?w=400&h=500&fit=crop'
  }
];

function ProductCard({ product }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="group cursor-pointer">
    <Link to='/collections'>
      <div 
        className="relative overflow-hidden bg-gray-100 mb-3 aspect-[4/5]"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <img
          src={product.image1}
          alt={product.name}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
            isHovered ? 'opacity-0' : 'opacity-100'
          }`}
        />
        <img
          src={product.image2}
          alt={product.name}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
            isHovered ? 'opacity-100' : 'opacity-0'
          }`}
        />
      </div>
      </Link>
      <div className="text-center space-y-1">
        <h3 className="text-xs font-medium text-gray-900 uppercase tracking-wide px-2">
          {product.name}
        </h3>
        <p className="text-xs text-gray-600">{product.price}</p>
      </div>
    </div>
  );
}

export default function ProductGrid() {
  return (
    <div className="bg-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-10">
          <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-widest">
            NEW COLLECTION
          </h2>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-8 sm:gap-x-6 sm:gap-y-10 lg:gap-x-8 lg:gap-y-12">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
        <div className='text-center mt-8'>

       <Link to='/collections'> <button className='items-center font-semibold px-6 py-3 bg-black text-white cursor-pointer justify-center '>View All Collections</button></Link>
        </div>
      </div>
    </div>
  );
}