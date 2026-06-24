import React, { useState } from 'react';
import { ChevronRight, Trash2, Plus, X } from 'lucide-react';

interface OpportunitiesViewProps {
  opportunities: any[];
  pipelines: any[];
  user: any;
  searchQuery: string;
  activeFilters: any;
  onMoveOpportunity: (oppId: string, stageId: string) => void;
  onAddStage: (stageName: string) => void;
  onReorderStage: (stageId: string, direction: 'left' | 'right') => void;
  onDeleteStage: (stageId: string) => void;
  applyFilters: (data: any[], type: 'leads' | 'opportunities' | 'emails') => any[];
  showStageModal: boolean;
  setShowStageModal: (show: boolean) => void;
  addToast: (type: 'success' | 'error' | 'info', msg: string) => void;
}

export default function OpportunitiesView({
  opportunities,
  pipelines,
  user,
  searchQuery,
  activeFilters,
  onMoveOpportunity,
  onAddStage,
  onReorderStage,
  onDeleteStage,
  applyFilters,
  showStageModal,
  setShowStageModal,
  addToast
}: OpportunitiesViewProps) {
  const [newStageName, setNewStageName] = useState('');
  const [draggedOppId, setDraggedOppId] = useState<string | null>(null);

  const handleStageSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newStageName.trim()) {
      onAddStage(newStageName.trim());
      setNewStageName('');
      setShowStageModal(false);
    }
  };

  const handleDragStart = (oppId: string) => {
    setDraggedOppId(oppId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (stageId: string) => {
    if (!draggedOppId) return;
    const opp = opportunities.find(o => o.id === draggedOppId);
    if (!opp) return;

    // Check permissions
    if (user?.role === 'User' && opp.assignedSalesperson !== user?.name) {
      addToast('error', 'Access Denied: You can only move opportunities assigned to you');
      setDraggedOppId(null);
      return;
    }

    onMoveOpportunity(draggedOppId, stageId);
    setDraggedOppId(null);
  };

  return (
    <div className="flex flex-col gap-4">
      
      {/* Kanban Columns view */}
      <div className="flex space-x-4 overflow-x-auto pb-4 items-start select-none">
        
        {pipelines.map(stage => {
          const stageOpps = applyFilters(opportunities.filter(o => o.stageId === stage.id), 'opportunities');
          const totalValue = stageOpps.reduce((sum, opp) => sum + opp.dealValue, 0);

          return (
            <div
              key={stage.id}
              onDragOver={handleDragOver}
              onDrop={() => handleDrop(stage.id)}
              className="w-72 shrink-0 bg-slate-50 border border-slate-200 rounded-2xl p-4 flex flex-col max-h-160"
            >
              {/* Stage Header */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-4">
                <div className="min-w-0">
                  <h4 className="font-bold text-xs text-txt-primary truncate" title={stage.name}>
                    {stage.name}
                  </h4>
                  <p className="text-[10px] text-txt-secondary mt-0.5">${totalValue.toLocaleString()}</p>
                </div>

                {/* Controls for stage (Super Admin limits) */}
                {user?.role === 'Super Admin' && (
                  <div className="flex items-center space-x-1 shrink-0 ml-1">
                    <button
                      onClick={() => onReorderStage(stage.id, 'left')}
                      className="p-1 hover:bg-slate-200 rounded text-slate-500 cursor-pointer"
                      title="Move Stage Left"
                    >
                      <ChevronRight className="w-3 h-3 rotate-180" />
                    </button>
                    <button
                      onClick={() => onReorderStage(stage.id, 'right')}
                      className="p-1 hover:bg-slate-200 rounded text-slate-500 cursor-pointer"
                      title="Move Stage Right"
                    >
                      <ChevronRight className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() => onDeleteStage(stage.id)}
                      className="p-1 hover:bg-slate-200 rounded text-rose-500 cursor-pointer"
                      title="Delete Stage"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                )}
              </div>

              {/* Opportunity Cards List */}
              <div className="flex-1 overflow-y-auto space-y-3 min-h-24">
                {stageOpps.map(opp => (
                  <div
                    key={opp.id}
                    draggable
                    onDragStart={() => handleDragStart(opp.id)}
                    className="bg-card border border-border-crm rounded-xl p-4 shadow-xs hover:shadow transition-all cursor-grab active:cursor-grabbing text-txt-primary"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-[10px] text-slate-400 font-semibold">{opp.company}</span>
                      <span className={`px-1.5 py-0.5 rounded text-[8px] font-extrabold tracking-wider ${
                        opp.priority === 'High' ? 'bg-rose-50 text-danger border border-rose-100' :
                        opp.priority === 'Medium' ? 'bg-amber-50 text-warning border border-amber-100' :
                        'bg-slate-100 text-slate-600'
                      }`}>
                        {opp.priority}
                      </span>
                    </div>

                    <h5 className="font-bold text-xs text-txt-primary mb-3 leading-tight">{opp.customerName}</h5>
                    
                    <div className="flex items-center justify-between text-xs border-t border-border-crm pt-3">
                      <span className="font-extrabold text-primary">${opp.dealValue.toLocaleString()}</span>
                      <div className="flex items-center space-x-1">
                        <span className="w-5 h-5 bg-slate-100 rounded-full flex items-center justify-center text-[10px] font-bold text-slate-500 uppercase select-none">
                          {opp.assignedSalesperson.substr(0, 2)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
                {stageOpps.length === 0 && (
                  <div className="text-center py-8 text-slate-400 text-[10px]">
                    Drag deals here.
                  </div>
                )}
              </div>
            </div>
          );
        })}

      </div>

      {/* Create pipeline stage Modal */}
      {showStageModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-card border border-border-crm rounded-2xl shadow-2xl p-6 max-w-sm w-full text-txt-primary">
            <h4 className="font-bold text-sm tracking-tight mb-4">Add Sales Stage</h4>
            <form onSubmit={handleStageSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 font-semibold mb-1">Stage Name</label>
                <input
                  type="text" required
                  className="w-full border border-border-crm bg-bg-main rounded-xl px-3 py-2 text-txt-primary focus:outline-none bg-white"
                  value={newStageName}
                  onChange={e => setNewStageName(e.target.value)}
                  placeholder="e.g. Demonstration"
                />
              </div>
              <div className="flex gap-2 pt-4">
                <button
                  type="button" onClick={() => setShowStageModal(false)}
                  className="flex-1 border border-border-crm hover:bg-slate-50 rounded-xl py-2 font-semibold text-txt-primary cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-primary hover:bg-primary-hover text-white rounded-xl py-2 font-semibold shadow cursor-pointer"
                >
                  Create Stage
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
