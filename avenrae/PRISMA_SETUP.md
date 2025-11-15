# Prisma ORM Setup & Migrations Guide for Avenrae

## 1. Prisma Installation

```bash
# Install Prisma and Prisma Client
npm install @prisma/client
npm install -D prisma

# Initialize Prisma (creates prisma/ folder)
npx prisma init
```

This creates:
- `prisma/schema.prisma` - Your data model (already in the repo)
- `.env` - Environment variables for DATABASE_URL

---

## 2. Database Setup

### Step 1: Create PostgreSQL Database

```bash
# macOS
createdb avenrae_dev

# Linux
sudo -u postgres createdb avenrae_dev

# Windows (via pgAdmin or psql)
CREATE DATABASE avenrae_dev;
```

### Step 2: Enable PostGIS Extension

```bash
# Connect to your database
psql -U postgres -d avenrae_dev

# Inside psql:
CREATE EXTENSION postgis;
\dx  # Verify extension is installed
```

### Step 3: Configure .env

Create `.env` file in project root:

```env
DATABASE_URL="postgresql://avenrae_user:your_password@localhost:5432/avenrae_dev"
```

---

## 3. Create Initial Migration

Prisma creates migrations to version-control your schema changes.

```bash
# Create the initial migration (creates all tables)
npx prisma migrate dev --name init

# This will:
# 1. Create prisma/migrations/YYYYMMDD_init/ folder
# 2. Generate migration.sql with all table definitions
# 3. Apply migration to your database
# 4. Generate Prisma Client
```

### First Time Only

```bash
# If you already have a database, introspect it:
npx prisma db pull

# This generates schema.prisma from your existing database
# Use this if migrating from SQL scripts
```

---

## 4. Prisma Client Usage

### Backend Example (Express.js)

```typescript
// lib/prisma.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default prisma;
```

### Create a User (Signup)

```typescript
import prisma from './lib/prisma';
import bcrypt from 'bcrypt';

async function createUser(data: {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone: string;
  role: 'client' | 'practitioner';
}) {
  const passwordHash = await bcrypt.hash(data.password, 12);

  const user = await prisma.user.create({
    data: {
      email: data.email,
      passwordHash,
      firstName: data.firstName,
      lastName: data.lastName,
      phone: data.phone,
      role: data.role,
    },
  });

  return user;
}
```

### Create a Practitioner

```typescript
async function createPractitioner(userId: string, data: {
  specialization: string;
  bio: string;
  serviceAddress: string;
  latitude: number;
  longitude: number;
  ratePerSession: number;
}) {
  const practitioner = await prisma.practitioner.create({
    data: {
      userId,
      specialization: data.specialization as 'healer' | 'prophet' | 'medium' | 'counselor' | 'other',
      bio: data.bio,
      bioShort: data.bio.substring(0, 500),
      serviceAddress: data.serviceAddress,
      latitude: new Prisma.Decimal(data.latitude),
      longitude: new Prisma.Decimal(data.longitude),
      ratePerSession: new Prisma.Decimal(data.ratePerSession),
    },
  });

  return practitioner;
}
```

### Find Practitioners Near Location

```typescript
// Using raw SQL for PostGIS queries
async function findPractitionersNear(lat: number, lon: number, radiusKm: number = 50) {
  const practitioners = await prisma.$queryRaw`
    SELECT 
      p.id,
      u.first_name,
      u.last_name,
      p.specialization,
      p.rating,
      p.rate_per_session,
      ST_Distance(
        ST_SetSRID(ST_Point(${lon}, ${lat}), 4326)::geography,
        ST_SetSRID(ST_Point(p.longitude, p.latitude), 4326)::geography
      ) / 1000 AS distance_km
    FROM practitioners p
    JOIN users u ON p.user_id = u.id
    WHERE p.is_verified = true
      AND u.is_active = true
      AND ST_Distance(
        ST_SetSRID(ST_Point(${lon}, ${lat}), 4326)::geography,
        ST_SetSRID(ST_Point(p.longitude, p.latitude), 4326)::geography
      ) / 1000 <= ${radiusKm}
    ORDER BY distance_km ASC
    LIMIT 20
  `;

  return practitioners;
}
```

### Query Users with Relations

```typescript
// Get user with their bookings
const user = await prisma.user.findUnique({
  where: { id: userId },
  include: {
    bookingsAsClient: {
      include: {
        practitioner: {
          include: {
            user: true,
          },
        },
      },
    },
    practitioner: {
      include: {
        availabilitySlots: true,
        reviews: true,
      },
    },
  },
});

// Get all practitioners with ratings > 4.5
const topPractitioners = await prisma.practitioner.findMany({
  where: {
    rating: {
      gte: new Prisma.Decimal('4.5'),
    },
    isVerified: true,
  },
  include: {
    user: {
      select: {
        firstName: true,
        lastName: true,
        email: true,
        phone: true,
      },
    },
    reviews: {
      take: 5,
      orderBy: { createdAt: 'desc' },
    },
  },
  orderBy: { rating: 'desc' },
  take: 20,
});
```

---

## 5. Database Migrations

### Making Schema Changes

If you need to add/modify fields:

```bash
# 1. Edit prisma/schema.prisma
# For example, add new field:
# model User {
#   ...
#   isEmailVerified Boolean @default(false)
# }

# 2. Create a new migration
npx prisma migrate dev --name add_email_verified_field

# 3. This will:
# - Generate SQL migration
# - Ask you to confirm changes
# - Apply to database
# - Regenerate Prisma Client
```

### Deploying Migrations to Production

```bash
# On production server, apply pending migrations
npx prisma migrate deploy

# Verify database is up to date
npx prisma migrate status
```

