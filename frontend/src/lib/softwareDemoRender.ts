import type { VideoScene } from './videoExport';
import { getSoftwareProduct, type SoftwareModule } from './softwareDemoEngine';

export interface SoftwareDemoRenderOptions {
  scenes: VideoScene[];
  productName: string;
  website: string;
  modules: SoftwareModule[];
  format: string;
  fastMode?: boolean;
  onProgress?: (pct: number) => void;
  onStage?: (stage: string) => void;
}

export interface SoftwareDemoRenderResult {
  blob: Blob;
  extension: 'mp4' | 'webm';
  mimeType: string;
}

function parseDurationMs(duration: string, fastMode: boolean): number {
  const match = duration.match(/(\d+(?:\.\d+)?)/);
  const seconds = match ? Number(match[1]) : 4;
  return fastMode ? Math.min(Math.max(3, seconds) * 1000, 3000) : Math.max(3, seconds) * 1000;
}

function getVideoSize(format: string, fastMode: boolean) {
  if (format.includes('9:16')) {
    return fastMode ? { width: 540, height: 960 } : { width: 720, height: 1280 };
  }
  return fastMode ? { width: 960, height: 540 } : { width: 1280, height: 720 };
}

function getSupportedMimeType(): string {
  const types = ['video/webm;codecs=vp9', 'video/webm;codecs=vp8', 'video/webm', 'video/mp4'];
  return types.find((t) => MediaRecorder.isTypeSupported(t)) || 'video/webm';
}

