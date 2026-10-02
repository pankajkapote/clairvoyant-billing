# Clairvoyant SaaS - Customization & Multi-Industry Guide

This guide shows how to customize the platform for different industries and use cases while maintaining code modularity.

---

## Table of Contents

1. [Industry Templates](#industry-templates)
2. [Feature Flags Configuration](#feature-flags-configuration)
3. [Branding & Theming](#branding--theming)
4. [Custom Fields](#custom-fields)
5. [Workflow Customization](#workflow-customization)
6. [Integration Hooks](#integration-hooks)

---

## Industry Templates

### Template 1: Influencer Billing (Clairvoyant - Default)

**Use Case**: Managing content creator payments and influencer campaigns

**File**: `config/templates/influencer-billing.json`

```json
{
  "name": "Influencer Billing Platform",
  "industry": "media_marketing",
  "features": {
    "invoicing": true,
    "paymentTracking": true,
    "commissionCalculation": true,
    "campaignTracking": true,
    "performanceMetrics": true,
    "clientPortal": true,
    "vendorRegistry": true
  },
  "customFields": {
    "invoices": [
      {
        "name": "campaignId",
        "label": "Campaign ID",
        "type": "text",
        "required": false
      },
      {
        "name": "influencerHandle",
        "label": "Influencer Handle (@username)",
        "type": "text",
        "required": false
      },
      {
        "name": "deliverables",
        "label": "Content Deliverables",
        "type": "textarea",
        "required": false
      },
      {
        "name": "platforms",
        "label": "Platforms (Instagram, YouTube, TikTok, etc.)",
        "type": "multiselect",
        "options": ["Instagram", "YouTube", "TikTok", "Twitter", "LinkedIn"],
        "required": false
      }
    ],
    "clients": [
      {
        "name": "businessType",
        "label": "Business Type",
        "type": "select",
        "options": ["Brand", "Agency", "E-commerce", "Other"],
        "required": true
      },
      {
        "name": "industry",
        "label": "Industry",
        "type": "text",
        "required": false
      }
    ]
  },
  "invoiceLineItems": {
    "presets": [
      "Instagram Feed Post",
      "Instagram Reel",
      "YouTube Video",
      "TikTok Video",
      "Story Creation",
      "Twitter/X Post",
      "Sponsored Article",
      "Product Review",
      "Live Session",
      "Campaign Management"
    ]
  },
  "reports": [
    "invoice_summary",
    "gst_tax_report",
    "client_ledger",
    "pending_receivables",
    "campaign_performance",
    "influencer_earnings"
  ],
  "taxConfig": {
    "type": "GST_INDIA",
    "defaultRate": 0.18,
    "intraStateCGST": 0.09,
    "intraStateSGST": 0.09
  }
}
```

### Template 2: Creative Agency Service Billing

**Use Case**: Design, development, and marketing services billing

**File**: `config/templates/creative-agency.json`

```json
{
  "name": "Creative Agency Billing",
  "industry": "creative_services",
  "features": {
    "invoicing": true,
    "projectTracking": true,
    "timeTracking": true,
    "expenseManagement": true,
    "resourceAllocation": true,
    "deliverableTracking": true
  },
  "customFields": {
    "invoices": [
      {
        "name": "projectCode",
        "label": "Project Code",
        "type": "text",
        "required": true
      },
      {
        "name": "projectPhase",
        "label": "Project Phase",
        "type": "select",
        "options": ["Discovery", "Design", "Development", "Testing", "Deployment", "Support"],
        "required": true
      },
      {
        "name": "hoursWorked",
        "label": "Hours Worked",
        "type": "number",
        "required": false
      },
      {
        "name": "ratePerHour",
        "label": "Rate Per Hour",
        "type": "currency",
        "required": false
      },
      {
        "name": "teamMembers",
        "label": "Team Members Assigned",
        "type": "multiselect",
        "required": false
      }
    ]
  },
  "invoiceLineItems": {
    "presets": [
      "UI/UX Design",
      "Web Development",
      "Mobile App Development",
      "Graphics Design",
      "Copywriting",
      "Project Management",
      "QA Testing",
      "Deployment",
      "Consultation",
      "Revisions & Support"
    ]
  },
  "reports": [
    "project_profitability",
    "resource_utilization",
    "time_tracking_report",
    "expense_report"
  ]
}
```

### Template 3: SaaS Subscription Billing

**Use Case**: Software-as-a-Service recurring billing

**File**: `config/templates/saas-subscription.json`

```json
{
  "name": "SaaS Subscription Billing",
  "industry": "software",
  "features": {
    "invoicing": true,
    "subscriptionManagement": true,
    "recurringBilling": true,
    "usageTracking": true,
    "customerPortal": true,
    "dunningManagement": true
  },
  "customFields": {
    "invoices": [
      {
        "name": "subscriptionId",
        "label": "Subscription ID",
        "type": "text",
        "required": true
      },
      {
        "name": "billingCycle",
        "label": "Billing Cycle",
        "type": "select",
        "options": ["Monthly", "Quarterly", "Annual"],
        "required": true
      },
      {
        "name": "planName",
        "label": "Plan Name",
        "type": "text",
        "required": true
      },
      {
        "name": "users",
        "label": "Number of Users",
        "type": "number",
        "required": false
      },
      {
        "name": "usage",
        "label": "Usage (API calls, storage, etc.)",
        "type": "text",
        "required": false
      }
    ]
  },
  "subscriptionPlans": [
    {
      "id": "starter",
      "name": "Starter",
      "priceMonthly": 29,
      "features": ["Up to 1,000 API calls", "1 user", "Community support"]
    },
    {
      "id": "pro",
      "name": "Pro",
      "priceMonthly": 99,
      "features": ["Up to 100,000 API calls", "5 users", "Email support"]
    },
    {
      "id": "enterprise",
      "name": "Enterprise",
      "priceMonthly": null,
      "features": ["Unlimited API calls", "Unlimited users", "24/7 phone support"]
    }
  ]
}
```

### Template 4: Freelance Services (Photography, Consulting, etc.)

**Use Case**: Individual service providers and freelancers

**File**: `config/templates/freelancer-services.json`

```json
{
  "name": "Freelancer Services Billing",
  "industry": "freelance_services",
  "features": {
    "invoicing": true,
    "estimateGeneration": true,
    "timeTracking": true,
    "expenseTracking": true,
    "portfolioDisplay": false,
    "clientFeedback": true
  },
  "customFields": {
    "invoices": [
      {
        "name": "projectScope",
        "label": "Project Scope",
        "type": "textarea",
        "required": true
      },
      {
        "name": "deliveryDate",
        "label": "Expected Delivery Date",
        "type": "date",
        "required": false
      },
      {
        "name": "revisionsIncluded",
        "label": "Revisions Included",
        "type": "number",
        "required": false
      }
    ]
  },
  "invoiceLineItems": {
    "presets": [
      "Photography Session (hourly)",
      "Photography Session (flat rate)",
      "Photo Editing",
      "Consulting Hours",
      "Writing/Copywriting",
      "Revisions",
      "Rush Fee",
      "Expenses"
    ]
  }
}
```

### Template 5: Subscription Box / E-Commerce

**Use Case**: Physical product sales and subscription boxes

**File**: `config/templates/ecommerce-subscription.json`

```json
{
  "name": "E-Commerce & Subscription Box",
  "industry": "ecommerce",
  "features": {
    "invoicing": true,
    "inventoryTracking": true,
    "orderManagement": true,
    "shippingIntegration": true,
    "subscriptionManagement": true,
    "returnManagement": true
  },
  "customFields": {
    "invoices": [
      {
        "name": "orderId",
        "label": "Order ID",
        "type": "text",
        "required": true
      },
      {
        "name": "shippingAddress",
        "label": "Shipping Address",
        "type": "textarea",
        "required": true
      },
      {
        "name": "trackingNumber",
        "label": "Tracking Number",
        "type": "text",
        "required": false
      },
      {
        "name": "shippingCost",
        "label": "Shipping Cost",
        "type": "currency",
        "required": false
      }
    ]
  },
  "reports": [
    "sales_by_product",
    "subscription_churn_report",
    "shipping_report"
  ]
}
```

---

## Feature Flags Configuration

**File**: `config/features.ts`

```typescript
interface FeatureFlags {
  [key: string]: {
    enabled: boolean;
    industries?: string[];
    requiredPlan?: 'starter' | 'pro' | 'enterprise';
    beta?: boolean;
  };
}

export const FEATURE_FLAGS: FeatureFlags = {
  // Core Features
  invoicing: { enabled: true },
  clientRegistry: { enabled: true },
  vendorRegistry: { enabled: true },
  paymentTracking: { enabled: true },
  
  // Tax & Compliance
  gstCompliance: { enabled: true, industries: ['india'] },
  multiCurrencySupport: { enabled: false, requiredPlan: 'enterprise' },
  taxReports: { enabled: true, requiredPlan: 'pro' },
  
  // Advanced Features
  timeTracking: { enabled: true, requiredPlan: 'pro', industries: ['creative_services', 'freelance_services'] },
  projectTracking: { enabled: true, requiredPlan: 'pro', industries: ['creative_services', 'software'] },
  subscriptionManagement: { enabled: true, requiredPlan: 'pro', industries: ['software', 'ecommerce'] },
  expenseTracking: { enabled: true, requiredPlan: 'pro' },
  
  // Communications
  emailNotifications: { enabled: true, requiredPlan: 'starter' },
  whatsappIntegration: { enabled: false, requiredPlan: 'pro', beta: true },
  smsReminders: { enabled: false, requiredPlan: 'pro', beta: true },
  
  // Analytics
  basicAnalytics: { enabled: true },
  advancedAnalytics: { enabled: true, requiredPlan: 'pro' },
  predictiveAnalytics: { enabled: false, requiredPlan: 'enterprise', beta: true },
  
  // Integrations
  razorpayIntegration: { enabled: false, requiredPlan: 'pro' },
  awsS3Integration: { enabled: false, requiredPlan: 'pro' },
  stripeIntegration: { enabled: false, requiredPlan: 'pro' },
  zapierIntegration: { enabled: false, requiredPlan: 'enterprise' },
  
  // RBAC & Collaboration
  multiUserAccess: { enabled: true, requiredPlan: 'pro' },
  auditLogging: { enabled: true },
  twoFactorAuth: { enabled: true, requiredPlan: 'pro' },
  apiAccess: { enabled: false, requiredPlan: 'enterprise' }
};

// Helper function to check if feature is enabled
export function isFeatureEnabled(
  featureName: string,
  userPlan: string = 'starter',
  industry: string = 'general'
): boolean {
  const feature = FEATURE_FLAGS[featureName];
  if (!feature) return false;
  
  if (!feature.enabled) return false;
  if (feature.beta) return false; // Disabled by default if beta
  if (feature.industries && !feature.industries.includes(industry)) return false;
  
  const planHierarchy = { starter: 0, pro: 1, enterprise: 2 };
  if (feature.requiredPlan && planHierarchy[userPlan] < planHierarchy[feature.requiredPlan]) {
    return false;
  }
  
  return true;
}
```

---

## Branding & Theming

### Color Themes for Different Industries

**File**: `config/themes.json`

```json
{
  "themes": {
    "influencer_billing": {
      "name": "Clairvoyant",
      "primary": "#2563eb",
      "secondary": "#14b8a6",
      "accent": "#f97316",
      "success": "#22c55e",
      "warning": "#eab308",
      "danger": "#ef4444"
    },
    "creative_agency": {
      "name": "CreativeStudio",
      "primary": "#7c3aed",
      "secondary": "#db2777",
      "accent": "#ec4899",
      "success": "#10b981",
      "warning": "#f59e0b",
      "danger": "#dc2626"
    },
    "saas": {
      "name": "DevFlow",
      "primary": "#0ea5e9",
      "secondary": "#06b6d4",
      "accent": "#8b5cf6",
      "success": "#34d399",
      "warning": "#fbbf24",
      "danger": "#f87171"
    },
    "freelancer": {
      "name": "FreelancePro",
      "primary": "#6366f1",
      "secondary": "#a78bfa",
      "accent": "#f472b6",
      "success": "#34d399",
      "warning": "#fcd34d",
      "danger": "#fb7185"
    }
  }
}
```

### Custom CSS Variables

**File**: `styles/themes.css`

```css
:root[data-theme="influencer_billing"] {
  --color-primary: #2563eb;
  --color-secondary: #14b8a6;
  --color-accent: #f97316;
  --color-bg-light: #f8fafc;
  --color-border: #e2e8f0;
}

:root[data-theme="creative_agency"] {
  --color-primary: #7c3aed;
  --color-secondary: #db2777;
  --color-accent: #ec4899;
  --color-bg-light: #faf5ff;
  --color-border: #f3e8ff;
}
```

### Apply Theme Dynamically

```typescript
// lib/theming.ts

export function setTheme(themeKey: string) {
  const theme = THEMES[themeKey];
  if (!theme) return;
  
  const root = document.documentElement;
  root.setAttribute('data-theme', themeKey);
  
  Object.entries(theme).forEach(([key, value]) => {
    if (key !== 'name') {
      root.style.setProperty(`--color-${key}`, value);
    }
  });
  
  localStorage.setItem('selectedTheme', themeKey);
}

// Load theme on app startup
export function loadTheme(industryKey: string) {
  const savedTheme = localStorage.getItem('selectedTheme');
  const themeToLoad = savedTheme || industryKey;
  setTheme(themeToLoad);
}
```

---

## Custom Fields

### Add Custom Fields to Invoices

**File**: `lib/customFields.ts`

```typescript
interface CustomField {
  name: string;
  label: string;
  type: 'text' | 'number' | 'date' | 'select' | 'multiselect' | 'textarea' | 'currency';
  required: boolean;
  options?: string[];
  defaultValue?: any;
}

export class CustomFieldManager {
  private fields: Map<string, CustomField> = new Map();

  addField(field: CustomField) {
    this.fields.set(field.name, field);
  }

  getField(name: string): CustomField | undefined {
    return this.fields.get(name);
  }

  getAllFields(): CustomField[] {
    return Array.from(this.fields.values());
  }

  renderField(field: CustomField, value?: any) {
    switch (field.type) {
      case 'text':
      case 'number':
      case 'date':
      case 'currency':
        return (
          <input
            type={field.type}
            name={field.name}
            placeholder={field.label}
            defaultValue={value}
            required={field.required}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
          />
        );
      case 'select':
        return (
          <select
            name={field.name}
            defaultValue={value}
            required={field.required}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
          >
            {field.options?.map(opt => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        );
      case 'textarea':
        return (
          <textarea
            name={field.name}
            placeholder={field.label}
            defaultValue={value}
            required={field.required}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            rows={3}
          />
        );
      default:
        return null;
    }
  }
}
```

### Configure Custom Fields per Industry

```typescript
// config/customFields.ts

export const customFieldsByIndustry = {
  'influencer_billing': [
    { name: 'campaignId', label: 'Campaign ID', type: 'text', required: false },
    { name: 'influencerHandle', label: 'Influencer Handle', type: 'text', required: false },
    { name: 'platforms', label: 'Platforms', type: 'multiselect', options: ['Instagram', 'YouTube', 'TikTok'], required: false }
  ],
  'creative_agency': [
    { name: 'projectCode', label: 'Project Code', type: 'text', required: true },
    { name: 'hoursWorked', label: 'Hours Worked', type: 'number', required: false },
    { name: 'ratePerHour', label: 'Rate Per Hour', type: 'currency', required: false }
  ],
  'freelancer_services': [
    { name: 'projectScope', label: 'Project Scope', type: 'textarea', required: true },
    { name: 'deliveryDate', label: 'Delivery Date', type: 'date', required: false },
    { name: 'revisionsIncluded', label: 'Revisions Included', type: 'number', required: false }
  ]
};
```

---

## Workflow Customization

### Custom Invoice Workflow States

**File**: `config/workflows.ts`

```typescript
interface WorkflowState {
  id: string;
  name: string;
  label: string;
  color: string;
  transitions: string[]; // Can transition to these states
}

export const INVOICE_WORKFLOWS = {
  simple: {
    name: 'Simple',
    description: 'Basic invoice workflow',
    states: [
      { id: 'draft', name: 'Draft', label: 'Draft', color: 'gray', transitions: ['sent', 'cancelled'] },
      { id: 'sent', name: 'Sent', label: 'Sent to Client', color: 'blue', transitions: ['paid', 'partially_paid', 'cancelled'] },
      { id: 'paid', name: 'Paid', label: 'Payment Received', color: 'green', transitions: [] },
      { id: 'cancelled', name: 'Cancelled', label: 'Cancelled', color: 'red', transitions: [] }
    ]
  },
  detailed: {
    name: 'Detailed',
    description: 'Advanced invoice workflow with approval',
    states: [
      { id: 'draft', name: 'Draft', label: 'Draft', color: 'gray', transitions: ['review'] },
      { id: 'review', name: 'Review', label: 'Awaiting Approval', color: 'yellow', transitions: ['approved', 'rejected'] },
      { id: 'approved', name: 'Approved', label: 'Approved', color: 'cyan', transitions: ['sent'] },
      { id: 'rejected', name: 'Rejected', label: 'Rejected', color: 'red', transitions: ['draft'] },
      { id: 'sent', name: 'Sent', label: 'Sent to Client', color: 'blue', transitions: ['viewed', 'cancelled'] },
      { id: 'viewed', name: 'Viewed', label: 'Viewed by Client', color: 'indigo', transitions: ['paid', 'partially_paid', 'disputed'] },
      { id: 'paid', name: 'Paid', label: 'Payment Received', color: 'green', transitions: [] },
      { id: 'partially_paid', name: 'Partial', label: 'Partially Paid', color: 'orange', transitions: ['paid'] },
      { id: 'disputed', name: 'Disputed', label: 'Payment Disputed', color: 'purple', transitions: ['resolved', 'cancelled'] },
      { id: 'resolved', name: 'Resolved', label: 'Dispute Resolved', color: 'green', transitions: ['paid', 'partially_paid'] },
      { id: 'cancelled', name: 'Cancelled', label: 'Cancelled', color: 'red', transitions: [] }
    ]
  }
};

export function getWorkflow(workflowType: string) {
  return INVOICE_WORKFLOWS[workflowType];
}
```

### Approval Workflows

```typescript
interface ApprovalRule {
  id: string;
  name: string;
  condition: (invoice: Invoice) => boolean;
  requiresApproval: boolean;
  approvers: string[];
}

export const APPROVAL_RULES = [
  {
    id: 'high_value',
    name: 'High Value Invoices',
    condition: (invoice) => invoice.total > 100000,
    requiresApproval: true,
    approvers: ['admin', 'finance_manager']
  },
  {
    id: 'new_client',
    name: 'New Client Invoices',
    condition: (invoice) => invoice.client.isNew,
    requiresApproval: true,
    approvers: ['admin']
  },
  {
    id: 'revision',
    name: 'Invoice Revisions',
    condition: (invoice) => invoice.revisionCount > 0,
    requiresApproval: true,
    approvers: ['admin', 'finance_manager']
  }
];
```

---

## Integration Hooks

### Webhook System for Custom Integrations

**File**: `lib/webhooks.ts`

```typescript
interface WebhookEvent {
  type: string;
  timestamp: Date;
  data: any;
  tenantId: string;
}

type WebhookHandler = (event: WebhookEvent) => Promise<void>;

export class WebhookManager {
  private handlers: Map<string, WebhookHandler[]> = new Map();

  // Register a handler for an event
  on(eventType: string, handler: WebhookHandler) {
    if (!this.handlers.has(eventType)) {
      this.handlers.set(eventType, []);
    }
    this.handlers.get(eventType)?.push(handler);
  }

  // Trigger event
  async emit(event: WebhookEvent) {
    const handlers = this.handlers.get(event.type) || [];
    await Promise.all(handlers.map(h => h(event).catch(console.error)));
  }
}

export const webhooks = new WebhookManager();

// Register custom handlers for different industries

// For Influencer Billing
webhooks.on('invoice.created', async (event) => {
  const { invoice } = event.data;
  console.log(`Invoice created for influencer campaign: ${invoice.campaignId}`);
  // Trigger campaign tracking update
});

// For Creative Agency
webhooks.on('invoice.created', async (event) => {
  const { invoice } = event.data;
  console.log(`Invoice created for project: ${invoice.projectCode}`);
  // Update project status
  // Send to project management tool
});

// For SaaS
webhooks.on('payment.recorded', async (event) => {
  const { payment } = event.data;
  console.log(`Payment recorded for subscription: ${payment.subscriptionId}`);
  // Update subscription status
  // Send to accounting system
});
```

### External API Integration Adapters

**File**: `lib/integrations/adapters.ts`

```typescript
interface IntegrationAdapter {
  name: string;
  connect(): Promise<void>;
  disconnect(): Promise<void>;
  sync(data: any): Promise<any>;
}

// Zapier-like integration
export class ZapierAdapter implements IntegrationAdapter {
  name = 'Zapier';

  async connect() {
    // OAuth flow
  }

  async disconnect() {
    // Revoke token
  }

  async sync(invoice: Invoice) {
    // Send invoice data to Zapier webhook
    await fetch(process.env.ZAPIER_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(invoice)
    });
  }
}

// Google Sheets integration
export class GoogleSheetsAdapter implements IntegrationAdapter {
  name = 'Google Sheets';

  async connect() {
    // OAuth flow
  }

  async disconnect() {
    // Revoke token
  }

  async sync(invoices: Invoice[]) {
    // Append invoices to Google Sheet
    const rows = invoices.map(inv => [inv.id, inv.clientName, inv.total, inv.status]);
    // Use Google Sheets API to append rows
  }
}

// Notion integration
export class NotionAdapter implements IntegrationAdapter {
  name = 'Notion';

  async connect() {
    // OAuth flow
  }

  async disconnect() {
    // Revoke token
  }

  async sync(invoice: Invoice) {
    // Create Notion database entry
  }
}
```

### Custom Report Generator

**File**: `lib/reportGenerator.ts`

```typescript
interface ReportTemplate {
  id: string;
  name: string;
  fields: string[];
  groupBy?: string;
  sortBy?: string;
  filters?: { [key: string]: any };
}

export const CUSTOM_REPORTS = {
  influencer_earnings: {
    id: 'influencer_earnings',
    name: 'Influencer Earnings Report',
    fields: ['influencerHandle', 'campaignId', 'amount', 'status', 'date'],
    groupBy: 'influencerHandle',
    sortBy: 'amount:desc'
  },
  project_revenue: {
    id: 'project_revenue',
    name: 'Project Revenue Report',
    fields: ['projectCode', 'clientName', 'amount', 'status', 'hoursWorked'],
    groupBy: 'projectCode',
    sortBy: 'amount:desc'
  },
  monthly_revenue: {
    id: 'monthly_revenue',
    name: 'Monthly Revenue Breakdown',
    fields: ['month', 'total', 'invoiceCount', 'collectionRate'],
    groupBy: 'month',
    sortBy: 'month:desc'
  }
};

export async function generateCustomReport(
  templateId: string,
  dateRange: { start: string; end: string }
) {
  const template = CUSTOM_REPORTS[templateId];
  if (!template) throw new Error('Report template not found');

  // Query data based on template
  const invoices = await getInvoicesByDateRange(dateRange);
  
  // Transform data based on fields
  const data = invoices.map(inv =>
    template.fields.reduce((obj, field) => {
      obj[field] = getNestedProperty(inv, field);
      return obj;
    }, {})
  );

  // Group if specified
  if (template.groupBy) {
    return groupByField(data, template.groupBy);
  }

  return data;
}
```

---

## Complete Customization Example: New Industry

Let's create a "Consulting Firm" template from scratch:

**File**: `config/templates/consulting-firm.json`

```json
{
  "name": "Consulting Firm Billing",
  "industry": "consulting",
  "features": {
    "invoicing": true,
    "projectTracking": true,
    "timeTracking": true,
    "expenseTracking": true,
    "retainerTracking": true,
    "consultantAllocation": true,
    "deliverableTracking": true,
    "clientPortal": true
  },
  "customFields": {
    "invoices": [
      {
        "name": "engagementId",
        "label": "Engagement ID",
        "type": "text",
        "required": true
      },
      {
        "name": "engagementType",
        "label": "Engagement Type",
        "type": "select",
        "options": ["Project-based", "Time & Materials", "Retainer", "Fixed Fee"],
        "required": true
      },
      {
        "name": "consultantsInvolved",
        "label": "Consultants Involved",
        "type": "multiselect",
        "required": false
      },
      {
        "name": "deliverables",
        "label": "Key Deliverables",
        "type": "textarea",
        "required": false
      }
    ],
    "clients": [
      {
        "name": "industry",
        "label": "Client Industry",
        "type": "text",
        "required": false
      },
      {
        "name": "contactPerson",
        "label": "Primary Contact",
        "type": "text",
        "required": true
      }
    ]
  },
  "invoiceLineItems": {
    "presets": [
      "Strategy & Planning",
      "Implementation",
      "Training",
      "Support & Maintenance",
      "Retainer Fee",
      "Expenses Reimbursement",
      "Travel",
      "Out-of-Pocket Costs"
    ]
  },
  "workflows": {
    "type": "detailed",
    "requireApprovalFor": ["retainer", "fixed_fee"]
  },
  "reports": [
    "engagement_summary",
    "consultant_utilization",
    "client_ledger",
    "retainer_status",
    "project_profitability"
  ]
}
```

**Implement in React Component**:

```typescript
// pages/setup.tsx

import { useEffect, useState } from 'react';
import { INDUSTRY_TEMPLATES } from '@/config/templates';
import { CustomFieldManager } from '@/lib/customFields';
import { setTheme } from '@/lib/theming';
import { isFeatureEnabled } from '@/config/features';

export default function SetupPage() {
  const [selectedIndustry, setSelectedIndustry] = useState('consulting');
  const [customFields, setCustomFields] = useState([]);

  useEffect(() => {
    const template = INDUSTRY_TEMPLATES[selectedIndustry];
    if (template) {
      // Load custom fields for this industry
      setCustomFields(template.customFields.invoices);
      
      // Apply theme
      setTheme(selectedIndustry);
    }
  }, [selectedIndustry]);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Select Your Industry</h1>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {Object.entries(INDUSTRY_TEMPLATES).map(([key, template]) => (
          <button
            key={key}
            onClick={() => setSelectedIndustry(key)}
            className={`p-4 border-2 rounded-lg transition-all ${
              selectedIndustry === key
                ? 'border-blue-600 bg-blue-50'
                : 'border-gray-200 hover:border-blue-300'
            }`}
          >
            <h3 className="font-bold">{template.name}</h3>
            <p className="text-sm text-gray-600">{template.industry}</p>
          </button>
        ))}
      </div>

      {/* Show enabled features for selected industry */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-lg font-bold mb-4">Enabled Features</h2>
        <ul className="space-y-2">
          {Object.entries(FEATURE_FLAGS).map(([featureName, featureConfig]) => {
            const enabled = isFeatureEnabled(featureName, 'pro', selectedIndustry);
            return (
              <li key={featureName} className={enabled ? 'text-green-600' : 'text-gray-400'}>
                {enabled ? '✓' : '✗'} {featureName}
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
```

---

## Deployment Checklist for Customizations

- [ ] Update `.env.local` with industry-specific API keys
- [ ] Select and configure template from `config/templates/`
- [ ] Enable/disable features in `config/features.json`
- [ ] Set custom theme in `config/themes.json`
- [ ] Add custom fields for industry in `config/customFields.ts`
- [ ] Configure workflows in `config/workflows.ts`
- [ ] Set up integrations in `lib/integrations/`
- [ ] Deploy with `npm run build && npm run start`
- [ ] Test all custom workflows and integrations
- [ ] Document customizations in internal wiki

---

**Version**: 1.0.0  
**Last Updated**: August 2026
