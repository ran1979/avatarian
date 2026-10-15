import type { AssetCategory, AssetLayer, AvatarianBlueprint } from '../types/blueprint';
import type { EditorState } from '../store/avatarStore';
import { withZ } from './layers';

const CATEGORIES: AssetCategory[] = ['head', 'eyes', 'mouth', 'eyebrows', 'hair_hat', 'torso', 'legs', 'accessory'];
const HEX = /^#[0-9a-fA-F]{6}$/;
const NUMERIC_KEYS = ['x', 'y', 'scaleX', 'scaleY', 'rotation', 'zIndex'] as const;

export type BlueprintSource = Pick<EditorState, 'projectName' | 'backgroundColor' | 'canvasWidth' | 'canvasHeight' | 'layers'>;

export function buildBlueprint(state: BlueprintSource): AvatarianBlueprint {
  return {
    version: '1.0.0',
    characterName: state.projectName,
    canvasWidth: state.canvasWidth,
    canvasHeight: state.canvasHeight,
    backgroundColor: state.backgroundColor,
    layers: withZ(state.layers),
  };
}

export function safeName(name: string): string {
  return name.trim().replace(/[^\w-]+/g, '_') || 'Avatarian';
}

/** Validates an imported blueprint and returns a clean copy. Throws with a readable message on bad input. */
export function parseBlueprint(text: string): AvatarianBlueprint {
  let data: Record<string, unknown>;
  try {
    data = JSON.parse(text) as Record<string, unknown>;
  } catch {
    throw new Error('file is not valid JSON');
  }
  if (!data || typeof data !== 'object') throw new Error('file is not a blueprint object');
  if (data.version !== '1.0.0') throw new Error(`unsupported blueprint version "${String(data.version)}"`);
  if (typeof data.characterName !== 'string') throw new Error('characterName must be a string');
  if (!Array.isArray(data.layers)) throw new Error('layers must be an array');

  const layers: AssetLayer[] = data.layers.map((raw: unknown, i: number) => {
    const l = raw as Record<string, unknown>;
    if (
      typeof l?.id !== 'string' ||
      !CATEGORIES.includes(l.category as AssetCategory) ||
      typeof l.godotResPath !== 'string' ||
      !l.godotResPath.startsWith('res://')
    ) {
      throw new Error(`layer ${i} is malformed`);
    }
    for (const key of NUMERIC_KEYS) {
      if (typeof l[key] !== 'number' || !Number.isFinite(l[key])) throw new Error(`layer ${i}: ${key} must be a number`);
    }
    if (l.fillColor !== undefined && (typeof l.fillColor !== 'string' || !HEX.test(l.fillColor))) {
      throw new Error(`layer ${i}: fillColor must be #rrggbb`);
    }
    return {
      id: l.id,
      category: l.category as AssetCategory,
      godotResPath: l.godotResPath,
      x: l.x as number,
      y: l.y as number,
      scaleX: l.scaleX as number,
      scaleY: l.scaleY as number,
      rotation: l.rotation as number,
      zIndex: l.zIndex as number,
      fillColor: l.fillColor as string | undefined,
    };
  });

  const num = (v: unknown, fallback: number) => (typeof v === 'number' && Number.isFinite(v) ? v : fallback);
  return {
    version: '1.0.0',
    characterName: data.characterName,
    canvasWidth: num(data.canvasWidth, 800),
    canvasHeight: num(data.canvasHeight, 800),
    backgroundColor: typeof data.backgroundColor === 'string' && HEX.test(data.backgroundColor) ? data.backgroundColor : '#fdf6e3',
    layers: [...layers].sort((a, b) => a.zIndex - b.zIndex),
  };
}
