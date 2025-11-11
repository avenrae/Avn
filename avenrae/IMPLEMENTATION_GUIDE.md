# Avenrae Platform - Complete Implementation Guide

## 🎯 Project Overview

Avenrae is a comprehensive digital sanctuary platform connecting healers with clients for spiritual wellness services, events, and products. The platform includes:

- **Healer Marketplace** - Browse and book practitioners (psychologists, optometrists, counsellors, spiritual healers, mediums, prophets)
- **Service Bookings** - Schedule appointments with built-in availability management
- **Events & Workshops** - Community gatherings and training sessions
- **E-Commerce Store** - Crystals, books, tools, supplements, and apparel
- **User Reviews & Ratings** - Community feedback system
- **Payment Processing** - Multiple payment methods
- **Support System** - Help center and ticket management

## 📁 Project Structure

```
avenrae/
├── database/
│   ├── schema.sql              # Complete database schema
│   ├── seed.sql                # Sample data
│   ├── README.md               # Database documentation
│   ├── INDEX.md                # Database overview
│   └── config.example.env      # Configuration template
├── src/
│   ├── pages/                  # React pages
│   │   ├── Home.tsx
│   │   ├── Healers.tsx
│   │   ├── Prophets.tsx
│   │   ├── Mediums.tsx
│   │   ├── Events.tsx
│   │   ├── Support.tsx
│   │   ├── Store.tsx
│   │   └── NotFound.tsx
│   ├── components/             # Shared components
│   │   └── Header.tsx
│   ├── database/
│   │   └── db.js               # Database connection utility
│   ├── api/
│   │   └── routes/
│   │       ├── healers.js      # Healer endpoints
│   │       └── bookings.js     # Booking endpoints
│   ├── App.tsx                 # Main app with routing
│   ├── main.tsx                # React entry point
│   └── index.css
├── public/
├── package.json
├── tsconfig.json
├── vite.config.ts
└── index.html
```

## 🚀 Getting Started

### Prerequisites
- Node.js 16+ and npm
- MySQL 8.0+
- Git

### Step 1: Install Dependencies

```bash
cd avenrae
npm install
npm install react-router-dom
```

### Step 2: Set Up Database

```bash
# Create database and tables
mysql -u root -p < database/schema.sql

# Add sample data (optional)
mysql -u root -p avenrae_db < database/seed.sql
```

### Step 3: Configure Environment

Create `.env` file in project root:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=avenrae_db
DB_PORT=3306
NODE_ENV=development
```

### Step 4: Run Development Server

```bash
npm run dev
```

The app will start at `http://localhost:5174/`

## 📊 Database Architecture

### Core Tables (32 tables total)

#### User Management
- `users` - All platform users (clients, healers, admins)
- `healers` - Extended healer profiles
- `clients` - Extended client profiles

#### Services & Marketplace
- `services` - Services offered by healers
- `products` - E-commerce products
- `events` - Community events
- `event_registrations` - Event attendance

#### Transactions
- `bookings` - Service appointments
- `orders` - Product orders
- `order_items` - Order details
- `transactions` - Financial tracking
- `coupons` - Discount codes

#### Communication
- `conversations` - Message threads
- `messages` - Individual messages
- `support_tickets` - Support requests
- `notifications` - System notifications

#### Community
- `reviews` - User ratings and reviews
- `favorite_healers` - Saved healers
- `wishlist_items` - Saved products

#### Operations
- `healer_availability` - Work schedules
- `blocked_dates` - Unavailable dates
- `shopping_carts` - Cart management
- `cart_items` - Cart contents
- `audit_logs` - System logs
- `system_logs` - Application logs
- `platform_settings` - Configuration
- `coupon_usage` - Coupon tracking

### Key Relationships

