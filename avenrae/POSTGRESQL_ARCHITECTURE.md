# PostgreSQL Database Architecture - Avenrae Platform

## 📋 Overview

Avenrae is switching from SQLite to **PostgreSQL** with **Prisma ORM** for better scalability, multi-user support, geospatial queries, and production readiness.

---

## 🏗️ Architecture Stack

```
┌─────────────────────────────────────────────────────────────┐
│                     Frontend (React 19)                      │
│  Auth.tsx | Booking.tsx | Healers.tsx | etc.               │
└────────────────────┬────────────────────────────────────────┘
                     │ HTTPS/API Calls
┌────────────────────▼────────────────────────────────────────┐
│              Backend (Node.js + Express/Fastify)            │
│  Authentication | Booking Logic | Payment Processing       │
│            Prisma Client (ORM)                              │
└────────────────────┬────────────────────────────────────────┘
                     │ SQL Queries
┌────────────────────▼────────────────────────────────────────┐
│         PostgreSQL 15+ with PostGIS Extension               │
│  Users | Practitioners | Bookings | Payments | Etc.        │
└─────────────────────────────────────────────────────────────┘
```

---

## 💾 Core Tables (11 Tables)

| Table | Purpose | Key Fields |
|-------|---------|-----------|
| **users** | All users (clients & practitioners) | email, passwordHash, firstName, role |
| **practitioners** | Practitioner profiles | userId, specialization, bio, rating, coordinates |
| **clients** | Client profiles (optional) | userId, preferredLocation, preferences |
| **availability_slots** | Practitioner working hours | practitionerId, dayOfWeek, startTime, endTime |
| **bookings** | Session bookings | clientId, practitionerId, sessionDate, totalAmount |
| **reviews** | Client feedback | bookingId, clientId, rating, comment |
| **payment_transactions** | Payment records | bookingId, userId, amount, stripeTransactionId |
| **refresh_tokens** | JWT refresh tokens | userId, tokenHash, expiresAt |
| **notifications** | User alerts | userId, type, title, message |

---

## 🗺️ Geospatial Features

### Location-Based Search
Using **PostGIS**, find practitioners near users:

```sql
-- Find all healers within 50km of client location
SELECT * FROM find_practitioners_near(
  lat := -29.8683,
  lon := 31.0292,
  radius_km := 50,
  spec := 'healer'::specialization_type
);
```

### Distance Calculation
```sql
-- Calculate distance between two coordinates
SELECT distance_km(-29.8683, 31.0292, -29.8700, 31.0300);
-- Returns: 2.145 km
```

---

## 🔐 Security Features

| Feature | Implementation |
|---------|----------------|
| **Password Hashing** | bcrypt (12 rounds) |
| **Authentication** | JWT tokens (24h expiry) |
| **Refresh Tokens** | 7-day rotation |
| **Geospatial Index** | GiST for fast location queries |
| **Rate Limiting** | Configured in backend |
| **CORS** | Frontend domain whitelist |
| **SQL Injection Prevention** | Prisma parameterized queries |

---

## 📊 Data Models

### User (Base)
```
id (UUID) → Primary Key
email → Unique, indexed
role → client | practitioner
passwordHash → bcrypt hashed
firstName, lastName
phone
created_at, updated_at
deleted_at (soft delete)
```

### Practitioner (Extended User)
```
user_id → FK to User
specialization → healer, prophet, medium, counselor
bio → Full description
rating → 0.0 - 5.0
coordinates → latitude, longitude (geospatial indexed)
serviceAddress
ratePerSession
sessionDurationMinutes
isVerified → Admin-verified badge
```

### Booking
```
client_id → FK to User
practitioner_id → FK to Practitioner
sessionDate, sessionStartTime, sessionEndTime
status → pending, confirmed, completed, cancelled
totalAmount, platformFee (15% of service)
paymentStatus → pending, completed, refunded
stripePaymentIntentId → Stripe integration
meetingType → in_person, online
```

---

## 🚀 Setup Checklist

- [ ] Install PostgreSQL 15+
- [ ] Enable PostGIS extension
- [ ] Install Prisma: `npm install @prisma/client -D prisma`
- [ ] Create `.env` with DATABASE_URL
- [ ] Update `prisma/schema.prisma` (already provided)
- [ ] Run: `npx prisma migrate dev --name init`
- [ ] Run: `npm run prisma:seed` (sample data)
- [ ] Verify with: `npx prisma studio`
- [ ] Implement backend API endpoints
- [ ] Connect frontend Auth page to backend
- [ ] Test signup → booking flow

