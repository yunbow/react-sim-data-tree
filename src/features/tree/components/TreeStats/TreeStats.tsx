import { FC } from 'react';
import { TreeStats as TreeStatsType, TreeAlgorithm, TREE_ALGORITHMS } from '../../../../types';
import styles from './TreeStats.module.css';

interface TreeStatsProps {
  stats: TreeStatsType;
  algorithm: TreeAlgorithm;
  description: string;
}

export const TreeStats: FC<TreeStatsProps> = ({ stats, algorithm, description }) => {
  const complexity = TREE_ALGORITHMS[algorithm].complexity;

  return (
    <div className={styles.container}>
      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>実行状況</h3>
        <div className={styles.statsGrid}>
          <div className={styles.stat}>
            <span className={styles.statLabel}>操作回数</span>
            <span className={styles.statValue}>{stats.operations}</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.statLabel}>ノード数</span>
            <span className={styles.statValue}>{stats.nodeCount}</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.statLabel}>木の高さ</span>
            <span className={styles.statValue}>{stats.height}</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.statLabel}>ステップ数</span>
            <span className={styles.statValue}>{stats.steps}</span>
          </div>
        </div>
      </div>

      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>計算量</h3>
        <div className={styles.complexityGrid}>
          <div className={styles.complexity}>
            <span className={styles.complexityLabel}>挿入</span>
            <span className={styles.complexityValue}>{complexity.insert}</span>
          </div>
          <div className={styles.complexity}>
            <span className={styles.complexityLabel}>削除</span>
            <span className={styles.complexityValue}>{complexity.delete}</span>
          </div>
          <div className={styles.complexity}>
            <span className={styles.complexityLabel}>探索</span>
            <span className={styles.complexityValue}>{complexity.search}</span>
          </div>
        </div>
      </div>

      {description && (
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>現在の操作</h3>
          <p className={styles.description}>{description}</p>
        </div>
      )}
    </div>
  );
};