```
users (1) ──── (1) healers
         └──── (1) clients

healers (1) ──── (many) services
         ├──── (many) bookings
         ├──── (many) events
         └──── (many) healer_availability

clients (1) ──── (many) bookings
         ├──── (many) orders
         ├──── (many) event_registrations
         ├──── (many) reviews
         ├──── (many) favorite_healers
         └──── (many) wishlist_items

bookings (many) ──── (1) services
         ├──── (many) reviews
         └──── (many) transactions

orders (1) ──── (many) order_items
        └──── (many) transactions
```

## 🛣️ Routing Structure

### Frontend Routes
- `/` - Home page
- `/healers` - Browse healers
- `/prophets` - Prophets directory
- `/mediums` - Mediums directory
- `/events` - Events listing
- `/support` - Help and support
- `/store` - E-commerce store
- `*` - 404 Not Found

### API Endpoints (To Be Implemented)

#### Healers
- `GET /api/healers` - List all healers
- `GET /api/healers/:id` - Healer details
- `GET /api/healers/:id/availability` - Availability
- `GET /api/healers/:id/services` - Healer services

#### Bookings
- `POST /api/bookings` - Create booking
- `GET /api/bookings/client/:client_id` - Client bookings
- `GET /api/bookings/healer/:healer_id` - Healer schedule
- `PUT /api/bookings/:id` - Update booking
- `DELETE /api/bookings/:id` - Cancel booking

#### Products
- `GET /api/products` - List products
- `GET /api/products/:id` - Product details
- `POST /api/orders` - Create order
- `GET /api/orders/:client_id` - Order history

#### Events
- `GET /api/events` - List events
- `GET /api/events/:id` - Event details
- `POST /api/events/:id/register` - Register for event

#### Authentication (To Be Implemented)
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `POST /api/auth/refresh` - Refresh token

## 🔄 Sample Data Included

### Users
- **5 Clients** - Various wellness seekers
- **6 Healers** - Different specializations:
  - Psychologist
  - Optometrist
  - Counsellor
  - Spiritual Healer
  - Medium
  - Prophet

### Services
- 14 services across different categories
- Pricing from R120 to R600 per session
- Various durations (45 min to 2 hours)

### Products
- 14 products in 5 categories
- Crystals, books, tools, supplements, apparel
- Pricing from R45 to R800

### Events
- 6 upcoming events
- Workshops, retreats, circles, festivals
- Capacity from 15 to 500 attendees

### Transactions
- 5 sample bookings
- 7 event registrations
- 5 product orders
- 3 user reviews

## 🔐 Authentication & Security

### Password Security
- Use bcrypt for password hashing
- Minimum 12 character passwords
- Salt rounds: 10+

### JWT Tokens
- Access token: 15 minutes
- Refresh token: 7 days
- Store in httpOnly cookies

### SQL Injection Prevention
- Use parameterized queries (✓ already implemented in db.js)
- Input validation on all endpoints
- Prepared statements for all queries

### CORS
- Restrict to trusted origins
- Handle credentials properly

## 📈 Key Features

### For Clients
- Browse healers by specialization
- Filter by rating and price
- Book appointments with calendar
- Pay online or offline
- Leave reviews and ratings
- Save favorite healers
- Create product wishlists
- Track booking history
- Manage account settings
- 24/7 support ticketing

### For Healers
- Create and manage services
- Set availability schedule
- View upcoming bookings
- Track earnings
- Respond to reviews
- Organize events
- Manage qualifications
- See client feedback
- Monthly reports

### For Admins
- User management
- Platform analytics
- Revenue tracking
- Content moderation
- Support ticket management
- System configuration
- Audit logs
- Performance monitoring

## 💳 Payment Integration (To Be Implemented)

### Supported Methods
- Credit/Debit cards
- PayPal
- Bank transfers
- Cash (offline)
- Cryptocurrency (optional)

