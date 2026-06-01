import {
  type LoadedSceneAsset,
  pauseAllAssets,
  playSceneAsset,
  preloadSceneAssets,
} from './videoSceneAssets';

export interface VideoScene {
  scene: number;
  description: string;
  duration: string;
  headline?: string;
  bullets?: string[];
  visualTheme?: 'hook' | 'features' | 'benefits' | 'cta' | 'problem' | 'solution';
  moduleId?: string;
  moduleName?: string;
  moduleIcon?: string;
  moduleColor?: string;
  stats?: { label: string; value: string }[];
  isIntro?: boolean;
}

export interface RenderVideoOptions {
  scenes: VideoScene[];
  platform: string;
  format: string;
  productName?: string;
  tagline?: string;
  title?: string;
  source?: string;
  hookLine?: string;
  fastMode?: boolean;
  onProgress?: (percent: number) => void;
  onStage?: (stage: string) => void;
}

export interface RenderVideoResult {
  blob: Blob;
  extension: 'mp4' | 'webm';
  mimeType: string;
}

function parseDurationMs(duration: string, fastMode: boolean): number {
  const match = duration.match(/(\d+(?:\.\d+)?)/);
  const seconds = match ? Number(match[1]) : 4;
  const ms = Math.max(3, seconds) * 1000;
  return fastMode ? Math.min(ms, 3500) : ms;
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

function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

function easeOutBack(t: number): number {
  const c = 1.70158;
  return 1 + (c + 1) * Math.pow(t - 1, 3) + c * Math.pow(t - 1, 2);
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

function drawCoverMedia(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  media: HTMLVideoElement | HTMLImageElement,
  sceneProgress: number,
  isImage: boolean
) {
  const mw = 'videoWidth' in media ? media.videoWidth : media.naturalWidth;
  const mh = 'videoHeight' in media ? media.videoHeight : media.naturalHeight;
  if (!mw || !mh) return;

  const zoom = isImage ? 1 + sceneProgress * 0.12 : 1.05 + Math.sin(sceneProgress * Math.PI) * 0.03;
  const scale = Math.max(width / mw, height / mh) * zoom;
  const sw = mw * scale;
  const sh = mh * scale;
  const panX = isImage ? (sceneProgress - 0.5) * width * 0.06 : 0;
  const x = (width - sw) / 2 + panX;
  const y = (height - sh) / 2;

  ctx.drawImage(media, x, y, sw, sh);
}

function drawGradientBg(ctx: CanvasRenderingContext2D, width: number, height: number, accent: string, t: number) {
  const g = ctx.createLinearGradient(0, 0, width, height);
  g.addColorStop(0, '#0a0a1a');
  g.addColorStop(0.5, accent + '33');
  g.addColorStop(1, '#0f172a');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, width, height);

  for (let i = 0; i < 8; i++) {
    const px = (Math.sin(t * 0.8 + i * 1.4) * 0.5 + 0.5) * width;
    const py = (Math.cos(t * 0.6 + i * 0.9) * 0.5 + 0.5) * height;
    ctx.fillStyle = `rgba(99,102,241,${0.03 + i * 0.008})`;
    ctx.beginPath();
    ctx.arc(px, py, 40 + i * 25, 0, Math.PI * 2);
    ctx.fill();
  }
}

function drawCinematicOverlay(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  visual: LoadedSceneAsset['visual'],
  isVertical: boolean
) {
  const overlayH = isVertical ? height * 0.55 : height * 0.5;
  const g = ctx.createLinearGradient(0, height - overlayH, 0, height);
  g.addColorStop(0, visual.overlayFrom.replace(/[\d.]+\)$/, '0)'));
  g.addColorStop(0.35, visual.overlayFrom);
  g.addColorStop(1, visual.overlayTo);
  ctx.fillStyle = g;
  ctx.fillRect(0, height - overlayH, width, overlayH);

  const topG = ctx.createLinearGradient(0, 0, 0, isVertical ? 120 : 90);
  topG.addColorStop(0, 'rgba(0,0,0,0.55)');
  topG.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = topG;
  ctx.fillRect(0, 0, width, isVertical ? 120 : 90);

  ctx.fillStyle = 'rgba(255,255,255,0.025)';
  for (let i = 0; i < 300; i++) {
    const gx = Math.random() * width;
    const gy = Math.random() * height;
    ctx.fillRect(gx, gy, 1, 1);
  }
}

