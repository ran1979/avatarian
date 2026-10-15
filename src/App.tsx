import { useEffect } from 'react';
import { Toolbar } from './components/Toolbar';
import { AssetSidebar } from './components/AssetSidebar';
import { EditorCanvas } from './components/EditorCanvas';
import { Inspector } from './components/Inspector';
import { useEditor } from './store/avatarStore';

export default function App() {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement).tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;
      const { selectedId, deleteLayer } = useEditor.getState();
      if (selectedId && (e.key === 'Delete' || e.key === 'Backspace')) deleteLayer(selectedId);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return (
    <div className="flex h-screen flex-col bg-paper text-ink">
      <Toolbar />
      <div className="flex min-h-0 flex-1">
        <AssetSidebar />
        <main className="flex min-w-0 flex-1 flex-col">
          <EditorCanvas />
        </main>
        <Inspector />
      </div>
    </div>
  );
}
