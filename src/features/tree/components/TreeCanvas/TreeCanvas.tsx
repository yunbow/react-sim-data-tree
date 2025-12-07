import { FC, useEffect, useRef } from 'react';
import { Network } from 'vis-network';
import { DataSet } from 'vis-data';
import { TreeNode } from '../../../../types';
import styles from './TreeCanvas.module.css';

interface TreeCanvasProps {
  nodes: TreeNode[];
}

interface VisNode {
  id: string;
  label: string;
  color: {
    background: string;
    border: string;
  };
  borderWidth: number;
  level?: number;
  font?: {
    color: string;
  };
}

interface VisEdge {
  id?: string;
  from: string;
  to: string;
}

export const TreeCanvas: FC<TreeCanvasProps> = ({ nodes }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const networkRef = useRef<Network | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Get computed styles from CSS variables
    const rootStyles = getComputedStyle(document.documentElement);
    const getColor = (varName: string) => rootStyles.getPropertyValue(varName).trim();

    // Node state colors from CSS variables
    const stateColors = {
      visiting: getColor('--color-visiting'),     // 黄色 - 操作中（選択中）
      candidate: getColor('--color-candidate'),   // オレンジ色 - 再配置中（回転対象など）
      comparing: getColor('--color-comparing'),   // 青色 - 挿入ノード
      committed: getColor('--color-committed'),   // 赤色 - 削除ノード
      idle: getColor('--color-idle'),             // グレー - 無関係ノード
      default: getColor('--color-default'),       // 青 - デフォルト
    };

    // Convert tree nodes to vis.js format
    const visNodes: VisNode[] = [];
    const visEdges: VisEdge[] = [];

    const processNode = (node: TreeNode | null | undefined, level: number = 0): void => {
      if (!node) return;

      const borderWidth = node.state === 'visiting' || node.state === 'comparing' ? 4 : 2;

      // For Red-Black Tree nodes, use the node's color property
      let backgroundColor = '#ffffff';
      let fontColor = '#000000';
      if (node.color === 'red') {
        backgroundColor = '#ffcccc'; // Light red
        fontColor = '#000000'; // Black text
      } else if (node.color === 'black') {
        backgroundColor = '#333333'; // Dark gray/black
        fontColor = '#ffffff'; // White text
      }

      // Border color from node state using CSS variables
      const borderColor = stateColors[node.state] || stateColors.default;

      visNodes.push({
        id: node.id,
        label: String(node.value),
        color: {
          background: backgroundColor,
          border: borderColor,
        },
        borderWidth,
        level,
        font: {
          color: fontColor,
        },
      });

      if (node.left) {
        visEdges.push({
          from: node.id,
          to: node.left.id,
        });
        processNode(node.left, level + 1);
      }

      if (node.right) {
        visEdges.push({
          from: node.id,
          to: node.right.id,
        });
        processNode(node.right, level + 1);
      }
    };

    if (nodes.length > 0) {
      processNode(nodes[0]);
    }

    // Create DataSets
    const nodesDataSet = new DataSet<VisNode>(visNodes);
    const edgesDataSet = new DataSet<VisEdge>(visEdges);

    // Network options
    const options = {
      layout: {
        hierarchical: {
          direction: 'UD', // Up-Down
          sortMethod: 'directed',
          nodeSpacing: 150,
          levelSeparation: 100,
        },
      },
      physics: {
        enabled: false,
      },
      edges: {
        color: {
          color: '#848484',
          highlight: '#848484',
        },
        smooth: {
          enabled: true,
          type: 'cubicBezier',
          forceDirection: 'vertical',
          roundness: 0.4,
        },
        arrows: {
          to: {
            enabled: true,
            scaleFactor: 0.8,
          },
        },
      },
      nodes: {
        shape: 'circle',
        size: 30,
        color: {
          background: '#ffffff',
          border: '#848484',
          highlight: {
            background: '#ffffff',
            border: '#848484',
          },
        },
        font: {
          size: 16,
          color: '#000000',
          face: 'Arial, sans-serif',
          bold: {
            face: 'Arial, sans-serif',
          },
        },
        borderWidth: 2,
        borderWidthSelected: 4,
        shadow: {
          enabled: true,
          color: 'rgba(0, 0, 0, 0.3)',
          size: 10,
          x: 3,
          y: 3,
        },
      },
      interaction: {
        dragNodes: false,
        dragView: true,
        zoomView: true,
        selectable: false,
      },
    };

    // Create or update network
    if (!networkRef.current) {
      networkRef.current = new Network(
        containerRef.current,
        {
          nodes: nodesDataSet,
          edges: edgesDataSet,
        },
        options
      );
    } else {
      networkRef.current.setData({
        nodes: nodesDataSet,
        edges: edgesDataSet,
      });
    }

    // Cleanup
    return () => {
      // Don't destroy on every update, only on unmount
    };
  }, [nodes]);

  useEffect(() => {
    return () => {
      if (networkRef.current) {
        networkRef.current.destroy();
        networkRef.current = null;
      }
    };
  }, []);

  return (
    <div className={styles.container}>
      {nodes.length === 0 ? (
        <div className={styles.emptyMessage}>ツリーが空です</div>
      ) : (
        <div ref={containerRef} className={styles.network} />
      )}
    </div>
  );
};
