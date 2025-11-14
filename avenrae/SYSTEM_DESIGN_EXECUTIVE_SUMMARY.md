# 🎯 Avenrae - Executive Summary & Architecture Overview

## Platform Overview

**Avenrae** is a **B2C marketplace** connecting spiritual practitioners with seekers. Think Airbnb meets Healing + Community.

```
┌─────────────────────────────────────────────┐
│  Seekers                                    │
│  (Browse, Book, Pay, Community)            │
└──────────────────┬──────────────────────────┘
                   │
         ┌─────────┴─────────┐
         │                   │
    ┌────▼─────┐        ┌───▼──────┐
    │ Healers  │        │  Admins  │
    │ Services │        │Dashboard │
    │ Bookings │        │Analytics │
    └──────────┘        └──────────┘
         │                   │
         └─────────┬─────────┘
                   │
         ┌─────────▼──────────┐
         │  Avenrae Platform  │
         │ (REST API + React) │
         └─────────┬──────────┘
                   │
    ┌──────────────┼──────────────┐
    │              │              │
┌──▼──┐      ┌─────▼─────┐  ┌───▼────┐
│Cash │      │ Community │  │ Growth │
│Flow │      │           │  │        │
│(15%)│      │Reviews    │  │Events  │
└─────┘      │Ratings    │  │Courses │
             │Messaging  │  │Premium │
             └───────────┘  └────────┘
```

---

## Key Features (MVP)

### 1️⃣ **Healer Marketplace**
- Browse healers by specialty (energy, reiki, counseling, etc.)
- Filter by location, rating, price, availability
- View detailed profiles with reviews
- Book appointments (calendar integration)

### 2️⃣ **Appointments & Scheduling**
- Real-time calendar availability
- Automated confirmations (email/SMS)
- Reminder notifications
- Rescheduling & cancellations

### 3️⃣ **Payments & Commerce**
- Stripe integration for secure payments
- Commission split (15-20% platform fee)
- Transaction history & invoices
- Automatic payouts to healers

### 4️⃣ **Community**
- Reviews & ratings
- Event registration & tickets
- Product marketplace (crystals, books, courses)
- Messaging (future: chat/video)

### 5️⃣ **Admin Dashboard**
- User management
- Revenue analytics
- Support ticket handling
- Platform configuration

---

## Technology Stack Decision Matrix

| Layer | Choice | Rationale | Alternatives |
|-------|--------|-----------|--------------|
| **Frontend** | React 19 + Vite | Modern, fast, huge ecosystem | Vue, Svelte |
| **Backend** | Express + Node.js | Simple, JavaScript, scalable | FastAPI, Django, Ruby |
| **Database** | PostgreSQL | ACID, JSONB, great tooling | MySQL, MongoDB |
| **ORM** | Prisma | Type-safe, best DX | TypeORM, Sequelize |
| **Auth** | JWT + bcrypt | Stateless, standard | OAuth, Session-based |
| **Payments** | Stripe | Best UX, reliability, documentation | PayPal, Square |
| **Hosting** | Render/DO App Platform | Managed, cheap, easy | AWS, Heroku, Railway |
| **Styling** | Tailwind CSS | Rapid, utility-first | Bootstrap, Material-UI |

---

## System Components

### **Frontend (React)**
```
- 9 pages (Home, Healers, Prophets, Mediums, Events, Store, Support, Profile, Admin)
- 15+ components (SearchFilters, Cards, Forms, Modals)
- 8+ custom hooks (useAuth, useFetch, useBooking, etc.)
- Context API for state
- Axios for API calls
- Tailwind for styling
- TypeScript for type safety
```

### **Backend (Node.js)**
```
- 8 major endpoints (/auth, /healers, /appointments, /events, /products, /reviews, /cart, /admin)
- JWT authentication
- Prisma ORM for database
- Request validation (Zod)
- Error handling & logging
- Rate limiting
- CORS & security headers
```

