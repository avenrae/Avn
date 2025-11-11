# Avenrae Platform - Database Documentation

## Overview

The Avenrae platform is a comprehensive digital sanctuary for spiritual wellness, connecting healers with clients for services, events, and products. This documentation covers the complete database schema, setup, and usage.

## Database Architecture

The database is structured around the following core entities:

### 1. **Users & Accounts**
- `users` - Base user table for all platform participants
- `healers` - Extended profile for healer practitioners
- `clients` - Extended profile for platform clients

### 2. **Services & Offerings**
- `services` - Individual services offered by healers
- `products` - E-commerce products (crystals, books, tools, supplements)
- `events` - Community events and workshops
- `event_registrations` - Event attendance tracking

### 3. **Transactions & Commerce**
- `bookings` - Service appointment/booking records
- `orders` - E-commerce orders
- `order_items` - Individual items in orders
- `transactions` - Financial transaction log
- `coupons` - Discount codes and promotions

### 4. **Communication & Support**
- `conversations` - User-to-user messaging
- `messages` - Individual messages
- `support_tickets` - Customer support tickets
- `notifications` - System notifications

### 5. **Community & Engagement**
- `reviews` - User reviews and ratings
- `favorite_healers` - Favorite healer bookmarks
- `wishlist_items` - Product wishlists

### 6. **Operations & Management**
- `healer_availability` - Working hours scheduling
- `blocked_dates` - Healer unavailable dates
- `audit_logs` - System audit trail
- `system_logs` - Application logs

## Database Setup

### Prerequisites
- MySQL 8.0 or higher
- Administrator access to MySQL server

### Installation Steps

#### 1. Create the Database
```bash
mysql -u root -p < database/schema.sql
```

#### 2. Seed Sample Data (Optional)
```bash
mysql -u root -p avenrae_db < database/seed.sql
```

#### 3. Verify Installation
```bash
mysql -u root -p avenrae_db -e "SHOW TABLES;"
```

### Connection String Examples

**Node.js (mysql2/promise)**
```javascript
const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'your_password',
  database: 'avenrae_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});
```

**Python (mysql-connector-python)**
```python
import mysql.connector

conn = mysql.connector.connect(
  host="localhost",
  user="root",
  password="your_password",
  database="avenrae_db"
)
```

**PHP (PDO)**
```php
$pdo = new PDO(
  'mysql:host=localhost;dbname=avenrae_db',
  'root',
  'your_password'
);
```

## Core Tables Reference

### Users Table
Stores all user accounts (clients, healers, admins).

| Field | Type | Key | Notes |
|-------|------|-----|-------|
| id | INT | PK | Auto-increment |
| email | VARCHAR(255) | UNIQUE | User login email |
| password_hash | VARCHAR(255) | - | Bcrypt hashed password |
| first_name | VARCHAR(100) | - | First name |
| last_name | VARCHAR(100) | - | Last name |
| user_type | ENUM | - | 'client', 'healer', 'admin' |
| is_verified | BOOLEAN | - | Email verification status |
| created_at | TIMESTAMP | - | Registration date |

### Healers Table
Extended profile for healer practitioners.

| Field | Type | Key | Notes |
|-------|------|-----|-------|
| id | INT | PK | Auto-increment |
| user_id | INT | FK | Reference to users |
| healer_type | ENUM | - | Specialization type |
| hourly_rate | DECIMAL(10,2) | - | Service price per hour |
| rating | DECIMAL(3,2) | - | Average rating (0-5) |
| is_verified_healer | BOOLEAN | - | Platform verification |
| availability_status | ENUM | - | 'available', 'busy', 'offline' |

### Clients Table
Extended profile for client users.

| Field | Type | Key | Notes |
|-------|------|-----|-------|
| id | INT | PK | Auto-increment |
| user_id | INT | FK | Reference to users |
| date_of_birth | DATE | - | Client DOB |
| gender | ENUM | - | Gender preference |
| emergency_contact_phone | VARCHAR(20) | - | Emergency contact |

### Services Table
Services offered by healers.

| Field | Type | Key | Notes |
|-------|------|-----|-------|
| id | INT | PK | Auto-increment |
| healer_id | INT | FK | Which healer offers |
| service_name | VARCHAR(150) | - | Service title |
| duration_minutes | INT | - | Session length |
| price | DECIMAL(10,2) | - | Service cost |
| service_category | ENUM | - | Type of service |

### Bookings Table
Service appointments and bookings.

