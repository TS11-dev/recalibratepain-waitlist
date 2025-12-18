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
  const [isYearly, setIsYearly] = useState(false);
  const [partnerForm, setPartnerForm] = useState({ type: '', name: '', email: '', organization: '', message: '' });
  const [partnerFormOpen, setPartnerFormOpen] = useState(null); // 'clinic', 'research', 'investor'
  const [partnerSubmitting, setPartnerSubmitting] = useState(false);

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
      yearly: "0",
      description: "Full tracking forever",
      features: ["Smart Tracking (18+ variables)", "Analytics Dashboard", "Medication tracking", "Exported Reports", "Limited Support"],
      popular: false,
      cta: "Start Free"
    },
    {
      name: "Go",
      monthly: "12.99",
      yearly: "99.99",
      description: "Education & tools",
      features: ["Everything in Free", "Pain Academy (90+ lessons)", "Therapeutic Tools & Exercises", "Daily inspiration", "Goal tracking"],
      popular: false,
      cta: "Get Go"
    },
    {
      name: "Pro",
      monthly: "34.99",
      yearly: "299.99",
      description: "AI & Care Team",
      features: ["Everything in Go", "Recalibrate AI companion", "Care Team dashboards", "Priority support", "Advanced analytics"],
      popular: true,
      cta: "Go Pro"
    },
    {
      name: "Lifetime",
      monthly: "499.99",
      yearly: null,
      description: "Pro forever",
      features: ["All Pro features", "Lifetime updates", "Early access to new features"],
      popular: false,
      cta: "Get Lifetime",
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
                <img src="/recalibrate-logo.png" alt="Recalibrate" className="h-10 w-auto" />
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
                <strong className="text-gray-800">Recalibrate App</strong> — Track over 18 Health Variables including Pain, Exercise, Nutrition, Anxiety and Sleep. Discover patterns with Analytics and Recalibrate AI, access guided tools and exercises, learn from our Pain Academy and connect to clinicians, researchers and carers easily.
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
                    src="/app-screenshot.png" 
                    alt="Recalibrate App" 
                    className="w-full h-full object-cover object-top"
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
                    <p className="text-xs text-white/80">Pain Academy</p>
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




        {/* Features Section - 200+ Tools & Resources */}
        <section id="features" className="py-16 sm:py-24 px-4 sm:px-6 scroll-mt-20 bg-gradient-to-b from-white to-purple-50/30">
          <div className="max-w-7xl mx-auto">
            {/* Section Header */}
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
                200+ Tools & Resources in Recalibrate App
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
                Everything you need to understand, track, and manage your chronic pain and chronic illness journey with our comprehensive pain management app.
              </p>
              <div className="flex flex-wrap gap-3 justify-center">
                <span className="bg-gray-100 text-gray-700 px-4 py-2 rounded-full text-sm font-medium">🆓 FREE — Tracker & Analytics</span>
                <span className="bg-emerald-100 text-emerald-700 px-4 py-2 rounded-full text-sm font-medium">🚀 GO — Academy & Tools</span>
                <span className="bg-purple-100 text-purple-700 px-4 py-2 rounded-full text-sm font-medium">⭐ PRO — AI & Care Team</span>
              </div>
            </div>

            {/* Feature 1: Smart Tracker - visual LEFT */}
            <div className="grid grid-cols-2 gap-2 lg:gap-12 items-center mb-4 lg:mb-20 p-2 lg:p-8 bg-white rounded-xl lg:rounded-3xl border-2 border-blue-200 shadow-sm hover:shadow-lg transition-shadow">
              <div className="col-span-1">
                <span className="inline-block bg-gray-100 text-gray-600 text-[9px] lg:text-xs font-bold px-1.5 py-0.5 lg:py-1 rounded-full mb-1 lg:mb-4">FREE</span>
                <h3 className="text-xs lg:text-3xl font-bold text-gray-900 mb-1 lg:mb-4">Smart Tracker</h3>
                <p className="text-gray-600 mb-2 lg:mb-6 text-[9px] lg:text-lg leading-tight">
                  Log pain, sleep, mood & energy across 8 health systems.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 lg:gap-4">
                  {[
                    { icon: "🎯", label: "Pain" },
                    { icon: "😴", label: "Sleep" },
                    { icon: "💊", label: "Meds" },
                    { icon: "⚡", label: "Energy" }
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-1.5 lg:gap-2 p-1 lg:p-3 bg-gray-50 rounded">
                      <span className="text-[10px] lg:text-2xl">{item.icon}</span>
                      <p className="font-medium text-gray-900 text-[8px] lg:text-sm leading-none">{item.label}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="relative col-span-1 block">
                <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl lg:rounded-3xl p-1.5 lg:p-6 aspect-square flex flex-col items-center justify-center border lg:border-2 border-blue-200">
                  <div className="grid grid-cols-4 gap-0.5 lg:gap-2 mb-1 lg:mb-4">
                    {["🎯", "😴", "💊", "⚡", "🧠", "❤️", "🦴", "🫁"].map((icon, i) => (
                      <div key={i} className="w-5 h-5 lg:w-12 lg:h-12 bg-white rounded lg:rounded-xl shadow flex items-center justify-center text-[10px] lg:text-2xl">{icon}</div>
                    ))}
                  </div>
                  <div className="bg-white rounded-lg lg:rounded-2xl p-1.5 lg:p-4 shadow-lg text-center w-full max-w-xs">
                    <p className="text-lg lg:text-4xl font-bold text-blue-600">18</p>
                    <p className="text-[8px] lg:text-sm text-gray-600 leading-tight">Health Variables</p>
                    <p className="text-[6px] lg:text-xs text-blue-500 mt-0.5 lg:mt-1 leading-tight">across 8 biological systems</p>
                  </div>
                  <div className="flex gap-0.5 lg:gap-2 mt-1.5 lg:mt-3 flex-wrap justify-center">
                    {["Pain", "Sleep", "Mood", "Energy"].map((label, i) => (
                      <span key={i} className="bg-blue-100 text-blue-700 px-1 py-0.5 lg:px-2 lg:py-1 rounded-full text-[6px] lg:text-xs font-medium">{label}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Feature 2: Analytics Dashboard - visual RIGHT */}
            <div className="grid grid-cols-2 gap-2 lg:gap-12 items-center mb-4 lg:mb-20 p-2 lg:p-8 bg-white rounded-xl lg:rounded-3xl border-2 border-indigo-200 shadow-sm hover:shadow-lg transition-shadow">
              <div className="order-2 lg:order-1 relative col-span-1 block">
                <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl lg:rounded-3xl p-1.5 lg:p-6 aspect-square flex flex-col items-center justify-center border lg:border-2 border-indigo-200">
                  <div className="bg-white rounded-lg lg:rounded-2xl p-1.5 lg:p-5 shadow-lg mb-1.5 lg:mb-3 w-full max-w-xs">
                    <div className="flex justify-between items-center mb-1 lg:mb-2">
                      <p className="text-[8px] lg:text-sm text-gray-500">Stability Score</p>
                      <span className="text-[7px] lg:text-xs bg-green-100 text-green-700 px-1 py-0.5 lg:px-2 lg:py-0.5 rounded-full">↑ 12%</span>
                    </div>
                    <p className="text-xl lg:text-5xl font-bold text-indigo-600">53%</p>
                    <div className="w-full h-1 lg:h-3 bg-gray-200 rounded-full mt-1 lg:mt-3">
                      <div className="w-1/2 h-1 lg:h-3 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"></div>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-1 lg:gap-2 w-full max-w-xs">
                    <div className="bg-white rounded-lg lg:rounded-xl p-1 lg:p-3 shadow text-center">
                      <p className="text-xs lg:text-2xl font-bold text-purple-600">18</p>
                      <p className="text-[6px] lg:text-xs text-gray-500">Variables</p>
                    </div>
                    <div className="bg-white rounded-lg lg:rounded-xl p-1 lg:p-3 shadow text-center">
                      <p className="text-xs lg:text-2xl font-bold text-indigo-600">30+</p>
                      <p className="text-[6px] lg:text-xs text-gray-500">Days</p>
                    </div>
                    <div className="bg-white rounded-lg lg:rounded-xl p-1 lg:p-3 shadow text-center">
                      <p className="text-xs lg:text-2xl">📈</p>
                      <p className="text-[6px] lg:text-xs text-gray-500">Trends</p>
                    </div>
                  </div>
                  <p className="text-[7px] lg:text-xs text-indigo-600 font-medium mt-1.5 lg:mt-3">Real-time pattern detection</p>
                </div>
              </div>
              <div className="col-span-1 order-1 lg:order-2">
                <span className="inline-block bg-gray-100 text-gray-600 text-[9px] lg:text-xs font-bold px-1.5 py-0.5 lg:py-1 rounded-full mb-1 lg:mb-4">FREE</span>
                <h3 className="text-xs lg:text-3xl font-bold text-gray-900 mb-1 lg:mb-4">Analytics Dashboard</h3>
                <p className="text-gray-600 mb-2 lg:mb-6 text-[9px] lg:text-lg leading-tight">
                  Stability Score from 18 variables. Visualize trends.
                </p>
                <ul className="space-y-0.5 lg:space-y-3">
                  {["Stability score", "Trend analysis", "Pattern detection", "Doctor reports"].map((item, i) => (
                    <li key={i} className="flex items-center gap-1 lg:gap-3">
                      <CheckCircle className="w-2.5 h-2.5 lg:w-5 lg:h-5 text-green-500 flex-shrink-0" />
                      <span className="text-gray-700 text-[8px] lg:text-base leading-tight">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Feature 3: Pain Academy - visual LEFT */}
            <div className="grid grid-cols-2 gap-2 lg:gap-12 items-center mb-4 lg:mb-20 p-2 lg:p-8 bg-white rounded-xl lg:rounded-3xl border-2 border-emerald-200 shadow-sm hover:shadow-lg transition-shadow">
              <div className="col-span-1">
                <span className="inline-block bg-emerald-100 text-emerald-700 text-[9px] lg:text-xs font-bold px-1.5 py-0.5 lg:py-1 rounded-full mb-1 lg:mb-4">GO</span>
                <h3 className="text-xs lg:text-3xl font-bold text-gray-900 mb-1 lg:mb-4">Pain Academy</h3>
                <p className="text-gray-600 mb-2 lg:mb-6 text-[9px] lg:text-lg leading-tight">
                  90+ lessons on pain science. Earn XP and badges.
                </p>
                <div className="flex flex-wrap gap-1 lg:gap-3">
                  {["Foundations", "Neuro", "Strategies"].map((topic, i) => (
                    <span key={i} className="bg-emerald-50 text-emerald-700 px-1 py-0.5 lg:px-3 lg:py-1 rounded-full text-[8px] lg:text-sm font-medium">{topic}</span>
                  ))}
                </div>
              </div>
              <div className="relative col-span-1 block">
                <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl lg:rounded-3xl p-1.5 lg:p-6 aspect-square flex flex-col items-center justify-center border lg:border-2 border-emerald-200">
                  <div className="flex gap-0.5 lg:gap-3 mb-1.5 lg:mb-4">
                    <div className="bg-white rounded lg:rounded-xl p-1 lg:p-4 shadow-lg text-center">
                      <p className="text-sm lg:text-3xl font-bold text-emerald-600">90+</p>
                      <p className="text-[6px] lg:text-xs text-gray-500">Lessons</p>
                    </div>
                    <div className="bg-white rounded lg:rounded-xl p-1 lg:p-4 shadow-lg text-center">
                      <p className="text-sm lg:text-3xl font-bold text-amber-500">835</p>
                      <p className="text-[6px] lg:text-xs text-gray-500">XP</p>
                    </div>
                    <div className="bg-white rounded lg:rounded-xl p-1 lg:p-4 shadow-lg text-center">
                      <p className="text-sm lg:text-3xl font-bold text-teal-600">12</p>
                      <p className="text-[6px] lg:text-xs text-gray-500">Badges</p>
                    </div>
                  </div>
                  <div className="flex gap-0.5 lg:gap-2 mb-1 lg:mb-3 flex-wrap justify-center">
                    {["🏆", "🎯", "🔥", "⭐", "🧠"].map((badge, i) => (
                      <div key={i} className="w-4 h-4 lg:w-10 lg:h-10 bg-white rounded-full shadow flex items-center justify-center text-[8px] lg:text-lg">{badge}</div>
                    ))}
                  </div>
                  <div className="flex gap-0.5 lg:gap-2 flex-wrap justify-center">
                    {["Foundations", "Neurobiology", "Strategies"].map((topic, i) => (
                      <span key={i} className="bg-emerald-100 text-emerald-700 px-1 py-0.5 lg:px-2 lg:py-1 rounded-full text-[6px] lg:text-xs font-medium">{topic}</span>
                    ))}
                  </div>
                  <p className="text-[7px] lg:text-xs text-emerald-600 font-medium mt-1 lg:mt-3 text-center">Evidence-based pain education</p>
                </div>
              </div>
            </div>

            {/* Feature 4: Tools & Exercises - visual RIGHT */}
            <div className="grid grid-cols-2 gap-2 lg:gap-12 items-center mb-4 lg:mb-20 p-2 lg:p-8 bg-white rounded-xl lg:rounded-3xl border-2 border-orange-200 shadow-sm hover:shadow-lg transition-shadow">
              <div className="order-2 lg:order-1 relative col-span-1 block">
                <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl lg:rounded-3xl p-1.5 lg:p-6 aspect-square flex flex-col items-center justify-center border lg:border-2 border-orange-200">
                  <div className="grid grid-cols-2 gap-1 lg:gap-3 w-full max-w-xs mb-1 lg:mb-3">
                    {[
                      { icon: "📝", name: "Journal", desc: "Reflections", color: "bg-orange-500" },
                      { icon: "🎯", name: "Goals", desc: "Progress", color: "bg-amber-500" },
                      { icon: "💡", name: "Inspire", desc: "Quotes", color: "bg-yellow-500" },
                      { icon: "🏃", name: "Move", desc: "Guided", color: "bg-orange-600" }
                    ].map((tool, i) => (
                      <div key={i} className="bg-white rounded-lg lg:rounded-xl p-1 lg:p-3 shadow-lg text-center">
                        <div className={`w-5 h-5 lg:w-10 lg:h-10 ${tool.color} rounded-md lg:rounded-lg mx-auto mb-0.5 lg:mb-2 flex items-center justify-center text-[10px] lg:text-xl text-white`}>
                          {tool.icon}
                        </div>
                        <p className="font-semibold text-gray-900 text-[8px] lg:text-sm">{tool.name}</p>
                        <p className="text-[6px] lg:text-xs text-gray-500 leading-none">{tool.desc}</p>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-0.5 lg:gap-2 flex-wrap justify-center">
                    {["CBT", "Mindfulness", "Graded"].map((therapy, i) => (
                      <span key={i} className="bg-orange-100 text-orange-700 px-1 py-0.5 lg:px-2 lg:py-1 rounded-full text-[6px] lg:text-xs font-medium">{therapy}</span>
                    ))}
                  </div>
                  <p className="text-[7px] lg:text-xs text-orange-600 font-medium mt-1 lg:mt-2">Therapeutic interventions</p>
                </div>
              </div>
              <div className="col-span-1 order-1 lg:order-2">
                <span className="inline-block bg-emerald-100 text-emerald-700 text-[9px] lg:text-xs font-bold px-1.5 py-0.5 lg:py-1 rounded-full mb-1 lg:mb-4">GO</span>
                <h3 className="text-xs lg:text-3xl font-bold text-gray-900 mb-1 lg:mb-4">Tools & Exercises</h3>
                <p className="text-gray-600 mb-2 lg:mb-6 text-[9px] lg:text-lg leading-tight">
                  Journal, goals, inspiration, and guided exercises.
                </p>
                <ul className="space-y-0.5 lg:space-y-3">
                  {["Journaling", "Goal tracking", "Inspiration", "Exercises"].map((item, i) => (
                    <li key={i} className="flex items-center gap-1 lg:gap-3">
                      <CheckCircle className="w-2.5 h-2.5 lg:w-5 lg:h-5 text-green-500 flex-shrink-0" />
                      <span className="text-gray-700 text-[8px] lg:text-base leading-tight">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Feature 5: Recalibrate AI - visual LEFT */}
            <div className="grid grid-cols-2 gap-2 lg:gap-12 items-center mb-4 lg:mb-20 p-2 lg:p-8 bg-white rounded-xl lg:rounded-3xl border-2 border-purple-200 shadow-sm hover:shadow-lg transition-shadow">
              <div className="col-span-1">
                <span className="inline-block bg-purple-100 text-purple-700 text-[9px] lg:text-xs font-bold px-1.5 py-0.5 lg:py-1 rounded-full mb-1 lg:mb-4">PRO</span>
                <h3 className="text-xs lg:text-3xl font-bold text-gray-900 mb-1 lg:mb-4">Recalibrate AI</h3>
                <p className="text-gray-600 mb-2 lg:mb-6 text-[9px] lg:text-lg leading-tight">
                  AI companion powered by Gemini 2.0 Flash.
                </p>
                <div className="space-y-0.5 lg:space-y-3">
                  {[
                    { mode: "💬 Chat", desc: "Health data" },
                    { mode: "🔬 Research", desc: "Pain science" },
                    { mode: "📊 Analysis", desc: "Patterns" }
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-1 lg:gap-3 p-1 lg:p-3 bg-purple-50 rounded lg:rounded-xl">
                      <span className="font-semibold text-purple-700 text-[8px] lg:text-base">{item.mode}</span>
                      <span className="text-gray-600 text-[7px] lg:text-sm">{item.desc}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="relative col-span-1 block">
                <div className="bg-gradient-to-br from-purple-50 to-violet-50 rounded-xl lg:rounded-3xl p-1.5 lg:p-6 aspect-square flex flex-col items-center justify-center border lg:border-2 border-purple-200">
                  <div className="bg-white rounded-lg lg:rounded-2xl p-1.5 lg:p-5 shadow-xl w-full max-w-xs mb-1 lg:mb-3">
                    <div className="flex items-center gap-1 lg:gap-3 mb-1 lg:mb-3">
                      <div className="w-5 h-5 lg:w-10 lg:h-10 bg-gradient-to-br from-purple-500 to-violet-600 rounded-full flex items-center justify-center">
                        <Bot className="w-3 h-3 lg:w-5 lg:h-5 text-white" />
                      </div>
                      <div>
                        <p className="font-bold text-gray-900 text-[8px] lg:text-base">Recalibrate AI</p>
                        <p className="text-[6px] lg:text-xs text-gray-500">Gemini 2.0</p>
                      </div>
                    </div>
                    <div className="bg-purple-50 rounded lg:rounded-xl p-1 lg:p-3 mb-1 lg:mb-3">
                      <p className="text-[7px] lg:text-sm text-gray-700 leading-tight">I notice your pain increases after poor sleep. Suggestions?</p>
                    </div>
                    <div className="flex gap-1 lg:gap-2">
                      <span className="text-[6px] lg:text-xs bg-purple-100 text-purple-700 px-1 py-0.5 lg:px-2 lg:py-1 rounded-full">Yes, show me</span>
                      <span className="text-[6px] lg:text-xs bg-gray-100 text-gray-600 px-1 py-0.5 lg:px-2 lg:py-1 rounded-full">Tell me more</span>
                    </div>
                  </div>
                  <div className="flex gap-1 lg:gap-2 mb-0.5 lg:mb-2">
                    {[
                      { icon: "💬", label: "Chat" },
                      { icon: "🔬", label: "Research" },
                      { icon: "📊", label: "Analysis" }
                    ].map((mode, i) => (
                      <div key={i} className="bg-white rounded-lg px-1.5 py-0.5 lg:px-3 lg:py-2 shadow text-center">
                        <span className="text-[10px] lg:text-lg">{mode.icon}</span>
                        <p className="text-[6px] lg:text-xs text-gray-600">{mode.label}</p>
                      </div>
                    ))}
                  </div>
                  <p className="text-[7px] lg:text-xs text-purple-600 font-medium">AI-powered health insights</p>
                </div>
              </div>
            </div>

            {/* Feature 6: Care Team - visual RIGHT */}
            <div className="grid grid-cols-2 gap-2 lg:gap-12 items-center p-2 lg:p-8 bg-white rounded-xl lg:rounded-3xl border-2 border-pink-200 shadow-sm hover:shadow-lg transition-shadow">
              <div className="order-2 lg:order-1 relative col-span-1 block">
                <div className="bg-gradient-to-br from-pink-50 to-rose-50 rounded-xl lg:rounded-3xl p-1.5 lg:p-6 aspect-square flex flex-col items-center justify-center border lg:border-2 border-pink-200">
                  <div className="flex justify-center mb-1 lg:mb-4">
                    <div className="relative">
                      <div className="w-8 h-8 lg:w-16 lg:h-16 bg-white rounded-full shadow-lg flex items-center justify-center text-sm lg:text-2xl border-2 lg:border-4 border-pink-200">👤</div>
                      <div className="absolute -top-1 -right-2 lg:-right-6 w-5 h-5 lg:w-10 lg:h-10 bg-white rounded-full shadow flex items-center justify-center text-[8px] lg:text-lg border lg:border-2 border-blue-200">🩺</div>
                      <div className="absolute -bottom-1 -right-2 lg:-right-6 w-5 h-5 lg:w-10 lg:h-10 bg-white rounded-full shadow flex items-center justify-center text-[8px] lg:text-lg border lg:border-2 border-green-200">👨‍👩‍👧</div>
                      <div className="absolute -bottom-1 -left-2 lg:-left-6 w-5 h-5 lg:w-10 lg:h-10 bg-white rounded-full shadow flex items-center justify-center text-[8px] lg:text-lg border lg:border-2 border-purple-200">🔬</div>
                      <div className="absolute -top-1 -left-2 lg:-left-6 w-5 h-5 lg:w-10 lg:h-10 bg-white rounded-full shadow flex items-center justify-center text-[8px] lg:text-lg border lg:border-2 border-amber-200">📋</div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-1 lg:gap-2 w-full max-w-xs mb-1 lg:mb-3">
                    {[
                      { icon: "🩺", title: "Clinician", desc: "Analytics" },
                      { icon: "🔬", title: "Research", desc: "Data" },
                      { icon: "👨‍👩‍👧", title: "Family", desc: "Support" },
                      { icon: "📋", title: "Reports", desc: "Progress" }
                    ].map((item, i) => (
                      <div key={i} className="bg-white rounded-lg p-1 lg:p-2 shadow text-center">
                        <span className="text-[10px] lg:text-lg">{item.icon}</span>
                        <p className="font-semibold text-gray-900 text-[6px] lg:text-xs">{item.title}</p>
                        <p className="text-[5px] lg:text-[10px] text-gray-500 leading-none">{item.desc}</p>
                      </div>
                    ))}
                  </div>
                  <p className="text-[7px] lg:text-xs text-pink-600 font-medium">Collaborative care coordination</p>
                </div>
              </div>
              <div className="col-span-1 order-1 lg:order-2">
                <span className="inline-block bg-purple-100 text-purple-700 text-[9px] lg:text-xs font-bold px-1.5 py-0.5 lg:py-1 rounded-full mb-1 lg:mb-4">PRO</span>
                <h3 className="text-xs lg:text-3xl font-bold text-gray-900 mb-1 lg:mb-4">Care Team</h3>
                <p className="text-gray-600 mb-2 lg:mb-6 text-[9px] lg:text-lg leading-tight">
                  Connect clinicians, family, and friends with dashboards.
                </p>
                <div className="grid grid-cols-1 gap-1 lg:gap-4">
                  {[
                    { icon: "🩺", title: "Clinician" },
                    { icon: "🔬", title: "Research" },
                    { icon: "👨‍👩‍👧", title: "Family" },
                    { icon: "📋", title: "Reports" }
                  ].map((item, i) => (
                    <div key={i} className="p-1 lg:p-3 bg-white rounded lg:rounded-xl border border-gray-100 shadow-sm flex items-center gap-1 lg:block">
                      <span className="text-[10px] lg:text-2xl">{item.icon}</span>
                      <p className="font-semibold text-gray-900 text-[8px] lg:text-sm lg:mt-1">{item.title}</p>
                    </div>
                  ))}
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
              
              {/* Monthly/Yearly Toggle */}
              <div className="inline-flex items-center gap-3 bg-gray-100 p-1 rounded-xl">
                <button 
                  onClick={() => setIsYearly(false)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${!isYearly ? 'bg-white text-purple-600 shadow-sm' : 'text-gray-600'}`}
                >
                  Monthly
                </button>
                <button 
                  onClick={() => setIsYearly(true)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${isYearly ? 'bg-white text-purple-600 shadow-sm' : 'text-gray-600'}`}
                >
                  Yearly <span className="text-xs text-green-600 font-semibold ml-1">Save 35%</span>
                </button>
              </div>
            </div>
            
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
              {subscriptionPlans.map((plan, i) => (
                <div
                  key={i}
                  className={`relative bg-white rounded-xl lg:rounded-2xl p-4 lg:p-6 border-2 transition-all hover:shadow-lg ${
                    plan.popular 
                      ? 'border-purple-500 shadow-lg shadow-purple-500/10' 
                      : plan.isLifetime 
                        ? 'border-amber-400'
                        : 'border-gray-200'
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <span className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-xs font-bold px-3 py-1 rounded-full">Most Popular</span>
                    </div>
                  )}
                  
                  <div className="text-center pt-2">
                    <h3 className="text-base lg:text-lg font-bold text-gray-900">{plan.name}</h3>
                    <div className="mt-2 mb-1">
                      <span className="text-2xl lg:text-3xl font-bold text-gray-900">
                        ${plan.isLifetime ? plan.monthly : (isYearly && plan.yearly ? plan.yearly : plan.monthly)}
                      </span>
                      {!plan.isLifetime && plan.monthly !== "0" && (
                        <span className="text-sm text-gray-500">/{isYearly ? 'yr' : 'mo'}</span>
                      )}
                      {plan.isLifetime && <span className="text-sm text-gray-500"> once</span>}
                    </div>
                    {!isYearly && plan.yearly && plan.monthly !== "0" && (
                      <p className="text-xs text-green-600 font-medium">${plan.yearly}/yr if billed yearly</p>
                    )}
                    <p className="text-xs lg:text-sm text-gray-500 mt-1">{plan.description}</p>
                  </div>
                  
                  <div className="mt-4 space-y-2">
                    {plan.features.map((feature, fi) => (
                      <p key={fi} className="text-xs lg:text-sm text-gray-600 flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </p>
                    ))}
                  </div>
                  
                  <button 
                    onClick={() => document.getElementById('waitlist')?.scrollIntoView({ behavior: 'smooth', block: 'center' })}
                    className={`w-full mt-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                      plan.popular 
                        ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:shadow-lg hover:shadow-purple-500/25' 
                        : plan.isLifetime
                          ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:shadow-lg'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {plan.cta}
                  </button>
                </div>
              ))}
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

        {/* Clinician & Partnership Section */}
        <section id="partners" className="py-10 lg:py-24 px-4 sm:px-6 bg-gradient-to-b from-white to-purple-50/30 scroll-mt-20">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-6 lg:mb-12">
              <span className="inline-block text-purple-600 font-semibold text-xs lg:text-sm uppercase tracking-wider mb-1 lg:mb-2">For Professionals</span>
              <h2 className="text-2xl lg:text-5xl font-bold text-gray-900 mb-2 lg:mb-4">
                Clinicians & Partners
              </h2>
              <p className="text-sm lg:text-lg text-gray-600 max-w-2xl mx-auto">
                Join us in revolutionizing chronic pain management.
              </p>
            </div>
            
            {/* Mobile: Compact 3-column grid with more info */}
            <div className="grid grid-cols-3 gap-2 lg:hidden">
              {[
                { icon: "🩺", title: "Clinics", desc: "Multi-patient dashboard for your practice", color: "from-blue-500 to-cyan-500", formType: "clinic" },
                { icon: "🔬", title: "Research", desc: "Anonymized chronic pain datasets", color: "from-purple-500 to-violet-500", formType: "research" },
                { icon: "🤝", title: "Investors", desc: "Join us building Recalibrate", color: "from-emerald-500 to-green-500", formType: "investor" }
              ].map((item, i) => (
                <button key={i} onClick={() => setPartnerFormOpen(item.formType)} className="bg-white rounded-xl p-3 border border-purple-100 shadow-sm text-center hover:shadow-md transition-all">
                  <div className={`w-10 h-10 bg-gradient-to-br ${item.color} rounded-lg flex items-center justify-center mx-auto mb-2`}>
                    <span className="text-xl">{item.icon}</span>
                  </div>
                  <h3 className="text-xs font-bold text-gray-900 mb-1">{item.title}</h3>
                  <p className="text-[8px] text-gray-500 mb-1.5 leading-tight">{item.desc}</p>
                  <span className="text-[9px] text-purple-600 font-medium">Inquire →</span>
                </button>
              ))}
            </div>

            {/* Desktop: Full cards */}
            <div className="hidden lg:grid lg:grid-cols-3 gap-6">
              {/* Healthcare Clinics */}
              <div className="bg-white rounded-2xl p-8 border border-purple-100 shadow-lg shadow-purple-500/5 hover:shadow-xl transition-all group">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <span className="text-3xl">🩺</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Healthcare Clinics</h3>
                <p className="text-gray-600 mb-6">
                  Integrate Recalibrate into your practice. Help your patients track their progress between appointments and get actionable insights.
                </p>
                <ul className="space-y-2 mb-6">
                  <li className="flex items-center gap-2 text-sm text-gray-600">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>Multi-Patient Clinician Dashboard</span>
                  </li>
                  <li className="flex items-center gap-2 text-sm text-gray-600">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>Care team integration</span>
                  </li>
                  <li className="flex items-center gap-2 text-sm text-gray-600">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>HIPAA-compliant sharing</span>
                  </li>
                </ul>
                <button onClick={() => setPartnerFormOpen('clinic')} className="text-purple-600 font-semibold hover:text-purple-700 flex items-center gap-2">
                  Partner with us <ArrowRight className="w-4 h-4" />
                </button>
              </div>
              
              {/* Research Collaborations */}
              <div className="bg-white rounded-2xl p-8 border border-purple-100 shadow-lg shadow-purple-500/5 hover:shadow-xl transition-all group">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-violet-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <span className="text-3xl">🔬</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Research Collaborations</h3>
                <p className="text-gray-600 mb-6">
                  Access anonymized, aggregated data for pain research. Help advance the science of chronic pain management.
                </p>
                <ul className="space-y-2 mb-6">
                  <li className="flex items-center gap-2 text-sm text-gray-600">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>Longitudinal pain datasets</span>
                  </li>
                  <li className="flex items-center gap-2 text-sm text-gray-600">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>Multi-variable correlations</span>
                  </li>
                  <li className="flex items-center gap-2 text-sm text-gray-600">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>Ethical data partnerships</span>
                  </li>
                </ul>
                <button onClick={() => setPartnerFormOpen('research')} className="text-purple-600 font-semibold hover:text-purple-700 flex items-center gap-2">
                  Collaborate with us <ArrowRight className="w-4 h-4" />
                </button>
              </div>
              
              {/* Become an Investor */}
              <div className="bg-white rounded-2xl p-8 border border-purple-100 shadow-lg shadow-purple-500/5 hover:shadow-xl transition-all group">
                <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-green-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <span className="text-3xl">🤝</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Become an Investor</h3>
                <p className="text-gray-600 mb-6">
                  Join us in building the future of chronic pain management. We're raising a seed round to accelerate development of Recalibrate App.
                </p>
                <ul className="space-y-2 mb-6">
                  <li className="flex items-center gap-2 text-sm text-gray-600">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>$50B+ chronic pain market</span>
                  </li>
                  <li className="flex items-center gap-2 text-sm text-gray-600">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>AI-powered health insights</span>
                  </li>
                  <li className="flex items-center gap-2 text-sm text-gray-600">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>Scalable B2B & B2C model</span>
                  </li>
                </ul>
                <button onClick={() => setPartnerFormOpen('investor')} className="text-purple-600 font-semibold hover:text-purple-700 flex items-center gap-2">
                  Investor Prospectus <ArrowRight className="w-4 h-4" />
                </button>
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
              {/* Newsletter */}
              <a 
                href="https://recalibrate.beehiiv.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-white rounded-2xl p-8 border-2 border-purple-100 hover:border-purple-300 hover:shadow-xl transition-all group"
              >
                <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <span className="text-2xl">📬</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Recalibrate Newsletter</h3>
                <p className="text-gray-600 mb-4">
                  Weekly insights on chronic pain management, research updates, and practical tips delivered to your inbox.
                </p>
                <span className="inline-flex items-center gap-2 text-purple-600 font-semibold">
                  Subscribe free <ExternalLink className="w-4 h-4" />
                </span>
              </a>
              
              {/* Courses and Products */}
              <a 
                href="https://www.etsy.com/shop/RecalibratePain" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-white rounded-2xl p-8 border-2 border-purple-100 hover:border-purple-300 hover:shadow-xl transition-all group"
              >
                <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-amber-500 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <span className="text-2xl">📚</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Courses and Other Products</h3>
                <p className="text-gray-600 mb-4">
                  Explore our pain education resources, worksheets, and guides to start your journey.
                </p>
                <span className="inline-flex items-center gap-2 text-purple-600 font-semibold">
                  Browse products <ExternalLink className="w-4 h-4" />
                </span>
              </a>
              
              {/* Support */}
              <a 
                href="https://ko-fi.com/N4N21O1R1W" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-white rounded-2xl p-8 border-2 border-purple-100 hover:border-purple-300 hover:shadow-xl transition-all group"
              >
                <div className="w-14 h-14 bg-gradient-to-br from-pink-500 to-rose-500 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <span className="text-2xl">☕</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Support Our Mission</h3>
                <p className="text-gray-600 mb-4">
                  Help us build the future of pain management. Your support keeps our free resources available to everyone.
                </p>
                <span className="inline-flex items-center gap-2 text-purple-600 font-semibold">
                  Buy us a coffee <ExternalLink className="w-4 h-4" />
                </span>
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
                <img src="/recalibrate-logo.png" alt="Recalibrate" className="h-10 w-auto" />
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
