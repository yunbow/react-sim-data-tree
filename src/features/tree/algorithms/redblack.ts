import { TreeNode, TreeStep } from '../../../types';

interface RBNode extends TreeNode {
  color?: 'red' | 'black';
}

const RED = 'red';
const BLACK = 'black';

// Deep clone
function cloneNode(node: RBNode | null | undefined): RBNode | null {
  if (!node) return null;

  const cloned: RBNode = {
    id: node.id,
    value: node.value,
    state: node.state,
    color: node.color || BLACK,
  };

  if (node.left) {
    cloned.left = cloneNode(node.left as RBNode);
    if (cloned.left) cloned.left.parent = cloned;
  }

  if (node.right) {
    cloned.right = cloneNode(node.right as RBNode);
    if (cloned.right) cloned.right.parent = cloned;
  }

  return cloned;
}

function isRed(node: RBNode | null | undefined): boolean {
  return node !== null && node !== undefined && node.color === RED;
}

function rotateLeft(node: RBNode): RBNode {
  const rightChild = node.right as RBNode;
  node.right = rightChild.left;
  if (node.right) {
    (node.right as RBNode).parent = node;
  }
  rightChild.left = node;
  rightChild.color = node.color;
  node.color = RED;
  return rightChild;
}

function rotateRight(node: RBNode): RBNode {
  const leftChild = node.left as RBNode;
  node.left = leftChild.right;
  if (node.left) {
    (node.left as RBNode).parent = node;
  }
  leftChild.right = node;
  leftChild.color = node.color;
  node.color = RED;
  return leftChild;
}

function flipColors(node: RBNode): void {
  node.color = RED;
  if (node.left) (node.left as RBNode).color = BLACK;
  if (node.right) (node.right as RBNode).color = BLACK;
}

export function* redblackInsertSingle(existingRoot: TreeNode | null, value: number): Generator<TreeStep> {
  const root = cloneNode(existingRoot as RBNode);
  let operations = 0;

  const resetStates = (node: RBNode | null): void => {
    if (!node) return;
    node.state = 'default';
    resetStates(node.left as RBNode);
    resetStates(node.right as RBNode);
  };

  if (!root) {
    const newRoot: RBNode = {
      id: `node-${value}`,
      value,
      state: 'committed',
      color: BLACK,
    };
    yield {
      nodes: [newRoot],
      description: `ルートノードに ${value} を挿入（黒）`,
      operations: 1,
    };
    return;
  }

  resetStates(root);

  yield {
    nodes: [root],
    description: `赤黒木に ${value} を挿入中...`,
    operations,
  };

  function* insertNode(node: RBNode | null, val: number): Generator<[RBNode, TreeStep]> {
    if (!node) {
      operations++;
      const newNode: RBNode = {
        id: `node-${val}-${Date.now()}`,
        value: val,
        state: 'candidate',
        color: RED,
      };
      yield [
        newNode,
        {
          nodes: [root],
          description: `${val} を新しい赤ノードとして挿入`,
          operations,
        },
      ];
      return;
    }

    operations++;
    node.state = 'visiting';
    yield [
      node,
      {
        nodes: [root],
        description: `${val} と ${node.value} を比較中`,
        operations,
      },
    ];

    if (val < (node.value as number)) {
      node.state = 'default';
      const gen = insertNode(node.left as RBNode, val);
      let result = gen.next();
      while (!result.done) {
        const [newLeft, step] = result.value;
        node.left = newLeft;
        if (newLeft) newLeft.parent = node;
        yield [node, step];
        result = gen.next();
      }
    } else if (val > (node.value as number)) {
      node.state = 'default';
      const gen = insertNode(node.right as RBNode, val);
      let result = gen.next();
      while (!result.done) {
        const [newRight, step] = result.value;
        node.right = newRight;
        if (newRight) newRight.parent = node;
        yield [node, step];
        result = gen.next();
      }
    } else {
      node.state = 'default';
      yield [
        node,
        {
          nodes: [root],
          description: `${val} は既に存在します`,
          operations,
        },
      ];
      return;
    }

    // Fix Red-Black Tree properties
    // Case 1: Right child is red and left child is black -> rotate left
    if (isRed(node.right as RBNode) && !isRed(node.left as RBNode)) {
      operations++;
      yield [
        node,
        {
          nodes: [root],
          description: `右の子が赤で左の子が黒 → 左回転`,
          operations,
        },
      ];
      const rotated = rotateLeft(node);
      yield [rotated, { nodes: [root], description: `左回転完了`, operations }];
      node = rotated;
    }

    // Case 2: Left child and left-left grandchild are both red -> rotate right
    if (isRed(node.left as RBNode) && isRed((node.left as RBNode)?.left as RBNode)) {
      operations++;
      yield [
        node,
        {
          nodes: [root],
          description: `左の子と左-左の孫が両方赤 → 右回転`,
          operations,
        },
      ];
      const rotated = rotateRight(node);
      yield [rotated, { nodes: [root], description: `右回転完了`, operations }];
      node = rotated;
    }

    // Case 3: Both children are red -> flip colors
    if (isRed(node.left as RBNode) && isRed(node.right as RBNode)) {
      operations++;
      yield [
        node,
        {
          nodes: [root],
          description: `両方の子が赤 → 色を反転`,
          operations,
        },
      ];
      flipColors(node);
      yield [node, { nodes: [root], description: `色の反転完了`, operations }];
    }

    node.state = 'default';
    yield [node, { nodes: [root], description: `ノード更新完了`, operations }];
  }

  const generator = insertNode(root, value);
  let result = generator.next();
  let finalRoot = root;

  while (!result.done) {
    const [newRoot, step] = result.value;
    if (newRoot) {
      finalRoot = newRoot;
    }
    if (step) yield step;
    result = generator.next();
  }

  // Root must always be black
  if (finalRoot && finalRoot.color === RED) {
    finalRoot.color = BLACK;
    operations++;
    yield {
      nodes: [finalRoot],
      description: `ルートを黒に変更`,
      operations,
    };
  }

  resetStates(finalRoot);

  yield {
    nodes: [finalRoot],
    description: `挿入が完了しました（赤黒木の性質を満たしています）`,
    operations,
  };
}

export function* redblackInsert(values: number[]): Generator<TreeStep> {
  let root: RBNode | null = null;

  for (const value of values) {
    const generator = redblackInsertSingle(root, value);
    let result = generator.next();

    while (!result.done) {
      const step = result.value;
      if (step.nodes.length > 0) {
        root = step.nodes[0] as RBNode;
      }
      yield step;
      result = generator.next();
    }

    if (root) {
      root = cloneNode(root);
    }
  }
}
