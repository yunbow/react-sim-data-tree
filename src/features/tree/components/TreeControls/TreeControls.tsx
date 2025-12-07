import { FC } from 'react';
import { TreeAlgorithm, TREE_ALGORITHMS } from '../../../../types';
import { Button } from '../../../../components/Button';
import { Select } from '../../../../components/Select';
import { Input } from '../../../../components/Input';
import { Slider } from '../../../../components/Slider';
import styles from './TreeControls.module.css';

interface TreeControlsProps {
  algorithm: TreeAlgorithm;
  onAlgorithmChange: (algorithm: TreeAlgorithm) => void;
  nodeCount: number;
  onNodeCountChange: (count: number) => void;
  insertValue: string;
  onInsertValueChange: (value: string) => void;
  deleteValue: string;
  onDeleteValueChange: (value: string) => void;
  speed: number;
  onSpeedChange: (speed: number) => void;
  isRunning: boolean;
  onInsert: () => void;
  onDelete: () => void;
  onReset: () => void;
}

export const TreeControls: FC<TreeControlsProps> = ({
  algorithm,
  onAlgorithmChange,
  nodeCount,
  onNodeCountChange,
  insertValue,
  onInsertValueChange,
  deleteValue,
  onDeleteValueChange,
  speed,
  onSpeedChange,
  isRunning,
  onInsert,
  onDelete,
  onReset,
}) => {
  const algorithmOptions = Object.entries(TREE_ALGORITHMS).map(([value, { name }]) => ({
    value,
    label: name,
  }));

  return (
    <div className={styles.container}>
      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>アルゴリズム設定</h3>
        <div className={styles.row}>
          <Select
            label="アルゴリズム"
            options={algorithmOptions}
            value={algorithm}
            onChange={(e) => onAlgorithmChange(e.target.value as TreeAlgorithm)}
            disabled={isRunning}
          />
        </div>
      </div>

      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>初期データ</h3>
        <div className={styles.row}>
          <Input
            label="ノード数"
            type="number"
            min={1}
            max={20}
            value={nodeCount}
            onChange={(e) => onNodeCountChange(Number(e.target.value))}
            disabled={isRunning}
          />
        </div>
      </div>

      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>操作</h3>
        <div className={styles.row}>
          <Input
            label="挿入する値"
            type="number"
            value={insertValue}
            onChange={(e) => onInsertValueChange(e.target.value)}
            disabled={isRunning}
            placeholder="例: 42"
          />
          <Button onClick={onInsert} disabled={isRunning || !insertValue}>
            挿入
          </Button>
        </div>
        <div className={styles.row}>
          <Input
            label="削除する値"
            type="number"
            value={deleteValue}
            onChange={(e) => onDeleteValueChange(e.target.value)}
            disabled={isRunning}
            placeholder="例: 10"
          />
          <Button onClick={onDelete} disabled={isRunning || !deleteValue} variant="destructive">
            削除
          </Button>
        </div>
      </div>

      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>実行制御</h3>
        <div className={styles.row}>
          <Slider
            label="アニメーション速度"
            min={1}
            max={100}
            value={speed}
            onChange={(e) => onSpeedChange(Number(e.target.value))}
            showValue
          />
        </div>
        <div className={styles.row}>
          <Button onClick={onReset} variant="secondary" disabled={isRunning}>
            リセット
          </Button>
        </div>
      </div>
    </div>
  );
};
