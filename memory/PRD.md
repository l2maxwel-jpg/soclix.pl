# SOCLIX Clone - Product Requirements Document

## Original Problem Statement
Create a complete, pixel-perfect clone of the website `soclix.pl`. The application should replicate the entire mechanism and functionality of the product, which is an AI-powered platform for live stream sellers that extracts customer orders from stream comments.

## Core Requirements
1. Full clone of soclix.pl landing and functionality
2. Multi-language support: English, Russian, Polish, Latvian, Ukrainian, Belarusian
3. User account section for managing connected computers
4. "My Streams" page with editable orders table parsed from stream comments
5. Filtering system for streams table (by code, color, size, quantity)
6. Pre-configuration modal before scanning streams (codes, colors, sizes)

## Target Users
- Live stream sellers (Facebook, Instagram, TikTok)
- E-commerce businesses operating through live streams
- Primarily Eastern European market (PL, RU, UK, BY, LV)

## Tech Stack
- **Frontend:** React, React Router, TailwindCSS, Shadcn UI
- **Internationalization:** i18next, react-i18next, i18next-browser-languagedetector
- **Backend (planned):** FastAPI
- **Database (planned):** MongoDB

---

## What's Been Implemented

### ✅ Completed Features (Jan 2026)

#### Frontend Clone
- [x] Homepage with hero section and features
- [x] Pricing page with 3 tiers (Starter, Pro, Enterprise)
- [x] Contact page with form
- [x] Navbar with navigation links
- [x] Footer component
- [x] Dark mode toggle

#### Multi-language Support
- [x] 6 languages: EN, RU, PL, LV, UK, BE
- [x] Language selector in navbar
- [x] Language persistence via localStorage
- [x] All pages fully translated

#### Streams Page ("My Streams")
- [x] Editable data table with mock orders
- [x] Profile sidebar with search
- [x] Filter panel (code, color, size, quantity)
- [x] CSV export functionality
- [x] Select/deselect all rows
- [x] Expandable comment details
- [x] Pre-configuration modal for stream scanning

#### Pre-configuration Modal
- [x] **Available on BOTH Homepage and Streams page**
- [x] Opens when user enters URL and clicks "Find/Сканировать"
- [x] **Extended table format for product catalog:**
  - Each row: Product Code | Colors for this code | Sizes for this code
  - Add/remove rows dynamically
  - Separate keywords field at the bottom
- [x] Full translations for all 6 languages
- [x] Success/Error states with animations
- [x] Redirects to Streams page after processing

#### Authentication (Mocked)
- [x] Login page
- [x] Register page
- [x] Auth context provider
- [x] Dashboard page (mock)

---

## What's MOCKED (No Backend Yet)

⚠️ **ALL DATA IS MOCKED - NO REAL BACKEND INTEGRATION**

- User authentication (any credentials work)
- Stream orders data (from mockStreamOrders.js)
- Profile data (from mockProfiles.js)
- Stream processing (simulated delay only)
- Device management (dashboard)

---

## Prioritized Backlog

### P0 - Critical (Next Phase)
1. **Backend Authentication**
   - FastAPI user registration/login endpoints
   - JWT token authentication
   - MongoDB user schema

2. **Backend Stream Processing**
   - API endpoint to receive stream URL
   - Integration with AI model for comment parsing
   - Store parsed orders in MongoDB

3. **Real Data Integration**
   - Replace mock data with live API calls
   - Implement proper error handling

### P1 - Important
4. **Device Management Backend**
   - API for connecting/disconnecting computers
   - Device authentication tokens

5. **Order Management Backend**
   - CRUD operations for orders
   - Batch edit/delete functionality

### P2 - Nice to Have
6. **Stream Sources**
   - Facebook Live integration
   - Instagram Live integration
   - TikTok Live integration

7. **Analytics Dashboard**
   - Sales statistics
   - Popular products
   - Customer insights

8. **Export Features**
   - Excel export
   - PDF reports
   - Integration with shipping services

---

## File Structure
```
/app
├── backend/
│   └── server.py (basic setup)
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── layout/ (Navbar, Footer)
│   │   │   └── ui/ (Shadcn components)
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   ├── data/
│   │   │   ├── mockData.js
│   │   │   └── streamOrdersData.js
│   │   ├── locales/ (en, ru, pl, lv, uk, be.json)
│   │   ├── pages/
│   │   │   ├── HomePage.jsx
│   │   │   ├── StreamsPage.jsx
│   │   │   ├── PricingPage.jsx
│   │   │   ├── ContactPage.jsx
│   │   │   ├── LoginPage.jsx
│   │   │   ├── RegisterPage.jsx
│   │   │   └── DashboardPage.jsx
│   │   ├── App.js
│   │   └── i18n.js
│   └── package.json
└── test_reports/
    └── iteration_1.json
```

---

## Testing Status
- **Frontend:** 100% pass rate (all features verified)
- **Backend:** N/A (not yet implemented)
- **Test Report:** `/app/test_reports/iteration_1.json`

---

## Notes for Next Developer
1. The pre-configuration modal works - it was reported as broken but testing confirmed it works correctly
2. Language persistence works via localStorage with i18next-browser-languagedetector
3. All frontend features use mock data - backend integration is the next major task
4. User prefers Russian language for communication