function easeOutCubic(t: number) { return 1 - Math.pow(1 - t, 3); }
function easeOutBack(t: number) {
  const c = 1.70158;
  return 1 + (c + 1) * Math.pow(t - 1, 3) + c * Math.pow(t - 1, 2);
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

function wrapText(ctx: CanvasRenderingContext2D, text: string, x: number, y: number, maxW: number, lh: number): number {
  const words = text.split(/\s+/);
  let line = '';
  let cy = y;
  for (const word of words) {
    const test = line ? `${line} ${word}` : word;
    if (ctx.measureText(test).width > maxW && line) {
      ctx.fillText(line, x, cy);
      line = word;
      cy += lh;
    } else line = test;
  }
  if (line) ctx.fillText(line, x, cy);
  return cy;
}

function drawSoftwareUI(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  data: {
    scene: VideoScene & { moduleId?: string; moduleName?: string; moduleIcon?: string; moduleColor?: string; stats?: { label: string; value: string }[] };
    modules: SoftwareModule[];
    productName: string;
    sceneProgress: number;
    globalTime: number;
  }
) {
  const { scene, modules, productName, sceneProgress, globalTime } = data;
  const isVertical = h > w;
  const accent = scene.moduleColor || '#6366f1';
  const activeId = scene.moduleId || 'dashboard';
  const enterT = easeOutBack(Math.min(1, sceneProgress / 0.3));
  const pulse = 0.5 + Math.sin(globalTime * 4) * 0.5;

  // Background
  const bg = ctx.createLinearGradient(0, 0, w, h);
  bg.addColorStop(0, '#0f0c29');
  bg.addColorStop(1, '#1a1a2e');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, w, h);

  // App window
  const winPad = isVertical ? 12 : 24;
  const winW = w - winPad * 2;
  const winH = h - winPad * 2 - (isVertical ? 60 : 40);
  const winX = winPad;
  const winY = winPad + (isVertical ? 20 : 10);

  ctx.fillStyle = 'rgba(255,255,255,0.06)';
  roundRect(ctx, winX, winY, winW, winH, isVertical ? 12 : 16);
  ctx.fill();
  ctx.strokeStyle = 'rgba(99,102,241,0.4)';
  ctx.lineWidth = 1.5;
  ctx.stroke();

  // Browser bar
  const barH = isVertical ? 28 : 32;
  ctx.fillStyle = 'rgba(30,27,75,0.9)';
  roundRect(ctx, winX, winY, winW, barH, isVertical ? 12 : 16);
  ctx.fill();
  ctx.fillStyle = 'rgba(30,27,75,0.9)';
  ctx.fillRect(winX, winY + barH - 8, winW, 8);

  // Traffic lights
  const dotY = winY + barH / 2;
  ['#ef4444', '#fbbf24', '#22c55e'].forEach((c, i) => {
    ctx.fillStyle = c;
    ctx.beginPath();
    ctx.arc(winX + 14 + i * 14, dotY, 4, 0, Math.PI * 2);
    ctx.fill();
  });

  ctx.fillStyle = 'rgba(255,255,255,0.5)';
  ctx.font = `${isVertical ? 9 : 10}px Inter, Arial, sans-serif`;
  ctx.fillText(`${productName} — Demo Mode`, winX + winW / 2 - 50, dotY + 3);

  // DEMO badge
  ctx.fillStyle = '#22c55e';
  roundRect(ctx, winX + winW - (isVertical ? 58 : 68), winY + 6, isVertical ? 50 : 58, isVertical ? 16 : 18, 4);
  ctx.fill();
  ctx.fillStyle = '#fff';
  ctx.font = `bold ${isVertical ? 8 : 9}px Inter, Arial, sans-serif`;
  ctx.fillText('● DEMO', winX + winW - (isVertical ? 52 : 60), winY + (isVertical ? 17 : 19));

  const contentY = winY + barH;
  const contentH = winH - barH;
  const sidebarW = isVertical ? winW * 0.28 : winW * 0.22;

  // Sidebar
  ctx.fillStyle = 'rgba(15,12,41,0.95)';
  ctx.fillRect(winX, contentY, sidebarW, contentH);

  ctx.fillStyle = '#fff';
  ctx.font = `bold ${isVertical ? 8 : 10}px Inter, Arial, sans-serif`;
  ctx.fillText('AI Growth OS', winX + 8, contentY + (isVertical ? 16 : 20));

  const navItems = modules.slice(0, isVertical ? 6 : 8);
  const itemH = isVertical ? 22 : 26;
  navItems.forEach((mod, i) => {
    const iy = contentY + (isVertical ? 24 : 30) + i * itemH;
    const isActive = mod.id === activeId || (activeId === 'intro' && i === 0) || (activeId === 'full' && i === 0);
    const itemT = easeOutCubic(Math.min(1, Math.max(0, (sceneProgress - i * 0.05) / 0.2)));

    if (isActive) {
      ctx.fillStyle = `rgba(99,102,241,${0.3 + pulse * 0.15})`;
      roundRect(ctx, winX + 4, iy - (isVertical ? 10 : 12), sidebarW - 8, itemH - 2, 4);
      ctx.fill();
      ctx.fillStyle = accent;
      ctx.fillRect(winX + 4, iy - (isVertical ? 10 : 12), 3, itemH - 2);
    }

    ctx.globalAlpha = itemT;
    ctx.fillStyle = isActive ? '#fff' : 'rgba(255,255,255,0.5)';
    ctx.font = `${isVertical ? 8 : 9}px Inter, Arial, sans-serif`;
    ctx.fillText(`${mod.icon} ${mod.shortName}`, winX + 10, iy);
    ctx.globalAlpha = 1;
  });

  // Main content area
  const mainX = winX + sidebarW;
  const mainW = winW - sidebarW;
  ctx.fillStyle = 'rgba(20,18,50,0.8)';
  ctx.fillRect(mainX, contentY, mainW, contentH);

  const mx = mainX + (isVertical ? 10 : 16);
  const my = contentY + (isVertical ? 14 : 20);
  const mw = mainW - (isVertical ? 20 : 32);

  ctx.globalAlpha = enterT;
  ctx.fillStyle = accent;
  ctx.font = `${isVertical ? 20 : 28}px Inter, Arial, sans-serif`;
  ctx.fillText(scene.moduleIcon || '✨', mx, my + (isVertical ? 16 : 22));

  ctx.fillStyle = '#ffffff';
  ctx.font = `bold ${isVertical ? 14 : 20}px Inter, Arial, sans-serif`;
  const modName = scene.moduleName || scene.headline || productName;
  ctx.fillText(modName.length > 22 ? modName.slice(0, 20) + '...' : modName, mx + (isVertical ? 28 : 36), my + (isVertical ? 16 : 22));

  ctx.fillStyle = 'rgba(255,255,255,0.6)';
  ctx.font = `${isVertical ? 9 : 11}px Inter, Arial, sans-serif`;
  wrapText(ctx, scene.description || '', mx, my + (isVertical ? 32 : 44), mw, isVertical ? 13 : 16);

  // Stat cards
  const stats = scene.stats || modules.find((m) => m.id === activeId)?.stats || [];
  if (stats.length) {
    const cardW = (mw - 16) / Math.min(3, stats.length);
    const cardY = my + (isVertical ? 52 : 68);
    stats.slice(0, 3).forEach((stat, i) => {
      const cx = mx + i * (cardW + 6);
      const cardT = easeOutCubic(Math.min(1, Math.max(0, (sceneProgress - 0.2 - i * 0.1) / 0.25)));
      ctx.globalAlpha = cardT * enterT;
      ctx.fillStyle = 'rgba(99,102,241,0.15)';
      roundRect(ctx, cx, cardY, cardW - 4, isVertical ? 36 : 44, 6);
      ctx.fill();
      ctx.strokeStyle = 'rgba(99,102,241,0.3)';
      ctx.stroke();
      ctx.fillStyle = accent;
      ctx.font = `bold ${isVertical ? 11 : 14}px Inter, Arial, sans-serif`;
      ctx.fillText(stat.value, cx + 6, cardY + (isVertical ? 16 : 20));
      ctx.fillStyle = 'rgba(255,255,255,0.5)';
      ctx.font = `${isVertical ? 7 : 9}px Inter, Arial, sans-serif`;
      ctx.fillText(stat.label, cx + 6, cardY + (isVertical ? 28 : 34));
    });
    ctx.globalAlpha = 1;
  }

  // Feature bullets
  if (scene.bullets?.length) {
    const bulY = my + (isVertical ? 100 : 130);
    ctx.fillStyle = 'rgba(255,255,255,0.05)';
    const panelH = Math.min(scene.bullets.length, isVertical ? 3 : 4) * (isVertical ? 18 : 22) + 16;
    roundRect(ctx, mx, bulY, mw, panelH, 8);
    ctx.fill();

    scene.bullets.slice(0, isVertical ? 3 : 4).forEach((b, i) => {
      const bt = easeOutCubic(Math.min(1, Math.max(0, (sceneProgress - 0.3 - i * 0.08) / 0.25)));
      ctx.globalAlpha = bt * enterT;
      ctx.fillStyle = '#a5b4fc';
      ctx.font = `${isVertical ? 8 : 10}px Inter, Arial, sans-serif`;
      const txt = b.length > (isVertical ? 35 : 50) ? b.slice(0, isVertical ? 32 : 47) + '...' : b;
      ctx.fillText(`✓ ${txt}`, mx + 8, bulY + 14 + i * (isVertical ? 18 : 22));
    });
    ctx.globalAlpha = 1;
  }

  // Animated cursor
  const cursorX = mx + mw * (0.3 + Math.sin(globalTime * 1.5) * 0.2);
  const cursorY = contentY + contentH * (0.4 + Math.cos(globalTime * 1.2) * 0.15);
  ctx.fillStyle = '#fff';
  ctx.beginPath();
  ctx.moveTo(cursorX, cursorY);
  ctx.lineTo(cursorX + 8, cursorY + 10);
  ctx.lineTo(cursorX + 3, cursorY + 10);
  ctx.lineTo(cursorX + 3, cursorY + 16);
  ctx.lineTo(cursorX - 2, cursorY + 16);
  ctx.closePath();
  ctx.fill();

  ctx.globalAlpha = 1;

  // Bottom caption bar
  const capY = h - (isVertical ? 52 : 36);
  ctx.fillStyle = 'rgba(0,0,0,0.7)';
  ctx.fillRect(0, capY, w, isVertical ? 52 : 36);
  ctx.fillStyle = '#fff';
  ctx.font = `bold ${isVertical ? 10 : 13}px Inter, Arial, sans-serif`;
  const headline = scene.headline || modName;
  ctx.fillText(`▸ SOFTWARE DEMO: ${headline}`, isVertical ? 12 : 20, capY + (isVertical ? 18 : 16));
  ctx.fillStyle = 'rgba(255,255,255,0.6)';
  ctx.font = `${isVertical ? 8 : 10}px Inter, Arial, sans-serif`;
  ctx.fillText('AI Growth OS Marketing Studio — Live Product Walkthrough', isVertical ? 12 : 20, capY + (isVertical ? 34 : 28));
}

