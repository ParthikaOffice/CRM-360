import React, { useState } from 'react';
import { Check, X, Trash2 } from 'lucide-react';

interface SettingsViewProps {
  companyBranding: any;
  setCompanyBranding: (branding: any) => void;
  categories: string[];
  settingsUsers: any[];
  auditLogs: any[];
  user: any;
  onSaveBranding: (e: React.FormEvent) => void;
  onAddCategory: (name: string) => void;
  onDeleteCategory: (name: string) => void;
  onDeleteUser: (id: string) => void;
}

export default function SettingsView({
  companyBranding,
  setCompanyBranding,
  categories,
  settingsUsers,
  auditLogs,
  user,
  onSaveBranding,
  onAddCategory,
  onDeleteCategory,
  onDeleteUser
}: SettingsViewProps) {
  const [newCategoryName, setNewCategoryName] = useState('');

  const handleAddCategorySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newCategoryName.trim()) {
      onAddCategory(newCategoryName.trim());
      setNewCategoryName('');
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 text-xs text-slate-800 dark:text-slate-200">
      
      {/* Column 1: Config Branding & Categories */}
      <div className="space-y-6">
        
        {/* Branding Configuration */}
        <div className="bg-card border border-border-crm rounded-2xl p-5 space-y-4">
          <h4 className="font-bold text-xs uppercase tracking-wider text-txt-secondary">Company Branding</h4>
          <form onSubmit={onSaveBranding} className="space-y-3">
            <div>
              <label className="block text-slate-400 font-semibold mb-1">Company Name</label>
              <input
                type="text"
                className="w-full border border-border-crm bg-bg-main rounded-xl px-3 py-2 text-txt-primary bg-white dark:bg-slate-800"
                value={companyBranding.name}
                onChange={e => setCompanyBranding({ ...companyBranding, name: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-slate-400 font-semibold mb-1">Navbar Logo text</label>
              <input
                type="text"
                className="w-full border border-border-crm bg-bg-main rounded-xl px-3 py-2 text-txt-primary bg-white dark:bg-slate-800"
                value={companyBranding.logoText}
                onChange={e => setCompanyBranding({ ...companyBranding, logoText: e.target.value })}
              />
            </div>
            <button
              type="submit"
              className="w-full bg-primary hover:bg-primary-hover text-white rounded-xl py-2 font-semibold shadow cursor-pointer"
            >
              Save Changes
            </button>
          </form>
        </div>

        {/* Project Categories */}
        <div className="bg-card border border-border-crm rounded-2xl p-5 space-y-4">
          <h4 className="font-bold text-xs uppercase tracking-wider text-txt-secondary">Project Categories</h4>
          <form onSubmit={handleAddCategorySubmit} className="flex gap-2">
            <input
              type="text" required placeholder="Add Healthcare..."
              className="flex-grow border border-border-crm bg-bg-main rounded-xl px-3 py-2 text-txt-primary focus:outline-none bg-white dark:bg-slate-800"
              value={newCategoryName}
              onChange={e => setNewCategoryName(e.target.value)}
            />
            <button
              type="submit"
              className="bg-primary hover:bg-primary-hover text-white rounded-xl px-3 py-2 font-semibold shadow cursor-pointer"
            >
              Add
            </button>
          </form>
          <div className="flex flex-wrap gap-1 mt-3">
            {categories.map(cat => (
              <span
                key={cat}
                className="bg-slate-50 border border-slate-200 dark:bg-slate-800 dark:border-slate-700 text-txt-primary rounded-xl px-2 py-1 flex items-center space-x-1"
              >
                <span>{cat}</span>
                <button type="button" onClick={() => onDeleteCategory(cat)} className="text-rose-500 hover:text-rose-700 cursor-pointer">
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        </div>

      </div>

      {/* Column 2: User management & Permissions Matrix */}
      <div className="lg:col-span-2 space-y-6">
        
        {/* User management list */}
        <div className="bg-card border border-border-crm rounded-2xl p-5 space-y-4">
          <h4 className="font-bold text-xs uppercase tracking-wider text-txt-secondary">User Management Accounts</h4>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-border-crm text-[10px] text-slate-400 font-bold uppercase">
                  <th className="py-2">User Name</th>
                  <th className="py-2">Email</th>
                  <th className="py-2">Role Scope</th>
                  <th className="py-2 text-right">Delete</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-crm">
                {settingsUsers.map(usr => (
                  <tr key={usr.id} className="text-txt-primary">
                    <td className="py-2.5 font-bold">{usr.name}</td>
                    <td className="py-2.5 text-txt-secondary">{usr.email}</td>
                    <td className="py-2.5">
                      <span className="bg-blue-50 text-primary border border-blue-100 rounded px-1.5 py-0.5 text-[9px] font-semibold dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800">
                        {usr.role}
                      </span>
                    </td>
                    <td className="py-2.5 text-right">
                      <button
                        onClick={() => onDeleteUser(usr.id)}
                        className="text-rose-500 hover:text-rose-700 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={usr.id === 'u_1'} // cannot delete root SA
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Permissions Matrix */}
        <div className="bg-card border border-border-crm rounded-2xl p-5 space-y-4">
          <h4 className="font-bold text-xs uppercase tracking-wider text-txt-secondary">Role Permissions Access Matrix</h4>
          <div className="overflow-x-auto text-[10px]">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border-crm text-slate-400 font-bold uppercase">
                  <th className="py-2">Permission Access Scope</th>
                  <th className="py-2">Super Admin</th>
                  <th className="py-2">Admin</th>
                  <th className="py-2">Standard User</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-crm text-txt-primary">
                {[
                  { perm: 'Full System Control Panel Settings', sa: true, ad: false, us: false },
                  { perm: 'Create, Edit, Delete Pipelines/Stages', sa: true, ad: false, us: false },
                  { perm: 'Create and Manage User Accounts', sa: true, ad: true, us: false },
                  { perm: 'Access Assigned Opportunities Leads', sa: true, ad: true, us: true },
                  { perm: 'Referral Rewards Approval', sa: true, ad: false, us: false }
                ].map((pm, i) => (
                  <tr key={i}>
                    <td className="py-2.5 font-semibold text-txt-primary">{pm.perm}</td>
                    <td className="py-2.5">{pm.sa ? <Check className="w-4 h-4 text-success" /> : <X className="w-4 h-4 text-danger" />}</td>
                    <td className="py-2.5">{pm.ad ? <Check className="w-4 h-4 text-success" /> : <X className="w-4 h-4 text-danger" />}</td>
                    <td className="py-2.5">{pm.us ? <Check className="w-4 h-4 text-success" /> : <X className="w-4 h-4 text-danger" />}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Audit Logs */}
        <div className="bg-card border border-border-crm rounded-2xl p-5 space-y-4">
          <h4 className="font-bold text-xs uppercase tracking-wider text-txt-secondary">Real-Time Audit System Logs</h4>
          <div className="max-h-60 overflow-y-auto divide-y divide-border-crm">
            {auditLogs.map((log) => (
              <div key={log.id} className="py-2.5 space-y-0.5 text-[10px]">
                <div className="flex justify-between font-bold">
                  <span className="text-primary dark:text-blue-400">{log.action} ({log.module})</span>
                  <span className="text-slate-400 font-medium">{new Date(log.timestamp).toLocaleTimeString()}</span>
                </div>
                <p className="text-txt-secondary leading-relaxed">{log.details}</p>
                <div className="text-slate-400">By: {log.user} ({log.role})</div>
              </div>
            ))}
            {auditLogs.length === 0 && (
              <div className="text-center py-6 text-slate-400">No logs available.</div>
            )}
          </div>
        </div>

      </div>

    </div>
  );
}
