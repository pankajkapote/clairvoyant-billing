# 🎯 Supabase Setup Guide for Clairvoyant SaaS

**Complete Step-by-Step Guide to Deploy on Supabase + Vercel**

**Estimated Setup Time**: 30-45 minutes (including testing)

---

## Table of Contents

1. [Why Supabase?](#why-supabase)
2. [Prerequisites](#prerequisites)
3. [Step 1: Create Supabase Account](#step-1-create-supabase-account)
4. [Step 2: Create Project](#step-2-create-project)
5. [Step 3: Get Connection Strings](#step-3-get-connection-strings)
6. [Step 4: Configure Environment](#step-4-configure-environment)
7. [Step 5: Initialize Database](#step-5-initialize-database)
8. [Step 6: Test Connection](#step-6-test-connection)
9. [Step 7: Setup Authentication](#step-7-setup-authentication)
10. [Step 8: Configure Email](#step-8-configure-email)
11. [Step 9: Deploy to Vercel](#step-9-deploy-to-vercel)
12. [Step 10: Monitoring & Maintenance](#step-10-monitoring--maintenance)
13. [Troubleshooting](#troubleshooting)

---

## Why Supabase?

Supabase is **PostgreSQL 13+ managed by professionals**, so you get:

```
Supabase = PostgreSQL + Auth + Real-time + REST API + Studio (UI)

✅ Same database you need (PostgreSQL)
✅ Automatic backups & scaling
✅ Built-in user authentication
✅ Visual database manager (Studio)
✅ Free tier for testing
✅ Pay-as-you-go pricing
✅ Zero DevOps complexity
```

---

## Prerequisites

Before starting, ensure you have:

- [ ] GitHub account (for version control)
- [ ] Vercel account (for hosting) - optional but recommended
- [ ] Email address (for Supabase & Vercel)
- [ ] Credit card (for paid tier later, not needed for free tier)
- [ ] 30 minutes of uninterrupted time
- [ ] Text editor (VS Code, Sublime, etc.)
- [ ] Terminal/Command Prompt access
- [ ] Basic knowledge of environment variables

---

## Step 1: Create Supabase Account

### 1.1 Go to Supabase Website

1. Open browser and go to **https://app.supabase.com**
2. Click **"Sign Up"** button (top right)

```
Screen: Supabase homepage
├─ "Start your project for free"
├─ "Sign Up" button (top right)
└─ Email/Password/Google login options
```

### 1.2 Create Account

**Option A: Email Sign-up**
1. Enter your email address
2. Create a password (min 8 characters, uppercase, number recommended)
3. Click "Sign Up"
4. Check email for verification link
5. Click link to verify

**Option B: Google Sign-up** (Faster)
1. Click "Continue with Google"
2. Select your Google account
3. Grant permissions
4. Done!

### 1.3 Verify Email

You'll receive email: "Confirm your email"
1. Open email
2. Click "Confirm your email" button
3. You're now in Supabase dashboard

---

## Step 2: Create Project

### 2.1 Access Project Creation

Once logged in, you'll see the Supabase dashboard.

```
Supabase Dashboard
├─ "New Project" button (top left)
├─ "Organizations" section
└─ "Recent Projects" list
```

### 2.2 Create New Project

Click **"New Project"** button.

You'll see a form with these fields:

```
New Project Form:
├─ Organization
│  └─ [Default: Your organization]
├─ Project name *
│  └─ [Your project name]
├─ Database password *
│  └─ [Create strong password]
├─ Region *
│  └─ [Select region]
└─ Pricing plan
   └─ Free (default)
```

### 2.3 Fill in Project Details

#### **Project Name**
Enter: `clairvoyant`

(This will create database: `postgres` in the project)

#### **Database Password**
Create a **strong password** (you'll need this later):
```
Example: Clairvoyant@2026#SecureDB!

Requirements:
- At least 12 characters
- Uppercase letters (A-Z)
- Lowercase letters (a-z)
- Numbers (0-9)
- Special characters (!@#$%^&*)

⚠️ SAVE THIS PASSWORD - You'll need it for connection string
```

**Generate Strong Password** (if needed):
```
Online tool: https://passwordsgenerator.net/
```

#### **Region Selection**

**For India-based users**:

```
Best options:
1. ap-south-1 (Mumbai) - FASTEST for India
   └─ Recommended for Indian businesses
   
2. ap-southeast-1 (Singapore) - Good alternative
   └─ If Mumbai has latency
   
3. ap-northeast-1 (Tokyo) - Last resort
   └─ Farther but stable
```

**How to select**:
1. Click on "Region" dropdown
2. Select your region
3. You'll see latency estimate

**I recommend: ap-south-1 (Mumbai) for Clairvoyant**

#### **Pricing Plan**

Leave as **"Free"** for now.
```
Free tier includes:
✅ 500 MB database
✅ 2 GB bandwidth/month
✅ Daily backups
✅ Enough for testing & small launch

You can upgrade later when needed.
```

### 2.4 Create Project

1. Review settings
2. Click **"Create new project"** button
3. Wait 2-5 minutes for database initialization

**Progress screen**:
```
Creating your project...
├─ Setting up database
├─ Initializing extensions
├─ Configuring security
└─ ✓ Done!
```

You'll see: **"Your project is ready"** message

---

## Step 3: Get Connection Strings

### 3.1 Access Connection Strings

Once your project is ready:

1. Look for the **Settings** icon (⚙️) in bottom left sidebar
2. Click **"Settings"**
3. In left sidebar, click **"Database"**
4. You'll see **"Connection pooling"** section

```
Supabase Dashboard Structure:
├─ [Your Project Name]
├─ Settings (⚙️)
│  └─ Database
│     ├─ Connection info
│     └─ Connection pooling ← Click here
├─ SQL Editor
├─ Table Editor
└─ Auth
```

### 3.2 Understand Connection Strings

Supabase provides **two types** of connections:

#### **Connection Pooler** (Recommended for Vercel)
- Use for: Serverless functions (Vercel, AWS Lambda)
- Port: 6543
- Better for: Short-lived connections

#### **Direct Connection** (For local development)
- Use for: Local development, always-on servers
- Port: 5432
- Better for: Long-term connections

**For Clairvoyant**:
- **Development**: Use Direct Connection
- **Production (Vercel)**: Use Connection Pooler

### 3.3 Copy Connection Strings

**For Development** (Local):

1. In Supabase dashboard, go to Settings → Database
2. Find **"Connection string"** section
3. Switch toggle to **"URI"** format (if not selected)
4. Copy the string that looks like:

```
postgresql://postgres:[PASSWORD]@[HOST].supabase.co:5432/postgres
```

**For Production** (Vercel):

1. Same location as above
2. Under **"Connection pooling"**
3. Select **"Session mode"** tab (not Transaction)
4. Copy the string that looks like:

```
postgresql://postgres:[PASSWORD]@[HOST].pooler.supabase.com:6543/postgres
```

**Keep these safe!** You'll use them in next steps.

### 3.4 Understanding the Connection String

```
postgresql://
  username : password @ host : port / database
  
  postgres : YOUR_PASSWORD @ xxx.supabase.co : 5432 / postgres
  
Breaking it down:
├─ postgres = default user
├─ YOUR_PASSWORD = database password you created
├─ xxx.supabase.co = your host (will have long ID)
├─ 5432 = port for direct connection
└─ postgres = default database
```

---

## Step 4: Configure Environment

### 4.1 Create .env.local File

In your project root directory (same level as `package.json`):

```bash
# Navigate to project
cd clairvoyant

# Create .env.local file
touch .env.local

# Open in your editor
code .env.local
```

### 4.2 Add Supabase Configuration

Copy this into `.env.local`:

```env
# ============================================
# SUPABASE DATABASE CONFIGURATION
# ============================================

# For local development - use DIRECT connection
DATABASE_URL=postgresql://postgres:[YOUR_PASSWORD]@[YOUR_HOST].supabase.co:5432/postgres

# For production (Vercel) - use POOLER connection
# DATABASE_URL_PRODUCTION=postgresql://postgres:[YOUR_PASSWORD]@[YOUR_HOST].pooler.supabase.com:6543/postgres

# Database type
DB_TYPE=postgresql

# ============================================
# APP CONFIGURATION
# ============================================

NEXT_PUBLIC_APP_NAME=Clairvoyant
NEXT_PUBLIC_CURRENCY=INR
NEXT_PUBLIC_TIMEZONE=Asia/Kolkata

# ============================================
# AUTHENTICATION
# ============================================

NEXTAUTH_SECRET=your-super-secret-key-min-32-chars-here-12345678
NEXTAUTH_URL=http://localhost:3000

# ============================================
# EMAIL SERVICE (Optional for now)
# ============================================

# SendGrid
# EMAIL_SERVICE=sendgrid
# SENDGRID_API_KEY=sg-xxxxxxxxxxxxx
# EMAIL_FROM=noreply@clairvoyant.io

# ============================================
# PAYMENT GATEWAY (Optional for now)
# ============================================

# Razorpay
# RAZORPAY_KEY_ID=rzp_xxxxxxxxxxxxx
# RAZORPAY_KEY_SECRET=rzp_xxxxxxxxxxxxx

# ============================================
# STORAGE (Optional for now)
# ============================================

# AWS S3 (optional)
# AWS_S3_BUCKET=clairvoyant-bucket
# AWS_S3_REGION=ap-south-1
# AWS_ACCESS_KEY_ID=xxxxx
# AWS_SECRET_ACCESS_KEY=xxxxx
```

### 4.3 Replace Placeholder Values

Find and replace:

```
[YOUR_PASSWORD] = The database password you created (Step 2.3)
[YOUR_HOST] = Your Supabase host (looks like: xxxxxxxxxxxxxxxxxxxxx)

Where to find YOUR_HOST:
1. Go to Supabase dashboard
2. Settings → Database
3. Look at "Connection info" section
4. Find the line starting with "Host: xxxxx..."
5. That xxxxx part is your HOST
```

### 4.4 Generate NEXTAUTH_SECRET

For security, generate a random string:

**Option 1: Online**
```
Go to: https://generate-random.org/
Generate 32+ character random string
Copy to NEXTAUTH_SECRET
```

**Option 2: Terminal**
```bash
# macOS/Linux
openssl rand -base64 32

# Windows PowerShell
[System.Convert]::ToBase64String([System.Security.Cryptography.RandomNumberGenerator]::GetBytes(32))
```

**Copy the output** to `NEXTAUTH_SECRET`

### 4.5 Verify .env.local

Your `.env.local` should look like:

```env
DATABASE_URL=postgresql://postgres:Clairvoyant@2026#SecureDB!@xxxxxxxxxxxxx.supabase.co:5432/postgres
DB_TYPE=postgresql
NEXT_PUBLIC_APP_NAME=Clairvoyant
NEXT_PUBLIC_CURRENCY=INR
NEXT_PUBLIC_TIMEZONE=Asia/Kolkata
NEXTAUTH_SECRET=aB3xC+dE/fGhIjKlMnOpQrStUvWxYzAbCdEfGhIjKl=
NEXTAUTH_URL=http://localhost:3000
```

⚠️ **IMPORTANT**: Add `.env.local` to `.gitignore` so you never commit secrets!

```bash
# Check if .gitignore exists
cat .gitignore

# Add this line if not present
echo ".env.local" >> .gitignore
```

---

## Step 5: Initialize Database

### 5.1 Access SQL Editor

Now we'll create the database tables.

1. Go to **Supabase Dashboard**
2. Click on your project
3. In left sidebar, click **"SQL Editor"**

```
Supabase Dashboard
├─ Your Project: "clairvoyant"
├─ SQL Editor ← Click here
├─ Table Editor
└─ Auth
```

### 5.2 Create New Query

1. Click **"+ New query"** button (top right)
2. You'll see empty SQL editor

```
SQL Editor:
├─ Query name: [Enter name]
├─ Database: [Select database]
└─ [Large text area for SQL code]
```

3. Name your query: `Create Tables`

### 5.3 Copy Database Schema

From the documentation you received, find `DATABASE_SCHEMA.sql`.

It contains all the SQL to create tables. Let me provide the complete schema here:

```sql
-- ============================================================
-- CLAIRVOYANT SAAS - DATABASE SCHEMA
-- ============================================================
-- Run this in Supabase SQL Editor to initialize database

-- ============================================================
-- TENANTS TABLE (for multi-tenancy)
-- ============================================================
CREATE TABLE IF NOT EXISTS tenants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  domain VARCHAR(255) UNIQUE NOT NULL,
  plan_id VARCHAR(50) DEFAULT 'starter',
  created_at TIMESTAMP DEFAULT NOW(),
  is_active BOOLEAN DEFAULT true
);

-- ============================================================
-- USERS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
  email VARCHAR(255) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(50) DEFAULT 'viewer', -- admin, editor, viewer
  first_name VARCHAR(255),
  last_name VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(tenant_id, email)
);

-- ============================================================
-- CLIENTS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS clients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
  company_name VARCHAR(255) NOT NULL,
  representative VARCHAR(255),
  pan VARCHAR(20),
  gstin VARCHAR(20),
  state_code VARCHAR(5),
  address TEXT,
  email VARCHAR(255),
  phone VARCHAR(20),
  created_at TIMESTAMP DEFAULT NOW()
);

-- ============================================================
-- INVOICES TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS invoices (
  id VARCHAR(50) PRIMARY KEY, -- CMPL/26-27/0001
  tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
  client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
  invoice_date DATE NOT NULL,
  subtotal DECIMAL(15, 2),
  cgst DECIMAL(15, 2),
  sgst DECIMAL(15, 2),
  igst DECIMAL(15, 2),
  total DECIMAL(15, 2),
  tax_type VARCHAR(50), -- intrastate, interstate
  status VARCHAR(50) DEFAULT 'DRAFT', -- DRAFT, SENT, VIEWED, PAID, PARTIALLY_PAID, OVERDUE, CANCELLED
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- ============================================================
-- INVOICE ITEMS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS invoice_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_id VARCHAR(50) REFERENCES invoices(id) ON DELETE CASCADE,
  particulars TEXT,
  hsn_code VARCHAR(20),
  quantity INTEGER DEFAULT 1,
  amount DECIMAL(15, 2),
  created_at TIMESTAMP DEFAULT NOW()
);

-- ============================================================
-- PAYMENTS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
  invoice_id VARCHAR(50) REFERENCES invoices(id) ON DELETE CASCADE,
  amount DECIMAL(15, 2) NOT NULL,
  payment_mode VARCHAR(50), -- NEFT, UPI, Cheque, Cash, Online
  reference_number VARCHAR(255),
  payment_date DATE,
  reconciled BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW()
);

-- ============================================================
-- VENDORS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS vendors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
  vendor_name VARCHAR(255) NOT NULL,
  contact_person VARCHAR(255),
  email VARCHAR(255),
  phone VARCHAR(20),
  created_at TIMESTAMP DEFAULT NOW()
);

-- ============================================================
-- AUDIT LOG TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id),
  action VARCHAR(50), -- CREATE, UPDATE, DELETE, CANCEL
  entity_type VARCHAR(100), -- INVOICE, CLIENT, PAYMENT, etc.
  entity_id VARCHAR(255),
  description TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- ============================================================
-- ORGANIZATION SETTINGS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS org_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID UNIQUE REFERENCES tenants(id) ON DELETE CASCADE,
  company_name VARCHAR(255),
  invoice_prefix VARCHAR(10),
  pan VARCHAR(20),
  gstin VARCHAR(20),
  address TEXT,
  bank_name VARCHAR(255),
  account_name VARCHAR(255),
  account_number VARCHAR(255),
  ifsc_code VARCHAR(20),
  logo_url TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- ============================================================
-- CREATE INDEXES FOR PERFORMANCE
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_invoices_tenant_date ON invoices(tenant_id, invoice_date);
CREATE INDEX IF NOT EXISTS idx_invoices_client ON invoices(client_id);
CREATE INDEX IF NOT EXISTS idx_payments_invoice ON payments(invoice_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_tenant ON audit_logs(tenant_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_clients_tenant ON clients(tenant_id);

-- ============================================================
-- SCHEMA COMPLETE
-- ============================================================
-- All tables created successfully!
-- Database is ready for Clairvoyant SaaS Platform
```

### 5.4 Paste SQL in Editor

1. Copy the entire SQL code above
2. Go to Supabase SQL Editor
3. Paste in the text area
4. Click **"Run"** button (or Ctrl+Enter)

```
You'll see:
├─ ✓ Query Successful
├─ 8 statements executed
└─ Took X ms
```

### 5.5 Verify Tables Created

1. In left sidebar, click **"Table Editor"**
2. You should see tables listed:

```
Tables:
├─ tenants
├─ users
├─ clients
├─ invoices
├─ invoice_items
├─ payments
├─ vendors
├─ audit_logs
└─ org_settings
```

✅ **If you see these 9 tables, your database is ready!**

### 5.6 Insert Sample Tenant

For testing, create a sample tenant:

1. Go to SQL Editor
2. Create new query: "Insert Sample Data"
3. Paste this:

```sql
-- Insert sample tenant
INSERT INTO tenants (id, name, domain, plan_id, is_active)
VALUES (
  'f47ac10b-58cc-4372-a567-0e02b2c3d479'::uuid,
  'Clairvoyant Made Private Limited',
  'clairvoyant.local',
  'pro',
  true
) ON CONFLICT DO NOTHING;

-- Insert sample user (admin)
INSERT INTO users (tenant_id, email, password_hash, role, first_name, last_name)
VALUES (
  'f47ac10b-58cc-4372-a567-0e02b2c3d479'::uuid,
  'admin@clairvoyant.com',
  '$2b$10$dummy_hash_not_for_production', -- Use bcrypt in production
  'admin',
  'Admin',
  'User'
) ON CONFLICT DO NOTHING;

-- Insert sample client
INSERT INTO clients (tenant_id, company_name, representative, pan, gstin, state_code, email)
VALUES (
  'f47ac10b-58cc-4372-a567-0e02b2c3d479'::uuid,
  'Amazon India Media',
  'Rajesh Kumar',
  'CBVPK9244C',
  '27AABCA1234H1Z0',
  '27',
  'accounts@amazon.com'
) ON CONFLICT DO NOTHING;
```

4. Click **"Run"**

---

## Step 6: Test Connection

### 6.1 Install Node Modules

```bash
# Navigate to project
cd clairvoyant

# Install dependencies
npm install

# Install PostgreSQL client (if not already installed)
npm install pg
```

### 6.2 Create Test Script

Create file `test-db.js` in root:

```javascript
// test-db.js
const { Client } = require('pg');

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.error('❌ DATABASE_URL not set in .env.local');
  process.exit(1);
}

console.log('🔍 Testing Supabase connection...');
console.log('Connection string (masked):', connectionString.replace(/:[^@]*@/, ':****@'));

const client = new Client({
  connectionString: connectionString,
  ssl: { rejectUnauthorized: false } // Required for Supabase
});

client.connect((err) => {
  if (err) {
    console.error('❌ Connection failed:', err.message);
    process.exit(1);
  }
  
  console.log('✅ Connected to Supabase!');
  
  // Test query
  client.query('SELECT * FROM information_schema.tables WHERE table_schema = \'public\'', (err, res) => {
    if (err) {
      console.error('❌ Query failed:', err);
      process.exit(1);
    }
    
    console.log('✅ Found tables:', res.rows.map(r => r.table_name).join(', '));
    client.end();
    console.log('✅ All tests passed!');
  });
});
```

### 6.3 Run Test

```bash
# Run test
node test-db.js

# Expected output:
# 🔍 Testing Supabase connection...
# ✅ Connected to Supabase!
# ✅ Found tables: tenants, users, clients, invoices, ...
# ✅ All tests passed!
```

If you see ✅ **All tests passed!**, your Supabase connection works!

---

## Step 7: Setup Authentication

### 7.1 Configure Auth in Supabase

For Clairvoyant, we'll use **email/password** authentication:

1. Go to **Supabase Dashboard** → Your Project
2. Click **"Auth"** in left sidebar
3. Click **"Providers"**

```
Auth Dashboard
├─ Users
├─ Providers ← Click here
│  ├─ Email
│  ├─ Magic Link
│  ├─ Phone
│  └─ OAuth Providers (Google, GitHub, etc.)
└─ Policies
```

### 7.2 Enable Email Provider

1. Click on **"Email"**
2. Toggle **"Enabled"** to ON
3. Select **"Confirm email"** option
4. Click **"Save"**

```
Email Configuration:
├─ Enabled: ✓ Toggle ON
├─ Confirm email: ✓ Required
├─ Auto confirm: Leave OFF (for security)
└─ Resend email: Enabled
```

### 7.3 Configure Auth Settings

1. Go to **Auth** → **URL Configuration**
2. Set **"Site URL"**:
   - Local: `http://localhost:3000`
   - Production: `https://yourdomain.com`

3. Add **"Redirect URLs"**:
   ```
   http://localhost:3000/auth/callback
   https://yourdomain.com/auth/callback
   ```

### 7.4 Configure Email

In **Auth** → **Email Templates**:

1. Click **"Confirm signup"**
2. Verify template looks good (default is fine)
3. Click **"Save"**

For production, configure **"SMTP Provider"** to use SendGrid:

1. Go to **Settings** → **Email**
2. Select **"Custom SMTP"**
3. Enter SendGrid SMTP details (covered in Step 8)

---

## Step 8: Configure Email (Optional but Recommended)

### 8.1 Sign Up for SendGrid

1. Go to https://sendgrid.com
2. Click **"Start for free"**
3. Create account with email
4. Verify email
5. Create API key

### 8.2 Get SendGrid API Key

1. Login to SendGrid dashboard
2. Go to **Settings** → **API Keys**
3. Click **"Create API Key"**
4. Name: `Clairvoyant`
5. Permissions: **Restricted Access**
   - Mail Send: ✓ Full Access
6. Click **"Create & View"**
7. Copy the key

### 8.3 Add to .env.local

```env
SENDGRID_API_KEY=SG-xxxxxxxxxxxxx
EMAIL_FROM=noreply@clairvoyant.io
```

### 8.4 Verify Sender

In SendGrid dashboard:
1. Go to **Settings** → **Sender Authentication**
2. Verify your domain or sender email
3. Follow SendGrid's verification steps

---

## Step 9: Deploy to Vercel

### 9.1 Create GitHub Repository

```bash
# Initialize git (if not done)
git init
git add .
git commit -m "Initial commit: Clairvoyant SaaS"

# Create repo on GitHub
# Go to https://github.com/new
# Name: clairvoyant-saas
# Click "Create repository"

# Push to GitHub
git remote add origin https://github.com/YOUR_USERNAME/clairvoyant-saas.git
git branch -M main
git push -u origin main
```

### 9.2 Connect to Vercel

1. Go to https://vercel.com
2. Sign up (or login if you have account)
3. Click **"New Project"**
4. Select **"Import Git Repository"**
5. Authorize GitHub
6. Select **"clairvoyant-saas"** repository
7. Click **"Import"**

### 9.3 Configure Environment Variables

On Vercel import screen:

1. Click **"Environment Variables"**
2. Add these variables:

```
DATABASE_URL = postgresql://postgres:[PASSWORD]@[HOST].pooler.supabase.com:6543/postgres
NEXTAUTH_SECRET = [Your generated secret]
NEXTAUTH_URL = https://yourdomain.vercel.app
SENDGRID_API_KEY = SG-xxxxx (optional)
EMAIL_FROM = noreply@clairvoyant.io (optional)
```

### 9.4 Deploy

1. Click **"Deploy"**
2. Wait 2-5 minutes for deployment
3. See **"Congratulations! Your site is deployed"**
4. Click visit button to see your app live!

### 9.5 Custom Domain (Optional)

To use your own domain:

1. In Vercel dashboard, go to **Settings** → **Domains**
2. Add your domain
3. Follow DNS instructions
4. Update NEXTAUTH_URL to your domain

---

## Step 10: Monitoring & Maintenance

### 10.1 Monitor Supabase

**Daily**:
- Check database size (Settings → Usage)
- Monitor connections (Settings → Database)

**Weekly**:
- Review audit logs for suspicious activity
- Check backup status (Settings → Backups)

**Monthly**:
- Review performance metrics
- Optimize slow queries
- Plan for scaling if needed

### 10.2 Supabase Dashboard Monitoring

```
Supabase Dashboard → Your Project:
├─ Settings
│  ├─ Usage (see database size, bandwidth)
│  ├─ Database (connections, performance)
│  ├─ Backups (daily backups)
│  └─ Logs (database logs)
├─ SQL Editor (write queries)
└─ Table Editor (visual table management)
```

### 10.3 Backup Strategy

Supabase **automatically backs up daily** on free tier.

For extra safety:

**Manual Backup** (once per week):
```bash
# Dump database
pg_dump -h [HOST] -U postgres -d postgres > backup_$(date +%Y%m%d).sql

# Keep backups in safe location (Google Drive, AWS S3, etc.)
```

### 10.4 Scaling

As you grow:

```
Invoices: 1K-10K
├─ Plan: Free tier
├─ Cost: $0
└─ Database: 500 MB (fine)

Invoices: 10K-100K
├─ Plan: Pro ($25/month)
├─ Cost: $25/month
└─ Database: 8 GB

Invoices: 100K+
├─ Plan: Custom Enterprise
├─ Cost: $100-500/month
└─ Database: Unlimited
```

---

## Troubleshooting

### Issue: "Connection refused"

**Cause**: Database not ready or wrong host

**Solution**:
```bash
# 1. Check DATABASE_URL in .env.local is correct
echo $DATABASE_URL

# 2. Verify Supabase project is active
# Go to Supabase dashboard → check project status

# 3. Wait a few minutes if project just created
# New projects take 2-5 minutes to initialize

# 4. Test with correct connection string format
# Should have .supabase.co (development) or .pooler.supabase.com (production)
```

### Issue: "SSL error: self signed certificate"

**Cause**: SSL not configured

**Solution**:
In your connection code, add:
```javascript
const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false } // Required for Supabase
});
```

### Issue: "Database URL not found"

**Cause**: .env.local not created or not loaded

**Solution**:
```bash
# 1. Verify .env.local exists
ls -la .env.local

# 2. Verify DATABASE_URL is set
cat .env.local | grep DATABASE_URL

# 3. Verify .env.local is in .gitignore
echo ".env.local" >> .gitignore

# 4. Restart dev server
npm run dev
```

### Issue: "Too many connections"

**Cause**: Connection pool exhausted

**Solution**:
```bash
# 1. Use Connection Pooler (not Direct Connection) in production
# DATABASE_URL should have .pooler.supabase.com

# 2. Increase pool size in Supabase
# Settings → Database → Connection pooling
# Increase "Max connections"

# 3. For development, restart dev server
npm run dev
```

### Issue: "Table doesn't exist"

**Cause**: SQL schema not executed

**Solution**:
```bash
# 1. Go to Supabase → SQL Editor
# 2. Create new query
# 3. Paste DATABASE_SCHEMA.sql
# 4. Click Run
# 5. Verify tables created in Table Editor
```

### Issue: "404 Not Found" when deployed

**Cause**: Vercel deployment issue

**Solution**:
```bash
# 1. Check Vercel deployment logs
# Vercel Dashboard → Deployments → View logs

# 2. Verify environment variables on Vercel
# Vercel → Settings → Environment Variables
# Check DATABASE_URL exists

# 3. Rebuild deployment
# Vercel → Deployments → Redeploy

# 4. Check Next.js build succeeded
# Should see "Generated successfully"
```

### Issue: "Error connecting to database" on production

**Cause**: Wrong connection string or environment variable

**Solution**:
```bash
# 1. Verify DATABASE_URL on Vercel uses POOLER
# Should be: postgresql://...pooler.supabase.com:6543/...

# 2. Update on Vercel:
# Settings → Environment Variables → Edit DATABASE_URL

# 3. Redeploy application
# Deployments → Redeploy
```

---

## Pricing Reference

### Supabase Pricing

```
FREE TIER:
├─ Database: 500 MB
├─ Bandwidth: 2 GB/month
├─ Users: Unlimited
├─ Backups: Daily
├─ Cost: $0/month
└─ Best for: Testing, demos, small launches

PRO TIER ($25/month):
├─ Database: 8 GB
├─ Bandwidth: 50 GB/month
├─ Users: Unlimited
├─ Backups: Hourly
├─ Cost: $25/month
└─ Best for: Growing businesses (1K-100K invoices)

ENTERPRISE:
├─ Database: Unlimited
├─ Bandwidth: Unlimited
├─ Users: Unlimited
├─ Backups: Hourly + Custom
├─ Cost: Custom pricing
└─ Best for: Large enterprises (100K+ invoices)
```

### Vercel Pricing

```
HOBBY (Free):
├─ Deployments: Unlimited
├─ Bandwidth: 100 GB/month
├─ Functions: 160,000 function-hours/month
├─ Cost: $0
└─ Good for: Personal projects

PRO ($20/month):
├─ Everything in Hobby
├─ Priority support
├─ Team members: 3
├─ Cost: $20/month
└─ Good for: Growing businesses
```

### Total Cost Estimate

```
Year 1 (Startup):
├─ Supabase: $0 (free tier)
├─ Vercel: $0-20/month
├─ Domain: $12/year
├─ SendGrid: $0-20/month
└─ Total: $0-240/year

Year 2 (Growth):
├─ Supabase: $25/month ($300/year)
├─ Vercel: $20/month ($240/year)
├─ Domain: $12/year
├─ SendGrid: $20/month ($240/year)
└─ Total: $792/year ($66/month)

Year 3+ (Scaling):
├─ Supabase: $100-500/month
├─ Vercel: $20/month
├─ Domain: $12/year
├─ SendGrid: $50-200/month
└─ Total: $1,980-8,652/year ($165-721/month)
```

---

## Useful Supabase Resources

### Documentation
- **Getting Started**: https://supabase.com/docs/guides/getting-started
- **PostgreSQL Docs**: https://supabase.com/docs/guides/database
- **Authentication**: https://supabase.com/docs/guides/auth

### Community
- **Discord**: https://discord.supabase.io
- **GitHub Discussions**: https://github.com/supabase/supabase/discussions
- **Status Page**: https://status.supabase.com

### Tools
- **Supabase Studio**: Visual database manager (included)
- **SQL Editor**: Write SQL queries
- **Table Editor**: Manage tables visually

---

## Quick Reference Checklist

```
☐ Step 1: Create Supabase Account
  ☐ Sign up at supabase.com
  ☐ Verify email

☐ Step 2: Create Project
  ☐ Project name: clairvoyant
  ☐ Region: ap-south-1 (Mumbai)
  ☐ Password: [saved securely]

☐ Step 3: Get Connection Strings
  ☐ Copy Development (Direct)
  ☐ Copy Production (Pooler)

☐ Step 4: Configure Environment
  ☐ Create .env.local
  ☐ Add DATABASE_URL
  ☐ Add NEXTAUTH_SECRET
  ☐ Add .env.local to .gitignore

☐ Step 5: Initialize Database
  ☐ Go to SQL Editor
  ☐ Paste DATABASE_SCHEMA.sql
  ☐ Run query
  ☐ Verify 9 tables created

☐ Step 6: Test Connection
  ☐ Create test-db.js
  ☐ Run: node test-db.js
  ☐ See ✅ All tests passed!

☐ Step 7: Setup Authentication
  ☐ Enable Email provider
  ☐ Configure URL settings
  ☐ Test email templates

☐ Step 8: Configure Email (Optional)
  ☐ Sign up for SendGrid
  ☐ Get API key
  ☐ Add to .env.local

☐ Step 9: Deploy to Vercel
  ☐ Create GitHub repo
  ☐ Connect to Vercel
  ☐ Add environment variables
  ☐ Deploy
  ☐ Test live site

☐ Step 10: Monitor & Maintain
  ☐ Set up monitoring
  ☐ Plan backup strategy
  ☐ Monitor database usage
```

---

## Success! You're Ready to Launch

Once you've completed all steps:

1. ✅ Database is set up (Supabase)
2. ✅ Application is deployed (Vercel)
3. ✅ Environment is configured
4. ✅ Backups are automatic
5. ✅ Monitoring is set up

**You can now**:
- Create real invoices
- Record real payments
- Generate reports
- Add multiple users
- Customize for your business

---

## Next Steps

1. **Test the App**: 
   - Go to https://yourapp.vercel.app
   - Login: admin@clairvoyant.com / demo123
   - Create sample invoices

2. **Customize Branding**:
   - Update company name
   - Upload logo
   - Change colors

3. **Add Real Data**:
   - Add your clients
   - Create real invoices
   - Record payments

4. **Configure Advanced Features**:
   - Set up email notifications
   - Configure payment gateway
   - Enable 2FA for users

---

## Support

**Stuck?** Check:
- **Troubleshooting** section above
- Supabase docs: https://supabase.com/docs
- Vercel docs: https://vercel.com/docs
- GitHub Issues: https://github.com/supabase/supabase/issues

---

**Congratulations! Your Supabase + Vercel setup is complete! 🎉**

**Version**: 1.0.0  
**Last Updated**: August 2026  
**Setup Time**: 30-45 minutes  
**Cost to Launch**: $0 (Free tier)  
**Status**: ✅ Production Ready
