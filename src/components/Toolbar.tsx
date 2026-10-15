import { useRef, useState, type ReactNode } from 'react';
import { useEditor } from '../store/avatarStore';
import { buildBlueprint, parseBlueprint, safeName } from '../lib/blueprint';
import { download, renderPng, renderSvg } from '../lib/exporters';
import { GODOT_IMPORT_SCRIPT } from '../lib/godot';

export function Toolbar() {
  const projectName = useEditor((s) => s.projectName);
  const setProjectName = useEditor((s) => s.setProjectName);
  const randomize = useEditor((s) => s.randomize);
  const loadBlueprint = useEditor((s) => s.loadBlueprint);

  const [menuOpen, setMenuOpen] = useState(false);
  const [transparent, setTransparent] = useState(true);
  const [toast, setToast] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const notify = (message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(null), 2500);
  };

  const fileBase = () => safeName(useEditor.getState().projectName);

  const run = async (action: () => Promise<void>, success: string) => {
    setMenuOpen(false);
    try {
      await action();
      notify(success);
    } catch (err) {
      notify(`Failed: ${(err as Error).message}`);
    }
  };

  const exportPng = () =>
    run(async () => {
      const blob = await renderPng(useEditor.getState(), transparent);
      download(`${fileBase()}.png`, blob, 'image/png');
    }, 'PNG exported');

  const exportSvg = () =>
    run(async () => {
      const svg = await renderSvg(useEditor.getState(), transparent);
      download(`${fileBase()}.svg`, svg, 'image/svg+xml');
    }, 'SVG exported');

  const exportBlueprint = () =>
    run(async () => {
      const json = JSON.stringify(buildBlueprint(useEditor.getState()), null, 2);
      download(`${fileBase()}.json`, json, 'application/json');
    }, 'Godot blueprint exported');

  const copyGodotScript = () =>
    run(async () => {
      await navigator.clipboard.writeText(GODOT_IMPORT_SCRIPT);
    }, 'Godot import script copied');

  const importBlueprint = async (file: File) => {
    try {
      loadBlueprint(parseBlueprint(await file.text()));
      notify('Blueprint loaded');
    } catch (err) {
      notify(`Import failed: ${(err as Error).message}`);
    } finally {
      if (fileRef.current) fileRef.current.value = '';
    }
  };

  return (
    <header className="flex flex-wrap items-center gap-4 border-b-4 border-ink bg-panel px-4 py-2">
      <h1 className="font-display text-4xl tracking-wider text-accent">Avatarian</h1>

      <input
        value={projectName}
        onChange={(e) => setProjectName(e.target.value)}
        aria-label="Project name"
        className="w-64 rounded-md border-2 border-ink bg-white px-3 py-1 font-bold"
      />

      <button className="btn" onClick={randomize}>
        🎲 Randomize
      </button>

      <div className="relative ml-auto">
        <button className="btn-primary btn" onClick={() => setMenuOpen((o) => !o)} aria-expanded={menuOpen}>
          Export ▾
        </button>

        {menuOpen && (
          <div className="absolute right-0 top-full z-20 mt-2 w-72 space-y-1 rounded-xl border-4 border-ink bg-white p-2 shadow-paper">
            <label className="flex items-center gap-2 px-2 py-1 text-sm">
              <input type="checkbox" checked={transparent} onChange={(e) => setTransparent(e.target.checked)} />
              Transparent background
            </label>
            <MenuItem onClick={exportPng}>Download PNG Avatar</MenuItem>
            <MenuItem onClick={exportSvg}>Download SVG Cut-out</MenuItem>
            <hr className="border-ink/20" />
            <MenuItem onClick={exportBlueprint}>Export Godot 4 Blueprint (.json)</MenuItem>
            <MenuItem onClick={copyGodotScript}>Copy Godot Import Script</MenuItem>
            <MenuItem
              onClick={() => {
                setMenuOpen(false);
                fileRef.current?.click();
              }}
            >
              Import Existing JSON
            </MenuItem>
          </div>
        )}
      </div>

      <input
        ref={fileRef}
        type="file"
        accept="application/json,.json"
        hidden
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) void importBlueprint(file);
        }}
      />

      {toast && (
        <div role="status" className="fixed bottom-4 right-4 z-50 rounded-lg border-2 border-ink bg-ink px-4 py-2 font-bold text-white shadow-paper">
          {toast}
        </div>
      )}
    </header>
  );
}

function MenuItem({ onClick, children }: { onClick: () => void; children: ReactNode }) {
  return (
    <button onClick={onClick} className="w-full rounded px-2 py-1.5 text-left text-sm font-semibold hover:bg-paper">
      {children}
    </button>
  );
}
