import { create } from 'zustand';
import type { AssetLayer, AvatarianBlueprint } from '../types/blueprint';
import { ASSET_BY_ID, slotForPath, type AssetDef } from '../data/assets';
import { createLayer, withZ } from '../lib/layers';
import { randomLayers } from '../lib/randomize';

export type LayerPatch = Partial<Pick<AssetLayer, 'x' | 'y' | 'scaleX' | 'scaleY' | 'rotation' | 'fillColor'>>;

export interface EditorState {
  projectName: string;
  backgroundColor: string;
  canvasWidth: number;
  canvasHeight: number;
  layers: AssetLayer[];
  selectedId: string | null;
  showGrid: boolean;
  snap: boolean;
  gridSize: number;
  moveAll: boolean;

  setProjectName: (name: string) => void;
  setBackgroundColor: (color: string) => void;
  toggleGrid: () => void;
  toggleSnap: () => void;
  toggleMoveAll: () => void;
  moveFigure: (dx: number, dy: number) => void;
  select: (id: string | null) => void;
  addAsset: (asset: AssetDef) => void;
  updateLayer: (id: string, patch: LayerPatch) => void;
  deleteLayer: (id: string) => void;
  moveLayer: (id: string, toIndex: number) => void;
  bringForward: (id: string) => void;
  sendBackward: (id: string) => void;
  randomize: () => void;
  loadBlueprint: (bp: AvatarianBlueprint) => void;
}

const STARTER_IDS = ['bg_snowy_town', 'legs_jeans', 'torso_tshirt', 'head_round', 'eyes_happy', 'brows_flat', 'mouth_smile', 'hair_beanie'];

export const useEditor = create<EditorState>()((set, get) => ({
  projectName: 'My_Avatarian_Character',
  backgroundColor: '#fdf6e3',
  canvasWidth: 800,
  canvasHeight: 800,
  layers: withZ(STARTER_IDS.map((id) => createLayer(ASSET_BY_ID[id]))),
  selectedId: null,
  showGrid: true,
  snap: false,
  gridSize: 20,
  moveAll: false,

  setProjectName: (projectName) => set({ projectName }),
  setBackgroundColor: (backgroundColor) => set({ backgroundColor }),
  toggleGrid: () => set((s) => ({ showGrid: !s.showGrid })),
  toggleSnap: () => set((s) => ({ snap: !s.snap })),
  toggleMoveAll: () => set((s) => ({ moveAll: !s.moveAll })),
  // Shift every non-background layer together. Background stays put.
  moveFigure: (dx, dy) =>
    set((s) => ({
      layers: s.layers.map((l) =>
        slotForPath(l.godotResPath, l.category) === 'background' ? l : { ...l, x: l.x + dx, y: l.y + dy },
      ),
    })),
  select: (selectedId) => set({ selectedId }),

  addAsset: (asset) =>
    set((s) => {
      const fresh = createLayer(asset);
      if (asset.slot === 'prop') {
        return { layers: withZ([...s.layers, fresh]), selectedId: fresh.id };
      }
      // Single-slot: swap in place, keeping the old transform and draw order.
      const idx = s.layers.findIndex((l) => slotForPath(l.godotResPath, l.category) === asset.slot);
      if (idx === -1) {
        const layers = asset.slot === 'background' ? [fresh, ...s.layers] : [...s.layers, fresh];
        return { layers: withZ(layers), selectedId: fresh.id };
      }
      const old = s.layers[idx];
      const swapped: AssetLayer = {
        ...old,
        category: fresh.category,
        godotResPath: fresh.godotResPath,
        fillColor: asset.tintable ? (old.fillColor ?? asset.defaultColor) : undefined,
      };
      return { layers: s.layers.map((l, i) => (i === idx ? swapped : l)), selectedId: old.id };
    }),

  updateLayer: (id, patch) => set((s) => ({ layers: s.layers.map((l) => (l.id === id ? { ...l, ...patch } : l)) })),

  deleteLayer: (id) =>
    set((s) => ({
      layers: withZ(s.layers.filter((l) => l.id !== id)),
      selectedId: s.selectedId === id ? null : s.selectedId,
    })),

  moveLayer: (id, toIndex) =>
    set((s) => {
      const from = s.layers.findIndex((l) => l.id === id);
      if (from === -1) return {};
      const next = [...s.layers];
      const [item] = next.splice(from, 1);
      next.splice(Math.max(0, Math.min(toIndex, next.length)), 0, item);
      return { layers: withZ(next) };
    }),

  bringForward: (id) => {
    const { layers, moveLayer } = get();
    const i = layers.findIndex((l) => l.id === id);
    if (i !== -1 && i < layers.length - 1) moveLayer(id, i + 1);
  },

  sendBackward: (id) => {
    const { layers, moveLayer } = get();
    const i = layers.findIndex((l) => l.id === id);
    if (i > 0) moveLayer(id, i - 1);
  },

  randomize: () => set({ layers: randomLayers(), selectedId: null }),

  loadBlueprint: (bp) =>
    set({
      projectName: bp.characterName,
      backgroundColor: bp.backgroundColor,
      canvasWidth: bp.canvasWidth,
      canvasHeight: bp.canvasHeight,
      layers: withZ(bp.layers),
      selectedId: null,
    }),
}));
