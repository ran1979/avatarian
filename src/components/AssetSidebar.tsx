import { useState } from 'react';
import { ASSETS, TABS, assetUrl, type AssetTab } from '../data/assets';
import { useEditor } from '../store/avatarStore';

export function AssetSidebar() {
  const [tab, setTab] = useState<AssetTab>('heads');
  const addAsset = useEditor((s) => s.addAsset);
  const items = ASSETS.filter((a) => a.tab === tab);

  return (
    <aside className="flex w-64 shrink-0 flex-col border-r-4 border-ink bg-panel">
      <div className="grid grid-cols-2 gap-1 border-b-4 border-ink p-2">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`rounded border-2 border-ink px-2 py-1 text-sm font-bold transition ${
              tab === t.id ? 'bg-accent text-white' : 'bg-white hover:bg-paper'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 content-start gap-2 overflow-y-auto p-2">
        {items.map((a) => (
          <button
            key={a.id}
            title={`Add ${a.name}`}
            onClick={() => addAsset(a)}
            className="flex flex-col items-center rounded-lg border-2 border-ink bg-white p-2 transition hover:-translate-y-0.5 hover:shadow-paper"
          >
            <img src={assetUrl(a.godotResPath)} alt={a.name} draggable={false} className="h-20 w-20 object-contain" />
            <span className="mt-1 text-xs font-semibold">{a.name}</span>
          </button>
        ))}
      </div>
    </aside>
  );
}
