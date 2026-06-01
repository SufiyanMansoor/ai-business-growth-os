import { useEffect, useState } from 'react';
import { Bot, Zap, CheckCircle, Loader } from 'lucide-react';
import ModuleLayout from '@/components/ui/ModuleLayout';
import GlassCard from '@/components/ui/GlassCard';
import Button from '@/components/ui/Button';
import Select from '@/components/ui/Select';
import Input from '@/components/ui/Input';
import { createAutopilotRun, getAutopilotRuns, startAutopilot, updateAutopilotRun } from '@/lib/api';
import { useToast } from '@/components/ui/ToastProvider';

const autopilotSteps = [
  { id: 1, label: 'Analyzing business & setting strategy', status: 'pending' },
  { id: 2, label: 'Creating content across platforms', status: 'pending' },
  { id: 3, label: 'Finding & vetting influencers', status: 'pending' },
  { id: 4, label: 'Sending personalized outreach', status: 'pending' },
  { id: 5, label: 'Scheduling & publishing content', status: 'pending' },
  { id: 6, label: 'Tracking results & optimizing', status: 'pending' },
];

export default function AutopilotPage() {
  const [config, setConfig] = useState({ goal: 'leads', budget: '1000', industry: 'saas' });
  const [running, setRunning] = useState(false);
  const [steps, setSteps] = useState(autopilotSteps);
  const [completed, setCompleted] = useState(false);
  const [runHistory, setRunHistory] = useState<Array<{ id: string; goal: string; budget: number; status: string; createdAt: string }>>([]);
  const [runsCursor, setRunsCursor] = useState<string | null>(null);
  const [loadingMoreRuns, setLoadingMoreRuns] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    getAutopilotRuns({ limit: 5 })
      .then((data) => {
        const payload = data as {
          runs?: Array<{ id: string; goal: string; budget: number; status: string; createdAt: string }>;
          nextCursor?: string | null;
        };
        setRunHistory(payload.runs || []);
        setRunsCursor(payload.nextCursor || null);
      })
      .catch(() => showToast('Unable to load run history.', 'error'));
  }, [showToast]);

  const handleLoadMoreRuns = async () => {
    if (!runsCursor || loadingMoreRuns) return;
    setLoadingMoreRuns(true);
    try {
      const data = await getAutopilotRuns({ limit: 5, before: runsCursor });
      const payload = data as {
        runs?: Array<{ id: string; goal: string; budget: number; status: string; createdAt: string }>;
        nextCursor?: string | null;
      };
      setRunHistory((prev) => [...prev, ...(payload.runs || [])]);
      setRunsCursor(payload.nextCursor || null);
    } catch {
      showToast('Unable to load more runs.', 'error');
    } finally {
      setLoadingMoreRuns(false);
    }
  };

  const handleStart = async () => {
    setRunning(true);
    setCompleted(false);
    setSteps(autopilotSteps.map((s) => ({ ...s, status: 'pending' })));

    let runId = '';
    try {
      await startAutopilot({ goal: config.goal, budget: parseInt(config.budget), industry: config.industry });
      const run = await createAutopilotRun({
        goal: config.goal,
        budget: parseInt(config.budget),
        industry: config.industry,
      });
      const savedRun = run as { id: string; goal: string; budget: number; status: string; createdAt: string };
      runId = savedRun.id;
      setRunHistory((prev) => [savedRun, ...prev]);
    } catch { /* demo mode */ }

    for (let i = 0; i < autopilotSteps.length; i++) {
      setSteps((prev) => prev.map((s, idx) => ({
        ...s,
        status: idx === i ? 'running' : idx < i ? 'done' : 'pending',
      })));
      await new Promise((r) => setTimeout(r, 1500));
      setSteps((prev) => prev.map((s, idx) => ({
        ...s,
        status: idx <= i ? 'done' : 'pending',
      })));
    }

    setRunning(false);
    setCompleted(true);
    if (runId) {
      try {
        const updated = await updateAutopilotRun(runId, { status: 'completed' });
        const row = updated as { id: string; goal: string; budget: number; status: string; createdAt: string };
        setRunHistory((prev) => prev.map((item) => (item.id === row.id ? row : item)));
        showToast('Autopilot run completed and saved.', 'success');
      } catch {
        showToast('Autopilot completed, but status sync failed.', 'error');
      }
    }
  };

  return (
    <ModuleLayout title="AI Autopilot Mode" description="Full automation — AI creates, posts, finds influencers, and optimizes campaigns">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <GlassCard hover={false}>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-animated flex items-center justify-center">
              <Bot size={24} className="text-white" />
            </div>
            <div>
              <h3 className="font-semibold">Autopilot Config</h3>
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Set it and forget it</p>
            </div>
          </div>
          <div className="space-y-4">
            <Select label="Goal" options={[
              { value: 'sales', label: 'Increase Sales' },
              { value: 'leads', label: 'Generate Leads' },
              { value: 'followers', label: 'Grow Followers' },
            ]} value={config.goal} onChange={(e) => setConfig({ ...config, goal: e.target.value })} />
            <Input label="Monthly Budget ($)" type="number" value={config.budget} onChange={(e) => setConfig({ ...config, budget: e.target.value })} />
            <Select label="Industry" options={[
              { value: 'saas', label: 'SaaS' },
              { value: 'restaurant', label: 'Restaurant' },
              { value: 'ecommerce', label: 'E-commerce' },
              { value: 'clinic', label: 'Healthcare' },
              { value: 'agency', label: 'Agency' },
            ]} value={config.industry} onChange={(e) => setConfig({ ...config, industry: e.target.value })} />
            <Button onClick={handleStart} loading={running} disabled={running} className="w-full">
              <Zap size={18} /> {running ? 'Autopilot Running...' : 'Start Autopilot'}
            </Button>
          </div>
        </GlassCard>

        <div className="lg:col-span-2">
          <GlassCard hover={false}>
            <h3 className="font-semibold mb-6">Autopilot Progress</h3>
            <div className="space-y-4">
              {steps.map((step) => (
                <div key={step.id} className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                    step.status === 'done' ? 'bg-[var(--success)]' :
                    step.status === 'running' ? 'bg-[var(--primary-color)]' : ''
                  }`} style={step.status === 'pending' ? { background: 'var(--card-bg)', border: '1px solid var(--border-color)' } : {}}>
                    {step.status === 'done' ? <CheckCircle size={20} className="text-white" /> :
                     step.status === 'running' ? <Loader size={20} className="text-white animate-spin" /> :
                     <span className="text-sm font-bold">{step.id}</span>}
                  </div>
                  <div className="flex-1">
                    <p className={`text-sm font-medium ${step.status === 'pending' ? 'opacity-50' : ''}`}>{step.label}</p>
                    {step.status === 'running' && (
                      <div className="w-full h-1 rounded-full mt-2" style={{ background: 'var(--border-color)' }}>
                        <div className="h-full rounded-full bg-animated animate-pulse" style={{ width: '60%' }} />
                      </div>
                    )}
                  </div>
                  {step.status === 'done' && <span className="badge badge-success">Done</span>}
                </div>
              ))}
            </div>

            {completed && (
              <div className="mt-8 p-6 rounded-xl text-center bg-animated">
                <CheckCircle size={48} className="mx-auto mb-3 text-white" />
                <h3 className="text-xl font-bold text-white">Autopilot Complete!</h3>
                <p className="text-white/80 mt-2">Your campaigns are live. AI will continue optimizing automatically.</p>
              </div>
            )}

            <div className="mt-8">
              <h4 className="font-semibold mb-3">Recent Autopilot Runs</h4>
              <div className="space-y-2">
                {runHistory.map((run) => (
                  <div key={run.id} className="p-3 rounded-xl text-sm flex items-center justify-between" style={{ background: 'var(--bg-secondary)' }}>
                    <span>{run.goal} • ${run.budget}</span>
                    <span className={`badge ${run.status === 'completed' ? 'badge-success' : 'badge-warning'}`}>{run.status}</span>
                  </div>
                ))}
                {!runHistory.length && (
                  <p className="text-sm" style={{ color: 'var(--text-muted)' }}>No runs yet.</p>
                )}
                {runsCursor && (
                  <Button variant="secondary" size="sm" onClick={handleLoadMoreRuns} loading={loadingMoreRuns}>
                    Load more
                  </Button>
                )}
              </div>
            </div>
          </GlassCard>
        </div>
      </div>
    </ModuleLayout>
  );
}
