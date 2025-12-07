import { FC } from 'react';
import { useTreeSimulator } from '../hooks/useTreeSimulator';
import { TreeCanvas } from '../components/TreeCanvas';
import { TreeControls } from '../components/TreeControls';
import { TreeStats } from '../components/TreeStats';
import styles from './TreeSimulator.module.css';

export const TreeSimulator: FC = () => {
  const {
    algorithm,
    nodeCount,
    insertValue,
    deleteValue,
    speed,
    isRunning,
    nodes,
    stats,
    description,
    setAlgorithm,
    setNodeCount,
    setInsertValue,
    setDeleteValue,
    setSpeed,
    handleInsert,
    handleDelete,
    reset,
  } = useTreeSimulator();

  return (
    <div className={styles.container}>
      <div className={styles.sidebar}>
        <TreeControls
          algorithm={algorithm}
          onAlgorithmChange={setAlgorithm}
          nodeCount={nodeCount}
          onNodeCountChange={setNodeCount}
          insertValue={insertValue}
          onInsertValueChange={setInsertValue}
          deleteValue={deleteValue}
          onDeleteValueChange={setDeleteValue}
          speed={speed}
          onSpeedChange={setSpeed}
          isRunning={isRunning}
          onInsert={handleInsert}
          onDelete={handleDelete}
          onReset={reset}
        />
      </div>

      <div className={styles.main}>
        <TreeCanvas nodes={nodes} />
      </div>

      <div className={styles.sidebar}>
        <TreeStats stats={stats} algorithm={algorithm} description={description} />
      </div>
    </div>
  );
};
