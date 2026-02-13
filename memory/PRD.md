# Recalibrate Pain - Website PRD

## Original Problem Statement
Refactor single-page application into a multi-page site with hub-and-spoke architecture. Each navigation section becomes its own page. Add Protocol external link, "Go to App" button, and rewrite the waitlist welcome email.

## Architecture
- **Frontend**: React + React Router + TailwindCSS + react-helmet-async
- **Backend**: FastAPI + MongoDB + Resend (email)
- **Pages**: Hub (App.js), Features, Pricing, Partners, Resources, Blog, Course
- **Email**: Resend API for waitlist welcome emails
- **Analytics**: Google Analytics G-49QJKVP7Y6 with SPA route tracking

## Completed Tasks
- [x] Multi-page architecture refactor (hub-and-spoke)
- [x] Sub-pages: Features, Pricing, Partners, Resources
- [x] Navbar: "Go to App" button, external Protocol link
- [x] Footer: text removal, Protocol link
- [x] "Back to Home" buttons on all sub-pages
- [x] UI bug fixes (Link import, button alignment, navbar layout)
- [x] Welcome email rewrite (Recalibrate Ecosystem, Cohort 1 March 2026)
- [x] Removed "iOS, Android & Web" from welcome email (Feb 2026)
- [x] Removed all em dashes from welcome email (Feb 2026)
- [x] Google Analytics SPA route tracking for all pages (Feb 2026)
- [x] Sitemap updated with all pages (Feb 2026)
- [x] robots.txt updated to allow all page routes (Feb 2026)
- [x] Unique title + meta description + canonical + OG tags per page via react-helmet-async (Feb 2026)

## SEO Page Titles
- Home: "Recalibrate - All-in-One Health and Pain Management App"
- Features: "App Features - Recalibrate Health & Pain Management Platform"
- Pricing: "Pricing Plans - Recalibrate Health & Pain Management App"
- Partners: "Partners - Recalibrate Allied Health Platform"
- Resources: "Resources - Recalibrate Health & Wellness Courses and Tools"
- Blog: "Blog - Recalibrate Pain Science and Wellness Articles"
- Course: "Self-Management 101 Course - Recalibrate Pain Science Education"

## Notes
- Google Search Console verified (user confirmed data showing)
- GA tracking ID: G-49QJKVP7Y6
- Production domain: recalibratepain.com

## Backlog
- No pending tasks specified by user
