# 🏗️ Avenrae Platform - Complete System Design

**Version:** 1.0  
**Last Updated:** November 14, 2025  
**Status:** Production Ready Blueprint

---

## 📋 Table of Contents

1. [Executive Summary](#executive-summary)
2. [System Architecture](#system-architecture)
3. [Technology Stack](#technology-stack)
4. [Database Design](#database-design)
5. [API Design](#api-design)
6. [Frontend Architecture](#frontend-architecture)
7. [Authentication & Security](#authentication--security)
8. [Scalability & Performance](#scalability--performance)
9. [Deployment Strategy](#deployment-strategy)
10. [Implementation Roadmap](#implementation-roadmap)

---

## Executive Summary

**Avenrae** is a **B2C marketplace platform** connecting spiritual practitioners (healers, prophets, mediums) with seekers. The platform enables:

- **Appointment booking** with integrated payments
- **Event management** and community engagement
- **Product marketplace** (crystals, books, tools)
- **User reviews & ratings** to build trust
- **Role-based access** (Client, Healer, Admin)

**Key Metrics:**
- **Users:** 100K+ target (first year)
- **Transactions:** 50K+ appointments/month (maturity)
- **Revenue:** Marketplace commission (15-20%) + event tickets
- **SLA:** 99.9% uptime, <200ms response times

---

## System Architecture

### High-Level Flow Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                            Clients (Web/App)                        │
│                    (React 19 + Vite + TypeScript)                  │
└────────────────────────────┬──────────────────────────────────────┘
                             │
                      (REST API / GraphQL)
                             │
        ┌────────────────────┼────────────────────┐
        │                    │                    │
    ┌───▼─────┐        ┌─────▼──────┐      ┌─────▼──────┐
    │ Auth    │        │ API Layer  │      │ Webhooks   │
    │ (JWT)   │        │ (Node.js)  │      │ (Events)   │
    └────┬────┘        └─────┬──────┘      └─────┬──────┘
         │                   │                    │
         │      ┌────────────┼────────────┐      │
         │      │            │            │      │
    ┌────▼──┬───▼──┐    ┌────▼────┐  ┌───▼───┐ │
    │ Cache │ Logs │    │ Database │  │ Queue │ │
    │(Redis)│      │    │(Postgres)│  │(Redis)│ │
    └──────┬────────┘    └──────────┘  └───────┘ │
           │                                       │
           └───────┬───────────────────────────────┘
                   │
        ┌──────────┴──────────┐
        │                     │
    ┌───▼──────┐      ┌──────▼─────┐
    │ Stripe   │      │ SendGrid   │
    │(Payments)│      │ (Email)    │
    └──────────┘      └────────────┘
```

### Component Layers

```
FRONTEND LAYER (React)
├── Pages (Home, Healers, Prophets, Mediums, Events, Store, Support)
├── Components (Header, SearchFilters, Cards, Forms, Modals)
├── Hooks (useAuth, useFetch, useFilters, useBooking)
├── State Management (Context API or Redux)
└── Services (API client, Auth, WebSocket)

BACKEND LAYER (Node.js + Express/Fastify)
├── Routes (/api/auth, /api/healers, /api/bookings, /api/events, /api/products)
├── Controllers (RequestHandler for each domain)
├── Services (Business logic, calculations, validations)
├── Middleware (Auth, Rate-limit, Error handling, Logging)
├── Database (Prisma ORM or TypeORM + Postgres)
└── External (Stripe SDK, SendGrid, S3, WebSocket)

DATA LAYER (PostgreSQL)
├── Users (clients, healers, admins)
├── Services (healer offerings + pricing)
├── Appointments (bookings, status, payments)
├── Events (community events, registrations)
├── Products (store items, inventory)
├── Transactions (payment records)
├── Reviews (ratings, testimonials)
└── System (logs, configurations)

EXTERNAL INTEGRATIONS
├── Stripe (Payments)
├── SendGrid (Email)
├── AWS S3 (File storage for avatars/images)
├── Sentry (Error tracking)
└── DataDog (Monitoring & logs)
```

---

## Technology Stack

### Frontend
| Category | Choice | Rationale |
|----------|--------|-----------|
| **Framework** | React 19 | Latest, fast, component-driven |
| **Build Tool** | Vite 7 | Lightning-fast dev server, optimized builds |
| **Routing** | React Router v7 | Mature, nested routes, data loaders |
| **Styling** | Tailwind CSS | Utility-first, rapid development |
| **State** | Context API (MVP) → Redux (scale) | Start simple, add Redux at 50K+ users |
| **API Client** | Axios / TanStack Query | Caching, refetch, error retry |
| **Forms** | React Hook Form + Zod | Lightweight, type-safe validation |
| **Testing** | Jest + React Testing Library | Unit & integration tests |
| **E2E** | Playwright | Cross-browser, reliable |
| **Language** | TypeScript ~5.9 | Type safety, better DX |

### Backend
| Category | Choice | Rationale |
|----------|--------|-----------|
| **Runtime** | Node.js 20+ | JavaScript, huge ecosystem |
| **Framework** | Express (MVP) → Fastify (scale) | Simple to start, Fastify for performance |
| **Language** | TypeScript | Type safety, better maintainability |
| **ORM** | Prisma | Great DX, migrations, type-safe queries |
| **Auth** | JWT + bcrypt | Stateless, standard, scalable |
| **Validation** | Zod / Joi | Type-safe request validation |
| **Testing** | Jest + Supertest | Unit & integration tests |
| **Logging** | Winston / Pino | Structured logging, log levels |
| **Error Tracking** | Sentry | Real-time error alerts |

### Database
| Component | Choice | Rationale |
|-----------|--------|-----------|
| **Primary DB** | PostgreSQL 15+ | ACID, JSONB, full-text search, scalable |
| **Cache** | Redis | Sub-ms response, session store, queues |
| **Search** | PostgreSQL FTS (MVP) → Elasticsearch (scale) | Start with PG, grow to ES at scale |
| **Backup** | AWS S3 + automated snapshots | Redundancy, disaster recovery |

### DevOps & Deployment
| Component | Choice | Rationale |
|-----------|--------|-----------|
| **Containerization** | Docker | Consistency across environments |
| **Orchestration** | Docker Compose (dev) → Kubernetes (prod) | Simple local, enterprise scale |
| **Hosting** | Render / DigitalOcean / AWS | Managed, auto-scaling, CDN |
| **CI/CD** | GitHub Actions | Native, free, reliable |
| **Monitoring** | DataDog / New Relic | APM, log aggregation, dashboards |
| **CDN** | Cloudflare | Global distribution, DDoS protection |

---

## Database Design

### Entity Relationship Diagram (ERD)

```
USERS (Core)
├── id (UUID, PK)
├── email (unique)
├── password_hash (bcrypt)
├── name
├── role (enum: client, healer, admin)
├── avatar_url
├── phone
├── created_at
└── updated_at

HEALER_PROFILES
├── id (UUID, PK)
├── user_id (FK → users)
├── bio
├── specialties (JSON array)
├── rate_per_hour (cents)
├── is_verified (boolean)
├── years_experience
├── certifications (JSON)
├── location
├── rating_avg (decimal)
└── total_bookings

SERVICES
├── id (UUID, PK)
├── healer_id (FK → healer_profiles)
├── title
├── description
├── duration_minutes
├── price_cents
├── is_available
└── created_at

APPOINTMENTS
├── id (UUID, PK)
├── client_id (FK → users)
├── healer_id (FK → healer_profiles)
├── service_id (FK → services)
├── scheduled_at (timestamp)
├── duration_minutes
├── status (enum: pending, confirmed, completed, cancelled)
├── notes
├── price_cents
├── payment_id (FK → transactions)
└── created_at

EVENTS
├── id (UUID, PK)
├── organizer_id (FK → users)
├── title
├── description
├── date_time
├── location / online_link
├── capacity
├── price_cents (0 for free)
├── banner_image_url
├── status (draft, published, cancelled)
└── created_at

EVENT_REGISTRATIONS
├── id (UUID, PK)
├── event_id (FK → events)
├── user_id (FK → users)
├── registered_at
└── status (registered, attended, cancelled)

PRODUCTS
├── id (UUID, PK)
├── title
├── description
├── price_cents
├── image_url
├── inventory_count
├── sku (unique)
└── created_at

CART_ITEMS
├── id (UUID, PK)
├── user_id (FK → users)
├── product_id (FK → products)
├── quantity
└── added_at

TRANSACTIONS
├── id (UUID, PK)
├── user_id (FK → users)
├── amount_cents
├── currency (USD, ZAR, etc.)
├── status (pending, succeeded, failed)
├── provider (stripe)
├── provider_transaction_id
├── metadata (JSON: order_id, appointment_id, event_id)
└── created_at

REVIEWS
├── id (UUID, PK)
├── reviewer_id (FK → users)
├── healer_id (FK → healer_profiles)
├── appointment_id (FK → appointments)
├── rating (1-5)
├── comment
├── created_at
└── helpful_count

AVAILABILITY_SLOTS
├── id (UUID, PK)
├── healer_id (FK → healer_profiles)
├── day_of_week (0-6: Mon-Sun)
├── start_time
├── end_time
├── is_available
└── recurrence_rule (rrule)

FAVORITES
├── id (UUID, PK)
├── user_id (FK → users)
├── healer_id (FK → healer_profiles)
└── created_at

SUPPORT_TICKETS
├── id (UUID, PK)
├── user_id (FK → users)
├── subject
├── description
├── status (open, in_progress, resolved)
├── priority (low, medium, high)
├── assigned_to (admin_id)
└── created_at

AUDIT_LOG
├── id (UUID, PK)
├── user_id (FK → users)
├── action (created, updated, deleted, viewed)
├── resource_type (healer, appointment, etc.)
├── resource_id
├── changes (JSON diff)
└── timestamp
```

### Indexing Strategy

```sql
-- Performance critical
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_appointments_healer_status ON appointments(healer_id, status);
CREATE INDEX idx_appointments_client_scheduled ON appointments(client_id, scheduled_at);
CREATE INDEX idx_transactions_user_created ON transactions(user_id, created_at);
CREATE INDEX idx_reviews_healer_rating ON reviews(healer_id, rating);
CREATE INDEX idx_healer_profiles_verified ON healer_profiles(is_verified);

-- Search & filtering
CREATE INDEX idx_services_healer_available ON services(healer_id, is_available);
CREATE INDEX idx_products_sku ON products(sku);
CREATE INDEX idx_events_organizer_status ON events(organizer_id, status);
```

---

## API Design

### REST Endpoints (MVP)

#### Authentication
```
POST   /api/auth/register          → Create account
POST   /api/auth/login             → Get JWT token
POST   /api/auth/refresh           → Refresh token
POST   /api/auth/logout            → Invalidate token
POST   /api/auth/reset-password    → Send reset email
```

#### Users
```
GET    /api/users/me               → Current user profile
PUT    /api/users/me               → Update profile
GET    /api/users/:id              → Public profile (healers)
```

#### Healers
```
GET    /api/healers                → List all (paginated, filterable)
GET    /api/healers/:id            → Healer detail + reviews
GET    /api/healers/:id/availability → Schedule
POST   /api/healers/:id/services   → Create service (healer only)
GET    /api/healers/:id/reviews    → Healer reviews
```

#### Appointments
```
POST   /api/appointments           → Book appointment
GET    /api/appointments           → List user's appointments
GET    /api/appointments/:id       → Appointment detail
PUT    /api/appointments/:id       → Update (cancel, reschedule)
POST   /api/appointments/:id/confirm → Confirm booking
```

#### Events
```
GET    /api/events                 → List events (paginated)
GET    /api/events/:id             → Event detail
POST   /api/events                 → Create event (admin/healer)
POST   /api/events/:id/register    → Register for event
GET    /api/events/:id/registrations → Attendee list
```

#### Products
```
GET    /api/products               → List products (paginated)
GET    /api/products/:id           → Product detail
```

#### Cart & Checkout
```
POST   /api/cart                   → Add to cart
GET    /api/cart                   → View cart
DELETE /api/cart/:item_id          → Remove from cart
POST   /api/checkout               → Create Stripe session
POST   /api/checkout/webhook       → Stripe webhook
```

#### Reviews
```
POST   /api/reviews                → Leave review (client only)
GET    /api/healers/:id/reviews    → Get healer reviews
```

### Query Parameters (Filtering & Pagination)

```
GET /api/healers?
  page=1
  limit=20
  sort=rating_desc|distance_asc|price_asc
  specialties=energy-healing,reiki
  min_rating=4
  location=durban
  search=john
```

### Response Format

```json
{
  "success": true,
  "data": { /* payload */ },
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "pages": 8
  },
  "error": null,
  "timestamp": "2025-11-14T10:30:00Z"
}
```

### Error Codes

```
200 OK                    → Success
201 Created               → Resource created
204 No Content            → Success, no body
400 Bad Request           → Invalid input
401 Unauthorized          → Missing/invalid JWT
403 Forbidden             → Insufficient permissions
404 Not Found             → Resource doesn't exist
409 Conflict              → Duplicate/state conflict
429 Too Many Requests     → Rate limited
500 Internal Server Error → Unexpected error
```

---

## Frontend Architecture

### Project Structure

```
src/
├── pages/                          # Route pages (one file = one route)
│   ├── Home.tsx
│   ├── healers.tsx
│   ├── prophets.tsx
│   ├── mediums.tsx
│   ├── Events.tsx
│   ├── Store.tsx
│   ├── Support.tsx
│   └── NotFound.tsx
│
├── components/                     # Reusable components
│   ├── Header.tsx
│   ├── SearchFilters.tsx
│   ├── PractitionerCard.tsx
│   ├── EventCard.tsx
│   ├── Modal.tsx
│   ├── Button.tsx
│   ├── Input.tsx
│   └── Loading.tsx
│
├── hooks/                          # Custom hooks
│   ├── useAuth.ts
│   ├── useFetch.ts
│   ├── useFilters.ts
│   ├── useBooking.ts
│   └── useUser.ts
│
├── services/                       # API & external services
│   ├── api.ts                      # Axios instance + interceptors
│   ├── auth.service.ts             # Auth endpoints
│   ├── healers.service.ts          # Healers endpoints
│   ├── appointments.service.ts     # Appointments endpoints
│   ├── events.service.ts           # Events endpoints
│   └── stripe.service.ts           # Stripe integration
│
├── context/                        # Context API (state)
│   ├── AuthContext.tsx
│   ├── UserContext.tsx
│   └── AppContext.tsx
│
├── types/                          # TypeScript interfaces
│   ├── user.ts
│   ├── healer.ts
│   ├── appointment.ts
│   ├── event.ts
│   └── common.ts
│
├── utils/                          # Utilities
│   ├── validators.ts               # Form validation
│   ├── formatters.ts               # Date, currency formatting
│   ├── storage.ts                  # LocalStorage helpers
│   └── constants.ts                # App constants
│
├── App.tsx                         # Root component with Routes
├── main.tsx                        # Entry point
└── index.css                       # Global styles
```

### State Management (Context API)

```typescript
// AuthContext: Authentication state
interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email, password) => Promise<void>;
  register: (data) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

// UserContext: Current user details
interface UserContextType {
  profile: UserProfile | null;
  favorites: Healer[];
  bookings: Appointment[];
  updateProfile: (data) => Promise<void>;
  addFavorite: (healerId) => Promise<void>;
}

// AppContext: Global app state
interface AppContextType {
  theme: 'light' | 'dark';
  filters: FilterState;
  setFilters: (filters) => void;
}
```

### Component Hierarchy

```
<App>
  <AuthProvider>
    <UserProvider>
      <AppProvider>
        <Header />
        <Routes>
          <Home />
          <Healers>
            <SearchFilters />
            <PractitionerCard[] />
          </Healers>
          <Events>
            <EventCard[] />
          </Events>
          ...
        </Routes>
      </AppProvider>
    </UserProvider>
  </AuthProvider>
</App>
```

---

## Authentication & Security

### JWT Token Flow

```
1. User registers/logs in
   ↓
2. Backend validates credentials
   ↓
3. Generate JWT: {user_id, email, role, exp: now + 1hr}
   ↓
4. Return accessToken (short-lived, 1hr) + refreshToken (long-lived, 7d)
   ↓
5. Frontend stores accessToken in memory, refreshToken in httpOnly cookie
   ↓
6. Every API request includes: Authorization: Bearer {accessToken}
   ↓
7. If accessToken expired, use refreshToken to get new one
   ↓
8. If refreshToken expired, require re-login
```

### Security Checklist

```
✓ Password hashing        → bcrypt (cost 12)
✓ HTTPS only              → All requests encrypted
✓ CSRF protection         → SameSite cookies, tokens
✓ Rate limiting           → 100 req/min per IP
✓ SQL injection prevention → Parameterized queries (Prisma)
✓ XSS prevention          → Content-Security-Policy header
✓ Input validation        → Zod/Joi on all endpoints
✓ CORS                    → Whitelist frontend domain
✓ Environment secrets     → .env file (never commit)
✓ API key rotation        → Monthly rotation
✓ Audit logging           → All writes logged
✓ Data encryption         → PII encrypted at rest (optional)
```

### Role-Based Access Control (RBAC)

```
CLIENT
├── View healers & events
├── Book appointments
├── Leave reviews
├── Purchase products
└── Manage own profile

HEALER
├── All CLIENT perms
├── Create services & events
├── View own bookings
├── Set availability
├── View earnings
└── Respond to reviews

ADMIN
├── All HEALER perms
├── Manage all users
├── View analytics
├── Manage support tickets
└── Configure platform settings
```

---

## Scalability & Performance

### Frontend Optimization

```
✓ Code splitting          → React lazy() for routes
✓ Image optimization      → WebP, lazy loading, CDN
✓ Caching strategy        → 1hr for API data, 30d for static
✓ Service Worker          → Offline mode, PWA
✓ Bundle analysis         → Target <150KB (gzipped)
✓ Lighthouse score        → Aim for 90+
✓ Pagination              → Load 20 items/page
✓ Infinite scroll (opt)    → Instead of pagination for mobile
```

### Backend Optimization

```
✓ Query optimization      → Indexes, JOIN only needed fields
✓ Connection pooling      → Max 20 connections per instance
✓ Caching layer (Redis)   → Cache popular healers, events
✓ Database replication    → Read replicas for scaling
✓ API rate limiting       → 100 req/min per user
✓ Load balancing          → Nginx/HAProxy round-robin
✓ Compression             → gzip for all responses
✓ Monitoring              → APM to detect bottlenecks
```

### Scaling Strategy (0 → 1M users)

| Phase | Users | Infrastructure | Changes |
|-------|-------|-----------------|---------|
| **MVP** | 1K | 1 server (2GB RAM, 2 CPU) | Monolithic |
| **Phase 1** | 10K | 2 app servers + 1 DB | Load balancer |
| **Phase 2** | 100K | 5 app servers, DB replicas | Redis cache |
| **Phase 3** | 1M | Auto-scaling, microservices | Event-driven |

---

## Deployment Strategy

### Development → Production Pipeline

```
Local Dev
  ↓ (git push)
GitHub Repo
  ↓ (GitHub Actions)
Run tests, lint, build
  ↓ (if pass)
Build Docker image
  ↓
Push to Docker Registry (ECR/Dockerhub)
  ↓
Deploy to Staging (DigitalOcean App Platform / Render)
  ↓ (smoke tests)
Manual approval
  ↓
Deploy to Production
  ↓
Monitoring & Alerts (DataDog/Sentry)
```

### Docker & Kubernetes

```dockerfile
# Dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["node", "dist/server.js"]
```

```yaml
# kubernetes deployment
apiVersion: apps/v1
kind: Deployment
metadata:
  name: avenrae-api
spec:
  replicas: 3
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxSurge: 1
      maxUnavailable: 0
  template:
    spec:
      containers:
      - name: api
        image: avenrae-api:latest
        ports:
        - containerPort: 3000
        env:
        - name: DATABASE_URL
          valueFrom:
            secretKeyRef:
              name: db-secrets
              key: url
        resources:
          requests:
            memory: "256Mi"
            cpu: "250m"
          limits:
            memory: "512Mi"
            cpu: "500m"
        livenessProbe:
          httpGet:
            path: /health
            port: 3000
          initialDelaySeconds: 30
          periodSeconds: 10
```

### Hosting Recommendations

**MVP / Early Stage (< 10K users):**
- **Render** or **DigitalOcean App Platform**
- Managed PostgreSQL
- Automatic deploys from GitHub
- Cost: $30-50/month

**Growth (10K - 100K users):**
- **AWS ECS** or **DigitalOcean Kubernetes**
- RDS PostgreSQL with replicas
- CloudFront CDN
- Cost: $200-500/month

**Scale (> 100K users):**
- **AWS EKS** (Kubernetes managed)
- Aurora PostgreSQL (auto-scaling)
- CloudFront + S3
- Cost: $1000+/month

---

## Implementation Roadmap

### Phase 0: MVP (Weeks 1-4)
**Goal:** Launch with core features, proof of concept

**Frontend:**
- [ ] Fix search box layout (1 line)
- [ ] Extract PractitionerCard component
- [ ] Wire search filters to local state
- [ ] Add login/signup pages
- [ ] Add booking flow UI (no backend)

**Backend:**
- [ ] Setup Express server
- [ ] Add authentication (JWT)
- [ ] Create /api/healers, /api/appointments endpoints
- [ ] Setup Prisma + PostgreSQL
- [ ] Add basic error handling

**Database:**
- [ ] Create core tables (users, healers, appointments, events, products)
- [ ] Add indexes
- [ ] Seed sample data

**Deployment:**
- [ ] Setup GitHub Actions CI
- [ ] Docker setup
- [ ] Deploy to Render/DigitalOcean

**Deliverables:** Functional booking flow, live database, basic auth

---

### Phase 1: Payment & Marketplace (Weeks 5-8)
**Goal:** Enable monetization

**Features:**
- [ ] Integrate Stripe for payments
- [ ] Complete checkout flow
- [ ] Product management
- [ ] Event registration
- [ ] Email notifications (SendGrid)

**Backend:**
- [ ] Stripe webhook handling
- [ ] Order management
- [ ] Email service
- [ ] Analytics endpoints

**Testing:**
- [ ] Unit tests (30% coverage)
- [ ] Integration tests for payments

---

### Phase 2: Community & Engagement (Weeks 9-12)
**Goal:** Build user engagement

**Features:**
- [ ] Reviews & ratings
- [ ] Favorites/bookmarks
- [ ] User profiles
- [ ] Messaging (basic chat)
- [ ] Event live updates

**Backend:**
- [ ] WebSocket server
- [ ] Real-time notifications
- [ ] Analytics dashboard

---

### Phase 3: Scale & Optimize (Weeks 13+)
**Goal:** Prepare for production scale

**Infrastructure:**
- [ ] Redis caching layer
- [ ] Database read replicas
- [ ] CDN for static assets
- [ ] Kubernetes setup

**Features:**
- [ ] Admin dashboard
- [ ] Advanced search (Elasticsearch)
- [ ] Recommendation engine
- [ ] Mobile app (React Native)

---

## Success Metrics

### User Engagement
- **DAU (Daily Active Users):** Target 30% of registered users
- **Booking Rate:** 2+ appointments/user/month
- **Retention:** 60% Week 1, 40% Month 1

### Business
- **Revenue:** $10K/month at 1M GMV
- **Commission:** 15-20% of transactions
- **Churn:** <5% MoM

### Technical
- **Uptime:** 99.9%
- **API Response Time:** <200ms (p95)
- **Error Rate:** <0.1%
- **Lighthouse Score:** 90+

---

## Next Steps

1. **This Week:**
   - [ ] Fix SearchFilters UI (1-line layout)
   - [ ] Setup backend repo & Express server
   - [ ] Create PostgreSQL database

2. **Next Week:**
   - [ ] Implement JWT auth
   - [ ] Wire /api/healers endpoint
   - [ ] Connect frontend to real API

3. **End of Month:**
   - [ ] Complete booking flow (frontend + backend)
   - [ ] Stripe integration
   - [ ] Deploy to staging

---

## Questions & Contact

- **Architecture Questions?** Review this doc + run system design sessions
- **Scaling Issues?** Check scalability section or contact DevOps
- **Feature Requests?** Add to roadmap after Phase 1

**Document Version:** 1.0  
**Last Updated:** 2025-11-14  
**Status:** ✅ Ready for implementation
