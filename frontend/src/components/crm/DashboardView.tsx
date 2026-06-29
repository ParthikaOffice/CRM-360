import React from 'react';
import {
  BarChart3,
  ClipboardList,
  IndianRupee,
  TrendingUp,
  Users,
  Calendar as CalendarIcon,
  Check
} from 'lucide-react';

interface DashboardViewProps {
  leads: any[];
  opportunities: any[];
  pipelines: any[];
  activities: any[];
  onToggleActivityDone: (id: string, done: boolean) => void;
  addToast: (type: 'success' | 'error' | 'info', msg: string) => void;
}

export default function DashboardView({
  leads,
  opportunities,
  pipelines,
  activities,
  onToggleActivityDone,
  addToast
}: DashboardViewProps) {
  return (
    <div className="space-y-6">
      
      {/* Executive KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Total Leads Card */}
        <div className="bg-card rounded-2xl p-5 border border-border-crm shadow-xs transition hover:shadow">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <p className="text-xs font-bold text-txt-secondary uppercase tracking-wide">Total Leads</p>
              <h3 className="text-3xl font-extrabold text-txt-primary">
  {
    leads.filter(
      lead => !opportunities.some(
        opp => opp.leadId === lead.id
      )
    ).length
  }
</h3>
            </div>
            <div className="p-3 bg-blue-50 text-primary rounded-xl">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-center space-x-1.5 mt-3 text-xs">
            <span className="text-success font-semibold flex items-center">
              <TrendingUp className="w-3 h-3 mr-0.5" />
              <span>+12%</span>
            </span>
            <span className="text-slate-400">vs last month</span>
          </div>
        </div>

        {/* Open Opportunities Card */}
        <div className="bg-card rounded-2xl p-5 border border-border-crm shadow-xs transition hover:shadow">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <p className="text-xs font-bold text-txt-secondary uppercase tracking-wide">Pipeline Count</p>
              <h3 className="text-3xl font-extrabold text-txt-primary">
                {opportunities.filter(o => o.stageId !== 'p_6' && o.stageId !== 'p_7').length}
              </h3>
            </div>
            <div className="p-3 bg-amber-50 text-warning rounded-xl">
              <ClipboardList className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-center space-x-1.5 mt-3 text-xs">
            <span className="text-warning font-semibold">Active Deal Stage</span>
            <span className="text-slate-400">awaiting proposals</span>
          </div>
        </div>

        {/* Revenue Card */}
        <div className="bg-card rounded-2xl p-5 border border-border-crm shadow-xs transition hover:shadow">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <p className="text-xs font-bold text-txt-secondary uppercase tracking-wide">Revenue (Won)</p>
              <h3 className="text-3xl font-extrabold text-txt-primary">
                ₹{opportunities.filter(o => o.stageId === 'p_6').reduce((sum, o) => sum + o.dealValue, 0).toLocaleString()}
              </h3>
            </div>
            <div className="p-3 bg-emerald-50 text-success rounded-xl">
              <IndianRupee className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-center space-x-1.5 mt-3 text-xs">
            <span className="text-success font-semibold">100% Verified</span>
            <span className="text-slate-400">excluding quotes</span>
          </div>
        </div>

        {/* Conversion Rate Card */}
        <div className="bg-card rounded-2xl p-5 border border-border-crm shadow-xs transition hover:shadow">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <p className="text-xs font-bold text-txt-secondary uppercase tracking-wide">Conversion Rate</p>
              <h3 className="text-3xl font-extrabold text-txt-primary">
                {opportunities.length ? Math.round((opportunities.filter(o => o.stageId === 'p_6').length / opportunities.length) * 100) : 0}%
              </h3>
            </div>
            <div className="p-3 bg-rose-50 text-danger rounded-xl">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-center space-x-1.5 mt-3 text-xs">
            <span className="text-slate-400">Total pipeline wins</span>
          </div>
        </div>

      </div>

      {/* Analytical Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Sales Funnel SVG Chart */}
        <div className="bg-card border border-border-crm rounded-2xl p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-sm tracking-tight text-txt-primary">Pipeline Funnel Distribution</h3>
            <span className="text-xs text-slate-400">Deal count per stage</span>
          </div>
          
          <div className="space-y-4">
            {pipelines.map(stage => {
              const count = opportunities.filter(o => o.stageId === stage.id).length;
              const maxCount = Math.max(...pipelines.map(st => opportunities.filter(o => o.stageId === st.id).length), 1);
              const widthPercent = Math.max((count / maxCount) * 100, 4);

              return (
                <div key={stage.id} className="space-y-1">
                  <div className="flex justify-between text-xs font-medium">
                    <span className="text-txt-primary">{stage.name}</span>
                    <span className="text-txt-secondary">{count} deals</span>
                  </div>
                  <div className="w-full bg-bg-main h-4 rounded-full overflow-hidden">
                    <div
                      style={{ width: `${widthPercent}%` }}
                      className="bg-primary h-full rounded-full transition-all duration-500"
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
 <div className="bg-card border border-border-crm rounded-2xl p-5 space-y-4">
          <h4 className="font-bold text-xs uppercase tracking-wider text-txt-secondary">Recent Leads Added</h4>
          <div className="space-y-3">
            {leads.slice(0, 4).map(ld => (
              <div key={ld.id} className="flex items-center justify-between p-2 hover:bg-bg-main rounded-xl transition text-txt-primary">
                <div className="text-xs min-w-0">
                  <p className="font-bold truncate">{ld.name}</p>
                  <p className="text-txt-secondary text-[10px] truncate">{ld.company}</p>
                </div>
                <span className="bg-blue-50 text-primary text-[10px] px-2 py-0.5 rounded-lg border border-blue-100 font-semibold shrink-0">
                  {ld.category}
                </span>
              </div>
            ))}
            {leads.length === 0 && (
              <div className="text-center py-6 text-txt-secondary text-xs">No leads available.</div>
            )}
          </div>
        </div>
        {/* Lead Sources Distribution (Donut style) */}
        {/* { <div className="bg-card border border-border-crm rounded-2xl p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-sm tracking-tight text-txt-primary">Lead Source Distribution</h3>
            <span className="text-xs text-slate-400">Channels contribution</span>
          </div> */} 
          
          {/* <div className="flex flex-col sm:flex-row items-center justify-around gap-6"> */}
            
            {/* SVG Donut */}
            {/* <div className="relative w-40 h-40">
              <svg viewBox="0 0 36 36" className="w-full h-full transform -rotate-90">
                <circle cx="18" cy="18" r="15.915" fill="none" stroke="#F1F5F9" strokeWidth="4" />
               
                <circle cx="18" cy="18" r="15.915" fill="none" stroke="#2563EB" strokeWidth="4.2" strokeDasharray="40 60" strokeDashoffset="0" />
               
                <circle cx="18" cy="18" r="15.915" fill="none" stroke="#10B981" strokeWidth="4.2" strokeDasharray="30 70" strokeDashoffset="-40" />
          
                <circle cx="18" cy="18" r="15.915" fill="none" stroke="#F59E0B" strokeWidth="4.2" strokeDasharray="20 80" strokeDashoffset="-70" />
           
                <circle cx="18" cy="18" r="15.915" fill="none" stroke="#EF4444" strokeWidth="4.2" strokeDasharray="10 90" strokeDashoffset="-90" />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-2xl font-bold tracking-tight text-txt-primary">5</span>
                <span className="text-[10px] text-slate-400 uppercase font-semibold">Total Leads</span>
              </div>
            </div> */}

            {/* Chart Legends */}
            {/* <div className="space-y-2 text-xs text-txt-primary">
              <div className="flex items-center space-x-2">
                <span className="w-3 h-3 rounded-full bg-primary inline-block"></span>
                <span className="font-semibold">Website (40%)</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="w-3 h-3 rounded-full bg-success inline-block"></span>
                <span className="font-semibold">Referral (30%)</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="w-3 h-3 rounded-full bg-warning inline-block"></span>
                <span className="font-semibold">Campaign (20%)</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="w-3 h-3 rounded-full bg-danger inline-block"></span>
                <span className="font-semibold">Direct Email (10%)</span>
              </div>
            </div>
          </div>
        </div> */}

      </div>

      {/* Dashboard Bottom Widgets Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Upcoming Meetings & Reminders */}
        <div className="bg-card border border-border-crm rounded-2xl p-5 space-y-4">
          <h4 className="font-bold text-xs uppercase tracking-wider text-txt-secondary">Upcoming Activities</h4>
          <div className="space-y-3">
            {activities.slice(0, 3).map(act => (
              <div key={act.id} className="flex gap-3 items-start p-2.5 hover:bg-bg-main rounded-xl transition text-txt-primary">
                <div className={`p-2 rounded-lg shrink-0 ${
                  act.type === 'Meeting' ? 'bg-blue-50 text-primary' :
                  act.type === 'Call' ? 'bg-emerald-50 text-success' : 'bg-slate-100 text-slate-600'
                }`}>
                  <CalendarIcon className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0 text-xs">
                  <p className="font-bold truncate">{act.title}</p>
                  <p className="text-txt-secondary text-[10px] mt-0.5">{act.date} at {act.time} ({act.duration} mins)</p>
                </div>
                <button
                  onClick={() => onToggleActivityDone(act.id, act.done)}
                  className={`p-1 border rounded-lg transition shrink-0 cursor-pointer ${
                    act.done ? 'bg-success border-emerald-500 text-white' : 'border-slate-200 text-slate-400 hover:bg-slate-50'
                  }`}
                >
                  <Check className="w-3 h-3" />
                </button>
              </div>
            ))}
            {activities.length === 0 && (
              <div className="text-center py-6 text-txt-secondary text-xs">No upcoming activities scheduled.</div>
            )}
          </div>
        </div>

        {/* Recent Leads Widget */}
       

        {/* Sales Team Performance List */}
        <div className="bg-card border border-border-crm rounded-2xl p-5 space-y-4">
          <h4 className="font-bold text-xs uppercase tracking-wider text-txt-secondary">Top Sales Executives</h4>
          <div className="space-y-3">
            {[
              { name: 'Sarah Connor', quota: '₹500,000', closed: '₹250,000', rate: 50 },
              { name: 'John Doe (SA)', quota: '₹1,000,000', closed: '₹850,000', rate: 85 },
              { name: 'Kyle Reese', quota: '₹250,000', closed: '₹45,000', rate: 18 }
            ].map((exec, idx) => (
              <div key={idx} className="space-y-1.5 text-xs text-txt-primary">
                <div className="flex justify-between font-semibold">
                  <span>{exec.name}</span>
                  <span>{exec.closed} / {exec.quota}</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div
                    style={{ width: `${exec.rate}%` }}
                    className="bg-success h-full rounded-full"
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
