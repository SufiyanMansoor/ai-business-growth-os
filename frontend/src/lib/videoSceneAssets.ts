export type SceneTheme = 'hook' | 'features' | 'benefits' | 'cta' | 'problem' | 'solution';

export interface SceneVisual {
  videoUrl?: string;
  imageUrl?: string;
  accent: string;
  overlayFrom: string;
  overlayTo: string;
}

const THEMES: Record<SceneTheme, SceneVisual> = {
  hook: {
    videoUrl: 'https://videos.pexels.com/video-files/3129671/3129671-uhd_2560_1440_25fps.mp4',
    imageUrl: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1280&q=80',
    accent: '#818cf8',
    overlayFrom: 'rgba(15,12,41,0.55)',
    overlayTo: 'rgba(15,12,41,0.92)',
  },
  features: {
    videoUrl: 'https://videos.pexels.com/video-files/7691775/7691775-uhd_2560_1440_25fps.mp4',
    imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1280&q=80',
    accent: '#a78bfa',
    overlayFrom: 'rgba(30,27,75,0.5)',
    overlayTo: 'rgba(15,12,41,0.9)',
  },
  benefits: {
    videoUrl: 'https://videos.pexels.com/video-files/3254066/3254066-hd_1920_1080_30fps.mp4',
    imageUrl: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=1280&q=80',
    accent: '#22d3ee',
    overlayFrom: 'rgba(12,74,110,0.45)',
    overlayTo: 'rgba(15,12,41,0.88)',
  },
  cta: {
    videoUrl: 'https://videos.pexels.com/video-files/7698696/7698696-hd_1920_1080_25fps.mp4',
    imageUrl: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=1280&q=80',
    accent: '#fbbf24',
    overlayFrom: 'rgba(49,46,129,0.5)',
    overlayTo: 'rgba(15,12,41,0.93)',
  },
  problem: {
    videoUrl: 'https://videos.pexels.com/video-files/6774633/6774633-hd_1920_1080_25fps.mp4',
    imageUrl: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=1280&q=80',
    accent: '#f87171',
    overlayFrom: 'rgba(60,10,10,0.5)',
    overlayTo: 'rgba(15,12,41,0.9)',
  },
  solution: {
    videoUrl: 'https://videos.pexels.com/video-files/7578615/7578615-hd_1920_1080_30fps.mp4',
    imageUrl: 'https://images.unsplash.com/photo-1553877522-43269d4ea984?w=1280&q=80',
    accent: '#34d399',
    overlayFrom: 'rgba(6,60,40,0.45)',
    overlayTo: 'rgba(15,12,41,0.88)',
  },
};

const SCENE_THEME_ORDER: SceneTheme[] = ['hook', 'problem', 'features', 'benefits', 'solution', 'cta'];

export function resolveSceneTheme(sceneIndex: number, visualTheme?: string): SceneTheme {
  const valid: SceneTheme[] = ['hook', 'features', 'benefits', 'cta', 'problem', 'solution'];
  if (visualTheme && valid.includes(visualTheme as SceneTheme)) return visualTheme as SceneTheme;
  return SCENE_THEME_ORDER[sceneIndex % SCENE_THEME_ORDER.length];
}

export function getSceneTheme(sceneIndex: number, sceneNumber?: number): SceneTheme {
  if (sceneNumber === 1 || sceneIndex === 0) return 'hook';
  return SCENE_THEME_ORDER[sceneIndex % SCENE_THEME_ORDER.length];
}

export function getSceneVisual(theme: SceneTheme): SceneVisual {
  return THEMES[theme];
}

export interface LoadedSceneAsset {
  type: 'video' | 'image' | 'gradient';
  video?: HTMLVideoElement;
  image?: HTMLImageElement;
  visual: SceneVisual;
}

function loadImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = url;
  });
}

function loadVideo(url: string): Promise<HTMLVideoElement> {
  return new Promise((resolve, reject) => {
    const video = document.createElement('video');
    video.crossOrigin = 'anonymous';
    video.muted = true;
    video.loop = true;
    video.playsInline = true;
    video.preload = 'auto';
    video.src = url;
    video.onloadeddata = () => resolve(video);
    video.onerror = reject;
  });
}

export async function preloadSceneAssets(
  scenes: { visualTheme?: string }[],
  onProgress?: (pct: number) => void
): Promise<LoadedSceneAsset[]> {
  const assets: LoadedSceneAsset[] = [];

  for (let i = 0; i < scenes.length; i++) {
    const theme = resolveSceneTheme(i, scenes[i]?.visualTheme);
    const visual = getSceneVisual(theme);
    let loaded: LoadedSceneAsset = { type: 'gradient', visual };

    try {
      if (visual.videoUrl) {
        const video = await loadVideo(visual.videoUrl);
        loaded = { type: 'video', video, visual };
      }
    } catch {
      try {
        if (visual.imageUrl) {
          const image = await loadImage(visual.imageUrl);
          loaded = { type: 'image', image, visual };
        }
      } catch {
        loaded = { type: 'gradient', visual };
      }
    }

    assets.push(loaded);
    onProgress?.(Math.round(((i + 1) / scenes.length) * 100));
  }

  return assets;
}

export function playSceneAsset(asset: LoadedSceneAsset) {
  if (asset.type === 'video' && asset.video) {
    asset.video.currentTime = 0;
    asset.video.play().catch(() => undefined);
  }
}

export function pauseAllAssets(assets: LoadedSceneAsset[]) {
  for (const a of assets) {
    if (a.type === 'video' && a.video) a.video.pause();
  }
}
