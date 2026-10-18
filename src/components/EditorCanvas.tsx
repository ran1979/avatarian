import { useEffect, useMemo, useRef, useState } from 'react';
import { Stage, Layer, Rect, Line, Image as KImage, Transformer } from 'react-konva';
import type Konva from 'konva';
import type { AssetLayer } from '../types/blueprint';
import { useEditor } from '../store/avatarStore';
import { assetUrl, slotForPath } from '../data/assets';
import { useTintedImage } from '../hooks/useTintedImage';

const ASSET_SIZE = 200;

export function EditorCanvas() {
  const layers = useEditor((s) => s.layers);
  const selectedId = useEditor((s) => s.selectedId);
  const select = useEditor((s) => s.select);
  const updateLayer = useEditor((s) => s.updateLayer);
  const backgroundColor = useEditor((s) => s.backgroundColor);
  const canvasWidth = useEditor((s) => s.canvasWidth);
  const canvasHeight = useEditor((s) => s.canvasHeight);
  const showGrid = useEditor((s) => s.showGrid);
  const snap = useEditor((s) => s.snap);
  const gridSize = useEditor((s) => s.gridSize);
  const toggleGrid = useEditor((s) => s.toggleGrid);
  const toggleSnap = useEditor((s) => s.toggleSnap);
  const moveAll = useEditor((s) => s.moveAll);
  const toggleMoveAll = useEditor((s) => s.toggleMoveAll);

  const wrapRef = useRef<HTMLDivElement>(null);
  const [fit, setFit] = useState(1);

  // Scale the fixed-size stage to fit the free space.
  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const measure = () => {
      const s = Math.min((el.clientWidth - 48) / canvasWidth, (el.clientHeight - 48) / canvasHeight);
      setFit(Math.max(0.2, s));
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [canvasWidth, canvasHeight]);

  const gridLines = useMemo(() => {
    const lines = [];
    for (let x = gridSize; x < canvasWidth; x += gridSize) {
      lines.push(<Line key={`v${x}`} points={[x, 0, x, canvasHeight]} stroke="rgba(0,0,0,0.08)" strokeWidth={1} listening={false} />);
    }
    for (let y = gridSize; y < canvasHeight; y += gridSize) {
      lines.push(<Line key={`h${y}`} points={[0, y, canvasWidth, y]} stroke="rgba(0,0,0,0.08)" strokeWidth={1} listening={false} />);
    }
    return lines;
  }, [canvasWidth, canvasHeight, gridSize]);

  return (
    <div
      ref={wrapRef}
      className="relative flex min-h-0 flex-1 items-center justify-center overflow-hidden [background-image:radial-gradient(#0000001a_1px,transparent_1px)] [background-size:16px_16px]"
    >
      <div className="relative shadow-paper">
        <Stage
          width={canvasWidth * fit}
          height={canvasHeight * fit}
          scaleX={fit}
          scaleY={fit}
          onMouseDown={(e) => {
            if (e.target === e.target.getStage()) select(null);
          }}
        >
          <Layer>
            <Rect width={canvasWidth} height={canvasHeight} fill={backgroundColor} listening={false} />
            {showGrid && gridLines}
            {layers.map((layer) => (
              <LayerNode
                key={layer.id}
                layer={layer}
                selected={layer.id === selectedId}
                snapToGrid={snap}
                gridSize={gridSize}
                onSelect={() => select(layer.id)}
                onChange={(patch) => updateLayer(layer.id, patch)}
              />
            ))}
          </Layer>
        </Stage>
        {selectedId && <FloatingBar id={selectedId} />}
      </div>

      <div className="absolute left-3 top-3 flex gap-3 rounded-md border-2 border-ink bg-white px-3 py-1 text-sm font-bold">
        <label className="flex items-center gap-1">
          <input type="checkbox" checked={showGrid} onChange={toggleGrid} /> Grid
        </label>
        <label className="flex items-center gap-1">
          <input type="checkbox" checked={snap} onChange={toggleSnap} /> Snap
        </label>
        <label className="flex items-center gap-1" title="Drag any part to move the whole avatar">
          <input type="checkbox" checked={moveAll} onChange={toggleMoveAll} /> Move whole avatar
        </label>
      </div>
    </div>
  );
}

