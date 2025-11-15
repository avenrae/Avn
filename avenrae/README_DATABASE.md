# Avenrae Project Documentation Index

Complete documentation for the Avenrae spiritual wellness platform with React frontend and PostgreSQL backend.

---

## 📚 Documentation Files Overview

### 🗄️ Database Documentation

#### 1. **DATABASE_SETUP.md**
- PostgreSQL installation (macOS, Windows, Linux)
- PostGIS extension setup
- Complete SQL schema with 11 tables
- Indexes and constraints
- Custom functions for geospatial queries
- **When to use**: Initial database setup, understanding schema structure

#### 2. **PRISMA_SETUP.md**
- Prisma ORM installation and configuration
- Schema examples and usage patterns
- Database migrations guide
- Seeding sample data
- Common commands and troubleshooting
- Performance optimization tips
- **When to use**: Setting up Prisma, writing database queries, creating migrations

#### 3. **POSTGRESQL_ARCHITECTURE.md**
- High-level overview of the database architecture
- 11-table data model with relationships
- Geospatial features (PostGIS)
- Security features and implementation
- Workflow diagrams (signup, booking, search)
- Scalability considerations
- **When to use**: Understanding system design, planning features

#### 4. **POSTGRESQL_MIGRATION.md**
- Migration path from SQLite (or other databases)
- Docker setup for local development
- Backup and disaster recovery
- Production deployment (AWS RDS, Railway, Render)
- Database monitoring and maintenance
- **When to use**: Migrating from another database, setting up production

---

### 🔐 Authentication Documentation

#### 5. **AUTH_SYSTEM.md**
- Complete authentication architecture
- User roles: Client vs Practitioner
- Signup flow with address geocoding
- API endpoints for auth, practitioners, bookings
- Database schema for users and practitioners
- Security considerations (bcrypt, JWT, rate limiting)
- Frontend/backend integration patterns
- **When to use**: Implementing auth endpoints, understanding user flows

---

### 🎨 Frontend Components

#### 6. **src/pages/Auth.tsx**
- Login/Sign Up page with seamless tab UI
- Role-based form fields
- Address search with Nominatim API
- Form validation with error messages
- Practitioner-specific fields (bio, specialization, coordinates)
- **Features**: 
  - Responsive design (mobile + desktop)
  - Real-time address geocoding
  - Conditional rendering based on role
  - Form state management

#### 7. **src/pages/Booking.tsx**
- Calendar date picker component
- Available time slots display
- Booking form with validation
- Pricing breakdown with platform fees
- Professional checkout UI (booking.com style)
- **Features**:
  - 3-column layout (calendar, slots, form)
  - Sticky summary sidebar
  - Trust badges
  - Breadcrumb navigation

#### 8. **src/pages/Healers.tsx**, **Prophets.tsx**, **Mediums.tsx**
- Practitioner listing pages
- Search and filter UI
- Practitioner cards with images and descriptions
- "Book Now" buttons linking to `/booking`
- Gradient backgrounds (indigo, purple, pink)

#### 9. **src/components/Header.tsx**
- Navigation bar with logo and links
- Login/Register buttons linking to `/auth`
- Responsive mobile-first design
- Link routing via react-router-dom

#### 10. **src/components/Calendar.tsx**
- Reusable date picker component
- Month navigation (prev/next buttons)
- Availability validation
- Selected date highlighting
- Disabled past dates
- **Props**: 
  - `onDateSelect`: callback when date clicked
  - `selectedDate`: currently selected date
  - `minDate`, `maxDate`: constraints

---

### 🔌 Configuration Files

#### 11. **.env.example**
- Environment variables template
- Database connection string
- JWT secrets and expiry times
- Frontend API URLs
- Email, payment, and storage configs
- Feature flags
- **Copy to `.env` and customize**

#### 12. **prisma/schema.prisma**
- Prisma data model (ORM schema)
- 9 models: User, Practitioner, Client, AvailabilitySlot, Booking, Review, PaymentTransaction, RefreshToken, Notification
- TypeScript-first approach
- Relations between tables
- Constraints and validations
- Field mappings to PostgreSQL

