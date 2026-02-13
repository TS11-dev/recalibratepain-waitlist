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
- [x] Removed "iOS, Android & Web" and em dashes from welcome email (Feb 2026)
- [x] Google Analytics SPA route tracking for all pages (Feb 2026)
- [x] Sitemap updated with all pages (Feb 2026)
- [x] robots.txt updated (Feb 2026)
- [x] Unique title + meta description + canonical + OG tags per page (Feb 2026)
- [x] AI SEO: llms.txt and llms-full.txt for AI crawlers (Feb 2026)
- [x] Structured data (JSON-LD) on all sub-pages - SoftwareApplication, Product, Course, WebPage schemas (Feb 2026)
- [x] BreadcrumbList schema on all pages (Feb 2026)
- [x] Dynamic blog post meta tags with Helmet (Feb 2026)

## SEO Implementation Summary

### Per-Page Titles
- Home: "Recalibrate - All-in-One Health and Pain Management App"
- Features: "App Features - Recalibrate Health & Pain Management Platform"
- Pricing: "Pricing Plans - Recalibrate Health & Pain Management App"
- Partners: "Partners - Recalibrate Allied Health Platform"
- Resources: "Resources - Recalibrate Health & Wellness Courses and Tools"
- Blog: "Blog - Recalibrate Pain Science and Wellness Articles"
- Course: "Self-Management 101 Course - Recalibrate Pain Science Education"
- Blog Posts: Dynamic "{Post Title} - Recalibrate Blog"

### Structured Data (JSON-LD)
- Home: SoftwareApplication + MedicalWebPage + WebSite + FAQPage
- Features: SoftwareApplication + BreadcrumbList
- Pricing: Product with Offers + BreadcrumbList
- Partners: WebPage with Organization + BreadcrumbList
- Resources: CollectionPage with Course + BreadcrumbList
- Blog: BreadcrumbList
- Course: Course + BreadcrumbList
- Blog Posts: Article + FAQPage + BreadcrumbList + Organization

### AI SEO
- /llms.txt: Concise site summary for AI crawlers
- /llms-full.txt: Comprehensive documentation for AI systems

## Notes
- Google Search Console verified (user confirmed data showing)
- GA tracking ID: G-49QJKVP7Y6
- Production domain: recalibratepain.com

## Backlog
- No pending tasks
