import { useEffect, useState } from 'react';
import { Mail, MessageCircle, Send } from 'lucide-react';
import ModuleLayout from '@/components/ui/ModuleLayout';
import GlassCard from '@/components/ui/GlassCard';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Textarea from '@/components/ui/Textarea';
import Select from '@/components/ui/Select';
import { createOutreachRecord, generateOutreach, getOutreachRecords } from '@/lib/api';
import { useToast } from '@/components/ui/ToastProvider';

export default function OutreachPage() {
  const [type, setType] = useState('email');
  const [target, setTarget] = useState('');
  const [context, setContext] = useState('');
  const [result, setResult] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<Array<{ id: string; type: string; target: string; createdAt: string }>>([]);
  const [historyCursor, setHistoryCursor] = useState<string | null>(null);
  const [loadingMoreHistory, setLoadingMoreHistory] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    getOutreachRecords({ limit: 5 })
      .then((data) => {
        const payload = data as {
          items?: Array<{ id: string; type: string; target: string; createdAt: string }>;
          nextCursor?: string | null;
        };
        setHistory(payload.items || []);
        setHistoryCursor(payload.nextCursor || null);
      })
      .catch(() => showToast('Unable to load outreach history.', 'error'));
  }, [showToast]);

  const handleLoadMoreHistory = async () => {
    if (!historyCursor || loadingMoreHistory) return;
    setLoadingMoreHistory(true);
    try {
      const data = await getOutreachRecords({ limit: 5, before: historyCursor });
      const payload = data as {
        items?: Array<{ id: string; type: string; target: string; createdAt: string }>;
        nextCursor?: string | null;
      };
      setHistory((prev) => [...prev, ...(payload.items || [])]);
      setHistoryCursor(payload.nextCursor || null);
    } catch {
      showToast('Unable to load more drafts.', 'error');
    } finally {
      setLoadingMoreHistory(false);
    }
  };

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const data = await generateOutreach({ type, target, context });
      setResult(data as Record<string, unknown>);
    } catch {
      setResult({
        initial: type === 'email'
          ? `Subject: Partnership Opportunity with [Your Brand]\n\nHi ${target || '{{name}}'},\n\nI came across your profile and was impressed by your content in [niche]. We believe a collaboration could benefit both our audiences...\n\nBest regards,\n[Your Name]`
          : `Hi ${target || '{{name}}'}! 👋\n\nI love your content about [topic]. We're launching something that your audience would find valuable. Would you be open to a quick chat?`,
        followUps: [
          'Follow-up 1 (Day 3): Just checking in on my previous message...',
          'Follow-up 2 (Day 7): Sharing a case study from a similar collaboration...',
          'Follow-up 3 (Day 14): Final follow-up with exclusive offer...',
        ],
        sponsorship: 'Sponsorship Proposal:\n\nBrand: [Your Brand]\nDeliverables: 3 Instagram posts + 2 Stories\nCompensation: $X + Free products\nTimeline: 2 weeks\nExclusivity: Category exclusivity for 30 days',
        tracking: { opens: 0, clicks: 0, replies: 0, status: 'draft' },
      });
      showToast('Using fallback generation (API unavailable).', 'info');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveDraft = async () => {
    if (!result) return;
    try {
      const saved = await createOutreachRecord({
        type,
        target,
        initial: result.initial,
        followUps: result.followUps,
        tracking: result.tracking,
      });
      const record = saved as { id: string; type: string; target: string; createdAt: string };
      setHistory((prev) => [record, ...prev]);
      showToast('Outreach draft saved.', 'success');
    } catch {
      showToast('Unable to save draft right now.', 'error');
    }
  };

  return (
    <ModuleLayout title="AI Outreach Automation" description="Generate personalized cold emails, WhatsApp messages, and follow-up sequences"
      actions={<div className="flex gap-2"><Button onClick={handleGenerate} loading={loading}><Send size={18} /> Generate Outreach</Button><Button variant="secondary" onClick={handleSaveDraft} disabled={!result}>Save Draft</Button></div>}>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <GlassCard hover={false}>
          <div className="space-y-4">
            <Select label="Outreach Type" options={[
              { value: 'email', label: 'Cold Email' },
              { value: 'whatsapp', label: 'WhatsApp Message' },
              { value: 'sponsorship', label: 'Sponsorship Proposal' },
              { value: 'followup', label: 'Follow-up Sequence' },
            ]} value={type} onChange={(e) => setType(e.target.value)} />
            <Input label="Target Name / Company" value={target} onChange={(e) => setTarget(e.target.value)} placeholder="John Doe / Acme Corp" />
            <Textarea label="Context" value={context} onChange={(e) => setContext(e.target.value)} placeholder="Additional context about the target or your offer..." />
          </div>
        </GlassCard>

        <div className="lg:col-span-2 space-y-4">
          {result ? (
            <>
              <GlassCard hover={false}>
                <div className="flex items-center gap-2 mb-3">
                  {type === 'whatsapp' ? <MessageCircle size={18} /> : <Mail size={18} />}
                  <h4 className="font-semibold">Initial Message</h4>
                </div>
                <pre className="text-sm whitespace-pre-wrap" style={{ color: 'var(--text-secondary)' }}>{result.initial as string}</pre>
              </GlassCard>
              {result.followUps && (
                <GlassCard hover={false}>
                  <h4 className="font-semibold mb-3">Follow-up Sequence</h4>
                  {(result.followUps as string[]).map((f, i) => (
                    <div key={i} className="p-3 rounded-xl mb-2 text-sm" style={{ background: 'var(--bg-secondary)' }}>{f}</div>
                  ))}
                </GlassCard>
              )}
              {result.tracking && (
                <div className="grid grid-cols-4 gap-3">
                  {['opens', 'clicks', 'replies'].map((metric) => (
                    <GlassCard key={metric} className="text-center !p-3">
                      <p className="text-xl font-bold">{(result.tracking as Record<string, number>)[metric]}</p>
                      <p className="text-xs capitalize" style={{ color: 'var(--text-muted)' }}>{metric}</p>
                    </GlassCard>
                  ))}
                  <GlassCard className="text-center !p-3">
                    <span className="badge badge-warning">{(result.tracking as Record<string, string>).status}</span>
                    <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>Status</p>
                  </GlassCard>
                </div>
              )}
            </>
          ) : (
            <GlassCard hover={false} className="text-center py-20">
              <Mail size={48} className="mx-auto mb-4 opacity-30" />
              <p style={{ color: 'var(--text-muted)' }}>Configure outreach settings and generate personalized messages</p>
            </GlassCard>
          )}
          <GlassCard hover={false}>
            <h4 className="font-semibold mb-3">Saved Outreach Drafts</h4>
            <div className="space-y-2">
              {history.map((item) => (
                <div key={item.id} className="p-3 rounded-xl text-sm flex items-center justify-between" style={{ background: 'var(--bg-secondary)' }}>
                  <span>{item.type} • {item.target || 'Untitled target'}</span>
                  <span style={{ color: 'var(--text-muted)' }}>{new Date(item.createdAt).toLocaleDateString()}</span>
                </div>
              ))}
              {!history.length && <p className="text-sm" style={{ color: 'var(--text-muted)' }}>No saved drafts yet.</p>}
              {historyCursor && (
                <Button variant="secondary" size="sm" onClick={handleLoadMoreHistory} loading={loadingMoreHistory}>
                  Load more
                </Button>
              )}
            </div>
          </GlassCard>
        </div>
      </div>
    </ModuleLayout>
  );
}
