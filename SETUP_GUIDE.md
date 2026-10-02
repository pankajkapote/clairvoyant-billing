# Clairvoyant SaaS Platform - Complete Setup & Deployment Guide

## 📋 Table of Contents
1. [Quick Start](#quick-start)
2. [System Requirements](#system-requirements)
3. [Installation](#installation)
4. [Deployment Options](#deployment-options)
5. [Configuration & Customization](#configuration--customization)
6. [Multi-Tenancy Setup](#multi-tenancy-setup)
7. [Database Integration](#database-integration)
8. [Email & Notification Setup](#email--notification-setup)
9. [Payment Gateway Integration](#payment-gateway-integration)
10. [White-Labeling for Resale](#white-labeling-for-resale)
11. [Security & Compliance](#security--compliance)
12. [Troubleshooting](#troubleshooting)

---

## Quick Start

### For Development (5 minutes)
```bash
# 1. Create a Next.js project
npx create-next-app@latest clairvoyant-app --typescript --tailwind

# 2. Copy the clairvoyant-saas.jsx to app/page.tsx
# 3. Install dependencies
npm install lucide-react

# 4. Run dev server
npm run dev

# 5. Open http://localhost:3000
# Demo credentials: admin@clairvoyant.com / demo123
```

### For Production (Vercel - 2 clicks)
```bash
# 1. Push to GitHub
git push origin main

# 2. Go to https://vercel.com
# 3. Click "New Project" → Select repo → Deploy
# Environment automatically configured
```

---

## System Requirements

### Minimum
- **Node.js**: 18.x or higher
- **npm/yarn**: Latest version
- **Browser**: Chrome 90+, Firefox 88+, Safari 14+
- **RAM**: 512 MB
- **Storage**: 100 MB (without data)

### Recommended for Production
- **Node.js**: 20.x LTS
- **RAM**: 2 GB
- **Storage**: 1 GB (for file uploads & backups)
- **Bandwidth**: Minimum 5 Mbps

### Optional Services
- **Database**: PostgreSQL 13+ (for persistence)
- **File Storage**: AWS S3 / Google Cloud Storage (for logo uploads)
- **Email Service**: SendGrid / AWS SES / Mailgun
- **Payment Gateway**: Razorpay / PayU / Instamojo

---

## Installation

### Step 1: Clone & Setup

```bash
# Clone or download the repository
git clone https://github.com/yourusername/clairvoyant.git
cd clairvoyant

# Install dependencies
npm install

# Install additional packages for enhanced features
npm install @supabase/supabase-js axios uuid next-auth tailwindcss lucide-react
```

### Step 2: Environment Configuration

Create `.env.local` file:

```env
# App Configuration
NEXT_PUBLIC_APP_NAME=Clairvoyant
NEXT_PUBLIC_APP_VERSION=1.0.0
NEXT_PUBLIC_CURRENCY=INR
NEXT_PUBLIC_TIMEZONE=Asia/Kolkata

# Database (Optional)
DATABASE_URL=postgresql://user:password@localhost:5432/clairvoyant_db
DB_TYPE=postgresql

# Authentication
NEXTAUTH_SECRET=your-super-secret-key-here
NEXTAUTH_URL=http://localhost:3000

# File Storage (Optional)
STORAGE_TYPE=local
AWS_S3_BUCKET=your-bucket-name
AWS_S3_REGION=ap-south-1
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key

# Email Service (Optional)
EMAIL_SERVICE=sendgrid
SENDGRID_API_KEY=your-sendgrid-key
EMAIL_FROM=noreply@clairvoyant.io

# Payment Gateway (Optional)
RAZORPAY_KEY_ID=your-razorpay-key
RAZORPAY_KEY_SECRET=your-razorpay-secret

# Analytics (Optional)
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXXXX
```

### Step 3: Database Setup (PostgreSQL)

```bash
# Install PostgreSQL locally (macOS)
brew install postgresql

# Or use Docker
docker run --name clairvoyant-db \
  -e POSTGRES_PASSWORD=password \
  -p 5432:5432 \
  -d postgres:15

# Create database
createdb clairvoyant_db

# Run migrations (create tables)
# See DATABASE_SCHEMA.sql below
```

### Step 4: Start Development Server

```bash
npm run dev
# Open http://localhost:3000
```

---

## Deployment Options

### Option 1: Vercel (Recommended - Easiest)

**Pros**: Free tier available, auto-scaling, built-in analytics
**Cons**: Serverless limitations for long-running tasks

```bash
# 1. Install Vercel CLI
npm i -g vercel

# 2. Deploy
vercel

# 3. Configure environment variables in Vercel Dashboard
# Settings → Environment Variables → Add all from .env.local
```

### Option 2: Docker + Railway

**Pros**: Full control, affordable, great support
**Cons**: Requires Docker knowledge

```dockerfile
# Dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

```bash
# Deploy to Railway
railway link
railway up
```

### Option 3: AWS EC2 + RDS

**Pros**: Maximum scalability, enterprise-grade
**Cons**: More complex, higher cost

```bash
# 1. Create EC2 instance (t3.small Ubuntu 22.04)
# 2. SSH into instance
ssh -i your-key.pem ec2-user@your-instance-ip

# 3. Install Node.js
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# 4. Clone repo and setup
git clone your-repo
cd clairvoyant
npm install
npm run build

# 5. Setup PM2 for process management
npm install -g pm2
pm2 start npm --name "clairvoyant" -- start
pm2 save

# 6. Setup Nginx reverse proxy
sudo apt install nginx
# Configure /etc/nginx/sites-available/default
```

**Nginx Configuration** (`/etc/nginx/sites-available/default`):
```nginx
server {
    listen 80;
    server_name yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

---

## Configuration & Customization

### 1. Branding Customization

**File**: `public/branding.json`

```json
{
  "appName": "Clairvoyant",
  "logo": "/logo.png",
  "favicon": "/favicon.ico",
  "primaryColor": "#2563eb",
  "secondaryColor": "#14b8a6",
  "logoMaxHeight": "32px",
  "tagline": "Influencer Billing & CRM",
  "supportEmail": "support@clairvoyant.io",
  "supportPhone": "+91-9876543210"
}
```

### 2. Feature Flags

**File**: `config/features.json`

```json
{
  "invoicing": true,
  "clientPortal": true,
  "paymentTracking": true,
  "emailNotifications": false,
  "gstReports": true,
  "multiCurrency": false,
  "advancedAnalytics": true,
  "apiAccess": false
}
```

### 3. Subscription Plans Configuration

**File**: `config/plans.ts`

```typescript
export const SUBSCRIPTION_PLANS = {
  free: {
    name: 'Free',
    price: 0,
    invoices: 10,
    users: 1,
    storage: '100MB',
    features: ['Basic invoicing', 'Single user']
  },
  starter: {
    name: 'Starter',
    price: 2999,
    invoices: 50,
    users: 1,
    storage: '1GB',
    features: ['All free features', 'Priority support']
  },
  pro: {
    name: 'Pro',
    price: 7999,
    invoices: 500,
    users: 5,
    storage: '10GB',
    features: ['All starter features', 'GST reports', 'Client portal']
  },
  enterprise: {
    name: 'Enterprise',
    price: null,
    invoices: 'Unlimited',
    users: 'Unlimited',
    storage: 'Unlimited',
    features: ['All pro features', 'Custom branding', 'API access', 'Dedicated support']
  }
};
```

### 4. Indian State Codes

**File**: `config/states.json`

```json
{
  "statecodes": [
    {"code": "27", "name": "Maharashtra"},
    {"code": "28", "name": "Karnataka"},
    {"code": "29", "name": "Tamil Nadu"},
    {"code": "30", "name": "Telangana"},
    {"code": "31", "name": "Delhi"},
    {"code": "32", "name": "Gujarat"},
    {"code": "33", "name": "Uttar Pradesh"}
  ]
}
```

---

## Multi-Tenancy Setup

### Architecture: Database-per-Tenant (Most Secure)

```typescript
// lib/tenancy.ts

export interface Tenant {
  id: string;
  name: string;
  domain: string;
  databaseUrl: string;
  planId: string;
  createdAt: Date;
  isActive: boolean;
}

// Get tenant from request
export async function getTenant(req: Request): Promise<Tenant> {
  const domain = new URL(req.url).hostname;
  
  const tenant = await db.query(
    'SELECT * FROM tenants WHERE domain = $1',
    [domain]
  );
  
  return tenant[0];
}

// Middleware to attach tenant to request
export function tenantMiddleware(req: Request) {
  const tenant = getTenant(req);
  (req as any).tenant = tenant;
}
```

### Tenant Isolation Strategy

```typescript
// lib/db.ts

class TenantDB {
  private tenant: Tenant;

  constructor(tenant: Tenant) {
    this.tenant = tenant;
  }

  async query(sql: string, params: any[]) {
    // Add tenant_id filter to every query
    const modifiedSql = sql + ` AND tenant_id = $${params.length + 1}`;
    const modifiedParams = [...params, this.tenant.id];
    
    return await dbClient.query(modifiedSql, modifiedParams);
  }
}
```

### Creating New Tenant

```typescript
// api/tenants/create

export async function POST(req: Request) {
  const { organizationName, email, plan } = await req.json();

  // Create tenant record
  const tenant = await db.insert('tenants', {
    name: organizationName,
    domain: `${slugify(organizationName)}.clairvoyant.io`,
    planId: plan,
    createdAt: new Date()
  });

  // Create tenant-specific tables
  const tenantDB = new TenantDB(tenant);
  await tenantDB.initializeTables();

  // Create admin user
  await tenantDB.createUser({
    email,
    role: 'admin',
    tenantId: tenant.id
  });

  return Response.json({ tenant });
}
```

---

## Database Integration

### PostgreSQL Schema

**File**: `DATABASE_SCHEMA.sql`

```sql
-- Tenants Table (for multi-tenant setup)
CREATE TABLE tenants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  domain VARCHAR(255) UNIQUE NOT NULL,
  plan_id VARCHAR(50) DEFAULT 'starter',
  created_at TIMESTAMP DEFAULT NOW(),
  is_active BOOLEAN DEFAULT true
);

-- Users Table
CREATE TABLE users (
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

-- Clients Table
CREATE TABLE clients (
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

-- Invoices Table
CREATE TABLE invoices (
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

-- Invoice Items Table
CREATE TABLE invoice_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_id VARCHAR(50) REFERENCES invoices(id) ON DELETE CASCADE,
  particulars TEXT,
  hsn_code VARCHAR(20),
  quantity INTEGER DEFAULT 1,
  amount DECIMAL(15, 2),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Payments Table
CREATE TABLE payments (
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

-- Vendors Table
CREATE TABLE vendors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
  vendor_name VARCHAR(255) NOT NULL,
  contact_person VARCHAR(255),
  email VARCHAR(255),
  phone VARCHAR(20),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Audit Log Table
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id),
  action VARCHAR(50), -- CREATE, UPDATE, DELETE, CANCEL
  entity_type VARCHAR(100), -- INVOICE, CLIENT, PAYMENT, etc.
  entity_id VARCHAR(255),
  description TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Organization Settings Table
CREATE TABLE org_settings (
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

-- Create indexes for performance
CREATE INDEX idx_invoices_tenant_date ON invoices(tenant_id, invoice_date);
CREATE INDEX idx_invoices_client ON invoices(client_id);
CREATE INDEX idx_payments_invoice ON payments(invoice_id);
CREATE INDEX idx_audit_logs_tenant ON audit_logs(tenant_id, created_at DESC);
CREATE INDEX idx_users_email ON users(email);
```

### Connect to Database

**File**: `lib/db.ts`

```typescript
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

export async function query(text: string, params?: any[]) {
  const start = Date.now();
  try {
    const result = await pool.query(text, params);
    const duration = Date.now() - start;
    console.log('Executed query', { text, duration, rows: result.rowCount });
    return result;
  } catch (error) {
    console.error('Database error', error);
    throw error;
  }
}

export async function getClient() {
  return pool.connect();
}
```

---

## Email & Notification Setup

### SendGrid Integration

**File**: `lib/email.ts`

```typescript
import sgMail from '@sendgrid/mail';

sgMail.setApiKey(process.env.SENDGRID_API_KEY || '');

export async function sendInvoiceEmail(
  clientEmail: string,
  invoiceId: string,
  invoiceAmount: number,
  pdfBuffer: Buffer
) {
  try {
    await sgMail.send({
      to: clientEmail,
      from: process.env.EMAIL_FROM || 'noreply@clairvoyant.io',
      subject: `Invoice ${invoiceId} from Clairvoyant`,
      html: `
        <h2>Invoice Notification</h2>
        <p>Dear Client,</p>
        <p>Please find attached your invoice <strong>${invoiceId}</strong> for amount <strong>₹${invoiceAmount}</strong></p>
        <p>Due Date: 30 days from invoice date</p>
        <p>Banking Details:<br/>
        Bank: Clairvoyant Banking<br/>
        Account: 50200076668915<br/>
        IFSC: HDFC0000203</p>
        <p>Thank you for your business!</p>
      `,
      attachments: [
        {
          content: pdfBuffer.toString('base64'),
          filename: `${invoiceId}.pdf`,
          type: 'application/pdf'
        }
      ]
    });
    console.log('Invoice email sent to', clientEmail);
  } catch (error) {
    console.error('Email error:', error);
  }
}

export async function sendPaymentReminder(clientEmail: string, invoiceId: string, daysOverdue: number) {
  await sgMail.send({
    to: clientEmail,
    from: process.env.EMAIL_FROM || 'noreply@clairvoyant.io',
    subject: `Payment Reminder: Invoice ${invoiceId}`,
    html: `
      <h2>Payment Reminder</h2>
      <p>Dear Client,</p>
      <p>This is a friendly reminder that invoice <strong>${invoiceId}</strong> is now <strong>${daysOverdue} days overdue</strong>.</p>
      <p>Please settle the payment at your earliest convenience.</p>
      <p>If payment has already been made, please disregard this email.</p>
    `
  });
}
```

### WhatsApp Integration (Twilio)

```typescript
// lib/whatsapp.ts
import twilio from 'twilio';

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

export async function sendWhatsAppInvoice(
  clientPhone: string,
  invoiceId: string,
  amount: number
) {
  await client.messages.create({
    body: `Hi! Your invoice ${invoiceId} for ₹${amount} has been generated. View it here: https://clairvoyant.io/invoices/${invoiceId}`,
    from: `whatsapp:${process.env.TWILIO_WHATSAPP_NUMBER}`,
    to: `whatsapp:${clientPhone}`
  });
}
```

---

## Payment Gateway Integration

### Razorpay Setup

**File**: `lib/payment.ts`

```typescript
import Razorpay from 'razorpay';

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || '',
  key_secret: process.env.RAZORPAY_KEY_SECRET || ''
});

export async function createPaymentOrder(
  invoiceId: string,
  amount: number,
  customerEmail: string
) {
  const order = await razorpay.orders.create({
    amount: amount * 100, // Convert to paise
    currency: 'INR',
    receipt: invoiceId,
    customer_notify: 1,
    notes: {
      invoiceId,
      customerEmail
    }
  });

  return order;
}

export async function verifyPayment(
  razorpayOrderId: string,
  razorpayPaymentId: string,
  razorpaySignature: string
) {
  const shasum = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || '');
  shasum.update(`${razorpayOrderId}|${razorpayPaymentId}`);
  const digest = shasum.digest('hex');

  return digest === razorpaySignature;
}
```

---

## White-Labeling for Resale

### Multi-Brand Support

**File**: `lib/branding.ts`

```typescript
interface BrandConfig {
  appName: string;
  logo: string;
  primaryColor: string;
  secondaryColor: string;
  domain: string;
  supportEmail: string;
  termsUrl: string;
}

const BRANDS: Record<string, BrandConfig> = {
  clairvoyant: {
    appName: 'Clairvoyant',
    logo: '/logos/clairvoyant.png',
    primaryColor: '#2563eb',
    secondaryColor: '#14b8a6',
    domain: 'clairvoyant.io',
    supportEmail: 'support@clairvoyant.io',
    termsUrl: 'https://clairvoyant.io/terms'
  },
  partnername: {
    appName: 'Partner Invoice Manager',
    logo: '/logos/partner.png',
    primaryColor: '#7c3aed',
    secondaryColor: '#ec4899',
    domain: 'partner.invoicemanager.io',
    supportEmail: 'support@partner.io',
    termsUrl: 'https://partner.io/terms'
  }
};

export function getBrand(domain: string): BrandConfig {
  const brandKey = domain.split('.')[0];
  return BRANDS[brandKey] || BRANDS.clairvoyant;
}
```

### Custom Domain Setup

1. **Add DNS Record** (for partner.com):
```
CNAME: app.partner.com → clairvoyant-app.vercel.app
```

2. **SSL Certificate** (Automatic via Vercel or Let's Encrypt)

3. **Apply Custom Branding** in `components/Layout.tsx`:
```typescript
const brand = getBrand(window.location.hostname);

<div className={`bg-gradient-to-br from-[${brand.primaryColor}]`}>
  <img src={brand.logo} alt={brand.appName} />
</div>
```

---

## Security & Compliance

### GDPR & Data Protection

```typescript
// lib/security.ts

// Rate limiting
import rateLimit from 'express-rate-limit';

export const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

// Data encryption
import crypto from 'crypto';

export function encryptData(data: string, key: string): string {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(key), iv);
  let encrypted = cipher.update(data, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return iv.toString('hex') + ':' + encrypted;
}

export function decryptData(encrypted: string, key: string): string {
  const parts = encrypted.split(':');
  const iv = Buffer.from(parts[0], 'hex');
  const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(key), iv);
  let decrypted = decipher.update(parts[1], 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}

// Data deletion (right to be forgotten)
export async function deleteUserData(userId: string) {
  await db.query('DELETE FROM users WHERE id = $1', [userId]);
  await db.query('DELETE FROM audit_logs WHERE user_id = $1', [userId]);
  // Cascade deletes handled by foreign keys
}
```

### Two-Factor Authentication

```typescript
import speakeasy from 'speakeasy';
import QRCode from 'qrcode';

export async function enableTwoFA(userId: string) {
  const secret = speakeasy.generateSecret({
    name: `Clairvoyant (${userId})`,
    length: 32
  });

  const qrCode = await QRCode.toDataURL(secret.otpauth_url);

  return {
    secret: secret.base32,
    qrCode
  };
}

export function verifyTwoFA(secret: string, token: string): boolean {
  return speakeasy.totp.verify({
    secret,
    encoding: 'base32',
    token,
    window: 2
  });
}
```

### Regular Backups

```bash
# Daily backup script (backup.sh)
#!/bin/bash

TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_DIR="/backups/clairvoyant"

# Backup PostgreSQL
pg_dump $DATABASE_URL > $BACKUP_DIR/db_$TIMESTAMP.sql

# Upload to S3
aws s3 cp $BACKUP_DIR/db_$TIMESTAMP.sql s3://your-backup-bucket/

# Keep only last 30 days
find $BACKUP_DIR -name "db_*.sql" -mtime +30 -delete
```

---

## Troubleshooting

### Common Issues

| Issue | Solution |
|-------|----------|
| **Blank page on load** | Clear browser cache, check console for JS errors |
| **Database connection failed** | Verify DATABASE_URL in .env.local, check PostgreSQL is running |
| **Email not sending** | Verify SENDGRID_API_KEY, check SendGrid dashboard for bounces |
| **Invoices not calculating correctly** | Check tax_type field, verify item amounts |
| **Payment reconciliation failing** | Verify Razorpay credentials, check webhook configuration |
| **Slow page loads** | Add database indexes (see schema), implement caching layer |
| **Multi-tenant data leakage** | Review tenant_id filters in all queries |

### Performance Optimization

```typescript
// Enable caching
import { cache } from 'react';

export const getCachedInvoice = cache(async (id: string) => {
  return await db.query('SELECT * FROM invoices WHERE id = $1', [id]);
});

// Pagination for large datasets
export async function getPaginatedInvoices(page: number, limit: number = 20) {
  const offset = (page - 1) * limit;
  return await db.query(
    'SELECT * FROM invoices ORDER BY created_at DESC LIMIT $1 OFFSET $2',
    [limit, offset]
  );
}

// API response compression
import compression from 'compression';
app.use(compression());
```

---

## Support & Community

- **Documentation**: https://docs.clairvoyant.io
- **GitHub Issues**: https://github.com/yourrepo/clairvoyant/issues
- **Discord Community**: https://discord.gg/clairvoyant
- **Email Support**: support@clairvoyant.io

---

**Last Updated**: August 2026
**Version**: 1.0.0