---

## 📁 Documentation Files

### In This Repository
1. **DATABASE_SETUP.md** - PostgreSQL installation & SQL schema
2. **PRISMA_SETUP.md** - Prisma ORM setup & usage examples
3. **AUTH_SYSTEM.md** - Authentication flow & API endpoints
4. **prisma/schema.prisma** - Complete data model
5. **.env.example** - Environment variables template

---

## 🔄 Key Workflows

### 1. User Signup Flow
```
Frontend: User fills Auth.tsx form
  ↓
Frontend: Validates inputs locally
  ↓
Frontend: Geocodes address (Nominatim API)
  ↓
Frontend: POST /api/auth/signup { email, password, role, ... }
  ↓
Backend: Validate email doesn't exist
  ↓
Backend: Hash password (bcrypt)
  ↓
Backend: Prisma creates User record + Practitioner/Client
  ↓
Backend: Generate JWT token (24h)
  ↓
Frontend: Store token in localStorage
  ↓
Frontend: Redirect to dashboard
```

### 2. Booking Flow
```
Frontend: User selects practitioner
  ↓
Frontend: GET /api/practitioners/{id}/availability
  ↓
Backend: Query availabilitySlots from DB
  ↓
Frontend: User selects date/time + fills form
  ↓
Frontend: POST /api/bookings { practitionerId, date, time, ... }
  ↓
Backend: Validate availability slot is free
  ↓
Backend: Create Booking + PaymentTransaction (pending)
  ↓
Backend: Generate Stripe payment intent
  ↓
Frontend: Show payment form
  ↓
Frontend: Process payment (Stripe)
  ↓
Backend: Update booking status → confirmed
  ↓
Backend: Send notifications to practitioner + client
```

### 3. Location-Based Search
```
Frontend: User enters location "Durban, South Africa"
  ↓
Frontend: Geocode to coordinates (-29.8683, 31.0292)
  ↓
Frontend: GET /api/practitioners/search?lat=-29.8683&lon=31.0292&radius=50
  ↓
Backend: Query PostGIS function
  ↓
Backend: Return practitioners sorted by distance
  ↓
Frontend: Display on map with distance labels
```

---

## 💰 Payment Integration

Using **Stripe** for payment processing:

```javascript
// 1. Create Stripe Customer
const customer = await stripe.customers.create({
  email: user.email,
  name: user.firstName + ' ' + user.lastName,
});

// 2. Create Payment Intent
const paymentIntent = await stripe.paymentIntents.create({
  amount: Math.round(totalAmount * 100), // Stripe uses cents
  currency: 'zar',
  customer: customer.id,
  metadata: {
    bookingId: booking.id,
  },
});

// 3. Return clientSecret to frontend for payment
return { clientSecret: paymentIntent.client_secret };

// 4. On successful payment, update booking
await prisma.booking.update({
  where: { id: bookingId },
  data: {
    paymentStatus: 'completed',
    status: 'confirmed',
    stripePaymentIntentId: paymentIntent.id,
  },
});
```

---

## 📈 Scalability Considerations

### Database Indexing
- Email index for login lookups
- Location index (GiST) for nearby searches
- Status/date indexes for booking queries
- Rating index for sorting

### Query Optimization
- Use Prisma `.select()` to fetch only needed fields
- Implement pagination (limit + offset)
- Cache practitioner listings
- Use database views for common queries

### Future Optimizations
- Redis caching layer
- Connection pooling (PgBouncer)
- Read replicas for scaling
- Archive old bookings to separate table
- Implement full-text search (PostgreSQL FTS)

---

## 🔗 Related Files

- Frontend Auth: `src/pages/Auth.tsx`
- Frontend Booking: `src/pages/Booking.tsx`
- Database Schema: `prisma/schema.prisma`
- Environment Config: `.env.example`

---

## 📞 Support

For detailed setup instructions:
1. See **DATABASE_SETUP.md** for PostgreSQL installation
2. See **PRISMA_SETUP.md** for ORM migration examples
3. See **AUTH_SYSTEM.md** for API endpoint documentation

---

## 🎯 Next Phase: Backend Implementation

1. **Create Express.js server** with basic routing
2. **Implement auth endpoints** (/signup, /login, /verify)
3. **Implement practitioner endpoints** (search, details, availability)
4. **Implement booking endpoints** (create, list, cancel)
5. **Integrate Stripe** for payments
6. **Add email notifications**
7. **Deploy to production** (Render, Railway, DigitalOcean)

**Status**: Architecture complete, awaiting backend development
