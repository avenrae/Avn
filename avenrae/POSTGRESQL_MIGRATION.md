# PostgreSQL Migration Guide for Avenrae

## Quick Start for Existing Projects

If you're migrating from SQLite or another database, this guide explains the process.

---

## 1. Setup PostgreSQL

### Option A: Local Development

```bash
# macOS (Homebrew)
brew install postgresql@15
brew services start postgresql@15

# Create database and user
createuser avenrae_user -P
createdb -O avenrae_user avenrae_dev

# Enable PostGIS
psql -U postgres -d avenrae_dev -c "CREATE EXTENSION postgis;"
```

### Option B: Docker (Recommended)

```bash
# Create docker-compose.yml
version: '3.8'

services:
  postgres:
    image: postgis/postgis:15-3.3
    environment:
      POSTGRES_USER: avenrae_user
      POSTGRES_PASSWORD: secure_password
      POSTGRES_DB: avenrae_dev
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  pgadmin:
    image: dpage/pgadmin4
    environment:
      PGADMIN_DEFAULT_EMAIL: admin@avenrae.com
      PGADMIN_DEFAULT_PASSWORD: admin
    ports:
      - "5050:80"

volumes:
  postgres_data:
```

```bash
# Start services
docker-compose up -d

# Access pgAdmin at http://localhost:5050
```

---

## 2. Update Application Configuration

### Update package.json

```json
{
  "dependencies": {
    "@prisma/client": "^5.7.0",
    "bcrypt": "^5.1.1",
    "jsonwebtoken": "^9.1.2",
    "axios": "^1.6.0"
  },
  "devDependencies": {
    "prisma": "^5.7.0",
    "@types/node": "^20.0.0"
  },
  "scripts": {
    "prisma:migrate": "prisma migrate dev",
    "prisma:studio": "prisma studio",
    "prisma:seed": "ts-node prisma/seed.ts",
    "prisma:reset": "prisma migrate reset"
  }
}
```

### Create .env

```env
DATABASE_URL="postgresql://avenrae_user:secure_password@localhost:5432/avenrae_dev"
NODE_ENV="development"
JWT_SECRET="change-this-to-a-secure-random-string"
```

---

## 3. Migration Paths

### Path A: Fresh Start (Recommended)

```bash
# 1. Install dependencies
npm install

# 2. Create initial migration
npx prisma migrate dev --name init

# 3. This creates all tables from schema.prisma
# 4. Seed with sample data
npm run prisma:seed

# 5. Verify in Prisma Studio
npx prisma studio
# Opens http://localhost:5555 to view data
```

### Path B: Migrate Existing SQLite Database

```bash
# 1. Export SQLite data to CSV
sqlite3 your_old.db <<EOF
.mode csv
.output users.csv
SELECT * FROM users;
.output practitioners.csv
SELECT * FROM practitioners;
EOF

# 2. Create PostgreSQL tables with Prisma
npx prisma migrate dev --name init

# 3. Import CSVs using pgAdmin or psql
psql -U avenrae_user -d avenrae_dev -c "
  COPY users(id, email, password_hash, first_name, last_name, phone, role, created_at)
  FROM '/path/to/users.csv' CSV HEADER;
"

# 4. Verify data integrity
npx prisma studio
```

### Path C: Introspect Existing PostgreSQL

If you already have PostgreSQL with data:

```bash
# 1. Point Prisma to existing database
# Update .env DATABASE_URL to your PostgreSQL

# 2. Generate schema.prisma from existing database
npx prisma db pull

# 3. This creates a schema.prisma matching your DB structure
# 4. Review and adjust as needed
# 5. Generate Prisma Client
npx prisma generate
```

---

## 4. Testing the Migration

### Verify PostgreSQL Connection

```bash
# From project root
node -e "require('dotenv').config(); console.log(process.env.DATABASE_URL)"

# Should output your database URL
```

### Test Prisma Connection

```typescript
// test-db.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  try {
    // Create test user
    const user = await prisma.user.create({
      data: {
        email: 'test@example.com',
        passwordHash: 'hashed_password',
        firstName: 'Test',
        lastName: 'User',
        phone: '+27123456789',
        role: 'client',
      },
    });
    
    console.log('✅ Database connected! User created:', user.id);
    
    // Clean up
    await prisma.user.delete({ where: { id: user.id } });
  } catch (error) {
    console.error('❌ Database error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
```

```bash
# Run test
npx ts-node test-db.ts
```

---

## 5. Common Migration Issues

### Issue: Extension postgis does not exist

```bash
# Solution: Enable PostGIS
psql -U postgres -d avenrae_dev
CREATE EXTENSION postgis;
CREATE EXTENSION postgis_topology;
\dx  # Verify
```

### Issue: Column types don't match

Edit `prisma/schema.prisma` to match your existing columns:

```prisma
model User {
  id        String     @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  email     String     @unique
  // Adjust field types as needed
}
```

Then:
```bash
npx prisma db pull  # Re-sync
```

