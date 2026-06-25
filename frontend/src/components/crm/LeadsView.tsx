import React, { useState } from 'react';
import { Trash2, X, Plus } from 'lucide-react';

interface LeadsViewProps {
  leads: any[];
  categories: string[];
  user: any;
  searchQuery: string;
  activeFilters: any;
  onConvertLead: (leadId: string, dealValue: string, salesperson: string) => void;
  onDeleteLead: (leadId: string) => void;
  onCreateLead: (leadForm: any) => void;
  onUpdateLead: (leadId: string, leadData: any) => void;
  showLeadCreateModal: boolean;
  setShowLeadCreateModal: (show: boolean) => void;
  applyFilters: (data: any[], type: 'leads' | 'opportunities' | 'emails') => any[];
}

export default function LeadsView({
  leads,
  categories,
  user,
  searchQuery,
  activeFilters,
  onConvertLead,
  onDeleteLead,
  onCreateLead,
  onUpdateLead,
  showLeadCreateModal,
  setShowLeadCreateModal,
  applyFilters
}: LeadsViewProps) {
  const [selectedLead, setSelectedLead] = useState<any>(null);
  const [showLeadDrawer, setShowLeadDrawer] = useState(false);
  const [convertLeadId, setConvertLeadId] = useState<string | null>(null);
  const [convertForm, setConvertForm] = useState({ dealValue: '15000', salesperson: '' });
  
  const [leadForm, setLeadForm] = useState({
    name: '', company: '', email: '', phone: '', source: 'Website',
    serviceType: 'Service Based', category: 'Healthcare', assignedUser: '', notes: ''
  });

  const handleLeadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCreateLead(leadForm);
    setLeadForm({
      name: '', company: '', email: '', phone: '', source: 'Website',
      serviceType: 'Service Based', category: 'Healthcare', assignedUser: '', notes: ''
    });
  };

  const handleConvertSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (convertLeadId) {
      onConvertLead(convertLeadId, convertForm.dealValue, convertForm.salesperson);
      setConvertLeadId(null);
      setShowLeadDrawer(false);
    }
  };

  const filteredLeads = applyFilters(leads, 'leads');

  return (
    <div className="bg-card border border-border-crm rounded-2xl shadow-xs overflow-hidden text-xs">
      
     
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-bg-main border-b border-border-crm text-xs font-bold text-txt-secondary uppercase tracking-wider select-none">
              <th className="px-6 py-4">Lead Contact</th>
              <th className="px-6 py-4">Company</th>
              <th className="px-6 py-4">Source</th>
              <th className="px-6 py-4">Category</th>
              <th className="px-6 py-4">Service Type</th>
              <th className="px-6 py-4">Assigned User</th>
              <th className="px-6 py-4">Created Date</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-crm text-xs">
            {filteredLeads.map(ld => (
              <tr
                key={ld.id}
                onClick={() => { setSelectedLead(ld); setShowLeadDrawer(true); }}
                className="hover:bg-slate-50 transition cursor-pointer text-txt-primary"
              >
                <td className="px-6 py-4">
                  <div className="font-semibold text-txt-primary">{ld.name}</div>
                  <div className="text-[10px] text-txt-secondary">{ld.email}</div>
                </td>
                <td className="px-6 py-4 font-medium">{ld.company}</td>
                <td className="px-6 py-4">
                  <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-[10px] font-semibold border border-slate-200">
                    {ld.source}
                  </span>
                </td>
                <td className="px-6 py-4 font-semibold text-primary">{ld.category}</td>
                <td className="px-6 py-4 text-txt-secondary">{ld.serviceType}</td>
                <td className="px-6 py-4 font-medium">{ld.assignedUser || 'Unassigned'}</td>
                <td className="px-6 py-4 text-txt-secondary">{ld.createdDate}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                    ld.status === 'New' ? 'bg-blue-50 border-blue-200 text-primary' :
                    ld.status === 'Contacted' ? 'bg-amber-50 border-amber-200 text-warning' :
                    'bg-emerald-50 border-emerald-200 text-success'
                  }`}>
                    {ld.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right" onClick={e => e.stopPropagation()}>
                  <button
                    onClick={() => onDeleteLead(ld.id)}
                    className="text-slate-400 hover:text-rose-500 p-1 transition cursor-pointer"
                    title="Delete Lead"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
            {filteredLeads.length === 0 && (
              <tr>
                <td colSpan={9} className="text-center py-12 text-slate-400">
                  No leads found matching current filter query.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Sliding Lead Detail Drawer */}
      {showLeadDrawer && selectedLead && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div onClick={() => setShowLeadDrawer(false)} className="absolute inset-0 bg-black/30 backdrop-blur-xs"></div>
          <div className="relative w-120 max-w-full bg-card h-full shadow-2xl border-l border-border-crm p-6 flex flex-col z-10 text-txt-primary">
            
            <div className="flex justify-between items-center pb-4 border-b border-border-crm shrink-0">
              <h3 className="font-bold text-sm tracking-tight text-txt-primary">Lead Detailed Timeline</h3>
              <button onClick={() => setShowLeadDrawer(false)} className="p-1 rounded-lg hover:bg-slate-100 cursor-pointer">
                <X className="w-4 h-4 text-slate-400" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto py-4 space-y-6">
              
              {/* Header profile details */}
              <div className="bg-slate-50 border border-slate-150 rounded-xl p-4 space-y-1">
                <h4 className="text-base font-bold text-txt-primary">{selectedLead.name}</h4>
                <p className="text-xs text-txt-secondary">{selectedLead.company}</p>
                <div className="flex flex-wrap gap-1 mt-2">
                  <span className="bg-blue-50 text-primary border border-blue-100 text-[10px] px-2 py-0.5 rounded font-semibold">{selectedLead.category}</span>
                  <span className="bg-slate-100 text-slate-700 border border-slate-200 text-[10px] px-2 py-0.5 rounded font-semibold">{selectedLead.source}</span>
                </div>
              </div>

              {/* Contact stats */}
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <p className="text-slate-400 font-semibold uppercase text-[10px]">Email</p>
                  <p className="font-medium text-txt-primary mt-0.5 truncate">{selectedLead.email}</p>
                </div>
                <div>
                  <p className="text-slate-400 font-semibold uppercase text-[10px]">Phone</p>
                  <p className="font-medium text-txt-primary mt-0.5">{selectedLead.phone}</p>
                </div>
                <div>
                  <p className="text-slate-400 font-semibold uppercase text-[10px]">Assigned Representative</p>
                  <p className="font-medium text-txt-primary mt-0.5">{selectedLead.assignedUser || 'Unassigned'}</p>
                </div>
                <div>
                  <p className="text-slate-400 font-semibold uppercase text-[10px]">Service Type</p>
                  <p className="font-medium text-txt-primary mt-0.5">{selectedLead.serviceType}</p>
                </div>
              </div>

              {/* Internal Notes editor */}
              <div className="space-y-2">
                <p className="text-slate-400 font-semibold uppercase text-[10px]">Internal Notes & Comments</p>
                <textarea
                  className="w-full border border-border-crm bg-bg-main rounded-xl p-3 text-xs focus:outline-none focus:border-primary text-txt-primary h-24 resize-none"
                  value={selectedLead.notes || ''}
                  onChange={(e) => {
                    const updated = { ...selectedLead, notes: e.target.value };
                    setSelectedLead(updated);
                    onUpdateLead(selectedLead.id, { notes: e.target.value });
                  }}
                  placeholder="Write detailed CRM internal logs..."
                />
              </div>

            </div>

            <div className="border-t border-border-crm pt-4 flex gap-2 shrink-0">
              <button
                onClick={() => {
                  const status = selectedLead.status === 'New' ? 'Contacted' : 'Qualified';
                  onUpdateLead(selectedLead.id, { status });
                  setSelectedLead({ ...selectedLead, status });
                }}
                className="flex-1 border border-border-crm hover:bg-slate-50 text-txt-primary py-2.5 rounded-xl text-xs font-semibold transition cursor-pointer"
              >
                Advance Status
              </button>
              
              <button
                onClick={() => setConvertLeadId(selectedLead.id)}
                className="flex-1 bg-success hover:bg-emerald-600 text-white py-2.5 rounded-xl text-xs font-semibold transition shadow cursor-pointer"
              >
                Convert to Opportunity
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Convert Lead Modal */}
      {convertLeadId && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-card border border-border-crm rounded-2xl shadow-2xl p-6 max-w-sm w-full text-txt-primary">
            <h4 className="font-bold text-sm tracking-tight mb-4">Convert to Sales Pipeline Opportunity</h4>
            <form onSubmit={handleConvertSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 font-semibold mb-1">Expected Deal Value ($)</label>
                <input
                  type="number" required
                  className="w-full border border-border-crm bg-bg-main rounded-xl px-3 py-2 text-txt-primary focus:outline-none"
                  value={convertForm.dealValue}
                  onChange={e => setConvertForm({ ...convertForm, dealValue: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-slate-400 font-semibold mb-1">Salesperson</label>
                <select
                  className="w-full border border-border-crm bg-bg-main rounded-xl px-3 py-2 text-txt-primary focus:outline-none"
                  value={convertForm.salesperson}
                  onChange={e => setConvertForm({ ...convertForm, salesperson: e.target.value })}
                >
                  <option value="">Select salesperson</option>
                  <option value="Sarah Connor">Sarah Connor</option>
                  <option value="John Doe (SA)">John Doe (SA)</option>
                  <option value="Kyle Reese">Kyle Reese</option>
                </select>
              </div>

              <div className="flex gap-2 pt-4">
                <button
                  type="button" onClick={() => setConvertLeadId(null)}
                  className="flex-1 border border-border-crm hover:bg-slate-50 rounded-xl py-2 font-semibold text-txt-primary cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-success hover:bg-emerald-600 text-white rounded-xl py-2 font-semibold shadow cursor-pointer"
                >
                  Confirm Convert
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Create Lead Modal */}
      {showLeadCreateModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-card border border-border-crm rounded-2xl shadow-2xl p-6 max-w-md w-full text-txt-primary">
            <h4 className="font-bold text-sm tracking-tight mb-4 font-extrabold">Create Enterprise Lead CRM Prospect</h4>
            <form onSubmit={handleLeadSubmit} className="grid grid-cols-2 gap-3 text-xs">
              <div className="col-span-2">
                <label className="block text-slate-400 font-semibold mb-1">Contact Name</label>
                <input
                  type="text" required
                  className="w-full border border-border-crm bg-bg-main rounded-xl px-3 py-2 text-txt-primary bg-white"
                  value={leadForm.name}
                  onChange={e => setLeadForm({ ...leadForm, name: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-slate-400 font-semibold mb-1">Company</label>
                <input
                  type="text" required
                  className="w-full border border-border-crm bg-bg-main rounded-xl px-3 py-2 text-txt-primary bg-white"
                  value={leadForm.company}
                  onChange={e => setLeadForm({ ...leadForm, company: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-slate-400 font-semibold mb-1">Source</label>
                <select
                  className="w-full border border-border-crm bg-bg-main rounded-xl px-3 py-2 text-txt-primary bg-white"
                  value={leadForm.source}
                  onChange={e => setLeadForm({ ...leadForm, source: e.target.value })}
                >
                  <option value="Website">Website</option>
                  <option value="Manual Entry">Manual Entry</option>
                  <option value="Excel Import">Excel Import</option>
                  <option value="Referral">Referral</option>
                  <option value="Campaign">Campaign</option>
                  <option value="Email">Email</option>
                </select>
              </div>
              <div>
                <label className="block text-slate-400 font-semibold mb-1">Email</label>
                <input
                  type="email" required
                  className="w-full border border-border-crm bg-bg-main rounded-xl px-3 py-2 text-txt-primary bg-white"
                  value={leadForm.email}
                  onChange={e => setLeadForm({ ...leadForm, email: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-slate-400 font-semibold mb-1">Phone</label>
                <input
                  type="text" required
                  className="w-full border border-border-crm bg-bg-main rounded-xl px-3 py-2 text-txt-primary bg-white"
                  value={leadForm.phone}
                  onChange={e => setLeadForm({ ...leadForm, phone: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-slate-400 font-semibold mb-1">Category</label>
                <select
                  className="w-full border border-border-crm bg-bg-main rounded-xl px-3 py-2 text-txt-primary bg-white"
                  value={leadForm.category}
                  onChange={e => setLeadForm({ ...leadForm, category: e.target.value })}
                >
                  {categories.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-slate-400 font-semibold mb-1">Service Type</label>
                <select
                  className="w-full border border-border-crm bg-bg-main rounded-xl px-3 py-2 text-txt-primary bg-white"
                  value={leadForm.serviceType}
                  onChange={e => setLeadForm({ ...leadForm, serviceType: e.target.value })}
                >
                  <option value="Service Based">Service Based</option>
                  <option value="Product Based">Product Based</option>
                </select>
              </div>

              <div className="col-span-2 flex gap-2 pt-4">
                <button
                  type="button" onClick={() => setShowLeadCreateModal(false)}
                  className="flex-1 border border-border-crm hover:bg-slate-50 rounded-xl py-2.5 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-primary hover:bg-primary-hover text-white rounded-xl py-2.5 font-semibold shadow cursor-pointer"
                >
                  Save Lead
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
