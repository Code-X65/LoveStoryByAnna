import React, { useState } from 'react';
import { Heart, ShoppingCart } from 'lucide-react';
import img01 from '../../assets/trending/img01.jpg'
import img02 from '../../assets/trending/img02.jpg'
import img12 from '../../assets/trending/img12.jpg'
import img03 from '../../assets/trending/img03.jpg'
import img13 from '../../assets/trending/img13.jpg'
import img04 from '../../assets/trending/img04.jpg'
import img14 from '../../assets/trending/img14.jpg'
import img05 from '../../assets/trending/img05.jpg'
import img15 from '../../assets/trending/img15.jpg'
import img06 from '../../assets/trending/img06.jpg'
import img16 from '../../assets/trending/img16.jpg'
import img07 from '../../assets/trending/img07.jpg'
import { Link } from 'react-router-dom';
const girlsProducts = [
  {
    id: 1,
    name: 'BLACK GIRLS CARGO DENIM TROUSER',
    price: 'FROM ₦41,950.00',
    image1: img01,
    image2: img01
  },
  {
    id: 2,
    name: 'BLUE DENIM WIDE LEG TROUSER',
    price: 'FROM ₦79,950.00',
    image1: img02,
    image2: img12
  },
  {
    id: 3,
    name: 'BLACK DENIM WIDE LEG TROUSER',
    price: 'FROM ₦79,950.00',
    image1: img03,
    image2: img13
  },
  {
    id: 4,
    name: 'BLUE DENIM STRAIGHT LEG TROUSER',
    price: 'FROM ₦67,950.00',
    image1: img04,
    image2: img14
  },
  {
    id: 5,
    name: 'LIGHT WASH DENIM JACKET',
    price: 'FROM ₦54,950.00',
    image1: img05,
    image2: img15
  },
  {
    id: 6,
    name: 'RIPPED DENIM SHORTS',
    price: 'FROM ₦32,950.00',
    image1: img06,
    image2: img16
  },
  {
    id: 7,
    name: 'DARK WASH SKINNY JEANS',
    price: 'FROM ₦45,950.00',
    image1: img07,
    image2: img07
  },
  {
    id: 8,
    name: 'DENIM DUNGAREE DRESS',
    price: 'FROM ₦58,950.00',
    image1: img02,
    image2: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400&h=500&fit=crop'
  }
];

