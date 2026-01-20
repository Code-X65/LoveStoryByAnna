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
    <div className="relative h-[340px] overflow-hidden mb-6 rounded-b-[40px] shadow-sm" style={{ backgroundColor: colors.bg }}>
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-15">
        {hero.pattern === 'dots' && (
          <div className="w-full h-full" style={{
            backgroundImage: `radial-gradient(${colors.primary} 3px, transparent 3px)`,
            backgroundSize: '40px 40px'
          }} />
        )}
        {hero.pattern === 'stripes' && (
          <div className="w-full h-full" style={{
            backgroundImage: `repeating-linear-gradient(45deg, ${colors.primary}, ${colors.primary} 10px, transparent 10px, transparent 30px)`
          }} />
        )}
        {hero.pattern === 'hearts' && (
          <div className="w-full h-full flex flex-wrap justify-between">
            {[...Array(30)].map((_, i) => (
              <div key={i} className="text-5xl opacity-20 m-6 animate-pulse" style={{ color: colors.primary, animationDuration: `${Math.random() * 3 + 2}s` }}>♥</div>
            ))}
          </div>
        )}
        {hero.pattern === 'stars' && (
          <div className="w-full h-full flex flex-wrap justify-between">
            {[...Array(30)].map((_, i) => (
              <div key={i} className="text-5xl opacity-20 m-6 animate-pulse" style={{ color: colors.primary, animationDuration: `${Math.random() * 3 + 2}s` }}>★</div>
            ))}
          </div>
        )}
        {hero.pattern === 'circles' && (
          <div className="w-full h-full" style={{
            backgroundImage: `radial-gradient(circle, ${colors.primary} 2px, transparent 2px)`,
            backgroundSize: '50px 50px'
          }} />
        )}
        {hero.pattern === 'waves' && (
          <svg className="w-full h-full opacity-30" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="wave" x="0" y="0" width="100" height="40" patternUnits="userSpaceOnUse">
                <path d="M0 20 Q 25 5, 50 20 T 100 20" stroke={colors.primary} strokeWidth="3" fill="none" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#wave)" />
          </svg>
        )}
      </div>

      {/* Content Container */}
      <div className="relative h-full max-w-7xl mx-auto px-4 flex items-center justify-center">
        {/* Hanger Display */}
        <div className="flex items-start justify-center gap-12 lg:gap-24">
          {/* Left Hanger */}
          <div className="hidden md:flex flex-col items-center animate-swing origin-top" style={{ animationDelay: '0s' }}>
            <div className="relative">
              {/* Hanger Hook */}
              <div
                className="w-10 h-14 rounded-t-full border-[5px] border-b-0 mx-auto transform -translate-y-2"
                style={{ borderColor: hero.hangerColor }}
              />
              {/* Hanger Bar */}
              <div
                className="w-40 h-4 rounded-full relative shadow-sm"
                style={{ backgroundColor: hero.hangerColor }}
              >
                <div className="absolute left-3 top-1/2 -translate-y-1/2 w-2.5 h-2.5 bg-white rounded-full opacity-50" />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 w-2.5 h-2.5 bg-white rounded-full opacity-50" />
              </div>
            </div>
            {/* Clothing Item */}
            <div
              className="w-36 h-48 -mt-2 rounded-2xl shadow-xl relative overflow-hidden transform -rotate-1 border-2 border-white/50"
              style={{ backgroundColor: colors.primary }}
            >
              <div className="absolute inset-0 bg-gradient-to-tr from-black/10 to-transparent" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-white text-sm font-black tracking-widest transform -rotate-6 opacity-80 border-2 border-white px-2 py-1 rounded">
                  {category.split(' ')[0]}
                </div>
              </div>
            </div>
          </div>

          {/* Center Content */}
          <div className="text-center px-4 pt-4 z-10">
            <div className="inline-block px-4 py-1.5 rounded-full bg-white/60 backdrop-blur-sm mb-4 text-xs font-bold tracking-widest border border-white" style={{ color: colors.primary }}>
              WELCOME TO LOVESTORY
            </div>
            <h1
              className="text-4xl lg:text-6xl font-black mb-4 tracking-tight drop-shadow-sm"
              style={{ color: colors.primary }}
            >
              {hero.title.toUpperCase()}
            </h1>
            <p className="text-lg lg:text-xl text-gray-600 mb-8 font-medium tracking-wide max-w-lg mx-auto leading-relaxed">
              {hero.subtitle}
            </p>
            <div className="flex gap-4 justify-center">
              <button
                className="px-8 py-3.5 text-white font-bold rounded-full shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all active:scale-95"
                style={{ backgroundColor: colors.primary }}
              >
                SHOP NOW
              </button>
              <button
                className="px-8 py-3.5 border-2 font-bold rounded-full hover:bg-white transition-all transform hover:-translate-y-1 active:scale-95"
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
          <div className="hidden md:flex flex-col items-center animate-swing origin-top" style={{ animationDelay: '0.5s' }}>
            <div className="relative">
              {/* Hanger Hook */}
              <div
                className="w-10 h-14 rounded-t-full border-[5px] border-b-0 mx-auto transform -translate-y-2"
                style={{ borderColor: hero.hangerColor }}
              />
              {/* Hanger Bar */}
              <div
                className="w-40 h-4 rounded-full relative shadow-sm"
                style={{ backgroundColor: hero.hangerColor }}
              >
                <div className="absolute left-3 top-1/2 -translate-y-1/2 w-2.5 h-2.5 bg-white rounded-full opacity-50" />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 w-2.5 h-2.5 bg-white rounded-full opacity-50" />
              </div>
            </div>
            {/* Clothing Item */}
            <div
              className="w-36 h-48 -mt-2 rounded-2xl shadow-xl relative overflow-hidden transform rotate-1 border-2 border-white/50"
              style={{ backgroundColor: colors.hover }}
            >
              <div className="absolute inset-0 bg-gradient-to-bl from-black/10 to-transparent" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-white text-sm font-black tracking-widest transform rotate-6 opacity-80 border-2 border-white px-2 py-1 rounded">
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
          0%, 100% { transform: rotate(-3deg); }
          50% { transform: rotate(3deg); }
        }
        .animate-swing {
          animation: swing 4s ease-in-out infinite;
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