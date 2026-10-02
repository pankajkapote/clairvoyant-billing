# Supabase Quick Reference & Comparison Guide

## 📊 Supabase vs PostgreSQL vs Other Options

### Feature Comparison Table

| Feature | Supabase | AWS RDS | Self-Hosted | Railway | DigitalOcean |
|---------|----------|---------|-------------|---------|--------------|
| **PostgreSQL Version** | 13+ ✅ | 13+ ✅ | 13+ ✅ | 13+ ✅ | 13+ ✅ |
| **Setup Time** | 5 min ⚡ | 30 min | 60+ min | 10 min | 15 min |
| **Monthly Cost** | $0-25 | $50+ | $0 + hosting | $20+ | $25+ |
| **Auto-Scaling** | ✅ | ✅ | ❌ | ✅ | ❌ |
| **Automatic Backups** | ✅ Daily | ✅ Daily | ❌ Manual | ✅ Daily | ✅ Daily |
| **High Availability** | ✅ | ✅ | ❌ | ✅ | ✅ |
| **DevOps Required** | ❌ Zero | ⚠️ Some | ✅ Full | ❌ Minimal | ⚠️ Some |
| **Free Tier** | ✅ 500MB | ❌ No | ✅ (hosting cost) | ⚠️ Limited | ❌ No |
| **Best For** | Startups | Enterprise | Learning | Growth | SMB |

---

## 🚀 Supabase vs Firebase Comparison

| Aspect | Supabase | Firebase |
|--------|----------|----------|
| **Database** | PostgreSQL | NoSQL (Firestore) |
| **SQL Support** | ✅ Full SQL | ⚠️ Limited |
| **Learning Curve** | Easy (PostgreSQL) | Steep (NoSQL) |
| **Cost** | $0-25/mo | $0-100+/mo (higher for scale) |
| **Best For** | Relational data (invoices) | Real-time apps |
| **for Clairvoyant** | ✅ PERFECT | ❌ Not ideal |

**Verdict**: Supabase is **better for invoicing** (relational data)

---

## 💾 Database Connection Guide

### Development (Local Testing)

```bash
# .env.local for local development
DATABASE_URL=postgresql://postgres:password@localhost:5432/clairvoyant

# Or Supabase direct connection
DATABASE_URL=postgresql://postgres:password@xxxxx.supabase.co:5432/postgres
```

### Production (Vercel)

```bash
# Use POOLER for serverless (Vercel, Lambda, etc.)
DATABASE_URL=postgresql://postgres:password@xxxxx.pooler.supabase.com:6543/postgres

# Why POOLER?
# - Connection pooling for serverless
# - Handles temporary connections better
# - Lower latency for short-lived functions
```

### Always-On Server (EC2, Railway)

```bash
# Direct connection for servers
DATABASE_URL=postgresql://postgres:password@xxxxx.supabase.co:5432/postgres

# Why Direct?
# - Persistent connections
# - Better for long-running processes
# - Lower overhead
```

---

## 🔑 Connection String Breakdown

```
postgresql://username:password@host:port/database

Supabase Example:
postgresql://postgres:Clairvoyant@2026#SecureDB@abc123.supabase.co:5432/postgres
                 |         |                    |                    |    |  
                 user    password                host                port database
```

### Finding Your Connection String

```
Supabase Dashboard:
├─ Your Project
├─ Settings (⚙️)
├─ Database
├─ Connection string
│  ├─ URI mode ← Select this
│  └─ Copy this value
└─ For production: Connection pooling → Pooler
```

---

## 🛠️ Common Supabase Operations

### Create New Table

**In Supabase Studio (SQL Editor)**:
```sql
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  price DECIMAL(10, 2),
  created_at TIMESTAMP DEFAULT NOW()
);
```

### Insert Data

```sql
INSERT INTO products (name, price) 
VALUES ('Influencer Campaign', 10000);
```

### Query Data

```sql
SELECT * FROM products WHERE price > 5000;
```

### Update Data

```sql
UPDATE products SET price = 12000 WHERE id = 'xxx';
```

### Delete Data

```sql
DELETE FROM products WHERE id = 'xxx';
```

---

## 🔐 Security Best Practices

### 1. **Environment Variables**

```env
# ✅ GOOD - Use environment variables
DATABASE_URL=postgresql://...

# ❌ BAD - Hardcoded connections
const db = 'postgresql://...'; // Never do this!
```

### 2. **Connection String Safety**

```bash
# ✅ GOOD - Don't commit .env.local
echo ".env.local" >> .gitignore

# ✅ GOOD - Use Vercel/Heroku environment variables
# Vercel Dashboard → Settings → Environment Variables

# ❌ BAD - Commit .env to GitHub
git commit .env.local  # Never!
```

### 3. **Row-Level Security (RLS)**

For multi-tenant applications:

