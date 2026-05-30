import { useState } from 'react';
import { Video, Play } from 'lucide-react';
import ModuleLayout from '@/components/ui/ModuleLayout';
import GlassCard from '@/components/ui/GlassCard';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import { createVideo } from '@/lib/api';

interface StoryboardScene {
  scene: number;
  description: string;
  duration: string;
}

interface PlatformOutput {
  status: string;
  duration: string;
  format: string;
}

interface VideoResult {
  script: string;
  storyboard: StoryboardScene[];
  voiceover: string;
  outputs: Record<string, PlatformOutput>;
  captions?: { enabled: boolean; languages: string[] };
}

const DEFAULT_OUTPUTS: Record<string, PlatformOutput> = {
  youtube: { status: 'ready', duration: '60s', format: '16:9' },
  instagram: { status: 'ready', duration: '30s', format: '9:16' },
  tiktok: { status: 'ready', duration: '15s', format: '9:16' },
  linkedin: { status: 'ready', duration: '45s', format: '16:9' },
};

function normalizeVideoResult(data: unknown): VideoResult {
  const raw = (data && typeof data === 'object' ? data : {}) as Record<string, unknown>;

  const script = String(raw.script || raw.raw || 'Video script will appear here.');
  const voiceover = String(raw.voiceover || '');

  let storyboard: StoryboardScene[] = [];
  if (Array.isArray(raw.storyboard)) {
    storyboard = raw.storyboard.map((item, index) => {
      if (typeof item === 'string') {
        return { scene: index + 1, description: item, duration: '5s' };
      }
      if (item && typeof item === 'object') {
        const scene = item as Record<string, unknown>;
        return {
          scene: Number(scene.scene) || index + 1,
          description: String(scene.description || scene.text || `Scene ${index + 1}`),
          duration: String(scene.duration || '5s'),
        };
      }
      return { scene: index + 1, description: `Scene ${index + 1}`, duration: '5s' };
    });
  }

  if (!storyboard.length) {
    storyboard = [{ scene: 1, description: 'Opening hook with bold text animation', duration: '3s' }];
  }

  const outputs: Record<string, PlatformOutput> = { ...DEFAULT_OUTPUTS };
  if (raw.outputs && typeof raw.outputs === 'object' && !Array.isArray(raw.outputs)) {
    for (const [platform, info] of Object.entries(raw.outputs as Record<string, unknown>)) {
      if (info && typeof info === 'object') {
        const platformInfo = info as Record<string, unknown>;
        outputs[platform] = {
          status: String(platformInfo.status || 'ready'),
          duration: String(platformInfo.duration || '30s'),
          format: String(platformInfo.format || '16:9'),
        };
      }
    }
  }

  return { script, storyboard, voiceover, outputs };
}

const OFFLINE_DEMO: VideoResult = {
  script: 'AI-generated marketing script based on your input...',
  storyboard: [
    { scene: 1, description: 'Opening hook with bold text animation', duration: '3s' },
    { scene: 2, description: 'Product showcase with feature highlights', duration: '8s' },
    { scene: 3, description: 'Social proof and testimonials', duration: '5s' },
    { scene: 4, description: 'Call to action with brand logo', duration: '4s' },
  ],
  voiceover: 'Professional AI voiceover script with natural pacing...',
  outputs: DEFAULT_OUTPUTS,
};

export default function VideoCreatorPage() {
  const [source, setSource] = useState('');
  const [sourceType, setSourceType] = useState('url');
  const [language, setLanguage] = useState('english');
  const [voice, setVoice] = useState('female');
  const [result, setResult] = useState<VideoResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleCreate = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await createVideo({ source, type: sourceType, language, voice });
      setResult(normalizeVideoResult(data));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Video creation failed');
      setResult(OFFLINE_DEMO);
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
      {error && (
        <GlassCard hover={false} className="!border-red-500/30">
          <p className="text-sm text-red-400">
            Server unavailable — showing demo preview. ({error})
          </p>
        </GlassCard>
      )}

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
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{result.script}</p>
              </GlassCard>

              {result.voiceover && (
                <GlassCard hover={false}>
                  <h4 className="font-semibold mb-3">Voiceover</h4>
                  <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{result.voiceover}</p>
                </GlassCard>
              )}

              <GlassCard hover={false}>
                <h4 className="font-semibold mb-3">Storyboard</h4>
                <div className="grid grid-cols-2 gap-3">
                  {result.storyboard.map((scene) => (
                    <div key={scene.scene} className="p-4 rounded-xl" style={{ background: 'var(--bg-secondary)' }}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="badge badge-primary">Scene {scene.scene}</span>
                        <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{scene.duration}</span>
                      </div>
                      <p className="text-sm">{scene.description}</p>
                    </div>
                  ))}
                </div>
              </GlassCard>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {Object.entries(result.outputs).map(([platform, info]) => (
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
