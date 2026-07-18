export function extractYouTubeId(input: string | undefined | null): string {
  if (!input) return '';
  const trimmed = input.trim();
  const match = trimmed.match(
    /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|shorts\/))([a-zA-Z0-9_-]{11})/
  );
  if (match) return match[1];
  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) return trimmed;
  return '';
}

export function youtubeThumbnail(
  input: string | undefined | null,
  quality: 'default' | 'mq' | 'hq' | 'sd' | 'maxres' = 'mq'
): string {
  const id = extractYouTubeId(input);
  if (!id) return '';
  const map = {
    default: 'default',
    mq: 'mqdefault',
    hq: 'hqdefault',
    sd: 'sddefault',
    maxres: 'maxresdefault',
  } as const;
  return `https://img.youtube.com/vi/${id}/${map[quality]}.jpg`;
}

export function youtubeEmbedUrl(
  input: string | undefined | null,
  opts: { autoplay?: boolean; rel?: boolean; mute?: boolean } = {}
): string {
  const id = extractYouTubeId(input);
  if (!id) return '';
  const params = new URLSearchParams();
  if (opts.autoplay) params.set('autoplay', '1');
  if (opts.rel === false) params.set('rel', '0');
  if (opts.mute) params.set('mute', '1');
  const qs = params.toString();
  return `https://www.youtube.com/embed/${id}${qs ? `?${qs}` : ''}`;
}
