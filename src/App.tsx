import { TreeSimulator } from './features/tree/TreeSimulator';
import './theme.css';
import './App.css';

function App() {
  return (
    <div>
      <header style={{ marginBottom: '2rem', textAlign: 'center' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 700, marginBottom: '0.5rem' }}>
          ツリーデータ構造 シミュレーター
        </h1>
        <p style={{ fontSize: '1rem', color: 'var(--color-muted-foreground)' }}>
          二分探索木とその派生アルゴリズムの可視化ツール
        </p>
      </header>

      <main>
        <TreeSimulator />
      </main>
    </div>
  );
}

export default App;