const boysProducts = [
  {
    id: 9,
    name: 'BOYS CLASSIC BLUE DENIM JEANS',
    price: 'FROM ₦38,950.00',
    image1: 'https://media.sf-converter.com/get?__sig=MxLXPtyMzBeo0nAPOy-MNQ&__expires=1762574859&uri=https%3A%2F%2Fscontent-lga3-1.cdninstagram.com%2Fv%2Ft51.2885-15%2F483140095_18040163363394527_5794728685742570000_n.jpg%3Fstp%3Ddst-jpg_e35_p1080x1080_sh0.08_tt6%26_nc_ht%3Dscontent-lga3-1.cdninstagram.com%26_nc_cat%3D111%26_nc_oc%3DQ6cZ2QFxAhRGH3vGaBtFDeJGda2pjPlJE6J8SomkVyUpu_rspTOlRdvVZQBxV1njereML9V8KlGT2-sKR2uUMvhPMwe2%26_nc_ohc%3D_kyo3Gy5TzAQ7kNvwGvFiAQ%26_nc_gid%3DTnl0ixLkaA9IlZZmzdBBuw%26edm%3DANTKIIoBAAAA%26ccb%3D7-5%26oh%3D00_AfiOwJGsez3RISo2Gdz83yDz-FiOyozbfdKBEvb3WbYHwA%26oe%3D6914810C%26_nc_sid%3Dd885a2&filename=483140095_18040163363394527_5794728685742570000_n.jpg',
    image2: 'https://media.sf-converter.com/get?__sig=ubBMmpQqgcfBe9OaX9EI7A&__expires=1762574859&uri=https%3A%2F%2Fscontent-lga3-1.cdninstagram.com%2Fv%2Ft51.2885-15%2F482676371_18040163372394527_2143327993314655942_n.jpg%3Fstp%3Ddst-jpg_e35_p1080x1080_sh0.08_tt6%26_nc_ht%3Dscontent-lga3-1.cdninstagram.com%26_nc_cat%3D111%26_nc_oc%3DQ6cZ2QFxAhRGH3vGaBtFDeJGda2pjPlJE6J8SomkVyUpu_rspTOlRdvVZQBxV1njereML9V8KlGT2-sKR2uUMvhPMwe2%26_nc_ohc%3DjkyRjGWsZXEQ7kNvwEuXaM6%26_nc_gid%3DTnl0ixLkaA9IlZZmzdBBuw%26edm%3DANTKIIoBAAAA%26ccb%3D7-5%26oh%3D00_AfiE2b8Op8xdCvuSZfmfCMSdoC6iUYNiLJdOHhVHn1nDcw%26oe%3D69147955%26_nc_sid%3Dd885a2&filename=482676371_18040163372394527_2143327993314655942_n.jpg'
  },
  {
    id: 10,
    name: 'BOYS BLACK DENIM JACKET',
    price: 'FROM ₦52,950.00',
    image1: 'https://media.sf-converter.com/get?__sig=bdA7bSvOnuPSN2E1PqYvGQ&__expires=1762574915&uri=https%3A%2F%2Fscontent-lga3-1.cdninstagram.com%2Fv%2Ft51.2885-15%2F483277380_18040164671394527_5768348418376906144_n.jpg%3Fstp%3Ddst-jpg_e35_p1080x1080_sh0.08_tt6%26_nc_ht%3Dscontent-lga3-1.cdninstagram.com%26_nc_cat%3D111%26_nc_oc%3DQ6cZ2QFpt97b8yZ6m0muAFPVIDpI6jjo35_XrdQ-NoMc56m19ZVlgzA32qWDNhSZ1Cm3B6A5frvLQL7LkDud-rgyMnZj%26_nc_ohc%3Dg1q41sNL2BcQ7kNvwGYW2hW%26_nc_gid%3Dup1N4Brf6gWmg3fsuX8xpQ%26edm%3DANTKIIoBAAAA%26ccb%3D7-5%26oh%3D00_AfiHX-S-Sb5w5LzFxCHZwodamKuzw20BxJL6b3sKSERGSQ%26oe%3D6914A9CA%26_nc_sid%3Dd885a2&filename=483277380_18040164671394527_5768348418376906144_n.jpg',
    image2: 'https://media.sf-converter.com/get?__sig=hY6VtJw7WlgT_vrRQqlSEg&__expires=1762574915&uri=https%3A%2F%2Fscontent-lga3-1.cdninstagram.com%2Fv%2Ft51.2885-15%2F482617834_18040164683394527_3514045412441230397_n.jpg%3Fstp%3Ddst-jpg_e35_p1080x1080_sh0.08_tt6%26_nc_ht%3Dscontent-lga3-1.cdninstagram.com%26_nc_cat%3D111%26_nc_oc%3DQ6cZ2QFpt97b8yZ6m0muAFPVIDpI6jjo35_XrdQ-NoMc56m19ZVlgzA32qWDNhSZ1Cm3B6A5frvLQL7LkDud-rgyMnZj%26_nc_ohc%3DSNel5ZK1_3YQ7kNvwH8LW81%26_nc_gid%3Dup1N4Brf6gWmg3fsuX8xpQ%26edm%3DANTKIIoBAAAA%26ccb%3D7-5%26oh%3D00_Afihiry64cafvY-S596xIWlAtPh7_8rKGLFAR9Ea2BAFQw%26oe%3D69149F56%26_nc_sid%3Dd885a2&filename=482617834_18040164683394527_3514045412441230397_n.jpg'
  },
  {
    id: 11,
    name: 'BOYS DISTRESSED DENIM SHORTS',
    price: 'FROM ₦29,950.00',
    image1: 'https://media.sf-converter.com/get?__sig=mfvimoVFvGpCril0MtmtwQ&__expires=1762574970&uri=https%3A%2F%2Fscontent-lga3-1.cdninstagram.com%2Fv%2Ft51.2885-15%2F482922335_18040168313394527_1293737237522852083_n.jpg%3Fstp%3Ddst-jpg_e35_p1080x1080_sh0.08_tt6%26_nc_ht%3Dscontent-lga3-1.cdninstagram.com%26_nc_cat%3D111%26_nc_oc%3DQ6cZ2QHefdTIPL3f936lNBMz3sfV5JUEEYGcO4Ly48GN0qOiuy3qsSVY__m_sfyeph6j7Kr2HOk82F9gGMscKClE_Zli%26_nc_ohc%3Dn_qHq6UmCZQQ7kNvwGlSGSm%26_nc_gid%3DlYFxz6fjOjxIoOPtR1w_lQ%26edm%3DANTKIIoBAAAA%26ccb%3D7-5%26oh%3D00_Afg__olPKCWHySKowyrBB_zC3c0wXZLlQ3VD-atazKtEmA%26oe%3D69147FEF%26_nc_sid%3Dd885a2&filename=482922335_18040168313394527_1293737237522852083_n.jpg',
    image2: 'https://media.sf-converter.com/get?__sig=yaJt32Yg4Xdz8X9rWAH-OA&__expires=1762574970&uri=https%3A%2F%2Fscontent-lga3-1.cdninstagram.com%2Fv%2Ft51.2885-15%2F482864717_18040168322394527_7809489331645091220_n.jpg%3Fstp%3Ddst-jpg_e35_p1080x1080_sh0.08_tt6%26_nc_ht%3Dscontent-lga3-1.cdninstagram.com%26_nc_cat%3D111%26_nc_oc%3DQ6cZ2QHefdTIPL3f936lNBMz3sfV5JUEEYGcO4Ly48GN0qOiuy3qsSVY__m_sfyeph6j7Kr2HOk82F9gGMscKClE_Zli%26_nc_ohc%3D4BcuR-ue0TgQ7kNvwGgKHKI%26_nc_gid%3DlYFxz6fjOjxIoOPtR1w_lQ%26edm%3DANTKIIoBAAAA%26ccb%3D7-5%26oh%3D00_Afho_wgC2bYGh3b0woJzx8AcECOkz_fb6ZdFknStVP6EZw%26oe%3D6914A609%26_nc_sid%3Dd885a2&filename=482864717_18040168322394527_7809489331645091220_n.jpg'
  },
  {
    id: 12,
    name: 'BOYS SLIM FIT DENIM JEANS',
    price: 'FROM ₦42,950.00',
    image1: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=400&h=500&fit=crop',
    image2: 'https://images.unsplash.com/photo-1490578474895-699cd4e2cf59?w=400&h=500&fit=crop'
  },
  {
    id: 13,
    name: 'BOYS LIGHT WASH DENIM PANTS',
    price: 'FROM ₦39,950.00',
    image1: 'https://images.unsplash.com/photo-1516826957135-700dedea698c?w=400&h=500&fit=crop',
    image2: 'https://images.unsplash.com/photo-1544441892-794166f1e3be?w=400&h=500&fit=crop'
  },
  {
    id: 14,
    name: 'BOYS CARGO DENIM SHORTS',
    price: 'FROM ₦34,950.00',
    image1: 'https://images.unsplash.com/photo-1581803118522-7b72a50f7e9f?w=400&h=500&fit=crop',
    image2: 'https://images.unsplash.com/photo-1617127365659-c47fa864d8bc?w=400&h=500&fit=crop'
  },
  {
    id: 15,
    name: 'BOYS RIPPED KNEE JEANS',
    price: 'FROM ₦46,950.00',
    image1: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=400&h=500&fit=crop',
    image2: 'https://images.unsplash.com/photo-1564859228273-274232fdb516?w=400&h=500&fit=crop'
  },
  {
    id: 16,
    name: 'BOYS DENIM DUNGAREE',
    price: 'FROM ₦55,950.00',
    image1: 'https://images.unsplash.com/photo-1504593811423-6dd665756598?w=400&h=500&fit=crop',
    image2: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=400&h=500&fit=crop'
  }
];

