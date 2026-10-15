# Avatarian

A web-based 2D character creator and animator inspired by South Park's cut-out paper style. Build a character from layered SVG parts, position and tint them, then export a PNG, an SVG cut-out, or a Godot 4 blueprint.

## Features

- Asset library by tab: heads, eyes, mouths, hair & hats, tops, bottoms, props, backgrounds.
- Click an asset to add it, or to swap the matching single-slot part (head, eyes, mouth, and so on).
- Canvas editing with drag, scale, and rotate handles, optional grid and snapping.
- Inspector sliders for X/Y, width/height scale, angle, and layer order, plus a tint color picker.
- Bring forward, send backward, and delete. Delete and Backspace also remove the selected layer.
- Randomize builds a valid persona from one part per slot.
- Export PNG (optional transparent background), SVG cut-out, and Godot 4 blueprint JSON.
- Copy a Godot GDScript loader to the clipboard, and import a saved blueprint JSON.

## Requirements

- Node.js 18 or newer
- npm

## Getting started

```bash
npm install
npm run dev      # http://localhost:5173
```

Other scripts:

```bash
npm run build    # typecheck + production build into dist/
npm run preview  # serve the production build locally
```

## Project layout

```
public/assets/          SVG asset library (Godot res://assets/ mirror)
src/
  App.tsx               Layout: toolbar, sidebar, canvas, inspector
  components/           Toolbar, AssetSidebar, EditorCanvas, Inspector
  store/avatarStore.ts  Zustand store for layers, selection, and canvas state
  data/assets.ts        Asset catalog: paths, tabs, slots, default placement and tint
  data/palettes.ts      Skin and clothing colors
  hooks/                useTintedImage
  lib/                  Export, blueprint build and validation, Godot script, randomize
  types/blueprint.ts    AssetLayer and AvatarianBlueprint types
```

## How assets and tinting work

- Every asset is a 200×200 SVG. Parts that share a default placement line up on the figure.
- Tintable parts are white in the SVG and marked with `data-tint="true"`. The editor sets their fill to the layer's `fillColor`.
- In Godot, the same white art is tinted with `Sprite2D.modulate = fillColor`, so both produce the same color.
- `godotResPath` values are `res://assets/...` paths. In the browser, they map to `/assets/...` under `public/`.

## Blueprint format

Exported JSON (`version: "1.0.0"`):

```json
{
  "version": "1.0.0",
  "characterName": "My_Avatarian_Character",
  "canvasWidth": 800,
  "canvasHeight": 800,
  "backgroundColor": "#fdf6e3",
  "layers": [
    {
      "id": "bg_snowy_town-…",
      "category": "accessory",
      "godotResPath": "res://assets/backgrounds/bg_snowy_town.svg",
      "x": 400, "y": 400,
      "scaleX": 4, "scaleY": 4,
      "rotation": 0,
      "zIndex": 0
    }
  ]
}
```

Layers are listed bottom to top. `fillColor` appears only on tintable layers.

## Using the blueprint in Godot 4

1. Copy `public/assets/` into your Godot project so it becomes `res://assets/`.
2. Save the exported JSON in the project, for example as `res://avatarian_blueprint.json`.
3. In the editor, use **Export ▾ → Copy Godot Import Script**. Save it as a `.gd` file and attach it to a `Node2D`.
4. Set `blueprint_path` on that node if your JSON lives elsewhere.

The loader creates one `Sprite2D` per layer, in `zIndex` order, with position, scale, rotation, and tint applied.

## Notes

- Backgrounds are stored as `accessory` layers, since the blueprint category list has no background value. They are pinned to the bottom layer.
- The asset library is hand-drawn placeholder art. Add new parts by dropping an SVG into `public/assets/<folder>/` and adding an entry in `src/data/assets.ts`.
