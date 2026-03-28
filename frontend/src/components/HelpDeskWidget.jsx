import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star } from 'lucide-react';

const CALUM_IMAGE = "/calum-dragon.png";
const BETA_BUBBLE_KEY = 'recalibrate_beta_bubble_dismissed';

export default function HelpDeskWidget() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [feedbackType, setFeedbackType] = useState('help');
  const [message, setMessage] = useState('');
  const [email, setEmail] = useState('');
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [showBetaBubble, setShowBetaBubble] = useState(false);

  const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || window.location.origin;

  useEffect(() => {
    const dismissed = localStorage.getItem(BETA_BUBBLE_KEY);
    if (!dismissed) {
      const t = setTimeout(() => setShowBetaBubble(true), 1800);
      return () => clearTimeout(t);
    }
  }, []);

  const dismissBetaBubble = (e) => {
    e.stopPropagation();
    setShowBetaBubble(false);
    localStorage.setItem(BETA_BUBBLE_KEY, 'true');
  };

  const handleExpand = () => {
    setShowBetaBubble(false);
    setIsExpanded(true);
  };

  const handleClose = () => {
    setIsExpanded(false);
    setSubmitted(false);
    setMessage('');
    setEmail('');
    setRating(0);
    setHoverRating(0);
    setFeedbackType('help');
    if (!localStorage.getItem(BETA_BUBBLE_KEY)) {
      setTimeout(() => setShowBetaBubble(true), 400);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await fetch(`${BACKEND_URL}/api/feedback/anonymous`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: feedbackType,
          message,
          email: email || undefined,
          rating: rating || undefined,
          page: window.location.pathname,
          user_agent: navigator.userAgent,
          screen_resolution: `${window.screen.width}x${window.screen.height}`,
          timestamp: new Date().toISOString(),
          app_version: 'website-beta'
        })
      });
      setSubmitted(true);
      setTimeout(() => handleClose(), 3000);
    } catch {
      setSubmitted(true);
      setTimeout(() => handleClose(), 2000);
    } finally {
      setIsSubmitting(false);
    }
  };

  const feedbackTypes = [
    { value: 'help', label: 'Help', icon: '❓', color: 'bg-blue-500' },
    { value: 'bug', label: 'Bug', icon: '🐛', color: 'bg-red-500' },
    { value: 'feature', label: 'Feature', icon: '💡', color: 'bg-green-500' },
    { value: 'general', label: 'Feedback', icon: '💬', color: 'bg-purple-500' }
  ];

  const getPlaceholder = () => {
    switch (feedbackType) {
      case 'help': return "What do you need help with?";
      case 'bug': return "Describe the bug you found...";
      case 'feature': return "What feature would improve your experience?";
      default: return "Share your thoughts...";
    }
  };

  const starLabels = ['', 'Poor', 'Fair', 'Good', 'Great', 'Excellent'];

  return (
    <div className="fixed bottom-5 right-6 z-40 flex flex-col items-end" data-testid="helpdesk-widget">
      <AnimatePresence>
        {showBetaBubble && !isExpanded && (
          <motion.div
            className="mb-2"
            initial={{ opacity: 0, scale: 0.85, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: 8 }}
            transition={{ type: 'spring', stiffness: 340, damping: 26 }}
            style={{ transformOrigin: '100% 100%' }}
          >
            <div className="relative bg-white border border-violet-200 rounded-2xl px-3.5 py-2.5 shadow-lg shadow-violet-100/50 min-w-[152px]">
              <div className="flex items-center gap-1.5 mb-0.5">
                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-violet-600 text-white text-[10px] font-bold rounded-md tracking-wide leading-none">
                  <span className="w-1.5 h-1.5 bg-white/80 rounded-full animate-pulse inline-block" />
                  BETA
                </span>
              </div>
              <p className="text-[12px] font-semibold text-gray-800 leading-tight">We are in Beta</p>
              <p className="text-[11px] text-gray-500 leading-tight mt-0.5">Your feedback shapes the app</p>
              <div className="absolute -bottom-[7px] right-4 w-3.5 h-3.5 bg-white border-r border-b border-violet-200 rotate-45 rounded-br-sm" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {!isExpanded ? (
          <motion.button
            key="avatar"
            onClick={handleExpand}
            aria-label="Help & Feedback"
            title="Chat with Calum"
            initial={{ opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            whileHover={{ scale: 1.07 }}
            whileTap={{ scale: 0.93 }}
            className="relative"
            data-testid="helpdesk-avatar-btn"
          >
            <div className={`w-14 h-14 rounded-full shadow-lg border-2 overflow-hidden transition-all duration-300 ${showBetaBubble ? 'border-violet-400 ring-2 ring-violet-300/50 ring-offset-1' : 'border-white'}`}>
              <img src={CALUM_IMAGE} alt="Calum the Dragon" className="w-full h-full object-cover" />
            </div>
            <div className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
              <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
            </div>
          </motion.button>
        ) : (
          <motion.div
            key="panel"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.18 }}
            style={{ transformOrigin: 'bottom right' }}
            className="bg-white rounded-2xl shadow-2xl border border-gray-200 w-80 overflow-hidden"
            data-testid="helpdesk-panel"
          >
            <div className="bg-gradient-to-r from-violet-500 to-purple-600 p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-full overflow-hidden border-2 border-white/30">
                    <img src={CALUM_IMAGE} alt="Calum" className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold">Calum</h3>
                    <p className="text-white/70 text-xs">Your Support Dragon</p>
                  </div>
                </div>
                <button onClick={handleClose} className="text-white/70 hover:text-white p-1.5 rounded-lg hover:bg-white/10 transition-colors" data-testid="helpdesk-close-btn">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="mt-3 bg-white/15 backdrop-blur rounded-xl p-3">
                <p className="text-white text-sm">
                  {submitted ? "Thanks! I'll make sure the team sees this right away!" : "Hey there! How can I help you today?"}
                </p>
              </div>
            </div>

            <div className="p-4">
              {submitted ? (
                <motion.div className="text-center py-4" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                  <div className="text-4xl mb-2">✉️</div>
                  <div className="text-base font-semibold text-gray-900 mb-1">Message Sent!</div>
                  <div className="text-sm text-gray-500">We'll get back to you soon.</div>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-3" data-testid="helpdesk-form">
                  {feedbackType === 'general' && (
                    <div>
                      <p className="text-xs font-medium text-gray-500 mb-1.5">Rate your experience</p>
                      <div className="flex items-center gap-0.5">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setRating(star === rating ? 0 : star)}
                            onMouseEnter={() => setHoverRating(star)}
                            onMouseLeave={() => setHoverRating(0)}
                            className="p-0.5 transition-transform hover:scale-110 active:scale-95"
                            data-testid={`star-${star}`}
                          >
                            <Star className={`w-6 h-6 transition-all duration-100 ${star <= (hoverRating || rating) ? 'fill-amber-400 text-amber-400 drop-shadow-sm' : 'fill-transparent text-gray-300'}`} />
                          </button>
                        ))}
                        {(hoverRating || rating) > 0 && (
                          <motion.span key={hoverRating || rating} initial={{ opacity: 0, x: -4 }} animate={{ opacity: 1, x: 0 }} className="text-xs text-amber-600 font-medium ml-1.5">
                            {starLabels[hoverRating || rating]}
                          </motion.span>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="flex flex-wrap gap-1.5">
                    {feedbackTypes.map((type) => (
                      <button
                        key={type.value}
                        type="button"
                        onClick={() => {
                          setFeedbackType(type.value);
                          if (type.value !== 'general') { setRating(0); setHoverRating(0); }
                        }}
                        className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium transition-all ${feedbackType === type.value ? `${type.color} text-white shadow` : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                        data-testid={`feedback-type-${type.value}`}
                      >
                        <span>{type.icon}</span>
                        <span>{type.label}</span>
                      </button>
                    ))}
                  </div>

                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder={getPlaceholder()}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm resize-none focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent focus:bg-white transition-all"
                    rows={3}
                    required
                    data-testid="feedback-message"
                  />

                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email for follow-up (optional)"
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent focus:bg-white transition-all"
                    data-testid="feedback-email"
                  />

                  <button
                    type="submit"
                    disabled={!message.trim() || isSubmitting}
                    className="w-full bg-gradient-to-r from-violet-500 to-purple-600 text-white py-2.5 rounded-xl text-sm font-medium hover:from-violet-600 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    data-testid="feedback-submit-btn"
                  >
                    {isSubmitting ? (
                      <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Sending...</>
                    ) : 'Send Message'}
                  </button>
                </form>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