function ProductCard({ product }) {
  const [isHovered, setIsHovered] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);

  return (
    <div className="group cursor-pointer">
      <div 
        className="relative overflow-hidden bg-gray-100 mb-4 aspect-[3/4] rounded-lg"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Images */}
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

        {/* Hover Actions */}
        <div className={`absolute inset-0 bg-black/20 transition-opacity duration-300 ${
          isHovered ? 'opacity-100' : 'opacity-0'
        }`}>
          <div className="absolute top-4 right-4 flex flex-col gap-2">
            {/* Wishlist Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsWishlisted(!isWishlisted);
              }}
              className={`p-2 rounded-full transition-all duration-300 transform ${
                isWishlisted 
                  ? 'bg-pink-500 text-white scale-110' 
                  : 'bg-white/90 text-gray-700 hover:bg-pink-500 hover:text-white'
              }`}
            >
              <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-current' : ''}`} />
            </button>
          </div>

          {/* Add to Cart Button */}
          <div className="absolute bottom-4 left-4 right-4">
            <button className="w-full bg-pink-500 hover:bg-pink-600 text-white py-3 px-4 rounded-lg font-semibold text-sm transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2 shadow-lg">
              <ShoppingCart className="w-4 h-4" />
              ADD TO CART
            </button>
          </div>
        </div>

        {/* Quick View Badge */}
        <div className={`absolute top-4 left-4 transition-all duration-300 ${
          isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'
        }`}>
          <span className="bg-white/90 text-gray-800 px-3 py-1 rounded-full text-xs font-semibold">
            Quick View
          </span>
        </div>
      </div>

      {/* Product Info */}
      <div className="text-center space-y-2 px-2">
        <h3 className="text-xs font-medium text-gray-900 uppercase tracking-wide hover:text-pink-500 transition-colors">
          {product.name}
        </h3>
        <p className="text-sm font-semibold text-gray-700">{product.price}</p>
      </div>
    </div>
  );
}

