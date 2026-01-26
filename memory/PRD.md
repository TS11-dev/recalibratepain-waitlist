# Recalibrate Pain - Product Requirements Document

## Original Problem Statement
Health and pain management app landing page with waitlist functionality. Key focus on building trust with authentic messaging and real email collection.

## Architecture
- **Frontend**: React.js with Tailwind CSS, hosted on port 3000
- **Backend**: FastAPI Python server on port 8001
- **Database**: MongoDB Atlas for email storage with JSON backup

## User Personas
- Chronic pain sufferers seeking management tools
- Healthcare professionals evaluating allied health platforms
- Potential early adopters/investors

## Core Requirements (Static)
- Email waitlist collection with welcome email automation (Resend)
- Landing page with clear value proposition
- Partner contact forms (clinic, research, investor)
- Course PDF download for subscribers

## What's Been Implemented

### January 26, 2026
- **Removed fake waitlist counter** - Replaced inflated "228+" counter (which added fake BASE_SUBSCRIBER_COUNT = 191 to real emails) with authentic scarcity messaging
- **New scarcity badge**: "Limited Spaces Available • Join Cohort 1 Now" with Sparkles icon
- **Backend change**: BASE_SUBSCRIBER_COUNT set to 0 - only real emails counted now
- **Cleaned up unused code**: Removed waitlistCount state, fetchWaitlistCount callback, and related imports

## Prioritized Backlog

### P0 (Critical)
- None currently

### P1 (High Priority)
- Consider A/B testing different scarcity messages
- Add social proof through testimonials instead of fake numbers

### P2 (Nice to Have)
- Add countdown timer to Q1 2026 launch
- Add real-time subscriber milestone celebrations (when hitting 50, 100, etc)

## Next Tasks
- Monitor real email signups and engagement
- Consider adding testimonials or partner logos for authentic social proof
