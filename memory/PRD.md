# Recalibrate Pain - Website PRD

## Original Problem Statement
Refactor single-page application into a multi-page site with hub-and-spoke architecture. Each navigation section becomes its own page. Add Protocol external link, "Go to App" button, and rewrite the waitlist welcome email.

## Architecture
- **Frontend**: React + React Router + TailwindCSS
- **Backend**: FastAPI + MongoDB + Resend (email)
- **Pages**: Hub (App.js), Features, Pricing, Partners, Resources
- **Email**: Resend API for waitlist welcome emails

## Completed Tasks
- [x] Multi-page architecture refactor (hub-and-spoke)
- [x] Sub-pages: Features, Pricing, Partners, Resources
- [x] Navbar: "Go to App" button, external Protocol link
- [x] Footer: text removal, Protocol link
- [x] "Back to Home" buttons on all sub-pages
- [x] UI bug fixes (Link import, button alignment, navbar layout)
- [x] Welcome email rewrite (Recalibrate Ecosystem, Cohort 1 March 2026)
- [x] Test email sent to tristan.siokos24@gmail.com (Feb 2026)

## Backlog
- No pending tasks specified by user
