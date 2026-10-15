import type { AssetLayer } from '../types/blueprint';
import { ASSETS, type AssetDef } from '../data/assets';
import { CLOTH_COLORS, SKIN_TONES } from '../data/palettes';
import { createLayer, withZ } from './layers';

function pick<T>(items: T[]): T {
  return items[Math.floor(Math.random() * items.length)];
}

const ofSlot = (slot: AssetDef['slot']) => ASSETS.filter((a) => a.slot === slot);

/** A valid persona: one part per slot, bottom-to-top, optional prop. */
export function randomLayers(): AssetLayer[] {
  const picks: AssetDef[] = [
    pick(ofSlot('background')),
    pick(ofSlot('legs')),
    pick(ofSlot('torso')),
    pick(ofSlot('head')),
    pick(ofSlot('eyes')),
    pick(ofSlot('eyebrows')),
    pick(ofSlot('mouth')),
    pick(ofSlot('hair_hat')),
  ];
  if (Math.random() < 0.4) picks.push(pick(ofSlot('prop')));

  return withZ(
    picks.map((asset) => {
      const layer = createLayer(asset);
      if (!asset.tintable) return layer;
      return { ...layer, fillColor: pick(asset.slot === 'head' ? SKIN_TONES : CLOTH_COLORS) };
    }),
  );
}
