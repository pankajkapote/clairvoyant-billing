# 🚀 Clairvoyant SaaS - Installation Guide

**Complete Step-by-Step Installation Instructions**

**Estimated Time**: 5 minutes (demo) → 45 minutes (production)

---

## 📋 What You Need

- ✅ This package (you have it!)
- ✅ Computer with Windows/Mac/Linux
- ✅ Internet connection
- ✅ Text editor (VS Code, Notepad, etc.)
- ✅ 15-30 minutes
- ✅ Optional: GitHub account (for deployment)

---

## 🎯 Installation Options

### **Option A: Demo (Local Only)**
- Time: 5 minutes
- Cost: Free
- Database: In-memory (data resets on refresh)
- Best for: Testing, learning features
- Deployment: Localhost only

### **Option B: Production Ready (Real Database)**
- Time: 30-45 minutes
- Cost: Free (Supabase free tier)
- Database: PostgreSQL (persistent)
- Best for: Real invoicing, testing integrations
- Deployment: Local + optional Vercel

### **Option C: Live on Internet**
- Time: 60 minutes
- Cost: $0 (first month free tier)
- Database: PostgreSQL (persistent)
- Best for: Live business, team collaboration
- Deployment: Internet (Vercel + Supabase)

---

## ✅ OPTION A: Quick Demo (5 minutes)

### Step 1: Extract Files

```
✅ Download all files from this package
✅ Put them in a folder on your computer:
   Windows: C:\Users\YourName\clairvoyant
   Mac:     ~/clairvoyant
   Linux:   ~/clairvoyant
```

### Step 2: Install Node.js (If Not Already Installed)

```
1. Go to: https://nodejs.org/
2. Click "Download LTS" (Green button)
3. Run the installer
4. Click "Next" → "Next" → "Install"
5. Click "Finish"
6. Restart your terminal/command prompt
```

**Verify installation:**
```bash
node --version
npm --version
```

### Step 3: Install Dependencies

```bash
# Open terminal/command prompt
# Navigate to your folder
cd clairvoyant

# Install dependencies
npm install
```

**Expected output:**
```
added XXX packages in XX seconds
```

### Step 4: Start Development Server

```bash
npm run dev
```

**Expected output:**
```
  ▲ Next.js 14.0.0
  - Local:        http://localhost:3000
  
✓ Ready in XX ms
```

### Step 5: Open in Browser

```
1. Open browser
2. Go to: http://localhost:3000
3. Login with:
   Email: admin@clairvoyant.com
   Password: demo123
4. ✅ You're in! Try creating an invoice!
```

---

## ✅ OPTION B: Production Database (45 minutes)

### Prerequisites
- Node.js installed (from Option A, Step 2)
- Supabase account (free)

---

### Step 1: Create Supabase Project

```
1. Go to: https://app.supabase.com
2. Sign up (if new)
   - Click "Sign up"
   - Use email or Google
   - Verify email

3. Click "New Project"

4. Fill in form:
   Organization: (default)
   
   Project name:
   └─ Enter: clairvoyant
   
   Database password:
   └─ Create strong password (12+ characters)
   └─ Example: Clairvoyant@2026#SecureDB!
   └─ ⚠️ SAVE THIS PASSWORD!
   
   Region:
   └─ Select: ap-south-1 (Mumbai) ← IMPORTANT!
   
   Pricing plan:
   └─ Select: Free
   
5. Click "Create new project"

6. Wait 2-5 minutes for database to initialize
   You'll see: "Your project is ready"

7. You're now in Supabase dashboard!
```

---

### Step 2: Get Connection String

```
In Supabase Dashboard:

1. Click "Settings" (⚙️ icon, bottom left)
2. Click "Database" (in left sidebar)
3. Look for "Connection string" section
4. Make sure it shows "URI" format
5. Copy this string:
   
   postgresql://postgres:[PASSWORD]@[HOST].supabase.co:5432/postgres
   
   It looks like:
   postgresql://postgres:Clairvoyant@2026#SecureDB@abc123xyz.supabase.co:5432/postgres

6. ⚠️ SAVE THIS STRING - You'll need it next!
```

---

### Step 3: Initialize Database Schema

