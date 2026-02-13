import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, ArrowRight, ArrowLeft } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const plans = [
  {
    name: 'Free', emoji: '🆓', monthly: '0', yearly: null,
    features: ['Smart Tracking (18+ vars)', 'Analytics Dashboard', 'Medication tracking', 'Basic Reports'],
    borderColor: 'border-gray-200', btnClass: 'bg-gray-100 text-gray-700 hover:bg-gray-200', cta: 'Start Free',
  },
  {
    name: 'Go', emoji: '🚀', monthly: '12.99', yearly: '99.99',
    features: ['Everything in Free', 'Full Academy (100+ lessons)', 'Therapeutic Tools', 'Journal & Goal Tracking'],
    borderColor: 'border-emerald-200', btnClass: 'bg-emerald-500 text-white hover:bg-emerald-600', cta: 'Get Go',
  },
  {
    name: 'Pro', emoji: '⭐', monthly: '34.99', yearly: '299.99', popular: true,
    features: ['Everything in Go', 'Recalibrate AI', 'Care Team Access', 'Advanced Courses'],
    borderColor: 'border-purple-500', btnClass: 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:shadow-lg', cta: 'Go Pro',
  },
  {
    name: 'Super', emoji: '💎', monthly: '59.99', yearly: '599.99',
    features: ['Everything in Pro', 'More AI Credits', 'More Care Team', 'Priority Support'],
    borderColor: 'border-amber-300', btnClass: 'bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:shadow-lg', cta: 'Get Super',
  },
];

