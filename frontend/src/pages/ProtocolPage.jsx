import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, ArrowRight, ExternalLink, BookOpen, FileText, Mail as MailIcon, Search, Sparkles } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const systems = [
  { num: '01', name: 'Digestive System', desc: 'Your gut controls 70% of your immune response', tags: ['Gut-Brain Connection', 'Akkermansia Protocol', 'Leaky Gut Repair', 'Microbiome Rebalance'], color: 'from-emerald-500 to-teal-600' },
  { num: '02', name: 'Endocrine System', desc: 'Hormonal and metabolic drivers of chronic pain', tags: ['Meal Sequencing', 'Glucose Spike Prevention', 'GLP-1 Activation', 'Metabolic Timing'], color: 'from-amber-500 to-orange-600' },
  { num: '03', name: 'Sleep System', desc: "Your brain's nightly repair and waste clearance", tags: ['Glymphatic Clearance', 'Deep Sleep Architecture', 'Magnesium Dosing', 'Sleep Hygiene Stack'], color: 'from-indigo-500 to-blue-600' },
  { num: '04', name: 'Immune System', desc: 'Calming neuroinflammation and central sensitization', tags: ['Anti-Inflammatory Stack', 'PEA + Luteolin', 'Microglia Calming', 'Curcumin Protocol'], color: 'from-rose-500 to-pink-600' },
  { num: '05', name: 'Autonomic System', desc: "Resetting your body's fight-or-flight response", tags: ['Vagus Nerve Activation', '4-7-8 Breathing', 'Cold Exposure', 'HRV Training'], color: 'from-cyan-500 to-sky-600' },
  { num: '06', name: 'Neural System', desc: "Rewiring your brain's distorted pain map", tags: ['Brain Remapping', 'Two-Point Discrimination', 'Graded Motor Imagery', 'Neuroplasticity Drills'], color: 'from-violet-500 to-purple-600' },
  { num: '07', name: 'Musculoskeletal System', desc: 'Why stretching fails and what actually works', tags: ['Movement Reset', 'Pandiculation', 'Somatic Education', 'Slow Movement Therapy'], color: 'from-lime-500 to-green-600' },
  { num: '08', name: 'Cognitive System', desc: 'Sound, sensory environment & lifestyle factors', tags: ['Sound Therapy', 'Binaural Beats', 'Theta Wave Entrainment', 'Sensory Environment Design'], color: 'from-fuchsia-500 to-pink-600' },
];