interface LayerNodeProps {
  layer: AssetLayer;
  selected: boolean;
  snapToGrid: boolean;
  gridSize: number;
  onSelect: () => void;
  onChange: (patch: Partial<AssetLayer>) => void;
}

function LayerNode({ layer, selected, snapToGrid, gridSize, onSelect, onChange }: LayerNodeProps) {
  const shapeRef = useRef<Konva.Image>(null);
  const trRef = useRef<Konva.Transformer>(null);
  const lastPos = useRef({ x: 0, y: 0 });
  const image = useTintedImage(assetUrl(layer.godotResPath), layer.fillColor);
  const moveAll = useEditor((s) => s.moveAll);
  const moveFigure = useEditor((s) => s.moveFigure);
  const isBackground = slotForPath(layer.godotResPath, layer.category) === 'background';

  // Attach the transformer whenever this layer becomes selected or its art changes.
  useEffect(() => {
    if (selected && trRef.current && shapeRef.current) {
      trRef.current.nodes([shapeRef.current]);
      trRef.current.getLayer()?.batchDraw();
    }
  }, [selected, image]);

  if (!image) return null;

  return (
    <>
      <KImage
        ref={shapeRef}
        image={image}
        x={layer.x}
        y={layer.y}
        width={ASSET_SIZE}
        height={ASSET_SIZE}
        offsetX={ASSET_SIZE / 2}
        offsetY={ASSET_SIZE / 2}
        scaleX={layer.scaleX}
        scaleY={layer.scaleY}
        rotation={layer.rotation}
        draggable
        dragBoundFunc={(pos) =>
          snapToGrid ? { x: Math.round(pos.x / gridSize) * gridSize, y: Math.round(pos.y / gridSize) * gridSize } : pos
        }
        onMouseDown={(e) => {
          e.cancelBubble = true;
          onSelect();
        }}
        onDragStart={(e) => {
          lastPos.current = { x: e.target.x(), y: e.target.y() };
        }}
        onDragMove={(e) => {
          if (!moveAll || isBackground) return;
          // Move the rest of the avatar by this step; this node follows Konva's drag.
          const { x, y } = e.target.position();
          moveFigure(x - lastPos.current.x, y - lastPos.current.y);
          lastPos.current = { x, y };
        }}
        onDragEnd={(e) => onChange({ x: e.target.x(), y: e.target.y() })}
        onTransformEnd={() => {
          const n = shapeRef.current;
          if (!n) return;
          onChange({ x: n.x(), y: n.y(), scaleX: n.scaleX(), scaleY: n.scaleY(), rotation: n.rotation() });
        }}
      />
      {selected && (
        <Transformer
          ref={trRef}
          keepRatio={false}
          flipEnabled={false}
          rotateEnabled
          boundBoxFunc={(oldBox, newBox) => (newBox.width < 20 || newBox.height < 20 ? oldBox : newBox)}
        />
      )}
    </>
  );
}

function FloatingBar({ id }: { id: string }) {
  const layer = useEditor((s) => s.layers.find((l) => l.id === id));
  const bringForward = useEditor((s) => s.bringForward);
  const sendBackward = useEditor((s) => s.sendBackward);
  const deleteLayer = useEditor((s) => s.deleteLayer);
  const updateLayer = useEditor((s) => s.updateLayer);

  if (!layer) return null;

  return (
    <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 items-center gap-2 rounded-xl border-4 border-ink bg-white p-2 shadow-paper">
      <button className="btn" onClick={() => bringForward(id)} title="Bring forward">
        ▲ Forward
      </button>
      <button className="btn" onClick={() => sendBackward(id)} title="Send backward">
        ▼ Backward
      </button>
      {layer.fillColor !== undefined && (
        <label className="flex items-center gap-1 text-sm font-bold" title="Tint">
          Color
          <input
            type="color"
            value={layer.fillColor}
            onChange={(e) => updateLayer(id, { fillColor: e.target.value })}
            className="h-7 w-9 cursor-pointer rounded border-2 border-ink"
          />
        </label>
      )}
      <button className="btn-danger" onClick={() => deleteLayer(id)} title="Delete (Del)">
        Delete
      </button>
    </div>
  );
}