### Issue: Foreign key constraints fail

```bash
# Temporarily disable constraints during import
ALTER TABLE bookings DISABLE TRIGGER ALL;
-- Import data
ALTER TABLE bookings ENABLE TRIGGER ALL;
```

---

## 6. Backup & Disaster Recovery

### Create Database Backup

```bash
# Full backup
pg_dump avenrae_dev > backup_$(date +%Y%m%d_%H%M%S).sql

# Compressed backup (smaller file)
pg_dump -Fc avenrae_dev > backup_$(date +%Y%m%d_%H%M%S).dump
```

### Restore from Backup

```bash
# Restore SQL
psql avenrae_dev < backup_20250115_120000.sql

# Restore compressed
pg_restore -d avenrae_dev backup_20250115_120000.dump
```

### Automated Daily Backups (Linux/macOS)

Create `backup.sh`:

```bash
#!/bin/bash

BACKUP_DIR="/path/to/backups"
DB_NAME="avenrae_dev"
DB_USER="avenrae_user"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)

# Create backup
pg_dump -U $DB_USER $DB_NAME | gzip > $BACKUP_DIR/backup_$TIMESTAMP.sql.gz

# Keep only last 30 backups
find $BACKUP_DIR -name "backup_*.sql.gz" -mtime +30 -delete

echo "Backup completed: backup_$TIMESTAMP.sql.gz"
```

Add to crontab:

```bash
# Run daily at 2 AM
crontab -e
0 2 * * * /path/to/backup.sh
```

---

## 7. Performance Tuning

### PostgreSQL Configuration

Edit `/usr/local/var/postgres/postgresql.conf` (macOS):

```conf
# Increase shared buffers
shared_buffers = 256MB

# Enable query parallelization
max_parallel_workers_per_gather = 4

# Improve sorting
work_mem = 64MB

# Enable JIT compilation for complex queries
jit = on
```

### Index Analysis

```bash
# Find missing indexes
SELECT * FROM pg_stat_user_tables WHERE idx_scan = 0;

# Analyze table stats
ANALYZE users;
ANALYZE practitioners;
ANALYZE bookings;
```

---

## 8. Monitoring & Maintenance

### Check Database Size

```sql
-- Overall database size
SELECT pg_database.datname, pg_size_pretty(pg_database_size(pg_database.datname)) 
FROM pg_database;

-- Individual table sizes
SELECT relname, pg_size_pretty(pg_total_relation_size(relid))
FROM pg_stat_user_tables
ORDER BY pg_total_relation_size(relid) DESC;
```

### View Active Connections

```sql
SELECT datname, usename, application_name, state
FROM pg_stat_activity;

-- Kill idle connections
SELECT pg_terminate_backend(pid)
FROM pg_stat_activity
WHERE state = 'idle' AND query_start < NOW() - INTERVAL '1 hour';
```

### Vacuum & Analyze (Maintenance)

```bash
# Run maintenance jobs (once weekly)
VACUUM ANALYZE;

# Full vacuum (intensive, run off-peak)
VACUUM FULL;
```

---

## 9. Production Deployment

### RDS (AWS) Setup

```
1. Create RDS PostgreSQL instance (15.x)
2. Enable PostGIS extension in parameter group
3. Note the endpoint URL
4. Update .env in production:
   DATABASE_URL="postgresql://user:password@avenrae-db.c123456.us-east-1.rds.amazonaws.com:5432/avenrae_prod"
5. Deploy backend
6. Run migrations: npx prisma migrate deploy
7. Monitor with CloudWatch
```

### Railway/Render Setup

```bash
# Railway
1. Create PostgreSQL database
2. Copy DATABASE_URL from Railway dashboard
3. Deploy app with environment variable
4. Migrations run automatically on deploy

# Render
1. Create PostgreSQL instance
2. Attach to web service
3. Migrations run on deploy (add build script: npx prisma migrate deploy)
```

---

## 10. Database Migration Checklist

- [ ] PostgreSQL installed and running
- [ ] PostGIS extension enabled
- [ ] `.env` configured with DATABASE_URL
- [ ] `prisma/schema.prisma` in place
- [ ] Prisma client installed: `npm install @prisma/client`
- [ ] Initial migration created: `npx prisma migrate dev --name init`
- [ ] Sample data seeded: `npm run prisma:seed`
- [ ] Verified in Prisma Studio: `npx prisma studio`
- [ ] Backend API endpoints implemented
- [ ] Frontend Auth connected to backend
- [ ] Payment processing (Stripe) configured
- [ ] Backups configured
- [ ] Monitoring set up (New Relic, DataDog, etc.)

---

## Resources

- PostgreSQL Docs: https://www.postgresql.org/docs/
- PostGIS Docs: https://postgis.net/documentation/
- Prisma Docs: https://www.prisma.io/docs/
- Docker PostgreSQL: https://hub.docker.com/_/postgres/
- AWS RDS: https://aws.amazon.com/rds/postgresql/

**Status**: Ready for PostgreSQL migration ✅
