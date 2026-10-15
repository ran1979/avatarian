export type AssetCategory =
  | 'head'
  | 'eyes'
  | 'mouth'
  | 'eyebrows'
  | 'hair_hat'
  | 'torso'
  | 'legs'
  | 'accessory';

export interface AssetLayer {
  id: string;
  category: AssetCategory;
  godotResPath: string; // e.g. "res://assets/heads/head_round.svg"
  x: number;
  y: number;
  scaleX: number;
  scaleY: number;
  rotation: number;
  zIndex: number;
  fillColor?: string; // Modulate color (hex string), only on tintable layers
}

export interface AvatarianBlueprint {
  version: '1.0.0';
  characterName: string;
  canvasWidth: number;
  canvasHeight: number;
  backgroundColor: string;
  layers: AssetLayer[];
}
