import React, { useState, useEffect, useCallback } from 'react';
import { 
  Heart, Brain, Activity, Shield, Target, 
  TrendingUp, CheckCircle, ArrowRight, Sparkles,
  BarChart3, Users, BookOpen, Bell,
  Zap, MessageCircle, Mail, ExternalLink,
  Clock, ChevronDown, ChevronUp, Star, AlertTriangle, X, Menu,
  Play, Smartphone, Globe, Bot, Flame, Snowflake, Dumbbell
} from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

class ErrorBoundary extends React.Component {
  constructor(props) { super(props); this.state = { hasError: false }; }
  static getDerivedStateFromError() { return { hasError: true }; }
  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
          <div className="text-center p-8">
            <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <button onClick={() => window.location.reload()} className="bg-indigo-600 text-white px-6 py-3 rounded-xl">Reload</button>
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
  const [waitlistCount, setWaitlistCount] = useState(0);
  const [openFaq, setOpenFaq] = useState(null);
  const [showContactModal, setShowContactModal] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [partnerForm, setPartnerForm] = useState({ type: '', name: '', email: '', organization: '', message: '' });
  const [partnerFormOpen, setPartnerFormOpen] = useState(null); // 'clinic', 'research', 'investor'
  const [partnerSubmitting, setPartnerSubmitting] = useState(false);
  const [goPlanYearly, setGoPlanYearly] = useState(false);
  const [proPlanYearly, setProPlanYearly] = useState(false);
  const [superPlanYearly, setSuperPlanYearly] = useState(false);

  const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || window.location.origin;

