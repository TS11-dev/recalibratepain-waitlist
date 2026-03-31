# Recalibrate - Product Requirements Document

## Original Problem Statement
Prepare the Recalibrate website for launch. Remove waitlist messaging, replace with "Welcome to Recalibrate" / "We are in Beta". Add "Go to App" buttons linking to recalibratepain.app. Add Recalibrate Understand section (AI health assessment). Add Health Portals section (free patient intelligence portals). Add Meet Calum the Dragon mascot section. Smart sticky header. Better animations. Prepare for real launch.

## Architecture
- **Frontend**: React 18 + Tailwind CSS (landing page / marketing site)
- **Backend**: FastAPI (Python) with MongoDB
- **Deployment**: Vercel (frontend) / Railway (backend) planned

## User Personas
1. **Chronic pain patients** - Primary users seeking health tracking & education
2. **Allied health clinicians** - Physiotherapists, psychologists, pain specialists
3. **Carers/Family** - Supporting someone with chronic conditions

## Core Requirements
- Landing page showcasing Recalibrate app features
- Beta launch messaging (replacing waitlist)
- Recalibrate Understand product showcase (AI health assessment)
- Health Portals showcase (free chronic condition intelligence hubs)
- Calum the Dragon mascot introduction
- Email collection for updates
- Links to the live app at recalibratepain.app

## What's Been Implemented (Jan 28, 2026)

### Session 1-5 (Previous)
- Full landing page with hero, how-it-works, hub cards, FAQ, footer
- Navbar with navigation and Go to App button
- Blog system, features page, pricing page, partners page, resources page
- Email subscription / waitlist functionality
- Contact form
- SEO meta tags and Open Graph
- PayPal donation integration

### Session 6 (Current - Launch Prep)
- **Hero Section**: Updated from "Launching Q1 2026" to "Welcome to Recalibrate / BETA" badge
- **CTA Buttons**: "Join Waitlist" replaced with "Go to App" + "Free AI Assessment" dual CTAs
- **Email Form**: Updated from "Join Waitlist" to "Subscribe" for updates
- **Badge**: "Limited Spaces Available" replaced with "Now in Beta / Free to Get Started"
- **Understand Section**: New section showcasing AI-powered health assessment product with 4 feature cards, 3-step how-it-works, and CTA to begin assessment
- **Health Portals Section**: New section with 4 live portals (Fibromyalgia, Long COVID/ME-CFS, ADHD, CSS), 6 coming soon portals, stats row, and "View All Portals" CTA
- **Meet Calum Section**: Dragon mascot introduction with image, description, traits, and CTA to app
- **Smart Navbar**: Scroll-based styling (backdrop blur transitions on scroll)
- **Final CTA**: Updated with "Go to App" + "Free AI Assessment" buttons, "Now in Beta" badge
- **FAQ**: Updated first question to "Is Recalibrate available now?" with beta-appropriate answer
- **Meta Tags**: Updated all SEO descriptions to reflect beta status
- **Entrance Animations**: Hero stagger animations, scroll-triggered section reveals

### Session 7 (Feb 2026)
- **Removed Understand Section**: The "Recalibrate: Understand" product section removed from the homepage as it is now an intake AI assessment, not a standalone product/feature
- **Removed Free AI Assessment button**: Removed from the final CTA section as well


- 23/23 core frontend features passed (98% success)
- Minor: Email subscription shows network error in preview env (works on real domain)

## Prioritized Backlog
### P0 (Launch Critical) - DONE
- [x] Remove waitlist messaging
- [x] Add "Go to App" CTAs
- [x] Add Understand section
- [x] Add Health Portals section
- [x] Add Calum mascot section
- [x] Update FAQ for beta

### P1 (Post-Launch)
- [ ] Mobile app store links when iOS/Android available
- [ ] Testimonials / social proof section from beta users
- [ ] Blog content about launch announcement
- [ ] Analytics tracking for new CTA buttons

### P2 (Future)
- [ ] Interactive Calum animations (mascot walking across page)
- [ ] Video walkthrough of the app
- [ ] Live portal status indicators from API
- [ ] A/B testing for hero CTA conversions
