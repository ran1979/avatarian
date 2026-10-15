import type { AssetLayer } from '../types/blueprint';
import { assetUrl } from '../data/assets';
import { loadSvgText, loadTintedImage, svgInnerMarkup, tintSvg } from './assetImages';

export interface ExportSource {
  layers: AssetLayer[];
  backgroundColor: string;
  canvasWidth: number;
  canvasHeight: number;
}

const ASSET_SIZE = 200; // every asset is drawn in a 200x200 box, centred on (x, y)

export async function renderPng(src: ExportSource, transparent: boolean, pixelRatio = 2): Promise<Blob> {
  const canvas = document.createElement('canvas');
  canvas.width = src.canvasWidth * pixelRatio;
  canvas.height = src.canvasHeight * pixelRatio;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('canvas 2D context unavailable');
  ctx.scale(pixelRatio, pixelRatio);

  if (!transparent) {
    ctx.fillStyle = src.backgroundColor;
    ctx.fillRect(0, 0, src.canvasWidth, src.canvasHeight);
  }

  for (const layer of src.layers) {
    const img = await loadTintedImage(assetUrl(layer.godotResPath), layer.fillColor);
    ctx.save();
    ctx.translate(layer.x, layer.y);
    ctx.rotate((layer.rotation * Math.PI) / 180);
    ctx.scale(layer.scaleX, layer.scaleY);
    ctx.drawImage(img, -ASSET_SIZE / 2, -ASSET_SIZE / 2, ASSET_SIZE, ASSET_SIZE);
    ctx.restore();
  }

  return new Promise((resolve, reject) =>
    canvas.toBlob((blob) => (blob ? resolve(blob) : reject(new Error('PNG encoding failed'))), 'image/png'),
  );
}

export async function renderSvg(src: ExportSource, transparent: boolean): Promise<string> {
  const groups = await Promise.all(
    src.layers.map(async (layer) => {
      const text = tintSvg(await loadSvgText(assetUrl(layer.godotResPath)), layer.fillColor);
      const transform =
        `translate(${layer.x} ${layer.y}) rotate(${layer.rotation}) ` +
        `scale(${layer.scaleX} ${layer.scaleY}) translate(-${ASSET_SIZE / 2} -${ASSET_SIZE / 2})`;
      return `<g id="${layer.id}" transform="${transform}">${svgInnerMarkup(text)}</g>`;
    }),
  );
  const bg = transparent ? '' : `<rect width="${src.canvasWidth}" height="${src.canvasHeight}" fill="${src.backgroundColor}"/>`;
  return (
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${src.canvasWidth} ${src.canvasHeight}" ` +
    `width="${src.canvasWidth}" height="${src.canvasHeight}">${bg}${groups.join('')}</svg>`
  );
}

export function download(filename: string, data: Blob | string, mime = 'text/plain'): void {
  const blob = typeof data === 'string' ? new Blob([data], { type: mime }) : data;
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
