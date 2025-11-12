import React, { useState } from 'react';
import { Star } from 'lucide-react';

const testimonials = [
  {
    id: 1,
    name: "Sarah Johnson",
    role: "Mother of 2",
    company: "New York",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop",
    text: "The quality of the clothes is amazing! My kids love wearing them and they hold up so well even after multiple washes. Best purchase ever!",
    rating: 5
  },
  {
    id: 2,
    name: "Michael Chen",
    role: "Father of 3",
    company: "Los Angeles",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop",
    text: "Finally found a store with adorable designs and comfortable fabrics. My children refuse to wear anything else now. Great prices too!",
    rating: 5
  },
  {
    id: 3,
    name: "Emily Rodriguez",
    role: "Mother of 1",
    company: "Chicago",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop",
    text: "The clothing is not only stylish but so soft on my daughter's sensitive skin. Fast shipping and excellent customer service!",
    rating: 5
  }
];

export default function TestimonialSection() {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <div className=" bg-pink-300 py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            What Our Parents Say
          </h2>
          <p className="text-gray-700 text-lg">
            Hear from happy parents who love our kids' clothing
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={testimonial.id}
              className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300"
            >
              <div className="flex items-center mb-6">
                <img
                  src={testimonial.image}
                  alt={testimonial.name}
                  className="w-16 h-16 rounded-full object-cover mr-4"
                />
                <div>
                  <h3 className="font-bold text-gray-900">{testimonial.name}</h3>
                  <p className="text-sm text-gray-600">{testimonial.role}</p>
                  <p className="text-sm text-pink-600">{testimonial.company}</p>
                </div>
              </div>

              <div className="flex mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>

              <p className="text-gray-700 leading-relaxed">
                "{testimonial.text}"
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}