-- ============================================================
-- CLAIRVOYANT SAAS - COMPLETE DATABASE SCHEMA
-- ============================================================
-- PostgreSQL 13+ Compatible
-- For Supabase: Copy entire content → SQL Editor → Run
-- For PostgreSQL: psql -f DATABASE_SCHEMA.sql
-- ============================================================

-- ============================================================
-- 1. TENANTS TABLE (Multi-tenancy support)
-- ============================================================
CREATE TABLE IF NOT EXISTS tenants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  domain VARCHAR(255) UNIQUE NOT NULL,
  plan_id VARCHAR(50) DEFAULT 'starter',
  created_at TIMESTAMP DEFAULT NOW(),
  is_active BOOLEAN DEFAULT true
);

CREATE INDEX IF NOT EXISTS idx_tenants_domain ON tenants(domain);

-- ============================================================
-- 2. USERS TABLE (Multi-user with roles)
-- ============================================================
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
  email VARCHAR(255) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(50) DEFAULT 'viewer',  -- admin, editor, viewer
  first_name VARCHAR(255),
  last_name VARCHAR(255),
  is_active BOOLEAN DEFAULT true,
  last_login TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(tenant_id, email)
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_tenant ON users(tenant_id);

-- ============================================================
-- 3. CLIENTS TABLE (Invoice recipients)
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
  contact_type VARCHAR(50),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_clients_tenant ON clients(tenant_id);
CREATE INDEX IF NOT EXISTS idx_clients_email ON clients(email);
CREATE INDEX IF NOT EXISTS idx_clients_gstin ON clients(gstin);

