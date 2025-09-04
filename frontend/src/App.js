import React, { useState, useEffect } from 'react';
import { 
  Heart, Brain, Activity, Shield, Target, Smartphone,
  TrendingUp, Award, Globe, CheckCircle, ArrowRight, Sparkles,
  BarChart3, Calendar, Users, BookOpen, Bell, Play, Download,
  Zap, Settings, Eye, MessageCircle, Mail, ExternalLink,
  MapPin, Phone, Clock, ChevronDown, ChevronUp, Star
} from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

function App() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [subscribers, setSubscribers] = useState(127);
  const [openFaq, setOpenFaq] = useState(null);
  const [isVisible, setIsVisible] = useState({});
  const [showContactModal, setShowContactModal] = useState(false);

  // Use environment variable for backend URL
  const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || window.location.origin;

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

    // Observe all sections
    const sections = document.querySelectorAll('[data-animate]');
    sections.forEach(section => observer.observe(section));

    return () => observer.disconnect();
  }, []);

  // Fetch current subscriber count on load
  useEffect(() => {
    fetchSubscriberCount();
    const countInterval = setInterval(fetchSubscriberCount, 30000);
    return () => clearInterval(countInterval);
  }, []);

  const fetchSubscriberCount = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/waitlist/count?t=${Date.now()}`, {
        method: 'GET',
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setSubscribers(data.count);
      }
    } catch (error) {
      console.log('Network error, keeping current count');
    }
  };

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    
    if (!name.trim()) {
      toast.error('Please enter your name');
      return;
    }
    
    if (!email || !email.includes('@')) {
      toast.error('Please enter a valid email address');
      return;
    }

    setLoading(true);
    
    try {
      const response = await fetch(`${BACKEND_URL}/api/waitlist/join`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          name: name.trim(),
          email: email.toLowerCase().trim()
        })
      });

      if (response.ok) {
        const data = await response.json();
        toast.success('🚀 Welcome to the future of pain management!');
        setSubscribers(data.total_subscribers || subscribers + 1);
        setName('');
        setEmail('');
      } else {
        toast.success('🚀 Welcome to the future of pain management!');
        fetchSubscriberCount();
        setName('');
        setEmail('');
      }
    } catch (error) {
      toast.success('🚀 Welcome to the future of pain management!');
      fetchSubscriberCount();
      setName('');
      setEmail('');
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
      answer: "Healthcare providers can securely access your progress data (with your permission) to make more informed treatment decisions. This creates a collaborative care approach while keeping you in control."
    },
    {
      question: "What makes Recalibrate different from other health apps?",
      answer: "We're the first platform to combine multi-system health tracking, AI pattern recognition, evidence-based education, and seamless clinical integration in one comprehensive solution."
    }
  ];

  const smoothScroll = (targetId) => {
    const element = document.getElementById(targetId);
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/40 overflow-x-hidden">
      <Toaster position="top-center" />
      
      {/* Floating Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="floating-orb orb-1"></div>
        <div className="floating-orb orb-2"></div>
        <div className="floating-orb orb-3"></div>
      </div>
      
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200/50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-xl">R</span>
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-purple-600 bg-clip-text text-transparent">
                Recalibrate
              </span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <button onClick={() => smoothScroll('features')} className="text-gray-700 hover:text-purple-600 font-medium">Features</button>
              <button onClick={() => smoothScroll('ecosystem')} className="text-gray-700 hover:text-purple-600 font-medium">Ecosystem</button>
              <button onClick={() => setShowContactModal(true)} className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-full font-medium hover:shadow-lg transition-all">
                Contact
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Contact Modal */}
      {showContactModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-2xl max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold text-gray-900">Get in Touch</h2>
                <button 
                  onClick={() => setShowContactModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <p className="text-xl text-gray-600 max-w-2xl mb-8">
                Have questions about Recalibrate? We're here to help.
              </p>

              {/* Contact Info */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                <div className="text-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <Mail className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Email Us</h3>
                  <a href="mailto:info@recalibratepain.com" className="text-purple-600 hover:text-purple-700 font-medium">
                    info@recalibratepain.com
                  </a>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <MapPin className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Location</h3>
                  <p className="text-gray-600">San Francisco, CA</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-orange-600 to-red-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <Clock className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Response Time</h3>
                  <p className="text-gray-600">Within 24 hours</p>
                </div>
              </div>

              {/* FAQ Section */}
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h3>
                <div className="space-y-4">
                  {faqs.map((faq, index) => (
                    <div key={index} className="bg-gray-50 border border-gray-200 rounded-xl">
                      <button
                        onClick={() => setOpenFaq(openFaq === index ? null : index)}
                        className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-100 transition-colors duration-300 rounded-xl"
                      >
                        <span className="font-semibold text-gray-900">{faq.question}</span>
                        {openFaq === index ? (
                          <ChevronUp className="w-5 h-5 text-purple-600" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-gray-400" />
                        )}
                      </button>
                      {openFaq === index && (
                        <div className="px-6 pb-4 text-gray-600 leading-relaxed">
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

      {/* Hero Section */}
      <section className="pt-24 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            {/* Launch Announcement */}
            <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-100 to-purple-100 border border-blue-200 rounded-full px-6 py-3 mb-8">
              <Sparkles className="w-5 h-5 text-purple-600" />
              <span className="text-sm font-semibold text-gray-700">Launching on Google Play, iOS & Web</span>
              <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full">Coming Soon</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              <span className="bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 bg-clip-text text-transparent">
                Welcome to
              </span>
              <br />
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Recalibrate
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Your intelligent health and pain management companion
            </p>
            
            <p className="text-lg text-gray-500 mb-12 max-w-4xl mx-auto leading-relaxed">
              Track symptoms, learn from pain science, build your care team, use our built-in therapeutic tools 
              and get AI-powered insights to personalize your pain management and live a better life.
            </p>

            {/* Platform Badges */}
            <div className="flex flex-wrap justify-center gap-4 mb-12">
              <div className="flex items-center space-x-2 bg-white border border-gray-200 rounded-xl px-4 py-3 shadow-sm">
                <Smartphone className="w-5 h-5 text-blue-600" />
                <span className="font-medium text-gray-700">iOS App</span>
              </div>
              <div className="flex items-center space-x-2 bg-white border border-gray-200 rounded-xl px-4 py-3 shadow-sm">
                <Play className="w-5 h-5 text-green-600" />
                <span className="font-medium text-gray-700">Google Play</span>
              </div>
              <div className="flex items-center space-x-2 bg-white border border-gray-200 rounded-xl px-4 py-3 shadow-sm">
                <Globe className="w-5 h-5 text-purple-600" />
                <span className="font-medium text-gray-700">Web App</span>
              </div>
            </div>
          </div>

          {/* Hero Visual - Redesigned */}
          <div className="relative max-w-6xl mx-auto">
            <div className="bg-white rounded-3xl shadow-2xl border border-gray-200 overflow-hidden transform hover:scale-105 transition-all duration-500">
              {/* App Header */}
              <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-700 p-6 relative">
                <div className="flex items-center justify-between text-white">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm border border-white/30">
                      <span className="text-white font-bold text-lg">R</span>
                    </div>
                    <div>
                      <div className="font-bold text-lg">Recalibrate</div>
                      <div className="text-xs opacity-75">Health Dashboard</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium">Welcome Back 👋</div>
                    <div className="text-xs opacity-75">Last updated: Sep 4</div>
                  </div>
                </div>
              </div>

              {/* Dashboard Content */}
              <div className="p-8">
                {/* Main Metrics */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
                  <div className="text-center bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6 border border-blue-200">
                    <div className="text-4xl font-bold text-blue-600 mb-2">46%</div>
                    <div className="text-sm font-semibold text-gray-700">Current Stability</div>
                    <div className="text-xs text-gray-500 mt-1">Updated Sep 4</div>
                  </div>
                  <div className="text-center bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-6 border border-purple-200">
                    <div className="text-4xl font-bold text-purple-600 mb-2">0</div>
                    <div className="text-sm font-semibold text-gray-700">Lessons Completed</div>
                    <div className="text-xs text-gray-500 mt-1">0 XP Total</div>
                  </div>
                  <div className="text-center bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-6 border border-green-200">
                    <div className="text-4xl font-bold text-green-600 mb-2">7</div>
                    <div className="text-sm font-semibold text-gray-700">Days Tracked</div>
                    <div className="text-xs text-gray-500 mt-1">13 total entries</div>
                  </div>
                  <div className="text-center bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl p-6 border border-orange-200">
                    <div className="text-4xl font-bold text-orange-500 mb-2">36%</div>
                    <div className="text-sm font-semibold text-gray-700">Data Quality</div>
                    <div className="text-xs text-gray-500 mt-1">Getting better</div>
                  </div>
                </div>
                
                {/* Multi-System Analysis */}
                <div className="bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30 rounded-3xl p-8 border border-gray-200">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-2xl font-bold text-gray-800">Multi-System Analysis</h3>
                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      <span>Live Data</span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    <div className="text-center group">
                      <div className="w-16 h-16 bg-gradient-to-br from-red-100 to-red-200 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                        <Heart className="w-8 h-8 text-red-600" />
                      </div>
                      <div className="text-3xl font-bold text-red-600 mb-1">58</div>
                      <div className="text-sm font-medium text-gray-600">Neural</div>
                      <div className="w-full bg-red-100 rounded-full h-2 mt-2">
                        <div className="bg-red-500 h-2 rounded-full" style={{width: '58%'}}></div>
                      </div>
                    </div>
                    
                    <div className="text-center group">
                      <div className="w-16 h-16 bg-gradient-to-br from-orange-100 to-orange-200 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                        <Activity className="w-8 h-8 text-orange-600" />
                      </div>
                      <div className="text-3xl font-bold text-orange-600 mb-1">41</div>
                      <div className="text-sm font-medium text-gray-600">Musculoskeletal</div>
                      <div className="w-full bg-orange-100 rounded-full h-2 mt-2">
                        <div className="bg-orange-500 h-2 rounded-full" style={{width: '41%'}}></div>
                      </div>
                    </div>
                    
                    <div className="text-center group">
                      <div className="w-16 h-16 bg-gradient-to-br from-yellow-100 to-yellow-200 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                        <Zap className="w-8 h-8 text-yellow-600" />
                      </div>
                      <div className="text-3xl font-bold text-yellow-600 mb-1">44</div>
                      <div className="text-sm font-medium text-gray-600">Autonomic</div>
                      <div className="w-full bg-yellow-100 rounded-full h-2 mt-2">
                        <div className="bg-yellow-500 h-2 rounded-full" style={{width: '44%'}}></div>
                      </div>
                    </div>
                    
                    <div className="text-center group">
                      <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-green-200 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                        <Shield className="w-8 h-8 text-green-600" />
                      </div>
                      <div className="text-3xl font-bold text-green-600 mb-1">51</div>
                      <div className="text-sm font-medium text-gray-600">Immune</div>
                      <div className="w-full bg-green-100 rounded-full h-2 mt-2">
                        <div className="bg-green-500 h-2 rounded-full" style={{width: '51%'}}></div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Insights Panel */}
                  <div className="mt-6 bg-white/60 rounded-2xl p-4 border border-white/50">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                          <Brain className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <div className="font-semibold text-gray-800">AI Insight</div>
                          <div className="text-sm text-gray-600">Your neural patterns suggest improved stability trends</div>
                        </div>
                      </div>
                      <button className="bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors">
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Features */}
      <section id="features" className="py-20 px-6 bg-white relative" data-animate>
        <div className="max-w-7xl mx-auto">
          <div className={`text-center mb-16 transition-all duration-1000 ${isVisible.features ? 'animate-fade-in-up' : 'opacity-0 translate-y-12'}`}>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-gray-900 to-purple-600 bg-clip-text text-transparent">
                Revolutionary Pain Management
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Advanced AI meets evidence-based medicine to transform how you understand and manage chronic pain
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Brain,
                title: "AI Pattern Recognition",
                description: "Advanced algorithms identify pain patterns and predict flare-ups using machine learning from your personal health data.",
                gradient: "from-blue-50 to-blue-100",
                border: "border-blue-200",
                iconBg: "from-blue-600 to-blue-700",
                delay: "delay-100"
              },
              {
                icon: Activity,
                title: "Multi-System Tracking",
                description: "Monitor 8 interconnected health systems: neural, immune, musculoskeletal, autonomic, and more for comprehensive insights.",
                gradient: "from-purple-50 to-purple-100",
                border: "border-purple-200",
                iconBg: "from-purple-600 to-purple-700",
                delay: "delay-200"
              },
              {
                icon: Shield,
                title: "Clinical Integration",
                description: "Seamless provider collaboration with evidence-based protocols and real-time data sharing capabilities.",
                gradient: "from-green-50 to-green-100",
                border: "border-green-200",
                iconBg: "from-green-600 to-green-700",
                delay: "delay-300"
              },
              {
                icon: Target,
                title: "Personalized Care",
                description: "Tailored treatment protocols based on individual health patterns, responses, and personal care preferences.",
                gradient: "from-orange-50 to-orange-100",
                border: "border-orange-200",
                iconBg: "from-orange-600 to-orange-700",
                delay: "delay-400"
              },
              {
                icon: BarChart3,
                title: "Advanced Analytics",
                description: "Weighted scoring algorithms provide actionable health insights and data-driven recommendations.",
                gradient: "from-indigo-50 to-indigo-100",
                border: "border-indigo-200",
                iconBg: "from-indigo-600 to-indigo-700",
                delay: "delay-500"
              },
              {
                icon: TrendingUp,
                title: "Predictive Insights",
                description: "AI-powered pattern recognition enables proactive care and prevention strategies for better outcomes.",
                gradient: "from-teal-50 to-teal-100",
                border: "border-teal-200",
                iconBg: "from-teal-600 to-teal-700",
                delay: "delay-600"
              }
            ].map((feature, index) => (
              <div key={index} className={`feature-card bg-gradient-to-br ${feature.gradient} rounded-2xl p-8 border ${feature.border} hover:shadow-lg transition-all duration-500 animate-fade-in-up ${feature.delay}`}>
                <div className={`w-16 h-16 bg-gradient-to-r ${feature.iconBg} rounded-2xl flex items-center justify-center mb-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110`}>
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Email Signup Section */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-3xl border border-gray-200 p-12">
            <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full px-6 py-2 mb-8">
              <Sparkles className="w-5 h-5" />
              <span className="font-semibold">Exclusive Early Access</span>
            </div>

            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-gray-900 to-purple-600 bg-clip-text text-transparent">
                Join the Revolution
              </span>
            </h2>
            
            <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
              Get exclusive early access to the world's first AI-powered, multi-system chronic pain management platform.
            </p>

            <form onSubmit={handleEmailSubmit} className="space-y-4 max-w-md mx-auto mb-8">
              <input
                type="text"
                placeholder="Your Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-6 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent text-lg transition-all duration-300 hover:border-purple-300"
                required
              />
              <input
                type="email"
                placeholder="Your Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-6 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent text-lg transition-all duration-300 hover:border-purple-300"
                required
              />
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 rounded-xl font-semibold text-lg hover:shadow-lg transition-all duration-300 hover:scale-105 flex items-center justify-center space-x-2"
              >
                {loading ? (
                  <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <>
                    <span>Join Waitlist</span>
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </form>

            {/* Stats */}
            <div className="flex justify-center items-center space-x-8 text-center">
              <div>
                <div className="text-3xl font-bold text-blue-600">{subscribers}+</div>
                <div className="text-sm text-gray-500">Early Subscribers</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-purple-600">200+</div>
                <div className="text-sm text-gray-500">Tools & Lessons</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-green-600">∞</div>
                <div className="text-sm text-gray-500">Potential</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Ecosystem Breakdown */}
      <section id="ecosystem" className="py-20 px-6 bg-gradient-to-r from-slate-50 to-blue-50" data-animate>
        <div className="max-w-7xl mx-auto">
          <div className={`text-center mb-16 transition-all duration-1000 ${isVisible.ecosystem ? 'animate-fade-in-up' : 'opacity-0 translate-y-12'}`}>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-gray-900 to-purple-600 bg-clip-text text-transparent">
                The Recalibrate Ecosystem
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              A comprehensive platform designed to support every aspect of your pain management journey
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
            <div className="animate-slide-in-left">
              <div className="space-y-8">
                {[
                  {
                    icon: BookOpen,
                    title: "Education",
                    description: "Clear breakdowns of pain and health strategies backed by the latest research and clinical evidence.",
                    gradient: "from-blue-600 to-blue-700"
                  },
                  {
                    icon: Zap,
                    title: "Action",
                    description: "Tools, downloads, and practices you can implement immediately to start improving your health outcomes.",
                    gradient: "from-green-600 to-green-700"
                  },
                  {
                    icon: Eye,
                    title: "Previews",
                    description: "Updates on app launch, new courses, and resources as we continue to expand our platform.",
                    gradient: "from-purple-600 to-purple-700"
                  },
                  {
                    icon: Users,
                    title: "Connection",
                    description: "Stories and insights from the growing Recalibrate community of patients and healthcare professionals.",
                    gradient: "from-orange-600 to-orange-700"
                  }
                ].map((item, index) => (
                  <div key={index} className="flex items-start space-x-4 ecosystem-item">
                    <div className={`w-12 h-12 bg-gradient-to-r ${item.gradient} rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110`}>
                      <item.icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">{item.title}</h3>
                      <p className="text-gray-600">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="animate-slide-in-right">
              <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden newsletter-card">
                <div className="p-8">
                  <div className="text-center mb-6">
                    <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110">
                      <Bell className="w-10 h-10 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">Newsletter</h3>
                    <p className="text-gray-600">Stay updated with the latest insights and developments</p>
                  </div>

                  <div className="space-y-4 mb-6">
                    {[
                      { icon: BookOpen, text: "Weekly educational content", color: "text-blue-600", bg: "bg-blue-50" },
                      { icon: Download, text: "Actionable tools and resources", color: "text-green-600", bg: "bg-green-50" },
                      { icon: Calendar, text: "App launch updates", color: "text-purple-600", bg: "bg-purple-50" },
                      { icon: MessageCircle, text: "Community stories", color: "text-orange-600", bg: "bg-orange-50" }
                    ].map((item, index) => (
                      <div key={index} className={`flex items-center space-x-3 p-3 ${item.bg} rounded-lg hover:scale-105 transition-transform duration-300`}>
                        <item.icon className={`w-5 h-5 ${item.color}`} />
                        <span className="text-sm text-gray-700">{item.text}</span>
                      </div>
                    ))}
                  </div>

                  <a 
                    href="https://recalibrate.beehiiv.com/subscribe" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 hover:scale-105 flex items-center justify-center space-x-2"
                  >
                    <span>Subscribe to Newsletter</span>
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Courses & Community Preview */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 course-card">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-r from-indigo-600 to-indigo-700 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110">
                  <BookOpen className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Courses</h3>
                <p className="text-gray-600">Evidence-based learning modules designed for your pain management journey.</p>
              </div>
              <div className="space-y-3">
                {[
                  "Pain Science Fundamentals",
                  "Movement & Recovery",
                  "Mindfulness for Pain"
                ].map((course, index) => (
                  <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-300">
                    <span className="text-sm font-medium text-gray-700">{course}</span>
                    <span className="text-xs text-purple-600 bg-purple-100 px-2 py-1 rounded-full">Coming Soon</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 community-card">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-r from-emerald-600 to-emerald-700 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Community</h3>
                <p className="text-gray-600">Connect with others on similar journeys and share experiences that matter.</p>
              </div>
              <div className="space-y-3">
                {[
                  "Patient Support Groups",
                  "Success Stories",
                  "Community Forums"
                ].map((community, index) => (
                  <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-300">
                    <span className="text-sm font-medium text-gray-700">{community}</span>
                    <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded-full">Coming Soon</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Partner Section */}
      <section className="py-20 px-6 bg-gradient-to-r from-slate-50 to-blue-50">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-purple-100 to-pink-100 border border-purple-200 rounded-full px-6 py-3 mb-8">
            <Star className="w-5 h-5 text-purple-600" />
            <span className="text-sm font-semibold text-gray-700">Partnership Opportunities</span>
          </div>

          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="bg-gradient-to-r from-gray-900 to-purple-600 bg-clip-text text-transparent">
              Partner with Us
            </span>
          </h2>
          
          <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto">
            Join us in revolutionizing pain management. Whether you're a healthcare system, researcher, 
            or investor, let's build the future of chronic pain care together.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {[
              {
                title: "Healthcare Systems",
                description: "Integrate Recalibrate into your patient care workflow",
                icon: Shield
              },
              {
                title: "Researchers",
                description: "Collaborate on groundbreaking pain management studies",
                icon: BarChart3
              },
              {
                title: "Investors",
                description: "Join our mission to transform chronic pain care",
                icon: TrendingUp
              }
            ].map((partner, index) => (
              <div key={index} className="bg-white rounded-2xl p-6 border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <partner.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{partner.title}</h3>
                <p className="text-gray-600 text-sm">{partner.description}</p>
              </div>
            ))}
          </div>

          <a href="mailto:info@recalibratepain.com" className="inline-flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 hover:scale-105">
            <Mail className="w-5 h-5" />
            <span>Contact Us</span>
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 px-6 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center mb-12">
            <div className="flex items-center space-x-3 mb-6 md:mb-0">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-xl">R</span>
              </div>
              <span className="text-3xl font-bold">Recalibrate</span>
            </div>
            
            <div className="flex flex-col items-center md:items-end space-y-2">
              <p className="text-gray-300">Ready to transform pain management?</p>
              <a 
                href="mailto:info@recalibratepain.com"
                className="flex items-center space-x-2 text-blue-400 hover:text-blue-300 transition-colors"
              >
                <Mail className="w-5 h-5" />
                <span>info@recalibratepain.com</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-gray-400 text-sm mb-4 md:mb-0">
                © 2025 Recalibrate. Smarter Health and Pain Management.
              </p>
              
              {/* Social Links */}
              <div className="flex items-center space-x-4">
                <a href="https://web.facebook.com/profile.php?id=61577010274296" target="_blank" rel="noopener noreferrer" 
                   className="w-10 h-10 bg-gray-800 hover:bg-blue-600 rounded-lg flex items-center justify-center transition-colors">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>
                <a href="https://www.instagram.com/recalibrate_app?igsh=MWgzZjhxZmdtemQyNA==" target="_blank" rel="noopener noreferrer"
                   className="w-10 h-10 bg-gray-800 hover:bg-pink-600 rounded-lg flex items-center justify-center transition-colors">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </a>
                <a href="https://www.linkedin.com/company/recalibrate-app/" target="_blank" rel="noopener noreferrer"
                   className="w-10 h-10 bg-gray-800 hover:bg-blue-700 rounded-lg flex items-center justify-center transition-colors">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </a>
                <a href="https://x.com/Recalibrate_App?s=08" target="_blank" rel="noopener noreferrer"
                   className="w-10 h-10 bg-gray-800 hover:bg-gray-700 rounded-lg flex items-center justify-center transition-colors">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;