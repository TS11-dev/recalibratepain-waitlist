import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, ArrowRight, ExternalLink, FileText, Clock, ArrowUpRight, ArrowLeft } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { blogPosts } from '../data/blogPosts';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function ResourcesPage() {
  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50/30 to-indigo-50/50">
      <Helmet>
        <title>Resources - Recalibrate Health & Wellness Courses and Tools</title>
        <meta name="description" content="Access Recalibrate resources: Self-Management 101 course, evidence-based blog articles, community support and wellness tools for chronic pain management." />
        <link rel="canonical" href="https://recalibratepain.com/resources" />
        <meta property="og:title" content="Resources - Recalibrate Health & Wellness Courses and Tools" />
        <meta property="og:description" content="Access Recalibrate resources: Self-Management 101 course, evidence-based blog articles, community support and wellness tools for chronic pain management." />
        <meta property="og:url" content="https://recalibratepain.com/resources" />
      </Helmet>
      <Navbar />

      {/* Header */}
      <section className="pt-28 pb-12 px-4 sm:px-6">
        <Link to="/" className="inline-flex items-center gap-1.5 text-sm bg-purple-600 text-white px-4 py-2 rounded-xl font-semibold hover:bg-purple-700 hover:shadow-lg hover:shadow-purple-500/25 transition-all hover:-translate-y-0.5 mb-6" data-testid="back-to-home">
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </Link>
        <div className="text-center">
        <span className="inline-block bg-gradient-to-r from-purple-500/10 to-amber-500/10 text-purple-700 text-sm font-semibold px-4 py-2 rounded-full mb-4 border border-purple-200">
          Start Today
        </span>
        <h1 data-testid="resources-title" className="text-3xl sm:text-5xl font-bold text-gray-900 mb-4">
          Recalibrate <span className="bg-gradient-to-r from-purple-600 to-amber-600 bg-clip-text text-transparent">Resources</span>
        </h1>
        <p className="text-lg text-gray-600">Start your allied health and wellness journey today</p>
        </div>
      </section>

      {/* Resources */}
      <section className="pb-20 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto space-y-6">

          {/* Blog */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-purple-200 shadow-sm overflow-hidden hover:shadow-xl hover:border-purple-300 transition-all duration-300">
            <div className="p-6 lg:p-8">
              <div className="flex items-center justify-between flex-wrap gap-4 mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/25">
                    <FileText className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">Recalibrate Blog</h3>
                    <p className="text-sm text-gray-500">Evidence-based articles on pain science & wellness</p>
                  </div>
                </div>
                <Link to="/blog" data-testid="view-all-articles-btn" className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-500 to-indigo-500 text-white px-5 py-2.5 rounded-xl font-semibold text-sm hover:shadow-lg transition-all hover:-translate-y-0.5">
                  View All Articles <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {blogPosts.slice(0, 3).map((post) => (
                  <Link key={post.id} to={`/blog/${post.slug}`} className="group bg-gray-50 hover:bg-purple-50 rounded-xl p-4 transition-all duration-200">
                    <div className="flex items-start gap-3">
                      <span className="text-2xl">{post.icon}</span>
                      <div className="flex-1 min-w-0">
                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full inline-block mb-2 ${
                          post.color === 'blue' ? 'bg-blue-100 text-blue-700' :
                          post.color === 'purple' ? 'bg-purple-100 text-purple-700' :
                          post.color === 'indigo' ? 'bg-indigo-100 text-indigo-700' :
                          post.color === 'emerald' ? 'bg-emerald-100 text-emerald-700' :
                          'bg-rose-100 text-rose-700'
                        }`}>{post.category}</span>
                        <h4 className="font-bold text-gray-900 group-hover:text-purple-700 transition-colors text-sm leading-tight line-clamp-2 mb-1">{post.title}</h4>
                        <p className="text-xs text-gray-500 flex items-center gap-1"><Clock className="w-3 h-3" /> {post.readTime}</p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              <div className="mt-4 pt-4 border-t border-purple-100 flex items-center justify-between">
                <p className="text-sm text-gray-500">+{blogPosts.length - 3} more articles on pain science, sleep, mindfulness & more</p>
                <Link to="/blog" className="text-sm text-purple-600 hover:text-purple-700 font-medium flex items-center gap-1">
                  Read all <ArrowUpRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>

          {/* Courses */}
          <a href="https://www.etsy.com/shop/RecalibratePain" target="_blank" rel="noopener noreferrer" className="group grid grid-cols-1 lg:grid-cols-2 gap-6 items-center p-6 lg:p-8 bg-white/80 backdrop-blur-sm rounded-2xl border border-amber-200 shadow-sm hover:shadow-xl hover:shadow-amber-500/10 hover:border-amber-300 transition-all duration-300">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl flex items-center justify-center shadow-lg shadow-amber-500/25 group-hover:scale-110 transition-transform">
                  <span className="text-2xl">📚</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-900">Courses & Products</h3>
              </div>
              <p className="text-gray-600 mb-4">Explore our pain education resources, worksheets, and guides to start your journey today.</p>
              <ul className="space-y-2 mb-6">
                {['Educational courses', 'Downloadable worksheets', 'Pain management guides', 'Tracking templates', 'Self-help resources'].map((f, i) => (
                  <li key={i} className="flex items-center gap-2 text-gray-700">
                    <CheckCircle className="w-5 h-5 text-amber-500 flex-shrink-0" /><span>{f}</span>
                  </li>
                ))}
              </ul>
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white px-6 py-3 rounded-xl font-semibold">
                Browse Products <ExternalLink className="w-4 h-4" />
              </div>
            </div>
            <div className="bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl p-8 text-center group-hover:scale-[1.02] transition-transform">
              <div className="text-6xl mb-4">🎓</div>
              <p className="text-2xl font-bold text-white mb-2">Learn & Grow</p>
              <p className="text-amber-100">Start your journey now</p>
            </div>
          </a>

          {/* Support */}
          <a href="https://ko-fi.com/N4N21O1R1W" target="_blank" rel="noopener noreferrer" className="group grid grid-cols-1 lg:grid-cols-2 gap-6 items-center p-6 lg:p-8 bg-white/80 backdrop-blur-sm rounded-2xl border border-pink-200 shadow-sm hover:shadow-xl hover:shadow-pink-500/10 hover:border-pink-300 transition-all duration-300">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-rose-500 rounded-xl flex items-center justify-center shadow-lg shadow-pink-500/25 group-hover:scale-110 transition-transform">
                  <span className="text-2xl">☕</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-900">Support Our Mission</h3>
              </div>
              <p className="text-gray-600 mb-4">Help us build the future of pain management. Your support keeps our free resources available for everyone.</p>
              <ul className="space-y-2 mb-6">
                {['Fund free resources', 'Support app development', 'Enable research initiatives', 'Help more people', 'Be part of the mission'].map((f, i) => (
                  <li key={i} className="flex items-center gap-2 text-gray-700">
                    <CheckCircle className="w-5 h-5 text-pink-500 flex-shrink-0" /><span>{f}</span>
                  </li>
                ))}
              </ul>
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-pink-500 to-rose-500 text-white px-6 py-3 rounded-xl font-semibold">
                Buy Us a Coffee <ExternalLink className="w-4 h-4" />
              </div>
            </div>
            <div className="bg-gradient-to-br from-pink-500 to-rose-500 rounded-xl p-8 text-center group-hover:scale-[1.02] transition-transform">
              <div className="text-6xl mb-4">💜</div>
              <p className="text-2xl font-bold text-white mb-2">Make a Difference</p>
              <p className="text-pink-100">Every bit helps</p>
            </div>
          </a>
        </div>
      </section>

      <Footer />
    </div>
  );
}
