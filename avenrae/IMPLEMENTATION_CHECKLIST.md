# 🚀 Avenrae - Implementation Checklist & Quick Reference

## Phase 0: MVP Foundation (Weeks 1-4)

### Frontend (React)
- [ ] **SearchFilters Component**
  - Reduce search box width to fit all controls in one line
  - Add debouncing to search input
  - Wire to local state (no backend yet)
  
- [ ] **Component Extraction**
  - Create `PractitionerCard.tsx` (DRY)
  - Create `EventCard.tsx` 
  - Create `ProductCard.tsx`
  
- [ ] **Authentication Pages**
  - Login page (/login)
  - Register page (/register)
  - Profile page (/profile)
  - Password reset flow
  
- [ ] **Booking Flow**
  - Healer detail page with availability
  - Booking form
  - Confirmation page
  - Booking management page

- [ ] **State Management**
  - Setup AuthContext
  - Setup UserContext
  - Add Context providers to App.tsx

### Backend (Node.js + Express)
- [ ] **Project Setup**
  - Initialize Node project
  - Add Express, TypeScript, Prisma
  - Setup environment variables (.env)
  
- [ ] **Database**
  - Setup PostgreSQL (local + Render managed)
  - Create Prisma schema (users, healers, appointments, events, products)
  - Run migrations
  - Seed sample data
  
- [ ] **Authentication**
  - Signup endpoint (POST /api/auth/register)
  - Login endpoint (POST /api/auth/login)
  - JWT token generation & validation
  - Password hashing with bcrypt
  
