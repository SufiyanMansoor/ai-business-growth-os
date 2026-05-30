const DEFAULT_OUTPUTS = {
  youtube: { status: 'ready', duration: '60s', format: '16:9' },
  instagram: { status: 'ready', duration: '30s', format: '9:16' },
  tiktok: { status: 'ready', duration: '15s', format: '9:16' },
  linkedin: { status: 'ready', duration: '45s', format: '16:9' },
};

export function normalizeVideoResult(data, fallback = {}) {
  const raw = data && typeof data === 'object' ? data : {};
  const base = { ...fallback, ...raw };

  const script = String(base.script || base.raw || fallback.script || 'Video script generated.');
  const voiceover = String(base.voiceover || fallback.voiceover || '');

  let storyboard = [];
  if (Array.isArray(base.storyboard)) {
    storyboard = base.storyboard.map((item, index) => {
      if (typeof item === 'string') {
        return { scene: index + 1, description: item, duration: '5s' };
      }
      if (item && typeof item === 'object') {
        return {
          scene: Number(item.scene) || index + 1,
          description: String(item.description || item.text || `Scene ${index + 1}`),
          duration: String(item.duration || '5s'),
        };
      }
      return { scene: index + 1, description: `Scene ${index + 1}`, duration: '5s' };
    });
  }

  if (!storyboard.length) {
    storyboard = fallback.storyboard || [{ scene: 1, description: 'Opening hook', duration: '3s' }];
  }

  const outputs = { ...DEFAULT_OUTPUTS, ...(fallback.outputs || {}) };
  if (base.outputs && typeof base.outputs === 'object' && !Array.isArray(base.outputs)) {
    for (const [platform, info] of Object.entries(base.outputs)) {
      if (info && typeof info === 'object') {
        outputs[platform] = {
          status: String(info.status || 'ready'),
          duration: String(info.duration || '30s'),
          format: String(info.format || '16:9'),
        };
      }
    }
  }

  const captions = base.captions && typeof base.captions === 'object'
    ? {
        enabled: Boolean(base.captions.enabled ?? true),
        languages: Array.isArray(base.captions.languages)
          ? base.captions.languages.map(String)
          : (fallback.captions?.languages || ['English']),
      }
    : (fallback.captions || { enabled: true, languages: ['English'] });

  return { script, storyboard, voiceover, outputs, captions };
}
