"use client";

import React, { useState, useEffect } from 'react';
import {
  Briefcase,
  ChevronDown,
  ChevronRight,
  Plus,
  Search,
  Filter,
  X,
  Moon,
  Sun,
  LogOut,
  Check,
  AlertCircle,
  Info,
  BarChart3,
  Users,
  ClipboardList,
  Calendar as CalendarIcon,
  Mail,
  FileText,
  TrendingUp,
  Settings as SettingsIcon
} from 'lucide-react';

import LoginView from '../components/crm/LoginView';
import DashboardView from '../components/crm/DashboardView';
import LeadsView from '../components/crm/LeadsView';
import OpportunitiesView from '../components/crm/OpportunitiesView';
import ActivitiesView from '../components/crm/ActivitiesView';
import EmailsView from '../components/crm/EmailsView';
import QuotationsView from '../components/crm/QuotationsView';
import ReferralsView from '../components/crm/ReferralsView';
import SettingsView from '../components/crm/SettingsView';

const API_BASE = 'http://localhost:5000/api';

export default function CRMPlatform() {
  // Navigation & Shell states
  const [mounted, setMounted] = useState(false);
  const [currentTab, setCurrentTab] = useState('dashboard');
  const [theme, setTheme] = useState('light');
  const [searchQuery, setSearchQuery] = useState('');
  const [notifications, setNotifications] = useState<any[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [toasts, setToasts] = useState<any[]>([]);

  // Odoo Filter Drawer state
  const [showFilterDrawer, setShowFilterDrawer] = useState(false);
  const [activeFilters, setActiveFilters] = useState<any>({
    myPipeline: false,
    unassigned: false,
    open: false,
    won: false,
    lost: false,
    category: '',
    serviceType: '',
    salesperson: '',
    team: '',
    city: '',
    country: '',
    campaign: '',
    source: '',
    createdDateStart: '',
    createdDateEnd: '',
    expectedClosingStart: '',
    expectedClosingEnd: '',
    closedDateStart: '',
    closedDateEnd: ''
  });
  const [customFilters, setCustomFilters] = useState<string[]>([]);
  const [customFilterName, setCustomFilterName] = useState('');

  // Authentication State
  const [user, setUser] = useState<any>(null);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [authForm, setAuthForm] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    company: 'Acme Corp',
    role: 'Super Admin'
  });

  // CRM Data States (Synchronized with express backend, fallback to offline seed data)
  const [leads, setLeads] = useState<any[]>([]);
  const [opportunities, setOpportunities] = useState<any[]>([]);
  const [pipelines, setPipelines] = useState<any[]>([]);
  const [referralPipelines, setReferralPipelines] = useState<any[]>([]);
  const [activities, setActivities] = useState<any[]>([]);
  const [emails, setEmails] = useState<any[]>([]);
  const [quotations, setQuotations] = useState<any[]>([]);
  const [referrals, setReferrals] = useState<any[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [serviceTypes, setServiceTypes] = useState<string[]>(['Service Based', 'Product Based']);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [companyBranding, setCompanyBranding] = useState({
    name: 'Global CRM Cloud',
    primaryColor: '#2563EB',
    secondaryColor: '#0F172A',
    logoText: 'Odoo CRM Pro'
  });

  // UI Detail States (Modals, drawers, and creation forms)
  const [selectedLead, setSelectedLead] = useState<any>(null);
  const [showLeadDrawer, setShowLeadDrawer] = useState(false);
  const [showLeadCreateModal, setShowLeadCreateModal] = useState(false);
  const [leadForm, setLeadForm] = useState({
    name: '', company: '', email: '', phone: '', source: 'Website',
    serviceType: 'Service Based', category: 'Healthcare', assignedUser: '', notes: ''
  });

  const [convertLeadId, setConvertLeadId] = useState<string | null>(null);
  const [convertForm, setConvertForm] = useState({ dealValue: '15000', salesperson: '' });

  const [selectedOpportunity, setSelectedOpportunity] = useState<any>(null);
  const [oppQuickEditId, setOppQuickEditId] = useState<string | null>(null);

  const [showStageModal, setShowStageModal] = useState(false);
  const [newStageName, setNewStageName] = useState('');

  const [showActivityModal, setShowActivityModal] = useState(false);
  const [activityForm, setActivityForm] = useState({
    title: '', type: 'Meeting', date: '', time: '10:00', duration: '30',
    description: '', salesperson: '', leadId: '', opportunityId: ''
  });
  const [calendarView, setCalendarView] = useState<'day' | 'week' | 'month'>('month');

  // Outlook Email state
  const [emailFolder, setEmailFolder] = useState('Inbox');
  const [selectedEmail, setSelectedEmail] = useState<any>(null);
  const [emailReplyText, setEmailReplyText] = useState('');

  // Quotation state
  const [selectedQuote, setSelectedQuote] = useState<any>(null);
  const [showQuoteModal, setShowQuoteModal] = useState(false);
  const [quoteForm, setQuoteForm] = useState({
    clientName: '', company: '', taxRate: '8', discount: '0', opportunityId: '',
    items: [{ description: '', qty: 1, price: 0 }]
  });

  // Referral state
  const [referralForm, setReferralForm] = useState({
    referrerName: '', referrerCompany: '', referredLeadName: '', referredCompany: '',
    dealValue: '10000', rewardType: 'Credits', rewardValue: '$1,000 Credits'
  });
  const [showReferralModal, setShowReferralModal] = useState(false);

  // Settings states
  const [settingsUsers, setSettingsUsers] = useState<any[]>([]);

  // Notifications
  const addToast = (type: 'success' | 'error' | 'info', message: string) => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, type, message }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

  // Helper: Fetch from Express API with fallback
  const apiCall = async (path: string, method = 'GET', body: any = null) => {
    try {
      const headers: any = { 'Content-Type': 'application/json' };
      const config: any = { method, headers };
      if (body) config.body = JSON.stringify(body);
      const res = await fetch(`${API_BASE}${path}`, config);
      if (!res.ok) throw new Error(`API error ${res.status}`);
      return await res.json();
    } catch (err) {
      console.warn(`Express API offline (${path} - ${method}). Operating in local state fallback mode.`);
      return null;
    }
  };

  // Initial Load & Auth check
  useEffect(() => {
    setMounted(true);
    // Check local storage for session
    const savedUser = localStorage.getItem('crm_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    
    // Load state
    loadCRMData();
  }, []);

  const loadCRMData = async () => {
    // Get backend data
    const apiLeads = await apiCall('/leads');
    const apiOpps = await apiCall('/opportunities');
    const apiPipelines = await apiCall('/pipelines');
    const apiActivities = await apiCall('/activities');
    const apiEmails = await apiCall('/emails');
    const apiQuotes = await apiCall('/quotations');
    const apiReferrals = await apiCall('/referrals');
    const apiCategories = await apiCall('/categories');
    const apiUsers = await apiCall('/users');
    const apiRefPipelines = await apiCall('/referral-pipelines');
    const apiBranding = await apiCall('/settings/branding');
    const apiLogs = await apiCall('/settings/logs');

    if (apiLeads) setLeads(apiLeads);
    if (apiOpps) setOpportunities(apiOpps);
    if (apiPipelines) setPipelines(apiPipelines);
    if (apiRefPipelines) setReferralPipelines(apiRefPipelines);
    if (apiActivities) setActivities(apiActivities);
    if (apiEmails) setEmails(apiEmails);
    if (apiQuotes) setQuotations(apiQuotes);
    if (apiReferrals) setReferrals(apiReferrals);
    if (apiCategories) setCategories(apiCategories);
    if (apiUsers) setSettingsUsers(apiUsers);
    if (apiBranding) setCompanyBranding(apiBranding);
    if (apiLogs) setAuditLogs(apiLogs);

    // Seed offline state if backend is completely empty or down
    if (!apiLeads && leads.length === 0) {
      // offline seed
      setLeads([
        { id: 'l_1', name: 'Dr. Elizabeth Blackwell', company: 'Blackwell Clinic Group', email: 'eblackwell@blackwellclinic.com', phone: '+1 (555) 0211', source: 'Website', serviceType: 'Service Based', category: 'Healthcare', status: 'New', assignedUser: 'Kyle Reese', createdDate: '2026-06-12', notes: 'Interested in cloud healthcare platform.' },
        { id: 'l_2', name: 'Henry Ford II', company: 'Ford Manufacturing Labs', email: 'hford@fordmfg.com', phone: '+1 (555) 0222', source: 'Referral', serviceType: 'Product Based', category: 'Manufacturing', status: 'Contacted', assignedUser: 'Sarah Connor', createdDate: '2026-06-16', notes: 'Referred by Michael Scott. Auto IoT automation.' }
      ]);
      setOpportunities([
        { id: 'o_1', customerName: 'Bruce Wayne', company: 'Wayne Enterprises', dealValue: 250000, expectedClosing: '2026-07-24', assignedSalesperson: 'Sarah Connor', priority: 'High', tags: ['SaaS', 'Security'], stageId: 'p_3', createdDate: '2026-05-24' },
        { id: 'o_2', customerName: 'Tony Stark', company: 'Stark Industries', dealValue: 850000, expectedClosing: '2026-07-09', assignedSalesperson: 'John Doe (SA)', priority: 'High', tags: ['Enterprise', 'AI'], stageId: 'p_5', createdDate: '2026-05-10' },
        { id: 'o_3', customerName: 'Clark Kent', company: 'Daily Planet Publishing', dealValue: 45000, expectedClosing: '2026-05-10', assignedSalesperson: 'Kyle Reese', priority: 'Low', tags: ['CMS', 'Cloud'], stageId: 'p_6', createdDate: '2026-04-25' } // Won
      ]);
      setPipelines([
        { id: 'p_1', name: 'New', order: 1 },
        { id: 'p_2', name: 'Possible Response Received', order: 2 },
        { id: 'p_3', name: 'Discussion', order: 3 },
        { id: 'p_4', name: 'Proposal Preparation', order: 4 },
        { id: 'p_5', name: 'Negotiation', order: 5 },
        { id: 'p_6', name: 'Won', order: 6 },
        { id: 'p_7', name: 'Lost', order: 7 }
      ]);
      setReferralPipelines([
        { id: 'rp_1', name: 'Referral Submitted', order: 1 },
        { id: 'rp_2', name: 'Qualified', order: 2 },
        { id: 'rp_3', name: 'Proposal', order: 3 },
        { id: 'rp_4', name: 'Won', order: 4 },
        { id: 'rp_5', name: 'Reward Approved', order: 5 }
      ]);
      setCategories(['Healthcare', 'Manufacturing', 'Education', 'Real Estate', 'E-Commerce', 'Finance', 'Logistics', 'Hospitality', 'IT Services']);
      setActivities([
        { id: 'a_1', title: 'Stark proposal alignment', type: 'Meeting', date: '2026-06-25', time: '14:00', duration: '60', description: 'Align deal parameters.', salesperson: 'John Doe (SA)', done: false, opportunityId: 'o_2' },
        { id: 'a_2', title: 'Call Bruce Wayne', type: 'Call', date: '2026-06-26', time: '10:00', duration: '15', description: 'Schedule security demo.', salesperson: 'Sarah Connor', done: false, opportunityId: 'o_1' }
      ]);
      setEmails([
        {
          id: 'e_1', sender: 'tony@starkindustries.com', recipient: 'superadmin@crm.com', subject: 'Stark CRM Proposal Draft',
          body: 'The proposal looks great John, but we need to ensure the Recharts analytics widget can ingest 50k events per second.',
          folder: 'Inbox', date: '2026-06-23T14:32:00Z', read: false, replied: false, bounced: false, threadId: 'th_stark_1',
          history: [{ sender: 'superadmin@crm.com', body: 'Hi Tony, attached is the draft proposal. Please let me know your thoughts.', date: '2026-06-22T09:15:00Z' }]
        }
      ]);
      setQuotations([
        { id: 'q_1', quoteNumber: 'QT-2026-001', clientName: 'Clark Kent', company: 'Daily Planet Publishing', opportunityId: 'o_3', date: '2026-04-25', status: 'Approved', taxRate: 8, discount: 2500, items: [{ description: 'Enterprise License', qty: 50, price: 800, total: 40000 }], subtotal: 40000, taxAmount: 3200, grandTotal: 40700 }
      ]);
      setReferrals([
        { id: 'ref_1', referrerName: 'Clark Kent', referrerCompany: 'Daily Planet Publishing', referredLeadName: 'Lois Lane', referredCompany: 'Metropolis Gazette', dealValue: 75000, stage: 'rp_3', dateSubmitted: '2026-06-10', rewardType: 'Credits', rewardValue: '$1,500 CRM Credits', rewardApproved: false }
      ]);
      setAuditLogs([
        { id: 'log_offline_init', timestamp: new Date().toISOString(), user: 'System', role: 'System', action: 'INIT_OFFLINE', module: 'Database', details: 'Express offline. Seeded local mock state.' }
      ]);
    }
  };

  // Auth Functions
  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (authMode === 'login') {
      const res = await apiCall('/auth/login', 'POST', { email: authForm.email, password: authForm.password });
      if (res && res.user) {
        setUser(res.user);
        localStorage.setItem('crm_user', JSON.stringify(res.user));
        addToast('success', `Welcome back, ${res.user.name}!`);
        loadCRMData();
      } else {
        // Mock offline bypass
        const offlineUsers = [
          { id: 'u_1', name: 'John Doe (SA)', email: 'superadmin@crm.com', role: 'Super Admin', company: 'Global Corp Enterprise' },
          { id: 'u_2', name: 'Sarah Connor', email: 'admin@crm.com', role: 'Admin', company: 'Global Corp Enterprise' },
          { id: 'u_3', name: 'Kyle Reese', email: 'user@crm.com', role: 'User', company: 'Global Corp Enterprise' }
        ];
        const match = offlineUsers.find(u => u.email === authForm.email);
        if (match) {
          setUser(match);
          localStorage.setItem('crm_user', JSON.stringify(match));
          addToast('success', `Logged in offline as ${match.name} (${match.role})`);
          loadCRMData();
        } else {
          addToast('error', 'Invalid email or password');
        }
      }
    } else {
      if (authForm.password !== authForm.confirmPassword) {
        return addToast('error', 'Passwords do not match');
      }
      const res = await apiCall('/auth/register', 'POST', {
        name: authForm.name, email: authForm.email, phone: authForm.phone,
        password: authForm.password, company: authForm.company, role: authForm.role
      });
      if (res && res.user) {
        setUser(res.user);
        localStorage.setItem('crm_user', JSON.stringify(res.user));
        addToast('success', `Account created successfully! Welcome, ${res.user.name}`);
        loadCRMData();
      } else {
        // offline register bypass
        const mockNewUser = {
          id: 'u_' + Date.now(), name: authForm.name, email: authForm.email,
          role: authForm.role, company: authForm.company
        };
        setUser(mockNewUser);
        localStorage.setItem('crm_user', JSON.stringify(mockNewUser));
        addToast('success', `Registered offline as ${mockNewUser.name}`);
        loadCRMData();
      }
    }
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('crm_user');
    addToast('info', 'Logged out successfully');
  };

  // Quick Account selector for testing
  const selectQuickAccount = (email: string) => {
    setAuthForm(prev => ({ ...prev, email, password: 'password' }));
  };

  // Lead CRUD
  const handleCreateLeadFromView = async (leadForm: any) => {
    const res = await apiCall('/leads', 'POST', leadForm);
    if (res) {
      setLeads(prev => [...prev, res]);
      addToast('success', `Lead for ${res.name} created!`);
    } else {
      const mockLead = {
        id: 'l_' + Date.now(), createdDate: new Date().toISOString().split('T')[0], status: 'New', ...leadForm
      };
      setLeads(prev => [...prev, mockLead]);
      addToast('success', `Lead for ${mockLead.name} created (Offline Mode)`);
    }
    setShowLeadCreateModal(false);
    loadCRMData();
  };

  const handleUpdateLeadFromView = async (leadId: string, leadData: any) => {
    setLeads(prev => prev.map(l => l.id === leadId ? { ...l, ...leadData } : l));
    await apiCall(`/leads/${leadId}`, 'PUT', leadData);
  };

  const handleDeleteLeadFromView = async (leadId: string) => {
    const res = await apiCall(`/leads/${leadId}`, 'DELETE');
    if (res) {
      addToast('success', 'Lead deleted');
      loadCRMData();
    } else {
      setLeads(prev => prev.filter(l => l.id !== leadId));
      addToast('success', 'Lead deleted (Offline)');
    }
  };

  const handleConvertLeadFromView = async (leadId: string, dealValue: string, salesperson: string) => {
    const res = await apiCall(`/leads/${leadId}/convert`, 'POST', { dealValue, salesperson });
    if (res) {
      addToast('success', 'Converted lead to Opportunity!');
      loadCRMData();
    } else {
      const leadObj = leads.find(l => l.id === leadId);
      if (leadObj) {
        const mockOpp = {
          id: 'o_' + Date.now(),
          customerName: leadObj.name,
          company: leadObj.company,
          dealValue: Number(dealValue) || 10000,
          expectedClosing: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          assignedSalesperson: salesperson || user?.name || 'Unassigned',
          priority: 'Medium',
          tags: [leadObj.source, leadObj.category],
          stageId: 'p_1',
          createdDate: new Date().toISOString().split('T')[0]
        };
        setOpportunities(prev => [...prev, mockOpp]);
        setLeads(prev => prev.filter(l => l.id !== leadId));
        addToast('success', 'Converted lead to Opportunity (Offline Mode)');
      }
    }
  };

  // Kanban Pipeline CRUD & Reorder
  const handleAddStage = async (stageName: string) => {
    if (user?.role !== 'Super Admin') return addToast('error', 'Only Super Admin can edit pipelines');
    const res = await apiCall('/pipelines', 'POST', { name: stageName });
    if (res) {
      setPipelines(prev => [...prev, res].sort((a,b)=>a.order - b.order));
      addToast('success', `Created stage: ${stageName}`);
    } else {
      const mockStage = { id: 'p_' + Date.now(), name: stageName, order: pipelines.length + 1 };
      setPipelines(prev => [...prev, mockStage]);
      addToast('success', `Created stage: ${stageName} (Offline)`);
    }
    loadCRMData();
  };

  const handleStageReorder = async (stageId: string, direction: 'left' | 'right') => {
    if (user?.role !== 'Super Admin') return addToast('error', 'Only Super Admin can manage pipelines');
    const stageIdx = pipelines.findIndex(p => p.id === stageId);
    if (stageIdx === -1) return;
    const targetIdx = direction === 'left' ? stageIdx - 1 : stageIdx + 1;
    if (targetIdx < 0 || targetIdx >= pipelines.length) return;

    const updated = [...pipelines];
    const temp = updated[stageIdx].order;
    updated[stageIdx].order = updated[targetIdx].order;
    updated[targetIdx].order = temp;

    const res = await apiCall('/pipelines/reorder', 'POST', {
      stages: updated.map(p => ({ id: p.id, order: p.order }))
    });
    if (res) {
      setPipelines(res);
    } else {
      setPipelines(updated.sort((a,b)=>a.order-b.order));
      addToast('success', 'Reordered stages (Offline)');
    }
  };

  const handleStageDelete = async (stageId: string) => {
    if (user?.role !== 'Super Admin') return addToast('error', 'Only Super Admin can manage pipelines');
    const res = await apiCall(`/pipelines/${stageId}`, 'DELETE');
    if (res) {
      addToast('success', 'Stage deleted successfully');
      loadCRMData();
    } else {
      const stage = pipelines.find(p => p.id === stageId);
      if (stage) {
        setPipelines(prev => prev.filter(p => p.id !== stageId));
        const fallback = pipelines[0]?.id || '';
        setOpportunities(prev => prev.map(o => o.stageId === stageId ? { ...o, stageId: fallback } : o));
        addToast('success', `Deleted stage ${stage.name} (Offline)`);
      }
    }
  };

  const handleMoveOpportunity = async (oppId: string, stageId: string) => {
    const opp = opportunities.find(o => o.id === oppId);
    if (!opp) return;

    const updatedOpps = opportunities.map(o => o.id === oppId ? { ...o, stageId } : o);
    setOpportunities(updatedOpps);

    const res = await apiCall(`/opportunities/${oppId}`, 'PUT', { stageId });
    if (res) {
      addToast('success', `Opportunity moved to stage`);
      loadCRMData();
    } else {
      if (stageId === 'p_6') {
        const already = referrals.some(r => r.referrerName === opp.customerName);
        if (!already) {
          const newRef = {
            id: 'ref_' + Date.now(), referrerName: opp.customerName, referrerCompany: opp.company,
            referredLeadName: 'Pending referral', referredCompany: 'Pending Company Corp', dealValue: 0,
            stage: 'rp_1', dateSubmitted: new Date().toISOString().split('T')[0], rewardType: 'Credits',
            rewardValue: '$1,000 Credits', rewardApproved: false
          };
          setReferrals(prev => [...prev, newRef]);
          addToast('success', `${opp.customerName} enrolled in Referral Program!`);
        }
      }
      addToast('success', 'Opportunity moved (Offline Mode)');
    }
  };

  // Activities Scheduling
  const handleActivityCreate = async (activityForm: any) => {
    const res = await apiCall('/activities', 'POST', activityForm);
    if (res) {
      setActivities(prev => [...prev, res]);
      addToast('success', 'Activity scheduled!');
    } else {
      const mockAct = { id: 'a_' + Date.now(), done: false, ...activityForm };
      setActivities(prev => [...prev, mockAct]);
      addToast('success', 'Activity scheduled (Offline)');
    }
    setShowActivityModal(false);
  };

  const toggleActivityDone = async (activityId: string, currentStatus: boolean) => {
    const res = await apiCall(`/activities/${activityId}`, 'PUT', { done: !currentStatus });
    if (res) {
      addToast('success', `Marked activity as ${!currentStatus ? 'Completed' : 'Open'}`);
      loadCRMData();
    } else {
      setActivities(prev => prev.map(a => a.id === activityId ? { ...a, done: !currentStatus } : a));
      addToast('success', 'Activity status updated (Offline)');
    }
  };

  // Outlook Email sending & tracking simulation
  const handleSendEmail = async (replyText: string, emailObject: any) => {
    const payload = {
      sender: user?.email || 'superadmin@crm.com',
      recipient: emailObject.sender,
      subject: `Re: ${emailObject.subject}`,
      body: replyText,
      folder: 'Sent',
      threadId: emailObject.threadId,
      history: [
        { sender: emailObject.sender, body: emailObject.body, date: emailObject.date },
        ...emailObject.history
      ]
    };

    const res = await apiCall('/emails', 'POST', payload);
    if (res) {
      addToast('success', 'Reply sent via Outlook!');
      loadCRMData();
    } else {
      const mockEmail = {
        id: 'e_' + Date.now(), date: new Date().toISOString(), read: true, replied: true, bounced: false, ...payload
      };
      setEmails(prev => [mockEmail, ...prev]);
      addToast('success', 'Reply sent (Offline Simulated)');
    }
  };

  // Quotation CRUD & Actions
  const handleQuotationCreate = async (quoteForm: any) => {
    const subtotal = quoteForm.items.reduce((sum: number, item: any) => sum + (Number(item.qty) * Number(item.price)), 0);
    const taxAmount = Math.round(subtotal * (Number(quoteForm.taxRate) / 100));
    const grandTotal = subtotal + taxAmount - Number(quoteForm.discount);

    const payload = {
      clientName: quoteForm.clientName,
      company: quoteForm.company,
      opportunityId: quoteForm.opportunityId,
      taxRate: Number(quoteForm.taxRate),
      discount: Number(quoteForm.discount),
      items: quoteForm.items
    };

    const res = await apiCall('/quotations', 'POST', payload);
    if (res) {
      setQuotations(prev => [...prev, res]);
      addToast('success', 'Quotation draft created');
    } else {
      const mockQuote = {
        id: 'q_' + Date.now(),
        quoteNumber: `QT-2026-0${quotations.length + 1}`,
        date: new Date().toISOString().split('T')[0],
        status: 'Draft',
        subtotal,
        taxAmount,
        grandTotal,
        ...payload
      };
      setQuotations(prev => [...prev, mockQuote]);
      addToast('success', 'Quotation draft created (Offline)');
    }
    setShowQuoteModal(false);
  };

  const updateQuoteStatus = async (quoteId: string, status: string) => {
    const res = await apiCall(`/quotations/${quoteId}`, 'PUT', { status });
    if (res) {
      addToast('success', `Quotation status updated to ${status}`);
      loadCRMData();
    } else {
      setQuotations(prev => prev.map(q => q.id === quoteId ? { ...q, status } : q));
      addToast('success', `Quotation status updated (Offline)`);
    }
  };

  // Referral CRUD
  const handleReferralCreate = async (referralForm: any) => {
    const res = await apiCall('/referrals', 'POST', referralForm);
    if (res) {
      setReferrals(prev => [...prev, res]);
      addToast('success', 'Referral submitted!');
    } else {
      const mockRef = {
        id: 'ref_' + Date.now(), dateSubmitted: new Date().toISOString().split('T')[0], stage: 'rp_1', rewardApproved: false, ...referralForm
      };
      setReferrals(prev => [...prev, mockRef]);
      addToast('success', 'Referral submitted (Offline)');
    }
    setShowReferralModal(false);
  };

  const handleApproveReward = async (refId: string) => {
    if (user?.role !== 'Super Admin') return addToast('error', 'Only Super Admin can approve referral rewards');
    const res = await apiCall(`/referrals/${refId}`, 'PUT', { rewardApproved: true, stage: 'rp_5' });
    if (res) {
      addToast('success', 'Referral Reward Approved!');
      loadCRMData();
    } else {
      setReferrals(prev => prev.map(r => r.id === refId ? { ...r, rewardApproved: true, stage: 'rp_5' } : r));
      addToast('success', 'Referral Reward Approved (Offline)');
    }
  };

 
  const handleAddCategory = async (catName: string) => {
    const res = await apiCall('/categories', 'POST', { category: catName });
    if (res) {
      setCategories(res);
      addToast('success', `Category "${catName}" added`);
    } else {
      if (!categories.includes(catName)) {
        setCategories(prev => [...prev, catName]);
        addToast('success', `Category "${catName}" added (Offline)`);
      }
    }
  };

  const handleDeleteCategory = async (catName: string) => {
    const res = await apiCall(`/categories/${catName}`, 'DELETE');
    if (res) {
      setCategories(res);
      addToast('success', `Category "${catName}" deleted`);
    } else {
      setCategories(prev => prev.filter(c => c !== catName));
      addToast('success', `Category "${catName}" deleted (Offline)`);
    }
  };

  // Company Branding edits
  const handleBrandingSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (user?.role !== 'Super Admin') return addToast('error', 'Only Super Admin can modify branding');
    const res = await apiCall('/settings/branding', 'PUT', companyBranding);
    if (res) {
      addToast('success', 'Company branding updated!');
    } else {
      addToast('success', 'Company branding updated locally');
    }
  };

  // Filter application
  const applyFilters = (data: any[], type: 'leads' | 'opportunities' | 'emails') => {
    let filtered = [...data];

    // Search query match
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(item => {
        if (type === 'leads') {
          return item.name.toLowerCase().includes(q) || item.company.toLowerCase().includes(q) || item.email.toLowerCase().includes(q);
        } else if (type === 'opportunities') {
          return item.customerName.toLowerCase().includes(q) || item.company.toLowerCase().includes(q) || item.priority.toLowerCase().includes(q);
        } else if (type === 'emails') {
          return item.subject.toLowerCase().includes(q) || item.sender.toLowerCase().includes(q) || item.body.toLowerCase().includes(q);
        }
        return false;
      });
    }

    // Odoo Drawer Filter Logic
    if (activeFilters.myPipeline && user) {
      if (type === 'leads') {
        filtered = filtered.filter(l => l.assignedUser === user?.name);
      } else if (type === 'opportunities') {
        filtered = filtered.filter(o => o.assignedSalesperson === user?.name);
      }
    }
    if (activeFilters.unassigned) {
      if (type === 'leads') {
        filtered = filtered.filter(l => !l.assignedUser || l.assignedUser === 'Unassigned');
      } else if (type === 'opportunities') {
        filtered = filtered.filter(o => !o.assignedSalesperson || o.assignedSalesperson === 'Unassigned');
      }
    }
    if (activeFilters.open) {
      if (type === 'opportunities') {
        filtered = filtered.filter(o => o.stageId !== 'p_6' && o.stageId !== 'p_7');
      }
    }
    if (activeFilters.won) {
      if (type === 'opportunities') {
        filtered = filtered.filter(o => o.stageId === 'p_6');
      }
    }
    if (activeFilters.lost) {
      if (type === 'opportunities') {
        filtered = filtered.filter(o => o.stageId === 'p_7');
      }
    }
    if (activeFilters.category) {
      if (type === 'leads') {
        filtered = filtered.filter(l => l.category === activeFilters.category);
      } else if (type === 'opportunities') {
        filtered = filtered.filter(o => o.tags.includes(activeFilters.category));
      }
    }
    if (activeFilters.serviceType) {
      if (type === 'leads') {
        filtered = filtered.filter(l => l.serviceType === activeFilters.serviceType);
      }
    }
    if (activeFilters.salesperson) {
      if (type === 'leads') {
        filtered = filtered.filter(l => l.assignedUser === activeFilters.salesperson);
      } else if (type === 'opportunities') {
        filtered = filtered.filter(o => o.assignedSalesperson === activeFilters.salesperson);
      }
    }
    if (activeFilters.team) {
      if (type === 'leads' || type === 'opportunities') {
        filtered = filtered.filter(x => x.team === activeFilters.team);
      }
    }
    if (activeFilters.city) {
      if (type === 'leads' || type === 'opportunities') {
        filtered = filtered.filter(x => x.city?.toLowerCase().includes(activeFilters.city.toLowerCase()));
      }
    }
    if (activeFilters.country) {
      if (type === 'leads' || type === 'opportunities') {
        filtered = filtered.filter(x => x.country?.toLowerCase().includes(activeFilters.country.toLowerCase()));
      }
    }
    if (activeFilters.campaign) {
      if (type === 'leads' || type === 'opportunities') {
        filtered = filtered.filter(x => x.campaign === activeFilters.campaign);
      }
    }
    if (activeFilters.source) {
      if (type === 'leads') {
        filtered = filtered.filter(l => l.source === activeFilters.source);
      } else if (type === 'opportunities') {
        filtered = filtered.filter(o => o.source === activeFilters.source || o.tags.includes(activeFilters.source));
      }
    }
    // Date Limit Filters
    if (activeFilters.createdDateStart) {
      filtered = filtered.filter(x => x.createdDate && x.createdDate >= activeFilters.createdDateStart);
    }
    if (activeFilters.createdDateEnd) {
      filtered = filtered.filter(x => x.createdDate && x.createdDate <= activeFilters.createdDateEnd);
    }
    if (activeFilters.expectedClosingStart) {
      if (type === 'opportunities') {
        filtered = filtered.filter(o => o.expectedClosing && o.expectedClosing >= activeFilters.expectedClosingStart);
      }
    }
    if (activeFilters.expectedClosingEnd) {
      if (type === 'opportunities') {
        filtered = filtered.filter(o => o.expectedClosing && o.expectedClosing <= activeFilters.expectedClosingEnd);
      }
    }
    if (activeFilters.closedDateStart) {
      if (type === 'opportunities') {
        filtered = filtered.filter(o => o.closedDate && o.closedDate >= activeFilters.closedDateStart);
      }
    }
    if (activeFilters.closedDateEnd) {
      if (type === 'opportunities') {
        filtered = filtered.filter(o => o.closedDate && o.closedDate <= activeFilters.closedDateEnd);
      }
    }

    return filtered;
  };

  const handleSaveCustomFilter = () => {
    if (!customFilterName) return;
    setCustomFilters(prev => [...prev, customFilterName]);
    addToast('success', `Saved custom filter: ${customFilterName}`);
    setCustomFilterName('');
  };

  const clearAllFilters = () => {
    setActiveFilters({
      myPipeline: false,
      unassigned: false,
      open: false,
      won: false,
      lost: false,
      category: '',
      serviceType: '',
      salesperson: '',
      team: '',
      city: '',
      country: '',
      campaign: '',
      source: '',
      createdDateStart: '',
      createdDateEnd: '',
      expectedClosingStart: '',
      expectedClosingEnd: '',
      closedDateStart: '',
      closedDateEnd: ''
    });
    setSearchQuery('');
    addToast('info', 'Filters cleared');
  };

  // Render Theme Toggle & Class application
  const toggleTheme = () => {
    const nextTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(nextTheme);
    if (nextTheme === 'dark') {
      document.body.classList.add('dark-theme');
    } else {
      document.body.classList.remove('dark-theme');
    }
    addToast('info', `Switched to ${nextTheme} mode`);
  };

  // HTML RENDERS
  // ==========================================

  if (!mounted) {
    return (
      <div className="min-h-screen bg-bg-main flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-xs text-txt-secondary font-semibold">Loading CRM Cloud Session...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <LoginView
        authMode={authMode}
        setAuthMode={setAuthMode}
        authForm={authForm}
        setAuthForm={setAuthForm}
        onSubmit={handleAuthSubmit}
        addToast={addToast}
      />
    );
  }

  // CORE APPLICATION SHELL
  return (
    <div className="flex flex-col min-h-screen bg-bg-main transition-colors duration-300">
      
      {/* Toast Notification Container */}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
        {toasts.map(t => (
          <div
            key={t.id}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg border text-sm text-white ${
              t.type === 'success' ? 'bg-success border-emerald-500' :
              t.type === 'error' ? 'bg-danger border-rose-500' : 'bg-primary border-blue-500'
            }`}
          >
            {t.type === 'success' && <Check className="w-4 h-4" />}
            {t.type === 'error' && <AlertCircle className="w-4 h-4" />}
            {t.type === 'info' && <Info className="w-4 h-4" />}
            <span>{t.message}</span>
          </div>
        ))}
      </div>

      {/* Top Navbar / Odoo-inspired App Switcher Menu */}
      <header className="bg-secondary text-white shadow-md border-b border-slate-800 shrink-0 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-14">
          
          {/* Logo & Platform Title */}
          <div className="flex items-center space-x-4">
            <div className="bg-primary p-2 rounded-xl text-white">
              <Briefcase className="w-5 h-5" />
            </div>
            <span className="font-bold text-lg tracking-tight select-none text-white">
              {companyBranding.logoText}
            </span>
            <span className="bg-slate-800 text-slate-300 border border-slate-700 px-2 py-0.5 rounded text-[10px] uppercase font-semibold">
              {user?.role || 'Guest'}
            </span>
          </div>

          {/* Module Links - Horizontal Navigation replacing Sidebar */}
          <nav className="hidden lg:flex space-x-1">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
              { id: 'leads', label: 'Leads', icon: Users },
              { id: 'opportunities', label: 'Opportunities', icon: ClipboardList },
              { id: 'activities', label: 'Activities', icon: CalendarIcon },
              { id: 'emails', label: 'Emails', icon: Mail },
              { id: 'quotations', label: 'Quotations', icon: FileText },
              { id: 'referral', label: 'Referrals', icon: TrendingUp },
              { id: 'settings', label: 'Settings', icon: SettingsIcon }
            ].map(tab => {
              const Icon = tab.icon;
              // Check role permissions matrix
              if (tab.id === 'settings' && user?.role === 'User') return null;

              return (
                <button
                  key={tab.id}
                  onClick={() => setCurrentTab(tab.id)}
                  className={`flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition ${
                    currentTab === tab.id
                      ? 'bg-primary text-white'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Accessories (Search, Notifications, Profile, Toggle) */}
          <div className="flex items-center space-x-3">
            
            {/* Dark Mode toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl text-slate-400 hover:bg-slate-800 hover:text-white transition"
              title="Toggle Dark Mode"
            >
              {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
            </button>

            {/* Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => {
                  setShowProfileMenu(!showProfileMenu);
                  setShowNotifications(false);
                }}
                className="flex items-center space-x-2 p-1.5 rounded-xl hover:bg-slate-800 transition"
              >
                <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-slate-200 border border-slate-600 font-bold uppercase text-xs">
                  {user?.name ? user.name.substr(0, 2) : 'US'}
                </div>
                <div className="hidden md:block text-left text-xs">
                  <p className="font-semibold leading-none">{user?.name || 'Guest'}</p>
                  <p className="text-slate-400 leading-none mt-0.5 text-[10px]">{user?.company || 'Company'}</p>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {showProfileMenu && (
                <div className="absolute right-0 mt-2 w-56 bg-card border border-border-crm rounded-xl shadow-lg py-1 z-50 text-txt-primary">
                  <div className="px-4 py-3 border-b border-border-crm text-xs">
                    <p className="font-semibold text-txt-primary">{user?.name || 'Guest'}</p>
                    <p className="text-txt-secondary">{user?.email || ''}</p>
                  </div>
                  <div className="px-4 py-2 border-b border-border-crm text-xs font-semibold text-slate-400 uppercase tracking-wide">
                    Switch Test Role:
                  </div>
                  <button
                    onClick={() => { setUser({ ...user, role: 'Super Admin' }); addToast('info', 'Switched context to Super Admin'); }}
                    className="w-full text-left px-4 py-2 text-xs hover:bg-slate-100 flex justify-between items-center"
                  >
                    <span>Super Admin</span>
                    {user?.role === 'Super Admin' && <Check className="w-3.5 h-3.5 text-success" />}
                  </button>
                  <button
                    onClick={() => { setUser({ ...user, role: 'Admin' }); addToast('info', 'Switched context to Admin'); }}
                    className="w-full text-left px-4 py-2 text-xs hover:bg-slate-100 flex justify-between items-center"
                  >
                    <span>Admin</span>
                    {user?.role === 'Admin' && <Check className="w-3.5 h-3.5 text-success" />}
                  </button>
                  <button
                    onClick={() => { setUser({ ...user, role: 'User' }); addToast('info', 'Switched context to User'); }}
                    className="w-full text-left px-4 py-2 text-xs hover:bg-slate-100 flex justify-between items-center"
                  >
                    <span>User</span>
                    {user?.role === 'User' && <Check className="w-3.5 h-3.5 text-success" />}
                  </button>
                  <div className="border-t border-border-crm mt-1"></div>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-xs text-rose-500 hover:bg-slate-100 flex items-center space-x-2"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* ODOO-STYLE CONTROL PANEL */}
      <section className="bg-card border-b border-border-crm shadow-sm sticky top-14 z-30 shrink-0">
        <div className="max-w-7xl mx-auto px-4 py-3 flex flex-col md:flex-row md:items-center justify-between gap-3">
          
          {/* Breadcrumbs & Primary Actions */}
          <div className="flex items-center space-x-4">
            <div className="text-sm font-semibold tracking-tight flex items-center space-x-1">
              <span className="text-txt-secondary select-none">CRM</span>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              <span className="capitalize text-txt-primary">{currentTab}</span>
            </div>

            {/* Action CTAs depending on active module */}
            <div className="flex items-center space-x-2">
              {currentTab === 'leads' && (
                <button
                  onClick={() => setShowLeadCreateModal(true)}
                  className="bg-primary hover:bg-primary-hover text-white text-xs font-semibold px-3 py-1.5 rounded-xl flex items-center space-x-1 shadow transition"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Create Lead</span>
                </button>
              )}
              {currentTab === 'opportunities' && user?.role === 'Super Admin' && (
                <button
                  onClick={() => setShowStageModal(true)}
                  className="bg-primary hover:bg-primary-hover text-white text-xs font-semibold px-3 py-1.5 rounded-xl flex items-center space-x-1 shadow transition"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Stage</span>
                </button>
              )}
              {currentTab === 'activities' && (
                <button
                  onClick={() => setShowActivityModal(true)}
                  className="bg-primary hover:bg-primary-hover text-white text-xs font-semibold px-3 py-1.5 rounded-xl flex items-center space-x-1 shadow transition"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Schedule Activity</span>
                </button>
              )}
              {currentTab === 'quotations' && (
                <button
                  onClick={() => setShowQuoteModal(true)}
                  className="bg-primary hover:bg-primary-hover text-white text-xs font-semibold px-3 py-1.5 rounded-xl flex items-center space-x-1 shadow transition"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>New Quotation</span>
                </button>
              )}
              {currentTab === 'referral' && (
                <button
                  onClick={() => setShowReferralModal(true)}
                  className="bg-primary hover:bg-primary-hover text-white text-xs font-semibold px-3 py-1.5 rounded-xl flex items-center space-x-1 shadow transition"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Submit Referral</span>
                </button>
              )}
            </div>
          </div>

          {/* Search, Group-By, Filters Bar (Odoo Style) */}
          <div className="flex items-center space-x-2 w-full md:w-auto">
            
            {/* Search Input */}
            <div className="relative flex-1 md:w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder={`Search ${currentTab}...`}
                className="w-full bg-bg-main border border-border-crm rounded-xl pl-9 pr-4 py-2 text-xs focus:outline-none focus:border-primary transition text-txt-primary"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>

            {/* Odoo Filter Drawer Trigger */}
            <button
              onClick={() => setShowFilterDrawer(true)}
              className="bg-bg-main border border-border-crm hover:bg-slate-100 rounded-xl px-3 py-2 flex items-center space-x-1.5 text-xs font-semibold text-txt-secondary transition"
              title="Filters & Grouping"
            >
              <Filter className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Filters</span>
              {(activeFilters.myPipeline || activeFilters.unassigned || activeFilters.open || activeFilters.won || activeFilters.lost || activeFilters.category || activeFilters.serviceType || activeFilters.salesperson || activeFilters.team || activeFilters.city || activeFilters.country || activeFilters.campaign || activeFilters.source || activeFilters.createdDateStart || activeFilters.createdDateEnd || activeFilters.expectedClosingStart || activeFilters.expectedClosingEnd || activeFilters.closedDateStart || activeFilters.closedDateEnd) && (
                <span className="w-2 h-2 rounded-full bg-primary inline-block"></span>
              )}
            </button>

            {/* Reset Button */}
            {(searchQuery || activeFilters.myPipeline || activeFilters.unassigned || activeFilters.open || activeFilters.won || activeFilters.lost || activeFilters.category || activeFilters.serviceType || activeFilters.salesperson || activeFilters.team || activeFilters.city || activeFilters.country || activeFilters.campaign || activeFilters.source || activeFilters.createdDateStart || activeFilters.createdDateEnd || activeFilters.expectedClosingStart || activeFilters.expectedClosingEnd || activeFilters.closedDateStart || activeFilters.closedDateEnd) && (
              <button
                onClick={clearAllFilters}
                className="text-xs text-rose-500 hover:underline px-1"
              >
                Clear
              </button>
            )}
          </div>
        </div>
      </section>

      {/* FILTER DRAWER SLIDE-IN (Odoo style advanced filtering panel) */}
      {showFilterDrawer && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* Backdrop */}
          <div onClick={() => setShowFilterDrawer(false)} className="absolute inset-0 bg-black/30 backdrop-blur-xs"></div>
          
          {/* Drawer content */}
          <div className="relative w-80 max-w-full bg-card h-full shadow-2xl border-l border-border-crm p-6 flex flex-col z-10 text-txt-primary">
            <div className="flex items-center justify-between pb-4 border-b border-border-crm">
              <h3 className="font-bold text-sm tracking-tight flex items-center space-x-2">
                <Filter className="w-4 h-4 text-primary" />
                <span>Advanced Search & Filters</span>
              </h3>
              <button onClick={() => setShowFilterDrawer(false)} className="p-1 rounded-lg hover:bg-slate-100">
                <X className="w-4 h-4 text-slate-500" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto py-4 space-y-5 pr-1">
              
              {/* Presets */}
              <div className="space-y-2">
                <h4 className="text-[10px] font-extrabold text-txt-secondary uppercase tracking-wide border-b border-border-crm pb-1">Odoo Status Filters</h4>
                <div className="grid grid-cols-2 gap-1">
                  <label className="flex items-center space-x-1.5 p-1.5 hover:bg-slate-50 rounded-lg cursor-pointer text-xs">
                    <input
                      type="checkbox" className="rounded text-primary border-slate-300 focus:ring-0 w-3.5 h-3.5"
                      checked={activeFilters.myPipeline}
                      onChange={e => setActiveFilters({ ...activeFilters, myPipeline: e.target.checked })}
                    />
                    <span className="truncate">My Pipeline</span>
                  </label>
                  <label className="flex items-center space-x-1.5 p-1.5 hover:bg-slate-50 rounded-lg cursor-pointer text-xs">
                    <input
                      type="checkbox" className="rounded text-primary border-slate-300 focus:ring-0 w-3.5 h-3.5"
                      checked={activeFilters.unassigned}
                      onChange={e => setActiveFilters({ ...activeFilters, unassigned: e.target.checked })}
                    />
                    <span className="truncate">Unassigned</span>
                  </label>
                  <label className="flex items-center space-x-1.5 p-1.5 hover:bg-slate-50 rounded-lg cursor-pointer text-xs">
                    <input
                      type="checkbox" className="rounded text-primary border-slate-300 focus:ring-0 w-3.5 h-3.5"
                      checked={activeFilters.open}
                      onChange={e => setActiveFilters({ ...activeFilters, open: e.target.checked })}
                    />
                    <span className="truncate">Open Deals</span>
                  </label>
                  <label className="flex items-center space-x-1.5 p-1.5 hover:bg-slate-50 rounded-lg cursor-pointer text-xs">
                    <input
                      type="checkbox" className="rounded text-primary border-slate-300 focus:ring-0 w-3.5 h-3.5"
                      checked={activeFilters.won}
                      onChange={e => setActiveFilters({ ...activeFilters, won: e.target.checked })}
                    />
                    <span className="truncate">Won Deals</span>
                  </label>
                  <label className="flex items-center space-x-1.5 p-1.5 hover:bg-slate-50 rounded-lg cursor-pointer text-xs col-span-2">
                    <input
                      type="checkbox" className="rounded text-primary border-slate-300 focus:ring-0 w-3.5 h-3.5"
                      checked={activeFilters.lost}
                      onChange={e => setActiveFilters({ ...activeFilters, lost: e.target.checked })}
                    />
                    <span className="truncate">Lost Deals Only</span>
                  </label>
                </div>
              </div>

              {/* Categorization & Segmentations Dropdowns */}
              <div className="space-y-3">
                <h4 className="text-[10px] font-extrabold text-txt-secondary uppercase tracking-wide border-b border-border-crm pb-1">Segmentations</h4>
                
                <div className="grid grid-cols-1 gap-2.5">
                  <div>
                    <label className="block text-[10px] font-semibold text-slate-400 uppercase mb-0.5">Project Category</label>
                    <select
                      className="w-full border border-border-crm bg-bg-main rounded-xl px-2 py-1.5 text-xs focus:outline-none focus:border-primary text-txt-primary"
                      value={activeFilters.category}
                      onChange={e => setActiveFilters({ ...activeFilters, category: e.target.value })}
                    >
                      <option value="">All Categories</option>
                      {categories.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-semibold text-slate-400 uppercase mb-0.5">Service Type</label>
                    <select
                      className="w-full border border-border-crm bg-bg-main rounded-xl px-2 py-1.5 text-xs focus:outline-none focus:border-primary text-txt-primary"
                      value={activeFilters.serviceType}
                      onChange={e => setActiveFilters({ ...activeFilters, serviceType: e.target.value })}
                    >
                      <option value="">All Service Types</option>
                      <option value="Service Based">Service Based</option>
                      <option value="Product Based">Product Based</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-semibold text-slate-400 uppercase mb-0.5">Assigned Representative</label>
                    <select
                      className="w-full border border-border-crm bg-bg-main rounded-xl px-2 py-1.5 text-xs focus:outline-none focus:border-primary text-txt-primary"
                      value={activeFilters.salesperson}
                      onChange={e => setActiveFilters({ ...activeFilters, salesperson: e.target.value })}
                    >
                      <option value="">All Salespeople</option>
                      <option value="Sarah Connor">Sarah Connor</option>
                      <option value="John Doe (SA)">John Doe (SA)</option>
                      <option value="Kyle Reese">Kyle Reese</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-semibold text-slate-400 uppercase mb-0.5">Sales Team</label>
                    <select
                      className="w-full border border-border-crm bg-bg-main rounded-xl px-2 py-1.5 text-xs focus:outline-none focus:border-primary text-txt-primary"
                      value={activeFilters.team}
                      onChange={e => setActiveFilters({ ...activeFilters, team: e.target.value })}
                    >
                      <option value="">All Teams</option>
                      <option value="Sales Team Alpha">Sales Team Alpha</option>
                      <option value="Sales Team Beta">Sales Team Beta</option>
                      <option value="Enterprise Core">Enterprise Core</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-semibold text-slate-400 uppercase mb-0.5">Campaign</label>
                    <select
                      className="w-full border border-border-crm bg-bg-main rounded-xl px-2 py-1.5 text-xs focus:outline-none focus:border-primary text-txt-primary"
                      value={activeFilters.campaign}
                      onChange={e => setActiveFilters({ ...activeFilters, campaign: e.target.value })}
                    >
                      <option value="">All Campaigns</option>
                      <option value="Tech Expo 2026">Tech Expo 2026</option>
                      <option value="Summer Cloud Promo">Summer Cloud Promo</option>
                      <option value="AI Promo">AI Promo</option>
                      <option value="None">Direct / None</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-semibold text-slate-400 uppercase mb-0.5">Source / Medium</label>
                    <select
                      className="w-full border border-border-crm bg-bg-main rounded-xl px-2 py-1.5 text-xs focus:outline-none focus:border-primary text-txt-primary"
                      value={activeFilters.source}
                      onChange={e => setActiveFilters({ ...activeFilters, source: e.target.value })}
                    >
                      <option value="">All Sources</option>
                      <option value="Website">Website</option>
                      <option value="Referral">Referral</option>
                      <option value="Campaign">Campaign</option>
                      <option value="Manual Entry">Manual Entry</option>
                      <option value="Email">Email</option>
                      <option value="Excel Import">Excel Import</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[10px] font-semibold text-slate-400 uppercase mb-0.5">City</label>
                      <input
                        type="text" placeholder="e.g. Detroit"
                        className="w-full border border-border-crm bg-bg-main rounded-xl px-2 py-1 text-xs focus:outline-none text-txt-primary"
                        value={activeFilters.city}
                        onChange={e => setActiveFilters({ ...activeFilters, city: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-semibold text-slate-400 uppercase mb-0.5">Country</label>
                      <input
                        type="text" placeholder="e.g. France"
                        className="w-full border border-border-crm bg-bg-main rounded-xl px-2 py-1 text-xs focus:outline-none text-txt-primary"
                        value={activeFilters.country}
                        onChange={e => setActiveFilters({ ...activeFilters, country: e.target.value })}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Date Ranges Filters */}
              <div className="space-y-3">
                <h4 className="text-[10px] font-extrabold text-txt-secondary uppercase tracking-wide border-b border-border-crm pb-1">Date Ranges</h4>
                
                <div className="space-y-2">
                  <div>
                    <label className="block text-[10px] font-semibold text-slate-400 uppercase mb-0.5">Creation Date Range</label>
                    <div className="flex gap-1.5 items-center">
                      <input
                        type="date" className="w-full border border-border-crm bg-bg-main rounded-xl p-1 text-[10px] focus:outline-none text-txt-primary"
                        value={activeFilters.createdDateStart}
                        onChange={e => setActiveFilters({ ...activeFilters, createdDateStart: e.target.value })}
                      />
                      <span className="text-slate-400 text-[10px]">to</span>
                      <input
                        type="date" className="w-full border border-border-crm bg-bg-main rounded-xl p-1 text-[10px] focus:outline-none text-txt-primary"
                        value={activeFilters.createdDateEnd}
                        onChange={e => setActiveFilters({ ...activeFilters, createdDateEnd: e.target.value })}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-semibold text-slate-400 uppercase mb-0.5">Expected Closing Range</label>
                    <div className="flex gap-1.5 items-center">
                      <input
                        type="date" className="w-full border border-border-crm bg-bg-main rounded-xl p-1 text-[10px] focus:outline-none text-txt-primary"
                        value={activeFilters.expectedClosingStart}
                        onChange={e => setActiveFilters({ ...activeFilters, expectedClosingStart: e.target.value })}
                      />
                      <span className="text-slate-400 text-[10px]">to</span>
                      <input
                        type="date" className="w-full border border-border-crm bg-bg-main rounded-xl p-1 text-[10px] focus:outline-none text-txt-primary"
                        value={activeFilters.expectedClosingEnd}
                        onChange={e => setActiveFilters({ ...activeFilters, expectedClosingEnd: e.target.value })}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-semibold text-slate-400 uppercase mb-0.5">Closed Date Range</label>
                    <div className="flex gap-1.5 items-center">
                      <input
                        type="date" className="w-full border border-border-crm bg-bg-main rounded-xl p-1 text-[10px] focus:outline-none text-txt-primary"
                        value={activeFilters.closedDateStart}
                        onChange={e => setActiveFilters({ ...activeFilters, closedDateStart: e.target.value })}
                      />
                      <span className="text-slate-400 text-[10px]">to</span>
                      <input
                        type="date" className="w-full border border-border-crm bg-bg-main rounded-xl p-1 text-[10px] focus:outline-none text-txt-primary"
                        value={activeFilters.closedDateEnd}
                        onChange={e => setActiveFilters({ ...activeFilters, closedDateEnd: e.target.value })}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Favorites / Custom Filter Saved */}
              <div className="pt-3 border-t border-border-crm space-y-2">
                <h4 className="text-[10px] font-extrabold text-txt-secondary uppercase tracking-wide">Save Custom Filter</h4>
                <div className="flex gap-2">
                  <input
                    type="text" placeholder="e.g. Q3 Pipeline"
                    className="flex-1 border border-border-crm bg-bg-main rounded-xl px-2 py-1.5 text-xs focus:outline-none text-txt-primary"
                    value={customFilterName}
                    onChange={e => setCustomFilterName(e.target.value)}
                  />
                  <button
                    onClick={handleSaveCustomFilter}
                    className="bg-primary hover:bg-primary-hover text-white rounded-xl px-3 py-1.5 text-xs font-semibold transition"
                  >
                    Save
                  </button>
                </div>
                
                {customFilters.length > 0 && (
                  <div className="pt-1.5">
                    <p className="text-[9px] text-txt-secondary uppercase font-semibold">Favorites</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {customFilters.map((cf, i) => (
                        <span key={i} className="bg-blue-50 text-primary border border-blue-100 rounded-lg px-2 py-0.5 text-[10px] select-none font-semibold">
                          {cf}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

            </div>

            <div className="border-t border-border-crm pt-4 flex gap-2">
              <button
                onClick={clearAllFilters}
                className="flex-1 border border-border-crm hover:bg-slate-50 text-txt-primary py-2.5 rounded-xl text-xs font-semibold transition"
              >
                Reset All
              </button>
              <button
                onClick={() => setShowFilterDrawer(false)}
                className="flex-1 bg-primary hover:bg-primary-hover text-white py-2.5 rounded-xl text-xs font-semibold transition shadow"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CORE CONTENT LAYOUT */}
      <main className="flex-1 overflow-y-auto max-w-7xl w-full mx-auto p-4 shrink-0">
        {currentTab === 'dashboard' && (
          <DashboardView
            leads={leads}
            opportunities={opportunities}
            activities={activities}
            onToggleActivityDone={toggleActivityDone}
          />
        )}

        {currentTab === 'leads' && (
          <LeadsView
            leads={leads}
            categories={categories}
            user={user}
            searchQuery={searchQuery}
            activeFilters={activeFilters}
            onConvertLead={handleConvertLeadFromView}
            onDeleteLead={handleDeleteLeadFromView}
            onCreateLead={handleCreateLeadFromView}
            onUpdateLead={handleUpdateLeadFromView}
            showLeadCreateModal={showLeadCreateModal}
            setShowLeadCreateModal={setShowLeadCreateModal}
            applyFilters={applyFilters}
          />
        )}

        {currentTab === 'opportunities' && (
          <OpportunitiesView
            opportunities={opportunities}
            pipelines={pipelines}
            user={user}
            searchQuery={searchQuery}
            activeFilters={activeFilters}
            onMoveOpportunity={handleMoveOpportunity}
            onAddStage={handleAddStage}
            onReorderStage={handleStageReorder}
            onDeleteStage={handleStageDelete}
            applyFilters={applyFilters}
            showStageModal={showStageModal}
            setShowStageModal={setShowStageModal}
            addToast={addToast}
          />
        )}

        {currentTab === 'activities' && (
          <ActivitiesView
            activities={activities}
            user={user}
            onToggleActivityDone={toggleActivityDone}
            onScheduleActivity={handleActivityCreate}
            showActivityModal={showActivityModal}
            setShowActivityModal={setShowActivityModal}
          />
        )}

        {currentTab === 'emails' && (
          <EmailsView
            emails={emails}
            user={user}
            searchQuery={searchQuery}
            onSendReply={handleSendEmail}
            applyFilters={applyFilters}
          />
        )}

        {currentTab === 'quotations' && (
          <QuotationsView
            quotations={quotations}
            opportunities={opportunities}
            showQuoteModal={showQuoteModal}
            setShowQuoteModal={setShowQuoteModal}
            onCreateQuotation={handleQuotationCreate}
            onApproveReject={updateQuoteStatus}
            companyBranding={companyBranding}
          />
        )}

        {currentTab === 'referral' && (
          <ReferralsView
            referrals={referrals}
            opportunities={opportunities}
            referralPipelines={referralPipelines}
            user={user}
            showReferralModal={showReferralModal}
            setShowReferralModal={setShowReferralModal}
            referralForm={referralForm}
            setReferralForm={setReferralForm}
            onSubmitReferral={handleReferralCreate}
            onApproveReward={handleApproveReward}
          />
        )}

        {currentTab === 'settings' && (
          <SettingsView
            companyBranding={companyBranding}
            setCompanyBranding={setCompanyBranding}
            categories={categories}
            settingsUsers={settingsUsers}
            auditLogs={auditLogs}
            user={user}
            onSaveBranding={handleBrandingSave}
            onAddCategory={handleAddCategory}
            onDeleteCategory={handleDeleteCategory}
            onDeleteUser={handleDeleteUser}
          />
        )}
      </main>
      
      {/* Footer Branding */}
      <footer className="bg-card border-t border-border-crm text-center py-4 text-[10px] text-txt-secondary shrink-0">
        <p>© 2026 {companyBranding.name}. All rights reserved. Powered by Next.js, Express & Tailwind CSS.</p>
      </footer>
    </div>
  );
}
