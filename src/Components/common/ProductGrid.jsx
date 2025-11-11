import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { products } from '../Data/productsData';


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
         {products.slice(0, 8).map((product) => (
  <ProductCard key={product.id} product={{...product, price: `FROM ₦${product.price.toLocaleString()}`}} />
))}
        </div>
        <div className='text-center mt-8'>

       <Link to='/collections'> <button className='items-center font-semibold px-6 py-3 bg-black text-white cursor-pointer justify-center '>View All Collections</button></Link>
        </div>
      </div>
    </div>
  );
}