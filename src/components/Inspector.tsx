import { useState } from 'react';
import type { AssetLayer } from '../types/blueprint';
import { layerLabel } from '../data/assets';
import { useEditor } from '../store/avatarStore';

export function Inspector() {
  const layers = useEditor((s) => s.layers);
  const selectedId = useEditor((s) => s.selectedId);
  const backgroundColor = useEditor((s) => s.backgroundColor);
  const setBackgroundColor = useEditor((s) => s.setBackgroundColor);
  const layer = layers.find((l) => l.id === selectedId);

  return (
    <aside className="flex w-72 shrink-0 flex-col gap-5 overflow-y-auto border-l-4 border-ink bg-panel p-4">
      {layer ? (
        <LayerControls key={layer.id} layer={layer} />
      ) : (
        <section className="space-y-3">
          <h2 className="font-display text-2xl tracking-wide">Canvas</h2>
          <label className="flex items-center justify-between text-sm font-bold">
            Background
            <input
              type="color"
              value={backgroundColor}
              onChange={(e) => setBackgroundColor(e.target.value)}
              className="h-8 w-12 cursor-pointer rounded border-2 border-ink"
            />
          </label>
          <p className="text-sm text-ink/70">Click a part on the canvas to fine-tune it.</p>
        </section>
      )}

      <LayerList />
    </aside>
  );
}

function LayerControls({ layer }: { layer: AssetLayer }) {
  const index = useEditor((s) => s.layers.findIndex((l) => l.id === layer.id));
  const count = useEditor((s) => s.layers.length);
  const updateLayer = useEditor((s) => s.updateLayer);
  const moveLayer = useEditor((s) => s.moveLayer);
  const [uniform, setUniform] = useState(true);

  const setScale = (axis: 'x' | 'y', value: number) => {
    if (uniform) updateLayer(layer.id, { scaleX: value, scaleY: value });
    else updateLayer(layer.id, axis === 'x' ? { scaleX: value } : { scaleY: value });
  };

  return (
    <section className="space-y-4">
      <div>
        <h2 className="font-display text-2xl tracking-wide">{layerLabel(layer.godotResPath)}</h2>
        <p className="text-xs text-ink/60">{layer.category}</p>
      </div>

      <Slider label="X position" value={layer.x} min={0} max={800} step={1} onChange={(v) => updateLayer(layer.id, { x: v })} />
      <Slider label="Y position" value={layer.y} min={0} max={800} step={1} onChange={(v) => updateLayer(layer.id, { y: v })} />
      <Slider label="Width scale" value={layer.scaleX} min={0.2} max={4} step={0.01} digits={2} onChange={(v) => setScale('x', v)} />
      <Slider label="Height scale" value={layer.scaleY} min={0.2} max={4} step={0.01} digits={2} onChange={(v) => setScale('y', v)} />
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" checked={uniform} onChange={(e) => setUniform(e.target.checked)} /> Uniform scale
      </label>
      <Slider label="Angle" value={layer.rotation} min={-180} max={180} step={1} onChange={(v) => updateLayer(layer.id, { rotation: v })} />
      <Slider
        label="Layer order"
        value={index}
        min={0}
        max={Math.max(0, count - 1)}
        step={1}
        onChange={(v) => moveLayer(layer.id, v)}
      />

      {layer.fillColor !== undefined && (
        <label className="flex items-center justify-between text-sm font-bold">
          Tint
          <span className="flex items-center gap-2">
            <code className="text-xs font-normal">{layer.fillColor}</code>
            <input
              type="color"
              value={layer.fillColor}
              onChange={(e) => updateLayer(layer.id, { fillColor: e.target.value })}
              className="h-8 w-12 cursor-pointer rounded border-2 border-ink"
            />
          </span>
        </label>
      )}
    </section>
  );
}

function LayerList() {
  const layers = useEditor((s) => s.layers);
  const selectedId = useEditor((s) => s.selectedId);
  const select = useEditor((s) => s.select);

  return (
    <section className="space-y-2">
      <h3 className="text-sm font-bold uppercase tracking-wide">Layers (top first)</h3>
      <ul className="space-y-1">
        {[...layers].reverse().map((l) => (
          <li key={l.id}>
            <button
              onClick={() => select(l.id)}
              className={`flex w-full justify-between rounded border-2 px-2 py-1 text-left text-sm ${
                l.id === selectedId ? 'border-accent bg-accent/10 font-bold' : 'border-ink/20 bg-white hover:border-ink'
              }`}
            >
              <span>{layerLabel(l.godotResPath)}</span>
              <span className="text-xs text-ink/50">{l.category}</span>
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}

interface SliderProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  digits?: number;
  onChange: (value: number) => void;
}

function Slider({ label, value, min, max, step, digits = 0, onChange }: SliderProps) {
  return (
    <label className="block text-sm">
      <span className="flex justify-between font-bold">
        <span>{label}</span>
        <span className="tabular-nums">{value.toFixed(digits)}</span>
      </span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-accent"
      />
    </label>
  );
}
