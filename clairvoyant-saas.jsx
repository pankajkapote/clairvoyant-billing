'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { 
  BarChart3, Wallet, Users, FileText, Settings, LogOut, Menu, X, 
  Plus, Search, Filter, Download, Eye, Edit2, Trash2, Send,
  CheckCircle2, Clock, AlertCircle, DollarSign, TrendingUp,
  Home, Database, ReceiptIndian, UserCheck, Shield, Bell,
  Calendar, MapPin, IndianRupee, Phone, Mail, Building2,
  CreditCard, Zap, Package, Lock, Unlock, ChevronRight, ChevronLeft,
  MoreVertical, Copy, Repeat2, XCircle, CheckCircle, AlertTriangle
} from 'lucide-react';

// ============================================================================
// CORE DATA STRUCTURES & TYPES
// ============================================================================

const SUBSCRIPTION_PLANS = {
  starter: { name: 'Starter', price: 2999, invoices: 50, users: 1, reports: false },
  pro: { name: 'Pro', price: 7999, invoices: 500, users: 5, reports: true },
  enterprise: { name: 'Enterprise', price: 19999, invoices: 'Unlimited', users: 'Unlimited', reports: true }
};

const PAYMENT_MODES = ['NEFT/Bank Transfer', 'UPI', 'Cheque', 'Cash', 'Online'];
const INVOICE_STATUSES = ['DRAFT', 'SENT', 'VIEWED', 'PAID', 'PARTIALLY_PAID', 'OVERDUE', 'CANCELLED'];

// Indian Financial Year Calculator
const getFiscalYear = (date) => {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  if (month >= 4) return `${year % 100}-${(year + 1) % 100}`;
  return `${(year - 1) % 100}-${year % 100}`;
};

