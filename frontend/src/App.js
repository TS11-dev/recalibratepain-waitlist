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
  const [subscribers, setSubscribers] = useState(() => {
    // Get last known count from localStorage or default to 127
    const savedCount = localStorage.getItem('recalibrate_subscriber_count');
    return savedCount ? parseInt(savedCount) : 127;
  });
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
    setProgressAnimated(true);
    
    // Fetch subscriber count immediately
    fetchSubscriberCount();
    
    // Set up interval to refresh count every 30 seconds
    const countInterval = setInterval(fetchSubscriberCount, 30000);
    
    return () => {
      clearInterval(countInterval);
    };
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
        const newCount = data.count;
        
        // NEVER go backwards - only update if count is higher
        setSubscribers(prevCount => {
          const finalCount = Math.max(prevCount, newCount);
          
          // Save to localStorage for persistence
          localStorage.setItem('recalibrate_subscriber_count', finalCount.toString());
          
          console.log('✅ Subscriber count updated:', finalCount, `(was: ${prevCount}, received: ${newCount})`);
          return finalCount;
        });
      } else {
        console.log('❌ API failed, keeping current count');
      }
    } catch (error) {
      console.log('❌ Network error, keeping current count');
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
        
        // Fetch updated count from server
        fetchSubscriberCount();
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
      
      // Fetch updated count from server
      fetchSubscriberCount();
      setName('');
      setEmail('');
    } finally {
      setLoading(false);
    }
  };

  // Donation state management
  const [selectedDonationAmount, setSelectedDonationAmount] = useState(null);

  const quickDonationAmounts = [10, 25, 50, 100];

  return (
    <>

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
          <p className="sub-description">Track symptoms, learn from pain science, build your care team, use our built in therapeutic tools and get AI-powered insights to personalize your pain management and live a better life.</p>
          
          {/* Social Media & Coming Soon Section */}
          <div className="social-and-badges-section">
            <div className="social-media-links">
              <a href="https://web.facebook.com/profile.php?id=61577010274296" target="_blank" rel="noopener noreferrer" className="social-icon facebook">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              <a href="https://www.instagram.com/recalibrate_app?igsh=MWgzZjhxZmdtemQyNA==" target="_blank" rel="noopener noreferrer" className="social-icon instagram">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
              <a href="https://www.linkedin.com/company/recalibrate-app/" target="_blank" rel="noopener noreferrer" className="social-icon linkedin">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </a>
              <a href="https://x.com/Recalibrate_App?s=08" target="_blank" rel="noopener noreferrer" className="social-icon twitter">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z"/>
                </svg>
              </a>
            </div>
            
            <div className="coming-soon-badges">
              <div className="badge-item beta">
                <div className="badge-icon">🚀</div>
                <div className="badge-text">
                  <span className="badge-title">Beta Launch</span>
                  <span className="badge-subtitle">Coming Soon</span>
                </div>
              </div>
              <div className="badge-item playstore">
                <div className="badge-icon">📱</div>
                <div className="badge-text">
                  <span className="badge-title">Download on Google Play Store</span>
                  <span className="badge-subtitle">Coming Soon</span>
                </div>
              </div>
            </div>
          </div>
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
              placeholder="Name"
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
              placeholder="Email"
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
              {/* PayPal Donation Buttons */}
              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginBottom: '2rem', flexWrap: 'wrap' }}>
                {quickDonationAmounts.map(amount => (
                  <button
                    key={amount}
                    type="button"
                    onClick={() => {
                      setDonationAmount(amount.toString());
                      setSelectedDonationAmount(amount);
                    }}
                    style={{
                      padding: '0.75rem 1.5rem',
                      background: selectedDonationAmount === amount ? 'rgba(139, 92, 246, 0.2)' : 'rgba(139, 92, 246, 0.1)',
                      border: '2px solid rgba(139, 92, 246, 0.3)',
                      borderRadius: '12px',
                      color: '#a78bfa',
                      fontSize: '0.875rem',
                      fontWeight: '600',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      backdropFilter: 'blur(10px)',
                      transform: selectedDonationAmount === amount ? 'translateY(-2px)' : 'none',
                      boxShadow: selectedDonationAmount === amount ? '0 8px 25px rgba(139, 92, 246, 0.3)' : 'none'
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
                    onChange={(e) => {
                      setDonationAmount(e.target.value);
                    }}
                    min="1"
                    max="10000"
                    autoComplete="off"
                  />
                </div>
                <button 
                  type="button"
                  onClick={() => {
                    const amount = parseFloat(donationAmount) || selectedDonationAmount;
                    if (!amount || amount < 1) {
                      toast.error('Please select or enter a valid amount ($1 minimum)', {
                        style: {
                          background: 'rgba(239, 68, 68, 0.1)',
                          color: '#fff',
                          border: '1px solid rgba(239, 68, 68, 0.3)',
                          backdropFilter: 'blur(10px)',
                        },
                      });
                      return;
                    }
                    
                    // Simple PayPal redirect that works
                    const paypalUrl = `https://www.paypal.com/donate/?business=tristan.siokos24@gmail.com&amount=${amount}&currency_code=USD&item_name=Support%20RecalibratePain%20Development`;
                    window.open(paypalUrl, '_blank');
                    
                    toast.success(`Opening secure payment for $${amount}. Thank you for your support!`, {
                      style: {
                        background: 'rgba(139, 92, 246, 0.1)',
                        color: '#fff',
                        border: '1px solid rgba(139, 92, 246, 0.3)',
                        backdropFilter: 'blur(10px)',
                      },
                    });
                  }}
                  className="donate-btn-simple"
                  disabled={!donationAmount && !selectedDonationAmount}
                >
                  <Heart size={20} />
                  Support Development
                  <ExternalLink size={16} />
                </button>
              </div>
              
              <div className="donation-info">
                <p className="donation-note">
                  💳 <strong>Secure Payment:</strong> Accepts all major credit & debit cards
                </p>
                <p className="donation-note">
                  🚀 <strong>Direct Impact:</strong> Every dollar accelerates pain management innovation
                </p>
                <p className="donation-note">
                  🔒 <strong>Protected:</strong> Your payment details are handled securely through PayPal
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
              <a href="mailto:info@recalibratepain.com">
                info@recalibratepain.com
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