function drawBrandBadge(
  ctx: CanvasRenderingContext2D,
  width: number,
  productName: string,
  platform: string,
  accent: string,
  isVertical: boolean,
  fadeIn: number
) {
  const pad = isVertical ? 24 : 36;
  ctx.globalAlpha = fadeIn;

  ctx.fillStyle = 'rgba(255,255,255,0.1)';
  roundRect(ctx, pad, pad, Math.min(width * 0.55, 200), isVertical ? 32 : 36, 8);
  ctx.fill();

  ctx.fillStyle = accent;
  ctx.fillRect(pad + 10, pad + (isVertical ? 10 : 12), 3, isVertical ? 12 : 14);

  ctx.fillStyle = '#ffffff';
  ctx.font = `bold ${isVertical ? 13 : 15}px Inter, Arial, sans-serif`;
  const name = productName.length > 22 ? `${productName.slice(0, 19)}...` : productName;
  ctx.fillText(name, pad + 20, pad + (isVertical ? 22 : 26));

  ctx.fillStyle = 'rgba(255,255,255,0.55)';
  ctx.font = `${isVertical ? 9 : 10}px Inter, Arial, sans-serif`;
  ctx.fillText(platform.toUpperCase(), pad + 20, pad + (isVertical ? 30 : 34));

  ctx.globalAlpha = 1;
}

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

