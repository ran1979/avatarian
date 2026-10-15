import type { AssetCategory } from '../types/blueprint';
import { CLOTH_COLORS, SKIN_TONES } from './palettes';

/** Asset slot: single-slot categories get swapped; 'prop' stacks; 'background' pins to the bottom. */
export type AssetSlot = AssetCategory | 'background' | 'prop';

export type AssetTab = 'heads' | 'eyes' | 'mouths' | 'hair' | 'tops' | 'bottoms' | 'props' | 'backgrounds';

export const TABS: { id: AssetTab; label: string }[] = [
  { id: 'heads', label: 'Heads' },
  { id: 'eyes', label: 'Eyes' },
  { id: 'mouths', label: 'Mouths' },
  { id: 'hair', label: 'Hair & Hats' },
  { id: 'tops', label: 'Tops' },
  { id: 'bottoms', label: 'Bottoms' },
  { id: 'props', label: 'Props' },
  { id: 'backgrounds', label: 'Backgrounds' },
];

export interface Placement {
  x: number;
  y: number;
  scale: number;
}

export interface AssetDef {
  id: string;
  name: string;
  tab: AssetTab;
  slot: AssetSlot;
  godotResPath: string;
  tintable: boolean;
  defaultColor?: string;
  defaults: Placement;
}

// All figure parts are drawn in a 200x200 box. Parts sharing a Placement line up with each other.
const FACE: Placement = { x: 400, y: 280, scale: 1.6 };
const TORSO: Placement = { x: 400, y: 440, scale: 1.6 };
const LEGS: Placement = { x: 400, y: 600, scale: 1.6 };
const PROP: Placement = { x: 400, y: 400, scale: 1.6 };
const STAGE: Placement = { x: 400, y: 400, scale: 4 };

const SKIN = SKIN_TONES[0];
const RED = CLOTH_COLORS[0];
const BLUE = CLOTH_COLORS[1];
const GREEN = CLOTH_COLORS[2];
const YELLOW = CLOTH_COLORS[3];
const BROWN = CLOTH_COLORS[8];

// defaultColor present => tintable (the SVG marks those parts with data-tint and Godot modulates them)
function def(
  id: string,
  name: string,
  tab: AssetTab,
  slot: AssetSlot,
  file: string,
  defaults: Placement,
  defaultColor?: string,
): AssetDef {
  return {
    id,
    name,
    tab,
    slot,
    godotResPath: `res://assets/${file}`,
    tintable: defaultColor !== undefined,
    defaultColor,
    defaults,
  };
}

export const ASSETS: AssetDef[] = [
  def('head_round', 'Round', 'heads', 'head', 'heads/head_round.svg', FACE, SKIN),
  def('head_square', 'Square', 'heads', 'head', 'heads/head_square.svg', FACE, SKIN),
  def('head_chiseled', 'Chiseled', 'heads', 'head', 'heads/head_chiseled.svg', FACE, SKIN),

  def('eyes_happy', 'Happy', 'eyes', 'eyes', 'eyes/eyes_happy.svg', FACE),
  def('eyes_bored', 'Bored', 'eyes', 'eyes', 'eyes/eyes_bored.svg', FACE),
  def('eyes_angry', 'Angry', 'eyes', 'eyes', 'eyes/eyes_angry.svg', FACE),
  def('eyes_wide', 'Wide', 'eyes', 'eyes', 'eyes/eyes_wide.svg', FACE),
  def('eyes_squint', 'Squinting', 'eyes', 'eyes', 'eyes/eyes_squint.svg', FACE),
  def('brows_flat', 'Flat brows', 'eyes', 'eyebrows', 'eyebrows/brows_flat.svg', FACE),
  def('brows_angry', 'Angry brows', 'eyes', 'eyebrows', 'eyebrows/brows_angry.svg', FACE),

  def('mouth_smile', 'Smile', 'mouths', 'mouth', 'mouths/mouth_smile.svg', FACE),
  def('mouth_frown', 'Frown', 'mouths', 'mouth', 'mouths/mouth_frown.svg', FACE),
  def('mouth_open', 'Open', 'mouths', 'mouth', 'mouths/mouth_open.svg', FACE),
  def('mouth_talk', 'Talking', 'mouths', 'mouth', 'mouths/mouth_talk.svg', FACE),

  def('hair_beanie', 'Winter beanie', 'hair', 'hair_hat', 'hair_hats/hair_beanie.svg', FACE, RED),
  def('hair_cap', 'Cap', 'hair', 'hair_hat', 'hair_hats/hair_cap.svg', FACE, BLUE),
  def('hair_messy', 'Messy hair', 'hair', 'hair_hat', 'hair_hats/hair_messy.svg', FACE, BROWN),
  def('hair_bald', 'Bald top', 'hair', 'hair_hat', 'hair_hats/hair_bald.svg', FACE),

  def('torso_puffy', 'Puffy jacket', 'tops', 'torso', 'torsos/torso_puffy.svg', TORSO, BLUE),
  def('torso_hoodie', 'Hoodie', 'tops', 'torso', 'torsos/torso_hoodie.svg', TORSO, GREEN),
  def('torso_tshirt', 'T-shirt', 'tops', 'torso', 'torsos/torso_tshirt.svg', TORSO, RED),

  def('legs_jeans', 'Jeans', 'bottoms', 'legs', 'legs/legs_jeans.svg', LEGS, '#2f4a8c'),
  def('legs_shorts', 'Shorts', 'bottoms', 'legs', 'legs/legs_shorts.svg', LEGS, '#3d3d3d'),
  def('legs_snowpants', 'Snow pants', 'bottoms', 'legs', 'legs/legs_snowpants.svg', LEGS, YELLOW),

  def('prop_scarf', 'Scarf', 'props', 'prop', 'props/prop_scarf.svg', PROP, YELLOW),
  def('prop_glasses', 'Glasses', 'props', 'prop', 'props/prop_glasses.svg', FACE),

  def('bg_solid_stage', 'Solid stage', 'backgrounds', 'background', 'backgrounds/bg_solid_stage.svg', STAGE, '#bfe3ff'),
  def('bg_snowy_town', 'Snowy town', 'backgrounds', 'background', 'backgrounds/bg_snowy_town.svg', STAGE),
  def('bg_bus_stop', 'Bus stop', 'backgrounds', 'background', 'backgrounds/bg_bus_stop.svg', STAGE),
];

export const ASSET_BY_ID: Record<string, AssetDef> = Object.fromEntries(ASSETS.map((a) => [a.id, a]));
const ASSET_BY_PATH = new Map(ASSETS.map((a) => [a.godotResPath, a]));

export function categoryOf(slot: AssetSlot): AssetCategory {
  return slot === 'background' || slot === 'prop' ? 'accessory' : slot;
}

/** Slot of a layer by its resource path; unknown (imported) paths fall back to their category. */
export function slotForPath(godotResPath: string, category: AssetCategory): AssetSlot {
  return ASSET_BY_PATH.get(godotResPath)?.slot ?? category;
}

/** Godot res:// path -> URL served by Vite from /public. */
export function assetUrl(godotResPath: string): string {
  return `${import.meta.env.BASE_URL}${godotResPath.replace('res://', '')}`;
}

export function layerLabel(godotResPath: string): string {
  return ASSET_BY_PATH.get(godotResPath)?.name ?? godotResPath.split('/').pop() ?? godotResPath;
}