- [ ] **Core Endpoints**
  - GET /api/healers (list, paginated, filters)
  - GET /api/healers/:id (detail)
  - POST /api/appointments (book appointment)
  - GET /api/appointments (user's bookings)
  
- [ ] **Middleware**
  - Error handling
  - Request validation (Zod)
  - Authentication guard
  - CORS setup

### DevOps
- [ ] **Local Development**
  - Docker compose for database
  - Environment file setup
  
- [ ] **Version Control**
  - Backend repo initialization
  - .gitignore setup
  - Initial commit
  
- [ ] **CI/CD**
  - GitHub Actions workflow
  - Linting on PR
  - Build validation

---

## Critical Path (Must Complete MVP)

```
Priority 1 (Week 1)
├── Setup backend Express server
├── Create PostgreSQL schema
├── Implement auth endpoints

Priority 2 (Week 2)
├── Wire auth to frontend
├── Create GET /api/healers endpoint
├── Create appointment POST endpoint

Priority 3 (Week 3)
├── Build booking UI flow
├── Connect frontend to booking API
├── Add SearchFilters functionality

Priority 4 (Week 4)
├── Error handling & validation
├── Testing
├── Deploy to staging
```

---

## Code Templates (Copy & Paste Ready)

### Backend: Express Server with Prisma

```typescript
// server.ts
import express, { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();
const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

// Health check
app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date() });
});

// Error handling middleware
app.use((err: any, req: Request, res: Response) => {
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
```

### Prisma Schema (users + healers)

```prisma
// prisma/schema.prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

model User {
  id        String   @id @default(cuid())
  email     String   @unique
  password  String
  name      String
  role      String   @default("client")
  avatar    String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  healer        HealerProfile?
  appointments  Appointment[]
  reviews       Review[]
  events        Event[]
  @@index([email])
}

model HealerProfile {
  id              String   @id @default(cuid())
  userId          String   @unique
  user            User     @relation(fields: [userId], references: [id])
  bio             String?
  specialties     String[]
  ratePerHour     Int
  isVerified      Boolean  @default(false)
  yearsExperience Int?
  rating          Float    @default(0)
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt

  appointments Appointment[]
  reviews      Review[]
  @@index([isVerified])
  @@index([rating])
}

model Appointment {
  id        String   @id @default(cuid())
  clientId  String
  client    User     @relation(fields: [clientId], references: [id])
  healerId  String
  healer    HealerProfile @relation(fields: [healerId], references: [id])
  
  scheduledAt DateTime
  duration    Int      // minutes
  status      String   @default("pending") // pending, confirmed, completed, cancelled
  price       Int      // cents
  notes       String?
  createdAt   DateTime @default(now())

  @@index([clientId])
  @@index([healerId])
  @@index([status])
}

model Event {
  id          String   @id @default(cuid())
  organizerId String
  organizer   User     @relation(fields: [organizerId], references: [id])
  
  title       String
  description String?
  dateTime    DateTime
  location    String?
  capacity    Int
  price       Int?     // cents, null = free
  status      String   @default("published")
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@index([organizerId])
  @@index([dateTime])
}

model Review {
  id        String   @id @default(cuid())
  reviewerId String
  reviewer  User     @relation(fields: [reviewerId], references: [id])
  healerId  String
  healer    HealerProfile @relation(fields: [healerId], references: [id])
  
  rating    Int      // 1-5
  comment   String?
  createdAt DateTime @default(now())

  @@index([healerId])
  @@index([rating])
}
```

### Frontend: useAuth Hook

```typescript
// hooks/useAuth.ts
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider');
  }
  return context;
}
```

### Frontend: Axios API Client

```typescript
// services/api.ts
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
});

// Add token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('accessToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
```

---

## Environment Variables Template

```bash
# .env (Backend)
DATABASE_URL=postgresql://user:password@localhost:5432/avenrae_db
JWT_SECRET=your_super_secret_key_change_in_production
STRIPE_SECRET_KEY=sk_test_...
SENDGRID_API_KEY=SG.xxx
NODE_ENV=development
PORT=3000

# .env (Frontend - .env.local)
VITE_API_URL=http://localhost:3000
VITE_STRIPE_PUBLIC_KEY=pk_test_...
```

---

## Database Initialization Commands

```bash
# Create PostgreSQL database
createdb avenrae_db

# Setup Prisma
npm install @prisma/client prisma
npx prisma init

# Create tables from schema
npx prisma migrate dev --name init

# Seed sample data
npx prisma db seed

# View database UI
npx prisma studio
```

---

## Testing Checklist

### Unit Tests
- [ ] Auth service (login, register, token validation)
- [ ] Healer service (filtering, sorting)
- [ ] Appointment validation
- [ ] Price calculations

### Integration Tests
- [ ] Auth flow (register → login → protected route)
- [ ] Healer listing with filters
- [ ] Booking flow (create → confirm → cancel)

### E2E Tests (Playwright)
- [ ] User signup flow
- [ ] Search and book healer
- [ ] Checkout flow

---

## Performance Targets

| Metric | Target | How to Measure |
|--------|--------|----------------|
| Page Load | <3s | Chrome DevTools |
| API Response | <200ms | Network tab |
| Lighthouse | 90+ | lighthouse.dev |
| Bundle Size | <150KB | npm run build |
| Time to Interactive | <5s | Core Web Vitals |

---

## Deployment Checklist

- [ ] GitHub repo created and pushed
- [ ] Environment variables set in Render/DigitalOcean
- [ ] Database migrations applied in production
- [ ] HTTPS enabled
- [ ] Error tracking (Sentry) configured
- [ ] Monitoring alerts set up
- [ ] Backup strategy in place
- [ ] Security headers configured

---

## Useful Commands

```bash
# Frontend
npm run dev                   # Start Vite dev server
npm run build                # Production build
npm run preview              # Preview build locally
npm run lint                 # ESLint

# Backend
npm run dev                  # Start Express with nodemon
npm run build                # TypeScript compilation
npm run start                # Production start

# Database
npx prisma migrate dev       # Create & apply migration
npx prisma db seed          # Run seed script
npx prisma studio           # Open Prisma UI
npx prisma db push          # Sync schema to DB

# Docker
docker compose up            # Start all services
docker compose down          # Stop all services
docker-compose logs -f api  # View logs

# Git
git add .
git commit -m "feat: description"
git push origin main
```

---

## Week-by-Week Timeline

```
WEEK 1: Foundation
├── Backend Express setup
├── PostgreSQL schema
├── Basic auth endpoints
└── Frontend SearchFilters fix

WEEK 2: Integration
├── Frontend login/register
├── /api/healers endpoint
├── Appointment schema
└── Connect to real API

WEEK 3: Booking Flow
├── Booking UI pages
├── API endpoints
├── Error handling
└── Testing

WEEK 4: Polish & Deploy
├── Code review
├── Performance optimization
├── Staging deployment
└── Production-ready
```

---

## Priority Bugs/Tech Debt to Fix

1. **SearchFilters**: Reduce box size, fit all in one line
2. **Extract Components**: PractitionerCard, EventCard, ProductCard
3. **State Management**: Move from inline state to Context
4. **Type Safety**: Add interfaces for all data models
5. **Error Boundaries**: Catch component errors gracefully

---

## Success Criteria for MVP

✅ **Must Have:**
- Users can register & login
- Healers can be browsed and filtered
- Appointments can be booked
- Payments work (Stripe test mode)
- App is responsive on mobile

⭐ **Nice to Have:**
- Reviews & ratings
- Event registration
- Product purchase
- Email notifications
- Favorites/bookmarks

---

## Resources & Documentation

- **Prisma Docs:** https://www.prisma.io/docs/
- **Express Guide:** https://expressjs.com/
- **React Router:** https://reactrouter.com/
- **Stripe Integration:** https://stripe.com/docs/stripe-js
- **Tailwind CSS:** https://tailwindcss.com/docs

---

Generated: 2025-11-14  
Status: ✅ Ready to build
