# Clairvoyant SaaS - REST API Documentation

## Base URL
```
Development: http://localhost:3000/api
Production: https://clairvoyant.io/api
```

## Authentication

### Bearer Token
All API requests require an Authorization header:
```bash
Authorization: Bearer <jwt_token>
```

### Obtain Token
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@clairvoyant.com",
    "password": "demo123"
  }'

# Response
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "user-123",
    "email": "admin@clairvoyant.com",
    "role": "admin"
  }
}
```

---

## Invoices API

### List Invoices
```bash
GET /api/invoices?page=1&limit=20&status=ALL&clientId=ALL&dateFrom=2026-01-01&dateTo=2026-12-31

Headers: Authorization: Bearer <token>

Response (200 OK):
{
  "data": [
    {
      "id": "CMPL/26-27/0001",
      "clientId": "client-123",
      "date": "2026-07-10",
      "subtotal": 50000,
      "cgst": 4500,
      "sgst": 4500,
      "igst": 0,
      "total": 59000,
      "taxType": "intrastate",
      "status": "PAID",
      "createdAt": "2026-07-10T10:30:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 45,
    "pages": 3
  }
}
```

### Get Single Invoice
```bash
GET /api/invoices/:invoiceId

Response (200 OK):
{
  "id": "CMPL/26-27/0001",
  "clientId": "client-123",
  "client": {
    "id": "client-123",
    "companyName": "Amazon India Media",
    "email": "accounts@amazon.com"
  },
  "date": "2026-07-10",
  "items": [
    {
      "particulars": "Amazon Live Campaign - Q3 2026",
      "hsn": "998361",
      "quantity": 1,
      "amount": 50000
    }
  ],
  "subtotal": 50000,
  "taxBreakdown": {
    "type": "intrastate",
    "cgst": 4500,
    "sgst": 4500,
    "igst": 0
  },
  "total": 59000,
  "status": "PAID",
  "amountPaid": 59000,
  "balanceDue": 0,
  "notes": "",
  "createdAt": "2026-07-10T10:30:00Z",
  "updatedAt": "2026-07-15T12:00:00Z"
}
```

### Create Invoice
```bash
POST /api/invoices

Body:
{
  "clientId": "client-123",
  "date": "2026-07-10",
  "items": [
    {
      "particulars": "Amazon Live Campaign - Q3 2026",
      "hsn": "998361",
      "quantity": 1,
      "amount": 50000
    }
  ],
  "taxType": "intrastate",
  "notes": "Payment due within 30 days"
}

Response (201 Created):
{
  "id": "CMPL/26-27/0002",
  "total": 59000,
  "status": "DRAFT"
}
```

### Update Invoice
```bash
PATCH /api/invoices/:invoiceId

Body:
{
  "items": [...],
  "notes": "Updated notes",
  "taxType": "intrastate"
}

Response (200 OK):
{
  "id": "CMPL/26-27/0001-1",
  "message": "Invoice updated and revision created"
}
```

### Cancel Invoice
```bash
DELETE /api/invoices/:invoiceId

Response (200 OK):
{
  "id": "CMPL/26-27/0001",
  "status": "CANCELLED"
}
```

### Generate PDF
```bash
GET /api/invoices/:invoiceId/pdf

Response (200 OK):
[Binary PDF content]
```

### Send Invoice via Email
```bash
POST /api/invoices/:invoiceId/send

Body:
{
  "recipientEmail": "accounts@amazon.com",
  "subject": "Invoice CMPL/26-27/0001",
  "message": "Please find attached your invoice..."
}

Response (200 OK):
{
  "sent": true,
  "emailId": "email-123",
  "timestamp": "2026-07-10T10:35:00Z"
}
```

### Bulk Create Invoices
```bash
POST /api/invoices/bulk

Body:
{
  "invoices": [
    { "clientId": "c1", "date": "2026-07-10", "items": [...], "taxType": "intrastate" },
    { "clientId": "c2", "date": "2026-07-10", "items": [...], "taxType": "intrastate" }
  ]
}

Response (201 Created):
{
  "created": 2,
  "failed": 0,
  "invoices": ["CMPL/26-27/0002", "CMPL/26-27/0003"]
}
```

---

## Clients API

### List Clients
```bash
GET /api/clients?search=Amazon&page=1&limit=20

Response (200 OK):
{
  "data": [
    {
      "id": "client-123",
      "companyName": "Amazon India Media",
      "representative": "Rajesh Kumar",
      "pan": "CBVPK9244C",
      "gstin": "27AABCA1234H1Z0",
      "stateCode": "27",
      "email": "accounts@amazon.com",
      "phone": "+91-9876543210",
      "address": "Bangalore, Karnataka",
      "invoiceCount": 12,
      "totalAmount": 750000,
      "createdAt": "2026-01-15T10:00:00Z"
    }
  ],
  "pagination": { "page": 1, "limit": 20, "total": 45 }
}
```

### Get Single Client
```bash
GET /api/clients/:clientId

Response (200 OK):
{
  "id": "client-123",
  "companyName": "Amazon India Media",
  "representative": "Rajesh Kumar",
  "pan": "CBVPK9244C",
  "gstin": "27AABCA1234H1Z0",
  "stateCode": "27",
  "email": "accounts@amazon.com",
  "phone": "+91-9876543210",
  "address": "Bangalore, Karnataka",
  "invoices": [
    { "id": "CMPL/26-27/0001", "date": "2026-07-10", "amount": 59000, "status": "PAID" }
  ],
  "stats": {
    "totalInvoices": 12,
    "totalAmount": 750000,
    "totalPaid": 700000,
    "totalPending": 50000,
    "lastInvoiceDate": "2026-07-10"
  }
}
```

### Create Client
```bash
POST /api/clients

Body:
{
  "companyName": "New Client Pvt Ltd",
  "representative": "John Doe",
  "pan": "ABCDE1234F",
  "gstin": "27AABMU9876H2Z5",
  "stateCode": "27",
  "email": "accounts@newclient.com",
  "phone": "+91-9876543210",
  "address": "Mumbai, Maharashtra"
}

Response (201 Created):
{
  "id": "client-124",
  "companyName": "New Client Pvt Ltd"
}
```

### Update Client
```bash
PATCH /api/clients/:clientId

Body:
{
  "email": "newemail@client.com",
  "phone": "+91-9999999999"
}

Response (200 OK):
{
  "id": "client-123",
  "updated": true
}
```

### Delete Client
```bash
DELETE /api/clients/:clientId

Response (200 OK):
{
  "id": "client-123",
  "deleted": true
}
```

---

## Payments API

### Record Payment
```bash
POST /api/payments

Body:
{
  "invoiceId": "CMPL/26-27/0001",
  "amount": 59000,
  "mode": "NEFT/Bank Transfer",
  "reference": "NEFT-2026-001",
  "date": "2026-07-15"
}

Response (201 Created):
{
  "id": "payment-123",
  "invoiceId": "CMPL/26-27/0001",
  "amount": 59000,
  "status": "RECORDED",
  "invoiceStatus": "PAID"
}
```

### List Payments
```bash
GET /api/payments?invoiceId=CMPL/26-27/0001&mode=NEFT&page=1

Response (200 OK):
{
  "data": [
    {
      "id": "payment-123",
      "invoiceId": "CMPL/26-27/0001",
      "amount": 59000,
      "mode": "NEFT/Bank Transfer",
      "reference": "NEFT-2026-001",
      "date": "2026-07-15",
      "reconciled": true,
      "createdAt": "2026-07-15T14:30:00Z"
    }
  ],
  "pagination": { "page": 1, "limit": 20, "total": 125 }
}
```

### Bulk Payment Import
```bash
POST /api/payments/import

Body:
{
  "source": "bank_statement", // or csv_upload
  "file": <binary file>,
  "mappings": {
    "invoiceIdColumn": 0,
    "amountColumn": 1,
    "dateColumn": 2,
    "referenceColumn": 3
  }
}

Response (201 Created):
{
  "imported": 45,
  "matched": 42,
  "unmatched": 3,
  "payments": [...]
}
```

### Reconcile Payment
```bash
PATCH /api/payments/:paymentId/reconcile

Response (200 OK):
{
  "id": "payment-123",
  "reconciled": true,
  "timestamp": "2026-07-20T10:00:00Z"
}
```

---

## Reports API

### GST Report
```bash
GET /api/reports/gst?month=2026-07&detailed=true

Response (200 OK):
{
  "month": "2026-07",
  "summary": {
    "taxableAmount": 500000,
    "cgst": 45000,
    "sgst": 45000,
    "igst": 0,
    "totalTax": 90000
  },
  "invoices": [
    { "id": "CMPL/26-27/0001", "amount": 50000, "tax": 9000 }
  ]
}
```

### Revenue Report
```bash
GET /api/reports/revenue?startDate=2026-01-01&endDate=2026-12-31&groupBy=month

Response (200 OK):
{
  "totalRevenue": 5000000,
  "byMonth": {
    "2026-07": { "revenue": 750000, "invoices": 12, "paid": 700000 },
    "2026-08": { "revenue": 650000, "invoices": 10, "paid": 600000 }
  }
}
```

### Client Ledger Report
```bash
GET /api/reports/client-ledger?clientId=client-123

Response (200 OK):
{
  "clientId": "client-123",
  "clientName": "Amazon India Media",
  "summary": {
    "totalInvoices": 12,
    "totalAmount": 750000,
    "totalPaid": 700000,
    "totalPending": 50000,
    "collectionRate": 93.33
  },
  "invoices": [...]
}
```

### Pending Receivables Report
```bash
GET /api/reports/pending-receivables?overdueDaysThreshold=0

Response (200 OK):
{
  "totalPending": 150000,
  "byClient": [
    {
      "clientName": "Amazon India Media",
      "amount": 50000,
      "daysOverdue": 15,
      "lastInvoiceDate": "2026-07-10"
    }
  ]
}
```

### Export Report
```bash
POST /api/reports/:reportType/export

Body:
{
  "format": "pdf", // or xlsx, csv
  "startDate": "2026-01-01",
  "endDate": "2026-12-31",
  "includeCharts": true
}

Response (200 OK):
[Binary file content]
```

---

## Organization Settings API

### Get Settings
```bash
GET /api/org/settings

Response (200 OK):
{
  "companyName": "Clairvoyant Made Private Limited",
  "invoicePrefix": "CMPL",
  "pan": "AANCC2517L",
  "gstin": "27AANCC2517L1ZE",
  "address": "E2/205, Rutu Tower, Patlipada...",
  "banking": {
    "bankName": "HDFC Bank",
    "accountName": "Clairvoyant Made Private Limited",
    "accountNumber": "50200076668915",
    "ifscCode": "HDFC0000203"
  },
  "logo": "https://..."
}
```

### Update Settings
```bash
PATCH /api/org/settings

Body:
{
  "companyName": "New Company Name",
  "invoicePrefix": "NEW",
  "banking": {
    "bankName": "ICICI Bank",
    "accountNumber": "1234567890"
  }
}

Response (200 OK):
{
  "updated": true,
  "settings": {...}
}
```

### Upload Logo
```bash
POST /api/org/logo

Body:
[multipart/form-data]
file: <image file>

Response (200 OK):
{
  "url": "https://storage.example.com/logos/clairvoyant-123.png",
  "size": 45678,
  "uploadedAt": "2026-07-20T10:00:00Z"
}
```

---

## Users & RBAC API

### List Users
```bash
GET /api/users?role=admin&page=1

Response (200 OK):
{
  "data": [
    {
      "id": "user-123",
      "email": "admin@clairvoyant.com",
      "firstName": "Pankaj",
      "lastName": "Kapote",
      "role": "admin",
      "lastLogin": "2026-08-07T10:30:00Z",
      "createdAt": "2026-01-15T10:00:00Z"
    }
  ],
  "pagination": { "page": 1, "limit": 20, "total": 3 }
}
```

### Invite User
```bash
POST /api/users/invite

Body:
{
  "email": "newuser@clairvoyant.com",
  "role": "editor", // admin, editor, viewer
  "firstName": "New",
  "lastName": "User"
}

Response (201 Created):
{
  "id": "user-124",
  "email": "newuser@clairvoyant.com",
  "invitationSent": true,
  "invitationLink": "https://clairvoyant.io/invite?token=xyz123"
}
```

### Update User Role
```bash
PATCH /api/users/:userId

Body:
{
  "role": "viewer"
}

Response (200 OK):
{
  "id": "user-123",
  "role": "viewer",
  "updated": true
}
```

### Revoke User Access
```bash
DELETE /api/users/:userId

Response (200 OK):
{
  "id": "user-123",
  "revoked": true
}
```

---

## Audit Log API

### Get Audit Logs
```bash
GET /api/audit?action=CREATE&entityType=INVOICE&days=30&page=1

Response (200 OK):
{
  "data": [
    {
      "id": "log-123",
      "timestamp": "2026-07-10T10:30:00Z",
      "user": "admin@clairvoyant.com",
      "action": "CREATE",
      "entityType": "INVOICE",
      "entityId": "CMPL/26-27/0001",
      "description": "Invoice CMPL/26-27/0001 created"
    }
  ],
  "pagination": { "page": 1, "limit": 50, "total": 2341 }
}
```

---

## Error Responses

### Validation Error (400)
```json
{
  "error": "Validation Error",
  "message": "Client ID is required",
  "fields": {
    "clientId": "This field is required"
  }
}
```

### Unauthorized (401)
```json
{
  "error": "Unauthorized",
  "message": "Invalid or expired token"
}
```

### Forbidden (403)
```json
{
  "error": "Forbidden",
  "message": "You don't have permission to access this resource"
}
```

### Not Found (404)
```json
{
  "error": "Not Found",
  "message": "Invoice CMPL/26-27/9999 not found"
}
```

### Rate Limited (429)
```json
{
  "error": "Too Many Requests",
  "message": "You have exceeded the rate limit. Try again in 60 seconds.",
  "retryAfter": 60
}
```

### Server Error (500)
```json
{
  "error": "Internal Server Error",
  "message": "An unexpected error occurred",
  "requestId": "req-123456"
}
```

---

## Rate Limiting

All API endpoints are rate limited:
- **Free Plan**: 100 requests/hour
- **Starter Plan**: 1,000 requests/hour
- **Pro Plan**: 10,000 requests/hour
- **Enterprise**: Unlimited

Rate limit headers in response:
```
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 1689000000
```

---

## Webhooks (Coming Soon)

Events you can subscribe to:
- `invoice.created`
- `invoice.sent`
- `invoice.paid`
- `payment.recorded`
- `client.created`
- `user.invited`

### Register Webhook
```bash
POST /api/webhooks

Body:
{
  "url": "https://your-app.com/webhooks/clairvoyant",
  "events": ["invoice.paid", "payment.recorded"],
  "secret": "whsec_your_secret_key"
}

Response (201 Created):
{
  "id": "webhook-123",
  "url": "https://your-app.com/webhooks/clairvoyant",
  "events": ["invoice.paid", "payment.recorded"]
}
```

---

## Code Examples

### Python
```python
import requests
import json

BASE_URL = "https://clairvoyant.io/api"
TOKEN = "your_jwt_token"

headers = {
    "Authorization": f"Bearer {TOKEN}",
    "Content-Type": "application/json"
}

# Create invoice
response = requests.post(
    f"{BASE_URL}/invoices",
    headers=headers,
    json={
        "clientId": "client-123",
        "date": "2026-07-10",
        "items": [
            {
                "particulars": "Campaign Fee",
                "hsn": "998361",
                "quantity": 1,
                "amount": 50000
            }
        ],
        "taxType": "intrastate"
    }
)

invoice = response.json()
print(f"Invoice created: {invoice['id']}")
```

### JavaScript/Node.js
```javascript
const axios = require('axios');

const BASE_URL = 'https://clairvoyant.io/api';
const TOKEN = 'your_jwt_token';

const client = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Authorization': `Bearer ${TOKEN}`,
    'Content-Type': 'application/json'
  }
});

