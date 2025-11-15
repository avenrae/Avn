# PostgreSQL Database Setup for Avenrae

## 1. Installation & Setup

### macOS (with Homebrew)
```bash
brew install postgresql@15
brew services start postgresql@15
createuser avenrae_user -P  # Creates user with password prompt
createdb -O avenrae_user avenrae_dev
```

### Windows
1. Download PostgreSQL 15+ from https://www.postgresql.org/download/windows/
2. Run installer (remember the superuser password)
3. Open pgAdmin 4 (included)
4. Create new database: `avenrae_dev`
5. Create new user role: `avenrae_user` with password

### Linux (Ubuntu/Debian)
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo -u postgres createuser avenrae_user -P
sudo -u postgres createdb -O avenrae_user avenrae_dev
```

---

## 2. Enable PostGIS (Geospatial Extension)

PostGIS allows location-based queries (find practitioners near users).

```bash
# Connect as superuser
psql -U postgres -d avenrae_dev

# Inside psql terminal
CREATE EXTENSION postgis;
CREATE EXTENSION postgis_topology;
\dx  # List extensions
```

---

## 3. Database Connection String

```bash
# .env file
DATABASE_URL="postgresql://avenrae_user:your_password@localhost:5432/avenrae_dev"

# For production
DATABASE_URL="postgresql://avenrae_user:strong_password@prod-server.com:5432/avenrae_prod"
```

---

## 4. Schema Creation

Run this SQL to create all tables:

```sql
-- Drop existing tables (if needed)
DROP TABLE IF EXISTS reviews CASCADE;
DROP TABLE IF EXISTS bookings CASCADE;
DROP TABLE IF EXISTS availability_slots CASCADE;
DROP TABLE IF EXISTS practitioners CASCADE;
DROP TABLE IF EXISTS clients CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Create ENUM types
CREATE TYPE user_role AS ENUM ('client', 'practitioner');
CREATE TYPE specialization_type AS ENUM ('healer', 'prophet', 'medium', 'counselor', 'other');
CREATE TYPE availability_type AS ENUM ('in_person', 'online', 'both');
CREATE TYPE meeting_type AS ENUM ('in_person', 'online');
CREATE TYPE booking_status AS ENUM ('pending', 'confirmed', 'completed', 'cancelled');
CREATE TYPE payment_status AS ENUM ('pending', 'completed', 'refunded', 'failed');

-- Users table (base for all users)
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  first_name VARCHAR(255) NOT NULL,
  last_name VARCHAR(255) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  role user_role NOT NULL,
  avatar_url VARCHAR(500),
  is_active BOOLEAN DEFAULT TRUE,
  email_verified BOOLEAN DEFAULT FALSE,
  email_verified_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP
);

-- Indexes on users
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_created_at ON users(created_at DESC);

-- Practitioners table
CREATE TABLE practitioners (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  specialization specialization_type NOT NULL,
  bio TEXT NOT NULL,
  bio_short VARCHAR(500),
  rating DECIMAL(3,2) DEFAULT 0.0 CHECK (rating >= 0 AND rating <= 5),
  review_count INT DEFAULT 0,
  service_address TEXT NOT NULL,
  latitude DECIMAL(10, 8) NOT NULL CHECK (latitude >= -90 AND latitude <= 90),
  longitude DECIMAL(11, 8) NOT NULL CHECK (longitude >= -180 AND longitude <= 180),
  location_point GEOGRAPHY(POINT, 4326) GENERATED ALWAYS AS (ST_SetSRID(ST_Point(longitude, latitude), 4326)) STORED,
  service_radius_km INT DEFAULT 50,
  rate_per_session DECIMAL(10, 2) NOT NULL CHECK (rate_per_session > 0),
  session_duration_minutes INT DEFAULT 60 CHECK (session_duration_minutes > 0),
  availability_type availability_type DEFAULT 'both',
  is_verified BOOLEAN DEFAULT FALSE,
  verification_badge BOOLEAN DEFAULT FALSE,
  verification_date TIMESTAMP,
  years_experience INT,
  certifications TEXT[],
  languages VARCHAR(255)[],
  total_sessions INT DEFAULT 0,
  response_time_hours INT,
  cancellation_rate DECIMAL(5,2) DEFAULT 0.0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP
);