```sql
-- Enable RLS on table
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;

-- Create policy (example)
CREATE POLICY "Tenant isolation" ON invoices
  USING (tenant_id = auth.uid());
```

### 4. **Database Passwords**

```bash
# ✅ GOOD - Strong password
Supabase@2026#SecureDB!

# ❌ BAD - Weak password
password123
```

---

## 📈 Performance Optimization

### Query Optimization

```sql
-- ✅ GOOD - Use indexes
CREATE INDEX idx_invoices_tenant_date ON invoices(tenant_id, invoice_date);
SELECT * FROM invoices WHERE tenant_id = 'xxx' AND invoice_date > '2026-01-01';

-- ❌ BAD - No indexes
SELECT * FROM invoices WHERE notes LIKE '%something%';
```

### Connection Pooling

```
Without pooling:
- New connection per request
- Slow (setup overhead)
- Crashes with many requests

With pooling (POOLER):
- Reuse connections
- Fast
- Handles 1000+ concurrent

Use .pooler.supabase.com in production!
```

### Pagination

```javascript
// ✅ GOOD - Pagination
const page = 1;
const limit = 20;
const offset = (page - 1) * limit;

const { data } = await supabase
  .from('invoices')
  .select()
  .range(offset, offset + limit);

// ❌ BAD - Load all records
const { data } = await supabase.from('invoices').select();
```

---

## 🔄 Backup & Recovery

### Automatic Backups

Supabase automatically backs up your database:
```
Free Tier: Daily backups
Pro Tier: Hourly backups
```

### Manual Backup

```bash
# Download backup
pg_dump -h [HOST] -U postgres -d postgres > backup.sql

# Upload to safe location
aws s3 cp backup.sql s3://your-backup-bucket/

# Or use Google Drive, Dropbox, etc.
```

### Restore from Backup

```bash
# Restore from file
psql -h [HOST] -U postgres -d postgres < backup.sql
```

---

## 🚨 Troubleshooting Common Issues

### Issue 1: "FATAL: remaining connection slots reserved for non-replication superuser connections"

**Cause**: Too many connections

**Solution**:
```bash
# 1. Switch to POOLER connection
# DATABASE_URL should have .pooler.supabase.com

# 2. Or increase connection limit in Supabase
# Settings → Database → Connection pooling
# Increase "Max connections" to 50-100
```

### Issue 2: "Operator does not exist: text ~~ text"

**Cause**: LIKE operator not supported in certain contexts

**Solution**:
```sql
-- ❌ Bad
WHERE name LIKE 'invoice%';

-- ✅ Good
WHERE name ILIKE 'invoice%';  -- Case-insensitive
```

### Issue 3: "Permission denied for schema public"

**Cause**: User doesn't have permissions

**Solution**:
```sql
-- Grant permissions
GRANT USAGE ON SCHEMA public TO postgres;
GRANT CREATE ON SCHEMA public TO postgres;
```

### Issue 4: "Subscriptions not working"

**Cause**: Real-time subscriptions disabled

**Solution**:
```javascript
// Enable real-time subscriptions in Supabase Studio
// Replication → Add table → Enable for real-time

// Then use
const subscription = supabase
  .from('invoices')
  .on('*', payload => console.log(payload))
  .subscribe();
```

---

## 📊 Monitoring Dashboard

### Supabase Studio Metrics

```
Supabase Dashboard → Your Project:
├─ Home
│  ├─ Database size
│  ├─ Connections count
│  └─ API requests
├─ Settings
│  ├─ Usage (database, bandwidth, users)
│  ├─ Database (performance, logs)
│  └─ Backups (backup history)
└─ SQL Editor (run queries)
```

### Key Metrics to Monitor

```
Daily:
├─ Database size (should grow slowly)
├─ Connection count (should be < 20 most times)
└─ Error logs (should be 0)

Weekly:
├─ Query performance
├─ Storage usage
└─ Backup completion

Monthly:
├─ Plan upgrade needs
├─ Performance optimization
└─ Security audit
```

---

## 🎯 Scaling Strategy

### Phase 1: Startup ($0/month)
```
Configuration:
├─ Database: Supabase Free (500 MB)
├─ App: Vercel Free
├─ Users: 1-5
└─ Invoices: 0-1,000

Timeline: 0-6 months
```

### Phase 2: Growth ($45-65/month)
```
Configuration:
├─ Database: Supabase Pro ($25)
├─ App: Vercel Pro ($20)
├─ Email: SendGrid ($0-20)
├─ Users: 5-20
└─ Invoices: 1,000-100,000

Timeline: 6-18 months
```

### Phase 3: Scale ($300-700/month)
```
Configuration:
├─ Database: Supabase Custom ($100-500)
├─ App: Vercel Pro ($20)
├─ Email: SendGrid paid ($50-200)
├─ CDN: Cloudflare ($20)
├─ Users: 20-500
└─ Invoices: 100,000+

Timeline: 18+ months
```

