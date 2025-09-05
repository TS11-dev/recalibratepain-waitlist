import React, { useState, useEffect, useCallback } from 'react';
import { 
  Heart, Brain, Activity, Shield, Target, Smartphone,
  TrendingUp, Award, Globe, CheckCircle, ArrowRight, Sparkles,
  BarChart3, Calendar, Users, BookOpen, Bell, Play,
  Zap, Settings, Eye, MessageCircle, Mail, ExternalLink,
  MapPin, Phone, Clock, ChevronDown, ChevronUp, Star, AlertTriangle
} from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

// Error Boundary Component for Enterprise Error Handling
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center p-8">
            <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Something went wrong</h2>
            <p className="text-gray-600 mb-4">We're sorry, but something unexpected happened.</p>
            <button 
              onClick={() => window.location.reload()} 
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

function App() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [subscribers, setSubscribers] = useState(184);
  const [openFaq, setOpenFaq] = useState(null);
  const [showContactModal, setShowContactModal] = useState(false);
  const [isVisible, setIsVisible] = useState({});
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Use environment variable for backend URL with fallback
  const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || window.location.origin;
  console.log('🌐 Backend URL:', BACKEND_URL);

  // Email validation utility
  const isValidEmail = useCallback((email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email) && email.length <= 254; // RFC 5321 limit
  }, []);

  // Input sanitization
  const sanitizeInput = useCallback((input) => {
    return input.trim().replace(/[<>&"]/g, (char) => {
      const entities = { '<': '&lt;', '>': '&gt;', '&': '&amp;', '"': '&quot;' };
      return entities[char] || char;
    });
  }, []);

  // Fetch subscriber count function - defined early
  const fetchSubscriberCount = useCallback(async () => {
    try {
      console.log('🔄 Fetching subscriber count from:', `${BACKEND_URL}/api/waitlist/count`);
      const response = await fetch(`${BACKEND_URL}/api/waitlist/count?t=${Date.now()}&cache=${Math.random()}`, {
        method: 'GET',
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0',
          'If-Modified-Since': 'Mon, 01 Jan 1990 00:00:00 GMT'
        },
        signal: AbortSignal.timeout(10000)
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log('✅ API Response:', data);
        setSubscribers(data.count);
        console.log('✅ Subscriber count updated to:', data.count);
      } else {
        console.log('❌ API response not ok:', response.status);
      }
    } catch (error) {
      if (error.name !== 'AbortError') {
        console.log('❌ Network error fetching count:', error.message);
      }
    }
  }, [BACKEND_URL]);

  // Smooth scroll function
  const smoothScroll = useCallback((targetId) => {
    const element = document.getElementById(targetId);
    element?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, []);

  // Fetch current subscriber count on load - more frequent updates
  useEffect(() => {
    fetchSubscriberCount();
    // Update count every 10 seconds instead of 30
    const countInterval = setInterval(fetchSubscriberCount, 10000);
    return () => clearInterval(countInterval);
  }, [fetchSubscriberCount]);

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    
    const sanitizedEmail = sanitizeInput(email);
    
    if (!isValidEmail(sanitizedEmail)) {
      toast.error('Please enter a valid email address', {
        id: 'email-error',
        duration: 4000,
      });
      return;
    }

    setLoading(true);
    
    try {
      const response = await fetch(`${BACKEND_URL}/api/waitlist/join`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Cache-Control': 'no-cache'
        },
        body: JSON.stringify({
          name: "Website Subscriber", 
          email: sanitizedEmail.toLowerCase()
        }),
        signal: AbortSignal.timeout(15000)
      });

      if (response.ok) {
        const data = await response.json();
        
        // Only show success if the backend actually reports success
        if (data.success) {
          toast.success('🚀 Welcome to the future of pain management!', { 
            id: 'success',
            duration: 5000
          });
          
          // Update local count immediately and fetch fresh count
          setSubscribers(data.total_subscribers || subscribers + 1);
          setEmail('');
          
          // Force fresh count update after successful submission
          setTimeout(() => {
            fetchSubscriberCount();
          }, 1000);
          
          console.log('✅ Email submitted successfully:', sanitizedEmail);
          console.log('✅ New subscriber count:', data.total_subscribers);
        } else {
          // Backend returned 200 but with success: false
          toast.error(data.message || 'Failed to join waitlist. Please try again.', {
            id: 'backend-error',
            duration: 4000,
          });
          console.log('❌ Backend reported failure:', data.message);
        }
      } else {
        const errorData = await response.text();
        console.log('❌ Submission failed:', response.status, errorData);
        
        // Show proper error message instead of fake success
        toast.error('Failed to join waitlist. Please check your connection and try again.', {
          id: 'network-error',
          duration: 4000,
        });
      }
    } catch (error) {
      console.log('❌ Email submission error:', error.message);
      
      if (error.name === 'AbortError') {
        toast.error('Request timed out. Please try again.', { id: 'timeout' });
      } else {
        // Show proper error message instead of fake success
        toast.error('Network error. Please check your connection and try again.', {
          id: 'network-error',
          duration: 4000,
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const faqs = [
    {
      question: "When will the Recalibrate app be available?",
      answer: "We're launching across Google Play, iOS App Store, and web platforms in Q4 2025. Join our waitlist to get exclusive early access when we launch."
    },
    {
      question: "What devices and platforms will be supported?",
      answer: "Recalibrate will be available on iOS, Android, and as a web application. This ensures you can access your health data and tools from any device, anywhere."
    },
    {
      question: "How does the AI-powered pain tracking work?",
      answer: "Our advanced algorithms analyze patterns in your symptom reports, daily activities, and health metrics to identify triggers, predict flare-ups, and suggest personalized management strategies."
    },
    {
      question: "Is my health data private and secure?",
      answer: "Absolutely. We use enterprise-grade encryption and comply with all healthcare privacy regulations. Your data belongs to you, and we never share it without your explicit consent."
    },
    {
      question: "How does the healthcare provider integration work?",
      answer: "Healthcare providers can securely access your progress data (with your permission) to make more informed care decisions. This creates a collaborative management approach while keeping you in control."
    },
    {
      question: "What makes Recalibrate different from other health apps?",
      answer: "We're the first platform to combine multi-system health tracking, AI pattern recognition, evidence-based education, and seamless clinical integration in one comprehensive solution."
    }
  ];

  // Intersection Observer for scroll animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(prev => ({
              ...prev,
              [entry.target.id]: true
            }));
          }
        });
      },
      { threshold: 0.1 }
    );

    // Observe all sections with slight delay to prevent rapid state updates
    const timer = setTimeout(() => {
      const sections = document.querySelectorAll('[data-animate]');
      sections.forEach(section => observer.observe(section));
    }, 100);

    return () => {
      clearTimeout(timer);
      observer.disconnect();
    };
  }, []);

  // Keyboard navigation support and mobile menu handling
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        if (showContactModal) {
          setShowContactModal(false);
        }
        if (mobileMenuOpen) {
          setMobileMenuOpen(false);
        }
      }
    };

    const handleClickOutside = (event) => {
      if (mobileMenuOpen && !event.target.closest('nav')) {
        setMobileMenuOpen(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('click', handleClickOutside);
    
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('click', handleClickOutside);
    };
  }, [showContactModal, mobileMenuOpen]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (showContactModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showContactModal]);

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/40 overflow-x-hidden">
        <Toaster position="top-center" />
        
        {/* Floating Background Elements - Optimized */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
          <div className="floating-orb orb-1"></div>
          <div className="floating-orb orb-2"></div>
          <div className="floating-orb orb-3"></div>
        </div>
        
        {/* Navigation - Fixed Issues */}
        <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200/50" role="navigation" aria-label="Main navigation">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <img 
                  src="/recalibrate-logo.png" 
                  alt="Recalibrate logo" 
                  className="w-10 h-10 object-contain"
                />
                <span className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-purple-600 bg-clip-text text-transparent">
                  Recalibrate
                </span>
              </div>
              
              {/* Mobile Menu Button */}
              <button 
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 rounded-lg hover:bg-white/20 transition-colors focus:outline-none focus:ring-2 focus:ring-white text-white"
                aria-label="Toggle menu"
                aria-expanded={mobileMenuOpen}
              >
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {mobileMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
              
              {/* Desktop Menu */}
              <div className="hidden md:flex items-center space-x-6">
                <button 
                  onClick={() => smoothScroll('features')} 
                  className="text-white hover:text-blue-200 font-medium transition-colors duration-200 px-3 py-2 rounded-lg hover:bg-white/20"
                  aria-label="Go to features section"
                >
                  Features
                </button>
                <button 
                  onClick={() => smoothScroll('ecosystem')} 
                  className="text-white hover:text-blue-200 font-medium transition-colors duration-200 px-3 py-2 rounded-lg hover:bg-white/20"
                  aria-label="Go to ecosystem section"
                >
                  Ecosystem
                </button>
                <button 
                  onClick={() => setShowContactModal(true)} 
                  className="bg-white text-purple-600 px-6 py-2 rounded-full font-medium hover:shadow-lg hover:bg-blue-50 transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2"
                  aria-label="Open contact information"
                >
                  Contact
                </button>
              </div>
            </div>
          </div>
          
          {/* Mobile Menu Dropdown */}
          {mobileMenuOpen && (
            <div className="md:hidden bg-gradient-to-r from-blue-600 to-purple-600 border-t border-blue-400 shadow-lg">
              <div className="px-4 py-2 space-y-2">
                <button 
                  onClick={() => {
                    smoothScroll('features');
                    setMobileMenuOpen(false);
                  }} 
                  className="block w-full text-left px-4 py-3 text-white hover:text-blue-200 hover:bg-white/20 rounded-lg font-medium transition-colors"
                >
                  Features
                </button>
                <button 
                  onClick={() => {
                    smoothScroll('ecosystem');
                    setMobileMenuOpen(false);
                  }} 
                  className="block w-full text-left px-4 py-3 text-white hover:text-blue-200 hover:bg-white/20 rounded-lg font-medium transition-colors"
                >
                  Ecosystem
                </button>
                <button 
                  onClick={() => {
                    setShowContactModal(true);
                    setMobileMenuOpen(false);
                  }} 
                  className="block w-full text-left px-4 py-3 bg-white text-purple-600 rounded-lg font-medium hover:bg-blue-50 transition-all"
                >
                  Contact
                </button>
              </div>
            </div>
          )}
        </nav>

        {/* Contact Modal - Enhanced Accessibility */}
        {showContactModal && (
          <div 
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm"
            role="dialog"
            aria-modal="true"
            aria-labelledby="contact-modal-title"
            onClick={(e) => e.target === e.currentTarget && setShowContactModal(false)}
          >
            <div className="bg-white rounded-2xl max-w-4xl mx-4 max-h-[90vh] overflow-y-auto shadow-2xl">
              <div className="p-6 sm:p-8">
                <div className="flex justify-between items-center mb-6">
                  <h2 id="contact-modal-title" className="text-2xl sm:text-3xl font-bold text-gray-900">Get in Touch</h2>
                  <button 
                    onClick={() => setShowContactModal(false)}
                    className="text-gray-400 hover:text-gray-600 p-2 rounded-lg hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500"
                    aria-label="Close contact modal"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mb-8">
                  Have questions about Recalibrate? We're here to help.
                </p>

                {/* Contact Info - Fixed Spacing */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-8">
                  <div className="text-center p-4 rounded-xl hover:bg-gray-50 transition-colors">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-3">
                      <Mail className="w-6 h-6 text-white" aria-hidden="true" />
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2">Email Us</h3>
                    <a 
                      href="mailto:info@recalibratepain.com" 
                      className="text-purple-600 hover:text-purple-700 font-medium transition-colors duration-200 text-sm sm:text-base"
                      aria-label="Send email to info@recalibratepain.com"
                    >
                      info@recalibratepain.com
                    </a>
                  </div>
                  <div className="text-center p-4 rounded-xl hover:bg-gray-50 transition-colors">
                    <div className="w-12 h-12 bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl flex items-center justify-center mx-auto mb-3">
                      <MapPin className="w-6 h-6 text-white" aria-hidden="true" />
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2">Location</h3>
                    <p className="text-gray-600 text-sm sm:text-base">Remote-First Team</p>
                  </div>
                  <div className="text-center p-4 rounded-xl hover:bg-gray-50 transition-colors">
                    <div className="w-12 h-12 bg-gradient-to-r from-orange-600 to-red-600 rounded-xl flex items-center justify-center mx-auto mb-3">
                      <Clock className="w-6 h-6 text-white" aria-hidden="true" />
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2">Response Time</h3>
                    <p className="text-gray-600 text-sm sm:text-base">Within 24 hours</p>
                  </div>
                </div>

                {/* FAQ Section - Enhanced */}
                <div>
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h3>
                  <div className="space-y-3">
                    {faqs.map((faq, index) => (
                      <div key={index} className="bg-gray-50 border border-gray-200 rounded-xl hover:border-purple-200 transition-colors">
                        <button
                          onClick={() => setOpenFaq(openFaq === index ? null : index)}
                          className="w-full px-4 sm:px-6 py-4 text-left flex items-center justify-between hover:bg-gray-100 transition-colors duration-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-inset"
                          aria-expanded={openFaq === index}
                          aria-controls={`faq-answer-${index}`}
                        >
                          <span className="font-semibold text-gray-900 text-sm sm:text-base pr-4">{faq.question}</span>
                          {openFaq === index ? (
                            <ChevronUp className="w-5 h-5 text-purple-600 flex-shrink-0" aria-hidden="true" />
                          ) : (
                            <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" aria-hidden="true" />
                          )}
                        </button>
                        {openFaq === index && (
                          <div 
                            id={`faq-answer-${index}`}
                            className="px-4 sm:px-6 pb-4 text-gray-600 leading-relaxed text-sm sm:text-base"
                            role="region"
                            aria-label="FAQ answer"
                          >
                            {faq.answer}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Hero Section - Optimized Spacing */}
        <section className="pt-20 sm:pt-24 pb-12 sm:pb-16 px-4 sm:px-6" role="banner">
          <div className="max-w-7xl mx-auto">
            <div className="text-center">
              {/* Launch Announcement */}
              <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-100 to-purple-100 border border-blue-200 rounded-full px-4 sm:px-6 py-2 sm:py-3 mb-6 sm:mb-8" role="status" aria-label="App launch status">
                <Sparkles className="w-4 sm:w-5 h-4 sm:h-5 text-purple-600" aria-hidden="true" />
                <span className="text-xs sm:text-sm font-semibold text-gray-700">Launching on Google Play, iOS & Web</span>
                <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full">Coming Soon</span>
              </div>

              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-4 sm:mb-6">
                <span className="bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 bg-clip-text text-transparent">
                  Welcome to
                </span>
                <br />
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Recalibrate
                </span>
              </h1>
              
              <p className="text-lg sm:text-xl md:text-2xl text-gray-600 mb-6 sm:mb-8 max-w-3xl mx-auto px-4">
                Your intelligent health and pain management companion
              </p>
              
              <p className="text-base sm:text-lg text-gray-500 mb-8 sm:mb-12 max-w-4xl mx-auto leading-relaxed px-4">
                Track symptoms, learn from pain science, build your care team, use our built-in therapeutic tools 
                and get AI-powered insights to personalize your pain management and live a better life.
              </p>

              {/* Platform Badges - Fixed Mobile Layout */}
              <div className="flex flex-wrap justify-center gap-3 sm:gap-4">
                <div className="flex items-center space-x-2 bg-white border border-gray-200 rounded-xl px-3 sm:px-4 py-2 sm:py-3 shadow-sm hover:shadow-md transition-shadow">
                  <Smartphone className="w-4 sm:w-5 h-4 sm:h-5 text-blue-600" aria-hidden="true" />
                  <span className="font-medium text-gray-700 text-sm sm:text-base">iOS App</span>
                </div>
                <div className="flex items-center space-x-2 bg-white border border-gray-200 rounded-xl px-3 sm:px-4 py-2 sm:py-3 shadow-sm hover:shadow-md transition-shadow">
                  <Play className="w-4 sm:w-5 h-4 sm:h-5 text-green-600" aria-hidden="true" />
                  <span className="font-medium text-gray-700 text-sm sm:text-base">Google Play</span>
                </div>
                <div className="flex items-center space-x-2 bg-white border border-gray-200 rounded-xl px-3 sm:px-4 py-2 sm:py-3 shadow-sm hover:shadow-md transition-shadow">
                  <Globe className="w-4 sm:w-5 h-4 sm:h-5 text-purple-600" aria-hidden="true" />
                  <span className="font-medium text-gray-700 text-sm sm:text-base">Web App</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Core Features - Fixed Spacing */}
        <section id="features" className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 bg-white" data-animate role="main" aria-labelledby="features-title">
          <div className="max-w-7xl mx-auto">
            <div className={`text-center mb-12 sm:mb-16 transition-all duration-1000 ${isVisible.features ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              <h2 id="features-title" className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6">
                <span className="bg-gradient-to-r from-gray-900 to-purple-600 bg-clip-text text-transparent">
                  Revolutionary Pain Management
                </span>
              </h2>
              <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto px-4">
                Experience the world's first AI-powered, multi-system health and pain management platform. 
                Comprehensive insights, personalized approaches, and evidence-based care - all in one place.
              </p>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
              {[
                {
                  icon: Brain,
                  title: "AI Pattern Recognition",
                  description: "Advanced algorithms identify pain patterns using machine learning.",
                  gradient: "from-blue-50 to-blue-100",
                  border: "border-blue-200",
                  iconBg: "from-blue-600 to-blue-700"
                },
                {
                  icon: Activity,
                  title: "Multi-System Tracking",
                  description: "Monitor 8 interconnected health systems for comprehensive insights.",
                  gradient: "from-purple-50 to-purple-100",
                  border: "border-purple-200",
                  iconBg: "from-purple-600 to-purple-700"
                },
                {
                  icon: Shield,
                  title: "Clinical Integration",
                  description: "Seamless provider collaboration with evidence-based protocols.",
                  gradient: "from-green-50 to-green-100",
                  border: "border-green-200",
                  iconBg: "from-green-600 to-green-700"
                },
                {
                  icon: Target,
                  title: "Personalized Care",
                  description: "Comprehensive management approaches based on individual patterns.",
                  gradient: "from-orange-50 to-orange-100",
                  border: "border-orange-200",
                  iconBg: "from-orange-600 to-orange-700"
                },
                {
                  icon: BarChart3,
                  title: "Advanced Analytics",
                  description: "Weighted scoring algorithms provide actionable health insights.",
                  gradient: "from-indigo-50 to-indigo-100",
                  border: "border-indigo-200",
                  iconBg: "from-indigo-600 to-indigo-700"
                },
                {
                  icon: TrendingUp,
                  title: "Predictive Insights",
                  description: "AI-powered pattern recognition enables proactive care strategies.",
                  gradient: "from-teal-50 to-teal-100",
                  border: "border-teal-200",
                  iconBg: "from-teal-600 to-teal-700"
                }
              ].map((feature, index) => (
                <div 
                  key={index} 
                  className={`bg-gradient-to-br ${feature.gradient} rounded-lg sm:rounded-xl lg:rounded-2xl p-3 sm:p-4 lg:p-6 border ${feature.border} hover:shadow-lg transition-all duration-300 hover:scale-105 focus-within:ring-2 focus-within:ring-purple-500 h-full flex flex-col`}
                  role="article"
                  aria-labelledby={`feature-title-${index}`}
                >
                  <div className={`w-10 sm:w-12 lg:w-14 h-10 sm:h-12 lg:h-14 bg-gradient-to-r ${feature.iconBg} rounded-lg sm:rounded-xl flex items-center justify-center mb-2 sm:mb-3 lg:mb-4 shadow-lg flex-shrink-0`} aria-hidden="true">
                    <feature.icon className="w-5 sm:w-6 lg:w-7 h-5 sm:h-6 lg:h-7 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 id={`feature-title-${index}`} className="text-sm sm:text-base lg:text-lg font-bold text-gray-900 mb-1 sm:mb-2 leading-tight">{feature.title}</h3>
                    <p className="text-gray-600 text-xs sm:text-sm lg:text-base leading-snug">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Email Signup Section - Enhanced */}
        <section className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 bg-white" role="region" aria-labelledby="signup-title">
          <div className="max-w-4xl mx-auto text-center">
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl sm:rounded-3xl border border-gray-200 p-8 sm:p-12">
              <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full px-4 sm:px-6 py-2 mb-6 sm:mb-8">
                <Sparkles className="w-4 sm:w-5 h-4 sm:h-5" aria-hidden="true" />
                <span className="font-semibold text-sm sm:text-base">Exclusive Early Access</span>
              </div>

              <h2 id="signup-title" className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6">
                <span className="bg-gradient-to-r from-gray-900 to-purple-600 bg-clip-text text-transparent">
                  Join the Revolution
                </span>
              </h2>
              
              <p className="text-lg sm:text-xl text-gray-600 mb-8 sm:mb-10 max-w-2xl mx-auto px-4">
                Get exclusive early access to the world's first AI-powered, multi-system health and pain management platform with comprehensive chronic pain benefits.
              </p>

              <form onSubmit={handleEmailSubmit} className="max-w-sm sm:max-w-md mx-auto mb-6 sm:mb-8" noValidate>
                <div>
                  <label htmlFor="signup-email" className="sr-only">Your Email</label>
                  <input
                    id="signup-email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 sm:px-6 py-3 sm:py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-purple-600 text-base sm:text-lg transition-all duration-300 hover:border-purple-300 mb-4 placeholder-gray-400 bg-white"
                    required
                    maxLength="254"
                    autoComplete="email"
                    autoFocus={false}
                    spellCheck="false"
                    aria-describedby="email-help"
                  />
                  <div id="email-help" className="sr-only">Enter your email address to join the waitlist</div>
                </div>
                <button
                  type="submit"
                  disabled={loading || !email.trim()}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 sm:py-4 rounded-xl font-semibold text-base sm:text-lg hover:shadow-lg transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center space-x-2 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
                  aria-label={loading ? "Submitting form" : "Join waitlist"}
                >
                  {loading ? (
                    <>
                      <div className="w-5 sm:w-6 h-5 sm:h-6 border-2 border-white border-t-transparent rounded-full animate-spin" aria-hidden="true"></div>
                      <span>Joining...</span>
                    </>
                  ) : (
                    <>
                      <span>Join Waitlist</span>
                      <ArrowRight className="w-4 sm:w-5 h-4 sm:h-5" aria-hidden="true" />
                    </>
                  )}
                </button>
              </form>

              {/* Stats - Fixed Mobile Layout */}
              <div className="flex flex-wrap justify-center gap-6 sm:gap-8">
                {[
                  { number: `${subscribers}+`, label: "Early Subscribers", color: "text-blue-600" },
                  { number: "200+", label: "Tools & Lessons", color: "text-purple-600" },
                  { number: "∞", label: "Potential", color: "text-green-600" }
                ].map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className={`text-2xl sm:text-3xl font-bold ${stat.color} mb-1`}>{stat.number}</div>
                    <div className="text-xs sm:text-sm text-gray-500">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Ecosystem Breakdown - Fixed Layout */}
        <section id="ecosystem" className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 bg-gradient-to-r from-slate-50 to-blue-50" data-animate role="region" aria-labelledby="ecosystem-title">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12 sm:mb-16">
              <h2 id="ecosystem-title" className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6">
                <span className="bg-gradient-to-r from-gray-900 to-purple-600 bg-clip-text text-transparent">
                  The Recalibrate Ecosystem
                </span>
              </h2>
              <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto px-4">
                A comprehensive platform designed to support every aspect of your pain management journey
              </p>
            </div>

            <div className="flex justify-center mb-12 sm:mb-16">
              <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden max-w-md w-full sm:max-w-lg">
                <div className="p-6 sm:p-8">
                  <div className="text-center mb-6">
                    <div className="w-16 sm:w-20 h-16 sm:h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg" aria-hidden="true">
                      <Bell className="w-8 sm:w-10 h-8 sm:h-10 text-white" />
                    </div>
                    <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">Newsletter</h3>
                    <p className="text-gray-600 text-sm sm:text-base">Stay updated with the latest insights and developments</p>
                  </div>

                  <div className="space-y-3 sm:space-y-4 mb-6">
                    {[
                      { icon: BookOpen, text: "Weekly educational content", color: "text-blue-600", bg: "bg-blue-50" },
                      { icon: Zap, text: "Actionable tools and resources", color: "text-green-600", bg: "bg-green-50" },
                      { icon: Calendar, text: "App launch updates", color: "text-purple-600", bg: "bg-purple-50" },
                      { icon: MessageCircle, text: "Community stories", color: "text-orange-600", bg: "bg-orange-50" }
                    ].map((item, index) => (
                      <div key={index} className={`flex items-center space-x-3 p-3 ${item.bg} rounded-lg hover:scale-105 transition-transform duration-200`}>
                        <item.icon className={`w-4 sm:w-5 h-4 sm:h-5 ${item.color}`} aria-hidden="true" />
                        <span className="text-sm sm:text-base text-gray-700">{item.text}</span>
                      </div>
                    ))}
                  </div>

                  <a 
                    href="https://recalibrate.beehiiv.com/subscribe" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 hover:scale-105 flex items-center justify-center space-x-2 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 text-sm sm:text-base"
                    aria-label="Subscribe to newsletter (opens in new window)"
                  >
                    <span>Subscribe to Newsletter</span>
                    <ExternalLink className="w-4 h-4" aria-hidden="true" />
                  </a>
                </div>
              </div>
            </div>

            {/* Courses & Community - Compact */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 sm:p-8">
                <div className="text-center mb-6">
                  <div className="w-14 sm:w-16 h-14 sm:h-16 bg-gradient-to-r from-indigo-600 to-indigo-700 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg" aria-hidden="true">
                    <BookOpen className="w-7 sm:w-8 h-7 sm:h-8 text-white" />
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">Courses</h3>
                  <p className="text-gray-600 text-sm sm:text-base">Evidence-based learning modules designed for your pain management journey.</p>
                </div>
                <div className="space-y-3">
                  {[
                    "Pain Science Fundamentals",
                    "Movement & Recovery",
                    "Mindfulness for Pain"
                  ].map((course, index) => (
                    <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      <span className="text-sm font-medium text-gray-700">{course}</span>
                      <span className="text-xs text-purple-600 bg-purple-100 px-2 py-1 rounded-full">Coming Soon</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 sm:p-8">
                <div className="text-center mb-6">
                  <div className="w-14 sm:w-16 h-14 sm:h-16 bg-gradient-to-r from-emerald-600 to-emerald-700 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg" aria-hidden="true">
                    <Users className="w-7 sm:w-8 h-7 sm:h-8 text-white" />
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">Community</h3>
                  <p className="text-gray-600 text-sm sm:text-base">Connect with others on similar journeys and share experiences that matter.</p>
                </div>
                <div className="space-y-3">
                  {[
                    "Patient Support Groups",
                    "Success Stories",
                    "Community Forums"
                  ].map((community, index) => (
                    <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      <span className="text-sm font-medium text-gray-700">{community}</span>
                      <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded-full">Coming Soon</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Healthcare Providers & Researchers Section - Compact */}
        <section className="py-8 sm:py-12 px-4 sm:px-6 bg-white" role="region" aria-labelledby="providers-title">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-8 sm:mb-12">
              <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-emerald-100 to-teal-100 border border-emerald-200 rounded-full px-4 py-2 mb-4">
                <Shield className="w-4 h-4 text-emerald-600" aria-hidden="true" />
                <span className="text-xs font-semibold text-gray-700">For Health Professionals</span>
              </div>
              
              <h2 id="providers-title" className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4">
                <span className="bg-gradient-to-r from-gray-900 to-emerald-600 bg-clip-text text-transparent">
                  Providers and Research
                </span>
              </h2>
              <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto px-4">
                Physiotherapists, pain specialists, psychologists, and research teams for studies - monitor multiple patients, conduct studies, and gain insights into health patterns.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
              {[
                {
                  icon: Users,
                  title: "Multi-Patient Monitoring",
                  description: "Monitor multiple connected patients or research subjects with real-time health data and progress tracking.",
                  gradient: "from-blue-50 to-blue-100",
                  border: "border-blue-200",
                  iconBg: "from-blue-600 to-blue-700"
                },
                {
                  icon: MessageCircle,
                  title: "Secure Communication",
                  description: "Built-in messaging system with chat, file sharing, and consultation scheduling capabilities.",
                  gradient: "from-emerald-50 to-emerald-100",
                  border: "border-emerald-200",
                  iconBg: "from-emerald-600 to-emerald-700"
                },
                {
                  icon: BarChart3,
                  title: "Advanced Data Understanding",
                  description: "Research-grade analytics for clinical insights, outcome predictions, and evidence generation.",
                  gradient: "from-purple-50 to-purple-100",
                  border: "border-purple-200",
                  iconBg: "from-purple-600 to-purple-700"
                }
              ].map((feature, index) => (
                <div key={index} className={`bg-gradient-to-br ${feature.gradient} rounded-xl p-4 sm:p-6 border ${feature.border} hover:shadow-lg transition-all duration-300`}>
                  <div className={`w-10 sm:w-12 h-10 sm:h-12 bg-gradient-to-r ${feature.iconBg} rounded-xl flex items-center justify-center mb-3 sm:mb-4 shadow-lg`} aria-hidden="true">
                    <feature.icon className="w-5 sm:w-6 h-5 sm:h-6 text-white" />
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2 sm:mb-3">{feature.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Partner Section */}
        <section className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 bg-gradient-to-r from-slate-50 to-blue-50" role="region" aria-labelledby="partners-title">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-purple-100 to-pink-100 border border-purple-200 rounded-full px-4 sm:px-6 py-2 sm:py-3 mb-6 sm:mb-8">
              <Star className="w-4 sm:w-5 h-4 sm:h-5 text-purple-600" aria-hidden="true" />
              <span className="text-xs sm:text-sm font-semibold text-gray-700">Partnership Opportunities</span>
            </div>

            <h2 id="partners-title" className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6">
              <span className="bg-gradient-to-r from-gray-900 to-purple-600 bg-clip-text text-transparent">
                Partner with Us
              </span>
            </h2>
            
            <p className="text-base sm:text-xl text-gray-600 mb-8 sm:mb-12 max-w-3xl mx-auto px-4">
              Join us in revolutionizing health and pain management. Whether you're a healthcare clinic, research institution, 
              or investor, let's build the future of comprehensive health management together.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-8 sm:mb-12">
              {[
                { title: "Healthcare Clinics", description: "Partner with us to integrate comprehensive health management solutions", icon: Shield },
                { title: "Research Collaborations", description: "Collaborate on groundbreaking health and pain management research studies", icon: BarChart3 },
                { title: "Investors", description: "Join our mission to transform the future of health and pain management", icon: TrendingUp }
              ].map((partner, index) => (
                <div key={index} className="bg-white rounded-xl p-4 sm:p-6 border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                  <div className="w-10 sm:w-12 h-10 sm:h-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl flex items-center justify-center mx-auto mb-3 sm:mb-4" aria-hidden="true">
                    <partner.icon className="w-5 sm:w-6 h-5 sm:h-6 text-white" />
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2">{partner.title}</h3>
                  <p className="text-gray-600 text-xs sm:text-sm">{partner.description}</p>
                </div>
              ))}
            </div>

            <a 
              href="mailto:info@recalibratepain.com" 
              className="inline-flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 text-sm sm:text-base"
              aria-label="Contact us via email"
            >
              <Mail className="w-4 sm:w-5 h-4 sm:h-5" aria-hidden="true" />
              <span>Contact Us</span>
              <ExternalLink className="w-3 sm:w-4 h-3 sm:h-4" aria-hidden="true" />
            </a>
          </div>
        </section>

        {/* Footer - Enhanced */}
        <footer className="py-12 sm:py-16 px-4 sm:px-6 bg-gray-900 text-white" role="contentinfo">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col sm:flex-row justify-between items-center mb-8 sm:mb-12">
              <div className="flex items-center space-x-3 mb-6 sm:mb-0">
                <img 
                  src="/recalibrate-logo.png" 
                  alt="Recalibrate logo" 
                  className="w-10 sm:w-12 h-10 sm:h-12 object-contain"
                />
                <span className="text-2xl sm:text-3xl font-bold">Recalibrate</span>
              </div>
              
              <div className="flex flex-col items-center sm:items-end space-y-2 text-center sm:text-right">
                <p className="text-gray-300 text-sm sm:text-base">Ready to transform pain management?</p>
                <a 
                  href="mailto:info@recalibratepain.com"
                  className="flex items-center space-x-2 text-blue-400 hover:text-blue-300 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900 rounded-lg px-2 py-1"
                  aria-label="Send email to info@recalibratepain.com"
                >
                  <Mail className="w-4 sm:w-5 h-4 sm:h-5" aria-hidden="true" />
                  <span className="text-sm sm:text-base">info@recalibratepain.com</span>
                  <ExternalLink className="w-3 sm:w-4 h-3 sm:h-4" aria-hidden="true" />
                </a>
              </div>
            </div>

            <div className="border-t border-gray-800 pt-6 sm:pt-8">
              <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
                <p className="text-gray-400 text-xs sm:text-sm text-center sm:text-left">
                  © 2025 Recalibrate. Smarter Health and Pain Management.
                </p>
                
                {/* Social Links - Enhanced Accessibility */}
                <div className="flex items-center space-x-3 sm:space-x-4" role="list" aria-label="Social media links">
                  {[
                    { 
                      href: "https://web.facebook.com/profile.php?id=61577010274296", 
                      color: "hover:bg-blue-600", 
                      label: "Facebook",
                      path: "M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"
                    },
                    { 
                      href: "https://www.instagram.com/recalibrate_app?igsh=MWgzZjhxZmdtemQyNA==", 
                      color: "hover:bg-pink-600", 
                      label: "Instagram",
                      path: "M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"
                    },
                    { 
                      href: "https://www.linkedin.com/company/recalibrate-app/", 
                      color: "hover:bg-blue-700", 
                      label: "LinkedIn",
                      path: "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"
                    },
                    { 
                      href: "https://x.com/Recalibratepain", 
                      color: "hover:bg-gray-700", 
                      label: "Twitter/X",
                      path: "M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z"
                    }
                  ].map((social, index) => (
                    <a 
                      key={index} 
                      href={social.href} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className={`w-8 sm:w-10 h-8 sm:h-10 bg-gray-800 ${social.color} rounded-lg flex items-center justify-center transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-900`}
                      aria-label={`Follow us on ${social.label} (opens in new window)`}
                      role="listitem"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                        <path d={social.path} />
                      </svg>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </ErrorBoundary>
  );
}

export default App;