export default function DenimFeverSection() {
  const [activeTab, setActiveTab] = useState('girls');
  const [isTransitioning, setIsTransitioning] = useState(false);

  const handleTabChange = (tab) => {
    if (tab !== activeTab) {
      setIsTransitioning(true);
      setTimeout(() => {
        setActiveTab(tab);
        setIsTransitioning(false);
      }, 300);
    }
  };

  const currentProducts = activeTab === 'girls' ? girlsProducts : boysProducts;

  return (
    <div className="bg-gradient-to-b from-white to-gray-50 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Section Title */}
        <div className="text-center mb-12">
          <div className="inline-block mb-4">
            <span className="bg-pink-100 text-pink-600 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest">
              Trending Now
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 uppercase tracking-wider mb-3">
            DENIM FEVER
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Explore our exclusive collection of premium denim wear for kids
          </p>
          
          {/* Tabs */}
          <div className="flex justify-center items-center gap-8 mt-8 mb-4">
            <button
              onClick={() => handleTabChange('girls')}
              className={`text-xl font-semibold uppercase tracking-wide pb-3 transition-all duration-300 relative ${
                activeTab === 'girls' 
                  ? 'text-pink-500' 
                  : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              GIRLS
              {activeTab === 'girls' && (
                <span className="absolute bottom-0 left-0 right-0 h-1 bg-pink-500 rounded-full"></span>
              )}
            </button>
            <div className="h-8 w-px bg-gray-300"></div>
            <button
              onClick={() => handleTabChange('boys')}
              className={`text-xl font-semibold uppercase tracking-wide pb-3 transition-all duration-300 relative ${
                activeTab === 'boys' 
                  ? 'text-pink-500' 
                  : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              BOYS
              {activeTab === 'boys' && (
                <span className="absolute bottom-0 left-0 right-0 h-1 bg-pink-500 rounded-full"></span>
              )}
            </button>
          </div>
        </div>

        {/* Product Grid with Transition */}
        <div className={`transition-all duration-300 ${
          isTransitioning ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'
        }`}>
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
            {currentProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>

        {/* View All Button */}
        <div className="text-center mt-12">
         <Link to="/Denim"> <button className="bg-pink-500 hover:bg-pink-600 text-white px-8 py-3 rounded-lg font-bold uppercase tracking-wide transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl">
            View All Denim Collection
          </button>
          </Link>
        </div>
      </div>
    </div>
  );
}