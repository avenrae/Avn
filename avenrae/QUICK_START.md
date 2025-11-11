# Avenrae Platform - Quick Reference

## 🎯 What is Avenrae?

A digital platform connecting spiritual healers with clients for:
- Service bookings (therapy, readings, coaching, healing)
- Events & workshops
- E-commerce products (crystals, books, tools)
- Community reviews and ratings

## 📦 What's Included

### Database
- ✅ Complete SQL schema (32 tables)
- ✅ Sample data (5 clients, 6 healers, 14 services, 14 products, 6 events)
- ✅ Comprehensive documentation
- ✅ Connection utility for Node.js

### Frontend
- ✅ React with TypeScript
- ✅ React Router for navigation
- ✅ Tailwind CSS styling
- ✅ 7 main pages + components
- ✅ Responsive design

### Backend Foundation
- ✅ Database connection pool
- ✅ Sample API routes (healers, bookings)
- ✅ Transaction handling
- ✅ Query utilities

## 🚀 Quick Start (5 minutes)

```bash
# 1. Install dependencies
npm install

# 2. Set up database
mysql -u root -p < database/schema.sql
mysql -u root -p avenrae_db < database/seed.sql

# 3. Create .env file
cat > .env << EOF
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=yourpass
DB_NAME=avenrae_db
EOF

# 4. Start dev server
npm run dev

# Visit http://localhost:5174
```

## 📊 Key Entities

### Users
- Clients - People booking services
- Healers - Service providers
- Admins - Platform managers

### Services
- Consultations (therapy, counselling)
- Healings (energy work, reiki)
- Readings (tarot, mediumship)
- Workshops (group training)

### Healer Types
1. **Psychologist** - Mental health professionals
2. **Optometrist** - Eye care specialists
3. **Counsellor** - Life coaches
4. **Spiritual Healer** - Energy practitioners
5. **Medium** - Spirit communicators
6. **Prophet** - Spiritual guides

### Products
- Crystals & stones
- Books & guides
- Tools (tarot, singing bowls)
- Supplements & oils
- Apparel (mats, cushions)

## 🗂️ File Structure

```
database/
├── schema.sql          # Create tables
├── seed.sql            # Add sample data
├── README.md           # Full documentation
└── config.example.env  # Configuration

src/
├── pages/              # Page components
├── components/         # Shared components
├── database/           # DB connection
├── api/routes/         # API endpoints
├── App.tsx             # Main app
└── main.tsx            # Entry point
```

## 📍 Routes

### Frontend
| Route | Purpose |
|-------|---------|
| `/` | Home/landing page |
| `/healers` | Browse healers |
| `/prophets` | Prophets directory |
| `/mediums` | Mediums directory |
| `/events` | Events listing |
| `/support` | Help center |
| `/store` | E-commerce |

### Backend (To implement)
| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/api/healers` | List healers |
| POST | `/api/bookings` | Create booking |
| GET | `/api/products` | List products |
| POST | `/api/orders` | Create order |

## 💾 Database Tables (By Category)

### User Management (3)
- users, healers, clients

### Services (4)
- services, products, events, event_registrations

### Transactions (5)
- bookings, orders, order_items, shopping_carts, cart_items

### Communication (4)
- conversations, messages, support_tickets, notifications

### Community (3)
- reviews, favorite_healers, wishlist_items

### Operations (8)
- transactions, coupons, coupon_usage, healer_availability, blocked_dates, audit_logs, system_logs, platform_settings

## 🔑 Important Fields

### Booking
- `booking_date` - Appointment time
- `status` - pending, confirmed, completed, cancelled
- `payment_status` - unpaid, paid, refunded
- `total_price` - Final price after discounts

### Order
- `order_number` - Unique order ID
- `status` - pending, processing, shipped, delivered
- `total_amount` - Final order total

### Healer
- `healer_type` - Specialization
- `hourly_rate` - Price per hour
- `rating` - 0-5 stars
- `availability_status` - available, busy, offline

## 🔄 Sample Data

### Clients (5)
- Thandi Molefe, Lerato Khumalo, Sipho Nkosi, Zara Dlamini, James Okonkwo

### Healers (6)
- Dr. Lerato (Psychologist) - R450/hr
- Dr. Sipho (Optometrist) - R300/hr
- Nandi (Counsellor) - R250/hr
- Thabo (Spiritual Healer) - R200/hr
- Amara (Medium) - R350/hr
- Prophet David - R300/hr

### Services
- Individual Therapy: 60 min, R450
- Energy Healing: 60 min, R200
- Spirit Reading: 60 min, R350

### Products
- Crystals: R45-R120
- Books: R250-R320
- Tools: R120-R800

## 🛠️ Development Commands

```bash
# Install packages
npm install

# Start dev server
npm run dev

# Build for production
npm build

# Run linter
npm run lint

# Type check
npx tsc --noEmit

# Format code
npx prettier --write .
```

## 📝 Common Queries

### Get top-rated healers
```sql
SELECT * FROM healers 
WHERE is_verified_healer = TRUE 
ORDER BY rating DESC LIMIT 10;
```

### Get upcoming bookings
```sql
SELECT * FROM bookings 
WHERE booking_date > NOW() 
AND status IN ('pending', 'confirmed')
ORDER BY booking_date ASC;
```

### Get client booking history
```sql
SELECT b.*, s.service_name, u.first_name, u.last_name
FROM bookings b
JOIN services s ON b.service_id = s.id
JOIN healers h ON b.healer_id = h.id
JOIN users u ON h.user_id = u.id
WHERE b.client_id = 1
ORDER BY b.booking_date DESC;
```

## 🔒 Security Features

- ✅ SQL injection prevention (parameterized queries)
- ✅ Password hashing (bcrypt)
- ✅ Transaction safety (rollback on error)
- ✅ Audit logging
- ✅ Input validation
- ✅ Error handling

## ⚠️ Common Issues

### Port 5173 already in use
```bash
# Kill process on macOS/Linux
lsof -i :5173 | grep LISTEN | awk '{print $2}' | xargs kill -9

# Kill process on Windows
netstat -ano | findstr :5173
taskkill /PID <PID> /F
```

### Database connection error
```bash
# Test MySQL connection
mysql -u root -p -h localhost

# Check database exists
mysql -u root -p -e "SHOW DATABASES;" | grep avenrae_db
```

### Import error
```bash
# Reinstall node_modules
rm -rf node_modules
npm install
```

## 📚 Documentation Files

| File | Purpose |
|------|---------|
| `IMPLEMENTATION_GUIDE.md` | Complete guide (you're reading it!) |
| `database/README.md` | Database documentation |
| `database/INDEX.md` | Database overview |
| `database/schema.sql` | SQL schema |
| `database/seed.sql` | Sample data |

## 🎓 Learning Path

1. ✅ Understand the platform concept
2. ✅ Review database schema
3. ✅ Set up local development
4. ✅ Explore sample data
5. 🔄 Implement authentication
6. 🔄 Build API endpoints
7. 🔄 Connect frontend to backend
8. 🔄 Add payment processing
9. 🔄 Deploy to production

## 💡 Tips

- Use `npm run dev` to auto-reload on changes
- Check browser console for React errors
- Check terminal for database errors
- Use MySQL Workbench for database exploration
- Enable query logging in `.env` for debugging

## 🔗 Useful Links

- React Router: https://reactrouter.com
- Tailwind CSS: https://tailwindcss.com
- MySQL Docs: https://dev.mysql.com/doc/
- Node.js: https://nodejs.org

## ✅ Implementation Checklist

### Phase 1: Foundation (Done)
- [x] Database schema
- [x] Sample data
- [x] Frontend routing
- [x] Tailwind styling
- [x] Database utilities

### Phase 2: Backend (To Do)
- [ ] Authentication system
- [ ] API endpoints
- [ ] Payment processing
- [ ] Email notifications
- [ ] Image uploads

### Phase 3: Features (To Do)
- [ ] Admin dashboard
- [ ] Search/filtering
- [ ] Real-time chat
- [ ] Advanced analytics
- [ ] Mobile app

### Phase 4: Production (To Do)
- [ ] Deploy backend
- [ ] Deploy frontend
- [ ] CDN setup
- [ ] Domain/SSL
- [ ] Monitoring
- [ ] Backups

---

**Ready to build?** Start with the dev server and explore the sample data!

```bash
npm run dev
# Visit http://localhost:5174
# Explore the pages and components
```
