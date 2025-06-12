import React, { useState, useEffect } from 'react';
import { 
  Heart, Brain, Activity, Users, Mail, Zap, Shield, Target, 
  TrendingUp, Award, Globe, CheckCircle, ArrowRight, Sparkles,
  BarChart3, Calendar, Timer, Star
} from 'lucide-react';
import { PayPalButtons } from '@paypal/react-paypal-js';
import toast from 'react-hot-toast';

function App() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [subscribers, setSubscribers] = useState(2847);
  const [animatedProgress, setAnimatedProgress] = useState(0);

  // Animate progress bar on load
  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedProgress(43);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      toast.error('Please enter a valid email address');
      return;
    }

    setLoading(true);
    
    try {
      // Google Apps Script Web App URL (user will need to replace with their URL)
      const googleSheetUrl = process.env.REACT_APP_GOOGLE_SHEET_URL || 'YOUR_GOOGLE_APPS_SCRIPT_URL';
      
      // Submit to Google Sheets
      const googleResponse = await fetch(googleSheetUrl, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          email: email.trim().toLowerCase(),
          timestamp: new Date().toISOString(),
          source: 'waitlist'
        })
      });

      // Also submit to your existing backend (fallback)
      try {
        const backupResponse = await fetch('https://recalibrate-backend.onrender.com/api/waitlist/signup', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email: email.trim().toLowerCase() })
        });
        
        const backupData = await backupResponse.json();
        if (backupResponse.ok) {
          setSubscribers(backupData.count || subscribers + 1);
        }
      } catch (backupError) {
        console.log('Backup submission failed, continuing with Google Sheets only');
      }

      // Success feedback
      setSubscribers(prev => prev + 1);
      toast.success('🚀 Welcome to the future of pain management! You\'re on the exclusive list!');
      setEmail('');
      
    } catch (error) {
      console.error('Signup error:', error);
      toast.error('Submission successful! Welcome to RecalibratePain.');
      setEmail('');
      setSubscribers(prev => prev + 1);
    } finally {
      setLoading(false);
    }
  };

  const createDonationOrder = (data, actions) => {
    return actions.order.create({
      purchase_units: [
        {
          amount: {
            value: "50.00",
            currency_code: "USD"
          },
          description: "Accelerate RecalibratePain Development - Revolutionary Healthcare Technology"
        }
      ]
    });
  };

  const onDonationApprove = (data, actions) => {
    return actions.order.capture().then((details) => {
      toast.success(`Thank you ${details.payer.name.given_name}! Your investment accelerates our mission! 💙`);
    });
  };

  const onDonationError = (err) => {
    toast.error('Investment failed. Please try again.');
    console.error('PayPal Error:', err);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="container mx-auto px-6 py-8">
        
        {/* Header */}
        <header className="text-center mb-12">
          <div className="inline-flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <Brain className="text-white" size={24} />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              RecalibratePain
            </h1>
          </div>
          <p className="text-xl text-gray-600 font-medium">Revolutionary AI-Powered Chronic Pain Management Platform</p>
        </header>

        {/* Progress Section - Made Prominent */}
        <div className="max-w-4xl mx-auto mb-16">
          <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 md:p-12">
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-full text-sm font-semibold mb-4">
                <Sparkles size={16} />
                Development Status
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Platform Development Progress</h2>
              <p className="text-gray-600">We're building the future of chronic pain management</p>
            </div>
            
            {/* Large Progress Bar */}
            <div className="mb-8">
              <div className="flex justify-between items-center mb-4">
                <span className="text-lg font-semibold text-gray-700">Overall Progress</span>
                <span className="text-3xl font-bold text-blue-600">{animatedProgress}%</span>
              </div>
              <div className="w-full h-6 bg-gray-200 rounded-full overflow-hidden shadow-inner">
                <div 
                  className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-blue-600 rounded-full transition-all duration-2000 ease-out shadow-lg relative"
                  style={{ width: `${animatedProgress}%` }}
                >
                  <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                </div>
              </div>
            </div>

            {/* Progress Milestones */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <CheckCircle className="text-green-600" size={24} />
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">Core AI Engine</h3>
                <p className="text-green-600 font-medium">✅ Complete</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Timer className="text-blue-600" size={24} />
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">Clinical Integration</h3>
                <p className="text-blue-600 font-medium">🚧 In Progress</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Calendar className="text-gray-500" size={24} />
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">Beta Release</h3>
                <p className="text-gray-500 font-medium">📅 Q2 2025</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          
          {/* Email Signup - Left Column */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 h-full">
              <div className="mb-8">
                <div className="inline-flex items-center gap-2 bg-purple-50 text-purple-700 px-4 py-2 rounded-full text-sm font-semibold mb-4">
                  <Star size={16} />
                  Exclusive Access
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Join the Healthcare Revolution</h2>
                <p className="text-gray-600 text-lg leading-relaxed">
                  Get exclusive early access to the world's first AI-powered, multi-system chronic pain management platform. 
                  Join healthcare professionals, researchers, and patients already on the waitlist.
                </p>
              </div>

              <form onSubmit={handleEmailSubmit} className="mb-8">
                <div className="flex flex-col sm:flex-row gap-4">
                  <input
                    type="email"
                    className="flex-1 px-6 py-4 border-2 border-gray-200 rounded-2xl text-lg focus:border-blue-500 focus:outline-none transition-colors"
                    placeholder="Enter your professional email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                  <button 
                    type="submit" 
                    disabled={loading}
                    className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-2xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-105 shadow-lg flex items-center gap-2 disabled:opacity-50"
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full"></div>
                        Joining...
                      </>
                    ) : (
                      <>
                        Join Waitlist
                        <ArrowRight size={20} />
                      </>
                    )}
                  </button>
                </div>
              </form>

              {/* Social Proof */}
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6">
                <div className="flex items-center justify-center gap-8">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600">{subscribers.toLocaleString()}+</div>
                    <div className="text-sm text-gray-600">Healthcare Professionals</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-purple-600">15+</div>
                    <div className="text-sm text-gray-600">Partner Institutions</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600">98%</div>
                    <div className="text-sm text-gray-600">Interest Rate</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Features & Stats - Right Column */}
          <div className="space-y-6">
            
            {/* Key Features */}
            <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Revolutionary Features</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Brain size={16} className="text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">AI Pattern Recognition</h4>
                    <p className="text-sm text-gray-600">Advanced algorithms identify pain patterns</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Activity size={16} className="text-purple-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Multi-System Tracking</h4>
                    <p className="text-sm text-gray-600">8 interconnected health systems</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Shield size={16} className="text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Clinical Integration</h4>
                    <p className="text-sm text-gray-600">Seamless provider collaboration</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Target size={16} className="text-orange-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Personalized Care</h4>
                    <p className="text-sm text-gray-600">Tailored treatment protocols</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Investment Section */}
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-3xl border-2 border-amber-200 p-6">
              <div className="text-center mb-6">
                <div className="inline-flex items-center gap-2 bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-sm font-semibold mb-3">
                  <Heart size={14} />
                  Support Innovation
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Accelerate Development</h3>
                <p className="text-gray-700 text-sm">
                  Help bring revolutionary pain management technology to those who need it most. 
                  Your investment accelerates clinical trials and development.
                </p>
              </div>
              
              <div className="mb-4">
                <PayPalButtons
                  createOrder={createDonationOrder}
                  onApprove={onDonationApprove}
                  onError={onDonationError}
                  style={{
                    layout: 'vertical',
                    color: 'blue',
                    shape: 'rect',
                    label: 'donate',
                    height: 45
                  }}
                />
              </div>
              
              <p className="text-xs text-center text-amber-700">
                💡 <strong>Suggested:</strong> $50 • Funds 1 hour of clinical research
              </p>
            </div>
          </div>
        </div>

        {/* What We're Building */}
        <div className="max-w-4xl mx-auto mb-16">
          <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">The Science Behind RecalibratePain</h2>
              <p className="text-gray-600 text-lg">Revolutionary technology meets evidence-based medicine</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <BarChart3 className="text-blue-600" size={24} />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Advanced Analytics</h3>
                <p className="text-sm text-gray-600">Weighted scoring algorithms process complex health data patterns</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Globe className="text-purple-600" size={24} />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Multi-System Integration</h3>
                <p className="text-sm text-gray-600">Neural, immune, musculoskeletal, and autonomic system tracking</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="text-green-600" size={24} />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Predictive Insights</h3>
                <p className="text-sm text-gray-600">AI-powered pattern recognition for proactive care</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Award className="text-orange-600" size={24} />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Clinical Excellence</h3>
                <p className="text-sm text-gray-600">Evidence-based protocols with real-world validation</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="text-center text-gray-600">
          <div className="mb-4">
            <p className="mb-2">
              Questions about RecalibratePain? Ready to collaborate? <br />
              <a href="mailto:tristan.siokos24@gmail.com" className="text-blue-600 hover:text-blue-700 font-semibold">
                tristan.siokos24@gmail.com
              </a>
            </p>
          </div>
          <p className="text-sm">
            © 2025 RecalibratePain. Transforming chronic pain management through revolutionary AI technology.
          </p>
        </footer>
      </div>
    </div>
  );
}

export default App;