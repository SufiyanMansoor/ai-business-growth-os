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
  hookLine?: string;
  fastMode?: boolean;
  onProgress?: (percent: number) => void;
}

export interface RenderVideoResult {
  blob: Blob;
  extension: 'mp4' | 'webm';
  mimeType: string;
}

function parseDurationMs(duration: string, fastMode: boolean): number {
  const match = duration.match(/(\d+(?:\.\d+)?)/);
  const seconds = match ? Number(match[1]) : 4;
  const ms = Math.max(2, seconds) * 1000;
  return fastMode ? Math.min(ms, 2500) : ms;
}

function getVideoSize(format: string, fastMode: boolean) {
  if (format.includes('9:16')) {
    return fastMode ? { width: 540, height: 960 } : { width: 720, height: 1280 };
  }
  return fastMode ? { width: 960, height: 540 } : { width: 1280, height: 720 };
}

function getSupportedMimeType(): string {
  const types = [
    'video/webm;codecs=vp9',
    'video/webm;codecs=vp8',
    'video/webm',
    'video/mp4;codecs=avc1',
    'video/mp4',
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
    hookLine: string;
    sceneIndex: number;
    totalScenes: number;
    sceneProgress: number;
    globalTime: number;
  }
) {
  const { scene, platform, title, source, hookLine, sceneIndex, totalScenes, sceneProgress, globalTime } = data;
  const isVertical = height > width;
  const padding = isVertical ? 40 : 56;
  const fade = sceneProgress < 0.15 ? sceneProgress / 0.15 : sceneProgress > 0.85 ? (1 - sceneProgress) / 0.15 : 1;
  const pulse = 0.5 + Math.sin(globalTime * 3) * 0.05;

  const gradient = ctx.createLinearGradient(0, 0, width, height);
  gradient.addColorStop(0, '#0f0c29');
  gradient.addColorStop(0.4, '#302b63');
  gradient.addColorStop(1, '#24243e');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);

  for (let i = 0; i < 8; i++) {
    const x = (Math.sin(globalTime + i * 1.2) * 0.5 + 0.5) * width;
    const y = (Math.cos(globalTime * 0.7 + i) * 0.5 + 0.5) * height;
    ctx.fillStyle = `rgba(99,102,241,${0.03 + i * 0.008})`;
    ctx.beginPath();
    ctx.arc(x, y, 40 + i * 20, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.fillStyle = `rgba(99,102,241,${0.35 * pulse})`;
  ctx.fillRect(0, 0, width, isVertical ? 100 : 72);

  ctx.globalAlpha = fade;
  ctx.fillStyle = '#ffffff';
  ctx.font = `bold ${isVertical ? 20 : 26}px Inter, Arial, sans-serif`;
  ctx.fillText('AI Business Growth OS', padding, isVertical ? 44 : 40);

  ctx.fillStyle = '#c4b5fd';
  ctx.font = `${isVertical ? 13 : 15}px Inter, Arial, sans-serif`;
  ctx.fillText(`${platform.toUpperCase()} • ${title}`, padding, isVertical ? 72 : 64);

  ctx.fillStyle = '#6366f1';
  ctx.fillRect(padding, isVertical ? 88 : 76, 60 * pulse, 3);

  ctx.fillStyle = '#a5b4fc';
  ctx.font = `600 ${isVertical ? 14 : 16}px Inter, Arial, sans-serif`;
  ctx.fillText(`Scene ${scene.scene} / ${totalScenes}`, padding, isVertical ? 120 : 100);

  if (sceneIndex === 0 && hookLine) {
    ctx.fillStyle = '#fbbf24';
    ctx.font = `bold ${isVertical ? 15 : 18}px Inter, Arial, sans-serif`;
    wrapText(ctx, hookLine, padding, isVertical ? 150 : 130, width - padding * 2, isVertical ? 22 : 26);
  }

  ctx.fillStyle = '#ffffff';
  ctx.font = `bold ${isVertical ? 22 * fade : 28 * fade}px Inter, Arial, sans-serif`;
  const descY = isVertical ? (sceneIndex === 0 && hookLine ? 220 : 160) : (sceneIndex === 0 && hookLine ? 190 : 150);
  wrapText(ctx, scene.description, padding, descY, width - padding * 2, isVertical ? 32 : 38);

  if (source) {
    ctx.fillStyle = 'rgba(148,163,184,0.85)';
    ctx.font = `${isVertical ? 12 : 14}px Inter, Arial, sans-serif`;
    const sourceShort = source.length > 45 ? `${source.slice(0, 42)}...` : source;
    ctx.fillText(sourceShort, padding, height - (isVertical ? 72 : 56));
  }

  const barY = height - (isVertical ? 36 : 28);
  const barW = width - padding * 2;
  ctx.fillStyle = 'rgba(255,255,255,0.12)';
  ctx.fillRect(padding, barY, barW, 6);
  const totalProgress = (sceneIndex + sceneProgress) / totalScenes;
  ctx.fillStyle = '#6366f1';
  ctx.fillRect(padding, barY, barW * totalProgress, 6);

  ctx.fillStyle = '#94a3b8';
  ctx.font = `${isVertical ? 11 : 13}px Inter, Arial, sans-serif`;
  ctx.fillText(scene.duration, width - padding - 28, barY - 6);

  ctx.globalAlpha = 1;
}

function waitFrame() {
  return new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
}

export async function renderStoryboardVideo(options: RenderVideoOptions): Promise<RenderVideoResult> {
  const {
    scenes,
    platform,
    format,
    title = 'Marketing Video',
    source = '',
    hookLine = '',
    fastMode = false,
    onProgress,
  } = options;

  if (!scenes.length) throw new Error('No storyboard scenes to render');

  const { width, height } = getVideoSize(format, fastMode);
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  canvas.style.cssText = 'position:fixed;left:-9999px;top:0;pointer-events:none;';
  document.body.appendChild(canvas);

  const ctx = canvas.getContext('2d', { alpha: false });
  if (!ctx) {
    document.body.removeChild(canvas);
    throw new Error('Canvas not supported');
  }

  const mimeType = getSupportedMimeType();
  const extension: 'mp4' | 'webm' = mimeType.includes('mp4') ? 'mp4' : 'webm';
  const stream = canvas.captureStream(fastMode ? 24 : 30);

  let recorder: MediaRecorder;
  try {
    recorder = new MediaRecorder(stream, { mimeType, videoBitsPerSecond: fastMode ? 1_500_000 : 2_500_000 });
  } catch {
    document.body.removeChild(canvas);
    throw new Error('Video recording not supported in this browser. Use Chrome.');
  }

  const chunks: Blob[] = [];
  recorder.ondataavailable = (e) => {
    if (e.data.size > 0) chunks.push(e.data);
  };

  const recorded = new Promise<Blob>((resolve, reject) => {
    recorder.onstop = () => {
      const blob = new Blob(chunks, { type: mimeType });
      if (blob.size < 1000) reject(new Error('Video file too small — try Chrome browser'));
      else resolve(blob);
    };
    recorder.onerror = () => reject(new Error('Recording failed'));
  });

  recorder.start(250);
  onProgress?.(5);

  const sceneDurations = scenes.map((s) => parseDurationMs(s.duration, fastMode));
  const totalDuration = sceneDurations.reduce((a, b) => a + b, 0);
  const startTime = performance.now();
  let lastProgress = 5;

  while (true) {
    const elapsed = performance.now() - startTime;
    if (elapsed >= totalDuration) break;

    let acc = 0;
    let sceneIndex = 0;
    let sceneProgress = 0;
    for (let i = 0; i < scenes.length; i++) {
      if (elapsed < acc + sceneDurations[i]) {
        sceneIndex = i;
        sceneProgress = (elapsed - acc) / sceneDurations[i];
        break;
      }
      acc += sceneDurations[i];
    }

    drawFrame(ctx, width, height, {
      scene: scenes[sceneIndex],
      platform,
      title,
      source,
      hookLine,
      sceneIndex,
      totalScenes: scenes.length,
      sceneProgress,
      globalTime: elapsed / 1000,
    });

    const pct = Math.min(99, Math.round(5 + (elapsed / totalDuration) * 94));
    if (pct > lastProgress) {
      lastProgress = pct;
      onProgress?.(pct);
    }
    await waitFrame();
  }

  drawFrame(ctx, width, height, {
    scene: scenes[scenes.length - 1],
    platform,
    title,
    source,
    hookLine,
    sceneIndex: scenes.length - 1,
    totalScenes: scenes.length,
    sceneProgress: 1,
    globalTime: totalDuration / 1000,
  });

  await delay(400);
  if (recorder.state === 'recording') recorder.requestData();
  recorder.stop();

  try {
    const blob = await recorded;
    onProgress?.(100);
    return { blob, extension, mimeType };
  } finally {
    document.body.removeChild(canvas);
  }
}

function delay(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

export function downloadVideoFile(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  setTimeout(() => URL.revokeObjectURL(url), 5000);
}

export function getVideoFormatLabel(mimeType: string): string {
  return mimeType.includes('mp4') ? 'MP4' : 'WebM';
}

export function speakVoiceover(text: string, voiceType: string) {
  if (!('speechSynthesis' in window)) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text.slice(0, 300));
  utterance.rate = 0.92;
  utterance.pitch = voiceType === 'female' ? 1.1 : 0.85;
  const voices = window.speechSynthesis.getVoices();
  const preferred = voices.find((v) =>
    voiceType === 'female' ? v.name.toLowerCase().includes('female') || v.name.includes('Zira') : v.name.toLowerCase().includes('male') || v.name.includes('David')
  );
  if (preferred) utterance.voice = preferred;
  window.speechSynthesis.speak(utterance);
}

export function stopVoiceover() {
  if ('speechSynthesis' in window) window.speechSynthesis.cancel();
}
