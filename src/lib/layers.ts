import type { AssetLayer } from '../types/blueprint';
import { categoryOf, type AssetDef } from '../data/assets';

let seq = 0;

export function createLayer(asset: AssetDef): AssetLayer {
  seq += 1;
  return {
    id: `${asset.id}-${Date.now().toString(36)}${seq}`,
    category: categoryOf(asset.slot),
    godotResPath: asset.godotResPath,
    x: asset.defaults.x,
    y: asset.defaults.y,
    scaleX: asset.defaults.scale,
    scaleY: asset.defaults.scale,
    rotation: 0,
    zIndex: 0,
    fillColor: asset.defaultColor,
  };
}

/** The array order is the draw order; zIndex mirrors it. */
export function withZ(layers: AssetLayer[]): AssetLayer[] {
  return layers.map((layer, zIndex) => ({ ...layer, zIndex }));
}
