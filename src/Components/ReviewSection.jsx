import React, { useState, useEffect } from 'react';
import { Star, ThumbsUp, User, ShieldCheck } from 'lucide-react';
import { addReview, getProductReviews, markReviewHelpful } from '../firebase/reviewServices';
import { useAuth } from '../Context/AuthContextCore';
import { useToast } from '../Context/ToastContext';

const ReviewSection = ({ productId }) => {
  const { currentUser } = useAuth();
  const toast = useToast();
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [reviewerName, setReviewerName] = useState('');
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (productId) {
      fetchReviews();
    }
  }, [productId]);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const data = await getProductReviews(productId);
      setReviews(data);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();

    if (!currentUser) {
      toast.warning('Please login to leave a review');
      return;
    }

    if (!reviewText.trim() || rating === 0) {
      toast.error('Please provide a rating and a comment');
      return;
    }

    setSubmitting(true);
    try {
      const reviewData = {
        rating,
        comment: reviewText,
        userName: reviewerName || currentUser.displayName || 'Anonymous',
        userEmail: currentUser.email,
        helpful: 0
      };

      const result = await addReview(productId, currentUser.uid, reviewData);

      if (result.success) {
        setSubmitted(true);
        setReviewText('');
        setRating(0);
        toast.success('Review submitted for moderation!');
      } else {
        toast.error('Failed to submit review');
      }
    } catch (error) {
      toast.error('An error occurred');
    } finally {
      setSubmitting(false);
    }
  };

  const averageRating = reviews.length > 0
    ? reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length
    : 0;

  const ratingDistribution = [5, 4, 3, 2, 1].map(star => {
    const count = reviews.filter(r => r.rating === star).length;
    return {
      star,
      count,
      percentage: reviews.length > 0 ? (count / reviews.length) * 100 : 0
    };
  });

  const handleHelpful = async (reviewId) => {
    if (!currentUser) {
      toast.warning('Please login to mark reviews as helpful');
      return;
    }

    try {
      const result = await markReviewHelpful(reviewId, currentUser.uid);
      if (result.success) {
        // Update the local state to reflect the new count and user's vote
        setReviews(reviews.map(r => {
          if (r.id === reviewId) {
            const helpfulUsers = r.helpfulUsers || [];
            const newHelpfulUsers = result.isHelpful
              ? [...helpfulUsers, currentUser.uid]
              : helpfulUsers.filter(id => id !== currentUser.uid);

            return {
              ...r,
              helpful: result.newCount,
              helpfulUsers: newHelpfulUsers
            };
          }
          return r;
        }));

        toast.success(result.isHelpful ? 'Marked as helpful!' : 'Removed helpful mark');
      } else {
        toast.error('Failed to update');
      }
    } catch (error) {
      toast.error('An error occurred');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-16 bg-white border-t border-gray-100">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Customer Feedback</h2>
          <p className="text-gray-500 mt-1">What our community thinks about this product</p>
        </div>

        {averageRating > 0 && (
          <div className="flex items-center gap-4 bg-gray-50 px-6 py-3 rounded-2xl border border-gray-100">
            <div className="text-3xl font-black text-gray-900">{averageRating.toFixed(1)}</div>
            <div className="space-y-1">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={16}
                    className={i < Math.round(averageRating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200'}
                  />
                ))}
              </div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{reviews.length} Verified Reviews</p>
            </div>
          </div>
        )}
      </div>

      <div className="grid lg:grid-cols-3 gap-12 mb-16">
        {/* Rating Summary */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-gray-50 p-8 rounded-3xl border border-gray-100">
            <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest mb-6 border-b border-gray-200 pb-2">Rating Breakdown</h3>
            <div className="space-y-4">
              {ratingDistribution.map(({ star, count, percentage }) => (
                <div key={star} className="flex items-center gap-4">
                  <span className="text-sm font-bold text-gray-600 w-10">{star} Star</span>
                  <div className="flex-1 bg-gray-200 h-2.5 rounded-full overflow-hidden">
                    <div
                      className="bg-yellow-400 h-full transition-all duration-500 rounded-full shadow-[0_0_10px_rgba(250,204,21,0.5)]"
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-bold text-gray-400 w-8 text-right">{count}</span>
                </div>
              ))}
            </div>

            <div className="mt-8 flex items-center gap-3 text-green-600 bg-green-50 p-4 rounded-xl">
              <ShieldCheck size={20} />
              <span className="text-xs font-bold uppercase tracking-tight">100% Verified Purchase Reviews</span>
            </div>
          </div>
        </div>

        {/* Write Review Form */}
        <div className="lg:col-span-2">
          {submitted ? (
            <div className="bg-pink-50 border-2 border-dashed border-pink-200 p-12 rounded-3xl text-center">
              <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Star size={32} className="text-pink-400 fill-pink-400" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Thank you for your feedback!</h3>
              <p className="text-gray-600 max-w-sm mx-auto">Your review has been submitted and is currently pending moderation. It will be visible once approved.</p>
              <button
                onClick={() => setSubmitted(false)}
                className="mt-8 text-pink-400 font-bold hover:underline uppercase tracking-widest text-sm"
              >
                Submit another review
              </button>
            </div>
          ) : (
            <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
              <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                Leave a Review
              </h3>

              <form onSubmit={handleSubmitReview} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest pl-1">Your Name</label>
                    <input
                      type="text"
                      value={reviewerName}
                      onChange={(e) => setReviewerName(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:border-pink-300 transition-all font-medium"
                      placeholder={currentUser?.displayName || "Enter your name"}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest pl-1">Overall Rating</label>
                    <div className="flex gap-2 h-12 items-center">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setRating(star)}
                          onMouseEnter={() => setHoverRating(star)}
                          onMouseLeave={() => setHoverRating(0)}
                          className="focus:outline-none transition-transform hover:scale-125"
                        >
                          <Star
                            size={28}
                            className={
                              star <= (hoverRating || rating)
                                ? 'text-yellow-400 fill-yellow-400'
                                : 'text-gray-200'
                            }
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest pl-1">Your Experience</label>
                  <textarea
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                    rows="4"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:border-pink-300 resize-none transition-all font-medium"
                    placeholder="Tell us what you loved about this product..."
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-gray-900 text-white py-4 rounded-xl font-bold hover:bg-gray-800 transition-all disabled:opacity-50 shadow-lg shadow-gray-200"
                >
                  {submitting ? 'Submitting...' : 'Post Verified Review'}
                </button>
              </form>
            </div>
          )}
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-12">
        <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
          Verified Purchase Reviews
          <span className="text-sm font-bold bg-pink-100 text-pink-500 px-3 py-1 rounded-full">{reviews.length}</span>
        </h3>

        {loading ? (
          <div className="py-12 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-300 mx-auto"></div>
          </div>
        ) : reviews.length === 0 ? (
          <div className="py-20 text-center bg-gray-50 rounded-3xl border-2 border-dashed border-gray-100">
            <User size={48} className="mx-auto text-gray-200 mb-4" />
            <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">No reviews yet. Be the first!</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-8">
            {reviews.map((review) => (
              <div key={review.id} className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-start gap-4 mb-6">
                  <div className="bg-pink-100 w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0">
                    <User size={24} className="text-pink-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-gray-900 truncate">{review.userName}</h4>
                      <div className="flex items-center gap-1 text-green-500 bg-green-50 px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-tighter">
                        <ShieldCheck size={10} /> Verified
                      </div>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            size={12}
                            className={i < review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200'}
                          />
                        ))}
                      </div>
                      <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{review.createdAt?.toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>

                <p className="text-gray-700 text-sm leading-relaxed mb-6 italic">
                  "{review.comment}"
                </p>

                <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                  <button
                    onClick={() => handleHelpful(review.id)}
                    className={`flex items-center gap-2 text-[10px] font-black uppercase tracking-widest transition-colors ${review.helpfulUsers?.includes(currentUser?.uid)
                        ? 'text-pink-500 hover:text-pink-600'
                        : 'text-gray-400 hover:text-pink-400'
                      }`}
                  >
                    <ThumbsUp
                      size={14}
                      fill={review.helpfulUsers?.includes(currentUser?.uid) ? 'currentColor' : 'none'}
                    />
                    Helpful ({review.helpful || 0})
                  </button>
                  <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest">LoveStory Official</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ReviewSection;