// List invoices
async function getInvoices() {
  try {
    const { data } = await client.get('/invoices', {
      params: {
        status: 'PAID',
        limit: 20,
        page: 1
      }
    });
    console.log(`Found ${data.pagination.total} invoices`);
    return data.data;
  } catch (error) {
    console.error('Error:', error.response.data);
  }
}
```

### cURL
```bash
# Get all invoices
curl -X GET \
  https://clairvoyant.io/api/invoices \
  -H "Authorization: Bearer your_jwt_token" \
  -H "Content-Type: application/json"

# Create payment
curl -X POST \
  https://clairvoyant.io/api/payments \
  -H "Authorization: Bearer your_jwt_token" \
  -H "Content-Type: application/json" \
  -d '{
    "invoiceId": "CMPL/26-27/0001",
    "amount": 59000,
    "mode": "NEFT/Bank Transfer",
    "reference": "NEFT-2026-001",
    "date": "2026-07-15"
  }'
```

---

## Changelog

### v1.0.0 (August 2026)
- Initial release
- Core invoicing functionality
- GST compliance
- Multi-tenant architecture
- RBAC implementation
- Audit logging

### v1.1.0 (Coming September 2026)
- Webhooks support
- Payment gateway integration
- Email notifications
- Advanced analytics
- Custom templates

---

**API Version**: 1.0.0  
**Last Updated**: August 2026  
**Status**: Production Ready