#### 13. **package.json**
- Dependencies: React 19, React Router v7, Tailwind CSS
- Dev dependencies: TypeScript, Vite, ESLint
- Prisma and database libraries
- Tailwind CSS browser version

---

## 🚀 Quick Start Guide

### Phase 1: Frontend Setup (COMPLETE ✅)
```bash
cd avenrae
npm install
npm run dev
# Runs on http://localhost:5173
```

**What's working:**
- ✅ React Router navigation
- ✅ Auth page (login/signup with geocoding)
- ✅ Booking page with calendar
- ✅ Practitioner listing pages (Healers, Prophets, Mediums)
- ✅ Header navigation

### Phase 2: Database Setup (IN PROGRESS 🔄)
```bash
# 1. Install PostgreSQL & PostGIS
brew install postgresql@15
# ... follow DATABASE_SETUP.md

# 2. Install dependencies
npm install @prisma/client @prisma/migrate

# 3. Create .env with DATABASE_URL

# 4. Run migrations
npx prisma migrate dev --name init

# 5. View database
npx prisma studio
```

### Phase 3: Backend Implementation (TODO ⏳)
```bash
# Create backend server
npm install express bcrypt jsonwebtoken

# Implement:
# - Authentication endpoints (/api/auth/signup, /login)
# - Practitioner endpoints (/api/practitioners/search)
# - Booking endpoints (/api/bookings)
# - Payment processing (Stripe)
```

---

## 📊 Data Model Overview

```
┌─────────────┐
│    Users    │ (All users: clients & practitioners)
└──────┬──────┘
       │
       ├──────────────────────┬──────────────────────┐
       │                      │                      │
    ┌──▼──────┐    ┌─────────▼────┐    ┌──────────┐ │
    │Clients  │    │Practitioners │    │RefreshTok│ │
    └─────────┘    └─────────┬────┘    │ens       │ │
                             │         └──────────┘ │
                   ┌─────────▼──────────┐          │
                   │AvailabilitySlots   │◄─────────┘
                   └────────────────────┘
                             │
                   ┌─────────▼──────────┐
                   │    Bookings        │
                   └──────────┬─────────┘
                              │
                    ┌─────────┴───────────┐
                    │                     │
          ┌─────────▼────────┐  ┌────────▼──────┐
          │    Reviews       │  │ PaymentTransac.│
          └──────────────────┘  └─────────────────┘
```

---

## 🔄 User Workflows

### 1. Sign Up (Client)
```
Load Auth.tsx
  → Select "Client" role
  → Enter name, email, password, phone
  → Click "Create Account"
  → Store JWT in localStorage
  → Redirect to dashboard
```

### 2. Sign Up (Practitioner)
```
Load Auth.tsx
  → Select "Practitioner" role
  → Enter name, email, password, phone
  → Select specialization (healer, prophet, medium)
  → Write professional bio
  → Search and select address (geocodes to coordinates)
  → Click "Create Account"
  → Backend creates User + Practitioner record
  → Store JWT token
  → Redirect to practitioner dashboard
```

### 3. Book a Session
```
Browse Healers page
  → Click "Book Now" on practitioner card
  → Redirected to /booking
  → Select date in calendar
  → See available time slots
  → Select time slot
  → Fill booking form (name, email, phone, notes)
  → Accept terms & conditions
  → Click "Proceed to Payment"
  → Stripe payment form
  → Payment processed
  → Booking confirmed
  → Email notification sent
```

### 4. Search Practitioners by Location
```
(Future feature)
Enter location/zip code
  → Frontend geocodes to coordinates
  → GET /api/practitioners/search?lat=X&lon=Y&radius=50
  → Backend runs PostGIS query
  → Returns nearby practitioners sorted by distance
  → Display on map with ratings and prices
```

---

## 🛠️ Technology Stack Summary

| Layer | Technology | Version |
|-------|-----------|---------|
| **Frontend** | React | 19.2.0 |
| | React Router | 7.9.5 |
| | Tailwind CSS | 4.x (browser) |
| | TypeScript | ~5.9.3 |
| | Vite | 7.2.2 |
| **Backend** | Node.js | 20+ |
| | Express/Fastify | Latest |
| | Prisma ORM | 5.7+ |
| **Database** | PostgreSQL | 15+ |
| | PostGIS | 3.3+ |
| **Auth** | JWT | jsonwebtoken |
| | Password Hash | bcrypt (12 rounds) |
| **Payment** | Stripe | REST API |
| **Mapping** | Nominatim | OpenStreetMap (free) |

