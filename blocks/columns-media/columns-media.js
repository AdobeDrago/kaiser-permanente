function safeMediaUrl(href) {
  try {
    const u = new URL(href, window.location.href);
    if (u.protocol !== 'http:' && u.protocol !== 'https:') return null;
    return u;
  } catch {
    return null;
  }
}

function isDirectVideoFile(url) {
  return /\.(mp4|webm|ogg|m3u8)(\?|$)/i.test(url.pathname);
}

function isKnownEmbedProvider(url) {
  const host = url.hostname.toLowerCase();
  if (host.endsWith('youtube.com') || host === 'youtu.be') return true;
  if (host.endsWith('vimeo.com')) return true;
  if (host.includes('gumucloud.com')) return true;
  return false;
}

function shouldEmbedAsMedia(href) {
  const url = safeMediaUrl(href);
  if (!url) return false;
  if (isDirectVideoFile(url)) return true;
  return isKnownEmbedProvider(url);
}

/** Convert watch/view URLs to iframe embed URLs */
function toEmbedUrl(url) {
  const host = url.hostname.toLowerCase().replace(/^www\./, '');

  if (host.includes('youtube.com')) {
    const v = url.searchParams.get('v');
    if (v) {
      const out = new URL(`https://www.youtube.com/embed/${encodeURIComponent(v)}`);
      out.searchParams.set('rel', '0');
      return out;
    }
    if (url.pathname.startsWith('/embed/')) return new URL(url.href);
    return new URL(url.href);
  }

  if (host === 'youtu.be') {
    const id = url.pathname.split('/').filter(Boolean)[0];
    if (!id) return url;
    const out = new URL(`https://www.youtube.com/embed/${encodeURIComponent(id)}`);
    out.searchParams.set('rel', '0');
    return out;
  }

  if (host.includes('vimeo.com')) {
    const parts = url.pathname.split('/').filter(Boolean);
    const id = parts[parts.length - 1];
    if (!id || !/^\d+$/.test(id)) return url;
    return new URL(`https://player.vimeo.com/video/${id}`);
  }

  if (host.includes('gumucloud.com')) {
    let path = url.pathname;
    if (path.includes('/view/')) {
      path = path.replace('/view/', '/embed/');
    }
    const out = new URL(path, url.origin);
    url.searchParams.forEach((val, key) => {
      out.searchParams.set(key, val);
    });
    if (out.searchParams.get('autoplay') === 'false') {
      out.searchParams.delete('autoplay');
    }
    return out;
  }

  return url;
}

function getAutoplayEmbedUrl(href) {
  const base = safeMediaUrl(href);
  if (!base) return null;
  if (isDirectVideoFile(base)) return base.href;

  const embed = toEmbedUrl(base);
  if (embed.hostname.includes('youtube.com') || embed.hostname.includes('youtu.be')) {
    embed.searchParams.set('autoplay', '1');
  } else if (embed.hostname.includes('vimeo.com')) {
    embed.searchParams.set('autoplay', '1');
  } else if (embed.hostname.includes('gumucloud.com')) {
    embed.searchParams.set('autoplay', 'true');
  } else {
    embed.searchParams.set('autoplay', '1');
  }
  return embed.toString();
}

function mountDirectVideo(container, href, posterPictureClone) {
  const ratio = document.createElement('div');
  ratio.className = 'columns-media-embed-ratio columns-media-embed-ratio--poster';

  const inner = document.createElement('div');
  inner.className = 'columns-media-embed-inner';

  if (posterPictureClone) {
    inner.append(posterPictureClone);
  }

  const overlay = document.createElement('div');
  overlay.className = 'columns-media-play-overlay';
  const btn = document.createElement('button');
  btn.type = 'button';
  btn.className = 'columns-media-play';
  btn.setAttribute('aria-label', 'Play video');
  overlay.append(btn);

  inner.append(overlay);
  ratio.append(inner);

  btn.addEventListener('click', () => {
    inner.remove();
    const video = document.createElement('video');
    video.setAttribute('controls', '');
    video.setAttribute('playsInline', '');
    const source = document.createElement('source');
    source.src = href;
    const pathExt = safeMediaUrl(href)?.pathname.split('.').pop()?.toLowerCase() || 'mp4';
    source.type = pathExt === 'm3u8' ? 'application/x-mpegURL' : `video/${pathExt}`;
    video.append(source);
    ratio.append(video);
    video.play().catch(() => {});
  });

  container.append(ratio);
}

function mountIframeVideo(container, href, posterPictureClone) {
  const ratio = document.createElement('div');
  ratio.className = 'columns-media-embed-ratio columns-media-embed-ratio--poster';

  const inner = document.createElement('div');
  inner.className = 'columns-media-embed-inner';

  if (posterPictureClone) {
    inner.append(posterPictureClone);
  }

  const overlay = document.createElement('div');
  overlay.className = 'columns-media-play-overlay';
  const btn = document.createElement('button');
  btn.type = 'button';
  btn.className = 'columns-media-play';
  btn.setAttribute('aria-label', 'Play video');
  overlay.append(btn);
  inner.append(overlay);
  ratio.append(inner);

  btn.addEventListener('click', () => {
    const src = getAutoplayEmbedUrl(href);
    if (!src) return;
    ratio.textContent = '';
    ratio.classList.remove('columns-media-embed-ratio--poster');

    const iframe = document.createElement('iframe');
    iframe.className = 'columns-media-iframe';
    iframe.src = src;
    iframe.title = 'Video';
    iframe.setAttribute('allowfullscreen', '');
    iframe.setAttribute(
      'allow',
      'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen',
    );
    iframe.loading = 'lazy';
    ratio.append(iframe);
  });

  container.append(ratio);
}

function upgradeMediaColumn(mediaCol) {
  const link = mediaCol.querySelector('a[href]');
  if (!link) return;
  const href = link.getAttribute('href');
  if (!href || !shouldEmbedAsMedia(href)) return;

  const posterPicture = mediaCol.querySelector('picture');
  const cloneForVideo = posterPicture ? posterPicture.cloneNode(true) : null;

  mediaCol.textContent = '';
  mediaCol.classList.add('columns-media-media-col');

  const wrap = document.createElement('div');
  wrap.className = 'columns-media-video';

  const url = safeMediaUrl(href);
  if (url && isDirectVideoFile(url)) {
    mountDirectVideo(wrap, href, cloneForVideo);
  } else {
    mountIframeVideo(wrap, href, cloneForVideo);
  }

  mediaCol.append(wrap);
}

export default function decorate(block) {
  const firstRow = block.firstElementChild;
  const cols = firstRow ? [...firstRow.children] : [];
  if (cols.length) {
    block.classList.add(`columns-media-${cols.length}-cols`);
  }

  const mediaCol = firstRow?.firstElementChild;
  if (mediaCol) {
    upgradeMediaColumn(mediaCol);
  }

  [...block.children].forEach((row) => {
    [...row.children].forEach((col) => {
      const pic = col.querySelector('picture');
      if (pic) {
        const picWrapper = pic.closest('div');
        if (picWrapper && picWrapper.children.length === 1) {
          picWrapper.classList.add('columns-media-img-col');
        }
      }
    });
  });
}
