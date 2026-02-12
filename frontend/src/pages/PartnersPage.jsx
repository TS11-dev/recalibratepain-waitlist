import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, ArrowRight, X, ArrowLeft } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const partnerTypes = [
  {
    id: 'clinic', icon: '🩺', title: 'Allied Health Clinics',
    desc: 'Integrate Recalibrate into your allied health practice. Perfect for physiotherapists, occupational therapists, chiropractors, dietitians, and psychologists.',
    features: ['Multi-patient clinician dashboard', 'Care team integration', 'Secure data sharing', 'Progress reports for appointments', 'Allied health professional tools'],
    btnText: 'Partner with us', cardIcon: '🏥', cardTitle: 'Clinical Dashboard', cardSub: 'Track all your patients',
    color: 'border-blue-200 hover:border-blue-300 hover:shadow-blue-500/10', iconBg: 'from-blue-500 to-cyan-500', checkColor: 'text-blue-500', gradBg: 'from-blue-500 to-cyan-500',
    headerGrad: 'from-blue-600 to-cyan-600',
    infoTitle: 'Why Partner With Us?',
    infoBg: 'from-blue-50 to-cyan-50', infoBorder: 'border-blue-100', infoTextColor: 'text-blue-800', infoCheckColor: 'text-blue-500',
    infoItems: ['Multi-patient clinician dashboard', 'Real-time patient progress tracking', 'Secure data sharing & reports', 'Allied health professional tools'],
    placeholder: 'Your clinic or practice name',
    msgPlaceholder: 'Tell us about your practice and how you would like to integrate Recalibrate...',
  },
  {
    id: 'research', icon: '🔬', title: 'Research Collaborations',
    desc: 'Access anonymized, aggregated data for allied health and chronic pain research. Advance the science of patient care.',
    features: ['Longitudinal health datasets', 'Multi-variable correlations', 'Ethical data partnerships', 'Allied health research collaboration'],
    btnText: 'Collaborate with us', cardIcon: '📊', cardTitle: 'Research Data', cardSub: 'Anonymized pain insights',
    color: 'border-purple-200 hover:border-purple-300 hover:shadow-purple-500/10', iconBg: 'from-purple-500 to-violet-500', checkColor: 'text-purple-500', gradBg: 'from-purple-500 to-violet-500',
    headerGrad: 'from-purple-600 to-indigo-600',
    infoTitle: 'Research Partnership Benefits',
    infoBg: 'from-purple-50 to-indigo-50', infoBorder: 'border-purple-100', infoTextColor: 'text-purple-800', infoCheckColor: 'text-purple-500',
    infoItems: ['Longitudinal health datasets', 'Multi-variable correlations', 'Ethical data partnerships', 'Allied health research collaboration'],
    placeholder: 'University or research institution',
    msgPlaceholder: 'Describe your research focus and collaboration interests...',
  },
  {
    id: 'investor', icon: '🤝', title: 'Become an Investor',
    desc: "Join us in building the future of allied health technology. We're raising our seed round to accelerate.",
    features: ['$600B+ Allied Health & Chronic Pain Market', '1.5B+ affected by chronic illness', 'AI-powered health insights', 'Scalable B2B & B2C model', 'Strong founding team', 'Clear path to profitability'],
    btnText: 'Investor Prospectus', cardIcon: '📈', cardTitle: '$250K Pre-Seed Round', cardSub: '$1M Valuation',
    color: 'border-emerald-200 hover:border-emerald-300 hover:shadow-emerald-500/10', iconBg: 'from-emerald-500 to-teal-500', checkColor: 'text-emerald-500', gradBg: 'from-emerald-500 to-teal-500',
    headerGrad: 'from-emerald-600 to-teal-600',
    infoTitle: 'Investor Prospectus Summary',
    infoBg: 'from-emerald-50 to-teal-50', infoBorder: 'border-emerald-100', infoTextColor: 'text-gray-700', infoCheckColor: 'text-emerald-500',
    infoItems: null, // custom content
    placeholder: 'Your company or fund',
    msgPlaceholder: 'Tell us about your investment focus and interest in Recalibrate...',
  },
];

