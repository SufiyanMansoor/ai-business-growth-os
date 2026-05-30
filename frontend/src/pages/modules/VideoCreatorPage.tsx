import { useCallback, useEffect, useRef, useState } from 'react';
import {
  Video, Play, CheckCircle2, Loader2, Film, Mic, Clapperboard, Sparkles,
  Download, FileText, ChevronDown, Volume2, VolumeX, RefreshCw,
} from 'lucide-react';
import ModuleLayout from '@/components/ui/ModuleLayout';
import GlassCard from '@/components/ui/GlassCard';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import { createVideo } from '@/lib/api';
import {
  downloadVideoFile,
  getVideoFormatLabel,
  renderStoryboardVideo,
  speakVoiceover,
  stopVoiceover,
} from '@/lib/videoExport';

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

interface CachedVideo {
  url: string;
  extension: string;
  mimeType: string;
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

function downloadText(filename: string, content: string) {
  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

function RealVideoPlayer({
  videoUrl,
  format,
  platform,
  loading,
  progress,
  onRegenerate,
}: {
  videoUrl: string | null;
  format: string;
  platform: string;
  loading: boolean;
  progress: number;
  onRegenerate: () => void;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const isVertical = format.includes('9:16');

  useEffect(() => {
    if (videoUrl && videoRef.current) {
      videoRef.current.load();
      videoRef.current.play().catch(() => undefined);
    }
  }, [videoUrl]);

  if (loading) {
    return (
      <div className="flex flex-col items-center py-12 gap-4">
        <Loader2 size={48} className="animate-spin" style={{ color: 'var(--primary-color)' }} />
        <p className="font-semibold">Real video render ho rahi hai... {progress}%</p>
        <div className="w-full max-w-md h-2 rounded-full overflow-hidden" style={{ background: 'var(--bg-secondary)' }}>
          <div className="h-full transition-all duration-300 rounded-full" style={{ width: `${progress}%`, background: 'var(--primary-color)' }} />
        </div>
        <p className="text-xs" style={{ color: 'var(--text-muted)' }}>15-30 seconds lag sakte hain — page band mat karein</p>
      </div>
    );
  }

  if (!videoUrl) {
    return (
      <div className="text-center py-12">
        <Video size={48} className="mx-auto mb-4 opacity-40" />
        <p className="mb-4" style={{ color: 'var(--text-secondary)' }}>Video preview generate ho rahi hai...</p>
        <Button variant="secondary" size="sm" onClick={onRegenerate}>
          <RefreshCw size={16} /> Generate Video
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-3">
      <div className={`relative rounded-2xl overflow-hidden border-2 w-full ${isVertical ? 'max-w-[280px] mx-auto' : 'max-w-2xl mx-auto'}`}
        style={{ borderColor: 'var(--primary-color)', background: '#000' }}>
        <span className="absolute top-3 left-3 z-10 badge badge-primary capitalize">{platform}</span>
        <span className="absolute top-3 right-3 z-10 badge badge-success">▶ LIVE</span>
        <video
          ref={videoRef}
          src={videoUrl}
          controls
          playsInline
          loop
          className={`w-full ${isVertical ? 'aspect-[9/16]' : 'aspect-video'}`}
          style={{ display: 'block' }}
        />
      </div>
      <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
        ✅ Yeh asli video file hai — Play dabao ya Download karo
      </p>
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
  const [videoCache, setVideoCache] = useState<Record<string, CachedVideo>>({});
  const [renderingVideo, setRenderingVideo] = useState(false);
  const [renderProgress, setRenderProgress] = useState(0);
  const [videoFormat, setVideoFormat] = useState('WebM');
  const [speaking, setSpeaking] = useState(false);
  const resultsRef = useRef<HTMLDivElement>(null);
  const renderLock = useRef(false);

  const generateVideoForPlatform = useCallback(async (platform: string, videoResult: VideoResult, fastMode = true): Promise<CachedVideo | null> => {
    if (renderLock.current) return null;
    renderLock.current = true;
    setRenderingVideo(true);
    setRenderProgress(0);

    try {
      const format = videoResult.outputs[platform]?.format || '16:9';
      const hookLine = videoResult.script.split(/[.!?]/)[0]?.trim() || '';
      const { blob, extension, mimeType } = await renderStoryboardVideo({
        scenes: videoResult.storyboard,
        platform,
        format,
        title: 'Marketing Video',
        source,
        hookLine,
        fastMode,
        onProgress: setRenderProgress,
      });

      const url = URL.createObjectURL(blob);
      const cached: CachedVideo = { url, extension, mimeType };
      setVideoFormat(getVideoFormatLabel(mimeType));
      setVideoCache((prev) => {
        if (prev[platform]?.url) URL.revokeObjectURL(prev[platform].url);
        return { ...prev, [platform]: cached };
      });
      return cached;
    } catch (err) {
      console.error(err);
      return null;
    } finally {
      setRenderingVideo(false);
      renderLock.current = false;
    }
  }, [source]);

  useEffect(() => {
    if (!result || loading) return;

    const platforms = Object.keys(result.outputs);
    setPlatformsReady(Object.fromEntries(platforms.map((p) => [p, false])));
    setPreviewPlatform(platforms[0] || 'youtube');
    setVideoCache({});

    platforms.forEach((platform, index) => {
      setTimeout(() => setPlatformsReady((prev) => ({ ...prev, [platform]: true })), 400 + index * 350);
    });

    setTimeout(() => resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 600);

    setTimeout(() => {
      if (platforms[0]) generateVideoForPlatform(platforms[0], result, true);
    }, 1200);
  }, [result, loading, generateVideoForPlatform]);

  useEffect(() => {
    if (!result || !platformsReady[previewPlatform] || videoCache[previewPlatform]) return;
    generateVideoForPlatform(previewPlatform, result, true);
  }, [previewPlatform, result, platformsReady, videoCache, generateVideoForPlatform]);

  const videoCacheRef = useRef<Record<string, CachedVideo>>({});
  videoCacheRef.current = videoCache;

  useEffect(() => () => {
    Object.values(videoCacheRef.current).forEach((v) => URL.revokeObjectURL(v.url));
    stopVoiceover();
  }, []);

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
    setVideoCache({});
    setCurrentStep(0);
    setProgress(5);
    setPlatformsReady({});

    const progressTask = runProgressAnimation();
    try {
      const data = await createVideo({ source, type: sourceType, language, voice });
      await progressTask;
      setProgress(100);
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

  const handleDownloadVideo = async () => {
    if (!result || renderingVideo) return;

    let cached: CachedVideo | null | undefined = videoCache[previewPlatform];
    if (!cached) {
      cached = await generateVideoForPlatform(previewPlatform, result, false);
    }
    if (!cached) {
      alert('Video render failed. Chrome browser use karein.');
      return;
    }

    const blob = await fetch(cached.url).then((r) => r.blob());
    downloadVideoFile(blob, `ai-video-${previewPlatform}-${Date.now()}.${cached.extension}`);
  };

  const handlePlayVoice = () => {
    if (!result?.voiceover) return;
    if (speaking) {
      stopVoiceover();
      setSpeaking(false);
    } else {
      speakVoiceover(result.voiceover, voice);
      setSpeaking(true);
      setTimeout(() => setSpeaking(false), 8000);
    }
  };

  const currentVideo = videoCache[previewPlatform];

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
            <CheckCircle2 size={28} className="text-green-400 shrink-0" />
            <div>
              <p className="font-semibold text-green-400">Video Ready — Neeche player mein dekhein!</p>
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                Real video auto-generate ho rahi hai. Play button dabao ya Download karo.
              </p>
            </div>
            <ChevronDown size={24} className="animate-bounce hidden sm:block" style={{ color: 'var(--primary-color)' }} />
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
              <p className="text-xs font-medium mb-2" style={{ color: 'var(--primary-color)' }}>Progress: {progress}%</p>
              <div className="h-2 rounded-full overflow-hidden" style={{ background: 'var(--bg-secondary)' }}>
                <div className="h-full rounded-full transition-all" style={{ width: `${progress}%`, background: 'var(--primary-color)' }} />
              </div>
            </div>
          )}
        </GlassCard>

        <div className="lg:col-span-2 space-y-4">
          {loading ? (
            <GlassCard hover={false} className="py-10">
              <div className="flex flex-col items-center text-center mb-8">
                <Film size={48} className="mb-4 animate-pulse" style={{ color: 'var(--primary-color)' }} />
                <h3 className="text-xl font-bold mb-1">Video Ban Rahi Hai...</h3>
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>AI script aur storyboard bana raha hai</p>
              </div>
              <div className="max-w-md mx-auto space-y-3">
                {CREATION_STEPS.map((step, index) => {
                  const Icon = step.icon;
                  const done = index < currentStep;
                  const active = index === currentStep;
                  return (
                    <div key={step.label} className="flex items-center gap-3 p-3 rounded-xl"
                      style={{ background: active ? 'rgba(99,102,241,0.15)' : 'var(--bg-secondary)', border: active ? '1px solid var(--primary-color)' : 'none' }}>
                      <div className="w-9 h-9 rounded-lg flex items-center justify-center"
                        style={{ background: done ? 'var(--success)' : active ? 'var(--primary-color)' : 'var(--card-bg)' }}>
                        {done ? <CheckCircle2 size={18} className="text-white" /> : active ? <Loader2 size={18} className="text-white animate-spin" /> : <Icon size={18} />}
                      </div>
                      <p className="text-sm flex-1">{step.label}{active && '...'}</p>
                      {done && <span className="text-xs text-green-400">Done</span>}
                    </div>
                  );
                })}
              </div>
            </GlassCard>
          ) : result ? (
            <div ref={resultsRef} id="video-results" className="space-y-4 scroll-mt-4">
              <div className="p-4 rounded-2xl flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
                style={{ background: 'linear-gradient(135deg, rgba(99,102,241,0.2), rgba(168,85,247,0.15))', border: '2px solid var(--primary-color)' }}>
                <div>
                  <h3 className="text-lg font-bold flex items-center gap-2">
                    <Film size={22} style={{ color: 'var(--primary-color)' }} /> Video Results
                  </h3>
                  <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>
                    Player mein video dekhein • Download • Voice sunen
                  </p>
                </div>
                <div className="flex gap-2 flex-wrap">
                  <Button size="sm" variant="secondary" onClick={() => downloadText('script.txt', result.script)}>
                    <FileText size={16} /> Script
                  </Button>
                  <Button size="sm" variant="secondary" onClick={handlePlayVoice}>
                    {speaking ? <VolumeX size={16} /> : <Volume2 size={16} />}
                    {speaking ? 'Stop Voice' : 'Play Voice'}
                  </Button>
                  <Button size="sm" variant="neon" onClick={handleDownloadVideo} disabled={renderingVideo}>
                    <Download size={16} />
                    {renderingVideo ? `${renderProgress}%` : `Download ${videoFormat}`}
                  </Button>
                </div>
              </div>

              <GlassCard hover={false}>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
                  <h4 className="font-semibold flex items-center gap-2">
                    <Play size={18} style={{ color: 'var(--primary-color)' }} />
                    Video Player
                    <span className="badge badge-success text-xs">Real Video</span>
                  </h4>
                  <div className="flex gap-2">
                    <Button size="sm" variant="secondary" onClick={() => result && generateVideoForPlatform(previewPlatform, result, true)} disabled={renderingVideo}>
                      <RefreshCw size={14} /> Re-render
                    </Button>
                    <Button size="sm" variant="neon" onClick={handleDownloadVideo} disabled={renderingVideo || !currentVideo}>
                      <Download size={14} /> Download
                    </Button>
                  </div>
                </div>
                <RealVideoPlayer
                  videoUrl={currentVideo?.url ?? null}
                  format={result.outputs[previewPlatform]?.format || '16:9'}
                  platform={previewPlatform}
                  loading={renderingVideo}
                  progress={renderProgress}
                  onRegenerate={() => result && generateVideoForPlatform(previewPlatform, result, true)}
                />
              </GlassCard>

              <GlassCard hover={false}>
                <h4 className="font-semibold mb-3"><CheckCircle2 size={18} className="inline text-green-400 mr-2" />Script</h4>
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{result.script}</p>
              </GlassCard>

              {result.voiceover && (
                <GlassCard hover={false}>
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold"><Mic size={18} className="inline mr-2" style={{ color: 'var(--primary-color)' }} />Voiceover</h4>
                    <Button size="sm" variant="secondary" onClick={handlePlayVoice}>
                      {speaking ? <VolumeX size={14} /> : <Volume2 size={14} />} Listen
                    </Button>
                  </div>
                  <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{result.voiceover}</p>
                </GlassCard>
              )}

              <GlassCard hover={false}>
                <h4 className="font-semibold mb-3"><Clapperboard size={18} className="inline mr-2" />Storyboard ({result.storyboard.length} scenes)</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {result.storyboard.map((scene) => (
                    <div key={scene.scene} className="p-4 rounded-xl" style={{ background: 'var(--bg-secondary)' }}>
                      <span className="badge badge-primary mr-2">Scene {scene.scene}</span>
                      <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{scene.duration}</span>
                      <p className="text-sm mt-2">{scene.description}</p>
                    </div>
                  ))}
                </div>
              </GlassCard>

              <div>
                <h4 className="font-semibold mb-3"><Video size={18} className="inline mr-2" />Platform Videos — Click to switch</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {Object.entries(result.outputs).map(([platform, info]) => {
                    const ready = platformsReady[platform];
                    const selected = previewPlatform === platform;
                    const hasVideo = !!videoCache[platform];
                    return (
                      <button key={platform} type="button" onClick={() => ready && setPreviewPlatform(platform)} className="text-left">
                        <GlassCard className={`text-center !p-4 w-full ${selected ? 'ring-2 ring-[var(--primary-color)]' : ''}`} hover={false}>
                          {hasVideo ? <CheckCircle2 size={24} className="mx-auto mb-2 text-green-400" /> : ready ? <Play size={24} className="mx-auto mb-2" style={{ color: 'var(--primary-color)' }} /> : <Loader2 size={24} className="mx-auto mb-2 animate-spin" />}
                          <p className="font-medium capitalize text-sm">{platform}</p>
                          <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>{info.duration} • {info.format}</p>
                          <span className={`badge mt-2 ${hasVideo ? 'badge-success' : ready ? 'badge-primary' : ''}`}>
                            {hasVideo ? 'Video Ready' : ready ? 'Select' : 'Loading...'}
                          </span>
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
              <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Source likho aur Create Video dabao</p>
            </GlassCard>
          )}
        </div>
      </div>
    </ModuleLayout>
  );
}
