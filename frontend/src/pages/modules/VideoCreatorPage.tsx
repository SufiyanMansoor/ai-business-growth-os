import { useCallback, useEffect, useRef, useState } from 'react';
import {
  Video, Play, CheckCircle2, Loader2, Film, Mic, Clapperboard,
  Download, FileText, ChevronDown, Volume2, VolumeX, RefreshCw,
  Building2, Lightbulb, Hash, Share2, Music, Target, Copy,
} from 'lucide-react';
import ModuleLayout from '@/components/ui/ModuleLayout';
import GlassCard from '@/components/ui/GlassCard';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import { createVideo } from '@/lib/api';
import { buildVideoContent, formatFullMarketingReport, type VideoMarketingPackage } from '@/lib/videoContent';
import { getSoftwareDemoVideos, getSoftwareProduct, type SoftwareDemoVideo } from '@/lib/softwareDemoEngine';
import { renderSoftwareDemoVideo } from '@/lib/softwareDemoRender';
import {
  downloadVideoFile,
  getVideoFormatLabel,
  speakVoiceover,
  stopVoiceover,
} from '@/lib/videoExport';

interface StoryboardScene {
  scene: number;
  description: string;
  duration: string;
  headline?: string;
  bullets?: string[];
}

interface PlatformOutput {
  status: string;
  duration: string;
  format: string;
}

interface VideoResult extends VideoMarketingPackage {
  outputs: Record<string, PlatformOutput>;
  captions?: { enabled: boolean; languages: string[] };
}

interface CachedVideo {
  url: string;
  extension: string;
  mimeType: string;
}

const CREATION_STEPS = [
  { label: 'Analyzing software product', icon: Building2 },
  { label: 'Building module demo scripts', icon: Film },
  { label: 'Creating UI walkthrough scenes', icon: Clapperboard },
  { label: 'Preparing multiple demo videos', icon: Video },
  { label: 'Rendering software demo player', icon: Play },
];

const DEFAULT_OUTPUTS: Record<string, PlatformOutput> = {
  youtube: { status: 'ready', duration: '60s', format: '16:9' },
  instagram: { status: 'ready', duration: '30s', format: '9:16' },
  tiktok: { status: 'ready', duration: '15s', format: '9:16' },
  linkedin: { status: 'ready', duration: '45s', format: '16:9' },
};

