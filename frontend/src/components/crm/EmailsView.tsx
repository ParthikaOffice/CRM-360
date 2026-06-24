import React, { useState } from 'react';
import { Mail, Send } from 'lucide-react';

interface EmailsViewProps {
  emails: any[];
  user: any;
  searchQuery: string;
  onSendReply: (replyText: string, emailObj: any) => void;
  applyFilters: (data: any[], type: 'leads' | 'opportunities' | 'emails') => any[];
}

export default function EmailsView({
  emails,
  user,
  searchQuery,
  onSendReply,
  applyFilters
}: EmailsViewProps) {
  const [emailFolder, setEmailFolder] = useState('Inbox');
  const [selectedEmail, setSelectedEmail] = useState<any>(null);
  const [emailReplyText, setEmailReplyText] = useState('');

  const handleSendEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedEmail && emailReplyText.trim()) {
      onSendReply(emailReplyText.trim(), selectedEmail);
      setEmailReplyText('');
    }
  };

  const folderEmails = emails.filter(e => e.folder === emailFolder);
  const filteredEmails = applyFilters(folderEmails, 'emails');

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 border border-border-crm rounded-2xl shadow-xs overflow-hidden bg-card text-xs">
      
      {/* Column 1: Outlook Sidebar Folders */}
      <div className="bg-slate-50 border-r border-border-crm p-4 space-y-4">
        <h4 className="font-bold text-xs uppercase tracking-wider text-txt-secondary px-2">Folders</h4>
        <div className="flex flex-col gap-1">
          {[
            { id: 'Inbox', label: 'Inbox', count: emails.filter(e => e.folder === 'Inbox' && !e.read).length },
            { id: 'Sent', label: 'Sent Mail', count: 0 },
            { id: 'Drafts', label: 'Drafts', count: 0 },
            { id: 'Trash', label: 'Trash', count: 0 }
          ].map(folder => (
            <button
              key={folder.id}
              onClick={() => { setEmailFolder(folder.id); setSelectedEmail(null); }}
              className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition cursor-pointer ${
                emailFolder === folder.id ? 'bg-primary/10 text-primary font-semibold' : 'text-txt-secondary hover:bg-slate-100 hover:text-txt-primary'
              }`}
            >
              <span>{folder.label}</span>
              {folder.count > 0 && <span className="bg-primary text-white text-[9px] px-1.5 py-0.5 rounded-full">{folder.count}</span>}
            </button>
          ))}
        </div>
      </div>

      {/* Column 2: Thread List */}
      <div className="border-r border-border-crm flex flex-col h-140">
        <div className="p-4 border-b border-border-crm bg-bg-main shrink-0">
          <span className="font-bold text-[10px] text-txt-secondary uppercase tracking-wider">Conversation Thread</span>
        </div>
        <div className="flex-1 overflow-y-auto divide-y divide-border-crm">
          {filteredEmails.map(email => (
            <div
              key={email.id}
              onClick={() => {
                setSelectedEmail(email);
                email.read = true; // local mutation for instant update visual
              }}
              className={`p-4 hover:bg-slate-50 cursor-pointer transition flex flex-col gap-1.5 ${
                selectedEmail?.id === email.id ? 'bg-slate-100 border-l-2 border-primary' : ''
              }`}
            >
              <div className="flex justify-between items-center">
                <span className="font-bold text-txt-primary truncate">{email.sender}</span>
                <span className="text-[9px] text-slate-400">{new Date(email.date).toLocaleDateString()}</span>
              </div>
              <div className="font-semibold text-txt-primary truncate">{email.subject}</div>
              <div className="text-txt-secondary line-clamp-1">{email.body}</div>
            </div>
          ))}
          {filteredEmails.length === 0 && (
            <div className="text-center py-12 text-slate-400">Folder empty.</div>
          )}
        </div>
      </div>

      {/* Column 3: Detailed Thread View (Chatbox Style) & Tracking */}
      <div className="lg:col-span-2 flex flex-col h-140">
        {selectedEmail ? (
          <div className="flex flex-col h-full">
            
            {/* Subject header */}
            <div className="p-4 border-b border-border-crm bg-bg-main flex justify-between items-center shrink-0">
              <div>
                <h4 className="font-bold text-sm text-txt-primary">{selectedEmail.subject}</h4>
                <p className="text-[10px] text-txt-secondary">Sender: {selectedEmail.sender}</p>
              </div>
              
              {/* tracking metrics */}
              <div className="flex items-center space-x-2">
                {selectedEmail.bounced ? (
                  <span className="bg-red-50 text-danger border border-red-200 px-2 py-0.5 rounded text-[10px] font-bold">Bounced</span>
                ) : (
                  <>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${selectedEmail.read ? 'bg-emerald-50 text-success border-emerald-200' : 'bg-slate-100 border-slate-200 text-slate-400'}`}>
                      {selectedEmail.read ? 'Read' : 'Delivered'}
                    </span>
                    {selectedEmail.replied && (
                      <span className="bg-blue-50 text-primary border border-blue-200 px-2 py-0.5 rounded text-[10px] font-bold">Replied</span>
                    )}
                  </>
                )}
              </div>
            </div>

            {/* Thread messages scroll */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
              
              {/* Reply history blocks */}
              {selectedEmail.history.map((hist: any, index: number) => (
                <div key={index} className={`flex flex-col max-w-[80%] rounded-2xl p-4 shadow-xs text-xs border ${
                  hist.sender.includes('crm.com') ? 'bg-primary text-white border-blue-600 ml-auto' : 'bg-card text-txt-primary border-border-crm mr-auto'
                }`}>
                  <div className="flex justify-between items-center mb-1 text-[10px] opacity-75">
                    <span>{hist.sender}</span>
                    <span>{new Date(hist.date).toLocaleString()}</span>
                  </div>
                  <p className="leading-relaxed whitespace-pre-wrap">{hist.body}</p>
                </div>
              ))}

              {/* Original/Latest message block */}
              <div className={`flex flex-col max-w-[80%] rounded-2xl p-4 shadow-xs text-xs border ${
                selectedEmail.sender.includes('crm.com') ? 'bg-primary text-white border-blue-600 ml-auto' : 'bg-card text-txt-primary border-border-crm mr-auto'
              }`}>
                <div className="flex justify-between items-center mb-1 text-[10px] opacity-75">
                  <span>{selectedEmail.sender}</span>
                  <span>{new Date(selectedEmail.date).toLocaleString()}</span>
                </div>
                <p className="leading-relaxed whitespace-pre-wrap">{selectedEmail.body}</p>
              </div>

            </div>

            {/* Reply Input Box */}
            <form onSubmit={handleSendEmailSubmit} className="p-4 border-t border-border-crm bg-card flex gap-2 shrink-0">
              <input
                type="text" required placeholder="Write Outlook reply email thread..."
                className="flex-1 border border-border-crm rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-primary text-txt-primary bg-bg-main"
                value={emailReplyText}
                onChange={e => setEmailReplyText(e.target.value)}
              />
              <button
                type="submit"
                className="bg-primary hover:bg-primary-hover text-white rounded-xl px-4 flex items-center justify-center font-bold shadow cursor-pointer"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>

          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-8 text-slate-400">
            <Mail className="w-10 h-10 mb-2 opacity-50" />
            <p>Select email conversation thread to view tracker timeline.</p>
          </div>
        )}
      </div>

    </div>
  );
}