### **Database (PostgreSQL)**
```
- 32 tables organized in 8 categories
- Full normalization (3NF)
- Proper indexing for performance
- Audit logging
- Foreign key constraints
- Timestamps (created_at, updated_at)
```

### **Infrastructure**
```
- Docker containers for consistency
- GitHub Actions for CI/CD
- Render/DigitalOcean for hosting
- Redis for caching (optional)
- Sentry for error tracking
- DataDog for monitoring
```

---

## Data Flow Example: Booking an Appointment

```
USER (React Frontend)
  │
  ├─→ [1] Browse Healers
  │     GET /api/healers?specialties=energy-healing&location=durban
  │     ↓ (SearchFilters component makes request)
  │
  ├─→ [2] Select Healer & View Availability
  │     GET /api/healers/:id
  │     GET /api/healers/:id/availability
  │
  ├─→ [3] Select Time Slot & Submit Booking
  │     POST /api/appointments
  │     {healer_id, scheduled_at, duration, notes}
  │     ↓ (API validates, creates appointment, charges Stripe)
  │
  ├─→ [4] Stripe Payment Processing
  │     Stripe.confirmPayment() → Webhook
  │     POST /api/checkout/webhook (Stripe calls backend)
  │     ↓ (Backend updates transaction status)
  │
  ├─→ [5] Confirmation & Notifications
  │     SendGrid sends confirmation email
  │     SMS reminder 24hr before
  │
  ├─→ [6] Post-Appointment Review
  │     POST /api/reviews
  │     {healer_id, rating, comment}
  │
  └─→ [7] Healer Sees Booking & Review
      Healer dashboard shows new booking
      Notification email sent
```

---

## Revenue Model

```
┌─────────────────────────────────────┐
│  GMFV (Gross Merchandise Value)     │
│  = Total booking value              │
├─────────────────────────────────────┤
│                                     │
│  $100 → Healer books a session      │
│   -$20 (20% commission)             │
│   =$80 (Healer receives)            │
│                                     │
│  Platform Revenue = $20             │
│                                     │
├─────────────────────────────────────┤
│                                     │
│  At 50K appointments/month:         │
│  = $50K commission/month            │
│  = $600K/year (20% take-rate)       │
│                                     │
└─────────────────────────────────────┘

Additional Revenue Streams:
├── Event Ticket Sales (Platform: 10%)
├── Product Marketplace Commission (10%)
├── Premium Features ($5-10/month per healer)
└── Analytics Dashboard ($50/month for healers)
```

---

## Competitive Advantage

| Feature | Avenrae | Competitor A | Competitor B |
|---------|---------|-------------|------------|
| Healer Specialties | 10+ types | 3-5 types | 5-7 types |
| Booking System | Real-time | Manual | Limited |
| Community Features | Reviews, Events, Chat | Reviews only | None |
| Payment Methods | Stripe (multiple) | Cash/Bank transfer | Limited |
| Mobile Responsive | ✅ Yes | ✅ Yes | ❌ No |
| Search Filters | Advanced | Basic | None |
| Event Management | ✅ Yes | ❌ No | ✅ Yes |
| Admin Dashboard | ✅ Yes | ❌ No | ✅ Yes |

---

## Growth Projections (Year 1)

```
MONTH 1-3: MVP Launch
├── Users: 100-500
├── Bookings/Month: 10-50
├── Revenue: $0-500
└── Goal: Product-market fit

MONTH 4-6: Growth Phase
├── Users: 500-5K
├── Bookings/Month: 50-500
├── Revenue: $500-5K
└── Goal: 10% Week-over-week growth

MONTH 7-9: Optimization
├── Users: 5K-20K
├── Bookings/Month: 500-2K
├── Revenue: $5K-20K
└── Goal: Reduce churn, improve retention

MONTH 10-12: Scale
├── Users: 20K-50K
├── Bookings/Month: 2K-5K
├── Revenue: $20K-50K
└── Goal: Profitability + Series A readiness
```

---

