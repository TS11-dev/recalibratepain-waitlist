import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Download, CheckCircle, BookOpen, ArrowLeft, 
  Heart, Brain, Activity, Target, Clock, Users,
  Sparkles, FileText
} from 'lucide-react';
import { Helmet } from 'react-helmet-async';

export default function CoursePage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const courseModules = [
    { title: "Understanding Pain", desc: "The neuroscience behind chronic pain", icon: Brain },
    { title: "The 8 Lifelines", desc: "Core pillars of self-management", icon: Heart },
    { title: "Pacing & Activity", desc: "Break the boom-bust cycle", icon: Activity },
    { title: "Sleep & Recovery", desc: "Optimize your rest", icon: Clock },
    { title: "Movement & Exercise", desc: "Safe, graded approaches", icon: Target },
    { title: "Mind-Body Connection", desc: "Thoughts, emotions & pain", icon: Sparkles },
    { title: "Building Your Team", desc: "Working with healthcare providers", icon: Users },
    { title: "Your Action Plan", desc: "Putting it all together", icon: FileText },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-indigo-50">
      <Helmet>
        <title>Self-Management 101 Course - Recalibrate Pain Science Education</title>
        <meta name="description" content="Free Self-Management 101 course: 8 modules covering pain neuroscience, the 8 Lifelines framework, pacing, sleep, movement, mind-body connection and building your care team." />
        <link rel="canonical" href="https://recalibratepain.com/recalibrate101" />
        <meta property="og:title" content="Self-Management 101 Course - Recalibrate Pain Science Education" />
        <meta property="og:description" content="Free Self-Management 101 course: 8 modules covering pain neuroscience, the 8 Lifelines framework, pacing, sleep, movement, mind-body connection and building your care team." />
        <meta property="og:url" content="https://recalibratepain.com/recalibrate101" />
      </Helmet>
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-purple-100 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-purple-700 hover:text-purple-900 transition-colors">
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Back to Recalibrate</span>
          </Link>
          <div className="flex items-center gap-2">
            <img src="/recalibrate-logo-optimized.png" alt="Recalibrate" className="w-8 h-8" />
            <span className="font-bold text-gray-900">Recalibrate</span>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 sm:py-24 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-100 to-indigo-100 rounded-full px-4 py-2 mb-6">
            <BookOpen className="w-5 h-5 text-purple-600" />
            <span className="text-purple-700 font-semibold text-sm">Free Course</span>
          </div>
          
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
            Self-Management <span className="bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">101</span>
          </h1>
          
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            The 8 Lifelines: Your comprehensive guide to understanding and managing chronic pain through evidence-based self-management strategies.
          </p>

          {/* Download Button */}
          <a 
            href="/Recalibrate_Self_Management_101.pdf" 
            download="Recalibrate_Self_Management_101.pdf"
            className="inline-flex items-center gap-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-8 py-4 rounded-2xl font-bold text-lg shadow-xl shadow-purple-500/25 hover:shadow-purple-500/40 hover:scale-105 transition-all duration-300"
          >
            <Download className="w-6 h-6" />
            Download Course (PDF)
          </a>
          
          <p className="text-sm text-gray-500 mt-4">Free download, no signup required</p>
        </div>
      </section>

      {/* What's Inside */}
      <section className="py-16 px-4 sm:px-6 bg-white/60">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            What's Inside the Course
          </h2>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {courseModules.map((module, index) => (
              <div 
                key={index}
                className="bg-white rounded-2xl p-6 shadow-lg shadow-purple-100 border border-purple-100 hover:shadow-xl hover:border-purple-200 transition-all"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-xl flex items-center justify-center mb-4">
                  <module.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">{module.title}</h3>
                <p className="text-sm text-gray-600">{module.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-16 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            What You'll Learn
          </h2>
          
          <div className="space-y-4">
            {[
              "Understand how chronic pain works and why it persists",
              "Learn the 8 key areas of self-management",
              "Discover pacing techniques to break the boom-bust cycle",
              "Build sustainable habits for long-term improvement",
              "Know when and how to work with healthcare providers",
              "Create your personalized action plan"
            ].map((benefit, index) => (
              <div key={index} className="flex items-start gap-4 bg-white rounded-xl p-4 shadow-sm border border-purple-100">
                <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5" />
                <span className="text-gray-700">{benefit}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Second CTA */}
      <section className="py-16 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto">
          <div className="bg-gradient-to-br from-purple-600 to-indigo-700 rounded-3xl p-8 sm:p-12 text-center">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
              Ready to Start Your Journey?
            </h2>
            <p className="text-purple-100 mb-8">
              Download the course and take the first step toward better pain management.
            </p>
            <a 
              href="/Recalibrate_Self_Management_101.pdf" 
              download="Recalibrate_Self_Management_101.pdf"
              className="inline-flex items-center gap-3 bg-white text-purple-700 px-8 py-4 rounded-2xl font-bold text-lg hover:shadow-lg transition-all"
            >
              <Download className="w-6 h-6" />
              Download Free Course
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 sm:px-6 border-t border-purple-100">
        <div className="max-w-6xl mx-auto text-center">
          <Link to="/" className="inline-flex items-center gap-2 text-purple-600 hover:text-purple-800 font-medium">
            <ArrowLeft className="w-4 h-4" />
            Back to Recalibrate
          </Link>
          <p className="text-gray-500 text-sm mt-4">
            © 2026 Recalibrate. Evidence-based pain management.
          </p>
        </div>
      </footer>
    </div>
  );
}
