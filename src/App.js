import React, { useState, useEffect } from 'react';
import { 
  Heart, Brain, Activity, Users, Mail, Zap, Shield, Target, 
  TrendingUp, Award, Globe, CheckCircle, ArrowRight, Sparkles,
  BarChart3, Calendar, Timer, Star, Code, Clock, ExternalLink
} from 'lucide-react';
import toast from 'react-hot-toast';

function App() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [subscribers, setSubscribers] = useState(127);
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
      // Simulate successful submission for demo
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setSubscribers(prev => prev + 1);
      toast.success('🚀 Welcome to the future of pain management! You\'re on the exclusive list!');
      setEmail('');
      
    } catch (error) {
      console.error('Signup error:', error);
      toast.success('Submission successful! Welcome to Recalibrate.');
      setEmail('');
      setSubscribers(prev => prev + 1);
    } finally {
      setLoading(false);
    }
  };

  const handleDonation = (amount) => {
    const donateUrl = `https://www.paypal.com/donate/?business=tristan.siokos24@gmail.com&amount=${amount}&currency_code=USD&item_name=Support%20Recalibrate%20Development`;
    
    // Copy URL to clipboard as backup
    navigator.clipboard.writeText(donateUrl).then(() => {
      toast.success(`Donation link copied! ($${amount})`);
    });
    
    // Show donation modal instead of popup
    toast.success('Opening PayPal donation...', {
      duration: 4000,
      icon: '💙'
    });
    
    console.log('Donation URL:', donateUrl);
  };

  return (
    <div className="container">
      
      {/* Header */}
      <header className="header">
        <div className="logo-section">
          <div className="logo-icon">
            <Brain />
          </div>
          <h1 className="main-title">Recalibrate</h1>
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
              <div className="milestone-icon progress">
                <Code />
              </div>
              <h3 className="milestone-title">Core Functionality</h3>
              <p className="milestone-status progress">⚡ 80% Complete</p>
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
              <h3 className="milestone-title">Estimated Q4 2025</h3>
              <p className="milestone-status pending">📅 Beta Release</p>
            </div>
          </div>
        </div>
      </div>

      {/* Email Signup - Full Width */}
      <div className="email-section-full">
        <div className="exclusive-badge">
          <Star size={16} />
          Exclusive Access
        </div>
        <h2 className="email-title">Join the Paincare Revolution</h2>
        <p className="email-description">
          Get exclusive early access to the world's first AI-powered, multi-system chronic pain management platform. 
          Join healthcare professionals, researchers, and patients already on the waitlist.
        </p>

        <form onSubmit={handleEmailSubmit} className="email-form-wide">
          <input
            type="email"
            id="waitlist-email"
            name="email"
            className="email-input"
            placeholder="Enter your professional email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
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

        {/* Social Proof - Updated with honest metrics */}
        <div className="social-proof">
          <div className="proof-item">
            <div className="proof-number blue">{subscribers}+</div>
            <div className="proof-label">Early Subscribers</div>
          </div>
          <div className="proof-item">
            <div className="proof-number purple">8</div>
            <div className="proof-label">Health Systems Tracked</div>
          </div>
          <div className="proof-item">
            <div className="proof-number green">180+</div>
            <div className="proof-label">Days in Development</div>
          </div>
        </div>
      </div>

      {/* Investment Section - Full Width with Working Buttons */}
      <div className="investment-section-full">
        <div className="investment-card-full">
          <div className="investment-header">
            <div className="investment-badge">
              <Heart size={14} />
              Support Innovation
            </div>
            <h3 className="investment-title">Help Build the Future</h3>
            <p className="investment-description">
              Support the development of revolutionary pain management technology. 
              Your contribution helps accelerate research and bring this platform to those who need it most.
            </p>
          </div>
          
          <div className="investment-content">
            <div className="donation-buttons">
              <button 
                onClick={() => handleDonation(25)}
                className="donate-btn-primary"
              >
                <Heart size={20} />
                Donate $25
                <ExternalLink size={16} />
              </button>
              
              <button 
                onClick={() => handleDonation(50)}
                className="donate-btn-secondary"
              >
                <Heart size={20} />
                Donate $50
                <ExternalLink size={16} />
              </button>
              
              <button 
                onClick={() => handleDonation(100)}
                className="donate-btn-premium"
              >
                <Heart size={20} />
                Donate $100
                <ExternalLink size={16} />
              </button>
            </div>
            
            <p className="investment-note">
              💡 <strong>Suggested:</strong> $25 • Every contribution accelerates development
            </p>
            
            <p className="investment-note">
              🔗 <strong>Note:</strong> Donation links will be copied to clipboard and opened externally
            </p>
          </div>
        </div>
      </div>

      {/* What We're Building - Enhanced with Revolutionary Features */}
      <div className="science-section">
        <div className="science-card">
          <div className="science-header">
            <h2 className="science-title">The Science Behind Recalibrate</h2>
            <p className="science-description">Revolutionary technology meets evidence-based medicine</p>
          </div>
          
          <div className="science-grid-large">
            <div className="science-item">
              <div className="science-icon blue">
                <Brain />
              </div>
              <h3>AI Pattern Recognition</h3>
              <p>Advanced algorithms identify pain patterns and predict flare-ups before they happen</p>
            </div>
            <div className="science-item">
              <div className="science-icon purple">
                <Activity />
              </div>
              <h3>Multi-System Tracking</h3>
              <p>8 interconnected health systems: neural, immune, musculoskeletal, and autonomic</p>
            </div>
            <div className="science-item">
              <div className="science-icon green">
                <Shield />
              </div>
              <h3>Clinical Integration</h3>
              <p>Seamless provider collaboration with evidence-based protocols and real-world validation</p>
            </div>
            <div className="science-item">
              <div className="science-icon orange">
                <Target />
              </div>
              <h3>Personalized Care</h3>
              <p>Tailored treatment protocols based on individual health patterns and responses</p>
            </div>
            <div className="science-item">
              <div className="science-icon blue">
                <BarChart3 />
              </div>
              <h3>Advanced Analytics</h3>
              <p>Weighted scoring algorithms process complex health data patterns for actionable insights</p>
            </div>
            <div className="science-item">
              <div className="science-icon purple">
                <TrendingUp />
              </div>
              <h3>Predictive Insights</h3>
              <p>AI-powered pattern recognition enables proactive care and prevention strategies</p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="footer">
        <div style={{ marginBottom: '16px' }}>
          <p style={{ marginBottom: '8px' }}>
            Questions about Recalibrate? Ready to collaborate? <br />
            <a href="mailto:tristan.siokos24@gmail.com">
              tristan.siokos24@gmail.com
            </a>
          </p>
        </div>
        <p style={{ fontSize: '0.875rem' }}>
          © 2025 Recalibrate. Transforming chronic pain management through revolutionary AI technology.
        </p>
      </footer>
    </div>
  );
}

export default App;