function normalizeVideoResult(data: unknown): {
  script: string;
  storyboard: StoryboardScene[];
  voiceover: string;
  outputs: Record<string, PlatformOutput>;
  captions?: { enabled: boolean; languages: string[] };
} {
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
          headline: scene.headline ? String(scene.headline) : undefined,
          bullets: Array.isArray(scene.bullets) ? scene.bullets.map(String) : undefined,
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

function enrichVideoResult(
  _data: unknown,
  source: string,
  sourceType: string,
  language: string,
  voice: string
): VideoResult {
  const normalized = normalizeVideoResult(_data);
  const built = buildVideoContent(source, sourceType, language, voice);
  return {
    ...built,
    voiceover: built.voiceover.replace(/\s*\[.*\]$/, ''),
    outputs: normalized.outputs,
    captions: normalized.captions,
  };
}

function copyText(text: string) {
  navigator.clipboard.writeText(text).catch(() => undefined);
}

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
  demoTitle,
  demoSubtitle,
  loading,
  progress,
  stage,
  onRegenerate,
}: {
  videoUrl: string | null;
  demoTitle: string;
  demoSubtitle: string;
  loading: boolean;
  progress: number;
  stage?: string;
  onRegenerate: () => void;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);

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
        <p className="font-semibold">Software demo render ho rahi hai... {progress}%</p>
        {stage && (
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{stage}</p>
        )}
        <div className="w-full max-w-md h-2 rounded-full overflow-hidden" style={{ background: 'var(--bg-secondary)' }}>
          <div className="h-full transition-all duration-300 rounded-full" style={{ width: `${progress}%`, background: 'var(--primary-color)' }} />
        </div>
        <p className="text-xs" style={{ color: 'var(--text-muted)' }}>UI walkthrough + sidebar navigation — har module alag demo</p>
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
      <div className={`relative rounded-2xl overflow-hidden border-2 w-full max-w-2xl mx-auto`}
        style={{ borderColor: 'var(--primary-color)', background: '#000' }}>
        <span className="absolute top-3 left-3 z-10 badge badge-primary">{demoTitle}</span>
        <span className="absolute top-3 right-3 z-10 badge badge-success">● SOFTWARE DEMO</span>
        <video
          ref={videoRef}
          src={videoUrl}
          controls
          playsInline
          loop
          className="w-full aspect-video"
          style={{ display: 'block' }}
        />
      </div>
      <p className="text-xs text-center" style={{ color: 'var(--text-muted)' }}>
        ✅ {demoSubtitle} — Live UI walkthrough with sidebar & stats
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
  const [softwareDemos, setSoftwareDemos] = useState<SoftwareDemoVideo[]>([]);
  const [activeDemoId, setActiveDemoId] = useState('full-tour');
  const [demoVideoCache, setDemoVideoCache] = useState<Record<string, CachedVideo>>({});
  const [renderingVideo, setRenderingVideo] = useState(false);
  const [renderProgress, setRenderProgress] = useState(0);
  const [renderStage, setRenderStage] = useState('');
  const [videoFormat, setVideoFormat] = useState('WebM');
  const [speaking, setSpeaking] = useState(false);
  const resultsRef = useRef<HTMLDivElement>(null);
  const renderLock = useRef(false);

  const generateDemoVideo = useCallback(async (demoId: string, fastMode = true): Promise<CachedVideo | null> => {
    const demo = softwareDemos.find((d) => d.id === demoId);
    if (!demo || renderLock.current) return null;
    renderLock.current = true;
    setRenderingVideo(true);
    setRenderProgress(0);
    setRenderStage('Building software UI demo...');

    try {
      const product = getSoftwareProduct(source, sourceType);
      const { blob, extension, mimeType } = await renderSoftwareDemoVideo({
        scenes: demo.scenes,
        productName: product.name,
        website: product.website,
        modules: product.modules,
        format: '16:9',
        fastMode,
        onProgress: setRenderProgress,
        onStage: setRenderStage,
      });

      const url = URL.createObjectURL(blob);
      const cached: CachedVideo = { url, extension, mimeType };
      setVideoFormat(getVideoFormatLabel(mimeType));
      setDemoVideoCache((prev) => {
        if (prev[demoId]?.url) URL.revokeObjectURL(prev[demoId].url);
        return { ...prev, [demoId]: cached };
      });
      return cached;
    } catch (err) {
      console.error(err);
      return null;
    } finally {
      setRenderingVideo(false);
      renderLock.current = false;
    }
  }, [source, sourceType, softwareDemos]);

  useEffect(() => {
    if (!result || loading || !softwareDemos.length) return;
    setActiveDemoId('full-tour');
    setDemoVideoCache({});
    setTimeout(() => resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 600);
    setTimeout(() => generateDemoVideo('full-tour', true), 1200);
  }, [result, loading, softwareDemos, generateDemoVideo]);

  useEffect(() => {
    if (!softwareDemos.length || demoVideoCache[activeDemoId] || renderingVideo) return;
    generateDemoVideo(activeDemoId, true);
  }, [activeDemoId, softwareDemos, demoVideoCache, renderingVideo, generateDemoVideo]);

  const demoCacheRef = useRef<Record<string, CachedVideo>>({});
  demoCacheRef.current = demoVideoCache;

  useEffect(() => () => {
    Object.values(demoCacheRef.current).forEach((v) => URL.revokeObjectURL(v.url));
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
    setDemoVideoCache({});
    setSoftwareDemos([]);
    setCurrentStep(0);
    setProgress(5);

    const progressTask = runProgressAnimation();
    try {
      const data = await createVideo({ source, type: sourceType, language, voice });
      await progressTask;
      setProgress(100);
      setResult(enrichVideoResult(data, source, sourceType, language, voice));
      setSoftwareDemos(getSoftwareDemoVideos(source, sourceType));
      setIsReady(true);
    } catch {
      await progressTask;
      setProgress(100);
      setResult(enrichVideoResult(null, source, sourceType, language, voice));
      setSoftwareDemos(getSoftwareDemoVideos(source, sourceType));
      setIsReady(true);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadVideo = async () => {
    if (!result || renderingVideo) return;

    let cached: CachedVideo | null | undefined = demoVideoCache[activeDemoId];
    if (!cached) {
      cached = await generateDemoVideo(activeDemoId, false);
    }
    if (!cached) {
      alert('Demo render failed. Chrome browser use karein.');
      return;
    }

    const demo = softwareDemos.find((d) => d.id === activeDemoId);
    const blob = await fetch(cached.url).then((r) => r.blob());
    downloadVideoFile(blob, `software-demo-${demo?.moduleId || activeDemoId}-${Date.now()}.${cached.extension}`);
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

  const activeDemo = softwareDemos.find((d) => d.id === activeDemoId);
  const currentVideo = demoVideoCache[activeDemoId];

  return (
    <ModuleLayout
      title="AI Video Marketing Creator"
      description="Software product demo videos — har module ka alag walkthrough"
      actions={
        <Button onClick={handleCreate} loading={loading} disabled={!source || loading}>
          <Video size={18} /> {loading ? 'Creating Demos...' : 'Create Software Demos'}
        </Button>
      }
    >
      {isReady && result && !loading && (
        <GlassCard hover={false} className="!border-green-500/40 animate-fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <CheckCircle2 size={28} className="text-green-400 shrink-0" />
            <div>
              <p className="font-semibold text-green-400">{softwareDemos.length} Software Demo Videos Ready!</p>
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                Har module ka alag UI walkthrough demo — neeche se switch karein aur download karein.
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
            <Select label="Input Type" options={[
              { value: 'url', label: 'Company Website URL' },
              { value: 'linkedin', label: 'LinkedIn Profile / Company' },
              { value: 'description', label: 'Business Description' },
              { value: 'github', label: 'GitHub Repo' },
            ]} value={sourceType} onChange={(e) => setSourceType(e.target.value)} />
            <Input label="Business Input" value={source} onChange={(e) => setSource(e.target.value)}
              placeholder={
                sourceType === 'linkedin' ? 'linkedin.com/company/your-brand'
                : sourceType === 'url' ? 'https://yourcompany.com'
                : sourceType === 'github' ? 'github.com/user/repo'
                : 'Describe your business, services & target market...'
              } />
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
                    <Film size={22} style={{ color: 'var(--primary-color)' }} /> Software Demo Videos
                  </h3>
                  <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>
                    {softwareDemos.length} demos — Full tour + har module alag • Download karein
                  </p>
                </div>
                <div className="flex gap-2 flex-wrap">
                  <Button size="sm" variant="secondary" onClick={() => downloadText('video-marketing-report.txt', formatFullMarketingReport(result))}>
                    <FileText size={16} /> Full Report
                  </Button>
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
                    Demo Player
                    <span className="badge badge-success text-xs">Software Demo</span>
                  </h4>
                  <div className="flex gap-2">
                    <Button size="sm" variant="secondary" onClick={() => generateDemoVideo(activeDemoId, true)} disabled={renderingVideo}>
                      <RefreshCw size={14} /> Re-render
                    </Button>
                    <Button size="sm" variant="neon" onClick={handleDownloadVideo} disabled={renderingVideo || !currentVideo}>
                      <Download size={14} /> Download
                    </Button>
                  </div>
                </div>
                <RealVideoPlayer
                  videoUrl={currentVideo?.url ?? null}
                  demoTitle={activeDemo?.title || 'Software Demo'}
                  demoSubtitle={activeDemo?.subtitle || 'Module walkthrough'}
                  loading={renderingVideo}
                  progress={renderProgress}
                  stage={renderStage}
                  onRegenerate={() => generateDemoVideo(activeDemoId, true)}
                />
              </GlassCard>

              <div>
                <h4 className="font-semibold mb-3">
                  <Video size={18} className="inline mr-2" />
                  All Demo Videos ({softwareDemos.length}) — Click to preview
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {softwareDemos.map((demo) => {
                    const selected = activeDemoId === demo.id;
                    const hasVideo = !!demoVideoCache[demo.id];
                    const isRendering = renderingVideo && selected;
                    return (
                      <button key={demo.id} type="button" onClick={() => setActiveDemoId(demo.id)} className="text-left">
                        <GlassCard className={`text-center !p-3 w-full ${selected ? 'ring-2 ring-[var(--primary-color)]' : ''}`} hover={false}>
                          <span className="text-2xl block mb-1">{demo.icon}</span>
                          {isRendering ? (
                            <Loader2 size={20} className="mx-auto mb-1 animate-spin" style={{ color: 'var(--primary-color)' }} />
                          ) : hasVideo ? (
                            <CheckCircle2 size={20} className="mx-auto mb-1 text-green-400" />
                          ) : (
                            <Play size={20} className="mx-auto mb-1 opacity-40" />
                          )}
                          <p className="font-medium text-xs leading-tight">{demo.title}</p>
                          <p className="text-xs mt-1 opacity-60">{demo.duration}</p>
                          <span className={`badge mt-1 text-xs ${hasVideo ? 'badge-success' : selected ? 'badge-primary' : ''}`}>
                            {isRendering ? `${renderProgress}%` : hasVideo ? 'Ready' : demo.isFullTour ? 'Full Tour' : 'Module'}
                          </span>
                        </GlassCard>
                      </button>
                    );
                  })}
                </div>
              </div>

              <GlassCard hover={false}>
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <Building2 size={18} style={{ color: 'var(--primary-color)' }} /> Business Summary
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                  <div className="p-3 rounded-xl" style={{ background: 'var(--bg-secondary)' }}>
                    <p className="text-xs mb-1" style={{ color: 'var(--text-muted)' }}>Company Name</p>
                    <p className="font-semibold">{result.businessSummary.companyName}</p>
                  </div>
                  <div className="p-3 rounded-xl" style={{ background: 'var(--bg-secondary)' }}>
                    <p className="text-xs mb-1" style={{ color: 'var(--text-muted)' }}>Industry</p>
                    <p className="font-semibold">{result.businessSummary.industry}</p>
                  </div>
                  <div className="p-3 rounded-xl sm:col-span-2" style={{ background: 'var(--bg-secondary)' }}>
                    <p className="text-xs mb-1" style={{ color: 'var(--text-muted)' }}>Main Services</p>
                    <p style={{ color: 'var(--text-secondary)' }}>{result.businessSummary.mainServices.join(' • ')}</p>
                  </div>
                  <div className="p-3 rounded-xl sm:col-span-2" style={{ background: 'var(--bg-secondary)' }}>
                    <p className="text-xs mb-1" style={{ color: 'var(--text-muted)' }}>Target Audience</p>
                    <p style={{ color: 'var(--text-secondary)' }}>{result.businessSummary.targetAudience}</p>
                  </div>
                </div>
              </GlassCard>

              <GlassCard hover={false}>
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <Lightbulb size={18} className="text-yellow-400" /> Video Concept & Hook
                </h4>
                <div className="space-y-3 text-sm">
                  <div className="p-3 rounded-xl" style={{ background: 'var(--bg-secondary)' }}>
                    <p className="text-xs mb-1 font-medium" style={{ color: 'var(--primary-color)' }}>Marketing Angle</p>
                    <p style={{ color: 'var(--text-secondary)' }}>{result.videoConcept}</p>
                  </div>
                  <div className="p-3 rounded-xl border border-yellow-500/30" style={{ background: 'rgba(251,191,36,0.08)' }}>
                    <p className="text-xs mb-1 font-medium text-yellow-400">Hook (First 5 Seconds)</p>
                    <p className="font-semibold">{result.hook}</p>
                  </div>
                </div>
              </GlassCard>

              <GlassCard hover={false}>
                <h4 className="font-semibold mb-3"><CheckCircle2 size={18} className="inline text-green-400 mr-2" />60-Second Video Script</h4>
                <pre className="text-sm whitespace-pre-wrap font-sans" style={{ color: 'var(--text-secondary)' }}>{result.script}</pre>
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
                <h4 className="font-semibold mb-3"><Clapperboard size={18} className="inline mr-2" />Scene Breakdown ({result.scenes.length} scenes • 60s)</h4>
                <div className="space-y-4">
                  {result.scenes.map((scene) => (
                    <div key={scene.scene} className="p-4 rounded-xl border" style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border-color)' }}>
                      <div className="flex items-center gap-2 mb-3">
                        <span className="badge badge-primary">Scene {scene.scene}</span>
                        <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{scene.duration}</span>
                      </div>
                      <div className="grid grid-cols-1 gap-2 text-sm">
                        <div><span className="font-medium text-purple-400">Visual: </span><span style={{ color: 'var(--text-secondary)' }}>{scene.visual}</span></div>
                        <div><span className="font-medium text-blue-400">Voice-over: </span><span style={{ color: 'var(--text-secondary)' }}>{scene.voiceover}</span></div>
                        <div><span className="font-medium text-yellow-400">On-screen Text: </span><span style={{ color: 'var(--text-secondary)' }}>{scene.onScreenText}</span></div>
                        <div><span className="font-medium text-green-400">Caption: </span><span style={{ color: 'var(--text-secondary)' }}>{scene.caption}</span></div>
                        <div className="p-2 rounded-lg mt-1" style={{ background: 'rgba(99,102,241,0.1)' }}>
                          <span className="font-medium text-indigo-400">AI Image Prompt: </span>
                          <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{scene.imagePrompt}</span>
                        </div>
                        <div className="p-2 rounded-lg" style={{ background: 'rgba(168,85,247,0.1)' }}>
                          <span className="font-medium text-violet-400">AI Video Prompt: </span>
                          <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{scene.videoPrompt}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </GlassCard>

              <GlassCard hover={false}>
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <Music size={18} style={{ color: 'var(--primary-color)' }} /> Background Music & CTA
                </h4>
                <div className="space-y-3 text-sm">
                  <div className="p-3 rounded-xl" style={{ background: 'var(--bg-secondary)' }}>
                    <p className="text-xs mb-1 font-medium" style={{ color: 'var(--text-muted)' }}>Recommended Music Style</p>
                    <p style={{ color: 'var(--text-secondary)' }}>{result.backgroundMusic}</p>
                  </div>
                  <div className="p-3 rounded-xl border border-green-500/30" style={{ background: 'rgba(34,197,94,0.08)' }}>
                    <p className="text-xs mb-1 font-medium text-green-400 flex items-center gap-1"><Target size={14} /> Call To Action</p>
                    <p className="font-semibold">{result.cta}</p>
                  </div>
                </div>
              </GlassCard>

              <GlassCard hover={false}>
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <Share2 size={18} style={{ color: 'var(--primary-color)' }} /> Social Media Versions
                </h4>
                <div className="space-y-3">
                  {(['linkedin', 'facebook', 'instagram', 'youtube'] as const).map((platform) => (
                    <div key={platform} className="p-3 rounded-xl relative" style={{ background: 'var(--bg-secondary)' }}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="badge badge-primary capitalize">{platform}</span>
                        <button type="button" onClick={() => copyText(result.socialMedia[platform])} className="text-xs flex items-center gap-1 opacity-60 hover:opacity-100">
                          <Copy size={12} /> Copy
                        </button>
                      </div>
                      <p className="text-sm whitespace-pre-wrap" style={{ color: 'var(--text-secondary)' }}>{result.socialMedia[platform]}</p>
                    </div>
                  ))}
                </div>
              </GlassCard>

              <GlassCard hover={false}>
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold flex items-center gap-2">
                    <Hash size={18} style={{ color: 'var(--primary-color)' }} /> Hashtags ({result.hashtags.length})
                  </h4>
                  <Button size="sm" variant="secondary" onClick={() => copyText(result.hashtags.join(' '))}>
                    <Copy size={14} /> Copy All
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {result.hashtags.map((tag) => (
                    <span key={tag} className="badge badge-primary text-xs cursor-pointer" onClick={() => copyText(tag)}>{tag}</span>
                  ))}
                </div>
              </GlassCard>
            </div>
          ) : (
            <GlassCard hover={false} className="text-center py-20">
              <Video size={48} className="mx-auto mb-4 opacity-30" />
              <p className="font-medium mb-2">Software demo videos banayein</p>
              <p className="text-sm" style={{ color: 'var(--text-muted)' }}>GitHub repo ya business URL dalo — har module ka demo auto-generate hoga</p>
            </GlassCard>
          )}
        </div>
      </div>
    </ModuleLayout>
  );
}
