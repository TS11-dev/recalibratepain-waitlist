import React, { useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { Toaster } from 'react-hot-toast';
import App from './App';
import FeaturesPage from './pages/FeaturesPage';
import PricingPage from './pages/PricingPage';
import PartnersPage from './pages/PartnersPage';
import ResourcesPage from './pages/ResourcesPage';
import BlogPage from './pages/BlogPage';
import BlogPostPage from './pages/BlogPostPage';
import CoursePage from './pages/CoursePage';
import './index.css';

function RouteTracker() {
  const location = useLocation();
  useEffect(() => {
    if (typeof window.gtag === 'function') {
      window.gtag('config', 'G-49QJKVP7Y6', {
        page_path: location.pathname + location.search,
      });
    }
  }, [location]);
  return null;
}

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <HelmetProvider>
      <BrowserRouter>
        <RouteTracker />
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/features" element={<FeaturesPage />} />
          <Route path="/pricing" element={<PricingPage />} />
          <Route path="/partners" element={<PartnersPage />} />
          <Route path="/resources" element={<ResourcesPage />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/blog/:slug" element={<BlogPostPage />} />
          <Route path="/recalibrate101" element={<CoursePage />} />
          <Route path="/course" element={<CoursePage />} />
        </Routes>
        <Toaster position="top-center" />
      </BrowserRouter>
    </HelmetProvider>
  </React.StrictMode>
);
