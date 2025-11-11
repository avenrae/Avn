# Avenrae Database Configuration

This directory contains the database schema, seed data, and setup instructions for the Avenrae platform.

## Files Overview

- **`schema.sql`** - Complete database schema with all tables and relationships
- **`seed.sql`** - Sample data for development and testing
- **`README.md`** - Comprehensive database documentation
- **`config.example.env`** - Database connection configuration template

## Quick Start

### 1. Create Database
```bash
mysql -u root -p < database/schema.sql
```

### 2. Add Sample Data (Optional)
```bash
mysql -u root -p avenrae_db < database/seed.sql
```

### 3. Set Up Environment Variables
Create a `.env` file in your project root:
```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=avenrae_db
DB_PORT=3306
```

## Database Tables Summary

### User Management (3 tables)
- `users` - All user accounts
- `healers` - Healer profiles
- `clients` - Client profiles

### Services & Offerings (4 tables)
- `services` - Healer services
- `products` - Store products
- `events` - Community events
- `event_registrations` - Event attendance

### Transactions (5 tables)
- `bookings` - Service bookings
- `orders` - Product orders
- `order_items` - Order line items
- `shopping_carts` - Shopping carts
- `cart_items` - Cart contents

### Communication (4 tables)
- `conversations` - Message threads
- `messages` - Individual messages
- `support_tickets` - Support requests
- `notifications` - System notifications

### Community (3 tables)
- `reviews` - User reviews/ratings
- `favorite_healers` - Saved healers
- `wishlist_items` - Saved products

### Operations (8 tables)
- `transactions` - Financial log
- `coupons` - Discount codes
- `coupon_usage` - Coupon usage tracking
- `healer_availability` - Work schedules
- `blocked_dates` - Unavailable dates
- `audit_logs` - System audit trail
- `system_logs` - Application logs
- `platform_settings` - Configuration

## Sample Data Included

The seed file includes:
- 5 sample clients
- 6 sample healers (various specializations)
- 14 services
- 14 products (crystals, books, tools, supplements)
- 6 events
- 5 sample bookings
- 7 event registrations
- 5 product orders
- 3 user reviews
- 8 favorite healer saves
- 9 wishlist items
- 4 promotional coupons

## System Requirements

- MySQL 8.0+
- 50MB disk space minimum
- UTF-8 character set

## Data Model Highlights

### Key Relationships
- One healer has many services
- One client can have many bookings
- One order can have many items
- Healers have weekly availability schedules
- Multiple payment methods supported

### Constraints
- Email uniqueness across users
- One client profile per user
- One healer profile per user
- Booking date must be in future
- Stock quantity cannot be negative
- Price must be positive

### Enums (Fixed Values)
- User types: client, healer, admin
- Healer types: psychologist, optometrist, counsellor, spiritual_healer, medium, prophet
- Service categories: healing, consultation, reading, workshop, coaching
- Booking statuses: pending, confirmed, completed, cancelled, no_show
- Payment methods: credit_card, debit_card, paypal, bank_transfer, cash

## Next Steps

1. **Set up Node.js backend** to connect to this database
2. **Create API endpoints** for each resource
3. **Implement authentication** system
4. **Add payment gateway** integration
5. **Build admin dashboard** for management
6. **Set up automated backups** for production

For detailed documentation, see `README.md`
