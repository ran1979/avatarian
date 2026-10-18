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
const PINK = '#ff7aa2';
const PURPLE = '#8e44ad';
const LIPSTICK = '#c2185b';
const HOT_PINK = '#ff4f7b';
const BAG = '#a0522d';

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
  def('head_pumpkin', 'Pumpkin', 'heads', 'head', 'heads/head_pumpkin.svg', FACE),
  def('head_skull', 'Skull', 'heads', 'head', 'heads/head_skull.svg', FACE),

  def('eyes_happy', 'Happy', 'eyes', 'eyes', 'eyes/eyes_happy.svg', FACE),
  def('eyes_bored', 'Bored', 'eyes', 'eyes', 'eyes/eyes_bored.svg', FACE),
  def('eyes_angry', 'Angry', 'eyes', 'eyes', 'eyes/eyes_angry.svg', FACE),
  def('eyes_wide', 'Wide', 'eyes', 'eyes', 'eyes/eyes_wide.svg', FACE),
  def('eyes_squint', 'Squinting', 'eyes', 'eyes', 'eyes/eyes_squint.svg', FACE),
  def('eyes_scary', 'Scary red', 'eyes', 'eyes', 'eyes/eyes_scary.svg', FACE),
  def('eyes_liner', 'Eyeliner wing', 'eyes', 'eyes', 'eyes/eyes_liner.svg', FACE),
  def('brows_flat', 'Flat brows', 'eyes', 'eyebrows', 'eyebrows/brows_flat.svg', FACE),
  def('brows_angry', 'Angry brows', 'eyes', 'eyebrows', 'eyebrows/brows_angry.svg', FACE),

  def('mouth_smile', 'Smile', 'mouths', 'mouth', 'mouths/mouth_smile.svg', FACE),
  def('mouth_frown', 'Frown', 'mouths', 'mouth', 'mouths/mouth_frown.svg', FACE),
  def('mouth_open', 'Open', 'mouths', 'mouth', 'mouths/mouth_open.svg', FACE),
  def('mouth_talk', 'Talking', 'mouths', 'mouth', 'mouths/mouth_talk.svg', FACE),
  def('mouth_scream_teeth', 'Screaming (teeth)', 'mouths', 'mouth', 'mouths/mouth_scream_teeth.svg', FACE),
  def('mouth_vampire', 'Vampire fangs', 'mouths', 'mouth', 'mouths/mouth_vampire.svg', FACE),
  def('mouth_lips', 'Lips', 'mouths', 'mouth', 'mouths/mouth_lips.svg', FACE, LIPSTICK),

  def('hair_beanie', 'Winter beanie', 'hair', 'hair_hat', 'hair_hats/hair_beanie.svg', FACE, RED),
  def('hair_cap', 'Cap', 'hair', 'hair_hat', 'hair_hats/hair_cap.svg', FACE, BLUE),
  def('hair_messy', 'Messy hair', 'hair', 'hair_hat', 'hair_hats/hair_messy.svg', FACE, BROWN),
  def('hair_bald', 'Bald top', 'hair', 'hair_hat', 'hair_hats/hair_bald.svg', FACE),
  def('hair_witch', 'Witch hat', 'hair', 'hair_hat', 'hair_hats/hair_witch.svg', FACE, '#2b1d4a'),
  def('hair_mohawk', 'Mohawk', 'hair', 'hair_hat', 'hair_hats/hair_mohawk.svg', FACE, '#d7263d'),
  def('hair_soldier', 'Soldier helmet', 'hair', 'hair_hat', 'hair_hats/hair_soldier.svg', FACE, '#5b6b3a'),
  def('hair_rockstar', 'Rockstar hair', 'hair', 'hair_hat', 'hair_hats/hair_rockstar.svg', FACE, '#2b2b2b'),
  def('hair_long', 'Long hair', 'hair', 'hair_hat', 'hair_hats/hair_long.svg', FACE, '#8a5a2b'),
  def('hair_afro', 'Afro', 'hair', 'hair_hat', 'hair_hats/hair_afro.svg', FACE, '#2b1d12'),
  def('hair_curly', 'Curly hair', 'hair', 'hair_hat', 'hair_hats/hair_curly.svg', FACE, '#5a3a1e'),
  def('hair_bun', 'Bun', 'hair', 'hair_hat', 'hair_hats/hair_bun.svg', FACE, '#6b4423'),
  def('hat_cowboy', 'Cowboy hat', 'hair', 'hair_hat', 'hair_hats/hat_cowboy.svg', FACE, '#8a5a2b'),
  def('hair_headband', 'Headband with bow', 'hair', 'hair_hat', 'hair_hats/hair_headband.svg', FACE, PINK),

  def('torso_puffy', 'Puffy jacket', 'tops', 'torso', 'torsos/torso_puffy.svg', TORSO, BLUE),
  def('torso_hoodie', 'Hoodie', 'tops', 'torso', 'torsos/torso_hoodie.svg', TORSO, GREEN),
  def('torso_tshirt', 'T-shirt', 'tops', 'torso', 'torsos/torso_tshirt.svg', TORSO, RED),
  def('torso_bikini', 'Bikini top', 'tops', 'torso', 'torsos/torso_bikini.svg', TORSO, HOT_PINK),
  def('torso_crop_top', 'Crop top', 'tops', 'torso', 'torsos/torso_crop_top.svg', TORSO, PINK),

  def('legs_jeans', 'Jeans', 'bottoms', 'legs', 'legs/legs_jeans.svg', LEGS, '#2f4a8c'),
  def('legs_shorts', 'Shorts', 'bottoms', 'legs', 'legs/legs_shorts.svg', LEGS, '#3d3d3d'),
  def('legs_snowpants', 'Snow pants', 'bottoms', 'legs', 'legs/legs_snowpants.svg', LEGS, YELLOW),
  def('legs_skirt', 'Long skirt', 'bottoms', 'legs', 'legs/legs_skirt.svg', LEGS, PURPLE),
  def('legs_skirt_mini', 'Mini skirt', 'bottoms', 'legs', 'legs/legs_skirt_mini.svg', LEGS, PINK),

  def('prop_scarf', 'Scarf', 'props', 'prop', 'props/prop_scarf.svg', PROP, YELLOW),
  def('prop_scarf_silk', 'Silk scarf', 'props', 'prop', 'props/prop_scarf_silk.svg', PROP, PINK),
  def('prop_sunglasses_cat', 'Cat-eye sunglasses', 'props', 'prop', 'props/prop_sunglasses_cat.svg', FACE),
  def('prop_handbag', 'Handbag', 'props', 'prop', 'props/prop_handbag.svg', PROP, BAG),
  def('prop_glasses', 'Glasses', 'props', 'prop', 'props/prop_glasses.svg', FACE),
  def('prop_bat', 'Bat bow tie', 'props', 'prop', 'props/prop_bat.svg', PROP),

  def('bg_solid_stage', 'Solid stage', 'backgrounds', 'background', 'backgrounds/bg_solid_stage.svg', STAGE, '#bfe3ff'),
  def('bg_snowy_town', 'Snowy town', 'backgrounds', 'background', 'backgrounds/bg_snowy_town.svg', STAGE),
  def('bg_bus_stop', 'Bus stop', 'backgrounds', 'background', 'backgrounds/bg_bus_stop.svg', STAGE),
  def('bg_graveyard', 'Graveyard', 'backgrounds', 'background', 'backgrounds/bg_graveyard.svg', STAGE),
  def('bg_ny_city', 'NY city', 'backgrounds', 'background', 'backgrounds/bg_ny_city.svg', STAGE),
  def('bg_ocean', 'Ocean', 'backgrounds', 'background', 'backgrounds/bg_ocean.svg', STAGE),
  def('bg_forest', 'Forest', 'backgrounds', 'background', 'backgrounds/bg_forest.svg', STAGE),
  def('bg_space', 'Space', 'backgrounds', 'background', 'backgrounds/bg_space.svg', STAGE),
  def('bg_white_house', 'White House', 'backgrounds', 'background', 'backgrounds/bg_white_house.svg', STAGE),
  def('bg_burger_place', 'Burger place', 'backgrounds', 'background', 'backgrounds/bg_burger_place.svg', STAGE),
  def('bg_carnival', 'Carnival', 'backgrounds', 'background', 'backgrounds/bg_carnival.svg', STAGE),
  def('bg_moon', 'Moon', 'backgrounds', 'background', 'backgrounds/bg_moon.svg', STAGE),
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
