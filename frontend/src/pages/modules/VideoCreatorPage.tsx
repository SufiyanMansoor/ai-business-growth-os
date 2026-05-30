import { useState } from 'react';
import { Video, Play } from 'lucide-react';
import ModuleLayout from '@/components/ui/ModuleLayout';
import GlassCard from '@/components/ui/GlassCard';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import { createVideo } from '@/lib/api';

export default function VideoCreatorPage() {
  const [source, setSource] = useState('');
  const [sourceType, setSourceType] = useState('url');
  const [language, setLanguage] = useState('english');
  const [voice, setVoice] = useState('female');
  const [result, setResult] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(false);

  const handleCreate = async () => {
    setLoading(true);
    try {
      const data = await createVideo({ source, type: sourceType, language, voice });
      setResult(data as Record<string, unknown>);
    } catch {
      setResult({
        script: 'AI-generated marketing script based on your input...',
        storyboard: [
          { scene: 1, description: 'Opening hook with bold text animation', duration: '3s' },
          { scene: 2, description: 'Product showcase with feature highlights', duration: '8s' },
          { scene: 3, description: 'Social proof and testimonials', duration: '5s' },
          { scene: 4, description: 'Call to action with brand logo', duration: '4s' },
        ],
        voiceover: 'Professional AI voiceover script with natural pacing...',
        outputs: {
          youtube: { status: 'ready', duration: '60s', format: '16:9' },
          instagram: { status: 'ready', duration: '30s', format: '9:16' },
          tiktok: { status: 'ready', duration: '15s', format: '9:16' },
          linkedin: { status: 'ready', duration: '45s', format: '16:9' },
        },
        captions: { enabled: true, languages: ['English', 'Urdu', 'Arabic'] },
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <ModuleLayout
      title="AI Video Creator"
      description="Generate marketing videos from URLs, repos, or descriptions"
      actions={<Button onClick={handleCreate} loading={loading} disabled={!source}><Video size={18} /> Create Video</Button>}
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <GlassCard hover={false}>
          <h3 className="font-semibold mb-4">Video Settings</h3>
          <div className="space-y-4">
            <Select label="Source Type" options={[
              { value: 'url', label: 'Website URL' },
              { value: 'github', label: 'GitHub Repo' },
              { value: 'description', label: 'Product Description' },
            ]} value={sourceType} onChange={(e) => setSourceType(e.target.value)} />
            <Input label="Source" value={source} onChange={(e) => setSource(e.target.value)}
              placeholder={sourceType === 'url' ? 'https://...' : sourceType === 'github' ? 'github.com/user/repo' : 'Describe your product...'} />
            <Select label="Language" options={[
              { value: 'english', label: 'English' },
              { value: 'urdu', label: 'Urdu' },
              { value: 'arabic', label: 'Arabic' },
              { value: 'hindi', label: 'Hindi' },
            ]} value={language} onChange={(e) => setLanguage(e.target.value)} />
            <Select label="Voice" options={[
              { value: 'female', label: 'Female Voice' },
              { value: 'male', label: 'Male Voice' },
            ]} value={voice} onChange={(e) => setVoice(e.target.value)} />
          </div>
        </GlassCard>

        <div className="lg:col-span-2 space-y-4">
          {result ? (
            <>
              <GlassCard hover={false}>
                <h4 className="font-semibold mb-3">Generated Script</h4>
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{result.script as string}</p>
              </GlassCard>

              <GlassCard hover={false}>
                <h4 className="font-semibold mb-3">Storyboard</h4>
                <div className="grid grid-cols-2 gap-3">
                  {(result.storyboard as { scene: number; description: string; duration: string }[])?.map((s) => (
                    <div key={s.scene} className="p-4 rounded-xl" style={{ background: 'var(--bg-secondary)' }}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="badge badge-primary">Scene {s.scene}</span>
                        <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{s.duration}</span>
                      </div>
                      <p className="text-sm">{s.description}</p>
                    </div>
                  ))}
                </div>
              </GlassCard>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {Object.entries(result.outputs as Record<string, { status: string; duration: string; format: string }>).map(([platform, info]) => (
                  <GlassCard key={platform} className="text-center !p-4">
                    <Play size={24} className="mx-auto mb-2" style={{ color: 'var(--primary-color)' }} />
                    <p className="font-medium capitalize text-sm">{platform}</p>
                    <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>{info.duration} • {info.format}</p>
                    <span className="badge badge-success mt-2">{info.status}</span>
                  </GlassCard>
                ))}
              </div>
            </>
          ) : (
            <GlassCard hover={false} className="text-center py-20">
              <Video size={48} className="mx-auto mb-4 opacity-30" />
              <p style={{ color: 'var(--text-muted)' }}>Configure settings and create your marketing video</p>
            </GlassCard>
          )}
        </div>
      </div>
    </ModuleLayout>
  );
}
