# Recalibrate Hub - PRD

## Original Problem Statement
Clean up the page by moving each navigation section to its own dedicated page, making the main page a hub. Add a Protocol product page (from recalibratepain.app/protocol). Add "Go to App" button in top right corner linking to recalibratepain.app.

## Architecture
- **Frontend**: React with react-router-dom, Tailwind CSS
- **Backend**: FastAPI (Python) with MongoDB
- **Routing**: Multi-page SPA with shared Navbar/Footer components

## User Personas
- Chronic pain patients seeking health management tools
- Allied health clinicians looking for patient dashboards
- Researchers interested in data collaboration
- Investors exploring the health tech space

## Core Requirements (Static)
- Multi-page site structure with clean navigation
- Protocol product showcase ($149.99 lifetime access)
- "Go to App" external link to recalibratepain.app
- Waitlist signup functionality
- Contact form and partner inquiry forms

## What's Been Implemented (Feb 12, 2026)
- [x] Restructured from single-page to multi-page routing
- [x] Created shared Navbar (with Go to App button) and Footer components
- [x] Hub page with hero, phone mockup with floating labels, how it works, navigation cards, FAQ, CTA
- [x] /features page - 6 feature cards + evidence-based section
- [x] /protocol page - 8 biological systems, what's included, research, pricing CTA
- [x] /pricing page - 4 plans + lifetime option
- [x] /partners page - 3 partner types with form modals
- [x] /resources page - blog preview, courses, support links
- [x] Active nav link highlighting
- [x] Contact modal in navbar

## Prioritized Backlog
- P1: Update BlogPage/CoursePage to use shared Navbar/Footer
- P1: SEO meta tags per page
- P2: Page transition animations
- P2: Protocol preview card on hub hero
- P3: Analytics tracking per page view
