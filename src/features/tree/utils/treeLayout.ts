import { TreeNode } from '../../../types';

export interface LayoutNode extends TreeNode {
  x: number;
  y: number;
}

export function calculateTreeLayout(root: TreeNode | null, width: number): LayoutNode | null {
  if (!root) return null;

  const NODE_RADIUS = 30;
  const LEVEL_HEIGHT = 80;

  // Calculate tree depth
  const getDepth = (node: TreeNode | null | undefined): number => {
    if (!node) return 0;
    return 1 + Math.max(getDepth(node.left), getDepth(node.right));
  };

  const depth = getDepth(root);

  // Assign positions using inorder traversal
  let counter = 0;
  const nodeCount = Math.pow(2, depth) - 1;
  const horizontalSpacing = width / (nodeCount + 1);

  const assignPositions = (
    node: TreeNode | null | undefined,
    level: number
  ): LayoutNode | null => {
    if (!node) return null;

    const leftChild = assignPositions(node.left, level + 1);

    counter++;
    const layoutNode: LayoutNode = {
      ...node,
      x: counter * horizontalSpacing,
      y: level * LEVEL_HEIGHT + NODE_RADIUS + 20,
      left: leftChild || node.left,
      right: undefined,
    };

    const rightChild = assignPositions(node.right, level + 1);
    layoutNode.right = rightChild || node.right;

    return layoutNode;
  };

  return assignPositions(root, 0);
}

export function flattenTree(root: TreeNode | null): TreeNode[] {
  if (!root) return [];

  const result: TreeNode[] = [];
  const queue: TreeNode[] = [root];

  while (queue.length > 0) {
    const node = queue.shift()!;
    result.push(node);

    if (node.left) queue.push(node.left);
    if (node.right) queue.push(node.right);
  }

  return result;
}
