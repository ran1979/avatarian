// Loads asset SVGs, recolors their data-tint parts, and caches the results.

const svgTextCache = new Map<string, Promise<string>>();
const imageCache = new Map<string, Promise<HTMLImageElement>>();

export function loadSvgText(url: string): Promise<string> {
  let pending = svgTextCache.get(url);
  if (!pending) {
    pending = fetch(url).then((res) => {
      if (!res.ok) throw new Error(`Missing asset: ${url}`);
      return res.text();
    });
    svgTextCache.set(url, pending);
  }
  return pending;
}

/** Sets fill on every data-tint element. Base art is white, so Godot modulate gives the same color. */
export function tintSvg(text: string, color?: string): string {
  if (!color) return text;
  const doc = new DOMParser().parseFromString(text, 'image/svg+xml');
  doc.querySelectorAll('[data-tint]').forEach((el) => el.setAttribute('fill', color));
  return new XMLSerializer().serializeToString(doc);
}

/** Children of the root <svg>, serialized, for embedding into a larger SVG. */
export function svgInnerMarkup(text: string): string {
  const root = new DOMParser().parseFromString(text, 'image/svg+xml').documentElement;
  const serializer = new XMLSerializer();
  return Array.from(root.childNodes).map((node) => serializer.serializeToString(node)).join('');
}

export function loadTintedImage(url: string, color?: string): Promise<HTMLImageElement> {
  const key = `${url}|${color ?? ''}`;
  let pending = imageCache.get(key);
  if (!pending) {
    pending = loadSvgText(url).then((text) => {
      const blob = new Blob([tintSvg(text, color)], { type: 'image/svg+xml' });
      const img = new Image();
      img.src = URL.createObjectURL(blob);
      return img.decode().then(() => img);
    });
    imageCache.set(key, pending);
  }
  return pending;
}
