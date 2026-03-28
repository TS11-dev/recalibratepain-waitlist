import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight, Sparkles, ChevronDown, ChevronUp, ExternalLink,
  BarChart3, BookOpen, Users, Zap, Heart, Shield, Target,
  Brain, Activity, Globe, FileText, Stethoscope
} from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import toast, { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

function App() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);
  const [visibleSections, setVisibleSections] = useState({});

  const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || window.location.origin;

  // Intersection observer for scroll animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setVisibleSections(prev => ({ ...prev, [entry.target.id]: true }));
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );
    document.querySelectorAll('[data-animate]').forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

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
        toast.success("Welcome! Check your inbox for next steps.", { duration: 5000 });
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
    { q: 'Is Recalibrate available now?', a: "Yes! Recalibrate is now in beta. You can access the app at recalibratepain.app on web, with iOS and Android coming soon." },
    { q: 'Is my health data private?', a: '100% private. Encrypted, never shared, and you own your data. We follow secure, industry-standard practices.' },
    { q: 'How does the AI companion work?', a: 'Recalibrate AI analyzes your patterns and provides personalized insights based on your tracked data.' },
    { q: 'What makes this different?', a: 'We combine tracking, education, therapeutic tools, and AI insights in one comprehensive allied health platform designed for chronic pain, chronic illness, and rehabilitation.' },
    { q: 'Is there a cost?', a: 'We offer a free tier with essential features. Premium plans unlock advanced tools, AI insights, and Care Team access.' },
  ];

  const hubCards = [
    { to: '/features', title: 'App Features', desc: 'Smart tracking, analytics, AI, academy & therapeutic tools', icon: <Zap className="w-6 h-6 text-white" />, gradient: 'from-blue-500 to-indigo-600', accent: 'blue' },
    { to: 'https://recalibratepain.app/protocol', title: 'Recalibrate Protocol', desc: 'Includes: 12 Month Protocol, 8-Day Email Course, 250+ Research Directory', icon: <Target className="w-6 h-6 text-white" />, gradient: 'from-emerald-500 to-teal-600', accent: 'emerald', badge: 'NEW', external: true },
    { to: '/pricing', title: 'App Pricing', desc: 'Free, Go, Pro, Super & Lifetime plans', icon: <BarChart3 className="w-6 h-6 text-white" />, gradient: 'from-purple-500 to-violet-600', accent: 'purple' },
    { to: '/partners', title: 'Partners', desc: 'Clinics, research & investor opportunities', icon: <Users className="w-6 h-6 text-white" />, gradient: 'from-cyan-500 to-sky-600', accent: 'cyan' },
    { to: '/resources', title: 'Resources', desc: 'Courses, products & community support', icon: <BookOpen className="w-6 h-6 text-white" />, gradient: 'from-amber-500 to-orange-600', accent: 'amber' },
    { to: '/blog', title: 'Blog', desc: 'Evidence-based articles on pain science', icon: <Heart className="w-6 h-6 text-white" />, gradient: 'from-rose-500 to-pink-600', accent: 'rose' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50/30 to-indigo-50/50">
      <Helmet>
        <title>Recalibrate — Chronic Pain & Health Management App for Patients & Clinicians</title>
        <meta name="description" content="Track symptoms, learn pain science and get AI-powered insights — built for people living with chronic pain and the allied health clinicians who treat them. Now in beta. Free tier available." />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://recalibratepain.com" />
        <meta property="og:title" content="Recalibrate — Chronic Pain & Health Management App for Patients & Clinicians" />
        <meta property="og:description" content="Track symptoms, learn pain science and get AI-powered insights — built for people living with chronic pain and the allied health clinicians who treat them. Now in beta." />
        <meta property="og:url" content="https://recalibratepain.com" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Recalibrate" />
        <meta property="og:locale" content="en_US" />
        <meta property="og:image" content="https://recalibratepain.com/social-preview.jpg" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content="Recalibrate — Chronic Pain and Health Management App" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@RecalibrateApp" />
        <meta name="twitter:creator" content="@RecalibrateApp" />
        <meta name="twitter:title" content="Recalibrate — Chronic Pain & Health Management App for Patients & Clinicians" />
        <meta name="twitter:description" content="Symptom tracking, pain science education, AI insights and connected care — built from lived experience with fibromyalgia. Now in beta. Free tier." />
        <meta name="twitter:image" content="https://recalibratepain.com/social-preview.jpg" />
      </Helmet>
      <Toaster position="top-center" toastOptions={{ style: { borderRadius: '12px', background: '#1f2937', color: '#fff' } }} />
      <Navbar />

      {/* Hero Section */}
      <section className="relative min-h-[85vh] flex flex-col justify-center px-4 sm:px-6 overflow-hidden bg-gradient-to-br from-[#4a1d96] via-[#3b1282] to-[#2a0e6b]">
        {/* Animated background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="hero-orb hero-orb-1"></div>
          <div className="hero-orb hero-orb-2"></div>
          <div className="hero-orb hero-orb-3"></div>
          <div className="hero-orb hero-orb-4"></div>
          {/* Mesh gradient overlay */}
          <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.8) 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
          {/* Floating particles */}
          <div className="hero-particle hero-particle-1"></div>
          <div className="hero-particle hero-particle-2"></div>
          <div className="hero-particle hero-particle-3"></div>
          <div className="hero-particle hero-particle-4"></div>
          <div className="hero-particle hero-particle-5"></div>
          <div className="hero-particle hero-particle-6"></div>
        </div>

        <div className="max-w-7xl mx-auto relative z-10 pt-28 sm:pt-32 pb-12 sm:pb-16">
          <div className="text-center max-w-5xl mx-auto">
            <div className="hero-stagger-1 inline-flex items-center space-x-2 bg-white/[0.08] backdrop-blur-sm border border-white/[0.12] rounded-full px-5 py-2.5 mb-8">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
              </span>
              <span className="text-sm font-medium text-white/90">Welcome to Recalibrate</span>
              <span className="text-[10px] font-bold text-emerald-400 bg-emerald-400/15 px-2 py-0.5 rounded-full uppercase tracking-wider">Beta</span>
            </div>

            <h1 className="hero-stagger-2 text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-[1.1] mb-4 sm:mb-6" data-testid="hero-title">
              Your Intelligent <span className="bg-gradient-to-r from-purple-300 via-violet-300 to-blue-300 bg-clip-text text-transparent">Health</span>
              <span className="sm:hidden"><br />and </span>
              <span className="hidden sm:inline"> & </span>
              <br className="hidden sm:block" />
              <span className="bg-gradient-to-r from-purple-300 via-violet-300 to-blue-300 bg-clip-text text-transparent">Pain Management</span>
              <span className="hidden sm:inline"> </span>
              <span className="sm:hidden"><br /></span>
              Companion
            </h1>

            <p className="hero-stagger-3 text-sm sm:text-base lg:text-lg text-white/70 mb-6 sm:mb-8 max-w-3xl mx-auto leading-relaxed">
              <strong className="text-white/90">Recalibrate App</strong> is the comprehensive allied health platform for chronic pain, chronic illness, and health management. Advanced Health Tracking and Analytics, Learn from our Academy, Explore exercises and tools, get AI-powered insights and chat about your health data, connect with physiotherapists, psychologists, pain specialists and other allied health professionals in your care team and much more!
            </p>

            {/* CTA */}
            <div className="hero-stagger-4 flex items-center justify-center mb-8">
              <a
                href="https://recalibratepain.app"
                target="_blank"
                rel="noopener noreferrer"
                data-testid="hero-get-started-btn"
                className="group relative bg-white text-gray-900 px-10 py-4 rounded-2xl font-bold text-lg hover:shadow-2xl hover:shadow-purple-500/20 transition-all flex items-center justify-center gap-2 hover:-translate-y-1"
              >
                <span>Get Started Now</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </a>
            </div>

            <div className="hero-stagger-5 inline-flex items-center gap-2 bg-white/[0.06] backdrop-blur-sm border border-white/[0.1] rounded-full px-5 py-2.5">
              <Sparkles className="w-4 h-4 text-purple-400" />
              <span className="font-medium text-white/80 text-sm">Now in Beta</span>
              <span className="text-white/40 text-sm">&#8226;</span>
              <span className="text-white/60 text-sm">Free to Get Started</span>
            </div>
          </div>
        </div>

        {/* Bottom fade to next section */}
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-slate-50 to-transparent"></div>
      </section>

      {/* Step 2 · Meet Calum - Your Health Companion */}
      <section id="calum-section" data-animate data-testid="calum-section" className={`py-16 sm:py-24 px-4 sm:px-6 bg-gradient-to-br from-purple-50 via-indigo-50/50 to-white relative overflow-hidden transition-all duration-700 ${visibleSections['calum-section'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-8">
            <span className="inline-block bg-gradient-to-r from-purple-500/10 to-violet-500/10 text-purple-700 text-xs font-semibold px-3 py-1.5 rounded-full border border-purple-200">
              Step 2 &middot; Meet Your Health Companion
            </span>
          </div>
          <div className="relative bg-white rounded-3xl border border-purple-100 shadow-xl shadow-purple-500/5 overflow-hidden">
            <div className="absolute top-0 right-0 w-72 h-72 bg-purple-200/20 rounded-full blur-3xl -translate-y-1/3 translate-x-1/3 pointer-events-none"></div>
            <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12 p-8 sm:p-12">
              {/* Calum Image */}
              <div className="flex-shrink-0 relative">
                <div className="w-48 h-48 sm:w-56 sm:h-56 lg:w-64 lg:h-64 rounded-3xl overflow-hidden shadow-2xl shadow-purple-500/20 animate-float border-4 border-purple-100">
                  <img src="/calum-dragon.png" alt="Calum the Dragon - Recalibrate's mascot" className="w-full h-full object-cover" data-testid="calum-image" />
                </div>
                <div className="absolute -bottom-3 -right-3 bg-gradient-to-r from-purple-500 to-violet-600 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
                  Your Health Buddy
                </div>
              </div>

              {/* Calum Info */}
              <div className="flex-1 text-center lg:text-left">
                <span className="inline-block bg-purple-100 text-purple-700 text-xs font-bold px-3 py-1.5 rounded-full mb-4 uppercase tracking-wider">Meet Your Companion</span>
                <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4" data-testid="calum-title">
                  This is <span className="bg-gradient-to-r from-purple-600 to-violet-600 bg-clip-text text-transparent">Calum</span> the Dragon
                </h2>
                <p className="text-gray-600 leading-relaxed mb-6">
                  Calum is your friendly health companion throughout the Recalibrate app. He'll guide you through your health journey, celebrate your wins, keep you motivated on tough days, and make managing your health a little less daunting and a lot more fun. Think of him as your personal cheerleader who actually understands chronic pain.
                </p>
                <div className="flex flex-wrap gap-3 justify-center lg:justify-start">
                  {[
                    { label: 'Guides your journey', icon: '🧭' },
                    { label: 'Celebrates your wins', icon: '🎉' },
                    { label: 'Keeps you motivated', icon: '💪' },
                  ].map((trait, i) => (
                    <span key={i} className="inline-flex items-center gap-1.5 bg-purple-50 border border-purple-100 text-purple-700 text-sm font-medium px-3 py-2 rounded-xl">
                      <span>{trait.icon}</span> {trait.label}
                    </span>
                  ))}
                </div>
                <div className="mt-6">
                  <a
                    href="https://recalibratepain.app"
                    target="_blank"
                    rel="noopener noreferrer"
                    data-testid="calum-cta-btn"
                    className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-violet-600 text-white px-6 py-3 rounded-xl font-bold hover:shadow-lg hover:shadow-purple-500/25 transition-all hover:-translate-y-0.5"
                  >
                    Meet Calum in the App <ArrowRight className="w-4 h-4" />
                  </a>
                </div>
              </div>
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
              Step 3 &middot; Your Journey
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
              Step 4 &middot; Explore
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Discover <span className="bg-gradient-to-r from-purple-600 to-violet-600 bg-clip-text text-transparent">Recalibrate</span>
            </h2>
            <p className="text-lg text-gray-600">Explore everything we have to offer</p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-5">
            {hubCards.map((card) => {
              const CardTag = card.external ? 'a' : Link;
              const cardProps = card.external
                ? { href: card.to, target: '_blank', rel: 'noopener noreferrer' }
                : { to: card.to };
              return (
                <CardTag
                  key={card.to}
                  {...cardProps}
                  data-testid={`hub-card-${card.title.toLowerCase().replace(/\s+/g, '-')}`}
                  className="group relative bg-white rounded-2xl sm:rounded-3xl border border-gray-100 overflow-hidden hover:shadow-2xl transition-all duration-500 hover:-translate-y-1.5"
                >
                  {card.badge && (
                    <span className="absolute top-3 right-3 z-10 bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-[9px] sm:text-[10px] font-bold px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full shadow-lg shadow-emerald-500/30">{card.badge}</span>
                  )}
                  <div className={`h-24 sm:h-32 bg-gradient-to-br ${card.gradient} relative overflow-hidden`}>
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(255,255,255,0.2),transparent_60%)]"></div>
                    <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-white to-transparent"></div>
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-12 h-12 sm:w-16 sm:h-16 bg-white rounded-xl sm:rounded-2xl shadow-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <div className={`w-9 h-9 sm:w-12 sm:h-12 bg-gradient-to-br ${card.gradient} rounded-lg sm:rounded-xl flex items-center justify-center`}>
                        {card.icon}
                      </div>
                    </div>
                  </div>
                  <div className="pt-8 sm:pt-10 pb-4 sm:pb-6 px-3 sm:px-5 text-center">
                    <h3 className="text-sm sm:text-lg font-bold text-gray-900 mb-1 sm:mb-2">{card.title}</h3>
                    <p className="text-gray-500 text-[11px] sm:text-sm leading-snug mb-2 sm:mb-4 line-clamp-2">{card.desc}</p>
                    <span className="inline-flex items-center gap-1 text-xs sm:text-sm font-semibold text-purple-600 group-hover:text-purple-700 group-hover:gap-2 transition-all">
                      Explore <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </div>
                </CardTag>
              );
            })}
          </div>
        </div>
      </section>

      {/* Recalibrate: Understand Section */}
      <section id="understand-section" data-animate data-testid="understand-section" className={`py-16 sm:py-24 px-4 sm:px-6 bg-gradient-to-br from-indigo-950 via-purple-950 to-slate-950 relative overflow-hidden transition-all duration-700 ${visibleSections['understand-section'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-10 right-10 w-80 h-80 bg-purple-600/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 left-10 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl"></div>
        </div>
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-12">
            <span className="inline-block bg-purple-500/20 text-purple-300 text-sm font-semibold px-4 py-2 rounded-full mb-4 border border-purple-500/30">
              AI-Powered Assessment
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4" data-testid="understand-title">
              Recalibrate: <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Understand</span>
            </h2>
            <p className="text-base lg:text-lg text-purple-200/80 max-w-2xl mx-auto">
              Your condition, explained. An AI-powered deep assessment that maps what is happening across your body's 8 biological systems and gives you a personalized blueprint.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-12">
            {[
              { icon: <Brain className="w-6 h-6 text-white" />, title: 'AI-Powered Assessment', desc: 'Deep conversational analysis of your condition', gradient: 'from-violet-500 to-purple-600' },
              { icon: <Activity className="w-6 h-6 text-white" />, title: '8 Biological Systems', desc: 'Mapped to your specific symptoms', gradient: 'from-blue-500 to-cyan-600' },
              { icon: <Heart className="w-6 h-6 text-white" />, title: 'Biopsychosocial Model', desc: 'Biology, psychology, and environment', gradient: 'from-rose-500 to-pink-600' },
              { icon: <FileText className="w-6 h-6 text-white" />, title: 'Personalized Blueprint', desc: 'Your condition explained, your way forward', gradient: 'from-amber-500 to-orange-600' },
            ].map((item, i) => (
              <div key={i} className="group bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 hover:border-purple-500/30 transition-all duration-300 hover:-translate-y-1">
                <div className={`w-12 h-12 bg-gradient-to-br ${item.gradient} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  {item.icon}
                </div>
                <h3 className="text-white font-bold text-base mb-2">{item.title}</h3>
                <p className="text-purple-200/70 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>

          {/* How it works steps */}
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-6 sm:p-10 mb-10">
            <h3 className="text-xl font-bold text-white text-center mb-8">How it works</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { num: '01', title: 'Intake Form', desc: 'Answer structured questions about your condition, symptoms, and experience. Takes about 5 minutes.' },
                { num: '02', title: 'AI Conversation', desc: 'A short AI-guided conversation that digs deeper into your specific situation. About 5 minutes.' },
                { num: '03', title: 'Your Report', desc: 'Receive a personalized health blueprint explaining your condition across 8 biological systems.' },
              ].map((step, i) => (
                <div key={i} className="text-center">
                  <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-violet-600 rounded-2xl flex items-center justify-center mx-auto mb-4 text-white font-bold text-lg">{step.num}</div>
                  <h4 className="text-white font-bold mb-2">{step.title}</h4>
                  <p className="text-purple-200/70 text-sm leading-relaxed">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="text-center">
            <a
              href="https://recalibratepain.app/understand"
              target="_blank"
              rel="noopener noreferrer"
              data-testid="understand-cta-btn"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-500 to-violet-600 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:shadow-xl hover:shadow-purple-500/30 transition-all hover:-translate-y-1"
            >
              Begin Free Assessment <ArrowRight className="w-5 h-5" />
            </a>
            <p className="text-purple-300/60 text-sm mt-3">Takes about 10 minutes. Free basic report, $19.99 for full blueprint.</p>
          </div>
        </div>
      </section>

      {/* Health Portals Section */}
      <section id="health-portals-section" data-animate data-testid="health-portals-section" className={`py-16 sm:py-24 px-4 sm:px-6 relative overflow-hidden transition-all duration-700 ${visibleSections['health-portals-section'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <span className="inline-block bg-gradient-to-r from-emerald-500/10 to-teal-500/10 text-emerald-700 text-sm font-semibold px-4 py-2 rounded-full mb-4 border border-emerald-200">
              Free Patient Intelligence
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4" data-testid="health-portals-title">
              Health <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">Portals</span>
            </h2>
            <p className="text-base lg:text-lg text-gray-600 max-w-2xl mx-auto">
              Deep patient intelligence portals for the most misunderstood conditions on earth. Live research, evidence-rated treatments, clinical trials, and community.
            </p>
          </div>

          {/* Stats row */}
          <div className="flex flex-wrap justify-center gap-4 sm:gap-8 mb-12">
            {[
              { value: '2B+', label: 'Chronic Illness Patients' },
              { value: '4', label: 'Portals Live Now' },
              { value: '10+', label: 'Conditions Covered' },
              { value: 'Free', label: 'Forever' },
            ].map((stat, i) => (
              <div key={i} className="text-center px-4 py-3">
                <div className="text-2xl sm:text-3xl font-extrabold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">{stat.value}</div>
                <div className="text-xs sm:text-sm text-gray-500 font-medium mt-1">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Live Portals */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 mb-10">
            {[
              { emoji: '🧬', name: 'Fibromyalgia', tags: 'Widespread Pain · Fatigue · Sleep', desc: 'FIQ-R impact assessment, evidence-rated treatments, live research, clinical trials and global specialists.', url: 'https://recalibrate-health-portals.github.io/Portals/fibromyalgia/', color: 'from-purple-500 to-violet-600', borderColor: 'border-purple-200 hover:border-purple-400' },
              { emoji: '🦠', name: 'Long COVID / ME-CFS', tags: 'Post-Viral · Fatigue · Brain Fog', desc: 'PEM screener, evidence-rated treatments, live research, clinical trials, pacing guide.', url: 'https://recalibrate-health-portals.github.io/Portals/long-covid/', color: 'from-blue-500 to-indigo-600', borderColor: 'border-blue-200 hover:border-blue-400' },
              { emoji: '⚡', name: 'ADHD & Neurodivergence', tags: 'Attention · Executive Function', desc: 'ASRS self-screening, full medication guide, evidence-rated treatments, live research.', url: 'https://recalibrate-health-portals.github.io/Portals/adhd/', color: 'from-amber-500 to-orange-600', borderColor: 'border-amber-200 hover:border-amber-400' },
              { emoji: '🧠', name: 'Central Sensitisation', tags: 'Syndrome (CSS)', desc: 'Validated CSI self-assessment, evidence-rated treatments, live research, active clinical trials.', url: 'https://recalibrate-health-portals.github.io/Portals/css/', color: 'from-rose-500 to-pink-600', borderColor: 'border-rose-200 hover:border-rose-400' },
            ].map((portal, i) => (
              <a
                key={i}
                href={portal.url}
                target="_blank"
                rel="noopener noreferrer"
                data-testid={`portal-card-${i}`}
                className={`group relative bg-white rounded-2xl border ${portal.borderColor} p-5 hover:shadow-xl transition-all duration-300 hover:-translate-y-1.5 block`}
              >
                <span className="absolute top-3 right-3 flex items-center gap-1 bg-emerald-100 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded-full">
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span> LIVE
                </span>
                <div className="text-3xl mb-3">{portal.emoji}</div>
                <h3 className="font-bold text-gray-900 text-sm mb-1">{portal.name}</h3>
                <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wider mb-2">{portal.tags}</p>
                <p className="text-gray-500 text-xs leading-relaxed mb-3">{portal.desc}</p>
                <span className={`inline-flex items-center gap-1 text-xs font-semibold bg-gradient-to-r ${portal.color} bg-clip-text text-transparent`}>
                  Open Portal <ArrowRight className="w-3 h-3 text-purple-500 group-hover:translate-x-1 transition-transform" />
                </span>
              </a>
            ))}
          </div>

          {/* Coming Soon portals */}
          <div className="mb-8">
            <p className="text-center text-sm font-semibold text-gray-400 uppercase tracking-wider mb-5">Coming Soon</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              {[
                { emoji: '🩸', name: 'Diabetes' },
                { emoji: '🦋', name: 'Lupus (SLE)' },
                { emoji: '🦴', name: 'Rheumatoid Arthritis' },
                { emoji: '🧬', name: 'Endometriosis' },
                { emoji: '🫁', name: 'IBS' },
                { emoji: '🔴', name: 'Multiple Sclerosis' },
              ].map((portal, i) => (
                <div key={i} className="bg-gray-50 rounded-xl border border-gray-100 p-3 text-center opacity-70">
                  <div className="text-xl mb-1">{portal.emoji}</div>
                  <p className="text-xs font-semibold text-gray-600">{portal.name}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="text-center">
            <a
              href="https://recalibrate-health-portals.github.io/Portals"
              target="_blank"
              rel="noopener noreferrer"
              data-testid="view-all-portals-btn"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-7 py-3.5 rounded-2xl font-bold hover:shadow-xl hover:shadow-emerald-500/25 transition-all hover:-translate-y-1"
            >
              View All Portals <ExternalLink className="w-4 h-4" />
            </a>
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
              <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur rounded-full px-5 py-2.5 mb-6">
                <Sparkles className="w-4 h-4 text-yellow-300" />
                <span className="text-white font-semibold text-sm">Now in Beta</span>
                <span className="text-white/90 text-sm">&#8226; Free to Get Started</span>
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">Ready to recalibrate your health?</h2>
              <p className="text-lg text-white/80 mb-8 max-w-xl mx-auto">Join the revolution. Experience the future of allied health management today.</p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <a
                  href="https://recalibratepain.app"
                  target="_blank"
                  rel="noopener noreferrer"
                  data-testid="final-cta-app-btn"
                  className="bg-white text-gray-900 px-8 py-4 rounded-xl font-bold text-lg hover:bg-gray-50 transition-all flex items-center gap-2 hover:-translate-y-0.5"
                >
                  Go to App <ArrowRight className="w-5 h-5" />
                </a>
                <a
                  href="https://recalibratepain.app/understand"
                  target="_blank"
                  rel="noopener noreferrer"
                  data-testid="final-cta-understand-btn"
                  className="bg-white/10 border border-white/20 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-white/20 transition-all flex items-center gap-2 hover:-translate-y-0.5 backdrop-blur-sm"
                >
                  <Brain className="w-5 h-5" /> Free AI Assessment
                </a>
              </div>
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