---

## 📋 File Structure

```
avenrae/
├── src/
│   ├── pages/
│   │   ├── Auth.tsx .............. Login/Sign Up page
│   │   ├── Booking.tsx ........... Booking page with calendar
│   │   ├── Home.tsx .............. Landing page
│   │   ├── Healers.tsx ........... Healer listing
│   │   ├── Prophets.tsx .......... Prophet listing
│   │   ├── Mediums.tsx ........... Medium listing
│   │   ├── Events.tsx ............ Events page (Facebook style)
│   │   ├── Store.tsx ............. Marketplace
│   │   ├── Support.tsx ........... Support page
│   │   └── NotFound.tsx .......... 404 page
│   ├── components/
│   │   ├── Header.tsx ............ Navigation bar
│   │   ├── Calendar.tsx .......... Reusable calendar component
│   │   └── SearchFilters.tsx ..... Search/filter component
│   ├── App.tsx ................... Main app with routing
│   ├── main.tsx .................. React entry point
│   ├── index.css ................. Global styles
│   └── assets/ ................... Images (react.svg)
├── prisma/
│   └── schema.prisma ............. Database schema
├── public/
│   └── vite.svg .................. Favicon
├── DATABASE_SETUP.md ............. PostgreSQL setup guide
├── PRISMA_SETUP.md ............... ORM setup guide
├── POSTGRESQL_ARCHITECTURE.md .... System design
├── POSTGRESQL_MIGRATION.md ....... Migration guide
├── AUTH_SYSTEM.md ................ Authentication docs
├── .env.example .................. Environment template
├── package.json .................. Dependencies
├── tsconfig.json ................. TypeScript config
├── vite.config.ts ................ Vite config
└── eslint.config.js .............. Linting rules
```

---

## ✅ Implementation Checklist

### Frontend (DONE ✅)
- [x] React Router setup
- [x] Auth page (login + signup tabs)
- [x] Address geocoding with Nominatim
- [x] Booking page with calendar
- [x] Practitioner listing pages
- [x] Header navigation
- [x] Form validation

### Database (IN PROGRESS 🔄)
- [x] Prisma schema created
- [x] PostgreSQL setup documented
- [x] PostGIS integration planned
- [ ] Database migrations
- [ ] Sample data seeding
- [ ] Backup strategy

### Backend (TODO ⏳)
- [ ] Express.js setup
- [ ] Authentication endpoints
- [ ] Practitioner endpoints
- [ ] Booking endpoints
- [ ] Payment processing (Stripe)
- [ ] Email notifications
- [ ] Admin dashboard

### DevOps (TODO ⏳)
- [ ] Docker setup
- [ ] GitHub Actions CI/CD
- [ ] Production deployment (Render/Railway)
- [ ] Database monitoring
- [ ] Error tracking (Sentry)

---

## 🤝 Contributing

1. Follow the existing code style (Tailwind + React hooks)
2. Update relevant documentation when adding features
3. Test locally before committing
4. Use descriptive commit messages

---

## 📞 Quick Reference

**Local Development**
```bash
npm run dev              # Start frontend (http://localhost:5173)
npx prisma studio       # View database
npm run lint            # Check code quality
npm run build           # Build for production
```

**Database**
```bash
npx prisma migrate dev  # Create & apply migration
npx prisma db seed      # Seed sample data
npm run prisma:reset    # Reset database (DESTRUCTIVE)
```

**Documentation**
- Database: See `DATABASE_SETUP.md` + `PRISMA_SETUP.md`
- Auth: See `AUTH_SYSTEM.md`
- Architecture: See `POSTGRESQL_ARCHITECTURE.md`
- Migration: See `POSTGRESQL_MIGRATION.md`

---

**Last Updated**: November 15, 2025
**Status**: Frontend Complete, Database Ready, Backend Next
**Version**: 1.0.0
