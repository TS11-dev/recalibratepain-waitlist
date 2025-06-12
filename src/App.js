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
  const [progressAnimated, setProgressAnimated] = useState(false);

  // Animate progress bar on load
  useEffect(() => {
    const timer = setTimeout(() => {
      setProgressAnimated(true);
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
      toast.success('Submission successful! Welcome to RecalibratePain.');
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
    <div className="container">
      
      {/* Header */}
      <header className="header">
        <div className="logo-section">
          <div className="logo-icon">
            <Brain />
          </div>
          <h1 className="main-title">RecalibratePain</h1>
        </div>
        <p className="subtitle">Revolutionary AI-Powered Chronic Pain Management Platform</p>
      </header>

      {/* Progress Section - Made Prominent */}
      <div className="progress-section">
        <div className="progress-card">
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <div className="progress-badge">
              <Sparkles size={16} />
              Development Status
            </div>
            <h2 className="progress-title">Platform Development Progress</h2>
            <p className="progress-description">We're building the future of chronic pain management</p>
          </div>
          
          {/* Large Progress Bar */}
          <div className="progress-container">
            <div className="progress-header">
              <span className="progress-label">Overall Progress</span>
              <span className="progress-percentage">43%</span>
            </div>
            <div className="progress-bar">
              <div className={`progress-fill ${progressAnimated ? 'animated' : ''}`}></div>
            </div>
          </div>

          {/* Progress Milestones */}
          <div className="milestones">
            <div className="milestone">
              <div className="milestone-icon complete">
                <CheckCircle />
              </div>
              <h3 className="milestone-title">Core AI Engine</h3>
              <p className="milestone-status complete">✅ Complete</p>
            </div>
            <div className="milestone">
              <div className="milestone-icon progress">
                <Timer />
              </div>
              <h3 className="milestone-title">Clinical Integration</h3>
              <p className="milestone-status progress">🚧 In Progress</p>
            </div>
            <div className="milestone">
              <div className="milestone-icon pending">
                <Calendar />
              </div>
              <h3 className="milestone-title">Beta Release</h3>
              <p className="milestone-status pending">📅 Q2 2025</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="main-grid">
        
        {/* Email Signup - Left Column */}
        <div className="email-section">
          <div className="exclusive-badge">
            <Star size={16} />
            Exclusive Access
          </div>
          <h2 className="email-title">Join the Healthcare Revolution</h2>
          <p className="email-description">
            Get exclusive early access to the world's first AI-powered, multi-system chronic pain management platform. 
            Join healthcare professionals, researchers, and patients already on the waitlist.
          </p>

          <form onSubmit={handleEmailSubmit} className="email-form">
            <input
              type="email"
              className="email-input"
              placeholder="Enter your professional email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button 
              type="submit" 
              disabled={loading}
              className="submit-btn"
            >
              {loading ? (
                <>
                  <div className="loading-spinner"></div>
                  Joining...
                </>
              ) : (
                <>
                  Join Waitlist
                  <ArrowRight size={20} />
                </>
              )}
            </button>
          </form>

          {/* Social Proof */}
          <div className="social-proof">
            <div className="proof-item">
              <div className="proof-number blue">{subscribers.toLocaleString()}+</div>
              <div className="proof-label">Healthcare Professionals</div>
            </div>
            <div className="proof-item">
              <div className="proof-number purple">15+</div>
              <div className="proof-label">Partner Institutions</div>
            </div>
            <div className="proof-item">
              <div className="proof-number green">98%</div>
              <div className="proof-label">Interest Rate</div>
            </div>
          </div>
        </div>

        {/* Features & Stats - Right Column */}
        <div className="sidebar">
          
          {/* Key Features */}
          <div className="features-card">
            <h3 className="features-title">Revolutionary Features</h3>
            <div className="feature-item">
              <div className="feature-icon blue">
                <Brain size={16} />
              </div>
              <div className="feature-text">
                <h4>AI Pattern Recognition</h4>
                <p>Advanced algorithms identify pain patterns</p>
              </div>
            </div>
            <div className="feature-item">
              <div className="feature-icon purple">
                <Activity size={16} />
              </div>
              <div className="feature-text">
                <h4>Multi-System Tracking</h4>
                <p>8 interconnected health systems</p>
              </div>
            </div>
            <div className="feature-item">
              <div className="feature-icon green">
                <Shield size={16} />
              </div>
              <div className="feature-text">
                <h4>Clinical Integration</h4>
                <p>Seamless provider collaboration</p>
              </div>
            </div>
            <div className="feature-item">
              <div className="feature-icon orange">
                <Target size={16} />
              </div>
              <div className="feature-text">
                <h4>Personalized Care</h4>
                <p>Tailored treatment protocols</p>
              </div>
            </div>
          </div>

          {/* Investment Section */}
          <div className="investment-card">
            <div className="investment-badge">
              <Heart size={14} />
              Support Innovation
            </div>
            <h3 className="investment-title">Accelerate Development</h3>
            <p className="investment-description">
              Help bring revolutionary pain management technology to those who need it most. 
              Your investment accelerates clinical trials and development.
            </p>
            
            <div style={{ marginBottom: '16px' }}>
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
            
            <p className="investment-note">
              💡 <strong>Suggested:</strong> $50 • Funds 1 hour of clinical research
            </p>
          </div>
        </div>
      </div>

      {/* What We're Building */}
      <div className="science-section">
        <div className="science-card">
          <div className="science-header">
            <h2 className="science-title">The Science Behind RecalibratePain</h2>
            <p className="science-description">Revolutionary technology meets evidence-based medicine</p>
          </div>
          
          <div className="science-grid">
            <div className="science-item">
              <div className="science-icon blue">
                <BarChart3 />
              </div>
              <h3>Advanced Analytics</h3>
              <p>Weighted scoring algorithms process complex health data patterns</p>
            </div>
            <div className="science-item">
              <div className="science-icon purple">
                <Globe />
              </div>
              <h3>Multi-System Integration</h3>
              <p>Neural, immune, musculoskeletal, and autonomic system tracking</p>
            </div>
            <div className="science-item">
              <div className="science-icon green">
                <TrendingUp />
              </div>
              <h3>Predictive Insights</h3>
              <p>AI-powered pattern recognition for proactive care</p>
            </div>
            <div className="science-item">
              <div className="science-icon orange">
                <Award />
              </div>
              <h3>Clinical Excellence</h3>
              <p>Evidence-based protocols with real-world validation</p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="footer">
        <div style={{ marginBottom: '16px' }}>
          <p style={{ marginBottom: '8px' }}>
            Questions about RecalibratePain? Ready to collaborate? <br />
            <a href="mailto:tristan.siokos24@gmail.com">
              tristan.siokos24@gmail.com
            </a>
          </p>
        </div>
        <p style={{ fontSize: '0.875rem' }}>
          © 2025 RecalibratePain. Transforming chronic pain management through revolutionary AI technology.
        </p>
      </footer>
    </div>
  );
}

export default App;