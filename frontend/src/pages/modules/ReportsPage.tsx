import { FileText, Download, FileSpreadsheet } from 'lucide-react';
import ModuleLayout from '@/components/ui/ModuleLayout';
import GlassCard from '@/components/ui/GlassCard';
import Button from '@/components/ui/Button';

const reports = [
  { id: '1', title: 'Q2 2026 Campaign Summary', type: 'PDF', date: '2026-05-28', size: '2.4 MB' },
  { id: '2', title: 'ROI Analysis Report', type: 'Excel', date: '2026-05-25', size: '1.1 MB' },
  { id: '3', title: 'Influencer Performance Report', type: 'PDF', date: '2026-05-20', size: '3.2 MB' },
  { id: '4', title: 'Lead Generation Report', type: 'Excel', date: '2026-05-15', size: '890 KB' },
  { id: '5', title: 'Social Media Analytics', type: 'PDF', date: '2026-05-10', size: '1.8 MB' },
];

export default function ReportsPage() {
  return (
    <ModuleLayout title="Reporting System" description="Generate and download PDF and Excel reports"
      actions={
        <div className="flex gap-2">
          <Button variant="secondary"><FileText size={18} /> Generate PDF</Button>
          <Button variant="secondary"><FileSpreadsheet size={18} /> Generate Excel</Button>
        </div>
      }>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {['Campaign Summary', 'ROI Report', 'Lead Report'].map((type) => (
          <GlassCard key={type} className="text-center !p-6 cursor-pointer">
            <FileText size={32} className="mx-auto mb-3" style={{ color: 'var(--primary-color)' }} />
            <p className="font-semibold">{type}</p>
            <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>Click to generate</p>
          </GlassCard>
        ))}
      </div>

      <GlassCard hover={false}>
        <h3 className="font-semibold mb-4">Recent Reports</h3>
        <div className="space-y-3">
          {reports.map((report) => (
            <div key={report.id} className="flex items-center gap-4 p-4 rounded-xl" style={{ background: 'var(--bg-secondary)' }}>
              {report.type === 'PDF' ? <FileText size={20} style={{ color: 'var(--error)' }} /> : <FileSpreadsheet size={20} style={{ color: 'var(--success)' }} />}
              <div className="flex-1">
                <p className="font-medium text-sm">{report.title}</p>
                <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{report.date} • {report.size}</p>
              </div>
              <span className="badge badge-primary">{report.type}</span>
              <Button size="sm" variant="secondary"><Download size={14} /> Download</Button>
            </div>
          ))}
        </div>
      </GlassCard>
    </ModuleLayout>
  );
}