// Number to Words in INR
const numberToWords = (num) => {
  const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
  const teens = ['Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
  const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
  const scales = ['', 'Thousand', 'Lakh', 'Crore'];

  if (num === 0) return 'Zero Rupees Only';

  const convertHundreds = (n) => {
    let result = '';
    if (n >= 100) {
      result += ones[Math.floor(n / 100)] + ' Hundred ';
      n %= 100;
    }
    if (n >= 20) {
      result += tens[Math.floor(n / 10)] + ' ';
      if (n % 10) result += ones[n % 10] + ' ';
    } else if (n >= 10) {
      result += teens[n - 10] + ' ';
    } else if (n > 0) {
      result += ones[n] + ' ';
    }
    return result;
  };

  let result = '';
  let scaleIndex = 0;
  while (num > 0) {
    if (num % 100 !== 0) {
      result = convertHundreds(num % 100) + (scales[scaleIndex] ? scales[scaleIndex] + ' ' : '') + result;
    }
    num = Math.floor(num / 100);
    scaleIndex++;
  }
  return result.trim() + ' Rupees Only';
};

// ============================================================================
// MAIN APP COMPONENT
// ============================================================================

export default function ClairvoyantSaaS() {
  // Auth & Tenant State
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [authMode, setAuthMode] = useState('login'); // login | signup | reset
  const [currentUser, setCurrentUser] = useState(null);
  const [currentOrg, setCurrentOrg] = useState(null);

  // Main App State
  const [activeModule, setActiveModule] = useState('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  // Data State
  const [invoices, setInvoices] = useState([]);
  const [clients, setClients] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [payments, setPayments] = useState([]);
  const [auditLog, setAuditLog] = useState([]);

  // Modal State
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [showClientModal, setShowClientModal] = useState(false);
  const [showVendorModal, setShowVendorModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [editingInvoice, setEditingInvoice] = useState(null);
  const [editingClient, setEditingClient] = useState(null);

  // Form State
  const [invoiceForm, setInvoiceForm] = useState({
    id: null,
    clientId: '',
    date: new Date().toISOString().split('T')[0],
    items: [{ particulars: '', hsn: '', quantity: 1, amount: 0 }],
    taxType: 'intrastate',
    notes: ''
  });

  const [clientForm, setClientForm] = useState({
    id: null,
    companyName: '',
    representative: '',
    pan: '',
    gstin: '',
    stateCode: '',
    address: '',
    email: '',
    phone: ''
  });

  const [vendorForm, setVendorForm] = useState({
    id: null,
    vendorName: '',
    contactPerson: '',
    email: '',
    phone: ''
  });

  const [paymentForm, setPaymentForm] = useState({
    id: null,
    invoiceId: '',
    amount: '',
    mode: 'NEFT/Bank Transfer',
    reference: '',
    date: new Date().toISOString().split('T')[0]
  });

  const [orgSettings, setOrgSettings] = useState({
    companyName: 'Clairvoyant Made Private Limited',
    prefix: 'CMPL',
    pan: 'AANCC2517L',
    gstin: '27AANCC2517L1ZE',
    address: 'E2/205, Rutu Tower, Patlipada, Off Ghodbunder Road, Thane, Maharashtra, 400607',
    bankName: 'HDFC Bank',
    accountName: 'Clairvoyant Made Private Limited',
    accountNumber: '50200076668915',
    ifscCode: 'HDFC0000203',
    logo: 'https://via.placeholder.com/150?text=Clairvoyant'
  });

  // Search & Filter State
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [filterClient, setFilterClient] = useState('ALL');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });

  // ========================================================================
  // AUTHENTICATION FUNCTIONS
  // ========================================================================

  const handleLogin = (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    setCurrentUser({ id: '1', email, role: 'admin' });
    setCurrentOrg({ id: '1', name: 'Clairvoyant', plan: 'pro' });
    setIsLoggedIn(true);
    loadInitialData();
  };

  const handleSignup = (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const orgName = e.target.orgName?.value || 'My Organization';
    setCurrentUser({ id: '1', email, role: 'admin' });
    setCurrentOrg({ id: '1', name: orgName, plan: 'starter' });
    setIsLoggedIn(true);
    addAuditLog('CREATE', 'ORGANIZATION', `Organization ${orgName} created`);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentUser(null);
    setCurrentOrg(null);
    setInvoices([]);
    setClients([]);
    setVendors([]);
    setPayments([]);
  };

  // ========================================================================
  // DATA MANAGEMENT FUNCTIONS
  // ========================================================================

  const loadInitialData = () => {
    // Load sample data
    setClients([
      { 
        id: '1', 
        companyName: 'Amazon India Media', 
        representative: 'Rajesh Kumar',
        pan: 'CBVPK9244C',
        gstin: '27AABCA1234H1Z0',
        stateCode: '27',
        address: 'Bangalore, Karnataka',
        email: 'accounts@amazon.com',
        phone: '+91-9876543210'
      },
      { 
        id: '2', 
        companyName: 'MyntraFashion Pvt Ltd', 
        representative: 'Priya Singh',
        pan: 'ABCDE1234F',
        gstin: '27AABMU9876H2Z5',
        stateCode: '27',
        address: 'Mumbai, Maharashtra',
        email: 'billing@myntra.com',
        phone: '+91-9123456789'
      }
    ]);

    setVendors([
      { 
        id: '1',
        vendorName: 'Creative Studios Mumbai',
        contactPerson: 'Anil Sharma',
        email: 'anil@creativestudios.com',
        phone: '+91-9876543210'
      },
      { 
        id: '2',
        vendorName: 'Content Kings Agency',
        contactPerson: 'Neha Patel',
        email: 'neha@contentkings.com',
        phone: '+91-9123456789'
      }
    ]);

    setInvoices([
      {
        id: 'CMPL/26-27/0001',
        clientId: '1',
        date: '2026-07-10',
        items: [
          { particulars: 'Amazon Live Campaign - Q3 2026', hsn: '998361', quantity: 1, amount: 50000 }
        ],
        taxType: 'intrastate',
        subtotal: 50000,
        cgst: 4500,
        sgst: 4500,
        igst: 0,
        total: 59000,
        status: 'PAID',
        revisionCount: 0,
        notes: ''
      }
    ]);

    setPayments([
      {
        id: '1',
        invoiceId: 'CMPL/26-27/0001',
        amount: 59000,
        mode: 'NEFT/Bank Transfer',
        reference: 'NEFT-2026-001',
        date: '2026-07-15',
        reconciled: true
      }
    ]);
  };

  const addAuditLog = (action, entityType, description) => {
    const log = {
      id: Date.now(),
      timestamp: new Date().toLocaleString('en-IN'),
      action,
      entityType,
      userId: currentUser?.id,
      userEmail: currentUser?.email,
      description
    };
    setAuditLog(prev => [log, ...prev]);
  };

  // ========================================================================
  // INVOICE FUNCTIONS
  // ========================================================================

  const calculateInvoiceNumber = (invoicesList) => {
    const currentFY = getFiscalYear(new Date());
    const invoicesInFY = invoicesList.filter(inv => 
      inv.id.includes(`/${currentFY}/`)
    );
    
    let sequence = invoicesInFY.length + 1;
    if (sequence <= 9999) {
      return `${orgSettings.prefix}/${currentFY}/${String(sequence).padStart(4, '0')}`;
    } else {
      // Alphanumeric overflow
      const alpha = String.fromCharCode(65 + Math.floor((sequence - 10000) / 26));
      const num = ((sequence - 10000) % 26) + 1;
      return `${orgSettings.prefix}/${currentFY}/${alpha}${String(num).padStart(3, '0')}`;
    }
  };

  const createInvoice = (e) => {
    e.preventDefault();
    
    if (!invoiceForm.clientId) {
      alert('Please select a client');
      return;
    }

    const subtotal = invoiceForm.items.reduce((sum, item) => sum + (item.amount || 0), 0);
    let cgst = 0, sgst = 0, igst = 0;

    if (invoiceForm.taxType === 'intrastate') {
      cgst = subtotal * 0.09;
      sgst = subtotal * 0.09;
    } else {
      igst = subtotal * 0.18;
    }

    const total = subtotal + cgst + sgst + igst;

    if (editingInvoice) {
      // Update existing invoice with revision
      const baseId = editingInvoice.id.split('-')[0];
      const revisionCount = editingInvoice.revisionCount + 1;
      const newId = `${baseId}-${revisionCount}`;

      setInvoices(prev => 
        prev.map(inv => inv.id === editingInvoice.id ? {
          ...inv,
          id: newId,
          ...invoiceForm,
          subtotal,
          cgst,
          sgst,
          igst,
          total,
          status: 'DRAFT'
        } : inv)
      );
      addAuditLog('UPDATE', 'INVOICE', `Invoice ${newId} revised`);
    } else {
      // Create new invoice
      const newInvoice = {
        id: calculateInvoiceNumber(invoices),
        ...invoiceForm,
        subtotal,
        cgst,
        sgst,
        igst,
        total,
        status: 'DRAFT',
        revisionCount: 0,
        createdAt: new Date().toISOString()
      };
      setInvoices(prev => [newInvoice, ...prev]);
      addAuditLog('CREATE', 'INVOICE', `Invoice ${newInvoice.id} created`);
    }

    resetInvoiceForm();
    setShowInvoiceModal(false);
  };

  const resetInvoiceForm = () => {
    setInvoiceForm({
      id: null,
      clientId: '',
      date: new Date().toISOString().split('T')[0],
      items: [{ particulars: '', hsn: '', quantity: 1, amount: 0 }],
      taxType: 'intrastate',
      notes: ''
    });
    setEditingInvoice(null);
  };

  const cancelInvoice = (invoiceId) => {
    setInvoices(prev => 
      prev.map(inv => inv.id === invoiceId ? { ...inv, status: 'CANCELLED' } : inv)
    );
    addAuditLog('CANCEL', 'INVOICE', `Invoice ${invoiceId} cancelled`);
  };

  const updateInvoiceStatus = (invoiceId, status) => {
    setInvoices(prev =>
      prev.map(inv => inv.id === invoiceId ? { ...inv, status } : inv)
    );
    addAuditLog('UPDATE', 'INVOICE', `Invoice ${invoiceId} status changed to ${status}`);
  };

  // ========================================================================
  // CLIENT & VENDOR FUNCTIONS
  // ========================================================================

  const addOrUpdateClient = (e) => {
    e.preventDefault();
    if (editingClient) {
      setClients(prev =>
        prev.map(c => c.id === editingClient.id ? { ...clientForm, id: c.id } : c)
      );
      addAuditLog('UPDATE', 'CLIENT', `Client ${clientForm.companyName} updated`);
    } else {
      const newClient = {
        id: Date.now().toString(),
        ...clientForm
      };
      setClients(prev => [newClient, ...prev]);
      addAuditLog('CREATE', 'CLIENT', `Client ${clientForm.companyName} created`);
    }
    resetClientForm();
    setShowClientModal(false);
  };

  const resetClientForm = () => {
    setClientForm({
      id: null,
      companyName: '',
      representative: '',
      pan: '',
      gstin: '',
      stateCode: '',
      address: '',
      email: '',
      phone: ''
    });
    setEditingClient(null);
  };

  const addOrUpdateVendor = (e) => {
    e.preventDefault();
    if (vendorForm.id) {
      setVendors(prev =>
        prev.map(v => v.id === vendorForm.id ? vendorForm : v)
      );
      addAuditLog('UPDATE', 'VENDOR', `Vendor ${vendorForm.vendorName} updated`);
    } else {
      const newVendor = {
        id: Date.now().toString(),
        ...vendorForm
      };
      setVendors(prev => [newVendor, ...prev]);
      addAuditLog('CREATE', 'VENDOR', `Vendor ${vendorForm.vendorName} created`);
    }
    setVendorForm({ id: null, vendorName: '', contactPerson: '', email: '', phone: '' });
    setShowVendorModal(false);
  };

  // ========================================================================
  // PAYMENT FUNCTIONS
  // ========================================================================

  const recordPayment = (e) => {
    e.preventDefault();
    if (!paymentForm.invoiceId || !paymentForm.amount) {
      alert('Please fill all payment details');
      return;
    }

    const newPayment = {
      id: Date.now().toString(),
      ...paymentForm,
      reconciled: false
    };

    setPayments(prev => [newPayment, ...prev]);

    // Update invoice status
    const invoice = invoices.find(inv => inv.id === paymentForm.invoiceId);
    const totalPaid = (invoice?.totalPaid || 0) + parseFloat(paymentForm.amount);
    const balance = invoice.total - totalPaid;

    if (balance <= 0) {
      updateInvoiceStatus(paymentForm.invoiceId, 'PAID');
    } else if (totalPaid > 0) {
      updateInvoiceStatus(paymentForm.invoiceId, 'PARTIALLY_PAID');
    }

    addAuditLog('CREATE', 'PAYMENT', `Payment of ₹${paymentForm.amount} recorded for ${paymentForm.invoiceId}`);
    setPaymentForm({
      id: null,
      invoiceId: '',
      amount: '',
      mode: 'NEFT/Bank Transfer',
      reference: '',
      date: new Date().toISOString().split('T')[0]
    });
    setShowPaymentModal(false);
  };

  // ========================================================================
  // CALCULATIONS & FILTERING
  // ========================================================================

  const filteredInvoices = useMemo(() => {
    return invoices.filter(inv => {
      if (filterStatus !== 'ALL' && inv.status !== filterStatus) return false;
      if (filterClient !== 'ALL' && inv.clientId !== filterClient) return false;
      if (searchTerm && !inv.id.toLowerCase().includes(searchTerm.toLowerCase())) return false;
      if (dateRange.start && new Date(inv.date) < new Date(dateRange.start)) return false;
      if (dateRange.end && new Date(inv.date) > new Date(dateRange.end)) return false;
      return true;
    });
  }, [invoices, filterStatus, filterClient, searchTerm, dateRange]);

  const dashboardMetrics = useMemo(() => {
    const activeInvoices = invoices.filter(inv => !['CANCELLED'].includes(inv.status));
    const totalRevenue = activeInvoices
      .filter(inv => ['PAID', 'PARTIALLY_PAID'].includes(inv.status))
      .reduce((sum, inv) => sum + inv.total, 0);
    const pending = activeInvoices
      .filter(inv => ['PENDING', 'PARTIALLY_PAID', 'DRAFT'].includes(inv.status))
      .reduce((sum, inv) => sum + (inv.total - (inv.totalPaid || 0)), 0);
    const overdue = activeInvoices
      .filter(inv => inv.status === 'OVERDUE')
      .reduce((sum, inv) => sum + inv.total, 0);

    return {
      totalRevenue,
      pendingReceivables: pending,
      activeInvoicesCount: activeInvoices.length,
      clientCount: clients.length,
      vendorCount: vendors.length,
      overdueAmount: overdue
    };
  }, [invoices, clients, vendors]);

  const revenueByMonth = useMemo(() => {
    const months = {};
    invoices.forEach(inv => {
      if (!['CANCELLED'].includes(inv.status)) {
        const month = inv.date.substring(0, 7);
        months[month] = (months[month] || 0) + inv.total;
      }
    });
    return months;
  }, [invoices]);

  // ========================================================================
  // RENDER FUNCTIONS
  // ========================================================================

  if (!isLoggedIn) {
    return <AuthPage authMode={authMode} setAuthMode={setAuthMode} onLogin={handleLogin} onSignup={handleSignup} />;
  }

  const getClientName = (clientId) => {
    return clients.find(c => c.id === clientId)?.companyName || 'Unknown Client';
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      DRAFT: { bg: 'bg-gray-100', text: 'text-gray-700', icon: FileText },
      SENT: { bg: 'bg-blue-100', text: 'text-blue-700', icon: Send },
      VIEWED: { bg: 'bg-indigo-100', text: 'text-indigo-700', icon: Eye },
      PAID: { bg: 'bg-green-100', text: 'text-green-700', icon: CheckCircle },
      PARTIALLY_PAID: { bg: 'bg-yellow-100', text: 'text-yellow-700', icon: Clock },
      OVERDUE: { bg: 'bg-red-100', text: 'text-red-700', icon: AlertTriangle },
      CANCELLED: { bg: 'bg-gray-200', text: 'text-gray-600', icon: XCircle }
    };
    const config = statusConfig[status] || statusConfig.DRAFT;
    const Icon = config.icon;
    return (
      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${config.bg} ${config.text}`}>
        <Icon size={14} />
        {status.replace(/_/g, ' ')}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 hover:bg-gray-100 rounded-lg"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-teal-500 flex items-center justify-center">
                <Eye size={18} className="text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Clairvoyant</h1>
                <p className="text-xs text-gray-500">Influencer Billing Platform</p>
              </div>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-2">
            <button onClick={() => setShowNotifications(!showNotifications)} className="p-2 hover:bg-gray-100 rounded-lg relative">
              <Bell size={20} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            <button onClick={() => setShowSettingsModal(true)} className="p-2 hover:bg-gray-100 rounded-lg">
              <Settings size={20} />
            </button>
            <button onClick={handleLogout} className="p-2 hover:bg-red-50 rounded-lg text-red-600">
              <LogOut size={20} />
            </button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar Navigation */}
        <aside className={`${mobileMenuOpen ? 'block' : 'hidden'} md:block w-full md:w-64 bg-white border-r border-gray-200 p-4 sticky top-16 md:top-0 h-screen md:h-[calc(100vh-56px)] overflow-y-auto`}>
          <nav className="space-y-2">
            {[
              { id: 'dashboard', icon: Home, label: 'Dashboard' },
              { id: 'invoices', icon: FileText, label: 'Invoices' },
              { id: 'clients', icon: Users, label: 'Clients' },
              { id: 'vendors', icon: Building2, label: 'Vendors' },
              { id: 'payments', icon: CreditCard, label: 'Payments' },
              { id: 'reports', icon: BarChart3, label: 'Reports' },
              { id: 'audit', icon: Shield, label: 'Audit Trail' }
            ].map(item => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveModule(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg font-medium transition-colors ${
                    activeModule === item.id
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Icon size={20} />
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Plan Badge */}
          <div className="mt-8 p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
            <div className="text-xs font-semibold text-gray-600 mb-2">CURRENT PLAN</div>
            <div className="text-lg font-bold text-blue-600">{currentOrg?.plan.toUpperCase()}</div>
            <button className="mt-3 w-full py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 text-sm">
              Upgrade
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-4 md:p-6 overflow-y-auto">
          {activeModule === 'dashboard' && <DashboardModule metrics={dashboardMetrics} revenueByMonth={revenueByMonth} />}
          
          {activeModule === 'invoices' && (
            <InvoicesModule
              invoices={filteredInvoices}
              clients={clients}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              filterStatus={filterStatus}
              setFilterStatus={setFilterStatus}
              filterClient={filterClient}
              setFilterClient={setFilterClient}
              dateRange={dateRange}
              setDateRange={setDateRange}
              getClientName={getClientName}
              getStatusBadge={getStatusBadge}
              showInvoiceModal={showInvoiceModal}
              setShowInvoiceModal={setShowInvoiceModal}
              invoiceForm={invoiceForm}
              setInvoiceForm={setInvoiceForm}
              createInvoice={createInvoice}
              editingInvoice={editingInvoice}
              setEditingInvoice={setEditingInvoice}
              resetInvoiceForm={resetInvoiceForm}
              cancelInvoice={cancelInvoice}
              updateInvoiceStatus={updateInvoiceStatus}
              numberToWords={numberToWords}
              orgSettings={orgSettings}
            />
          )}

          {activeModule === 'clients' && (
            <ClientsModule
              clients={clients}
              showClientModal={showClientModal}
              setShowClientModal={setShowClientModal}
              clientForm={clientForm}
              setClientForm={setClientForm}
              addOrUpdateClient={addOrUpdateClient}
              editingClient={editingClient}
              setEditingClient={setEditingClient}
              resetClientForm={resetClientForm}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
            />
          )}

          {activeModule === 'vendors' && (
            <VendorsModule
              vendors={vendors}
              showVendorModal={showVendorModal}
              setShowVendorModal={setShowVendorModal}
              vendorForm={vendorForm}
              setVendorForm={setVendorForm}
              addOrUpdateVendor={addOrUpdateVendor}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
            />
          )}

          {activeModule === 'payments' && (
            <PaymentsModule
              payments={payments}
              invoices={invoices}
              getClientName={getClientName}
              showPaymentModal={showPaymentModal}
              setShowPaymentModal={setShowPaymentModal}
              paymentForm={paymentForm}
              setPaymentForm={setPaymentForm}
              recordPayment={recordPayment}
            />
          )}

          {activeModule === 'reports' && (
            <ReportsModule
              invoices={invoices}
              payments={payments}
              clients={clients}
              getClientName={getClientName}
              dashboardMetrics={dashboardMetrics}
            />
          )}

          {activeModule === 'audit' && (
            <AuditModule auditLog={auditLog} />
          )}
        </main>
      </div>

      {/* Settings Modal */}
      {showSettingsModal && (
        <SettingsModal
          orgSettings={orgSettings}
          setOrgSettings={setOrgSettings}
          onClose={() => setShowSettingsModal(false)}
        />
      )}
    </div>
  );
}

// ============================================================================
// MODULE COMPONENTS
// ============================================================================

function AuthPage({ authMode, setAuthMode, onLogin, onSignup }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-teal-600 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <div className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-blue-500 to-teal-500 flex items-center justify-center mb-4">
              <Eye size={32} className="text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Clairvoyant</h1>
            <p className="text-gray-500 mt-2">Influencer Billing & CRM</p>
          </div>

          {authMode === 'login' && (
            <form onSubmit={onLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  name="email"
                  defaultValue="admin@clairvoyant.com"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                <input
                  type="password"
                  name="password"
                  defaultValue="demo123"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full bg-blue-600 text-white font-semibold py-2 rounded-lg hover:bg-blue-700"
              >
                Login
              </button>
              <button
                type="button"
                onClick={() => setAuthMode('signup')}
                className="w-full text-center text-blue-600 font-medium py-2 hover:underline"
              >
                Don't have an account? Sign up
              </button>
            </form>
          )}

          {authMode === 'signup' && (
            <form onSubmit={onSignup} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Organization Name</label>
                <input
                  type="text"
                  name="orgName"
                  placeholder="Your Company"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  name="email"
                  placeholder="you@company.com"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                <input
                  type="password"
                  name="password"
                  placeholder="Min 8 characters"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full bg-blue-600 text-white font-semibold py-2 rounded-lg hover:bg-blue-700"
              >
                Create Account
              </button>
              <button
                type="button"
                onClick={() => setAuthMode('login')}
                className="w-full text-center text-blue-600 font-medium py-2 hover:underline"
              >
                Already have an account? Login
              </button>
            </form>
          )}
        </div>

        <div className="mt-8 text-center text-white text-sm">
          <p>Demo Credentials: admin@clairvoyant.com / demo123</p>
        </div>
      </div>
    </div>
  );
}

function DashboardModule({ metrics, revenueByMonth }) {
  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-gray-900">Dashboard</h2>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <KPICard
          icon={IndianRupee}
          label="Total Revenue"
          value={`₹${(metrics.totalRevenue / 100000).toFixed(2)}L`}
          color="from-green-500 to-emerald-500"
        />
        <KPICard
          icon={Clock}
          label="Pending Receivables"
          value={`₹${(metrics.pendingReceivables / 100000).toFixed(2)}L`}
          color="from-yellow-500 to-orange-500"
        />
        <KPICard
          icon={AlertTriangle}
          label="Overdue Amount"
          value={`₹${(metrics.overdueAmount / 100000).toFixed(2)}L`}
          color="from-red-500 to-pink-500"
        />
        <KPICard
          icon={FileText}
          label="Active Invoices"
          value={metrics.activeInvoicesCount}
          color="from-blue-500 to-indigo-500"
        />
        <KPICard
          icon={Users}
          label="Total Clients"
          value={metrics.clientCount}
          color="from-purple-500 to-pink-500"
        />
        <KPICard
          icon={Building2}
          label="Vendors"
          value={metrics.vendorCount}
          color="from-cyan-500 to-blue-500"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Revenue Trend</h3>
          <div className="space-y-2">
            {Object.entries(revenueByMonth).slice(-6).map(([month, amount]) => (
              <div key={month} className="flex items-center gap-3">
                <span className="text-sm font-medium text-gray-600 w-20">{month}</span>
                <div className="flex-1 bg-gray-100 rounded-full h-8 relative overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-blue-500 to-teal-500 h-full rounded-full flex items-center justify-end pr-3"
                    style={{ width: `${Math.min((amount / 100000) * 100, 100)}%` }}
                  >
                    <span className="text-xs font-bold text-white">₹{(amount / 1000).toFixed(0)}K</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h3>
          <div className="space-y-2">
            <button className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg font-medium text-gray-700 border border-gray-200">
              <Plus size={20} className="text-blue-500" />
              Create Invoice
            </button>
            <button className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg font-medium text-gray-700 border border-gray-200">
              <Users size={20} className="text-purple-500" />
              Add Client
            </button>
            <button className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg font-medium text-gray-700 border border-gray-200">
              <CreditCard size={20} className="text-green-500" />
              Record Payment
            </button>
            <button className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg font-medium text-gray-700 border border-gray-200">
              <Download size={20} className="text-orange-500" />
              Export Report
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function KPICard({ icon: Icon, label, value, color }) {
  return (
    <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
      <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${color} flex items-center justify-center mb-3`}>
        <Icon size={24} className="text-white" />
      </div>
      <p className="text-gray-600 text-sm font-medium mb-1">{label}</p>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
    </div>
  );
}

