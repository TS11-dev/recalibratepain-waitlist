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
      price: "0",
      period: "forever",
      description: "Essential pain tracking",
      features: ["Basic symptom tracking", "Daily journal", "Community access"],
      popular: false,
      cta: "Start Free"
    },
    {
      name: "Recalibrate Go",
      price: "12.99",
      period: "/month",
      description: "Full Pain Academy & tools",
      features: ["Everything in Free", "Full Pain Academy", "Therapeutic tools", "Export reports"],
      popular: false,
      cta: "Get Go"
    },
    {
      name: "Recalibrate Pro",
      price: "34.99",
      period: "/month",
      description: "AI insights & Care Team",
      features: ["Everything in Go", "Recalibrate AI", "Care Team dashboards", "Priority support"],
      popular: true,
      cta: "Go Pro"
    },
    {
      name: "Lifetime Pro",
      price: "499.99",
      period: "one-time",
      description: "All Pro features forever",
      features: ["All Pro features", "Lifetime updates", "Founding member"],
      popular: false,
      cta: "Get Lifetime",
      isLifetime: true
    }
  ];

  const faqs = [
    { q: "When does Recalibrate launch?", a: "Q1 2026 on iOS, Android, and Web. Join the waitlist for early access and premium features free forever!" },
    { q: "Is my health data private?", a: "100% private. Encrypted, never shared, and you own your data. We follow HIPAA-compliant practices." },
    { q: "How does the AI companion work?", a: "Powered by Gemini 2.0 Flash, it analyzes your patterns and provides personalized insights based on your tracked data." },
    { q: "What makes this different?", a: "We combine tracking, education, therapeutic tools, and AI insights in one app designed specifically for chronic pain management." },
    { q: "Is there a cost?", a: "Free tier available forever. Early adopters from our waitlist get premium features free!" }
  ];

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50/30 to-indigo-50/50">
        <Toaster position="top-center" toastOptions={{ style: { borderRadius: '12px', background: '#1f2937', color: '#fff' } }} />
        
        {/* Navigation */}
        <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-purple-100/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <img src="/recalibrate-logo.png" alt="Recalibrate" className="h-10 w-auto" />
                <span className="text-xl font-bold bg-gradient-to-r from-gray-900 to-purple-900 bg-clip-text text-transparent">Recalibrate</span>
              </div>
              
              <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden p-2 hover:bg-purple-50 rounded-xl">
                {mobileMenuOpen ? <X className="w-6 h-6 text-gray-700" /> : <Menu className="w-6 h-6 text-gray-700" />}
              </button>
              
              <div className="hidden md:flex items-center space-x-1">
                {['features', 'pricing', 'partners', 'resources', 'faq'].map((item) => (
                  <button key={item} onClick={() => smoothScroll(item)} className="px-4 py-2 text-gray-600 hover:text-purple-600 text-sm font-medium rounded-lg hover:bg-purple-50 transition-all capitalize">
                    {item}
                  </button>
                ))}
                <button onClick={() => smoothScroll('waitlist')} className="ml-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:shadow-lg hover:shadow-purple-500/25 transition-all hover:-translate-y-0.5">
                  Join the Revolution
                </button>
              </div>
            </div>
          </div>
          
          {mobileMenuOpen && (
            <div className="md:hidden bg-white border-t border-purple-100 py-3 px-4 space-y-1">
              {['features', 'pricing', 'partners', 'resources', 'faq'].map((item) => (
                <button key={item} onClick={() => smoothScroll(item)} className="block w-full text-left py-3 px-4 text-gray-700 hover:bg-purple-50 rounded-xl capitalize">
                  {item}
                </button>
              ))}
              <button onClick={() => smoothScroll('waitlist')} className="w-full mt-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-xl font-semibold">
                Join the Revolution
              </button>
            </div>
          )}
        </nav>

        {/* Hero Section */}
        <section className="pt-24 sm:pt-32 pb-12 sm:pb-20 px-4 sm:px-6 overflow-hidden">
          <div className="max-w-7xl mx-auto">
            <div className="text-center max-w-4xl mx-auto">
              {/* Status Badge */}
              <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-purple-100 to-indigo-100 border border-purple-200/50 rounded-full px-4 py-2 mb-6">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
                </span>
                <span className="text-sm font-semibold text-purple-900">Launching Q1 2026</span>
                <span className="text-xs bg-purple-600 text-white px-2 py-0.5 rounded-full">iOS • Android • Web</span>
              </div>
              
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 leading-[1.1] mb-6">
                Your Health and Pain
                <span className="block bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 bg-clip-text text-transparent">
                  Management Companion
                </span>
              </h1>
              
              <p className="text-lg sm:text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
                Track symptoms, discover patterns with AI, access therapeutic tools, and learn from 200+ pain science lessons — all in one intelligent companion built for people living with chronic pain.
              </p>
              
              {/* Email Form */}
              <form onSubmit={handleEmailSubmit} className="max-w-lg mx-auto mb-8" id="waitlist">
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
                          <span>Join the Revolution</span>
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </form>
              
              {/* Social Proof */}
              <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
                <div className="flex items-center gap-2">
                  <div className="flex -space-x-2">
                    {['🧑‍⚕️', '👩‍💼', '👨‍🔬', '👩‍🎓'].map((emoji, i) => (
                      <div key={i} className="w-9 h-9 rounded-full bg-gradient-to-br from-purple-100 to-pink-100 border-2 border-white flex items-center justify-center text-sm shadow-sm">
                        {emoji}
                      </div>
                    ))}
                  </div>
                  <div className="text-sm">
                    <span className="font-bold text-gray-900">{waitlistCount > 0 ? waitlistCount.toLocaleString() : '...'}</span>
                    <span className="text-gray-500"> on waitlist</span>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-sm text-gray-500">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <span className="ml-1">from beta testers</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Trusted By */}
        <section className="py-8 px-4 sm:px-6 border-y border-purple-100/50 bg-white/50">
          <div className="max-w-5xl mx-auto">
            <p className="text-center text-sm text-gray-400 mb-4">Built with evidence-based approaches from</p>
            <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
              {['Pain Science', 'Cognitive Behavioral', 'Mindfulness', 'Movement Therapy', 'Graded Exposure'].map((item, i) => (
                <span key={i} className="text-gray-600 font-medium text-sm">{item}</span>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section - 200+ Tools & Resources */}
        <section id="features" className="py-16 sm:py-24 px-4 sm:px-6 scroll-mt-20 bg-gradient-to-b from-white to-purple-50/30">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <span className="inline-block text-purple-600 font-semibold text-sm uppercase tracking-wider mb-2">Everything You Need</span>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
                200+ Tools & Resources
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                90+ pain science lessons, multiple tracking tools & analytics, AI companion with different modes, medications management, therapeutic tools, and Care Team dashboards for clinicians, researchers, family & friends.
              </p>
            </div>
            
            {/* Feature Categories Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
              {[
                { icon: "📊", title: "Smart Tracking", desc: "Pain, sleep, mood, energy across 8 health systems", stat: "18+ variables" },
                { icon: "🧠", title: "Pain Academy", desc: "Learn pain science with XP, badges & streaks", stat: "90+ lessons" },
                { icon: "💊", title: "Medications", desc: "Track meds, effectiveness & side effects", stat: "Full tracking" },
                { icon: "🔔", title: "Notifications", desc: "Smart reminders for tracking & exercises", stat: "Customizable" },
                { icon: "📈", title: "Analytics", desc: "Stability dashboard with health scores", stat: "8 systems" },
                { icon: "🎯", title: "Therapeutic Tools", desc: "Journal, goals, inspiration, guided exercises", stat: "20+ tools" },
                { icon: "🤖", title: "Recalibrate AI", desc: "Multiple AI modes for personalized insights", stat: "Powered by Gemini" },
                { icon: "👥", title: "Care Team", desc: "Connect clinicians, researchers, family & friends", stat: "Built-in dashboards" }
              ].map((item, i) => (
                <div key={i} className="bg-white rounded-xl p-5 border border-purple-100 hover:border-purple-300 hover:shadow-lg transition-all group">
                  <span className="text-3xl mb-3 block">{item.icon}</span>
                  <h3 className="font-bold text-gray-900 mb-1">{item.title}</h3>
                  <p className="text-sm text-gray-600 mb-2">{item.desc}</p>
                  <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full">{item.stat}</span>
                </div>
              ))}
            </div>

            {/* Inside The App - 4 Cards */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
              {/* Pain Academy Preview */}
              <div className="bg-white rounded-2xl overflow-hidden shadow-lg shadow-purple-500/5 border border-purple-100">
                <div className="bg-gradient-to-r from-emerald-500 to-teal-600 p-4 text-white">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">🧠</span>
                    <span className="font-bold">Pain Academy</span>
                  </div>
                </div>
                <div className="p-4 space-y-3">
                  <div className="flex justify-between text-center">
                    <div className="bg-purple-50 rounded-lg px-3 py-1.5">
                      <p className="text-lg font-bold text-purple-600">835</p>
                      <p className="text-xs text-gray-500">XP</p>
                    </div>
                    <div className="bg-indigo-50 rounded-lg px-3 py-1.5">
                      <p className="text-lg font-bold text-indigo-600">90+</p>
                      <p className="text-xs text-gray-500">Lessons</p>
                    </div>
                    <div className="bg-amber-50 rounded-lg px-3 py-1.5">
                      <p className="text-lg font-bold text-amber-600">6</p>
                      <p className="text-xs text-gray-500">Badges</p>
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    {['Foundations', 'Neurobiology', 'Strategies'].map((c, i) => (
                      <div key={i} className="flex items-center gap-2 p-2 bg-green-50 rounded-lg text-sm">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span className="text-gray-700">{c}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              {/* Therapeutic Tools Preview */}
              <div className="bg-white rounded-2xl overflow-hidden shadow-lg shadow-purple-500/5 border border-purple-100">
                <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-4 text-white">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">🎯</span>
                    <span className="font-bold">Therapeutic Tools</span>
                  </div>
                </div>
                <div className="p-4 space-y-2">
                  {[
                    { icon: "📝", name: "Journal", desc: "Daily reflections" },
                    { icon: "🎯", name: "Goals", desc: "Track progress" },
                    { icon: "💡", name: "Inspiration", desc: "Daily motivation" },
                    { icon: "🏃", name: "Exercises", desc: "Guided movement" }
                  ].map((tool, i) => (
                    <div key={i} className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg hover:bg-purple-50 transition-colors">
                      <span className="text-lg">{tool.icon}</span>
                      <div>
                        <p className="font-medium text-gray-900 text-sm">{tool.name}</p>
                        <p className="text-xs text-gray-500">{tool.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* AI Insights Preview */}
              <div className="bg-white rounded-2xl overflow-hidden shadow-lg shadow-purple-500/5 border border-purple-100">
                <div className="bg-gradient-to-r from-gray-900 to-purple-900 p-4 text-white">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">🤖</span>
                    <span className="font-bold">Recalibrate AI</span>
                  </div>
                </div>
                <div className="p-4">
                  <div className="bg-gradient-to-br from-gray-50 to-purple-50 rounded-xl p-3 border border-purple-100 mb-3">
                    <div className="flex items-start gap-2">
                      <Bot className="w-6 h-6 text-purple-600" />
                      <p className="text-sm text-gray-700">Hey! 👋 I analyze your patterns and provide insights.</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {['💬 Chat', '🔬 Research', '📊 Insights'].map((tab, i) => (
                      <span key={i} className={`text-xs px-2 py-1 rounded-full ${i === 0 ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-600'}`}>
                        {tab}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Care Team Preview */}
              <div className="bg-white rounded-2xl overflow-hidden shadow-lg shadow-purple-500/5 border border-purple-100">
                <div className="bg-gradient-to-r from-pink-500 to-rose-600 p-4 text-white">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">👥</span>
                    <span className="font-bold">Care Team</span>
                  </div>
                </div>
                <div className="p-4 space-y-2">
                  {[
                    { icon: "🩺", name: "Clinicians", desc: "Patient dashboards" },
                    { icon: "🔬", name: "Researchers", desc: "Data access" },
                    { icon: "👨‍👩‍👧", name: "Family", desc: "Support network" },
                    { icon: "🤝", name: "Friends", desc: "Care coordination" }
                  ].map((member, i) => (
                    <div key={i} className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg">
                      <span className="text-lg">{member.icon}</span>
                      <div>
                        <p className="font-medium text-gray-900 text-sm">{member.name}</p>
                        <p className="text-xs text-gray-500">{member.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Subscription Plans Section - Compact */}
        <section id="pricing" className="py-12 sm:py-16 px-4 sm:px-6 scroll-mt-20">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-8">
              <span className="inline-block text-purple-600 font-semibold text-sm uppercase tracking-wider mb-2">Pricing</span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3">
                Simple, transparent pricing
              </h2>
              <p className="text-gray-600 max-w-xl mx-auto">
                Early waitlist members get premium features free forever.
              </p>
            </div>
            
            <div className="grid md:grid-cols-4 gap-4">
              {subscriptionPlans.map((plan, i) => (
                <div
                  key={i}
                  className={`relative bg-white rounded-xl p-4 border-2 transition-all ${
                    plan.popular 
                      ? 'border-purple-500 shadow-lg shadow-purple-500/15' 
                      : plan.isLifetime 
                        ? 'border-amber-300 shadow-md'
                        : 'border-purple-100/50 hover:border-purple-200'
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute -top-2.5 left-1/2 -translate-x-1/2">
                      <span className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                        Popular
                      </span>
                    </div>
                  )}
                  {plan.isLifetime && (
                    <div className="absolute -top-2.5 left-1/2 -translate-x-1/2">
                      <span className="bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                        Best Value
                      </span>
                    </div>
                  )}
                  
                  <div className="text-center mb-3 pt-1">
                    <h3 className="text-lg font-bold text-gray-900">{plan.name}</h3>
                    <div className="flex items-baseline justify-center gap-0.5 mt-1">
                      <span className="text-xs text-gray-500">$</span>
                      <span className="text-2xl font-extrabold text-gray-900">{plan.price}</span>
                      <span className="text-xs text-gray-500">{plan.period}</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">{plan.description}</p>
                  </div>
                  
                  <ul className="space-y-1.5 mb-3">
                    {plan.features.map((feature, fi) => (
                      <li key={fi} className="flex items-start gap-1.5 text-xs text-gray-600">
                        <CheckCircle className="w-3.5 h-3.5 text-green-500 flex-shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <button 
                    onClick={() => document.getElementById('waitlist')?.scrollIntoView({ behavior: 'smooth', block: 'center' })}
                    className={`w-full py-2 rounded-lg text-sm font-semibold transition-all ${
                      plan.popular 
                        ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:shadow-md' 
                        : plan.isLifetime
                          ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:shadow-md'
                          : 'bg-purple-50 text-purple-700 hover:bg-purple-100'
                    }`}
                  >
                    {plan.cta}
                  </button>
                </div>
              ))}
            </div>
            
            <p className="text-center text-xs text-gray-500 mt-4">
              💎 Join the waitlist now and lock in early adopter pricing!
            </p>
          </div>
        </section>

        {/* Clinician & Partnership Section */}
        <section id="partners" className="py-16 sm:py-24 px-4 sm:px-6 bg-gradient-to-b from-white to-purple-50/30 scroll-mt-20">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <span className="inline-block text-purple-600 font-semibold text-sm uppercase tracking-wider mb-2">For Professionals</span>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
                Clinicians & Partners
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Join us in revolutionizing chronic pain management. We're looking for healthcare professionals, researchers, and investors.
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-6">
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
                    <span>Patient progress reports</span>
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
                <a href="mailto:clinics@recalibratepain.com" className="text-purple-600 font-semibold hover:text-purple-700 flex items-center gap-2">
                  Partner with us <ArrowRight className="w-4 h-4" />
                </a>
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
                    <span>Longitudinal pain data</span>
                  </li>
                  <li className="flex items-center gap-2 text-sm text-gray-600">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>Multi-variable correlations</span>
                  </li>
                  <li className="flex items-center gap-2 text-sm text-gray-600">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>IRB-ready protocols</span>
                  </li>
                </ul>
                <a href="mailto:research@recalibratepain.com" className="text-purple-600 font-semibold hover:text-purple-700 flex items-center gap-2">
                  Collaborate with us <ArrowRight className="w-4 h-4" />
                </a>
              </div>
              
              {/* Investors */}
              <div className="bg-white rounded-2xl p-8 border border-purple-100 shadow-lg shadow-purple-500/5 hover:shadow-xl transition-all group">
                <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-green-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <span className="text-3xl">🤝</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Investors</h3>
                <p className="text-gray-600 mb-6">
                  Join us in building the future of pain management. We're raising a seed round to accelerate development.
                </p>
                <ul className="space-y-2 mb-6">
                  <li className="flex items-center gap-2 text-sm text-gray-600">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>$50B+ chronic pain market</span>
                  </li>
                  <li className="flex items-center gap-2 text-sm text-gray-600">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>{waitlistCount > 0 ? `${waitlistCount}+` : '190+'} waitlist signups</span>
                  </li>
                  <li className="flex items-center gap-2 text-sm text-gray-600">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>First-mover advantage in AI</span>
                  </li>
                </ul>
                <a href="mailto:investors@recalibratepain.com" className="text-purple-600 font-semibold hover:text-purple-700 flex items-center gap-2">
                  Get our pitch deck <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Free Resources Section - Expanded */}
        <section id="resources" className="py-16 sm:py-24 px-4 sm:px-6 scroll-mt-20">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <span className="inline-block text-purple-600 font-semibold text-sm uppercase tracking-wider mb-2">While You Wait</span>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
                Free Resources
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Start your pain management journey today with our free content and community.
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-6">
              {/* Newsletter */}
              <a 
                href="https://recalibrate.beehiiv.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-gradient-to-br from-purple-600 to-indigo-600 rounded-2xl p-8 text-white hover:shadow-xl hover:shadow-purple-500/25 transition-all group"
              >
                <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <span className="text-2xl">📬</span>
                </div>
                <h3 className="text-xl font-bold mb-2">Pain Science Newsletter</h3>
                <p className="text-white/80 mb-4">
                  Weekly insights on chronic pain management, research updates, and practical tips delivered to your inbox.
                </p>
                <span className="inline-flex items-center gap-2 text-white font-semibold">
                  Subscribe free <ExternalLink className="w-4 h-4" />
                </span>
              </a>
              
              {/* Recalibrate Resources */}
              <a 
                href="https://www.etsy.com/shop/RecalibratePain" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-white rounded-2xl p-8 border-2 border-purple-100 hover:border-purple-300 hover:shadow-xl transition-all group"
              >
                <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-amber-500 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <span className="text-2xl">📚</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Recalibrate Resources</h3>
                <p className="text-gray-600 mb-4">
                  Explore our pain education resources, worksheets, and guides to start your journey.
                </p>
                <span className="inline-flex items-center gap-2 text-purple-600 font-semibold">
                  Browse resources <ExternalLink className="w-4 h-4" />
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
                <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur rounded-full px-4 py-2 mb-6">
                  <Bell className="w-4 h-4 text-white" />
                  <span className="text-white font-medium text-sm">{waitlistCount > 0 ? `${waitlistCount.toLocaleString()} people` : '...'} already waiting</span>
                </div>
                
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
                  Ready to recalibrate your health?
                </h2>
                <p className="text-lg text-white/80 mb-8 max-w-xl mx-auto">
                  Join the revolution. Early adopters get premium features free forever.
                </p>
                
                <form onSubmit={handleEmailSubmit} className="max-w-md mx-auto">
                  <div className="flex flex-col sm:flex-row gap-3">
                    <input
                      type="email"
                      placeholder="your@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="flex-1 px-5 py-4 bg-white/10 backdrop-blur border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:bg-white/20 focus:border-white/40 transition-all"
                      required
                    />
                    <button
                      type="submit"
                      disabled={loading}
                      className="bg-white text-purple-700 px-8 py-4 rounded-xl font-bold hover:bg-purple-50 transition-all disabled:opacity-60 flex items-center justify-center gap-2"
                    >
                      {loading ? (
                        <div className="w-5 h-5 border-2 border-purple-300 border-t-purple-700 rounded-full animate-spin" />
                      ) : (
                        <>
                          <span>Join Waitlist</span>
                          <ArrowRight className="w-5 h-5" />
                        </>
                      )}
                    </button>
                  </div>
                </form>
                
                <p className="text-white/60 text-sm mt-4">No spam, ever. Unsubscribe anytime.</p>
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
                <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
                  <span className="font-bold">R</span>
                </div>
                <span className="font-bold text-lg">Recalibrate</span>
              </div>
              
              <div className="flex items-center gap-3">
                {[
                  { href: "https://www.instagram.com/recalibrateapp/", icon: "📸" },
                  { href: "https://www.linkedin.com/company/recalibrate-app/", icon: "💼" },
                  { href: "https://x.com/RecalibrateApp", icon: "𝕏" }
                ].map((s, i) => (
                  <a key={i} href={s.href} target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-gray-800 hover:bg-purple-600 rounded-xl flex items-center justify-center transition-colors">
                    {s.icon}
                  </a>
                ))}
              </div>
            </div>
            
            <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
              <p className="text-gray-400 text-sm">© 2025 Recalibrate. Your intelligent health companion.</p>
              <a href="mailto:info@recalibratepain.com" className="text-gray-400 hover:text-white text-sm flex items-center gap-2">
                <Mail className="w-4 h-4" />
                info@recalibratepain.com
              </a>
            </div>
          </div>
        </footer>

        {/* Contact Modal */}
        {showContactModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4" onClick={(e) => e.target === e.currentTarget && setShowContactModal(false)}>
            <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold">Get in Touch</h3>
                <button onClick={() => setShowContactModal(false)} className="p-2 hover:bg-gray-100 rounded-lg"><X className="w-5 h-5" /></button>
              </div>
              <a href="mailto:info@recalibratepain.com" className="flex items-center gap-4 p-4 bg-purple-50 rounded-xl hover:bg-purple-100 transition-colors">
                <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
                  <Mail className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Email Us</p>
                  <p className="text-purple-600">info@recalibratepain.com</p>
                </div>
              </a>
            </div>
          </div>
        )}
      </div>
    </ErrorBoundary>
  );
}

export default App;