### Payment Gateway Integration
```javascript
// Example: Stripe integration
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

app.post('/api/payments/create-intent', async (req, res) => {
  const { amount, currency = 'ZAR' } = req.body;
  
  const intent = await stripe.paymentIntents.create({
    amount,
    currency,
  });
  
  res.json({ clientSecret: intent.client_secret });
});
```

## 📧 Email Notifications (To Be Implemented)

Send emails for:
- Booking confirmations
- 24-hour reminders
- Payment receipts
- Review notifications
- Support responses
- Event updates
- Password resets

```javascript
// Example: Nodemailer
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});
```

## 🧪 Testing

### Unit Tests
```bash
npm test
```

### Integration Tests
Test database queries and API endpoints

### E2E Tests
Test complete user flows

## 📱 Mobile Responsiveness

- Tailwind CSS for responsive design
- Mobile-first approach
- Touch-friendly UI
- Optimized performance

## 🔍 SEO Optimization

- Meta tags
- Structured data (JSON-LD)
- Sitemap
- Robots.txt
- Open Graph tags

## 📊 Analytics & Monitoring

### Google Analytics
Track user behavior and conversion funnels

### Error Tracking
Sentry for error monitoring

### Performance Monitoring
Monitor database queries and API response times

## 🚢 Deployment

### Production Checklist
- [ ] Environment variables configured
- [ ] Database backups automated
- [ ] SSL/TLS enabled
- [ ] Error logging set up
- [ ] CDN configured
- [ ] Monitoring tools active
- [ ] Rate limiting enabled
- [ ] API documentation complete

### Deployment Platforms
- **Frontend**: Vercel, Netlify, GitHub Pages
- **Backend**: Heroku, AWS, DigitalOcean, Railway
- **Database**: AWS RDS, DigitalOcean, PlanetScale

## 📚 API Documentation

### Example: Get Healers
```bash
curl -X GET "http://localhost:3000/api/healers?healer_type=psychologist&sort=rating&limit=10"

Response:
{
  "success": true,
  "data": [
    {
      "id": 1,
      "first_name": "Lerato",
      "last_name": "Mthembu",
      "healer_type": "psychologist",
      "hourly_rate": 450,
      "rating": 4.8,
      "total_reviews": 15
    }
  ]
}
```

### Example: Create Booking
```bash
curl -X POST "http://localhost:3000/api/bookings" \
  -H "Content-Type: application/json" \
  -d '{
    "client_id": 1,
    "healer_id": 1,
    "service_id": 1,
    "booking_date": "2025-11-15T14:00:00",
    "booking_type": "online"
  }'

Response:
{
  "success": true,
  "message": "Booking created successfully",
  "data": {
    "bookingId": 6,
    "totalPrice": 450
  }
}
```

## 🐛 Troubleshooting

### Database Connection Issues
```bash
# Test MySQL connection
mysql -u root -p -h localhost -e "SELECT 1;"

# Check database exists
mysql -u root -p -e "SHOW DATABASES;"

# Check tables
mysql -u root -p avenrae_db -e "SHOW TABLES;"
```

### Port Already in Use
```bash
# Find process using port 5173
lsof -i :5173  # macOS/Linux
netstat -ano | findstr :5173  # Windows

# Kill process
kill -9 <PID>
```

## 📝 Next Steps

1. **Implement authentication system** (JWT/OAuth)
2. **Set up payment processing** (Stripe/PayPal)
3. **Configure email notifications** (Nodemailer)
4. **Build admin dashboard**
5. **Implement search and filtering**
6. **Add image upload** (AWS S3)
7. **Set up real-time notifications** (WebSockets)
8. **Create mobile app** (React Native)
9. **Deploy to production**
10. **Set up CI/CD pipeline**

## 📞 Support

For issues or questions:
- Create GitHub issues
- Contact support@avenrae.com
- Join Discord community

## 📄 License

Proprietary - Avenrae Platform 2025

---

**Last Updated**: January 10, 2025
**Version**: 1.0
**Status**: Development