export default function PricingPage() {
  useEffect(() => { window.scrollTo(0, 0); }, []);

  const scrollToWaitlist = () => {
    window.location.href = '/#waitlist';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50/30 to-indigo-50/50">
      <Helmet>
        <title>Pricing Plans - Recalibrate Health & Pain Management App</title>
        <meta name="description" content="Choose your Recalibrate plan: Free, Go, Pro, Super or Lifetime. Advanced health tracking, AI insights, academy access and care team features at every tier." />
        <link rel="canonical" href="https://recalibratepain.com/pricing" />
        <meta property="og:title" content="Pricing Plans - Recalibrate Health & Pain Management App" />
        <meta property="og:description" content="Choose your Recalibrate plan: Free, Go, Pro, Super or Lifetime. Advanced health tracking, AI insights, academy access and care team features at every tier." />
        <meta property="og:url" content="https://recalibratepain.com/pricing" />
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org", "@type": "Product", "name": "Recalibrate App",
          "description": "Allied health platform for chronic pain and health management",
          "url": "https://recalibratepain.com/pricing",
          "brand": { "@type": "Brand", "name": "Recalibrate" },
          "offers": [
            { "@type": "Offer", "name": "Free", "price": "0", "priceCurrency": "USD", "description": "Smart Tracking, Analytics Dashboard, Medication tracking, Basic Reports" },
            { "@type": "Offer", "name": "Go", "price": "12.99", "priceCurrency": "USD", "billingIncrement": "P1M", "description": "Full Academy, Therapeutic Tools, Journal & Goal Tracking" },
            { "@type": "Offer", "name": "Pro", "price": "34.99", "priceCurrency": "USD", "billingIncrement": "P1M", "description": "Recalibrate AI, Care Team Access, Advanced Courses" },
            { "@type": "Offer", "name": "Super", "price": "59.99", "priceCurrency": "USD", "billingIncrement": "P1M", "description": "More AI Credits, More Care Team, Priority Support" }
          ]
        })}</script>
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org", "@type": "BreadcrumbList",
          "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://recalibratepain.com" },
            { "@type": "ListItem", "position": 2, "name": "Pricing", "item": "https://recalibratepain.com/pricing" }
          ]
        })}</script>
      </Helmet>
      <Navbar />

      <section className="pt-28 pb-16 px-4 sm:px-6" data-testid="pricing-section">
        <div className="max-w-6xl mx-auto">
          <Link to="/" className="inline-flex items-center gap-1.5 text-sm bg-purple-600 text-white px-4 py-2 rounded-xl font-semibold hover:bg-purple-700 hover:shadow-lg hover:shadow-purple-500/25 transition-all hover:-translate-y-0.5 mb-6" data-testid="back-to-home">
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </Link>
          <div className="text-center mb-10">
            <h1 data-testid="pricing-title" className="text-3xl sm:text-5xl font-bold text-gray-900 mb-3">
              Simple, Transparent <span className="bg-gradient-to-r from-purple-600 to-violet-600 bg-clip-text text-transparent">Pricing</span>
            </h1>
            <p className="text-gray-600 text-lg">Choose the plan that fits your journey</p>
          </div>

          {/* Plans Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {plans.map((plan) => (
              <div key={plan.name} className={`bg-white rounded-xl sm:rounded-2xl p-3 sm:p-5 border-2 ${plan.borderColor} hover:shadow-lg transition-shadow relative ${plan.popular ? 'shadow-lg shadow-purple-500/10' : ''}`}>
                {plan.popular && (
                  <div className="absolute -top-2 sm:-top-2.5 left-1/2 -translate-x-1/2">
                    <span className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-[8px] sm:text-[10px] font-bold px-2 sm:px-3 py-0.5 sm:py-1 rounded-full shadow-lg">POPULAR</span>
                  </div>
                )}
                <div className="flex items-center gap-1.5 sm:gap-2 mb-2 sm:mb-3">
                  <span className="text-lg sm:text-2xl">{plan.emoji}</span>
                  <h3 className="text-base sm:text-xl font-bold text-gray-900">{plan.name}</h3>
                </div>
                <div className="mb-2 sm:mb-3">
                  <span className="text-2xl sm:text-3xl font-bold text-gray-900">${plan.monthly}</span>
                  {plan.monthly !== '0' && <span className="text-xs sm:text-sm text-gray-500">/mo</span>}
                  {plan.yearly && (
                    <p className="text-[10px] sm:text-xs text-emerald-600 font-medium">or ${(parseFloat(plan.yearly) / 12).toFixed(2)}/mo yearly</p>
                  )}
                </div>
                <ul className="space-y-1 sm:space-y-1.5 mb-3 sm:mb-4 text-xs sm:text-sm">
                  {plan.features.map((f, i) => (
                    <li key={i} className="flex items-center gap-1.5 sm:gap-2 text-gray-600">
                      <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-green-500 flex-shrink-0" />
                      <span className="text-[11px] sm:text-sm">{f}</span>
                    </li>
                  ))}
                </ul>
                <button onClick={scrollToWaitlist} className={`w-full py-2 sm:py-2.5 rounded-lg sm:rounded-xl font-semibold transition-all text-xs sm:text-sm ${plan.btnClass}`}>
                  {plan.cta}
                </button>
              </div>
            ))}
          </div>

          {/* Lifetime */}
          <div className="mt-6 bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl p-5 border-2 border-amber-300 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <span className="text-4xl">♾️</span>
              <div>
                <h3 className="text-xl font-bold text-gray-900">Lifetime Super</h3>
                <p className="text-sm text-gray-600">All Super features forever / VIP support / Early access</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <span className="text-3xl font-bold text-gray-900">$999.99</span>
                <span className="text-sm text-gray-500"> once</span>
              </div>
              <button onClick={scrollToWaitlist} className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-6 py-2.5 rounded-xl font-semibold hover:shadow-lg transition-all text-sm whitespace-nowrap">
                Get Lifetime
              </button>
            </div>
          </div>

          {/* CTA */}
          <div className="text-center mt-12">
            <p className="text-gray-600 mb-4">Join the waitlist to be first in line when we launch Q1 2026</p>
            <Link to="/" data-testid="pricing-cta" className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-8 py-4 rounded-2xl font-bold hover:shadow-xl hover:shadow-purple-500/25 transition-all hover:-translate-y-0.5">
              Join Waitlist <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
