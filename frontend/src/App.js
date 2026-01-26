import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Heart, Brain, Activity, Shield, Target, 
  TrendingUp, CheckCircle, ArrowRight, Sparkles,
  BarChart3, Users, BookOpen, Bell,
  Zap, MessageCircle, Mail, ExternalLink,
  Clock, ChevronDown, ChevronUp, Star, AlertTriangle, X, Menu,
  Play, Smartphone, Globe, Bot, Flame, Snowflake, Dumbbell,
  FileText, Calendar, User, Tag, ArrowUpRight
} from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import { blogPosts } from './data/blogPosts';

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
    { q: "Is my health data private?", a: "100% private. Encrypted, never shared, and you own your data. We follow secure, industry-standard practices." },
    { q: "How does the AI companion work?", a: "Recalibrate AI analyzes your patterns and provides personalized insights based on your tracked data." },
    { q: "What makes this different?", a: "We combine tracking, education, therapeutic tools, and AI insights in one comprehensive allied health platform designed for chronic pain, chronic illness, and rehabilitation." },
    { q: "Is there a cost?", a: "We offer a free tier with essential features. Premium plans unlock advanced tools, AI insights, and Care Team access." }
  ];

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50/30 to-indigo-50/50">
        <Toaster position="top-center" toastOptions={{ style: { borderRadius: '12px', background: '#1f2937', color: '#fff' } }} />
        
        {/* Navigation */}
        <nav className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-slate-900 via-purple-900 to-indigo-900 shadow-lg">
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
            <div className="md:hidden bg-slate-900/95 border-t border-purple-500/20 py-3 px-4 space-y-1">
              {['features', 'pricing', 'partners', 'resources'].map((item) => (
                <button key={item} onClick={() => smoothScroll(item)} className="block w-full text-left py-3 px-4 text-white/90 hover:bg-white/10 rounded-xl capitalize">
                  {item}
                </button>
              ))}
              <button onClick={() => { setShowContactModal(true); setMobileMenuOpen(false); }} className="block w-full text-left py-3 px-4 text-white/90 hover:bg-white/10 rounded-xl">
                Contact Us
              </button>
              <button onClick={() => smoothScroll('waitlist')} className="w-full mt-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 rounded-xl font-semibold">
                Join the Revolution
              </button>
            </div>
          )}
        </nav>

        {/* Hero Section */}
        <section className="pt-24 sm:pt-28 pb-8 sm:pb-16 px-4 sm:px-6 overflow-hidden bg-gradient-to-b from-slate-50 to-white relative">
          {/* Background elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl"></div>
            <div className="absolute top-40 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-20 left-1/3 w-72 h-72 bg-pink-500/10 rounded-full blur-3xl"></div>
          </div>
          
          <div className="max-w-7xl mx-auto relative z-10">
            
            {/* Top Row - Text + Form */}
            <div className="text-center max-w-5xl mx-auto mb-8 sm:mb-12">
              {/* Status Badge */}
              <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-100 to-purple-100 border border-purple-200/50 rounded-full px-4 py-2 mb-6">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                </span>
                <span className="text-sm font-semibold text-purple-900">Launching Q1 2026</span>
              </div>
              
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 leading-[1.1] mb-4 sm:mb-6">
                Your Intelligent <span className="bg-gradient-to-r from-blue-600 via-purple-700 to-indigo-900 bg-clip-text text-transparent">Health</span>
                <span className="sm:hidden"><br />and </span>
                <span className="hidden sm:inline"> &</span>
                <br className="hidden sm:block" />
                <span className="bg-gradient-to-r from-blue-600 via-purple-700 to-indigo-900 bg-clip-text text-transparent">Pain Management</span>
                <span className="sm:hidden"><br /></span>
                <span className="hidden sm:inline"> </span>
                Companion
              </h1>
              
              <p className="text-sm sm:text-base lg:text-lg text-gray-600 mb-6 sm:mb-8 max-w-3xl mx-auto leading-relaxed">
                <strong className="text-gray-800">Recalibrate App</strong> — The comprehensive allied health platform for chronic pain, chronic illness, and health management. Advanced Health Tracking and Analytics, Learn from our Academy, Explore exercises and tools, get AI-powered insights and chat about your health data, connect with physiotherapists, psychologists, pain specialists and other allied health professionals in your care team and much more!
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
                      className="bg-gradient-to-r from-blue-600 via-purple-600 to-purple-700 text-white px-6 py-3.5 rounded-xl font-semibold hover:shadow-lg hover:shadow-purple-500/25 transition-all disabled:opacity-60 flex items-center justify-center gap-2 hover:-translate-y-0.5"
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
              
              {/* Scarcity Messaging */}
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full px-6 py-2.5 shadow-lg shadow-purple-500/25">
                <Sparkles className="w-4 h-4 text-yellow-300" />
                <span className="font-semibold text-white text-sm">Limited Spaces Available</span>
                <span className="text-white/90 text-sm font-medium">• Join Cohort 1 Now</span>
              </div>
            </div>

            {/* Phone Mockup - Centered Below */}
            <div className="relative flex justify-center px-4 sm:px-8">
              {/* Container for phone and labels - scales together */}
              <div className="relative w-full max-w-[320px] sm:max-w-[400px] lg:max-w-[700px]">
                
                {/* Phone Frame - centered */}
                <div className="relative mx-auto w-[180px] h-[380px] sm:w-[220px] sm:h-[460px] lg:w-[280px] lg:h-[580px] bg-gray-900 rounded-[2rem] sm:rounded-[2.5rem] lg:rounded-[3rem] p-1.5 sm:p-2 lg:p-3 shadow-2xl shadow-purple-500/20 z-10">
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
                
                {/* Floating Labels - positioned relative to container, hidden on lg (desktop has own labels) */}
                {/* Left Column Labels */}
                <div className="absolute left-0 top-[5%] bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg sm:rounded-xl shadow-lg shadow-blue-500/25 p-1.5 sm:p-2 animate-float lg:hidden text-white z-20">
                  <div className="flex items-center gap-1 sm:gap-1.5">
                    <div className="w-6 h-6 sm:w-7 sm:h-7 bg-white/20 rounded-md sm:rounded-lg flex items-center justify-center flex-shrink-0">
                      <span className="text-[10px] sm:text-xs">📊</span>
                    </div>
                    <div>
                      <p className="font-bold text-[8px] sm:text-[9px]">Track Health</p>
                      <p className="text-[6px] sm:text-[7px] text-white/80">18+ variables</p>
                    </div>
                  </div>
                </div>
                
                <div className="absolute left-0 top-[22%] bg-gradient-to-r from-emerald-500 to-teal-600 rounded-lg sm:rounded-xl shadow-lg shadow-emerald-500/25 p-1.5 sm:p-2 animate-float-delayed lg:hidden text-white z-20">
                  <div className="flex items-center gap-1 sm:gap-1.5">
                    <div className="w-6 h-6 sm:w-7 sm:h-7 bg-white/20 rounded-md sm:rounded-lg flex items-center justify-center flex-shrink-0">
                      <span className="text-[10px] sm:text-xs">🎓</span>
                    </div>
                    <div>
                      <p className="font-bold text-[8px] sm:text-[9px]">Academy</p>
                      <p className="text-[6px] sm:text-[7px] text-white/80">100+ lessons</p>
                    </div>
                  </div>
                </div>
                
                <div className="absolute left-0 top-[42%] bg-gradient-to-r from-amber-500 to-orange-600 rounded-lg sm:rounded-xl shadow-lg shadow-amber-500/25 p-1.5 sm:p-2 animate-float lg:hidden text-white z-20">
                  <div className="flex items-center gap-1 sm:gap-1.5">
                    <div className="w-6 h-6 sm:w-7 sm:h-7 bg-white/20 rounded-md sm:rounded-lg flex items-center justify-center flex-shrink-0">
                      <span className="text-[10px] sm:text-xs">💊</span>
                    </div>
                    <div>
                      <p className="font-bold text-[8px] sm:text-[9px]">Medications</p>
                      <p className="text-[6px] sm:text-[7px] text-white/80">Track & remind</p>
                    </div>
                  </div>
                </div>
                
                <div className="absolute left-0 top-[62%] bg-gradient-to-r from-fuchsia-500 to-pink-600 rounded-lg sm:rounded-xl shadow-lg shadow-fuchsia-500/25 p-1.5 sm:p-2 animate-float-delayed lg:hidden text-white z-20">
                  <div className="flex items-center gap-1 sm:gap-1.5">
                    <div className="w-6 h-6 sm:w-7 sm:h-7 bg-white/20 rounded-md sm:rounded-lg flex items-center justify-center flex-shrink-0">
                      <span className="text-[10px] sm:text-xs">📈</span>
                    </div>
                    <div>
                      <p className="font-bold text-[8px] sm:text-[9px]">Analytics</p>
                      <p className="text-[6px] sm:text-[7px] text-white/80">Your progress</p>
                    </div>
                  </div>
                </div>
                
                {/* Right Column Labels */}
                <div className="absolute right-0 top-[12%] bg-gradient-to-r from-rose-500 to-pink-600 rounded-lg sm:rounded-xl shadow-lg shadow-rose-500/25 p-1.5 sm:p-2 animate-float-delayed lg:hidden text-white z-20">
                  <div className="flex items-center gap-1 sm:gap-1.5">
                    <div className="w-6 h-6 sm:w-7 sm:h-7 bg-white/20 rounded-md sm:rounded-lg flex items-center justify-center flex-shrink-0">
                      <span className="text-[10px] sm:text-xs">🔔</span>
                    </div>
                    <div>
                      <p className="font-bold text-[8px] sm:text-[9px]">Notifications</p>
                      <p className="text-[6px] sm:text-[7px] text-white/80">Stay on track</p>
                    </div>
                  </div>
                </div>
                
                <div className="absolute right-0 top-[32%] bg-gradient-to-r from-violet-500 to-purple-600 rounded-lg sm:rounded-xl shadow-lg shadow-violet-500/25 p-1.5 sm:p-2 animate-float lg:hidden text-white z-20">
                  <div className="flex items-center gap-1 sm:gap-1.5">
                    <div className="w-6 h-6 sm:w-7 sm:h-7 bg-white/20 rounded-md sm:rounded-lg flex items-center justify-center flex-shrink-0">
                      <span className="text-[10px] sm:text-xs">🤖</span>
                    </div>
                    <div>
                      <p className="font-bold text-[8px] sm:text-[9px]">AI Insights</p>
                      <p className="text-[6px] sm:text-[7px] text-white/80">Smart patterns</p>
                    </div>
                  </div>
                </div>
                
                <div className="absolute right-0 top-[52%] bg-gradient-to-r from-cyan-500 to-sky-600 rounded-lg sm:rounded-xl shadow-lg shadow-cyan-500/25 p-1.5 sm:p-2 animate-float-delayed lg:hidden text-white z-20">
                  <div className="flex items-center gap-1 sm:gap-1.5">
                    <div className="w-6 h-6 sm:w-7 sm:h-7 bg-white/20 rounded-md sm:rounded-lg flex items-center justify-center flex-shrink-0">
                      <span className="text-[10px] sm:text-xs">👥</span>
                    </div>
                    <div>
                      <p className="font-bold text-[8px] sm:text-[9px]">Care Team</p>
                      <p className="text-[6px] sm:text-[7px] text-white/80">Connect</p>
                    </div>
                  </div>
                </div>
                
                <div className="absolute right-0 top-[72%] bg-gradient-to-r from-lime-500 to-green-600 rounded-lg sm:rounded-xl shadow-lg shadow-lime-500/25 p-1.5 sm:p-2 animate-float lg:hidden text-white z-20">
                  <div className="flex items-center gap-1 sm:gap-1.5">
                    <div className="w-6 h-6 sm:w-7 sm:h-7 bg-white/20 rounded-md sm:rounded-lg flex items-center justify-center flex-shrink-0">
                      <span className="text-[10px] sm:text-xs">🛠️</span>
                    </div>
                    <div>
                      <p className="font-bold text-[8px] sm:text-[9px]">200+ Tools</p>
                      <p className="text-[6px] sm:text-[7px] text-white/80">Exercises</p>
                    </div>
                  </div>
                </div>

              </div>
              
              {/* Desktop Floating Cards - Use full width positioning */}
              {/* Top Left - Blue-Indigo: Track Health */}
              <div className="absolute left-[18%] top-8 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl shadow-xl shadow-blue-500/25 p-4 max-w-[200px] animate-float hidden lg:block text-white">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
                    <span className="text-lg">📊</span>
                  </div>
                  <div>
                    <p className="font-bold text-sm">Track Health</p>
                    <p className="text-xs text-white/80">18+ variables</p>
                  </div>
                </div>
              </div>
              
              {/* Top Right - Rose-Pink: Notifications */}
              <div className="absolute right-[18%] top-16 bg-gradient-to-r from-rose-500 to-pink-600 rounded-2xl shadow-xl shadow-rose-500/25 p-4 max-w-[190px] animate-float-delayed hidden lg:block text-white">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
                    <span className="text-lg">🔔</span>
                  </div>
                  <div>
                    <p className="font-bold text-sm">Notifications</p>
                    <p className="text-xs text-white/80">Stay on track</p>
                  </div>
                </div>
              </div>

              {/* Mid Left - Emerald-Teal: Learn Science */}
              <div className="absolute left-[12%] top-44 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-2xl shadow-xl shadow-emerald-500/25 p-4 max-w-[180px] animate-float-delayed hidden lg:block text-white">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
                    <span className="text-lg">🎓</span>
                  </div>
                  <div>
                    <p className="font-bold text-sm">Learn Science</p>
                    <p className="text-xs text-white/80">Health & Pain</p>
                  </div>
                </div>
              </div>

              {/* Mid Right - Violet-Purple: AI Insights */}
              <div className="absolute right-[12%] top-48 bg-gradient-to-r from-violet-500 to-purple-600 rounded-2xl shadow-xl shadow-violet-500/25 p-4 max-w-[170px] animate-float hidden lg:block text-white">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
                    <span className="text-lg">🤖</span>
                  </div>
                  <div>
                    <p className="font-bold text-sm">AI Insights</p>
                    <p className="text-xs text-white/80">Smart patterns</p>
                  </div>
                </div>
              </div>
              
              {/* Bottom Mid-Left - Amber-Orange: Medications */}
              <div className="absolute left-[16%] bottom-32 bg-gradient-to-r from-amber-500 to-orange-600 rounded-2xl shadow-xl shadow-amber-500/25 p-4 max-w-[190px] animate-float hidden lg:block text-white">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
                    <span className="text-lg">💊</span>
                  </div>
                  <div>
                    <p className="font-bold text-sm">Medications</p>
                    <p className="text-xs text-white/80">Track & remind</p>
                  </div>
                </div>
              </div>

              {/* Bottom Mid-Right - Cyan-Sky: Care Team */}
              <div className="absolute right-[16%] bottom-40 bg-gradient-to-r from-cyan-500 to-sky-600 rounded-2xl shadow-xl shadow-cyan-500/25 p-4 max-w-[180px] animate-float-delayed hidden lg:block text-white">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
                    <span className="text-lg">👥</span>
                  </div>
                  <div>
                    <p className="font-bold text-sm">Care Team</p>
                    <p className="text-xs text-white/80">Connect</p>
                  </div>
                </div>
              </div>
              
              {/* Bottom Left - Fuchsia-Pink: Analytics */}
              <div className="absolute left-[20%] bottom-8 bg-gradient-to-r from-fuchsia-500 to-pink-600 rounded-2xl shadow-xl shadow-fuchsia-500/25 p-4 max-w-[170px] text-white animate-float hidden lg:block">
                <div className="flex items-center gap-2">
                  <span className="text-lg">📈</span>
                  <div>
                    <p className="font-bold text-sm">Analytics</p>
                    <p className="text-xs text-white/80">Your progress</p>
                  </div>
                </div>
              </div>

              {/* Bottom Right - Lime-Green: 200+ Tools */}
              <div className="absolute right-[20%] bottom-12 bg-gradient-to-r from-lime-500 to-green-600 rounded-2xl shadow-xl shadow-lime-500/25 p-4 max-w-[160px] text-white animate-float-delayed hidden lg:block">
                <div className="flex items-center gap-2">
                  <span className="text-lg">🛠️</span>
                  <div>
                    <p className="font-bold text-sm">200+ Tools</p>
                    <p className="text-xs text-white/80">Exercises</p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* How It Works - 3D Animated Roadmap */}
        <section className="py-16 sm:py-20 lg:py-28 px-4 sm:px-6 bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900 overflow-hidden relative">
          {/* Background Effects */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-500/10 rounded-full blur-3xl"></div>
          </div>
          
          <div className="max-w-6xl mx-auto relative z-10">
            {/* Header */}
            <div className="text-center mb-12 lg:mb-16">
              <span className="inline-block bg-purple-500/20 text-purple-300 text-sm font-semibold px-4 py-2 rounded-full mb-4 border border-purple-500/30">
                Step 2 · Your Journey
              </span>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
                How It <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Works</span>
              </h2>
              <p className="text-base lg:text-lg text-purple-200/80 max-w-xl mx-auto">
                From first check-in to connected care — your 8-step path to better health management
              </p>
            </div>

            {/* 3D Roadmap */}
            <div className="relative">
              {/* The container - subtle 3D effect */}
              <div className="relative">
                
                {/* Glowing Road/Path - Desktop only (center vertical line) */}
                <div className="absolute left-1/2 top-0 bottom-0 w-1.5 -translate-x-1/2 bg-gradient-to-b from-blue-500 via-purple-500 via-pink-500 to-teal-500 rounded-full shadow-[0_0_30px_rgba(168,85,247,0.5)] hidden lg:block"></div>
                
                {/* Mobile: Left vertical line */}
                <div className="absolute left-6 sm:left-8 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-500 via-purple-500 via-pink-500 to-teal-500 rounded-full shadow-[0_0_20px_rgba(168,85,247,0.4)] lg:hidden"></div>

                {/* Journey Steps */}
                <div className="space-y-8 lg:space-y-10 relative">
                  
                  {/* Step 1 - Right side on desktop */}
                  <div className="flex items-start gap-4 lg:gap-0">
                    {/* Icon */}
                    <div className="relative z-10 flex-shrink-0 lg:absolute lg:left-1/2 lg:-translate-x-1/2">
                      <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center text-xl sm:text-2xl lg:text-3xl shadow-2xl shadow-blue-500/50 border-4 border-slate-900 transform hover:scale-110 hover:rotate-3 transition-all cursor-pointer">
                        📋
                      </div>
                    </div>
                    {/* Content - Right on desktop */}
                    <div className="flex-1 lg:w-[45%] lg:ml-[55%] lg:pl-8">
                      <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 lg:p-5 border border-white/20 shadow-xl hover:bg-white/15 transition-all">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-lg">1</span>
                          <h3 className="text-base lg:text-lg font-bold text-white">Initial Assessment</h3>
                        </div>
                        <p className="text-sm text-blue-200/80">Complete your health profile & baseline assessment</p>
                      </div>
                    </div>
                  </div>

                  {/* Step 2 - Left side on desktop */}
                  <div className="flex items-start gap-4 lg:gap-0">
                    <div className="relative z-10 flex-shrink-0 lg:absolute lg:left-1/2 lg:-translate-x-1/2">
                      <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center text-xl sm:text-2xl lg:text-3xl shadow-2xl shadow-emerald-500/50 border-4 border-slate-900 transform hover:scale-110 hover:-rotate-3 transition-all cursor-pointer">
                        ✅
                      </div>
                    </div>
                    <div className="flex-1 lg:w-[45%] lg:mr-[55%] lg:pr-8 lg:text-right">
                      <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 lg:p-5 border border-white/20 shadow-xl hover:bg-white/15 transition-all">
                        <div className="flex items-center gap-2 mb-2 lg:justify-end">
                          <h3 className="text-base lg:text-lg font-bold text-white lg:order-2">Daily Check Ins</h3>
                          <span className="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-lg">2</span>
                        </div>
                        <p className="text-sm text-emerald-200/80">Quick daily logging of symptoms & how you're feeling</p>
                      </div>
                    </div>
                  </div>

                  {/* Step 3 - Right side */}
                  <div className="flex items-start gap-4 lg:gap-0">
                    <div className="relative z-10 flex-shrink-0 lg:absolute lg:left-1/2 lg:-translate-x-1/2">
                      <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl flex items-center justify-center text-xl sm:text-2xl lg:text-3xl shadow-2xl shadow-cyan-500/50 border-4 border-slate-900 transform hover:scale-110 hover:rotate-3 transition-all cursor-pointer">
                        📊
                      </div>
                    </div>
                    <div className="flex-1 lg:w-[45%] lg:ml-[55%] lg:pl-8">
                      <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 lg:p-5 border border-white/20 shadow-xl hover:bg-white/15 transition-all">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="w-6 h-6 bg-cyan-500 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-lg">3</span>
                          <h3 className="text-base lg:text-lg font-bold text-white">Track Health</h3>
                        </div>
                        <p className="text-sm text-cyan-200/80">Physical, mental & lifestyle tracking - 18+ variables</p>
                      </div>
                    </div>
                  </div>

                  {/* Step 4 - Left side */}
                  <div className="flex items-start gap-4 lg:gap-0">
                    <div className="relative z-10 flex-shrink-0 lg:absolute lg:left-1/2 lg:-translate-x-1/2">
                      <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-2xl flex items-center justify-center text-xl sm:text-2xl lg:text-3xl shadow-2xl shadow-indigo-500/50 border-4 border-slate-900 transform hover:scale-110 hover:-rotate-3 transition-all cursor-pointer">
                        💊
                      </div>
                    </div>
                    <div className="flex-1 lg:w-[45%] lg:mr-[55%] lg:pr-8 lg:text-right">
                      <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 lg:p-5 border border-white/20 shadow-xl hover:bg-white/15 transition-all">
                        <div className="flex items-center gap-2 mb-2 lg:justify-end">
                          <h3 className="text-base lg:text-lg font-bold text-white lg:order-2">Medications</h3>
                          <span className="w-6 h-6 bg-indigo-500 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-lg">4</span>
                        </div>
                        <p className="text-sm text-indigo-200/80">Track medications, dosages & set reminders</p>
                      </div>
                    </div>
                  </div>

                  {/* Step 5 - Right side - Academy */}
                  <div className="flex items-start gap-4 lg:gap-0">
                    <div className="relative z-10 flex-shrink-0 lg:absolute lg:left-1/2 lg:-translate-x-1/2">
                      <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-gradient-to-br from-purple-500 to-violet-600 rounded-2xl flex items-center justify-center text-xl sm:text-2xl lg:text-3xl shadow-2xl shadow-purple-500/50 border-4 border-slate-900 transform hover:scale-110 hover:rotate-3 transition-all cursor-pointer">
                        🎓
                      </div>
                    </div>
                    <div className="flex-1 lg:w-[45%] lg:ml-[55%] lg:pl-8">
                      <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 lg:p-5 border border-white/20 shadow-xl hover:bg-white/15 transition-all">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-lg">5</span>
                          <h3 className="text-base lg:text-lg font-bold text-white">Academy</h3>
                        </div>
                        <p className="text-sm text-purple-200/80">100+ lessons on health & pain science</p>
                      </div>
                    </div>
                  </div>

                  {/* Step 6 - Left side - Tools */}
                  <div className="flex items-start gap-4 lg:gap-0">
                    <div className="relative z-10 flex-shrink-0 lg:absolute lg:left-1/2 lg:-translate-x-1/2">
                      <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-gradient-to-br from-amber-500 to-orange-500 rounded-2xl flex items-center justify-center text-xl sm:text-2xl lg:text-3xl shadow-2xl shadow-amber-500/50 border-4 border-slate-900 transform hover:scale-110 hover:-rotate-3 transition-all cursor-pointer">
                        🛠️
                      </div>
                    </div>
                    <div className="flex-1 lg:w-[45%] lg:mr-[55%] lg:pr-8 lg:text-right">
                      <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 lg:p-5 border border-white/20 shadow-xl hover:bg-white/15 transition-all">
                        <div className="flex items-center gap-2 mb-2 lg:justify-end">
                          <h3 className="text-base lg:text-lg font-bold text-white lg:order-2">Tools</h3>
                          <span className="w-6 h-6 bg-amber-500 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-lg">6</span>
                        </div>
                        <p className="text-sm text-amber-200/80">Journal, exercises & guided therapeutic activities</p>
                      </div>
                    </div>
                  </div>

                  {/* Step 7 - Right side */}
                  <div className="flex items-start gap-4 lg:gap-0">
                    <div className="relative z-10 flex-shrink-0 lg:absolute lg:left-1/2 lg:-translate-x-1/2">
                      <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-gradient-to-br from-pink-500 to-rose-500 rounded-2xl flex items-center justify-center text-xl sm:text-2xl lg:text-3xl shadow-2xl shadow-pink-500/50 border-4 border-slate-900 transform hover:scale-110 hover:rotate-3 transition-all cursor-pointer">
                        🤖
                      </div>
                    </div>
                    <div className="flex-1 lg:w-[45%] lg:ml-[55%] lg:pl-8">
                      <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 lg:p-5 border border-white/20 shadow-xl hover:bg-white/15 transition-all">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="w-6 h-6 bg-pink-500 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-lg">7</span>
                          <h3 className="text-base lg:text-lg font-bold text-white">AI Insights</h3>
                        </div>
                        <p className="text-sm text-pink-200/80">Personalized patterns & smart suggestions from AI</p>
                      </div>
                    </div>
                  </div>

                  {/* Step 8 - Left side */}
                  <div className="flex items-start gap-4 lg:gap-0">
                    <div className="relative z-10 flex-shrink-0 lg:absolute lg:left-1/2 lg:-translate-x-1/2">
                      <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-gradient-to-br from-teal-500 to-emerald-500 rounded-2xl flex items-center justify-center text-xl sm:text-2xl lg:text-3xl shadow-2xl shadow-teal-500/50 border-4 border-slate-900 transform hover:scale-110 hover:-rotate-3 transition-all cursor-pointer">
                        🤝
                      </div>
                    </div>
                    <div className="flex-1 lg:w-[45%] lg:mr-[55%] lg:pr-8 lg:text-right">
                      <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 lg:p-5 border border-white/20 shadow-xl hover:bg-white/15 transition-all">
                        <div className="flex items-center gap-2 mb-2 lg:justify-end">
                          <h3 className="text-base lg:text-lg font-bold text-white lg:order-2">Connect Care</h3>
                          <span className="w-6 h-6 bg-teal-500 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-lg">8</span>
                        </div>
                        <p className="text-sm text-teal-200/80">Share Reports and Data with Clinicians and Family members</p>
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            </div>

            {/* Subscription Tiers */}
            <div className="mt-12 lg:mt-16 flex justify-center items-center gap-3 sm:gap-6 flex-wrap">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-blue-500 shadow-lg shadow-blue-500/50"></div>
                <span className="text-sm text-blue-300 font-medium">Free</span>
              </div>
              <div className="w-8 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded"></div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-purple-500 shadow-lg shadow-purple-500/50"></div>
                <span className="text-sm text-purple-300 font-medium">Go</span>
              </div>
              <div className="w-8 h-0.5 bg-gradient-to-r from-purple-500 to-pink-500 rounded"></div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-pink-500 shadow-lg shadow-pink-500/50"></div>
                <span className="text-sm text-pink-300 font-medium">Pro</span>
              </div>
              <div className="w-8 h-0.5 bg-gradient-to-r from-pink-500 to-yellow-500 rounded"></div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-yellow-500 shadow-lg shadow-yellow-500/50"></div>
                <span className="text-sm text-yellow-300 font-medium">Super</span>
              </div>
            </div>
          </div>
        </section>


        {/* Features Section - Premium Design with Matching Colors */}
        <section id="features" className="py-16 sm:py-24 px-4 sm:px-6 scroll-mt-20 bg-gradient-to-b from-purple-50/40 via-white to-purple-50/50 relative overflow-hidden">
          {/* Subtle animated background */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-violet-500/5 rounded-full blur-3xl"></div>
          </div>
          
          <div className="max-w-5xl mx-auto relative z-10">
            {/* Section Header */}
            <div className="text-center mb-12">
              <span className="inline-block bg-gradient-to-r from-purple-500/10 to-violet-500/10 text-purple-700 text-sm font-semibold px-4 py-2 rounded-full mb-4 border border-purple-200">
                Comprehensive Platform
              </span>
              <h2 className="text-3xl sm:text-5xl font-bold text-gray-900 mb-4">
                200+ Tools & <span className="bg-gradient-to-r from-purple-600 to-violet-600 bg-clip-text text-transparent">Resources</span>
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Everything you need for allied health, chronic pain, and wellness
              </p>
            </div>

            {/* Feature Cards */}
            <div className="space-y-6">
              
              {/* Feature 1: Smart Tracker - Blue */}
              <div className="group grid grid-cols-1 lg:grid-cols-2 gap-6 items-center p-6 lg:p-8 bg-white/80 backdrop-blur-sm rounded-2xl border border-blue-200 shadow-sm hover:shadow-xl hover:shadow-blue-500/10 hover:border-blue-300 transition-all duration-300">
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/25 group-hover:scale-110 transition-transform">
                      <span className="text-2xl">📊</span>
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900">Smart Tracker</h3>
                      <span className="text-xs font-bold text-blue-600 bg-blue-100 px-2 py-0.5 rounded-full">FREE</span>
                    </div>
                  </div>
                  <p className="text-gray-600 mb-4">
                    Log pain, sleep, mood & energy across 8 health systems with our comprehensive tracking tools.
                  </p>
                  <ul className="space-y-2">
                    {["18+ health variables tracked", "Pain & mood monitoring", "Sleep quality analysis", "Medication tracking", "Energy level logging"].map((feature, i) => (
                      <li key={i} className="flex items-center gap-2 text-gray-700">
                        <CheckCircle className="w-5 h-5 text-blue-500 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl p-8 text-center relative overflow-hidden group-hover:scale-[1.02] transition-transform">
                  
                  <div className="relative">
                    <div className="text-6xl mb-4">🎯</div>
                    <p className="text-2xl font-bold text-white mb-2">18+ Variables</p>
                    <p className="text-blue-100">Across 8 biological systems</p>
                  </div>
                </div>
              </div>

              {/* Feature 2: Analytics Dashboard - Purple */}
              <div className="group grid grid-cols-1 lg:grid-cols-2 gap-6 items-center p-6 lg:p-8 bg-white/80 backdrop-blur-sm rounded-2xl border border-purple-200 shadow-sm hover:shadow-xl hover:shadow-purple-500/10 hover:border-purple-300 transition-all duration-300">
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-violet-500 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/25 group-hover:scale-110 transition-transform">
                      <span className="text-2xl">📈</span>
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h3>
                      <span className="text-xs font-bold text-purple-600 bg-purple-100 px-2 py-0.5 rounded-full">FREE</span>
                    </div>
                  </div>
                  <p className="text-gray-600 mb-4">
                    Your personal Stability Score calculated from 18 variables. Visualize trends and patterns.
                  </p>
                  <ul className="space-y-2">
                    {["Stability score tracking", "Trend analysis & visualization", "Pattern detection algorithms", "Doctor-ready reports", "Historical data comparison"].map((feature, i) => (
                      <li key={i} className="flex items-center gap-2 text-gray-700">
                        <CheckCircle className="w-5 h-5 text-purple-500 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="bg-gradient-to-br from-purple-500 to-violet-500 rounded-xl p-8 text-center relative overflow-hidden group-hover:scale-[1.02] transition-transform">
                  
                  <div className="relative">
                    <div className="text-6xl mb-4">📊</div>
                    <p className="text-2xl font-bold text-white mb-2">Stability Score</p>
                    <p className="text-purple-100">Real-time pattern detection</p>
                  </div>
                </div>
              </div>

              {/* Feature 3: Recalibrate Academy - Emerald */}
              <div className="group grid grid-cols-1 lg:grid-cols-2 gap-6 items-center p-6 lg:p-8 bg-white/80 backdrop-blur-sm rounded-2xl border border-emerald-200 shadow-sm hover:shadow-xl hover:shadow-emerald-500/10 hover:border-emerald-300 transition-all duration-300">
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/25 group-hover:scale-110 transition-transform">
                      <span className="text-2xl">🎓</span>
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900">Recalibrate Academy</h3>
                      <span className="text-xs font-bold text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded-full">GO</span>
                    </div>
                  </div>
                  <p className="text-gray-600 mb-4">
                    100+ lessons on health and pain science. Earn XP and badges as you learn evidence-based strategies.
                  </p>
                  <ul className="space-y-2">
                    {["100+ educational lessons", "Pain neuroscience modules", "Foundations & strategies", "XP & badge rewards", "Self-paced learning"].map((feature, i) => (
                      <li key={i} className="flex items-center gap-2 text-gray-700">
                        <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl p-8 text-center relative overflow-hidden group-hover:scale-[1.02] transition-transform">
                  
                  <div className="relative">
                    <div className="text-6xl mb-4">🧠</div>
                    <p className="text-2xl font-bold text-white mb-2">100+ Lessons</p>
                    <p className="text-emerald-100">Evidence-based pain education</p>
                  </div>
                </div>
              </div>

              {/* Feature 4: Tools & Exercises - Amber */}
              <div className="group grid grid-cols-1 lg:grid-cols-2 gap-6 items-center p-6 lg:p-8 bg-white/80 backdrop-blur-sm rounded-2xl border border-amber-200 shadow-sm hover:shadow-xl hover:shadow-amber-500/10 hover:border-amber-300 transition-all duration-300">
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl flex items-center justify-center shadow-lg shadow-amber-500/25 group-hover:scale-110 transition-transform">
                      <span className="text-2xl">🛠️</span>
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900">Tools & Exercises</h3>
                      <span className="text-xs font-bold text-amber-600 bg-amber-100 px-2 py-0.5 rounded-full">GO</span>
                    </div>
                  </div>
                  <p className="text-gray-600 mb-4">
                    Journaling, goal tracking, daily inspiration, and guided therapeutic exercises.
                  </p>
                  <ul className="space-y-2">
                    {["Reflective journaling", "Goal setting & tracking", "Daily inspiration quotes", "Guided exercises", "CBT & mindfulness tools"].map((feature, i) => (
                      <li key={i} className="flex items-center gap-2 text-gray-700">
                        <CheckCircle className="w-5 h-5 text-amber-500 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl p-8 text-center relative overflow-hidden group-hover:scale-[1.02] transition-transform">
                  
                  <div className="relative">
                    <div className="text-6xl mb-4">✨</div>
                    <p className="text-2xl font-bold text-white mb-2">Therapeutic Tools</p>
                    <p className="text-amber-100">CBT, Mindfulness & More</p>
                  </div>
                </div>
              </div>

              {/* Feature 5: Recalibrate AI - Pink/Rose */}
              <div className="group grid grid-cols-1 lg:grid-cols-2 gap-6 items-center p-6 lg:p-8 bg-white/80 backdrop-blur-sm rounded-2xl border-2 border-pink-300 shadow-lg shadow-pink-500/10 hover:shadow-xl hover:shadow-pink-500/20 hover:border-pink-400 transition-all duration-300 relative">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="bg-gradient-to-r from-pink-500 to-rose-500 text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-lg shadow-pink-500/25">AI Powered</span>
                </div>
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-rose-500 rounded-xl flex items-center justify-center shadow-lg shadow-pink-500/25 group-hover:scale-110 transition-transform">
                      <span className="text-2xl">🤖</span>
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900">Recalibrate AI</h3>
                      <span className="text-xs font-bold text-pink-600 bg-pink-100 px-2 py-0.5 rounded-full">PRO</span>
                    </div>
                  </div>
                  <p className="text-gray-600 mb-4">
                    Your AI companion for health insights. Get personalized patterns and research assistance.
                  </p>
                  <ul className="space-y-2">
                    {["Chat with health context", "Health and pain science research", "Pattern analysis", "Personalized suggestions", "24/7 AI availability"].map((feature, i) => (
                      <li key={i} className="flex items-center gap-2 text-gray-700">
                        <CheckCircle className="w-5 h-5 text-pink-500 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="bg-gradient-to-br from-pink-500 to-rose-500 rounded-xl p-8 text-center relative overflow-hidden group-hover:scale-[1.02] transition-transform">
                  
                  <div className="relative">
                    <div className="text-6xl mb-4">💬</div>
                    <p className="text-2xl font-bold text-white mb-2">Recalibrate AI</p>
                    <p className="text-pink-100">AI-powered health insights</p>
                  </div>
                </div>
              </div>

              {/* Feature 6: Care Team - Blue/Cyan */}
              <div className="group grid grid-cols-1 lg:grid-cols-2 gap-6 items-center p-6 lg:p-8 bg-white/80 backdrop-blur-sm rounded-2xl border border-cyan-200 shadow-sm hover:shadow-xl hover:shadow-cyan-500/10 hover:border-cyan-300 transition-all duration-300">
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-xl flex items-center justify-center shadow-lg shadow-cyan-500/25 group-hover:scale-110 transition-transform">
                      <span className="text-2xl">👥</span>
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900">Care Team</h3>
                      <span className="text-xs font-bold text-cyan-600 bg-cyan-100 px-2 py-0.5 rounded-full">PRO</span>
                    </div>
                  </div>
                  <p className="text-gray-600 mb-4">
                    Connect clinicians, researchers, family members, and friends with dedicated dashboards.
                  </p>
                  <ul className="space-y-2">
                    {["Clinician analytics access", "Research data sharing", "Family support dashboards", "Progress report exports", "Collaborative care coordination"].map((feature, i) => (
                      <li key={i} className="flex items-center gap-2 text-gray-700">
                        <CheckCircle className="w-5 h-5 text-cyan-500 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="bg-gradient-to-br from-cyan-500 to-blue-500 rounded-xl p-8 text-center relative overflow-hidden group-hover:scale-[1.02] transition-transform">
                  
                  <div className="relative">
                    <div className="text-6xl mb-4">🩺</div>
                    <p className="text-2xl font-bold text-white mb-2">Connected Care</p>
                    <p className="text-cyan-100">Clinicians, Family & Friends</p>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* Subscription Plans - Expanded with Toggle */}
        {/* Compact Pricing Section */}
        <section id="pricing" className="py-12 sm:py-16 px-4 sm:px-6 scroll-mt-20 bg-gradient-to-b from-purple-50/50 to-white">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-2xl sm:text-4xl font-bold text-gray-900 mb-3">Simple, Transparent Pricing</h2>
              <p className="text-gray-600">Choose the plan that fits your journey</p>
            </div>
            
            {/* Compact Pricing Grid - Same layout on mobile and desktop */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              {/* Free Plan */}
              <div className="bg-white rounded-xl sm:rounded-2xl p-3 sm:p-5 border-2 border-gray-200 hover:shadow-lg transition-shadow">
                <div className="flex items-center gap-1.5 sm:gap-2 mb-2 sm:mb-3">
                  <span className="text-lg sm:text-2xl">🆓</span>
                  <h3 className="text-base sm:text-xl font-bold text-gray-900">Free</h3>
                </div>
                <div className="mb-2 sm:mb-3">
                  <span className="text-2xl sm:text-3xl font-bold text-gray-900">$0</span>
                  <p className="text-xs sm:text-sm text-gray-500">Essential tracking</p>
                </div>
                <ul className="space-y-1 sm:space-y-1.5 mb-3 sm:mb-4 text-xs sm:text-sm">
                  {["Smart Tracking (18+ vars)", "Analytics Dashboard", "Medication tracking", "Basic Reports"].map((f, i) => (
                    <li key={i} className="flex items-center gap-1.5 sm:gap-2 text-gray-600">
                      <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-green-500 flex-shrink-0" />
                      <span className="text-[11px] sm:text-sm">{f}</span>
                    </li>
                  ))}
                </ul>
                <button onClick={() => document.getElementById('waitlist')?.scrollIntoView({ behavior: 'smooth', block: 'center' })} className="w-full bg-gray-100 text-gray-700 py-2 sm:py-2.5 rounded-lg sm:rounded-xl font-semibold hover:bg-gray-200 transition-all text-xs sm:text-sm">
                  Start Free
                </button>
              </div>

              {/* Go Plan */}
              <div className="bg-white rounded-xl sm:rounded-2xl p-3 sm:p-5 border-2 border-emerald-200 hover:shadow-lg transition-shadow">
                <div className="flex items-center gap-1.5 sm:gap-2 mb-2 sm:mb-3">
                  <span className="text-lg sm:text-2xl">🚀</span>
                  <h3 className="text-base sm:text-xl font-bold text-gray-900">Go</h3>
                </div>
                <div className="mb-2 sm:mb-3">
                  <span className="text-2xl sm:text-3xl font-bold text-gray-900">${subscriptionPlans[1].monthly}</span>
                  <span className="text-xs sm:text-sm text-gray-500">/mo</span>
                  <p className="text-[10px] sm:text-xs text-emerald-600 font-medium">or ${(parseFloat(subscriptionPlans[1].yearly) / 12).toFixed(2)}/mo yearly</p>
                </div>
                <ul className="space-y-1 sm:space-y-1.5 mb-3 sm:mb-4 text-xs sm:text-sm">
                  {["Everything in Free", "Full Academy (100+ lessons)", "Therapeutic Tools", "Journal & Goal Tracking"].map((f, i) => (
                    <li key={i} className="flex items-center gap-1.5 sm:gap-2 text-gray-600">
                      <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-green-500 flex-shrink-0" />
                      <span className="text-[11px] sm:text-sm">{f}</span>
                    </li>
                  ))}
                </ul>
                <button onClick={() => document.getElementById('waitlist')?.scrollIntoView({ behavior: 'smooth', block: 'center' })} className="w-full bg-emerald-500 text-white py-2 sm:py-2.5 rounded-lg sm:rounded-xl font-semibold hover:bg-emerald-600 transition-all text-xs sm:text-sm">
                  Get Go
                </button>
              </div>

              {/* Pro Plan - Popular */}
              <div className="bg-white rounded-xl sm:rounded-2xl p-3 sm:p-5 border-2 border-purple-500 shadow-lg shadow-purple-500/10 hover:shadow-xl transition-shadow relative">
                <div className="absolute -top-2 sm:-top-2.5 left-1/2 -translate-x-1/2">
                  <span className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-[8px] sm:text-[10px] font-bold px-2 sm:px-3 py-0.5 sm:py-1 rounded-full shadow-lg">POPULAR</span>
                </div>
                <div className="flex items-center gap-1.5 sm:gap-2 mb-2 sm:mb-3 mt-1">
                  <span className="text-lg sm:text-2xl">⭐</span>
                  <h3 className="text-base sm:text-xl font-bold text-gray-900">Pro</h3>
                </div>
                <div className="mb-2 sm:mb-3">
                  <span className="text-2xl sm:text-3xl font-bold text-gray-900">${subscriptionPlans[2].monthly}</span>
                  <span className="text-xs sm:text-sm text-gray-500">/mo</span>
                  <p className="text-[10px] sm:text-xs text-purple-600 font-medium">or ${(parseFloat(subscriptionPlans[2].yearly) / 12).toFixed(2)}/mo yearly</p>
                </div>
                <ul className="space-y-1 sm:space-y-1.5 mb-3 sm:mb-4 text-xs sm:text-sm">
                  {["Everything in Go", "Recalibrate AI", "Care Team Access", "Advanced Courses"].map((f, i) => (
                    <li key={i} className="flex items-center gap-1.5 sm:gap-2 text-gray-600">
                      <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-green-500 flex-shrink-0" />
                      <span className="text-[11px] sm:text-sm">{f}</span>
                    </li>
                  ))}
                </ul>
                <button onClick={() => document.getElementById('waitlist')?.scrollIntoView({ behavior: 'smooth', block: 'center' })} className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-2 sm:py-2.5 rounded-lg sm:rounded-xl font-semibold hover:shadow-lg transition-all text-xs sm:text-sm">
                  Go Pro
                </button>
              </div>

              {/* Super Plan */}
              <div className="bg-white rounded-2xl p-5 border-2 border-amber-300 hover:shadow-lg transition-shadow">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-2xl">💎</span>
                  <h3 className="text-xl font-bold text-gray-900">Super</h3>
                </div>
                <div className="mb-3">
                  <span className="text-3xl font-bold text-gray-900">${subscriptionPlans[3].monthly}</span>
                  <span className="text-sm text-gray-500">/mo</span>
                  <p className="text-xs text-amber-600 font-medium">or ${(parseFloat(subscriptionPlans[3].yearly) / 12).toFixed(2)}/mo yearly</p>
                </div>
                <ul className="space-y-1.5 mb-4 text-sm">
                  {["Everything in Pro", "More AI Credits", "More Care Team", "Priority Support"].map((f, i) => (
                    <li key={i} className="flex items-center gap-2 text-gray-600">
                      <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
                <button onClick={() => document.getElementById('waitlist')?.scrollIntoView({ behavior: 'smooth', block: 'center' })} className="w-full bg-gradient-to-r from-amber-500 to-orange-500 text-white py-2.5 rounded-xl font-semibold hover:shadow-lg transition-all text-sm">
                  Get Super
                </button>
              </div>
            </div>

            {/* Lifetime Option */}
            <div className="mt-6 bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl p-5 border-2 border-amber-300 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <span className="text-4xl">♾️</span>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Lifetime Super</h3>
                  <p className="text-sm text-gray-600">All Super features forever • VIP support • Early access</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <span className="text-3xl font-bold text-gray-900">${subscriptionPlans[4].monthly}</span>
                  <span className="text-sm text-gray-500"> once</span>
                </div>
                <button onClick={() => document.getElementById('waitlist')?.scrollIntoView({ behavior: 'smooth', block: 'center' })} className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-6 py-2.5 rounded-xl font-semibold hover:shadow-lg transition-all text-sm whitespace-nowrap">
                  Get Lifetime
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Evidence-Based Approaches - Dark purple background like How It Works */}
        <section className="py-12 sm:py-16 px-4 sm:px-6 bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900 relative overflow-hidden">
          {/* Background Effects */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-10 left-10 w-48 h-48 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-10 right-10 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
          </div>
          
          <div className="max-w-6xl mx-auto relative z-10">
            <div className="text-center mb-8">
              <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">Built on Evidence-Based Allied Health Science</h3>
              <p className="text-purple-200/80 text-sm sm:text-base">Recalibrate integrates proven approaches from leading allied health and pain research</p>
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
                <div key={i} className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20 text-center hover:bg-white/15 transition-all hover:-translate-y-1">
                  <div className={`w-12 h-12 mx-auto mb-2 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center text-xl shadow-lg`}>
                    {item.icon}
                  </div>
                  <p className="text-xs sm:text-sm font-semibold text-white">{item.label}</p>
                </div>
              ))}
            </div>
            
            <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
              {['Acceptance & Commitment', 'Pacing Strategies', 'Nutrition Science', 'Stress Management', 'Biofeedback', 'Goal Setting', 'Self-Compassion', 'Activity Tracking', 'Therapeutic Alliance', 'Neuroplasticity', 'Systems Biology', 'Precision Medicine'].map((item, i) => (
                <span key={i} className="bg-white/10 backdrop-blur text-purple-200 border border-purple-500/30 px-3 py-1.5 rounded-full text-xs sm:text-sm font-medium hover:bg-white/20 hover:border-purple-400/50 hover:text-white transition-all cursor-default">
                  {item}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* Clinicians & Partners - Premium Design */}
        <section id="partners" className="py-16 sm:py-24 px-4 sm:px-6 bg-gradient-to-b from-white via-purple-50/30 to-white scroll-mt-20 relative overflow-hidden">
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-20 left-0 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-20 right-0 w-72 h-72 bg-violet-500/10 rounded-full blur-3xl"></div>
          </div>
          
          <div className="max-w-5xl mx-auto relative z-10">
            <div className="text-center mb-12">
              <span className="inline-block bg-gradient-to-r from-purple-500/10 to-violet-500/10 text-purple-700 text-sm font-semibold px-4 py-2 rounded-full mb-4 border border-purple-200">
                For Professionals
              </span>
              <h2 className="text-3xl sm:text-5xl font-bold text-gray-900 mb-4">
                Partnerships & <span className="bg-gradient-to-r from-purple-600 to-violet-600 bg-clip-text text-transparent">Fundraising</span>
              </h2>
              <p className="text-lg text-gray-600">Join us in revolutionizing allied health and patient care</p>
            </div>
            
            {/* Partnership Cards */}
            <div className="space-y-6">
              {/* Healthcare Clinics - Blue */}
              <div className="group grid grid-cols-1 lg:grid-cols-2 gap-6 items-center p-6 lg:p-8 bg-white/80 backdrop-blur-sm rounded-2xl border border-blue-200 shadow-sm hover:shadow-xl hover:shadow-blue-500/10 hover:border-blue-300 transition-all duration-300">
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/25 group-hover:scale-110 transition-transform">
                      <span className="text-2xl">🩺</span>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900">Allied Health Clinics</h3>
                  </div>
                  <p className="text-gray-600 mb-4">
                    Integrate Recalibrate into your allied health practice. Perfect for physiotherapists, occupational therapists, chiropractors, dietitians, and psychologists.
                  </p>
                  <ul className="space-y-2 mb-6">
                    {["Multi-patient clinician dashboard", "Care team integration", "Secure data sharing", "Progress reports for appointments", "Allied health professional tools"].map((feature, i) => (
                      <li key={i} className="flex items-center gap-2 text-gray-700">
                        <CheckCircle className="w-5 h-5 text-blue-500 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <button onClick={() => setPartnerFormOpen('clinic')} className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg hover:shadow-blue-500/25 transition-all flex items-center gap-2">
                    Partner with us <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
                <div className="bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl p-8 text-center relative overflow-hidden group-hover:scale-[1.02] transition-transform">
                  
                  <div className="relative">
                    <div className="text-6xl mb-4">🏥</div>
                    <p className="text-2xl font-bold text-white mb-2">Clinical Dashboard</p>
                    <p className="text-blue-100">Track all your patients</p>
                  </div>
                </div>
              </div>

              {/* Research - Purple */}
              <div className="group grid grid-cols-1 lg:grid-cols-2 gap-6 items-center p-6 lg:p-8 bg-white/80 backdrop-blur-sm rounded-2xl border border-purple-200 shadow-sm hover:shadow-xl hover:shadow-purple-500/10 hover:border-purple-300 transition-all duration-300">
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-violet-500 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/25 group-hover:scale-110 transition-transform">
                      <span className="text-2xl">🔬</span>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900">Research Collaborations</h3>
                  </div>
                  <p className="text-gray-600 mb-4">
                    Access anonymized, aggregated data for allied health and chronic pain research. Advance the science of patient care.
                  </p>
                  <ul className="space-y-2 mb-6">
                    {["Longitudinal health datasets", "Multi-variable correlations", "Ethical data partnerships", "Allied health research collaboration"].map((feature, i) => (
                      <li key={i} className="flex items-center gap-2 text-gray-700">
                        <CheckCircle className="w-5 h-5 text-purple-500 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <button onClick={() => setPartnerFormOpen('research')} className="bg-gradient-to-r from-purple-500 to-violet-500 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg hover:shadow-purple-500/25 transition-all flex items-center gap-2">
                    Collaborate with us <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
                <div className="bg-gradient-to-br from-purple-500 to-violet-500 rounded-xl p-8 text-center relative overflow-hidden group-hover:scale-[1.02] transition-transform">
                  
                  <div className="relative">
                    <div className="text-6xl mb-4">📊</div>
                    <p className="text-2xl font-bold text-white mb-2">Research Data</p>
                    <p className="text-purple-100">Anonymized pain insights</p>
                  </div>
                </div>
              </div>

              {/* Investors - Emerald */}
              <div className="group grid grid-cols-1 lg:grid-cols-2 gap-6 items-center p-6 lg:p-8 bg-white/80 backdrop-blur-sm rounded-2xl border border-emerald-200 shadow-sm hover:shadow-xl hover:shadow-emerald-500/10 hover:border-emerald-300 transition-all duration-300">
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/25 group-hover:scale-110 transition-transform">
                      <span className="text-2xl">🤝</span>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900">Become an Investor</h3>
                  </div>
                  <p className="text-gray-600 mb-4">
                    Join us in building the future of allied health technology. We're raising our seed round to accelerate.
                  </p>
                  <ul className="space-y-2 mb-6">
                    {["$600B+ Allied Health & Chronic Pain Market", "1.5B+ affected by chronic illness", "AI-powered health insights", "Scalable B2B & B2C model", "Strong founding team", "Clear path to profitability"].map((feature, i) => (
                      <li key={i} className="flex items-center gap-2 text-gray-700">
                        <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <button onClick={() => setPartnerFormOpen('investor')} className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg hover:shadow-emerald-500/25 transition-all flex items-center gap-2">
                    Investor Prospectus <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
                <div className="bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl p-8 text-center relative overflow-hidden group-hover:scale-[1.02] transition-transform">
                  
                  <div className="relative">
                    <div className="text-6xl mb-4">📈</div>
                    <p className="text-2xl font-bold text-white mb-2">$250K Pre-Seed Round</p>
                    <p className="text-emerald-100">$1M Valuation</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Recalibrate Resources - Premium Design */}
        <section id="resources" className="py-16 sm:py-24 px-4 sm:px-6 scroll-mt-20 bg-gradient-to-b from-purple-50/40 via-white to-purple-50/30 relative overflow-hidden">
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-0 left-1/4 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-violet-500/10 rounded-full blur-3xl"></div>
          </div>
          
          <div className="max-w-5xl mx-auto relative z-10">
            <div className="text-center mb-12">
              <span className="inline-block bg-gradient-to-r from-purple-500/10 to-amber-500/10 text-purple-700 text-sm font-semibold px-4 py-2 rounded-full mb-4 border border-purple-200">
                Start Today
              </span>
              <h2 className="text-3xl sm:text-5xl font-bold text-gray-900 mb-4">
                Recalibrate <span className="bg-gradient-to-r from-purple-600 to-amber-600 bg-clip-text text-transparent">Resources</span>
              </h2>
              <p className="text-lg text-gray-600">Start your allied health and wellness journey today</p>
            </div>
            
            {/* Resource Cards */}
            <div className="space-y-6">
              {/* Blog Section - Clean Card with Preview */}
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-purple-200 shadow-sm overflow-hidden hover:shadow-xl hover:border-purple-300 transition-all duration-300">
                <div className="p-6 lg:p-8">
                  <div className="flex items-center justify-between flex-wrap gap-4 mb-6">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/25">
                        <FileText className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-gray-900">Recalibrate Blog</h3>
                        <p className="text-sm text-gray-500">Evidence-based articles on pain science & wellness</p>
                      </div>
                    </div>
                    <Link 
                      to="/blog"
                      className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-500 to-indigo-500 text-white px-5 py-2.5 rounded-xl font-semibold text-sm hover:shadow-lg hover:shadow-purple-500/25 transition-all hover:-translate-y-0.5"
                    >
                      View All Articles <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                  
                  {/* Blog Posts Preview Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {blogPosts.slice(0, 3).map((post) => (
                      <Link 
                        key={post.id}
                        to={`/blog/${post.slug}`}
                        className="group bg-gray-50 hover:bg-purple-50 rounded-xl p-4 transition-all duration-200"
                      >
                        <div className="flex items-start gap-3">
                          <span className="text-2xl">{post.icon}</span>
                          <div className="flex-1 min-w-0">
                            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full inline-block mb-2 ${
                              post.color === 'blue' ? 'bg-blue-100 text-blue-700' :
                              post.color === 'purple' ? 'bg-purple-100 text-purple-700' :
                              post.color === 'indigo' ? 'bg-indigo-100 text-indigo-700' :
                              post.color === 'emerald' ? 'bg-emerald-100 text-emerald-700' :
                              'bg-rose-100 text-rose-700'
                            }`}>
                              {post.category}
                            </span>
                            <h4 className="font-bold text-gray-900 group-hover:text-purple-700 transition-colors text-sm leading-tight line-clamp-2 mb-1">
                              {post.title}
                            </h4>
                            <p className="text-xs text-gray-500 flex items-center gap-1">
                              <Clock className="w-3 h-3" /> {post.readTime}
                            </p>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                  
                  {/* More Articles Indicator */}
                  <div className="mt-4 pt-4 border-t border-purple-100 flex items-center justify-between">
                    <p className="text-sm text-gray-500">
                      +{blogPosts.length - 3} more articles on pain science, sleep, mindfulness & more
                    </p>
                    <Link 
                      to="/blog"
                      className="text-sm text-purple-600 hover:text-purple-700 font-medium flex items-center gap-1"
                    >
                      Read all <ArrowUpRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </div>

              {/* Courses - Amber */}
              <a 
                href="https://www.etsy.com/shop/RecalibratePain" 
                target="_blank" 
                rel="noopener noreferrer"
                className="group grid grid-cols-1 lg:grid-cols-2 gap-6 items-center p-6 lg:p-8 bg-white/80 backdrop-blur-sm rounded-2xl border border-amber-200 shadow-sm hover:shadow-xl hover:shadow-amber-500/10 hover:border-amber-300 transition-all duration-300"
              >
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl flex items-center justify-center shadow-lg shadow-amber-500/25 group-hover:scale-110 transition-transform">
                      <span className="text-2xl">📚</span>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900">Courses & Products</h3>
                  </div>
                  <p className="text-gray-600 mb-4">
                    Explore our pain education resources, worksheets, and guides to start your journey today.
                  </p>
                  <ul className="space-y-2 mb-6">
                    {["Educational courses", "Downloadable worksheets", "Pain management guides", "Tracking templates", "Self-help resources"].map((feature, i) => (
                      <li key={i} className="flex items-center gap-2 text-gray-700">
                        <CheckCircle className="w-5 h-5 text-amber-500 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white px-6 py-3 rounded-xl font-semibold group-hover:shadow-lg group-hover:shadow-amber-500/25 transition-all">
                    Browse Products <ExternalLink className="w-4 h-4" />
                  </div>
                </div>
                <div className="bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl p-8 text-center relative overflow-hidden group-hover:scale-[1.02] transition-transform">
                  
                  <div className="relative">
                    <div className="text-6xl mb-4">🎓</div>
                    <p className="text-2xl font-bold text-white mb-2">Learn & Grow</p>
                    <p className="text-amber-100">Start your journey now</p>
                  </div>
                </div>
              </a>

              {/* Support - Pink */}
              <a 
                href="https://ko-fi.com/N4N21O1R1W" 
                target="_blank" 
                rel="noopener noreferrer"
                className="group grid grid-cols-1 lg:grid-cols-2 gap-6 items-center p-6 lg:p-8 bg-white/80 backdrop-blur-sm rounded-2xl border border-pink-200 shadow-sm hover:shadow-xl hover:shadow-pink-500/10 hover:border-pink-300 transition-all duration-300"
              >
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-rose-500 rounded-xl flex items-center justify-center shadow-lg shadow-pink-500/25 group-hover:scale-110 transition-transform">
                      <span className="text-2xl">☕</span>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900">Support Our Mission</h3>
                  </div>
                  <p className="text-gray-600 mb-4">
                    Help us build the future of pain management. Your support keeps our free resources available for everyone.
                  </p>
                  <ul className="space-y-2 mb-6">
                    {["Fund free resources", "Support app development", "Enable research initiatives", "Help more people", "Be part of the mission"].map((feature, i) => (
                      <li key={i} className="flex items-center gap-2 text-gray-700">
                        <CheckCircle className="w-5 h-5 text-pink-500 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="inline-flex items-center gap-2 bg-gradient-to-r from-pink-500 to-rose-500 text-white px-6 py-3 rounded-xl font-semibold group-hover:shadow-lg group-hover:shadow-pink-500/25 transition-all">
                    Buy Us a Coffee <ExternalLink className="w-4 h-4" />
                  </div>
                </div>
                <div className="bg-gradient-to-br from-pink-500 to-rose-500 rounded-xl p-8 text-center relative overflow-hidden group-hover:scale-[1.02] transition-transform">
                  
                  <div className="relative">
                    <div className="text-6xl mb-4">💜</div>
                    <p className="text-2xl font-bold text-white mb-2">Make a Difference</p>
                    <p className="text-pink-100">Every bit helps</p>
                  </div>
                </div>
              </a>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-16 sm:py-24 px-4 sm:px-6">
          <div className="max-w-4xl mx-auto">
            <div className="relative bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900 rounded-3xl p-8 sm:p-12 text-center overflow-hidden">
              {/* Decorative elements */}
              <div className="absolute top-0 left-0 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
              <div className="absolute bottom-0 right-0 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>
              
              <div className="relative">
                <p className="text-sm text-white/90 text-center mb-4">
                  🎁 Get instant access to our <span className="font-semibold text-white">free Self-Management 101 course</span> when you join
                </p>
                <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur rounded-full px-5 py-2.5 mb-6">
                  <Sparkles className="w-4 h-4 text-yellow-300" />
                  <span className="text-white font-semibold text-sm">Limited Spaces Available</span>
                  <span className="text-white/90 text-sm">• Join Cohort 1 Now</span>
                </div>
                
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
                  Ready to recalibrate your health?
                </h2>
                <p className="text-lg text-white/80 mb-8 max-w-xl mx-auto">
                  Join the revolution. Be the first to experience the future of allied health.
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
        <section id="faq" className="py-16 sm:py-20 px-4 sm:px-6 scroll-mt-20 bg-gradient-to-b from-white via-purple-50/20 to-white">
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
        <footer className="py-12 px-4 sm:px-6 bg-slate-900 text-white">
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
              <p className="text-gray-400 text-sm mb-4">Recalibrate. Smarter Health and Pain Technology</p>
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                <p className="text-gray-500 text-xs">© 2025 Recalibrate. Your intelligent allied health companion.</p>
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
            <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl max-h-[90vh] overflow-y-auto">
              {/* Header with gradient */}
              <div className={`p-6 rounded-t-3xl ${
                partnerFormOpen === 'clinic' ? 'bg-gradient-to-r from-blue-600 to-cyan-600' :
                partnerFormOpen === 'research' ? 'bg-gradient-to-r from-purple-600 to-indigo-600' :
                'bg-gradient-to-r from-emerald-600 to-teal-600'
              }`}>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                      <span className="text-2xl">
                        {partnerFormOpen === 'clinic' && '🏥'}
                        {partnerFormOpen === 'research' && '🔬'}
                        {partnerFormOpen === 'investor' && '💼'}
                      </span>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white">
                        {partnerFormOpen === 'clinic' && 'Allied Health Clinic'}
                        {partnerFormOpen === 'research' && 'Research Collaboration'}
                        {partnerFormOpen === 'investor' && 'Investor Inquiry'}
                      </h3>
                      <p className="text-sm text-white/80">
                        {partnerFormOpen === 'clinic' && 'Partner with Recalibrate'}
                        {partnerFormOpen === 'research' && 'Advance health science together'}
                        {partnerFormOpen === 'investor' && 'Join our journey'}
                      </p>
                    </div>
                  </div>
                  <button onClick={() => setPartnerFormOpen(null)} className="p-2 hover:bg-white/20 rounded-xl transition-colors"><X className="w-5 h-5 text-white" /></button>
                </div>
              </div>

              <div className="p-6">
                {/* Clinic Info Box */}
                {partnerFormOpen === 'clinic' && (
                  <div className="mb-6 p-4 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl border border-blue-100">
                    <h4 className="font-semibold text-blue-900 mb-2">Why Partner With Us?</h4>
                    <ul className="space-y-1.5 text-sm text-blue-800">
                      <li className="flex items-center gap-2"><span className="text-blue-500">✓</span> Multi-patient clinician dashboard</li>
                      <li className="flex items-center gap-2"><span className="text-blue-500">✓</span> Real-time patient progress tracking</li>
                      <li className="flex items-center gap-2"><span className="text-blue-500">✓</span> Secure data sharing & reports</li>
                      <li className="flex items-center gap-2"><span className="text-blue-500">✓</span> Allied health professional tools</li>
                    </ul>
                  </div>
                )}

                {/* Research Info Box */}
                {partnerFormOpen === 'research' && (
                  <div className="mb-6 p-4 bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl border border-purple-100">
                    <h4 className="font-semibold text-purple-900 mb-2">Research Partnership Benefits</h4>
                    <ul className="space-y-1.5 text-sm text-purple-800">
                      <li className="flex items-center gap-2"><span className="text-purple-500">✓</span> Longitudinal health datasets</li>
                      <li className="flex items-center gap-2"><span className="text-purple-500">✓</span> Multi-variable correlations</li>
                      <li className="flex items-center gap-2"><span className="text-purple-500">✓</span> Ethical data partnerships</li>
                      <li className="flex items-center gap-2"><span className="text-purple-500">✓</span> Allied health research collaboration</li>
                    </ul>
                  </div>
                )}

                {/* Investor Info Box */}
                {partnerFormOpen === 'investor' && (
                  <div className="mb-6 p-4 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl border border-emerald-100">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-lg">📊</span>
                      <h4 className="font-bold text-gray-900">Investor Prospectus Summary</h4>
                    </div>
                    <div className="space-y-2 text-sm text-gray-700">
                      <p><strong className="text-emerald-700">Mission:</strong> Empowering millions to recalibrate their lives through AI-driven allied health and wellness.</p>
                      <p><strong className="text-emerald-700">Market:</strong> $600B+ Allied Health & Chronic Pain Market | 1.5B+ affected by chronic illness.</p>
                      <p><strong className="text-emerald-700">Traction:</strong> 50+ organic Pre-launch waitlist, Pre-Seed Investment Secured, Secure architecture.</p>
                      <p><strong className="text-emerald-700">Opportunity:</strong> Raising $250K Pre-Seed Round at $1M Valuation to accelerate Development Testing, Clinical and Research Partnerships, Fund Independent Research Study, AI R&D and Marketing.</p>
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
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Your Name *</label>
                    <input type="text" required value={partnerForm.name} onChange={(e) => setPartnerForm({...partnerForm, name: e.target.value})} className="w-full px-4 py-3 bg-gray-50 text-gray-900 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent focus:bg-white transition-all" placeholder="John Doe" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Email Address *</label>
                    <input type="email" required value={partnerForm.email} onChange={(e) => setPartnerForm({...partnerForm, email: e.target.value})} className="w-full px-4 py-3 bg-gray-50 text-gray-900 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent focus:bg-white transition-all" placeholder="john@example.com" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Organization *</label>
                    <input type="text" required value={partnerForm.organization} onChange={(e) => setPartnerForm({...partnerForm, organization: e.target.value})} className="w-full px-4 py-3 bg-gray-50 text-gray-900 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent focus:bg-white transition-all" placeholder={
                      partnerFormOpen === 'clinic' ? 'Your clinic or practice name' :
                      partnerFormOpen === 'research' ? 'University or research institution' :
                      'Your company or fund'
                    } />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Message *</label>
                    <textarea required value={partnerForm.message} onChange={(e) => setPartnerForm({...partnerForm, message: e.target.value})} rows={4} className="w-full px-4 py-3 bg-gray-50 text-gray-900 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent focus:bg-white transition-all resize-none" placeholder={
                      partnerFormOpen === 'clinic' ? 'Tell us about your practice and how you would like to integrate Recalibrate...' :
                      partnerFormOpen === 'research' ? 'Describe your research focus and collaboration interests...' :
                      'Tell us about your investment focus and interest in Recalibrate...'
                    } />
                  </div>
                  <button type="submit" disabled={partnerSubmitting} className={`w-full py-3.5 rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50 text-white ${
                    partnerFormOpen === 'clinic' ? 'bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700' :
                    partnerFormOpen === 'research' ? 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700' :
                    'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700'
                  }`}>
                    {partnerSubmitting ? 'Submitting...' : 'Submit Inquiry'}
                  </button>
                  <p className="text-xs text-gray-500 text-center">We'll respond within 48 hours</p>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </ErrorBoundary>
  );
}

export default App;
