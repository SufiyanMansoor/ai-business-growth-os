import { useEffect, useRef, useState } from 'react';
import {
  Video, Play, CheckCircle2, Loader2, Film, Mic, Clapperboard, Sparkles,
  Download, FileText, ChevronDown,
} from 'lucide-react';
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

const CREATION_STEPS = [
  { label: 'Analyzing your source', icon: Sparkles },
  { label: 'Writing marketing script', icon: Film },
  { label: 'Building storyboard', icon: Clapperboard },
  { label: 'Generating voiceover', icon: Mic },
  { label: 'Rendering platform videos', icon: Video },
];

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

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function buildExportText(result: VideoResult, source: string) {
  const lines = [
    '=== AI VIDEO CREATOR — FULL RESULTS ===',
    `Source: ${source}`,
    '',
    '--- SCRIPT ---',
    result.script,
    '',
    '--- VOICEOVER ---',
    result.voiceover,
    '',
    '--- STORYBOARD ---',
    ...result.storyboard.map((s) => `Scene ${s.scene} (${s.duration}): ${s.description}`),
    '',
    '--- PLATFORM OUTPUTS ---',
    ...Object.entries(result.outputs).map(
      ([p, o]) => `${p}: ${o.duration}, ${o.format}, ${o.status}`
    ),
  ];
  return lines.join('\n');
}

