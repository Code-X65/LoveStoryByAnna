import React from 'react';
import { ArrowRight } from 'lucide-react';

const CategoryHighlights = () => {
  const categories = [
    {
      id: 1,
      title: "Boys",
      description: "Trendy styles for active boys",
      image: "https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=500&h=600&fit=crop",
      link: "/category/boys",
      bgColor: "from-blue-400 to-blue-600"
    },
    {
      id: 2,
      title: "Girls",
      description: "Beautiful outfits for little princesses",
      image: "https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?w=500&h=600&fit=crop",
      link: "/category/girls",
      bgColor: "from-pink-400 to-pink-600"
    },
    {
      id: 3,
      title: "Bags",
      description: "Stylish bags for every occasion",
      image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&h=600&fit=crop",
      link: "/category/bags",
      bgColor: "from-purple-400 to-purple-600"
    },
    {
      id: 4,
      title: "Accessories",
      description: "Perfect finishing touches",
      image: "https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=500&h=600&fit=crop",
      link: "/category/accessories",
      bgColor: "from-rose-400 to-rose-600"
    }
  ];

  return (
    <div className="bg-white py-12 px-4 md:py-16 md:px-6">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-3">
            Shop by Category
          </h2>
          <p className="text-gray-600 text-base md:text-lg">
            Discover our collection for kids
          </p>
        </div>

        {/* Category Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category) => (
            <a
              key={category.id}
              href={category.link}
              className="group relative overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
            >
              {/* Image */}
              <div className="relative h-72 overflow-hidden">
                <img
                  src={category.image}
                  alt={category.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                {/* Gradient Overlay */}
                <div className={`absolute inset-0 bg-gradient-to-t ${category.bgColor} opacity-60 group-hover:opacity-70 transition-opacity duration-300`} />
              </div>

              {/* Content */}
              <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
                <h3 className="text-2xl font-bold mb-2 group-hover:translate-x-1 transition-transform duration-300">
                  {category.title}
                </h3>
                <p className="text-sm mb-3 opacity-90">
                  {category.description}
                </p>
                <div className="flex items-center text-sm font-semibold group-hover:translate-x-2 transition-transform duration-300">
                  <span>Shop Now</span>
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:ml-3 transition-all duration-300" />
                </div>
              </div>

              {/* Hover Border Effect */}
              <div className="absolute inset-0 border-2 border-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg" />
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategoryHighlights;