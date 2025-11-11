# 🌟 Avenrae Platform - Complete Setup

> A digital sanctuary connecting spiritual healers with seekers of wellness, healing, and transformation.

## 📚 Documentation

Start here based on your role:

| Role | Document | Purpose |
|------|----------|---------|
| **Developer** | [QUICK_START.md](./QUICK_START.md) | 5-minute setup guide |
| **Full Setup** | [IMPLEMENTATION_GUIDE.md](./IMPLEMENTATION_GUIDE.md) | Complete walkthrough |
| **Database** | [database/README.md](./database/README.md) | Database details |
| **Overview** | [SETUP_COMPLETE.md](./SETUP_COMPLETE.md) | What's been created |

## 🚀 Quick Start

```bash
# 1. Set up database
mysql -u root -p < database/schema.sql
mysql -u root -p avenrae_db < database/seed.sql

# 2. Create .env file
cp database/config.example.env .env
# Edit .env with your DB credentials

# 3. Install & run
npm install
npm run dev

# 4. Visit http://localhost:5174
```

## 📦 What's Included

### Database
- ✅ **32 SQL Tables** - Complete schema with relationships
- ✅ **Sample Data** - 5 clients, 6 healers, 14 services, 14 products, 6 events
- ✅ **Documentation** - Complete database guide
- ✅ **Connection Utility** - Node.js MySQL helper

### Frontend
- ✅ **React Router** - 7 pages with navigation
- ✅ **Responsive Design** - Tailwind CSS styling
- ✅ **Components** - Header with navigation
- ✅ **TypeScript** - Type-safe React

### Backend
- ✅ **Connection Pool** - MySQL/Node.js integration
- ✅ **API Routes** - Sample healers & bookings endpoints
- ✅ **Error Handling** - Transaction rollback & logging
- ✅ **Query Utilities** - Parameterized queries

## 🎯 Platform Features

### For Clients
- Browse healers by specialization and rating
- Book appointments with integrated calendar
- Register for community events
- Shop healing products (crystals, books, tools)
- Leave reviews and save favorites
- Track booking history

### For Healers
- Create and manage services
- Set availability schedules
- View upcoming bookings
- Track earnings
- Respond to reviews
- Organize events

### For Admin
- User management
- Platform analytics
- Support ticket management
- Configuration settings
- Audit logging

## 📊 Database Structure

### 8 Core Categories
1. **User Management** (3 tables) - Accounts and profiles
2. **Services** (4 tables) - Offerings and marketplace
3. **Transactions** (5 tables) - Bookings and orders
4. **Communication** (4 tables) - Messaging and support
5. **Community** (3 tables) - Reviews and favorites
6. **Commerce** (2 tables) - Shopping and carts
7. **Operations** (3 tables) - Scheduling and availability
8. **System** (1 table) - Configuration and logging

**Total: 32 tables, 1000+ lines of SQL, comprehensive documentation**

## 🛣️ Routes

### Frontend Pages
- `/` - Home/landing
- `/healers` - Browse healers
- `/prophets` - Prophets
- `/mediums` - Mediums
- `/events` - Events
- `/support` - Help center
- `/store` - E-commerce
- `*` - 404 page

### Backend API (To be built)
- `GET /api/healers` - List healers
- `GET /api/healers/:id` - Healer details
- `POST /api/bookings` - Create booking
- `GET /api/products` - List products
- `POST /api/orders` - Create order

## 💾 Sample Data

### Users
- 5 Clients ready for booking
- 6 Healers with specializations:
  - Psychologist (Dr. Lerato) - R450/hr
  - Optometrist (Dr. Sipho) - R300/hr
  - Counsellor (Nandi) - R250/hr
  - Spiritual Healer (Thabo) - R200/hr
  - Medium (Amara) - R350/hr
  - Prophet (David) - R300/hr

### Services (14)
- Therapy and counselling
- Energy healing and reiki
- Mediumship and readings
- Workshops and training
- Life coaching
- Price range: R120-R600

### Products (14)
- Crystals (R45-R120)
- Books (R250-R320)
- Tools (R120-R800)
- Supplements (R85-R120)
- Apparel (R180-R450)

### Events (6)
- Workshops
- Circles
- Retreats
- Festivals
- Nov-Dec 2025 schedule

## 🔐 Security

- ✅ SQL Injection prevention (parameterized queries)
- ✅ Password hashing ready (bcrypt)
- ✅ Transaction safety (rollback on error)
- ✅ Audit logging
- ✅ Input validation
- ✅ Error handling

## 📁 Project Structure

```
avenrae/
├── database/              # Database setup
│   ├── schema.sql        # 1000+ lines of SQL
│   ├── seed.sql          # Sample data
│   ├── README.md         # Detailed docs
│   └── config.example.env
├── src/
│   ├── pages/            # React pages (7)
│   ├── components/        # Components
│   ├── database/         # DB utilities
│   ├── api/              # API routes
│   ├── App.tsx           # Main app
│   └── main.tsx          # Entry point
├── QUICK_START.md        # 5-min setup
├── IMPLEMENTATION_GUIDE.md # Full guide
└── SETUP_COMPLETE.md     # What's included
```

## ⚡ Development Commands

```bash
npm install              # Install packages
npm run dev             # Start dev server
npm run build           # Build for production
npm run lint            # Run linter
```

## 🎓 Learning Resources

### Documentation
- [Database Guide](./database/README.md) - SQL, schemas, queries
- [Implementation Guide](./IMPLEMENTATION_GUIDE.md) - Architecture, setup
- [Quick Start](./QUICK_START.md) - 5-minute setup

### Code Examples
- Sample API routes in `src/api/routes/`
- Database utilities in `src/database/db.js`
- React components in `src/components/` and `src/pages/`

## 🐛 Troubleshooting

### Database Connection
```bash
# Test MySQL
mysql -u root -p -h localhost -e "SELECT 1;"

# Check database exists
mysql -u root -p -e "SHOW DATABASES;" | grep avenrae
```

### Port Already in Use
```bash
# macOS/Linux
lsof -i :5174 | grep LISTEN | awk '{print $2}' | xargs kill -9

# Windows
netstat -ano | findstr :5174
taskkill /PID <PID> /F
```

## 📊 Statistics

### Database
- 32 Tables
- 50+ Relationships
- 100+ Indexes
- 10+ Constraints

### Code
- 1000+ lines of SQL
- 600+ lines of seed data
- 7 React pages
- 3 Database utilities
- 2 Sample API modules

### Documentation
- 4 Comprehensive guides
- 1000+ lines of docs
- Code examples
- Troubleshooting guide

### Sample Data
- 11 User accounts
- 14 Services
- 14 Products
- 6 Events
- 5 Bookings
- 3 Reviews

## ✅ Next Steps

1. **Set up database** - Run schema.sql and seed.sql
2. **Install packages** - `npm install`
3. **Configure environment** - Create .env file
4. **Run dev server** - `npm run dev`
5. **Explore sample data** - View in MySQL
6. **Build API endpoints** - Connect to database
7. **Add authentication** - User login/register
8. **Implement payments** - Payment gateway
9. **Deploy** - Production setup

## 🚀 What's Next?

### Phase 1: Backend APIs
- [ ] Authentication (JWT/OAuth)
- [ ] User endpoints
- [ ] Payment processing
- [ ] Email notifications

### Phase 2: Frontend Integration
- [ ] Connect to APIs
- [ ] Add forms
- [ ] Build dashboard
- [ ] Checkout flow

### Phase 3: Advanced Features
- [ ] Real-time chat
- [ ] Video calls
- [ ] Analytics
- [ ] Recommendations

### Phase 4: Production
- [ ] Deploy backend
- [ ] Deploy frontend
- [ ] Set up monitoring
- [ ] Configure backups

## 📞 Support Resources

- **Documentation**: See files in root directory
- **Database Help**: See `database/README.md`
- **Quick Setup**: See `QUICK_START.md`
- **Full Guide**: See `IMPLEMENTATION_GUIDE.md`

## 📝 File Reference

| File | Purpose | Size |
|------|---------|------|
| `database/schema.sql` | Database schema | 1000+ lines |
| `database/seed.sql` | Sample data | 600+ lines |
| `database/README.md` | Database docs | Comprehensive |
| `src/database/db.js` | Connection utility | 150+ lines |
| `src/api/routes/*.js` | API endpoints | 200+ lines |
| `IMPLEMENTATION_GUIDE.md` | Full guide | Comprehensive |
| `QUICK_START.md` | Quick setup | Concise |

## 🎯 Success Criteria

You'll know you've got it right when:
- ✅ Database imports without errors
- ✅ Dev server starts on port 5174
- ✅ All pages are accessible
- ✅ Sample data loads in MySQL
- ✅ Navigation between pages works
- ✅ No console errors
- ✅ TypeScript compilation passes

## 💡 Pro Tips

1. **Enable query logging** - Uncomment in db.js to debug
2. **Use MySQL Workbench** - Visual database explorer
3. **Test queries first** - Before adding to backend
4. **Keep backups** - Export database regularly
5. **Use transactions** - For multi-step operations
6. **Add indexes** - Already included for performance

## 📄 License

Proprietary - Avenrae Platform 2025

## 👥 Contributors

Built as a complete platform for the Avenrae spiritual wellness community.

---

**Ready to get started? Run this:**

```bash
npm run dev
```

**Then visit:** http://localhost:5174

**Enjoy building with Avenrae! 🌟**
