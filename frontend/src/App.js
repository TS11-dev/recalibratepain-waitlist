import React, { useState, useEffect, useCallback } from 'react';
import { 
  Heart, Brain, Activity, Shield, Target, 
  TrendingUp, CheckCircle, ArrowRight, Sparkles,
  BarChart3, Calendar, Users, BookOpen, Bell,
  Zap, MessageCircle, Mail, ExternalLink,
  Clock, ChevronDown, ChevronUp, Star, AlertTriangle, X, Menu,
  Flame, Moon, Coffee, Dumbbell
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
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
          <div className="text-center p-8">
            <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Something went wrong</h2>
            <button onClick={() => window.location.reload()} className="bg-indigo-600 text-white px-6 py-3 rounded-xl">
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
  const [subscribers, setSubscribers] = useState(0);
  const [displayedCount, setDisplayedCount] = useState(0);
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
        setSubscribers(data.count);
        setDisplayedCount(data.count);
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
    fetchSubscriberCount();
    const countInterval = setInterval(() => fetchSubscriberCount(), 15000);
    return () => clearInterval(countInterval);
  }, [fetchSubscriberCount]);

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
          toast.success('🎉 You\'re in! We\'ll let you know when we launch.', { duration: 5000 });
          setSubscribers(data.total_subscribers || subscribers + 1);
          setDisplayedCount(data.total_subscribers || displayedCount + 1);
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
    { question: "When will Recalibrate launch?", answer: "We're launching on iOS, Android, and Web in Q4 2025. Join the waitlist to get early access and help shape the app!" },
    { question: "What devices will be supported?", answer: "Recalibrate will be available everywhere - iPhone, Android phones, tablets, and web browsers. Track your health from any device." },
    { question: "How does the AI-powered tracking work?", answer: "Our algorithms learn your unique patterns from daily check-ins. Over time, we can predict flare-ups and suggest what's helping or hurting your stability." },
    { question: "Is my health data private and secure?", answer: "100%. Your data is encrypted and never shared. You own your data, and we're fully compliant with healthcare privacy standards." },
    { question: "What makes Recalibrate different?", answer: "We combine symptom tracking, pain education, therapeutic tools, and AI insights in one app. Plus, you can share reports with your care team." }
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
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 overflow-x-hidden">
        <Toaster position="top-center" />
        
        {/* Navigation */}
        <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-purple-100">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <img src="/recalibrate-logo.png" alt="Recalibrate" className="w-10 h-10 object-contain" />
                <span className="text-xl font-bold bg-gradient-to-r from-gray-900 to-purple-600 bg-clip-text text-transparent">Recalibrate</span>
              </div>
              
              <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden p-2 text-gray-600 hover:bg-purple-50 rounded-lg">
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
              
              <div className="hidden md:flex items-center space-x-6">
                <button onClick={() => smoothScroll('features')} className="text-gray-600 hover:text-indigo-600 text-sm font-medium transition-colors">Features</button>
                <button onClick={() => smoothScroll('preview')} className="text-gray-600 hover:text-indigo-600 text-sm font-medium transition-colors">App Preview</button>
                <button onClick={() => smoothScroll('faq')} className="text-gray-600 hover:text-indigo-600 text-sm font-medium transition-colors">FAQ</button>
                <button onClick={() => smoothScroll('waitlist')} className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:shadow-lg hover:shadow-purple-200 transition-all">
                  Get Early Access
                </button>
              </div>
            </div>
          </div>
          
          {mobileMenuOpen && (
            <div className="md:hidden bg-white/95 backdrop-blur-md border-t border-purple-100 py-4 px-4 space-y-2">
              <button onClick={() => { smoothScroll('features'); setMobileMenuOpen(false); }} className="block w-full text-left py-3 px-4 text-gray-600 hover:bg-purple-50 rounded-xl">Features</button>
              <button onClick={() => { smoothScroll('preview'); setMobileMenuOpen(false); }} className="block w-full text-left py-3 px-4 text-gray-600 hover:bg-purple-50 rounded-xl">App Preview</button>
              <button onClick={() => { smoothScroll('faq'); setMobileMenuOpen(false); }} className="block w-full text-left py-3 px-4 text-gray-600 hover:bg-purple-50 rounded-xl">FAQ</button>
              <button onClick={() => { smoothScroll('waitlist'); setMobileMenuOpen(false); }} className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-xl font-semibold">Get Early Access</button>
            </div>
          )}
        </nav>

        {/* Hero Section */}
        <section className="pt-28 pb-12 sm:pt-36 sm:pb-20 px-4 sm:px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              {/* Launch Badge */}
              <div className="inline-flex items-center space-x-2 bg-white/80 backdrop-blur border border-purple-200 rounded-full px-4 py-2 mb-8 shadow-sm">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                </span>
                <span className="text-sm font-medium text-gray-700">Launching Q4 2025 on iOS, Android & Web</span>
              </div>
              
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
                Your intelligent health and
                <br />
                <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 bg-clip-text text-transparent">pain management</span> companion
              </h1>
              
              <p className="text-lg sm:text-xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed">
                Track symptoms, discover patterns, access therapeutic tools, and get AI-powered insights — all designed to help you live better with chronic pain.
              </p>
              
              {/* Email Form */}
              <form onSubmit={handleEmailSubmit} className="max-w-md mx-auto mb-8">
                <div className="bg-white rounded-2xl p-2 shadow-xl shadow-purple-100 border border-purple-100">
                  <div className="flex flex-col sm:flex-row gap-2">
                    <input
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="flex-1 px-4 py-3 bg-gray-50 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900 placeholder-gray-400"
                      required
                    />
                    <button
                      type="submit"
                      disabled={loading || !email.trim()}
                      className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50 flex items-center justify-center space-x-2 whitespace-nowrap"
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
                </div>
              </form>
              
              {/* Social Proof */}
              <div className="flex items-center justify-center gap-6 text-sm">
                <div className="flex items-center space-x-2">
                  <div className="flex -space-x-2">
                    {['😊', '🙂', '😄', '🤗'].map((emoji, i) => (
                      <div key={i} className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-100 to-pink-100 border-2 border-white flex items-center justify-center text-sm">
                        {emoji}
                      </div>
                    ))}
                  </div>
                  <span className="font-semibold text-gray-700">{displayedCount > 0 ? `${displayedCount}+` : '...'} on the waitlist</span>
                </div>
              </div>
            </div>
            
            {/* App Preview Mockup */}
            <div className="relative max-w-4xl mx-auto">
              <div className="bg-white rounded-3xl shadow-2xl shadow-purple-200/50 border border-purple-100 overflow-hidden">
                {/* App Header Bar */}
                <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-purple-700 px-6 py-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                        <span className="text-white font-bold text-sm">R</span>
                      </div>
                      <span className="text-white font-semibold">Recalibrate</span>
                    </div>
                    <div className="flex items-center space-x-4 text-white/80 text-sm">
                      <span className="hidden sm:inline">🏠 Home</span>
                      <span className="hidden sm:inline">📊 Smart Tracker</span>
                      <span className="hidden sm:inline">📈 Dashboard</span>
                      <span className="hidden sm:inline">🧠 Pain Academy</span>
                    </div>
                  </div>
                </div>
                
                {/* App Content Preview */}
                <div className="p-6 sm:p-8 bg-gradient-to-br from-indigo-50/50 via-purple-50/50 to-pink-50/50">
                  <div className="text-center mb-8">
                    <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Welcome to <span className="text-indigo-600">Recalibrate</span></h2>
                    <p className="text-gray-500">Your intelligent health and pain management companion</p>
                  </div>
                  
                  {/* Stats Row */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
                    {[
                      { value: "53%", label: "Current Stability", color: "text-indigo-600" },
                      { value: "50", label: "Lessons Completed", color: "text-purple-600" },
                      { value: "10", label: "Days Tracked", color: "text-pink-600" },
                      { value: "66%", label: "Data Quality", color: "text-green-600" }
                    ].map((stat, i) => (
                      <div key={i} className="bg-white rounded-2xl p-4 shadow-sm border border-purple-50 text-center">
                        <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
                        <div className="text-xs text-gray-500 mt-1">{stat.label}</div>
                      </div>
                    ))}
                  </div>
                  
                  {/* Feature Cards */}
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="bg-white rounded-2xl p-5 shadow-sm border border-purple-50">
                      <div className="flex items-center space-x-3 mb-3">
                        <span className="text-2xl">💊</span>
                        <h3 className="font-semibold text-gray-900">My Medications</h3>
                      </div>
                      <p className="text-sm text-gray-500">Manage your schedule and track effectiveness</p>
                    </div>
                    <div className="bg-white rounded-2xl p-5 shadow-sm border border-purple-50">
                      <div className="flex items-center space-x-3 mb-3">
                        <span className="text-2xl">🐉</span>
                        <h3 className="font-semibold text-gray-900">Hey! I'm Calum</h3>
                      </div>
                      <p className="text-sm text-gray-500">Want a quick tour of Recalibrate's features?</p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Floating Feature Badges */}
              <div className="absolute -top-4 -right-4 sm:right-8 bg-white rounded-xl shadow-lg p-3 border border-purple-100 animate-bounce-slow hidden sm:block">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                    <TrendingUp className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Pain Level</p>
                    <p className="text-sm font-bold text-gray-900">-32% this week</p>
                  </div>
                </div>
              </div>
              
              <div className="absolute -bottom-4 -left-4 sm:left-8 bg-white rounded-xl shadow-lg p-3 border border-purple-100 animate-bounce-slow hidden sm:block" style={{ animationDelay: '1s' }}>
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Brain className="w-4 h-4 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">AI Insight</p>
                    <p className="text-sm font-bold text-gray-900">Pattern detected</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-16 sm:py-24 px-4 sm:px-6 scroll-mt-20">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <span className="text-indigo-600 font-semibold text-sm uppercase tracking-wider">What You'll Get</span>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mt-2 mb-4">
                Everything you need to manage your health
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Built with chronic pain warriors in mind. Real tools that actually help.
              </p>
            </div>
            
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { icon: "📊", title: "Smart Tracker", description: "Log pain, sleep, mood, energy & more across 8 health systems. Takes just 2 mins daily.", color: "from-blue-50 to-indigo-50", border: "border-blue-100" },
                { icon: "📈", title: "Stability Dashboard", description: "See your overall health stability score calculated from 18 health variables.", color: "from-purple-50 to-pink-50", border: "border-purple-100" },
                { icon: "🧠", title: "Pain Academy", description: "200+ evidence-based lessons on pain science, management strategies, and more.", color: "from-orange-50 to-amber-50", border: "border-orange-100" },
                { icon: "🎯", title: "Therapeutic Tools", description: "Guided exercises, breathing techniques, mindfulness sessions, and grounding tools.", color: "from-green-50 to-emerald-50", border: "border-green-100" },
                { icon: "✨", title: "AI Insights", description: "Pattern recognition that learns your triggers and predicts flare-ups before they happen.", color: "from-indigo-50 to-violet-50", border: "border-indigo-100" },
                { icon: "👥", title: "Care Team", description: "Share reports with your doctors, physios, and support network with one click.", color: "from-pink-50 to-rose-50", border: "border-pink-100" }
              ].map((feature, index) => (
                <div key={index} className={`bg-gradient-to-br ${feature.color} rounded-2xl p-6 border ${feature.border} hover:shadow-lg hover:shadow-purple-100 transition-all duration-300 group`}>
                  <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">{feature.icon}</div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* App Preview Section */}
        <section id="preview" className="py-16 sm:py-24 px-4 sm:px-6 scroll-mt-20">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <span className="text-indigo-600 font-semibold text-sm uppercase tracking-wider">App Preview</span>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mt-2 mb-4">
                See what's inside
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                A sneak peek at the tools you'll have access to
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-6">
              {/* Smart Tracker Card */}
              <div className="bg-white rounded-2xl overflow-hidden shadow-xl shadow-purple-100 border border-purple-100">
                <div className="bg-gradient-to-r from-indigo-500 to-purple-600 px-4 py-3">
                  <div className="flex items-center space-x-2 text-white">
                    <span>📊</span>
                    <span className="font-medium">Smart Tracker</span>
                  </div>
                </div>
                <div className="p-5 bg-gradient-to-br from-indigo-50/50 to-purple-50/50">
                  <p className="text-sm text-gray-600 mb-4">Track your health intelligently with personalized insights</p>
                  <div className="space-y-3">
                    {[
                      { icon: "💪", label: "Physical Health", active: true },
                      { icon: "🧠", label: "Mental & Cognitive", active: false },
                      { icon: "🌍", label: "Lifestyle & Environment", active: false }
                    ].map((item, i) => (
                      <div key={i} className={`flex items-center space-x-3 p-3 rounded-xl ${item.active ? 'bg-indigo-100 border border-indigo-200' : 'bg-white border border-gray-100'}`}>
                        <span className="text-lg">{item.icon}</span>
                        <span className={`text-sm font-medium ${item.active ? 'text-indigo-700' : 'text-gray-600'}`}>{item.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              {/* Stability Dashboard Card */}
              <div className="bg-white rounded-2xl overflow-hidden shadow-xl shadow-purple-100 border border-purple-100">
                <div className="bg-gradient-to-r from-purple-500 to-pink-600 px-4 py-3">
                  <div className="flex items-center space-x-2 text-white">
                    <span>📈</span>
                    <span className="font-medium">Stability Dashboard</span>
                  </div>
                </div>
                <div className="p-5 bg-gradient-to-br from-purple-50/50 to-pink-50/50">
                  <div className="text-center mb-4">
                    <div className="relative inline-flex items-center justify-center w-24 h-24">
                      <svg className="w-24 h-24 transform -rotate-90">
                        <circle cx="48" cy="48" r="40" stroke="#e5e7eb" strokeWidth="8" fill="none" />
                        <circle cx="48" cy="48" r="40" stroke="url(#gradient)" strokeWidth="8" fill="none" 
                          strokeDasharray="251.2" strokeDashoffset="117.8" strokeLinecap="round" />
                        <defs>
                          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#8b5cf6" />
                            <stop offset="100%" stopColor="#ec4899" />
                          </linearGradient>
                        </defs>
                      </svg>
                      <div className="absolute">
                        <span className="text-2xl font-bold text-gray-900">53%</span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-500 mt-2">Overall Stability Score</p>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-center">
                    <div className="bg-white rounded-xl p-2 border border-gray-100">
                      <p className="text-lg font-bold text-indigo-600">22</p>
                      <p className="text-xs text-gray-500">Entries</p>
                    </div>
                    <div className="bg-white rounded-xl p-2 border border-gray-100">
                      <p className="text-lg font-bold text-purple-600">11</p>
                      <p className="text-xs text-gray-500">Days</p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Pain Academy Card */}
              <div className="bg-white rounded-2xl overflow-hidden shadow-xl shadow-purple-100 border border-purple-100">
                <div className="bg-gradient-to-r from-orange-500 to-amber-500 px-4 py-3">
                  <div className="flex items-center space-x-2 text-white">
                    <span>🧠</span>
                    <span className="font-medium">Pain Academy</span>
                  </div>
                </div>
                <div className="p-5 bg-gradient-to-br from-orange-50/50 to-amber-50/50">
                  <p className="text-sm text-gray-600 mb-4">Evidence-based education to understand your pain</p>
                  <div className="space-y-2">
                    {[
                      { title: "Understanding Pain Science", xp: "50 XP" },
                      { title: "Nervous System Basics", xp: "75 XP" },
                      { title: "Pain Management Strategies", xp: "100 XP" }
                    ].map((lesson, i) => (
                      <div key={i} className="flex items-center justify-between p-3 bg-white rounded-xl border border-gray-100">
                        <span className="text-sm font-medium text-gray-700">{lesson.title}</span>
                        <span className="text-xs bg-amber-100 text-amber-700 px-2 py-1 rounded-full">{lesson.xp}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Waitlist CTA Section */}
        <section id="waitlist" className="py-16 sm:py-24 px-4 sm:px-6 scroll-mt-20">
          <div className="max-w-3xl mx-auto">
            <div className="bg-white rounded-3xl p-8 sm:p-12 shadow-2xl shadow-purple-200/50 border border-purple-100 text-center relative overflow-hidden">
              {/* Background decoration */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full blur-3xl opacity-50 -translate-y-1/2 translate-x-1/2"></div>
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-br from-pink-100 to-purple-100 rounded-full blur-3xl opacity-50 translate-y-1/2 -translate-x-1/2"></div>
              
              <div className="relative">
                <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-full px-4 py-2 text-sm font-medium mb-6">
                  <Bell className="w-4 h-4" />
                  <span>Join {displayedCount > 0 ? displayedCount : '...'} others on the waitlist</span>
                </div>
                
                <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                  Be the first to try Recalibrate
                </h2>
                <p className="text-lg text-gray-600 mb-8 max-w-lg mx-auto">
                  Get exclusive early access, founding member perks, and help shape the app that could change how you manage pain.
                </p>
                
                <form onSubmit={handleEmailSubmit} className="max-w-md mx-auto mb-6">
                  <div className="flex flex-col sm:flex-row gap-3">
                    <input
                      type="email"
                      placeholder="you@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="flex-1 px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900"
                      required
                    />
                    <button
                      type="submit"
                      disabled={loading || !email.trim()}
                      className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3.5 rounded-xl font-semibold hover:shadow-lg hover:shadow-purple-200 transition-all disabled:opacity-50 flex items-center justify-center space-x-2"
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
                
                <p className="text-sm text-gray-500">Free forever for early adopters. No spam, ever.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Resources Section */}
        <section className="py-16 sm:py-24 px-4 sm:px-6 bg-white/50">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <span className="text-indigo-600 font-semibold text-sm uppercase tracking-wider">While You Wait</span>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mt-2 mb-4">
                Free resources to help you today
              </h2>
            </div>
            
            <div className="grid sm:grid-cols-3 gap-6">
              <a href="https://recalibrate.beehiiv.com" target="_blank" rel="noopener noreferrer" className="bg-white rounded-2xl p-6 border border-purple-100 hover:shadow-lg hover:shadow-purple-100 transition-all group">
                <div className="text-3xl mb-4">📬</div>
                <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-indigo-600 transition-colors">Weekly Newsletter</h3>
                <p className="text-gray-600 text-sm mb-4">Pain science insights, management tips, and app updates.</p>
                <span className="text-indigo-600 text-sm font-medium inline-flex items-center">
                  Subscribe free <ExternalLink className="w-3.5 h-3.5 ml-1" />
                </span>
              </a>
              
              <a href="https://recalibratepain.gumroad.com/" target="_blank" rel="noopener noreferrer" className="bg-white rounded-2xl p-6 border border-purple-100 hover:shadow-lg hover:shadow-purple-100 transition-all group">
                <div className="text-3xl mb-4">📚</div>
                <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-indigo-600 transition-colors">Courses & Guides</h3>
                <p className="text-gray-600 text-sm mb-4">Evidence-based courses and workbooks for pain education.</p>
                <span className="text-indigo-600 text-sm font-medium inline-flex items-center">
                  Browse courses <ExternalLink className="w-3.5 h-3.5 ml-1" />
                </span>
              </a>
              
              <a href="https://ko-fi.com/N4N21O1R1W" target="_blank" rel="noopener noreferrer" className="bg-white rounded-2xl p-6 border border-purple-100 hover:shadow-lg hover:shadow-purple-100 transition-all group">
                <div className="text-3xl mb-4">☕</div>
                <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-indigo-600 transition-colors">Support Development</h3>
                <p className="text-gray-600 text-sm mb-4">Help us build the future of pain management.</p>
                <span className="text-indigo-600 text-sm font-medium inline-flex items-center">
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
              <span className="text-indigo-600 font-semibold text-sm uppercase tracking-wider">FAQ</span>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mt-2">
                Common questions
              </h2>
            </div>
            
            <div className="space-y-3">
              {faqs.map((faq, index) => (
                <div key={index} className="bg-white border border-purple-100 rounded-2xl overflow-hidden shadow-sm">
                  <button
                    onClick={() => setOpenFaq(openFaq === index ? null : index)}
                    className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-purple-50/50 transition-colors"
                  >
                    <span className="font-semibold text-gray-900 pr-4">{faq.question}</span>
                    {openFaq === index ? (
                      <ChevronUp className="w-5 h-5 text-indigo-600 flex-shrink-0" />
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
              <p className="text-gray-600 mb-2">Have another question?</p>
              <button onClick={() => setShowContactModal(true)} className="text-indigo-600 font-semibold hover:text-indigo-700">
                Get in touch →
              </button>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-12 px-4 sm:px-6 bg-gray-900 text-white">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-center mb-8">
              <div className="flex items-center space-x-2 mb-6 md:mb-0">
                <img src="/recalibrate-logo.png" alt="Recalibrate" className="w-10 h-10 object-contain" />
                <span className="text-xl font-bold">Recalibrate</span>
              </div>
              
              <div className="flex items-center space-x-4">
                {[
                  { href: "https://www.instagram.com/recalibrateapp/", label: "Instagram" },
                  { href: "https://www.linkedin.com/company/recalibrate-app/", label: "LinkedIn" },
                  { href: "https://x.com/RecalibrateApp", label: "X" },
                  { href: "https://za.pinterest.com/Recalibratepain/", label: "Pinterest" }
                ].map((social, i) => (
                  <a key={i} href={social.href} target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-gray-800 hover:bg-indigo-600 rounded-xl flex items-center justify-center transition-colors" aria-label={social.label}>
                    <span className="text-sm">{['📸', '💼', '𝕏', '📌'][i]}</span>
                  </a>
                ))}
              </div>
            </div>
            
            <div className="border-t border-gray-800 pt-8 flex flex-col sm:flex-row justify-between items-center">
              <p className="text-gray-400 text-sm mb-4 sm:mb-0">© 2025 Recalibrate. Your intelligent health companion.</p>
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
                  <button onClick={() => setShowContactModal(false)} className="text-gray-400 hover:text-gray-600 p-2 hover:bg-gray-100 rounded-lg">
                    <X className="w-6 h-6" />
                  </button>
                </div>
                
                <div className="space-y-4">
                  <a href="mailto:info@recalibratepain.com" className="flex items-center space-x-4 p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl hover:shadow-md transition-all">
                    <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
                      <Mail className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">Email Us</p>
                      <p className="text-indigo-600">info@recalibratepain.com</p>
                    </div>
                  </a>
                  
                  <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl">
                    <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                      <Clock className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">Response Time</p>
                      <p className="text-gray-600">Usually within 24 hours</p>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <p className="text-gray-600 text-sm">
                    Questions about Recalibrate? Partnership opportunities? We'd love to hear from you!
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
