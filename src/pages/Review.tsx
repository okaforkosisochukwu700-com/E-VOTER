import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Star, MessageSquare, Send, CheckCircle2, User, Clock } from "lucide-react";
import { Review, ApiResponse } from "../types";

export function ReviewPage() {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [author, setAuthor] = useState("");
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const response = await fetch("/api/reviews");
      const result: ApiResponse<Review[]> = await response.json();
      if (result.success && result.data) {
        setReviews(result.data);
      }
    } catch (error) {
      console.error("Failed to fetch reviews", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) return;

    setLoading(true);
    try {
      const response = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rating, comment, author })
      });
      const result: ApiResponse<Review> = await response.json();
      if (result.success) {
        setSubmitted(true);
        fetchReviews();
        // Reset form
        setRating(0);
        setComment("");
        setAuthor("");
      }
    } catch (error) {
      console.error("Failed to submit review", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Left Column: Form */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white rounded-[32px] p-8 md:p-12 shadow-xl border border-gray-100"
        >
          <h1 className="text-3xl font-black text-primary mb-2 tracking-tight">Voter Satisfaction</h1>
          <p className="text-sm text-gray-500 font-medium mb-8">
            Tell us about your experience with the Nigeria E-Voter Portal.
          </p>

          <AnimatePresence mode="wait">
            {submitted ? (
              <motion.div 
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="text-center py-12"
              >
                <div className="w-20 h-20 bg-[#E6F3EC] rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle2 className="w-10 h-10 text-primary" />
                </div>
                <h2 className="text-xl font-bold text-ng-text mb-2">Thank you for your feedback!</h2>
                <p className="text-sm text-gray-400 mb-8">Your review helps us improve the electoral process for all citizens.</p>
                <motion.button 
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSubmitted(false)}
                  className="px-8 py-3 bg-primary text-white font-bold rounded-xl shadow-md"
                >
                  Write Another Review
                </motion.button>
              </motion.div>
            ) : (
              <motion.form 
                key="form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                onSubmit={handleSubmit} 
                className="space-y-6"
              >
                <div className="space-y-3">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">How would you rate the portal?</label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        className="transition-transform active:scale-90"
                      >
                        <Star 
                          className={`w-8 h-8 ${
                            (hoverRating || rating) >= star 
                              ? "fill-yellow-400 text-yellow-400" 
                              : "text-gray-200"
                          } transition-colors`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">Full Name (Optional)</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
                    <input 
                      type="text" 
                      value={author}
                      onChange={(e) => setAuthor(e.target.value)}
                      placeholder="Enter your name"
                      className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-transparent rounded-xl focus:bg-white focus:border-primary transition-all text-sm font-medium"
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">Detailed Feedback</label>
                  <div className="relative">
                    <MessageSquare className="absolute left-4 top-4 w-4 h-4 text-gray-300" />
                    <textarea 
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder="Tell us what you liked or how we can improve..."
                      rows={4}
                      className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-transparent rounded-xl focus:bg-white focus:border-primary transition-all text-sm font-medium resize-none"
                    />
                  </div>
                </div>

                <motion.button 
                  whileTap={{ scale: 0.98 }}
                  disabled={rating === 0 || loading}
                  className="w-full py-5 bg-primary text-white font-black rounded-2xl shadow-xl shadow-primary/20 flex items-center justify-center gap-3 uppercase tracking-[0.2em] text-sm disabled:opacity-50"
                  type="submit"
                >
                  <Send className="w-4 h-4" />
                  {loading ? "SUBMITTING..." : "SUBMIT REVIEW"}
                </motion.button>
              </motion.form>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Right Column: Reviews List */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-6"
        >
          <div className="flex items-center justify-between">
            <h2 className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">Public Community Feedback</h2>
            <div className="px-3 py-1 bg-[#E6F3EC] text-primary text-[10px] font-black rounded-full uppercase tracking-widest">
              Live Feed
            </div>
          </div>

          {reviews.length > 0 && (
            <div className="bg-primary/5 p-6 rounded-3xl border border-primary/10 flex items-center justify-between">
              <div>
                <p className="text-[10px] font-bold text-primary uppercase tracking-widest mb-1">Average Satisfaction</p>
                <div className="flex items-center gap-2">
                  <span className="text-3xl font-black text-primary">
                    {(reviews.reduce((acc, curr) => acc + curr.rating, 0) / reviews.length).toFixed(1)}
                  </span>
                  <div className="flex gap-0.5">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star 
                        key={s} 
                        className={`w-4 h-4 ${s <= Math.round(reviews.reduce((acc, curr) => acc + curr.rating, 0) / reviews.length) ? "fill-yellow-400 text-yellow-400" : "text-gray-200"}`} 
                      />
                    ))}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Total Reviews</p>
                <p className="text-xl font-black text-ng-text">{reviews.length}</p>
              </div>
            </div>
          )}

          <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
            {reviews.length === 0 ? (
              <div className="p-8 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-100 text-center">
                <MessageSquare className="w-8 h-8 text-gray-300 mx-auto mb-3" />
                <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">No reviews yet. Be the first!</p>
              </div>
            ) : (
              reviews.map((review) => (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  key={review.id}
                  className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-gray-400">
                        <User className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-ng-text">{review.author || "Anonymous Voter"}</p>
                        <div className="flex gap-0.5">
                          {[1, 2, 3, 4, 5].map((s) => (
                            <Star 
                              key={s} 
                              className={`w-3 h-3 ${s <= review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-200"}`} 
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 text-[9px] text-gray-400 font-bold uppercase tracking-widest">
                      <Clock className="w-3 h-3" />
                      {new Date(review.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 font-medium leading-relaxed italic">
                    "{review.comment}"
                  </p>
                </motion.div>
              ))
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