function downloadText(filename: string, content: string) {
  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

function VideoPreviewPlayer({
  storyboard,
  platform,
  format,
}: {
  storyboard: StoryboardScene[];
  platform: string;
  format: string;
}) {
  const [sceneIndex, setSceneIndex] = useState(0);
  const [playing, setPlaying] = useState(true);
  const isVertical = format.includes('9:16');

  useEffect(() => {
    if (!playing || !storyboard.length) return;
    const timer = setInterval(() => {
      setSceneIndex((i) => (i + 1) % storyboard.length);
    }, 2500);
    return () => clearInterval(timer);
  }, [playing, storyboard.length]);

  const scene = storyboard[sceneIndex];

  return (
    <div className="flex flex-col items-center gap-4">
      <div
        className={`relative rounded-2xl overflow-hidden border-2 flex items-center justify-center text-center p-6 transition-all ${isVertical ? 'w-48 h-80' : 'w-full max-w-lg aspect-video'}`}
        style={{
          borderColor: 'var(--primary-color)',
          background: 'linear-gradient(135deg, var(--bg-secondary), rgba(99,102,241,0.2))',
        }}
      >
        <div className="absolute top-3 left-3 badge badge-primary capitalize text-xs">{platform}</div>
        <div className="absolute top-3 right-3 text-xs" style={{ color: 'var(--text-muted)' }}>{format}</div>
        <div className="animate-fade-in">
          <p className="text-xs mb-2" style={{ color: 'var(--primary-color)' }}>
            Scene {scene?.scene} • {scene?.duration}
          </p>
          <p className="text-sm font-medium leading-relaxed">{scene?.description}</p>
        </div>
        {playing && (
          <div className="absolute bottom-0 left-0 right-0 h-1" style={{ background: 'var(--bg-secondary)' }}>
            <div
              className="h-full transition-all duration-[2500ms] linear"
              style={{
                width: playing ? '100%' : '0%',
                background: 'var(--primary-color)',
                animation: 'previewProgress 2.5s linear infinite',
              }}
            />
          </div>
        )}
      </div>
      <div className="flex gap-2">
        <Button size="sm" variant="secondary" onClick={() => setPlaying(!playing)}>
          {playing ? 'Pause Preview' : 'Play Preview'}
        </Button>
        <span className="text-xs self-center" style={{ color: 'var(--text-muted)' }}>
          Storyboard preview — {storyboard.length} scenes
        </span>
      </div>
    </div>
  );
}

export default function VideoCreatorPage() {
  const [source, setSource] = useState('');
  const [sourceType, setSourceType] = useState('url');
  const [language, setLanguage] = useState('english');
  const [voice, setVoice] = useState('female');
  const [result, setResult] = useState<VideoResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isReady, setIsReady] = useState(false);
  const [platformsReady, setPlatformsReady] = useState<Record<string, boolean>>({});
  const [previewPlatform, setPreviewPlatform] = useState('youtube');
  const resultsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!result || loading) return;

    const platforms = Object.keys(result.outputs);
    setPlatformsReady(Object.fromEntries(platforms.map((p) => [p, false])));
    setPreviewPlatform(platforms[0] || 'youtube');

    platforms.forEach((platform, index) => {
      setTimeout(() => {
        setPlatformsReady((prev) => ({ ...prev, [platform]: true }));
      }, 400 + index * 350);
    });

    setTimeout(() => {
      resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 600);
  }, [result, loading]);

  const runProgressAnimation = async () => {
    for (let i = 0; i < CREATION_STEPS.length; i++) {
      setCurrentStep(i);
      setProgress(Math.round(((i + 0.5) / CREATION_STEPS.length) * 100));
      await delay(700);
    }
    setProgress(95);
  };

  const handleCreate = async () => {
    setLoading(true);
    setIsReady(false);
    setResult(null);
    setCurrentStep(0);
    setProgress(5);
    setPlatformsReady({});

    const progressTask = runProgressAnimation();

    try {
      const data = await createVideo({ source, type: sourceType, language, voice });
      await progressTask;
      setProgress(100);
      setCurrentStep(CREATION_STEPS.length - 1);
      await delay(400);
      setResult(normalizeVideoResult(data));
      setIsReady(true);
    } catch {
      await progressTask;
      setProgress(100);
      setResult(OFFLINE_DEMO);
      setIsReady(true);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadAll = () => {
    if (!result) return;
    downloadText('video-results.txt', buildExportText(result, source));
  };

  const handleDownloadScript = () => {
    if (!result) return;
    downloadText('video-script.txt', result.script);
  };

  return (
    <ModuleLayout
      title="AI Video Creator"
      description="Generate marketing videos from URLs, repos, or descriptions"
      actions={
        <Button onClick={handleCreate} loading={loading} disabled={!source || loading}>
          <Video size={18} /> {loading ? 'Creating Video...' : 'Create Video'}
        </Button>
      }
    >
      {isReady && result && !loading && (
        <GlassCard hover={false} className="!border-green-500/40 animate-fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <div className="flex items-center gap-3 flex-1">
              <CheckCircle2 size={28} className="text-green-400 shrink-0" />
              <div>
                <p className="font-semibold text-green-400">Video Results Ready!</p>
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                  Neeche scroll karein — preview, script, storyboard aur download yahan hain
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm animate-bounce" style={{ color: 'var(--primary-color)' }}>
              <ChevronDown size={18} />
              Results neeche hain
            </div>
          </div>
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

          {loading && (
            <div className="mt-6 pt-4 border-t" style={{ borderColor: 'var(--border-color)' }}>
              <p className="text-xs font-medium mb-2" style={{ color: 'var(--primary-color)' }}>
                Progress: {progress}%
              </p>
              <div className="h-2 rounded-full overflow-hidden" style={{ background: 'var(--bg-secondary)' }}>
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${progress}%`,
                    background: 'linear-gradient(90deg, var(--gradient-from), var(--gradient-to))',
                  }}
                />
              </div>
            </div>
          )}
        </GlassCard>

        <div className="lg:col-span-2 space-y-4">
          {loading ? (
            <GlassCard hover={false} className="py-10">
              <div className="flex flex-col items-center text-center mb-8">
                <div className="relative mb-6">
                  <div className="w-20 h-20 rounded-2xl flex items-center justify-center animate-pulse"
                    style={{ background: 'linear-gradient(135deg, var(--gradient-from), var(--gradient-to))' }}>
                    <Film size={36} className="text-white" />
                  </div>
                  <Loader2 size={28} className="absolute -bottom-2 -right-2 animate-spin text-white"
                    style={{ filter: 'drop-shadow(0 0 8px var(--glow-color))' }} />
                </div>
                <h3 className="text-xl font-bold mb-1">Video Ban Rahi Hai...</h3>
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                  AI aapki marketing video bana raha hai — thora wait karein
                </p>
              </div>

              <div className="max-w-md mx-auto space-y-3">
                {CREATION_STEPS.map((step, index) => {
                  const Icon = step.icon;
                  const done = index < currentStep;
                  const active = index === currentStep;

                  return (
                    <div
                      key={step.label}
                      className="flex items-center gap-3 p-3 rounded-xl transition-all duration-300"
                      style={{
                        background: active ? 'rgba(99,102,241,0.15)' : done ? 'rgba(34,197,94,0.08)' : 'var(--bg-secondary)',
                        border: active ? '1px solid var(--primary-color)' : '1px solid transparent',
                      }}
                    >
                      <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
                        style={{ background: done ? 'var(--success)' : active ? 'var(--primary-color)' : 'var(--card-bg)' }}>
                        {done ? (
                          <CheckCircle2 size={18} className="text-white" />
                        ) : active ? (
                          <Loader2 size={18} className="text-white animate-spin" />
                        ) : (
                          <Icon size={18} style={{ color: 'var(--text-muted)' }} />
                        )}
                      </div>
                      <div className="flex-1 text-left">
                        <p className={`text-sm font-medium ${active ? '' : done ? 'text-green-400' : ''}`}
                          style={{ color: active ? 'var(--text-color)' : done ? undefined : 'var(--text-muted)' }}>
                          {step.label}{active && '...'}
                        </p>
                      </div>
                      {done && <span className="text-xs text-green-400">Done</span>}
                      {active && <span className="text-xs badge badge-primary">In Progress</span>}
                    </div>
                  );
                })}
              </div>
            </GlassCard>
          ) : result ? (
            <div ref={resultsRef} id="video-results" className="space-y-4 scroll-mt-4">
              {/* === VIDEO RESULTS HEADER === */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-4 rounded-2xl"
                style={{ background: 'linear-gradient(135deg, rgba(99,102,241,0.2), rgba(168,85,247,0.15))', border: '1px solid var(--primary-color)' }}>
                <div>
                  <h3 className="text-lg font-bold flex items-center gap-2">
                    <Film size={22} style={{ color: 'var(--primary-color)' }} />
                    Video Results
                  </h3>
                  <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>
                    Yahan aapke saare results hain — preview dekhein, download karein
                  </p>
                </div>
                <div className="flex gap-2 flex-wrap">
                  <Button size="sm" variant="secondary" onClick={handleDownloadScript}>
                    <FileText size={16} /> Script
                  </Button>
                  <Button size="sm" variant="neon" onClick={handleDownloadAll}>
                    <Download size={16} /> Download All
                  </Button>
                </div>
              </div>

              {/* === VIDEO PREVIEW PLAYER === */}
              <GlassCard hover={false}>
                <h4 className="font-semibold mb-4 flex items-center gap-2">
                  <Play size={18} style={{ color: 'var(--primary-color)' }} />
                  Video Preview
                  <span className="badge badge-primary text-xs">Scene-by-scene</span>
                </h4>
                <VideoPreviewPlayer
                  storyboard={result.storyboard}
                  platform={previewPlatform}
                  format={result.outputs[previewPlatform]?.format || '16:9'}
                />
              </GlassCard>

              {/* === SCRIPT === */}
              <GlassCard hover={false} className="animate-slide-up">
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <CheckCircle2 size={18} className="text-green-400" /> 1. Generated Script
                </h4>
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{result.script}</p>
              </GlassCard>

              {/* === VOICEOVER === */}
              {result.voiceover && (
                <GlassCard hover={false} className="animate-slide-up">
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <Mic size={18} style={{ color: 'var(--primary-color)' }} /> 2. Voiceover Script
                  </h4>
                  <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{result.voiceover}</p>
                </GlassCard>
              )}

              {/* === STORYBOARD === */}
              <GlassCard hover={false} className="animate-slide-up">
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <Clapperboard size={18} style={{ color: 'var(--primary-color)' }} /> 3. Storyboard ({result.storyboard.length} Scenes)
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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

              {/* === PLATFORM VIDEOS === */}
              <div>
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <Video size={18} style={{ color: 'var(--primary-color)' }} />
                  4. Platform Videos — Click to Preview
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {Object.entries(result.outputs).map(([platform, info]) => {
                    const ready = platformsReady[platform];
                    const selected = previewPlatform === platform;
                    return (
                      <button
                        key={platform}
                        type="button"
                        onClick={() => ready && setPreviewPlatform(platform)}
                        className="text-left transition-all duration-300"
                      >
                        <GlassCard
                          className={`text-center !p-4 w-full ${selected ? '!border-[var(--primary-color)] ring-2 ring-[var(--primary-color)]' : ''}`}
                          hover={false}
                        >
                          {ready ? (
                            <Play size={24} className="mx-auto mb-2" style={{ color: 'var(--primary-color)' }} />
                          ) : (
                            <Loader2 size={24} className="mx-auto mb-2 animate-spin" style={{ color: 'var(--primary-color)' }} />
                          )}
                          <p className="font-medium capitalize text-sm">{platform}</p>
                          <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>{info.duration} • {info.format}</p>
                          <span className={`badge mt-2 ${ready ? 'badge-success' : 'badge-primary'}`}>
                            {ready ? 'Ready' : 'Rendering...'}
                          </span>
                          {selected && ready && (
                            <p className="text-xs mt-2" style={{ color: 'var(--primary-color)' }}>▶ Previewing</p>
                          )}
                        </GlassCard>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          ) : (
            <GlassCard hover={false} className="text-center py-20">
              <Video size={48} className="mx-auto mb-4 opacity-30" />
              <p className="font-medium mb-2">Apni marketing video banayein</p>
              <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
                Settings configure karein aur &quot;Create Video&quot; par click karein
              </p>
              <p className="text-xs mt-4" style={{ color: 'var(--text-muted)' }}>
                Results yahan right side par dikhenge
              </p>
            </GlassCard>
          )}
        </div>
      </div>
    </ModuleLayout>
  );
}
