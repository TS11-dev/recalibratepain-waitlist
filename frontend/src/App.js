import React, { useState, useEffect } from 'react';
import { 
  Heart, Brain, Activity, Shield, Target, 
  TrendingUp, Award, Globe, CheckCircle, ArrowRight, Sparkles,
  BarChart3, Calendar, Timer, Star, Code, DollarSign, ExternalLink
} from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

function App() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [subscribers, setSubscribers] = useState(127);
  const [progressAnimated, setProgressAnimated] = useState(false);
  const [donationAmount, setDonationAmount] = useState('25');

  // Use environment variable for backend URL
  const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || window.location.origin;

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
      const response = await fetch(`${BACKEND_URL}/api/waitlist/count`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      });
      
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
      toast.error('Please enter your name', {
        style: {
          background: 'rgba(139, 92, 246, 0.1)',
          color: '#fff',
          border: '1px solid rgba(139, 92, 246, 0.3)',
          backdropFilter: 'blur(10px)',
        },
      });
      return;
    }
    
    if (!email || !email.includes('@')) {
      toast.error('Please enter a valid email address', {
        style: {
          background: 'rgba(139, 92, 246, 0.1)',
          color: '#fff',
          border: '1px solid rgba(139, 92, 246, 0.3)',
          backdropFilter: 'blur(10px)',
        },
      });
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
        toast.success(data.message || '🚀 Welcome to the future of pain management!', {
          style: {
            background: 'rgba(139, 92, 246, 0.1)',
            color: '#fff',
            border: '1px solid rgba(139, 92, 246, 0.3)',
            backdropFilter: 'blur(10px)',
          },
        });
        setSubscribers(data.total_subscribers || subscribers + 1);
        setName('');
        setEmail('');
      } else {
        toast.success('🚀 Welcome to the future of pain management!', {
          style: {
            background: 'rgba(139, 92, 246, 0.1)',
            color: '#fff',
            border: '1px solid rgba(139, 92, 246, 0.3)',
            backdropFilter: 'blur(10px)',
          },
        });
        setSubscribers(prev => prev + 1);
        setName('');
        setEmail('');
      }
    } catch (error) {
      toast.success('🚀 Welcome to the future of pain management!', {
        style: {
          background: 'rgba(139, 92, 246, 0.1)',
          color: '#fff',
          border: '1px solid rgba(139, 92, 246, 0.3)',
          backdropFilter: 'blur(10px)',
        },
      });
      setSubscribers(prev => prev + 1);
      setName('');
      setEmail('');
    } finally {
      setLoading(false);
    }
  };

  const handleDonation = () => {
    const amount = parseFloat(donationAmount);
    if (!amount || amount < 1) {
      toast.error('Please enter a valid amount ($1 minimum)', {
        style: {
          background: 'rgba(239, 68, 68, 0.1)',
          color: '#fff',
          border: '1px solid rgba(239, 68, 68, 0.3)',
          backdropFilter: 'blur(10px)',
        },
      });
      return;
    }

    // Create PayPal donation URL
    const paypalUrl = `https://www.paypal.com/donate/?business=tristan.siokos24@gmail.com&amount=${amount}&currency_code=USD&item_name=Support%20Recalibrate%20Development`;
    
    // Open PayPal in new tab
    window.open(paypalUrl, '_blank');
    
    toast.success(`Opening PayPal for $${amount} donation. Thank you for your support!`, {
      style: {
        background: 'rgba(139, 92, 246, 0.1)',
        color: '#fff',
        border: '1px solid rgba(139, 92, 246, 0.3)',
        backdropFilter: 'blur(10px)',
      },
    });
  };

  const quickDonationAmounts = [10, 25, 50, 100];

  return (
    <>
      <Toaster position="top-center" />

      <div className="container">
        
        {/* Header */}
        <header className="header">
          {/* DECORATIVE BIOLOGICAL ANIMATIONS - AROUND HEADER */}
          <div className="header-decorations">
            
            {/* DNA Molecule - Top Right */}
            <div className="dna-molecule">
              <div className="phosphate-backbone-1"></div>
              <div className="phosphate-backbone-2"></div>
              <div className="base-pair adenine-thymine-1"></div>
              <div className="base-pair guanine-cytosine-1"></div>
              <div className="base-pair adenine-thymine-2"></div>
              <div className="base-pair guanine-cytosine-2"></div>
              <div className="base-pair adenine-thymine-3"></div>
            </div>
            
            {/* Cell - Top Left */}
            <div className="cell-diagram">
              <div className="cell-membrane"></div>
              <div className="cell-nucleus"></div>
              <div className="nucleolus"></div>
              <div className="mitochondria-1"></div>
              <div className="mitochondria-2"></div>
              <div className="endoplasmic-reticulum"></div>
              <div className="ribosome-1"></div>
              <div className="ribosome-2"></div>
              <div className="ribosome-3"></div>
            </div>
            
            {/* Lungs - Bottom Left */}
            <div className="lung-system">
              <div className="left-lung"></div>
              <div className="right-lung"></div>
              <div className="trachea"></div>
              <div className="bronchus-left"></div>
              <div className="bronchus-right"></div>
              <div className="alveoli-cluster-1"></div>
              <div className="alveoli-cluster-2"></div>
            </div>
            
            {/* Improved Heart - Bottom Right */}
            <div className="anatomical-heart">
              <div className="heart-chamber left-atrium"></div>
              <div className="heart-chamber right-atrium"></div>
              <div className="heart-chamber left-ventricle"></div>
              <div className="heart-chamber right-ventricle"></div>
              <div className="heart-valve aortic"></div>
              <div className="heart-valve mitral"></div>
              <div className="heart-valve pulmonary"></div>
              <div className="heart-valve tricuspid"></div>
              <div className="coronary-artery left-main"></div>
              <div className="coronary-artery right-coronary"></div>
              <div className="blood-particle particle-1"></div>
              <div className="blood-particle particle-2"></div>
              <div className="blood-particle particle-3"></div>
              <div className="blood-particle particle-4"></div>
              <div className="electrical-impulse impulse-1"></div>
              <div className="electrical-impulse impulse-2"></div>
            </div>
            
          </div>

          <div className="logo-section">
            <div className="logo-icon">
              <Brain />
            </div>
            <div className="welcome-header">
              <h1 className="welcome-text">Welcome to</h1>
              <h1 className="main-title">Recalibrate</h1>
            </div>
          </div>
          <p className="subtitle">Your intelligent pain management companion</p>
          <p className="sub-description">Track symptoms, learn from pain science, build your care team, use our built in therapeutic tools and get AI-powered insights to personalize your painful experience and live to your best.</p>
        </header>

        {/* Progress Section */}
        <div className="progress-section">
          <div className="progress-card">
            <div className="progress-header-section">
              <div className="progress-badge">
                <Sparkles size={14} />
                Development Status
              </div>
              <div className="progress-content">
                <h2 className="progress-title">Platform Development Progress</h2>
                <p className="progress-description">Building the future of chronic pain management</p>
              </div>
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
                <h3 className="milestone-title">Beta Release</h3>
                <p className="milestone-status pending">📅 Q4 2025</p>
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
              <div className="proof-number purple">200+</div>
              <div className="proof-label">Tools and Lessons</div>
            </div>
            <div className="proof-item">
              <div className="proof-number green">∞</div>
              <div className="proof-label">Potential</div>
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
            
            <div className="donation-simple">
              {/* Quick Donation Buttons */}
              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginBottom: '2rem', flexWrap: 'wrap' }}>
                {quickDonationAmounts.map(amount => (
                  <button
                    key={amount}
                    type="button"
                    onClick={() => {
                      setDonationAmount(amount.toString());
                      const paypalUrl = `https://www.paypal.com/donate/?business=tristan.siokos24@gmail.com&amount=${amount}&currency_code=USD&item_name=Support%20Recalibrate%20Development`;
                      window.open(paypalUrl, '_blank');
                      toast.success(`Opening PayPal for $${amount} donation. Thank you!`, {
                        style: {
                          background: 'rgba(139, 92, 246, 0.1)',
                          color: '#fff',
                          border: '1px solid rgba(139, 92, 246, 0.3)',
                          backdropFilter: 'blur(10px)',
                        },
                      });
                    }}
                    style={{
                      padding: '0.75rem 1.5rem',
                      background: 'rgba(139, 92, 246, 0.1)',
                      border: '2px solid rgba(139, 92, 246, 0.3)',
                      borderRadius: '12px',
                      color: '#a78bfa',
                      fontSize: '0.875rem',
                      fontWeight: '600',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      backdropFilter: 'blur(10px)',
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.background = 'rgba(139, 92, 246, 0.2)';
                      e.target.style.transform = 'translateY(-2px)';
                      e.target.style.boxShadow = '0 8px 25px rgba(139, 92, 246, 0.3)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.background = 'rgba(139, 92, 246, 0.1)';
                      e.target.style.transform = 'translateY(0)';
                      e.target.style.boxShadow = 'none';
                    }}
                  >
                    ${amount}
                  </button>
                ))}
              </div>

              <div className="donation-input-row">
                <div className="amount-input-wrapper">
                  <DollarSign size={20} className="dollar-icon" />
                  <input
                    type="number"
                    id="donation-amount-input"
                    name="donationAmount"
                    className="amount-input-simple"
                    placeholder="Enter custom amount"
                    value={donationAmount}
                    onChange={(e) => setDonationAmount(e.target.value)}
                    min="1"
                    max="10000"
                    autoComplete="off"
                  />
                </div>
                <button 
                  type="button"
                  onClick={handleDonation}
                  className="donate-btn-simple"
                  disabled={!donationAmount || parseFloat(donationAmount) < 1}
                >
                  <Heart size={20} />
                  Support
                  <ExternalLink size={16} />
                </button>
              </div>
              
              <div className="donation-info">
                <p className="donation-note">
                  💡 <strong>Secure Payment:</strong> Opens PayPal in new tab for safe transaction
                </p>
                <p className="donation-note">
                  🚀 <strong>Direct Impact:</strong> Every dollar accelerates pain management innovation
                </p>
                <p className="donation-note">
                  🔒 <strong>Protected:</strong> Your payment details are handled securely by PayPal
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
                <p>Advanced algorithms identify pain patterns and predict flare-ups using machine learning</p>
              </div>
              <div className="science-item">
                <div className="science-icon purple">
                  <Activity />
                </div>
                <h3>Multi-System Tracking</h3>
                <p>8 interconnected health systems: neural, immune, musculoskeletal, autonomic, and more</p>
              </div>
              <div className="science-item">
                <div className="science-icon green">
                  <Shield />
                </div>
                <h3>Clinical Integration</h3>
                <p>Seamless provider collaboration with evidence-based protocols and real-time data</p>
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
                <p>Weighted scoring algorithms provide actionable health insights and recommendations</p>
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
    </>
  );
}

export default App;