function InvoicesModule({
  invoices,
  clients,
  searchTerm,
  setSearchTerm,
  filterStatus,
  setFilterStatus,
  filterClient,
  setFilterClient,
  dateRange,
  setDateRange,
  getClientName,
  getStatusBadge,
  showInvoiceModal,
  setShowInvoiceModal,
  invoiceForm,
  setInvoiceForm,
  createInvoice,
  editingInvoice,
  setEditingInvoice,
  resetInvoiceForm,
  cancelInvoice,
  updateInvoiceStatus,
  numberToWords,
  orgSettings
}) {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <h2 className="text-3xl font-bold text-gray-900">Invoices</h2>
        <button
          onClick={() => {
            resetInvoiceForm();
            setShowInvoiceModal(true);
          }}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 font-medium"
        >
          <Plus size={20} />
          New Invoice
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-4 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
            <div className="relative">
              <Search className="absolute left-3 top-3 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Invoice ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="ALL">All Statuses</option>
              {INVOICE_STATUSES.map(status => (
                <option key={status} value={status}>{status.replace(/_/g, ' ')}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Client</label>
            <select
              value={filterClient}
              onChange={(e) => setFilterClient(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="ALL">All Clients</option>
              {clients.map(client => (
                <option key={client.id} value={client.id}>{client.companyName}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Date Range</label>
            <input
              type="date"
              value={dateRange.start}
              onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Invoices Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-900">Invoice ID</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-900">Client</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-900">Date</th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-gray-900">Amount</th>
                <th className="px-6 py-3 text-center text-xs font-semibold text-gray-900">Status</th>
                <th className="px-6 py-3 text-center text-xs font-semibold text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {invoices.map(invoice => (
                <tr key={invoice.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-mono font-semibold text-blue-600">{invoice.id}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{getClientName(invoice.clientId)}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{new Date(invoice.date).toLocaleDateString('en-IN')}</td>
                  <td className="px-6 py-4 text-sm font-semibold text-right text-gray-900">₹{invoice.total.toLocaleString('en-IN')}</td>
                  <td className="px-6 py-4 text-center">{getStatusBadge(invoice.status)}</td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => {
                          setInvoiceForm({
                            id: invoice.id,
                            clientId: invoice.clientId,
                            date: invoice.date,
                            items: invoice.items,
                            taxType: invoice.taxType,
                            notes: invoice.notes
                          });
                          setEditingInvoice(invoice);
                          setShowInvoiceModal(true);
                        }}
                        className="p-1 hover:bg-blue-50 rounded text-blue-600"
                        title="Edit"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => window.print()}
                        className="p-1 hover:bg-green-50 rounded text-green-600"
                        title="Print"
                      >
                        <Download size={16} />
                      </button>
                      {!['CANCELLED', 'PAID'].includes(invoice.status) && (
                        <button
                          onClick={() => cancelInvoice(invoice.id)}
                          className="p-1 hover:bg-red-50 rounded text-red-600"
                          title="Cancel"
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Invoice Modal */}
      {showInvoiceModal && (
        <InvoiceModal
          invoiceForm={invoiceForm}
          setInvoiceForm={setInvoiceForm}
          createInvoice={createInvoice}
          onClose={() => {
            setShowInvoiceModal(false);
            resetInvoiceForm();
          }}
          clients={clients}
          editingInvoice={editingInvoice}
          numberToWords={numberToWords}
        />
      )}
    </div>
  );
}

function InvoiceModal({ invoiceForm, setInvoiceForm, createInvoice, onClose, clients, editingInvoice, numberToWords }) {
  const subtotal = invoiceForm.items.reduce((sum, item) => sum + (item.amount || 0), 0);
  let cgst = 0, sgst = 0, igst = 0;

  if (invoiceForm.taxType === 'intrastate') {
    cgst = subtotal * 0.09;
    sgst = subtotal * 0.09;
  } else {
    igst = subtotal * 0.18;
  }

  const total = subtotal + cgst + sgst + igst;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200 sticky top-0 bg-white flex items-center justify-between">
          <h3 className="text-2xl font-bold text-gray-900">
            {editingInvoice ? 'Edit Invoice' : 'Create New Invoice'}
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={createInvoice} className="p-6 space-y-6">
          {/* Client Selection */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">Select Client *</label>
            <select
              value={invoiceForm.clientId}
              onChange={(e) => setInvoiceForm({ ...invoiceForm, clientId: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Choose a client...</option>
              {clients.map(client => (
                <option key={client.id} value={client.id}>
                  {client.companyName}
                </option>
              ))}
            </select>
          </div>

          {/* Date */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">Invoice Date</label>
            <input
              type="date"
              value={invoiceForm.date}
              onChange={(e) => setInvoiceForm({ ...invoiceForm, date: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Items */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="block text-sm font-semibold text-gray-900">Line Items</label>
              <button
                type="button"
                onClick={() =>
                  setInvoiceForm({
                    ...invoiceForm,
                    items: [...invoiceForm.items, { particulars: '', hsn: '', quantity: 1, amount: 0 }]
                  })
                }
                className="text-blue-600 font-medium flex items-center gap-1 hover:underline"
              >
                <Plus size={16} /> Add Item
              </button>
            </div>

            <div className="space-y-3">
              {invoiceForm.items.map((item, idx) => (
                <div key={idx} className="grid grid-cols-12 gap-2 items-end">
                  <input
                    type="text"
                    placeholder="Particulars"
                    value={item.particulars}
                    onChange={(e) => {
                      const newItems = [...invoiceForm.items];
                      newItems[idx].particulars = e.target.value;
                      setInvoiceForm({ ...invoiceForm, items: newItems });
                    }}
                    className="col-span-5 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="text"
                    placeholder="HSN/SAC"
                    value={item.hsn}
                    onChange={(e) => {
                      const newItems = [...invoiceForm.items];
                      newItems[idx].hsn = e.target.value;
                      setInvoiceForm({ ...invoiceForm, items: newItems });
                    }}
                    className="col-span-2 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="number"
                    placeholder="Amount"
                    value={item.amount}
                    onChange={(e) => {
                      const newItems = [...invoiceForm.items];
                      newItems[idx].amount = parseFloat(e.target.value) || 0;
                      setInvoiceForm({ ...invoiceForm, items: newItems });
                    }}
                    className="col-span-4 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const newItems = invoiceForm.items.filter((_, i) => i !== idx);
                      setInvoiceForm({ ...invoiceForm, items: newItems });
                    }}
                    className="col-span-1 text-red-600 hover:bg-red-50 p-2 rounded"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Tax Type */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">Tax Type</label>
            <select
              value={invoiceForm.taxType}
              onChange={(e) => setInvoiceForm({ ...invoiceForm, taxType: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="intrastate">Intra-State (CGST + SGST 9% each)</option>
              <option value="interstate">Inter-State (IGST 18%)</option>
            </select>
          </div>

          {/* Tax Breakdown Preview */}
          <div className="bg-gray-50 rounded-lg p-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Subtotal:</span>
              <span className="font-semibold">₹{subtotal.toLocaleString('en-IN')}</span>
            </div>
            {invoiceForm.taxType === 'intrastate' ? (
              <>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">CGST (9%):</span>
                  <span className="font-semibold">₹{cgst.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">SGST (9%):</span>
                  <span className="font-semibold">₹{sgst.toLocaleString('en-IN')}</span>
                </div>
              </>
            ) : (
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">IGST (18%):</span>
                <span className="font-semibold">₹{igst.toLocaleString('en-IN')}</span>
              </div>
            )}
            <div className="border-t border-gray-200 pt-2 flex justify-between">
              <span className="text-gray-900 font-bold">TOTAL:</span>
              <span className="text-lg font-bold text-blue-600">₹{total.toLocaleString('en-IN')}</span>
            </div>
            <div className="bg-white p-2 rounded border border-gray-200 mt-3">
              <p className="text-xs text-gray-700">{numberToWords(Math.round(total))}</p>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">Notes</label>
            <textarea
              value={invoiceForm.notes}
              onChange={(e) => setInvoiceForm({ ...invoiceForm, notes: e.target.value })}
              rows="3"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Terms, payment instructions, etc."
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4 border-t border-gray-200">
            <button
              type="submit"
              className="flex-1 bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700"
            >
              {editingInvoice ? 'Update Invoice' : 'Create Invoice'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-200 text-gray-900 py-2 rounded-lg font-semibold hover:bg-gray-300"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function ClientsModule({
  clients,
  showClientModal,
  setShowClientModal,
  clientForm,
  setClientForm,
  addOrUpdateClient,
  editingClient,
  setEditingClient,
  resetClientForm,
  searchTerm,
  setSearchTerm
}) {
  const filteredClients = clients.filter(c =>
    c.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.representative.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <h2 className="text-3xl font-bold text-gray-900">Clients</h2>
        <button
          onClick={() => {
            resetClientForm();
            setShowClientModal(true);
          }}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 font-medium"
        >
          <Plus size={20} />
          Add Client
        </button>
      </div>

      {/* Search */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="relative">
          <Search className="absolute left-3 top-3 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search by company name or representative..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Clients Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredClients.map(client => (
          <div key={client.id} className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-teal-500 flex items-center justify-center">
                <Users size={20} className="text-white" />
              </div>
              <button
                onClick={() => {
                  setEditingClient(client);
                  setClientForm(client);
                  setShowClientModal(true);
                }}
                className="text-gray-400 hover:text-blue-600"
              >
                <Edit2 size={18} />
              </button>
            </div>

            <h3 className="text-lg font-bold text-gray-900 mb-1">{client.companyName}</h3>
            <p className="text-sm text-gray-600 mb-3">{client.representative}</p>

            <div className="space-y-2 text-sm text-gray-600">
              <p><span className="font-medium">PAN:</span> {client.pan}</p>
              <p><span className="font-medium">GSTIN:</span> {client.gstin}</p>
              <p><span className="font-medium">Email:</span> {client.email}</p>
              <p><span className="font-medium">Phone:</span> {client.phone}</p>
              <p><span className="font-medium">State:</span> {client.stateCode}</p>
            </div>

            <button className="mt-4 w-full flex items-center justify-center gap-2 py-2 bg-gray-50 hover:bg-blue-50 rounded-lg font-medium text-gray-700 hover:text-blue-600 transition-colors">
              <Mail size={16} />
              Send Invoice
            </button>
          </div>
        ))}
      </div>

      {/* Client Modal */}
      {showClientModal && (
        <ClientModal
          clientForm={clientForm}
          setClientForm={setClientForm}
          addOrUpdateClient={addOrUpdateClient}
          onClose={() => {
            setShowClientModal(false);
            resetClientForm();
          }}
          editingClient={editingClient}
        />
      )}
    </div>
  );
}

function ClientModal({ clientForm, setClientForm, addOrUpdateClient, onClose, editingClient }) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl">
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <h3 className="text-2xl font-bold text-gray-900">
            {editingClient ? 'Edit Client' : 'Add New Client'}
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={addOrUpdateClient} className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Company Name *"
              value={clientForm.companyName}
              onChange={(e) => setClientForm({ ...clientForm, companyName: e.target.value })}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <input
              type="text"
              placeholder="Representative Name"
              value={clientForm.representative}
              onChange={(e) => setClientForm({ ...clientForm, representative: e.target.value })}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="text"
              placeholder="PAN"
              value={clientForm.pan}
              onChange={(e) => setClientForm({ ...clientForm, pan: e.target.value })}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="text"
              placeholder="GSTIN"
              value={clientForm.gstin}
              onChange={(e) => setClientForm({ ...clientForm, gstin: e.target.value })}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="text"
              placeholder="State Code (e.g., 27)"
              value={clientForm.stateCode}
              onChange={(e) => setClientForm({ ...clientForm, stateCode: e.target.value })}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="email"
              placeholder="Email"
              value={clientForm.email}
              onChange={(e) => setClientForm({ ...clientForm, email: e.target.value })}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="tel"
              placeholder="Phone"
              value={clientForm.phone}
              onChange={(e) => setClientForm({ ...clientForm, phone: e.target.value })}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <textarea
              placeholder="Address"
              value={clientForm.address}
              onChange={(e) => setClientForm({ ...clientForm, address: e.target.value })}
              rows="2"
              className="col-span-2 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex gap-3 pt-4 border-t border-gray-200">
            <button
              type="submit"
              className="flex-1 bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700"
            >
              {editingClient ? 'Update Client' : 'Add Client'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-200 text-gray-900 py-2 rounded-lg font-semibold hover:bg-gray-300"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function VendorsModule({
  vendors,
  showVendorModal,
  setShowVendorModal,
  vendorForm,
  setVendorForm,
  addOrUpdateVendor,
  searchTerm,
  setSearchTerm
}) {
  const filteredVendors = vendors.filter(v =>
    v.vendorName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <h2 className="text-3xl font-bold text-gray-900">Vendors</h2>
        <button
          onClick={() => {
            setVendorForm({ id: null, vendorName: '', contactPerson: '', email: '', phone: '' });
            setShowVendorModal(true);
          }}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 font-medium"
        >
          <Plus size={20} />
          Add Vendor
        </button>
      </div>

      {/* Search */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="relative">
          <Search className="absolute left-3 top-3 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search by vendor name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Vendors List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-900">Vendor Name</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-900">Contact Person</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-900">Email</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-900">Phone</th>
                <th className="px-6 py-3 text-center text-xs font-semibold text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredVendors.map(vendor => (
                <tr key={vendor.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-semibold text-gray-900">{vendor.vendorName}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{vendor.contactPerson}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{vendor.email}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{vendor.phone}</td>
                  <td className="px-6 py-4 text-center">
                    <button
                      onClick={() => {
                        setVendorForm(vendor);
                        setShowVendorModal(true);
                      }}
                      className="text-blue-600 hover:text-blue-700 font-medium"
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Vendor Modal */}
      {showVendorModal && (
        <VendorModal
          vendorForm={vendorForm}
          setVendorForm={setVendorForm}
          addOrUpdateVendor={addOrUpdateVendor}
          onClose={() => setShowVendorModal(false)}
        />
      )}
    </div>
  );
}

function VendorModal({ vendorForm, setVendorForm, addOrUpdateVendor, onClose }) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <h3 className="text-2xl font-bold text-gray-900">Add/Edit Vendor</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={addOrUpdateVendor} className="p-6 space-y-4">
          <input
            type="text"
            placeholder="Vendor Name *"
            value={vendorForm.vendorName}
            onChange={(e) => setVendorForm({ ...vendorForm, vendorName: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <input
            type="text"
            placeholder="Contact Person"
            value={vendorForm.contactPerson}
            onChange={(e) => setVendorForm({ ...vendorForm, contactPerson: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="email"
            placeholder="Email"
            value={vendorForm.email}
            onChange={(e) => setVendorForm({ ...vendorForm, email: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="tel"
            placeholder="Phone"
            value={vendorForm.phone}
            onChange={(e) => setVendorForm({ ...vendorForm, phone: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <div className="flex gap-3 pt-4 border-t border-gray-200">
            <button
              type="submit"
              className="flex-1 bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700"
            >
              Save Vendor
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-200 text-gray-900 py-2 rounded-lg font-semibold hover:bg-gray-300"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function PaymentsModule({
  payments,
  invoices,
  getClientName,
  showPaymentModal,
  setShowPaymentModal,
  paymentForm,
  setPaymentForm,
  recordPayment
}) {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <h2 className="text-3xl font-bold text-gray-900">Payments</h2>
        <button
          onClick={() => {
            setPaymentForm({
              id: null,
              invoiceId: '',
              amount: '',
              mode: 'NEFT/Bank Transfer',
              reference: '',
              date: new Date().toISOString().split('T')[0]
            });
            setShowPaymentModal(true);
          }}
          className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 font-medium"
        >
          <Plus size={20} />
          Record Payment
        </button>
      </div>

      {/* Payments Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-900">Invoice ID</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-900">Client</th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-gray-900">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-900">Mode</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-900">Reference</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-900">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {payments.map(payment => {
                const invoice = invoices.find(inv => inv.id === payment.invoiceId);
                return (
                  <tr key={payment.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-mono font-semibold text-blue-600">{payment.invoiceId}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{invoice ? getClientName(invoice.clientId) : 'N/A'}</td>
                    <td className="px-6 py-4 text-sm font-semibold text-right text-green-600">₹{parseFloat(payment.amount).toLocaleString('en-IN')}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{payment.mode}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{payment.reference}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{new Date(payment.date).toLocaleDateString('en-IN')}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Payment Modal */}
      {showPaymentModal && (
        <PaymentModal
          paymentForm={paymentForm}
          setPaymentForm={setPaymentForm}
          recordPayment={recordPayment}
          onClose={() => setShowPaymentModal(false)}
          invoices={invoices}
          getClientName={getClientName}
        />
      )}
    </div>
  );
}

function PaymentModal({ paymentForm, setPaymentForm, recordPayment, onClose, invoices, getClientName }) {
  const pendingInvoices = invoices.filter(inv => !['PAID', 'CANCELLED'].includes(inv.status));

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <h3 className="text-2xl font-bold text-gray-900">Record Payment</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={recordPayment} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">Invoice *</label>
            <select
              value={paymentForm.invoiceId}
              onChange={(e) => setPaymentForm({ ...paymentForm, invoiceId: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select invoice...</option>
              {pendingInvoices.map(inv => (
                <option key={inv.id} value={inv.id}>
                  {inv.id} - {getClientName(inv.clientId)} (₹{inv.total})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">Amount Paid *</label>
            <input
              type="number"
              step="0.01"
              placeholder="0.00"
              value={paymentForm.amount}
              onChange={(e) => setPaymentForm({ ...paymentForm, amount: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">Payment Mode</label>
            <select
              value={paymentForm.mode}
              onChange={(e) => setPaymentForm({ ...paymentForm, mode: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {PAYMENT_MODES.map(mode => (
                <option key={mode} value={mode}>{mode}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">Reference / UTR</label>
            <input
              type="text"
              placeholder="Transaction reference"
              value={paymentForm.reference}
              onChange={(e) => setPaymentForm({ ...paymentForm, reference: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">Payment Date</label>
            <input
              type="date"
              value={paymentForm.date}
              onChange={(e) => setPaymentForm({ ...paymentForm, date: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex gap-3 pt-4 border-t border-gray-200">
            <button
              type="submit"
              className="flex-1 bg-green-600 text-white py-2 rounded-lg font-semibold hover:bg-green-700"
            >
              Record Payment
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-200 text-gray-900 py-2 rounded-lg font-semibold hover:bg-gray-300"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function ReportsModule({ invoices, payments, clients, getClientName, dashboardMetrics }) {
  const [reportType, setReportType] = useState('summary');

  const gstSummary = useMemo(() => {
    const summary = {};
    invoices.forEach(inv => {
      if (!['CANCELLED'].includes(inv.status)) {
        const month = inv.date.substring(0, 7);
        if (!summary[month]) {
          summary[month] = { igst: 0, cgst: 0, sgst: 0, total: 0 };
        }
        summary[month].igst += inv.igst || 0;
        summary[month].cgst += inv.cgst || 0;
        summary[month].sgst += inv.sgst || 0;
        summary[month].total += inv.total;
      }
    });
    return summary;
  }, [invoices]);

  const clientWiseLedger = useMemo(() => {
    const ledger = {};
    clients.forEach(client => {
      const clientInvoices = invoices.filter(inv => inv.clientId === client.id && !['CANCELLED'].includes(inv.status));
      const revenue = clientInvoices.reduce((sum, inv) => sum + inv.total, 0);
      const collected = payments
        .filter(pay => clientInvoices.find(inv => inv.id === pay.invoiceId))
        .reduce((sum, pay) => sum + parseFloat(pay.amount), 0);

      ledger[client.id] = {
        companyName: client.companyName,
        invoiceCount: clientInvoices.length,
        revenue,
        collected,
        pending: revenue - collected
      };
    });
    return ledger;
  }, [invoices, payments, clients]);

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-gray-900">Reports</h2>

      {/* Report Type Selector */}
      <div className="flex gap-2 border-b border-gray-200">
        {[
          { id: 'summary', label: 'Summary' },
          { id: 'gst', label: 'GST Tax Report' },
          { id: 'clientwise', label: 'Client-Wise Ledger' },
          { id: 'receivables', label: 'Pending Receivables' }
        ].map(item => (
          <button
            key={item.id}
            onClick={() => setReportType(item.id)}
            className={`px-4 py-3 font-medium border-b-2 transition-colors ${
              reportType === item.id
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      {/* Summary Report */}
      {reportType === 'summary' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-gray-600 text-sm mb-2">Total Revenue</p>
            <p className="text-3xl font-bold text-green-600">₹{(dashboardMetrics.totalRevenue / 100000).toFixed(2)}L</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-gray-600 text-sm mb-2">Pending</p>
            <p className="text-3xl font-bold text-yellow-600">₹{(dashboardMetrics.pendingReceivables / 100000).toFixed(2)}L</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-gray-600 text-sm mb-2">Invoices Count</p>
            <p className="text-3xl font-bold text-blue-600">{dashboardMetrics.activeInvoicesCount}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-gray-600 text-sm mb-2">Collection Rate</p>
            <p className="text-3xl font-bold text-purple-600">
              {dashboardMetrics.totalRevenue + dashboardMetrics.pendingReceivables > 0
                ? Math.round((dashboardMetrics.totalRevenue / (dashboardMetrics.totalRevenue + dashboardMetrics.pendingReceivables)) * 100)
                : 0}%
            </p>
          </div>
        </div>
      )}

      {/* GST Report */}
      {reportType === 'gst' && (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-900">Month</th>
                  <th className="px-6 py-3 text-right text-xs font-semibold text-gray-900">Taxable Amount</th>
                  <th className="px-6 py-3 text-right text-xs font-semibold text-gray-900">CGST (9%)</th>
                  <th className="px-6 py-3 text-right text-xs font-semibold text-gray-900">SGST (9%)</th>
                  <th className="px-6 py-3 text-right text-xs font-semibold text-gray-900">IGST (18%)</th>
                  <th className="px-6 py-3 text-right text-xs font-semibold text-gray-900">Total Tax</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {Object.entries(gstSummary).map(([month, data]) => (
                  <tr key={month} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-semibold text-gray-900">{month}</td>
                    <td className="px-6 py-4 text-sm text-right text-gray-600">₹{(data.total - data.cgst - data.sgst - data.igst).toLocaleString('en-IN')}</td>
                    <td className="px-6 py-4 text-sm text-right text-gray-600">₹{data.cgst.toLocaleString('en-IN')}</td>
                    <td className="px-6 py-4 text-sm text-right text-gray-600">₹{data.sgst.toLocaleString('en-IN')}</td>
                    <td className="px-6 py-4 text-sm text-right text-gray-600">₹{data.igst.toLocaleString('en-IN')}</td>
                    <td className="px-6 py-4 text-sm font-semibold text-right text-blue-600">₹{(data.cgst + data.sgst + data.igst).toLocaleString('en-IN')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Client-Wise Ledger */}
      {reportType === 'clientwise' && (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-900">Client Name</th>
                  <th className="px-6 py-3 text-center text-xs font-semibold text-gray-900">Invoices</th>
                  <th className="px-6 py-3 text-right text-xs font-semibold text-gray-900">Total Revenue</th>
                  <th className="px-6 py-3 text-right text-xs font-semibold text-gray-900">Collected</th>
                  <th className="px-6 py-3 text-right text-xs font-semibold text-gray-900">Pending</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {Object.entries(clientWiseLedger).map(([clientId, data]) => (
                  <tr key={clientId} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-semibold text-gray-900">{data.companyName}</td>
                    <td className="px-6 py-4 text-sm text-center text-gray-600">{data.invoiceCount}</td>
                    <td className="px-6 py-4 text-sm text-right font-semibold text-gray-900">₹{data.revenue.toLocaleString('en-IN')}</td>
                    <td className="px-6 py-4 text-sm text-right font-semibold text-green-600">₹{data.collected.toLocaleString('en-IN')}</td>
                    <td className="px-6 py-4 text-sm text-right font-semibold text-orange-600">₹{data.pending.toLocaleString('en-IN')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Export Button */}
      <button className="flex items-center gap-2 bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 font-medium">
        <Download size={20} />
        Export as PDF
      </button>
    </div>
  );
}

function AuditModule({ auditLog }) {
  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-gray-900">Audit Trail</h2>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-900">Timestamp</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-900">User</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-900">Action</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-900">Entity Type</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-900">Description</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {auditLog.map(log => (
                <tr key={log.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-600">{log.timestamp}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{log.userEmail}</td>
                  <td className="px-6 py-4 text-sm">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      log.action === 'CREATE' ? 'bg-green-100 text-green-700' :
                      log.action === 'UPDATE' ? 'bg-blue-100 text-blue-700' :
                      log.action === 'CANCEL' ? 'bg-red-100 text-red-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {log.action}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{log.entityType}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{log.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function SettingsModal({ orgSettings, setOrgSettings, onClose }) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200 sticky top-0 bg-white flex items-center justify-between">
          <h3 className="text-2xl font-bold text-gray-900">App Settings</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={24} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div>
            <h4 className="text-lg font-bold text-gray-900 mb-4">Company Information</h4>
            <div className="space-y-4">
              <input
                type="text"
                value={orgSettings.companyName}
                onChange={(e) => setOrgSettings({ ...orgSettings, companyName: e.target.value })}
                placeholder="Company Name"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                value={orgSettings.prefix}
                onChange={(e) => setOrgSettings({ ...orgSettings, prefix: e.target.value })}
                placeholder="Invoice Prefix"
                maxLength="5"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                value={orgSettings.pan}
                onChange={(e) => setOrgSettings({ ...orgSettings, pan: e.target.value })}
                placeholder="PAN"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                value={orgSettings.gstin}
                onChange={(e) => setOrgSettings({ ...orgSettings, gstin: e.target.value })}
                placeholder="GSTIN"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <textarea
                value={orgSettings.address}
                onChange={(e) => setOrgSettings({ ...orgSettings, address: e.target.value })}
                placeholder="Address"
                rows="3"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="border-t border-gray-200 pt-6">
            <h4 className="text-lg font-bold text-gray-900 mb-4">Banking Information</h4>
            <div className="space-y-4">
              <input
                type="text"
                value={orgSettings.bankName}
                onChange={(e) => setOrgSettings({ ...orgSettings, bankName: e.target.value })}
                placeholder="Bank Name"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                value={orgSettings.accountName}
                onChange={(e) => setOrgSettings({ ...orgSettings, accountName: e.target.value })}
                placeholder="Account Name"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                value={orgSettings.accountNumber}
                onChange={(e) => setOrgSettings({ ...orgSettings, accountNumber: e.target.value })}
                placeholder="Account Number"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                value={orgSettings.ifscCode}
                onChange={(e) => setOrgSettings({ ...orgSettings, ifscCode: e.target.value })}
                placeholder="IFSC Code"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="flex gap-3 pt-4 border-t border-gray-200">
            <button
              onClick={onClose}
              className="flex-1 bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700"
            >
              Save Settings
            </button>
            <button
              onClick={onClose}
              className="flex-1 bg-gray-200 text-gray-900 py-2 rounded-lg font-semibold hover:bg-gray-300"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