  // Fetch waitlist count on mount and periodically
  const fetchWaitlistCount = useCallback(async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/waitlist/count?t=${Date.now()}`, {
        method: 'GET',
        headers: { 'Cache-Control': 'no-cache, no-store, must-revalidate' }
      });
      if (response.ok) {
        const data = await response.json();
        console.log('Waitlist count:', data.count);
        setWaitlistCount(data.count);
      }
    } catch (error) {
      console.log('Error fetching waitlist count:', error);
    }
  }, [BACKEND_URL]);

  useEffect(() => {
    fetchWaitlistCount();
    const interval = setInterval(fetchWaitlistCount, 10000);
    return () => clearInterval(interval);
  }, [fetchWaitlistCount]);

  // Placeholder for future feature hooks

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    const trimmedEmail = email.trim().toLowerCase();
    
    if (!trimmedEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      toast.error('Please enter a valid email address');
      return;
    }

    setLoading(true);
    
    try {
      const response = await fetch(`${BACKEND_URL}/api/waitlist/join`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: "Website Subscriber", email: trimmedEmail })
      });

      const data = await response.json();
      
      if (response.ok && data.success) {
        toast.success('🎉 You\'re on the list! We\'ll email you when we launch.', { duration: 5000 });
        setEmail('');
        if (data.total_subscribers) {
          setWaitlistCount(data.total_subscribers);
        } else {
          fetchWaitlistCount();
        }
      } else {
        toast.error(data.message || 'Something went wrong. Try again!');
      }
    } catch (error) {
      toast.error('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const smoothScroll = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setMobileMenuOpen(false);
  };

  // Not using features array anymore - merged into comprehensive section

  const subscriptionPlans = [
    {
      name: "Free",
      monthly: "0",
      yearly: null,
      description: "Essential tracking",
      features: ["Smart Tracking (18+ variables)", "Analytics Dashboard", "Medication tracking", "Exported Reports", "Limited Support"],
      popular: false,
      cta: "Start Free"
    },
    {
      name: "Go",
      monthly: "12.99",
      yearly: "99.99",
      description: "Academy & Tools",
      features: ["Everything in Free", "Full Recalibrate Academy", "Courses & Guides", "Therapeutic Tools", "Journal, Goals & Guided Exercises"],
      popular: false,
      cta: "Get Go"
    },
    {
      name: "Pro",
      monthly: "34.99",
      yearly: "299.99",
      description: "AI & Care Team",
      features: ["Everything in Go", "Recalibrate AI (with credits)", "Care Team Access", "Clinicians, Researchers & Family", "Advanced Academy Courses"],
      popular: true,
      cta: "Go Pro"
    },
    {
      name: "Super",
      monthly: "59.99",
      yearly: "599.99",
      description: "Premium Everything",
      features: ["Everything in Pro", "More Care Team Members", "Much More AI Credits", "Customizations (Dark Mode & More)", "Priority Support"],
      popular: false,
      cta: "Get Super"
    },
    {
      name: "Lifetime Super",
      monthly: "999.99",
      yearly: null,
      description: "Super forever",
      features: ["All Super features", "Lifetime updates", "Early access to new features", "VIP support"],
      popular: false,
      cta: "Get Lifetime Super",
      isLifetime: true
    }
  ];

  const faqs = [
    { q: "When does Recalibrate launch?", a: "Q1 2026 on iOS, Android, and Web. Join the waitlist to be first in line!" },
    { q: "Is my health data private?", a: "100% private. Encrypted, never shared, and you own your data. We follow HIPAA-compliant practices." },
    { q: "How does the AI companion work?", a: "Powered by Gemini 2.0 Flash, it analyzes your patterns and provides personalized insights based on your tracked data." },
    { q: "What makes this different?", a: "We combine tracking, education, therapeutic tools, and AI insights in one app designed specifically for chronic pain management." },
    { q: "Is there a cost?", a: "We offer a free tier with essential features. Premium plans unlock advanced tools, AI insights, and Care Team access." }
  ];

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50/30 to-indigo-50/50">
        <Toaster position="top-center" toastOptions={{ style: { borderRadius: '12px', background: '#1f2937', color: '#fff' } }} />
        
        {/* Navigation */}
        <nav className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-indigo-600 to-purple-600 shadow-lg">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <img 
                  src="/recalibrate-logo-optimized.png" 
                  alt="Recalibrate" 
                  className="h-10 w-auto" 
                  width="40" 
                  height="40"
                  fetchPriority="high"
                />
                <span className="text-xl font-bold text-white">Recalibrate</span>
              </div>
              
              <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden p-2 hover:bg-white/10 rounded-xl">
                {mobileMenuOpen ? <X className="w-6 h-6 text-white" /> : <Menu className="w-6 h-6 text-white" />}
              </button>
              
              <div className="hidden md:flex items-center space-x-1">
                {['features', 'pricing', 'partners', 'resources'].map((item) => (
                  <button key={item} onClick={() => smoothScroll(item)} className="px-4 py-2 text-white/80 hover:text-white text-sm font-medium rounded-lg hover:bg-white/10 transition-all capitalize">
                    {item}
                  </button>
                ))}
                <button onClick={() => setShowContactModal(true)} className="px-4 py-2 text-white/80 hover:text-white text-sm font-medium rounded-lg hover:bg-white/10 transition-all">
                  Contact Us
                </button>
                <button onClick={() => smoothScroll('waitlist')} className="ml-2 bg-white text-purple-600 px-5 py-2.5 rounded-xl text-sm font-semibold hover:shadow-lg hover:bg-purple-50 transition-all hover:-translate-y-0.5">
                  Join the Revolution
                </button>
              </div>
            </div>
          </div>
          
          {mobileMenuOpen && (
            <div className="md:hidden bg-indigo-700/95 border-t border-white/10 py-3 px-4 space-y-1">
              {['features', 'pricing', 'partners', 'resources'].map((item) => (
                <button key={item} onClick={() => smoothScroll(item)} className="block w-full text-left py-3 px-4 text-white/90 hover:bg-white/10 rounded-xl capitalize">
                  {item}
                </button>
              ))}
              <button onClick={() => { setShowContactModal(true); setMobileMenuOpen(false); }} className="block w-full text-left py-3 px-4 text-white/90 hover:bg-white/10 rounded-xl">
                Contact Us
              </button>
              <button onClick={() => smoothScroll('waitlist')} className="w-full mt-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-xl font-semibold">
                Join the Revolution
              </button>
            </div>
          )}
        </nav>

        {/* Hero Section */}
        <section className="pt-24 sm:pt-28 pb-8 sm:pb-16 px-4 sm:px-6 overflow-hidden">
          <div className="max-w-7xl mx-auto">
            
            {/* Top Row - Text + Form */}
            <div className="text-center max-w-5xl mx-auto mb-8 sm:mb-12">
              {/* Status Badge */}
              <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-purple-100 to-indigo-100 border border-purple-200/50 rounded-full px-4 py-2 mb-6">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
                </span>
                <span className="text-sm font-semibold text-purple-900">Launching Q1 2026</span>
                <span className="text-xs bg-purple-600 text-white px-2 py-0.5 rounded-full">iOS • Android • Web</span>
              </div>
              
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 leading-[1.1] mb-4 sm:mb-6">
                Your Intelligent <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Health</span>
                <span className="sm:hidden"><br />and </span>
                <span className="hidden sm:inline"> and</span>
                <br className="hidden sm:block" />
                <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Pain Management</span>
                <span className="sm:hidden"><br /></span>
                <span className="hidden sm:inline"> </span>
                Companion
              </h1>
              
              <p className="text-sm sm:text-base lg:text-lg text-gray-600 mb-6 sm:mb-8 max-w-3xl mx-auto leading-relaxed">
                <strong className="text-gray-800">Recalibrate App</strong> — Track over 18 Health Variables including Pain, Exercise, Nutrition, Anxiety and Sleep. Discover patterns with Analytics and Recalibrate AI, access guided tools and exercises, learn from our Recalibrate Academy and connect to clinicians, researchers and carers easily.
              </p>
              
              {/* Email Form */}
              <form onSubmit={handleEmailSubmit} className="max-w-lg mx-auto mb-6" id="waitlist">
                <div className="relative bg-white rounded-2xl shadow-xl shadow-purple-500/10 border border-purple-100 p-1.5">
                  <div className="flex flex-col sm:flex-row gap-2">
                    <input
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="flex-1 px-5 py-3.5 bg-gray-50/50 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-purple-500/20 transition-all"
                      required
                    />
                    <button
                      type="submit"
                      disabled={loading}
                      className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3.5 rounded-xl font-semibold hover:shadow-lg hover:shadow-purple-500/25 transition-all disabled:opacity-60 flex items-center justify-center gap-2 hover:-translate-y-0.5"
                    >
                      {loading ? (
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
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
              
              {/* Waitlist Count */}
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full px-6 py-2.5 shadow-lg shadow-purple-500/25">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="font-bold text-white text-lg">{waitlistCount > 0 ? waitlistCount.toLocaleString() : '...'}+</span>
                <span className="text-white/80 text-sm">joined</span>
              </div>
            </div>

            {/* Phone Mockup - Centered Below */}
            <div className="relative flex justify-center">
              {/* Phone Frame - smaller on mobile */}
              <div className="relative w-[180px] h-[380px] sm:w-[220px] sm:h-[460px] lg:w-[280px] lg:h-[580px] bg-gray-900 rounded-[2rem] sm:rounded-[2.5rem] lg:rounded-[3rem] p-1.5 sm:p-2 lg:p-3 shadow-2xl shadow-purple-500/20">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-16 sm:w-20 lg:w-28 h-4 sm:h-5 lg:h-7 bg-gray-900 rounded-b-xl lg:rounded-b-2xl z-10"></div>
                <div className="w-full h-full bg-white rounded-[1.5rem] sm:rounded-[2rem] lg:rounded-[2.3rem] overflow-hidden">
                  <img 
                    src="/app-screenshot-optimized.jpg" 
                    alt="Recalibrate App" 
                    className="w-full h-full object-cover object-top"
                    width="560"
                    height="1102"
                    loading="eager"
                    decoding="async"
                  />
                </div>
              </div>
              
              {/* Floating Notification Cards - Mobile (smaller, tighter) */}
              <div className="absolute left-0 top-4 bg-white rounded-lg shadow-lg border border-gray-100 p-2 max-w-[100px] animate-float lg:hidden">
                <div className="flex items-center gap-1.5">
                  <div className="w-6 h-6 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-xs">📊</span>
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 text-[9px]">18 Variables</p>
                    <p className="text-[7px] text-gray-500">Pain & mood</p>
                  </div>
                </div>
              </div>
              
              <div className="absolute right-0 top-16 bg-white rounded-lg shadow-lg border border-gray-100 p-2 max-w-[95px] animate-float-delayed lg:hidden">
                <div className="flex items-center gap-1.5">
                  <div className="w-6 h-6 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-xs">🔔</span>
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 text-[9px]">Reminders</p>
                    <p className="text-[7px] text-gray-500">Stay on track</p>
                  </div>
                </div>
              </div>
              
              <div className="absolute left-0 bottom-24 bg-white rounded-lg shadow-lg border border-gray-100 p-2 max-w-[90px] animate-float lg:hidden">
                <div className="flex items-center gap-1.5">
                  <div className="w-6 h-6 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-xs">🤖</span>
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 text-[9px]">AI Insights</p>
                    <p className="text-[7px] text-gray-500">Patterns</p>
                  </div>
                </div>
              </div>
              
              <div className="absolute right-0 bottom-8 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg shadow-lg p-2 max-w-[85px] text-white animate-float-delayed lg:hidden">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs">🧠</span>
                  <div>
                    <p className="font-bold text-[9px]">90+ Lessons</p>
                    <p className="text-[7px] text-white/80">Academy</p>
                  </div>
                </div>
              </div>

              {/* Desktop Floating Cards - More labels */}
              {/* Track 18 Variables - BLUE background */}
              <div className="absolute left-[18%] top-8 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl shadow-xl p-4 max-w-[200px] animate-float hidden lg:block text-white">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
                    <span className="text-lg">📊</span>
                  </div>
                  <div>
                    <p className="font-bold text-sm">Track 18 Variables</p>
                    <p className="text-xs text-white/80">Pain, sleep, mood & energy</p>
                  </div>
                </div>
              </div>
              
              <div className="absolute right-[18%] top-16 bg-white rounded-2xl shadow-xl border border-gray-100 p-4 max-w-[190px] animate-float-delayed hidden lg:block">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <span className="text-lg">🔔</span>
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 text-sm">Smart Reminders</p>
                    <p className="text-xs text-gray-500">Never miss a check-in</p>
                  </div>
                </div>
              </div>

              {/* Goal Tracking - now on left */}
              <div className="absolute left-[12%] top-44 bg-white rounded-2xl shadow-xl border border-gray-100 p-4 max-w-[180px] animate-float-delayed hidden lg:block">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <span className="text-lg">🎯</span>
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 text-sm">Goal Tracking</p>
                    <p className="text-xs text-gray-500">Set & achieve targets</p>
                  </div>
                </div>
              </div>

              {/* Care Team - PINK background - now on right */}
              <div className="absolute right-[12%] top-48 bg-gradient-to-r from-pink-500 to-rose-500 rounded-2xl shadow-xl p-4 max-w-[170px] animate-float hidden lg:block text-white">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
                    <span className="text-lg">👥</span>
                  </div>
                  <div>
                    <p className="font-bold text-sm">Care Team</p>
                    <p className="text-xs text-white/80">Share with doctors</p>
                  </div>
                </div>
              </div>
              
              <div className="absolute left-[16%] bottom-32 bg-white rounded-2xl shadow-xl border border-gray-100 p-4 max-w-[190px] animate-float hidden lg:block">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <span className="text-lg">🤖</span>
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 text-sm">AI Insights</p>
                    <p className="text-xs text-gray-500">Patterns detected!</p>
                  </div>
                </div>
              </div>

              <div className="absolute right-[16%] bottom-40 bg-white rounded-2xl shadow-xl border border-gray-100 p-4 max-w-[180px] animate-float-delayed hidden lg:block">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <span className="text-lg">📈</span>
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 text-sm">Stability Score</p>
                    <p className="text-xs text-gray-500">Real-time analytics</p>
                  </div>
                </div>
              </div>
              
              <div className="absolute right-[20%] bottom-12 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl shadow-xl p-4 max-w-[170px] text-white animate-float-delayed hidden lg:block">
                <div className="flex items-center gap-2">
                  <span className="text-lg">🧠</span>
                  <div>
                    <p className="font-bold text-sm">90+ Lessons</p>
                    <p className="text-xs text-white/80">Recalibrate Academy</p>
                  </div>
                </div>
              </div>

              <div className="absolute left-[20%] bottom-8 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl shadow-xl p-4 max-w-[160px] text-white animate-float hidden lg:block">
                <div className="flex items-center gap-2">
                  <span className="text-lg">✨</span>
                  <div>
                    <p className="font-bold text-sm">200+ Tools</p>
                    <p className="text-xs text-white/80">& Resources</p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </section>




        {/* Features Section - 200+ Tools & Resources - Matching Subscription Style */}
        <section id="features" className="py-12 sm:py-16 px-4 sm:px-6 scroll-mt-20 bg-gradient-to-b from-white to-purple-50/30">
          <div className="max-w-5xl mx-auto">
            {/* Section Header */}
            <div className="text-center mb-8">
              <h2 className="text-2xl sm:text-4xl font-bold text-gray-900 mb-3">
                200+ Tools & Resources
              </h2>
              <p className="text-gray-600 mb-6">
                Everything you need to manage your chronic pain journey
              </p>
            </div>

            {/* Feature Cards - Matching Subscription Layout */}
            <div className="space-y-6">
              
              {/* Feature 1: Smart Tracker */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center p-6 lg:p-8 bg-white rounded-2xl border-2 border-blue-200 shadow-sm hover:shadow-lg transition-shadow">
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-3xl">📊</span>
                    <h3 className="text-2xl font-bold text-gray-900">Smart Tracker</h3>
                    <span className="bg-gray-100 text-gray-600 text-xs font-bold px-2 py-1 rounded-full">FREE</span>
                  </div>
                  <p className="text-gray-600 mb-4">
                    Log pain, sleep, mood & energy across 8 health systems with our comprehensive tracking tools.
                  </p>
                  <ul className="space-y-2 mb-6">
                    {["18+ health variables tracked", "Pain & mood monitoring", "Sleep quality analysis", "Medication tracking", "Energy level logging"].map((feature, i) => (
                      <li key={i} className="flex items-center gap-2 text-gray-700">
                        <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-8 border-2 border-blue-200 text-center">
                  <div className="text-6xl mb-4">🎯</div>
                  <p className="text-2xl font-bold text-gray-900 mb-2">18+ Variables</p>
                  <p className="text-gray-600">Across 8 biological systems</p>
                </div>
              </div>

              {/* Feature 2: Analytics Dashboard */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center p-6 lg:p-8 bg-white rounded-2xl border-2 border-indigo-200 shadow-sm hover:shadow-lg transition-shadow">
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-3xl">📈</span>
                    <h3 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h3>
                    <span className="bg-gray-100 text-gray-600 text-xs font-bold px-2 py-1 rounded-full">FREE</span>
                  </div>
                  <p className="text-gray-600 mb-4">
                    Your personal Stability Score calculated from 18 variables. Visualize trends and patterns.
                  </p>
                  <ul className="space-y-2 mb-6">
                    {["Stability score tracking", "Trend analysis & visualization", "Pattern detection algorithms", "Doctor-ready reports", "Historical data comparison"].map((feature, i) => (
                      <li key={i} className="flex items-center gap-2 text-gray-700">
                        <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-8 border-2 border-indigo-200 text-center">
                  <div className="text-6xl mb-4">📊</div>
                  <p className="text-2xl font-bold text-gray-900 mb-2">Stability Score</p>
                  <p className="text-gray-600">Real-time pattern detection</p>
                </div>
              </div>

              {/* Feature 3: Recalibrate Academy */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center p-6 lg:p-8 bg-white rounded-2xl border-2 border-emerald-200 shadow-sm hover:shadow-lg transition-shadow">
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-3xl">🎓</span>
                    <h3 className="text-2xl font-bold text-gray-900">Recalibrate Academy</h3>
                    <span className="bg-emerald-100 text-emerald-700 text-xs font-bold px-2 py-1 rounded-full">GO</span>
                  </div>
                  <p className="text-gray-600 mb-4">
                    90+ lessons on pain science. Earn XP and badges as you learn evidence-based strategies.
                  </p>
                  <ul className="space-y-2 mb-6">
                    {["90+ educational lessons", "Pain neuroscience modules", "Foundations & strategies", "XP & badge rewards", "Self-paced learning"].map((feature, i) => (
                      <li key={i} className="flex items-center gap-2 text-gray-700">
                        <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl p-8 border-2 border-emerald-200 text-center">
                  <div className="text-6xl mb-4">🧠</div>
                  <p className="text-2xl font-bold text-gray-900 mb-2">90+ Lessons</p>
                  <p className="text-gray-600">Evidence-based pain education</p>
                </div>
              </div>

              {/* Feature 4: Tools & Exercises */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center p-6 lg:p-8 bg-white rounded-2xl border-2 border-orange-200 shadow-sm hover:shadow-lg transition-shadow">
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-3xl">🛠️</span>
                    <h3 className="text-2xl font-bold text-gray-900">Tools & Exercises</h3>
                    <span className="bg-emerald-100 text-emerald-700 text-xs font-bold px-2 py-1 rounded-full">GO</span>
                  </div>
                  <p className="text-gray-600 mb-4">
                    Journaling, goal tracking, daily inspiration, and guided therapeutic exercises.
                  </p>
                  <ul className="space-y-2 mb-6">
                    {["Reflective journaling", "Goal setting & tracking", "Daily inspiration quotes", "Guided exercises", "CBT & mindfulness tools"].map((feature, i) => (
                      <li key={i} className="flex items-center gap-2 text-gray-700">
                        <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl p-8 border-2 border-orange-200 text-center">
                  <div className="text-6xl mb-4">✨</div>
                  <p className="text-2xl font-bold text-gray-900 mb-2">Therapeutic Tools</p>
                  <p className="text-gray-600">CBT, Mindfulness & More</p>
                </div>
              </div>

              {/* Feature 5: Recalibrate AI */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center p-6 lg:p-8 bg-white rounded-2xl border-2 border-purple-500 shadow-lg shadow-purple-500/10 hover:shadow-xl transition-shadow relative">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-lg">AI Powered</span>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-3xl">🤖</span>
                    <h3 className="text-2xl font-bold text-gray-900">Recalibrate AI</h3>
                    <span className="bg-purple-100 text-purple-700 text-xs font-bold px-2 py-1 rounded-full">PRO</span>
                  </div>
                  <p className="text-gray-600 mb-4">
                    Your AI companion powered by Gemini 2.0 Flash. Get personalized insights and research assistance.
                  </p>
                  <ul className="space-y-2 mb-6">
                    {["Chat with health context", "Pain science research", "Pattern analysis", "Personalized suggestions", "24/7 AI availability"].map((feature, i) => (
                      <li key={i} className="flex items-center gap-2 text-gray-700">
                        <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="bg-gradient-to-br from-purple-50 to-violet-50 rounded-xl p-8 border-2 border-purple-200 text-center">
                  <div className="text-6xl mb-4">💬</div>
                  <p className="text-2xl font-bold text-gray-900 mb-2">Gemini 2.0 Flash</p>
                  <p className="text-gray-600">AI-powered health insights</p>
                </div>
              </div>

              {/* Feature 6: Care Team */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center p-6 lg:p-8 bg-white rounded-2xl border-2 border-pink-200 shadow-sm hover:shadow-lg transition-shadow">
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-3xl">👥</span>
                    <h3 className="text-2xl font-bold text-gray-900">Care Team</h3>
                    <span className="bg-purple-100 text-purple-700 text-xs font-bold px-2 py-1 rounded-full">PRO</span>
                  </div>
                  <p className="text-gray-600 mb-4">
                    Connect clinicians, researchers, family members, and friends with dedicated dashboards.
                  </p>
                  <ul className="space-y-2 mb-6">
                    {["Clinician analytics access", "Research data sharing", "Family support dashboards", "Progress report exports", "Collaborative care coordination"].map((feature, i) => (
                      <li key={i} className="flex items-center gap-2 text-gray-700">
                        <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="bg-gradient-to-br from-pink-50 to-rose-50 rounded-xl p-8 border-2 border-pink-200 text-center">
                  <div className="text-6xl mb-4">🩺</div>
                  <p className="text-2xl font-bold text-gray-900 mb-2">Connected Care</p>
                  <p className="text-gray-600">Clinicians, Family & Friends</p>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* Subscription Plans - Expanded with Toggle */}
        <section id="pricing" className="py-12 sm:py-16 px-4 sm:px-6 scroll-mt-20 bg-gradient-to-b from-purple-50/50 to-white">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-2xl sm:text-4xl font-bold text-gray-900 mb-3">Simple, Transparent Pricing</h2>
              <p className="text-gray-600 mb-6">Choose the plan that fits your journey</p>
            </div>
            
            {/* Pricing Cards - Grid Layout like Features */}
            <div className="space-y-6">
              {/* Free Plan */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center p-6 lg:p-8 bg-white rounded-2xl border-2 border-gray-200 shadow-sm hover:shadow-lg transition-shadow">
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-3xl">🆓</span>
                    <h3 className="text-2xl font-bold text-gray-900">Free</h3>
                  </div>
                  <div className="mb-4">
                    <span className="text-4xl font-bold text-gray-900">$0</span>
                    <p className="text-gray-600 mt-1">Essential tracking</p>
                  </div>
                  <ul className="space-y-2 mb-6">
                    {subscriptionPlans[0].features.map((feature, i) => (
                      <li key={i} className="flex items-center gap-2 text-gray-700">
                        <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <button onClick={() => document.getElementById('waitlist')?.scrollIntoView({ behavior: 'smooth', block: 'center' })} className="bg-gray-100 text-gray-700 px-8 py-3 rounded-xl font-semibold hover:bg-gray-200 transition-all">
                    Start Free
                  </button>
                </div>
                <div className="bg-gradient-to-br from-gray-50 to-slate-50 rounded-xl p-8 border-2 border-gray-200 text-center">
                  <div className="text-6xl mb-4">📊</div>
                  <p className="text-2xl font-bold text-gray-900 mb-2">18+ Variables</p>
                  <p className="text-gray-600">Track everything that matters</p>
                </div>
              </div>

              {/* Go Plan */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center p-6 lg:p-8 bg-white rounded-2xl border-2 border-emerald-200 shadow-sm hover:shadow-lg transition-shadow relative">
                {/* Toggle in top right corner - BIGGER */}
                <div className="absolute top-4 right-4 inline-flex items-center gap-2 bg-emerald-100 p-1.5 rounded-xl shadow-sm">
                  <button 
                    onClick={() => setGoPlanYearly(false)}
                    className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${!goPlanYearly ? 'bg-white text-emerald-700 shadow-md' : 'text-emerald-600'}`}
                  >
                    Monthly
                  </button>
                  <button 
                    onClick={() => setGoPlanYearly(true)}
                    className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${goPlanYearly ? 'bg-white text-emerald-700 shadow-md' : 'text-emerald-600'}`}
                  >
                    Yearly
                  </button>
                </div>
                
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-3xl">🚀</span>
                    <h3 className="text-2xl font-bold text-gray-900">Go</h3>
                  </div>
                  <div className="mb-4">
                    <div className="mb-2">
                      <span className="text-4xl font-bold text-gray-900">
                        ${goPlanYearly ? (parseFloat(subscriptionPlans[1].yearly) / 12).toFixed(2) : subscriptionPlans[1].monthly}
                      </span>
                      <span className="text-lg text-gray-500">/mo</span>
                    </div>
                    {goPlanYearly && (
                      <p className="text-sm text-gray-600 mb-2">Billed yearly at ${subscriptionPlans[1].yearly}</p>
                    )}
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-gray-600">${subscriptionPlans[1].monthly}/mo monthly</span>
                      <span className="text-gray-400">or</span>
                      <span className="text-gray-600">${(parseFloat(subscriptionPlans[1].yearly) / 12).toFixed(2)}/mo yearly</span>
                    </div>
                    <div className="mt-2">
                      <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold">Save 35% with yearly</span>
                    </div>
                  </div>
                  <ul className="space-y-2 mb-6">
                    {subscriptionPlans[1].features.map((feature, i) => (
                      <li key={i} className="flex items-center gap-2 text-gray-700">
                        <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <button onClick={() => document.getElementById('waitlist')?.scrollIntoView({ behavior: 'smooth', block: 'center' })} className="bg-emerald-500 text-white px-8 py-3 rounded-xl font-semibold hover:bg-emerald-600 transition-all">
                    Get Go
                  </button>
                </div>
                <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-xl p-8 border-2 border-emerald-200 text-center">
                  <div className="text-6xl mb-4">🎓</div>
                  <p className="text-2xl font-bold text-gray-900 mb-2">Academy & Tools</p>
                  <p className="text-gray-600">Courses, Guides & Exercises</p>
                </div>
              </div>

              {/* Pro Plan */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center p-6 lg:p-8 bg-white rounded-2xl border-2 border-purple-500 shadow-lg shadow-purple-500/10 hover:shadow-xl transition-shadow relative">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-lg">Most Popular</span>
                </div>
                
                {/* Toggle in top right corner - BIGGER */}
                <div className="absolute top-4 right-4 inline-flex items-center gap-2 bg-purple-100 p-1.5 rounded-xl shadow-sm">
                  <button 
                    onClick={() => setProPlanYearly(false)}
                    className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${!proPlanYearly ? 'bg-white text-purple-700 shadow-md' : 'text-purple-600'}`}
                  >
                    Monthly
                  </button>
                  <button 
                    onClick={() => setProPlanYearly(true)}
                    className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${proPlanYearly ? 'bg-white text-purple-700 shadow-md' : 'text-purple-600'}`}
                  >
                    Yearly
                  </button>
                </div>
                
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-3xl">⭐</span>
                    <h3 className="text-2xl font-bold text-gray-900">Pro</h3>
                  </div>
                  <div className="mb-4">
                    <div className="mb-2">
                      <span className="text-4xl font-bold text-gray-900">
                        ${proPlanYearly ? (parseFloat(subscriptionPlans[2].yearly) / 12).toFixed(2) : subscriptionPlans[2].monthly}
                      </span>
                      <span className="text-lg text-gray-500">/mo</span>
                    </div>
                    {proPlanYearly && (
                      <p className="text-sm text-gray-600 mb-2">Billed yearly at ${subscriptionPlans[2].yearly}</p>
                    )}
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-gray-600">${subscriptionPlans[2].monthly}/mo monthly</span>
                      <span className="text-gray-400">or</span>
                      <span className="text-gray-600">${(parseFloat(subscriptionPlans[2].yearly) / 12).toFixed(2)}/mo yearly</span>
                    </div>
                    <div className="mt-2">
                      <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold">Save 29% with yearly</span>
                    </div>
                  </div>
                  <ul className="space-y-2 mb-6">
                    {subscriptionPlans[2].features.map((feature, i) => (
                      <li key={i} className="flex items-center gap-2 text-gray-700">
                        <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <button onClick={() => document.getElementById('waitlist')?.scrollIntoView({ behavior: 'smooth', block: 'center' })} className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-8 py-3 rounded-xl font-semibold hover:shadow-lg hover:shadow-purple-500/25 transition-all">
                    Go Pro
                  </button>
                </div>
                <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl p-8 border-2 border-purple-200 text-center">
                  <div className="text-6xl mb-4">🤖</div>
                  <p className="text-2xl font-bold text-gray-900 mb-2">AI + Care Team</p>
                  <p className="text-gray-600">Clinicians, Researchers & Family</p>
                </div>
              </div>

              {/* Super Plan */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center p-6 lg:p-8 bg-white rounded-2xl border-2 border-amber-300 shadow-sm hover:shadow-lg transition-shadow relative">
                {/* Toggle in top right corner - BIGGER */}
                <div className="absolute top-4 right-4 inline-flex items-center gap-2 bg-amber-100 p-1.5 rounded-xl shadow-sm">
                  <button 
                    onClick={() => setSuperPlanYearly(false)}
                    className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${!superPlanYearly ? 'bg-white text-amber-700 shadow-md' : 'text-amber-600'}`}
                  >
                    Monthly
                  </button>
                  <button 
                    onClick={() => setSuperPlanYearly(true)}
                    className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${superPlanYearly ? 'bg-white text-amber-700 shadow-md' : 'text-amber-600'}`}
                  >
                    Yearly
                  </button>
                </div>
                
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-3xl">💎</span>
                    <h3 className="text-2xl font-bold text-gray-900">Super</h3>
                  </div>
                  <div className="mb-4">
                    <div className="mb-2">
                      <span className="text-4xl font-bold text-gray-900">
                        ${superPlanYearly ? (parseFloat(subscriptionPlans[3].yearly) / 12).toFixed(2) : subscriptionPlans[3].monthly}
                      </span>
                      <span className="text-lg text-gray-500">/mo</span>
                    </div>
                    {superPlanYearly && (
                      <p className="text-sm text-gray-600 mb-2">Billed yearly at ${subscriptionPlans[3].yearly}</p>
                    )}
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-gray-600">${subscriptionPlans[3].monthly}/mo monthly</span>
                      <span className="text-gray-400">or</span>
                      <span className="text-gray-600">${(parseFloat(subscriptionPlans[3].yearly) / 12).toFixed(2)}/mo yearly</span>
                    </div>
                    <div className="mt-2">
                      <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold">Save 17% with yearly</span>
                    </div>
                  </div>
                  <ul className="space-y-2 mb-6">
                    {subscriptionPlans[3].features.map((feature, i) => (
                      <li key={i} className="flex items-center gap-2 text-gray-700">
                        <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <button onClick={() => document.getElementById('waitlist')?.scrollIntoView({ behavior: 'smooth', block: 'center' })} className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-8 py-3 rounded-xl font-semibold hover:shadow-lg transition-all">
                    Get Super
                  </button>
                </div>
                <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-8 border-2 border-amber-200 text-center">
                  <div className="text-6xl mb-4">💎</div>
                  <p className="text-2xl font-bold text-gray-900 mb-2">More Everything</p>
                  <p className="text-gray-600">AI Credits + Customizations</p>
                </div>
              </div>

              {/* Lifetime Super */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center p-6 lg:p-8 bg-white rounded-2xl border-2 border-amber-400 shadow-lg hover:shadow-xl transition-shadow">
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-3xl">♾️</span>
                    <h3 className="text-2xl font-bold text-gray-900">Lifetime Super</h3>
                  </div>
                  <div className="mb-4">
                    <span className="text-4xl font-bold text-gray-900">${subscriptionPlans[4].monthly}</span>
                    <span className="text-lg text-gray-500"> once</span>
                    <p className="text-gray-600 mt-1">Super forever</p>
                  </div>
                  <ul className="space-y-2 mb-6">
                    {subscriptionPlans[4].features.map((feature, i) => (
                      <li key={i} className="flex items-center gap-2 text-gray-700">
                        <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <button onClick={() => document.getElementById('waitlist')?.scrollIntoView({ behavior: 'smooth', block: 'center' })} className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-8 py-3 rounded-xl font-semibold hover:shadow-lg transition-all">
                    Get Lifetime Super
                  </button>
                </div>
                <div className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-xl p-8 border-2 border-amber-300 text-center">
                  <div className="text-6xl mb-4">⭐</div>
                  <p className="text-2xl font-bold text-gray-900 mb-2">VIP Access</p>
                  <p className="text-gray-600">Lifetime updates & features</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Evidence-Based Approaches */}
        <section className="py-12 sm:py-16 px-4 sm:px-6 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-8">
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">Built on Evidence-Based Science</h3>
              <p className="text-gray-600 text-sm sm:text-base">Recalibrate App integrates proven approaches from leading pain research</p>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 mb-6">
              {[
                { icon: "🧠", label: "Pain Neuroscience", color: "from-blue-500 to-indigo-500" },
                { icon: "💭", label: "CBT Therapy", color: "from-purple-500 to-violet-500" },
                { icon: "🧘", label: "Mindfulness", color: "from-emerald-500 to-teal-500" },
                { icon: "🏃", label: "Movement Therapy", color: "from-orange-500 to-amber-500" },
                { icon: "📈", label: "Graded Exposure", color: "from-pink-500 to-rose-500" },
                { icon: "😴", label: "Sleep Science", color: "from-indigo-500 to-blue-500" }
              ].map((item, i) => (
                <div key={i} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 text-center hover:shadow-md transition-all hover:-translate-y-1">
                  <div className={`w-12 h-12 mx-auto mb-2 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center text-xl shadow-lg`}>
                    {item.icon}
                  </div>
                  <p className="text-xs sm:text-sm font-semibold text-gray-800">{item.label}</p>
                </div>
              ))}
            </div>
            
            <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
              {['Acceptance & Commitment', 'Pacing Strategies', 'Nutrition Science', 'Stress Management', 'Biofeedback', 'Goal Setting', 'Self-Compassion', 'Activity Tracking', 'Therapeutic Alliance', 'Neuroplasticity', 'Systems Biology', 'Precision Medicine'].map((item, i) => (
                <span key={i} className="bg-white/80 backdrop-blur text-gray-700 border border-gray-200 px-3 py-1.5 rounded-full text-xs sm:text-sm font-medium hover:bg-white hover:border-purple-300 transition-all">
                  {item}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* Clinician & Partnership Section - Matching New Style */}
        <section id="partners" className="py-12 sm:py-16 px-4 sm:px-6 bg-gradient-to-b from-white to-purple-50/30 scroll-mt-20">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-2xl sm:text-4xl font-bold text-gray-900 mb-3">
                Clinicians & Partners
              </h2>
              <p className="text-gray-600 mb-6">
                Join us in revolutionizing chronic pain management
              </p>
            </div>
            
            {/* Partnership Cards - Matching Subscription Layout */}
            <div className="space-y-6">
              {/* Healthcare Clinics */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center p-6 lg:p-8 bg-white rounded-2xl border-2 border-blue-200 shadow-sm hover:shadow-lg transition-shadow">
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-3xl">🩺</span>
                    <h3 className="text-2xl font-bold text-gray-900">Healthcare Clinics</h3>
                  </div>
                  <p className="text-gray-600 mb-4">
                    Integrate Recalibrate into your practice. Help your patients track their progress between appointments.
                  </p>
                  <ul className="space-y-2 mb-6">
                    {["Multi-patient clinician dashboard", "Care team integration", "HIPAA-compliant data sharing", "Progress reports for appointments", "Patient engagement tools"].map((feature, i) => (
                      <li key={i} className="flex items-center gap-2 text-gray-700">
                        <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <button onClick={() => setPartnerFormOpen('clinic')} className="bg-blue-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-600 transition-all flex items-center gap-2">
                    Partner with us <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
                <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-8 border-2 border-blue-200 text-center">
                  <div className="text-6xl mb-4">🏥</div>
                  <p className="text-2xl font-bold text-gray-900 mb-2">Clinical Dashboard</p>
                  <p className="text-gray-600">Track all your patients</p>
                </div>
              </div>

              {/* Research Collaborations */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center p-6 lg:p-8 bg-white rounded-2xl border-2 border-purple-200 shadow-sm hover:shadow-lg transition-shadow">
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-3xl">🔬</span>
                    <h3 className="text-2xl font-bold text-gray-900">Research Collaborations</h3>
                  </div>
                  <p className="text-gray-600 mb-4">
                    Access anonymized, aggregated data for pain research. Advance the science of chronic pain management.
                  </p>
                  <ul className="space-y-2 mb-6">
                    {["Longitudinal pain datasets", "Multi-variable correlations", "Ethical data partnerships", "IRB-approved protocols", "Academic collaboration"].map((feature, i) => (
                      <li key={i} className="flex items-center gap-2 text-gray-700">
                        <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <button onClick={() => setPartnerFormOpen('research')} className="bg-purple-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-purple-600 transition-all flex items-center gap-2">
                    Collaborate with us <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
                <div className="bg-gradient-to-br from-purple-50 to-violet-50 rounded-xl p-8 border-2 border-purple-200 text-center">
                  <div className="text-6xl mb-4">📊</div>
                  <p className="text-2xl font-bold text-gray-900 mb-2">Research Data</p>
                  <p className="text-gray-600">Anonymized pain insights</p>
                </div>
              </div>

              {/* Investors */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center p-6 lg:p-8 bg-white rounded-2xl border-2 border-emerald-200 shadow-sm hover:shadow-lg transition-shadow">
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-3xl">🤝</span>
                    <h3 className="text-2xl font-bold text-gray-900">Become an Investor</h3>
                  </div>
                  <p className="text-gray-600 mb-4">
                    Join us in building the future of chronic pain management. We're raising our seed round to accelerate.
                  </p>
                  <ul className="space-y-2 mb-6">
                    {["$50B+ chronic pain market", "AI-powered health insights", "Scalable B2B & B2C model", "Strong founding team", "Clear path to profitability"].map((feature, i) => (
                      <li key={i} className="flex items-center gap-2 text-gray-700">
                        <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <button onClick={() => setPartnerFormOpen('investor')} className="bg-emerald-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-emerald-600 transition-all flex items-center gap-2">
                    Investor Prospectus <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
                <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-xl p-8 border-2 border-emerald-200 text-center">
                  <div className="text-6xl mb-4">📈</div>
                  <p className="text-2xl font-bold text-gray-900 mb-2">$1.5M Seed Round</p>
                  <p className="text-gray-600">Building the future</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Recalibrate Resources Section */}
        <section id="resources" className="py-10 lg:py-24 px-4 sm:px-6 scroll-mt-20">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-6 lg:mb-12">
              <h2 className="text-2xl lg:text-5xl font-bold text-gray-900 mb-2 lg:mb-4">
                Recalibrate Resources
              </h2>
              <p className="text-sm lg:text-lg text-gray-600 max-w-2xl mx-auto">
                Start your pain management journey today.
              </p>
            </div>
            
            {/* Mobile: Compact 3-column grid with more info */}
            <div className="grid grid-cols-3 gap-2 lg:hidden">
              <a 
                href="https://recalibrate.beehiiv.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-white rounded-xl p-3 border border-purple-100 shadow-sm text-center hover:shadow-md transition-all"
              >
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <span className="text-xl">📬</span>
                </div>
                <h3 className="text-xs font-bold text-gray-900 mb-1">Newsletter</h3>
                <p className="text-[8px] text-gray-500 mb-1.5 leading-tight">Weekly pain science tips & research updates</p>
                <span className="text-[9px] text-purple-600 font-medium">Subscribe →</span>
              </a>
              
              <a 
                href="https://www.etsy.com/shop/RecalibratePain" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-white rounded-xl p-3 border border-purple-100 shadow-sm text-center hover:shadow-md transition-all"
              >
                <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-amber-500 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <span className="text-xl">📚</span>
                </div>
                <h3 className="text-xs font-bold text-gray-900 mb-1">Products</h3>
                <p className="text-[8px] text-gray-500 mb-1.5 leading-tight">Courses, worksheets & educational guides</p>
                <span className="text-[9px] text-purple-600 font-medium">Browse →</span>
              </a>
              
              <a 
                href="https://ko-fi.com/N4N21O1R1W" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-white rounded-xl p-3 border border-purple-100 shadow-sm text-center hover:shadow-md transition-all"
              >
                <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-rose-500 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <span className="text-xl">☕</span>
                </div>
                <h3 className="text-xs font-bold text-gray-900 mb-1">Support</h3>
                <p className="text-[8px] text-gray-500 mb-1.5 leading-tight">Help keep our free resources available</p>
                <span className="text-[9px] text-purple-600 font-medium">Donate →</span>
              </a>
            </div>

            {/* Desktop: Full cards - all same white style */}
            <div className="hidden lg:grid lg:grid-cols-3 gap-6">
              {/* Newsletter - Purple gradient */}
              <a 
                href="https://recalibrate.beehiiv.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="relative bg-gradient-to-br from-purple-50 to-indigo-50 rounded-2xl p-8 border-2 border-purple-200 hover:border-purple-400 hover:shadow-2xl hover:shadow-purple-500/20 transition-all group overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-500/10 to-indigo-500/10 rounded-full -mr-16 -mt-16"></div>
                <div className="relative">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-purple-500/30 group-hover:scale-110 group-hover:rotate-3 transition-all">
                    <span className="text-3xl">📬</span>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">Recalibrate Newsletter</h3>
                  <p className="text-gray-700 mb-6 leading-relaxed">
                    Weekly insights on chronic pain management, research updates, and practical tips delivered to your inbox.
                  </p>
                  <div className="inline-flex items-center gap-2 bg-white px-5 py-2.5 rounded-xl font-semibold text-purple-600 shadow-md group-hover:shadow-lg group-hover:bg-purple-600 group-hover:text-white transition-all">
                    Subscribe Free <ExternalLink className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </a>
              
              {/* Courses and Products - Orange gradient */}
              <a 
                href="https://www.etsy.com/shop/RecalibratePain" 
                target="_blank" 
                rel="noopener noreferrer"
                className="relative bg-gradient-to-br from-orange-50 to-amber-50 rounded-2xl p-8 border-2 border-orange-200 hover:border-orange-400 hover:shadow-2xl hover:shadow-orange-500/20 transition-all group overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-orange-500/10 to-amber-500/10 rounded-full -mr-16 -mt-16"></div>
                <div className="relative">
                  <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-amber-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-orange-500/30 group-hover:scale-110 group-hover:rotate-3 transition-all">
                    <span className="text-3xl">📚</span>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">Courses & Products</h3>
                  <p className="text-gray-700 mb-6 leading-relaxed">
                    Explore our pain education resources, worksheets, and guides to start your journey.
                  </p>
                  <div className="inline-flex items-center gap-2 bg-white px-5 py-2.5 rounded-xl font-semibold text-orange-600 shadow-md group-hover:shadow-lg group-hover:bg-orange-600 group-hover:text-white transition-all">
                    Browse Products <ExternalLink className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </a>
              
              {/* Support - Pink/Rose gradient */}
              <a 
                href="https://ko-fi.com/N4N21O1R1W" 
                target="_blank" 
                rel="noopener noreferrer"
                className="relative bg-gradient-to-br from-pink-50 to-rose-50 rounded-2xl p-8 border-2 border-pink-200 hover:border-pink-400 hover:shadow-2xl hover:shadow-pink-500/20 transition-all group overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-pink-500/10 to-rose-500/10 rounded-full -mr-16 -mt-16"></div>
                <div className="relative">
                  <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-rose-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-pink-500/30 group-hover:scale-110 group-hover:rotate-3 transition-all">
                    <span className="text-3xl">☕</span>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">Support Our Mission</h3>
                  <p className="text-gray-700 mb-6 leading-relaxed">
                    Help us build the future of pain management. Your support keeps our free resources available.
                  </p>
                  <div className="inline-flex items-center gap-2 bg-white px-5 py-2.5 rounded-xl font-semibold text-pink-600 shadow-md group-hover:shadow-lg group-hover:bg-pink-600 group-hover:text-white transition-all">
                    Buy Us a Coffee <ExternalLink className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </a>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-16 sm:py-24 px-4 sm:px-6">
          <div className="max-w-4xl mx-auto">
            <div className="relative bg-gradient-to-br from-indigo-600 via-purple-600 to-purple-700 rounded-3xl p-8 sm:p-12 text-center overflow-hidden">
              {/* Decorative elements */}
              <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
              <div className="absolute bottom-0 right-0 w-64 h-64 bg-pink-500/20 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>
              
              <div className="relative">
                <p className="text-sm text-white/90 text-center mb-4">
                  🎁 Get instant access to our <span className="font-semibold text-white">free Self-Management 101 course</span> when you join
                </p>
                <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur rounded-full px-5 py-2.5 mb-6">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-white font-bold text-base">{waitlistCount > 0 ? waitlistCount.toLocaleString() : '...'}+</span>
                  <span className="text-white/80 text-sm">joined</span>
                </div>
                
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
                  Ready to recalibrate your health?
                </h2>
                <p className="text-lg text-white/80 mb-8 max-w-xl mx-auto">
                  Join the revolution. Be the first to experience the future of pain management.
                </p>
                
                <form onSubmit={handleEmailSubmit} className="max-w-md mx-auto mb-6">
                  <div className="flex flex-col sm:flex-row gap-2">
                    <input
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="flex-1 px-5 py-3.5 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:bg-white/20 focus:border-white/40 transition-all backdrop-blur-sm"
                      required
                    />
                    <button
                      type="submit"
                      disabled={loading}
                      className="bg-white text-gray-900 px-6 py-3.5 rounded-xl font-semibold hover:bg-gray-50 transition-all disabled:opacity-60"
                    >
                      {loading ? 'Joining...' : 'Join Waitlist'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" className="py-16 sm:py-20 px-4 sm:px-6 scroll-mt-20">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-10">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">Common questions</h2>
            </div>
            
            <div className="space-y-3">
              {faqs.map((faq, i) => (
                <div key={i} className="bg-white border border-purple-100 rounded-2xl overflow-hidden">
                  <button onClick={() => setOpenFaq(openFaq === i ? null : i)} className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-purple-50/50 transition-colors">
                    <span className="font-semibold text-gray-900">{faq.q}</span>
                    {openFaq === i ? <ChevronUp className="w-5 h-5 text-purple-600" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
                  </button>
                  {openFaq === i && <div className="px-6 pb-4 text-gray-600">{faq.a}</div>}
                </div>
              ))}
            </div>
            
            <div className="text-center mt-8">
              <button onClick={() => setShowContactModal(true)} className="text-purple-600 font-semibold hover:text-purple-700">
                Have another question? Contact us →
              </button>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-12 px-4 sm:px-6 bg-gray-900 text-white">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-center gap-6">
              <div className="flex items-center gap-2">
                <img 
                  src="/recalibrate-logo-optimized.png" 
                  alt="Recalibrate" 
                  className="h-10 w-auto" 
                  width="40" 
                  height="40"
                  loading="lazy"
                />
                <span className="font-bold text-lg">Recalibrate</span>
              </div>
              
              <div className="flex items-center gap-3">
                <a href="https://www.instagram.com/recalibrateapp/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-gray-800 hover:bg-gradient-to-br hover:from-purple-600 hover:via-pink-500 hover:to-orange-400 rounded-xl flex items-center justify-center transition-all">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                </a>
                <a href="https://www.linkedin.com/company/recalibrate-app/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-gray-800 hover:bg-[#0077b5] rounded-xl flex items-center justify-center transition-all">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                </a>
                <a href="https://x.com/RecalibrateApp" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-gray-800 hover:bg-black rounded-xl flex items-center justify-center transition-all">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                </a>
              </div>
            </div>
            
            <div className="border-t border-gray-800 mt-8 pt-8 text-center">
              <p className="text-gray-400 text-sm mb-4">Recalibrate Inc. Smarter Health and Pain Technology</p>
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                <p className="text-gray-500 text-xs">© 2025 Recalibrate App. Your intelligent health companion.</p>
                <a href="mailto:info@recalibratepain.com" className="text-gray-400 hover:text-white text-sm flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  info@recalibratepain.com
                </a>
              </div>
            </div>
          </div>
        </footer>

        {/* Contact Modal */}
        {showContactModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4" onClick={(e) => e.target === e.currentTarget && setShowContactModal(false)}>
            <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">Contact Us</h3>
                  <p className="text-sm text-gray-500">We'd love to hear from you</p>
                </div>
                <button onClick={() => setShowContactModal(false)} className="p-2 hover:bg-gray-100 rounded-lg"><X className="w-5 h-5" /></button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                 <div className="p-4 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl border border-purple-100">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-lg">📅</span>
                      <p className="font-bold text-gray-900 text-sm">Launch Date</p>
                    </div>
                    <p className="text-purple-700 font-semibold">Q1 2026</p>
                    <p className="text-xs text-gray-500">iOS • Android • Web</p>
                 </div>
                 <a href="mailto:info@recalibratepain.com" className="p-4 bg-gray-50 rounded-xl border border-gray-100 hover:border-purple-200 transition-colors">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-lg">📧</span>
                      <p className="font-bold text-gray-900 text-sm">Direct Email</p>
                    </div>
                    <p className="text-indigo-600 text-sm break-all">info@recalibratepain.com</p>
                 </a>
              </div>

              <form onSubmit={async (e) => {
                e.preventDefault();
                setPartnerSubmitting(true);
                try {
                  const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/partner/contact`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ ...partnerForm, type: 'general_contact', organization: 'General Inquiry' })
                  });
                  const data = await response.json();
                  if (data.success) {
                    alert('Message sent! We will get back to you soon.');
                    setShowContactModal(false);
                    setPartnerForm({ type: '', name: '', email: '', organization: '', message: '' });
                  }
                } catch (err) {
                  alert('Error submitting form. Please try again.');
                }
                setPartnerSubmitting(false);
              }} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                    <input type="text" required value={partnerForm.name} onChange={(e) => setPartnerForm({...partnerForm, name: e.target.value})} className="w-full px-4 py-2 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm text-gray-900" placeholder="Your name" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input type="email" required value={partnerForm.email} onChange={(e) => setPartnerForm({...partnerForm, email: e.target.value})} className="w-full px-4 py-2 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm text-gray-900" placeholder="you@example.com" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                  <textarea required value={partnerForm.message} onChange={(e) => setPartnerForm({...partnerForm, message: e.target.value})} rows={4} className="w-full px-4 py-2 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none text-sm text-gray-900" placeholder="How can we help you?" />
                </div>
                <button type="submit" disabled={partnerSubmitting} className="w-full bg-black text-white py-3 rounded-xl font-bold hover:bg-gray-800 transition-all disabled:opacity-50">
                  {partnerSubmitting ? 'Sending...' : 'Send Message'}
                </button>
              </form>
              
              <div className="mt-6 pt-6 border-t border-gray-100">
                <p className="text-xs text-gray-500 mb-3 font-medium uppercase tracking-wider">Partnerships</p>
                <div className="grid grid-cols-3 gap-2">
                  <button onClick={() => { setShowContactModal(false); setPartnerFormOpen('clinic'); }} className="text-center p-2 rounded-lg bg-blue-50 hover:bg-blue-100 text-xs text-blue-700 font-medium">For Clinics</button>
                  <button onClick={() => { setShowContactModal(false); setPartnerFormOpen('research'); }} className="text-center p-2 rounded-lg bg-purple-50 hover:bg-purple-100 text-xs text-purple-700 font-medium">Research</button>
                  <button onClick={() => { setShowContactModal(false); setPartnerFormOpen('investor'); }} className="text-center p-2 rounded-lg bg-green-50 hover:bg-green-100 text-xs text-green-700 font-medium">Investors</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Partner Form Modal */}
        {partnerFormOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4" onClick={(e) => e.target === e.currentTarget && setPartnerFormOpen(null)}>
            <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold">
                  {partnerFormOpen === 'clinic' && '🏥 Healthcare Clinic Inquiry'}
                  {partnerFormOpen === 'research' && '🔬 Research Collaboration'}
                  {partnerFormOpen === 'investor' && '💼 Investor Inquiry'}
                </h3>
                <button onClick={() => setPartnerFormOpen(null)} className="p-2 hover:bg-gray-100 rounded-lg"><X className="w-5 h-5" /></button>
              </div>
              {partnerFormOpen === 'investor' && (
                <div className="mb-6 p-5 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl border border-purple-100">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xl">📊</span>
                    <h4 className="font-bold text-gray-900">Investor Prospectus Summary</h4>
                  </div>
                  <div className="space-y-2 text-sm text-gray-700">
                    <p><strong className="text-purple-700">Mission:</strong> Empowering millions to recalibrate their lives through AI-driven pain management.</p>
                    <p><strong className="text-purple-700">Market:</strong> $600B+ Chronic Pain Market | 1.5B Sufferers Globally.</p>
                    <p><strong className="text-purple-700">Traction:</strong> 50+ organic Pre-launch waitlist, Pre-Seed Investment Secured, HIPAA-compliant architecture.</p>
                    <p><strong className="text-purple-700">Opportunity:</strong> Raising $1.5 Million Seed Round to accelerate Development Testing, Clinical and Research Partnerships, AI R&D and Marketing.</p>
                    <p className="text-xs text-gray-500 mt-2 italic">Fill out the form below to request the full deck.</p>
                  </div>
                </div>
              )}
              
              <form onSubmit={async (e) => {
                e.preventDefault();
                setPartnerSubmitting(true);
                try {
                  const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/partner/contact`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ ...partnerForm, type: partnerFormOpen })
                  });
                  const data = await response.json();
                  if (data.success) {
                    alert('Thank you! We will contact you soon.');
                    setPartnerFormOpen(null);
                    setPartnerForm({ type: '', name: '', email: '', organization: '', message: '' });
                  }
                } catch (err) {
                  alert('Error submitting form. Please try again.');
                }
                setPartnerSubmitting(false);
              }} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Your Name *</label>
                  <input type="text" required value={partnerForm.name} onChange={(e) => setPartnerForm({...partnerForm, name: e.target.value})} className="w-full px-4 py-2.5 bg-white text-gray-900 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent" placeholder="John Doe" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email Address *</label>
                  <input type="email" required value={partnerForm.email} onChange={(e) => setPartnerForm({...partnerForm, email: e.target.value})} className="w-full px-4 py-2.5 bg-white text-gray-900 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent" placeholder="john@example.com" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Organization *</label>
                  <input type="text" required value={partnerForm.organization} onChange={(e) => setPartnerForm({...partnerForm, organization: e.target.value})} className="w-full px-4 py-2.5 bg-white text-gray-900 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent" placeholder="Your clinic, university, or company" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Message *</label>
                  <textarea required value={partnerForm.message} onChange={(e) => setPartnerForm({...partnerForm, message: e.target.value})} rows={4} className="w-full px-4 py-2.5 bg-white text-gray-900 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none" placeholder="Tell us about your interest in partnering with Recalibrate..." />
                </div>
                <button type="submit" disabled={partnerSubmitting} className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50">
                  {partnerSubmitting ? 'Submitting...' : 'Submit Inquiry'}
                </button>
                <p className="text-xs text-gray-500 text-center">We'll respond to info@recalibratepain.com inquiries within 48 hours</p>
              </form>
            </div>
          </div>
        )}
      </div>
    </ErrorBoundary>
  );
}

export default App;
