export interface VideoScene {
  scene: number;
  description: string;
  duration: string;
}

export interface RenderVideoOptions {
  scenes: VideoScene[];
  platform: string;
  format: string;
  title?: string;
  source?: string;
  onProgress?: (percent: number) => void;
}

export interface RenderVideoResult {
  blob: Blob;
  extension: 'mp4' | 'webm';
  mimeType: string;
}

function parseDurationMs(duration: string): number {
  const match = duration.match(/(\d+(?:\.\d+)?)/);
  const seconds = match ? Number(match[1]) : 4;
  return Math.max(2, seconds) * 1000;
}

function getVideoSize(format: string) {
  if (format.includes('9:16')) {
    return { width: 720, height: 1280 };
  }
  return { width: 1280, height: 720 };
}

function getSupportedMimeType(): string {
  const types = [
    'video/mp4;codecs=avc1',
    'video/mp4',
    'video/webm;codecs=vp9',
    'video/webm;codecs=vp8',
    'video/webm',
  ];
  return types.find((t) => MediaRecorder.isTypeSupported(t)) || 'video/webm';
}

function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number
): number {
  const words = text.split(/\s+/);
  let line = '';
  let currentY = y;

  for (const word of words) {
    const testLine = line ? `${line} ${word}` : word;
    if (ctx.measureText(testLine).width > maxWidth && line) {
      ctx.fillText(line, x, currentY);
      line = word;
      currentY += lineHeight;
    } else {
      line = testLine;
    }
  }
  if (line) ctx.fillText(line, x, currentY);
  return currentY;
}

function drawFrame(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  data: {
    scene: VideoScene;
    platform: string;
    title: string;
    source: string;
    sceneIndex: number;
    totalScenes: number;
    sceneProgress: number;
  }
) {
  const { scene, platform, title, source, sceneIndex, totalScenes, sceneProgress } = data;
  const isVertical = height > width;
  const padding = isVertical ? 48 : 64;

  const gradient = ctx.createLinearGradient(0, 0, width, height);
  gradient.addColorStop(0, '#1e1b4b');
  gradient.addColorStop(0.5, '#312e81');
  gradient.addColorStop(1, '#581c87');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);

  ctx.fillStyle = 'rgba(255,255,255,0.06)';
  ctx.beginPath();
  ctx.arc(width * 0.85, height * 0.15, width * 0.25, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = 'rgba(99,102,241,0.25)';
  ctx.fillRect(0, 0, width, isVertical ? 120 : 80);

  ctx.fillStyle = '#ffffff';
  ctx.font = `bold ${isVertical ? 22 : 28}px Inter, Arial, sans-serif`;
  ctx.fillText('AI Business Growth OS', padding, isVertical ? 52 : 48);

  ctx.fillStyle = '#c4b5fd';
  ctx.font = `${isVertical ? 14 : 16}px Inter, Arial, sans-serif`;
  ctx.fillText(`${platform.toUpperCase()} • ${title}`, padding, isVertical ? 82 : 72);

  ctx.fillStyle = '#6366f1';
  ctx.fillRect(padding, isVertical ? 100 : 88, 80, 4);

  ctx.fillStyle = '#a5b4fc';
  ctx.font = `600 ${isVertical ? 16 : 18}px Inter, Arial, sans-serif`;
  ctx.fillText(`Scene ${scene.scene} of ${totalScenes}`, padding, isVertical ? 140 : 120);

  ctx.fillStyle = '#ffffff';
  ctx.font = `bold ${isVertical ? 26 : 34}px Inter, Arial, sans-serif`;
  const descY = isVertical ? 200 : 180;
  wrapText(ctx, scene.description, padding, descY, width - padding * 2, isVertical ? 36 : 44);

  if (source) {
    ctx.fillStyle = 'rgba(148,163,184,0.9)';
    ctx.font = `${isVertical ? 13 : 15}px Inter, Arial, sans-serif`;
    const sourceShort = source.length > 50 ? `${source.slice(0, 47)}...` : source;
    ctx.fillText(sourceShort, padding, height - (isVertical ? 100 : 80));
  }

  const barY = height - (isVertical ? 48 : 36);
  const barW = width - padding * 2;
  ctx.fillStyle = 'rgba(255,255,255,0.15)';
  ctx.fillRect(padding, barY, barW, 8);

  const totalProgress = (sceneIndex + sceneProgress) / totalScenes;
  ctx.fillStyle = '#6366f1';
  ctx.fillRect(padding, barY, barW * totalProgress, 8);

  ctx.fillStyle = '#94a3b8';
  ctx.font = `${isVertical ? 12 : 14}px Inter, Arial, sans-serif`;
  ctx.fillText(scene.duration, width - padding - 30, barY - 8);
}

function waitFrame() {
  return new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
}

export async function renderStoryboardVideo(options: RenderVideoOptions): Promise<RenderVideoResult> {
  const { scenes, platform, format, title = 'Marketing Video', source = '', onProgress } = options;

  if (!scenes.length) {
    throw new Error('No storyboard scenes to render');
  }

  const { width, height } = getVideoSize(format);
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas not supported');

  const mimeType = getSupportedMimeType();
  const extension: 'mp4' | 'webm' = mimeType.includes('mp4') ? 'mp4' : 'webm';
  const stream = canvas.captureStream(30);
  const recorder = new MediaRecorder(stream, {
    mimeType,
    videoBitsPerSecond: 2_500_000,
  });

  const chunks: Blob[] = [];
  recorder.ondataavailable = (event) => {
    if (event.data.size > 0) chunks.push(event.data);
  };

  const recorded = new Promise<Blob>((resolve, reject) => {
    recorder.onstop = () => resolve(new Blob(chunks, { type: mimeType }));
    recorder.onerror = () => reject(new Error('Video recording failed'));
  });

  recorder.start(200);
  onProgress?.(2);

  const fps = 30;
  for (let i = 0; i < scenes.length; i++) {
    const scene = scenes[i];
    const durationMs = parseDurationMs(scene.duration);
    const frameCount = Math.max(1, Math.ceil((durationMs / 1000) * fps));

    for (let frame = 0; frame < frameCount; frame++) {
      const sceneProgress = frame / frameCount;
      drawFrame(ctx, width, height, {
        scene,
        platform,
        title,
        source,
        sceneIndex: i,
        totalScenes: scenes.length,
        sceneProgress,
      });
      onProgress?.(Math.min(99, Math.round(((i + sceneProgress) / scenes.length) * 100)));
      await waitFrame();
      await new Promise((r) => setTimeout(r, 1000 / fps));
    }
  }

  recorder.stop();
  const blob = await recorded;
  onProgress?.(100);

  return { blob, extension, mimeType };
}

export function downloadVideoFile(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

export function getVideoFormatLabel(mimeType: string): string {
  return mimeType.includes('mp4') ? 'MP4' : 'WebM';
}