-- Indexes on practitioners
CREATE INDEX idx_practitioners_user_id ON practitioners(user_id);
CREATE INDEX idx_practitioners_specialization ON practitioners(specialization);
CREATE INDEX idx_practitioners_location ON practitioners USING GIST(location_point);
CREATE INDEX idx_practitioners_rating ON practitioners(rating DESC);
CREATE INDEX idx_practitioners_verified ON practitioners(is_verified);

-- Clients table
CREATE TABLE clients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  preferred_location VARCHAR(255),
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  location_point GEOGRAPHY(POINT, 4326) GENERATED ALWAYS AS (CASE WHEN latitude IS NOT NULL AND longitude IS NOT NULL THEN ST_SetSRID(ST_Point(longitude, latitude), 4326) END) STORED,
  bio VARCHAR(500),
  preferences JSONB, -- e.g., { "preferred_specializations": ["healer", "medium"], "max_distance": 50 }
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes on clients
CREATE INDEX idx_clients_user_id ON clients(user_id);
CREATE INDEX idx_clients_location ON clients USING GIST(location_point);

-- Availability slots table
CREATE TABLE availability_slots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  practitioner_id UUID NOT NULL REFERENCES practitioners(id) ON DELETE CASCADE,
  day_of_week INT NOT NULL CHECK (day_of_week >= 0 AND day_of_week <= 6), -- 0=Sunday, 6=Saturday
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  break_times JSONB, -- e.g., [{ "start": "12:00", "end": "13:00" }]
  exception_dates DATE[],
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT valid_time_range CHECK (start_time < end_time)
);

-- Indexes on availability_slots
CREATE INDEX idx_availability_practitioner ON availability_slots(practitioner_id);
CREATE INDEX idx_availability_day ON availability_slots(day_of_week);

-- Bookings table
CREATE TABLE bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL REFERENCES users(id),
  practitioner_id UUID NOT NULL REFERENCES practitioners(id),
  session_date DATE NOT NULL,
  session_start_time TIME NOT NULL,
  session_end_time TIME NOT NULL,
  status booking_status DEFAULT 'pending',
  notes TEXT,
  client_notes TEXT,
  practitioner_notes TEXT,
  service_amount DECIMAL(10, 2) NOT NULL CHECK (service_amount > 0),
  platform_fee DECIMAL(10, 2) NOT NULL DEFAULT 0,
  total_amount DECIMAL(10, 2) NOT NULL CHECK (total_amount > 0),
  payment_status payment_status DEFAULT 'pending',
  payment_method VARCHAR(50), -- 'card', 'paypal', 'bank_transfer'
  stripe_payment_intent_id VARCHAR(255),
  meeting_type meeting_type NOT NULL,
  meeting_link VARCHAR(500), -- For online sessions (Zoom, Google Meet, etc.)
  cancellation_reason VARCHAR(255),
  cancelled_by VARCHAR(50), -- 'client' or 'practitioner'
  cancelled_at TIMESTAMP,
  completed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes on bookings
CREATE INDEX idx_bookings_client ON bookings(client_id);
CREATE INDEX idx_bookings_practitioner ON bookings(practitioner_id);
CREATE INDEX idx_bookings_status ON bookings(status);
CREATE INDEX idx_bookings_payment_status ON bookings(payment_status);
CREATE INDEX idx_bookings_date ON bookings(session_date DESC);
CREATE INDEX idx_bookings_created ON bookings(created_at DESC);

-- Reviews table
CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID UNIQUE NOT NULL REFERENCES bookings(id),
  client_id UUID NOT NULL REFERENCES users(id),
  practitioner_id UUID NOT NULL REFERENCES practitioners(id),
  rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  verified_booking BOOLEAN DEFAULT TRUE,
  helpful_count INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT one_review_per_booking UNIQUE(booking_id)
);

