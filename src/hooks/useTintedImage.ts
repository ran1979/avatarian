import { useEffect, useState } from 'react';
import { loadTintedImage } from '../lib/assetImages';

/** Returns the decoded, tinted SVG. Keeps the previous image until the new tint has loaded. */
export function useTintedImage(url: string, color?: string): HTMLImageElement | null {
  const [img, setImg] = useState<HTMLImageElement | null>(null);

  useEffect(() => {
    let alive = true;
    loadTintedImage(url, color)
      .then((loaded) => {
        if (alive) setImg(loaded);
      })
      .catch((err: unknown) => console.warn(err));
    return () => {
      alive = false;
    };
  }, [url, color]);

  return img;
}
