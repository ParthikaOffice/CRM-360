import React, { useState } from 'react';
import { Calendar as CalendarIcon, Check, Plus, X } from 'lucide-react';

interface ActivitiesViewProps {
  activities: any[];
  user: any;
  onToggleActivityDone: (id: string, done: boolean) => void;
  onScheduleActivity: (activityForm: any) => void;
  showActivityModal: boolean;
  setShowActivityModal: (show: boolean) => void;
}

export default function ActivitiesView({
  activities,
  user,
  onToggleActivityDone,
  onScheduleActivity,
  showActivityModal,
  setShowActivityModal
}: ActivitiesViewProps) {
  const [calendarView, setCalendarView] = useState<'day' | 'week' | 'month'>('month');
  const [activityForm, setActivityForm] = useState({
    title: '', type: 'Meeting', date: '', time: '10:00', duration: '30',
    description: '', salesperson: '', leadId: '', opportunityId: ''
  });

  const handleActivitySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onScheduleActivity({
      ...activityForm,
      salesperson: user?.name || 'Unassigned'
    });
    setActivityForm({
      title: '', type: 'Meeting', date: '', time: '10:00', duration: '30',
      description: '', salesperson: '', leadId: '', opportunityId: ''
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 text-xs">
      
      {/* Calendar Controls & Lists */}
      <div className="lg:col-span-3 bg-card border border-border-crm rounded-2xl p-6 flex flex-col">
        <div className="flex items-center justify-between pb-4 border-b border-border-crm mb-6 shrink-0">
          <h3 className="font-bold text-sm tracking-tight text-txt-primary">Calendar Timeline Activities</h3>
          <div className="flex border border-border-crm rounded-xl overflow-hidden text-xs font-semibold">
            <button
              onClick={() => setCalendarView('day')}
              className={`px-3 py-1.5 transition cursor-pointer ${calendarView === 'day' ? 'bg-primary text-white' : 'hover:bg-slate-100 text-txt-secondary bg-white'}`}
            >
              Day
            </button>
            <button
              onClick={() => setCalendarView('week')}
              className={`px-3 py-1.5 border-x border-border-crm transition cursor-pointer ${calendarView === 'week' ? 'bg-primary text-white' : 'hover:bg-slate-100 text-txt-secondary bg-white'}`}
            >
              Week
            </button>
            <button
              onClick={() => setCalendarView('month')}
              className={`px-3 py-1.5 transition cursor-pointer ${calendarView === 'month' ? 'bg-primary text-white' : 'hover:bg-slate-100 text-txt-secondary bg-white'}`}
            >
              Month
            </button>
          </div>
        </div>

        {/* Simulated Month Grid layout */}
        <div className="flex-1 overflow-y-auto">
          {calendarView === 'month' ? (
            <div className="grid grid-cols-7 border-t border-l border-border-crm text-xs">
              {/* Day headers */}
              {['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map(d => (
                <div key={d} className="bg-bg-main p-2 border-r border-b border-border-crm font-bold text-center text-txt-secondary select-none">
                  {d}
                </div>
              ))}
              
              {/* Empty slots for spacing */}
              {Array.from({ length: 1 }).map((_, i) => (
                <div key={i} className="min-h-24 p-1 border-r border-b border-border-crm bg-slate-50"></div>
              ))}

              {/* Day cells containing activities */}
              {Array.from({ length: 30 }).map((_, i) => {
                const dayNumber = i + 1;
                const formattedDate = `2026-06-${dayNumber < 10 ? '0' + dayNumber : dayNumber}`;
                const dayActivities = activities.filter(a => a.date === formattedDate);

                return (
                  <div key={i} className="min-h-24 p-2 border-r border-b border-border-crm flex flex-col justify-between">
                    <span className="font-semibold text-[10px] text-slate-400 select-none">{dayNumber}</span>
                    <div className="space-y-1 mt-1 overflow-y-auto flex-1 max-h-16">
                      {dayActivities.map(act => (
                        <div
                          key={act.id}
                          onClick={() => alert(`${act.type}: ${act.description}`)}
                          className={`p-1 rounded text-[8px] font-bold cursor-pointer truncate ${
                            act.done ? 'bg-emerald-50 text-success border border-emerald-100 line-through' :
                            act.type === 'Meeting' ? 'bg-blue-50 text-primary border border-blue-100' :
                            'bg-amber-50 text-warning border border-amber-100'
                          }`}
                        >
                          {act.time} - {act.title}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="py-12 text-center text-slate-400 text-xs">
              Detailed Day and Week planner grids. Use Month tab view to manage logs.
            </div>
          )}
        </div>
      </div>

      {/* Right Activity Stats / Reminders */}
      <div className="space-y-6">
        
        {/* Scheduling Modal Trigger card */}
        <div className="bg-card border border-border-crm rounded-2xl p-5 space-y-4">
          <h4 className="font-bold text-xs uppercase tracking-wider text-txt-secondary">Activity Status Dashboard</h4>
          <div className="space-y-3 text-xs text-txt-primary">
            <div className="flex justify-between">
              <span>Total Meetings</span>
              <span className="font-bold text-primary">{activities.filter(a => a.type === 'Meeting').length}</span>
            </div>
            <div className="flex justify-between">
              <span>Total Calls</span>
              <span className="font-bold text-success">{activities.filter(a => a.type === 'Call').length}</span>
            </div>
            <div className="flex justify-between">
              <span>Awaiting Completion</span>
              <span className="font-bold text-warning">{activities.filter(a => !a.done).length}</span>
            </div>
            <div className="flex justify-between">
              <span>Completed Logs</span>
              <span className="font-bold text-success">{activities.filter(a => a.done).length}</span>
            </div>
          </div>
        </div>

        {/* Checklist */}
        <div className="bg-card border border-border-crm rounded-2xl p-5 space-y-4">
          <h4 className="font-bold text-xs uppercase tracking-wider text-txt-secondary">Pending Actions</h4>
          <div className="space-y-3">
            {activities.filter(a => !a.done).map(act => (
              <div key={act.id} className="flex items-start gap-2.5 p-1 text-txt-primary">
                <input
                  type="checkbox"
                  className="rounded text-primary border-slate-300 focus:ring-0 mt-0.5 cursor-pointer"
                  checked={act.done}
                  onChange={() => onToggleActivityDone(act.id, act.done)}
                />
                <div className="text-xs">
                  <p className="font-bold">{act.title}</p>
                  <p className="text-txt-secondary text-[10px]">{act.date} - {act.type}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Create Activity Modal */}
      {showActivityModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-card border border-border-crm rounded-2xl shadow-2xl p-6 max-w-sm w-full text-txt-primary">
            <h4 className="font-bold text-sm tracking-tight mb-4">Schedule Activity Log</h4>
            <form onSubmit={handleActivitySubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 font-semibold mb-1">Title</label>
                <input
                  type="text" required
                  className="w-full border border-border-crm bg-bg-main rounded-xl px-3 py-2 text-txt-primary focus:outline-none bg-white"
                  value={activityForm.title}
                  onChange={e => setActivityForm({ ...activityForm, title: e.target.value })}
                  placeholder="e.g. Call client for feedback"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Type</label>
                  <select
                    className="w-full border border-border-crm bg-bg-main rounded-xl px-3 py-2 text-txt-primary focus:outline-none bg-white"
                    value={activityForm.type}
                    onChange={e => setActivityForm({ ...activityForm, type: e.target.value })}
                  >
                    <option value="Meeting">Meeting</option>
                    <option value="Call">Call</option>
                    <option value="Email">Email</option>
                    <option value="Task">Task</option>
                    <option value="Follow-up">Follow-up</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Duration (mins)</label>
                  <input
                    type="number" required
                    className="w-full border border-border-crm bg-bg-main rounded-xl px-3 py-2 text-txt-primary focus:outline-none bg-white"
                    value={activityForm.duration}
                    onChange={e => setActivityForm({ ...activityForm, duration: e.target.value })}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Date</label>
                  <input
                    type="date" required
                    className="w-full border border-border-crm bg-bg-main rounded-xl px-3 py-2 text-txt-primary focus:outline-none bg-white"
                    value={activityForm.date}
                    onChange={e => setActivityForm({ ...activityForm, date: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Time</label>
                  <input
                    type="time" required
                    className="w-full border border-border-crm bg-bg-main rounded-xl px-3 py-2 text-txt-primary focus:outline-none bg-white"
                    value={activityForm.time}
                    onChange={e => setActivityForm({ ...activityForm, time: e.target.value })}
                  />
                </div>
              </div>
              <div>
                <label className="block text-slate-400 font-semibold mb-1">Description</label>
                <textarea
                  className="w-full border border-border-crm bg-bg-main rounded-xl p-2 text-txt-primary focus:outline-none h-16 resize-none bg-white"
                  value={activityForm.description}
                  onChange={e => setActivityForm({ ...activityForm, description: e.target.value })}
                />
              </div>
              <div className="flex gap-2 pt-4">
                <button
                  type="button" onClick={() => setShowActivityModal(false)}
                  className="flex-1 border border-border-crm hover:bg-slate-50 rounded-xl py-2 font-semibold text-txt-primary cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-primary hover:bg-primary-hover text-white rounded-xl py-2 font-semibold shadow cursor-pointer"
                >
                  Save Activity
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
