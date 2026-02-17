import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  FileText, Clock, Calendar, Tag, ArrowRight, 
  ArrowLeft, Search, Mail, ExternalLink
} from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { blogPosts } from '../data/blogPosts';
import { generateOrganizationSchema, useSchemaMarkup } from '../utils/schemaMarkup';

// Blog listing schema
const generateBlogListSchema = (siteUrl = 'https://recalibratepain.com') => ({
  "@context": "https://schema.org",
  "@type": "Blog",
  "name": "Recalibrate Blog - Pain Science & Wellness",
  "description": "Evidence-based articles on chronic pain management, neuroscience, and recovery strategies.",
  "url": `${siteUrl}/blog`,
  "publisher": {
    "@type": "Organization",
    "name": "Recalibrate",
    "logo": {
      "@type": "ImageObject",
      "url": `${siteUrl}/recalibrate-logo-optimized.png`
    }
  },
  "blogPost": blogPosts.map(post => ({
    "@type": "BlogPosting",
    "headline": post.title,
    "description": post.excerpt,
    "datePublished": "2026-01-15",
    "url": `${siteUrl}/blog/${post.slug}`,
    "author": {
      "@type": "Organization",
      "name": "Recalibrate Health Team"
    }
  }))
});

export default function BlogPage() {
  const categories = [...new Set(blogPosts.map(post => post.category))];
  
  // Scroll to top on page load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  
  // Inject JSON-LD Schema for SEO
  useSchemaMarkup([
    generateBlogListSchema(),
    generateOrganizationSchema()
  ]);
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50/30 to-indigo-50/50">
      <Helmet>
        <title>Pain Science Blog - Evidence-Based Articles on Chronic Pain | Recalibrate</title>
        <meta name="description" content="10 evidence-based articles on chronic pain, pain neuroscience, sleep and pain, mindfulness, fibromyalgia, central sensitization, activity pacing and self-management strategies. Written by health professionals." />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://recalibratepain.com/blog" />
        <meta property="og:title" content="Pain Science Blog - Evidence-Based Articles on Chronic Pain | Recalibrate" />
        <meta property="og:description" content="10+ evidence-based articles on chronic pain management, pain neuroscience, sleep, mindfulness, fibromyalgia, central sensitization and self-management from the Recalibrate health team." />
        <meta property="og:url" content="https://recalibratepain.com/blog" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Recalibrate" />
        <meta property="og:locale" content="en_US" />
        <meta property="og:image" content="https://recalibratepain.com/social-preview.jpg" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content="Recalibrate Pain Science Blog - Evidence-Based Chronic Pain Articles" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@RecalibrateApp" />
        <meta name="twitter:creator" content="@RecalibrateApp" />
        <meta name="twitter:title" content="Pain Science Blog - Evidence-Based Chronic Pain Articles | Recalibrate" />
        <meta name="twitter:description" content="10+ evidence-based articles: pain neuroscience, sleep, mindfulness, fibromyalgia, central sensitization, pacing and more from the Recalibrate health team." />
        <meta name="twitter:image" content="https://recalibratepain.com/social-preview.jpg" />
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org", "@type": "BreadcrumbList",
          "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://recalibratepain.com" },
            { "@type": "ListItem", "position": 2, "name": "Blog", "item": "https://recalibratepain.com/blog" }
          ]
        })}</script>
      </Helmet>
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-slate-900 via-purple-900 to-indigo-900 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center space-x-2">
              <img 
                src="/recalibrate-logo-optimized.png" 
                alt="Recalibrate" 
                className="h-10 w-auto" 
                width="40" 
                height="40"
              />
              <span className="text-xl font-bold text-white">Recalibrate</span>
            </Link>
            <div className="flex items-center gap-4">
              <Link to="/" className="text-white/80 hover:text-white text-sm font-medium flex items-center gap-1">
                <ArrowLeft className="w-4 h-4" /> Back to Home
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-28 pb-12 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-100 to-indigo-100 border border-purple-200 rounded-full px-4 py-2 mb-6">
            <FileText className="w-4 h-4 text-purple-600" />
            <span className="text-sm font-semibold text-purple-700">Recalibrate Blog</span>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 leading-tight mb-6">
            Pain Science & <span className="bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">Wellness</span>
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
            Evidence-based articles on chronic pain management, neuroscience, and recovery strategies written by health professionals.
          </p>
          
          {/* Categories */}
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {categories.map((category) => (
              <span 
                key={category}
                className="px-4 py-2 bg-white border border-gray-200 rounded-full text-sm font-medium text-gray-700 hover:border-purple-300 hover:text-purple-700 transition-all cursor-pointer"
              >
                {category}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Blog Posts Grid */}
      <section className="pb-20 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {blogPosts.map((post) => (
              <Link 
                key={post.id}
                to={`/blog/${post.slug}`}
                className="group bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-xl hover:border-purple-300 transition-all duration-300 flex flex-col"
              >
                {/* Card Header */}
                <div className={`p-6 ${
                  post.color === 'blue' ? 'bg-gradient-to-br from-blue-500 to-cyan-500' :
                  post.color === 'purple' ? 'bg-gradient-to-br from-purple-500 to-violet-500' :
                  post.color === 'indigo' ? 'bg-gradient-to-br from-indigo-500 to-blue-500' :
                  post.color === 'emerald' ? 'bg-gradient-to-br from-emerald-500 to-teal-500' :
                  post.color === 'rose' ? 'bg-gradient-to-br from-rose-500 to-pink-500' :
                  post.color === 'amber' ? 'bg-gradient-to-br from-amber-500 to-orange-500' :
                  post.color === 'fuchsia' ? 'bg-gradient-to-br from-fuchsia-500 to-pink-500' :
                  post.color === 'red' ? 'bg-gradient-to-br from-red-500 to-rose-500' :
                  post.color === 'violet' ? 'bg-gradient-to-br from-violet-500 to-purple-500' :
                  post.color === 'teal' ? 'bg-gradient-to-br from-teal-500 to-emerald-500' :
                  'bg-gradient-to-br from-rose-500 to-pink-500'
                }`}>
                  <div className="flex items-center justify-between">
                    <span className="text-4xl">{post.icon}</span>
                    <span className="bg-white/20 backdrop-blur text-white text-xs font-semibold px-3 py-1 rounded-full">
                      {post.category}
                    </span>
                  </div>
                </div>
                
                {/* Card Body */}
                <div className="p-6 flex-1 flex flex-col">
                  <h2 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-purple-700 transition-colors line-clamp-2">
                    {post.title}
                  </h2>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3 flex-1">
                    {post.excerpt}
                  </p>
                  
                  {/* Meta */}
                  <div className="flex items-center justify-between text-xs text-gray-400 pt-4 border-t border-gray-100">
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {post.readTime}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" /> {post.date}
                      </span>
                    </div>
                    <span className="text-purple-600 font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
                      Read <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="pb-20 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900 rounded-3xl p-8 sm:p-12 text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute bottom-0 right-0 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>
            
            <div className="relative">
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
                Explore More Pain Science
              </h2>
              <p className="text-white/80 mb-6 max-w-xl mx-auto">
                Get weekly evidence-based insights on chronic pain management, research updates, and wellness strategies delivered to your inbox.
              </p>
              <a 
                href="https://recalibrate.beehiiv.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-white text-purple-700 px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all"
              >
                <ExternalLink className="w-5 h-5" /> Visit Our Newsletter
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 py-8 px-4 sm:px-6 bg-white/50">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <Link to="/" className="flex items-center gap-2">
            <img src="/recalibrate-logo-optimized.png" alt="Recalibrate" className="h-8 w-auto" />
            <span className="font-bold text-gray-900">Recalibrate</span>
          </Link>
          <p className="text-sm text-gray-500">
            © 2025 Recalibrate. Evidence-based pain management.
          </p>
        </div>
      </footer>
    </div>
  );
}
