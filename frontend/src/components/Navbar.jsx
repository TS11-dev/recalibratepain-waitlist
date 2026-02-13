import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { X, Menu, Mail, ExternalLink } from 'lucide-react';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
  const [contactForm, setContactForm] = useState({ name: '', email: '', message: '' });
  const [submitting, setSubmitting] = useState(false);
  const location = useLocation();

  const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || window.location.origin;

  const navLinks = [
    { to: '/features', label: 'Features' },
    { to: 'https://recalibratepain.app/protocol', label: 'Protocol', external: true },
    { to: '/pricing', label: 'Pricing' },
    { to: '/partners', label: 'Partners' },
    { to: '/resources', label: 'Resources' },
  ];

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const response = await fetch(`${BACKEND_URL}/api/partner/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...contactForm, type: 'general_contact', organization: 'General Inquiry' })
      });
      const data = await response.json();
      if (data.success) {
        if (typeof window.gtag === 'function') {
          window.gtag('event', 'generate_lead', { event_category: 'engagement', event_label: 'Contact Form Submission' });
        }
        alert('Message sent! We will get back to you soon.');
        setShowContactModal(false);
        setContactForm({ name: '', email: '', message: '' });
      }
    } catch {
      alert('Error submitting form. Please try again.');
    }
    setSubmitting(false);
  };

  return (
    <>
      <nav data-testid="main-navbar" className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-slate-900 via-purple-900 to-indigo-900 shadow-lg">
        <div className="w-full px-6 lg:px-10 py-3">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center space-x-2 flex-shrink-0" data-testid="nav-logo">
              <img src="/recalibrate-logo-optimized.png" alt="Recalibrate" className="h-10 w-auto" width="40" height="40" fetchPriority="high" />
              <span className="text-xl font-bold text-white">Recalibrate</span>
            </Link>

            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden p-2 hover:bg-white/10 rounded-xl" data-testid="mobile-menu-toggle">
              {mobileMenuOpen ? <X className="w-6 h-6 text-white" /> : <Menu className="w-6 h-6 text-white" />}
            </button>

            <div className="hidden md:flex items-center space-x-1">
              {navLinks.map((link) => (
                link.external ? (
                  <a
                    key={link.to}
                    href={link.to}
                    target="_blank"
                    rel="noopener noreferrer"
                    data-testid={`nav-link-${link.label.toLowerCase()}`}
                    className="px-3 py-2 text-sm font-medium rounded-lg transition-all text-white/80 hover:text-white hover:bg-white/10"
                  >
                    {link.label}
                  </a>
                ) : (
                  <Link
                    key={link.to}
                    to={link.to}
                    data-testid={`nav-link-${link.label.toLowerCase()}`}
                    className={`px-3 py-2 text-sm font-medium rounded-lg transition-all ${
                      location.pathname === link.to
                        ? 'text-white bg-white/15'
                        : 'text-white/80 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    {link.label}
                  </Link>
                )
              ))}
              <button
                onClick={() => setShowContactModal(true)}
                data-testid="nav-contact-btn"
                className="px-3 py-2 text-white/80 hover:text-white text-sm font-medium rounded-lg hover:bg-white/10 transition-all"
              >
                Contact Us
              </button>
            </div>

            <a
              href="https://recalibratepain.app"
              target="_blank"
              rel="noopener noreferrer"
              data-testid="go-to-app-btn"
              className="hidden md:flex items-center gap-1.5 flex-shrink-0 bg-white text-purple-700 px-5 py-2.5 rounded-xl text-sm font-bold hover:shadow-lg hover:bg-purple-50 transition-all hover:-translate-y-0.5"
            >
              Go to App <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden bg-slate-900/95 border-t border-purple-500/20 py-3 px-4 space-y-1">
            {navLinks.map((link) => (
              link.external ? (
                <a
                  key={link.to}
                  href={link.to}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block w-full text-left py-3 px-4 text-white/90 hover:bg-white/10 rounded-xl"
                >
                  {link.label}
                </a>
              ) : (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block w-full text-left py-3 px-4 rounded-xl ${
                    location.pathname === link.to ? 'text-white bg-white/15' : 'text-white/90 hover:bg-white/10'
                  }`}
                >
                  {link.label}
                </Link>
              )
            ))}
            <button
              onClick={() => { setShowContactModal(true); setMobileMenuOpen(false); }}
              className="block w-full text-left py-3 px-4 text-white/90 hover:bg-white/10 rounded-xl"
            >
              Contact Us
            </button>
            <a
              href="https://recalibratepain.app"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full mt-2 bg-white text-purple-700 py-3 rounded-xl font-bold"
            >
              Go to App <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        )}
      </nav>

      {/* Contact Modal */}
      {showContactModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4" onClick={(e) => e.target === e.currentTarget && setShowContactModal(false)}>
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl max-h-[90vh] overflow-y-auto" data-testid="contact-modal">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-2xl font-bold text-gray-900">Contact Us</h3>
                <p className="text-sm text-gray-500">We'd love to hear from you</p>
              </div>
              <button onClick={() => setShowContactModal(false)} className="p-2 hover:bg-gray-100 rounded-lg" data-testid="close-contact-modal">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="p-4 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl border border-purple-100">
                <p className="font-bold text-gray-900 text-sm mb-1">Launch Date</p>
                <p className="text-purple-700 font-semibold">Q1 2026</p>
                <p className="text-xs text-gray-500">iOS / Android / Web</p>
              </div>
              <a href="mailto:info@recalibratepain.com" className="p-4 bg-gray-50 rounded-xl border border-gray-100 hover:border-purple-200 transition-colors">
                <p className="font-bold text-gray-900 text-sm mb-1">Direct Email</p>
                <p className="text-indigo-600 text-sm break-all">info@recalibratepain.com</p>
              </a>
            </div>

            <form onSubmit={handleContactSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <input type="text" required value={contactForm.name} onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })} className="w-full px-4 py-2 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm text-gray-900" placeholder="Your name" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input type="email" required value={contactForm.email} onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })} className="w-full px-4 py-2 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm text-gray-900" placeholder="you@example.com" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                <textarea required value={contactForm.message} onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })} rows={4} className="w-full px-4 py-2 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none text-sm text-gray-900" placeholder="How can we help you?" />
              </div>
              <button type="submit" disabled={submitting} data-testid="contact-submit-btn" className="w-full bg-black text-white py-3 rounded-xl font-bold hover:bg-gray-800 transition-all disabled:opacity-50">
                {submitting ? 'Sending...' : 'Send Message'}
              </button>
            </form>

            <div className="mt-6 pt-6 border-t border-gray-100">
              <p className="text-xs text-gray-500 mb-3 font-medium uppercase tracking-wider">Partnerships</p>
              <div className="grid grid-cols-3 gap-2">
                <Link to="/partners" onClick={() => setShowContactModal(false)} className="text-center p-2 rounded-lg bg-blue-50 hover:bg-blue-100 text-xs text-blue-700 font-medium">For Clinics</Link>
                <Link to="/partners" onClick={() => setShowContactModal(false)} className="text-center p-2 rounded-lg bg-purple-50 hover:bg-purple-100 text-xs text-purple-700 font-medium">Research</Link>
                <Link to="/partners" onClick={() => setShowContactModal(false)} className="text-center p-2 rounded-lg bg-green-50 hover:bg-green-100 text-xs text-green-700 font-medium">Investors</Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