function drawAnimatedText(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  data: {
    scene: VideoScene;
    hookLine: string;
    sceneProgress: number;
    accent: string;
    isVertical: boolean;
    website: string;
  }
) {
  const { scene, hookLine, sceneProgress, accent, isVertical, website } = data;
  const pad = isVertical ? 28 : 48;
  const textW = width - pad * 2;
  const headline = scene.headline || hookLine;

  const enterT = easeOutBack(Math.min(1, sceneProgress / 0.25));
  const textY = height - (isVertical ? 280 : 200);
  const slideOffset = (1 - enterT) * 40;

  if (headline) {
    ctx.globalAlpha = enterT;
    ctx.fillStyle = accent;
    ctx.font = `600 ${isVertical ? 11 : 13}px Inter, Arial, sans-serif`;
    ctx.fillText('▸ AI GENERATED', pad, textY + slideOffset);

    ctx.fillStyle = '#ffffff';
    ctx.font = `bold ${isVertical ? 22 : 32}px Inter, Arial, sans-serif`;
    wrapText(ctx, headline, pad, textY + 28 + slideOffset, textW, isVertical ? 28 : 38);
    ctx.globalAlpha = 1;
  }

  const descT = easeOutCubic(Math.min(1, Math.max(0, (sceneProgress - 0.15) / 0.3)));
  if (descT > 0 && scene.description) {
    ctx.globalAlpha = descT;
    ctx.fillStyle = 'rgba(255,255,255,0.85)';
    ctx.font = `${isVertical ? 13 : 16}px Inter, Arial, sans-serif`;
    wrapText(ctx, scene.description, pad, textY + (isVertical ? 90 : 110) + slideOffset * 0.5, textW, isVertical ? 20 : 24);
    ctx.globalAlpha = 1;
  }

  if (scene.bullets?.length) {
    const bulletStart = textY + (isVertical ? 140 : 170);
    const maxBullets = isVertical ? 3 : 4;
    ctx.fillStyle = 'rgba(255,255,255,0.08)';
    const panelH = Math.min(maxBullets, scene.bullets.length) * (isVertical ? 28 : 32) + 20;
    roundRect(ctx, pad - 8, bulletStart - 12, textW + 16, panelH, 12);
    ctx.fill();
    ctx.strokeStyle = 'rgba(255,255,255,0.12)';
    ctx.lineWidth = 1;
    ctx.stroke();

    for (let b = 0; b < Math.min(maxBullets, scene.bullets.length); b++) {
      const bt = easeOutCubic(Math.min(1, Math.max(0, (sceneProgress - 0.25 - b * 0.08) / 0.25)));
      if (bt <= 0) continue;
      ctx.globalAlpha = bt;
      ctx.fillStyle = accent;
      ctx.beginPath();
      ctx.arc(pad + 6, bulletStart + b * (isVertical ? 28 : 32) + 4, 3, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#e2e8f0';
      ctx.font = `${isVertical ? 11 : 13}px Inter, Arial, sans-serif`;
      const txt = scene.bullets[b].length > 50 ? `${scene.bullets[b].slice(0, 47)}...` : scene.bullets[b];
      ctx.fillText(txt, pad + 16, bulletStart + b * (isVertical ? 28 : 32) + 8);
      ctx.globalAlpha = 1;
    }
  }

  const ctaT = easeOutCubic(Math.min(1, Math.max(0, (sceneProgress - 0.6) / 0.3)));
  if (ctaT > 0 && website) {
    ctx.globalAlpha = ctaT;
    const btnY = height - (isVertical ? 52 : 44);
    ctx.fillStyle = accent;
    roundRect(ctx, pad, btnY, Math.min(textW, 280), isVertical ? 34 : 38, 19);
    ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.font = `bold ${isVertical ? 11 : 13}px Inter, Arial, sans-serif`;
    const web = website.length > 38 ? `${website.slice(0, 35)}...` : website;
    ctx.fillText(`→ ${web}`, pad + 14, btnY + (isVertical ? 22 : 25));
    ctx.globalAlpha = 1;
  }
}

function drawProgressBar(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  sceneIndex: number,
  totalScenes: number,
  sceneProgress: number,
  accent: string,
  isVertical: boolean
) {
  const pad = isVertical ? 24 : 36;
  const barY = height - (isVertical ? 14 : 12);
  const barW = width - pad * 2;
  const overall = (sceneIndex + sceneProgress) / totalScenes;

  ctx.fillStyle = 'rgba(255,255,255,0.15)';
  ctx.fillRect(pad, barY, barW, 3);
  ctx.fillStyle = accent;
  ctx.fillRect(pad, barY, barW * overall, 3);
}

function drawFrame(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  assets: LoadedSceneAsset[],
  data: {
    scene: VideoScene;
    platform: string;
    productName: string;
    hookLine: string;
    website: string;
    sceneIndex: number;
    totalScenes: number;
    sceneProgress: number;
    globalTime: number;
    prevSceneIndex: number;
    transitionProgress: number;
  }
) {
  const { scene, platform, productName, hookLine, website, sceneIndex, totalScenes, sceneProgress, globalTime, prevSceneIndex, transitionProgress } = data;
  const isVertical = height > width;
  const asset = assets[sceneIndex];
  const prevAsset = prevSceneIndex >= 0 ? assets[prevSceneIndex] : null;
  const accent = asset.visual.accent;

  ctx.clearRect(0, 0, width, height);

  const drawAsset = (a: LoadedSceneAsset, progress: number, alpha: number) => {
    ctx.save();
    ctx.globalAlpha = alpha;
    if (a.type === 'video' && a.video && a.video.readyState >= 2) {
      drawCoverMedia(ctx, width, height, a.video, progress, false);
    } else if (a.type === 'image' && a.image) {
      drawCoverMedia(ctx, width, height, a.image, progress, true);
    } else {
      drawGradientBg(ctx, width, height, a.visual.accent, globalTime);
    }
    ctx.restore();
  };

  if (transitionProgress > 0 && prevAsset && prevSceneIndex !== sceneIndex) {
    drawAsset(prevAsset, 1, 1 - transitionProgress);
  }
  drawAsset(asset, sceneProgress, transitionProgress > 0 && prevAsset ? transitionProgress : 1);

  drawCinematicOverlay(ctx, width, height, asset.visual, isVertical);

  const fadeIn = easeOutCubic(Math.min(1, sceneProgress / 0.2));
  drawBrandBadge(ctx, width, productName, platform, accent, isVertical, fadeIn);
  drawAnimatedText(ctx, width, height, { scene, hookLine, sceneProgress, accent, isVertical, website });
  drawProgressBar(ctx, width, height, sceneIndex, totalScenes, sceneProgress, accent, isVertical);
}

function waitFrame() {
  return new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
}

function delay(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

export async function renderStoryboardVideo(options: RenderVideoOptions): Promise<RenderVideoResult> {
  const {
    scenes,
    platform,
    format,
    productName = 'Your Product',
    source = '',
    hookLine = '',
    fastMode = false,
    onProgress,
    onStage,
  } = options;

  if (!scenes.length) throw new Error('No storyboard scenes to render');

  onStage?.('Downloading AI visuals & stock footage...');
  const assets = await preloadSceneAssets(scenes, (pct) => onProgress?.(Math.round(pct * 0.15)));
  onProgress?.(15);

  const { width, height } = getVideoSize(format, fastMode);
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  canvas.style.cssText = 'position:fixed;left:-9999px;top:0;pointer-events:none;';
  document.body.appendChild(canvas);

  const ctx = canvas.getContext('2d', { alpha: false });
  if (!ctx) {
    document.body.removeChild(canvas);
    pauseAllAssets(assets);
    throw new Error('Canvas not supported');
  }

  const mimeType = getSupportedMimeType();
  const extension: 'mp4' | 'webm' = mimeType.includes('mp4') ? 'mp4' : 'webm';
  const fps = fastMode ? 24 : 30;
  const stream = canvas.captureStream(fps);

  let recorder: MediaRecorder;
  try {
    recorder = new MediaRecorder(stream, { mimeType, videoBitsPerSecond: fastMode ? 2_500_000 : 4_000_000 });
  } catch {
    document.body.removeChild(canvas);
    pauseAllAssets(assets);
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

  onStage?.('Rendering cinematic AI video...');
  recorder.start(250);
  onProgress?.(18);

  const sceneDurations = scenes.map((s) => parseDurationMs(s.duration, fastMode));
  const totalDuration = sceneDurations.reduce((a, b) => a + b, 0);
  const startTime = performance.now();
  let lastProgress = 18;
  let lastSceneIndex = -1;

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

    if (sceneIndex !== lastSceneIndex) {
      pauseAllAssets(assets);
      playSceneAsset(assets[sceneIndex]);
      lastSceneIndex = sceneIndex;
    }

    const transitionProgress = sceneProgress < 0.18 ? easeOutCubic(sceneProgress / 0.18) : 1;
    const prevSceneIndex = sceneProgress < 0.18 && sceneIndex > 0 ? sceneIndex - 1 : sceneIndex;

    drawFrame(ctx, width, height, assets, {
      scene: scenes[sceneIndex],
      platform,
      productName,
      hookLine,
      website: source,
      sceneIndex,
      totalScenes: scenes.length,
      sceneProgress,
      globalTime: elapsed / 1000,
      prevSceneIndex,
      transitionProgress,
    });

    const pct = Math.min(99, Math.round(18 + (elapsed / totalDuration) * 81));
    if (pct > lastProgress) {
      lastProgress = pct;
      onProgress?.(pct);
    }
    await waitFrame();
  }

  drawFrame(ctx, width, height, assets, {
    scene: scenes[scenes.length - 1],
    platform,
    productName,
    hookLine,
    website: source,
    sceneIndex: scenes.length - 1,
    totalScenes: scenes.length,
    sceneProgress: 1,
    globalTime: totalDuration / 1000,
    prevSceneIndex: scenes.length - 1,
    transitionProgress: 1,
  });

  await delay(500);
  if (recorder.state === 'recording') recorder.requestData();
  recorder.stop();

  try {
    const blob = await recorded;
    onProgress?.(100);
    onStage?.('Video ready!');
    return { blob, extension, mimeType };
  } finally {
    pauseAllAssets(assets);
    document.body.removeChild(canvas);
  }
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