-- ============================================================
-- 4. INVOICES TABLE (Main invoicing table)
-- ============================================================
CREATE TABLE IF NOT EXISTS invoices (
  id VARCHAR(50) PRIMARY KEY,  -- Format: CMPL/26-27/0001
  tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
  client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
  invoice_date DATE NOT NULL,
  due_date DATE,
  subtotal DECIMAL(15, 2) DEFAULT 0,
  cgst DECIMAL(15, 2) DEFAULT 0,
  sgst DECIMAL(15, 2) DEFAULT 0,
  igst DECIMAL(15, 2) DEFAULT 0,
  total_tax DECIMAL(15, 2) DEFAULT 0,
  total DECIMAL(15, 2) DEFAULT 0,
  tax_type VARCHAR(50),  -- intrastate, interstate
  status VARCHAR(50) DEFAULT 'DRAFT',  -- DRAFT, SENT, VIEWED, PAID, PARTIALLY_PAID, OVERDUE, CANCELLED
  amount_paid DECIMAL(15, 2) DEFAULT 0,
  balance_due DECIMAL(15, 2) DEFAULT 0,
  notes TEXT,
  revision_count INTEGER DEFAULT 0,
  sent_at TIMESTAMP,
  viewed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_invoices_tenant_date ON invoices(tenant_id, invoice_date);
CREATE INDEX IF NOT EXISTS idx_invoices_client ON invoices(client_id);
CREATE INDEX IF NOT EXISTS idx_invoices_status ON invoices(status);
CREATE INDEX IF NOT EXISTS idx_invoices_date ON invoices(invoice_date DESC);

-- ============================================================
-- 5. INVOICE ITEMS TABLE (Line items for invoices)
-- ============================================================
CREATE TABLE IF NOT EXISTS invoice_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_id VARCHAR(50) REFERENCES invoices(id) ON DELETE CASCADE,
  particulars TEXT NOT NULL,
  hsn_code VARCHAR(20),
  quantity INTEGER DEFAULT 1,
  unit_price DECIMAL(15, 2),
  amount DECIMAL(15, 2),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_invoice_items_invoice ON invoice_items(invoice_id);

-- ============================================================
-- 6. PAYMENTS TABLE (Payment tracking)
-- ============================================================
CREATE TABLE IF NOT EXISTS payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
  invoice_id VARCHAR(50) REFERENCES invoices(id) ON DELETE CASCADE,
  amount DECIMAL(15, 2) NOT NULL,
  payment_mode VARCHAR(50),  -- NEFT, UPI, Cheque, Cash, Online, Card
  reference_number VARCHAR(255),
  payment_date DATE NOT NULL,
  reconciled BOOLEAN DEFAULT false,
  reconciled_at TIMESTAMP,
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_payments_invoice ON payments(invoice_id);
CREATE INDEX IF NOT EXISTS idx_payments_tenant ON payments(tenant_id);
CREATE INDEX IF NOT EXISTS idx_payments_date ON payments(payment_date DESC);

-- ============================================================
-- 7. VENDORS TABLE (Service/product providers)
-- ============================================================
CREATE TABLE IF NOT EXISTS vendors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
  vendor_name VARCHAR(255) NOT NULL,
  contact_person VARCHAR(255),
  email VARCHAR(255),
  phone VARCHAR(20),
  pan VARCHAR(20),
  gstin VARCHAR(20),
  address TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_vendors_tenant ON vendors(tenant_id);
CREATE INDEX IF NOT EXISTS idx_vendors_email ON vendors(email);

-- ============================================================
-- 8. AUDIT LOG TABLE (Compliance & tracking)
-- ============================================================
CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  action VARCHAR(50),  -- CREATE, UPDATE, DELETE, CANCEL, VIEW, DOWNLOAD
  entity_type VARCHAR(100),  -- INVOICE, CLIENT, PAYMENT, VENDOR, USER, SETTINGS
  entity_id VARCHAR(255),
  entity_name VARCHAR(255),
  description TEXT,
  old_values JSONB,
  new_values JSONB,
  ip_address VARCHAR(45),
  user_agent TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_audit_logs_tenant ON audit_logs(tenant_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_audit_logs_user ON audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_entity ON audit_logs(entity_type, entity_id);

-- ============================================================
-- 9. ORGANIZATION SETTINGS TABLE (Company configuration)
-- ============================================================
CREATE TABLE IF NOT EXISTS org_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID UNIQUE REFERENCES tenants(id) ON DELETE CASCADE,
  company_name VARCHAR(255) NOT NULL,
  invoice_prefix VARCHAR(10) NOT NULL DEFAULT 'CMI',
  pan VARCHAR(20),
  gstin VARCHAR(20),
  registration_number VARCHAR(100),
  business_type VARCHAR(100),
  address TEXT,
  city VARCHAR(100),
  state VARCHAR(100),
  postal_code VARCHAR(20),
  country VARCHAR(100),
  bank_name VARCHAR(255),
  account_name VARCHAR(255),
  account_number VARCHAR(255),
  ifsc_code VARCHAR(20),
  swift_code VARCHAR(20),
  logo_url TEXT,
  website VARCHAR(255),
  phone VARCHAR(20),
  email VARCHAR(255),
  tax_rate DECIMAL(5, 2) DEFAULT 18,
  financial_year_start INTEGER DEFAULT 4,  -- Month (1-12)
  currency VARCHAR(3) DEFAULT 'INR',
  timezone VARCHAR(50) DEFAULT 'Asia/Kolkata',
  language VARCHAR(10) DEFAULT 'en',
  payment_terms VARCHAR(255),
  default_notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- ============================================================
-- 10. FEATURES/SUBSCRIPTION TABLE (Plan management)
-- ============================================================
CREATE TABLE IF NOT EXISTS subscription_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID UNIQUE REFERENCES tenants(id) ON DELETE CASCADE,
  plan_type VARCHAR(50) NOT NULL,  -- free, starter, pro, enterprise
  max_invoices INTEGER DEFAULT 50,
  max_users INTEGER DEFAULT 1,
  max_clients INTEGER DEFAULT 10,
  max_storage_mb INTEGER DEFAULT 100,
  features JSONB,  -- JSON array of enabled features
  started_at TIMESTAMP DEFAULT NOW(),
  expires_at TIMESTAMP,
  auto_renew BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- ============================================================
-- 11. EMAIL TEMPLATES TABLE (Customizable templates)
-- ============================================================
CREATE TABLE IF NOT EXISTS email_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
  template_type VARCHAR(50) NOT NULL,  -- invoice_sent, payment_reminder, etc.
  name VARCHAR(255) NOT NULL,
  subject VARCHAR(255),
  body TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- ============================================================
-- 12. NOTIFICATIONS TABLE (User notifications)
-- ============================================================
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  type VARCHAR(50),  -- invoice_due, payment_received, etc.
  title VARCHAR(255),
  message TEXT,
  related_entity_type VARCHAR(100),
  related_entity_id VARCHAR(255),
  is_read BOOLEAN DEFAULT false,
  read_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id, is_read);

-- ============================================================
-- 13. ACTIVITY LOG TABLE (User activity tracking)
-- ============================================================
CREATE TABLE IF NOT EXISTS activity_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  activity_type VARCHAR(100),
  resource_type VARCHAR(100),
  resource_id VARCHAR(255),
  details JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_activity_logs_user ON activity_logs(user_id, created_at DESC);

-- ============================================================
-- INSERT SAMPLE DATA (For testing/demo)
-- ============================================================

-- Insert sample tenant
INSERT INTO tenants (id, name, domain, plan_id, is_active) VALUES (
  'f47ac10b-58cc-4372-a567-0e02b2c3d479'::uuid,
  'Clairvoyant Made Private Limited',
  'clairvoyant.local',
  'pro',
  true
) ON CONFLICT DO NOTHING;

-- Insert sample admin user
INSERT INTO users (tenant_id, email, password_hash, role, first_name, last_name) VALUES (
  'f47ac10b-58cc-4372-a567-0e02b2c3d479'::uuid,
  'admin@clairvoyant.com',
  '$2b$10$dummy_hash_for_demo_only',
  'admin',
  'Admin',
  'User'
) ON CONFLICT DO NOTHING;

-- Insert sample client
INSERT INTO clients (tenant_id, company_name, representative, pan, gstin, state_code, email, phone) VALUES (
  'f47ac10b-58cc-4372-a567-0e02b2c3d479'::uuid,
  'Amazon India Media',
  'Rajesh Kumar',
  'CBVPK9244C',
  '27AABCA1234H1Z0',
  '27',
  'accounts@amazon.com',
  '+91-9876543210'
) ON CONFLICT DO NOTHING;

-- Insert sample organization settings
INSERT INTO org_settings (tenant_id, company_name, invoice_prefix, pan, gstin, address, bank_name, account_name, account_number, ifsc_code) VALUES (
  'f47ac10b-58cc-4372-a567-0e02b2c3d479'::uuid,
  'Clairvoyant Made Private Limited',
  'CMPL',
  'AANCC2517L',
  '27AANCC2517L1ZE',
  'E2/205, Rutu Tower, Patlipada, Off Ghodbunder Road, Thane, Maharashtra, 400607',
  'HDFC Bank',
  'Clairvoyant Made Private Limited',
  '50200076668915',
  'HDFC0000203'
) ON CONFLICT DO NOTHING;

-- ============================================================
-- VIEWS FOR COMMON QUERIES
-- ============================================================

-- View: Invoice Summary
CREATE OR REPLACE VIEW invoice_summary AS
SELECT
  i.id,
  i.tenant_id,
  i.invoice_date,
  c.company_name,
  i.total,
  i.status,
  i.amount_paid,
  i.balance_due,
  COUNT(ii.id) as item_count
FROM invoices i
LEFT JOIN clients c ON i.client_id = c.id
LEFT JOIN invoice_items ii ON i.id = ii.invoice_id
GROUP BY i.id, i.tenant_id, i.invoice_date, c.company_name, i.total, i.status, i.amount_paid, i.balance_due;

-- View: Overdue Invoices
CREATE OR REPLACE VIEW overdue_invoices AS
SELECT
  i.id,
  i.tenant_id,
  i.client_id,
  c.company_name,
  i.invoice_date,
  i.due_date,
  i.total,
  i.balance_due,
  CURRENT_DATE - i.due_date as days_overdue
FROM invoices i
LEFT JOIN clients c ON i.client_id = c.id
WHERE i.status NOT IN ('PAID', 'CANCELLED')
  AND i.due_date < CURRENT_DATE;

-- View: Revenue by Month
CREATE OR REPLACE VIEW revenue_by_month AS
SELECT
  DATE_TRUNC('month', i.invoice_date)::DATE as month,
  i.tenant_id,
  COUNT(i.id) as invoice_count,
  SUM(i.total) as total_revenue,
  SUM(i.amount_paid) as amount_collected,
  SUM(i.balance_due) as amount_pending
FROM invoices i
WHERE i.status NOT IN ('CANCELLED')
GROUP BY DATE_TRUNC('month', i.invoice_date), i.tenant_id;

-- View: Client Revenue
CREATE OR REPLACE VIEW client_revenue AS
SELECT
  c.id,
  c.tenant_id,
  c.company_name,
  COUNT(i.id) as invoice_count,
  SUM(i.total) as total_amount,
  SUM(i.amount_paid) as amount_paid,
  SUM(i.balance_due) as amount_pending
FROM clients c
LEFT JOIN invoices i ON c.id = i.client_id AND i.status NOT IN ('CANCELLED')
GROUP BY c.id, c.tenant_id, c.company_name;

-- ============================================================
-- FUNCTIONS FOR BUSINESS LOGIC
-- ============================================================

-- Function: Calculate GST Amount
CREATE OR REPLACE FUNCTION calculate_gst(
  subtotal DECIMAL,
  tax_type VARCHAR,
  OUT cgst DECIMAL,
  OUT sgst DECIMAL,
  OUT igst DECIMAL
) AS $$
BEGIN
  IF tax_type = 'intrastate' THEN
    cgst := subtotal * 0.09;
    sgst := subtotal * 0.09;
    igst := 0;
  ELSIF tax_type = 'interstate' THEN
    cgst := 0;
    sgst := 0;
    igst := subtotal * 0.18;
  ELSE
    cgst := 0;
    sgst := 0;
    igst := 0;
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Function: Update Invoice Status
CREATE OR REPLACE FUNCTION update_invoice_status()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.amount_paid >= NEW.total THEN
    NEW.status := 'PAID';
    NEW.balance_due := 0;
  ELSIF NEW.amount_paid > 0 THEN
    NEW.status := 'PARTIALLY_PAID';
    NEW.balance_due := NEW.total - NEW.amount_paid;
  ELSE
    IF NEW.due_date < CURRENT_DATE AND NEW.status != 'PAID' THEN
      NEW.status := 'OVERDUE';
    END IF;
    NEW.balance_due := NEW.total - NEW.amount_paid;
  END IF;
  NEW.updated_at := NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger: Update invoice status on insert/update
CREATE TRIGGER trigger_update_invoice_status
BEFORE INSERT OR UPDATE ON invoices
FOR EACH ROW
EXECUTE FUNCTION update_invoice_status();

-- ============================================================
-- SCHEMA INITIALIZATION COMPLETE
-- ============================================================
-- All tables, indexes, views, and functions created successfully!
-- Database is ready for Clairvoyant SaaS Platform.
-- ============================================================
