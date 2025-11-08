import React, { useState, useEffect } from 'react';
import { Clock, ArrowRight, Sparkles } from 'lucide-react';

const DiscountPromoBanner = () => {
  const [timeLeft, setTimeLeft] = useState({
    days: 3,
    hours: 12,
    minutes: 45,
    seconds: 30
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        let { days, hours, minutes, seconds } = prev;
        
        if (seconds > 0) {
          seconds--;
        } else {
          seconds = 59;
          if (minutes > 0) {
            minutes--;
          } else {
            minutes = 59;
            if (hours > 0) {
              hours--;
            } else {
              hours = 23;
              if (days > 0) {
                days--;
              }
            }
          }
        }
        
        return { days, hours, minutes, seconds };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-white py-16 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Main Hero Banner */}
        <div className="relative overflow-hidden rounded-3xl bg-[url('')] shadow-2xl">
          <div className="absolute inset-0 bg-black opacity-10"></div>
          <div className="absolute top-0 right-0 w-96 h-96 bg-white opacity-10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-white opacity-10 rounded-full translate-y-1/2 -translate-x-1/2"></div>
          
          <div className="relative z-10 px-8 py-16 md:px-16 md:py-20">
            <div className="flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="flex-1 text-white">
                <div className="flex items-center gap-2 mb-4">
                  <Sparkles className="w-6 h-6" />
                  <span className="text-sm font-semibold uppercase tracking-wider">Limited Time Offer</span>
                </div>
                <h1 className="text-5xl md:text-6xl font-bold mb-4 leading-tight">
                  Get 20% Off All Bags This Week!
                </h1>
                <p className="text-xl mb-8 text-pink-100">
                  Shop our premium collection of bags and save big. Don't miss out on this amazing deal!
                </p>
                <button className="bg-white text-pink-600 px-8 py-4 rounded-full font-bold text-lg hover:bg-pink-50 transition-all shadow-lg hover:shadow-xl flex items-center gap-2">
                  Shop Now
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
              
              <div className="flex-shrink-0">
                <div className="bg-white bg-opacity-20 backdrop-blur-lg rounded-2xl p-6 border-2 border-white border-opacity-30">
                  <div className="flex items-center gap-2 mb-4 text-white">
                    <Clock className="w-5 h-5" />
                    <span className="font-semibold">Offer Ends In:</span>
                  </div>
                  <div className="grid grid-cols-4 gap-4">
                    {[
                      { label: 'Days', value: timeLeft.days },
                      { label: 'Hours', value: timeLeft.hours },
                      { label: 'Mins', value: timeLeft.minutes },
                      { label: 'Secs', value: timeLeft.seconds }
                    ].map((item, idx) => (
                      <div key={idx} className="text-center">
                        <div className="bg-white text-pink-600 rounded-xl p-4 mb-2 font-bold text-3xl min-w-[70px]">
                          {String(item.value).padStart(2, '0')}
                        </div>
                        <div className="text-white text-sm font-semibold">{item.label}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DiscountPromoBanner;