-- Indexes on reviews
CREATE INDEX idx_reviews_practitioner ON reviews(practitioner_id);
CREATE INDEX idx_reviews_rating ON reviews(rating);
CREATE INDEX idx_reviews_created ON reviews(created_at DESC);

-- Payment transactions table
CREATE TABLE payment_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID REFERENCES bookings(id),
  user_id UUID NOT NULL REFERENCES users(id),
  amount DECIMAL(10, 2) NOT NULL,
  payment_method VARCHAR(50),
  stripe_transaction_id VARCHAR(255) UNIQUE,
  stripe_customer_id VARCHAR(255),
  status payment_status,
  error_message TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes on payment_transactions
CREATE INDEX idx_payments_booking ON payment_transactions(booking_id);
CREATE INDEX idx_payments_user ON payment_transactions(user_id);
CREATE INDEX idx_payments_status ON payment_transactions(status);

-- Refresh tokens table (for auth)
CREATE TABLE refresh_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token_hash VARCHAR(255) NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes on refresh_tokens
CREATE INDEX idx_refresh_tokens_user ON refresh_tokens(user_id);
CREATE INDEX idx_refresh_tokens_expires ON refresh_tokens(expires_at);

-- Notifications table
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  booking_id UUID REFERENCES bookings(id),
  type VARCHAR(50) NOT NULL, -- 'booking_confirmed', 'booking_cancelled', 'review_received', 'message'
  title VARCHAR(255) NOT NULL,
  message TEXT,
  is_read BOOLEAN DEFAULT FALSE,
  read_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes on notifications
CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_notifications_is_read ON notifications(is_read);
CREATE INDEX idx_notifications_created ON notifications(created_at DESC);

-- Create views for common queries
CREATE VIEW available_practitioners AS
SELECT 
  p.id,
  p.user_id,
  u.first_name,
  u.last_name,
  u.email,
  p.specialization,
  p.bio_short,
  p.rating,
  p.review_count,
  p.service_address,
  p.latitude,
  p.longitude,
  p.rate_per_session,
  p.session_duration_minutes,
  p.is_verified,
  p.location_point
FROM practitioners p
JOIN users u ON p.user_id = u.id
WHERE p.is_verified = TRUE
  AND u.is_active = TRUE
  AND p.deleted_at IS NULL;

-- Function to calculate distance between two points
CREATE OR REPLACE FUNCTION distance_km(
  lat1 DECIMAL,
  lon1 DECIMAL,
  lat2 DECIMAL,
  lon2 DECIMAL
)
RETURNS DECIMAL AS $$
BEGIN
  RETURN ST_Distance(
    ST_SetSRID(ST_Point(lon1, lat1), 4326)::geography,
    ST_SetSRID(ST_Point(lon2, lat2), 4326)::geography
  ) / 1000;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Function to find practitioners near a location
CREATE OR REPLACE FUNCTION find_practitioners_near(
  lat DECIMAL,
  lon DECIMAL,
  radius_km INT DEFAULT 50,
  spec specialization_type DEFAULT NULL
)
RETURNS TABLE (
  id UUID,
  name VARCHAR,
  specialization specialization_type,
  rating DECIMAL,
  distance DECIMAL,
  rate DECIMAL
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    p.id,
    (u.first_name || ' ' || u.last_name)::VARCHAR,
    p.specialization,
    p.rating,
    distance_km(lat, lon, p.latitude, p.longitude),
    p.rate_per_session
  FROM practitioners p
  JOIN users u ON p.user_id = u.id
  WHERE p.is_verified = TRUE
    AND u.is_active = TRUE
    AND distance_km(lat, lon, p.latitude, p.longitude) <= radius_km
    AND (spec IS NULL OR p.specialization = spec)
  ORDER BY distance_km(lat, lon, p.latitude, p.longitude) ASC;
END;
$$ LANGUAGE plpgsql;
