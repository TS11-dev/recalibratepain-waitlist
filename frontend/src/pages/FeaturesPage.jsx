import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, ArrowRight, Sparkles, ArrowLeft } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const features = [
  {
    title: 'Smart Tracker', tier: 'FREE', tierColor: 'text-blue-600 bg-blue-100',
    desc: 'Log pain, sleep, mood & energy across 8 health systems with our comprehensive tracking tools.',
    items: ['18+ health variables tracked', 'Pain & mood monitoring', 'Sleep quality analysis', 'Medication tracking', 'Energy level logging'],
    icon: '🎯', stat: '18+ Variables', statSub: 'Across 8 biological systems',
    color: 'border-blue-200 hover:border-blue-300 hover:shadow-blue-500/10', iconBg: 'from-blue-500 to-cyan-500', checkColor: 'text-blue-500', gradBg: 'from-blue-500 to-cyan-500',
  },
  {
    title: 'Analytics Dashboard', tier: 'FREE', tierColor: 'text-purple-600 bg-purple-100',
    desc: 'Your personal Stability Score calculated from 18 variables. Visualize trends and patterns.',
    items: ['Stability score tracking', 'Trend analysis & visualization', 'Pattern detection algorithms', 'Doctor-ready reports', 'Historical data comparison'],
    icon: '📊', stat: 'Stability Score', statSub: 'Real-time pattern detection',
    color: 'border-purple-200 hover:border-purple-300 hover:shadow-purple-500/10', iconBg: 'from-purple-500 to-violet-500', checkColor: 'text-purple-500', gradBg: 'from-purple-500 to-violet-500',
  },
  {
    title: 'Recalibrate Academy', tier: 'GO', tierColor: 'text-emerald-600 bg-emerald-100',
    desc: '100+ lessons on health and pain science. Earn XP and badges as you learn evidence-based strategies.',
    items: ['100+ educational lessons', 'Pain neuroscience modules', 'Foundations & strategies', 'XP & badge rewards', 'Self-paced learning'],
    icon: '🧠', stat: '100+ Lessons', statSub: 'Evidence-based pain education',
    color: 'border-emerald-200 hover:border-emerald-300 hover:shadow-emerald-500/10', iconBg: 'from-emerald-500 to-teal-500', checkColor: 'text-emerald-500', gradBg: 'from-emerald-500 to-teal-500',
  },
  {
    title: 'Tools & Exercises', tier: 'GO', tierColor: 'text-amber-600 bg-amber-100',
    desc: 'Journaling, goal tracking, daily inspiration, and guided therapeutic exercises.',
    items: ['Reflective journaling', 'Goal setting & tracking', 'Daily inspiration quotes', 'Guided exercises', 'CBT & mindfulness tools'],
    icon: '✨', stat: 'Therapeutic Tools', statSub: 'CBT, Mindfulness & More',
    color: 'border-amber-200 hover:border-amber-300 hover:shadow-amber-500/10', iconBg: 'from-amber-500 to-orange-500', checkColor: 'text-amber-500', gradBg: 'from-amber-500 to-orange-500',
  },
  {
    title: 'Recalibrate AI', tier: 'PRO', tierColor: 'text-pink-600 bg-pink-100', highlighted: true,
    desc: 'Your AI companion for health insights. Get personalized patterns and research assistance.',
    items: ['Chat with health context', 'Health and pain science research', 'Pattern analysis', 'Personalized suggestions', '24/7 AI availability'],
    icon: '💬', stat: 'Recalibrate AI', statSub: 'AI-powered health insights',
    color: 'border-pink-300 hover:border-pink-400 hover:shadow-pink-500/20 border-2 shadow-lg shadow-pink-500/10', iconBg: 'from-pink-500 to-rose-500', checkColor: 'text-pink-500', gradBg: 'from-pink-500 to-rose-500',
  },
  {
    title: 'Care Team', tier: 'PRO', tierColor: 'text-cyan-600 bg-cyan-100',
    desc: 'Connect clinicians, researchers, family members, and friends with dedicated dashboards.',
    items: ['Clinician analytics access', 'Research data sharing', 'Family support dashboards', 'Progress report exports', 'Collaborative care coordination'],
    icon: '🩺', stat: 'Connected Care', statSub: 'Clinicians, Family & Friends',
    color: 'border-cyan-200 hover:border-cyan-300 hover:shadow-cyan-500/10', iconBg: 'from-cyan-500 to-blue-500', checkColor: 'text-cyan-500', gradBg: 'from-cyan-500 to-blue-500',
  },
];

