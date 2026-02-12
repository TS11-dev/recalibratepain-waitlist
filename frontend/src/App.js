import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight, Sparkles, ChevronDown, ChevronUp, ExternalLink,
  BarChart3, BookOpen, Users, Zap, Heart, Shield, Target
} from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

function App() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);

  const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || window.location.origin;

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
        body: JSON.stringify({ name: 'Website Subscriber', email: trimmedEmail })
      });
      const data = await response.json();
      if (response.ok && data.success) {
        if (typeof window.gtag === 'function') {
          window.gtag('event', 'sign_up', { method: 'waitlist', event_category: 'engagement', event_label: 'Waitlist Signup Success' });
        }
        toast.success("You're on the list! We'll email you when we launch.", { duration: 5000 });
        setEmail('');
      } else {
        toast.error(data.message || 'Something went wrong. Try again!');
      }
    } catch {
      toast.error('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const faqs = [
    { q: 'When does Recalibrate launch?', a: 'Q1 2026 on iOS, Android, and Web. Join the waitlist to be first in line!' },
    { q: 'Is my health data private?', a: '100% private. Encrypted, never shared, and you own your data. We follow secure, industry-standard practices.' },
    { q: 'How does the AI companion work?', a: 'Recalibrate AI analyzes your patterns and provides personalized insights based on your tracked data.' },
    { q: 'What makes this different?', a: 'We combine tracking, education, therapeutic tools, and AI insights in one comprehensive allied health platform designed for chronic pain, chronic illness, and rehabilitation.' },
    { q: 'Is there a cost?', a: 'We offer a free tier with essential features. Premium plans unlock advanced tools, AI insights, and Care Team access.' },
  ];

  const hubCards = [
    { to: '/features', title: 'Features', desc: 'Smart tracking, analytics, AI, academy & more', icon: <Zap className="w-6 h-6 text-white" />, gradient: 'from-blue-500 to-indigo-600', border: 'border-blue-200 hover:border-blue-300' },
    { to: '/protocol', title: 'Protocol', desc: '8-system clinical framework for chronic pain', icon: <Target className="w-6 h-6 text-white" />, gradient: 'from-emerald-500 to-teal-600', border: 'border-emerald-200 hover:border-emerald-300', badge: 'NEW' },
    { to: '/pricing', title: 'Pricing', desc: 'Free, Go, Pro, Super & Lifetime plans', icon: <BarChart3 className="w-6 h-6 text-white" />, gradient: 'from-purple-500 to-violet-600', border: 'border-purple-200 hover:border-purple-300' },
    { to: '/partners', title: 'Partners', desc: 'Clinics, research & investor opportunities', icon: <Users className="w-6 h-6 text-white" />, gradient: 'from-cyan-500 to-sky-600', border: 'border-cyan-200 hover:border-cyan-300' },
    { to: '/resources', title: 'Resources', desc: 'Blog, courses, products & support', icon: <BookOpen className="w-6 h-6 text-white" />, gradient: 'from-amber-500 to-orange-600', border: 'border-amber-200 hover:border-amber-300' },
    { to: '/blog', title: 'Blog', desc: 'Evidence-based articles on pain science', icon: <Heart className="w-6 h-6 text-white" />, gradient: 'from-rose-500 to-pink-600', border: 'border-rose-200 hover:border-rose-300' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50/30 to-indigo-50/50">
      <Toaster position="top-center" toastOptions={{ style: { borderRadius: '12px', background: '#1f2937', color: '#fff' } }} />
      <Navbar />

      {/* Hero Section */}
      <section className="pt-24 sm:pt-28 pb-8 sm:pb-16 px-4 sm:px-6 overflow-hidden bg-gradient-to-b from-slate-50 to-white relative">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl"></div>
          <div className="absolute top-40 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 left-1/3 w-72 h-72 bg-pink-500/10 rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center max-w-5xl mx-auto mb-8 sm:mb-12">
            <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-100 to-purple-100 border border-purple-200/50 rounded-full px-4 py-2 mb-6">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
              <span className="text-sm font-semibold text-purple-900">Launching Q1 2026</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 leading-[1.1] mb-4 sm:mb-6" data-testid="hero-title">
              Your Intelligent <span className="bg-gradient-to-r from-blue-600 via-purple-700 to-indigo-900 bg-clip-text text-transparent">Health</span>
              <span className="sm:hidden"><br />and </span>
              <span className="hidden sm:inline"> & </span>
              <br className="hidden sm:block" />
              <span className="bg-gradient-to-r from-blue-600 via-purple-700 to-indigo-900 bg-clip-text text-transparent">Pain Management</span>
              <span className="hidden sm:inline"> </span>
              <span className="sm:hidden"><br /></span>
              Companion
            </h1>

            <p className="text-sm sm:text-base lg:text-lg text-gray-600 mb-6 sm:mb-8 max-w-3xl mx-auto leading-relaxed">
              <strong className="text-gray-800">Recalibrate App</strong> is the comprehensive allied health platform for chronic pain, chronic illness, and health management. Advanced Health Tracking and Analytics, Learn from our Academy, Explore exercises and tools, get AI-powered insights and chat about your health data, connect with physiotherapists, psychologists, pain specialists and other allied health professionals in your care team and much more!
            </p>

            {/* Email Form */}
            <form onSubmit={handleEmailSubmit} className="max-w-lg mx-auto mb-6" id="waitlist" data-testid="waitlist-form">
              <div className="relative bg-white rounded-2xl shadow-xl shadow-purple-500/10 border border-purple-100 p-1.5">
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    data-testid="waitlist-email-input"
                    className="flex-1 px-5 py-3.5 bg-gray-50/50 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-purple-500/20 transition-all"
                    required
                  />
                  <button
                    type="submit"
                    disabled={loading}
                    data-testid="waitlist-submit-btn"
                    className="bg-gradient-to-r from-blue-600 via-purple-600 to-purple-700 text-white px-6 py-3.5 rounded-xl font-semibold hover:shadow-lg hover:shadow-purple-500/25 transition-all disabled:opacity-60 flex items-center justify-center gap-2 hover:-translate-y-0.5"
                  >
                    {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><span>Join Waitlist</span><ArrowRight className="w-4 h-4" /></>}
                  </button>
                </div>
              </div>
            </form>

            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full px-6 py-2.5 shadow-lg shadow-purple-500/25">
              <Sparkles className="w-4 h-4 text-yellow-300" />
              <span className="font-semibold text-white text-sm">Limited Spaces Available</span>
              <span className="text-white/90 text-sm font-medium">&#8226; Join Cohort 1 Now</span>
            </div>
          </div>

          {/* Phone Mockup */}
          <div className="text-center mb-6">
            <span className="inline-block bg-gradient-to-r from-blue-100 to-purple-100 text-purple-700 text-xs font-semibold px-3 py-1.5 rounded-full border border-purple-200">
              Step 1 &middot; First Look
            </span>
            <p className="text-sm text-gray-500 mt-2">See what you'll get</p>
          </div>

          <div className="relative flex justify-center px-4 sm:px-8">
            {/* Container for phone and labels */}
            <div className="relative w-full max-w-[320px] sm:max-w-[400px] lg:max-w-[700px]">

              {/* Phone Frame */}
              <div className="relative mx-auto w-[180px] h-[380px] sm:w-[220px] sm:h-[460px] lg:w-[280px] lg:h-[580px] bg-gray-900 rounded-[2rem] sm:rounded-[2.5rem] lg:rounded-[3rem] p-1.5 sm:p-2 lg:p-3 shadow-2xl shadow-purple-500/20 z-10">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-16 sm:w-20 lg:w-28 h-4 sm:h-5 lg:h-7 bg-gray-900 rounded-b-xl lg:rounded-b-2xl z-10"></div>
                <div className="w-full h-full bg-white rounded-[1.5rem] sm:rounded-[2rem] lg:rounded-[2.3rem] overflow-hidden">
                  <img src="/app-screenshot-optimized.jpg" alt="Recalibrate App" className="w-full h-full object-cover object-top" width="560" height="1102" loading="eager" decoding="async" />
                </div>
              </div>

              {/* Mobile Floating Labels (hidden on lg) */}
              <div className="absolute -left-8 sm:-left-12 top-[3%] bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg shadow-lg shadow-blue-500/25 p-1.5 sm:p-2 animate-float lg:hidden text-white z-20">
                <div className="flex items-center gap-1.5">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0"><span className="text-sm sm:text-base">📊</span></div>
                  <div><p className="font-bold text-[9px] sm:text-[11px]">18+ Health Metrics</p><p className="text-[7px] sm:text-[8px] text-white/80">Pain, sleep, mood</p></div>
                </div>
              </div>
              <div className="absolute -left-10 sm:-left-14 top-[24%] bg-gradient-to-r from-emerald-500 to-teal-600 rounded-lg shadow-lg shadow-emerald-500/25 p-1.5 sm:p-2 animate-float-delayed lg:hidden text-white z-20">
                <div className="flex items-center gap-1.5">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0"><span className="text-sm sm:text-base">🎓</span></div>
                  <div><p className="font-bold text-[9px] sm:text-[11px]">Pain Science Academy</p><p className="text-[7px] sm:text-[8px] text-white/80">100+ lessons</p></div>
                </div>
              </div>
              <div className="absolute -left-8 sm:-left-12 top-[50%] bg-gradient-to-r from-amber-500 to-orange-600 rounded-lg shadow-lg shadow-amber-500/25 p-1.5 sm:p-2 animate-float lg:hidden text-white z-20">
                <div className="flex items-center gap-1.5">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0"><span className="text-sm sm:text-base">🛠️</span></div>
                  <div><p className="font-bold text-[9px] sm:text-[11px]">Tools Library</p><p className="text-[7px] sm:text-[8px] text-white/80">Exercises, journal, goals</p></div>
                </div>
              </div>
              <div className="absolute -left-10 sm:-left-14 top-[72%] bg-gradient-to-r from-fuchsia-500 to-pink-600 rounded-lg shadow-lg shadow-fuchsia-500/25 p-1.5 sm:p-2 animate-float-delayed lg:hidden text-white z-20">
                <div className="flex items-center gap-1.5">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0"><span className="text-sm sm:text-base">📈</span></div>
                  <div><p className="font-bold text-[9px] sm:text-[11px]">Visual Analytics</p><p className="text-[7px] sm:text-[8px] text-white/80">Trends & correlations</p></div>
                </div>
              </div>
              <div className="absolute -right-8 sm:-right-12 top-[8%] bg-gradient-to-r from-rose-500 to-pink-600 rounded-lg shadow-lg shadow-rose-500/25 p-1.5 sm:p-2 animate-float-delayed lg:hidden text-white z-20">
                <div className="flex items-center gap-1.5">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0"><span className="text-sm sm:text-base">💊</span></div>
                  <div><p className="font-bold text-[9px] sm:text-[11px]">Medication Tracker</p><p className="text-[7px] sm:text-[8px] text-white/80">Reminders & logging</p></div>
                </div>
              </div>
              <div className="absolute -right-10 sm:-right-14 top-[30%] bg-gradient-to-r from-violet-500 to-purple-600 rounded-lg shadow-lg shadow-violet-500/25 p-1.5 sm:p-2 animate-float lg:hidden text-white z-20">
                <div className="flex items-center gap-1.5">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0"><span className="text-sm sm:text-base">🤖</span></div>
                  <div><p className="font-bold text-[9px] sm:text-[11px]">Recalibrate AI</p><p className="text-[7px] sm:text-[8px] text-white/80">Chat with your data</p></div>
                </div>
              </div>
              <div className="absolute -right-8 sm:-right-12 top-[52%] bg-gradient-to-r from-cyan-500 to-sky-600 rounded-lg shadow-lg shadow-cyan-500/25 p-1.5 sm:p-2 animate-float-delayed lg:hidden text-white z-20">
                <div className="flex items-center gap-1.5">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0"><span className="text-sm sm:text-base">👥</span></div>
                  <div><p className="font-bold text-[9px] sm:text-[11px]">Clinician Dashboard</p><p className="text-[7px] sm:text-[8px] text-white/80">Real-time patient data</p></div>
                </div>
              </div>
              <div className="absolute -right-10 sm:-right-14 top-[74%] bg-gradient-to-r from-lime-500 to-green-600 rounded-lg shadow-lg shadow-lime-500/25 p-1.5 sm:p-2 animate-float lg:hidden text-white z-20">
                <div className="flex items-center gap-1.5">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0"><span className="text-sm sm:text-base">👨‍👩‍👧</span></div>
                  <div><p className="font-bold text-[9px] sm:text-[11px]">3 User Types</p><p className="text-[7px] sm:text-[8px] text-white/80">Patient, Clinician, Carer</p></div>
                </div>
              </div>
            </div>

            {/* Desktop Floating Cards (hidden below lg) */}
            <div className="absolute left-[18%] top-8 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl shadow-xl shadow-blue-500/25 p-4 max-w-[200px] animate-float hidden lg:block text-white">
              <div className="flex items-start gap-3"><div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0"><span className="text-lg">📊</span></div><div><p className="font-bold text-sm">18+ Health Metrics</p><p className="text-xs text-white/80">Pain, sleep, mood & more</p></div></div>
            </div>
            <div className="absolute right-[18%] top-16 bg-gradient-to-r from-rose-500 to-pink-600 rounded-2xl shadow-xl shadow-rose-500/25 p-4 max-w-[190px] animate-float-delayed hidden lg:block text-white">
              <div className="flex items-start gap-3"><div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0"><span className="text-lg">💊</span></div><div><p className="font-bold text-sm">Medication Tracker</p><p className="text-xs text-white/80">Reminders & logging</p></div></div>
            </div>
            <div className="absolute left-[12%] top-44 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-2xl shadow-xl shadow-emerald-500/25 p-4 max-w-[200px] animate-float-delayed hidden lg:block text-white">
              <div className="flex items-start gap-3"><div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0"><span className="text-lg">🎓</span></div><div><p className="font-bold text-sm">Pain Science Academy</p><p className="text-xs text-white/80">100+ bite-sized lessons</p></div></div>
            </div>
            <div className="absolute right-[12%] top-48 bg-gradient-to-r from-violet-500 to-purple-600 rounded-2xl shadow-xl shadow-violet-500/25 p-4 max-w-[180px] animate-float hidden lg:block text-white">
              <div className="flex items-start gap-3"><div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0"><span className="text-lg">🤖</span></div><div><p className="font-bold text-sm">Recalibrate AI</p><p className="text-xs text-white/80">Chat with your data</p></div></div>
            </div>
            <div className="absolute left-[16%] bottom-32 bg-gradient-to-r from-amber-500 to-orange-600 rounded-2xl shadow-xl shadow-amber-500/25 p-4 max-w-[190px] animate-float hidden lg:block text-white">
              <div className="flex items-start gap-3"><div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0"><span className="text-lg">🛠️</span></div><div><p className="font-bold text-sm">Tools Library</p><p className="text-xs text-white/80">Exercises, journal, goals</p></div></div>
            </div>
            <div className="absolute right-[16%] bottom-40 bg-gradient-to-r from-cyan-500 to-sky-600 rounded-2xl shadow-xl shadow-cyan-500/25 p-4 max-w-[200px] animate-float-delayed hidden lg:block text-white">
              <div className="flex items-start gap-3"><div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0"><span className="text-lg">👥</span></div><div><p className="font-bold text-sm">Clinician Dashboard</p><p className="text-xs text-white/80">Real-time patient data</p></div></div>
            </div>
            <div className="absolute left-[20%] bottom-8 bg-gradient-to-r from-fuchsia-500 to-pink-600 rounded-2xl shadow-xl shadow-fuchsia-500/25 p-4 max-w-[170px] text-white animate-float hidden lg:block">
              <div className="flex items-center gap-2"><span className="text-lg">📈</span><div><p className="font-bold text-sm">Visual Analytics</p><p className="text-xs text-white/80">Trends & correlations</p></div></div>
            </div>
            <div className="absolute right-[20%] bottom-12 bg-gradient-to-r from-lime-500 to-green-600 rounded-2xl shadow-xl shadow-lime-500/25 p-4 max-w-[180px] text-white animate-float-delayed hidden lg:block">
              <div className="flex items-center gap-2"><span className="text-lg">👨‍👩‍👧</span><div><p className="font-bold text-sm">3 User Types</p><p className="text-xs text-white/80">Patient, Clinician, Carer</p></div></div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Roadmap */}
      <section className="py-16 sm:py-20 lg:py-28 px-4 sm:px-6 bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900 overflow-hidden relative">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        </div>

        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-12 lg:mb-16">
            <span className="inline-block bg-purple-500/20 text-purple-300 text-sm font-semibold px-4 py-2 rounded-full mb-4 border border-purple-500/30">
              Step 2 &middot; Your Journey
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
              How It <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Works</span>
            </h2>
            <p className="text-base lg:text-lg text-purple-200/80 max-w-xl mx-auto">
              The Recalibrate ecosystem from onboarding to connected care
            </p>
          </div>

          {/* Journey Steps */}
          <div className="relative">
            <div className="absolute left-6 sm:left-8 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-500 via-purple-500 via-pink-500 to-teal-500 rounded-full shadow-[0_0_20px_rgba(168,85,247,0.4)] lg:left-1/2 lg:-translate-x-1/2 lg:w-1.5 lg:shadow-[0_0_30px_rgba(168,85,247,0.5)]"></div>
            <div className="space-y-8 lg:space-y-10 relative">
              {[
                { icon: '📋', title: 'Initial Assessment', desc: 'Complete your health profile & baseline assessment', color: 'from-blue-500 to-cyan-500', num: 1 },
                { icon: '✅', title: 'Daily Check Ins', desc: "Quick daily logging of symptoms & how you're feeling", color: 'from-emerald-500 to-teal-500', num: 2 },
                { icon: '📊', title: 'Track Health', desc: 'Physical, mental & lifestyle tracking - 18+ variables', color: 'from-cyan-500 to-blue-600', num: 3 },
                { icon: '💊', title: 'Medications', desc: 'Track medications, dosages & set reminders', color: 'from-indigo-500 to-violet-600', num: 4 },
                { icon: '🎓', title: 'Academy', desc: '100+ lessons on health & pain science', color: 'from-purple-500 to-violet-600', num: 5 },
                { icon: '🛠️', title: 'Tools', desc: 'Journal, exercises & guided therapeutic activities', color: 'from-amber-500 to-orange-500', num: 6 },
                { icon: '🤖', title: 'AI Insights', desc: 'Personalized patterns & smart suggestions from AI', color: 'from-pink-500 to-rose-500', num: 7 },
                { icon: '🤝', title: 'Connect Care', desc: 'Share Reports and Data with Clinicians and Family', color: 'from-teal-500 to-emerald-500', num: 8 },
              ].map((step, i) => {
                const isRight = i % 2 === 0;
                return (
                  <div key={i} className="flex items-start gap-4 lg:gap-0">
                    <div className="relative z-10 flex-shrink-0 lg:absolute lg:left-1/2 lg:-translate-x-1/2">
                      <div className={`w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-gradient-to-br ${step.color} rounded-2xl flex items-center justify-center text-xl sm:text-2xl lg:text-3xl shadow-2xl border-4 border-slate-900 transform hover:scale-110 transition-all cursor-pointer`}>
                        {step.icon}
                      </div>
                    </div>
                    <div className={`flex-1 ${isRight ? 'lg:w-[45%] lg:ml-[55%] lg:pl-8' : 'lg:w-[45%] lg:mr-[55%] lg:pr-8 lg:text-right'}`}>
                      <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 lg:p-5 border border-white/20 shadow-xl hover:bg-white/15 transition-all">
                        <div className={`flex items-center gap-2 mb-2 ${!isRight ? 'lg:justify-end' : ''}`}>
                          {isRight ? (
                            <>
                              <span className={`w-6 h-6 bg-gradient-to-br ${step.color} rounded-full flex items-center justify-center text-white text-xs font-bold shadow-lg`}>{step.num}</span>
                              <h3 className="text-base lg:text-lg font-bold text-white">{step.title}</h3>
                            </>
                          ) : (
                            <>
                              <h3 className="text-base lg:text-lg font-bold text-white lg:order-2">{step.title}</h3>
                              <span className={`w-6 h-6 bg-gradient-to-br ${step.color} rounded-full flex items-center justify-center text-white text-xs font-bold shadow-lg`}>{step.num}</span>
                            </>
                          )}
                        </div>
                        <p className="text-sm text-purple-200/80">{step.desc}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Hub Navigation Cards */}
      <section className="py-16 sm:py-24 px-4 sm:px-6" data-testid="hub-cards-section">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <span className="inline-block bg-gradient-to-r from-purple-500/10 to-violet-500/10 text-purple-700 text-sm font-semibold px-4 py-2 rounded-full mb-4 border border-purple-200">
              Step 3 &middot; Explore
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Discover <span className="bg-gradient-to-r from-purple-600 to-violet-600 bg-clip-text text-transparent">Recalibrate</span>
            </h2>
            <p className="text-lg text-gray-600">Explore everything we have to offer</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {hubCards.map((card) => (
              <Link
                key={card.to}
                to={card.to}
                data-testid={`hub-card-${card.title.toLowerCase()}`}
                className={`group relative bg-white/80 backdrop-blur-sm rounded-2xl border p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 ${card.border}`}
              >
                {card.badge && (
                  <span className="absolute -top-2.5 right-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-[10px] font-bold px-3 py-1 rounded-full shadow-lg">{card.badge}</span>
                )}
                <div className={`w-12 h-12 bg-gradient-to-br ${card.gradient} rounded-xl flex items-center justify-center shadow-lg mb-4 group-hover:scale-110 transition-transform`}>
                  {card.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{card.title}</h3>
                <p className="text-gray-600 text-sm mb-4">{card.desc}</p>
                <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-purple-600 group-hover:text-purple-700 transition-colors">
                  Explore <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 sm:py-24 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <div className="relative bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900 rounded-3xl p-8 sm:p-12 text-center overflow-hidden">
            <div className="absolute top-0 left-0 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute bottom-0 right-0 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>
            <div className="relative">
              <p className="text-sm text-white/90 text-center mb-4">
                Get instant access to our <span className="font-semibold text-white">free Self-Management 101 course</span> when you join
              </p>
              <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur rounded-full px-5 py-2.5 mb-6">
                <Sparkles className="w-4 h-4 text-yellow-300" />
                <span className="text-white font-semibold text-sm">Limited Spaces Available</span>
                <span className="text-white/90 text-sm">&#8226; Join Cohort 1 Now</span>
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">Ready to recalibrate your health?</h2>
              <p className="text-lg text-white/80 mb-8 max-w-xl mx-auto">Join the revolution. Be the first to experience the future of allied health.</p>
              <form onSubmit={handleEmailSubmit} className="max-w-md mx-auto mb-6">
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    data-testid="cta-email-input"
                    className="flex-1 px-5 py-3.5 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:bg-white/20 focus:border-white/40 transition-all backdrop-blur-sm"
                    required
                  />
                  <button
                    type="submit"
                    disabled={loading}
                    data-testid="cta-submit-btn"
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
      <section id="faq" className="py-16 sm:py-20 px-4 sm:px-6 scroll-mt-20 bg-gradient-to-b from-white via-purple-50/20 to-white" data-testid="faq-section">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">Common questions</h2>
          </div>
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <div key={i} className="bg-white border border-purple-100 rounded-2xl overflow-hidden">
                <button onClick={() => setOpenFaq(openFaq === i ? null : i)} className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-purple-50/50 transition-colors" data-testid={`faq-item-${i}`}>
                  <span className="font-semibold text-gray-900">{faq.q}</span>
                  {openFaq === i ? <ChevronUp className="w-5 h-5 text-purple-600" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
                </button>
                {openFaq === i && <div className="px-6 pb-4 text-gray-600">{faq.a}</div>}
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default App;
