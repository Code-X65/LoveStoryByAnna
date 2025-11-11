import React, { useState } from 'react';
import { Star, ThumbsUp, User } from 'lucide-react';

const ReviewSection = ({ productId }) => {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [reviewerName, setReviewerName] = useState('');
  const [reviews, setReviews] = useState([
    {
      id: 1,
      name: "John Doe",
      rating: 5,
      date: "2024-10-15",
      review: "Amazing quality! The fabric is soft and the print is vibrant. Highly recommend!",
      helpful: 12
    },
    {
      id: 2,
      name: "Sarah Johnson",
      rating: 4,
      date: "2024-10-10",
      review: "Good product overall. Fits well and looks great. Delivery was fast.",
      helpful: 8
    },
    {
      id: 3,
      name: "Michael Brown",
      rating: 5,
      date: "2024-10-05",
      review: "Excellent purchase! Worth every penny. The colors are even better in person.",
      helpful: 15
    }
  ]);

  const handleSubmitReview = (e) => {
    e.preventDefault();
    
    if (!reviewerName.trim() || !reviewText.trim() || rating === 0) {
      alert('Please fill in all fields and select a rating');
      return;
    }

    const newReview = {
      id: reviews.length + 1,
      name: reviewerName,
      rating: rating,
      date: new Date().toISOString().split('T')[0],
      review: reviewText,
      helpful: 0
    };

    setReviews([newReview, ...reviews]);
    
    // Reset form
    setReviewText('');
    setReviewerName('');
    setRating(0);
    
    alert('Review submitted successfully!');
  };

  const handleHelpful = (reviewId) => {
    setReviews(reviews.map(review => 
      review.id === reviewId 
        ? { ...review, helpful: review.helpful + 1 }
        : review
    ));
  };

  const averageRating = reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length;
  
  const ratingDistribution = [5, 4, 3, 2, 1].map(star => ({
    star,
    count: reviews.filter(r => r.rating === star).length,
    percentage: (reviews.filter(r => r.rating === star).length / reviews.length) * 100
  }));

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 bg-white">
      <h2 className="text-2xl font-bold text-gray-900 mb-8">Customer Reviews</h2>

      <div className="grid lg:grid-cols-3 gap-8 mb-12">
        {/* Rating Summary */}
        <div className="lg:col-span-1 bg-gray-50 p-6 border border-gray-200">
          <div className="text-center mb-6">
            <div className="text-5xl font-bold text-gray-900 mb-2">
              {averageRating.toFixed(1)}
            </div>
            <div className="flex justify-center mb-2">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={20}
                  className={i < Math.round(averageRating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}
                />
              ))}
            </div>
            <p className="text-sm text-gray-600">{reviews.length} reviews</p>
          </div>

          {/* Rating Distribution */}
          <div className="space-y-2">
            {ratingDistribution.map(({ star, count, percentage }) => (
              <div key={star} className="flex items-center gap-2">
                <span className="text-sm text-gray-700 w-8">{star} ★</span>
                <div className="flex-1 bg-gray-200 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-yellow-400 h-full transition-all"
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>
                <span className="text-sm text-gray-600 w-8">{count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Write Review Form */}
        <div className="lg:col-span-2">
          <div className="bg-gray-50 p-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Write a Review</h3>
            
            <form onSubmit={handleSubmitReview} className="space-y-4">
              {/* Name Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your Name
                </label>
                <input
                  type="text"
                  value={reviewerName}
                  onChange={(e) => setReviewerName(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 focus:outline-none focus:border-pink-300"
                  placeholder="Enter your name"
                />
              </div>

              {/* Rating */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your Rating
                </label>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      className="focus:outline-none"
                    >
                      <Star
                        size={28}
                        className={
                          star <= (hoverRating || rating)
                            ? 'text-yellow-400 fill-yellow-400'
                            : 'text-gray-300'
                        }
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Review Text */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your Review
                </label>
                <textarea
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  rows="4"
                  className="w-full px-4 py-2 border border-gray-300 focus:outline-none focus:border-pink-300 resize-none"
                  placeholder="Share your experience with this product..."
                ></textarea>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full bg-pink-300 text-white py-3 font-semibold hover:bg-pink-400 transition-colors"
              >
                Submit Review
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">All Reviews</h3>
        
        {reviews.map((review) => (
          <div key={review.id} className="border-b border-gray-200 pb-6 last:border-0">
            <div className="flex items-start gap-4">
              {/* Avatar */}
              <div className="bg-pink-100 rounded-full p-3 flex-shrink-0">
                <User size={24} className="text-pink-300" />
              </div>

              {/* Review Content */}
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <h4 className="font-semibold text-gray-900">{review.name}</h4>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            size={14}
                            className={i < review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}
                          />
                        ))}
                      </div>
                      <span className="text-sm text-gray-500">{review.date}</span>
                    </div>
                  </div>
                </div>

                <p className="text-gray-700 text-sm leading-relaxed mb-3">
                  {review.review}
                </p>

                {/* Helpful Button */}
                <button
                  onClick={() => handleHelpful(review.id)}
                  className="flex items-center gap-2 text-sm text-gray-600 hover:text-pink-300 transition-colors"
                >
                  <ThumbsUp size={16} />
                  <span>Helpful ({review.helpful})</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReviewSection;