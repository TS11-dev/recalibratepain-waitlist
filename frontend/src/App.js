import React, { useState, useEffect, useCallback } from 'react';
import { 
  Heart, Brain, Activity, Shield, Target, 
  TrendingUp, Award, CheckCircle, ArrowRight, Sparkles,
  BarChart3, Calendar, Users, BookOpen, Bell,
  Zap, MessageCircle, Mail, ExternalLink,
  Clock, ChevronDown, ChevronUp, Star, AlertTriangle, X, Menu
} from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

// Error Boundary Component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center p-8">
            <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Something went wrong</h2>
            <button onClick={() => window.location.reload()} className="bg-violet-600 text-white px-6 py-3 rounded-lg">
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
  const [subscribers, setSubscribers] = useState(188);
  const [displayedCount, setDisplayedCount] = useState(0);
  const [actualCount, setActualCount] = useState(0);
  const [openFaq, setOpenFaq] = useState(null);
  const [showContactModal, setShowContactModal] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || window.location.origin;

  const isValidEmail = useCallback((email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email) && email.length <= 254;
  }, []);

  const sanitizeInput = useCallback((input) => {
    return input.trim().replace(/[<>&"]/g, (char) => {
      const entities = { '<': '&lt;', '>': '&gt;', '&': '&amp;', '"': '&quot;' };
      return entities[char] || char;
    });
  }, []);

  const fetchSubscriberCount = useCallback(async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/waitlist/count?t=${Date.now()}`, {
        method: 'GET',
        headers: { 'Cache-Control': 'no-cache' },
        signal: AbortSignal.timeout(10000)
      });
      if (response.ok) {
        const data = await response.json();
        setActualCount(data.count);
        setSubscribers(data.count);
      }
    } catch (error) {
      console.log('Error fetching count');
    }
  }, [BACKEND_URL]);

  const smoothScroll = useCallback((targetId) => {
    const element = document.getElementById(targetId);
    element?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, []);

  useEffect(() => {
    if (actualCount > 0) setDisplayedCount(actualCount);
  }, [actualCount]);

  useEffect(() => {
    const initializeCounter = async () => {
      try {
        const response = await fetch(`${BACKEND_URL}/api/waitlist/count?t=${Date.now()}`, {
          method: 'GET',
          headers: { 'Cache-Control': 'no-cache' },
          signal: AbortSignal.timeout(8000)
        });
        if (response.ok) {
          const data = await response.json();
          setActualCount(data.count);
          setSubscribers(data.count);
        }
      } catch (error) {
        console.log('API error');
      }
    };
    initializeCounter();
    const countInterval = setInterval(() => fetchSubscriberCount(), 15000);
    return () => clearInterval(countInterval);
  }, [BACKEND_URL, fetchSubscriberCount]);

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    const sanitizedEmail = sanitizeInput(email);
    
    if (!isValidEmail(sanitizedEmail)) {
      toast.error('Please enter a valid email address');
      return;
    }

    setLoading(true);
    
    try {
      const response = await fetch(`${BACKEND_URL}/api/waitlist/join`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: "Website Subscriber", email: sanitizedEmail.toLowerCase() }),
        signal: AbortSignal.timeout(15000)
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          toast.success('🚀 You\'re on the list! We\'ll notify you at launch.', { duration: 5000 });
          setSubscribers(data.total_subscribers || subscribers + 1);
          setActualCount(data.total_subscribers || actualCount + 1);
          setEmail('');
          setTimeout(() => fetchSubscriberCount(), 1000);
        } else {
          toast.error(data.message || 'Failed to join waitlist.');
        }
      } else {
        toast.error('Failed to join waitlist. Please try again.');
      }
    } catch (error) {
      toast.error('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const faqs = [
    { question: "When will Recalibrate launch?", answer: "We're launching on iOS, Android, and Web in Q4 2025. Join the waitlist to get exclusive early access before the public release." },
    { question: "What devices will be supported?", answer: "Recalibrate will be available on iOS, Android, and as a web application - access your health data from any device, anywhere." },
    { question: "How does AI-powered tracking work?", answer: "Our algorithms analyze your symptom patterns, activities, and health metrics to identify triggers, predict flare-ups, and suggest personalized management strategies." },
    { question: "Is my health data secure?", answer: "Absolutely. We use enterprise-grade encryption and comply with healthcare privacy regulations. Your data belongs to you." },
    { question: "What makes Recalibrate different?", answer: "We're the first platform combining multi-system health tracking, AI pattern recognition, evidence-based education, and clinical integration in one solution." }
  ];

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setShowContactModal(false);
        setMobileMenuOpen(false);
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    document.body.style.overflow = showContactModal ? 'hidden' : 'unset';
    return () => { document.body.style.overflow = 'unset'; };
  }, [showContactModal]);

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-white overflow-x-hidden">
        <Toaster position="top-center" />
        
        {/* Navigation */}
        <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <img src="/recalibrate-logo.png" alt="Recalibrate" className="w-8 h-8 object-contain" />
                <span className="text-xl font-bold text-gray-900">Recalibrate</span>
              </div>
              
              <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden p-2 text-gray-600">
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
              
              <div className="hidden md:flex items-center space-x-8">
                <button onClick={() => smoothScroll('features')} className="text-gray-600 hover:text-gray-900 text-sm font-medium">Features</button>
                <button onClick={() => smoothScroll('how-it-works')} className="text-gray-600 hover:text-gray-900 text-sm font-medium">How It Works</button>
                <button onClick={() => smoothScroll('faq')} className="text-gray-600 hover:text-gray-900 text-sm font-medium">FAQ</button>
                <button onClick={() => smoothScroll('waitlist')} className="bg-violet-600 text-white px-5 py-2 rounded-full text-sm font-semibold hover:bg-violet-700 transition-all">
                  Join Waitlist
                </button>
              </div>
            </div>
          </div>
          
          {mobileMenuOpen && (
            <div className="md:hidden bg-white border-t border-gray-100 py-4 px-4 space-y-3">
              <button onClick={() => { smoothScroll('features'); setMobileMenuOpen(false); }} className="block w-full text-left py-2 text-gray-600">Features</button>
              <button onClick={() => { smoothScroll('how-it-works'); setMobileMenuOpen(false); }} className="block w-full text-left py-2 text-gray-600">How It Works</button>
              <button onClick={() => { smoothScroll('faq'); setMobileMenuOpen(false); }} className="block w-full text-left py-2 text-gray-600">FAQ</button>
              <button onClick={() => { smoothScroll('waitlist'); setMobileMenuOpen(false); }} className="w-full bg-violet-600 text-white py-3 rounded-full font-semibold">Join Waitlist</button>
            </div>
          )}
        </nav>

        {/* Hero Section */}
        <section className="pt-24 pb-16 sm:pt-32 sm:pb-24 px-4 sm:px-6 bg-gradient-to-b from-violet-50 via-white to-white">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
              {/* Left Content */}
              <div className="text-center lg:text-left">
                <div className="inline-flex items-center space-x-2 bg-violet-100 text-violet-700 rounded-full px-4 py-1.5 text-sm font-medium mb-6">
                  <Sparkles className="w-4 h-4" />
                  <span>Launching Q4 2025</span>
                </div>
                
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
                  Take control of your
                  <span className="text-violet-600"> health journey</span>
                </h1>
                
                <p className="text-lg sm:text-xl text-gray-600 mb-8 max-w-xl mx-auto lg:mx-0">
                  The intelligent health companion that tracks symptoms, identifies patterns, and helps you live better with chronic pain.
                </p>
                
                {/* Email Form - Hero */}
                <form onSubmit={handleEmailSubmit} className="max-w-md mx-auto lg:mx-0 mb-8">
                  <div className="flex flex-col sm:flex-row gap-3">
                    <input
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="flex-1 px-4 py-3.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-violet-500 text-gray-900 bg-white"
                      required
                    />
                    <button
                      type="submit"
                      disabled={loading || !email.trim()}
                      className="bg-violet-600 text-white px-6 py-3.5 rounded-xl font-semibold hover:bg-violet-700 transition-all disabled:opacity-50 flex items-center justify-center space-x-2 whitespace-nowrap"
                    >
                      {loading ? (
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <>
                          <span>Get Early Access</span>
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </div>
                </form>
                
                {/* Social Proof */}
                <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-6 text-sm text-gray-500">
                  <div className="flex items-center space-x-2">
                    <div className="flex -space-x-2">
                      {[...Array(4)].map((_, i) => (
                        <div key={i} className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-400 to-purple-500 border-2 border-white flex items-center justify-center text-white text-xs font-bold">
                          {['A', 'M', 'S', 'J'][i]}
                        </div>
                      ))}
                    </div>
                    <span className="font-medium text-gray-700">{displayedCount}+ people waiting</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                    <span className="ml-1">Early reviews</span>
                  </div>
                </div>
              </div>
              
              {/* Right - App Preview */}
              <div className="relative flex justify-center lg:justify-end">
                <div className="relative">
                  {/* Phone Mockup */}
                  <div className="relative w-64 sm:w-72 mx-auto">
                    <div className="bg-gray-900 rounded-[3rem] p-2 shadow-2xl">
                      <div className="bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-700 rounded-[2.5rem] overflow-hidden aspect-[9/19]">
                        {/* Blurred App Preview */}
                        <div className="h-full p-4 flex flex-col">
                          {/* Status bar mock */}
                          <div className="flex justify-between items-center mb-4 opacity-70">
                            <span className="text-white text-xs">9:41</span>
                            <div className="flex space-x-1">
                              <div className="w-4 h-2 bg-white/50 rounded-sm"></div>
                              <div className="w-4 h-2 bg-white/50 rounded-sm"></div>
                            </div>
                          </div>
                          
                          {/* Blurred content placeholder */}
                          <div className="flex-1 space-y-4">
                            <div className="text-center">
                              <div className="w-16 h-16 mx-auto bg-white/20 rounded-2xl backdrop-blur-xl mb-3 flex items-center justify-center">
                                <Heart className="w-8 h-8 text-white" />
                              </div>
                              <div className="h-4 bg-white/30 rounded-full w-24 mx-auto backdrop-blur-sm"></div>
                            </div>
                            
                            <div className="space-y-3 mt-6">
                              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3">
                                <div className="h-3 bg-white/40 rounded-full w-20 mb-2"></div>
                                <div className="h-8 bg-white/20 rounded-lg"></div>
                              </div>
                              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3">
                                <div className="h-3 bg-white/40 rounded-full w-16 mb-2"></div>
                                <div className="h-8 bg-white/20 rounded-lg"></div>
                              </div>
                              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3">
                                <div className="h-3 bg-white/40 rounded-full w-24 mb-2"></div>
                                <div className="flex space-x-2">
                                  <div className="h-6 w-6 bg-white/30 rounded-full"></div>
                                  <div className="h-6 w-6 bg-white/30 rounded-full"></div>
                                  <div className="h-6 w-6 bg-white/30 rounded-full"></div>
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          {/* Bottom nav mock */}
                          <div className="flex justify-around mt-4 pt-3 border-t border-white/10">
                            <div className="w-6 h-6 bg-white/30 rounded-full"></div>
                            <div className="w-6 h-6 bg-white/50 rounded-full"></div>
                            <div className="w-6 h-6 bg-white/30 rounded-full"></div>
                            <div className="w-6 h-6 bg-white/30 rounded-full"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Floating Elements */}
                    <div className="absolute -top-4 -right-4 bg-white rounded-2xl shadow-xl p-3 animate-bounce-slow">
                      <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                          <TrendingUp className="w-4 h-4 text-green-600" />
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Pain Level</p>
                          <p className="text-sm font-bold text-gray-900">-32% this week</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="absolute -bottom-2 -left-4 bg-white rounded-2xl shadow-xl p-3 animate-bounce-slow" style={{ animationDelay: '0.5s' }}>
                      <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-violet-100 rounded-full flex items-center justify-center">
                          <Brain className="w-4 h-4 text-violet-600" />
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">AI Insight</p>
                          <p className="text-sm font-bold text-gray-900">Pattern found</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Platform Availability - Non-clickable badges */}
            <div className="mt-16 text-center">
              <p className="text-sm text-gray-500 mb-4">Coming soon to all platforms</p>
              <div className="flex flex-wrap justify-center gap-4">
                <div className="flex items-center space-x-2 bg-gray-50 text-gray-600 rounded-lg px-4 py-2.5 border border-gray-200">
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/></svg>
                  <span className="text-sm font-medium">iOS App</span>
                </div>
                <div className="flex items-center space-x-2 bg-gray-50 text-gray-600 rounded-lg px-4 py-2.5 border border-gray-200">
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M17.523 2.047c-.293-.06-.587.06-.82.234l-6.593 4.66-3.347-1.893c-.233-.133-.527-.133-.76 0L3.17 6.608c-.467.273-.467.94 0 1.213l2.687 1.52-2.687 1.52c-.467.273-.467.94 0 1.213l2.833 1.56c.233.133.527.133.76 0l3.347-1.893 6.593 4.66c.233.173.527.293.82.234.587-.12.977-.647.977-1.24V3.287c0-.593-.39-1.12-.977-1.24zM7.003 10.341L5.15 9.28l1.853-1.06v2.12zm9.847 5.733l-5.167-3.647 5.167-3.647v7.294z"/></svg>
                  <span className="text-sm font-medium">Android</span>
                </div>
                <div className="flex items-center space-x-2 bg-gray-50 text-gray-600 rounded-lg px-4 py-2.5 border border-gray-200">
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/></svg>
                  <span className="text-sm font-medium">Web App</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Problem/Solution Section */}
        <section className="py-16 sm:py-24 px-4 sm:px-6 bg-gray-50">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <span className="text-violet-600 font-semibold text-sm uppercase tracking-wider">The Problem</span>
                <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mt-2 mb-6">
                  Managing chronic pain is overwhelming
                </h2>
                <div className="space-y-4">
                  {[
                    "Scattered health data across multiple apps and notes",
                    "Difficulty identifying triggers and patterns",
                    "Frustrating communication with healthcare providers",
                    "Lack of personalized, actionable insights"
                  ].map((item, i) => (
                    <div key={i} className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <X className="w-3.5 h-3.5 text-red-500" />
                      </div>
                      <p className="text-gray-600">{item}</p>
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <span className="text-violet-600 font-semibold text-sm uppercase tracking-wider">The Solution</span>
                <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mt-2 mb-6">
                  Recalibrate brings it all together
                </h2>
                <div className="space-y-4">
                  {[
                    "One unified platform for all your health tracking",
                    "AI-powered pattern recognition and predictions",
                    "Shareable reports for your care team",
                    "Evidence-based tools and education"
                  ].map((item, i) => (
                    <div key={i} className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <CheckCircle className="w-3.5 h-3.5 text-green-500" />
                      </div>
                      <p className="text-gray-600">{item}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-16 sm:py-24 px-4 sm:px-6 scroll-mt-20">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <span className="text-violet-600 font-semibold text-sm uppercase tracking-wider">Features</span>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mt-2 mb-4">
                Everything you need to manage your health
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Powerful tools designed specifically for people living with chronic pain conditions.
              </p>
            </div>
            
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {[
                { icon: Activity, title: "Multi-System Tracking", description: "Monitor 8 interconnected health systems including pain, sleep, mood, energy, and more.", color: "violet" },
                { icon: Brain, title: "AI Pattern Recognition", description: "Advanced algorithms identify your unique triggers and predict potential flare-ups.", color: "purple" },
                { icon: BarChart3, title: "Smart Analytics", description: "Visual dashboards and insights that help you understand your health trends.", color: "indigo" },
                { icon: BookOpen, title: "Pain Education", description: "Evidence-based learning resources to understand and manage your condition better.", color: "blue" },
                { icon: Users, title: "Care Team Sharing", description: "Generate reports to share with your healthcare providers for better care.", color: "cyan" },
                { icon: Shield, title: "Secure & Private", description: "Enterprise-grade encryption. Your health data stays yours, always.", color: "teal" }
              ].map((feature, index) => (
                <div key={index} className="bg-white rounded-2xl p-6 border border-gray-100 hover:border-violet-200 hover:shadow-lg transition-all duration-300 group">
                  <div className={`w-12 h-12 bg-${feature.color}-100 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <feature.icon className={`w-6 h-6 text-${feature.color}-600`} />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section id="how-it-works" className="py-16 sm:py-24 px-4 sm:px-6 bg-violet-600 scroll-mt-20">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <span className="text-violet-200 font-semibold text-sm uppercase tracking-wider">How It Works</span>
              <h2 className="text-3xl sm:text-4xl font-bold text-white mt-2 mb-4">
                Simple steps to better health management
              </h2>
            </div>
            
            <div className="grid sm:grid-cols-3 gap-8">
              {[
                { step: "01", title: "Track Daily", description: "Log your symptoms, activities, and how you're feeling in just 2 minutes a day." },
                { step: "02", title: "Discover Patterns", description: "Our AI analyzes your data to find correlations and predict what affects your health." },
                { step: "03", title: "Take Action", description: "Get personalized recommendations and share insights with your care team." }
              ].map((item, index) => (
                <div key={index} className="text-center">
                  <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <span className="text-2xl font-bold text-white">{item.step}</span>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">{item.title}</h3>
                  <p className="text-violet-100">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Waitlist CTA Section */}
        <section id="waitlist" className="py-16 sm:py-24 px-4 sm:px-6 scroll-mt-20">
          <div className="max-w-3xl mx-auto text-center">
            <div className="bg-gradient-to-br from-violet-50 to-purple-50 rounded-3xl p-8 sm:p-12 border border-violet-100">
              <div className="inline-flex items-center space-x-2 bg-violet-600 text-white rounded-full px-4 py-1.5 text-sm font-medium mb-6">
                <Bell className="w-4 h-4" />
                <span>Limited Early Access</span>
              </div>
              
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                Be first to experience Recalibrate
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                Join {displayedCount}+ others on the waitlist. Get exclusive early access, founding member benefits, and help shape the future of health management.
              </p>
              
              <form onSubmit={handleEmailSubmit} className="max-w-md mx-auto mb-6">
                <div className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="email"
                    placeholder="you@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="flex-1 px-4 py-3.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-violet-500 text-gray-900 bg-white"
                    required
                  />
                  <button
                    type="submit"
                    disabled={loading || !email.trim()}
                    className="bg-violet-600 text-white px-6 py-3.5 rounded-xl font-semibold hover:bg-violet-700 transition-all disabled:opacity-50 flex items-center justify-center space-x-2"
                  >
                    {loading ? (
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <span>Join Waitlist</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              </form>
              
              <p className="text-sm text-gray-500">No spam, ever. Unsubscribe anytime.</p>
            </div>
          </div>
        </section>

        {/* Social Proof / Resources */}
        <section className="py-16 sm:py-24 px-4 sm:px-6 bg-gray-50">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <span className="text-violet-600 font-semibold text-sm uppercase tracking-wider">Resources</span>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mt-2 mb-4">
                Start your journey today
              </h2>
              <p className="text-lg text-gray-600">
                Free resources while you wait for the app
              </p>
            </div>
            
            <div className="grid sm:grid-cols-3 gap-6">
              {/* Newsletter */}
              <a href="https://recalibrate.beehiiv.com" target="_blank" rel="noopener noreferrer" className="bg-white rounded-2xl p-6 border border-gray-100 hover:border-violet-200 hover:shadow-lg transition-all group">
                <div className="w-12 h-12 bg-violet-100 rounded-xl flex items-center justify-center mb-4">
                  <Bell className="w-6 h-6 text-violet-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-violet-600 transition-colors">Weekly Newsletter</h3>
                <p className="text-gray-600 text-sm mb-4">Pain science insights, management tips, and app updates delivered weekly.</p>
                <span className="text-violet-600 text-sm font-medium inline-flex items-center">
                  Subscribe free <ExternalLink className="w-3.5 h-3.5 ml-1" />
                </span>
              </a>
              
              {/* Courses */}
              <a href="https://recalibratepain.gumroad.com/" target="_blank" rel="noopener noreferrer" className="bg-white rounded-2xl p-6 border border-gray-100 hover:border-violet-200 hover:shadow-lg transition-all group">
                <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center mb-4">
                  <BookOpen className="w-6 h-6 text-indigo-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-violet-600 transition-colors">Pain Education</h3>
                <p className="text-gray-600 text-sm mb-4">Evidence-based courses and workbooks to understand your pain better.</p>
                <span className="text-violet-600 text-sm font-medium inline-flex items-center">
                  Browse courses <ExternalLink className="w-3.5 h-3.5 ml-1" />
                </span>
              </a>
              
              {/* Support */}
              <a href="https://ko-fi.com/N4N21O1R1W" target="_blank" rel="noopener noreferrer" className="bg-white rounded-2xl p-6 border border-gray-100 hover:border-violet-200 hover:shadow-lg transition-all group">
                <div className="w-12 h-12 bg-pink-100 rounded-xl flex items-center justify-center mb-4">
                  <Heart className="w-6 h-6 text-pink-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-violet-600 transition-colors">Support Us</h3>
                <p className="text-gray-600 text-sm mb-4">Help us build the future of pain management. Every contribution helps.</p>
                <span className="text-violet-600 text-sm font-medium inline-flex items-center">
                  Buy us a coffee <ExternalLink className="w-3.5 h-3.5 ml-1" />
                </span>
              </a>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section id="faq" className="py-16 sm:py-24 px-4 sm:px-6 scroll-mt-20">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <span className="text-violet-600 font-semibold text-sm uppercase tracking-wider">FAQ</span>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mt-2">
                Frequently asked questions
              </h2>
            </div>
            
            <div className="space-y-3">
              {faqs.map((faq, index) => (
                <div key={index} className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                  <button
                    onClick={() => setOpenFaq(openFaq === index ? null : index)}
                    className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                  >
                    <span className="font-semibold text-gray-900 pr-4">{faq.question}</span>
                    {openFaq === index ? (
                      <ChevronUp className="w-5 h-5 text-violet-600 flex-shrink-0" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" />
                    )}
                  </button>
                  {openFaq === index && (
                    <div className="px-6 pb-4 text-gray-600">
                      {faq.answer}
                    </div>
                  )}
                </div>
              ))}
            </div>
            
            <div className="text-center mt-8">
              <p className="text-gray-600 mb-2">Still have questions?</p>
              <button onClick={() => setShowContactModal(true)} className="text-violet-600 font-semibold hover:text-violet-700">
                Contact us →
              </button>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-12 px-4 sm:px-6 bg-gray-900 text-white">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-center mb-8">
              <div className="flex items-center space-x-2 mb-6 md:mb-0">
                <img src="/recalibrate-logo.png" alt="Recalibrate" className="w-8 h-8 object-contain" />
                <span className="text-xl font-bold">Recalibrate</span>
              </div>
              
              <div className="flex items-center space-x-4">
                {[
                  { href: "https://www.instagram.com/recalibrateapp/", label: "Instagram", path: "M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" },
                  { href: "https://www.linkedin.com/company/recalibrate-app/", label: "LinkedIn", path: "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" },
                  { href: "https://x.com/RecalibrateApp", label: "X/Twitter", path: "M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z" },
                  { href: "https://za.pinterest.com/Recalibratepain/", label: "Pinterest", path: "M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.74.099.12.112.22.085.34-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.746-1.378l-.753 2.87c-.265 1.019-.985 2.304-1.477 3.079C9.26 23.641 10.618 24 12.017 24c6.624 0 11.99-5.367 11.99-12C24.007 5.367 18.641.001 12.017.001z" }
                ].map((social, i) => (
                  <a key={i} href={social.href} target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-gray-800 hover:bg-violet-600 rounded-lg flex items-center justify-center transition-colors" aria-label={social.label}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d={social.path} /></svg>
                  </a>
                ))}
              </div>
            </div>
            
            <div className="border-t border-gray-800 pt-8 flex flex-col sm:flex-row justify-between items-center">
              <p className="text-gray-400 text-sm mb-4 sm:mb-0">© 2025 Recalibrate. Smarter Health Management.</p>
              <a href="mailto:info@recalibratepain.com" className="text-gray-400 hover:text-white text-sm flex items-center space-x-2 transition-colors">
                <Mail className="w-4 h-4" />
                <span>info@recalibratepain.com</span>
              </a>
            </div>
          </div>
        </footer>

        {/* Contact Modal */}
        {showContactModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4" onClick={(e) => e.target === e.currentTarget && setShowContactModal(false)}>
            <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl">
              <div className="p-6 sm:p-8">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">Get in Touch</h2>
                  <button onClick={() => setShowContactModal(false)} className="text-gray-400 hover:text-gray-600 p-2">
                    <X className="w-6 h-6" />
                  </button>
                </div>
                
                <div className="space-y-4">
                  <a href="mailto:info@recalibratepain.com" className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                    <div className="w-12 h-12 bg-violet-100 rounded-xl flex items-center justify-center">
                      <Mail className="w-6 h-6 text-violet-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">Email Us</p>
                      <p className="text-violet-600">info@recalibratepain.com</p>
                    </div>
                  </a>
                  
                  <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl">
                    <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                      <Clock className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">Response Time</p>
                      <p className="text-gray-600">Within 24 hours</p>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <p className="text-gray-600 text-sm">
                    Have questions about Recalibrate? Partnership inquiries? We'd love to hear from you.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </ErrorBoundary>
  );
}

export default App;