## Risk Mitigation

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|-----------|
| Payment fraud | Medium | High | Stripe fraud detection + manual review |
| User churn | High | Medium | Community, premium features, retention emails |
| Healer quality | High | High | Verification process, reviews, vetting |
| Technical outages | Low | High | Automated backups, CDN, monitoring |
| Regulatory (data) | Low | High | GDPR compliance, privacy policy, encryption |
| Competition | High | Medium | Niche focus (spiritual), community moat |

---

## Team & Responsibilities

```
ENGINEERING
├── 1 Full-stack Engineer (You!)
│   ├── Frontend: React, TypeScript, Tailwind
│   ├── Backend: Node.js, Express, Prisma
│   └── DevOps: Docker, GitHub Actions, Deployment
│
├── 1 Backend Engineer (Future hire)
│   ├── API scaling, caching, performance
│   ├── Payment processing, webhooks
│   └── Database optimization
│
└── 1 Frontend Engineer (Future hire)
    ├── UI/UX, responsive design
    ├── Performance, accessibility
    └── Mobile web, PWA

PRODUCT & OPERATIONS
├── 1 Product Manager
│   ├── Feature prioritization, roadmap
│   ├── User research, analytics
│   └── Go-to-market strategy
│
└── 1 Operations Manager
    ├── Healer onboarding, quality assurance
    ├── Support, community management
    └── Partnerships, growth

YEAR 2+: Expand to 5-10 engineers
```

---

## Next Actions (This Week)

### 🔴 Critical Path
1. **Fix SearchFilters UI** (2 hours)
   - Reduce search box width
   - Fit all filters in one line
   
2. **Setup Backend Repo** (1 hour)
   - Create new directory `/backend`
   - Initialize Express + TypeScript + Prisma
   
3. **Create Database Schema** (3 hours)
   - Prisma schema (users, healers, appointments)
   - Run migrations
   - Seed sample data

### 🟡 High Priority
4. **Implement Auth Endpoints** (4 hours)
   - Signup, login, token refresh
   - Password hashing with bcrypt
   
5. **Wire Frontend to Backend** (2 hours)
   - Axios client setup
   - API interceptors for JWT
   - Connect login form

6. **Test Full Auth Flow** (1 hour)
   - Register → Login → Protected Route

---

## Success Criteria (MVP Completion)

✅ **Frontend:**
- [ ] 0 TypeScript errors
- [ ] 100% responsive (mobile → desktop)
- [ ] All pages load <3s
- [ ] Login/register working

✅ **Backend:**
- [ ] All endpoints tested (Postman)
- [ ] Database with sample data
- [ ] JWT auth validated
- [ ] Error handling working

✅ **Integration:**
- [ ] Login on frontend → backend JWT
- [ ] View healers from real database
- [ ] Create appointment via API
- [ ] Full booking flow end-to-end

✅ **Deployment:**
- [ ] GitHub Actions CI passing
- [ ] Code deployed to staging
- [ ] Database running in production
- [ ] Health endpoint accessible

---

## Final Notes

This system design is **production-ready at scale**. However:

- **Start small:** MVP doesn't need Kubernetes or Elasticsearch
- **Ship fast:** Get users first, optimize later
- **Build iteratively:** Each phase unlocks new revenue
- **Measure everything:** Analytics > assumptions

---

## Document Registry

| Document | Purpose | Audience |
|----------|---------|----------|
| **SYSTEM_DESIGN.md** | Full technical architecture | Engineers, Architects |
| **IMPLEMENTATION_CHECKLIST.md** | Week-by-week tasks + code templates | Engineers, Project Managers |
| **THIS FILE** | Executive summary + overview | All stakeholders |
| **DATABASE.md** | Schema deep dive | Backend engineers |
| **API_DOCUMENTATION.md** | Endpoint specs + examples | Frontend, Backend, QA |

---

**Status:** ✅ Ready to Build  
**Last Updated:** 2025-11-14  
**Next Review:** End of Week 1