export default function ProtocolPage() {
  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50/30 to-indigo-50/50">
      <Navbar />

      {/* Hero */}
      <section className="pt-28 pb-16 px-4 sm:px-6 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl"></div>
          <div className="absolute top-40 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
        </div>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-100 to-teal-100 border border-emerald-200/50 rounded-full px-4 py-2 mb-6">
            <Sparkles className="w-4 h-4 text-emerald-600" />
            <span className="text-sm font-semibold text-emerald-800">Based on 250+ Peer-Reviewed Studies</span>
          </div>
          <h1 data-testid="protocol-title" className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 leading-[1.1] mb-6">
            Recalibrate <span className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 bg-clip-text text-transparent">Protocol</span>
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto mb-8 leading-relaxed">
            An 8-system clinical framework addressing the root biological causes of chronic pain.
            From your gut microbiome to your brain's pain circuits &mdash; research, protocols, and implementation across every system.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="https://recalibratepain.app/protocol"
              target="_blank"
              rel="noopener noreferrer"
              data-testid="protocol-cta-hero"
              className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:shadow-xl hover:shadow-emerald-500/25 transition-all hover:-translate-y-0.5 flex items-center gap-2"
            >
              Get The Protocol <ArrowRight className="w-5 h-5" />
            </a>
            <p className="text-gray-500 font-semibold">$149.99 &mdash; Lifetime Access</p>
          </div>
        </div>
      </section>

      {/* Why Nothing Has Worked */}
      <section className="py-16 px-4 sm:px-6 bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-72 h-72 bg-emerald-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        </div>
        <div className="max-w-3xl mx-auto relative z-10 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
            Why Nothing Has <span className="bg-gradient-to-r from-rose-400 to-pink-400 bg-clip-text text-transparent">Worked</span>
          </h2>
          <p className="text-lg text-purple-200/90 leading-relaxed mb-6">
            Chronic pain isn't a signal problem &mdash; it's a <strong className="text-white">systems problem</strong>.
            Your nervous system has become hypersensitized. Your gut is leaking inflammatory compounds. Your brain's cleaning system is compromised. Your vagus nerve is stuck in "threat mode."
          </p>
          <p className="text-lg text-purple-200/90 leading-relaxed">
            Traditional medicine treats pain like a fire alarm &mdash; they just want to silence it.
            The Recalibrate Protocol addresses <strong className="text-white">eight different biological systems</strong> all contributing to your experience of pain. Not the symptom. The systems.
          </p>
        </div>
      </section>

      {/* 8 Systems */}
      <section className="py-16 sm:py-24 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-5xl font-bold text-gray-900 mb-4">
              8 Biological <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">Systems</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Each system contains multiple research-backed protocols you can implement and personalise.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5" data-testid="protocol-systems-grid">
            {systems.map((sys) => (
              <div key={sys.num} className="group bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200 p-6 hover:shadow-xl hover:border-purple-200 transition-all duration-300">
                <div className="flex items-start gap-4">
                  <div className={`w-14 h-14 bg-gradient-to-br ${sys.color} rounded-xl flex items-center justify-center shadow-lg flex-shrink-0 group-hover:scale-110 transition-transform`}>
                    <span className="text-white font-bold text-lg">{sys.num}</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-1">{sys.name}</h3>
                    <p className="text-gray-600 text-sm mb-3">{sys.desc}</p>
                    <div className="flex flex-wrap gap-1.5">
                      {sys.tags.map((tag, i) => (
                        <span key={i} className="text-xs bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full font-medium">{tag}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What's Included */}
      <section className="py-16 px-4 sm:px-6 bg-gradient-to-b from-purple-50/50 to-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Everything You Need to Recalibrate</h2>
            <p className="text-gray-600 text-lg">24+ resources. Research-backed protocols. Permanent access.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Protocol Maps */}
            <div className="bg-white rounded-2xl border border-emerald-200 p-6 hover:shadow-xl transition-all">
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center mb-4 shadow-lg">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">8 Protocol Maps</h3>
              <p className="text-gray-600 text-sm mb-4">Each map covers a biological system with multiple protocols. From quick daily habits to 12-month plans.</p>
              <ul className="space-y-1.5 text-sm text-gray-600">
                {['Digestive System', 'Endocrine System', 'Sleep System', 'Immune System', 'Autonomic System', 'Neural System', 'Musculoskeletal', 'Cognitive System'].map((s, i) => (
                  <li key={i} className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />{s}</li>
                ))}
              </ul>
            </div>

            {/* Email Course */}
            <div className="bg-white rounded-2xl border border-indigo-200 p-6 hover:shadow-xl transition-all">
              <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-violet-500 rounded-xl flex items-center justify-center mb-4 shadow-lg">
                <MailIcon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">8-Day Email Course</h3>
              <p className="text-gray-600 text-sm mb-4">One protocol per day, paced implementation with psychological techniques (CBT, ACT, PRT).</p>
              <ul className="space-y-1.5 text-sm text-gray-600">
                {['Daily action steps', 'Pain reprocessing techniques', 'Progress milestones', 'Permanent library archive'].map((s, i) => (
                  <li key={i} className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-indigo-500 flex-shrink-0" />{s}</li>
                ))}
              </ul>
            </div>

            {/* Quick Guides */}
            <div className="bg-white rounded-2xl border border-amber-200 p-6 hover:shadow-xl transition-all">
              <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl flex items-center justify-center mb-4 shadow-lg">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">8 Quick Guides</h3>
              <p className="text-gray-600 text-sm mb-4">Dense 1-page reference sheets for daily use. Print them, stick them on your fridge.</p>
              <ul className="space-y-1.5 text-sm text-gray-600">
                {['Supplement Stack Chart', 'Sleep Optimization Checklist', 'Vagus Nerve Exercises', 'Morning Protocol', 'Movement Reset'].map((s, i) => (
                  <li key={i} className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-amber-500 flex-shrink-0" />{s}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Research */}
      <section className="py-16 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">250+ Research Papers</h2>
          <p className="text-gray-600 text-lg mb-8 max-w-2xl mx-auto">
            Every claim is backed by peer-reviewed research. Your library includes a searchable, filterable Research Directory.
          </p>
          <div className="grid grid-cols-3 gap-4 max-w-lg mx-auto mb-8">
            <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-5 border border-emerald-200">
              <p className="text-3xl font-extrabold text-emerald-700">250+</p>
              <p className="text-sm text-gray-600 font-medium">Research Papers</p>
            </div>
            <div className="bg-gradient-to-br from-indigo-50 to-violet-50 rounded-2xl p-5 border border-indigo-200">
              <p className="text-3xl font-extrabold text-indigo-700">8</p>
              <p className="text-sm text-gray-600 font-medium">Biological Systems</p>
            </div>
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-5 border border-amber-200">
              <p className="text-3xl font-extrabold text-amber-700">100%</p>
              <p className="text-sm text-gray-600 font-medium">Direct Links</p>
            </div>
          </div>
          <div className="inline-flex flex-wrap justify-center gap-3">
            {['Search & Filter', 'Key Findings Highlighted', 'Direct Source Links', 'Organized by System'].map((f, i) => (
              <span key={i} className="flex items-center gap-2 bg-white border border-gray-200 rounded-full px-4 py-2 text-sm text-gray-700 font-medium">
                <Search className="w-4 h-4 text-purple-500" /> {f}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing CTA */}
      <section className="py-16 sm:py-24 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto">
          <div className="relative bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900 rounded-3xl p-8 sm:p-12 text-center overflow-hidden">
            <div className="absolute top-0 left-0 w-64 h-64 bg-emerald-500/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute bottom-0 right-0 w-64 h-64 bg-teal-500/20 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>
            <div className="relative">
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Ready to Recalibrate?</h2>
              <p className="text-lg text-white/80 mb-8 max-w-xl mx-auto">
                Instant access to your complete clinical library. Download everything. Keep it forever.
              </p>
              <div className="bg-white/10 backdrop-blur rounded-2xl p-6 mb-8 max-w-md mx-auto border border-white/20">
                <p className="text-sm text-white/70 mb-1">One-time payment</p>
                <p className="text-5xl font-extrabold text-white mb-4">$149.99</p>
                <ul className="space-y-2 text-left text-sm text-white/90 mb-6">
                  {['8 Protocol Maps', '8-Day Email Course', '8 Quick Reference Guides (PDF)', '250+ Research Papers Directory', 'Lifetime Access & Updates'].map((f, i) => (
                    <li key={i} className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />{f}</li>
                  ))}
                </ul>
                <a
                  href="https://recalibratepain.app/protocol"
                  target="_blank"
                  rel="noopener noreferrer"
                  data-testid="protocol-cta-bottom"
                  className="block w-full bg-gradient-to-r from-emerald-500 to-teal-500 text-white py-4 rounded-xl font-bold text-lg hover:shadow-xl hover:shadow-emerald-500/25 transition-all text-center"
                >
                  Get The Protocol
                </a>
              </div>
              <p className="text-white/60 text-sm">Questions? Email <a href="mailto:info@recalibratepain.com" className="text-white/80 underline hover:text-white">info@recalibratepain.com</a></p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
