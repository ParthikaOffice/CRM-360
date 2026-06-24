import React, { useState } from 'react';
import { Plus, X } from 'lucide-react';

interface QuotationsViewProps {
  quotations: any[];
  opportunities: any[];
  onApproveReject: (quoteId: string, status: string) => void;
  onCreateQuotation: (quoteForm: any) => void;
  showQuoteModal: boolean;
  setShowQuoteModal: (show: boolean) => void;
  companyBranding: any;
}

export default function QuotationsView({
  quotations,
  opportunities,
  onApproveReject,
  onCreateQuotation,
  showQuoteModal,
  setShowQuoteModal,
  companyBranding
}: QuotationsViewProps) {
  const [selectedQuote, setSelectedQuote] = useState<any>(null);
  
  const [quoteForm, setQuoteForm] = useState({
    clientName: '', company: '', taxRate: '8', discount: '0', opportunityId: '',
    items: [{ description: '', qty: 1, price: 0 }]
  });

  const handleQuoteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCreateQuotation(quoteForm);
    setQuoteForm({
      clientName: '', company: '', taxRate: '8', discount: '0', opportunityId: '',
      items: [{ description: '', qty: 1, price: 0 }]
    });
  };

  return (
    <div className="bg-card border border-border-crm rounded-2xl shadow-xs overflow-hidden text-xs">
      
      {/* Quotations List */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-bg-main border-b border-border-crm text-xs font-bold text-txt-secondary uppercase tracking-wider">
              <th className="px-6 py-4">Quote Number</th>
              <th className="px-6 py-4">Client Name</th>
              <th className="px-6 py-4">Company</th>
              <th className="px-6 py-4">Date Created</th>
              <th className="px-6 py-4 text-right">Grand Total</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-crm">
            {quotations.map(quote => (
              <tr
                key={quote.id}
                onClick={() => { setSelectedQuote(quote); }}
                className="hover:bg-slate-50 transition cursor-pointer text-txt-primary"
              >
                <td className="px-6 py-4 font-bold text-primary">{quote.quoteNumber}</td>
                <td className="px-6 py-4 font-semibold">{quote.clientName}</td>
                <td className="px-6 py-4 font-medium text-txt-secondary">{quote.company}</td>
                <td className="px-6 py-4 text-txt-secondary">{quote.date}</td>
                <td className="px-6 py-4 text-right font-extrabold text-txt-primary">${quote.grandTotal.toLocaleString()}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                    quote.status === 'Approved' ? 'bg-emerald-50 border-emerald-200 text-success' :
                    quote.status === 'Rejected' ? 'bg-rose-50 border-rose-200 text-danger' :
                    'bg-slate-50 border-slate-200 text-slate-400'
                  }`}>
                    {quote.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right" onClick={e => e.stopPropagation()}>
                  <div className="flex items-center justify-end space-x-1.5">
                    <button
                      onClick={() => {
                        onApproveReject(quote.id, 'Approved');
                        if (selectedQuote && selectedQuote.id === quote.id) {
                          setSelectedQuote({ ...selectedQuote, status: 'Approved' });
                        }
                      }}
                      className="bg-emerald-50 text-success border border-emerald-100 hover:bg-emerald-100 px-2 py-1 rounded font-bold cursor-pointer"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => {
                        onApproveReject(quote.id, 'Rejected');
                        if (selectedQuote && selectedQuote.id === quote.id) {
                          setSelectedQuote({ ...selectedQuote, status: 'Rejected' });
                        }
                      }}
                      className="bg-rose-50 text-danger border border-rose-100 hover:bg-rose-100 px-2 py-1 rounded font-bold cursor-pointer"
                    >
                      Reject
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {quotations.length === 0 && (
              <tr>
                <td colSpan={7} className="text-center py-12 text-slate-400">No quotations generated yet.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Selected Quotation Details (Invoice view) */}
      {selectedQuote && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-card border border-border-crm rounded-2xl shadow-2xl p-6 max-w-2xl w-full text-txt-primary flex flex-col max-h-160">
            
            {/* Invoice Header */}
            <div className="flex justify-between items-start pb-4 border-b border-border-crm shrink-0">
              <div>
                <h4 className="font-extrabold text-base text-primary">{selectedQuote.quoteNumber}</h4>
                <p className="text-slate-400">Invoice Created: {selectedQuote.date}</p>
              </div>
              <div className="text-right">
                <h4 className="font-bold text-sm">{companyBranding.name}</h4>
                <p className="text-slate-400">ERP CRM Cloud Solutions</p>
              </div>
            </div>

            {/* Client / Project info */}
            <div className="grid grid-cols-2 gap-4 py-4 border-b border-border-crm text-xs shrink-0">
              <div>
                <p className="font-semibold text-slate-400 uppercase text-[10px]">Client Information</p>
                <p className="font-bold text-txt-primary mt-1">{selectedQuote.clientName}</p>
                <p className="text-txt-secondary mt-0.5">{selectedQuote.company}</p>
              </div>
              <div className="text-right">
                <p className="font-semibold text-slate-400 uppercase text-[10px]">Quotation Status</p>
                <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold border inline-block mt-2 ${
                  selectedQuote.status === 'Approved' ? 'bg-emerald-50 border-emerald-200 text-success' :
                  selectedQuote.status === 'Rejected' ? 'bg-rose-50 border-rose-200 text-danger' :
                  'bg-slate-50 border-slate-200 text-slate-400'
                }`}>
                  {selectedQuote.status}
                </span>
              </div>
            </div>

            {/* Line Item Table */}
            <div className="flex-1 overflow-y-auto py-4">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-bg-main border-b border-border-crm font-bold text-[10px] text-txt-secondary uppercase tracking-wider">
                    <th className="px-4 py-2">Item Description</th>
                    <th className="px-4 py-2 text-right">Qty</th>
                    <th className="px-4 py-2 text-right">Unit Price</th>
                    <th className="px-4 py-2 text-right">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-crm text-xs">
                  {selectedQuote.items.map((item: any, idx: number) => (
                    <tr key={idx} className="text-txt-primary">
                      <td className="px-4 py-3 font-semibold">{item.description}</td>
                      <td className="px-4 py-3 text-right">{item.qty}</td>
                      <td className="px-4 py-3 text-right">${item.price.toLocaleString()}</td>
                      <td className="px-4 py-3 text-right font-bold">${item.total.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Calculations */}
            <div className="border-t border-border-crm pt-4 flex justify-end shrink-0">
              <div className="w-64 space-y-2 text-xs">
                <div className="flex justify-between text-txt-secondary">
                  <span>Subtotal:</span>
                  <span>${selectedQuote.subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-txt-secondary">
                  <span>Tax Rate ({selectedQuote.taxRate}%):</span>
                  <span>${selectedQuote.taxAmount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-txt-secondary">
                  <span>Discount:</span>
                  <span>-${Number(selectedQuote.discount || 0).toLocaleString()}</span>
                </div>
                <div className="flex justify-between border-t border-border-crm pt-2 text-sm font-extrabold text-txt-primary">
                  <span>Grand Total:</span>
                  <span className="text-primary">${selectedQuote.grandTotal.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Modal controls */}
            <div className="flex gap-2 pt-6 border-t border-border-crm mt-4 shrink-0">
              <button
                onClick={() => setSelectedQuote(null)}
                className="flex-1 border border-border-crm hover:bg-slate-50 rounded-xl py-2 font-semibold text-txt-primary cursor-pointer"
              >
                Close Invoice
              </button>
              <button
                onClick={() => { alert('Print layout trigger simulated. Grand Total: $' + selectedQuote.grandTotal.toLocaleString()); window.print(); }}
                className="flex-1 bg-primary hover:bg-primary-hover text-white rounded-xl py-2 font-semibold shadow cursor-pointer"
              >
                Generate PDF / Print
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Create Quote Modal */}
      {showQuoteModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-card border border-border-crm rounded-2xl shadow-2xl p-6 max-w-md w-full text-txt-primary">
            <h4 className="font-bold text-sm tracking-tight mb-4 font-extrabold">Generate Quotation Draft</h4>
            <form onSubmit={handleQuoteSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Client Name</label>
                  <input
                    type="text" required
                    className="w-full border border-border-crm bg-bg-main rounded-xl px-3 py-2 text-txt-primary focus:outline-none bg-white"
                    value={quoteForm.clientName}
                    onChange={e => setQuoteForm({ ...quoteForm, clientName: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Company</label>
                  <input
                    type="text" required
                    className="w-full border border-border-crm bg-bg-main rounded-xl px-3 py-2 text-txt-primary focus:outline-none bg-white"
                    value={quoteForm.company}
                    onChange={e => setQuoteForm({ ...quoteForm, company: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Tax Rate (%)</label>
                  <input
                    type="number" required
                    className="w-full border border-border-crm bg-bg-main rounded-xl px-3 py-2 text-txt-primary focus:outline-none bg-white"
                    value={quoteForm.taxRate}
                    onChange={e => setQuoteForm({ ...quoteForm, taxRate: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Discount ($)</label>
                  <input
                    type="number" required
                    className="w-full border border-border-crm bg-bg-main rounded-xl px-3 py-2 text-txt-primary focus:outline-none bg-white"
                    value={quoteForm.discount}
                    onChange={e => setQuoteForm({ ...quoteForm, discount: e.target.value })}
                  />
                </div>
              </div>

              {/* Quotation item addition */}
              <div className="space-y-2">
                <label className="block text-slate-400 font-semibold">Service Line Items</label>
                {quoteForm.items.map((item, idx) => (
                  <div key={idx} className="flex gap-2">
                    <input
                      type="text" required placeholder="Service desc"
                      className="flex-grow border border-border-crm bg-bg-main rounded-xl px-2 py-1.5 text-txt-primary focus:outline-none bg-white"
                      value={item.description}
                      onChange={e => {
                        const updated = [...quoteForm.items];
                        updated[idx].description = e.target.value;
                        setQuoteForm({ ...quoteForm, items: updated });
                      }}
                    />
                    <input
                      type="number" required placeholder="Qty"
                      className="w-12 border border-border-crm bg-bg-main rounded-xl px-2 py-1.5 text-txt-primary focus:outline-none text-right bg-white"
                      value={item.qty}
                      onChange={e => {
                        const updated = [...quoteForm.items];
                        updated[idx].qty = Number(e.target.value);
                        setQuoteForm({ ...quoteForm, items: updated });
                      }}
                    />
                    <input
                      type="number" required placeholder="Price"
                      className="w-20 border border-border-crm bg-bg-main rounded-xl px-2 py-1.5 text-txt-primary focus:outline-none text-right bg-white"
                      value={item.price}
                      onChange={e => {
                        const updated = [...quoteForm.items];
                        updated[idx].price = Number(e.target.value);
                        setQuoteForm({ ...quoteForm, items: updated });
                      }}
                    />
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => setQuoteForm({ ...quoteForm, items: [...quoteForm.items, { description: '', qty: 1, price: 0 }] })}
                  className="text-xs text-primary font-semibold flex items-center gap-1 mt-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Row</span>
                </button>
              </div>

              <div className="flex gap-2 pt-4">
                <button
                  type="button" onClick={() => setShowQuoteModal(false)}
                  className="flex-1 border border-border-crm hover:bg-slate-50 rounded-xl py-2.5 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-primary hover:bg-primary-hover text-white rounded-xl py-2.5 font-semibold shadow cursor-pointer"
                >
                  Create Quote
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
