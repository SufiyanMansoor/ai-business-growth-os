import { useState } from 'react';
import { Kanban, GripVertical } from 'lucide-react';
import ModuleLayout from '@/components/ui/ModuleLayout';
import Button from '@/components/ui/Button';

const stages = [
  { id: 'new', label: 'New Lead', color: 'var(--primary-color)' },
  { id: 'contacted', label: 'Contacted', color: 'var(--accent-color)' },
  { id: 'meeting', label: 'Meeting Scheduled', color: 'var(--warning)' },
  { id: 'proposal', label: 'Proposal Sent', color: '#8b5cf6' },
  { id: 'negotiation', label: 'Negotiation', color: '#ec4899' },
  { id: 'won', label: 'Won', color: 'var(--success)' },
  { id: 'lost', label: 'Lost', color: 'var(--error)' },
];

const initialLeads = [
  { id: '1', name: 'TechFlow Solutions', contact: 'John Smith', value: '$5,000', stage: 'new', notes: 'Interested in social media package' },
  { id: '2', name: 'GreenBite Restaurant', contact: 'Maria Garcia', value: '$2,500', stage: 'contacted', notes: 'Follow up on Monday' },
  { id: '3', name: 'HealthFirst Clinic', contact: 'Dr. Ahmed', value: '$8,000', stage: 'meeting', notes: 'Demo scheduled for Thursday' },
  { id: '4', name: 'StyleHub Shop', contact: 'Lisa Park', value: '$3,200', stage: 'proposal', notes: 'Sent proposal, awaiting response' },
  { id: '5', name: 'Creative Agency', contact: 'Tom Wilson', value: '$12,000', stage: 'negotiation', notes: 'Discussing pricing' },
  { id: '6', name: 'FitLife Gym', contact: 'Alex Brown', value: '$4,500', stage: 'won', notes: 'Contract signed!' },
];

export default function CRMPage() {
  const [leads, setLeads] = useState(initialLeads);
  const [draggedId, setDraggedId] = useState<string | null>(null);

  const handleDrop = (stageId: string) => {
    if (!draggedId) return;
    setLeads(leads.map((l) => l.id === draggedId ? { ...l, stage: stageId } : l));
    setDraggedId(null);
  };

  return (
    <ModuleLayout title="CRM Pipeline" description="Track leads through your sales pipeline"
      actions={<Button variant="secondary"><Kanban size={18} /> Add Lead</Button>}>
      <div className="flex gap-4 overflow-x-auto pb-4">
        {stages.map((stage) => {
          const stageLeads = leads.filter((l) => l.stage === stage.id);
          return (
            <div
              key={stage.id}
              className="flex-shrink-0 w-72"
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => handleDrop(stage.id)}
            >
              <div className="flex items-center gap-2 mb-3 px-1">
                <div className="w-3 h-3 rounded-full" style={{ background: stage.color }} />
                <h3 className="font-semibold text-sm">{stage.label}</h3>
                <span className="badge badge-primary ml-auto">{stageLeads.length}</span>
              </div>
              <div className="space-y-3 min-h-[200px]">
                {stageLeads.map((lead) => (
                  <div
                    key={lead.id}
                    draggable
                    onDragStart={() => setDraggedId(lead.id)}
                    className="glass-card !p-4 cursor-grab active:cursor-grabbing"
                  >
                    <div className="flex items-start gap-2">
                      <GripVertical size={14} className="mt-1 opacity-30" />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">{lead.name}</p>
                        <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>{lead.contact}</p>
                        <p className="text-sm font-bold mt-2" style={{ color: 'var(--success)' }}>{lead.value}</p>
                        {lead.notes && <p className="text-xs mt-2 p-2 rounded-lg" style={{ background: 'var(--bg-secondary)', color: 'var(--text-secondary)' }}>{lead.notes}</p>}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </ModuleLayout>
  );
}