function waitFrame() {
  return new Promise<void>((r) => requestAnimationFrame(() => r()));
}

export async function renderSoftwareDemoVideo(options: SoftwareDemoRenderOptions): Promise<SoftwareDemoRenderResult> {
  const { scenes, productName, modules, format, fastMode = true, onProgress, onStage } = options;
  if (!scenes.length) throw new Error('No demo scenes');

  onStage?.('Building software UI demo...');
  onProgress?.(10);

  const { width, height } = getVideoSize(format, fastMode);
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  canvas.style.cssText = 'position:fixed;left:-9999px;top:0;';
  document.body.appendChild(canvas);

  const ctx = canvas.getContext('2d', { alpha: false });
  if (!ctx) { document.body.removeChild(canvas); throw new Error('Canvas not supported'); }

  const mimeType = getSupportedMimeType();
  const extension: 'mp4' | 'webm' = mimeType.includes('mp4') ? 'mp4' : 'webm';
  const recorder = new MediaRecorder(canvas.captureStream(fastMode ? 24 : 30), {
    mimeType,
    videoBitsPerSecond: fastMode ? 2_500_000 : 4_000_000,
  });

  const chunks: Blob[] = [];
  recorder.ondataavailable = (e) => { if (e.data.size > 0) chunks.push(e.data); };
  const recorded = new Promise<Blob>((resolve, reject) => {
    recorder.onstop = () => {
      const blob = new Blob(chunks, { type: mimeType });
      blob.size < 1000 ? reject(new Error('Demo video too small')) : resolve(blob);
    };
    recorder.onerror = () => reject(new Error('Recording failed'));
  });

  onStage?.('Recording software walkthrough...');
  recorder.start(250);
  onProgress?.(15);

  const durations = scenes.map((s) => parseDurationMs(s.duration, fastMode));
  const total = durations.reduce((a, b) => a + b, 0);
  const start = performance.now();
  let lastPct = 15;

  while (true) {
    const elapsed = performance.now() - start;
    if (elapsed >= total) break;

    let acc = 0, idx = 0, prog = 0;
    for (let i = 0; i < scenes.length; i++) {
      if (elapsed < acc + durations[i]) { idx = i; prog = (elapsed - acc) / durations[i]; break; }
      acc += durations[i];
    }

    drawSoftwareUI(ctx, width, height, {
      scene: scenes[idx] as SoftwareDemoRenderOptions['scenes'][0] & { moduleId?: string; moduleName?: string; moduleIcon?: string; moduleColor?: string; stats?: { label: string; value: string }[] },
      modules,
      productName,
      sceneProgress: prog,
      globalTime: elapsed / 1000,
    });

    const pct = Math.min(99, Math.round(15 + (elapsed / total) * 84));
    if (pct > lastPct) { lastPct = pct; onProgress?.(pct); }
    await waitFrame();
  }

  drawSoftwareUI(ctx, width, height, {
    scene: scenes[scenes.length - 1] as never,
    modules,
    productName,
    sceneProgress: 1,
    globalTime: total / 1000,
  });

  await new Promise((r) => setTimeout(r, 400));
  recorder.stop();

  try {
    const blob = await recorded;
    onProgress?.(100);
    onStage?.('Software demo ready!');
    return { blob, extension, mimeType };
  } finally {
    document.body.removeChild(canvas);
  }
}

export { getSoftwareProduct };