---

## 🎓 Learning Resources

### Supabase Official
- **Docs**: https://supabase.com/docs
- **Tutorials**: https://supabase.com/learn
- **Discord**: https://discord.supabase.io

### PostgreSQL
- **PostgreSQL Docs**: https://www.postgresql.org/docs/13/
- **SQL Tutorial**: https://www.w3schools.com/sql/
- **Advanced SQL**: https://mode.com/sql-tutorial/

### Free Tools
- **pgAdmin**: Database management UI
- **DBeaver**: Universal database tool
- **Adminer**: Web-based SQL client

---

## ⚡ Pro Tips

### Tip 1: Use Supabase CLI for Local Development
```bash
# Install Supabase CLI
npm install -g supabase

# Start local Supabase instance
supabase start

# Reset database
supabase db reset
```

### Tip 2: Use Supabase Vectors for Search
```sql
-- For advanced invoice search
CREATE TABLE invoice_search (
  id UUID PRIMARY KEY,
  embedding vector(1536),
  ...
);
```

### Tip 3: Set Up Replication for High Availability
```
Supabase Pro plan includes:
├─ Automated replication
├─ Read replicas
└─ Multi-region backup
```

### Tip 4: Monitor Query Performance
```sql
-- See slow queries
SELECT query, mean_time FROM pg_stat_statements
ORDER BY mean_time DESC
LIMIT 10;
```

### Tip 5: Use Database Functions for Complex Logic
```sql
-- Create function for GST calculation
CREATE FUNCTION calculate_gst(amount DECIMAL, rate DECIMAL)
RETURNS DECIMAL AS $$
  SELECT amount * rate;
$$ LANGUAGE SQL;

-- Use in queries
SELECT calculate_gst(10000, 0.18) AS gst_amount;
```

---

## 🆚 Supabase vs Your Alternatives

### If you're coming from MySQL
```
PostgreSQL differences:
- UUID instead of AUTO_INCREMENT
- SERIAL instead of INT AUTO_INCREMENT
- RETURNING keyword for getting inserted IDs
- JSON support (PostgreSQL is better)
- JSONB for advanced queries
```

### If you're coming from MongoDB
```
PostgreSQL differences:
- SQL instead of JavaScript queries
- Tables/schemas instead of collections
- Transactions (PostgreSQL is better)
- ACID compliance (PostgreSQL is better)
- Foreign keys (PostgreSQL is better)
```

### If you're coming from Firebase
```
Supabase advantages:
- True SQL queries
- Better for relational data
- Cheaper at scale
- Full database control
- Open source
```

---

## 📋 Quick Decision Matrix

**Choose Supabase if**:
```
✅ You need relational data (invoices)
✅ You want SQL queries
✅ You're bootstrapping (free tier)
✅ You want to own your data
✅ You need complex relationships
✅ You prefer managed database
```

**Choose self-hosted PostgreSQL if**:
```
✅ You have DevOps team
✅ You need complete control
✅ You have high compliance requirements
✅ You're willing to manage backups
✅ You want zero dependencies
```

**Choose AWS RDS if**:
```
✅ You're already on AWS
✅ You need enterprise support
✅ You have 24/7 ops team
✅ You need multi-region setup
✅ You need SLA guarantees
```

---

## 🎯 Recommendation for Clairvoyant

**Best Setup** = Supabase + Vercel + SendGrid

```
Why?
├─ Supabase = Perfect for invoicing (relational data)
├─ Vercel = Easiest deployment & scaling
├─ SendGrid = Reliable email delivery
└─ Total cost = $0-25/month (amazing value!)

Timeline:
├─ Setup: 30 minutes
├─ Deploy: 15 minutes
├─ Launch: 1 day
└─ Total: < 2 hours to production

Revenue potential:
├─ Year 1: ₹30-50K
├─ Year 2: ₹2-5L
└─ Year 3+: ₹1M+

Profit margins:
├─ Cost: ₹300-500/month
├─ Revenue: ₹2-20L/month
└─ Margin: 99%+ ✅
```

---

## ✅ Final Checklist

- [ ] Read SUPABASE_SETUP.md (detailed guide)
- [ ] Create Supabase account
- [ ] Create project in ap-south-1 (Mumbai)
- [ ] Get connection string
- [ ] Update .env.local
- [ ] Run DATABASE_SCHEMA.sql
- [ ] Test connection locally
- [ ] Deploy to Vercel
- [ ] Test live deployment
- [ ] Set up monitoring
- [ ] Plan backup strategy
- [ ] Start using Clairvoyant!

---

**Status**: ✅ Ready to launch  
**Version**: 1.0.0  
**Last Updated**: August 2026  
**Next Steps**: Go to SUPABASE_SETUP.md for detailed instructions