```
In Supabase Dashboard:

1. Click "SQL Editor" (left sidebar)
2. Click "+ New query" (top right)
3. Open DATABASE_SCHEMA.sql file
4. Copy ALL the SQL code
5. Paste into Supabase SQL Editor text area
6. Click "Run" (or Ctrl+Enter)
7. Wait for success message:
   ✓ Query executed successfully
   
8. Go to "Table Editor" (left sidebar)
9. Verify you see these tables:
   ✓ tenants
   ✓ users
   ✓ clients
   ✓ invoices
   ✓ invoice_items
   ✓ payments
   ✓ vendors
   ✓ audit_logs
   ✓ org_settings
   ✓ subscription_plans
   ✓ email_templates
   ✓ notifications
   ✓ activity_logs
```

---

### Step 4: Configure Environment Variables

```
On your computer:

1. Open folder: clairvoyant
2. Find file: .env.example
3. Right-click → Rename
4. Change name to: .env.local
5. Open .env.local (right-click → Open with → Notepad)
6. Find this line:
   DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@YOUR_HOST.supabase.co:5432/postgres

7. Replace with YOUR connection string from Step 2
   (Copy the full string you saved)

8. Also update NEXTAUTH_SECRET:
   Open terminal and run:
   
   # macOS/Linux:
   openssl rand -base64 32
   
   # Windows (PowerShell):
   [System.Convert]::ToBase64String([System.Security.Cryptography.RandomNumberGenerator]::GetBytes(32))
   
9. Copy the output
10. In .env.local, find: NEXTAUTH_SECRET=your-super-secret-key...
11. Replace with the generated string
12. Save file

Your .env.local should look like:
   DATABASE_URL=postgresql://postgres:Clairvoyant@2026#SecureDB@abc123xyz.supabase.co:5432/postgres
   NEXTAUTH_SECRET=aB3xC+dE/fGhIjKlMnOpQrStUvWxYzAbCdEfGhIjKl=
   NEXTAUTH_URL=http://localhost:3000
```

---

### Step 5: Install Dependencies

```bash
cd clairvoyant
npm install
```

---

### Step 6: Start Development Server

```bash
npm run dev
```

**Expected output:**
```
  ▲ Next.js 14.0.0
  - Local:        http://localhost:3000
  
✓ Ready in XX ms
```

---

### Step 7: Test Connection

```bash
# Create file: test-db.js
# Copy this code:

const { Client } = require('pg');

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.error('❌ DATABASE_URL not set');
  process.exit(1);
}

console.log('🔍 Testing Supabase connection...');

const client = new Client({
  connectionString: connectionString,
  ssl: { rejectUnauthorized: false }
});

client.connect((err) => {
  if (err) {
    console.error('❌ Connection failed:', err.message);
    process.exit(1);
  }
  
  console.log('✅ Connected to Supabase!');
  
  client.query('SELECT COUNT(*) FROM users', (err, res) => {
    if (err) {
      console.error('❌ Query failed:', err);
      process.exit(1);
    }
    
    console.log('✅ Database query successful!');
    console.log('User count:', res.rows[0].count);
    client.end();
  });
});

# Run it:
node test-db.js

# Expected:
# 🔍 Testing Supabase connection...
# ✅ Connected to Supabase!
# ✅ Database query successful!
# User count: 1
```

---

### Step 8: Open in Browser

```
1. Open browser
2. Go to: http://localhost:3000
3. Login with:
   Email: admin@clairvoyant.com
   Password: demo123
4. Create a test invoice
5. Refresh page (data persists!) ✅
6. Go to Supabase → Table Editor → invoices
7. See your invoice data! ✅
```

✅ **You now have a production-ready app with real database!**

---

## ✅ OPTION C: Deploy to Internet (30 minutes additional)

### Prerequisites
- Completed Option B above
- GitHub account
- Vercel account

---

### Step 1: Push Code to GitHub

```bash
# In your clairvoyant folder:

git init
git add .
git commit -m "Initial commit: Clairvoyant SaaS"

# Go to: https://github.com/new
# Create repository (name: clairvoyant-saas)
# Copy the commands shown
# Then run:

git remote add origin https://github.com/YOUR_USERNAME/clairvoyant-saas.git
git branch -M main
git push -u origin main
```

---

### Step 2: Deploy to Vercel

```
1. Go to: https://vercel.com
2. Sign up or login
3. Click "Import Project"
4. Click "Import from GitHub"
5. Authorize GitHub access
6. Select "clairvoyant-saas" repository
7. Click "Import"

8. Add Environment Variables:
   - Click "Environment Variables"
   
   Add variable:
   Name: DATABASE_URL
   Value: postgresql://postgres:PASSWORD@HOST.pooler.supabase.com:6543/postgres
   
   ⚠️ IMPORTANT: Use .pooler.supabase.com (not .supabase.co)
   
9. Click "Deploy"
10. Wait 2-3 minutes for deployment
11. See: "Congratulations! Your site is deployed"
12. Click "Visit" button
```