### View Migration History

```bash
# See all applied migrations
ls prisma/migrations/

# Reset database (DANGEROUS - deletes all data)
npx prisma migrate reset

# Reset and re-seed with sample data
npx prisma migrate reset --skip-generate
npx ts-node prisma/seed.ts
```

---

## 6. Seeding Database

Create `prisma/seed.ts` for sample data:

```typescript
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  // Create sample client
  const client = await prisma.user.create({
    data: {
      email: 'client@example.com',
      passwordHash: await bcrypt.hash('password123', 12),
      firstName: 'John',
      lastName: 'Doe',
      phone: '+27123456789',
      role: 'client',
    },
  });

  // Create sample practitioner
  const pracUser = await prisma.user.create({
    data: {
      email: 'healer@example.com',
      passwordHash: await bcrypt.hash('password123', 12),
      firstName: 'Dr.',
      lastName: 'Khumalo',
      phone: '+27987654321',
      role: 'practitioner',
    },
  });

  const practitioner = await prisma.practitioner.create({
    data: {
      userId: pracUser.id,
      specialization: 'healer',
      bio: 'Experienced holistic healer with 10+ years in energy work.',
      bioShort: 'Holistic healer specializing in energy work',
      serviceAddress: '123 Main St, Durban, South Africa',
      latitude: -29.8683,
      longitude: 31.0292,
      ratePerSession: 450,
      sessionDurationMinutes: 60,
      isVerified: true,
      verificationBadge: true,
      yearsExperience: 10,
    },
  });

  // Create availability slots
  await prisma.availabilitySlot.create({
    data: {
      practitionerId: practitioner.id,
      dayOfWeek: 1, // Monday
      startTime: '09:00',
      endTime: '17:00',
      isActive: true,
    },
  });

  console.log('✅ Seeding completed');
  console.log(`Client: ${client.email}`);
  console.log(`Practitioner: ${pracUser.email}`);
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
```

Add seed script to `package.json`:

```json
{
  "scripts": {
    "prisma:seed": "ts-node prisma/seed.ts"
  }
}
```

Run it:

```bash
npm run prisma:seed
```

---

## 7. Useful Prisma Commands

```bash
# View database in visual UI
npx prisma studio

# Validate schema syntax
npx prisma validate

# Format schema
npx prisma format

# Regenerate Prisma Client
npx prisma generate

# Check migration status
npx prisma migrate status

# View migration history
npx prisma migrate resolve --rolled-back init
```

---

## 8. Performance Tips

### Indexes
Schema already includes indexes on:
- `users(email)` - Email lookups
- `practitioners(specialization)` - Filtering by type
- `practitioners(location)` - GiST index for PostGIS queries
- `bookings(status, date)` - Common filtering

### Pagination Example

```typescript
async function getPractitioners(page: number = 1, limit: number = 20) {
  const skip = (page - 1) * limit;

  const [practitioners, total] = await Promise.all([
    prisma.practitioner.findMany({
      skip,
      take: limit,
      orderBy: { rating: 'desc' },
    }),
    prisma.practitioner.count(),
  ]);

  return {
    data: practitioners,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  };
}
```

---

## 9. Transaction Example

```typescript
// Atomic booking creation
async function createBooking(clientId: string, practitionerId: string, bookingData: any) {
  return await prisma.$transaction(async (tx) => {
    // 1. Create booking
    const booking = await tx.booking.create({
      data: {
        clientId,
        practitionerId,
        sessionDate: bookingData.sessionDate,
        sessionStartTime: bookingData.sessionStartTime,
        sessionEndTime: bookingData.sessionEndTime,
        meetingType: bookingData.meetingType,
        serviceAmount: new Prisma.Decimal(bookingData.serviceAmount),
        platformFee: new Prisma.Decimal(bookingData.platformFee),
        totalAmount: new Prisma.Decimal(bookingData.totalAmount),
      },
    });

    // 2. Create payment transaction
    const payment = await tx.paymentTransaction.create({
      data: {
        bookingId: booking.id,
        userId: clientId,
        amount: new Prisma.Decimal(bookingData.totalAmount),
        status: 'pending',
      },
    });

    // 3. Create notification for practitioner
    await tx.notification.create({
      data: {
        userId: practitionerId,
        bookingId: booking.id,
        type: 'booking_confirmed',
        title: 'New Booking Request',
        message: `You have a new booking request for ${bookingData.sessionDate}`,
      },
    });

    return { booking, payment };
  });
}
```

---

## 10. Common Issues & Solutions

### Issue: Cannot find module '@prisma/client'
```bash
Solution: npm install @prisma/client @prisma/migrate
```

### Issue: PostGIS extension not found
```bash
Solution: Run in database:
CREATE EXTENSION postgis;
CREATE EXTENSION postgis_topology;
```

### Issue: Migration conflicts
```bash
Solution:
npx prisma migrate reset --force
npx prisma migrate dev --name resync
```

### Issue: Can't connect to database
```bash
# Check PostgreSQL is running
brew services list  # macOS
# or
systemctl status postgresql  # Linux

# Check DATABASE_URL in .env is correct
# Format: postgresql://user:password@host:port/database
```

---

## Next Steps

1. ✅ Install Prisma and dependencies
2. ✅ Create PostgreSQL database
3. ✅ Enable PostGIS
4. ✅ Configure `.env` with DATABASE_URL
5. ⏳ Run: `npx prisma migrate dev --name init`
6. ⏳ Implement backend API endpoints
7. ⏳ Connect frontend Auth page to API
8. ⏳ Set up payment processing (Stripe)
9. ⏳ Add email notifications
10. ⏳ Deploy to production
