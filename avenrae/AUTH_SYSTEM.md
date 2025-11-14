# Avenrae Authentication & Database Schema

## Overview
This document outlines the authentication system, user roles, database schema, and API endpoints for the Avenrae platform.

## Technology Stack

### Frontend
- **React 19** - UI components with hooks
- **React Router v7** - Client-side routing
- **Tailwind CSS** - Styling
- **Nominatim (OpenStreetMap)** - Address geocoding (free, no API key required)

### Backend (Recommended)
- **Node.js 20+** with **Express.js** or **Fastify**
- **Prisma ORM** - Database management
- **JWT (jsonwebtoken)** - Token-based authentication
- **bcrypt** - Password hashing
- **Axios/Fetch** - HTTP client for geocoding

### Database
- **PostgreSQL** - Primary database
- **PostGIS** - Geospatial queries (find practitioners near users)

---

## Authentication Flow

### Client-Side (Frontend)
1. User navigates to `/auth`
2. Chooses between **Login** or **Sign Up**
3. If signup:
   - Selects role: **Client** or **Practitioner**
   - Enters credentials
   - If practitioner: enters address, system geocodes location
4. Form validation before submission
5. API call to `/api/auth/signup` or `/api/auth/login`
6. Backend returns **JWT token** + user data
7. Token stored in `localStorage` or `sessionStorage`
8. User redirected to dashboard

### Server-Side (Backend)
1. Validate input (email, password strength, etc.)
2. Check if user exists (prevent duplicates)
3. Hash password using `bcrypt` (12 rounds)
4. For practitioners: validate address with geocoding
5. Create user record in database
6. Generate JWT token (24h expiry)
7. Return token + user profile

---

## Database Schema

### Users Table
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  first_name VARCHAR(255) NOT NULL,
  last_name VARCHAR(255) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  role ENUM('client', 'practitioner') NOT NULL,
  avatar_url VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  deleted_at TIMESTAMP
);
```

### Practitioners Table
```sql
CREATE TABLE practitioners (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  specialization VARCHAR(100) NOT NULL, -- 'healer', 'prophet', 'medium', 'counselor'
  bio TEXT NOT NULL,
  bio_short VARCHAR(500), -- Short bio for cards
  rating DECIMAL(3,2) DEFAULT 0.0,
  review_count INT DEFAULT 0,
  service_address TEXT NOT NULL,
  latitude DECIMAL(10, 8) NOT NULL,
  longitude DECIMAL(11, 8) NOT NULL,
  service_radius_km INT DEFAULT 50, -- How far they travel
  rate_per_session DECIMAL(10, 2) NOT NULL, -- e.g., 450.00 ZAR
  session_duration_minutes INT DEFAULT 60,
  availability_type ENUM('in_person', 'online', 'both') DEFAULT 'both',
  is_verified BOOLEAN DEFAULT FALSE,
  verification_badge BOOLEAN DEFAULT FALSE, -- Admin verified
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  CONSTRAINT valid_coordinates CHECK (latitude >= -90 AND latitude <= 90 AND longitude >= -180 AND longitude <= 180)
};

-- Geospatial index for location queries
CREATE INDEX idx_practitioners_location ON practitioners USING GIST(
  ST_Point(longitude, latitude)::geography
);
```

### Clients Table (Optional - extends Users)
```sql
CREATE TABLE clients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  preferred_location VARCHAR(255),
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  bio VARCHAR(500), -- Optional bio
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
};
```

### Bookings Table
```sql
CREATE TABLE bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL REFERENCES users(id),
  practitioner_id UUID NOT NULL REFERENCES practitioners(id),
  session_date DATE NOT NULL,
  session_start_time TIME NOT NULL,
  session_end_time TIME NOT NULL,
  status ENUM('pending', 'confirmed', 'completed', 'cancelled') DEFAULT 'pending',
  notes TEXT,
  total_amount DECIMAL(10, 2) NOT NULL,
  platform_fee DECIMAL(10, 2) NOT NULL, -- 15% of service
  payment_status ENUM('pending', 'completed', 'refunded') DEFAULT 'pending',
  payment_method VARCHAR(50), -- 'card', 'paypal', 'bank_transfer'
  meeting_type ENUM('in_person', 'online') NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
};
```

### Reviews Table
```sql
CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID UNIQUE NOT NULL REFERENCES bookings(id),
  client_id UUID NOT NULL REFERENCES users(id),
  practitioner_id UUID NOT NULL REFERENCES practitioners(id),
  rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  CONSTRAINT one_review_per_booking UNIQUE(booking_id)
};
```

### Availability Slots Table
```sql
CREATE TABLE availability_slots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  practitioner_id UUID NOT NULL REFERENCES practitioners(id) ON DELETE CASCADE,
  day_of_week INT NOT NULL CHECK (day_of_week >= 0 AND day_of_week <= 6), -- 0=Sunday, 6=Saturday
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  is_recurring BOOLEAN DEFAULT TRUE,
  exception_dates DATE[], -- Dates when this slot is unavailable
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  CONSTRAINT valid_time_range CHECK (start_time < end_time)
};
```

---

## API Endpoints

### Authentication

#### 1. Sign Up
```
POST /api/auth/signup
Content-Type: application/json

{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "password": "securePass123",
  "phone": "+27123456789",
  "role": "client" | "practitioner",
  
  // If role === "practitioner"
  "specialization": "healer" | "prophet" | "medium" | "counselor",
  "bio": "Professional bio...",
  "serviceAddress": "123 Main St, Durban, South Africa",
  "latitude": -29.8683,
  "longitude": 31.0292
}

