import React, { useState, useEffect } from 'react';
import { 
  Heart, Brain, Activity, Shield, Target, 
  TrendingUp, Award, Globe, CheckCircle, ArrowRight, Sparkles,
  BarChart3, Calendar, Timer, Star, Code, DollarSign, Copy
} from 'lucide-react';
import toast from 'react-hot-toast';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';

function App() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [subscribers, setSubscribers] = useState(127);
  const [progressAnimated, setProgressAnimated] = useState(false);
  const [donationAmount, setDonationAmount] = useState('25');
  const [showPayPalButtons, setShowPayPalButtons] = useState(false);

  const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8001';
  const PAYPAL_CLIENT_ID = process.env.REACT_APP_PAYPAL_CLIENT_ID;
  const isPayPalEnabled = PAYPAL_CLIENT_ID && PAYPAL_CLIENT_ID !== 'test' && PAYPAL_CLIENT_ID !== 'YOUR_PAYPAL_CLIENT_ID';

  // Animate progress bar on load
  useEffect(() => {
    const timer = setTimeout(() => {
      setProgressAnimated(true);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  // Fetch current subscriber count on load
  useEffect(() => {
    fetchSubscriberCount();
  }, []);

  const fetchSubscriberCount = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/waitlist/count`);
      if (response.ok) {
        const data = await response.json();
        setSubscribers(data.count || 127);
      }
    } catch (error) {
      console.log('Could not fetch subscriber count, using default');
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
        },
        body: JSON.stringify({
          name: name.trim(),
          email: email.toLowerCase().trim()
        })
      });

      if (response.ok) {
        const data = await response.json();
        toast.success(data.message);
        setSubscribers(data.total_subscribers);
        setName('');
        setEmail('');
      } else {
        const errorData = await response.json();
        toast.error(errorData.detail || 'Something went wrong. Please try again.');
      }
    } catch (error) {
      toast.error('Network error. Please check your connection and try again.');
      console.error('Email submission error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleShowPayPal = () => {
    const amount = parseFloat(donationAmount);
    if (!amount || amount < 1) {
      toast.error('Please enter a valid amount ($1 minimum)');
      return;
    }
    setShowPayPalButtons(true);
  };

  const handleQuickDonation = (amount) => {
    setDonationAmount(amount.toString());
    setShowPayPalButtons(true);
  };

  const createOrder = (data, actions) => {
    return actions.order.create({
      purchase_units: [
        {
          amount: {
            value: donationAmount,
            currency_code: 'USD'
          },
          description: 'Support Recalibrate Development'
        }
      ]
    });
  };

  const onApprove = (data, actions) => {
    return actions.order.capture().then((details) => {
      toast.success(`Thank you ${details.payer.name.given_name}! Your donation helps build the future of pain management.`);
      setShowPayPalButtons(false);
      setDonationAmount('25');
    });
  };

  const onError = (err) => {
    toast.error('Payment failed. Please try again.');
    console.error('PayPal error:', err);
  };

  const onCancel = () => {
    toast('Payment cancelled', { icon: '👋' });
    setShowPayPalButtons(false);
  };

  return (
    <PayPalScriptProvider options={{ 
      "client-id": PAYPAL_CLIENT_ID, 
      currency: "USD",
      intent: "capture"
    }}>
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

        {/* Progress Section */}
        <div className="progress-section">
          <div className="progress-card">
            <div className="progress-header-section">
              <div className="progress-badge">
                <Sparkles size={16} />
                Development Status
              </div>
              <h2 className="progress-title">Platform Development Progress</h2>
              <p className="progress-description">We're building the future of chronic pain management</p>
            </div>
            
            <div className="progress-container">
              <div className="progress-header">
                <span className="progress-label">Overall Progress</span>
                <span className="progress-percentage">43%</span>
              </div>
              <div className="progress-bar">
                <div className={`progress-fill ${progressAnimated ? 'animated' : ''}`}></div>
              </div>
            </div>

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

        {/* Email Signup */}
        <div className="email-section-full">
          <div className="exclusive-badge">
            <Star size={16} />
            Exclusive Access
          </div>
          <h2 className="email-title">Join the Paincare Revolution</h2>
          <p className="email-description">
            Get exclusive early access to the world's first AI-powered, multi-system chronic pain management platform.
          </p>

          <form onSubmit={handleEmailSubmit} className="email-form-wide">
            <input
              type="text"
              id="waitlist-name-input"
              name="waitlistName"
              className="email-input"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoComplete="name"
              required
            />
            <input
              type="email"
              id="waitlist-email-input"
              name="waitlistEmail"
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

        {/* Donation Section */}
        <div className="investment-section-full">
          <div className="investment-card-full">
            <div className="investment-header">
              <div className="investment-badge">
                <Heart size={14} />
                Support Innovation
              </div>
              <h3 className="investment-title">Help Build the Future</h3>
              <p className="investment-description">
                Support revolutionary pain management technology development.
              </p>
            </div>
            
            <div className="investment-content">
              {!showPayPalButtons ? (
                <>
                  <div className="donation-form">
                    <div className="amount-input-container">
                      <div className="amount-input-wrapper">
                        <DollarSign size={20} className="dollar-icon" />
                        <input
                          type="number"
                          id="donation-amount-input"
                          name="donationAmount"
                          className="amount-input"
                          placeholder="25"
                          value={donationAmount}
                          onChange={(e) => setDonationAmount(e.target.value)}
                          min="1"
                          max="10000"
                          autoComplete="off"
                        />
                      </div>
                      <button 
                        type="button"
                        onClick={handleShowPayPal}
                        className="donate-btn-custom"
                        disabled={!donationAmount || parseFloat(donationAmount) < 1}
                      >
                        <Heart size={20} />
                        Donate Now
                      </button>
                    </div>
                    
                    <div className="quick-amounts">
                      <span className="quick-amounts-label">Quick amounts:</span>
                      <button 
                        type="button"
                        onClick={() => handleQuickDonation(10)}
                        className="quick-amount-btn"
                      >
                        $10
                      </button>
                      <button 
                        type="button"
                        onClick={() => handleQuickDonation(25)}
                        className="quick-amount-btn featured"
                      >
                        $25
                      </button>
                      <button 
                        type="button"
                        onClick={() => handleQuickDonation(50)}
                        className="quick-amount-btn"
                      >
                        $50
                      </button>
                      <button 
                        type="button"
                        onClick={() => handleQuickDonation(100)}
                        className="quick-amount-btn"
                      >
                        $100
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="paypal-checkout-section">
                  <h4 className="payment-title">Complete Your ${donationAmount} Donation</h4>
                  <div className="paypal-buttons-container">
                    <PayPalButtons
                      createOrder={createOrder}
                      onApprove={onApprove}
                      onError={onError}
                      onCancel={onCancel}
                      style={{
                        layout: 'vertical',
                        color: 'blue',
                        shape: 'rect',
                        label: 'donate'
                      }}
                    />
                  </div>
                  <button 
                    type="button"
                    onClick={() => setShowPayPalButtons(false)}
                    className="back-btn"
                  >
                    ← Back to Donation Options
                  </button>
                </div>
              )}
              
              <div className="investment-notes">
                <p className="investment-note">
                  💡 <strong>Even $10 helps!</strong> Every contribution accelerates development
                </p>
                <p className="investment-note">
                  🔒 <strong>Secure:</strong> All payments processed through PayPal's encrypted platform
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Science Section */}
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
                <p>Advanced algorithms identify pain patterns and predict flare-ups</p>
              </div>
              <div className="science-item">
                <div className="science-icon purple">
                  <Activity />
                </div>
                <h3>Multi-System Tracking</h3>
                <p>8 interconnected health systems: neural, immune, musculoskeletal, autonomic</p>
              </div>
              <div className="science-item">
                <div className="science-icon green">
                  <Shield />
                </div>
                <h3>Clinical Integration</h3>
                <p>Seamless provider collaboration with evidence-based protocols</p>
              </div>
              <div className="science-item">
                <div className="science-icon orange">
                  <Target />
                </div>
                <h3>Personalized Care</h3>
                <p>Tailored treatment protocols based on individual health patterns</p>
              </div>
              <div className="science-item">
                <div className="science-icon blue">
                  <BarChart3 />
                </div>
                <h3>Advanced Analytics</h3>
                <p>Weighted scoring algorithms for actionable health insights</p>
              </div>
              <div className="science-item">
                <div className="science-icon purple">
                  <TrendingUp />
                </div>
                <h3>Predictive Insights</h3>
                <p>AI-powered pattern recognition for proactive care</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="footer">
          <div className="footer-content">
            <p>
              Questions about Recalibrate? Ready to collaborate? <br />
              <a href="mailto:tristan.siokos24@gmail.com">
                tristan.siokos24@gmail.com
              </a>
            </p>
          </div>
          <p className="footer-copyright">
            © 2025 Recalibrate. Transforming chronic pain management through revolutionary AI technology.
          </p>
        </footer>
      </div>
    </PayPalScriptProvider>
  );
}

export default App;