export default function PartnersPage() {
  useEffect(() => { window.scrollTo(0, 0); }, []);

  const [formOpen, setFormOpen] = useState(null);
  const [form, setForm] = useState({ name: '', email: '', organization: '', message: '' });
  const [submitting, setSubmitting] = useState(false);
  const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || window.location.origin;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const response = await fetch(`${BACKEND_URL}/api/partner/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, type: formOpen })
      });
      const data = await response.json();
      if (data.success) {
        if (typeof window.gtag === 'function') {
          window.gtag('event', 'generate_lead', { event_category: 'partnership', event_label: `Partner Inquiry - ${formOpen}` });
        }
        alert('Thank you! We will contact you soon.');
        setFormOpen(null);
        setForm({ name: '', email: '', organization: '', message: '' });
      }
    } catch {
      alert('Error submitting form. Please try again.');
    }
    setSubmitting(false);
  };

  const activePartner = partnerTypes.find(p => p.id === formOpen);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50/30 to-indigo-50/50">
      <Navbar />

      {/* Header */}
      <section className="pt-28 pb-12 px-4 sm:px-6">
        <Link to="/" className="inline-flex items-center gap-1.5 text-sm text-purple-600 hover:text-purple-800 font-medium mb-6 transition-colors" data-testid="back-to-home">
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </Link>
        <div className="text-center">
        <span className="inline-block bg-gradient-to-r from-purple-500/10 to-violet-500/10 text-purple-700 text-sm font-semibold px-4 py-2 rounded-full mb-4 border border-purple-200">
          For Professionals
        </span>
        <h1 data-testid="partners-title" className="text-3xl sm:text-5xl font-bold text-gray-900 mb-4">
          Partnerships & <span className="bg-gradient-to-r from-purple-600 to-violet-600 bg-clip-text text-transparent">Fundraising</span>
        </h1>
        <p className="text-lg text-gray-600">Join us in revolutionizing allied health and patient care</p>
      </section>

      {/* Cards */}
      <section className="pb-20 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto space-y-6">
          {partnerTypes.map((p) => (
            <div key={p.id} className={`group grid grid-cols-1 lg:grid-cols-2 gap-6 items-center p-6 lg:p-8 bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 ${p.color}`}>
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-12 h-12 bg-gradient-to-br ${p.iconBg} rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                    <span className="text-2xl">{p.icon}</span>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">{p.title}</h3>
                </div>
                <p className="text-gray-600 mb-4">{p.desc}</p>
                <ul className="space-y-2 mb-6">
                  {p.features.map((f, i) => (
                    <li key={i} className="flex items-center gap-2 text-gray-700">
                      <CheckCircle className={`w-5 h-5 flex-shrink-0 ${p.checkColor}`} /><span>{f}</span>
                    </li>
                  ))}
                </ul>
                <button onClick={() => setFormOpen(p.id)} data-testid={`partner-btn-${p.id}`} className={`bg-gradient-to-r ${p.gradBg} text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all flex items-center gap-2`}>
                  {p.btnText} <ArrowRight className="w-4 h-4" />
                </button>
              </div>
              <div className={`bg-gradient-to-br ${p.gradBg} rounded-xl p-8 text-center relative overflow-hidden group-hover:scale-[1.02] transition-transform`}>
                <div className="text-6xl mb-4">{p.cardIcon}</div>
                <p className="text-2xl font-bold text-white mb-2">{p.cardTitle}</p>
                <p className="text-white/80">{p.cardSub}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Partner Form Modal */}
      {formOpen && activePartner && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4" onClick={(e) => e.target === e.currentTarget && setFormOpen(null)}>
          <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl max-h-[90vh] overflow-y-auto" data-testid="partner-form-modal">
            <div className={`p-6 rounded-t-3xl bg-gradient-to-r ${activePartner.headerGrad}`}>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                    <span className="text-2xl">{formOpen === 'clinic' ? '🏥' : formOpen === 'research' ? '🔬' : '💼'}</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">{activePartner.title}</h3>
                    <p className="text-sm text-white/80">{formOpen === 'clinic' ? 'Partner with Recalibrate' : formOpen === 'research' ? 'Advance health science together' : 'Join our journey'}</p>
                  </div>
                </div>
                <button onClick={() => setFormOpen(null)} className="p-2 hover:bg-white/20 rounded-xl"><X className="w-5 h-5 text-white" /></button>
              </div>
            </div>
            <div className="p-6">
              {/* Info box */}
              {formOpen === 'investor' ? (
                <div className={`mb-6 p-4 bg-gradient-to-br ${activePartner.infoBg} rounded-xl border ${activePartner.infoBorder}`}>
                  <h4 className="font-bold text-gray-900 mb-2">Investor Prospectus Summary</h4>
                  <div className="space-y-2 text-sm text-gray-700">
                    <p><strong className="text-emerald-700">Mission:</strong> Empowering millions to recalibrate their lives through AI-driven allied health and wellness.</p>
                    <p><strong className="text-emerald-700">Market:</strong> $600B+ Allied Health & Chronic Pain Market | 1.5B+ affected by chronic illness.</p>
                    <p><strong className="text-emerald-700">Traction:</strong> 50+ organic Pre-launch waitlist, Pre-Seed Investment Secured.</p>
                    <p><strong className="text-emerald-700">Opportunity:</strong> Raising $250K Pre-Seed Round at $1M Valuation.</p>
                    <p className="text-xs text-gray-500 mt-2 italic">Fill out the form below to request the full deck.</p>
                  </div>
                </div>
              ) : (
                <div className={`mb-6 p-4 bg-gradient-to-br ${activePartner.infoBg} rounded-xl border ${activePartner.infoBorder}`}>
                  <h4 className="font-semibold text-gray-900 mb-2">{activePartner.infoTitle}</h4>
                  <ul className="space-y-1.5 text-sm">
                    {activePartner.infoItems?.map((item, i) => (
                      <li key={i} className={`flex items-center gap-2 ${activePartner.infoTextColor}`}>
                        <span className={activePartner.infoCheckColor}>✓</span> {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Your Name *</label>
                  <input type="text" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full px-4 py-3 bg-gray-50 text-gray-900 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent" placeholder="John Doe" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Email Address *</label>
                  <input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full px-4 py-3 bg-gray-50 text-gray-900 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent" placeholder="john@example.com" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Organization *</label>
                  <input type="text" required value={form.organization} onChange={(e) => setForm({ ...form, organization: e.target.value })} className="w-full px-4 py-3 bg-gray-50 text-gray-900 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent" placeholder={activePartner.placeholder} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Message *</label>
                  <textarea required value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} rows={4} className="w-full px-4 py-3 bg-gray-50 text-gray-900 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none" placeholder={activePartner.msgPlaceholder} />
                </div>
                <button type="submit" disabled={submitting} data-testid="partner-submit-btn" className={`w-full py-3.5 rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50 text-white bg-gradient-to-r ${activePartner.headerGrad}`}>
                  {submitting ? 'Submitting...' : 'Submit Inquiry'}
                </button>
                <p className="text-xs text-gray-500 text-center">We'll respond within 48 hours</p>
              </form>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