Response:
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "user-uuid",
    "email": "john@example.com",
    "role": "client" | "practitioner",
    "firstName": "John",
    "lastName": "Doe"
  }
}
```

#### 2. Login
```
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "securePass123"
}

Response:
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "user-uuid",
    "email": "john@example.com",
    "role": "client" | "practitioner"
  }
}
```

#### 3. Verify Token
```
GET /api/auth/verify
Headers: Authorization: Bearer {token}

Response:
{
  "valid": true,
  "user": { ...user data }
}
```

#### 4. Refresh Token
```
POST /api/auth/refresh
Headers: Authorization: Bearer {token}

Response:
{
  "token": "new-jwt-token"
}
```

### Practitioners

#### 5. Search Practitioners
```
GET /api/practitioners/search?specialization=healer&latitude=-29.8683&longitude=31.0292&radius=50&limit=20

Response:
{
  "practitioners": [
    {
      "id": "prac-id",
      "name": "Dr. Lerato Khumalo",
      "specialization": "healer",
      "rating": 4.8,
      "distance_km": 2.5,
      "rate": 450.00,
      "location": {
        "latitude": -29.8683,
        "longitude": 31.0292
      }
    }
  ],
  "total": 15
}
```

#### 6. Get Practitioner Details
```
GET /api/practitioners/{id}

Response:
{
  "id": "prac-id",
  "name": "Dr. Lerato Khumalo",
  "specialization": "healer",
  "bio": "Specialized in holistic wellness...",
  "rating": 4.8,
  "reviews": 127,
  "rate": 450.00,
  "duration": 60,
  "address": "123 Main St, Durban",
  "availableSlots": [...],
  "reviews": [...]
}
```

#### 7. Get Availability
```
GET /api/practitioners/{id}/availability?date=2025-11-15

Response:
{
  "date": "2025-11-15",
  "slots": [
    { "id": "1", "time": "09:00", "available": true },
    { "id": "2", "time": "10:15", "available": true },
    { "id": "3", "time": "11:30", "available": false }
  ]
}
```

### Bookings

#### 8. Create Booking
```
POST /api/bookings
Headers: Authorization: Bearer {token}

{
  "practitionerId": "prac-id",
  "sessionDate": "2025-11-15",
  "sessionSlotId": "2",
  "notes": "First time client...",
  "meetingType": "in_person" | "online"
}

Response:
{
  "bookingId": "booking-id",
  "status": "pending",
  "totalAmount": 517.50, // 450 + 15% fee
  "paymentLink": "https://stripe.com/pay/..."
}
```

#### 9. Get User Bookings
```
GET /api/bookings/my-bookings
Headers: Authorization: Bearer {token}

Response:
{
  "bookings": [
    {
      "id": "booking-id",
      "practitioner": {...},
      "date": "2025-11-15",
      "time": "09:00",
      "status": "confirmed",
      "totalAmount": 517.50
    }
  ]
}
```

---

## Frontend State Management

### Authentication Context (Recommended)
```typescript
interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (data: SignupData) => Promise<void>;
  logout: () => void;
  updateUser: (data: Partial<User>) => Promise<void>;
}
```

### Protected Routes
```typescript
<ProtectedRoute path="/booking">
  <Booking />
</ProtectedRoute>
```

---

## Security Considerations

1. **Passwords**: Hash with bcrypt (min 12 rounds)
2. **Tokens**: JWT with 24h expiry, refresh token with 7d expiry
3. **HTTPS Only**: All API calls over HTTPS
4. **CORS**: Configure for frontend domain only
5. **Rate Limiting**: Prevent brute force attacks (5 attempts/15min)
6. **Input Validation**: Validate all user inputs server-side
7. **Address Geocoding**: Use Nominatim (free, privacy-respecting) or Google Maps
8. **Password Requirements**: Min 8 chars, 1 uppercase, 1 number, 1 special char

---

## Implementation Phases

### Phase 1 (MVP)
- ✅ Frontend: Auth pages with validation
- ⏳ Backend: Basic auth endpoints
- ⏳ Database: Users + Practitioners tables
- ⏳ Auth flow: Login/signup with JWT

### Phase 2 (Core Features)
- ⏳ Practitioner search by location
- ⏳ Availability calendar
- ⏳ Booking system
- ⏳ Payment integration (Stripe)

### Phase 3 (Enhanced)
- ⏳ Reviews and ratings
- ⏳ Practitioner dashboard
- ⏳ Email notifications
- ⏳ Advanced search filters
- ⏳ Admin dashboard

---

## Environment Variables

```bash
# Frontend (.env)
VITE_API_URL=http://localhost:3000
VITE_NOMINATIM_API=https://nominatim.openstreetmap.org

# Backend (.env)
DATABASE_URL=postgresql://user:password@localhost:5432/avenrae
JWT_SECRET=your-super-secret-key-change-in-production
JWT_EXPIRY=24h
REFRESH_TOKEN_EXPIRY=7d
BCRYPT_ROUNDS=12
NODE_ENV=development
```

---

## Next Steps

1. **Backend Setup**: Create Express/Fastify server with Prisma
2. **Database**: Set up PostgreSQL with schema
3. **Auth Endpoints**: Implement signup/login with JWT
4. **Frontend Integration**: Connect Auth.tsx to backend
5. **Protected Routes**: Add route guards
6. **Booking Integration**: Wire up booking page to API
7. **Payment**: Integrate Stripe for transactions
