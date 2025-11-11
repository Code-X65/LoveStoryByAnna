// Add this HeroSection component before the ProductCollections component

const HeroSection = ({ category, colors }) => {
  const heroData = {
    'GIRLS': {
      title: 'Girls Collection',
      subtitle: 'Stylish & Comfortable Outfits',
      image: 'https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?w=800',
      hangerColor: colors.primary,
      pattern: 'dots'
    },
    'BOYS': {
      title: 'Boys Collection',
      subtitle: 'Cool & Trendy Styles',
      image: 'https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=800',
      hangerColor: colors.primary,
      pattern: 'stripes'
    },
    'BABY': {
      title: 'Baby Collection',
      subtitle: 'Soft & Adorable Essentials',
      image: 'https://images.unsplash.com/photo-1522771930-78848d9293e8?w=800',
      hangerColor: colors.primary,
      pattern: 'hearts'
    },
    'NEW ARRIVALS': {
      title: 'New Arrivals',
      subtitle: 'Fresh Styles Just In',
      image: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=800',
      hangerColor: colors.primary,
      pattern: 'stars'
    },
    'ACCESSORIES': {
      title: 'Accessories',
      subtitle: 'Complete Your Look',
      image: 'https://images.unsplash.com/photo-1492707892479-7bc8d5a4ee93?w=800',
      hangerColor: colors.primary,
      pattern: 'circles'
    },
    'FOOTWEAR': {
      title: 'Footwear',
      subtitle: 'Step Out In Style',
      image: 'https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=800',
      hangerColor: colors.primary,
      pattern: 'waves'
    }
  };

  const hero = heroData[category] || heroData['GIRLS'];

  return (
    <div className="relative h-80 overflow-hidden mb-8" style={{ backgroundColor: colors.bg }}>
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        {hero.pattern === 'dots' && (
          <div className="w-full h-full" style={{
            backgroundImage: `radial-gradient(${colors.primary} 2px, transparent 2px)`,
            backgroundSize: '30px 30px'
          }} />
        )}
        {hero.pattern === 'stripes' && (
          <div className="w-full h-full" style={{
            backgroundImage: `repeating-linear-gradient(45deg, ${colors.primary}, ${colors.primary} 10px, transparent 10px, transparent 20px)`
          }} />
        )}
        {hero.pattern === 'hearts' && (
          <div className="w-full h-full flex flex-wrap">
            {[...Array(50)].map((_, i) => (
              <div key={i} className="text-4xl opacity-20 m-4" style={{ color: colors.primary }}>♥</div>
            ))}
          </div>
        )}
        {hero.pattern === 'stars' && (
          <div className="w-full h-full flex flex-wrap">
            {[...Array(50)].map((_, i) => (
              <div key={i} className="text-4xl opacity-20 m-4" style={{ color: colors.primary }}>★</div>
            ))}
          </div>
        )}
        {hero.pattern === 'circles' && (
          <div className="w-full h-full" style={{
            backgroundImage: `radial-gradient(circle, ${colors.primary} 1px, transparent 1px)`,
            backgroundSize: '40px 40px'
          }} />
        )}
        {hero.pattern === 'waves' && (
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="wave" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
                <path d="M0 50 Q 25 30, 50 50 T 100 50" stroke={colors.primary} strokeWidth="2" fill="none" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#wave)" />
          </svg>
        )}
      </div>

      {/* Content Container */}
      <div className="relative h-full max-w-7xl mx-auto px-4 flex items-center justify-center">
        {/* Hanger Display */}
        <div className="flex items-start justify-center gap-8">
          {/* Left Hanger */}
          <div className="flex flex-col items-center animate-swing" style={{ animationDelay: '0s' }}>
            <div className="relative">
              {/* Hanger Hook */}
              <div 
                className="w-8 h-12 rounded-t-full border-4 border-b-0 mx-auto"
                style={{ borderColor: hero.hangerColor }}
              />
              {/* Hanger Bar */}
              <div 
                className="w-32 h-3 rounded-full relative"
                style={{ backgroundColor: hero.hangerColor }}
              >
                <div className="absolute left-2 top-1/2 -translate-y-1/2 w-2 h-2 bg-white rounded-full" />
                <div className="absolute right-2 top-1/2 -translate-y-1/2 w-2 h-2 bg-white rounded-full" />
              </div>
            </div>
            {/* Clothing Item */}
            <div 
              className="w-28 h-36 mt-1 rounded-b-lg shadow-lg relative overflow-hidden"
              style={{ backgroundColor: colors.primary, opacity: 0.9 }}
            >
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-white text-xs font-bold tracking-wider transform -rotate-6">
                  {category.split(' ')[0]}
                </div>
              </div>
            </div>
          </div>

          {/* Center Content */}
          <div className="text-center px-8 pt-8">
            <h1 
              className="text-5xl font-bold mb-4 tracking-wider"
              style={{ color: colors.primary }}
            >
              {hero.title.toUpperCase()}
            </h1>
            <p className="text-xl text-gray-600 mb-6 font-light tracking-wide">
              {hero.subtitle}
            </p>
            <div className="flex gap-4 justify-center">
              <button 
                className="px-8 py-3 text-white font-semibold transition-all transform hover:scale-105"
                style={{ backgroundColor: colors.primary }}
              >
                SHOP NOW
              </button>
              <button 
                className="px-8 py-3 border-2 font-semibold transition-all transform hover:scale-105"
                style={{ 
                  borderColor: colors.primary, 
                  color: colors.primary 
                }}
              >
                VIEW ALL
              </button>
            </div>
          </div>

          {/* Right Hanger */}
          <div className="flex flex-col items-center animate-swing" style={{ animationDelay: '0.5s' }}>
            <div className="relative">
              {/* Hanger Hook */}
              <div 
                className="w-8 h-12 rounded-t-full border-4 border-b-0 mx-auto"
                style={{ borderColor: hero.hangerColor }}
              />
              {/* Hanger Bar */}
              <div 
                className="w-32 h-3 rounded-full relative"
                style={{ backgroundColor: hero.hangerColor }}
              >
                <div className="absolute left-2 top-1/2 -translate-y-1/2 w-2 h-2 bg-white rounded-full" />
                <div className="absolute right-2 top-1/2 -translate-y-1/2 w-2 h-2 bg-white rounded-full" />
              </div>
            </div>
            {/* Clothing Item */}
            <div 
              className="w-28 h-36 mt-1 rounded-b-lg shadow-lg relative overflow-hidden"
              style={{ backgroundColor: colors.hover, opacity: 0.9 }}
            >
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-white text-xs font-bold tracking-wider transform rotate-6">
                  STYLE
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add CSS for swing animation */}
      <style jsx>{`
        @keyframes swing {
          0%, 100% { transform: rotate(-2deg); }
          50% { transform: rotate(2deg); }
        }
        .animate-swing {
          animation: swing 3s ease-in-out infinite;
          transform-origin: top center;
        }
      `}</style>
    </div>
  );
};

// USAGE: Add this line inside the return statement of ProductCollections, 
// right after the opening <div className="h-screen flex flex-col bg-white overflow-hidden">
// and before the {/* Header */} comment:

// <HeroSection category={category} colors={colors} />

export default HeroSection;