| Field | Type | Key | Notes |
|-------|------|-----|-------|
| id | INT | PK | Auto-increment |
| client_id | INT | FK | Client making booking |
| healer_id | INT | FK | Healer being booked |
| service_id | INT | FK | Service being booked |
| booking_date | DATETIME | - | Appointment time |
| status | ENUM | - | 'pending', 'confirmed', etc |
| payment_status | ENUM | - | 'unpaid', 'paid', 'refunded' |

### Products Table
E-commerce products.

| Field | Type | Key | Notes |
|-------|------|-----|-------|
| id | INT | PK | Auto-increment |
| product_name | VARCHAR(200) | - | Product title |
| product_type | ENUM | - | Crystal, book, tool, etc |
| price | DECIMAL(10,2) | - | Selling price |
| stock_quantity | INT | - | Current stock |
| sku | VARCHAR(50) | UNIQUE | Stock keeping unit |

### Orders Table
E-commerce orders.

| Field | Type | Key | Notes |
|-------|------|-----|-------|
| id | INT | PK | Auto-increment |
| client_id | INT | FK | Customer placing order |
| order_number | VARCHAR(50) | UNIQUE | Order ID |
| total_amount | DECIMAL(10,2) | - | Order total |
| status | ENUM | - | 'pending', 'shipped', etc |
| payment_status | ENUM | - | Payment status |

### Events Table
Community events and workshops.

| Field | Type | Key | Notes |
|-------|------|-----|-------|
| id | INT | PK | Auto-increment |
| event_name | VARCHAR(200) | - | Event title |
| event_date | DATETIME | - | When event occurs |
| max_capacity | INT | - | Maximum attendees |
| price | DECIMAL(10,2) | - | Registration fee |
| organizer_healer_id | INT | FK | Healer organizing |

## Common Queries

### 1. Find Available Healers by Specialization
```sql
SELECT h.id, u.first_name, u.last_name, h.healer_type, h.hourly_rate, h.rating
FROM healers h
JOIN users u ON h.user_id = u.id
WHERE h.healer_type = 'psychologist'
  AND h.availability_status = 'available'
  AND h.is_verified_healer = TRUE
ORDER BY h.rating DESC;
```

### 2. Get Client Booking History
```sql
SELECT b.id, b.booking_date, s.service_name, u.first_name, u.last_name, b.status
FROM bookings b
JOIN services s ON b.service_id = s.id
JOIN healers h ON b.healer_id = h.id
JOIN users u ON h.user_id = u.id
WHERE b.client_id = 1
ORDER BY b.booking_date DESC;
```

### 3. Upcoming Bookings for a Healer
```sql
SELECT b.id, c_user.first_name, c_user.last_name, s.service_name, b.booking_date
FROM bookings b
JOIN clients c ON b.client_id = c.id
JOIN users c_user ON c.user_id = c_user.id
JOIN services s ON b.service_id = s.id
WHERE b.healer_id = 1
  AND b.booking_date > NOW()
  AND b.status IN ('pending', 'confirmed')
ORDER BY b.booking_date ASC;
```

### 4. Revenue Report by Healer
```sql
SELECT h.id, u.first_name, u.last_name,
       COUNT(DISTINCT b.id) as total_bookings,
       SUM(b.total_price) as total_revenue,
       AVG(b.client_rating) as avg_rating
FROM healers h
JOIN users u ON h.user_id = u.id
LEFT JOIN bookings b ON h.id = b.healer_id AND b.status = 'completed'
GROUP BY h.id
ORDER BY total_revenue DESC;
```

### 5. Top-Rated Services
```sql
SELECT s.id, s.service_name, h.healer_type,
       COUNT(r.id) as total_reviews,
       AVG(r.rating) as avg_rating
FROM services s
JOIN healers h ON s.healer_id = h.id
LEFT JOIN reviews r ON h.id = r.healer_id
GROUP BY s.id
HAVING COUNT(r.id) > 0
ORDER BY avg_rating DESC;
```

### 6. Product Inventory Status
```sql
SELECT product_name, product_category, stock_quantity, price,
       CASE 
         WHEN stock_quantity = 0 THEN 'Out of Stock'
         WHEN stock_quantity < 10 THEN 'Low Stock'
         ELSE 'In Stock'
       END as stock_status
FROM products
WHERE is_active = TRUE
ORDER BY stock_quantity ASC;
```

