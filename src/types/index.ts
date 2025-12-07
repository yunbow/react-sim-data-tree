export type TreeAlgorithm =
  | 'bst'
  | 'avl'
  | 'redblack'
  | 'minheap'
  | 'maxheap';

export type NodeState =
  | 'default'
  | 'visiting'
  | 'candidate'
  | 'comparing'
  | 'committed'
  | 'idle';

export interface TreeNode {
  id: string;
  value: number | string;
  state: NodeState;
  x?: number;
  y?: number;
  children?: TreeNode[];
  left?: TreeNode | null;
  right?: TreeNode | null;
  parent?: TreeNode | null;
  height?: number;
  color?: 'red' | 'black';
}

export interface TreeStep {
  nodes: (TreeNode | null)[];
  description: string;
  operations: number;
}

export interface TreeStats {
  operations: number;
  height: number;
  nodeCount: number;
  steps: number;
}

export interface TreeComplexity {
  insert: string;
  delete: string;
  search: string;
}

export const TREE_ALGORITHMS: Record<TreeAlgorithm, { name: string; complexity: TreeComplexity }> = {
  bst: {
    name: '二分探索木 (BST)',
    complexity: { insert: 'O(n)', delete: 'O(n)', search: 'O(n)' },
  },
  avl: {
    name: 'AVL木',
    complexity: { insert: 'O(log n)', delete: 'O(log n)', search: 'O(log n)' },
  },
  redblack: {
    name: '赤黒木',
    complexity: { insert: 'O(log n)', delete: 'O(log n)', search: 'O(log n)' },
  },
  minheap: {
    name: 'Min-Heap',
    complexity: { insert: 'O(log n)', delete: 'O(log n)', search: 'O(n)' },
  },
  maxheap: {
    name: 'Max-Heap',
    complexity: { insert: 'O(log n)', delete: 'O(log n)', search: 'O(n)' },
  },
};

export const NODE_STATE_COLORS: Record<NodeState, string> = {
  default: 'var(--color-default)',
  visiting: 'var(--color-visiting)',
  candidate: 'var(--color-candidate)',
  comparing: 'var(--color-comparing)',
  committed: 'var(--color-committed)',
  idle: 'var(--color-idle)',
};
