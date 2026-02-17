import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ArrowRight, Home, BookOpen, BarChart3 } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50/30 to-indigo-50/50 flex items-center justify-center px-4">
      <Helmet>
        <title>Page Not Found | Recalibrate</title>
        <meta name="description" content="The page you are looking for could not be found. Explore Recalibrate's health tracking features, pricing, blog and resources." />
        <meta name="robots" content="noindex, follow" />
      </Helmet>

      <div className="max-w-lg w-full text-center">
        {/* Logo */}
        <Link to="/" className="inline-flex items-center gap-2 mb-10 group">
          <img src="/recalibrate-logo-optimized.png" alt="Recalibrate" className="h-10 w-auto" />
          <span className="text-xl font-bold text-gray-900 group-hover:text-purple-700 transition-colors">Recalibrate</span>
        </Link>

        {/* 404 Display */}
        <div className="relative mb-8">
          <div className="text-[8rem] font-extrabold text-transparent bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text leading-none">
            404
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-48 h-48 bg-purple-500/10 rounded-full blur-3xl"></div>
          </div>
        </div>

        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
          Page not found
        </h1>
        <p className="text-gray-600 mb-10 max-w-sm mx-auto">
          This page doesn't exist or has been moved. Let's get you back on track.
        </p>

        {/* Quick Links */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8">
          <Link
            to="/"
            data-testid="404-home-link"
            className="flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-5 py-3 rounded-xl font-semibold hover:shadow-lg hover:shadow-purple-500/25 transition-all hover:-translate-y-0.5 text-sm"
          >
            <Home className="w-4 h-4" /> Home
          </Link>
          <Link
            to="/blog"
            data-testid="404-blog-link"
            className="flex items-center justify-center gap-2 bg-white border border-purple-200 text-purple-700 px-5 py-3 rounded-xl font-semibold hover:border-purple-400 hover:shadow-md transition-all hover:-translate-y-0.5 text-sm"
          >
            <BookOpen className="w-4 h-4" /> Blog
          </Link>
          <Link
            to="/pricing"
            data-testid="404-pricing-link"
            className="flex items-center justify-center gap-2 bg-white border border-purple-200 text-purple-700 px-5 py-3 rounded-xl font-semibold hover:border-purple-400 hover:shadow-md transition-all hover:-translate-y-0.5 text-sm"
          >
            <BarChart3 className="w-4 h-4" /> Pricing
          </Link>
        </div>

        {/* Waitlist CTA */}
        <div className="bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900 rounded-2xl p-6 text-center">
          <p className="text-white font-semibold mb-3">Launching Q1 2026 — join the waitlist</p>
          <Link
            to="/#waitlist"
            data-testid="404-waitlist-link"
            className="inline-flex items-center gap-2 bg-white text-gray-900 px-6 py-2.5 rounded-xl font-semibold text-sm hover:bg-gray-50 transition-all"
          >
            Join Waitlist <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