### 7. Event Attendance Summary
```sql
SELECT e.event_name, e.event_date, e.max_capacity,
       COUNT(er.id) as registered_count,
       ROUND((COUNT(er.id) / e.max_capacity * 100), 2) as capacity_percentage
FROM events e
LEFT JOIN event_registrations er ON e.id = er.event_id
GROUP BY e.id
ORDER BY e.event_date DESC;
```

### 8. Monthly Revenue Breakdown
```sql
SELECT DATE_FORMAT(b.booking_date, '%Y-%m') as month,
       COUNT(DISTINCT b.id) as bookings,
       SUM(b.total_price) as booking_revenue,
       COUNT(DISTINCT o.id) as orders,
       SUM(o.total_amount) as product_revenue,
       SUM(b.total_price) + SUM(o.total_amount) as total_revenue
FROM bookings b
FULL OUTER JOIN orders o ON DATE_FORMAT(b.booking_date, '%Y-%m') = DATE_FORMAT(o.order_date, '%Y-%m')
GROUP BY DATE_FORMAT(b.booking_date, '%Y-%m')
ORDER BY month DESC;
```

## User Types & Roles

### Client Role
- Browse healers and services
- Book appointments
- Register for events
- Purchase products
- Leave reviews and ratings
- Manage favorite healers
- Access booking history
- Manage account and preferences

### Healer Role
- Create and manage services
- Set availability and rates
- View and manage bookings
- Track earnings
- Respond to reviews
- Organize events
- Manage profile and qualifications
- View client feedback

### Admin Role
- Manage all users
- Moderate content and reviews
- Manage platform settings
- Process refunds
- Generate reports
- Handle support tickets
- Platform configuration

## Data Migration & Backup

### Backup Database
```bash
mysqldump -u root -p avenrae_db > backup_avenrae_$(date +%Y%m%d_%H%M%S).sql
```

### Restore Database
```bash
mysql -u root -p avenrae_db < backup_avenrae_20250110_120000.sql
```

### Export Specific Table
```bash
mysqldump -u root -p avenrae_db healers > healers_export.sql
```

## Performance Optimization

### Recommended Indexes (Already Included)
- `users(email)` - Fast user lookup by email
- `healers(rating, healer_type)` - Browse healers
- `bookings(client_id, booking_date)` - Client booking history
- `bookings(healer_id, booking_date)` - Healer schedule
- `orders(client_id, order_date)` - Order history
- `products(category, is_active)` - Product filtering
- `events(event_date)` - Upcoming events

### Query Optimization Tips
1. Always use indexes on foreign keys
2. Use EXPLAIN to analyze slow queries
3. Archive old transactions periodically
4. Use pagination for large result sets
5. Cache frequently accessed data

## Security Considerations

1. **Password Security**
   - Store only bcrypt hashed passwords
   - Minimum 12 character requirement
   - Implement password reset functionality

2. **Data Protection**
   - Use SSL/TLS for database connections
   - Implement row-level security for sensitive data
   - Audit sensitive operations
   - Encrypt payment information

3. **Access Control**
   - Use database user with minimal required permissions
   - Never use root account for application
   - Implement role-based access control
   - Regular access audits

4. **SQL Injection Prevention**
   - Use parameterized queries
   - Input validation and sanitization
   - Stored procedures for critical operations

## Integration Points

The database connects to the frontend application through:

1. **REST API** - Node.js/Express backend
2. **GraphQL** - Optional GraphQL endpoint
3. **Real-time Updates** - WebSocket connections
4. **Email Notifications** - Background jobs
5. **Payment Processing** - Third-party gateways

## Support & Troubleshooting

### Connection Issues
```sql
-- Check MySQL status
SHOW STATUS LIKE 'Threads%';

-- List active connections
SHOW PROCESSLIST;

-- Kill long-running query
KILL QUERY process_id;
```

### Performance Issues
```sql
-- Find slow queries
SELECT * FROM mysql.slow_log;

-- Check table size
SELECT 
  TABLE_NAME,
  ROUND(((data_length + index_length) / 1024 / 1024), 2) AS size_mb
FROM information_schema.tables
WHERE table_schema = 'avenrae_db';
```

## Version History

- **v1.0** (2025-01-10) - Initial schema and seed data
- Comprehensive tables for users, services, bookings, products, events
- Full audit and notification system
- Payment and transaction tracking

## Future Enhancements

- Subscription models for recurring services
- Advanced analytics and reporting
- Multi-language support
- Geolocation-based healer search
- Video call integration
- Mobile app database sync
- Advanced recommendation engine
