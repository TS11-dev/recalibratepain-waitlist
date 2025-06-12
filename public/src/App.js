import React, { useState } from 'react';
import { Heart, Brain, Activity, Users, Mail, Zap, Shield, Target } from 'lucide-react';
import { PayPalButtons } from '@paypal/react-paypal-js';
import toast from 'react-hot-toast';

function App() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [subscribers, setSubscribers] = useState(1247);

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      toast.error('Please enter a valid email address');
      return;
    }

    setLoading(true);
    
    try {
      const response = await fetch('https://recalibrate-backend.onrender.com/api/waitlist/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: email.trim().toLowerCase() })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setSubscribers(data.count || subscribers + 1);
        toast.success('🎉 Welcome to the revolution! You\'re on the list!');
        setEmail('');
      } else {
        if (data.detail === 'Email already registered') {
          toast.error('You\'re already on the list! 🎉');
          setEmail('');
        } else {
          toast.error(data.detail || 'Something went wrong. Please try again.');
        }
      }
    } catch (error) {
      console.error('Signup error:', error);
      toast.error('Network error. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  const createDonationOrder = (data, actions) => {
    return actions.order.create({
      purchase_units: [
        {
          amount: {
            value: "25.00",
            currency_code: "USD"
          },
          description: "Help build RecalibratePain - Revolutionary Pain Management Platform"
        }
      ]
    });
  };

  const onDonationApprove = (data, actions) => {
    return actions.order.capture().then((details) => {
      toast.success(`Thank you ${details.payer.name.given_name}! Your support means everything! 💙`);
    });
  };

  const onDonationError = (err) => {
    toast.error('Donation failed. Please try again.');
    console.error('PayPal Error:', err);
  };

  return (
    <div className="container">
      <div className="main-card">
        <div className="logo">RecalibratePain</div>
        <div className="tagline">Revolutionary Pain Management</div>
        
        <h1 className="hero-title">
          The Future of <br />
          <span style={{background: 'linear-gradient(135deg, #f59e0b, #d97706)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'}}>
            Chronic Pain
          </span> Management
        </h1>
        
        <p className="hero-subtitle">
          We're building the world's first AI-powered, multi-system approach to chronic pain management. 
          Join thousands of others waiting for a revolutionary platform that will change lives forever.
        </p>

        {/* Progress Section */}
        <div className="progress-section">
          <div className="progress-title">🚀 Development Progress</div>
          <div className="progress-bar">
            <div className="progress-fill"></div>
          </div>
          <div className="progress-text">61% Complete</div>
          <p style={{color: '#6b7280', fontSize: '0.9rem', marginTop: '12px'}}>
            Advanced analytics engine ✅ • Multi-system tracking ✅ • AI insights ⏳
          </p>
        </div>

        {/* Features Grid */}
        <div className="features-grid">
          <div className="feature-item">
            <div className="feature-icon"><Brain /></div>
            <div className="feature-title">AI-Powered Insights</div>
          </div>
          <div className="feature-item">
            <div className="feature-icon"><Activity /></div>
            <div className="feature-title">Real-time Tracking</div>
          </div>
          <div className="feature-item">
            <div className="feature-icon"><Shield /></div>
            <div className="feature-title">Clinical Grade</div>
          </div>
          <div className="feature-item">
            <div className="feature-icon"><Target /></div>
            <div className="feature-title">Personalized Care</div>
          </div>
        </div>

        {/* Social Proof */}
        <div className="social-proof">
          <div className="proof-number">{subscribers.toLocaleString()}+</div>
          <div className="proof-text">People already waiting to recalibrate their lives</div>
        </div>

        {/* Email Signup */}
        <div className="email-form">
          <div className="form-title">
            <Mail size={24} style={{display: 'inline', marginRight: '8px', verticalAlign: 'middle'}} />
            Join the Revolution
          </div>
          <div className="form-subtitle">
            Be the first to know when RecalibratePain launches. Get exclusive early access and special launch pricing.
          </div>
          
          <form onSubmit={handleEmailSubmit}>
            <div className="input-group">
              <input
                type="email"
                className="email-input"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <button 
                type="submit" 
                className="submit-btn"
                disabled={loading}
              >
                {loading ? '⏳' : '🚀'} {loading ? 'Joining...' : 'Join Waitlist'}
              </button>
            </div>
          </form>
        </div>

        {/* Donation Section */}
        <div className="donation-section">
          <div className="donation-title">
            <Heart size={24} style={{display: 'inline', marginRight: '8px', verticalAlign: 'middle'}} />
            Help Us Build the Vision
          </div>
          <div className="donation-text">
            Building revolutionary healthcare technology takes resources. Your support helps us accelerate development, 
            conduct clinical trials, and bring this life-changing platform to those who need it most. 
            Every contribution brings us closer to a world where chronic pain doesn't control lives.
          </div>
          
          <div style={{maxWidth: '300px', margin: '0 auto'}}>
            <PayPalButtons
              createOrder={createDonationOrder}
              onApprove={onDonationApprove}
              onError={onDonationError}
              style={{
                layout: 'vertical',
                color: 'blue',
                shape: 'rect',
                label: 'donate'
              }}
            />
          </div>
          
          <p style={{fontSize: '0.85rem', color: '#a16207', marginTop: '16px'}}>
            💡 <strong>Suggested donation:</strong> $25 • Every dollar accelerates development
          </p>
        </div>

        {/* What We're Building */}
        <div style={{margin: '40px 0', textAlign: 'left'}}>
          <h3 style={{color: '#1f2937', marginBottom: '16px', textAlign: 'center'}}>🔬 What Makes Us Different</h3>
          <ul style={{color: '#4b5563', lineHeight: '1.8', listStyle: 'none', padding: 0}}>
            <li style={{marginBottom: '8px'}}>✨ <strong>8-System Health Tracking:</strong> Neural, musculoskeletal, autonomic, immune, and more</li>
            <li style={{marginBottom: '8px'}}>🧠 <strong>AI-Powered Pattern Recognition:</strong> Predictive insights that learn from your data</li>
            <li style={{marginBottom: '8px'}}>📊 <strong>Weighted Analytics Engine:</strong> Clinical-grade scoring and personalized recommendations</li>
            <li style={{marginBottom: '8px'}}>🏥 <strong>Clinician Portal:</strong> Seamless integration with your healthcare team</li>
            <li style={{marginBottom: '8px'}}>🎓 <strong>Pain Academy:</strong> Evidence-based education and therapeutic tools</li>
          </ul>
        </div>

        {/* Contact Info */}
        <div className="contact-info">
          <p>
            Questions? Want to contribute or collaborate? <br />
            Reach out to <a href="mailto:tristan.siokos24@gmail.com" className="contact-email">tristan.siokos24@gmail.com</a>
          </p>
          <p style={{marginTop: '16px', fontSize: '0.8rem'}}>
            © 2025 RecalibratePain. Transforming chronic pain management through technology.
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;