✅ **Your app is now live on the internet!**

URL will be: `https://clairvoyant-saas-xxxxx.vercel.app`

---

## 🔍 Verification Checklist

### After Installation, Verify:

```
✅ Demo Mode (Option A):
   [ ] npm run dev works
   [ ] App opens at localhost:3000
   [ ] Login works
   [ ] Can create invoices
   [ ] Data resets on refresh (expected)

✅ Production Database (Option B):
   [ ] .env.local file exists
   [ ] DATABASE_URL is set correctly
   [ ] Database schema created (9+ tables)
   [ ] Test query returns data
   [ ] Login works
   [ ] Can create invoices
   [ ] Data persists after refresh ✓
   [ ] Supabase Table Editor shows invoice

✅ Live Deployment (Option C):
   [ ] Code pushed to GitHub
   [ ] Vercel deployment successful
   [ ] Live URL is accessible
   [ ] Login works
   [ ] App responds normally
   [ ] Vercel logs show no errors
```

---

## 🆘 Troubleshooting

### "npm: command not found"
```
❌ Node.js not installed
✅ Solution: 
   1. Go to https://nodejs.org/
   2. Download and install
   3. Restart terminal
   4. Try again
```

### "DATABASE_URL not found"
```
❌ Environment variable not loaded
✅ Solution:
   1. Check .env.local exists (not .env.example)
   2. Verify DATABASE_URL line is there
   3. Restart: npm run dev
```

### "Connection refused"
```
❌ Database connection failed
✅ Solution:
   1. Verify Supabase project is active
   2. Check DATABASE_URL format is correct
   3. Check password has no special chars needing escape
   4. Wait 5 minutes if project just created
```

### "Tables don't exist"
```
❌ Database schema not initialized
✅ Solution:
   1. Go to Supabase SQL Editor
   2. Click "+ New query"
   3. Open DATABASE_SCHEMA.sql
   4. Copy & paste all SQL
   5. Click "Run"
   6. Verify in Table Editor
```

### "Port 3000 already in use"
```
❌ Another app using port 3000
✅ Solution:
   npm run dev -- -p 3001
   Then go to: http://localhost:3001
```

---

## 📚 Next Steps

### After installation, read (in order):

1. **README.md** (15 min)
   - Feature overview
   - What you can do

2. **SUPABASE_SETUP_SUMMARY.md** (10 min)
   - Setup checklist
   - Implementation roadmap

3. **IMPLEMENTATION_CHECKLIST.md** (25 min)
   - Before going live
   - Launch requirements

4. **CUSTOMIZATION_GUIDE.md** (45 min)
   - Customize for your business
   - Add your branding

---

## 🎓 Learning Path

```
Day 1:
├─ Install & test (this file)
├─ Explore features
└─ Create sample data

Day 2-3:
├─ Read documentation
├─ Customize branding
└─ Add real clients

Week 1:
├─ Configure settings
├─ Add payment methods
└─ Invite team members

Week 2:
├─ Train team
├─ Add real invoices
└─ Go live!
```

---

## 🚀 You're Ready!

### Summary of what you have:

✅ Production-ready React app  
✅ PostgreSQL database (Supabase)  
✅ GST-compliant invoicing  
✅ Professional features  
✅ Optional: Internet deployment (Vercel)  

### To get started:

1. Follow Option A, B, or C above
2. Open browser to localhost:3000
3. Login with demo credentials
4. Start invoicing! 🎉

---

## 💬 Need Help?

Check these files in order:
1. **SUPABASE_QUICK_REFERENCE.md** (troubleshooting)
2. **SUPABASE_SETUP.md** (detailed guide)
3. **FAQ section** in README.md

---

## 📊 Installation Summary

| Option | Time | Cost | Database | Deployment |
|--------|------|------|----------|------------|
| A (Demo) | 5 min | $0 | In-memory | Localhost |
| B (Production) | 45 min | $0 | PostgreSQL | Localhost |
| C (Live) | 60 min | $0 | PostgreSQL | Internet |

---

**Version**: 1.0.0  
**Last Updated**: August 2026  
**Status**: ✅ Ready to Install  
**Support**: See troubleshooting above  

---

## ✨ Good Luck!

You're now ready to run Clairvoyant SaaS.

Pick your option above and follow the steps.

Questions? Check the documentation files.

**Happy invoicing!** 🎉