const evidenceItems = [
  { icon: '🧠', label: 'Pain Neuroscience', color: 'from-blue-500 to-indigo-500' },
  { icon: '💭', label: 'CBT Therapy', color: 'from-purple-500 to-violet-500' },
  { icon: '🧘', label: 'Mindfulness', color: 'from-emerald-500 to-teal-500' },
  { icon: '🏃', label: 'Movement Therapy', color: 'from-orange-500 to-amber-500' },
  { icon: '📈', label: 'Graded Exposure', color: 'from-pink-500 to-rose-500' },
  { icon: '😴', label: 'Sleep Science', color: 'from-indigo-500 to-blue-500' },
];

const evidenceTags = ['Acceptance & Commitment', 'Pacing Strategies', 'Nutrition Science', 'Stress Management', 'Biofeedback', 'Goal Setting', 'Self-Compassion', 'Activity Tracking', 'Therapeutic Alliance', 'Neuroplasticity', 'Systems Biology', 'Precision Medicine'];

export default function FeaturesPage() {
  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50/30 to-indigo-50/50">
      <Navbar />

      {/* Header */}
      <section className="pt-28 pb-12 px-4 sm:px-6 text-center">
        <Link to="/" className="inline-flex items-center gap-1.5 text-sm text-purple-600 hover:text-purple-800 font-medium mb-6 transition-colors" data-testid="back-to-home">
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </Link>
        <span className="inline-block bg-gradient-to-r from-purple-500/10 to-violet-500/10 text-purple-700 text-sm font-semibold px-4 py-2 rounded-full mb-4 border border-purple-200">
          The Tools
        </span>
        <h1 data-testid="features-title" className="text-3xl sm:text-5xl font-bold text-gray-900 mb-4">
          What's <span className="bg-gradient-to-r from-purple-600 to-violet-600 bg-clip-text text-transparent">Inside</span>
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">Here's what each feature actually does for you</p>
      </section>

      {/* Feature Cards */}
      <section className="pb-16 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto space-y-6">
          {features.map((f, idx) => (
            <div key={idx} className={`group grid grid-cols-1 lg:grid-cols-2 gap-6 items-center p-6 lg:p-8 bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 relative ${f.color}`}>
              {f.highlighted && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="bg-gradient-to-r from-pink-500 to-rose-500 text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-lg shadow-pink-500/25">AI Powered</span>
                </div>
              )}
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-12 h-12 bg-gradient-to-br ${f.iconBg} rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                    <span className="text-2xl">{f.icon === '🎯' ? '📊' : f.icon === '📊' ? '📈' : f.icon === '🧠' ? '🎓' : f.icon === '✨' ? '🛠️' : f.icon === '💬' ? '🤖' : '👥'}</span>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">{f.title}</h3>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${f.tierColor}`}>{f.tier}</span>
                  </div>
                </div>
                <p className="text-gray-600 mb-4">{f.desc}</p>
                <ul className="space-y-2">
                  {f.items.map((item, i) => (
                    <li key={i} className="flex items-center gap-2 text-gray-700">
                      <CheckCircle className={`w-5 h-5 flex-shrink-0 ${f.checkColor}`} />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className={`bg-gradient-to-br ${f.gradBg} rounded-xl p-8 text-center relative overflow-hidden group-hover:scale-[1.02] transition-transform`}>
                <div className="text-6xl mb-4">{f.icon}</div>
                <p className="text-2xl font-bold text-white mb-2">{f.stat}</p>
                <p className="text-white/80">{f.statSub}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Evidence-Based */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-10 left-10 w-48 h-48 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-10 right-10 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        </div>
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-8">
            <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">Built on Evidence-Based Allied Health Science</h3>
            <p className="text-purple-200/80 text-sm sm:text-base">Proven approaches from leading allied health and pain research</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 mb-6">
            {evidenceItems.map((item, i) => (
              <div key={i} className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20 text-center hover:bg-white/15 transition-all hover:-translate-y-1">
                <div className={`w-12 h-12 mx-auto mb-2 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center text-xl shadow-lg`}>{item.icon}</div>
                <p className="text-xs sm:text-sm font-semibold text-white">{item.label}</p>
              </div>
            ))}
          </div>
          <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
            {evidenceTags.map((item, i) => (
              <span key={i} className="bg-white/10 backdrop-blur text-purple-200 border border-purple-500/30 px-3 py-1.5 rounded-full text-xs sm:text-sm font-medium hover:bg-white/20 hover:border-purple-400/50 hover:text-white transition-all cursor-default">{item}</span>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">Ready to experience Recalibrate?</h2>
          <p className="text-gray-600 mb-6">Join the waitlist to be the first to access all these features when we launch.</p>
          <Link to="/" data-testid="features-cta" className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-8 py-4 rounded-2xl font-bold hover:shadow-xl hover:shadow-purple-500/25 transition-all hover:-translate-y-0.5">
            Join Waitlist <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
